<?
namespace Anon;



# tool :: Bill : assistance
# ---------------------------------------------------------------------------------------------------------------------------------------------
   class Bill
   {
      static $meta;


      static function __init()
      {
          if(!isee("$/Bill/data/template/")){path::make("$/Bill/data/template/");};

          $c=pget("$/Bill/conf/template");
          if(!isee("$/Bill/data/template/$c"))
          {
              path::copy("$/Bill/tmpl/dcor/$c/","$/Bill/data/tmpl/");
          };
      }


      static function makeFirm()
      {
      }
   }
# ---------------------------------------------------------------------------------------------------------------------------------------------
