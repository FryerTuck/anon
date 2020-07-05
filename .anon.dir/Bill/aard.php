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

          $t=conf("Bill/autoConf")->template;
          if(!isee("$/Bill/data/template/$t"))
          {
              if(!isee("$/Bill/tmpl/dcor/$t")){fail::template("Bill template `$t` is undefined"); exit;};
              path::copy("$/Bill/tmpl/dcor/$t","$/Bill/data/template/");
          };
      }


      static function makeFirm()
      {
      }
   }
# ---------------------------------------------------------------------------------------------------------------------------------------------
