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
         $u=user('name'); $h="/User/data/$u/home";
         if(!isee("$h/root")){$b=conf('Code/forkName'); if(!is_funnic($b)){fail("invalid branch name");}; repo::cloned('/',"$h/root",$b);};
         $r=path::tree($h); dump($r);
      }


      static function loadFile()
      {
         $v=knob($_POST); ekko(durl($v->path));
      }


      static function saveFile()
      {
         $v=knob($_POST); $p=$v->path; $b=furl($v->bufr)->data; expect::path($p); path::make($p,$b); ekko(OK);
      }
   }
# ---------------------------------------------------------------------------------------------------------------------------------------------
