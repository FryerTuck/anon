<?
namespace Anon;


# info :: file : read this
# ---------------------------------------------------------------------------------------------------------------------------------------------
# this file is the framework bootstrapper; it assembles expected functionality and initializes the error-handler and auto-loader
# it also serves interfaces directly if no further processing is required, but we need some basic tools and info before we can handle anything
# here we are in "the woods" .. we have syntactical freedom and less scary things to deal with, but we need to get out of here, it's not safe
# ---------------------------------------------------------------------------------------------------------------------------------------------



# refs :: constants : these help us express specific directives .. they all have the value of the word wrapped in `:` .. like :AUTO:
# ---------------------------------------------------------------------------------------------------------------------------------------------
   defn('AUTO KEYS VALS WORD XACT VOID NONE STEM TOOL FUNC PATH FOLD FILE LINK DUMP DONE GOOD INFO WARN FAIL MINI MIDI MAXI SKIP STOP TODO');
   defn('LOOP REPO DENY AFTR BFOR FLAT DEEP HIDN EMPT GONE NOFAIL NOINIT NOMAKE NOEXIT DOEXIT OK');
   defn('A B C D E F G H I J K L M N O P Q R S T U V W X Y Z');
   defn('count fetch using alter write claim touch where group order limit parse shape apply erase purge debug dbase table field sproc funct after basis named param parts');
   defn('NATIVE REMOTE ORIGIN ALL');
   defn('ASC DSC API BOT DPI GUI SSE');
# ---------------------------------------------------------------------------------------------------------------------------------------------



# refs :: constants : short-hand references to values that are frequently used
# ---------------------------------------------------------------------------------------------------------------------------------------------
   $h=pget('/Proc/conf/hostName'); if(!$h){$h=envi('SERVER_NAME'); if(!$h){$h=envi('HOST');}};
   $p=envi('URL'); $b=envi('BASEPATH'); if($b!=='/'){$p=lshave($p,$b);}; if(!$p){$p='/';};
   defn
   ([
      'ROOTPATH' => envi('ROOTPATH'),
      'COREPATH' => envi('COREPATH'),
      'USERPATH' => str_replace(envi('COREPATH'),'',envi('USERPATH')),
      'TECHMAIL' => envi('TECHMAIL'),
      'HOSTNAME' => $h,
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
      'NAVIPATH' => $p,
      'BASEPATH' => envi('BASEPATH'),
      'MADEFUBU' => envi('MADEFUBU'),
   ]);

   defn(['PROCHASH'=>sha1(random(6).microtime(true).USERADDR.getmypid().random(6))]); // this is unique .. any doubts?
   $s=trim(NAVIPATH,'/'); if(!$s){$s='/';}elseif(strpos($s,'/')){$s=explode('/',$s)[0];}; defn(['NAVISTEM'=>$s]); unset($s,$h,$p,$b);
   defn(['EXPROPER'=>'!= !~ >= <= << >> /* */ // ## : = ~ < > & | ! ? + - * / % ^ @ . , ; # ( ) [ ] { } `']);
   defn(['SPECIALS'=>'_^~|.-*+=#$@$!%?:;&/']);
# ---------------------------------------------------------------------------------------------------------------------------------------------



# func :: (wrapping) : text functions for performing operations on first-and-last characters of a string if it's "wrapped"
# ---------------------------------------------------------------------------------------------------------------------------------------------
   function isWrap($d,$b=1)
   {
      if(!is_string($d)||(strlen($d)<2)){return false;}; $r=(mb_substr($d,0,1).mb_substr($d,-1,1));
      if(in_array($r,['**','``','""',"''",'‷‴','[]','{}','()','<>','::','\\\\','//'])){return ($b?true:$r);};
   }

   function wrapOf($d){$r=isWrap($d,0); return ($r?$r:'');}
   function unwrap($d){if(!isWrap($d)){return $d;}; return mb_substr($d,1,(mb_strlen($d)-2));}
# ---------------------------------------------------------------------------------------------------------------------------------------------



# func :: stub : finds first occurance of $d in $t then splits there once, returns array[left,dlim,right] .. or null if invalid
# ---------------------------------------------------------------------------------------------------------------------------------------------
   function stub($t,$d,$r=0)
   {
      if(is_array($d)){$l=array_values($d);$d=null;foreach($l as $i){if(is_string($i)&&(strlen($i)>0)&&(strpos($t,$i)!==false)){$d=$i;break;}}};
      if(!is_string($t)||!is_string($d)||(strlen($t)<2)||(strlen($d)<1)){return;}; $p=(!$r?mb_strpos($t,$d):mb_strrpos($t,$d));
      if($p!==false){return [mb_substr($t,0,$p),$d,mb_substr($t,($p+mb_strlen($d)))];};
   }

   function lstub($t,$d){return stub($t,$d);};  function rstub($t,$d){return stub($t,$d,1);}
# ---------------------------------------------------------------------------------------------------------------------------------------------



# func :: dval : parse implied value from "neat" string .. assumes json at first and mitigates from there on
# ---------------------------------------------------------------------------------------------------------------------------------------------
   function dval($d)
   {
      if(!is_string($d)){return $d;}; $d=trim($d); if(($d==='')||($d==='null')||($d==='VOID')){return;}; $v=json_decode($d,true);
      if($v!==null){return $v;}; if($d==='*'){return $d;};
      if(strlen($d)<2){return $d;}; if(($d[0]==='+')&&is_numeric(substr($d,1))){$v=dval(substr($d,1)); if($v!==null){return $v;}; return $d;};
      $w=wrapOf($d); if((($w==='``')||($w==='""')||($w==="''"))&&(substr_count($d,$w[0])<3)){$v=unwrap($d); return $v;};
      $q=strpos($d,"'"); if($q===false){$q=strpos($d,'"');}; if($q===false){$q=strpos($d,'`');}; $p=strpos($d,':');
      $url=strpos($d,'://'); $url=(!$url?0:(($p<$url)?0:1));

      if(!strpos($d,"\n")&&(!$p||($p&&($url||($q&&($q<$p))))))
      {
         if(strpos($d,"'")!==false){return $d;}; if(strpos($d,'"')!==false){return $d;}; if(strpos($d,'`')!==false){return $d;};
         if($url){return $d;}; if(!strpos($d,',')&&!strpos($d,' ')){return $d;};
         $r=str_replace(', ',',',$d); $r=str_replace(' ',',',$r); $r=explode(',',$r); return $r;
      };

      $r=array(); $l=explode("\n",$d); foreach($l as $i)
      {
         $i=rtrim($i,','); $q=strpos($i,"'"); if($q===false){$q=strpos($i,'"');}; if($q===false){$q=strpos($i,'`');}; $p=strpos($i,':');
         $cs=0; if(!$q){$i=str_replace(', ',',',$i); $sc=strpos($i,','); $ep=strrpos($i,':'); if($sc&&$p&&($p<$sc)&&($ep>$sc)){$cs=1;}};
         if($cs&&($q===false)){$aa=[];$al=explode(',',$i);foreach($al as $ai){$ap=stub($ai,':');$aa[trim($ap[0])]=dval($ap[2]);};return $aa;};
         if($p&&(($q===false)||($q>$p))){$p=stub($i,':'); $k=trim($p[0]); $v=dval($p[2]); $r[$k]=$v; continue;};
         $r[]=dval($i);
      };
      return $r;
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



# tool :: knob : plain object
# ---------------------------------------------------------------------------------------------------------------------------------------------
   class knob
   {
      function __construct($d,$u=0)
      {foreach($d as $k => $v){if(is_assoc_array($v)){$v=(new knob($v,$u));}; if($u){$k=unwrap($k);}; $this->$k=$v;}}

      function __get($k){if(property_exists($this,$k)){return $this->$k;};}
      function __call($k,$a){if(property_exists($this,$k)){return call_user_func_array($this->$k,$a);}; fail("undefined method `$k`");}
      function __toString(){$r=json_encode($this,JSON_UNESCAPED_SLASHES); return $r;}
   }

   function knob($d=[],$unwrap=null)
   {
      if(is_string($d)){$d=trim($d); if(($d==='')||(!strpos($d,':')&&!isee($d))){return (new knob([]));}};
      if(is_object($d)&&($d instanceof knob)){return $d;};
      if(is_array($d)||is_object($d)){return (new knob($d,$unwrap));}; if(!is_string($d)){return (new knob([]));};
      if(strpos($d,':')){$d=str_replace('; ',';',$d); $d=str_replace(';',"\n",$d); $d=dval($d); return (new knob($d));};
      $p=isee($d); if(!$p){return (new knob([]));};$x=pget($d);if(is_string($x)){$x=dval($x); return (new knob((is_assoc_array($x)?$x:[])));};
      $r=(new knob([])); foreach($x as $i)
      {
         $p=isee("$d/$i"); if(is_dir($p)){$r->$i=[];}elseif(is_link("$d/$i")){$r->$i=readlink("$d/$i");}else
         {$m=fext("$d/$i"); if($m&&!in_array($m,['inf','json'])){continue;}; $v=dval(pget("$d/$i")); $r->$i=(is_array($v)?knob($v):$v);};
      };
      return $r;
   }
# ---------------------------------------------------------------------------------------------------------------------------------------------



# func :: dump : used for quick plain text response .. respects interface, won't show anything to crawlers
# ---------------------------------------------------------------------------------------------------------------------------------------------
   function dump()
   {
      if(!headers_sent()){header_remove();}; while(ob_get_level()){ob_end_clean();};
      $r=''; $l=func_get_args(); foreach($l as $i){$r.=tval($i,DUMP);};
      if(facing('BOT')||facing('SYS')){if(!headers_sent()){header('HTTP/1.1 503 Service Unavailable');}; die();}; // crawler

      if(facing('SSE')&&envi('SSEREADY')){$r=base64_encode($r); print_r("event: dump\ndata: $r\n\n"); flush(); return;}; // server-side event

      if(!headers_sent()){header('HTTP/1.1 200 OK');};
      if(facing('GUI')){sesn('USER');};

      if(envi('ACCEPT')==='application/json')
      {
         if(!headers_sent()){header('Content-Type: application/json');};
         if((strpos($r,'data:')!==0)&&(strpos($r,';base64,')!==false)){$r=base64_encode($r); $r="data:text/plain;base64,$r";};
         $r=json_encode(knob(['name'=>'dump', 'data'=>$r])); print_r($r); flush(); die();
      };

      if(facing('DPR')&&(knob($_GET)->n==='script'))
      {
         if(!headers_sent()){header('Content-Type: application/javascript');};
         $r=str_replace("'","\'",$r); $r=str_replace("\n",'\n',$r); $r="dump('$r');";
      }
      else{if(!headers_sent()){header('Content-Type: text/plain');}};

      if(!headers_sent()){header('Content-Type: text/plain');};
      print_r($r); flush(); die(); // DPR, GUI, API:text/plain
   }
# ---------------------------------------------------------------------------------------------------------------------------------------------



# func :: info : lstat & stat
# ---------------------------------------------------------------------------------------------------------------------------------------------
   function info($p)
   {
      $p=path($p); if(!is_link($p)&&!is_dir($p)&&!is_file($p)){return;}; $s=(is_link($p)?lstat($p):stat($p)); if(!$s){return;};
      $r=knob($s); if(!$r->ctime){$r->ctime=($r->mtime?$r->mtime:0);}; if(!$r->mtime){$r->mtime=$r->ctime;}; return $r;
   }
# ---------------------------------------------------------------------------------------------------------------------------------------------



# func :: aged : get age of path in seconds .. return int -or null if invalid path
# ---------------------------------------------------------------------------------------------------------------------------------------------
   function aged($p)
   {
      $s=info($p); if(!$s){return;}; $t=$s->ctime; if(!is_number($t)){return;};
      $n=time(); $r=($n-$t); return $r;
   }
# ---------------------------------------------------------------------------------------------------------------------------------------------



# func :: void : delete path - also deletes folder with contents .. be careful
# ---------------------------------------------------------------------------------------------------------------------------------------------
   function void($p)
   {
      $p=isee($p); if(!$p){return;}; $c=COREPATH; $r=ROOTPATH; if(($p===$c)||($p===$r)||($p===("$c/Proc"))||($p===("$c/User"))){return;};
      if(!is_dir($p)){lock::awaits($p); $r=unlink($p); lock::remove($p); return $r;};
      $h=twig($p); $l=explode('/',$p); $l=array_pop($l); lock::awaits($p); exec::{"rm -rf ./$l"}($h); lock::remove($p);
      return (!is_dir($p));
   }
# ---------------------------------------------------------------------------------------------------------------------------------------------



# func :: wait : convenient `usleep` in milliseconds
# ---------------------------------------------------------------------------------------------------------------------------------------------
   function wait($n=1)
   {if(!is_int($n)){$n=1;}; if($n<1){$n=1;}; $t=($n*1000); usleep($t);};
# ---------------------------------------------------------------------------------------------------------------------------------------------



# func :: tref : temporary reference that expires in seconds .. $h is hash .. if $x is null -it gets ref life, else if $x is int it sets ref
# ---------------------------------------------------------------------------------------------------------------------------------------------
   function tref($h,$x=null)
   {
      if(!test($h,'/^[a-z0-9]{40,64}$/')){return;}; $p=path("/Proc/temp/refs/$h"); $e=null; if(is_link($p)){$e=(readlink($p)*1);};
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
         self::$max=((ini_get('max_execution_time')*1)-5); $p=path('/Proc/temp/lock'); self::$dir=$p;
      }


      static function exists($p)
      {
         if(!is_string($p)){return;}; $d=self::$dir; $h=sha1($p); $p=path("$d/$h"); if(!is_link($p)){return false;};
         $a=aged($p); if($a<self::$max){return true;}; if(!is_link($p)){return false;};
         try{deFail(); unlink($p); enFail();}catch(\Exception $e){return false;}; return false;
      }


      static function create($p,$h=null)
      {
         if(!$h){if(!is_string($p)){return;}; if(self::exists($p)){return false;}; $h=sha1($p); $d=self::$dir; $p=path("$d/$h");}
         $m=umask(); umask(0); symlink(PROCHASH,$p); umask($m); return true;
      }


      static function awaits($p,$m=true)
      {
         if(!is_string($p)){return;}; $h=sha1($p); $d=self::$dir; $t=path("$d/$h");
         while(self::exists($p)){wait(10);}; $r=false; if($m){$r=self::create($t,1);}; return $r;
      }


      static function remove($p)
      {
         if(!is_string($p)){return;}; $d=self::$dir; $h=sha1($p); $p=path("$d/$h"); if(!is_link($p)){return true;};
         $d=readlink($p); if($d===PROCHASH){unlink($p); return true;}; return false;
      }
   }

   lock::init();
# ---------------------------------------------------------------------------------------------------------------------------------------------



# tool :: exec : run server command .. returns output -or null if invalid
# ---------------------------------------------------------------------------------------------------------------------------------------------
   class exec
   {
      static function __callStatic($c,$a)
      {
         $un=sesn('USER'); $up="/User/data/$un"; if(!isset($a[0])){$a[0]=$up;}; $p=$a[0]; $v=(isset($a[1])?$a[1]:null); // TODO security check
         $i=(isset($a[2])?$a[2]:''); if(!is_string($i)){return;}; $p=isee($p); if(!$p){return;};
         if(($v!==null)&&!is_assoc_array($v)){return;}; $q=[0=>["pipe","r"], 1=>["pipe","w"], 2=>["pipe","w"]]; $r=proc_open($c,$q,$x,$p,$v);
         if(!is_resource($r)){return;}; if($i&&($i!==NOFAIL)){wait(1000); fwrite($x[0],$i);}; fclose($x[0]);
         $o=trim(stream_get_contents($x[1])); fclose($x[1]); $e=trim(stream_get_contents($x[2])); fclose($x[2]); $z=trim(proc_close($r));
         if($z){$z=(($e&&$o)?"$e ..\n$o":($e?$e:$o));}; if(!$z){wait(1); return $o;}; throw new \Exception("$z");
      }
   }
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
      $u=sesn('USER'); $p="/User/data/$u";
      if(is_funnic($a)){$a=lowerCase($a); if(($a=='name')||($a=='nick')){return $u;}; $r=pget("$p/$a"); return $r;};
      $r=knob(); $l=pget($p); foreach($l as $i){if(is_file(path("$p/$i"))){$r->$i=pget("$p/$i"); if(is_numeric($r->$i)){$r->$i*=1;}}};
      return $r;
   }
# ---------------------------------------------------------------------------------------------------------------------------------------------



# func :: guiStrap : make & send boot cookie
# ---------------------------------------------------------------------------------------------------------------------------------------------
   function guiStrap($u=null,$sc=1)
   {
      $h=sesn('HASH'); $v=knob(['WACKMESG'=>base64_encode(pget('/Proc/info/hack.inf'))]); $p='/Proc/base/aard.js'; $d=[];
      if(!$u){$u=sesn('USER');}; $v->SESNUSER=$u; $v->SESNCLAN=pget("/User/data/$u/clan");
      foreach($_COOKIE as $cn => $cv){if(test($cn,'/^[a-z0-9]{40}$/')&&($cn!==$h)){kuki($cn,VOID,BASEPATH);}};
      $c=pget('/User/data/master/pass'); if(!$c){wack();}; if(password_verify('0m1cr0n!',$c)){$d[]='editRootPass';};
      $c=pget('/Proc/conf/autoMail'); if(!isin($c,'mail://')||!isin($c,'@')||!isin($c,'.')){$d[]='confAutoMail';}; // debug automail
      $r=base64_encode(tval($d)); $v->badCfg=$r; $c=import($p,$v); $c=base64_encode(strrev($c)); $m=4000;
      $f="after encoding, `$p` exceeds maximum cookie size of $m bytes .. technically, it's 4096, but there are overhead issues";
      if(span($c)>$m){fail::usage($f);}; if($sc){kuki($h,$c,BASEPATH);return true;}; return $c;
   }
# ---------------------------------------------------------------------------------------------------------------------------------------------



# need :: tools : load dependencies
# ---------------------------------------------------------------------------------------------------------------------------------------------
   depend('F:/Proc/base/dbug.php');   // check if dbug exists .. with fail if not
   require(path('/Proc/base/dbug.php')); // this will take care of any further issues with the framework and any subsequent runtime errors
   require(path('/Proc/base/abec.php')); // basic tools for heavy lifting .. if anything goes wrong in here, dbug will handle it .. awesomeness
   require(path('/Proc/base/base.php')); // ABEC is full .. extend any other essential functions in here
# ---------------------------------------------------------------------------------------------------------------------------------------------



# dbug :: keep : housekeeping
# ---------------------------------------------------------------------------------------------------------------------------------------------
   $dbs=(pget('/User/conf/inactive')*1); $ldb=(pget('/Proc/vars/lastDbug')*1); $tmn=time();
   if(($tmn-$ldb)>$dbs){require(path('/Proc/base/keep.php')); upkeep($dbs,$ldb,$tmn);}; unset($dbs,$ldb,$tmn);
# ---------------------------------------------------------------------------------------------------------------------------------------------

// path::make('/Proc/dcor/zico.woff',decode::b64(pget('/Proc/dcor/icon.fnt')));
// done('!');


# cond :: flow : serve configured shortcuts .. tighten security .. if facing GUI -then boot the GUI
# ---------------------------------------------------------------------------------------------------------------------------------------------
   require(path('/Proc/base/fwal.php')); // essential security .. right of passage through "the pass"

   if(facing('GUI'))
   {
      guiStrap();
      //ekko::head(['Referrer-Policy'=>'origin','cache'=>false,'cookies'=>true]); // send bootStrap headers
      $r=import('/Proc/base/aard.htm',['botHoney'=>conf('Proc/badRobot')->lure]);
      echo($r); done(); // send BootStrap GUI keeping headers intact
   };

   if((envi('METHOD')==='POST')&&facing('API')){$d=file_get_contents('php://input'); if(wrapOf($d)==='{}')
   {$d=json_decode($d); foreach($d as $k => $v){$_POST[$k]=$v;}}; unset($d,$k,$v);};

   defn(['AUTOMAIL'=>pget('/Proc/conf/autoMail')]); // needed
# ---------------------------------------------------------------------------------------------------------------------------------------------



# cond :: flow : boot client - which in turn loads the client-boot-files of every STEM's config/autoboot
# ---------------------------------------------------------------------------------------------------------------------------------------------
   if(facing('DPR')&&(NAVIPATH==='/Proc/base/boot.js'))
   {
      $a=scan('$'); $b=scan('/',FOLD); $l=concat($a,$b); $r=[]; foreach($l as $i)
      {
         $p=path::conf($i); if(!$p){continue;}; $d=dval(pget("$p/autoboot")); if(!is_assoc_array($d)||!isset($d['client'])){continue;};
         $d=$d['client']; if(!$d){continue;}; if(isText($d)){$d=[$d];}; if(!isNuma($d)){continue;};
         foreach($d as $f){if(!isText($f)){fail("invalid `autoboot` config in: `$p/autoboot`");}; $r[]=$f;};
      };
      finish(NAVIPATH,['bootList'=>tval($r)]);
   }
# ---------------------------------------------------------------------------------------------------------------------------------------------



# proc :: init : autoload classes from stems and initiate the Proc class
# ---------------------------------------------------------------------------------------------------------------------------------------------
   spl_autoload_register(function($n){$n=str_replace('Anon\\','',$n); import($n);}); // automatically load PHP file associated by class-name
   Proc::init(); // as we remember the trials faced through the mud, swamp, woods and pass behind us, we welcome the fresh air of "the haven"
# ---------------------------------------------------------------------------------------------------------------------------------------------
