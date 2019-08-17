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


      static function getPanel()
      {
         $h=COREPATH; $l=concat(pget(COREPATH),pget(ROOTPATH)); $r=knob(); $c=frag(sesn('CLAN'),',');
         foreach($l as $m)
         {
            $p="/$m/pack.inf"; $p=(isee(COREPATH.$p)?(COREPATH.$p):(isee(ROOTPATH.$p)?(ROOTPATH.$p):null));
            if(!$p){continue;}; $d=knob(dval(pget($p)));
            if(!$d->forClans||!$d->panlIcon||$d->isHidden||$d->ethereal){continue;};
            if(($d->forClans==='*')||isin($d->forClans,$c)||isin($c,$d->forClans)){$r->$m=$d->panlIcon;};

         };
         finish('/User/panl.js',['mods'=>$r]);
      }


      static function getRepel()
      {
         $r=''; $h='/User/tool'; $l=pget($h); $uc=explode(',',sesn('CLAN')); foreach($l as $i)
         {
            $d="$h/$i"; $p=knob(dval(pget("$d/pack.inf"))); $pc=$p->forClans; if($pc==='*'){$pc=null;};
            if(is_array($pc)){$pc=implode(' ',$pc);}; if($pc&&!isin($pc,$uc)){continue;}; $c=pget("$d/view.js"); if($c){$r.=$c;};
         };
         finish('/User/repl.js',['commands'=>$r]);
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
            $a=knob($_POST)->args; $h='/User/tool'; if(!is_array($a)){fail("expecting object with `args` key posted from `$h/$c/view.js`");};
            if(isset($a[0])&&(($a[0]==='-h')||($a[0]==='--help'))){self::replHelp($c);return;}; // run help for these options
            $p="$h/$c/host.php"; $f=import($p); if(!isFunc($f)){fail("expecting: `$export=function(){};` from $p");};
            $r=call($f,$a); if($r){ekko(($r===true)?OK:$r);}; ekko(FAIL);
         }
         catch(\Exception $e)
         {
            $x=sesn('CLAN'); if((isin($x,'geek')&&isin($x,'work'))||(sesn('USER')==='master')){throw $e;}; // hide error from public
            ekko("the `$c` command is currently not available, sorry :/"); // tell other users something else
         }
      }


      static function getModal()
      {
      }


      static function readNote($n)
      {
         $r=import("/User/note/$n.md"); ekko($r);
      }


      static function doLogout()
      {
         $l=array_keys($_COOKIE); if(count($l)<1){ekko(OK);}; $t='/^[a-z0-9]{40}$/'; $h='/Proc/temp/sesn';
         Time::logEvent(user('name'),$c=user('clan'),'API');
         foreach($l as $i){if(!test($i,$t)){continue;}; setcookie($i,null,-1,'/',HOSTNAME); void("/Proc/temp/sesn/$i");};
         ekko(OK);
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


      static function ratingOf($u,$m)
      {
         expect::text($u,1); expect::text($m,1); $p="/User/data/$u/rate"; if(!isee($p)){return;};
         if(isFile($p)){$r=(pget($p)*1); return $r;}; if(!isFold($p)){return 0;}; $h=md5($m); $r=pget("$p/$h");
         return ($r?($r*1):0);
      }


      static function initBoot($a)
      {
         $u=sesn('USER'); $p="/User/data/$u/home/boot/$a";
         if(!isin(sesn('CLAN'),'work')||!isee($p)){ekko::head(['Content-Type'=>mime($p)]); die('/* one love */');};
         finish($p);
      }


      static function treeMenu()
      {
         $u=user('name'); $h="/User/data/$u/home";

         if(!isee("$h/root"))
         {
            $b=conf('Code/forkName'); if(!is_funnic($b)){fail("invalid branch name in Code config");};
            if(!isRepo('/')){repo::create('/'); wait(50);}; repo::cloned('/',"$h/root",$b,user('name'));
         };

         $r=path::tree($h); dump($r);
      }


      static function plugMenu()
      {
         $v=knob($_POST); $p=$v->purl; $r=crud($p)->select('*');
         dump($r);
      }
   }
# ---------------------------------------------------------------------------------------------------------------------------------------------
