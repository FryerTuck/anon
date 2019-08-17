<?
namespace Anon;



# tool :: Help : assistance
# ---------------------------------------------------------------------------------------------------------------------------------------------
   class Help
   {
      static $meta;


      static function treeMenu()
      {
todo("HelpDocs :: link up each Stem's README.md and `help` folder to global `Help` docs");
         $r=path::tree('/Help/data'); ekko($r);
      }


      static function openFile()
      {
Proc::signal('testing',['foo'=>123]);
         $v=knob($_POST); $p=$v->path; expect::path($p,[R,F]); $r=pget($p); ekko($r);
      }
   }
# ---------------------------------------------------------------------------------------------------------------------------------------------
