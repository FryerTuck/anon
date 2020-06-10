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
          if(!$purl){$purl=$post->purl; $vars=$post->vars;}; if(!isKnob($vars)){$vars=knob();};
          expect::purl($purl); $info=path::info($purl);
          signal::busy(['with'=>'remoteDeploy','done'=>10]);

          $code = pget('$/Anon/base/deploy.php');
          $hash = sha1(encode::b64($code.PROCHASH)); $vars->ck=$hash; // crack this b!tch .. i can do better .. time is short
          $code = impose($code,'{:',':}',$vars);
          $addr = "https://$info->host/?pk=$hash";
          $plug = plug($purl);

          $plug->vivify();

          if(!$plug->link){$f=$plug->fail; if(!$f){$f="connection failure";}; fail::remoteDeploy($f); exit;};
          signal::busy(['with'=>'remoteDeploy','done'=>20]);

          $done = $plug->delete(['.htaccess','.anon.php','index.php','index.html']);
          if(!$done){fail::remoteDeploy('unable to delete remote auto-handler'); exit;};
          signal::busy(['with'=>'remoteDeploy','done'=>40]);

          $done = $plug->insert(['index.php'=>$code]);
          if(!$done){fail::remoteDeploy('unable to insert remote auto-handler'); exit;};
          signal::busy(['with'=>'remoteDeploy','done'=>60]);
          $done = $plug->delete(['index.php']);
          signal::busy(['with'=>'remoteDeploy','done'=>80]);

          $plug->pacify();

          $done = spuf($addr);
          if($done!==OK){fail::remoteDeploy("deployment failed\n\n$done"); exit;};
          signal::busy(['with'=>'remoteDeploy','done'=>100]);

          return $addr;
      }
   }
# ---------------------------------------------------------------------------------------------------------------------------------------------
