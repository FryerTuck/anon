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
          signal::busy(['with'=>'remoteDeploy','done'=>30]);

          $done = $plug->insert(['index.php'=>$code]);
          if(!$done){fail::remoteDeploy('unable to insert remote auto-handler'); exit;};
          $plug->pacify();
          signal::busy(['with'=>'remoteDeploy','done'=>40]);

          $done = spuf($host); wait(12000); // initialize
          signal::busy(['with'=>'remoteDeploy','done'=>60]);
          $done = spuf($host); // confirm
          signal::busy(['with'=>'remoteDeploy','done'=>80]);

          $chek = base64_encode(pget('$/Site/base/busy.htm'));
          if(!isin($done,$chek)){fail::remoteDeploy("response test was unsuccesful"); exit;};
          signal::busy(['with'=>'remoteDeploy','done'=>100]);
          return $addr;
      }



      static function checkUpdates()
      {
          $ln="checkUpdates"; $fg=isin(NAVIPATH,$ln); $gr=conf("Repo/gitRefer"); // lock-name .. from-gui .. git-refer
          if(lock::exists($ln)){if($fg){ekko(OK); exit;}; return OK;}; lock::awaits($ln); // lock to prevent multiple
          $su=Repo::differ('$/Repo/data/native/anon','origin',$gr->AnonBranch); // anon-diff

          if($su){$su->from="Anon";}else
          {$su=Repo::differ('$/Repo/data/native/site','origin',$gr->SiteBranch); if($su){$su->from="Site";}}; // site-diff
          lock::remove($ln); if(!$su){if($fg){ekko(OK); exit;}; return OK;}; // no diff .. remove lock & return OK

          if(!$fg){return $su;}; // not from-GUI so return data
          ekko($su); // for-GUI
      }
   }
# ---------------------------------------------------------------------------------------------------------------------------------------------
