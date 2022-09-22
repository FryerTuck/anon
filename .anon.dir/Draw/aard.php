<?
namespace Anon;



# tool :: Draw : assistance
# ---------------------------------------------------------------------------------------------------------------------------------------------
   class Draw
   {
      static $meta;


      static function __init()
      {
         if(!isin(NAVIPATH,'/Draw/getTools.js')){return;}; $h='/Draw/tool'; $l=pget($h);
         $r="\"use strict\";\n\n"; foreach($l as $i){$s=pget("$h/$i"); $r.="$s\n\n\n";};
         ekko::head(['Content-Type'=>mime('js')]); echo $r; done();
      }


      static function treeMenu()
      {
      }


      static function scanFold()
      {
         $v=knob($_POST); $d=$v->path; $x=xeno::showHyperConduit($d);
         if(!$x){$l=pget($d);}else{$l=Proc::scanPlug($d);};

         if(!isList($l)){done('[]');}; $r=[];

         foreach($l as $i)
         {$p=crop("$d/$i"); $m=mime($p); if(isin($m,['image','font'])){$r[]=$p;};};

         dump($r);
      }


      static function loadFile()
      {
         $v=knob($_POST); $p=$v->path; $x=xeno::showHyperConduit($p);

         if(!$x){ekko(durl($p));};

         $r=crud($x)->select('*'); $m=mime($p);
         ekko("data:$m;base64,".base64_encode($r));
      }


      static function saveFile()
      {
         $v=knob($_POST); $p=$v->path; $b=furl($v->bufr)->data; expect::path($p); path::make($p,$b); ekko(OK);
      }
   }
# ---------------------------------------------------------------------------------------------------------------------------------------------
