<?
namespace Anon;



# info :: file : read this
# ---------------------------------------------------------------------------------------------------------------------------------------------
# this file serves as the entry-point of most user-related operations
# here we are at "the lobby"; welcome, fair warning: right of admission reserved, wild animals will be served with extreme prejudice
# ---------------------------------------------------------------------------------------------------------------------------------------------



# tool :: User : lobby
# ---------------------------------------------------------------------------------------------------------------------------------------------
   class User
   {
      static $meta;

      static function __init()
      {
         permit::fubu();
      }



      static function initConf()
      {
          permit::fubu("clan:sudo"); $v=knob($_POST);
          if(!isPass($v->pass)){fail::config("Invalid password. Please try again."); exit;};
          if(!isPurl($v->mail)){fail::config("Invalid mail-plug. Please try again"); exit;};
          path::make("$/User/data/master/pass",password_hash($v->pass,PASSWORD_DEFAULT));
          path::make("$/Proc/conf/autoMail",$v->mail);

          $mpth = "$/User/data/master/mail";
          $mval = simp($v->mail);

          // exec::{'git config --system http.sslVerify false'}('/'); // shush!
          // exec::{'git config --system user.email "'.$mval.'"'}('/'); // shush!
          // exec::{"git config --global --add safe.directory ".ROOTPATH}('/'); // shush!

          if (!isee($mpth) || (pget($mpth) !== $mval)){ path::make($mpth,$mval); };
          if ( !isRepo('/') ){ requires::path("$/Repo/keep.php"); };
          wait(60);

          Repo::config("user.email",$v->mail);
          Repo::config("user.name","master");
          ekko(OK);
      }



      static function exists($d)
      {
         if(!isWord($d)){return;}; return (isee("/User/data/$d")?true:false);
      }



      static function getPanel()
      {
         $h=COREPATH; $l=concat(pget(COREPATH),pget(ROOTPATH)); $r=knob(); $c=frag(sesn('CLAN'),',');
         foreach($l as $m)
         {
            $p="/$m/pack.inf"; $p=(isee(COREPATH.$p)?(COREPATH.$p):(isee(ROOTPATH.$p)?(ROOTPATH.$p):null));
            if(!$p){continue;}; $d=knob(dval(pget($p)));
            if(!$d->forClans||!$d->panlIcon||$d->isHidden||$d->ethereal){continue;};
            if(($d->forClans==='*')||isin($d->forClans,$c)||isin($c,'sudo')){$r->$m=$d->panlIcon;};

         };
         finish('/User/panl.js',['mods'=>$r]);
      }



      static function getUsers()
      {
         permit::fubu('clan:work,lead,sudo'); $l=pget('/User/data'); $r=knob(); foreach($l as $u)
         {if(isin('anonymous master',$u)){continue;}; $r->$u=knob(['mail'=>pget("/User/data/$u/mail")]);};
         ekko($r);
      }



      static function getRepel()
      {
         $r=''; $h='/User/tool'; $l=pget($h); $uc=explode(',',sesn('CLAN')); foreach($l as $i)
         {
            $d="$h/$i"; $p=knob(dval(pget("$d/pack.inf"))); $pc=$p->forClans; if($pc==='*'){$pc=null;};
            if(is_array($pc)){$pc=implode(' ',$pc);};
            if($pc&&!isin($pc,$uc)&&!userDoes('sudo')){continue;};
            $c=pget("$d/view.js"); if($c){$r.=$c;};
         };

         $un=sesn('USER'); $lp="$/User/data/$un/logs/repl.log"; $cl=pget($lp); $xl=[]; $rl=[];
         if($cl){$cl=explode("\n",$cl); foreach($cl as $li){$ci=stub($li,"\t")[2]; if(!isin($rl,$li)){$rl[]=$li; $xl[]=$ci;}}};
         if(count($xl)!==count($rl)){$rl=implode("\n"); path::make($lp,$rl);};
         finish('/User/repl.js',['commands'=>$r,'replLogs'=>enconf($xl)]);
      }



      static function replHelp($f)
      {
         if(!isWord($f)){ekko(' ..huh?');}; $r=import("/User/tool/$f/help.md"); if($r){$r=trim($r);}; // validate
         if($r){ekko($r);}; // done
         ekko("no help available for `$f` :("); // help file is undefined/empty
      }



      static function runRepel($c)
      {
         try
         {
            $v=knob($_POST); $a=$v->args; $h='$/User/tool';
            if(!is_array($a)){fail("expecting object with `args` key posted from `$h/$c/view.js`");};
            $u=sesn('USER'); $x=$v->cmnd; if(isText($x,1)&&userDoes('work,sudo')){flog::{"$/User/data/$u/logs/repl.log"}($x);};
            if(isset($a[0])&&(($a[0]==='-h')||($a[0]==='--help'))){self::replHelp($c);return;}; // run help for these options
            $p="$h/$c/host.php"; $f=requires::path($p);
            if(!isFunc($f)){fail('expecting: `$export=function(){};` in: '.$p);};
            if(!$x){$x=''; foreach($a as $ai){$x.=(' '.(is_array($ai)?implode(' ',$ai):$ai));}};
            $x=trim($x); signal::dump("running command: `$x`"); wait(150);
            $r=call($f,$a); if($r){ekko(($r===true)?OK:$r);}; ekko(FAIL);
         }
         catch(\Exception $e)
         {
            $x=sesn('CLAN'); if((isin($x,'geek')&&isin($x,'work'))||(sesn('USER')==='master')){throw $e;}; // hide error from public
            ekko("the `$c` command is currently not available, sorry :/"); // tell other users something else
         }
      }



      static function authSudo()
      {
         permit::fubu("clan:sudo");
         $un=sesn('USER'); $pw=posted('pw');
         $r=password_verify($pw,pget("/User/data/$un/pass")); if(!$r){ekko('nope, sorry');}; // RTFC
         done(OK);
      }



      static function readNote($n)
      {
         $r=import("/User/note/$n.md"); ekko($r);
      }



      static function doLogout()
      {
         $l=array_keys($_COOKIE); if(count($l)<1){done(OK);}; $t='/^[a-z0-9]{40}$/'; $h=sesn('HASH');
         Time::logEvent(user('name'),user('clan'),'API');
         foreach($l as $i){if(!test($i,$t)||($i===$h)){continue;}; kuki($i,null); unset($_COOKIE[$i]); void("$/Proc/temp/sesn/$i");};
         $u='anonymous'; $_SERVER['SESNUSER']=$u; $_SERVER['SESNCLAN']='surf';
         path::make("$/Proc/temp/sesn/$h/USER",$u); done(OK);
      }



      static function isActive()
      {
         ekko(OK);
      }



      static function readFace($u)
      {
         expect::text($u,1); $p="/User/data/$u/face"; if(!isee($p)){$p='/User/dcor/mug2.jpg';};
         $p=pget($p); ekko::path($p); exit;
      }



      static function ratingOf($m)
      {
         expect::mail($m,1); $p="/User/vars/vote/$m"; $r=pget($p); if(span($r)<1){path::make($p,'0'); $r='0';};
         $r=($r*1); return $r;
      }



      static function voteMail($m=null,$v=null,$b=null)
      {
         if(!$m){$x=knob($_POST); $m=$x->mail; $v=$x->vote; $b=$x->bfor;}; $f=user('mail'); if($m===$f){return;};
         $h='/User/vars/vote'; if(!isee("$h/$m")){path::make("$h/$m",'0');}; if(!isee("$h/$f")){path::make("$h/$f",'0');};
         $tn=(pget("$h/$m")*1); $fn=(pget("$h/$f")*1); if($v==='+'){$tn+=($b?1:3); $fn+=1;}else{$tn-=1; $fn-=1;};
         path::make("$h/$m",$tn); path::make("$h/$f",$fn); return OK;
      }



      static function initBoot($a)
      {
         $u=sesn('USER'); $p="$/User/data/$u/home/Custom";
         permit::fubu();

         if(!isee("$p/$a")){ekko::head(['Content-Type'=>mime("$p/$a")]); die('/* one love */');};
         finish("$p/$a");
      }



      static function treeMenu()
      {
         permit::fubu("clan:work");
         $v=knob($_POST); $h=$v->root; if(!$h){$h='~';};
         if(arg($h)->startsWith('~')){$u=user('name'); $h="/User/data/$u/home";};

         $r=path::tree($h,3); ekko($r);
      }



      static function foldMenu()
      {
         permit::fubu("clan:work"); $u=sesn('USER');
         $v=knob($_POST); $h=$v->root; if(!$h){$h=$v->path;}; if(!$h){$h='~';}; expect::path($h,[R,D]);
         // if(arg($h)->startsWith('~')){$u=user('name'); $h="/User/data/$u/home";};

         $r=path::tree($h,0);
         $r->data=path::ogle
         ([
            using => $h,
            fetch => path::cols(),
            param => [NATIVE=>"user_$u",REMOTE=>'main'],
            limit => "data: fold, levl: 0",
         ]);

         if (($h === "~") && userDoes("geek") && userDoes("sudo"))
         {
             $x = span($r->data);
             $r->data[$x] = path::tree("/",0);
             $r->data[$x]->name = "Public";
             $r->data[$x]->data = path::ogle
             ([
                using => "/",
                fetch => path::cols(),
                // param => [NATIVE=>"user_$u",REMOTE=>'main'],
                limit => "data: fold, levl: 0",
             ]);
         };

         ekko($r);
      }



      static function plugMenu()
      {
         permit::fubu("clan:work");
         $v=knob($_POST); $l=xeno::showHyperConduit($v->path,parts);
         if (!isKnob($l)){ return self::foldMenu(); };
         $p=$l->plug; if($l->path){$p=($p.$l->path);};
         $i=path::info($l->plug); $D=plug($p); $r=$D->select('*',TREE);

         if(isin(['ftp','ftps'],$i->plug))
         {
            ekko($r);
         };

         $rsl=[]; $prl=$p;
         $pth=$l->path; if(!$pth){$pth='/';};
         $lvl=path::meta($prl)->levl;

         foreach($r as $itm)
         {
            $pts=stub($itm,'::'); $tpe=$pts[0]; $itm=$pts[2];
            $dat=knob
            ([
               "repo"=>null,
               "path"=>$itm,
               "levl"=>($lvl+0),
               "name"=>$itm,
               "mime"=>$D->mean->mime,
               "type"=>$tpe,
               "size"=>0,
               "time"=>0,
               "data"=>[],
            ]);

            $rsl[]=$dat;
         };

         dump($rsl);
      }



      static function upload()
      {
         permit::fubu();
         $po=knob($_POST); $fp=$po->path; $ph=md5($fp); $sk=USERSKEY; $tp="/Proc/temp/sesn/$sk/$ph";
         $rp=path($tp); $br=file_put_contents($rp,$po->data,FILE_APPEND); if(!$br){ekko(FAIL);return;};
         $cs=filesize($rp); $ts=$po->size; if($cs<$ts){dump([$cs,$ts]);return;}; // in progress
         $fd=furl(pget($tp))->data; path::void($tp); // done .. we have the raw data and temp-file is deleted

         $XL=xeno::showHyperConduit($fp); $XO=xeno::showHyperConduit($fp,parts); // plug info
         $XI=(!$XL?null:path::info($XL)); $XP=(!$XI?null:$XI->plug); // plug details
         $pt=rstub($fp,'/')[0]; $fn=rstub($fp,'/')[2]; // path-tree & file-name
         $fm="failed to upload `$fn` to `$pt`";

         if(!$XL){path::make($fp,$fd); dump([$cs,$ts]); return;}; // no plug
         $pt=rstub($XL,'/')[0];

         $r=crud($pt)->insert(["$fn"=>$fd]); if($r){dump([$cs,$ts]);}; fail($fm);
      }



      static function treeExec()
      {
         permit::face(API); $q=knob($_POST); $h=$q->path; if(!isPath($h)||isin($h,['..','./'])){done('invalid path');};
         $h=crop($h); $a=$q->args; $t=$q->type; $XO=xeno::showHyperConduit($h,parts);
         $X=xeno::showHyperConduit($h); $XI=(!$X?null:path::info($X)); $XP=(!$XI?null:$XI->plug);


         if($q->exec==='create')
         {
            if(is_string($a)){$a=trim($a); $a=trim("$a",'/');}; $l=$q->link; $p=crop("$h/$a"); $f="failed to create $t `$p`";
            if(($t!=='repo')&&(!isText($a,1)||isin($a,['..','/'])||!isPath($p))){done("invalid $t name");};

            if(($t==='fold')||($t==='repo')){$p="$p/";}; if(($t==='plug')&&(fext($p)!=='url')){$p="$p.url";};

            if(!$X) // local
            {
               if(isee($p)&&($t!=='repo')){done("`$p` already exists");};
               if((($t==='plug')||($t==='repo'))&&!isPurl($l)){fail("invalid $t link");};
               if($t!=='repo'){$r=path::make($p,$l); if(!$r){done($f);}; done(OK);};
               if(!arg($p)->endsWith($a)) // get dirname from repo-url
               {
                   $dir = rstub(rstub($l,"/")[2],".git")[0];
                   $p = "$p/$dir"; path::make("$p/");
               };
               $r=Repo::cloned($l,$p); if(!$r){done($f);};  $h=path::twig($p); if(!isRepo($h)){done(OK);};
               $i=path::leaf($p); Repo::ignore($h,write,"$i/*"); Repo::ignore($h,write,"/$i"); done(OK);
            };

            if(isin(['ftp','ftps'],$XP))
            {
               if($t==='fold'){$a="$a/";}; $v=(($t==='plug')?"$l":'');
               if($t!=='repo'){$r=crud($X)->insert([$a=>$v]); if($r){done(OK);}; fail($f);};
            };

            done("TODO :: create remote $t");
         };


         if($q->exec==='rename')
         {
            if(isText($a)){$a=trim($a); $a=trim("$a",'/');}; if(!isText($a,1)||isin($a,['..','/'])||!isPath("/$a")){done("invalid $t name");};
            $s="$h"; $h=path::twig($h); $d="$h/$a"; if(($t==='plug')&&(fext($d)!=='url')){$d="$d.url";}; $f="failed to rename $t";

            if(!$X) // local
            {$r=path::move($s,$d); if($r){done(OK);}; fail($f);};

            if(isin(['ftp','ftps'],$XP))
            {
               $s=path::leaf($s); $d=path::leaf($d); if(arg($X)->endsWith("/$s")){$X=rshave($X,"/$s");};
               $r=crud($X)->rename([$s=>$d]); if($r){done(OK);}; fail($f);
            };

            done("TODO :: rename remote $t over $XP");
         };


         if($q->exec==='descry')
         {
            permit::clan('geek'); $r=self::ratingOf(user('mail'));
            if(($r<12)&&!isin(user('clan'),'sudo')){done("this feature is not available for rookies\n.. unless you know sudo-fu");};
            if($t==="repo"){done(Repo::origin($h));};
            done(pget($h));
         };


         if($q->exec==='modify')
         {
            permit::clan('geek'); permit::rank(12);
            // if(!isPath($a)&&!isPurl($a)){done("invalid $t link .. expecting `path` or `url`");};
            if(!isPath($a)&&!isPurl($a)){done(encode::json(path::info($a)));};
            $r=path::make($h,$a); if(!$r){done("failed to modify `$h`");}; done(OK);
         };


         if($q->exec==='delete')
         {
            if(!$X||($XO&&(!$XO->path||($XO->path==='/')))) // local
            {
                $r=path::void($h); if(!$r){done("failed to delete $t");};
                if(!isin($t,'repo')){done(OK);}; $t=path::twig($h); $i=path::leaf($h); if(!isRepo($t)){done(OK);};
                Repo::ignore($t,erase,"$i/*"); Repo::ignore($t,erase,"/$i"); done(OK);
            };

            if(isin(['ftp','ftps'],$XP))
            {
               $n=path::leaf($h); if(arg($X)->endsWith("/$n")){$X=rshave($X,"/$n");};
               $r=crud($X)->delete($n); if($r){done(OK);}; done("failed to delete $t");
            };

            done("TODO :: delete remote $t over $XP");
         };


         if($q->exec==='upload')
         {
            $f="failed to upload $q->path";

            if(!$X)
            {
               if(isPath($h,X)){$h=path::inic($h);}; $b=furl($q->bufr);
               $r=path::make($h,$b->data); if($r){done(OK);}; fail($f);
            };

            $f=rstub($X,'/')[2]; $x=rstub($X,'/')[0]; $b=furl($q->bufr)->data;
            $r=crud($x)->insert(["$f"=>$b]); if($r){done(OK);}; fail($f);
         };


         if($q->exec==='update')
         {
            $f="failed to update $t in $q->path"; $d=$q->todo; $m=$q->mesg;
            if($t!=='repo'){done("cannot update $t, yet");};

            if(!$X)
            {
                if($d==='pull'){$r=Repo::update(); if($r){done(OK);}; done($f);};
                $r=Repo::commit($h,$m,true); if($r){done(OK);}; done($f);
            };

            done("TODO :: update remote $t over $XP");
         };


         fail("undefined action `$q->exec`");
      }
   }
# ---------------------------------------------------------------------------------------------------------------------------------------------
