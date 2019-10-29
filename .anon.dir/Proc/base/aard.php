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
   $z=pget('/Proc/conf/timeZone'); if(is_string($z)&&(strpos($z,'/'))){date_default_timezone_set("$z");}; unset($z); // set server time zone
   $_SERVER['oblevl']=0; $_SERVER['obfail']=''; $_SERVER['cbfail']=null; // for deFail & enFail
   $_SERVER['SESNHASH']=null; $_SERVER['SESNUSER']=null; $_SERVER['SESNCLAN']=null; // for security .. bite me
# ---------------------------------------------------------------------------------------------------------------------------------------------



# func :: (dbug) : disable and enable errors .. to silence warnings/notices picked up by error handler
# ---------------------------------------------------------------------------------------------------------------------------------------------
   function deFail($cb=null)
   {
      ini_set('display_errors',false); error_reporting(0); usleep(1000); $_SERVER['nofail']=1; $l=ob_get_level();
      if(!$l){$l=0;}; $_SERVER['oblevl']=$l; $_SERVER['obfail']=''; $_SERVER['cbfail']=$cb; ob_start();
   }

   function enFail()
   {
      ini_set('display_errors',true); error_reporting(E_ALL); usleep(1000);
      $_SERVER['nofail']=0; $cl=ob_get_level();
      $r=''; if($cl>0){$r=ob_get_clean();}; $r=trim($r); if($r===''){$r=$_SERVER['obfail'];}; $pl=$_SERVER['oblevl'];
      if(is_int($pl)&&($pl<1)&&($cl>0)){while(ob_get_level()>0){ob_end_clean();}; $_SERVER['oblevl']=0;};
      $_SERVER['obfail']=''; $_SERVER['cbfail']=null; return $r;
   }
# ---------------------------------------------------------------------------------------------------------------------------------------------



# shiv :: tools : provide expected functionality
# ---------------------------------------------------------------------------------------------------------------------------------------------
   function is_nokey_array($d){if(!is_array($d)){return false;}; return (empty($d)||(array_keys($d)===range(0,(count($d)-1))));} // numeric
   function is_assoc_array($d){return (is_array($d)&&!empty($d)&&(count(array_filter(array_keys($d),'is_string'))>0));} // associative

   function is_closure($d){if(is_object($d)){return (($d instanceof \Closure));}; return false;}; // function
   function facing($a){return (envi('INTRFACE')===$a);} // assert interface .. usage:  if(facing('BOT')){};

   function fractime($p=3) // precision time NOW .. default is milliseconds
   {if(!is_int($p)||($p<1)){return time();}; $r=microtime(true); $r=round($r,$p); return $r;};

   function lowerCase($d){if(is_string($d)){return strtolower($d);};}
   function upperCase($d){if(is_string($d)){return strtoupper($d);};}
   function proprCase($d){if(is_string($d)){return ucwords(strtolower($d));};}

   function isLowerCase($d){return (strtolower($d)===$d);}
   function isUpperCase($d){return (strtoupper($d)===$d);}
   function isProprCase($d){return (ucwords($d)===$d);}

   function is_number($d){return (is_int($d)||is_float($d)||is_real($d));};
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

      if(!headers_sent())
      {
         header("HTTP/1.1 200 OK");
         header("Cache-Control: no-store, no-cache, must-revalidate"); // HTTP/1.1
         header("Cache-Control: post-check=0, pre-check=0",false);
         header("Expires: Sat, 26 Jul 1997 05:00:00 GMT");
         header("Pragma: no-cache"); // HTTP/1.0
         header("Last-Modified: ".gmdate("D, d M Y H:i:s")." GMT");
         header('Content-Type: text/plain');
      };

      if(!is_string($sb)){$sb=tval($sb);}; bufrVoid(); echo $sb; bufrSend(); die();
   };
# ---------------------------------------------------------------------------------------------------------------------------------------------



# func :: lshave/rshave : alternative to ltrim/rtrim -which f*cks up with slashes .. this plays nice .. default is once .. bool(true) recurs
# ---------------------------------------------------------------------------------------------------------------------------------------------
   function lshave($a,$b=null,$r=false)
   {
      if(!is_string($a)){return;}; if(!is_string($b)){return ltrim($a);}; $s=strlen($b); if(!$s||(strlen($a)<$s)){return $a;};
      if(substr($a,0,$s)!==$b){return $a;}; do{$a=substr($a,$s);}while($r&&(substr($a,0,$s)===$b));
      return $a;
   }

   function rshave($a,$b=null,$r=false)
   {
      if(!is_string($a)){return;}; if(!is_string($b)){return rtrim($a);}; $s=strlen($b); if(!$s||(strlen($a)<$s)){return $a;};
      if(substr($a,(0-$s),$s)!==$b){return $a;}; do{$a=substr($a,0,(strlen($a)-$s));}while($r&&(substr($a,(0-$s),$s)===$b));
      return $a;
   }

   function shaved($a,$b=null,$r=false)
   {
      if(!is_string($a)){return;}; if(!is_string($b)){return trim($a);};
      $z=lshave($a,$b,$r); $z=rshave($z,$b,$r);
      return $z;
   }
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
      if(substr($p,-1,1)==='.'){return;};
      if(!$r||!$c||!$u){return $p;}; if($p===''){return $r;}; if($p==='$'){return $c;}; if($p==='~'){return $u;}; // works for: ./  $/  ~/
      if((strpos($p,$u)===0)||(strpos($p,$c)===0)||(strpos($p,$r)===0)){return $p;}; $s=substr($p,0,1); $p=ltrim($p,'$/'); $p=ltrim($p,'~/');
      if($s==='$'){return "$c/$p";}; if($s==='~'){return "$u/$p";}; if($s!=='/'){return;}; $p=ltrim($p,'/'); $t=explode('/',$p); $t=$t[0];
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



# func :: isee : check existance of a reference in order: path, function, class, extension .. checks path readability .. no autoload
# ---------------------------------------------------------------------------------------------------------------------------------------------
   function isee($d)
   {
      if($d==='/'){return envi('ROOTPATH');}; if($d==='$'){return envi('COREPATH');}; if($d==='~'){return envi('USERPATH');};
      if(is_string($d)){$d=trim($d); if(strlen($d)<2){return;}; $d=str_replace(' ',',',$d); if(strpos($d,',')){$d=explode(',',$d);}};

      if(is_array($d))
      {$s=count($d); $f=array(); do{$i=array_shift($d); $i=isee($i); if($i){$f[]=$i;}}while(count($d)); $r=(count($f)/$s); return $r;};

      if(!is_string($d)){return;}; $d=str_replace('Anon\\','',trim($d)); $v=test($d,'/^([a-zA-Z])([a-zA-Z0-9_]){2,36}$/');
      if(!$v){$p=path($d); if(!$p){return;}; $f=0; deFail(); $r=is_readable($p); $f=enFail(); if(!$r||$f){$p=null;}; return $p;}; $c='Anon\\';
      if(function_exists($d)||function_exists($c.$d)){return 'func';}; if(class_exists($d,false)||class_exists($c.$d,false)){return 'tool';};
      if(extension_loaded($d)){return 'extn';};
   }
# ---------------------------------------------------------------------------------------------------------------------------------------------



# func :: pget : path get .. read contents of path .. returns null if invalid .. returns string if file .. returns array if dir
# ---------------------------------------------------------------------------------------------------------------------------------------------
   function pget($p,$t=true)
   {
      $p=isee($p); if(!$p){return;}; if(!is_dir($p)){$r=file_get_contents($p); if($t){$r=trim($r);}; return $r;};
      $r=array_diff(scandir($p),array('.','..')); if(!$t){return array_values($r);};
      $z=array(); do{$i=array_shift($r); if($i===null){continue;}; $c=substr($i,0,1); if($c!=='.'){$z[]=$i;};}while(count($r));
      $z=array_values($z); sort($z); return $z;
   };
# ---------------------------------------------------------------------------------------------------------------------------------------------



# func :: pset : create path .. will create subdirs recursively .. be careful with this, use it with `lock::awaits`
# ---------------------------------------------------------------------------------------------------------------------------------------------
   function pset($p,$v='')
   {
      if(!is_string($p)){return;}; if(strlen($p)<2){return;}; $d=0; if(substr($p,-1,1)==='/'){$d=1;}; $p=path($p); if(!$p){return;};
      if($d&&is_dir($p)){return true;}; $h=rshave($p,'/'); $h=explode('/',$h); $b=array_pop($h); $h=implode('/',$h); $u=umask(); umask(0);
      if(!isee($h)){$r=explode('/',$h); array_pop($r); $r=implode('/',$r); if(!is_writable($r)){return;}; mkdir($h,0777,true);};
      if($d){$r=mkdir($p,0777,true);}else{$r=file_put_contents($p,$v);}; umask($u); return $r;
   };
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



# func :: spuf : simple http-request .. can be used for spoofing .. or not .. using a proxy is better for REMOTE_ADDR, blessed be the ignorant
# ---------------------------------------------------------------------------------------------------------------------------------------------
   function spuf($uri,$uas=null,$ref=null)
   {
      if(!is_string($uri)){return;}; if(strpos($uri,'http')===false){return;}; if(!isee('curl')){return;}; $ipa=envi('USERADDR');
      if(!$uas){$uas=envi('USER_AGENT');}; if(!$ref){$ref=envi('REFERER'); if(!$ref){$ref='http://example.com/index.html';}};
      $o=array(CURLOPT_RETURNTRANSFER=>1,CURLOPT_SSL_VERIFYPEER=>false,CURLOPT_URL=>$uri,CURLOPT_USERAGENT=>$uas,CURLOPT_REFERER=>$ref);
      $c=curl_init(); curl_setopt_array($c,$o); curl_setopt($c,CURLOPT_HTTPHEADER,array("REMOTE_ADDR: $ipa", "HTTP_X_FORWARDED_FOR: $ipa"));
      $r=curl_exec($c); $e=null; if(!$r){$x=curl_error($c); if($x){$e=$x;};}; curl_close($c);
      if($e){return "FAIL :: $e";}; return $r;
   };
# ---------------------------------------------------------------------------------------------------------------------------------------------



# func :: kbot : kill identified bad bot .. if conf/badRobot lure & trap is set then list poisoning takes effect .. kbot will exit regardless
# ---------------------------------------------------------------------------------------------------------------------------------------------
   function kbot()
   {
      register_shutdown_function(function(){}); if(!headers_sent()){header_remove();}; while(ob_get_level()){ob_end_clean();};
      $h=sha1(envi('USERADDR').envi('USER_AGENT')); $d=path('/Proc/temp/kban'); $p="$d/$h"; $k=pget('/Proc/conf/kbanSecs');
      if(!$k){$k=900;}; if(!is_link($p)&&is_writable($d)){symlink("$k",$p);}; // shoo away this visitor for any URL they visit for $k seconds
      $f=pget('/Proc/conf/badRobot'); $h='HTTP/1.1 503 Service Unavailable'; if(!$f){header($h); die();}; $f="$f\n";
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
   function kuki($k,$v='<:(/*\):>')
   {
      if(!is_string($k)){return;}; if(strlen($k)!==strlen(trim($k))){return;}; // validate cookie-name
      if($v==='<:(/*\):>'){if(!isset($_COOKIE[$k])){return;}; return $_COOKIE[$k];}; // get
      if(($v==='')||($v===':VOID:')){$v=null;}; if($v===null){setcookie($k,$v,-1,'/',envi('HOST')); unset($_COOKIE[$k]);}; // delete
      setrawcookie($k,$v,0,'/',envi('HOST')); $_COOKIE[$k]=$v; return true; // set
   };
# ---------------------------------------------------------------------------------------------------------------------------------------------



# func :: post : get posted variable-value by name .. returns value -or null if undefined
# ---------------------------------------------------------------------------------------------------------------------------------------------
   function post($n)
   {
      if(!is_string($n)||(strlen($n)<1)){return;}; if(!isset($_POST[$n])){return;}; return $_POST[$n];
   };
# ---------------------------------------------------------------------------------------------------------------------------------------------



# func :: random : creates random string from ALPHABET .. $l is the char-length
# ---------------------------------------------------------------------------------------------------------------------------------------------
   function random($l=null)
   {
      if(!is_int($l)){$l=6;}; if($l<0){$l=6;}; $r=str_shuffle(envi('ALPHABET')); $r=substr($r,0,$l); return $r;
   }
# ---------------------------------------------------------------------------------------------------------------------------------------------



# func :: mksesn : generates a new session key and creates a session folder for a specified user .. returns the key
# ---------------------------------------------------------------------------------------------------------------------------------------------
   function mksesn($u)
   {
      if(!is_string($u)||(strlen($u)<1)){harakiri('invalid username');}; // YOU HAVE DIED
      $k=sha1(random(9).microtime(true).envi('USERADDR').getmypid().random(9)); // if this is not unique then bite me
      if(!isee("/User/data/$u")){harakiri("user `$u` is undefined");}; // YOU HAVE DIED
      pset("/Proc/temp/sesn/$k/USER",$u); return $k; // all is well
   }
# ---------------------------------------------------------------------------------------------------------------------------------------------



# func :: skey : returns session key
# ---------------------------------------------------------------------------------------------------------------------------------------------
   function skey()
   {
      $l=array_keys($_COOKIE); if(count($l)<1){return;}; $r=null; $t='/^[a-z0-9]{40}$/'; $c=envi('COREPATH'); $h="$c/Proc/temp/sesn";
      $n=null; do{$n=array_pop($l); if(!test($n,$t)){$n=null; continue;}; if(is_dir("$h/$n")){$r=$n;break;}}while(count($l));
      if($r){return $r;}; // session is cookie-based .. it exists as a live session-dir server-side .. all is well
      if($n){kuki($n,null); $s=envi('SCHEME'); $h=envi('HOST'); $p=envi('URI'); header("Location: $s://{$h}{$p}");}; // bad session key
      $r=kuki('APIKEY'); if(!$r){$r=post('APIKEY');}; if(!$r){$r=envi('APIKEY');}; if(!$r){return;}; // no key
      if(!test($r,$t)){harakiri(wack());}; // invalid session key .. YOU HAVE DIED
      if(is_dir("$h/$r")){return $r;}; // session is live
      $u=pget("/Proc/keys/$r"); if(!$u){harakiri(wack());}; // invalid session key .. YOU HAVE DIED
      $n=mksesn($u); return $n; // if all went well, we are still alive .. all is well
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
      if($a===null){return [];}; if(!is_nokey_array($a)){return [$a];}; if(!isset($a[0])){return [];};
      if(is_nokey_array($a[0])){return $a[0];}; return $a;
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
      foreach($b as $i => $o){if(($i===$x)||($o->func===$n)){$y=1; continue;}; if($y){$r[]=$o;};}; if(count($r)>0){return $r;}; return $b;
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

      if(!isee('/Proc/temp/sesn')){$c=424; $m='Failed Dependency - readable temp.sesn'; $f=__FILE__; $l=__LINE__;}
      elseif(!is_writable(isee('/Proc/temp/sesn'))){$c=417; $m='Expectation Failed - writable temp.sesn'; $f=__FILE__; $l=__LINE__;}
      else
      {
         if(!$h){$h=mksesn($u); kuki($h,'...');}
         else{$u=pget("/Proc/temp/sesn/$h/USER");}; if(isee("/User/data/$u/clan")){$k=pget("/User/data/$u/clan");};
      };

      $s=stak(); if(!$f||!$l){$f=$s[0]->file; $l=$s[0]->line;};

      $f=str_replace(envi('COREPATH'),'',$f); $m=str_replace(envi('COREPATH'),'',$m);
      $d=array('name'=>'Boot', 'mesg'=>$m, 'file'=>$f, 'line'=>$l, 'stak'=>array(), 'user'=>$u, 'clan'=>$k);
      $d=base64_encode(json_encode($d)); $r=file_get_contents($p); $r=str_replace('{:(DBUGDATA):}',$d,$r);
      echo $r; die();
   }
# ---------------------------------------------------------------------------------------------------------------------------------------------



# func :: depend : check depency path permissions .. prefixes are R,W,F,D,L .. R is default on all .. will halt 424 if not met
# ---------------------------------------------------------------------------------------------------------------------------------------------
   function depend()
   {
      $r=['R'=>'readable','W'=>'writable','F'=>'file','D'=>'folder','L'=>'link'];
      $a=args(func_get_args()); foreach($a as $d)
      {
         $p=explode(':',$d); if(!isset($p[1])){array_unshift($p,'R');}; $q=$p[0]; $p=$p[1]; $p=path($p); if(!$p){continue;}; // validate vars
         $q=str_split($q); if(!in_array('R',$q)){array_unshift($q,'R');}; $m=[]; $f=0; $t=0; foreach($q as $o)
         {
            if(!isset($r[$o])){$o='R';}; $w=$r[$o]; if(in_array($w,$m)){continue;}; $m[]=$w; if($o==='R'){$t=is_readable($p);}
            elseif($o==='W'){$t=is_writable($p);}elseif($o==='F'){$t=is_file($p);}elseif($o==='D'){$t=is_dir($p);}else{$t=is_link($p);};
            if(!$t){$f=1;};
         };
         if(!$f){continue;}; $m=implode(' ',$m); halt(424,"Failed dependency - expecting $p as $m");
      };
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
      $l=pget('/Proc/info/hack.inf'); if(!$l){$l="and stay out!\nyou broke it, bravo!";}; $l=explode("\n",$l);
      $i=array_rand($l); $m=$l[$i]; return $m;
   }
# ---------------------------------------------------------------------------------------------------------------------------------------------



# func :: cbot : check bot .. $k is for "kill if bad bot" .. suspect bots use single chars as ua-string, or visit denied paths in `robots.txt`
# ---------------------------------------------------------------------------------------------------------------------------------------------
   function cbot($k=false)
   {
      $s=envi('USER_AGENT'); if(!$s){if($k){kbot();}};
      $x=str_replace(str_split(' *.-_?!#&~:,|^'),'',$s); $x=trim($x); if(strlen($x)<3){if($k){kbot();}};  // suspects
      $x=strpos(envi('ACCEPT'),'/'); if(!$x){if($k){kbot();}};
      $b=envi('BOTMATCH'); if($b&&test($s,"/$b/i")){$b=true;}else{$b=false;}; $p=envi('URL'); $f=pget('/Proc/conf/badRobot');
      $f="$f\n"; if($p&&(strpos($f,"lure: $p\n")!==false)){if($k){kbot();};}; if($b){return $b;};
      $h=sha1(envi('USERADDR').$s); if(is_link(path("/Proc/temp/bots/$h"))){$b=true;}; return $b;
   }
# ---------------------------------------------------------------------------------------------------------------------------------------------



# dbug :: vars : USERADDR - ip address .. if no ip then the request is bogus .. get rid of unsupported requests
# ---------------------------------------------------------------------------------------------------------------------------------------------
   $l=explode(' ','CLIENT_IP FORWARDED_FOR FORWARDED REMOTE_ADDR'); $y=0; $s=count($l); for($i=0; $i<$s; $i++)
   {$v=$l[$i]; $x="X_$v"; $z="$v"; if(envi($x)){$y=$x;}elseif(envi($z)){$y=$z;}elseif(envi($v)){$y=$v;}else{$y=0;}; if($y){break;};};
   if(!$y){header("HTTP/1.1 400 Bad Request"); die();}; $_SERVER['USERADDR']=envi($y);  unset($l,$y,$s,$i,$v,$x,$z);
# ---------------------------------------------------------------------------------------------------------------------------------------------



# dbug :: pre-flight : check essential server vars .. set roots .. get rid of bad bots .. check if web-server passed us the right stuff
# ---------------------------------------------------------------------------------------------------------------------------------------------
   if(envi('DOCUMENT_ROOT DBUGPATH HOST SCHEME BOTMATCH')!==1){header("HTTP/1.1 424 Failed Dependency - server vars"); die();}; // bad vars
   $d=envi('DOCUMENT_ROOT'); $s=skey(); $u=''; $c=explode('/',envi('COREPATH')); $c=array_pop($c);
   $g=envi('DBUGPATH'); $_SERVER['DBUGPATH']="/$g"; unset($g);

   if($s){$s="$d/$c/Proc/temp/sesn/$s/USER"; if(file_exists($s)){$u=file_get_contents($s);}};
   if(!$u){$u='anonymous';}; $_SERVER['USERNAME']=$u; $_SERVER['USERPATH']="$d/$c/User/data/$u/home";

   $q=envi('URL'); if((strlen($q)>8)&&((substr($q,-7,7)==='.js.map')||(substr($q,-8,8)==='.css.map'))){die('');}; unset($q); // hands off!!
   $b=cbot(true); // check for bad robot .. if facing bad-robot then bot is "served" and the process exits here ... rinse and repeat

   $h=sha1(envi('USERADDR').envi('USER_AGENT')); $p=path("/Proc/temp/kban/$h"); if(is_link($p))
   {
      $h=(readlink($p)*1); $n=time(); $t=lstat($p); if(isset($t['ctime'])){$t=$t['ctime'];}elseif(isset($t['mtime'])){$t=$t['mtime'];};
      if($t){$d=($n-$t); if($d>=$h){unlink($p);}else{harakiri(wack());}}; // kill-ban .. lift or hold
   };

   if($b){$_SERVER['INTRFACE']='BOT';}; // facing BOT .. it's behaving for now so all seems OK this far

   $m=pget('/Proc/conf/autoMail'); if(!$m){$m=envi('SERVER_ADMIN');}else
   {$m=explode('@',$m); $d=$m[1]; $u=explode('//',$m[0]); $u=explode(':',$u[1]); $u=$u[0]; $m="$u@$d";}; $_SERVER['TECHMAIL']=$m;

   unset($d,$x,$c,$s,$b,$h,$p,$n,$t,$m,$u); // clean up
   $_SERVER['ALPHABET']='0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';  // we need this
# ---------------------------------------------------------------------------------------------------------------------------------------------



# dbug :: platform : check for expected PHP version and extensions .. demand short open tag
# ---------------------------------------------------------------------------------------------------------------------------------------------
   if(isee('mbstring curl')!==1){halt(424,'Failed Dependency - need PHP extensions: mbstring, curl');}; // required extensons
   if(''===trim(trim(strtolower((ini_get('short_open_tag').'')),'off'),'0')){halt(424,'Failed Dependency - short_open_tag');}; // bad htconf
# ---------------------------------------------------------------------------------------------------------------------------------------------



# dbug :: protocol : force https .. this cannot be done reliably in .htaccess
# ---------------------------------------------------------------------------------------------------------------------------------------------
   if((envi('USER_AGENT')==='SYS:Verify-SSL')&&(envi('SCHEME')==='https')){die('OK');}; // STILL ALIVE .. we took an introspection trip
   if(envi('SCHEME')!=='https')
   {
      $a='SYS:Verify-SSL'; if(envi('USER_AGENT')===$a){die('?');}; $h=envi('HOST'); $p=("https://$h"); $r=spuf($p,$a,$h);
      if($r==='OK'){$p=($p.envi('QUERY_STRING')); header("Location: $p"); exit;}; // continue our journey on our new found sense of security
      if(strpos($r,'Could not resolve')!==false){$q=spuf("http://$h",$a,$h); if($q!=='?'){halt(500,'epic');}}; // DIED .. invalid host config
      if((strpos($r,'SSL')!==false)&&(strpos($r,'not match')!==false)){halt(500,'epic');}; // YOU HAVE DIED .. broken SSL certificate
      halt(500,$r);  // YOU HAVE DIED ... our journey ended because we are too insecure ... invalid SSL
   };
# ---------------------------------------------------------------------------------------------------------------------------------------------



# dbug :: vars : USERDEED - request method as "CRUD" word
# ---------------------------------------------------------------------------------------------------------------------------------------------
   $l=array('OPTIONS'=>'permit','GET'=>'select','PUT'=>'update','POST'=>'insert','HEAD'=>'descry','DELETE'=>'delete','CONNECT'=>'listen');
   $x=envi('REQUEST_METHOD'); if(isset($l[$x])){$_SERVER['USERDEED']=$l[$x];}else{header('HTTP/1.1 405 Method Not Allowed'); die();};
   if($x=='OPTIONS'){$l=implode(array_keys($l,', ')); header('HTTP/1.1 200 OK'); header("Allow: $l"); die();}; unset($x,$l); // all is well
# ---------------------------------------------------------------------------------------------------------------------------------------------



# dbug :: path : required for expected functionality
# ---------------------------------------------------------------------------------------------------------------------------------------------
   if(!isee('/Proc/temp/sesn')){halt(424,'Failed Dependency - readable temp.sesn');};  // YOU HAVE DIED
   if(!is_writable(isee('/Proc/temp/sesn'))){halt(417,'Expectation Failed - writable temp.sesn');};   // YOU HAVE DIED
   if(!isee('/Proc/base/boot.php')){halt(424,'Failed Dependency - boot');}; // YOU HAVE DIED
# ---------------------------------------------------------------------------------------------------------------------------------------------



# dbug :: vars : INTRFACE - identify the kind of interface .. verify REFERER from "self" .. deny bots any methods other than HEAD and GET
# ---------------------------------------------------------------------------------------------------------------------------------------------
   $m=envi('ACCEPT'); $a=envi('USER_AGENT'); $h=envi('HOST'); $p=envi('URL'); $x=fext($p); $k=skey(); $r=envi('REFERER'); $b=envi('INTRFACE');
   $s=(strpos($r,"https://$h")===0); $f=envi('DBUGPATH'); if($s&&$k){$_SERVER['MADEFUBU']=true;}else{$_SERVER['MADEFUBU']=false;};
   if(($s&&!$k)&&($p!==$f)){$s=false;}; // logged out

   if($s&&!$k)
   {
      if($b==='BOT'){halt(503,'Service Unavailable');}; // here be deamons posing as ourselves to do its bidding .. scary sh!t
      $r=pget($f); $r=str_replace('{:(TECHMAIL):}',envi('TECHMAIL'),$r);
      $r=str_replace('{:(DUMPMESG):}',base64_encode('from us, but no sesn'),$r);
      print_r($r); flush(); die(); // cookies disabled ? .. YOU HAVE DIED
   };

   if(($b&&($b!=='BOT'))||post('INTRFACE')||kuki('INTRFACE'))
   {
      if(!$k){harakiri('missing -or invalid session key');}; // YOU HAVE DIED
      $fn=($b?$b:post('INTRFACE')); if(!$fn){$fn=kuki('INTRFACE');};
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

   if($i==='SYS')
   {
      $sk=pget('/Proc/info/host.key'); if(!$sk){harakiri('invalid hostkey');}; // YOU HAVE DIED
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
      if(isset($_GET['k'])&&($_GET['k']===$k)){$i='DPR';};
   };

   $_SERVER['INTRFACE']=$i; unset($a,$h,$p,$x,$r,$b,$s,$k,$i);
# ---------------------------------------------------------------------------------------------------------------------------------------------



# info :: proc : here we are out of "the swamp" .. we got rid of BS and identified the interface .. next we boot through "the woods"
# ---------------------------------------------------------------------------------------------------------------------------------------------
   require ($_SERVER['COREPATH'].'/Proc/base/boot.php'); // check in here for more info
# ---------------------------------------------------------------------------------------------------------------------------------------------
