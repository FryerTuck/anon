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

      $b=(pget('$/Proc/conf/crawlers').$w.conf('Proc/badRobot')->lure); $l=pget('$'); foreach($l as $i){$b.="$w/$i/*";};
      if(isee('/robots.txt')){$c=pget('/robots.txt'); if($c){$b.="\n\n$c";};} // typical/classic bot config
      else{$c=path::conf('/'); if($c){$c=pica("$c/crawlers","$c/robots.txt");}; if($c){$c=pget($c);}; if($c){$b.="\n\n$c";};}; // for if root is stem

      $l=pget('/'); foreach($l as $i) // assemble crawler config from all stems
      {
         if(!isFold("/$i")){continue;};
         $c=path::conf("/$i"); if($c){$c=path::pick("$c/crawlers","$c/bots","$c/robots.txt","$c/bots.cfg");};
         if($c){$c=pget($c);}; if($c){$b.="\n\n$c";}
      };

      lock::awaits($p); pset($p,$b); lock::remove($p); return $b;
   }
# ---------------------------------------------------------------------------------------------------------------------------------------------




# tool :: permit : permission system
# ---------------------------------------------------------------------------------------------------------------------------------------------
   class permit
   {
   # func :: init : initialize firewall
   # ------------------------------------------------------------------------------------------------------------------------------------------
      private static $vars;

      static function init()
      {
      # cond :: init : protect the framework core and limit browsing freedom according to config
      # ---------------------------------------------------------------------------------------------------------------------------------------
         if(NAVIPATH===DBUGPATH)
         {
             if(facing("BOT API SSE")){finish(503);};
             done(import(DBUGPATH));
         }; // failing gracefully .. server vars available in dbug

         self::$vars=knob(['faceList'=>['API','BOT','DPR','GUI','SSE']]);

         if((getted('ANONREPOTEST')!==null)&&!userdoes('work,lead,sudo')){finish(403);};

         $s=test::{NAVIPATH}(conf('Proc/redirect')); // get redirect config for the current web URL
         if(is_int($s)&&($s!==200)){finish($s);}; // explicitly configured to echo status
         if($s&&!is_int($s)){finish($s);}; // explicitly configured to bypass any stem/module controllers

         $c=COREPATH; $s=shaved(NAVIPATH,'/'); if($s&&is_dir(path(COREPATH."/$s"))){finish(404);}; // deny core-stem-root access
         $s=explode('/',$s)[0]; if(($s==='~')&&!userDoes('work')){finish(404);};
         // if(!facing("GUI")&&$s&&($s!=='~')&&!isee("/$s")){finish(404);}; // stem not found .. no point in wasting any more resources

         unset($s,$c,$p,$i,$l,$x);
      # ---------------------------------------------------------------------------------------------------------------------------------------



      # cond :: bots : a nasty bot could spoof user-agent-string and misuse `Disallow` in `/robots.txt` .. let's not disappoint them .. for now
      # ---------------------------------------------------------------------------------------------------------------------------------------
         if(NAVIPATH==='/robots.txt')
         {
            $b=botRules(); // assemble and/or retrieve recent robots.txt
            $h=sha1(USERADDR.envi('USER_AGENT')); $p="/Proc/temp/bots/$h"; tref($h,9); // remember the bot that wanted this .. for a few secs
            if(!headers_sent()){header_remove();}; while(ob_get_level()){ob_end_clean();}; // remove any tosh
            header('HTTP/1.1 200 OK'); header('Content-Type: text/plain'); // send expected headers
            header('Expires: Jan 1999 23:59 GMT'); // don't cache, asking nicely
            print_r($b); flush(); done(); // serve assembled `robots.txt`
         };
      # ---------------------------------------------------------------------------------------------------------------------------------------



      # cond :: bots : if a bot violates our permissions, we serve them a mouthful of ... trash -or nothing .. edit this in badRobot config
      # ---------------------------------------------------------------------------------------------------------------------------------------
         if(tref(sha1(USERADDR.envi('USER_AGENT')))) // check if this is the bot that wanted the robots.txt a few seconds ago
         {
            $b=pget('$/Proc/temp/file/robots.txt'); $b.="\n"; $l=expose($b,'Disallow: ',"\n"); // get list of bot-forbidden paths
            foreach($l as $i){if(akin(NAVIPATH,rtrim($i,'$'))){kbot();};}; // really? - eat this! banned for conf/kbanSecs
            unset($b,$l,$i);
         };
      # ---------------------------------------------------------------------------------------------------------------------------------------



      # cond :: sesn : change the value of the boot cookie
      # ---------------------------------------------------------------------------------------------------------------------------------------
         if(facing('GUI')&&(NAVIPATH==='/Site/base/base.js')&&(kuki(sesn('HASH'))!=='...'))
         {
            $v='...'; kuki(sesn('HASH'),$v); $r=import(NAVIPATH); $m=mime(NAVIPATH);
            while(ob_get_level()){ob_end_clean();}; header("Content-Type: $m");
            echo($r); done();
         };
      # ---------------------------------------------------------------------------------------------------------------------------------------
      }
   # ------------------------------------------------------------------------------------------------------------------------------------------



   # func :: prep : used to prepare a permit method
   # ------------------------------------------------------------------------------------------------------------------------------------------
      private static function prep($a)
      {
         $a=args($a); $s=count($a); if(($s<1)||!is_string($a[0])){return;}; if($a[0]==='*'){return true;}; // quick validate
         if($s<2){$a=str_replace(' ','',$a[0]); $a=explode(',',$a);}; $r=[];
         foreach($a as $i){if(!is_string($i)||(strlen(trim($i))<1)){return;}; if(wrapOf($i)==='::'){$i=unwrap($i);}; $r[]=trim($i);};
         return $r;
      }
   # ------------------------------------------------------------------------------------------------------------------------------------------



   # func :: fubu : allow "THE REQUEST" only if it was "For US By Us" .. accepts strings as optional args
   # ------------------------------------------------------------------------------------------------------------------------------------------
      static function fubu()
      {
         if(!(MADEFUBU)){finish(403);}; $l=args(func_get_args()); if(count($l)<1){return true;}; $f=0; $r=false;

         foreach($l as $a)
         {
            if(!$a||!is_string($a)){continue;}; if(wrapOf($a)==='::'){$a=unwrap($a);};
            if(isin(self::$vars->faceList,$a)){$f=1; if(facing($a)){$r=true;};continue;}; $a=trim($a);
            if(!strpos($a,':')){continue;}; $a=str_replace(' ','',$a); $p=explode(':',$a); self::{"$p[0]"}($p[1]);
         };

         if($f&&!$r){finish(420);}; return true;
      }
   # ------------------------------------------------------------------------------------------------------------------------------------------



   # func :: face : allow interfaces .. e.g. permit::face('*'); .. or permit::face(API,BOT); .. or permit::face(API,BOT);
   # ------------------------------------------------------------------------------------------------------------------------------------------
      static function face()
      {
         $l=self::prep(func_get_args()); if(!$l||($l===true)){return $l;}; $r=false;
         foreach($l as $a){if(facing($a)){$r=true; break;}}; if($r){return $r;}; finish(420);
      }
   # ------------------------------------------------------------------------------------------------------------------------------------------



   # func :: clan : allow clans .. e.g. permit::clan('geek'); .. or permit::clan('geek,draw'); .. or permit::clan(['geek','draw']);
   # ------------------------------------------------------------------------------------------------------------------------------------------
      static function clan()
      {
         $l=self::prep(func_get_args()); if(!$l||($l===true)){return $l;}; $r=false; $c=sesn('CLAN');
         foreach($l as $a){if(isin($c,$a)){$r=true; break;}}; if($r){return $r;}; finish(403);
      }
   # ------------------------------------------------------------------------------------------------------------------------------------------



   # func :: rank : allow current user reputation that is equal or higher than a given number.. e.g. permit::rank(12);
   # ------------------------------------------------------------------------------------------------------------------------------------------
      static function rank($a=null)
      {
         if(!is_int($a)){return;}; $m=user('mail'); $p="/User/vars/vote/$m"; $r=pget($p); if(span($r)<1){path::make($p,'0'); $r='0';};
         $r=($r*1); if(($r>=$a)||isin(user('clan'),'sudo')){return true;}; finish(403);
      }
   # ------------------------------------------------------------------------------------------------------------------------------------------
   }
# ---------------------------------------------------------------------------------------------------------------------------------------------



   permit::init();
