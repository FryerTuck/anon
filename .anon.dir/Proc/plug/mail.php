<?
namespace Anon;



# tool :: mail_plug : git abstraction
# ---------------------------------------------------------------------------------------------------------------------------------------------
   class mail_plug
   {
      private $mean=null;
      private $link=null;
      private $cols=['destAddy','destName','fromAddy','fromName','replAddy','replName','involves','disclose','mesgIndx','lookupID','unixTime','followID','flagTags','mesgHead','mesgBody','textBody','attached'];
      private $prop=['subject','from','to','date','message_id','size','uid','msgno','udate'];
      private $tags=['seen','answered','flagged','deleted','draft','recent'];
      public $fail=false;

      function __construct($x)
      {
         $this->mean=$x; $this->addy="$x->user@$x->host";
      }


      function __destruct()
      {
         $this->pacify();
      }


      function __call($n,$a)
      {
         return call($this->$n,$a);
      }


      function adjure($fn,$al, $rt=0)
      {
         $rt++; $cdom=HOSTNAME; $skey=sesn('HASH');
// Proc::signal("dump","step 3 .. plea sent over to xeno"); wait(999);
         $r=plug("https://$cdom/Proc/xenoCall")->insert
         ([
            param =>
            [
               'Cookie' => "$skey=...",
            ],
            write =>
            [
               'dbug' => 1,
               'func' => $fn,
               'args' => $al,
            ]

         ]);
         // dump("sent:\n",[$fn,$al],"\n\nreceived:\n",$r,"\n\n");

         if (!is_object($r) || !is_object($r->info)){return $r;};

         $i=$r->info; if(($i->http_code===419)&&($rt<=36))
         {wait(2000); $r=$this->adjure($fn,$al, $rt); return $r;};

         $r=$r->body; if((!$r||isin($r,["503 Service Unavailable"]))&&($rt<3))
         {wait(1000); $r=$this->adjure($fn,$al, $rt); return $r;};

         return $r;
      }


      function engage($h,$u,$p,$o,$y=null,$z=[])
      {
// Proc::signal("dump","step 2 .. engaged .. making a call to plea: DO NOT SPILL OB"); wait(999);
         $r=knob(); $t=$this->adjure("imap_open",[$h,$u,$p,$o,$y,$z]); if(!isin($t,'Resource id #')){$r->fail=$t; return $r;}; // test/fail
         $fh = defail();
            $r->link=imap_open($h,$u,$p,$o,$y,$z); $me=imap_errors(); $ma=imap_alerts();
         $fm = enfail($fh,1);
         if($r->link){return $r;}; $f=[imap_last_error()]; if($me){$f=array_merge($f,$me);}; if($ma){$f=array_merge($f,$ma);};
         if(isset($eb[0])){$f[]=$eb[0]->mesg;}; $f=trim(implode("\n",$f)); if(!$f){$f=trim($ob);}; $r->fail=$f; wait(250);
         return $r;
      }


      function vivify($b,$o=null)
      {
         if(!isVoid($b)&&!isText($b,1)){fail('invalid mailbox specification');};
         if($this->link){return $this->link;}; $i=$this->mean; $h=$i->host; $s=$i->plug; $ca=[];
         $u="$i->user@$h"; $p=$i->pass; $n=$i->port; $y='novalidate-cert';
         if(!isInum($n)){$n=993;};

         // if(!$b){$b='INBOX';};

         $ca=array_merge($ca,["{{$s}.$h:$n/imap/ssl}$b","{{$s}.$h:$n/imap/ssl}$b","{{$s}.$h:$n/imap/ssl/$y}$b","{{$s}.$h:$n/imap}$b"]);
         $ca=array_merge($ca,["{{$s}.$h:$n/imap/$y}$b","{{$s}.$h:143/imap}$b","{{$s}.$h:143/imap/$y}$b"]);

         $fm=['Certificate failure','Can not authenticate','Retrying PLAIN authentication','IMAP connection broken'];
         $uf="unhandled IMAP connection error.\n\nThis spilled out:\n"; $ff=''; $lf='';
         $cz=pget("$/Mail/vars/tested/$u");

         if($cz)
         {
             $r=$this->engage($cz,$u,$p,$o); $f=$r->fail;
             if($r->link){$this->link=$r->link; return $this->link;};
             return knob(["fail"=>503]);
         };

         foreach($ca as $cs)
         {
             $r=$this->engage($cs,$u,$p,$o); $f=$r->fail; $f=trim(($f?$f:''));
             if($r->link){$this->link=$r->link; path::make("$/Mail/vars/tested/$u",$cs); return $this->link;};
             if($f && ($f!=='{}'))
             {
                 $f=depose($f,'<title>','</title>');

                 if((wrapOf($f)==='{}')&&isin($f,'"name":"')&&isin($f,'"line":"')) // cannot recover from this error
                 {
                     $f=decode::jso($f); $f->mesg=($uf."\n".$f->mesg); $this->fail=$f;
                     dbug::spew($f); return knob(["fail"=>$f->mesg]);
                 };

                 if(!isin($ff,$f)){ $ff.="\n\n$f"; };
                 if(!isin($f,$fm) && facing('SSE'))
                 { signal::dump("$uf \n$f"); }; // saves debugging time .. for you dear hacker
             };
             wait(600);
         };

         reset($ca); unset($cs); $f=''; $CTRY = implode("\n", $ca);
         $CERR = "WARNING :: the following IMAP connection options failed:\n$CTRY";
         signal::dump("$CERR\n\ntrying all the above again with DISABLE_AUTHENTICATOR");

         foreach($ca as $cs)
         {
             $r=$this->engage($cs,$u,$p,$o,1,['DISABLE_AUTHENTICATOR'=>'PLAIN']); $f=$r->fail;
             if($r->link){$this->link=$r->link; return $this->link;};
             $f=($f?$f:''); if(!isin($f,$fm)){ $ff.="\n\n$f"; }; wait(600);
         };

         if($f&&!$lf){$lf=$f;}; $f=trim("$ff\n$lf"); if($f){$f="\n\n```$f```";};
         fail("all IMAP connection options failed $f");
      }


      function pacify()
      {
         if($this->link){imap_close($this->link);}; $this->link=null;
         // Proc::signal('busy',['with'=>"mail",'done'=>100]);
      }


      function create($a)
      {
      }


      function descry($a=null)
      {
         $L=$this->vivify($a,(($a===null)?OP_HALFOPEN:null));
         if (is_object($L) && ($L->fail == 503)){ return $L; };

         if($a===null)
         {
            $h=$this->mean->host; $c=imap_list($L,"{{$h}}","*"); if(!is_array($c)){fail(imap_last_error());};
            $r=[]; foreach($c as $i){$b=imap_utf7_decode($i); $p=stub($b,'}'); if($p){$b=$p[2];}; $r[]=$b;};
            $this->pacify(); return $r;
         };

         $m=imap_search($L,'ALL',SE_UID); if(!isArra($m)){$m=[];};
         $r=knob(['colNames'=>$this->cols,'flagTags'=>$this->tags,'mesgUids'=>$m]);
         return $r;
      }



      function insert($a)
      {
         $oa=dupe($a);
         if(isAssa($a)){$a=knob($a,1);}; expect::knob($a); $I=$this->mean;
         if($a->debug){$dbug=1;}; if(!isKnob($a->write)){$w=dupe($a); $a=knob(['write'=>$w]);}else{$w=$a->write;};

         expect::knob($w); $da=$w->destAddy; $SV=($I->vars?$I->vars->smtp:null);
         if(isText($SV,3)){$SV=path::info("mail://$SV");}else{$SV=null;};

         if(!$da){$da=$w->destAddr;}; $dn=$w->destName; if(!$dn){$dnn=stub($da,'@')[0]; $dn=explode('.',$dn)[0];};

         // validEmail($w->destAddy,'destAddy')[0];
         $host=($SV?$SV->host:"mail.$I->host");
         $port=(($SV&&isInum($SV->port))?$SV->port:$I->port); if(!isInum($port)){$port=587;}; // or 465
         $user="$I->user@$I->host"; $pass=$I->pass;
         $name=($w->fromName?$w->fromName:$I->user); if(isin($name,'.')){$name=stub($name,'.')[0];};
         $from=($w->fromAddr?$w->fromAddr:$w->fromAddy); $html=$w->htmlBody; $text=$w->textBody;
         $head=$w->mesgHead; if(isVoid($head)){$head='(no subject)';};
         if(isVoid($html)){$html=(!isVoid($w->mesgBody)?$w->mesgBody:$text);};
         $dbug=3; dbug::$temp=''; $secu=(($port===587)?'tls':'ssl'); requires::phpx('openssl');
         if(isVoid($html)){$html='(no message)';};
         $fcrt=(isin(pget("$/Mail/vars/$user"),'novalidate-cert')?1:0);
         $cdom=HOSTNAME; $z=knob(['done'=>0,'fail'=>null]); $skey=sesn('HASH');
         $send=array
         (
            'smtpHost' => $host,
            'smtpAuth' => true,
            'smtpSecu' => $secu,
            'smtpPort' => $port,
            'smtpUser' => $user,
            'smtpPass' => $pass,
            'certFail' => $fcrt,
            'fromAddr' => $from,
            'fromName' => $name,
            'destAddr' => $da,
            'destName' => $dn,
            'mesgHead' => $w->mesgHead,
            'htmlBody' => $html,
            'textBody' => $text
         );

         $resp=plug("https://$cdom/Proc/execPath")->insert
         ([
            param => ['Cookie'=>"$skey=..."],
            write =>
            [
               'pathName' => '/Proc/libs/PHPMailer',
               'sendMail' => $send,
            ]
         ]);

         $resp=trim($resp); if(!$resp){$resp='{"head":{},"body":""}';}; $resp=decode::jso($resp);
         if($resp->body===OK){$z->done=1; return $z;}

         if(!$fcrt&&isin($resp->body,'SMTP connect() failed'))
         {
             $send['certFail']=1;
             $resp=plug("https://$cdom/Proc/execPath")->insert
             ([
                param => ['Cookie'=>"$skey=..."],
                write =>
                [
                   'pathName' => '/Proc/libs/PHPMailer',
                   'sendMail' => $send,
                ]
             ]);

             $resp=trim($resp); if(!$resp){$resp='{"head":{},"body":""}';}; $resp=decode::jso($resp);
             if($resp->body===OK){$z->done=1; return $z;};
         };

         $z->fail=$resp->body;
         return $z;
      }



      function select($a)
      {
         Proc::signal('busy',['with'=>"mail",'done'=>21]); if(isAssa($a)){$a=knob($a,U);}; expect::knob($a);
         if(!$a->using){$a->using='INBOX';}; $L=$this->vivify($a->using,($a->touch?null:OP_READONLY));
         if(is_object($L) && ($L->fail == 503)){ return []; };
         $fltr=$a->fetch; if(!$fltr){$fltr='*';}; if(!isText($fltr)&&!isFlat($fltr)){fail::mailPlug('invalid `fetch` clause');};
         $cols=$this->cols; if($fltr==='*'){$fltr=$cols;}elseif(isText($fltr)){$fltr=[$fltr];}; $a->fetch=$fltr;
         if($a->where)
         {
            $oper=padded((explode(' ',EXPROPER)),' ');
            if(isText($a->where)){$a->where=[$a->where];}; if(!isFlat($a->where)){fail::mailPlug('invalid `where` clause');};
            foreach($a->where as $c){$p=stub($c,$oper); if(!$p){fail('invalid `where` expression');}; if(!isin($fltr,$p[0])){$fltr[]=$p[0];}};
         };

         $HF=0; foreach($fltr as $col)
         {
             if($HF){break;}; if(!isText($col)){$HF='expecting `fetch` items as :TEXT:'; break;};
             if(!isin($cols,$col)){$HF="fetch column `$col` is undefined";}
         };
         if($HF){fail::mail($HF); exit;};

         $mail=imap_search($L,'ALL');
         if(!isArra($mail,1)){return [];}; rsort($mail); $r=[]; $limit=span($mail); $found=0;
         if($a->limit!==null){if(is_int($a->limit)){$limit=$a->limit;}else{fail('invalid `limit` value');}}; $nf=$this->prop;

         Proc::signal('busy',['with'=>"mail",'done'=>50]);

         foreach($mail as $x)
         {
            $i=imap_headerinfo($L,$x); if(isNuma($i)){$i=$i[0];}; $i=knob($i);
            if(!isNuma($i->to)){$i->to=[knob(['host'=>$this->mean->host])];};
            $o=knob(); $t=$i->to[0]; $f=$i->sender[0]; $y=$i->reply_to[0];

            if(isin($fltr,'destAddy')){$o->destAddy="$t->mailbox@$t->host";};
            if(isin($fltr,'destName')){$o->destName=(isin($t,'personal')?$t->personal:null);};
            if(isin($fltr,'fromAddy')){$o->fromAddy="$f->mailbox@$f->host";};
            if(isin($fltr,'fromName')){$o->fromName=(isin($f,'personal')?$f->personal:null);};
            if(isin($fltr,'replAddy')){$o->replAddy="$y->mailbox@$y->host";};
            if(isin($fltr,'replName')){$o->replName=(isin($y,'personal')?$y->personal:null);};
            if(isin($fltr,'mesgIndx')){$o->mesgIndx=$x;}; if(isin($fltr,'lookupID')){$o->lookupID=imap_uid($L,$x);};
            if(isin($fltr,'unixTime')){$o->unixTime=($i->udate*1);}; if(isin($fltr,'followID')){$o->followID=htmlentities($i->message_id);};

            if(isin($fltr,'flagTags'))
            {
               $fo=imap_fetch_overview($L,$x); if(isNuma($fo)){$fo=$fo[0];};
               if(isAsso($fo)){$fo=knob($fo);}; $fl=diff(keys($fo),$nf); $o->flagTags=[];
               foreach($fl as $fn){if($fo->$fn===1){$o->flagTags[]=$fn;}}; $o->flagTags=fuse($o->flagTags,' ');
            };

            if(isin($fltr,'mesgHead')){$o->mesgHead=$i->subject;}; unset($i,$fo,$fl,$fn);

            if(isin($fltr,'mesgBody')||isin($fltr,'textBody')||isin($fltr,'attached'))
            {
               $s=imap_fetchstructure($L,$x); $used=[];
               if(isset($s->parts)){$s=flattenParts($s->parts);}else{$s=knob(['1'=>$s]);};
            };


            if(isin($fltr,'mesgBody')||isin($fltr,'textBody'))
            {
               $bl=[]; $il=[]; foreach($s as $sn => $so)
               {
                  $bo=getMailPart($L,$x,$sn,$so,false);
                  $bo->numr=$sn; $bo->part=$so;
                  if (($so->type<1) && is_array($sn))
                  {
                     if($sn[0]==='3'){continue;};
                     $bt=getMailPart($L,$x,$sn,$so,true)->data; $bt=trim($bt.'');
                     if(($bo->type==='html')&&(wrapOf($bt)==='<>')){$o->mesgBody=$bt;continue;}
                     elseif(($bo->type==='plain')||($bo->type==='text')){$o->textBody=$bt;continue;}else{$bl[]=$bt;};
                  }
                  elseif(($so->type===5)&&isset($bo->name)){$il[]=$bo;};
               };

               if(!$o->mesgBody){do{$o->mesgBody=lpop($bl);}while(!$o->mesgBody&&count($bl)); if(!$o->mesgBody){$o->mesgBody='';}};
               unset($bo); foreach($il as $bo){$in=$bo->name; $ei="cid:$in"; if(isin($o->mesgBody,$ei))
               {
                  $used[]=$in; $ri=getMailPart($L,$x,$bo->numr,$bo->part,true)->data; $o->mesgBody=swap($o->mesgBody,$ei,$ri);
               }};
               if(isText($o->textBody)&&(strpos($o->textBody,'data:inode/directory;base64,')===0)){$o->textBody=furl($o->textBody)->data;};
               if(isText($o->mesgBody)&&(strpos($o->mesgBody,'data:inode/directory;base64,')===0)){$o->mesgBody=furl($o->mesgBody)->data;};
               if($o->mesgBody===''){$o->mesgBody=$o->textBody;};
               unset($sn,$so,$bo,$ri,$bt);
            };

            if(isin($fltr,'attached'))
            {
               $o->attached=knob(); $tn=[3,4,5,6,7]; foreach($s as $sn => $so)
               {
                  if(!isin($tn,$so->type)){continue;}; $bo=getMailPart($L,$x,$sn,$so,false); if(isin($used,$bo->name)){continue;};
                  $bo=getMailPart($L,$x,$sn,$so,true); $bn=$bo->name; $o->attached->$bn=$bo->data;
               };
               if(span($o->attached)<1){$o->attached=null;};
            };

            if($a->where){$cl=span($a->where);$cm=0;unset($cx);foreach($a->where as $cx){if(reckon($cx,$o)){$cm++;}};if($cm<$cl){continue;}};
            $p=keys($o); foreach($p as $c){if(!isin($a->fetch,$c)){unset($o->$c);}};
            $r[]=$o; $found++; if($limit&&($found>=$limit)){break;};
         };
         Proc::signal('busy',['with'=>"mail",'done'=>100]);
         return $r;
      }


      function update($a)
      {
         if(isAssa($a)){$a=knob($a,U);}; expect::knob($a); if(!$a->using){$a->using='INBOX';}; $L=$this->vivify($a->using);
         if(isText($a->where)){$a->where=[$a->where];}; if(!isFlat($a->where)){fail((!$a->where?'missing':'invalid').' `where` clause');};
         if(isText($a->write)){$a->write=['flagTags'=>$a->write];}; if(isAssa($a->write)){$a->write=knob($a->write);};
         if(!isKnob($a->write)){fail('invalid `write` clause');}; $fltr=['mesgIndx'];
         foreach($a->write as $cn => $cv){if(!isin($fltr,$cn)){$fltr[]=$cn;}};
         $mail=$this->select([using=>$a->using,fetch=>$fltr,where=>$a->where,limit=>$a->limit]); if(span($mail)<1){return null;}; $r=0;
         foreach($mail as $m){unset($k,$v,$f);foreach($a->write as $k => $v)
         {
            if($k==='flagTags')
            {
               $of=$m->flagTags; if($of){$of=frag($of,' '); unset($f);
               foreach($of as $f){$f=ucwords($f); $d=imap_clearflag_full($L,$m->mesgIndx,"\\$f"); if($d){$r++;};}};
               if(!$v){continue;}; $e='invalid flagTags value'; if(isText($v)){$v=frag($v,' ');}; if(!isArra($v)){fail($e);};
               unset($f); $r=0; foreach($v as $f){if(!isWord($f)){fail($e);}; $f=ucwords($f);
               $d=imap_setflag_full($L,$m->mesgIndx,"\\$f"); if($d){$r++;};};
            };
         }};
         return $r;
      }


      function deploy($a)
      {
      }
   }
# ---------------------------------------------------------------------------------------------------------------------------------------------


function getMailPart($L,$m,$n,$o,$dc=true)
{
   $r=knob(['type'=>strtolower(isset($o->subtype)?$o->subtype:'undefined')]); $r->mime=conf('Proc/mimeType')->{$r->type};
   $p=['dparameters','parameters']; $a=['filename','name']; foreach($p as $pn){$ip=isin($o,$pn); if(!$ip||($ip&&!$o->$pn)){continue;};
   foreach($o->$pn as $po){$an=strtolower($po->attribute);if(isin($a,$an)){$an=$po->value;if($an){$r->name=$an;}}}}; if(!$dc){return $r;};
   $d=imap_fetchbody($L,$m,$n); $e=$o->encoding; if($e===3){$m=mime("/$r->name"); $d="data:$m;base64,$d";}
   elseif($e===4){$d=quoted_printable_decode($d);}; $r->data=$d; unset($d); return $r;
}



function flattenParts($messageParts, $flattenedParts = array(), $prefix = '', $index = 1, $fullPrefix = true)
{
	foreach($messageParts as $part)
   {
		$flattenedParts[$prefix.$index] = $part; if(!isset($part->parts)){$index++; continue;};
		if($part->type == 2){$flattenedParts = flattenParts($part->parts, $flattenedParts, $prefix.$index.'.', 0, false);}
		elseif($fullPrefix){$flattenedParts = flattenParts($part->parts, $flattenedParts, $prefix.$index.'.');}
		else{$flattenedParts = flattenParts($part->parts, $flattenedParts, $prefix);}; unset($flattenedParts[$prefix.$index]->parts); $index++;
	}
	return $flattenedParts;
}



function validEmail($v,$c)
{
   if(!isArra($v)){$v=[$v];}; $f="inavlid $c address";
   foreach($v as $m){if(!isText($m)){fail($f);}; if(!isMail($m)){fail("$f `$m`");};};
   return $v;
}
