<?
namespace Anon;



# tool :: Anon : stem handler
# ---------------------------------------------------------------------------------------------------------------------------------------------
   class Anon
   {
      static $meta;


      static function vacuum($purl=null)
      {
          permit::fubu("clan:sudo,lead,gang,geek"); $post=knob($_POST);
          if(!$purl){$purl=$post->purl;}; expect::purl($purl);
      }


      static function deploy($purl=null,$vars=null)
      {
          permit::fubu("clan:sudo,lead,gang,geek"); $post=knob($_POST);
          if(!$purl){$purl=$post->purl; $vars=$post->vars;}; expect::purl($purl);

          $code = pget("$/Anon/base/deploy.php");
          $code = impose($code,'{:',':}',$vars);

          plug($purl)->delete
          ([
              erase => ['.htaccess','index.php'],
          ]);

          plug($purl)->insert
          ([
              "index.php"=>$code,
          ]);
      }
   }
# ---------------------------------------------------------------------------------------------------------------------------------------------
