<?
namespace Anon;


# info :: file : read this
# ---------------------------------------------------------------------------------------------------------------------------------------------
# this file is the framework firewall; it protects the framework core and it dynamically assembles the `robots.txt` file to tighten security
# it assembles the `robots.txt` file from all the config/bot'ish files inside the subdirectories -inside the docroot, making these portable
# here we are at "the pass", setting traps and guards to throw off and ban undesireable creatures who care nothing for our haven at the top
# ---------------------------------------------------------------------------------------------------------------------------------------------



# func :: botRules : robots.txt assembler .. caches the result for 10 seconds
# ---------------------------------------------------------------------------------------------------------------------------------------------
   function botRules()
   {
      $p='/Proc/temp/file/robots.txt'; $a=aged($p); if(!$a){$a=10;}; if($a<10){return pget($p);}; $w="\nDisallow: ";

      $b=(pget('/Proc/conf/crawlers').$w.conf('Proc/badRobot')->lure); $l=scan('$',FOLD); foreach($l as $i){$b.="$w/$i/*";};
      if(isee('/robots.txt')){$c=pget('/robots.txt'); if($c){$b.="\n\n$c";};} // typical/classic bot config
      else{$c=path::conf('/'); if($c){$c=pica("$c/crawlers","$c/robots.txt");}; if($c){$c=pget($c);}; if($c){$b.="\n\n$c";};}; // for if root is stem

      $l=scan('/',FOLD); foreach($l as $i) // assemble crawler config from all stems
      {
         $c=path::conf("/$i"); if($c){$c=path::pick("$c/crawlers","$c/bots","$c/robots.txt","$c/bots.cfg");};
         if($c){$c=pget($c);}; if($c){$b.="\n\n$c";}
      };

      lock::awaits($p); pset($p,$b); lock::remove($p); return $b;
   }
# ---------------------------------------------------------------------------------------------------------------------------------------------



# cond :: init : protect the framework core and limit browsing freedom according to config
# ---------------------------------------------------------------------------------------------------------------------------------------------
   $s=test::{NAVIPATH}(conf('Proc/redirect')); // get redirect config for the current web URL
   if(is_int($s)&&($s!==200)){finish($s);}; // explicitly configured to echo status
   if($s&&!is_int($s)){finish($s);}; // explicitly configured to bypass any stem/module controllers

   $c=COREPATH; $s=trim(NAVIPATH,'/'); if($s&&is_dir(path(COREPATH."/$s"))){finish(404);}; // deny core-stem-root access
   $s=explode('/',$s)[0]; if(($s==='~')&&!isin(user('clan'),'work')){finish(404);};
   if($s&&($s!=='~')&&!isee("/$s")){finish(404);}; // stem not found .. no point in wasting any more resources


   $p=isee(NAVIPATH); $i=(is_dir($p)?path::indx($p):null); $l=padded(scan('$'),'/'); $x=indx(NAVIPATH,$l);
   if(facing('BOT')&&($x!==null)){finish(403);}; // hide framework core from web-crawlers whom identify as bots
   if(is_dir($p)&&($i===null)&&!conf('Proc/viewDirs')){finish(403);}; unset($s,$c,$p,$i,$l,$x); // deny folder browsing if so configured
# ---------------------------------------------------------------------------------------------------------------------------------------------



# cond :: bots : a nasty bot should hide as fake user-agent and misuse `Disallow` in `/robots.txt` .. let's not disappoint them .. for now
# ---------------------------------------------------------------------------------------------------------------------------------------------
   if(NAVIPATH==='/robots.txt')
   {
      $b=botRules(); // assemble and/or retrieve recent robots.txt
      $h=sha1(USERADDR.envi('USER_AGENT')); $p="/Proc/temp/bots/$h"; tref($h,9); // remember the bot that wanted this .. for a few seconds ...
      if(!headers_sent()){header_remove();}; while(ob_get_level()){ob_end_clean();}; // remove any tosh
      header('HTTP/1.1 200 OK'); header('Content-Type: text/plain'); // send expected headers
      header('Expires: Jan 1999 23:59 GMT'); // don't cache, asking nicely
      print_r($b); flush(); die(); // serve assembled `robots.txt`
   };
# ---------------------------------------------------------------------------------------------------------------------------------------------


# cond :: bots : if a bot violates our permissions, we serve them a mouthful of ... trash -or nothing .. you can edit this in badRobot config
# ---------------------------------------------------------------------------------------------------------------------------------------------
   if(tref(sha1(USERADDR.envi('USER_AGENT')))) // check if this is the bot that wanted the robots.txt a few seconds ago
   {
      $b=pget('/Proc/temp/file/robots.txt'); $b.="\n"; $l=expose($b,'Disallow: ',"\n"); // get list of bot-forbidden paths
      foreach($l as $i){if(akin(NAVIPATH,rtrim($i,'$'))){kbot();};}; // really? - eat this! .. and stay out! .. for conf/kbanSecs they get 503
   };
# ---------------------------------------------------------------------------------------------------------------------------------------------
