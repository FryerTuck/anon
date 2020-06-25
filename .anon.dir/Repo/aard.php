<?
namespace Anon;



# tool :: Repo : repository tools .. only works with Git
# ---------------------------------------------------------------------------------------------------------------------------------------------
   class Repo
   {
      static $meta;


      static function create($h,$o=null,$u=null)
      {
         expect::path($h,[R,W,D]); if($h!=='/'){$h=rshave($h,'/');}; $x=("/Repo/data/".HOSTNAME.".git");

         if(!isee($x))
         {
             $u=exec::{"whoami"}($h); $g=exec::{"id -gn"}($h); path::make("$x/");
             exec::{"git init --bare --shared"}($x);  exec::{"cp hooks/post-update.sample hooks/post-update"}($x);
             exec::{"git update-server-info"}($x);  exec::{"chown -R $u:$g ."}($x);
             if($o===BARE){return OK;};  if(!$o){$o=path($x);};
         };


         if(isRepo($h)){fail("`$h` is already a repo");}; if(isWord($o)){$t="$u"; $u="$o"; $o="$t";}; // validate
         exec::{"git init ."}($h); if(isText($o)&&isin($o,'/')){exec::{"git remote add origin $o"}($h);}; exec::{"git add --all"}($h);
         $m=0; if(!isWord($u)){$u='master'; $m=TECHMAIL;}; $p=isee("/User/data/$u"); if(!$p){fail("user `$u` is undefined");};
         if(!$m){$m=pget("$p/mail");}; exec::{"git config --local user.name \"$u\""}($h); exec::{"git config --local user.email \"$m\""}($h);
         exec::{"git commit --allow-empty -m \"initial commit\""}($h);
         if($h==='/'){$c=conf("Repo/fromAnon"); exec::{"git remote add fromAnon $c"}($h);};

         return OK;
      }


      static function config($k,$v,$p='/')
      {
          expect::repo($p); $r=OK;
          try{exec::{"git config $k \"$v\""}($p);}catch(\Exception $e){$r=$e->getMessage();};
          return $r;
      }


      static function differ($lp='/',$rn='fromAnon',$bn='master')
      {
          expect::repo($lp); expect::word($rn); expect::word($bn); $r=null;
          try{$r=exec::{"git fetch $rn master && git diff --name-only $bn $rn/$bn"}($lp);}catch(\Exception $e){};
          if(!$r){return;}; $f=path::leaf(COREPATH); $r=swap($r,[COREPATH,ROOTPATH],''); $r=swap($r,"$f/","$/");
          return $r;
      }


      static function getURL($lp='/',$rn='origin')
      {
          expect::repo($lp); expect::word($rn);
          // $r=null; try{$r=exec::{"git remote get-url $rn"}($lp);}catch(\Exception $e){};
          $r=null; try{$r=exec::{"git config remote.$rn.url"}($lp);}catch(\Exception $e){};
          if($r){$r=swap($r,[COREPATH,ROOTPATH],''); if(!$r){$r='/';};};
          return $r;
      }


      static function rooted($h)
      {
         return repoOf($h);
      }


      static function branch($h,$b=null,$f=null)
      {
         $h=repoOf($h); if(!$h){return;}; $l=exec::{"git branch"}($h); $x=expose("$l\n",'*',"\n"); if($x){$x=trim($x[0]);};
         if(!$b){return $x;}; $l=swap($l,['*',' ',"\t"],''); $l=trim($l); $l="\n$l\n"; if(!$f){return (isin($l,"\n$b\n")?$b:null);};
         if(isin($l,"\n$b\n")){return $b;}; if(!is_funnic($f)){$f="$x";}; exec::{"git branch $b $f"}($h); return $b;
      }


      static function origin($h,$deja=null)
      {
         if(!$deja){expect::repo($h);}; $r=exec::{'git config --get remote.origin.url'}($h);
         $r=swap($r,'file://',''); if(isPath($r)){$r=crop($r);}; if($r===''){$r='/';};
         return $r;
      }


      static function status($dir)
      {
         $dir=repoOf($dir); if(!$dir){return;}; $brn=isRepo($dir); $src=self::origin($dir,1); $hst=HOSTNAME; $bdy=knob();

         if(isin($src,['https://','http://']))
         {
            if(!online()){fail("`$hst` is offline");}; try{$x=exec::{"git ls-remote $src"}();}catch(\Exception $e){$x=$e->getMessage();};
            $w=0; $eg="https://USER:PASS@example.com/repoName.git"; if(arg($x)->startsWith('fatal: '))
            {$w=(isin($x,['not read Username','not read Password'])?'forbidden':(isin($x,' not found')?'undefined':'missing'));};
            if($w){$x=''; if($w=='forbidden'){$x="\n\n>TIP :: set the username and password inside the origin URL like this: $eg";}};
            if($w){fail::repo("Repository at: $src is $w".$x);};
         };

         $nps=self::survey($dir,$brn,NATIVE,0,0); exec::{"git fetch origin $brn"}($dir);
         $rps=self::survey($dir,$brn,ORIGIN,0,0); $ldr=null;

         foreach($nps as $npk => $npv)
         {
            $obj=json_decode(json_encode($npv)); if(!$ldr){$ldr=$obj;};
            if($obj->time>$ldr->time){unset($ldr); $ldr=$obj;}; $bdy->$npk=$obj; unset($obj);
         };

         foreach($rps as $rpk => $rpv)
         {
            $obj=json_decode(json_encode($rpv));
            if(!$bdy->$rpk||($rpv->time>$bdy->$rpk->time)){$bdy->$rpk=$obj; if($obj->time>$ldr->time){unset($ldr); $ldr=$obj;}; continue;};
            if($rpv->time<$bdy->$rpk->time){continue;}; $bdy->$rpk->flag='XX';
         };

         $chk=exec::{"git merge-tree `git merge-base FETCH_HEAD $brn` FETCH_HEAD $brn"}($dir);
         $lst=expose($chk,"changed in both\n","\n+>>>>>>> .their");

         if($lst){foreach($lst as $i)
         {
            $p=("$dir/".rstub(stub($i,"\n")[0],' ')[2]); $x=expose($i,"\n@@ "," @@\n")[0]; $x=swap($x,['+','-'],'');
            $b=(stub($x,',')[0]*1); $x=swap($x,"$b,",''); $x=swap($x,' ',','); $x=json_decode("[$x]"); $x=(($x[1]-$x[0])-1);
            $l=($b+$x); $bdy->$p->fail=$l; $bdy->$p->flag='GC';
         }};

         $rsl=knob(['host'=>$src,'head'=>['purl'=>$dir,'fork'=>$brn,'diff'=>self::strife($dir),'lead'=>$ldr],'body'=>$bdy]);
         return $rsl;
      }


      static function survey($dir,$brn=null,$whr=NATIVE,$all=null,$raw=null)
      {
         if(!$brn||($raw===null)){$dir=repoOf($dir); if(!$dir){return;}; if(!$brn){$brn=isRepo($dir);}};
         if(($whr!==NATIVE)&&($whr!==ORIGIN)){fail('invalid arguments');}; $wht=(($whr===NATIVE)?' ':" origin/$brn ");
         $w=(($whr===NATIVE)?'N':'R');

         $d='<|>'; $x="git log{$wht}--name-status --date=raw --pretty=tformat:\"{$d}%H{$d}%ct{$d}%cn{$d}%ce{$d}%s{$d}\"";
         $k=['hash','time','user','mail','mesg']; $y=exec::{$x}($dir); $y="\n$y"; $y=swap($y,"\n$d","\n\n$d"); $y=swap($y,"$d\n\n","$d\n");
         $y=trim($y); $x=[]; $y=frag($y,"\n"); foreach($y as $yx => $yi)
         {
            if((!$all&&(span($yi,"\t.")>0))){continue;}; if(span($yi,"\t")>1){$yp=frag($yi,"\t"); $yi="D\t$yp[1]\nA\t$yp[2]";};
            if(isset($y[($yx+1)])&&isin($yi,$d)&&isin($y[($yx+1)],$d)){continue;}; $x[]=trim($yi,$d);
         };
         $y=implode("\n",$x); if($raw){return $y;}; $l=frag($y,"\n\n"); unset($x,$i,$yi); $r=knob();

         foreach($l as $i)
         {
            unset($x,$y,$o,$t); $x=frag($i,"\n"); $y=lpop($x); if(span($x)<1){continue;}; $y=frag($y,$d); $o=knob();
            foreach($k as $yi => $n){$v=$y[$yi]; if($n==='time'){$v=($v*1);}; $o->$n=$v;};
            foreach($x as $p)
            {
               $p=frag($p,"\t"); if(!isset($p[1])){continue;}; $s=($p[0].$w); $o->flag=$s; $p=swap(crop("$dir/$p[1]"),'/.gitkeep','');
               if($r->$p&&($r->$p->time<$o->time)){unset($r->$p);}; if($r->$p){continue;}; if(!isee($p)){continue;};
               $t=encode::jso($o); unset($o); $o=decode::jso($t); $r->$p=$o;
            };
         };

         return $r;
      }


      static function cloned($orgn,$trgt,$bran=null,$user=null)
      {
         expect::text($orgn,1); $orgn=swap($orgn,'file://',''); expect::path($trgt); $trgt=crop($trgt);
         $remo=pick($orgn,['https://','http://','git://','ftp://','ftps://']);
         if(!isWord($user)){$user=user('name');}; $u=$user; $p=isee("/User/data/$u");
         if(!$p){fail("user `$u` is undefined");}; $m=pget("$p/mail");

         if($remo)
         {
             $q="git clone $orgn ."; if($bran){$q="git clone -b $bran --single-branch $orgn .";};
             if(isin($remo,'http'))
             {
                 exec::{"$q"}($trgt);
             }
             else
             {
                 todo::{'repo.cloned'}("enable clone from remote protocol: `$remo`",FAIL);return;
             };
             exec::{"git config --local user.name \"$u\""}($trgt); exec::{"git config --local user.email \"$m\""}($trgt);
         }
         else
         {
             $orgn=crop($orgn); $cb=self::branch($orgn); if(!$cb){expect::repo($orgn);}; $nb=($bran?self::branch($orgn,$bran,1):$cb);
             if(isee($trgt)){expect::path($trgt,[D,E]);}else{path::make("$trgt/");}; $o=path($orgn); $t=path($trgt);
             exec::{"git clone -b $nb --single-branch $o ."}($t); exec::{'git remote rm origin'}($t); exec::{"git remote add origin $o"}($t);
             exec::{"git fetch --all"}($t); exec::{"git checkout $nb"}($t); exec::{"git branch --set-upstream-to origin/$nb"}($t);
             exec::{"git add --all"}($t);
             exec::{"git config --local user.name \"$u\""}($t); exec::{"git config --local user.email \"$m\""}($t);
             exec::{"git commit --allow-empty -m \"initial commit\""}($t); exec::{"git push origin $nb"}($t);
         };

         return OK;
      }


      static function ignore($h,$a,$i)
      {
         expect::repo($h); $h=rshave($h,'/'); $p="$h/.git/info/exclude"; if(!$h){$h='/';}; expect::path($p,[W,F]);
         if(($a!==write)&&($a!==erase)){fail('expecting 2nd arg as either :write: or :erase:');};
         expect::text($i,2); $r=pget($p); $q="\n$i";
         if((($a===write)&&isin($r,$q))||(($a===erase)&&!isin($r,$q))){return OK;}; // nothing to do
         if($a===write){$r.=$q;}else{$r=swap($r,$q,'');}; path::make($p,$r); // finish exclude
         $x=((($a===write)&&(substr($i,0,1)!=='!'))?"git rm --cached":"git add"); exec::{"$x $i"}($h);}; // update git tracking
         return OK;
      }


      static function commit($dir,$msg,$psh=null,$brn=null)
      {
         expect::repo($dir); if(isText($msg)){$msg=trim($msg);}; expect::text($msg,1); $msg=swap($msg,"'",'`');
         exec::{'git add --all'}($dir); exec::{"git commit --allow-empty -m '$msg'"}($dir); if(!$psh){return true;};
         if(!$brn){$brn=self::branch($dir);}elseif(!is_funnic($brn)){fail('invalid branch name');};
         exec::{"git pull origin $brn"}($dir); exec::{"git push origin $brn"}($dir); return true;
      }


      static function update($dir,$brn=null,$run='pull',$nic='origin')
      {
         expect::repo($dir); if(!$brn){$brn=self::branch($dir);}elseif(!is_funnic($brn)){fail::reference('invalid branch name');};
         exec::{"git $run $nic $brn"}($dir); return true;
      }


      static function strife($h,$f=null)
      {
         if($f){$h=repoOf($h); $b=self::branch($h); if(!$h||!$b){return;}; exec::{"git fetch origin $b"}($h);};
         $r=knob(['ahead'=>0,'behind'=>0]); $s=exec::{"git status -sb"}($h); $s=frag($s,"\n")[0];
         $s=expose($s,'[',']'); if($s){$r=decode::jso('{'.swap($s[0],['ahead ','behind '],['"ahead":','"behind":']).'}');};
         if(!$r->ahead){$r->ahead=0;}; if(!$r->behind){$r->behind=0;}; return $r;
      }


      private static function reflog($p,$y=null)
      {
         $r=knob(); $z=knob(); $t=trim(exec::{'git reflog'}($p)); $l=explode("\n",$t); $hi=($y==='HI'); if($hi){$y=null;};
         foreach($l as $i)
         {
            $x=expose($i,' HEAD@{','}: ')[0]; $fail=0; try{$h=exec::{'git rev-parse HEAD@{'.$x.'}'}($p);}catch(\Exception $e){$fail=1;};
            if($fail){continue;}; $h=trim($h); $idx=($hi?$h:$x); $p=stub($i,'}: ')[2]; $p=stub($p,': '); $c=$p[0]; $m=$p[2];
            if(strlen("$h")<1){continue;}; $r->$idx=knob(['indx'=>($x*1),'hash'=>$h,'exec'=>$c,'mesg'=>$m]);
         };
         unset($l,$i,$x); $l=keys($r); asort($l); foreach($l as $i){$z->$i=$r->$i;}; if($y===null){return $z;};
         $q=knob(); if($y==='>'){$y=rpop($l);}elseif($y==='<'){$y=lpop($l);}; return $z->$y;
      }
   }
# ---------------------------------------------------------------------------------------------------------------------------------------------
