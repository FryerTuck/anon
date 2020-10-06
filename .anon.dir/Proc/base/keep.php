<?
namespace Anon;



# func :: upkeep : delete old temp-files .. create temp folders if undefined .. remove stale sessions, locks, refs, etc.
# ---------------------------------------------------------------------------------------------------------------------------------------------
   function upkeep($dbs,$ldb,$tmn,$upk)
   {
      clearstatcache(); clearstatcache(true);

      if(!isee('$/Proc/vars/lastDbug')){pset('$/Proc/vars/lastDbug','0');};
      if(!isee('$/Proc/temp/lock')){pset('$/Proc/temp/lock/');};
      if(!isee("$/User/data/master/mail")){pset("$/User/data/master/mail",TECHMAIL);};
      depend('F:$/Site/base/dbug.htm','WF:$/Proc/vars/lastDbug','WF:$/User/conf/inactive','F:$/Proc/base/abec.php','F:$/Proc/base/base.php');

      $l=pget('$'); foreach($l as $i)
      {
         if(!file_exists(ROOTPATH."/$i")){continue;}; $a=strtolower($i);
         fail::ambiguity("`/$i` (proprCase) in your web-root folder is reserved\n- try using `/$a` (lowerCase) instead");
      };
      unset($l,$i,$a);

      $h='$/Proc/temp'; $x=['file','kban','lock','logs','refs','sesn'];
      $cln=sesn('CLAN'); $hsh=sesn('HASH'); $usr=sesn('USER');

      foreach($x as $d)
      {
         if(!isFold("$h/$d")){pset("$h/$d/"); usleep(10000);}; $l=pget("$h/$d/"); if(!is_array($l)||(count($l)<1)){continue;};
         foreach($l as $i)
         {
            if(aged("$h/$d/$i")<=($dbs+2)){continue;}; if($d!=='sesn'){void("$h/$d/$i"); continue;}; // non-session related
            if($usr==='anonymous'){continue;}; $t=(pget("$h/$d/$i/TIME")*1); $dif=($tmn-$t); if($dif<$dbs){continue;}; // still active .. skip
            if($dif>($dbs+2)){void("$h/$d/$i");}; // stale sessions
            if($i!==$hsh){continue;}; if(!facing('GUI')){kuki($x,null); ekko::head(408,false);};
         };
      };


      if(facing('GUI'))
      {
         $hn=pget('$/Proc/conf/hostName'); if(!$hn){pset('$/Proc/conf/hostName',HOSTNAME);};
         // if(!path::indx('/')){path::copy('$/Site/dcor/README.md','/README.md');};
      };

      if(lock::exists("upkeep")||!userDoes("lead sudo gang")){return;}; // .. less is more ;)
      lock::create("upkeep"); allStemRun("keep.php"); lock::remove("upkeep"); // lock upkeep and run keep for all stems
   }
# ---------------------------------------------------------------------------------------------------------------------------------------------
