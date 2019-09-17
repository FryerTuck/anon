<?
namespace Anon;

$export=function($a,$c,$h)
{
   if(!userDoes('sudo')){ekko(wack());}; $c=trim($c); if(!isText($c,1)){ekko('nothing to do');};

   if($a==='php')
   {
      $x=stub($c,['(','::']); if($x&&(is_funnic($x[0]))){$c=('$_RSL'." = $c");};
      if(substr($c,-1,1)!==';'){$c="$c;";}; $r=call(function($_CMD)
      {
         $_RSL=VOID; ob_start(); eval("namespace Anon;\n$_CMD"); if($_RSL!==VOID){ekko($_RSL);};
         $l=get_defined_vars(); $r=trim(ob_get_clean()); if(span($r)>0){ekko($r);}; unset($l['_CMD'],$l['_RSL']);
         if(span($l)<1){ekko(OK);}; ekko($l);
      },[$c]);
   };

   if($a==='sh')
   {
      $f=0; try{$r=exec::{"$c"}($h);}catch(\Exception $e){$f=1; $r=$e->getMessage();};
      if(!$r){$r=($f?FAIL:OK);}; ekko($r);
   };

   fail("command `$a` is not supported, yet");
};
