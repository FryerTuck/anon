<?
namespace Anon;



$export=function($a,$c,$d)
{
   $h='/User/clan';


   if($a==='list')
   {
      $l=pget($h); if($c!=='-v'){$r=fuse($l,' '); return $r;};
      $r=''; foreach($l as $i){$r.=("$i\n- ".pget("$h/$i")."\n\n");};
      return $r;
   };


   if(!isWord($c,4)){ekko("invalid clan name `$c`");};

   ekko("clan command `$a` has not been developed .. yet");
};
