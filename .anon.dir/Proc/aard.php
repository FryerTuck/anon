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
         self::$meta->hush=knob(); self::$meta->hook=knob(); self::$meta->wait=250;
         sesn(); $p=NAVIPATH; Time::logEvent();
         if(strpos($p,'/~/')===0){$p=ltrim($p,'/~/'); $u=user('name'); $p="/User/data/$u/home/$p";};
         $r=path::call($p,__FILE__); // run PHP controller found in path .. this should exit here - else we handle it below:
         if(($r!==null)&&($r!==true)){ekko($r);}; // there was a PHP controller, it returned something, so we respond with that
         if(is_dir(path($p))){$i=path::indx($p); if($i){$p=(rtrim($p,'/')."/$i");}}; // if folder, check for index-file
         finish($p); // handle regular path
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

         $s=acid(); $h="/Proc/temp/sesn/$s/hook/$e"; $x=sha1(tval($r)); $o=['emit'=>$e,'purl'=>$p,'uniq'=>$x];
         path::make($h,encode::jso($o)); if(!$u||($u&&($u!==$x))){self::signal($e,$r);};
         if($fc){ekko(OK);};
      }



      static function dehook($e=null,$p=null)
      {
         $fc=0; if(!$e){$v=vars('client'); $e=$v->emit; $p=$v->purl;}; if(!is_funnic($e)){fail::hooker('invalid event name');};
         if(!path($p)){fail::hooker('invalid path');}; $s=acid(); path::void("/Proc/temp/sesn/$s/hook/$e");
         if($fc){ekko(OK);};
      }



      static function emit($e,$d='!')
      {
         if(!isText($e,1)){return;}; if(!is_string($d)){$d=tval($d);};
         $d=base64_encode($d); $b=": \nevent: {$e}\ndata: {$d}\n\n";
         $bpad=4096; if($bpad&&(strlen($b)<$bpad)){do{$b.=' ';}while(strlen($b)<$bpad);};
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

         requires::stem('Mail'); while(ob_get_level()){ob_end_clean();}; if(facing('SSE')&&!headers_sent())
         {header_remove(); header("Content-Type: text/event-stream\n\n"); header('Cache-Control: no-cache, must-revalidate');};

         $wait=self::$meta->wait; $rtmx=(ini_get('max_execution_time')*1); $utmx=conf('User/inactive'); $utxs=$utmx; $tout=0; $fade=12;
         $sesn=('/Proc/temp/sesn/'.acid()); $epth="$sesn/emit"; $tbgn=time(); $tlst=$tbgn; $cntr=0;
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
               $evnt=decode::jso("$epth/$indx"); void("$epth/$indx"); $en=$evnt->name; $ed=$evnt->data; // emit this event only once
               $hook=$lstn->$en; if($hook){foreach($hook as $sn => $fn){$fn($ed); unset($sn,$fn);}}; // call this event's hooks
               self::emit($en,$ed); unset($evnt,$en,$ed,$hook);  // emit this event to front-end .. clean up each iteration
            }};

            if(!$fapi){wait($wait);}else{break;};
         };

         done();
      }



      static function signal($e=null,$d=null,$t=null)
      {
         $fc=0; if($e===null){$v=knob($_POST); if($v->evnt){$fc=1; $e=$v->evnt; $d=json_decode(base64_decode($v->data)); $t=$v->trgt;}};
         if(!is_funnic($e)||self::$meta->hush->$e){return;}; // silence!! i keel yoo
         if(isAssa($d)||isKnob($d)){$d=knob($d);}; if(($e==='busy')&&self::$meta->hush->{"$e.$d->with"}){return;}; // silence!!
         $h='/Proc/temp/sesn'; if($t==='*'){$t=pget($h);}elseif($t===null){$t=[acid()];}; $c=0; $f=0;
         // if($d===null){$sn=acid(); $hp="$h/$sn/hook/$e"; if(isee($hp)){$hd=decode::jso($hp); self::enhook($e,$hd->purl,$hd->uniq);return;}};
         if(is_string($t)&&(strlen($t)>1)){$c=$t[0]; $f=substr($t,1);}; if(($c!=='#')&&($c!=='.')){$c=0;}; $w=self::$meta->wait;

         if($c!==0){$l=pget($h); $t=[]; foreach($l as $i)
         {
            $u=pget("$h/$i/USER"); $g=(($c==='.')?pget("/User/data/$u/clan"):''); if(($c==='#')&&($u===$f)){$t[]=$i;break;};
            if(($c==='.')&&isin($g,$f)){$t[]=$i;};
         }};

         if(!is_array($t)){return;}; if(count($t)<1){return;}; $d=encode::jso(['name'=>$e,'data'=>$d]); $s=0;
         foreach($t as $x){$p="$h/$x/emit"; if(!isee($p)){path::make("$p/");}; $n=count(pget($p)); $n++; $p="$p/$n"; path::make($p,$d); $s++;};
         if($fc){ekko(OK);}; return $s;
      }



      static function toolMenu()
      {
         $r=pget('/Proc/tool'); ekko($r);
      }



      static function userTool($t,$f)
      {
         $o=import("/Proc/tool/$t"); $r=$o->$f(); ekko($r);
      }
   }
# ---------------------------------------------------------------------------------------------------------------------------------------------
