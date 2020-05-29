<?
namespace Anon;

# func :: upkeep : delete old temp-files .. create temp folders if undefined .. remove stale sessions, locks, refs, etc.
# ---------------------------------------------------------------------------------------------------------------------------------------------
   function upkeep($dbs,$ldb,$tmn)
   {
      $h='/Proc/temp'; $x=['file','kban','lock','logs','refs','sesn'];
      $cln=sesn('CLAN'); $hsh=sesn('HASH'); $usr=sesn('USER');

      foreach($x as $d)
      {
         if(!is_dir("$h/$d")){pset("$h/$d/"); usleep(10000);}; $l=pget("$h/$d/"); if(!is_array($l)||(count($l)<1)){continue;}; 
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
         if(!isee('/Proc/conf/hostName')){pset('/Proc/conf/hostName',HOSTNAME);};
         if(!path::indx('/')){path::copy('/Proc/dcor/README.md','/README.md');};
      };

      if(!isRepo('/')){repo::create('/'); wait(50);};

      $h='/.anon.dir'; $l=conf('Proc/gitIgnor'); unset($i);
      foreach($l as $i)
      {
         if((strlen($i)>1)&&(substr($i,0,2)==='# ')){continue;}; // commented out
         $c=substr($i,0,1); if($c==='!'){$i=substr($i,1);}else{$c='';}; // negation
         repo::ignore('/',write,($c.$h.$i));
      };
      unset($h,$l,$c,$i);

      path::make('/Proc/vars/lastDbug',$tmn);
   }
# ---------------------------------------------------------------------------------------------------------------------------------------------
