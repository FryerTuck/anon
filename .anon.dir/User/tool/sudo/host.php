<?
namespace Anon;

$export=function($w,$c,$h)
{
   if(!userDoes('sudo')){ekko(wack());}; $c=trim($c); if(!isText($c,1)){ekko('nothing to do');};

   if($w==='php')
   {
      $c=trim($c); $x=stub($c,['(','::']); if($x&&(is_funnic($x[0]))){$c=('$_RSL'." = $c");};
      if(substr($c,-1,1)!==';'){$c="$c;";}; $r=call(function($_CMD)
      {
         $_RSL=VOID; ob_start(); eval("namespace Anon;\n$_CMD"); if($_RSL!==VOID){ekko($_RSL);};
         $l=get_defined_vars(); $r=trim(ob_get_clean()); if(span($r)>0){ekko($r);}; unset($l['_CMD'],$l['_RSL']);
         if(span($l)<1){ekko(OK);}; ekko($l);
      },[$c]);
   };

   if($w==='sh'){$r=exec::{"$c"}($h); ekko($r);};
   fail("command `$w` is not supported, yet");
};
