<?php
## no namespace here


# info :: file : read this
# ---------------------------------------------------------------------------------------------------------------------------------------------
# this file is the main entry-point of any interface; it's compatible with ancient PHP (versions < 4) and used for graceful fail
# it extends the `.htaccess` (apache conf) by providing functionality, like verifying https, or checking required PHP extensions
# here we are in "the swamp" .. we don't have syntactical freedom and we don't know anything about the visitor or what they want
# ---------------------------------------------------------------------------------------------------------------------------------------------



# dbug :: oldPHP : no love for PHPv < 4.3 .. and CLI has no business here
# ---------------------------------------------------------------------------------------------------------------------------------------------
   $m="FAIL :: graceless : this server's software is older than my dead grandmother's fashionable bloomers";
   if(FALSE==function_exists('version_compare')){die($m);}; if(version_compare(phpversion(),'4.3','<')){die($m);};
   if(php_sapi_name()==='cli'){die("FAIL :: interface : use a web browser like curl, wget, Lynx\n");}; unset($h,$m);
   ini_set('display_errors',true); error_reporting(E_ALL); $_SERVER['oblevl']=0; $_SERVER['obfail']=''; $_SERVER['cbfail']=null;
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
         if(!isset($v[$k])){continue;}; $q=$v[$k]; if(is_int($q)||is_float($q)){$q="$q";}; if(is_string($q)&&(strlen($q)>0)){$f[$i]=$q;}
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
      $r=envi('ROOTPATH'); $c=envi('COREPATH'); $u=envi('USERPATH'); if(($p==='/')||($p==='.')){return $r;}; $p=rtrim($p,'/');
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
      $p=path($p); if(!$p||($p&&($p==='/'))){return;}; $b=explode('/',$p); $b=array_pop($b); if(strpos($b,'.')===FALSE){return;};
      $r=explode('.',$b); $r=array_pop($r); if(test($r,'/^[a-zA-Z0-9]{1,8}$/')){return $r;};
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
      return array_values($z);
   };
# ---------------------------------------------------------------------------------------------------------------------------------------------



# func :: pset : create path .. will create subdirs recursively
# ---------------------------------------------------------------------------------------------------------------------------------------------
   function pset($p,$v='')
   {
      if(!is_string($p)){return;}; if(strlen($p)<2){return;}; $d=0; if(substr($p,-1,1)==='/'){$d=1;}; $p=path($p); if(!$p){return;};
      if($d&&is_dir($p)){return true;}; $h=rtrim($p,'/'); $h=explode('/',$h); $b=array_pop($h); $h=implode('/',$h); $u=umask(); umask(0);
      if(!isee($h)){$r=explode('/',$h); array_pop($r); $r=implode('/',$r); if(!is_writable($r)){return;}; mkdir($h,0777,true);};
      if($d){$r=mkdir($p,0777,true);}else{$r=file_put_contents($p,$v);}; umask($u); return $r;
   };
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
      if($e){return null;}; return $r;
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
      $r=spuf($f); if(!$r){header("Location: $f"); die();}; // try to spoof URI .. if fail -then redirect instead
      echo $r; die(); // spoof worked, so from here any subsequent link is not our problem, we're done here
   }
# ---------------------------------------------------------------------------------------------------------------------------------------------



# func :: cbot : check bot .. $k is for "kill if bad bot" .. suspect bots use single chars as ua-string, or visit denied paths in `robots.txt`
# ---------------------------------------------------------------------------------------------------------------------------------------------
   function cbot($k=false)
   {
      $s=envi('USER_AGENT'); if(!$s){if($k){kbot();}; return true;};
      $x=str_replace(array(' ','*','.','-','_','?','!','#','&','~',':',',','|','^'),'',$s); $x=trim($x); // suspects
      if(strlen($x)<3){if($k){kbot();}; return true;}; $x=strpos(envi('ACCEPT'),'/'); if(!$x){if($k){kbot();}; return true;};
      $b=envi('BOTMATCH'); if($b&&test($s,"/$b/i")){$b=true;}else{$b=false;}; $p=envi('URL'); $f=pget('/Proc/conf/badRobot');
      $f="$f\n"; if($f&&$p&&(strpos($f,"lure: $p\n")!==false)){if($k){kbot();};}; if($b){return $b;};
      $h=sha1(envi('USERADDR').$s); if(is_link(path("/Proc/temp/bots/$h"))){$b=true;}; return $b;
   }
# ---------------------------------------------------------------------------------------------------------------------------------------------



# func :: acid : returns authorised cookie ID
# ---------------------------------------------------------------------------------------------------------------------------------------------
   function acid($new=null)
   {
      $l=array_keys($_COOKIE); if(count($l)<1){return;}; $r=null; $t='/^[a-z0-9]{40}$/'; $c=envi('COREPATH'); $h="$c/Proc/temp/sesn";
      $n=null; do{$n=array_pop($l); if(!test($n,$t)){$n=null; continue;}; $p=is_dir("$h/$n"); if($p){$r=$n;break;}}while(count($l));
      $u=null; if($r&&$n){$u=pget("$h/USER");}; if($u==='anonymous'){unset($_COOKIE[$r]); $r=null; $n=null;};
      if($r){return $r;}; if(!$n){return;}; if(!$new){return;}; usleep(10000); $h=envi('SERVER_NAME'); if(!$h){$h=envi('HOST');};
      setcookie($n,null,-1,'/',$h); $p=envi('URI'); header("Location: $p"); die();
   }
# ---------------------------------------------------------------------------------------------------------------------------------------------



# func :: random : creates random string from ALPHABET .. $l is the char-length
# ---------------------------------------------------------------------------------------------------------------------------------------------
   function random($l=null)
   {
      if(!is_int($l)){$l=6;}; if($l<0){$l=6;}; $r=str_shuffle(envi('ALPHABET')); $r=substr($r,0,$l); return $r;
   }
# ---------------------------------------------------------------------------------------------------------------------------------------------



# func :: halt : for graceful fail
# ---------------------------------------------------------------------------------------------------------------------------------------------
   function halt($c,$m,$f=null,$l=null,$z='')
   {
      $h=envi('HOST'); $r=envi('REFERER'); $a=envi('USER_AGENT'); $g=1; if($f===null){$f=__FILE__;}; if($l===null){$l=__LINE__;};
      if((strpos($r,"http://$h")===0)||(strpos($r,"https://$h")===0)){$g=0;}; $t=microtime(true); $u='anonymous'; $k='surf';
      if(strpos($a,'SYS :: ',true)===0){$g=0;}; if(envi('INTRFACE')==='BOT'){$g=0;}; while(ob_get_level()){ob_end_clean();};

      $t=$m; if((strpos($t,"\n")!==false)||(strlen($t)>128)){$t='Internal Server Error - invalid reason';};
      if($f){$f=str_replace(envi('COREPATH'),'',$f);}; $p=isee(envi('DBUGPATH')); if(!is_file($p)){$p=0;}; $d=envi('HOST'); $v='...';

      header("HTTP/1.1 $c $t"); if(!$g){print_r($z); flush(); exit();}; if(!$p){die("FAIL :: $c : $m");}; $h=acid();

      if(!isee('/Proc/temp/sesn')){$c=424; $m='Failed Dependency - readable temp.sesn'; $f=__FILE__; $l=__LINE__;}
      elseif(!is_writable(isee('/Proc/temp/sesn'))){$c=417; $m='Expectation Failed - writable temp.sesn'; $f=__FILE__; $l=__LINE__;}
      else
      {
         if(!$h){$h=sha1(random(6).$t.envi('USERADDR').getmypid().random(6)); pset("/Proc/temp/sesn/$h/.user",$u); setcookie($h,$v,0,'/',$d);}
         else{$u=pget("/Proc/temp/sesn/$h/.user");}; if(isee("/User/data/$u/clan")){$k=pget("/User/data/$u/clan");};
      };

      $d=array('name'=>'Boot', 'mesg'=>$m, 'file'=>$f, 'line'=>$l, 'stak'=>array(), 'user'=>$u, 'clan'=>$k);
      $d=base64_encode(json_encode($d)); $r=file_get_contents($p); $r=str_replace('{:(DBUGDATA):}',$d,$r);
      echo $r; die();
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
      $l=pget('/Proc/hack.inf'); if(!$l){$l="and stay out!\nyou broke it, bravo!";}; $l=explode("\n",$l);
      $i=array_rand($l); $m=$l[$i]; return $m;
   }
# ---------------------------------------------------------------------------------------------------------------------------------------------



# dbug :: vars : USERADDR - ip address .. if no ip then the request is bogus
# ---------------------------------------------------------------------------------------------------------------------------------------------
   $l=explode(' ','CLIENT_IP FORWARDED_FOR FORWARDED REMOTE_ADDR'); $y=0; $s=count($l); for($i=0; $i<$s; $i++)
   {$v=$l[$i]; $x="X_$v"; $z="$v"; if(envi($x)){$y=$x;}elseif(envi($z)){$y=$z;}elseif(envi($v)){$y=$v;}else{$y=0;}; if($y){break;};};
   if(!$y){header("HTTP/1.1 400 Bad Request"); die();}; $_SERVER['USERADDR']=envi($y);  unset($l,$y,$s,$i,$v,$x,$z);
# ---------------------------------------------------------------------------------------------------------------------------------------------



# dbug :: pre-flight : check essential server vars .. set roots .. get rid of bad bots .. check if web-server passed us the right stuff
# ---------------------------------------------------------------------------------------------------------------------------------------------
   if(envi('DOCUMENT_ROOT DBUGPATH HOST SCHEME BOTMATCH')!==1){header("HTTP/1.1 424 Failed Dependency - server vars"); die();}; // bad vars
   $d=envi('DOCUMENT_ROOT'); chdir($d); $_SERVER['ROOTPATH']=$d; // web-root path
   $x=envi('DBUGPATH'); $c=explode('/',$x); $c=$c[0]; $_SERVER['DBUGPATH']=str_replace($c,'',$x); $_SERVER['COREPATH']="$d/$c"; // sys-root
   $s=acid(1); $u=''; if($s){$s="$d/$c/Proc/temp/sesn/$s/USER"; if(file_exists($s)){$u=file_get_contents($s);};}; if(!$u){$u='anonymous';};
   $_SERVER['USERNAME']=$u; $_SERVER['USERPATH']="$d/$c/User/data/$u/home";

   if(strrpos(envi('URL'),'.js.map')||strrpos(envi('URL'),'.css.map')){die('');};
   $b=cbot(true); // check for bad robot .. if bad-bot found then bot is served and the process exits here
   if($b){$_SERVER['INTRFACE']='BOT';}; // bot detected

   $h=sha1(envi('USERADDR').envi('USER_AGENT')); $p=path("/Proc/temp/kban/$h"); if(is_link($p))
   {
      $h=(readlink($p)*1); $n=time(); $t=lstat($p); if(isset($t['ctime'])){$t=$t['ctime'];}elseif(isset($t['mtime'])){$t=$t['mtime'];};
      if($t){$d=($n-$t); if($d>=$h){unlink($p);}else{$w=wack(); header("HTTP/1.1 503 Service Unavailable - $w"); die();};};
   };

   $m=pget('/Proc/conf/autoMail'); if(!$m){$m=envi('SERVER_ADMIN');}else
   {$m=explode('@',$m); $d=$m[1]; $u=explode('//',$m[0]); $u=explode(':',$u[1]); $u=$u[0]; $m="$u@$d";}; $_SERVER['TECHMAIL']=$m;

   unset($d,$x,$c,$s,$b,$h,$p,$n,$t,$m,$u); // clean up
   $_SERVER['ALPHABET']='0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';  // we need this
# ---------------------------------------------------------------------------------------------------------------------------------------------



# dbug :: platform : check for expected PHP version and extensions .. demand short open tag
# ---------------------------------------------------------------------------------------------------------------------------------------------
   if(version_compare(phpversion(),'5.6','<')){halt(426,'Upgrade Required - need PHP 5.6 or better');};
   if(isee('mbstring curl')!==1){halt(424,'Failed Dependency - need PHP extensions: mbstring, curl');}; // required extensons
   if(''===trim(trim(strtolower((ini_get('short_open_tag').'')),'off'),'0')){halt(424,'Failed Dependency - short_open_tag');}; // bad htconf
# ---------------------------------------------------------------------------------------------------------------------------------------------



# dbug :: protocol : force https .. this cannot be done reliably in .htaccess
# ---------------------------------------------------------------------------------------------------------------------------------------------
   if((envi('USER_AGENT')==='SYS:Verify-SSL')&&(envi('SCHEME')==='https')){die('OK');};
   if(envi('SCHEME')!=='https')
   {
      $a='SYS:Verify-SSL'; if(envi('USER_AGENT')===$a){exit();}; $p=('https://'.envi('HOST')); $c=curl_init();
      curl_setopt_array($c,array(CURLOPT_RETURNTRANSFER=>1,CURLOPT_SSL_VERIFYPEER=>false,CURLOPT_URL=>$p,CURLOPT_USERAGENT=>$a));
      $r=curl_exec($c); $e='invalid config'; if(!$r){$x=curl_error($c); if($x){$e=$x;};}; curl_close($c);
      if($r!=='OK'){halt(500,"SSL :: $e");}; $p=($p.envi('QUERY_STRING')); header("Location: $p"); die();
   };
# ---------------------------------------------------------------------------------------------------------------------------------------------



# dbug :: vars : USERDEED - request method as "CRUD" word
# ---------------------------------------------------------------------------------------------------------------------------------------------
   $l=array('OPTIONS'=>'permit','GET'=>'select','PUT'=>'update','POST'=>'insert','HEAD'=>'descry','DELETE'=>'delete','CONNECT'=>'listen');
   $x=envi('REQUEST_METHOD'); if(isset($l[$x])){$_SERVER['USERDEED']=$l[$x];}else{header('HTTP/1.1 405 Method Not Allowed'); die();};
   if($x=='OPTIONS'){$l=implode(array_keys($l,', ')); header('HTTP/1.1 200 OK'); header("Allow: $l"); die();}; unset($x,$l);
# ---------------------------------------------------------------------------------------------------------------------------------------------



# dbug :: vars : INTRFACE - identify the kind of interface .. verify REFERER from "self" .. deny bots any methods other than HEAD and GET
# ---------------------------------------------------------------------------------------------------------------------------------------------
   $m=envi('ACCEPT'); $a=envi('USER_AGENT'); $h=envi('HOST'); $p=envi('URL'); $x=fext($p); $k=acid(1); $r=envi('REFERER'); $b=envi('INTRFACE');
   $s=(strpos($r,"https://$h")===0); $f=envi('DBUGPATH'); if($s&&$k){$_SERVER['MADEFUBU']=true;}else{$_SERVER['MADEFUBU']=false;};
   if(($s&&!$k)&&($p!==$f)){$s=false;}; // logged out
   if($s&&!$k)
   {
      if($b==='BOT'){halt(503,'Service Unavailable');}; // here be monsters
      $r=pget($f); $r=str_replace('{:(TECHMAIL):}',envi('SERVER_ADMIN'),$r); print_r($r); flush(); die(); // cookies disabled ?
   };


   if($b==='BOT'){$i='BOT';}
   elseif(strpos($a,'SYS :: ',true)===0){$i='SYS';}
   elseif($m==='text/event-stream'){if($s){$i='SSE';}else{header('HTTP/1.1 403 Forbidden'); die();}}
   elseif(envi('INTRFACE')){$i=envi('INTRFACE');}
   elseif(isset($_POST['INTRFACE'])&&$_SERVER['MADEFUBU']){$i=$_POST['INTRFACE'];}
   elseif((($m==='application/json')&&($x!=='json'))||(($m==='text/plain')&&($x!=='txt'))){$i='API';}
   elseif($_SERVER['MADEFUBU']&&($_SERVER['USERDEED']==='insert')){$i='API';}
   elseif($s&&$k&&($_COOKIE[$k]==='...')){$i='DPR';}else{$i='GUI';};

   if(($p===envi('DBUGPATH'))&&($i!=='BOT')){$i='DPR';};

   if($i==='SYS')
   {
      $sk=pget('/Proc/host.key'); if(!$sk){header('HTTP/1.1 424 Failed Dependency - hostkey'); die();};
      $ck=explode(' :: ',$a); $ck=explode(' : ',$ck[1]); $ck=$ck[0];
      if($sk===$ck){$i='SYS';}else{header('HTTP/1.1 403 Forbidden'); die();}; unset($sk,$ck);
   };

   $_SERVER['INTRFACE']=$i;
   if(($i==='BOT')&&!in_array(envi('USERDEED'),array('descry','select'))){halt(405,'Method Not Allowed');}; // silly bot
   unset($a,$h,$p,$x,$r,$b,$s,$k,$i);
# ---------------------------------------------------------------------------------------------------------------------------------------------



# dbug :: path : required for expected functionality
# ---------------------------------------------------------------------------------------------------------------------------------------------
   if(!isee('/Proc/temp/sesn')){halt(424,'Failed Dependency - readable temp.sesn');};
   if(!is_writable(isee('/Proc/temp/sesn'))){halt(417,'Expectation Failed - writable temp.sesn');};
   if(!isee('/Proc/boot.php')){halt(424,'Failed Dependency - boot');}; // bootstrapper
# ---------------------------------------------------------------------------------------------------------------------------------------------



# info :: proc : here we are out of "the swamp" .. we got rid of BS and identified the interface .. next we boot through "the woods"
# ---------------------------------------------------------------------------------------------------------------------------------------------
   require ($_SERVER['COREPATH'].'/Proc/boot.php'); // check in here for more info
# ---------------------------------------------------------------------------------------------------------------------------------------------
