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



      static function __init()
      {
         self::$meta = knob();
         self::$meta->hush = knob();
         self::$meta->hook = knob();
         self::$meta->wait = $_SERVER['SYSCLOCK']->server;
         self::$meta->keep = $_SERVER['SYSCLOCK']->upkeep;

         spl_autoload_register(function($n)
         {$n=str_replace('Anon\\','',$n); import($n);}); // auto-load class-assoc PHP file
      }



      static function init()
      {
         $p=NAVIPATH; Time::logEvent(); $q='~/.tmp/Site/';
         if(isin($p,($q.$q))){$p=swap($p,($q.$q),$q);}; // HACK !! TODO :: fix this elsewhere
         if(strpos($p,'/~/')===0){$p=lshave($p,'/~/'); $u=user('name'); $p="/User/data/$u/home/$p";};
         $r=path::call($p,__FILE__); // run PHP controller found in path .. this should exit here - else we handle it below:
         if(($r!==null)&&($r!==true)&&!is_class($r)){if(defn('HALT')||envi('HALT')){done($r);}; ekko($r);}; // respond with controller response

         Site::handle($p);
      }



      static function execPath()
      {
         permit::fubu('clan:work,lead,sudo'); // can only be run when logged in
         $po=knob($_POST); $pn=$po->pathName; $rp=(isFold($pn)?("$pn/".path::indx($pn)):"$pn.php");
         $rp=isee($rp); if(!$rp){finish(404);}; $rp=path($rp); // we need an existing php file
         dbug::trap('overflow',function($e){ekko($e); exit;}); // fail on any errors, warnings, etc

         require_once $rp; exit;
      }



      static function xenoCall()
      {
         permit::fubu('clan:work,lead,sudo'); // can only be run when logged in
         $po=knob($_POST); $pf=$po->func; $pa=$po->args; $pd=$po->deps; if(isText($pd)){$pd=[$pd];}; if(!isNuma($pd,1)){$pd=null;};
         $db=$po->dbug;
         $af='imap_open xena::fetchNewAutoMail'; // allowed functions
         $ad='Mail'; // allowed dependencies
         wait(conf::Proc('sysClock')->server);

         if(!isin($af,$pf)||($pd&&!isin($ad,$pd))){ekko(':WACK:'); exit;}; // security!
         if($pd){requires::stem($pd);}; // require all dependencies

         if(!$db){$eh=defail(1); $rt=call($pf,$pa); $ob=enfail($eh); ekko($rt); exit;};
         $rt=call($pf,$pa,1); ekko($rt); exit;
      }



      static function treeMenu()
      {
         permit::fubu('clan:work,lead,sudo');
         $cn='name,path,mime,type'; $tn=conf('Site/autoConf')->template; if(!isText($tn,1)){$tn='Anon';};
         $tp="$/Site/tmpl/$tn/conf/"; if(!isee($tp)){fail::tampering("expecting existing path: `$tp`"); return;};
         $al=path::ogle([using=>'$',fetch=>$cn,limit=>['type'=>'fold','levl'=>0]]);
         $ul=path::ogle([using=>'/',fetch=>$cn,limit=>['type'=>'fold','levl'=>0]]);
         $sl=array_merge($al,$ul); $rl=[]; foreach($sl as $so)
         {
            $sc=path::conf($so->path); if(!$sc){continue;};
            $so->data=path::ogle([using=>$sc,fetch=>"$cn,data"]);
            if($so->path=='$/Site'){$so->data=array_merge($so->data,path::ogle([using=>$tp,fetch=>"$cn,data"]));};
            $rl[]=$so;
         };
         ekko($rl);
      }



      static function openConf()
      {
          permit::fubu('clan:lead,sudo,geek');
          $v=knob($_POST); $p=$v->path; $v=dval(pget($p)); if(isAsso($v)){$v=knob($v);};
          if(isAsso($v)){$v=knob($v);}; if(!isKnob($v)&&!isNuma($v)){$v=[$v];};
          ekko($v);
      }



      static function saveConf()
      {
          permit::fubu('clan:lead,sudo,geek'); $v=knob($_POST); $p=$v->path; $d=decode::b64($v->bufr);
          $r=path::make($p,$d); if(!$r&&($r!==0)){fail::config("could not save $p");return;};
          signal::ClientReboot("system configuration changed","*");
          ekko(OK);
      }



      static function impede($a)
      {
         permit::fubu();
         if(!isText($a,1)){return;}; self::$meta->hush->$a=1;
      }



      static function resume($a)
      {
         permit::fubu();
         if(!isText($a,1)){return;}; unset(self::$meta->hush->$a);
      }



      static function enhook($e=null,$p=null,$u=null)
      {
         permit::fubu();
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
         permit::fubu();
         $fc=0; if(!$e){$v=vars('client'); $e=$v->emit; $p=$v->purl;}; if(!is_funnic($e)){fail::hooker('invalid event name');};
         if(!path($p)){fail::hooker('invalid path');}; $s=sesn('HASH'); path::void("$/Proc/temp/sesn/$s/hook/$e");
         if($fc){ekko(OK);};
      }



      static function emit($e,$d='!')
      {
         permit::fubu(); // security
         if(!is_string($e)||!$e){$e='undefined';}; if(!is_string($d)){$d=tval($d);};
         $k=sesn('HASH'); $d=base64_encode($d); $b=": \nevent: $e\ndata: $d\n\n";
         while(strlen($b)<8400){$b.=' ';}; // padd event with whitespace .. if too short then the connection will restart
         if(facing('SSE')&&!headers_sent())
         {header_remove(); header("Content-Type: text/event-stream\n\n"); header('Cache-Control: no-cache, must-revalidate');};
         echo $b; return;
      }



      static function listen($evnt=null,$cbfn=null)
      {
         permit::fubu();
         if(($evnt!==null)&&($cbfn!==null)){if(is_funnic($evnt)&&isFunc($cbfn))
         {
            // TODO :: set blojob somewhere
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

         $wait=self::$meta->wait; $rtmx=(ini_get('max_execution_time')*1); $utmx=conf('User/inactive'); $utxs=$utmx; $fade=12;
         $sesn=('$/Proc/temp/sesn/'.sesn('HASH')); $epth="$sesn/emit"; $tbgn=time(); $tlst=$tbgn; $cntr=0; $mxrt=($rtmx-$fade);
         $sxed=encode::jso(['time'=>$fade]); $fapi=facing('API'); $wapi=0; $lost=0; $fint=$fade; $lstn=knob(); $lpng=0;
         $emri=conf('Mail/checkSec'); if(!is_int($emri)||($emri<5)){$emri=5;}; $emlr=0; $work=userDoes('work');

         if(!isFold($epth)){path::make("$epth/");};
         $stms=fuse(pget('$'),pget('/')); $keep=self::$meta->keep;

         foreach($stms as $stem){if(isFold("/$stem/evnt"))
         {
            $sefl=pget("/$stem/evnt"); foreach($sefl as $sefn){$evnt=stub($sefn,'.'); $evnt=($evnt?$evnt[0]:null);
            if($evnt){if(!$lstn->$evnt){$lstn->$evnt=knob();}; $lstn->$evnt->{"$stem"}=import("/$stem/evnt/$sefn");}};
         }}; unset($stms,$stem,$sefl,$sefn,$evnt);

         self::emit('init','!',1); wait($wait); self::emit('init','!',1); wait($wait); self::emit('init','!',1); wait($wait);
         self::emit('open','!',1); wait($wait);


         for(;;)
         {
         // step :: 1 : setup - check if SSE process is still viable and define some variables needed in this loop
         // -----------------------------------------------------------------------------------------------------------------------------------
            if((connection_status()!==CONNECTION_NORMAL)||connection_aborted()){break;}; // halt if connection is unstable
            $tnow=time(); $ping=0; if(($tnow-$lpng)>=$fade){$ping=1; $lpng=$tnow;}; // time-now, ping-bool, last-ping
            if(($tnow-$tbgn)>=($rtmx-1)){self::emit('gone'); wait($wait); break;}; // process needs to be refreshed .. dies here if true
            unset($huks); $huks=knob(); // we need this empty here, to be filled with event-names that may have listeners
         // -----------------------------------------------------------------------------------------------------------------------------------


         // step :: 2 : scan for any events written in current session and send those first, if we run any hooks before this we may miss events
         // -----------------------------------------------------------------------------------------------------------------------------------
            if(!isFold($epth)){break;}; $scan=pget($epth); // user may have been deleted
            if(isset($scan[0])){foreach($scan as $indx) // scan for events
            {
               if(!isee("$epth/$indx")){continue;}; // it just disappeared
               if(aged("$epth/$indx")>=$mxrt){void("$epth/$indx"); continue;}; // stale .. avoid old events
               $evnt=decode::jso("$epth/$indx"); void("$epth/$indx"); // read and destroy

               if(is_object($evnt)) // safety-check .. avoid errors and warnings & notices here
               {
                  $en=$evnt->name; $ed=$evnt->data; // validate event object
                  $hook=$lstn->$en; if($hook){$huks->$en=knob(['huks'=>$hook,'args'=>$ed]);}; // enqeue this event's hooks (if any)
                  self::emit($en,$ed); $ping=0; unset($evnt,$en,$ed,$hook);  // emit this event to front-end .. clean up each iteration
               }
            }};
         // -----------------------------------------------------------------------------------------------------------------------------------


         // step :: 3 : each event found in `step 2` may have had listeners attached, call them now
         // -----------------------------------------------------------------------------------------------------------------------------------
            foreach($huks as $en => $hk)
            {
               foreach($hk->huks as $sn => $fn){$fn($hk->args);}
            };
            unset($en,$hk,$sn,$fn);
         // -----------------------------------------------------------------------------------------------------------------------------------


         // step :: 4 : this happens every 1 second .. emit if it's mail-time, or if the user's session is about to expire
         // -----------------------------------------------------------------------------------------------------------------------------------
            if(($tnow-$tlst)>=1)
            {
               $tlst=$tnow; $utxs--;
               if((($tnow-$emlr)>=$emri)&&$work){$emlr=$tnow; $ping=0; xena::fetchNewAutoMail(); $lost=(time()-$tnow);}; // fetch mail
               $utla=pget("$sesn/TIME"); if(!$utla){$utla=0;}; $usfn=(($tnow-$utla)>=($utmx-($fade*2)-$lost)); // User-Session-Fades-Now (bool)
               if($usfn){$fint--;}; if($fint<1){$utxs=$utmx; $fint=$fade; if($work){$ping=0; self::emit('sesnFade',$sxed);}};

               if(userDoes("sudo lead gang"))
               {
                   $updt=pget('$/Proc/vars/lastUpdt','0'); $updt*=1; if(($tnow-$updt)>$keep)
                   {Anon::checkUpdates(); path::make('$/Proc/vars/lastUpdt',time());};
               };
            };
         // -----------------------------------------------------------------------------------------------------------------------------------


         // step :: 5 : control the open stream .. send ping to make sure it stays open for process max exec time while in SSE-mode
         // -----------------------------------------------------------------------------------------------------------------------------------
            if(!$fapi){if($ping){self::emit('ping');}; wait($wait);continue;}; // no API-check .. this is only SSE - continue listening
            break; // API for SSE-health-check - stop here
         // -----------------------------------------------------------------------------------------------------------------------------------
         };

         if(!$fapi){done(); exit;};
         $f=dbug::wash(__FILE__);  $l=__LINE__;  $f="file: $f";  $l="line: $l";
         ekko("SSE listener-loop clean exit; no errors encountered in 3 loops.\n\n```\n$f\n$l\n```\n");
      }



      static function signal($e=null,$d=null,$t=null,$omit=null)
      {
         wait(1); $fc=0; if($e===null) // get event from client API post
         {
             $v=knob($_POST); if(!isWord($v->evnt)||!isin(keys($v),'data')){ekko("invalid event definition");};
             $fc=1; $e=$v->evnt; $d=json_decode(base64_decode($v->data)); $t=$v->trgt;
         };
         if(!is_funnic($e)||self::$meta->hush->$e){return;}; // silence!!
         if(!isText($t,2)){$t=('#'.sesn('HASH'));}; // no-target = current-session

         if($d===null){$d='!';}elseif(isAssa($d)||isKnob($d)){$d=knob($d);}; // data reference uniformity
         if(($e==='busy')&&self::$meta->hush->{"$e.$d->with"}){return;}; // silence!! i keel yoo
         $h='/Proc/temp/sesn'; $c=0; $f=0;
         if(is_string($t)&&(strlen($t)>1)){$c=$t[0]; $f=substr($t,1);};

         $w=self::$meta->wait; $l=pget($h); $t=[]; foreach($l as $i)
         {
            if(isin($omit,$i)){continue;}; // omitted for specified session id
            $u=pget("$h/$i/USER"); if(($c==='@')&&($u===$f)){$t[]=$i;break;};       // target user specified
            if(($c==='#')&&($i===$f)){$t[]=$i;break;};                              // target sesn specified
            if(($c==='.')&&isin(pget("/User/data/$u/clan"),$f)){$t[]=$i;continue;}; // target clan specified
            if($c==='*'){$t[]=$i;}; // everyone connected
         };

         if(!isNuma($t,1)){return;}; // nothing to do
         $d=encode::jso(['name'=>$e,'data'=>$d]); $s=0; unset($x);

         foreach($t as $x)
         {
             $p="$h/$x/emit"; if(!isee($p)){path::make("$p/");}; // count items in existing "emit" folder for next name
             $n=count(pget($p)); $n++; $p="$p/$n"; flog("signal",$p,$d);
             path::make($p,$d); $s++; // plain-text file now contains the event data
         };

         if($fc){ekko(OK);}; // was from client
         wait(1); return $s;
      }



      static function toolMenu()
      {
         permit::fubu();
         $r=pget('$/Proc/tool'); ekko($r);
      }



      static function userTool($t,$f)
      {
         permit::fubu();
         $o=import("$/Proc/tool/$t"); $r=$o->$f(); ekko($r);
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
         permit::fubu('API'); $v=knob($_POST); $d=decode::jso(decode::b64($v->mesg));
         $m=$d->mesg; $s=stub($m,"This spilled out:");
         if($s){$m=trim($s[0]); $o=isJson(trim($s[2])); if(isKnob($o)&&$o->stak){$o->mesg="$m .. $o->mesg"; $d=$o;}};
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



      static function update()
      {
         permit::fubu('clan:lead,sudo');
         // $mp='$/User/data/master/pass'; $pw=pget($mp);
         // path::make($mp,pget('$/Proc/info/pass.inf'));
         $uw=posted("from"); $cw=(proprCase($uw).'Branch');
         $rp="$/Repo/data/native/$uw"; $gr=conf("Repo/gitRefer");

         Repo::update($rp,$gr->$cw,'pull','origin');
         // path::make($mp,$pw); 
         $we=Repo::differ($rp,'origin',$gr->$cw);
         signal::ClientReboot("new system updates from $cw","*");
         return OK;
      }
   }
# ---------------------------------------------------------------------------------------------------------------------------------------------



# tool :: signal : syntax sugar for Proc::signal('evenName','eventData');
# ---------------------------------------------------------------------------------------------------------------------------------------------
   class signal
   {
      static function __callStatic($n,$a)
      {
         $e=trim($n); if(!is_funnic($e)){fail::Reference("invalid event name: $n");return;};
         $d=null; $t=null; if(isset($a[0])){$d=$a[0];}; if(isset($a[1])){$t=$a[1];};
         $c=conf::Proc('sysClock')->server; if(!is_int($c)){$c=100;};
         $r=Proc::signal($n,$d,$t); wait($c); return $r;
      }
   }
# ---------------------------------------------------------------------------------------------------------------------------------------------


    Proc::__init();
