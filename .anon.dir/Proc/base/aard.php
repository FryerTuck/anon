<?php
namespace Anon;


# info :: file : read this
# ---------------------------------------------------------------------------------------------------------------------------------------------
# this file is the boot entry-point of any interface; used for bootstrapping and graceful fail, many essential rules and tools are defined here
# ...
# THE CHRONICLE
# here we are in "the swamp"; we need to strap our sturdy boots on, but there may be critters inside we got from the mud; let's wash them first
# this place gives me the creeps; there may be deamons here posing as us -making us question our own validity; cookie crumbs could help us here
# we've baked and branded our own cookies for the journey ... so we consume them and lure the deamons away from our path, with honey and crumbs
# ---------------------------------------------------------------------------------------------------------------------------------------------



# conf :: proc : these settings solve a lot of problems .. we don't want to ignore warnings and notices, but we also want to be discreet
# ---------------------------------------------------------------------------------------------------------------------------------------------
   ini_set('display_errors',true); error_reporting(E_ALL);
   ini_set('default_charset','UTF-8'); ini_set('input_encoding','UTF-8'); // force utf8 everywhere
   ini_set('output_encoding','UTF-8'); mb_internal_encoding('UTF-8'); mb_http_output('UTF-8'); // force utf8
   ini_set("precision",16); // accuracy matters .. to get accurate decimal value from float, use: number_format($number,$precision);
   set_time_limit(60); // max execution time from here on
# ---------------------------------------------------------------------------------------------------------------------------------------------



# shiv :: tools : provide expected functionality
# ---------------------------------------------------------------------------------------------------------------------------------------------
   function is_nokey_array($d){if(!is_array($d)){return false;}; return (empty($d)||(array_keys($d)===range(0,(count($d)-1))));} // numeric
   function is_assoc_array($d){if(!is_array($d)){return false;}; return (array_keys($d) !== range(0,(count($d)-1)));} // associative

   function is_closure($d){if(is_object($d)){return (($d instanceof \Closure));}; return false;}; // function

   function fractime($p=3) // precision time NOW .. default is milliseconds
   {if(!is_int($p)||($p<1)){return time();}; $r=microtime(true); $r=round($r,$p); return $r;};

   function lowerCase($d){if(is_string($d)){return strtolower($d);};}
   function upperCase($d){if(is_string($d)){return strtoupper($d);};}
   function proprCase($d){if(is_string($d)){return ucwords(strtolower($d));};}

   function isLowerCase($d){return (strtolower($d)===$d);}
   function isUpperCase($d){return (strtoupper($d)===$d);}
   function isProprCase($d){return (ucwords($d)===$d);}

   function is_number($d){return (is_int($d)||is_float($d));};
   function is_funnic($d){if(!is_string($d)){return;}; return test(trim($d,'_'),'/^([a-zA-Z])([a-zA-Z0-9_]){1,48}$/');};
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



# func :: (buffer) : shorthands to manage output buffer
# ---------------------------------------------------------------------------------------------------------------------------------------------
   function bufrVoid()
   {
      if(ob_get_level()<1){return;};
      while(ob_get_level()>0){ob_end_clean();};
   }

   function bufrSend()
   {
      if(ob_get_level()<1){return;};
      while(ob_get_level()>0){ob_end_flush();};
      flush();
   }
# ---------------------------------------------------------------------------------------------------------------------------------------------



# func :: done : exit process .. if bool is given then output-buffer is sent or destroyed .. if text given then output buffer becomes the text
# ---------------------------------------------------------------------------------------------------------------------------------------------
   function done($sb=true)
   {
      defn(['HALT'=>1]); if($sb===true){bufrSend(); die();}; if(($sb===null)||($sb===false)||($sb==='')){bufrVoid(); die();};
      $pt=0; if(!is_string($sb)){$sb=tval($sb); $pt=1;};

      if(!headers_sent())
      {
         header("HTTP/1.1 200 OK");
         header("Cache-Control: no-store, no-cache, must-revalidate"); // HTTP/1.1
         header("Cache-Control: post-check=0, pre-check=0",false);
         header("Expires: Sat, 26 Jul 1997 05:00:00 GMT");
         header("Pragma: no-cache"); // HTTP/1.0
         header("Last-Modified: ".gmdate("D, d M Y H:i:s")." GMT");
         if($pt){header('Content-Type: text/plain');};
      };

      bufrVoid(); echo $sb; bufrSend(); die();
   };
# ---------------------------------------------------------------------------------------------------------------------------------------------



# func :: lshave/rshave : alternative to ltrim/rtrim -which f*cks up with slashes .. this plays nice .. default is once .. bool(true) recurs
# ---------------------------------------------------------------------------------------------------------------------------------------------
   function lshave($a,$b=null,$r=false)
   {
      if(is_nokey_array($a)){$z=[]; foreach($a as $i){$z[]=lshave($i,$b,$r); return $z;}};
      if(!is_string($a)){return;}; if(!is_string($b)){return ltrim($a);}; $s=strlen($b); if(!$s||(strlen($a)<$s)){return $a;};
      if(substr($a,0,$s)!==$b){return $a;}; do{$a=substr($a,$s);}while($r&&(substr($a,0,$s)===$b));
      return $a;
   }

   function rshave($a,$b=null,$r=false)
   {
      if(is_nokey_array($a)){$z=[]; foreach($a as $i){$z[]=rshave($i,$b,$r); return $z;}};
      if(!is_string($a)){return;}; if(!is_string($b)){return rtrim($a);}; $s=strlen($b); if(!$s||(strlen($a)<$s)){return $a;};
      if(substr($a,(0-$s),$s)!==$b){return $a;}; do{$a=substr($a,0,(strlen($a)-$s));}while($r&&(substr($a,(0-$s),$s)===$b));
      return $a;
   }

   function shaved($a,$b=null,$r=false)
   {
      if(is_nokey_array($a)){$z=[]; foreach($a as $i){$z[]=shaved($i,$b,$r); return $z;}};
      if(!is_string($a)){return;}; if(!is_string($b)){return trim($a);};
      $z=lshave($a,$b,$r); $z=rshave($z,$b,$r);
      return $z;
   }

   function shaven($a,$b=null,$r=false){return shaved($a,$b,$r);};
# ---------------------------------------------------------------------------------------------------------------------------------------------



# func :: envi : server variables .. prefix-free
# ---------------------------------------------------------------------------------------------------------------------------------------------
   function envi($d)
   {
      if(!is_string($d)||($d==='')){return '';};
      if(isset($_SERVER)){$v=$_SERVER;}elseif(isset($HTTP_SERVER_VARS)){$v=$HTTP_SERVER_VARS;}else{return '';};
      $l=explode(' ',$d); $s=count($l); $f=array();
      $x=array('X','HTTP','REDIRECT','REQUEST'); for($i=0; $i<$s; $i++)
      {
         $k=$l[$i]; if(!isset($v[$k])){$w=array_values($x); do{$p=(array_shift($w)."_$k"); if(isset($v[$p])){$k=$p;break;}}while(count($w));};
         if(!isset($v[$k])){continue;}; $q=$v[$k]; if($q&&!is_string($q)){$q=json_encode($q);}; if(is_string($q)&&(strlen($q)>0)){$f[$i]=$q;}
      };
      $c=count($f); if($s===1){if($c<1){return '';}; return $f[0];}; $r=($c/$s); return $r;
   }
# ---------------------------------------------------------------------------------------------------------------------------------------------



# func :: facing : assert interface .. usage:  if(facing('BOT')){};  ..  if(facing('BOT !API')){};
# ---------------------------------------------------------------------------------------------------------------------------------------------
   function facing($a)
   {
       if(!is_string($a)){return;}; $l=explode(' ',$a); $f=envi('INTRFACE'); $r=false; foreach($l as $q)
       {
           $q=trim($q); if(strlen($q)<3){continue;}; $n=0; if($q[0]==='!'){$n=1; $q=substr($q,1);};
           if(!$n&&($q===$f)){$r=true; break;}; if($n&&($q!==$f)){$r=true; break;};
       };
       return $r;
   }
# ---------------------------------------------------------------------------------------------------------------------------------------------



# func :: test : shorthand for `preg_match` .. arguments swapped .. returns bool
# ---------------------------------------------------------------------------------------------------------------------------------------------
   function test($v,$x)
   {
      if(!is_string($v)){return;}; if(!is_string($x)){return;}; if(strlen($x)<3){return;}; $w=(substr($x,0,1).substr($x,-1,1));
      if($w!=='//'){return;}; $r=preg_match($x,$v); if($r){return true;}; return false;
   }
# ---------------------------------------------------------------------------------------------------------------------------------------------



# func :: path : normalized full path
# ---------------------------------------------------------------------------------------------------------------------------------------------
   function path($p)
   {
      if(!is_string($p)){return;}; if(!test($p,'/^[a-zA-Z0-9-\/\.\$~@_]{1,432}$/')){return;}; $p=str_replace('//','/',$p);
      $r=envi('ROOTPATH'); $c=envi('COREPATH'); $u=envi('USERPATH'); if(($p==='/')||($p==='.')){return $r;}; $p=rshave($p,'/');
      if(substr($p,-1,1)==='.'){return;}; if((strpos($p,'/~')===0)||(strpos($p,'/$')===0)){$p=substr($p,1);};
      if(!$r||!$c||!$u){return $p;}; if($p===''){return $r;}; if($p==='$'){return $c;}; if($p==='~'){return $u;}; // works for: ./  $/  ~/
      if((strpos($p,$u)===0)||(strpos($p,$c)===0)||(strpos($p,$r)===0)){return $p;}; $s=substr($p,0,1); $p=ltrim($p,'$/'); $p=ltrim($p,'~/');
      if($s==='$'){return "$c/$p";}; if($s==='~'){return "$u/$p";}; if($s!=='/'){return;}; $p=lshave($p,'/'); $t=explode('/',$p); $t=$t[0];
      if(file_exists("$c/$t")){return "$c/$p";}; return "$r/$p";
   }
# ---------------------------------------------------------------------------------------------------------------------------------------------



# func :: fext : get valid file extension from path
# ---------------------------------------------------------------------------------------------------------------------------------------------
   function fext($p)
   {
      $p=path($p); if(!$p&&is_string($p)){$p="/$p";}; if(!$p||($p&&($p==='/'))){return;}; $b=explode('/',$p); $b=array_pop($b);
      if(strpos($b,'.')===FALSE){return;}; $r=explode('.',$b); $r=array_pop($r); if(test($r,'/^[a-zA-Z0-9]{1,8}$/')){return $r;};
   }
# ---------------------------------------------------------------------------------------------------------------------------------------------




# tool :: arg : returns object with methods that are both grammatical and functional .. e.g.  arg($a)->endsWith($b);
# ---------------------------------------------------------------------------------------------------------------------------------------------
   class arg
   {
      private $xarg;

      function __construct($a){$this->xarg=$a;}

      public function endsWith($b)
      {
         $a=$this->xarg; if(!is_string($a)||!is_string($b)){return;}; $s=strlen($b); if(strlen($a)<$s){return false;};
         return (substr($a,(0-$s),$s)===$b);
      }

      public function startsWith($b)
      {
         $a=$this->xarg; if(!is_string($a)||!is_string($b)){return;}; $s=strlen($b); if(strlen($a)<$s){return false;};
         return (substr($a,0,$s)===$b);
      }
   }


   function arg($a){return (new arg($a));}
   function that($a){return (new arg($a));}
# ---------------------------------------------------------------------------------------------------------------------------------------------



# func :: wait : convenient `usleep` in milliseconds
# ---------------------------------------------------------------------------------------------------------------------------------------------
   function wait($n=1)
   {if(!is_int($n)){$n=1;}; if($n<1){$n=1;}; $t=($n*1000); usleep($t);};
# ---------------------------------------------------------------------------------------------------------------------------------------------



# tool :: exec : run server command .. returns output -or null if invalid
# ---------------------------------------------------------------------------------------------------------------------------------------------
   class exec
   {
      static $dbug=["Cloning into 'anon'..."];

      static function __callStatic($c,$a)
      {
         if(!isset($a[0])){$a[0]='/';}; $p=$a[0];
         $v=(isset($a[1])?$a[1]:null); // TODO security check
         $i=(isset($a[2])?$a[2]:''); if(!is_string($i)){return;}; $p=isee($p); if(!$p){return;};
         if(($v!==null)&&!is_assoc_array($v)){return;}; $q=[0=>["pipe","r"], 1=>["pipe","w"], 2=>["pipe","w"]];
         // if(is_class('signal')){signal::dump("running bash: $c");};
         $r=proc_open($c,$q,$x,$p,$v);
         if(!is_resource($r)){return;};
         //if($i&&($i!==NOFAIL)){wait(1000); fwrite($x[0],$i);};
         fclose($x[0]);
         $o=trim(stream_get_contents($x[1])); fclose($x[1]); $e=trim(stream_get_contents($x[2])); fclose($x[2]);
         $z=trim(proc_close($r)); if($z){$z=(($e&&$o)?"$e ..\n$o":($e?$e:$o));};
         if(!$z){return $o;}; // success! .. take a breather to wait for git-locks, etc.

         $f=1; $db=self::$dbug;
         foreach($db as $ends){if(arg($z)->endsWith($ends)){$f=0;break;}}; // look for msgs to shut up about
         if(!$f){return (($o!=='')?$o:$z);}; // found a shusher mesg .. don't cry, just return whatever is in output
         $s=stak(); if(is_class('dbug')){dbug::$temp=$s;}; // debug below
         throw new \Exception("$z");
      }
   }

   function bash($d)
   {
       return exec::{"$d"}();
   }
# ---------------------------------------------------------------------------------------------------------------------------------------------



# func :: isee : check existance of a reference in order: path, function, class, extension .. checks path readability .. no autoload
# ---------------------------------------------------------------------------------------------------------------------------------------------
   function isee($d)
   {
      $z=envi('ROOTPATH'); if(($d==='/')||($d===$z)){return $z;};
      if($d==='$'){return envi('COREPATH');}; if($d==='~'){return envi('USERPATH');};
      if(is_string($d))
      {$d=trim($d); if(strlen($d)<1){return;}; $d=str_replace(' ',',',$d); if(strpos($d,',')){$d=explode(',',$d);}};

      clearstatcache(); if(is_array($d))
      {
          $s=count($d); if(!$s){$s=1;}; $f=array();
          do{$i=array_shift($d); $i=isee($i); if($i){$f[]=$i;}}while(count($d));
          $r=(count($f)/$s); return $r;
      };

      if(!is_string($d)){return;}; $d=str_replace('Anon\\','',trim($d)); $v=test($d,'/^([a-zA-Z])([a-zA-Z0-9_]){2,36}$/');

      if($v)
      {
         $c='Anon\\'; if(function_exists($d)||function_exists($c.$d)){return 'func';};
         if(class_exists($d,false)||class_exists($c.$d,false)){return 'tool';}; if(extension_loaded($d)){return 'extn';};
      };

      $p=path($d); if(!$p){return;}; $r=is_readable($p); clearstatcache(true);  return ($r?$p:false);
   }
# ---------------------------------------------------------------------------------------------------------------------------------------------



# func :: pget : path get .. read contents of path .. returns null if invalid .. returns string if file .. returns flat-array if dir
# ---------------------------------------------------------------------------------------------------------------------------------------------
   function pget($p,$t=true)
   {
      clearstatcache(); $p=isee($p); if(!$p){return (is_string($t)?$t:null);};

      if(!is_dir($p))
      {
          $r=file_get_contents($p);
          if($t||($t==='0')){$r=trim($r); if(is_string($t)&&(strlen($r)<1)){$r=$t;}};
          return $r;
      };

      $r=array_diff(scandir($p),['.','..']); if(!$t){sort($r); return $r;};
      $z=array(); do{$i=array_shift($r); if($i===null){continue;}; $c=substr($i,0,1); if($c!=='.'){$z[]=$i;};}while(count($r));
      $z=array_values($z); sort($z); return $z;
   };
# ---------------------------------------------------------------------------------------------------------------------------------------------



# func :: pset : create path .. will create subdirs recursively .. be careful with this, use it with `lock::awaits`
# ---------------------------------------------------------------------------------------------------------------------------------------------
   function pset($p,$v='')
   {
      if(!is_string($p)){return;}; if(strlen($p)<2){return;}; $d=0; if(substr($p,-1,1)==='/'){$d=1;}; $p=path($p); if(!$p){return;};
      if($d&&isee($p)){return true;}; $h=rshave($p,'/'); $h=explode('/',$h); $b=array_pop($h); $h=implode('/',$h); $u=umask(); umask(0);
      if(!isee($h)){bash("mkdir -p $h");}; if(!is_writable($h)){bash("chmod +w $h");};
      if($d){$r=mkdir($p,0777,true);}else{$r=file_put_contents($p,$v);}; umask($u); return $r;
   };
# ---------------------------------------------------------------------------------------------------------------------------------------------



# func :: tval : de-parse .. visible text-value of anything
# ---------------------------------------------------------------------------------------------------------------------------------------------
   function tval($d,$o=null)
   {
      if(is_string($d))
      {
          if(($o!==DUMP)&&($o!==FLOG)){return $d;}; if($d===''){return '""';};
          $r=str_replace(["\n","\t"],['↵','⇥'],$d); return $r;
      };
      if(is_nokey_array($d)){$d=array_values($d);}; //if($pp){$pp=JSON_PRETTY_PRINT;};
      if(is_closure($d)){try{$r=blojob($d);}catch(\Exception $e){$r=var_export($d,true);}}
      elseif($o===DUMP){$r=json_encode($d,JSON_UNESCAPED_SLASHES | JSON_PRETTY_PRINT);}
      else{$r=json_encode($d,JSON_UNESCAPED_SLASHES);};
      if(!is_string($r)){$r=print_r($d,true);}; return trim($r);
   }
# ---------------------------------------------------------------------------------------------------------------------------------------------



# func :: spuf : simple http-request .. can be used for spoofing .. or not .. using a proxy is better for REMOTE_ADDR, blessed be the ignorant
# ---------------------------------------------------------------------------------------------------------------------------------------------
   function spuf($uri,$uas=null,$ref=null,$tmo=12,$bin=0)
   {
      if(!is_string($uri)){return;}; if(strpos($uri,'http')===false){return;}; if(!isee('curl')){return;}; $ipa=envi('USERADDR');
      if(!$uas){$uas=envi('USER_AGENT');}; if(!$ref){$ref=envi('REFERER'); if(!$ref){$ref='http://example.com/index.html';}};
      $o=[CURLOPT_RETURNTRANSFER=>1,CURLOPT_SSL_VERIFYPEER=>false,CURLOPT_URL=>$uri,CURLOPT_USERAGENT=>$uas,CURLOPT_REFERER=>$ref,
      CURLOPT_CONNECTTIMEOUT=>4,CURLOPT_TIMEOUT=>$tmo,CURLOPT_BINARYTRANSFER=>$bin];
      if (is_class("signal")){ signal::dump("server :: spuf : bgn $uri"); wait(60); };
      $c=curl_init(); curl_setopt_array($c,$o); curl_setopt($c,CURLOPT_HTTPHEADER,array("REMOTE_ADDR: $ipa", "HTTP_X_FORWARDED_FOR: $ipa"));
      $r=curl_exec($c); $e=null; if(!$r){$x=curl_error($c); if($x){$e=$x;};}; curl_close($c);
      if (is_class("signal")){ signal::dump("server :: spuf : end $uri"); wait(60); };
      if($e){return "FAIL :: $e";}; return $r;
   }
# ---------------------------------------------------------------------------------------------------------------------------------------------



# func :: kbot : kill identified bad bot .. if conf/badRobot lure & trap is set then list poisoning takes effect .. kbot will exit regardless
# ---------------------------------------------------------------------------------------------------------------------------------------------
   function kbot()
   {
      register_shutdown_function(function(){}); if(!headers_sent()){header_remove();}; while(ob_get_level()){ob_end_clean();};
      $h=sha1(envi('USERADDR').envi('USER_AGENT')); $d=path('$/Proc/temp/kban'); $p="$d/$h"; $k=pget('$/Proc/conf/kbanSecs');
      if(!$k){$k=900;}; if(!is_link($p)&&is_writable($d)){symlink("$k",$p);}; // shoo away this visitor for any URL they visit for $k seconds
      $f=pget('$/Proc/conf/badRobot'); $h='HTTP/1.1 503 Service Unavailable'; if(!$f){header($h); die();}; $f="$f\n";
      if(strpos($f,'trap: ')===false){header($h); die();}; $f=explode('trap: ',$f); $f=$f[1]; $f=explode("\n",$f); $f=$f[0]; $f=trim($f);
      if(!$f){header($h); die();}; // no trap, just serve blank: 503 - Service Unavailable
      $p=path($f); if($p&&!isee($p)){header($h); die();}; if($p&&is_dir($p)){header($h); die();}; // bad config, but serve 503 anyway
      $f=trim($f,'"'); $f=trim($f,"'"); $f=trim($f,'`'); // clean up quoted string
      if(!$p&&(strpos($f,'http')!==0)){echo($f); die();}; // not file and not URI .. serve trap mesg as plain text
      if($p&&(fext($f)!=='php')){echo pget($f); die();}; // serve file contents
      if($p){ob_start(); require($p); $r=ob_get_clean(); echo($r); die();}; // custom PHP handler
      $r=spuf($f); if(!$r||(strpos($r,'FAIL ::')===0)){header("Location: $f"); die();}; // try to spoof URI .. if fail -then redirect instead
      echo $r; die(); // spoof worked, so from here any subsequent link is not our problem, we're done here
   }
# ---------------------------------------------------------------------------------------------------------------------------------------------



# func :: kuki : get/set/rip raw session-only cookie at host root without hassle .. 1 arg = get .. 2 args = set .. returns null if invalid
# ---------------------------------------------------------------------------------------------------------------------------------------------
   function kuki($k,$v='<:(/*\):>',$p='/')
   {
      if(!is_string($k)){return;}; if(strlen($k)!==strlen(trim($k))){return;}; // validate cookie-name
      if($v==='<:(/*\):>'){if(!isset($_COOKIE[$k])){return;}; return $_COOKIE[$k];}; // get
      if(($v==='')||($v===':VOID:')){$v=null;}; $d=envi('HOST'); $d="$d";
      if($v===null){setcookie($k,'',-1,$p,$d); unset($_COOKIE[$k]); return;}; // delete
      // expires, path, domain, secure, httponly, samesite
      setrawcookie($k,$v,["expires"=>0,"path"=>$p,"domain"=>$d,"secure"=>true,"httponly"=>false,"samesite"=>"Strict"]); // set
      // setrawcookie($k,$v,0,"$p; SameSite=Strict;",$d,true,false); $_COOKIE[$k]=$v; return true; // set TODO :: for older PHPv < 7.3
   };
# ---------------------------------------------------------------------------------------------------------------------------------------------



# func :: posted : get posted variable-value by name .. returns value -or null if undefined
# ---------------------------------------------------------------------------------------------------------------------------------------------
   function posted($n)
   {
      if(!is_string($n)||(strlen($n)<1)){return;}; if(!isset($_POST[$n])){return;}; return $_POST[$n];
   };

   function getted($n)
   {
      if(!is_string($n)||(strlen($n)<1)){return;}; if(!isset($_GET[$n])){return;}; return $_GET[$n];
   };
# ---------------------------------------------------------------------------------------------------------------------------------------------



# func :: random : creates random string from ALPHABET .. $l is the char-length
# ---------------------------------------------------------------------------------------------------------------------------------------------
   function random($l=null)
   {
      if(!is_int($l)){$l=6;}; if($l<0){$l=6;}; $r=str_shuffle(envi('ALPHABET')); $r=substr($r,0,$l); return $r;
   }
# ---------------------------------------------------------------------------------------------------------------------------------------------



# func :: runlevel : syntax sugar .. sorthand for: $_SERVER['RUNLEVEL']===$n
# ---------------------------------------------------------------------------------------------------------------------------------------------
   function runlevel($n)
   {
      if(!is_int($n)||!isset($_SERVER['RUNLEVEL'])){return;};
      return ($n<=$_SERVER['RUNLEVEL']);
   }
# ---------------------------------------------------------------------------------------------------------------------------------------------



# func :: mksesn : generates a new session key and creates a session folder for a specified user .. returns the key
# ---------------------------------------------------------------------------------------------------------------------------------------------
   function mksesn($u)
   {
      if(!is_funnic($u)){harakiri('invalid username');}; // YOU HAVE DIED
      $k=sha1(random(9).microtime(true).envi('USERADDR').getmypid().random(9)); // if this is not unique then bite me
      if(!isee("/User/data/$u")){harakiri("user `$u` is undefined");}; // YOU HAVE DIED
      pset("$/Proc/temp/sesn/$k/USER",$u);
      return $k; // all is well
   }
# ---------------------------------------------------------------------------------------------------------------------------------------------



# func :: skey : returns session key
# ---------------------------------------------------------------------------------------------------------------------------------------------
   function skey()
   {
      $l=array_keys($_COOKIE); if(count($l)<1){return;}; $r=null; $t='/^[a-z0-9]{40}$/'; $c=envi('COREPATH'); $h="$c/Proc/temp/sesn";
      $n=null; do{$n=array_pop($l); if(!test($n,$t)){$n=null; continue;}; if(is_dir("$h/$n")){$r=$n;break;}}while(count($l));
      if($r){return $r;}; // session is cookie-based .. it exists as a live session-dir server-side .. all is well
      $s=envi('SCHEME'); $h=envi('HOST'); $p=envi('URI'); $z="Location: $s://{$h}{$p}";
      if($n){unset($_COOKIE[$n]); return;}; // session key expired
      $r=kuki('APIKEY'); if(!$r){$r=posted('APIKEY');}; if(!$r){$r=envi('APIKEY');}; if(!$r){return;}; // no key
      if(!test($r,$t)){harakiri(wack());}; // invalid session key .. YOU HAVE DIED
      if(is_dir("$h/$r")){return $r;}; // session is live
      $u=pget("$/Proc/keys/$r"); if(!$u&&(envi('INTRFACE')==='GUI')){return;}; // key may have expired
      if($u){$n=mksesn($u); return $n;}; // if all went well, we are still alive .. all is well
      $r=envi('REFERER'); $h=envi('HOST'); $s=(strpos($r,"https://$h")===0);
      if($s){return;}; // key may have expired
      harakiri(wack()); // YOU HAVE DIED
   }
# ---------------------------------------------------------------------------------------------------------------------------------------------



# func :: crop : minifi text
# ---------------------------------------------------------------------------------------------------------------------------------------------
   function crop($v,$l=null)
   {
      if(is_array($v)){$v=array_values($v); foreach($v as $x => $i){$v[$x]=crop($i,$l);}; return $v;};
      if(!is_string($v)||(strlen($v)<1)){return;};
      $rup=envi('USERPATH'); $cup=str_replace(envi('COREPATH'),'',$rup);
      if((strpos($v,$rup)===0)||(strpos($v,$cup)===0)){$v=str_replace([$rup,$cup],'~',$v);};
      if(path($v)){$v=rshave($v,'/'); $c=envi('COREPATH'); $r=envi('ROOTPATH'); if(!$v||($v===$r)){$v='/';}elseif($v===$c){$v='$';}
      else{$v=str_replace([$c,$r],'',$v);}; $v=str_replace('//','/',$v); if(strpos($v,'/~')===0){$v=substr($v,1);}};
      $s=strlen($v); if($s<4){return $v;}; if(!is_int($l)){return $v;};
      if(($l<1)||($s<$l)){return $v;}; $v=substr($v,0,$l); return "$v...";
   }
# ---------------------------------------------------------------------------------------------------------------------------------------------



# func :: args : get args as numeric_array from `func_get_args()` .. if the first argument is a numeric_array then it is returned as the args
# ---------------------------------------------------------------------------------------------------------------------------------------------
   function args($a)
   {
      if($a===null){return [];}; if(!is_array($a)||!is_nokey_array($a)){return [$a];};
      if(!isset($a[0])){return [];};
      if(is_nokey_array($a[0])){return $a[0];};
      return $a;
   };
# ---------------------------------------------------------------------------------------------------------------------------------------------



# func :: stak : get error stack .. can be given a string stack .. $n starts looking from func-name .. $x starts looking from number
# ---------------------------------------------------------------------------------------------------------------------------------------------
   function stak($s=null,$n=null,$x=null)
   {
      if(!$s){$e=(new \Exception); $s=$e->getTraceAsString();}; $s=explode("\n",$s); $b=[]; $r=[];
      foreach($s as $i)
      {
         if(!strpos($i,'.php(')){continue;}; $y=explode('.php(',$i); $p=crop($y[0]); $p=(explode(' ',$p)[1].'.php'); $y=$y[1];
         $y=explode('): ',$y); $l=($y[0]*1); $y=crop($y[1]); $y=explode('(',$y); $f=$y[0]; $f=ltrim($f,'Anon\\');
         if(($p[0]==='.')||(in_array($f,['{closure}','call_user_func_array','stak']))){continue;};
         $b[]=json_decode(json_encode(['func'=>$f,'file'=>crop($p),'line'=>$l])); $y=null;
      };
      if(($n===null)&&($x===null)){return $b;}; $y=0;
      foreach($b as $i => $o)
      {
          // if(($i===$x)||($o->func===$n)||($o->path===$n)||(($o->func." ".$o->path)===$n)){$y=1; continue;}; if($y){$r[]=$o;};
          if(($i===$x)||($o->func===$n)||($o->path===$n)||(($o->func." ".$o->path)===$n)){$y=1;}; if($y){$r[]=$o;};
      };
      if(count($r)>0){return $r;}; return $b;
   }
# ---------------------------------------------------------------------------------------------------------------------------------------------



# func :: halt : for graceful fail
# ---------------------------------------------------------------------------------------------------------------------------------------------
   function halt($c,$m,$f=null,$l=null,$z='')
   {
      $h=envi('HOST'); $r=envi('REFERER'); $a=envi('USER_AGENT'); $g=1;
      if((strpos($r,"http://$h")===0)||(strpos($r,"https://$h")===0)){$g=0;}; $t=microtime(true); $u='anonymous'; $k='surf';
      if(strpos($a,'SYS :: ',true)===0){$g=0;}; if(envi('INTRFACE')==='BOT'){$g=0;}; while(ob_get_level()){ob_end_clean();};

      $t=$m; if((strpos($t,"\n")!==false)||(strlen($t)>128)){$t='Internal Server Error - invalid reason';};
      $t=str_replace([envi('COREPATH'),envi('ROOTPATH')],'',$t); $p=isee(envi('DBUGPATH')); if(!is_file($p)){$p=0;}; $d=envi('HOST');

      header("HTTP/1.1 $c $t"); if(!$g){print_r($z); flush(); exit;}; if(!$p){die("FAIL :: $c : $m");}; $h=skey();

      if(!isee('$/Proc/temp')){pset('$/Proc/temp/');};
      if(!isee('$/Proc/temp/sesn')){pset('$/Proc/temp/sesn/');};
      if(!is_writable(isee('$/Proc/temp/sesn'))){$c=417; $m='Expectation Failed - writable temp.sesn'; $f=__FILE__; $l=__LINE__;}
      else
      {
         if(!$h){$h=mksesn($u); kuki($h,'...');}
         else{$u=pget("$/Proc/temp/sesn/$h/USER");}; if(isee("/User/data/$u/clan")){$k=pget("/User/data/$u/clan");};
      };

      $s=stak(); if(!$f||!$l){$f=$s[0]->file; $l=$s[0]->line;};

      $f=str_replace(envi('COREPATH'),'',$f); $m=str_replace(envi('COREPATH'),'',$m);
      $d=array('name'=>'Boot', 'mesg'=>$m, 'file'=>$f, 'line'=>$l, 'stak'=>array(), 'user'=>$u, 'clan'=>$k);
      $d=base64_encode(json_encode($d)); $r=file_get_contents($p); $r=str_replace('(~DBUGDATA~)',$d,$r);
      $d=knob(dval(pget('$/Proc/conf/badRobot'))); $r=str_replace('(~GAGROBOT~)',$d->lure,$r);
      echo $r; die();
   }
# ---------------------------------------------------------------------------------------------------------------------------------------------



# func :: depend : check depency path permissions .. prefixes are R,W,F,D,L .. R is default on all .. will halt 424 if not met
# ---------------------------------------------------------------------------------------------------------------------------------------------
   function depend()
   {
      $a=args(func_get_args()); $r=[]; foreach($a as $d)
      {
         $p=explode(':',$d); if(!isset($p[1])){array_unshift($p,'R');}; $q=$p[0]; $p=$p[1]; $p=path($p); if(!$p){continue;}; // validate vars
         $m=[]; $q=str_split($q); if(!in_array('R',$q)){array_unshift($q,'R');};

         if(in_array('R',$q)&&!isee($p)){$m[]="readable ";};
         if(in_array('W',$q)&&!is_writable($p)){$m[]="writable ";};
         if(in_array('D',$q)&&!is_dir($p)){$m[]="folder";};
         if(in_array('F',$q)&&!is_file($p)){$m[]="file";};
         if(in_array('L',$q)&&!is_link($p)){$m[]="link";};

         if(count($m)){$m=implode(' ',$m); $p=crop($p); $r[]="expecting `$p` as `$m` ..";};
      };

      if(count($r)<1){return;}; $r=implode(' and ', $r);
      return $r;
   }
# ---------------------------------------------------------------------------------------------------------------------------------------------



# func :: hack : for wannabe hackers .. of the bad variety
# ---------------------------------------------------------------------------------------------------------------------------------------------
   function hack($d=null)
   {
      register_shutdown_function(function(){}); if(!headers_sent()){header_remove();}; while(ob_get_level()){ob_end_clean();};
      if(is_string($d)){$d=base64_encode($d); die($d);}; $m=wack(); $m=base64_encode($m); die($m);
   }

   function wack()
   {
      $l=pget('$/Proc/info/hack.inf'); if(!$l){$l="and stay out!\nyou broke it, bravo!";}; $l=explode("\n",$l);
      $i=array_rand($l); $m=$l[$i]; return $m;
   }
# ---------------------------------------------------------------------------------------------------------------------------------------------



# func :: cbot : check bot .. $k is for "kill if bad bot" .. suspect bots use single chars as ua-string, or visit denied paths in `robots.txt`
# ---------------------------------------------------------------------------------------------------------------------------------------------
   function cbot($k=false)
   {
      $s=envi('USER_AGENT'); if(!$s){if($k){kbot();}}; $b=envi('BOTMATCH'); $p=envi('URL');
      $x=trim(str_replace(str_split(' *.-_?!#&~:,|^'),'',$s));  // susual uspects
      if(strlen($x)<3){if($k){kbot();}; return true;}; // yup
      // $x=strpos(envi('ACCEPT'),'/'); if(!$x){if($k){kbot();}; return true;}; // watcha' want huh?

      if(test($s,"/$b/i")){return true;}; $c=dval(pget('$/Proc/conf/badRobot'));
      $l=((is_assoc_array($c)&&isset($c['lure']))?$c['lure']:0); if(!is_string($l)||(strlen($l)<2)){$l=0;};
      if($l&&$p&&(strpos($p,$l)!==false)){if($k){kbot();}; return true;};
      $h=sha1(envi('USERADDR').$s); $p=isee("$/Proc/temp/bots/$h");
      return ($p?true:false);
   }
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
   function dval($d,$z=0)
   {
      if(!is_string($d)){return $d;}; $d=trim($d); if(($d==='')||($d==='null')||($d==='VOID')){return;}; if(is_numeric($d)){return ($d*1);};
      if($d==='*'){return $d;}; if(strlen($d)<2){return $d;}; $b='(~'; $e='~)'; $x=strpos($d,$b); $n=strpos($d,"\n");
      if($x!==false){if(isee('impose')){$d=impose($d,$b,$e);}else{halt(500,'`impose` is undefined');}};
      $v=json_decode($d,true); if($v!==null){return $v;}; // covers a lot
      if(!$n&&($d[0]==='+')){$v=substr($d,1); if(is_numeric($v)){return ($v*1);}}; // positive number
      $q=strpos($d,'`'); $p=strpos($d,': '); $c=strpos($d,',');
      $w=wrapOf($d); if(($w==='``')&&(substr_count($d,$w[0])<3)){$v=unwrap($d); return $v;};
      if($c&&!$n&&!$q&&(strpos($d,'(')===false))
      {
          $r=explode(',',$d); $z=[]; foreach($r as $t)
          {$t=dval($t); if(!is_assoc_array($t)){$z[]=$t; continue;}; unset($k,$v); foreach($t as $k => $v){$z[$k]=$v;}};
          return $z;
      };
      if(!$n&&$z){return $d;}; // no further parsing needed

      $a=explode("\n",$d); $r=[]; foreach($a as $l)
      {
          $l=trim($l); if($l===""){continue;}; $p=strpos($l,': '); $q=strpos($l,'`');
          if(!$p||($p&&$q&&($q<$p))){$r[]=dval($l,1); continue;}; // simple
          $p=stub($l,': '); $k=trim($p[0]); $v=dval($p[2],1); $r[$k]=$v; continue;
      };

      if(empty($r)){return;}; if(is_assoc_array($r)){return $r;}; if(!$n){return $r[0];}; return $r;
   }
# ---------------------------------------------------------------------------------------------------------------------------------------------



# tool :: knob : plain object
# ---------------------------------------------------------------------------------------------------------------------------------------------
   class knob
   {
      function __construct($d,$u=0)
      {
          foreach($d as $k => $v){if(is_assoc_array($v)){$v=(new knob($v,$u));}; if($u){$k=unwrap($k);}; $this->$k=$v;}
      }

      function __get($k){if(property_exists($this,$k)){return $this->$k;};}
      function __call($k,$a){if(property_exists($this,$k)){return call_user_func_array($this->$k,$a);}; fail("undefined method `$k`");}
      function __toString(){$r=json_encode($this,JSON_UNESCAPED_SLASHES); return $r;}
   }

   function knob($d=[],$unwrap=null)
   {
      if(is_string($d)){$d=trim($d); if(($d==='')||(!strpos($d,':')&&!isee($d))){return (new knob([]));}};
      if(is_object($d)&&($d instanceof knob)){return $d;};
      if(is_array($d)||is_object($d)){return (new knob($d,$unwrap));}; if(!is_string($d)){return (new knob([]));};
      if(is_string($d)&&strpos($d,':')){$d=dval($d); if(is_assoc_array($d)){return (new knob($d));}};
      $p=isee($d); if(!$p){return (new knob([]));};$x=pget($d);if(is_string($x)){$x=dval($x); return (new knob((is_assoc_array($x)?$x:[])));};
      $r=(new knob([])); foreach($x as $i)
      {
         $p=isee("$d/$i"); if(is_dir($p)){$r->$i=[];}elseif(is_link("$d/$i")){$r->$i=readlink("$d/$i");}else
         {$m=fext("$d/$i"); if($m&&!in_array($m,['inf','json'])){continue;}; $v=dval(pget("$d/$i")); $r->$i=(is_array($v)?knob($v):$v);};
      };
      return $r;
   }
# ---------------------------------------------------------------------------------------------------------------------------------------------



# refs :: constants : these help us express specific directives .. they all have the value of the word wrapped in `:` .. like :AUTO:
# ---------------------------------------------------------------------------------------------------------------------------------------------
   defn('AUTO KEYS VALS WORD XACT VOID NONE STEM TOOL FUNC PATH FOLD FILE LINK DUMP DONE GOOD INFO WARN FAIL MINI MIDI MAXI SKIP STOP TODO');
   defn('INIT BARE LOOP REPO DENY AFTR BFOR FLAT DEEP HIDN EMPT GONE FULL SPAN MIDL TREE FLOG OK');
   defn('A B C D E F G H I J K L M N O P Q R S T U V W X Y Z');
   defn('count fetch using alter write claim touch where group order limit parse shape apply erase purge debug dbase table field sproc funct after basis named param parts');
   defn('NOFAIL NOINIT NOMAKE NOEXIT DOEXIT NATIVE REMOTE ORIGIN FORGET');
   defn('ANY ALL ASC DSC API BOT DPI GUI SSE');
# ---------------------------------------------------------------------------------------------------------------------------------------------



# vars :: (POSTed) : convert text-body json to POST-vars
# ---------------------------------------------------------------------------------------------------------------------------------------------
   if((envi('METHOD')==='POST')&&facing('API')){$d=file_get_contents('php://input'); if(wrapOf($d)==='{}')
   {$d=json_decode($d); foreach($d as $k => $v){$_POST[$k]=$v;}}; unset($d,$k,$v);};
# ---------------------------------------------------------------------------------------------------------------------------------------------



# dbug :: vars : USERADDR - ip address .. if no ip then the request is bogus .. get rid of unsupported requests
# ---------------------------------------------------------------------------------------------------------------------------------------------
   unset($sd,$bn,$bp,$rb); $l=explode(' ','CLIENT_IP FORWARDED_FOR FORWARDED REMOTE_ADDR'); $y=0; $s=count($l); for($i=0; $i<$s; $i++)
   {$v=$l[$i]; $x="X_$v"; $z="$v"; if(envi($x)){$y=$x;}elseif(envi($z)){$y=$z;}elseif(envi($v)){$y=$v;}else{$y=0;}; if($y){break;};};
   if(!$y){header("HTTP/1.1 400 Bad Request"); die();}; $_SERVER['USERADDR']=envi($y);  unset($l,$y,$s,$i,$v,$x,$z);
# ---------------------------------------------------------------------------------------------------------------------------------------------



# dbug :: pre-flight : check essential server vars .. set roots .. get rid of bad bots .. check if web-server passed us the right stuff
# ---------------------------------------------------------------------------------------------------------------------------------------------
   if(envi('ROOTPATH DBUGPATH HOST SCHEME BOTMATCH')!==1){header("HTTP/1.1 424 Failed Dependency - server vars"); die();}; // bad vars
   $d=envi('ROOTPATH'); $s=skey(); $u=''; $c=envi('COREPATH'); //$c=explode('/',envi('COREPATH')); $c=array_pop($c);
   $g=envi('DBUGPATH'); $b=envi('HREFBASE'); $_SERVER['BASEPATH']=($b?$b:$d);
   $_SERVER['DBUGPATH']=($b?lshave($g,"$b/.anon.dir"):lshave($g,".anon.dir")); unset($g);
   if($s){$s="$c/Proc/temp/sesn/$s/USER"; if(file_exists($s)){$u=file_get_contents($s);}};
   if(!$u){$u='anonymous';}; $_SERVER['USERNAME']=$u; $_SERVER['USERPATH']="$c/User/data/$u/home";
   if(!envi('ACCEPT')){$_SERVER['ACCEPT']=envi('CONTENT_TYPE');};

   $h=pget('$/Proc/conf/hostName');
   if(!$h){$h=envi('HOST'); if($b&&(strpos($h,"$b.")!==0)){$h="$b.$h";}}
   elseif($h!==envi('HOST')){header("Location: ".envi('SCHEME').'://'.$h.envi('URI')); exit;}; // KEEP IT REAL!

   $p=envi('URL'); $b=envi('BASEPATH'); if($b!=='/'){$p=lshave($p,"/$b");}; if(!$p){$p='/';}; unset($b);
   defn
   ([
      'HOSTNAME' => $h,
      'NAVIPATH' => $p,
   ]);
   unset($h,$p,$b);

   $z=pget('$/Proc/conf/timeZone'); if(is_string($z)&&(strpos($z,'/'))){date_default_timezone_set("$z");}; unset($z); // set server time zone
   $_SERVER['oblevl']=0; $_SERVER['obfail']=''; $_SERVER['cbfail']=null; // for deFail & enFail
   $_SERVER['SESNHASH']=null; $_SERVER['SESNUSER']=null; $_SERVER['SESNCLAN']=null; // for security .. bite me


   $q=envi('URL'); $dbwp='/User/dcor/wal1.jpg'; $dbbs='/User/dcor/anm1.gif';
   if((strpos($q,$dbwp)!==false)&&isee($dbwp)){header('Content-Type: image/jpeg'); readfile(isee($dbwp)); exit;};
   if((strpos($q,$dbbs)!==false)&&isee($dbbs)){header('Content-Type: image/gif'); readfile(isee($dbbs)); exit;}; unset($dbwp,$dbbs);
   if((strlen($q)>8)&&((substr($q,-7,7)==='.js.map')||(substr($q,-8,8)==='.css.map'))){die('');}; unset($q); // hands off!!
   $b=cbot(true); // check for bad robot .. if facing bad-robot then bot is "served" and the process exits here ... rinse and repeat

   $h=sha1(envi('USERADDR').envi('USER_AGENT')); $p=path("$/Proc/temp/kban/$h"); if(is_link($p))
   {
      $h=(readlink($p)*1); $n=time(); $t=lstat($p); if(isset($t['ctime'])){$t=$t['ctime'];}elseif(isset($t['mtime'])){$t=$t['mtime'];};
      if($t){$d=($n-$t); if($d>=$h){unlink($p);}else{harakiri(wack());}}; // kill-ban .. lift or hold
   };

   if($b){$_SERVER['INTRFACE']='BOT';}; // facing BOT .. it's behaving for now so all seems OK this far

   $m=pget('$/Proc/conf/autoMail'); $MM="$m"; if(!$m){$m=envi('SERVER_ADMIN');}else
   {
       $m=explode('?',$m)[0]; $m=rshave($m,'/'); $m=explode('@',$m); $d=$m[1];
       $u=explode('//',$m[0]); $u=explode(':',$u[1]); $u=$u[0]; $m="$u@$d";
   };
   $_SERVER['TECHMAIL']=$m;

   unset($d,$x,$c,$s,$b,$h,$p,$n,$t,$m,$u); // clean up
   $_SERVER['ALPHABET']='0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';  // we need this
# ---------------------------------------------------------------------------------------------------------------------------------------------



# cond :: defn : set UpKeeper global for use later .. no need to check again later in runtime
# ---------------------------------------------------------------------------------------------------------------------------------------------
   $_SERVER['UPKEEPER']=''; $_SERVER['SYSCLOCK']=knob('$/Proc/conf/sysClock');
   if(!in_array(NAVIPATH,["/User/upload","/Proc/execPath","/Proc/xenoCall","/Proc/makeTodo"]))
   {
      $key=skey(); $dbs=$_SERVER['SYSCLOCK']->upkeep; if(!$dbs){$dbs=180;}; $ldb=pget('$/Proc/vars/lastDbug');
      if(!$ldb){$ldb=1;}; $ldb=($ldb*1); $tdf=(time()-$ldb); $upk=0; if(isset($_GET['upkeep'])){$upk=$_GET['upkeep'];};
      $_SERVER['UPKEEPER']=(((!$ldb||($tdf>$dbs)||$upk)?$ldb:"").""); unset($dbs,$ldb,$tdf,$upk);
      if(envi('UPKEEPER')&&!pget('$/Proc/conf/hostName')){pset('$/Proc/conf/hostName',HOSTNAME);}; unset($key);
   };
# ---------------------------------------------------------------------------------------------------------------------------------------------



# dbug :: platform : check for expected PHP version and extensions .. demand short open tag
# ---------------------------------------------------------------------------------------------------------------------------------------------
   if(isee('mbstring curl zlib')!==1){halt(424,'Failed Dependency - need PHP extensions: mbstring, curl, zlib');}; // required extensons
   if(''===trim(trim(strtolower((ini_get('short_open_tag').'')),'off'),'0')){halt(424,'Failed Dependency - short_open_tag');}; // bad htconf
# ---------------------------------------------------------------------------------------------------------------------------------------------



# dbug :: protocol : force https .. this cannot be done reliably in .htaccess
# ---------------------------------------------------------------------------------------------------------------------------------------------
   if((envi('USER_AGENT')==='SYS:Verify-SSL')&&(envi('SCHEME')==='https')){die('OK');}; // STILL ALIVE .. we took an introspection trip
   if(envi('SCHEME')!=='https')
   {
      $a='SYS:Verify-SSL'; if(envi('USER_AGENT')===$a){die('?');}; $h=envi('HOST'); $p=("https://$h"); $r=spuf($p,$a,$h,3);
      if($r==='OK'){$p=($p.envi('QUERY_STRING')); header("Location: $p"); exit;}; // continue our journey on our new found sense of security
      if(strpos($r,'Could not resolve')!==false){$q=spuf("http://$h",$a,$h,3); if($q!=='?'){halt(500,'epic');}}; // DIED .. invalid host config
      if(strpos($r,'timed out')!==false){halt(500,'epic');}; // YOU HAVE DIED .. missing/invalid SSL config
      if((strpos($r,'SSL')!==false)&&(strpos($r,'not match')!==false)){halt(500,'epic');}; // YOU HAVE DIED .. broken SSL certificate
      halt(500,"SSL check ~ $r");  // YOU HAVE DIED ... our journey ended because we are too insecure ... invalid SSL
   };
# ---------------------------------------------------------------------------------------------------------------------------------------------



# dbug :: core : required for expected functionality
# ---------------------------------------------------------------------------------------------------------------------------------------------
   if(envi('UPKEEPER'))
   {
       if(!isee('$/Proc/temp/sesn/')){pset('$/Proc/temp/sesn/');}; // create if not exist
       if(!isee('$/Proc/temp/lock/')){pset('$/Proc/temp/lock/');}; // create if not exist
       if(!isee('$/Proc/temp/logs/')){pset('$/Proc/temp/logs/');}; // create if not exist
       $d=depend('RF:$/Proc/base/boot.php','RF:$/Proc/base/dbug.php','WD:$/Proc/temp/sesn'); // get fail message -if any
       if($d){halt(424,"Failed Dependency - $d");}; unset($d); // fail if bootstrapper is compromised
       usleep(1000);
   };
# ---------------------------------------------------------------------------------------------------------------------------------------------



# dbug :: vars : USERDEED - request method as "CRUD" word
# ---------------------------------------------------------------------------------------------------------------------------------------------
   $l=array('OPTIONS'=>'permit','GET'=>'select','PUT'=>'update','POST'=>'insert','HEAD'=>'descry','DELETE'=>'delete','CONNECT'=>'listen');
   $x=envi('REQUEST_METHOD'); if(isset($l[$x])){$_SERVER['USERDEED']=$l[$x];}else{header('HTTP/1.1 405 Method Not Allowed'); die();};
   if($x=='OPTIONS'){$l=implode(array_keys($l,', ')); header('HTTP/1.1 200 OK'); header("Allow: $l"); die();}; unset($x,$l); // all is well
# ---------------------------------------------------------------------------------------------------------------------------------------------



# dbug :: vars : INTRFACE - identify the kind of interface .. verify REFERER from "self" .. deny bots any methods other than HEAD and GET
# ---------------------------------------------------------------------------------------------------------------------------------------------
   $m=envi('ACCEPT'); $a=envi('USER_AGENT'); $h=HOSTNAME; $p=envi('URL'); $x=fext($p); $k=skey();
   $r=envi('REFERER'); $b=trim(envi('INTRFACE')); $s=(strpos($r,"https://$h")===0);
   $f=envi('DBUGPATH'); $_SERVER['MADEFUBU']=(($s&&$k)?"yes":"");

   if($s&&!$k&&(($b&&($b!=='BOT'))||posted('INTRFACE')||kuki('INTRFACE')))
   {
       $p=envi('URI'); header("Location: https://{$h}{$p}"); exit;
   };


   if(($s&&!$k)&&($p!==$f)){$s=false;}; // logged out


   if($s&&!$k)
   {
      if($b==='BOT'){halt(503,'Service Unavailable');}; // here be deamons posing as ourselves to do its bidding .. scary sh!t
      $r=pget($f); $r=str_replace('(~TECHMAIL~)',envi('TECHMAIL'),$r);
      $r=str_replace('(~DUMPMESG~)',base64_encode('from us, but no sesn'),$r);
      print_r($r); flush(); die(); // cookies disabled ? .. YOU HAVE DIED
   };

   if(($b&&($b!=='BOT'))||posted('INTRFACE')||kuki('INTRFACE'))
   {
      if(!$k){harakiri('missing -or invalid session key');}; // YOU HAVE DIED
      $fn=($b?$b:posted('INTRFACE')); if(!$fn){$fn=kuki('INTRFACE');};
      $_SERVER['INTRFACE']="$fn"; unset($fn);
   };

   if($b==='BOT'){$i='BOT';}
   elseif(strpos($a,'SYS :: ',true)===0){$i='SYS';}
   elseif($m==='text/event-stream'){$i='SSE';}
   elseif(envi('INTRFACE')){$i=envi('INTRFACE');}
   elseif((($m==='application/json')&&($x!=='json'))||(($m==='text/plain')&&($x!=='txt'))){$i='API';}
   elseif($_SERVER['MADEFUBU']&&($_SERVER['USERDEED']==='insert')){$i='API';}
   elseif($s&&$k&&(kuki($k)==='...')){$i='DPR';}else{$i='GUI';};

   if(($i==='BOT')&&!in_array(envi('USERDEED'),array('descry','select'))){harakiri('Method Not Allowed');}; // silly bot .. YOU HAVE DIED
   if(($p===envi('DBUGPATH'))&&($i!=='BOT')){$i='DPR';};

   // if(($i!=='APH')&&isee("/index.php")){$i='APH';} // Alternative Process Handler
   // elseif($i==='SYS')
   if($i==='SYS')
   {
      $sk=pget('$/Proc/info/host.key'); if(!$sk){harakiri('invalid hostkey');}; // YOU HAVE DIED
      $ck=explode(' :: ',$a); $ck=explode(' : ',$ck[1]); $ck=$ck[0];
      if($sk!==$ck){harakiri(wack());}; // else .. YOU HAVE DIED
      unset($sk,$ck);
   }
   elseif($i==='API')
   {
      if(!$k){harakiri('missing -or invalid session key');}; // YOU HAVE DIED
   }
   elseif($i==='GUI')
   {
      $s=envi("PATHSTEM");
      if((envi("USERDEED")==="select")&&envi("MADEFUBU")&&(strpos(NAVIPATH,"/$s/")===0)){$i='DPR';}
      elseif(isset($_GET['k'])&&($_GET['k']===$k)){$i='DPR';}; // for web-workers that have no REFERER .. ya ikr
   };

   $_SERVER['INTRFACE']=$i; defn(['USERSKEY'=>$k]);
   if(!(envi("MADEFUBU")&&facing('API SSE'))||!$MM){$_SERVER['UPKEEPER']='';};
   // upkeep is only available for API-calls made FUBU -and when autoMail has been set

   $vl=array_keys(get_defined_vars());
   foreach($vl as $vn){if(substr($vn,0,1)==="_"){continue;}; unset($$vn);}; unset($vl,$vn);
# ---------------------------------------------------------------------------------------------------------------------------------------------



# info :: proc : here we are out of "the swamp" .. we got rid of BS and identified the interface .. next we boot through "the woods"
# ---------------------------------------------------------------------------------------------------------------------------------------------
   require ($_SERVER['COREPATH'].'/Proc/base/boot.php'); // check in here for more info
# ---------------------------------------------------------------------------------------------------------------------------------------------
