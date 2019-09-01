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
      }

      static function __init()
      {
      }
   # ------------------------------------------------------------------------------------------------------------------------------------------



   # func :: dispense : check for tasks, from both email and existing .. to be used with event-hook
   # ------------------------------------------------------------------------------------------------------------------------------------------
      static function dispense()
      {
         $r=knob(); $uc=sesn('CLAN'); $un=sesn('USER'); $l=path::ogle
         ([
            using => '/Task/data',
            fetch => '*',
            order => 'time:asc',
            limit => 'levl:3',
            shape => 'name:data',
         ]);

         foreach($l as $tr => $td)
         {
            $wc=$td->withClan; if(!is_array($wc)){$wc=explode(',',$wc);}; if(!isin($uc,$wc)){continue;}; $tt=isin($wc,'test');
            $wu=$td->withUser; $rc=pick($wc,['geek','draw','mind']);
            if(!$tt&&($un!==$wu)&&($wu!=='')){continue;}; // jobcard is work in progress with another user
            if($tt&&(!isin($uc,'test')||!$rc||!isin($uc,$rc))){continue;}; // jobcard is to be tested but current user cannot test
            if($tt&&($wu!==$un)){$l->$tr->inColumn='todo';}; // jobcard placed in both current user's `test` and in test-user's `todo`

            $f=$td->flagTags; if(!$f){$f='';}; $f=frag($f,','); foreach($f as $x => $n)
            {$i=pget("/Task/tags/$n"); if(!$i){fail("undefined task-tag `$n`");}; $f[$x]=$i;}; $l->$tr->tagIcons=$f; unset($f,$x,$n,$i);

            unset($cl,$cn,$cd); $cl=keys($td->comments); $cn=rpop($cl); $cd=dupe($td->comments->$cn); unset($td->comments);
            $cd->user=knob(['rate'=>User::ratingOf($cd->mail)]); $f=$cd->tags; if(!$f){$f='';};
            $f=frag($f,','); foreach($f as $x => $n){$i=pget("/Task/tags/$n"); if(!$i){fail("undefined task-tag `$n`");}; $f[$x]=$i;};
            $cd->tico=$f; $l->$tr->comments=knob([$cn=>$cd]);
            $r->$tr=$l->$tr;
         };

         return $r;
      }
   # ------------------------------------------------------------------------------------------------------------------------------------------



   # func :: moveCard : save the status of a jobcard when moved
   # ------------------------------------------------------------------------------------------------------------------------------------------
      static function moveCard()
      {
         $pv=knob($_POST); $un=sesn('USER'); $cn=sesn('CLAN'); $tn=time(); $dr=$pv->dref; $dp="/Task/data/$dr";
         $mt=$pv->mvto; $mf=pget("$dp/inColumn"); if(!$mf){ekko(GONE);}; $wu=pget("$dp/withUser"); path::make("$dp/withUser",$un);
         path::make("$dp/editTime",$tn); path::make("$dp/inColumn",$mt);
         flog::{"$dp/editLogs"}("moved from $mf to $mt by $un"); $dd=self::dispense();

         if($mt!=='test')
         {
            $wc=pget("$dp/withClan"); $wc=swap($wc,',test',''); path::make("$dp/withClan",$wc);
            // if($wu!==$un){$cf=decode::jso("$dp/cameFrom");};
            proc::signal('docketUpdate',$dd,'.work'); ekko(OK);
         };

         $wf=conf('Task/workFlow'); $pc=pick($cn,keys($wf)); if(!$pc){ekko("no workflow destination for `$mf`");};
         $nc=$wf->$pc; if(is_array($nc)){$nc=fuse($nc,',');}; path::make("$dp/withClan",$nc);
         proc::signal('docketUpdate',$dd,'.work'); ekko(OK);
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
         $o=knob($_POST); $h="/Task/data/$o->dref"; unset($o->dref);
         foreach($o as $k => $v){if(!isee("$h/$k")){continue;}; path::make("$h/$k",$v);};
         if(!$o->business){return OK;}; $m=pget("$h/fromAddy"); path::make("/Bill/data/contacts/.index/$m",$o->business);
         return OK;
      }
   # ------------------------------------------------------------------------------------------------------------------------------------------
   }
# ---------------------------------------------------------------------------------------------------------------------------------------------
