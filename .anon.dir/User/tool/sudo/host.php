<?
namespace Anon;

$export=function($c,$a,$h)
{
   if(!userDoes('sudo')){ekko(wack());};  // security!! yelp!!
   if(isText($a)){$a=trim(unwrap(trim($a)));};



   if($c==='php')
   {
      if(!isText($a,1)){ekko('nothing to do');};
      $x=stub($a,['(','::']); if($x&&(is_funnic($x[0]))){$a=('$_RSL'." = $a");};
      if(substr($a,-1,1)!==';'){$a="$a;";};
      $r=call(function($_CMD)
      {
         $_RSL=VOID; ob_start(); eval("namespace Anon;\n$_CMD"); if($_RSL!==VOID){ekko($_RSL); exit;};
         $l=get_defined_vars(); $r=trim(ob_get_clean()); if(span($r)>0){ekko($r); exit;};
         unset($l['_CMD'],$l['_RSL']); if(span($l)<1){ekko(OK);}; ekko($l);
      },[$a]);
   };



   if($c==='sh')
   {
      if(!isText($a,1)){ekko('nothing to do');};
      $f=0; try{$r=exec::{"$a"}($h);}catch(\Exception $e){$f=1; $r=$e->getMessage();};
      if(!$r){$r=($f?FAIL:OK);}; ekko($r);
   };



   if($c==='purge')
   {
       if($a==='data')
       {
           siteLocked(true);

           signal::dump("removing all users"); wait(150);
           $ul=array_diff(pget("$/User/data"),["anonymous","master"]);
           foreach($ul as $un){path::void("$/User/data/$un");};
           signal::dump("all users removed"); wait(150);

           signal::dump("removing all repositories"); wait(150);
           path::void("$/Repo/data/native");
           path::void("$/Repo/data/remote");
           path::make("$/Repo/data/native/");
           path::make("$/Repo/data/remote/");
           signal::dump("all repositories removed"); wait(150);

           // TODO :: also remove all .sdb files from all stems

           siteLocked(false);
           return OK;
       };


       if($a==='anon')
       {
           siteLocked(true);
           signal::dump("purging Anon from .htaccess"); wait(150);
           $ht=pget("/.htaccess"); $ht=stub($ht,'# ((̲̅ ̲̅(̲̅C̲̅r̲̅a̲̅y̲̅o̲̅l̲̲̅̅a̲̅( ̲̅((>');
           $ht=rpop($ht); $ht=trim($ht); path::make("/.htaccess",$ht);
           signal::dump("copying deploy.php"); wait(150);
           path::copy("$/Anon/base/deploy.php","/deploy.php");
           signal::href(NAVIHOST."/deploy.php");
           return OK;
       };


       fail("invalid purge command .. use `data` or `anon`");
   };



   if($c==='upkeep')
   {
        if(isFunc('upkeep')){return "upkeep ran a few seconds ago, try again if you really want to";};
        require(path('$/Proc/base/keep.php'));
        upkeep($_SERVER['SYSCLOCK']->upkeep,1,time(),knob($_GET)->upkeep);
        path::make('$/Proc/vars/lastDbug',(time().''));
        return OK;
   };



   fail("command `$c` is not supported, yet");
};

// the end :)
