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
            if($usr==='anonymous'){continue;}; // if current user is anonymous
            $t=pget("$h/$d/$i/TIME"); if (!$t){ $t=info("$h/$d/$i/USER"); $t=$t->ctime; };
            $t=($t?($t*1):0); $dif=($tmn-$t);
            if(!$t||($dif<$dbs)){continue;}; // still active .. skip
            if($dif>($dbs+2)){void("$h/$d/$i");}; // stale sessions
            // if($i!==$hsh){continue;};
            if(!facing('GUI')){kuki($i,null); ekko::head(408,false);};
         };
      };


      $cfgMem = conf("Proc/autoConf")->memLimit;
      $iniMem = ini_get("memory_limit");

      if ($cfgMem !== $iniMem)
      {
          fail("`PHP.ini memory_limit` ($iniMem) is expected to be the same as `Proc/autoConf memLimit` .. ($cfgMem)");
          return;
      };

      if(facing('GUI'))
      {
         if(!pget('$/Proc/conf/hostName')){pset('$/Proc/conf/hostName',HOSTNAME);};
         // if(!path::indx('/')){path::copy('$/Site/dcor/README.md','/README.md');};
      };

      unset($ul,$un); $ul=pget('$/User/data'); foreach($ul as $un)
      {
          if(isee("$/User/data/$un/home")){continue;}; // home exists
          path::make("$/User/data/$un/home/");
          path::make("$/User/data/$un/home/Custom/");
          path::make("$/User/data/$un/home/Shared/");
      };

      if(conf("Proc/antiHack/stainLargeImages")&&!isee("$/Proc/vars/stainImg"))
      {path::make("$/Proc/vars/stainImg",1);} // for htaccess to let Anon handle it
      elseif(!conf("Proc/antiHack/stainLargeImages")&&isee("$/Proc/vars/stainImg"))
      {path::void("$/Proc/vars/stainImg");}; // for htaccess to ignore it

      if(lock::exists("upkeep")||!userDoes("lead sudo gang")){return;}; // .. less is more ;)
      lock::create("upkeep"); signal::dump("running upkeep"); wait(150);
      allStemRun("keep.php"); // run keep for all stems
      lock::remove("upkeep"); signal::dump("upkeep done"); wait(150);
   }
# ---------------------------------------------------------------------------------------------------------------------------------------------
