<?php

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
        bail("FAIL: $a");
    }


    function base()
    {
        $dr=$_SERVER['DOCUMENT_ROOT'];
        if(isset($_SERVER['BASE'])){$bd=$_SERVER['BASE']; if(strlen($bd)>0){$dr="$dr/$bd";}};
        return $dr;
    }


    function bash($c)
    {
        $p=base(); $q=[0=>["pipe","r"], 1=>["pipe","w"], 2=>["pipe","w"]]; $v=null;
        $r=proc_open($c,$q,$x,$p,$v); if(!is_resource($r)){return;}; fclose($x[0]);
        $o=trim(stream_get_contents($x[1])); fclose($x[1]); $e=trim(stream_get_contents($x[2])); fclose($x[2]);
        $z=trim(proc_close($r)); if($z){$z=(($e&&$o)?"$e ..\n$o":($e?$e:$o));};
        if(!$z){return $o;}; bail($z);
    }

    need("version_compare");

    if(version_compare(phpversion(),'5.6','<'))
    { bail('PHP version too old'); };

    need("curl_init");
    need("ftp_get");
    need("mb_strlen");
    need("gmp_strval");
    need("SQLite3");
    need("imap_open");

    $gv=bash("git --version"); $dr=base();
    $ls=array_diff(scandir("$dr"),array('..','.'));

    foreach($ls as $li)
    { if($li!=="index.php"){bash("rm -rf ./$li");}; };

    $rs=bash("git clone https://github.com/FryerTuck/anon.git");
    $rs=bash("shopt -s dotglob && mv anon/* . && rm -rf ./anon");

    bail(':OK:');
