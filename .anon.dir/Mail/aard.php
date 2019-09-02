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
         $h='/Mail/link'; $r=pget($h); dump($r);
      }


      static function openPlug($p=null)
      {
         if(!$p){$v=knob($_POST); $p=pget("/Mail/link/$v->purl.url");}; $i=path::info($p); $u="$i->user@$i->host"; $h="/Mail/data/$u";
         Proc::signal('busy',['with'=>"mail",'done'=>10]); $l=crud($p)->descry(); Proc::signal('busy',['with'=>"mail",'done'=>100]); $r=[];
         if(!isee("$h/")){path::make("$h/");}; foreach($l as $i){$b=self::mboxName($i); if(!isee("$h/$b")){path::make("$h/$b/");}; $r[]=$b;};
         return $r;
      }


      static function fetchBox($prl,$box=null,$flt=null,$usr=null)
      {

         if(!$box){$box='INBOX';}; if(!$flt){$flt="flagTags !~ *seen*";}; if(!$usr){$i=path::info($prl); $usr="$i->user@$i->host";};
         $lck="$usr/$box"; if(lock::exists($lck)){return;}; lock::create($lck); $lnk=crud($prl);

         $lst=$lnk->select
         ([
            using=>$box,
            fetch=>'*',
            where=>[$flt],
            touch=>true,
            order=>'unixTime:DSC',
         ]);

         if(!isee("/Mail/link/$usr")){path::make("/Mail/link/$usr",$prl);}; // do this here incase crud() fails; here we know it's ok
         $box=self::mboxName($box); $hme="/Mail/data/$usr/$box"; if((span($lst)>0)&&!isee($hme)){path::make("$hme/");};

         foreach($lst as $itm)
         {
            $hsh=sha1($itm->followID); $pth="$hme/$hsh"; if(isee($pth)){continue;};
            Proc::signal('newEmail',["destAddy"=>$itm->destAddy,"fromAddy"=>$itm->fromAddy,"savePath"=>$pth]);
            // if(isee($pth)){continue;};
            path::make("$pth/"); foreach($itm as $key => $val)
            {
               if($key!=='attached'){path::make("$pth/$key",$val);continue;}; if(span($val)<1){continue;};
               foreach($val as $k => $v){path::make("$pth/$key/$k",furl($v)->data);};
            };
         };

         lock::remove($lck); return true;
      }


      static function readMbox()
      {
         $v=knob($_POST); $usr=$v->purl; $prl=pget("/Mail/link/$usr.url"); $box=$v->mbox;
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
            $ssn=sesn('HASH'); path::make("/Proc/temp/sesn/$ssn/mbox",$box);
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
      if(is_assoc_array($o)){$o=knob($o);}; if(!isKnob($o)){fail('expecting object');}; $tn=time(); $mh=$o->mesgHead; $mb=$o->mesgBody;
      if(!isPath($mb)&&$mh){$th=sha1(mash($o,$tn)); $tp="/Proc/temp/file/$th.md"; path::make($tp,"# $mh\n\n$mb"); $o->mesgBody=$tp;};
      if(!isPath($o->mesgBody)){fail('expecting `mesgBody` as file path');}; $p=crop($o->mesgBody); $rp='/Proc/libs/marked/Parsedown.php';
      if(!isee($p)){fail("expecting `$p` as accessible file");}; if(!is_file(path($p))){fail("expecting `$p` as file");};
      if(!isKnob($o->varsUsed)){$o->varsUsed=knob($o->varsUsed);}; $b=trim(import($p,$o->varsUsed)); $h=stub($b,"\n");
      if($h){$h=stub($h[0],'# ');}; if($h){$h=trim($h[2]);}; if(!$h){fail("expecting `$p` as markdown-formatted text-file with a heading");};
      $b=stub($b,"\n"); $b=trim($b[2]); if(!isMail($o->destAddy)){fail('expecting `destAddy` as email address');}; requires::path($rp);
      $x=(new \Parsedown()); $x->setBreaksEnabled(true); $b=$x->text($b); $b=import('/Proc/libs/marked/page.htm',['parsed'=>$b]);
      $m=$o->destAddy; $c=$o->fromAddy; if(!$c){$c=conf('Proc/autoMail');}elseif(isMail($c)){$c=pget("/Mail/link/$c");};
      if(!isin($c,'mail://')){fail('invalid plug specification .. make sure the `fromAddy` (autoMail -or plug) is valid');};
      if(!online()){fail('`'.HOSTNAME.'` is offline');};

      $r=crud($c)->insert
      ([
         debug => $o->runDebug,
         write =>
         ([
            'destAddy' => $m,
            'mesgHead' => $h,
            'mesgBody' => $b,
            'attached' => $o->attached,
         ])
      ]);

      if($r->fail)
      {
         $f=$r->fail; $m="Cannot send mail\n.."; if(isin($f,'SMTP connect() failed'))
         {
            $i=path::info($c); $u="$i->user@$i->host";
            $r="$m Make sure `$u` allows API access, check its inbox; see Anon manual.\n\nError details:\n$f";
         }
         else
         {$r="$m $f\n.. make sure the mailbox exists";};
         if($o->runDebug){fail($r);}; return $r;
      };

      Proc::signal('done');
      return OK;
   });
# ---------------------------------------------------------------------------------------------------------------------------------------------




# tool :: xena.fetchNewAutoMail : silently fetch each stem's email according to their configured purl
# ---------------------------------------------------------------------------------------------------------------------------------------------
   xena::learns('fetchNewAutoMail',function($now=null)
   {
      if(!userDoes('work','lead','sudo')){return;};
      $ri=conf('Mail/checkSec'); if(!is_int($ri)||($ri<5)){fail('invalid `checkSec` config in Mail .. expecting int > 4');}; // validate
      $tn=time(); $lr=pget('/Mail/vars/lastRead'); if(!$lr){$lr=($tn-($ri+1));}; $td=($tn-$lr); if($td<$ri){return;}; // read later

      $l=fuse(pget('$'),pget('/')); $pl=[]; // $a=args(func_get_args());
      foreach($l as $i){if(!isFold("/$i")){continue;}; $x=path::conf("/$i"); $c=pget("$x/autoMail"); if($x&&$c&&!isin($pl,$c)){$pl[]=$c;}};
      if(!online()){fail('`'.HOSTNAME.'` is offline');};
      Proc::impede('busy.mail'); foreach($pl as $pv){Mail::openPlug($pv); Mail::fetchBox($pv);}; Proc::resume('busy.mail');
      path::make('/Mail/vars/lastRead',$tn);
   });
# ---------------------------------------------------------------------------------------------------------------------------------------------
