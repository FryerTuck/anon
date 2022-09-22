<?
namespace Anon;


# info :: file : read this
# ---------------------------------------------------------------------------------------------------------------------------------------------
# this file is the framework bootstrapper; it assembles expected functionality and initializes the error-handler and auto-loader
# it also serves interfaces directly if no further processing is required, but we need some basic tools and info before we can handle anything
# here we are in "the woods" .. we have syntactical freedom and less scary things to deal with, but we need to get out of here, it's not safe
# ---------------------------------------------------------------------------------------------------------------------------------------------



# refs :: constants : short-hand references to values that are frequently used
# ---------------------------------------------------------------------------------------------------------------------------------------------
   $p=envi('URL'); $b=envi('BASEPATH'); if($b!=='/'){$p=lshave($p,$b);}; if(!$p){$p='/';};
   defn
   ([
      'ROOTPATH' => envi('ROOTPATH'),
      'COREPATH' => envi('COREPATH'),
      'USERPATH' => str_replace(envi('COREPATH'),'',envi('USERPATH')),
      'TECHMAIL' => envi('TECHMAIL'),
      'USERADDR' => envi('CLIENT_ADDR'),
      'USERMIME' => envi('ACCEPT'),
      'PROTOCOL' => envi('SCHEME'),
      'NAVIHOST' => (envi('SCHEME').'://'.envi('HOST')),
      'NAVIFURI' => (envi('SCHEME').'://'.envi('HOST').envi('URI')),
      'DBUGPATH' => envi('DBUGPATH'),
      'BOOTTIME' => envi('TIME_FLOAT'),
      'HOSTADDR' => envi('SERVER_ADDR'),
      'USERDEED' => envi('USERDEED'),
      'NAVIPURL' => envi('URI'),
      'BASEPATH' => envi('BASEPATH'),
      'MADEFUBU' => envi('MADEFUBU'),
   ]);

   defn(['PROCHASH'=>sha1(random(6).microtime(true).USERADDR.getmypid().random(6))]); // this is unique .. any doubts?
   $s=trim(NAVIPATH,'/'); if(!$s){$s='/';}elseif(strpos($s,'/')){$s=explode('/',$s)[0];}; defn(['NAVISTEM'=>$s]); unset($s);
   defn(['EXPROPER'=>'!= !~ >= <= << >> /* */ // ## : = ~ < > & | ! ? + - * / % ^ @ . , ; # ( ) [ ] { } `']);
   defn(['SPECIALS'=>'_^~|.-*+=#$@$!%?:;&/']);
   defn(['AUTOMAIL'=>pget('$/Proc/conf/autoMail')]); // needed

   $cd=COREPATH; $rd=ROOTPATH; $cl=pget($cd); $rl=pget($rd); $sl=[C=>[],R=>[],A=>[]];
   foreach($cl as $cs){if(is_funnic($cs)&&isProprCase($cs)){$sl[C][]="$/$cs"; $sl[A][]="$/$cs";}};
   foreach($rl as $rs){if(is_funnic($rs)&&isProprCase($rs)){$sl[R][]="/$rs"; $sl[A][]="/$rs";}};
   $_SERVER['STEMLIST']=$sl; unset($cd,$rd,$cl,$rl,$sl,$cs,$rs);
# ---------------------------------------------------------------------------------------------------------------------------------------------



# cond :: RECEIVER : check if an alternative handler is defined .. best attempt .. `nona` = "non-anon"
# ---------------------------------------------------------------------------------------------------------------------------------------------
   $ah=kuki("RECEIVER"); if(!$ah&&isee("/index.php")){$ah='nona';}else
   {
       $ht=explode('# ((̲̅ ̲̅(̲̅C̲̅r̲̅a̲̅y̲̅o̲̅l̲̲̅̅a̲̅( ̲̅((>',pget('/.htaccess')); $ht=array_pop($ht);
       $tl=['^(.*)$','(.*)','^.*$','.*','.','^']; $ht=explode("\n",$ht); foreach($ht as $hl)
       {
           if($ah){break;}; $hl=trim($hl);
           if((strlen($hl)<1)||($hl[0]==='#')||(strpos($hl,'RewriteRule')===false)){continue;};
           foreach($tl as $ti){if(strpos($hl,"RewriteRule $ti ")!==false){$ah='nona'; break;}};
       };
   };
   $_SERVER["RECEIVER"]=($ah?$ah:'anon'); unset($ah,$ht,$tl,$hl,$ti);
# ---------------------------------------------------------------------------------------------------------------------------------------------



# func :: stemList : returns the Stem-list associated with given argument
# ---------------------------------------------------------------------------------------------------------------------------------------------
   function stemList($a=null)
   {
       $d=((!$a||!is_string($a)||($a==='*'))?A:(($a==='$')?C:(($a==='/')?R:$a)));
       if(!isset($_SERVER['STEMLIST'][$d])){return;}; // validate
       return array_values($_SERVER['STEMLIST'][$d]); // return a copy
   }
# ---------------------------------------------------------------------------------------------------------------------------------------------



# func :: twig : returns the folder-path of the last item in a path
# ---------------------------------------------------------------------------------------------------------------------------------------------
   function twig($p)
   {
      if(!path($p)){return;}; $l=trim($p,'/'); if(!strpos($l,'/')){return '/';}; $l=explode('/',$l);
      array_pop($l); $r=implode('/',$l); return ((($p[0]=='~')||($p[0]=='$'))?$r:"/$r");
   }
# ---------------------------------------------------------------------------------------------------------------------------------------------



# func :: dump : used for quick plain text response .. respects interface, won't show anything to crawlers
# ---------------------------------------------------------------------------------------------------------------------------------------------
   function dump()
   {
      if(!headers_sent()){header_remove();}; while(ob_get_level()){ob_end_clean();};
      if(facing('BOT')||facing('SYS')){if(!headers_sent()){header('HTTP/1.1 503 Service Unavailable');}; die();}; // crawler

      if(facing('SSE'))
      {
          $r=[]; $l=func_get_args(); foreach($l as $i){$r[]=tval($i,DUMP);};
          if(!envi('SSEREADY')){$r=tval($r); done("BOOT FAIL!! :: dump() called in SSE before Proc was ready.\n\n$r");return;};
          defn(['HALT'=>1]); Proc::emit('dump',$r); return;
      };

      if(!headers_sent()){header('HTTP/1.1 200 OK');};
      // if(facing('GUI')){sesn('USER');};

      if(envi('ACCEPT')==='application/json')
      {
         $r=[]; $l=func_get_args(); foreach($l as $i){$r[]=tval($i,DUMP);};
         if(!headers_sent()){header('Content-Type: application/json');};
         if((strpos($r,'data:')!==0)&&(strpos($r,';base64,')!==false)){$r=base64_encode($r); $r="data:text/plain;base64,$r";};
         $r=json_encode(knob(['name'=>'dump','data'=>$r])); print_r(tval($r)); flush(); die();
      };

      if(facing('DPR')&&(fext(NAVIPATH)==='js'))
      {
         $r=[]; $l=func_get_args();
         foreach($l as $i){if(is_string($i)){$i=((strlen($i)<1)?`""`:("`".str_replace("`","\`",$i)."`"));}; $r[]=tval($i,DUMP);};
         if(!headers_sent()){header('Content-Type: application/javascript'); flush();};
         $r=implode(',',$r); print_r("dump($r);");
      };

      if(!headers_sent()){header('Content-Type: text/plain');};
      $r=[]; $l=func_get_args(); foreach($l as $i){$r[]=tval($i,DUMP);};
      $r=implode("\n------------\n",$r); print_r($r); flush(); die(); // DPR, GUI, API:text/plain
   }
# ---------------------------------------------------------------------------------------------------------------------------------------------



# func :: info : lstat & stat
# ---------------------------------------------------------------------------------------------------------------------------------------------
   function info($p)
   {
      if(!is_string($p)){return;}; $p=isee($p); if(!$p){return;};
      $fh = defail();
        $s=(is_link($p)?lstat($p):stat($p));
      $fm = enfail($fh);
      clearstatcache(true); if(!$s){return;}; $r=knob($s);

      if(!$r->ctime){$r->ctime=($r->mtime?$r->mtime:0);}; if(!$r->mtime){$r->mtime=$r->ctime;};
      return $r;
   }
# ---------------------------------------------------------------------------------------------------------------------------------------------



# func :: aged : get age of path in seconds .. return int -or null if invalid path
# ---------------------------------------------------------------------------------------------------------------------------------------------
   function aged($p)
   {
      clearstatcache();
      $s=info($p); if(!$s){return;}; $t=$s->ctime; if(!is_number($t)){return;};
      $n=time(); $r=($n-$t); clearstatcache(true); return $r;
   }
# ---------------------------------------------------------------------------------------------------------------------------------------------



# func :: void : delete path - also deletes folder with contents .. be careful
# ---------------------------------------------------------------------------------------------------------------------------------------------
   function void($p)
   {
      $p=isee($p); if(!$p){return;}; $c=COREPATH; $r=ROOTPATH; if(($p===$c)||($p===$r)||($p===("$c/Proc"))||($p===("$c/User"))){return;};
      $h=twig($p); $l=explode('/',$p); $l=array_pop($l); try{exec::{"chmod -R +w ./$l && rm -rf ./$l"}($h);}catch(\Exception $e){};
      return (!isee($p));
   }
# ---------------------------------------------------------------------------------------------------------------------------------------------



# func :: tref : temporary reference that expires in seconds .. $h is hash .. if $x is null -it gets ref life, else if $x is int it sets ref
# ---------------------------------------------------------------------------------------------------------------------------------------------
   function tref($h,$x=null)
   {
      if(!test($h,'/^[a-z0-9]{40,64}$/')){return;}; $p=path("$/Proc/temp/refs/$h"); $e=null; if(is_link($p)){$e=(readlink($p)*1);};
      if($e){$a=aged($p); if($a>=$e){unlink($p);return;}; return ($e-$a);}; if(!$x||($x<1)){return;};
      lock::create($p); $m=umask(); umask(0); symlink("$x",$p); umask($m); lock::remove($p); return true;
   };
# ---------------------------------------------------------------------------------------------------------------------------------------------



# tool :: lock
# ---------------------------------------------------------------------------------------------------------------------------------------------
   class lock
   {
      private static $max;
      private static $dir;


      static function init()
      {
         self::$max=((ini_get('max_execution_time')*1)-5); $p=path('$/Proc/temp/lock'); self::$dir=$p;
      }


      static function exists($p,$x=null)
      {
         if(!is_string($p)){return;}; $d=self::$dir; $h=sha1($p); $p="$d/$h"; clearstatcache();
         if(!file_exists($p)){clearstatcache(true); return false;}; if(!is_int($x)){$x=self::$max;};
         $a=aged($p); if($a<$x){return true;}; if(!file_exists($p)){return false;};
         try{$h=defail(); unlink($p); $b=enfail($h);}catch(\Exception $e){return false;}; return false;
      }


      static function create($p,$h=null)
      {
         if(!$h){if(!is_string($p)){return;}; if(self::exists($p)){return false;}; $h=sha1($p); $d=self::$dir; $p="$d/$h";}
         $m=umask(); umask(0); file_put_contents($p,PROCHASH); umask($m); return true;
      }


      static function awaits($p,$m=true)
      {
         if(!is_string($p)){return;}; $h=sha1($p); $d=self::$dir; $t="$d/$h";
         while(self::exists($p)){wait(1);}; $r=false; if($m){$r=self::create($t,1);}; return $r;
      }


      static function remove($p)
      {
         if(!is_string($p)){return;}; $d=self::$dir; $h=sha1($p); $p="$d/$h"; clearstatcache();
         if(!file_exists($p)){clearstatcache(true); return true;}; $d=file_get_contents($p); clearstatcache(true);
         if($d===PROCHASH){unlink($p); clearstatcache(true); return true;}; return false;
      }
   }

   lock::init();
# ---------------------------------------------------------------------------------------------------------------------------------------------



# func :: sesn : get/set session info .. if session is undefined, a new anonymous session is created .. string gets item .. assoc array sets
# ---------------------------------------------------------------------------------------------------------------------------------------------
   function sesn($a=null)
   {
      $h=envi('SESNHASH'); $u=envi('SESNUSER'); $c=envi('SESNCLAN');
      if(($a==='HASH')&&$h){return $h;}; if(($a==='USER')&&$u){return $u;}; if(($a==='CLAN')&&$c){return $c;};
      $d="/Proc/temp/sesn"; $t=time();
      if($h){$p="$d/$h";} // current session
      else // new -r resume session
      {
         $l=pget($d); if(count($l)>9999){header('HTTP/1.1 429 Too Many Sessions'); done();};
         $h=skey(); $ns=0; if(!$h){$ns=1; $h=mksesn('anonymous');};
         $p="$d/$h"; if(!isee($p)){pset("$p/USER",'anonymous');}; $u=pget("$p/USER"); $c=pget("/User/data/$u/clan");
         $i=envi('INTRFACE'); $_SERVER['SESNHASH']=$h; $_SERVER['SESNUSER']=$u; $_SERVER['SESNCLAN']=$c;
         if(($u!=='anonymous')&&($i!=='SSE')&&($i!=='DPR'))
         {$o=pget("$p/TIME"); if(!$o){$o=$t;}; $y=($t-$o); pset("$p/TIME",$t); if(!$ns){pset("$p/BSEC",$y);}};
      };

      if(is_string($a)){$a=trim($a); if(strlen($a)<1){$a=null;}}elseif(is_assoc_array($a)){$a=knob($a);};
      if($a===null){$r=knob($p); $r->CLAN=$c; return $r;}; // get all data
      if(!is_string($a)&&!is_array($a)&&!is_object($a)){return;}; // invalid -return nothing
      if(is_string($a)){return (($a==='HASH')?$h:(($a==='USER')?$u:(($a==='CLAN')?$c:pget("$p/$a"))));}; // get session item-value by name

      foreach($a as $k => $v){lock::awaits("$p/$k"); pset("$p/$k",$v); lock::remove("$p/$k");}; // set session item(s)
   }
# ---------------------------------------------------------------------------------------------------------------------------------------------



# func :: user : get current user info
# ---------------------------------------------------------------------------------------------------------------------------------------------
   function user($a=null)
   {
      $u=sesn('USER'); $p="$/User/data/$u";
      if(is_funnic($a)){$a=lowerCase($a); if(($a=='name')||($a=='nick')){return $u;}; $r=pget("$p/$a"); return $r;};
      $r=knob(); $l=pget($p); foreach($l as $i){if(is_file(path("$p/$i"))){$r->$i=pget("$p/$i"); if(is_numeric($r->$i)){$r->$i*=1;}}};
      return $r;
   }
# ---------------------------------------------------------------------------------------------------------------------------------------------



# need :: tools : load dependencies
# ---------------------------------------------------------------------------------------------------------------------------------------------
   require(path('$/Proc/base/dbug.php')); // this will take care of any further issues with the framework and any subsequent runtime errors
   require(path('$/Proc/base/abec.php')); // basic tools for heavy lifting .. if anything goes wrong in here, dbug will handle it .. awesomeness
   require(path('$/Proc/base/base.php')); // ABEC is full .. extend any other essential functions in here
   require(path('$/Proc/base/fwal.php')); // essential security .. right of passage through "the pass"
   require(path('$/Proc/aard.php'));      // load Proc class .. now all is ready to gracefully handle anything
# ---------------------------------------------------------------------------------------------------------------------------------------------



# func :: allStemRun : scans `$d` for a list of stems, for each stem run a php-file `$f`, starting with `$o`
# ---------------------------------------------------------------------------------------------------------------------------------------------
    function allStemRun($f,$d=null,$o=null,$i=null)
    {
        if(!isText($f,1)||!isPath("/$f")){return;}; $l=xord(stemList($d),$o); if(!$l){return;}; // validate
        foreach($l as $p){if(isee("$p/$f")){$ob=requires::path("$p/$f");}};
    };
# ---------------------------------------------------------------------------------------------------------------------------------------------



# dbug :: keep : housekeeping .. run regularly
# ---------------------------------------------------------------------------------------------------------------------------------------------
    if(siteLocked()&&!isin(NAVIPATH,'User/runRepel')&&!userDoes('sudo')){finish(419); exit;}; // system update in progress

    if(envi('UPKEEPER'))
    {
        require(path('$/Proc/base/keep.php'));
        upkeep($_SERVER['SYSCLOCK']->upkeep, ($_SERVER['UPKEEPER']*1), time(), knob($_GET)->upkeep);
        path::make('$/Proc/vars/lastDbug',(time().''));
    };
# ---------------------------------------------------------------------------------------------------------------------------------------------



# cond :: proc : these need to run quickly - if requested directly, so skip the rest and handle it now
# ---------------------------------------------------------------------------------------------------------------------------------------------
    if(isin(["/Proc/listen","/Proc/signal","/User/upload","/Proc/execPath","/Proc/xenoCall","/Proc/makeTodo"],NAVIPATH))
    {
        permit::fubu(); // security!!
        call(NAVIPATH); exit;
    };
# ---------------------------------------------------------------------------------------------------------------------------------------------



# proc :: init : boot
# ---------------------------------------------------------------------------------------------------------------------------------------------
   $_SERVER['RUNLEVEL']=1;
   allStemRun("boot.php",A,"$/Site"); // boot all bootable stems

   if(userDoes('work'))
   {
       $un=sesn('USER'); $sp="$/User/data/$un/home/Custom"; $op=null;
       $op=null; if(isee($sp)){$op=requires::path($sp);};
       if(($op!==null)&&($op!==true)){signal::dump("~/server.php output:\n".tval($op));};
       unset($un,$sp,$op);
   };

   Proc::init(); // initialize Proc
# ---------------------------------------------------------------------------------------------------------------------------------------------
