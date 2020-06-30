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
         // if(!path::indx('/')){path::copy('/Proc/dcor/README.md','/README.md');};
      };


     if(isset($_GET['upkeep'])&&(trim($_GET['upkeep'])==='init'))
     {
         die("test 2");
         // if(!isset($_GET['rf'])||!isset($_GET['rk'])){wack(); exit;}; // security
         // $rf=$_GET['rf']; $rp="/$rf"; $rk=$_GET['rk']; $fc=pget($rp,0); $rh=sha1($fc);
         // if(!isin($fc,'$ck = \'{:ck:}\'')||($rh!==$rk)){wack(); exit;}; // security
         // $mp=password_hash(pget("$/Proc/info/pass.inf"),PASSWORD_DEFAULT);
         // pset("$/User/data/master/pass",$mp); $nh=NAVIHOST; void($rp); wait(500);
         // header("Location: $nh"); exit;
     };


      if(lock::exists("upkeep")&&!userDoes("lead sudo gang")&&isee("$h/refs")){return;}; // .. less is more
      lock::create("upkeep"); // run upkeep only when another power-user is not running it already

      if(!isRepo('/'))
      {Repo::create('/'); wait(50);}
      else
      {
          $fa=conf('Repo/fromAnon'); $lo=Repo::origin('/');
          $lr=path("$/Repo/data/".HOSTNAME.".git");
          if(!isee($lr)){Repo::create('/',BARE);};

          if($lo===$fa)
          {
              exec::{"git remote rename origin fromAnon"}('/');
              exec::{"git remote add origin $lr"}('/');
          }
          else
          {
              $ao=Repo::getURL('/','fromAnon');
              if(!$ao){exec::{"git remote set-url fromAnon $fa"}('/');};
          };
      };

      if(userDoes("sudo lead gang"))
      {
          $d=Repo::differ(); if($d){signal::AnonUpdate($d);};
      };

      $h=ROOTPATH; $l=conf('Proc/gitIgnor'); unset($i);
      foreach($l as $i)
      {
         if(strlen(trim($i))<1){continue;}; // empty line
         if(substr($i,0,2)==='# '){continue;}; // commented out
         $c=substr($i,0,1); if($c==='!'){$i=substr($i,1);}else{$c='';}; // negation
         $a=''; if(last($i)==='*'){$a='*';}; $p=path(rshave($i,'*'));
         $p=swap($p,"$h/",''); $p.=$a;
         Repo::ignore('/',write,($c.$p));
      };


      path::make('/Proc/vars/lastDbug',$tmn);
      lock::remove("upkeep");
   }
# ---------------------------------------------------------------------------------------------------------------------------------------------
