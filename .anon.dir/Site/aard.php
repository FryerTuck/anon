<?
namespace Anon;



# tool :: Site : web-facing GUI
# ---------------------------------------------------------------------------------------------------------------------------------------------
   class Site
   {
      static $meta;

      static function __init()
      {
         $ac=conf('Site/autoConf'); $cp=conf('Site/clanPath'); $cc=sesn('CLAN'); $np=NAVIPATH; $un=sesn('USER');

         if($cp->$cc){finish($cp->$cc); exit;}; // serve for specified clans explicitly
         // ekko("Hello $un");
      }
   }
# ---------------------------------------------------------------------------------------------------------------------------------------------
