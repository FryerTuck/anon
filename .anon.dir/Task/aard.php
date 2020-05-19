<?
namespace Anon;



# info :: file : read this
# ---------------------------------------------------------------------------------------------------------------------------------------------
# this file serves as the server-side task handler
# ---------------------------------------------------------------------------------------------------------------------------------------------



# tool :: Task : task manager
# ---------------------------------------------------------------------------------------------------------------------------------------------
   class Task
   {
   # func :: init : initialize
   # ------------------------------------------------------------------------------------------------------------------------------------------
      static $meta;

      static function init()
      {
         permit::fubu('clan:work');
      }

      static function __init()
      {
         if((USERDEED==='select')&&that(NAVIPATH)->startsWith('/Task/data/'))
         {
            ekko::path(NAVIPATH);
         };
      }
   # ------------------------------------------------------------------------------------------------------------------------------------------



   # func :: dispense : returns card-data of tasks
   # ------------------------------------------------------------------------------------------------------------------------------------------
      static function dispense($l=null)
      {
         if(!isNuma($l)){$l=pget('/Task/data');}; $uc=sesn('CLAN'); $un=sesn('USER'); $r=knob();
         Proc::signal('busy',['with'=>'/Task/dispense','done'=>11]);

         foreach($l as $q)
         {
            $td=path::ogle
            ([
               using => "/Task/data/$q",
               fetch => '*',
               limit => 'levl:2',
               shape => 'name:data',
            ]);

            $bn=$td->business; if(!$bn){$bn=find::firmByMail($td->fromAddy); $td->business=$bn;}; // get business name
            $wc=$td->withClan; if(!is_array($wc)){$wc=explode(',',$wc);}; //if(!isin($uc,$wc)){continue;}; // not meant for current user's clan
            $ll=explode("\n",$td->editLogs); $ll=rpop($ll); $tt=isin($ll,"to test by"); $td->mesgHead=encode::b64($td->mesgHead);
            $wu=$td->withUser; $fu=$td->fromUser; $fc=find::clanByUser($fu); if($fc)
            {xpop($fc,'work'); xpop($fc,'sort'); xpop($fc,'test'); xpop($fc,'gang'); xpop($fc,'lead'); xpop($fc,'sudo'); xpop($fc,'surf');}
            if(!$fc||(span($fc)<1)){$fc=['sort'];}; $rc=pick($uc,$fc);
            if($wu&&($un!==$wu)){continue;}; // jobcard is work in progress with another user
            if(!$wu&&($fu!==$un)&&!$rc){continue;}; // jobcard is to be tested, but current user is not releated in any way
            if(!$wu&&($fu===$un)&&$tt){$td->inColumn='test';}; // jobcard is seen in both the from user's `test` and in target-user's `todo`

            $f=$td->flagTags; if(!$f){$f='';}; $f=frag($f,','); foreach($f as $x => $n)
            {$i=pget("/Task/tags/$n"); if(!$i){fail("undefined task-tag `$n`");}; $f[$x]=$i;}; $td->tagIcons=$f; unset($f,$x,$n,$i);

            unset($cl,$cn,$cd); $cl=keys($td->comments); $cn=rpop($cl); $cd=dupe($td->comments->$cn); unset($td->comments);
            $cd->user=knob(['rate'=>User::ratingOf($cd->mail)]); $f=$cd->tags; if(!$f){$f='';};
            $f=frag($f,','); foreach($f as $x => $n){$i=pget("/Task/tags/$n"); if(!$i){fail("undefined task-tag `$n`");}; $f[$x]=$i;};
            $cd->mesg=encode::b64($cd->mesg); $cd->tico=$f; $td->comments=knob([$cn=>$cd]); $r->$q=$td;
         };

         Proc::signal('busy',['with'=>'/Task/dispense','done'=>100]);

         if(NAVIPATH==='/Task/dispense'){ekko($r);return;};
         return $r;
      }
   # ------------------------------------------------------------------------------------------------------------------------------------------



   # func :: moveCard : save the status of a jobcard when moved
   # ------------------------------------------------------------------------------------------------------------------------------------------
      static function moveCard()
      {
         $pv=knob($_POST); $dr=$pv->dref; $mt=$pv->mvto; $dp="/Task/data/$dr"; if(lock::exists($dp)){ekko(GONE);}; lock::create($dp);
         $el=pget("$dp/editLogs"); $tn=time(); path::make("$dp/editTime",$tn); $un=sesn('USER'); $cn=sesn('CLAN');
         $mf=pget("$dp/inColumn"); flog::{"$dp/editLogs"}("moved from $mf to $mt by $un"); $wf=conf('Task/workFlow'); $pc=pick($cn,keys($wf));

         if($mt!=='test')
         {
            path::make("$dp/fromUser",''); path::make("$dp/withClan",$pc); path::make("$dp/withUser",$un); path::make("$dp/inColumn",$mt);
            lock::remove($dp); $dd=self::dispense([$dr]); proc::signal('docketUpdate',$dd,'.work'); ekko(OK);
         };

         if(!$pc){ekko("no workflow destination from `$mf`");}; $nc=$wf->$pc;
         if(is_array($nc)){$nc=fuse($nc,',');}; $nu=find::userByClan($nc);
         if(!$nu){fail::workflow("next clan `$nc` has no members; nobody to receive this job");};

         path::make("$dp/fromUser",$un); path::make("$dp/withClan",$nc); path::make("$dp/withUser",''); path::make("$dp/inColumn",'todo');
         lock::remove($dp); $dd=self::dispense([$dr]); proc::signal('docketUpdate',$dd,'.work'); ekko(OK);
      }
   # ------------------------------------------------------------------------------------------------------------------------------------------



   # func :: readCard : get kanBoard card from dokt reference
   # ------------------------------------------------------------------------------------------------------------------------------------------
      // static function readCard($x)
      // {
      //    expect::text($x,12); $d=path::ogle($x); dump($x);
      // }
   # ------------------------------------------------------------------------------------------------------------------------------------------



   # func :: fromPath : create new docket from folder .. like a fetched email .. expects relevant filenames in this folder
   # ------------------------------------------------------------------------------------------------------------------------------------------
      static function fromPath($p)
      {

      }
   # ------------------------------------------------------------------------------------------------------------------------------------------



   # func :: makeDokt : create new docket
   # ------------------------------------------------------------------------------------------------------------------------------------------
      static function makeDokt($o)
      {
         if(isAssa($o)){$o=knob($o);}; if(!isKnob($o)){fail('expecting assoc_array or object');}; // validate argument type
         if(!isWord($o->nick)){fail('expecting `nick` as word');}; // validate fromName
         if(!isMail($o->mail)){fail('expecting `mail` as valid email address');}; // validate fromAddy
         $p=stub($o->mesg,"\n"); if(!$p){fail('invalid message, expecting new-line');}; // validate message
         $s=stub($p[0],"# "); if(!$s){fail('invalid `mesg` subject, expecting valid markdown with heading');}; // validate subject
         $b=trim($p[2]); if(!$b){fail('invalid message body');}; $t=time(); // validate body & make reference
         $r=($o->dref?$o->dref:gudref('/Task/data',12)); $un=($o->user?$o->user:(find::userByMail($o->mail)));

         if(isee("/Task/data/$r")){return OK;};

         $cf=[['nick'=>$o->nick,'mail'=>$o->mail,'user'=>$un,'clan'=>sesn('CLAN')]];
         $q=knob
         ([
            // 'cameFrom'=>encode::jso($cf),
            'docketID'=>$r,
            'business'=>$o->firm,
            'workPath'=>($o->path?$o->path:''),
            'editLogs'=>"$t\tcreated by $o->nick\n",
            'editTime'=>$t,
            'flagTags'=>($o->tags?$o->tags:''),
            'fromAddy'=>$o->mail,
            'destAddy'=>$o->dest,
            'fromName'=>$o->nick,
            'fromUser'=>$un,
            // 'handlers'=>'',
            'initTime'=>$t,
            'mesgHead'=>$s[2],
            'priority'=>'normal',
            'inColumn'=>'todo',
            'withClan'=>($o->clan?$o->clan:'sort'),
            'withUser'=>'',
         ]);
         expect::path('/Task/data',W); $h="/Task/data/$r"; foreach($q as $k => $v){path::make("$h/$k",$v);}; // create text-data references
         self::makeNote($o); // create dokt body-text and any attachements as 1 comment
         return OK;
      }
   # ------------------------------------------------------------------------------------------------------------------------------------------



   # func :: makeNote : create comment in existing docket
   # ------------------------------------------------------------------------------------------------------------------------------------------
      static function makeNote($o)
      {
         $r=$o->dref; $a=$o->atch; unset($o->dref,$o->clan,$o->firm,$o->atch);
         $h="/Task/data/$r/comments"; $x=($o->cref?$o->cref:gudref($h,16)); unset($o->cref); $h="$h/$x"; if(!isee($h)){path::make("$h/");};
         $o->time=time(); $o->rate=0; foreach($o as $k => $v){path::make("$h/$k",$v);}; // create text-data
         if(isKnob($a)){foreach($a as $f => $d){if(isDurl($d)){$d=furl($d)->data;}; path::make("$h/atch/$f",$d); $d=null;}}; // attachments
         $dd=self::dispense(); if(span($dd)>0){proc::signal('docketUpdate',$dd,'.work');};
         return OK;
      }
   # ------------------------------------------------------------------------------------------------------------------------------------------



   # func :: voteNote : rate comment
   # ------------------------------------------------------------------------------------------------------------------------------------------
      static function voteNote($d=null,$c=null,$v=null)
      {
         if(!$d){$x=knob($_POST); $d=$x->dref; $c=$x->cref; $v=$x->vote;}; $h="/Task/data/$d/comments/$c";
         $t=pget("$h/mail"); $f=user('mail'); if($t===$f){return 'voting your own comment is not supported';}; $vb=0;
         if(isee("$h/vote/$f")){$vb=1; $y=pget("$h/vote/$f"); if($y===$v){return 'cannot vote the same twice';}};
         path::make("$h/vote/$f",$v); $q=(($v==='+')?1:-1); $x=(pget("$h/rate")*1); $x=($x+$q); path::make("$h/rate",$x);
         User::voteMail($t,$v,$vb); return OK;
      }
   # ------------------------------------------------------------------------------------------------------------------------------------------



   # func :: openDokt : get the contents of a docket
   # ------------------------------------------------------------------------------------------------------------------------------------------
      static function openDokt($dref=null)
      {
         if(!$dref){$v=knob($_POST); $dref=$v->dref;}; $rd=[]; $hp="/Task/data/$dref/comments"; $cl=pget($hp);

         foreach($cl as $ci)
         {
            $co=knob(['cref'=>$ci]); $dl=pget("$hp/$ci"); foreach($dl as $di){$co->$di=pget("$hp/$ci/$di");};
            $co->repu=User::ratingOf($co->mail); $co->firm=find::firmByMail($co->mail);
            $rd[]=$co;
         };

         return $rd;
      }
   # ------------------------------------------------------------------------------------------------------------------------------------------



   # func :: saveConf : save docket properties
   # ------------------------------------------------------------------------------------------------------------------------------------------
      static function saveConf()
      {
         $o=knob($_POST); $dr=$o->dref; $h="/Task/data/$dr"; unset($o->dref);
         foreach($o as $k => $v){if(!isee("$h/$k")){continue;}; path::make("$h/$k",$v);};
         $dd=self::dispense([$dr]); proc::signal('docketUpdate',$dd,'.work');
         if($o->business===null){return OK;}; $m=pget("$h/fromAddy"); path::make("/Bill/data/contacts/.index/$m",$o->business);
         return OK;
      }
   # ------------------------------------------------------------------------------------------------------------------------------------------



   # func :: saveAtch : save attachments
   # ------------------------------------------------------------------------------------------------------------------------------------------
      static function saveAtch()
      {
         $ad=knob($_POST); $fp=$ad->path; $dp=$ad->dest; $xp=xeno::showHyperConduit($dp);
         if(!$xp){foreach($ad->data as $fn){path::copy("$fp/$fn","$dp/$fn");}; return OK;};

         $i=path::info($xp); $e=0; if(isin($i->plug,'ftp'))
         {
            $l=(new ftp($i->host,null,$i->user,$i->pass)); if($l->fail){ekko(FAIL);}; $l->pasv(true); $l->chdir($i->path);
            if($l->fail){ekko(FAIL);}; foreach($ad->data as $fn){$l->put($fn,path("$fp/$fn"),FTP_BINARY); $e=$l->fail; if($e){$f=$fn;break;}};
            if(!$e){ekko(OK);}; ekko("failed to save `$f` in `$dp`\n\n$e");
         };
      }
   # ------------------------------------------------------------------------------------------------------------------------------------------



   # func :: makeCmnt : save & send comment made on open docket
   # ------------------------------------------------------------------------------------------------------------------------------------------
      static function makeCmnt()
      {
         $co=knob($_POST); $dr=$co->dref; $dp="/Task/data/$dr"; $un=user('name'); $co->nick=$un; $co->user=$un;
         $co->mail=user('mail'); $mh=pget("$dp/mesgHead"); $da=0; $mp=stub($co->mesg,"\n"); $bw=conf('Proc/badWords'); $af=$co->atch;
         if($mp&&(strpos($mp[0],'#')===0)){$mp[0]=substr(trim($mp[0]),1); if(isMail($mp[0])){$da=$mp[0]; $co->mesg=trim($mp[2]);}};
         if(span($co->mesg)<2){ekko('invalid message');}; if(isin($co->mesg,$bw)){ekko('try "less crude" words .. sarcasm could be nice ;)');};
         self::makeNote($co); if(!$da){ekko(OK);}; $fa=pget("$dp/destAddy"); $mh="About docket #$dr - $mh"; requires::stem('Mail');
         xeno::sendMarkDownMail(['fromAddy'=>$fa,'destAddy'=>$da, 'mesgHead'=>$mh, 'mesgBody'=>$co->mesg, 'attached'=>$af, 'runDebug'=>true]);
         return OK;
      }
   # ------------------------------------------------------------------------------------------------------------------------------------------



   # func :: voidDokt : delete docket by doktID
   # ------------------------------------------------------------------------------------------------------------------------------------------
      static function voidDokt()
      {
         $po=knob($_POST); $dr=$po->dref; $dp="/Task/data/$dr";
         Proc::signal('docketDelete',$dr,'.work');
         $r=path::void($dp); return ($r?OK:FAIL);
      }
   # ------------------------------------------------------------------------------------------------------------------------------------------
   }
# ---------------------------------------------------------------------------------------------------------------------------------------------
