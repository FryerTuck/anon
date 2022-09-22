<?php
# exec :: (init) : show all errors and increase eecution time .. record output buffer
# -----------------------------------------------------------------------------------------------------------------------------
    ini_set("display_errors",true);
    ini_set("max_execution_time",300);

    error_reporting(E_ALL);
    set_time_limit(300);

    ob_start();
# -----------------------------------------------------------------------------------------------------------------------------
?>

<html>
    <head>
        <style>
            html,body
            {
                position:relative;
                height:100%;
                background:hsla(210,3%,16%,1);
                font-size:15px; line-height:20px;
                font-family: Arial, Helvetica, sans-serif;
                color:#EEE;
                overflow:hidden;
                padding:0px;
                margin:0px;
                background-size:cover;
                background-image:url("data:image/jpeg;base64,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52Cl6EEpsvQLscVL8ibEL1EKFoosT3L3LQtTjrPIglChji9LHDh+Q7haiEIUM6JhlK11CZXvb6H12qEWNxeh6XD8g1pQ0qONSEIUYBN4QrsuBa0JQYY4vyIQ9CLmvwJpUIQjB2rjVUKEKGMYxw/IZQ1ossyIqxrShCEcR8D7VShDEKGxhuH5FKGtKE7h7j0IUKJYQhaOdSFCFCEcDY3Dh+RaeitC1iEKZelw9ChQtFjY2OH5HI9ZY5RkcoQhSTL7FiarHA2MfkinNy9aEIeDMOFrZyIUsem9L0PyLTF2SniD7F6HD8nLE5elaF2tl+UC0UPSxdj4dvfklRRUrQ9SldlRWq/JW9LhaHoZzDF2b8pLl6OR6r8skcaL1WWX5W+vly/+vd/9v6/6lP/aAAwDAQACAAMAAAAQ8888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888o08888888Aw88888888888888888888888888888888888888888888888888888888888888888888888888888888800o0888884AE808888888888888888888888888888888888888888888888888888888888888888888888888888888A0EUw84wEAA04Mc8888888888888888888888888888888888888888888888888888888888888888888888888888gAAscEAMkIoc4AMMA0c0888888888888888888888888888888888888888888888888888888888888888888884wAwAAAIQAwYgMAgUQQk4AQ0cg808888888888888888888888888888888888888888888888888888888888888888s4080sEM4skYkEUg4EMQUgEAAUAs44888888888888888888888888888888888888888888888888888888888888888sw88gcsUIkAcIQYookIUAcsE8IgQgcU88888888888888888888888888888888888888888888888888888888888888sUAEgQ80kgAMUwkw8IEQE80Mgko8w0g88888888888888888888888888888888888888888888888888888888888888sgMEI4gAEEA44QY0wYQAEAowI8ocQEI888888888888888888888888888888888888888888888888888888888888848M0I0YgAwcgIAgwQYQww80EIcYAwMwc08888888888888888888888888888888888888888888888888888888888888AEY0wssA0IIUYQEE0EUgUYgEoQcAAQAU8888888888888888888888888888888888888888888888888888888888888sEAk4UYAkkkgcIgUAIgU0AMIAcQsUAcc888888888888888888888888888888888888888888888888888888888888848Uw8sIAA0QAAMAU4wQ4U0QoMgAgAAYc88888888888888888888888888888888888888888888888888888888888884scM8I8MI0IoEsEIAIgosYcU0sAMsAkE88888888888888888888888888888888888888888888888888888888888884wwk0ssoIQoQkUwAQAQUwQcAMYcAEQk488888888888888888888888888888888888888888888888888888888888888Yw8IskQIAkkEc8AEAI4cEEAwo4Q0sMo8888888888888888888888888888888888888888888888888888888888888gM8MsQsgosUQAUQgowows4UooooMoAU008888888888888888888888888888888888888888888888888888888888840cIw8A0IEwEEgMgQUAgc0gwEE0oEwYwc0888888888888888888888888888888888888888888888888888888888888U0088AAkEA0cMAgMAUAcMUAo0QIkwIAU88888888888888888888888888888888888888888888888888888888888888sYccAAAsAY0s4gYMQ4UUwIEswkMwI08888888888888888888888888888888888888888888888888888888888888884wYUAAAsEYEs0oU0cMAUUAkYAQsc8IA88888888888888888888888888888888888888888888888888888888888888ogw8oAAAwQQ4YwMIIQQcgw8gwwsY80A888888888888888888888888888888888888888888888888888888888888408Ag88EAEUsgA0gUowIgUM0MwQAIcMcE088888888888888888888888888888888888888888888888888888888888ss880088sIcgIMA4ksEsAo8Qkw0ogEgI80888888888888888888888888888888888888888888888888888888888888ckEQ0888sckQAsgQUkokgEM8Es8AgY08U8888888888888888888888888888888888888888888888888888888888888wMIU0888gssQAgsE88oAko44EEwIU0o88888888888888888888888888888888888888888888888888888888888888IQ0Mw088AkAcIk8Moo44Y0A0E0QEccI088888888888888888888888888888888888888888888888888888888888888YkgAw888gQ4sAsQo04Ic4IAQQAYQ8oU8888888888888888888888888888888888888888888888888888888888888404gME08oYk4Qo4Y88YQ0cMEEIoMc0g88888888888888888888888888888888888888888888888888888888888888sEMkcEE08AEA80gAQgYwkQEgIMIko8A888888888888888888888888888888888888888888888888888888888888888swMQwI08cgwgQAcIAUM4E0E80E484U8888888888888888888888888888888888888888888888888888888888888888s84sgU8s4UAMUAAccks84Uwc0k4A888888888888888888888888888888888888888888888888888888888888888884Q4UMQQ8IgQg8oA8EoUIIQsY48AU888888888888888888888888888888888888888888888888888888888888888888sc0cAI8ocsAsUwMYMUMg480cwA88888888888888888888888888888888888888888888888888888888888888888888MU4QI08kgkYM88AYA8AU884AU8888888888888888888888888888888888888888888888888888888888888888888888soMM0Q8k8MMA04gc8884AU88888888888888888888888888888888888888888888888888888888888888888888sIc84084swU4888I808wwgEc88888888888888888888888888888888888888888888888888888888888888888888888sMcMcwUcQ40ww088wAAM888888888888888888888888888888888888888888888888888888888888888888888888888888IA8sMcsMMIAAAA08888888888888888888888888888888888888888888888888888888888888888888888888888888c88888884gAAE8888888888888888888888888888888888888888888888888888888888888888888888888888888c88888888IAwAc88o8888888888888888888888888888888888888888888888888888888888888888888888888888888888888880M888888888888888888888888888888888888888888888888888888888888888888888888888888808888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888s8888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888/8QAFBEBAAAAAAAAAAAAAAAAAAAAwP/aAAgBAwEBPxAXJ//EABQRAQAAAAAAAAAAAAAAAAAAAMD/2gAIAQIBAT8QFyf/xAAuEAACAgIBAwMEAgICAwEAAAAAAREhEDFBIFFhMHGBYHCRobHBQNHh8ICQ8bD/2gAIAQEAAT8Q/wDxtoqf8KPtNEHLIlC4/wAFEg1Gn9pUlJRr/CieTNBidFbDmX2kX8BMiSRxD9adiq6ccDpC1uNONUxNf2jJKewpLCh8DPTJEKSEz8Q5zK/9AgGqPsIIJH2hf5aKidZDsCI9BIgqVDJW/Byf0FtfxEBS/Wv0BFPbEgh4Gvs+9wiofQgaMTvEEEEYlW0YS0SUISUBotMIIPxC6aCCER9nXldmKkXKHaORLgqPAPTpFHCJFBNSQ8Tn+CNf1iNH8CpVEIqIlIuCHnvkagtJ2KqxRDFgl5R9m+TvC2blOGQk4Jhksf8AQQyZB0i+5Jyp58EaUX7CFQT1F+AK0QlYqB2Tn7qBe/4GpOwKhBRoYfQDEfYyvVnBX4meCIJBC60dsLrCJbGchV7GxWJ0EvHWhNkqk1xhCSEn5XKwoiIxeGGn1rO3cWZ3RGJIyTD7sFmBMQQNP7CwyCCOrn0Ib2UosOtIfmcSOBIbNEC3Pj+3E7s1KZU9ysRjTcUJa+Eh2zCde4lStcl3xMgcCjDWXpPksKxD+I1IS4s2xbiH7kAx4CgYfQBMjIn2JR0JRJ8EdD2xaEgfKgUt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");
            }

            pane
            {
                display:block;
                min-width:30rem; max-width:60rem;
                background-color:hsla(0,0%,18%,0.9);
                text-align:left;
                border:1px solid hsla(0,0%,28%,0.9);
                border-radius:0.2rem;
                box-shadow:0rem 0rem 0.2rem hsla(0,0%,0%,0.2);
                position:absolute; top:40%; left:50%; transform:translate(-50%,-40%);
            }

            wrap
            {
                display:block;
                position:relative;
            }

            pane>h1
            {
                font-size: 1rem;
                text-align:left;
                background-color:hsla(0,0%,0%,0.15);
                padding:0.4rem;
                margin:0px;
            }

            pane>wrap
            {
                display:block;
                position:relative;
                text-align:left;
                padding: 1.2rem;
                margin:0px;
            }

            pane>ul
            {
                margin:0px;
            }

            small
            {
                display:block;
                position:relative;
                color:hsla(0,0%,100%,0.6);
                margin:0px;
            }

            pane>div
            {
                text-align:right;
                background-color:hsla(0,0%,0%,0.15);
                padding: 1.2rem;
                margin:0px;
            }

            button
            {
                display:inline-block; position:relative; box-sizing:border-box;
                min-width:80px; height:28px;
                background:linear-gradient(0deg, hsla(0,0%,85%,1) 0%, hsla(0,0%,95%,1) 100%);
                padding:0px; padding-left:0.5rem; padding-right:0.5rem; margin:0.5rem;
                font-size:14px; color:hsla(0,0%,30%,1); line-height:26px;
                font-weight:bold; text-align:center;
                text-shadow:0px 0px 1px hsla(0,0%,0%,0.6);
                border:1px solid hsla(0,0%,70%,1); border-radius:3px !important;
                box-shadow:0px 0px 3px hsla(0,0%,0%,0.15);
                white-space:nowrap !important;
                cursor:pointer;
                user-select:none;
            }

            button.cool
            {
                background:linear-gradient(0deg, hsla(220,90%,30%,1) 0%, hsla(220,90%,40%,1) 100%);
                color:hsla(0,0%,95%,1);
                border:1px solid hsla(220,100%,50%,1);
                box-shadow:0px 0px 3px hsla(0,0%,0%,0.3);
            }

            button.cool:hover
            {
                background:linear-gradient(0deg, hsla(220,90%,35%,1) 0%, hsla(220,90%,45%,1) 100%);
                color:hsla(0,0%,100%,1);
                border:1px solid hsla(220,100%,45%,1);
            }
        </style>
        <script>
            const server = function server(cmnd)
            {
                fetch(`?action=`+cmnd).then((resp)=>{resp.text().then((text)=>
                {
                    if (!text.startsWith("NEXT :: ") && !text.startsWith("DONE :: "))
                    {
                        parley(`Anon Installation - issue`, text, `retry`, this.next);
                        return;
                    };

                    let prts = text.split(" :: ");
                    this.next = prts[1];

                    if (prts[0] === "NEXT")
                    {
                        parley(`Anon Installation - progress`, prts[2], `next`, this.next);
                        return;
                    };

                    window.location.href = prts[1];
                })});
            }
            .bind({next:"step-01"});

            const parley = function parley(head, body, butn, cmnd)
            {
                document.body.innerHTML = "";
                let pane = document.createElement("pane");
                pane.innerHTML = `<h1>${head}</h1><wrap>${body}</wrap>
                                  <div>
                                    <button class="cool" onclick="this.parentNode.removeChild(this); server('${cmnd}')">${butn}</button>
                                  </div>`;
                document.body.appendChild(pane);
            };
        </script>
    </head>
    <body>
        <script>
            parley(`Anon Installation`, `Dependency check .. ready to begin`, `continue`, `step-01`);
        </script>
    </body>
</html>

<?php

$html=trim(ob_get_clean());



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
        $mesg = "undefined reference dependency: `$a`".
                "<ul><li>make sure its extension-package is installed</li>".
                "<li>make sure it's enabled in `php.ini`</li></ul>".
                "<small>remember to restart the httpd service after re-configuration is saved</small>";
        bail($mesg);
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
        $p = __FILE__;
        $x = strrpos($p,"/");
        $r = substr($p, 0, $x);
        return $r;
    }


    function pget($p)
    {
        $b=base(); if(!file_exists($b.$p)){return '';};
        return file_get_contents($b.$p);
    }

    function rcpy($src,$dst)
    {
        $dir = opendir($src);
        if(!file_exists($dst)){mkdir($dst);};
        while(false !== ( $file = readdir($dir)) )
        {
            if(($file==".")||($file=="..")){continue;};
            if(is_dir("$src/$file")){rcpy("$src/$file","$dst/$file");}
            else{copy("$src/$file","$dst/$file");}
        }
        closedir($dir);
        return true;
    }


    function bash($c)
    {
        $p=base(); $q=array(array("pipe","r"), array("pipe","w"), array("pipe","w")); $v=null;
        $r=proc_open($c,$q,$x,$p,$v); if(!is_resource($r)){return;}; fclose($x[0]); $y=explode(' ',$c); $y=$y[0];
        $o=trim(stream_get_contents($x[1])); fclose($x[1]); $e=trim(stream_get_contents($x[2])); fclose($x[2]);
        $z=trim(proc_close($r)); if($z){$z=(($e&&$o)?"$e ..\n$o":($e?$e:$o));}; if(!$z){return $o;};
        if(strpos($z,"cnf $y")){$c=bail("system host can't run: $y");}; bail($z);
    }


    function hbkp($nt,$at)
    {
        if(!is_string($nt)){$nt="";}; $nt=trim($nt); $at=trim($at); $dl='# ((̲̅ ̲̅(̲̅C̲̅r̲̅a̲̅y̲̅o̲̅l̲̲̅̅a̲̅( ̲̅((>';
        $pt=explode($dl,$nt); $nt=array_pop($pt); $rt=($at."\n".trim($nt));
        return $rt;
    }


    function kuki($k,$v='<:(/*\):>',$p='/')
    {
        if(!is_string($k)){return;}; if(strlen($k)!==strlen(trim($k))){return;}; // validate cookie-name
        if($v==='<:(/*\):>'){if(!isset($_COOKIE[$k])){return;}; return $_COOKIE[$k];}; // get
        if(($v==='')||($v===':VOID:')){$v='';}; $d=$_SERVER['HTTP_HOST']; $d="$d";
        if($v===null){setcookie($k,$v,-1,$p,$d); unset($_COOKIE[$k]); return;}; // delete
        setrawcookie($k,$v,0,$p,$d); $_COOKIE[$k]=$v; return true; // set
    };


    function stub($t,$d,$r=0)
    {
        if(is_array($d))
        {$l=array_values($d);$d=null;foreach($l as $i){if(is_string($i)&&(strlen($i)>0)&&(strpos($t,$i)!==false)){$d=$i;break;}}};
        if(!is_string($t)||!is_string($d)||(strlen($t)<2)||(strlen($d)<1)){return;}; $p=(!$r?mb_strpos($t,$d):mb_strrpos($t,$d));
        if($p!==false){return [mb_substr($t,0,$p),$d,mb_substr($t,($p+mb_strlen($d)))];};
    }


    function free($m=null)
    {
        $p=(base()."/.spacer"); $f=0; $w=''; $k=0; $mb=(1024*1024);
        if(!$m){$m=((1024*1024)*1024);}; // max 1Gb if no max
        for ($i=0; $i<$mb; $i++){$w.="A";};
        do
        {
            try{usleep(1); $d=file_put_contents($p,$w,FILE_APPEND); $k++; if(!$d||($k>=$m)){$f=1; break;}}
            catch(Exception $e){$f=1; unlink($p);};
        }
        while(!$f);

        return ($k*1024);
    }


    function fail($m, $f, $l)
    {
        $b=''; while(ob_get_level()){$b.=("\n".ob_get_clean());}; $b=trim($m."\n\n".$b);
        if(strpos($b,'out of free disk space')){die("no free space!!"); return;};
        print_r("FAIL :: $b .. $f ($l)");
        exit;
    }


    class DeleteOnExit
    {
       function __destruct(){unlink(__FILE__);}
    }
# -----------------------------------------------------------------------------------------------------------------------------




# defn :: event : handlers
# ---------------------------------------------------------------------------------------------------------------------------------------------
    set_exception_handler(function($e)
    {
        fail($e->getMessage(), $e->getFile(), $e->getLine());
        exit;
    });

    set_error_handler(function()
    {
        $e=func_get_args();
        fail($e[1], $e[2], $e[3]);
        exit;
    });

    register_shutdown_function(function()
    {
        $e=error_get_last(); if(!$e){exit;}; error_clear_last();
        fail($e['message'], $e['file'], $e['line']);
        exit;
    });
# ---------------------------------------------------------------------------------------------------------------------------------------------




# defn :: (vars) : local
# -----------------------------------------------------------------------------------------------------------------------------
    // $fm = '503 Service Unavailable'; $bp=base();
    // $pk = ''; if(isset($_GET['pk'])){$pk=$_GET['pk'];};
    // $ck = '(~ck~)';
    // $hn = $hn=envi('HOST');
    // $fn = __FILE__;  $fn=explode('/',$fn);  $fn=array_pop($fn);
    // // $ts = stub(bash("du -sb ./"),[' ',"\t"])[0];
    // // $rs = (3*($ts*1));
    // // $fs = free(floor($rs/1024));
    // // $fs=(($fs/1024)/1024);
    // // $rs=(($rs/1024)/1024);
    // $hm = 'please backup any important files before confirming';
# -----------------------------------------------------------------------------------------------------------------------------




# cond :: action : none .. process flow starts here
# -----------------------------------------------------------------------------------------------------------------------------
    if(!isset($_GET["action"]))
    {
        kuki("RECEIVER",":VOID:");
        echo $html; exit;
    };
# -----------------------------------------------------------------------------------------------------------------------------




# cond :: action : step-01 .. check dependencies
# -----------------------------------------------------------------------------------------------------------------------------
    if ($_GET["action"] === "step-01")
    {
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

        die("NEXT :: step-02 :: backup and cleanup .. make sure anything you want to keep is saved on separate storage");
    };
# -----------------------------------------------------------------------------------------------------------------------------




# cond :: action : step-02 .. backup and cleanup
# -----------------------------------------------------------------------------------------------------------------------------
    if ($_GET["action"] === "step-02")
    {
        $bp = base();
        if(file_exists("$bp/.anon.dir/User/data"))
        {
            if(!file_exists("$bp/.bkp")){mkdir("$bp/.bkp");};
            if(!file_exists("$bp/.bkp/usr")){mkdir("$bp/.bkp/usr");};
            if(!file_exists("$bp/.bkp/cfg")){mkdir("$bp/.bkp/cfg");};
            if(!file_exists("$bp/.bkp/usr/master")){rcpy("$bp/.anon.dir/User/data","$bp/.bkp/usr");};
            if(!file_exists("$bp/.bkp/cfg/Anon"))
            {
                $sl=array_diff(scandir("$bp/.anon.dir"),[".",".."]); foreach($sl as $sn)
                {
                    if(!file_exists("$bp/.bkp/cfg/$sn")){mkdir("$bp/.bkp/cfg/$sn");};
                    if(!file_exists("$bp/.anon.dir/$sn/conf")){continue;};
                    $cl=array_diff(scandir("$bp/.anon.dir/$sn/conf"),[".",".."]);
                    foreach($cl as $ci){copy("$bp/.anon.dir/$sn/conf/$ci","$bp/.bkp/cfg/$sn/$ci");};
                };
            };
        };

        $ls=["anon",".anon.dir",".git",".anon.php","LICENSE","README.md"];
        foreach($ls as $li){if(($li!==__FILE__)&&file_exists("$bp/$li")){bash("rm -rf ./$li");}};

        die("NEXT :: step-03 :: cloning the repositories and finishing installation");
    };
# -----------------------------------------------------------------------------------------------------------------------------




# cond :: action : step-03 .. clone the Anon repo into a clean temp space, move contents over to CWD and dispose of temp
# -----------------------------------------------------------------------------------------------------------------------------
    if ($_GET["action"] === "step-03")
    {
        bash("git clone https://gitlab.com/a7208/anon.git");
        $bp = base();
        $ht=hbkp(pget("/.htaccess"),pget("/anon/.htaccess"));
        if(file_exists("$bp/.htaccess")){chmod("$bp/.htaccess",0644);}; // make htaccess writable for now
        bash("shopt -s dotglob && mv anon/* . && rm -rf ./anon");
        file_put_contents("$bp/.htaccess",$ht); chmod("$bp/.htaccess",0444); // fused htaccess as read-only
        $mp=password_hash(trim(pget("/.anon.dir/Proc/info/pass.inf")),PASSWORD_DEFAULT);
        file_put_contents("$bp/.anon.dir/User/data/master/pass",$mp);

        if(file_exists("$bp/.bkp/usr/master")){rcpy("$bp/.bkp/usr","$bp/.anon.dir/User/data");};
        if(file_exists("$bp/.bkp/cfg/Anon"))
        {
            $rl=array_diff(scandir("$bp/.bkp/cfg"),[".",".."]); foreach($rl as $ri)
            {
                $cl=array_diff(scandir("$bp/.bkp/cfg/$ri"),[".",".."]); unset($ci);
                foreach($cl as $ci){copy("$bp/.bkp/cfg/$ri/$ci","$bp/.anon.dir/$ri/conf/$ci");};
            };
        };

        if(file_exists("$bp/.bkp"))
        {
            bash("rm -rf ./.bkp"); bash("mv ./LICENSE ./.anon.dir/Anon/docs/LICENSE");
            bash("rm -rf ./.bkp"); bash("mv ./README.md ./.anon.dir/Anon/docs/README.md");
        };


        $prot = envi('REQUEST_SCHEME');
        $host = envi('HOST');
        $gone = (new DeleteOnExit());

        die("DONE :: $prot://$host");
    };
# -----------------------------------------------------------------------------------------------------------------------------
