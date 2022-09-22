<?
namespace Anon;



# tool :: xeno : global reference to use as "foreign masculine" character who performs giving methods defined by any other php script
# ---------------------------------------------------------------------------------------------------------------------------------------------
   class xeno
   {
      private static $meta=[];

      static function learns($n,$f)
      {
         if(!isWord($n)){fail::xeno('My skills are named, try using a word next time');};
         if(!isFunc($f)){fail::xeno('I can learn skills by methods only');};
         if(self::does($n)){fail::xeno("I already know how to `$n`");};
         self::$meta[$n]=$f;
      }

      static function does($n=null)
      {
         $l=array_keys(self::$meta); if(!is_string($n)||(strlen($n)<2)){return $l;};
         $r=in_array($n,$l); return $r;
      }

      static function __callStatic($n,$a)
      {
         if(!self::does($n)){fail::xeno("I don't know how to `$n` .. yet .. teach me?");};
         try{$r=call(self::$meta[$n],$a); return $r;}catch(\Exception $e)
         {
            $m=$e->getMessage(); $f=$e->getFile(); $l=$e->getLine();
            fail::xeno("I could not `$n` because: $m\n\n```\nfile:$f\nline:$l\n```\n\n");
         };
      }
   }
# ---------------------------------------------------------------------------------------------------------------------------------------------




# tool :: xena : global reference to use as "foreign feminine" character who performs receiving methods defined by any other php script
# ---------------------------------------------------------------------------------------------------------------------------------------------
   class xena
   {
      private static $meta=[];

      static function learns($n,$f)
      {
         if(!isWord($n)){fail::xena('My skills are named, try using a word next time');};
         if(!isFunc($f)){fail::xena('I can learn skills by methods only');};
         if(self::does($n)){fail::xena("I already know how to `$n`");};
         self::$meta[$n]=$f;
      }

      static function does($n=null)
      {
         $l=array_keys(self::$meta); if(!is_string($n)||(strlen($n)<2)){return $l;};
         $r=in_array($n,$l); return $r;
      }

      static function __callStatic($n,$a)
      {
         if(!self::does($n)){fail::xena("I don't know how to `$n` .. yet .. teach me?");};
         try{$r=call(self::$meta[$n],$a); return $r;}catch(\Exception $e)
         {
            $m=$e->getMessage(); $f=$e->getFile(); $l=$e->getLine();
            fail::xena("I could not `$n` because: $m\n\n```\nfile:$f\nline:$l\n```\n\n");
         };
      }
   }
# ---------------------------------------------------------------------------------------------------------------------------------------------




# xeno :: showHyperConduit : reveal contents of 1st plug in path, e.g. `/path/to/some.url/file.ext` returns `ftp://example.com/file.ext`
# ---------------------------------------------------------------------------------------------------------------------------------------------
   xeno::learns('showHyperConduit',function($v,$w=null)
   {
      if(!isText($v,5)){return;}; $v=crop($v); $s=stub($v,['::','://']);
      if($s)
      {
         $o=$s[0]; $p=$s[2]; $x=path::meta($p); if(!$x){return;}; $c="$o::$x->base"; $p=$x->path;
         if(!isPath($p)){$p=null;}; $r=knob(['plug'=>$c,'path'=>$p]); return ($w?$r:(!$p?$c:($c.$p)));
      };
      if(!isPath($v)){return;}; if((substr($v,-4,4)!=='.url')&&!strpos($v,'.url/')){return;};
      $s=stub($v,'.url'); $c="$s[0].url"; $p=$s[2]; if(!isee($c)){return;}; $c=rshave(pget($c),'/'); if(!isPurl($c)){return;};
      if(!isPath($p)){$p=null;}; $r=knob(['plug'=>$c,'path'=>$p]); return ($w?$r:(!$p?$c:($c.$p)));
   });
# ---------------------------------------------------------------------------------------------------------------------------------------------




# tool :: Clan : clan tools
# ---------------------------------------------------------------------------------------------------------------------------------------------
   class Clan
   {
      static function exists($d)
      {
         if(!isWord($d)){return;}; return (isee("/User/clan/$d")?true:false);
      }
   }
# ---------------------------------------------------------------------------------------------------------------------------------------------




# func :: reckon : assert on property values by using string as expression .. for use in `where` crud-filters that don't use database
# ---------------------------------------------------------------------------------------------------------------------------------------------
   function reckon($expr,$vars)
   {
      if(isKnob($expr)&&($expr->any||$expr->all))
      {
         $ow=($expr->any?'any':'all'); $cl=$expr->$ow; $cr=false; $any=false; $all=true; expect::{'array'}($cl); if(count($cl)<1){return;};
         foreach($cl as $c){$r=reckon($c,$vars); if($r){$any=true;}else{$all=false;}};
         if($ow==='any'){return $any;}; if($ow==='all'){return $all;}; return;
      };

      expect::text($expr); expect::knob($vars); $oper=padded((explode(' ',EXPROPER)),' '); $p=stub($expr,$oper);

      if(!$p){fail("invalid expression `$expr`");}; $l=trim($p[0]); $l=$vars->$l; $o=trim($p[1]); $r=$p[2]; $r=dval($r);
      if($o==='!='){return ($l!==$r);}; if($o==='<='){return ($l<=$r);}; if($o==='>='){return ($l>=$r);}; if($o==='='){return ($l===$r);};
      if($o==='<'){return ($l<$r);}; if($o==='>'){return ($l>$r);}; if(!isin($o,'~')||!isin($r,'*')){return;}; $f=akin($l,$r);
      if($o==='~'){return ($f?true:false);}; if($o==='!~'){return ($f?false:true);}; return (!$f?true:false);
   }

   function any(){return knob(['any'=>func_get_args()]);};
   function all(){return knob(['all'=>func_get_args()]);};
# ---------------------------------------------------------------------------------------------------------------------------------------------




# tool :: requires : assert or import dependencies
# ---------------------------------------------------------------------------------------------------------------------------------------------
   class requires
   {
      private static $mods;

      static function phpx()
      {
         $a=func_get_args(); if(span($a)<1){return;} if(is_nokey_array($a[0])){$a=$a[0];}; foreach($a as $n)
         {
            if(!isWord($n)){fail('expecting extension-name as word');}; if(extension_loaded($n)){continue;};
            fail("the `$n` extension is required; make sure it is installed and configured, or contact your hosting provider");
            return true;
         };
         return true;
      }

      static function stem()
      {
         $a=func_get_args(); if(span($a)<1){return;} if(is_nokey_array($a[0])){$a=$a[0];}; foreach($a as $n)
         {if(!isWord($n)){fail('expecting class-name as word');}; if(is_class($n)){continue;}; import($n);};
         return true;
      }

      static function path()
      {
         $a=func_get_args(); if(span($a)<1){return;} if(is_nokey_array($a[0])){$a=$a[0];}; if(count($a)<1){return;};
         if(!isKnob(self::$mods)){self::$mods=knob();}; $cr=sha1(implode(',',$a)); $rc=self::$mods->$cr; if($rc){return $rc;};
         $fldr=0; if((count($a)===1)&&isFold($a[0])){$fldr=1; $h=$a[0]; $a=pget($h); $a=padded($a,"$h/",'');};
         $_RESL=[]; foreach($a as $p)
         {
            $t=isee($p); if($t&&is_dir($t)){$i=path::indx($t); if($i){$t="$t/$i";}}; if($t){$p="$t";};
            if(!$t||!is_file($t)||(fext($t)!=='php')){if($fldr){continue;}; $p=tval($p); fail("expecting `$p` as readable php file");};
            $_PATH=$p; $_TWIG=twig($p); $export=null; ob_start(); require "$_PATH"; $r=trim(ob_get_clean()); $r=(isVoid($export)?$r:$export);
            if($r){$_RESL[]=$r;};
         };
         $c=count($_RESL); $z=(($c<1)?true:(($c<2)?$_RESL[0]:$_RESL));
         self::$mods->$cr=$z; return $z;
      }
   }
# ---------------------------------------------------------------------------------------------------------------------------------------------




# tool :: encode/decode : encoding/decoding
# ---------------------------------------------------------------------------------------------------------------------------------------------
   class encode
   {
      static function nbx($d,$b)
      {
         if($b===64)
         {
             if(!isPath($d)){return base64_encode(tval($d));};
             return base64_encode(isFold($d)?json_encode(pget($d)):import($d,vars(crop($d))));
         };
         if(!isNumr($d)||isin($d,'.')||($d<1)){fail::base_convert('expecting positive integer');};
         if(!is_int($b)||(($b%2)!==0)||($b>62)){fail::base_convert("invalid encoding base");};
         return gmp_strval(gmp_init($d,10),$b);
      }

      static function jso($d,$v=null)
      {return json_encode($d,JSON_UNESCAPED_SLASHES);}

      static function hex($d)
      {return implode(unpack("H*",$d));}

      static function zip($p)
      {
          $zip=requires::path("$/Proc/libs/zip");
          todo("Anon back-end :: develop enode::zip()");
      }

      static function __callStatic($n,$a)
      {
         if(strlen($n)<1){fail::reference('invalid encoder name');}; if(!isset($a[0])){$a[0]=null;}; if(!isset($a[1])){$a[1]=null;};
         $f=(($n==='hex')?'b16':(($n==='json')?'jso':(($n==='cfg')?'vmp':$n))); if(isin(__CLASS__,$f)){return self::{$f}($a[0],$a[1]);};
         $b=null; if($f[0]==='b'){$b=substr($f,1); $b=(is_numeric($b)?($b*1):null); if(!is_int($b)){$b=null;};};
         if($b){return self::nbx($a[0],$b);}; $f=swap($f,' ',''); $l=frag($f,'->'); if(span($l)<2){fail("encoder `$f` is not defined .. yet");};
         $r=$a[0]; foreach($l as $i){$r=encode::{$i}($r,$a[1]);}; return $r;
      }
   }


   class decode
   {
      static function nbx($d,$b)
      {
         $v=(isNumr($d)?"$d":$d); if(!isText($v)){fail::arguments('expecting 1st arg as :text: or :numr:');};
         if(!is_int($b)||(($b%2)!==0)){fail::base("invalid encoding base");};
         if($b===16){return hex2bin($v);};
         if($b===64)
         {
             if(!isPath($v)){return base64_decode($v);}; if(!isFile($v)){fail::reference("path `$v` is not a file"); exit;};
             $v=base64_decode(pget($d)); if(span($v)<5){return base64_decode($v);};
             if(isin($v,'(~')&&isin($v,'~)')){$v=impose($v,'(~','~)',vars(crop($d)));}; return $v;
         };
         return hex2bin(gmp_strval(gmp_init($v,$b),16));
      }

      static function jso($d,$v=null)
      {
         if(isPath($d)){ $fh=defail(); $t=pget($d); $fm=enfail($fh); if($fm){$t="";}; }else{$t=$d;}; $r=isJson($t);
         if((wrapOf($t)==='{}')&&!isVoid($r)){$r=knob($r);};
         return $r;
      }

      static function hex($d)
      {return pack("H*",$d);}

      static function zip($p)
      {
          $zip=requires::path("$/Proc/libs/zip");
          todo("Anon back-end :: develop deode::zip()");
      }

      static function __callStatic($n,$a)
      {
         if(strlen($n)<1){fail::reference('invalid decoder name');}; if(!isset($a[0])){$a[0]=null;}; if(!isset($a[1])){$a[1]=null;};
         $f=(($n==='hex')?'b16':(($n==='json')?'jso':(($n==='cfg')?'vmp':$n))); if(isin(__CLASS__,$f)){self::{$f}($a[0],$a[1]);};
         $b=null; if($f[0]==='b'){$b=substr($f,1); $b=(is_numeric($b)?($b*1):null); if(!is_int($b)){$b=null;};};
         if($b){return self::nbx($a[0],$b);}; fail("invalid decoder `$f`");
      }
   }
# ---------------------------------------------------------------------------------------------------------------------------------------------




# func :: gudref : create random short-reference-number -free of bad-words and is unique in context .. supports char-length: 5 >=< 30
# ---------------------------------------------------------------------------------------------------------------------------------------------
   function gudref($dp,$rl=null)
   {
      expect::path($dp);
      $bw=conf('Proc/badWords'); $rn=null; if(!is_int($rl)){$rl=12;}; if($rl<6){$rl=6;}elseif($rl>30){$rl=30;};
      do
      {
         $mt=(fractime().''); $mt=swap($mt,'.',''); $mt=($mt*1);
         $tr=substr((random(10).encode::b62($mt).random(10)),0,$rl);
         if(isin(strtolower($tr),$bw)||isee("$dp/$tr")){continue;}; $rn=$tr;
      }
      while(!$rn); return $rn;
   }
# ---------------------------------------------------------------------------------------------------------------------------------------------




# tool :: find : userByMail .. taskByPath .. firmByPath
# ---------------------------------------------------------------------------------------------------------------------------------------------
   class find
   {
      static function userByMail($a)
      {
         if(!isMail($a)){return;}; $l=pget('/User/data'); $r='anonymous';
         foreach($l as $i){if(pget("/User/data/$i/mail")===$a){$r=$i;break;}};
         return $r;
      }

      static function sesnByUser($a)
      {
         if(!isWord($a)){return;}; $h="$/Proc/temp/sesn"; $l=pget($h); $r=null;
         foreach($l as $i){if(pget("$h/$i/USER")===$a){$r=$i;break;}};
         return $r;
      }

      static function clanByUser($a)
      {
         if(!isWord($a)){return;}; $r=pget("/User/data/$a/clan"); if($r){$r=explode(',',$r);};
         return $r;
      }

      static function userByClan($a)
      {
         if(isText($a,1)){$a=explode(',',$a);}; if(!isNuma($a)){return;}; $l=pget('/User/data'); $r=[];
         foreach($l as $u){$c=pget("/User/data/$u/clan"); if(isin($c,$a)){$r[]=$u;}}; if(count($r)<1){$r=null;};
         return $r;
      }

      static function taskByPath($a)
      {
         if(!isPath($a)){return;}; $h='/Task/data'; $l=pget($h); if(!$l){pset("$h/"); $l=pget($h);}; $r=null;
         foreach($l as $i){$p=pget("$h/$i/workPath"); if($p&&isin($a,$p)){$r=$i;break;}};
         return $r;
      }

      static function firmByMail($a)
      {
         if(!isText($a,1)){return;};
         $r=plug("sqlite::$/Bill/data/contacts/")->select
         ([
             using => "mailFirm",
             fetch => "firm",
             where => "mail = $a",
         ]);

         if(span($r)>0){return $r[0]->firm;}; return 'Unknown Company Name';
      }

      static function firmByTask($a)
      {
         if(!isText($a,1)){return;}; $r=pget("/Task/data/$a/business"); if(!$r){$r=conf('Bill/autoConf')->firmName;};
         return $r;
      }

      static function firmByPath($a)
      {
         if(!isPath($a)){return;}; $t=self::taskByPath($a); $r=self::firmByTask(($t?$t:'?'));
         return $r;
      }
   }
# ---------------------------------------------------------------------------------------------------------------------------------------------




# func :: userDoes : assert if user "does" anything related to a specific clan
# ---------------------------------------------------------------------------------------------------------------------------------------------
   function userDoes()
   {
      $a=func_get_args(); if(!isset($a[0])){return;};
      if(isNuma($a[0])||(isText($a[0])&&!isset($a[1]))){$a=$a[0];};
      if(isText($a)){$a=swap($a,' ',','); $a=frag($a,',');};
      $c=sesn('CLAN'); $r=isin($c,$a); return $r;
   }
# ---------------------------------------------------------------------------------------------------------------------------------------------




# func :: diff : returns the difference .. like `array_diff` -but also works on numr,text,array,object
# ---------------------------------------------------------------------------------------------------------------------------------------------
   function diff()
   {
      $a=func_get_args(); if((span($a)===1)&&isNuma($a[0])){$a=$a[0];}; if(span($a)<2){return (isset($a[0])?$a[0]:null);};
      $r=lpop($a); $t=type($r); do
      {
         $x=lpop($a); if($t!==type($x)){fail('diff args type mismatch');}; if($t==='numr'){$r=(($r>$x)?($r-$x):($x-$r)); continue;};
         if($t==='text'){$r=((indx($r,$x)!==null)?swap($r,$x,''):swap($x,$r,'')); continue;}; if(isNuma($r)&&isNuma($x))
         {
            if(isFlat($x)&&isFlat($r)){$d=array_diff($x,$r); $r=((count($d)>0)?$d:array_diff($r,$x)); continue;}; $d=[]; $n=null;
            foreach($x as $xi){$n=tval($xi); foreach($r as $ri){if(tval($ri)===$n){$n=null;};}; if($n){$d[]=$xi;};};  unset($n,$ri,$xi);
            if(span($d)<1){foreach($r as $ri){$n=tval($ri); foreach($x as $xi){if(tval($xi)===$n){$n=null;};}; if($n){$d[]=$ri;};};};
            $r=$d; continue;
         };
         if(($t!=='list')&&($t!=='knob')){fail('invalid diff arg type');};
         $rk=keys($r); $xk=keys($x); $kd=array_diff($xk,$rk); if(count($kd)<1){$kd=array_diff($rk,$xk);}; if(count($kd)<1){continue;};
         $rd=dupe($r); $xd=dupe($x); $r=(($t==='list')?[]:tron());
         foreach($kd as $kn){if($t==='list'){$r[$kn]=(exists($rd,$kn)?$rd[$kn]:$xd[$kn]);}else{$r->$kn=(exists($rd,$kn)?$rd->$kn:$xd->$kn);};};
      }
      while(count($a)>0); if(is_array($r)){$r=array_values($r);};
      return $r;
   }
# ---------------------------------------------------------------------------------------------------------------------------------------------




# func :: fuse : merges arrays or objects .. result data-type is the same as the first arg .. duplicate keys are replaced
# ---------------------------------------------------------------------------------------------------------------------------------------------
   function fuse()
   {
      $a=func_get_args(); $c=count($a); if($c<2){return (isset($a[0])?$a[0]:null);};
      if(($c===2)&&(isNuma($a[0])||(is_array($a[0])&&(count($a[0])<1)))&&isText($a[1])){return implode($a[1],$a[0]);};
      $r=dupe((array_shift($a))); $t=type($r); if(($t!='list')&&($t!='knob')){return $r;}; foreach($a as $i)
      {
         $q=type($i); $x=span($i); if(($q!='list')&&($q!='knob')){continue;};
         foreach($i as $k =>$v){if(is_numeric("$k")){$k=$x; $x++;}; if($t=='list'){$r[$k]=$v; continue;}; $r->$k=$v;};
      };
      return $r;
   }
# ---------------------------------------------------------------------------------------------------------------------------------------------




# func :: simp : simplify a complex string .. `$opt` = optional-letter-flag
# ---------------------------------------------------------------------------------------------------------------------------------------------
   function simp($str,$opt=null)
   {
       if(!isText($str,1)){return $str;};

       if(isPlug($str))
       {
           $inf=path::info($str); $scm=$inf->plug;
           if($scm==="mail"){return "$inf->user@$inf->host";};
       };

       return $str;
   }
# ---------------------------------------------------------------------------------------------------------------------------------------------




# tool :: todo : make a docket from calling `todo::{"some title"}("some message");` in code
# ---------------------------------------------------------------------------------------------------------------------------------------------
   class todo
   {
      static function __callStatic($ttl,$arg)
      {
         $stk=stak(); if(isset($stk[1])&&($stk[1]->func=='todo')){$stk=$stk[1];}else{$stk=$stk[0];};
         $ttl=trim($ttl); expect::text($ttl,2); expect::flat($arg,1); if(!isset($arg[1])){radd($arg,NOEXIT);};
         $msg=$arg[0]; $opt=$arg[1]; if(isset($arg[2])&&isKnob($arg[2])&&isPath($arg[2]->file)){$stk=$arg[2];};
         $f=crop($stk->file); $l=$stk->line; $hsh=sha1("$ttl:$f"); requires::stem('Task');
         if(isKnob($stk)&&isNuma($stk->stak,1)){$stk=$stk->stak;}else{$stk=0;};
         $tdp="/Task/vars/geekTodo/$hsh"; $usr=sesn('USER'); $eml=pget("/User/data/$usr/mail");


         if(isee($tdp))
         {
            $v=decode::jso($tdp); if($msg===$v->mesg)
            {
               $i=$v->hits; $y=$v->line; $x=($i+1); $v->hits=$x; $v->line=$l; path::make($tdp,encode::jso($v));
               $n=pget($v->note); $n=swap($n,"\nhits: $i\n","\nhits: $x\n"); $n=swap($n,"\nline: $y\n","\nline: $l\n");
               path::make($v->note,$n); if($opt===NOEXIT){return OK;}; fail("TODO :: $msg"); return;
            };

            $y=$v->line; if($y!==$l)
            {
               $v->line=$l; path::make($tdp,encode::jso($v));
               $n=pget($v->note); $n=swap($n,"\nline: $y\n","\nline: $l\n"); path::make($v->note,$n);
            };

            Task::makeNote(['dref'=>$v->dref,'nick'=>$usr,'mail'=>$eml,'mesg'=>$msg,'clan'=>'geek','tags'=>'geekTodo']);
            if($opt===NOEXIT){return OK;}; fail("TODO :: $v->mesg\n$msg"); return;
         };


         lock::awaits('todo'); $r=gudref('/Task/data',12); $c=gudref("/Task/data/$r/comments",16); $u=$usr;
         $o=knob(['mesg'=>$msg,'file'=>$f,'line'=>$l,'note'=>"/Task/data/$r/comments/$c/mesg",'hits'=>1]);
         path::make($tdp,encode::jso($o)); unset($o); $m="# $ttl\n\n$msg\n\n```\nfile: $f\nline: $l\nhits: 1\n```";
         if($stk){$s=fuse($stk,"\n"); $m.="\n\n```\n$s\n```\n"; }; $m=swap($m,"\n\n\n\n","\n\n"); // message to markdown
         $z=Task::makeDokt(['dref'=>$r,'cref'=>$c,'nick'=>$u,'mail'=>$eml,'mesg'=>$m,'clan'=>'geek','tags'=>'geekTodo']);
         lock::remove('todo'); if($opt===NOEXIT){return OK;}; fail("TODO :: $msg");
      }
   }
# ---------------------------------------------------------------------------------------------------------------------------------------------




# func :: todo : make a docket from calling `todo()` in PHP code
# ---------------------------------------------------------------------------------------------------------------------------------------------
   function todo($v,$o=NOEXIT)
   {
      expect::text($v,8); if(!isin($v,' :: ')){fail('expecting format as `title :: message`');};
      $p=stub($v,' :: '); $t=$p[0]; $m=$p[2]; $r=todo::{"$t"}($m,$o); return $r;
   }
# ---------------------------------------------------------------------------------------------------------------------------------------------




# func :: ekko : use instead of `dump` .. remove headers & purge buffer .. cast $v to visible text .. respect interface .. $m is mime .. exits
# ---------------------------------------------------------------------------------------------------------------------------------------------
   function ekko($v,$e=null,$m=null)
   {
      if(!headers_sent()){header_remove();}; while(ob_get_level()){ob_end_clean();}; $r=tval($v);
      if(!is_funnic($e)){$e='text';}; if(facing('SSE')){Proc::emit($e,$r); return;}; // server-side event

      if(facing('API')&&MADEFUBU){ekko::head(['cookies'=>true]);};

      if(facing('GUI')){if(!$m&&(wrapOf($r)==='<>')){$m='html';}};

      if(USERMIME==='application/json')
      {
         if(!$m){$m=USERMIME;};
         if((strpos($r,'data:')!==0)&&(strpos($r,';base64,')!==false)){$r=base64_encode($r); $r="data:text/plain;base64,$r";};
         $r=json_encode(knob(['name'=>$e, 'data'=>$r]));
      };

      if(!is_funnic($m)){$m='txt';}; $m=mime($m); if(!$m){$m='text/plain';};
      if(!headers_sent()){header("Content-Type: text/plain");}; print_r($r); flush(); die();
   }
# ---------------------------------------------------------------------------------------------------------------------------------------------




# func :: finish : send parsed output to client
# ---------------------------------------------------------------------------------------------------------------------------------------------
   function finish($a,$vo=null,$nx=null)
   {
      if($vo===NOEXIT){$nx=$vo; $vo=null;};
      if(!is_object($vo)){$vo=knob($vo);};

      if(is_int($a))
      {
         ekko::head($a); if($nx){return;}; if(facing("BOT")){exit;};
         $c=conf('Proc/httpCode'); $m=$c->$a; $t=$vo->tmpl; if(!$t){$t=conf("Site/autoConf")->template;};
         if(!isWord($t)||!isee("$/Site/tmpl/$t")){$t="Anon";};
         $r=import("$/Site/tmpl/$t/base/stat.htm",['code'=>$a,'text'=>$m]);
         echo ($r); exit;
      };

      if(path($a))
      {
         if(isin($a,'.url/'))
         {$r=Proc::scanPlug($a); if(isList($r)){done($r);}; defn(['HALT'=>1]); header("Content-Type: $r->head"); echo $r->body; die();};

         $m=mime($a); if(!$m){finish(415,$vo,$nx);}; $x=fext($a);
         $p=isee($a); if(!$p){$p=path($a); finish((!file_exists($p)?404:403),$vo,$nx);};

         if(facing('SSE')){signal::feed(durl($a)); return;}; // feed data-URL to SSE
         // if(facing('BOT')){dump('TODO :: feed bot : '.$a);};

         if(envi('ACCEPT')==='application/json')
         {
            $r=import($a,$vo); header('Content-Type: application/json');
            if((strpos($r,'data:')!==0)&&(strpos($r,';base64,')!==false)){$r=base64_encode($r); $r="data:text/plain;base64,$r";};
            $r=json_encode(knob(['name'=>'feed', 'data'=>$r])); print_r($r); flush(); die();
         };

         // $t=(isin(envi('ACCEPT'),'text/plain')||isin(envi('CONTENT_TYPE'),'text/plain')||facing('API'));
         $t=(isin(envi('ACCEPT'),'text/plain')||isin(envi('CONTENT_TYPE'),'text/plain'));
         $h=['Content-Type'=>($t?"text/plain":$m)]; if($nx===FORGET){$h['cache']=false;}; $dne=0;

         if(isin($m,'image/')&&($x!=='ico')&&!userdoes("work,lead,sudo"))
         {
             $c=conf("Proc/antiHack"); $o=$c->stainIgnoreThese;
             if(isText($o)){$o=[$o];}; $o=((isNuma($o,1)&&pick($a,$o))?1:0);
             if($c->stainLargeImages&&!$o)
             {
                 $s=$c->stainWhenExceeds; $s=[($s[0]*1),($s[1]*1)];
                 $i=img($a); $d=$i->descry('size');

                 if(($d[0]>=$s[0])||($d[1]>=$s[1]))
                 {
                     $cvr=$c->stainCoverSizing;

                     if(isin(['high','tall','height'],$cvr)){$d[0]=0;}
                     elseif(isin(['wide','flat','width'],$cvr)){$d[1]=0;}
                     elseif(isin(['auto','cover'],$cvr)){if($d[0]>=$d[1]){$d[1]=0;}else{$d[0]=0;}}
                     // else $cvr is `stretch`, or `span`

                     $h['cache']=false; ekko::head($h);
                     $i->impose($c->stainImageSource,$d,null,$c->stainBaseOpacity);
                     if($t){echo (durl($i->raster(),$m));}else{echo $i->raster();};
                     if($nx!==NOEXIT){die();}; $dne=1;
                 }
                 else
                 {unset($i);};
             };
         };

         if(!$dne)
         {
             if($t){ekko(durl($p)); exit;}
             elseif(isin("php,htm,css,js,md",$x))
             {
                 $r=trim(tval(import($a,$vo)));
                 if($x=="php"){$h['Content-Type']=((wrapOf($r)==="<>")?"text/html":"text/plain");};
                 ekko::head($h); print_r($r);
             }
             else
             {
                 ekko::head($h);
                 readfile($p);
             };
             if($nx!==NOEXIT){die();};
         };
      };
   }
# ---------------------------------------------------------------------------------------------------------------------------------------------




# tool :: ekko : response
# ---------------------------------------------------------------------------------------------------------------------------------------------
   class ekko
   {
      static $stat=0;


      static function head($a,$nx=true)
      {
         $hs=\headers_sent(); if($hs){return false;};
         while(ob_get_level()){ob_end_clean();};

         if(is_int($a))
         {
            $c=conf('Proc/httpCode'); $m=$c->$a; if(!$m){$a=501; $m=$c->$a;};
            self::$stat=1;

            if(facing('SSE'))
            {
               if(!is_method('Proc::emit')){require_once(path('$/Proc/aard.php'));};
               Proc::emit('status',"$a - $m"); if($nx){return;}; done();
            };

            header("HTTP/1.1 $a $m");

            if(!facing('BOT'))
            {
               $v=conf('Proc/corsFrom'); header("Access-Control-Allow-Origin: $v");
               header("Access-Control-Allow-Credentials: true");
               // header("Access-Control-Expose-Headers: Lokomotionz");
               header("Access-Control-Allow-Headers: x-requested-with, accept, authorization");
            };

            if(facing('GUI')){header("X-Frame-Options: SAMEORIGIN");};

            if($nx){return;}; done();
         };

         if(is_assoc_array($a)){$a=knob($a);}; if(!is_object($a)){return;}; if(!self::$stat){self::head(200);};
         if(!$a->Interface){$a->Interface=envi('INTRFACE');}; if(($a->cache===null)&&facing('API')){$a->cache=false;};

         if($a->cache!==null){$c=$a->cache; unset($a->cache);
         if(!$c) // kill it, burn it, hurl the ashes to the sun in a sealed capsule
         {
            header("Cache-Control: no-store, no-cache, must-revalidate"); // HTTP/1.1
            header("Cache-Control: post-check=0, pre-check=0",false);
            header("Expires: Sat, 26 Jul 1997 05:00:00 GMT");
            header("Pragma: no-cache"); // HTTP/1.0
            header("Last-Modified: ".gmdate("D, d M Y H:i:s")." GMT");
         }}; unset($c);

         if($a->cookies!==null){$c=$a->cookies; unset($a->cookies);
         if($c)
         {
            if(isAssa($c)){$c=knob($c);}elseif(!isKnob($c)){$c=knob();}; $ec=knob($_COOKIE); $sh=sesn('HASH');
            foreach($c as $cn => $cv){if($ec->$cn!==$cv){$ec->$cn=$cv; if(!$hs){kuki($cn);}}};
            $a->Cookies=base64_encode(encode::jso($ec));
         }}; unset($c);

         foreach($a as $k => $v){header("$k: $v");}; if($nx){return;}; done();
      }


      static function path($a,$nx=null)
      {
         $p=expect::path($a,R); $x=path::type($p); $m=mime($x); if(!$m){fail("no mime-type configured for extension `$x`");};
         if($x!=='fold'){self::head(['Content-Type'=>$m]); readfile($p); flush(); done();}; // regular file
         todo('ekko.path :: serve folders');
      }


      static function body($a,$nx=null)
      {

      }


      static function foot($a,$nx=null)
      {

      }
   }
# ---------------------------------------------------------------------------------------------------------------------------------------------




# tool :: flog : file-log .. shorthand to add a log-entry into a file .. uses tval so new-lines and tabs won't interfere
# ---------------------------------------------------------------------------------------------------------------------------------------------
   class flog
   {
      static $path;

      static function __callStatic($p,$a)
      {
         expect::path($p); $a=args($a); foreach($a as $k => $v){$a[$k]=tval($v,FLOG);}; $ct=time(); ladd($a,$ct);
         $f=pget($p); $r=($f?frag($f,"\n"):[]); $s=count($r); $x=conf('Proc/logFlood'); if($s===$x){rpop($r);}; $l=fuse($a,"\t");
         if(count($r)>0){$lp=stub($r[0],"\t"); $lt=($lp[0]*1); $cp=stub($l,"\t"); if((($ct-$lt)<2)&&($lp[2]===$cp[2])){return;}}; // skip dupe
         ladd($r,$l); $r=fuse($r,"\n"); path::make($p,$r); return OK;
      }
   }

   function flog()
   {
       $lp=flog::$path; $pt='$/Proc/temp/logs'; $ol=pget($pt);
       foreach($ol as $fn){$tp="$pt/$fn"; if($tp !== $lp){path::void($tp);}}; // get rid of old logs
       flog::{"$lp"}(func_get_args());
   }

   flog::$path=('$/Proc/temp/logs/'.date("Y-m-d"));
# ---------------------------------------------------------------------------------------------------------------------------------------------




# func :: clanOf : returns the clan(s) text of a given nick & mail .. if given user-creds mismatch then `surf` is returned .. fails if invalid
# ---------------------------------------------------------------------------------------------------------------------------------------------
   function clanOf($n,$m)
   {
      expect::word($a); expect::mail($m); $dm=pget("/User/data/$n/mail"); if($dm!==$m){$n='anonymous';};
      $r=pget("/User/data/$n/clan"); return $r;
   }
# ---------------------------------------------------------------------------------------------------------------------------------------------




# func :: unbury : dig up data in asso/knob by field-name .. $o is what to omit .. returns array of values
# ---------------------------------------------------------------------------------------------------------------------------------------------
   function unbury($d,$f,$o=null)
   {
      expect::numa($d); expect::text($f,1); if(span($d<1)){return;}; $r=[]; foreach($d as $i)
      {if(isAsso($i)){$i=knob($i);}; if(!isin($i,$f)){continue;}; $v=$i->$f; if(isin($o,$v)){continue;}; $r[]=$v;};
      return $r;
   }
# ---------------------------------------------------------------------------------------------------------------------------------------------




# func :: crud/plug : standard interface for many URL schemas
# ---------------------------------------------------------------------------------------------------------------------------------------------
   function plug($d)
   {
      $x=path::info($d); if(!isKnob($x)){fail('expecting path, or URL');}; $o=$x->plug; $p=$x->path;
      if((($x->type==='git')&&($o==='http'))||(($o==='file')&&($x->type==='fold')&&isee("$p/.git"))){$o='git';}
      elseif($o==='https'){$o='http';}elseif($o==='imap'){$o='mail';}elseif(($o==='file')&&($x->type==='sdb')){$o='sqlite';};
      $c="Anon\\{$o}_plug";

      if(!is_class($c)){ $p="/Proc/plug/$o.php"; requires::path($p); };
      if(!is_class($c))
      {
          $s = path::stem(stak()[0]->file); // get plug from calling stem
          $p = ($s ? "/$s/plug/$o.php" : "/plug/$o.php");
          requires::path($p);
      };

      if(!is_class($c)){fail("expecting class `$c` in: `$p`");};
      // signal::dump("running plug: $d");
      $i=(new $c($x)); return $i;
   }

   function crud($d)
   {
      $p=(isFile($d)?pget($d):(isFile("$d.url")?pget("$d.url"):$d));
      return plug($p);
   }
# ---------------------------------------------------------------------------------------------------------------------------------------------




# tool :: ftp : extremely simple FTP class .. any warning/error will be silenced, but kept in `fail`
# ---------------------------------------------------------------------------------------------------------------------------------------------
   class ftp
   {
      public $link;
      public $fail;
      public $host;
      public $fold;
      private $lock;


      function __construct($hn,$pn=null,$un=null,$pw=null,$sm=false)
      {
         if($pn===null){$pn=21;}; $C=$this->connect($hn,$pn,$un,$pw,$sm);
         if(!$C&&isin($this->fail,'AUTH not understood')&&$sm){$C=$this->connect($hn,$pn,$un,$pw,0);};
         return $this;
      }


      public function connect($hn,$pn=21,$un=null,$pw=null,$sm=true)
      {
         $HF=null; $SF=null; $EH=defail();
         try{$L=($sm?ftp_ssl_connect($hn,$pn):ftp_connect($hn,$pn));}catch(\Exception $e){$HF=$e->getMessage();};
         $SF=enfail($EH); if(isset($SF[0])){$SF=$SF[0]->mesg;};
         if($L===false){$F=trim(($HF?$HF:($SF?$SF:'connection failed')).''); if(!$F){$F=null;}; $this->fail=$F; return;};
         $this->host=$hn; $this->fold='/'; $this->fail=null; $this->link=$L; if($un===null){return $this->link;};
         $S=$this->login($un,$pw); if(!$S||$this->fail){if($this->link){$F=$this->fail; $this->close(); $this->link=null; $this->fail=$F;}};
         return (($S&&!$this->fail)?true:false);
      }


      public function read($rp,$op=FTP_BINARY)
      {
         ob_start(); $s=ftp_get($this->link,'php://output',$rp,$op); $r=ob_get_clean();
         if($s===true){return $r;}; $this->fail="could not read `$rp`";
      }


      public function write($f,$b)
      {
         $h=$this->host; $d=$this->fold; $h=sha1("$h/$d/$f"); $p="/Proc/temp/file/$h"; lock::awaits($p);
         pset($p,$b); $r=$this->put($f,path($p),FTP_BINARY); void($p); lock::remove($p); return $r;
      }


      public function rdel($p)
      {
         $h=$this->host; $d=$this->fold; if(!isPath($p)){if(!isPath("/$p")){$this->fail='invalid filename';return false;}; $p="$d/$p";};
         $l=$this->lock; $m=0; if(!$l){$l=sha1("$h/$p"); $l="/Proc/temp/file/$l"; lock::awaits($l); $this->lock=$l; $m=1;}; // lock master
         $r=$this->delete($p); $e=$this->fail; if($r){if($m){lock::remove($l); $this->lock=null;}; return $r;}; // first was success
         if(!isin($e,'s a directory')){if($m){lock::remove($l); $this->lock=null;}; return false;}; // not a folder, some other issue
         $this->fail=null; $k=$this->nlist($p); if($k){foreach($k as $i){$this->rdel($i);}; $r=$this->rmdir($p); return $r;}; // done
      }


      public function __call($n,$a)
      {
         if(is_string($n)){$n=trim($n); if(strlen($n)<1){return;}}; $f="ftp_$n"; $r=null; $fa=(isset($a[0])?$a[0]:null);
         if(!function_exists($f)){fail("call to undefined method ftp::$n");}; array_unshift($a,$this->link);
         $EH=defail(); $HF=null; $SF=null; try{$r=call_user_func_array($f,$a);}catch(\Exception $e){$HF=$e->getMessage();};
         $SF=enfail($EH); if(isset($SF[0])){$SF=$SF[0]->mesg;}; $E=trim(($HF?$HF:($SF?$SF:null)).''); if(!$E){$E=null;}; $this->fail=$E;
         if(!$E)
         {
            if($n==='chdir'){$this->fold=path::fuse($this->fold,$fa);};
         };
         return $r;
      }
   }
# ---------------------------------------------------------------------------------------------------------------------------------------------




# func :: frst/last : first/last item in string, array or object
# ---------------------------------------------------------------------------------------------------------------------------------------------
   function frst($d)
   {
      if(is_bool($d)||(span($d)<1)){return;}; if(is_string($d)){return mb_substr($d,0,1);};
      $v=vals($d,0); return $v;
   }

   function last($d)
   {
      if(is_bool($d)||(span($d)<1)){return;}; if(is_string($d)){return mb_substr($d,-1,1);};
      $v=vals($d,-1); return $v;
   }
# ---------------------------------------------------------------------------------------------------------------------------------------------




# func :: numr : turn any numeric(ish) text into a number .. returns unchanged-number if number given .. returns null if number not found
# ---------------------------------------------------------------------------------------------------------------------------------------------
   function numr($d)
   {
      if(isNumr($d)){return $d;}; if(!is_string($d)){return;}; $d=trim($d); if(strlen($d)<1){return;}; $r=''; if($d[0]==='-'){$r='-';};
      $n='0.123456789'; $l=str_split($d); foreach($l as $i){if(strpos($n,$i)===false){continue;};
      if(($i==='.')&&(strpos($r,'.')!==false)){continue;}; $r.=$i;}; $r=shaved($r,'.'); if(strlen($r)<1){return;};
      if(!is_numeric($r)){return;}; $r=($r*1); return $r;
   }
# ---------------------------------------------------------------------------------------------------------------------------------------------




# tool :: img : image processing
# ---------------------------------------------------------------------------------------------------------------------------------------------
    class img
    {
        private $meta;
        private $refs;


        function __construct($p)
        {
            $fext=fext($p); $this->meta=knob(["path"=>$p, "fext"=>$fext]);
            requires::phpx("imagick"); expect::path($p,[R,F]);
            $this->refs=knob(["png"=>"png32","jpg"=>"jpeg"]);
            $this->meta->imag=(new \Imagick());
            if(isin("png,svg,gif",$fext)){$this->meta->imag->setBackgroundColor(new \ImagickPixel('transparent'));};
            $this->meta->imag->readImage(path($p));

            return $this;
        }


        function __destruct()
        {
            if(!$this->meta->imag){return;};
            $this->meta->imag->clear();
            $this->meta->imag->destroy();
        }


        function descry($p=null)
        {
            $img = $this->meta->imag; $r=knob();
            $r->path = $this->meta->path;
            $r->fext = $this->meta->fext;
            $r->size = [$img->getImageWidth(),$img->getImageHeight()];
            if(isText($p,1)){return $r->$p;};
            return $r;
        }


        function impose($pth,$dim=null,$pos=null,$opa=1)
        {
            expect::path($pth,[R,F]); $w=0; $h=0; $x=0; $y=0;
            if(isNuma($dim)){$w=$dim[0]; $h=$dim[1];}; if(isNuma($pos)){$x=$pos[0]; $y=$pos[1];};
            $img=$this->meta->imag; $mrk=(new \Imagick()); $gdf=(($dim===SPAN)?$img:$mrk);
            $mrk->setBackgroundColor(new \ImagickPixel('transparent')); $mrk->readImage(path($pth));
            if(!$w&&!$h){$w=$gdf->getImageWidth();}; if(!$h&&!$w){$h=$gdf->getImageHeight();};
            if(method_exists($mrk,'setImageAlpha')){$mrk->setImageAlpha($opa);}
            else{$fh=defail(); $mrk->setImageOpacity($opa); $ob=enfail($fh);};
            $mrk->scaleImage($w,$h); $img->compositeImage($mrk,\Imagick::COMPOSITE_OVER,$x,$y);
        }


        function raster($x="png",$w=null,$h=null)
        {
            $t=$this->refs->$x; if(!$t){$t=$x;};
            if(!$w){$w=$this->meta->imag->getImageWidth();};
            if(!$h){$h=$this->meta->imag->getImageHeight();};
            $this->meta->imag->setImageFormat($t);
            $f=(($x!=="gif")?"getImageBlob":"getImagesBlob");

            if($x==="png"){$this->meta->imag->resizeImage($w,$h,\Imagick::FILTER_LANCZOS,1);}
            else{$this->meta->imag->resizeImage($w,$h);};

            return $this->meta->imag->$f();
        }


        function scaled($s)
        {
            $d = $this->descry();
            $w = floor($d->size[0] * $s);
            $h = floor($d->size[1] * $s);

            return $this->raster($d->fext, $w, $h);
        }
    }


    function img($p)
    {
        return (new img($p));
    };
# ---------------------------------------------------------------------------------------------------------------------------------------------



# func :: siteLocked : lock domain for when important stuff must not be disturbed .. true writes .. false releases .. null returns bool
# ---------------------------------------------------------------------------------------------------------------------------------------------
    function siteLocked($b=null,$m=null)
    {
        $p="$/Proc/temp/lock/AnonSystemLock"; $x=pget($p); $h=PROCHASH;
        if($x&&(aged($p)>conf("Proc/sysClock/unlock"))){path::void($p); $x=null;};

        if($b===null){return ($x?true:false);};


        if($b===true)
        {
            if($x){return $x;};
            if(!isText($m,1)){$m='system locked';};
            signal::lockAllClients("bgn:$m",'*'); wait(3000);
            path::make($p,$h); return $h;
        };

        if($b===false)
        {
            if(($x!==$h)&&($x!==$m)){signal::dump("siteLocked by another process"); return;};
            path::void($p); signal::lockAllClients('end','*'); wait(250);
            return OK;
        };
    }
# ---------------------------------------------------------------------------------------------------------------------------------------------



# func :: dnload : download remote file
# ---------------------------------------------------------------------------------------------------------------------------------------------
    function dnload($purl,$path)
    {
        $fold = path::twig($path);  if (!isee($fold)){path::make("$fold/");};
        $path = path($path);
        $disk = crop($path);

        if (is_class("signal")){ signal::dump("server :: dnload : bgn $purl"); };

        $link = curl_init($purl);
        $sock = fopen($path,'wb');

        curl_setopt($link, CURLOPT_FILE, $sock);
        curl_setopt($link, CURLOPT_HEADER, 0);
        curl_exec($link); curl_close($link);
        fclose($sock);

        if (is_class("signal")){ signal::dump("server :: dnload : end $disk"); };

        return OK;
    }
# ---------------------------------------------------------------------------------------------------------------------------------------------
