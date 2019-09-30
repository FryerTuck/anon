<?
namespace Anon;



# tool :: Navi : navigate
# ---------------------------------------------------------------------------------------------------------------------------------------------
   class Navi
   {
      static $meta;


      static function __init()
      {
         if(!isin(NAVIPATH,'/Navi/getTools.js')){return;}; $h='/Navi/tool'; $l=pget($h);
         $r="\"use strict\";\n\n"; foreach($l as $i){$s=pget("$h/$i/aard.js"); $r.="$s\n\n\n";};
         ekko::head(['Content-Type'=>mime('js')]); echo $r; done();
      }
   }
# ---------------------------------------------------------------------------------------------------------------------------------------------
