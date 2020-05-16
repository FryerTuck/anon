<?
namespace Anon;



# info :: file : read this
# ---------------------------------------------------------------------------------------------------------------------------------------------
# this file serves as the nexus of server-side operations; most requests are relayed through here by calling path controllers hierarchically
# here we are at "the haven"; welcome valiant warrior, your perserverance is the stuff of legends
# ---------------------------------------------------------------------------------------------------------------------------------------------




# tool :: Proc : system mains
# ---------------------------------------------------------------------------------------------------------------------------------------------
   class Proc
   {
      static $meta;



      static function init()
      {
         self::$meta->hush=knob(); self::$meta->hook=knob(); self::$meta->wait=500; $i=0;
         boot(); // boot all bootable stems

           if(facing('GUI'))
           {
              guiStrap();
              //ekko::head(['Referrer-Policy'=>'origin','cache'=>false,'cookies'=>true]); // send bootStrap headers
              $v=['botHoney'=>conf('Proc/badRobot')->lure,'busyGear'=>base64_encode(pget('/Proc/base/busy.htm'))];
              $r=import('/Proc/base/aard.htm',$v);
              echo($r); done(); // send BootStrap GUI keeping headers intact
           };

           if(facing('DPR')&&(NAVIPATH==='/Proc/base/boot.js'))
           {
              $a=scan('$'); $b=scan('/',FOLD); $l=concat($a,$b); $r=[]; foreach($l as $i)
              {
                 $p=path::conf($i); if(!$p){continue;}; $d=dval(pget("$p/autoboot"));
                 if(!is_assoc_array($d)||!isset($d['client'])){continue;};
                 $d=$d['client']; if(!$d){continue;}; if(isText($d)){$d=[$d];}; if(!isNuma($d)){continue;};
                 foreach($d as $f){if(!isText($f)){fail("invalid `autoboot` config in: `$p/autoboot`");}; $r[]=$f;};
              };

              $v=knob(['bootList'=>tval($r)]); unset($d); $d=[];
              $c=pget('/User/data/master/pass'); if(!$c){wack();}; if(password_verify('0m1cr0n!',$c)){$d[]='editRootPass';};
              $c=pget('/Proc/conf/autoMail'); if(!isin($c,'mail://')||!isin($c,'@')||!isin($c,'.')){$d[]='confAutoMail';}; // debug automail
              $v->badCfg=base64_encode(tval($d));

              finish(NAVIPATH,$v);
           }

         $p=NAVIPATH; Time::logEvent(); if(strpos($p,'/~/')===0){$p=lshave($p,'/~/'); $u=user('name'); $p="/User/data/$u/home/$p";};
         $r=path::call($p,__FILE__); // run PHP controller found in path .. this should exit here - else we handle it below:
         if(($r!==null)&&($r!==true)&&!is_class($r)){if(defn('HALT')||envi('HALT')){done($r);}; ekko($r);}; // respond with controller response
         if(isFold($p)){$i=path::indx($p,'aard.php'); if($i){$p=(rshave($p,'/')."/$i");}}; // if folder, check for index-file
         finish($p); // handle regular path
      }



      static function treeMenu()
      {
         $cn='name,path,mime,type';
         $al=path::ogle([using=>'$',fetch=>$cn,limit=>['type'=>'fold','levl'=>0]]);
         $ul=path::ogle([using=>'/',fetch=>$cn,limit=>['type'=>'fold','levl'=>0]]);
         $sl=fuse($al,$ul); $rl=[]; foreach($sl as $so)
         {
            $sc=path::conf($so->path); if(!$sc){continue;};
            $so->data=path::ogle([using=>$sc,fetch=>"$cn,data"]);
            $rl[]=$so;
         };
         ekko($rl);
      }



      static function openConf()
      {
          $v=knob($_POST); $p=$v->path; expect::path($p,[R,F]); $r=pget($p); ekko($r);
      }



      static function saveConf()
      {
      }



      static function impede($a)
      {
         if(!isText($a,1)){return;}; self::$meta->hush->$a=1;
      }



      static function resume($a)
      {
         if(!isText($a,1)){return;}; unset(self::$meta->hush->$a);
      }



      static function enhook($e=null,$p=null,$u=null)
      {
         $fc=0; if(!$e){$fc=1; $v=knob($_POST); $e=$v->emit; $p=$v->purl; $u=$v->uniq;}; // if from-client, or not
         if(!is_funnic($e)){fail::hooker('invalid event name');}; // must be a functional name
         if(!path($p)){fail::hooker('invalid path');}; $r=path::call($p,__FILE__); // call a closure or method by path
         if($r===null){fail::hooker("expecting `$p` as path-ref to an existing method -or closure");}; // path::call failed

         $s=sesn('HASH'); $h="/Proc/temp/sesn/$s/hook/$e"; $x=sha1(tval($r)); $o=['emit'=>$e,'purl'=>$p,'uniq'=>$x];
         path::make($h,encode::jso($o)); if(!$u||($u&&($u!==$x))){self::signal($e,$r);};
         if($fc){ekko(OK);};
      }



      static function dehook($e=null,$p=null)
      {
         $fc=0; if(!$e){$v=vars('client'); $e=$v->emit; $p=$v->purl;}; if(!is_funnic($e)){fail::hooker('invalid event name');};
         if(!path($p)){fail::hooker('invalid path');}; $s=sesn('HASH'); path::void("/Proc/temp/sesn/$s/hook/$e");
         if($fc){ekko(OK);};
      }



      static function emit($e,$d='!')
      {
         if(!isText($e,1)){return;}; if(!is_string($d)){$d=tval($d);};
         $d=base64_encode($d); $b=": \nevent: {$e}\ndata: {$d}\n\n";
         $bpad=4096; if($bpad&&(strlen($b)<$bpad)){do{$b.=' ';}while(strlen($b)<$bpad);}; if(facing('SSE')&&!headers_sent())
         {header_remove(); header("Content-Type: text/event-stream\n\n"); header('Cache-Control: no-cache, must-revalidate');};
         echo $b; if(ob_get_level()){ob_flush(); ob_clean();}; flush();
      }



      static function listen($evnt=null,$cbfn=null)
      {
         if(($evnt!==null)&&($cbfn!==null)){if(is_funnic($evnt)&&isFunc($cbfn))
         {
            // set blojob in file
            return;
         }
         else{fail('invalid args');}};

         while(ob_get_level()){ob_end_clean();}; if(facing('SSE')&&!headers_sent())
         {
             header_remove(); header("Content-Type: text/event-stream\n\n");
             header('Cache-Control: no-cache, must-revalidate'); flush();
             $_SERVER['SSEREADY']='yes';
         };
         requires::stem('Mail');

         $wait=self::$meta->wait; $rtmx=(ini_get('max_execution_time')*1); $utmx=conf('User/inactive'); $utxs=$utmx; $tout=0; $fade=12;
         $sesn=('/Proc/temp/sesn/'.sesn('HASH')); $epth="$sesn/emit"; $tbgn=time(); $tlst=$tbgn; $cntr=0;
         $sxed=encode::jso(['time'=>$fade]); $fapi=facing('API'); $lost=0; $fint=$fade; $lstn=knob();

         $stms=fuse(pget('$'),pget('/'));

         foreach($stms as $stem){if(isFold("/$stem/evnt"))
         {
            $sefl=pget("/$stem/evnt"); foreach($sefl as $sefn){$evnt=stub($sefn,'.'); $evnt=($evnt?$evnt[0]:null);
            if($evnt){if(!$lstn->$evnt){$lstn->$evnt=knob();}; $lstn->$evnt->{"$stem"}=import("/$stem/evnt/$sefn");}};
         }}; unset($stms,$stem,$sefl,$sefn,$evnt);

         for(;;)
         {
            if((connection_status()!==CONNECTION_NORMAL)||connection_aborted()){break;}; // halt if connection is unstable
            $tnow=time(); $tdif=($tnow-$tbgn); if((($tdif+$lost)+1)>=$rtmx){$tout=1; break;}; // force halt before runtime expires

            if(($tnow-$tlst)>=1)
            {
               $tlst=$tnow; $utxs--; xena::fetchNewAutoMail(); $lost+=(time()-$tnow); // update counters .. fetch mail only when necessary
               $utla=pget("$sesn/TIME"); if(!$utla){$utla=0;}; $usfn=(($tnow-$utla)>=($utmx-($fade*2)-$lost)); // User-Session-Fades-Now (bool)
               if($usfn){$fint--;}; if($fint<1){$utxs=$utmx; $fint=$fade; self::emit('sesnFade',$sxed);}else{self::emit('ping');};
            };

            $scan=pget($epth); if(isset($scan[0])){foreach($scan as $indx) // scan for events
            {
               $evnt=decode::jso("$epth/$indx"); void("$epth/$indx"); // emit this event only once
               if(!is_object($evnt)){continue;}; $en=$evnt->name; $ed=$evnt->data; // validate event object
               $hook=$lstn->$en; if($hook){foreach($hook as $sn => $fn){$fn($ed); unset($sn,$fn);}}; // call this event's hooks
               self::emit($en,$ed); unset($evnt,$en,$ed,$hook);  // emit this event to front-end .. clean up each iteration
            }};

            if(!$fapi){wait($wait);}else{break;};
         };

         done();
      }



      static function signal($e=null,$d=null,$t=null)
      {
         wait(1); // take a breather
         $fc=0; if($e===null){$v=knob($_POST); if($v->evnt){$fc=1; $e=$v->evnt; $d=json_decode(base64_decode($v->data)); $t=$v->trgt;}};
         if(!is_funnic($e)||self::$meta->hush->$e){return;}; // silence!!
         if($d===null){$d='!';}elseif(isAssa($d)||isKnob($d)){$d=knob($d);};
         if(($e==='busy')&&self::$meta->hush->{"$e.$d->with"}){return;}; // silence!! i keel yoo
         $h='/Proc/temp/sesn'; if($t==='*'){$t=pget($h);}elseif($t===null){$t=[sesn('HASH')];}; $c=0; $f=0;
         if(is_string($t)&&(strlen($t)>1)){$c=$t[0]; $f=substr($t,1);}; if(($c!=='#')&&($c!=='.')){$c=0;}; $w=self::$meta->wait;

         if($c!==0){$l=pget($h); $t=[]; foreach($l as $i)
         {
            $u=pget("$h/$i/USER"); $g=(($c==='.')?pget("/User/data/$u/clan"):''); if(($c==='#')&&($u===$f)){$t[]=$i;break;};
            if(($c==='.')&&isin($g,$f)){$t[]=$i;};
         }};

         if(!is_array($t)){return;}; if(count($t)<1){return;}; $d=encode::jso(['name'=>$e,'data'=>$d]); $s=0;
         foreach($t as $x){$p="$h/$x/emit"; if(!isee($p)){path::make("$p/");}; $n=count(pget($p)); $n++; $p="$p/$n"; path::make($p,$d); $s++;};
         if($fc){ekko(OK);}; wait(1); return $s;
      }



      static function toolMenu()
      {
         $r=pget('/Proc/tool'); ekko($r);
      }



      static function userTool($t,$f)
      {
         $o=import("/Proc/tool/$t"); $r=$o->$f(); ekko($r);
      }



      static function makeDurl()
      {
         permit::fubu('API');
         $v=knob($_POST); $p=$v->purl; if(!$p){ekko(FAIL);}; $l=isPath($p); $r=xeno::showHyperConduit($p); if(!$l&&!$r){ekko(FAIL);};
         $i=path::info($p); if($l){$p=crop($p); if(!isee($p)){ekko(404);}; ekko(durl($p));};
         if(!isin(['ftp','ftps','http','https'],$i->plug)){ekko(501);}; $f=path::leaf($i->path); $m=mime($f); if(!$m){ekko(415);};

         if(isin($i->plug,'ftp'))
         {
            $l=(new ftp($i->host,null,$i->user,$i->pass)); if($l->fail){ekko(FAIL);}; $l->pasv(true); $d=path::twig($i->path);
            $l->chdir($d); if($l->fail){ekko(FAIL);}; $r=$l->read($f); if($l->fail){ekko(FAIL);}; $r=base64_encode($r);
            $r="data:$m;base64,$r"; ekko($r);
         };

         $r=spuf($p); $r=base64_encode($r); $r="data:$m;base64,$r"; ekko($r);
      }



      static function makeTodo()
      {
         permit::fubu('API');
         $v=knob($_POST); $d=decode::jso(decode::b64($v->mesg));
         $r=todo::{"Bug reported"}($d->mesg,NOEXIT,$d); done($r);
      }



      static function scanFold()
      {
         permit::fubu('API','clan:work'); $v=knob($_POST); $p=rshave($v->path,'/'); if(!isFold($p)){done('[]');};
         $r=pget($p); $r=padded($r,"$p/",''); ekko($r);
      }



      static function scanPlug($d)
      {
         permit::fubu('clan:work'); $x=xeno::showHyperConduit($d);
         if(!$x){return;}; $q=path::info($x)->path; $l=crud($x)->select('*'); $r=[];
         if(!isList($l)){$r=knob(['head'=>mime($d),'body'=>$l]); return $r;};

         foreach($l as $i)
         {
            if(isKnob($i)&&isText($i->path)){$i=$i->path;}; if(!isText($i,1)){continue;};
            $i=lshave($i,$q); $r[]=$i;
         };

         return $r;
      }
   }
# ---------------------------------------------------------------------------------------------------------------------------------------------
