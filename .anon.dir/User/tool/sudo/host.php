<?
namespace Anon;

$export=function($c,$a,$h)
{
   if(!userDoes('sudo')){ekko(wack());};  $a=trim(unwrap(trim($a)));
   if(!isText($a,1)){ekko('nothing to do');};

   if($c==='php')
   {
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
      $f=0; try{$r=exec::{"$a"}($h);}catch(\Exception $e){$f=1; $r=$e->getMessage();};
      if(!$r){$r=($f?FAIL:OK);}; ekko($r);
   };

   fail("command `$c` is not supported, yet");
};

// the end :)
