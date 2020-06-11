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
          $host = "https://$info->host";
          $addr = "$host/?pk=$hash";
          $plug = plug($purl);

          $plug->vivify();

          if(!$plug->link){$f=$plug->fail; if(!$f){$f="connection failure";}; fail::remoteDeploy($f); exit;};
          signal::busy(['with'=>'remoteDeploy','done'=>20]);

          $done = $plug->delete(['.htaccess','.anon.php','index.php','index.html']);
          if(!$done){fail::remoteDeploy('unable to delete remote auto-handler'); exit;};
          signal::busy(['with'=>'remoteDeploy','done'=>40]);

          $done = $plug->insert(['index.php'=>$code]);
          if(!$done){fail::remoteDeploy('unable to insert remote auto-handler'); exit;};
          signal::busy(['with'=>'remoteDeploy','done'=>50]);

          $done = spuf($addr,null,null,55);
//      spuf($uri,$uas=null,$ref=null,$tmo=12,$bin=0)
          if($done!==OK){fail::remoteDeploy("deployment failed\n\n$done"); exit;};

          $done = $plug->delete(['index.php']);
          signal::busy(['with'=>'remoteDeploy','done'=>60]);
          $done = spuf($host);

          if(isin($done,'503 Service Unavailable'))
          {
              $done = $plug->delete(['.htaccess']);
              signal::busy(['with'=>'remoteDeploy','done'=>70]);
              $plug->insert(['.htaccess'=>pget('$/Anon/base/access.cfg')]);
              signal::busy(['with'=>'remoteDeploy','done'=>80]);
              $done = spuf($host);
              ekko("\n\n----------ALT-BEGIN----------\n$done\n----------ALT-END----------\n\n");
          };

          signal::busy(['with'=>'remoteDeploy','done'=>100]);


          $plug->pacify();


          ekko("\n\n----------BEGIN----------\n$done\n----------END----------\n\n");


          signal::busy(['with'=>'remoteDeploy','done'=>90]);


          signal::busy(['with'=>'remoteDeploy','done'=>100]);

          return $addr;
      }
   }
# ---------------------------------------------------------------------------------------------------------------------------------------------
