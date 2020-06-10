<?
namespace Anon;



# tool :: Anon : stem handler
# ---------------------------------------------------------------------------------------------------------------------------------------------
   class Anon
   {
      static $meta;


      static function remoteDeploy($purl=null,$vars=null)
      {
          permit::fubu('clan:sudo,lead,gang,geek'); $post=knob($_POST);
          if(!$purl){$purl=$post->purl; $vars=$post->vars;};
          expect::purl($purl); $info=path::info($purl); $addr="https://$info->host";

          $code = impose(pget('$/Anon/base/deploy.php'),'{:',':}',$vars);
          $plug = plug($purl);  $plug->vivify();

          if(!$plug->link){$f=$plug->fail; if(!$f){$f="connection failure";}; fail::remoteDeploy($f); exit;};
          signal::busy(['with'=>'remoteDeploy','done'=>10]);

          $done = $plug->delete(['.htaccess','index.php','index.html']);
          if(!$done){fail::remoteDeploy('unable to delete remote auto-handler'); exit;};
          signal::busy(['with'=>'remoteDeploy','done'=>20]);

          $done = $plug->insert(['index.php'=>$code]);
          if(!$done){fail::remoteDeploy('unable to insert remote auto-handler'); exit;};
          signal::busy(['with'=>'remoteDeploy','done'=>20]);

          return $addr;
      }
   }
# ---------------------------------------------------------------------------------------------------------------------------------------------
