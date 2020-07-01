<?php


# dbug :: (errors) : show all errors
# -----------------------------------------------------------------------------------------------------------------------------
    ini_set('display_errors',true);
    error_reporting(E_ALL);
# -----------------------------------------------------------------------------------------------------------------------------



# defn :: (tools) : functions to simplify things
# -----------------------------------------------------------------------------------------------------------------------------
    function done($cm)
    {
        header("HTTP/1.1 $cm"); die();
    }


    function bail($m)
    {
        header("HTTP/1.1 200 OK");
        header("Content-Type: text/plain");
        print_r($m); die();
    }


    function need($a)
    {
        if(function_exists($a)){return true;};
        if(class_exists($a,false)){return true;};
        if(extension_loaded($a)){return true;};
        bail("system host can't run: $a");
    }


    function envi($d)
    {
       if(!is_string($d)||($d==='')){return '';};
       if(isset($_SERVER)){$v=$_SERVER;}elseif(isset($HTTP_SERVER_VARS)){$v=$HTTP_SERVER_VARS;}else{return '';};
       $l=explode(' ',$d); $s=count($l); $f=array();
       $x=array('X','HTTP','REDIRECT','REQUEST'); for($i=0; $i<$s; $i++)
       {
          $k=$l[$i]; if(!isset($v[$k]))
          {$w=array_values($x); do{$p=(array_shift($w)."_$k"); if(isset($v[$p])){$k=$p;break;}}while(count($w));};
          if(!isset($v[$k])){continue;}; $q=$v[$k]; if($q&&!is_string($q)){$q=json_encode($q);};
          if(is_string($q)&&(strlen($q)>0)){$f[$i]=$q;}
       };
       $c=count($f); if($s===1){if($c<1){return '';}; return $f[0];}; $r=($c/$s); return $r;
    }


    function spuf($uri,$uas=null,$ref=null,$tmo=12,$bin=0)
    {
       if(!is_string($uri)){return;}; if(strpos($uri,'http')===false){return;}; $ipa=envi('USERADDR');
       if(!$uas){$uas=envi('USER_AGENT');}; if(!$ref){$ref=envi('REFERER'); if(!$ref){$ref='http://example.com/index.html';}};
       $o=array(CURLOPT_RETURNTRANSFER=>1,CURLOPT_SSL_VERIFYPEER=>false,CURLOPT_URL=>$uri,CURLOPT_USERAGENT=>$uas,CURLOPT_REFERER=>$ref,
       CURLOPT_CONNECTTIMEOUT=>4,CURLOPT_TIMEOUT=>$tmo,CURLOPT_BINARYTRANSFER=>$bin);
       $c=curl_init(); curl_setopt_array($c,$o); curl_setopt($c,CURLOPT_HTTPHEADER,array("REMOTE_ADDR: $ipa", "HTTP_X_FORWARDED_FOR: $ipa"));
       $r=curl_exec($c); $e=null; if(!$r){$x=curl_error($c); if($x){$e=$x;};}; curl_close($c);
       if($e){return "FAIL :: $e";}; return $r;
    }


    function base()
    {
        $dr=envi('DOCUMENT_ROOT'); $bd=envi('BASE');
        if(strlen($bd)>0){$dr="$dr/$bd";};
        return $dr;
    }


    function bash($c)
    {
        $p=base(); $q=array(array("pipe","r"), array("pipe","w"), array("pipe","w")); $v=null;
        $r=proc_open($c,$q,$x,$p,$v); if(!is_resource($r)){return;}; fclose($x[0]); $y=explode(' ',$c); $y=$y[0];
        $o=trim(stream_get_contents($x[1])); fclose($x[1]); $e=trim(stream_get_contents($x[2])); fclose($x[2]);
        $z=trim(proc_close($r)); if($z){$z=(($e&&$o)?"$e ..\n$o":($e?$e:$o));}; if(!$z){return $o;};
        if(strpos($z,"cnf $y")){$c=bail("system host can't run: $y");}; bail($z);
    }
# -----------------------------------------------------------------------------------------------------------------------------




# defn :: (vars) : local
# -----------------------------------------------------------------------------------------------------------------------------
    $fm = '503 Service Unavailable'; $bp=base();
    $pk = ''; if(isset($_GET['pk'])){$pk=$_GET['pk'];};
    $ck = '{:ck:}';
    $hn = envi('SERVER_NAME'); if(!$hn){$hn=envi('HOST');};
    $fn = __FILE__;  $fn=explode('/',$fn);  $fn=array_pop($fn);
# -----------------------------------------------------------------------------------------------------------------------------



# cond :: (security) : only run when appropriate
# -----------------------------------------------------------------------------------------------------------------------------
    if($ck===('{'.':ck:'.'}')) // install without AnonDeploy
    {
        if(!isset($_GET['confirm']))
        {
            print_r("<h1>Anon Installation</h1>");
            print_r("<p>You are about to delete everything in: $bp</p>");
            print_r("<a href=\"https://$hn/$fn?confirm=1\"><button>confirm</button></a>");
            die();
        };
    }
    else
    {
        if($pk!==$ck){done($fm); exit;}; // crack this b!tch .. i can do better .. time is short
    };
# -----------------------------------------------------------------------------------------------------------------------------



# cond :: (needs) : Anon core dependencies
# -----------------------------------------------------------------------------------------------------------------------------
    need("version_compare");

    if(version_compare(phpversion(),'5.6','<'))
    { bail('PHP version too old, needs at least PHP 5.6'); };

    need("curl_init");
    need("ftp_get");
    need("mb_strlen");
    need("gmp_strval");
    need("SQLite3");
    need("proc_open");
    need("imap_open");

    $gv=bash("git --version"); // will fail if not present
# -----------------------------------------------------------------------------------------------------------------------------


# exec :: (cleanup) : purge this Landing Zone
# -----------------------------------------------------------------------------------------------------------------------------
    $dr=base(); $ls=array_diff(scandir("$dr"),array('..','.'));
    foreach($ls as $li){ if($li!==$fn){bash("rm -rf ./$li");}; };
# -----------------------------------------------------------------------------------------------------------------------------


# exec :: (install) : clone the Anon repo into a clean temp space, move contents over to CWD and dispose of temp
# -----------------------------------------------------------------------------------------------------------------------------
    $rs=bash("git clone https://github.com/FryerTuck/anon.git");
    $rs=bash("shopt -s dotglob && mv anon/* . && rm -rf ./anon");
# -----------------------------------------------------------------------------------------------------------------------------



# cond :: (test) : check if installation works, if not then replace .htaccess contents with alternative
# -----------------------------------------------------------------------------------------------------------------------------
    $rk=sha1(file_get_contents(__FILE__));
    $tl="https://$hn/?upkeep=init&rf=$fn&rk=$rk";
    $rs=spuf($tl);

    if(strpos($rs,'500 Internal Server Error')||strpos($rs,'503 Service Unavailable')||strpos($rs,'<title>Index of /</title>'))
    {$rs=bash("rm -f ./.htaccess && cp ./.anon.dir/Anon/base/access.cfg ./.htaccess"); sleep(1);};

    header("Location: $tl");

    die();
# -----------------------------------------------------------------------------------------------------------------------------
