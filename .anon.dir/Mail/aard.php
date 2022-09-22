<?
namespace Anon;



# tool :: Mail : assistance
# ---------------------------------------------------------------------------------------------------------------------------------------------
   class Mail
   {
      static $meta;

      static function __init()
      {
         self::$meta->mbox=knob
         ([
            'inbox'=>'inbox',
            'drafts'=>'drafts',
            'flagged'=>'important',
            'important'=>'important',
            'starred'=>'important',
            'junk'=>'spam',
            'spam'=>'spam',
            'spambucket'=>'spam',
            'sent'=>'sent',
            'trash'=>'trash',
         ]);
      }


      static function mboxName($p)
      {
         if(!$p){$p='INBOX';}; $r=lowerCase($p); $s=stub($r,['/','.','\\']); if($s){$r=$s[2];}; $r=self::$meta->mbox->$r;
         return $r;
      }


      static function linkMenu()
      {
         $h='/Mail/vars/link'; $r=pget($h); dump($r);
      }


      static function openPlug($p=null)
      {
         if(!$p){$v=knob($_POST); $p=pget("/Mail/vars/link/$v->purl.url");}; $i=path::info($p); $u="$i->user@$i->host"; $h="/Mail/data/$u";
         Proc::signal('busy',['with'=>"mail",'done'=>10]);
         $l=crud($p)->descry(); Proc::signal('busy',['with'=>"mail",'done'=>100]); $r=[];
         if (is_object($l) && ($l->fail == 503)){ return $r; };
         if(!isee("$h/")){path::make("$h/");}; foreach($l as $i){$b=self::mboxName($i); if(!isee("$h/$b")){path::make("$h/$b/");}; $r[]=$b;};
         return $r;
      }


      static function fetchBox($prl,$box=null,$flt=null,$usr=null)
      {
         if(!$box){$box='INBOX';}; if(!$flt){$flt="flagTags !~ *seen*";}; if(!$usr){$i=path::info($prl); $usr="$i->user@$i->host";};
         $lck="$usr/$box"; if(lock::exists($lck)){return;}; lock::create($lck); $lnk=crud($prl);

// signal::dump("Mail :: about to select");

         $lst=$lnk->select
         ([
            using=>$box,
            fetch=>'*',
            where=>[$flt],
            touch=>true,
            order=>'unixTime:DSC',
         ]);

// signal::dump("Mail :: done select");
// signal::dump($lst);

         // if(!$lst){$lst=[];};
         if(!isee("/Mail/vars/link/$usr")){path::make("/Mail/vars/link/$usr",$prl);}; // do this here incase crud() fails; here we know it's ok
         $box=self::mboxName($box); $hme="/Mail/data/$usr/$box"; if((span($lst)>0)&&!isee($hme)){path::make("$hme/");};


         foreach($lst as $itm)
         {
            $hsh=sha1($itm->followID); $pth="$hme/$hsh"; if(isee($pth)){continue;};
            path::make("$pth/"); foreach($itm as $key => $val)
            {
               if($key!=='attached'){path::make("$pth/$key",$val);continue;}; if(span($val)<1){continue;};
               foreach($val as $k => $v){path::make("$pth/$key/$k",furl($v)->data);};
            };
            Proc::signal('newEmail',["destAddy"=>$itm->destAddy,"fromAddy"=>$itm->fromAddy,"savePath"=>$pth]);
         };

         lock::remove($lck); return true;
// Proc::signal("dump","step 6 .. Mail::fetchBox done"); wait(999);
      }


      static function readMbox()
      {
         $v=knob($_POST); $usr=$v->purl; $prl=pget("/Mail/vars/link/$usr.url"); $box=$v->mbox;
         $box=self::mboxName($box); $hme="/Mail/data/$usr/$box";

         $rsl=path::ogle
         ([
            using => $hme,
            fetch => '*',
            order => 'time:dsc',
            limit => ['levl'=>1, 'name'=>'unixTime,fromAddy,mesgHead'],
            shape => 'name:data',
         ]);

         return $rsl;
      }


      static function openMail($plg,$box)
      {
      }


      static function disposed($cmd,$ref=null)
      {
         $dom=HOSTNAME; if(!facing('API')){finish(420);}; if(envi('REQUEST_METHOD')!=='POST'){finish(405);}; if(!isWord($cmd)){finish(406);};

         if($cmd==='make')
         {
            if(!isText($ref)){$ref='';};
            $sfx=(random(2).swap(substr(BOOTTIME,6),'.','').random(2));
            $box="{$ref}{$sfx}@$dom";
            $ssn=sesn('HASH'); path::make("$/Proc/temp/sesn/$ssn/mbox",$box);
            $rsl=['box'=>$box, 'ref'=>$ssn]; ekko($rsl);
         };

         if($cmd==='read')
         {
            if(!isText($ref,40)){finish(406);}; $pth="/Proc/temp/sesn/$ref"; $box=pget("$pth/mbox"); if(!$box){finish(404);};
            $thn=(pget("$pth/TIME")*1); $now=time(); if(($now-$thn)<10){finish(429);}; $plg=conf('Mail/autoMail');
            $rsl=crud($plg)->select
            ([
               using=>'INBOX',
               fetch=>'*',
               where=>["destAddy = $box", "flagTags !~ *seen*"],
               touch=>true,
               order=>'unixTime:DSC',
            ]);
            ekko($rsl);
         };
      }
   }
# ---------------------------------------------------------------------------------------------------------------------------------------------




# tool :: xeno.sendMarkDownMail : send html email using markdown
# ---------------------------------------------------------------------------------------------------------------------------------------------
   xeno::learns('sendMarkDownMail',function($o)
   {
      if(is_assoc_array($o)){$o=knob($o);}; if(!isKnob($o)){fail('expecting object');}; $tn=time(); $mh=$o->mesgHead;
      if(!$o->mesgBody){$o->mesgBody=$o->textBody;}; if(!$o->mesgBody){$o->mesgBody=$o->htmlBody;}; $mb=$o->mesgBody;
      if(!isPath($mb)&&$mh){$th=sha1(mash($o,$tn)); $tp="/Proc/temp/file/$th.md"; path::make($tp,"# $mh\n\n$mb"); $o->mesgBody=$tp;};
      if(!isPath($o->mesgBody)){fail('expecting `mesgBody` as file path');}; $p=crop($o->mesgBody); $rp='/Proc/libs/marked/Parsedown.php';
      if(!isee($p)){fail("expecting `$p` as accessible file");}; if(!is_file(path($p))){fail("expecting `$p` as file");};
      if(!isKnob($o->varsUsed)){$o->varsUsed=knob($o->varsUsed);}; $mb=trim(import($p,$o->varsUsed)); $bh=stub($mb,"\n");
      if($bh){$bh=stub($bh[0],'# ');}; if($bh){$mh=trim($bh[2]);}; if(!$mh){fail("expecting `$p` as markdown file with a heading");};
      $mb=stub($mb,"\n"); $mb=trim($mb[2]); $tb=$mb; if(!isMail($o->destAddy)){fail('expecting `destAddy` as email address');}; requires::path($rp);
      $x=(new \Parsedown()); $x->setBreaksEnabled(true); $hb=$x->text($mb); $hb=import('$/Proc/libs/marked/page.htm',['parsed'=>$hb]);
      $da=$o->destAddy; if(!$da){$da=$o->destAddr;}; $dn=$o->destName; $fa=$o->fromAddy; if(!$fa){$fa=$o->fromAddr;}; $fn=$o->fromName;
      $c=conf('Proc/autoMail'); if(!$c){$c=pget("/Mail/vars/link/$fa");};
      if(!isin($c,['mail://','imap://'])){fail('invalid plug specification .. make sure the `fromAddr` (autoMail -or plug) is valid'); exit;};
      $mi=path::info($c); if(!$fa){$fa="$mi->user@$mi->host";};
      if(!online()){fail('`'.HOSTNAME.'` is offline'); exit;};

      $MO=// array
      [
        'fromAddr' => $fa,
        'fromName' => $fn,
        'destAddr' => $da,
        'destName' => $dn,
        'mesgHead' => $mh,
        'htmlBody' => $hb,
        'textBody' => $tb,
        'attached' => $o->attached,
      ];

      signal::dump("sending email to: $da");

      $r=plug($c)->insert
      ([
         debug => $o->runDebug,
         write => $MO,
      ]);

      if($r->fail)
      {
         $f=$r->fail; $m="Cannot send mail using `$c`\n\n";

         if(isin($f,'SMTP connect() failed'))
         {
            $i=path::info($c); $u="$i->user@$i->host";
            if(wrapOf($f)=='{}'){$f=decode::jso($f); dbug::view($f); exit;};
            $r="$m Make sure `$u` allows API access, check its inbox; see Anon manual.\n\nError details:\n$f";
         }
         elseif(arg($f)->startsWith('{"name":"Email","mesg":'))
         {
             $m=rstub($f,']}'); $m=($m[0].']}'); $m=decode::jso($m);
             dbug::view($m); exit;
         }
         elseif(arg($f)->startsWith('<head><title>'))
         {
             $eh=expose($f,'<h1>','</h1>'); if($eh){$eh=$eh[0];};
             $eb=expose($f,'<p>','</p>');  if($eb){$eb=$eb[0];};
             if(!$eh||!$eb){$r=$f;}else{$r="$eh\n$eb";};
         }
         else
         {
             $r="$m $f\n.. make sure the mailbox exists";
         };
         if($o->runDebug){fail::mailer($r);}; return $r;
      };

      signal::done("!");
      return OK;
   });
# ---------------------------------------------------------------------------------------------------------------------------------------------




# tool :: xena.fetchNewAutoMail : silently fetch each stem's email according to their configured purl
# ---------------------------------------------------------------------------------------------------------------------------------------------
   xena::learns('fetchNewAutoMail',function($now=null)
   {
      if(!userDoes('work','lead','sudo')||siteLocked()){return;}; $lock='xena.fetchNewAutoMail';
      $ri=conf('Mail/checkSec'); if(!is_int($ri)||($ri<5)){fail('invalid `checkSec` config in Mail .. expecting int > 4');}; // validate
      $tn=time(); $lr=pget('/Mail/vars/lastRead'); if(!$lr){$lr=($tn-($ri+1));}; $lr=($lr*1); $td=($tn-$lr);
      if(($td<$ri)||siteLocked()){return OK;}; // read later
      if(lock::exists($lock,$ri)){return ':BUSY:';};
      $l=fuse(pget('$'),pget('/')); $pl=[]; // $a=args(func_get_args());
      foreach($l as $i)
      {
          if(!isFold("/$i")){continue;}; $x=path::conf("/$i"); $c=pget("$x/autoMail");
          if($x&&$c&&!isin($pl,$c)){$pl[]=$c;}
      };
      if(!online()){signal::dump("xena :: server offline .. I'll fetchNewAutoMail later"); return;};
      lock::create($lock); // only run this once
      Proc::impede('busy.mail'); // let's do this dicreet
      foreach($pl as $pv)
      {
         if(!isPlug($pv)){signal::dump("xena::fetchNewAutoMail - ignored invalid mail plug: `$pv`"); continue;};
         Mail::openPlug($pv);
         Mail::fetchBox($pv);
      };
      Proc::resume('busy.mail');

      path::make('/Mail/vars/lastRead',$tn); lock::remove($lock); // all done
      return OK;
   });
# ---------------------------------------------------------------------------------------------------------------------------------------------
