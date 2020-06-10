<?
namespace Anon;



# tool :: Anon : stem handler
# ---------------------------------------------------------------------------------------------------------------------------------------------
   class Anon
   {
      static $meta;


      static function deploy($purl=null,$vars=null)
      {
          permit::fubu('clan:sudo,lead,gang,geek'); $post=knob($_POST);
          if(!$purl){$purl=$post->purl; $vars=$post->vars;}; expect::purl($purl);

          $code = impose(pget('$/Anon/base/deploy.php'),'{:',':}',$vars);
          $plug = plug($purl);

          $plug->delete(['.htaccess','index.php','index.html']);
          $plug->insert(['index.php'=>$code]);
      }
   }
# ---------------------------------------------------------------------------------------------------------------------------------------------
