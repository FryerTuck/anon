<?
namespace Anon;


# info :: file : read this
# ---------------------------------------------------------------------------------------------------------------------------------------------
# this file is the framework bootstrapper; it assembles expected functionality and initializes the error-handler and auto-loader
# it also serves interfaces directly if no further processing is required, but we need some basic tools and info before we can handle anything
# here we are in "the woods" .. we have syntactical freedom and less scary things to deal with, but we need to get out of here, it's not safe
# ---------------------------------------------------------------------------------------------------------------------------------------------



# conf :: proc : these settings solve a lot of problems .. we don't want to ignore warnings and notices, but we also want to be discreet
# ---------------------------------------------------------------------------------------------------------------------------------------------
   ini_set('display_errors',true); error_reporting(E_ALL); // anon handles errors .. it won't spill guts in public
   ini_set('default_charset','UTF-8'); ini_set('input_encoding','UTF-8'); // force utf8 everywhere
   ini_set('output_encoding','UTF-8'); mb_internal_encoding('UTF-8'); mb_http_output('UTF-8'); // force utf8
   ini_set("precision",16); // accuracy matters .. to get accurate decimal value from float, use: number_format($number,$precision);
   set_time_limit(60); // max execution time from here on
   // ini_set('auto_detect_line_endings',1); // just to be sure
   $z=pget('/Proc/conf/timeZone'); if(is_string($z)&&(strpos($z,'/'))){date_default_timezone_set("$z");}; unset($z); // set server time zone
# ---------------------------------------------------------------------------------------------------------------------------------------------



# shiv :: tools : provide expected functionality
# ---------------------------------------------------------------------------------------------------------------------------------------------
   function is_nokey_array($d){if(!is_array($d)){return false;}; return (empty($d)||(array_keys($d)===range(0,(count($d)-1))));} // numeric
   function is_assoc_array($d){return (is_array($d)&&!empty($d)&&(count(array_filter(array_keys($d),'is_string'))>0));} // associative

   function is_closure($d){if(is_object($d)){return (($d instanceof \Closure));}; return false;}; // function
   function facing($a){return (envi('INTRFACE')===$a);} // assert interface .. like: if(facing('BOT')){};

   function fractime($p=3) // precision time .. default is milliseconds
   {
      if(!is_int($p)||($p<1)){return time();};
      $r=microtime(true); $r=round($r,$p); return $r;
   };

   function lowerCase($d){if(is_string($d)){return strtolower($d);};}
   function upperCase($d){if(is_string($d)){return strtoupper($d);};}
   function proprCase($d){if(is_string($d)){return ucwords(strtolower($d));};}

   function isLowerCase($d){return (strtolower($d)===$d);}
   function isUpperCase($d){return (strtoupper($d)===$d);}
   function isProprCase($d){return (ucwords($d)===$d);}

   function is_number($d){return (is_int($d)||is_float($d)||is_real($d));};
   function is_funnic($d){if(!test($d,'/^([a-zA-Z0-9_]){2,48}$/')){return;}; return test(trim($d,'_'),'/^([a-zA-Z])([a-zA-Z0-9]){1,48}$/');};
   function is_class($d){return (is_string($d)&&(class_exists($d,false)||class_exists("Anon\\$d",false)));};
# ---------------------------------------------------------------------------------------------------------------------------------------------



# func :: defn : define/retrieve Anon constants .. string with no spaces gets .. string with spaces -or is_assoc_array/is_object sets multiple
# ---------------------------------------------------------------------------------------------------------------------------------------------
   function defn($a)
   {
      if(is_string($a)&&(strpos($a,' ')===false)){if(defined("Anon\\$a")){return constant("Anon\\$a");}; return;}; // get
      if(is_string($a)){$l=explode(' ',$a); foreach($l as $i){define("Anon\\$i",":$i:");}; return true;}; // set multiple as word/flag
      if(!is_assoc_array($a)&&!is_object($a)){return;}; foreach($a as $k => $v){define("Anon\\$k",$v);}; // set multiple
      return true; // would have failed if anything went wrong
   }
# ---------------------------------------------------------------------------------------------------------------------------------------------



# refs :: constants : these help us express specific directives .. they all have the value of the word wrapped in `:` .. like :AUTO:
# ---------------------------------------------------------------------------------------------------------------------------------------------
   defn('AUTO KEYS VALS WORD XACT VOID NONE STEM TOOL FUNC PATH FOLD FILE LINK DUMP DONE GOOD INFO WARN FAIL MINI MIDI MAXI SKIP STOP TODO');
   defn('LOOP REPO DENY AFTR BFOR FLAT DEEP HIDN EMPT GONE NOFAIL NOINIT NOMAKE NOEXIT DOEXIT OK');
   defn('A B C D E F G H I J K L M N O P Q R S T U V W X Y Z');
   defn('count fetch using alter write claim touch where group order limit parse shape apply erase purge debug dbase table field sproc funct after basis named param parts');
   defn('NATIVE REMOTE ORIGIN ALL');
   defn('ASC DSC');
# ---------------------------------------------------------------------------------------------------------------------------------------------



# refs :: constants : short-hand references to values that are frequently used
# ---------------------------------------------------------------------------------------------------------------------------------------------
   $h=envi('SERVER_NAME'); if(!$h){$h=envi('HOST');};
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
      'USERDEED' => envi('CLIENT_METHOD'),
      'NAVIPURL' => envi('URI'),
      'NAVIPATH' => envi('URL'),
      'MADEFUBU' => envi('MADEFUBU'),
   ]);

   defn(['PROCHASH'=>sha1(random(6).microtime(true).USERADDR.getmypid().random(6))]); // this is unique .. any doubts?
   $s=trim(NAVIPATH,'/'); if(!$s){$s='/';}elseif(strpos($s,'/')){$s=explode('/',$s)[0];}; defn(['NAVISTEM'=>$s]); unset($s,$h);
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



# func :: tval : de-parse .. visible text-value of anything
# ---------------------------------------------------------------------------------------------------------------------------------------------
   function tval($d,$o=null)
   {
      if(is_string($d))
      {$v=trim($d); if($d===''){return '""';}; if($v!==''){return $d;}; $r=str_replace(["\n",' ',"\t"],['↵','␣','⇥'],$d); return $r;};
      if(is_nokey_array($d)){$d=array_values($d);}; //if($pp){$pp=JSON_PRETTY_PRINT;};
      if(is_closure($d)){$r=var_export($d,true);}elseif($o===DUMP){$r=json_encode($d,JSON_UNESCAPED_SLASHES | JSON_PRETTY_PRINT);}
      else{$r=json_encode($d,JSON_UNESCAPED_SLASHES);};
      if(!is_string($r)){$r=print_r($d,true);}; return trim($r);
   }
# ---------------------------------------------------------------------------------------------------------------------------------------------



# func :: crop : minifi text
# ---------------------------------------------------------------------------------------------------------------------------------------------
   function crop($v,$l=null)
   {
      if(is_array($v)){$v=array_values($v); foreach($v as $x => $i){$v[$x]=crop($i,$l);}; return $v;}; if(!is_string($v)){return;};
      $rup=envi('USERPATH'); $cup=USERPATH; if((strpos($v,$rup)===0)||(strpos($v,$cup)===0)){$v=str_replace([$rup,$cup],'~',$v);};
      if(path($v)){$v=rtrim($v,'/'); $c=COREPATH; $r=ROOTPATH; if(!$v||($v===$r)){$v='/';}elseif($v===$c){$v='$';}
      else{$v=str_replace([$c,$r],'',$v);}; $v=str_replace('//','/',$v); if(strpos($v,'/~')===0){$v=substr($v,1);}};
      $s=strlen($v); if($s<4){return $v;}; if(!is_int($l)){return $v;};
      if(($l<1)||($s<$l)){return $v;}; $v=substr($v,0,$l); return "$v...";
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
      if(is_array($d)||is_object($d)){return (new knob($d,$unwrap));}; if(!is_string($d)){return (new knob([]));};
      if(strpos($d,':')){$d=str_replace('; ',';',$d); $d=str_replace(';',"\n",$d); $d=dval($d); return (new knob($d));};
      $p=isee($d); if(!$p){return (new knob([]));};$x=pget($d);if(is_string($x)){$x=dval($x); return (new knob((is_assoc_array($x)?$x:[])));};
      $r=(new knob([])); foreach($x as $i)
      {
         $p=isee("$d/$i"); if(is_dir($p)){$r->$i=knob("$d/$i");}elseif(is_link("$d/$i")){$r->$i=readlink("$d/$i");}else
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
      if(facing('BOT')||facing('SYS')){header('HTTP/1.1 503 Service Unavailable'); die();}; // crawler

      if(facing('SSE')&&envi('SSEREADY')){$r=base64_encode($r); print_r("event: dump\ndata: $r\n\n"); flush(); return;}; // server-side event

      header('HTTP/1.1 200 OK'); if(facing('GUI')){sesn('USER');};

      if(envi('ACCEPT')==='application/json')
      {
         header('Content-Type: application/json');
         if((strpos($r,'data:')!==0)&&(strpos($r,';base64,')!==false)){$r=base64_encode($r); $r="data:text/plain;base64,$r";};
         $r=json_encode(knob(['name'=>'dump', 'data'=>$r])); print_r($r); flush(); die();
      };

      if(facing('DPR')&&(knob($_GET)->n==='script'))
      {header('Content-Type: application/javascript'); $r=str_replace("'","\'",$r); $r=str_replace("\n",'\n',$r); $r="dump('$r');";}
      else{header('Content-Type: text/plain');};

      header('Content-Type: text/plain'); print_r($r); flush(); die(); // DPR, GUI, API:text/plain
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
      $h=twig($p); $l=explode('/',$p); $l=array_pop($l); lock::awaits($p); exec::{"rm -rf ./$l"}($h); lock::remove($p); return is_dir($p);
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
      if(!test($h,'/[a-z0-9]{40,64}/')){return;}; $p=path("/Proc/temp/refs/$h"); $e=null; if(is_link($p)){$e=(readlink($p)*1);};
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
         $a=aged($p); if($a<self::$max){return true;}; if(!is_link($p)){return false;}; unlink($p); return false;
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
      $u=defn('SESNUSER'); $h=defn('SESNHASH'); if(($a==='USER')&&$u){return $u;};  if(($a==='HASH')&&$h){return $h;};
      $d="/Proc/temp/sesn"; $l=pget($d); if(count($l)>9999){defn('HALT',1); header('HTTP/1.1 429 Too Many Sessions'); die();}; // flood protect
      $t=time(); if(!$h) // new -or resume session
      {
         $h=acid(); $ns=0; if(!$h){$ns=1; $h=sha1(random(6).microtime(true).envi('USERADDR').getmypid().random(6));}; $p="$d/$h";
         if(!isee($p)){pset("$p/USER",'anonymous'); setrawcookie($h,'...',0,'/',HOSTNAME);}; $u=pget("$p/USER");
         $c=pget("/User/data/$u/clan"); defn(['SESNHASH'=>$h, 'SESNUSER'=>$u, 'SESNCLAN'=>$c]); $i=envi('INTRFACE');
         if(($i!=='SSE')&&($i!=='DPR')){$o=pget("$p/TIME"); if(!$o){$o=$t;}; $y=($t-$o); pset("$p/TIME",$t); if(!$ns){pset("$p/BSEC",$y);}};
      }
      else
      {$u=defn('SESNUSER'); $c=defn('SESNCLAN'); $p="$d/$h";}; // current session

      if(is_string($a)){$a=trim($a); if(strlen($a)<1){$a=null;}}elseif(is_assoc_array($a)){$a=knob($a);};
      if($a===null){$r=knob($p); $r->CLAN=$c; return $r;}; // get all data
      if(!is_string($a)&&!is_array($a)&&!is_object($a)){return;}; // invalid -return nothing
      if(is_string($a)){return (($a==='HASH')?$h:(($a==='CLAN')?$c:pget("$p/$a")));}; // get session item-value by name

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
   function guiStrap()
   {
      $h=sesn('HASH'); $v=knob(['WACKMESG'=>base64_encode(pget('/Proc/hack.inf'))]); $p='/Proc/aard.js'; $d=[];
      $c=pget('/User/data/master/pass'); if(!$c){wack();}; if(password_verify('0m1cr0n!',$c)){$d[]='editRootPass';};
      $c=pget('/Proc/conf/autoMail'); if(!isin($c,'mail://')||!isin($c,'@')||!isin($c,'.')){$d[]='confAutoMail';}; // debug automail
      $r=base64_encode(tval($d));
      $v->badCfg=$r; $c=import($p,$v); $c=base64_encode(strrev($c)); $f="after encoding, `$p` exceeds maximum cookie size of 4093 bytes";
      if(span($c)>4093){fail::usage($f);}; setrawcookie($h,$c,0,'/',HOSTNAME);
   }
# ---------------------------------------------------------------------------------------------------------------------------------------------



# need :: tools : check if dbug & abec is available, if not -then halt, else load them
# ---------------------------------------------------------------------------------------------------------------------------------------------
   if(!isee('/Proc/dbug.php')){halt(424,'Failed Dependency - dbug');}; if(!isee('/Proc/abec.php')){halt(424,'Failed Dependency - abec');};
   require(path('/Proc/dbug.php')); // this will take care of any further issues with the framework and any subsequent runtime errors
   require(path('/Proc/abec.php')); // basic tools for heavy lifting .. if anything goes wrong in here, dbug will handle it .. awesomeness
   require(path('/Proc/base.php')); // ABEC is full .. extend any other essential functions in here
# ---------------------------------------------------------------------------------------------------------------------------------------------



# dbug :: temp : housekeeping - delete old temp-files .. create temp folders if undefined .. remove stale sessions, locks, refs, etc.
# ---------------------------------------------------------------------------------------------------------------------------------------------
   $dbs=(pget('/User/conf/inactive')*1); $ldb=(pget('/Proc/dbug.inf')*1); $tmn=time();

   if(($tmn-$ldb)>$dbs)
   {
      $h='/Proc/temp'; $x=['file','kban','lock','refs','sesn'];  $cln=user('clan');

      foreach($x as $d)
      {
         if(!is_dir("$h/$d")){pset("$h/$d/");}; $l=pget("$h/$d"); foreach($l as $i)
         {
            if(aged("$h/$d/$i")<=($dbs+2)){continue;}; if($d!=='sesn'){void("$h/$d/$i"); continue;};
            $t=(pget("$h/$d/$i/TIME")*1); if((($tmn-$t)>($dbs+2))&&isin($cln,['work','sudo']))
            {
               $x=acid(); void("$h/$d/$i"); setcookie($x,null,-1,'/',envi('HOST'));
               if(facing('GUI')){$p=envi('URI'); header("Location: $p"); defn(['HALT'=>1]); die();}
               else{ekko::head(408,false);};
            };
         };
         unset($l,$i,$t);
      };

      if(facing('GUI'))
      {
         if(!isee('/Proc/conf/hostName')){pset('/Proc/conf/hostName',HOSTNAME);};
      };
      unset($h,$x,$d,$cln);

      if(isRepo('/'))
      {
         $h='/.anon.dir'; $l=conf('Proc/gitIgnor');
         foreach($l as $i){$c=substr($i,0,1); if($c==='!'){$i=substr($i,1);}else{$c='';}; repo::ignore('/',write,($c.$h.$i));};
         unset($h,$l,$c,$i);
      };

      path::make('/Proc/dbug.inf',$tmn);
   };
   unset($dbs,$ldb,$tmn);
# ---------------------------------------------------------------------------------------------------------------------------------------------



# cond :: flow : serve configured shortcuts .. tighten security .. if facing GUI -then boot the GUI
# ---------------------------------------------------------------------------------------------------------------------------------------------
   require(path('/Proc/fwal.php')); // essential security .. right of passage through "the pass"

   if(facing('GUI')&&(NAVIPATH==='/Proc/base.js')&&($_COOKIE[(sesn('HASH'))]!=='...'))
   {
      setrawcookie(sesn('HASH'),'...',0,'/',HOSTNAME); $r=import(NAVIPATH); $m=mime(NAVIPATH); header("Content-Type: $m");
      while(ob_get_level()){ob_end_clean();}; defn(['HALT'=>1]); echo($r); exit;
   }

   if(facing('GUI'))
   {
      ekko::head(200); ekko::head(['cache'=>false]); guiStrap(); // send bootStrap headers
      finish('/Proc/aard.htm',['botHoney'=>conf('Proc/badRobot')->lure],NOEXIT); die(); // dbug browser capabilities and trap clever bots
   };

   // if((envi('METHOD')==='POST')&&facing('DPR')&&(NAVIPATH==='/')){finish('/Proc/aard.htm',$_POST);};
   if((envi('METHOD')==='POST')&&facing('API')){$d=file_get_contents('php://input'); if(wrapOf($d)==='{}')
   {$d=json_decode($d); foreach($d as $k => $v){$_POST[$k]=$v;}}};

   defn(['AUTOMAIL'=>pget('/Proc/conf/autoMail')]); // needed
# ---------------------------------------------------------------------------------------------------------------------------------------------


# cond :: flow : boot client - which in turn loads the client-boot-files of every STEM's config/autoboot
# ---------------------------------------------------------------------------------------------------------------------------------------------
   if(facing('DPR')&&(NAVIPATH==='/Proc/boot.js'))
   {
      $a=scan('$'); $b=scan('/',FOLD); $l=concat($a,$b); $r=[]; foreach($l as $i)
      {
         $p=path::conf($i); if(!$p||($i==='Proc')){continue;}; $d=dval(pget("$p/autoboot"));
         if(is_assoc_array($d)&&(fext($d['client'])==='js')){$r[]=$d['client'];};
      };
      finish(NAVIPATH,['bootList'=>tval($r)]);
   }
# ---------------------------------------------------------------------------------------------------------------------------------------------



# proc :: init : autoload classes from stems and initiate the Proc class
# ---------------------------------------------------------------------------------------------------------------------------------------------
   spl_autoload_register(function($n){$n=str_replace('Anon\\','',$n); import($n);}); // automatically load PHP file associated by class-name
   Proc::init(); // as we remember the trials faced through the mud, swamp, woods and pass behind us, we welcome the fresh air of "the haven"
# ---------------------------------------------------------------------------------------------------------------------------------------------
