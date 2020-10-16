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
          $code = impose($code,'(~','~)',$vars);
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
          $im="ignored `$ln` .."; if(lock::exists($ln)){signal::dump("$im another process locked it"); return OK;};
          if(siteLocked()){signal::dump("$im AnonSystemLock is active"); return OK;};
          if(!isRepo('$/Repo/data/native/fuse')){signal::dump("$im the fuse-repo is not defined yet"); return OK;};
          if(!isRepo('$/Repo/data/native/anon')){signal::dump("$im the anon-repo is not defined yet"); return OK;}; // race
          if(!isPlug(pget('$/Proc/conf/autoMail'))){signal::dump("$im `autoMail` is not defined yet"); return OK;};

          lock::awaits($ln); // lock it!

          $su=Repo::differ('$/Repo/data/native/anon','origin',$gr->AnonBranch); // anon-diff
          if($su){$su->from="Anon"; lock::remove($ln); return $su;}; // run Anon updates first, if any

          if(!isPlug($gr->SiteOrigin)){lock::remove($ln); signal::dump("$im the site-repo has no origin yet"); return OK;}; // nothing to do
          if(!isRepo('$/Repo/data/native/site')){lock::remove($ln); signal::dump("$im the site-repo is not defined yet"); return OK;}; // race
          $su=Repo::differ('$/Repo/data/native/site','origin',$gr->SiteBranch); // site-diff
          if($su){$su->from="Site"; lock::remove($ln); return $su;}; // run Site updates last, if any

          return OK; // all is well
      }
   }
# ---------------------------------------------------------------------------------------------------------------------------------------------
