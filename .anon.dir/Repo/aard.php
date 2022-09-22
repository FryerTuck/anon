<?
namespace Anon;



# tool :: Repo : repository tools .. only works with Git
# ---------------------------------------------------------------------------------------------------------------------------------------------
   class Repo
   {
      static $meta;


      static function create($dir,$ori,$bar=null,$usr=null)
      {
         if($ori===BARE){expect::path($dir); $ori="file://$dir"; $dir=null; $bar=BARE;}; // args validation
         expect::purl($ori); $inf=path::info($ori); $pth=$inf->path;  // args validation
         if(isWord($bar)&&!$usr){$usr="$bar"; $bar=null;}; // args validation
         if(!isWord($usr)){$usr='master';}; $eml=simp(pget("/User/data/$usr/mail"));
         if(!$eml){fail::config("user `$usr` is invalid");};

         if($inf->plug==='file')
         {
             if(!isee($pth)){path::make("$pth/");}; expect::path($pth,[R,W,D]);
             if(isFold($pth,E))
             {
                 $u=exec::{"whoami"}($pth);  $g=exec::{"id -gn"}($pth);  $tmp=('/tmp/'.random(16));
                 $y=exec::{"git init --bare --shared & mkdir $tmp"}($pth);
                 $y=exec::{"git config --local user.name \"$usr\""}($pth);
                 $y=exec::{"git config --local user.email \"$eml\""}($pth);
                 $y=exec::{"git --work-tree=$tmp checkout --orphan main"}($pth);
                 $y=exec::{"git --work-tree=$tmp commit --allow-empty -m \"initial commit\""}($pth);
                 if(file_exists("$tmp")){exec::{"rm -rf $tmp"}($pth);};
                 // exec::{"cp hooks/post-update.sample hooks/post-update"}($pth); // TODO for CI & CD
                 exec::{"chown -R $u:$g ."}($pth);
                 // exec::{"git update-server-info"}($pth);  // TODO :: push to this server via https?
             }
             elseif(!isee("$pth/info/exclude"))
             {fail::repo("expecting `$pth` as empty folder for a BARE git repo"); exit;};

             if($bar===BARE){return OK;};
         }
         elseif($inf->plug!=='https')
         {
             fail::repo("scheme `$inf->plug` is not supported .. yet"); exit;
         };

         if(!isee($dir)){path::make("$dir/");}; expect::path($dir,[R,W,D]); $fpo=path::purl($inf,1);
         if(fext($pth)!=='git'){fail::reference("invalid repo origin: `$ori`"); exit;}; // validation
         if(!isRepo($dir)){exec::{"git init ."}($dir);}; $xor=exec::{"git config --local --get remote.origin.url"}($dir);
         if($xor!==$ori){exec::{"git remote set-url origin $fpo"}($dir);}; exec::{"git add --all"}($dir);
         exec::{"git config --local user.name \"$usr\""}($dir); exec::{"git config --local user.email \"$eml\""}($dir);
         exec::{"git commit --allow-empty -m \"initial commit\""}($dir);

         return OK;
      }


      static function config($k,$v,$p='/')
      {
          expect::repo($p); $r=OK;
          try{exec::{"git config $k \"$v\""}($p);}catch(\Exception $e){$r=$e->getMessage();};
          return $r;
      }


      static function differ($rp='/',$rn='origin',$bn='main')
      {
          expect::repo($rp); expect::word($rn); expect::word($bn); $rd=null; $ph=md5($rp);
          try{$rd=exec::{"git fetch $rn $bn && git diff --name-only $bn $rn/$bn"}($rp);}catch(\Exception $e){};
          if(!$rd){return;}; $f=path::leaf(COREPATH); $rd=swap($rd,[COREPATH,ROOTPATH],'');
          $rd=trim(swap($rd,"$f/","$/")); if(span($rd)<1){return;}; // no file changes, no difference

          $gl=exec::{"git log -1 --oneline --decorate $rn/$bn"}($rp); $ch=0; // git-log .. fetch last line
          $lp=stub($gl,"("); if($lp){$ch=trim($lp[0]); $lp=rstub($gl,"origin/HEAD)");}; if(!$lp){return;};  // line-parts
          $cm=trim($lp[2]); $lh=pget("$/Repo/vars/pathHash/$ph"); // commit-message & last-hash
          if($lh===$ch){return;}; // hashes match, no difference
          $rd=knob(["mesg"=>$cm,"diff"=>$rd]);
          return $rd;
      }


      static function getURL($lp='/',$rn='origin',$cp=true)
      {
          expect::repo($lp); expect::word($rn);
          // $r=null; try{$r=exec::{"git remote get-url $rn"}($lp);}catch(\Exception $e){};
          $r=null; try{$r=exec::{"git config remote.$rn.url"}($lp);}catch(\Exception $e){};
          if($r&&$cp){$r=swap($r,[COREPATH,ROOTPATH],''); if(!$r){$r='/';};};
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
         if(!$deja){expect::repo($h);}; $r=exec::{'git config --local --get remote.origin.url'}($h);
         $r=swap($r,'file://',''); if(isPath($r)){$r=crop($r);}; if($r===''){$r='/';};
         return $r;
      }


      static function status($dir,$opt=null)
      {
         $argsHash = mash($dir,$opt);
         $tempPath = "$/Proc/temp/file/$argsHash";

         if (isee($tempPath)){ return knob($tempPath); };

         $dir=repoOf($dir);  $brn = self::branch($dir);
         if(!$dir){return;}; $src=self::origin($dir,1); $hst=HOSTNAME; $bdy=knob();
         if(!$opt){$opt=[NATIVE=>$brn,REMOTE=>$brn];}; if(isAsso($opt)){$opt=knob($opt,U);};

         if($opt===':HASH:')
         {
            $brn=isRepo($dir);
            $gl=exec::{"git log -1 --oneline --decorate origin/$brn"}($dir); $ch=null; // git-log .. fetch last line
            $lp=stub($gl,"("); if($lp){$ch=trim($lp[0]);};
            return $ch;
         };

         $optk=keys($opt); if(!isin($optk,'NATIVE')||!isin($optk,'REMOTE'))
         {fail::options("expecting 2nd argument as :asso: or :knob: with keys: NATIVE and REMOTE .. for branches");exit;};

         if(isin($src,['https://','http://']))
         {
            if(!online()){fail("`$hst` is offline");}; try{$x=exec::{"git ls-remote $src"}($dir);}catch(\Exception $e){$x=$e->getMessage();};
            $w=0; $eg="https://USER:PASS@example.com/repoName.git"; if(arg($x)->startsWith('fatal: '))
            {$w=(isin($x,['not read Username','not read Password'])?'forbidden':(isin($x,' not found')?'undefined':'missing'));};
            if($w){$x=''; if($w=='forbidden'){$x="\n\n>TIP :: set the username and password inside the origin URL like this: $eg";}};
            if($w){fail::repo("Repository at: $src is $w".$x);};
         };

         signal::dump("NOTIFY :: Repo : `[$dir@$brn]$ git fetch origin $opt->REMOTE`"); wait(60);
         $nps=self::survey($dir,$opt->NATIVE,NATIVE,0,0);
         // $erh=defail();
              exec::{"git fetch origin $opt->REMOTE"}($dir);
              $rps=self::survey($dir,$opt->REMOTE,REMOTE,0,0);
         // $erm=enfail($erh);
         // if ($erm)
         // {
         //     signal::dump("FAILED :: Repo : `git fetch origin $opt->REMOTE` returned:\n$erm");
         //     return;
         // };
         $ldr=null;

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


         try
         {
             $chk=exec::{"git merge-tree `git merge-base FETCH_HEAD $opt->NATIVE` FETCH_HEAD $opt->REMOTE"}($dir);
             $lst=expose($chk,"changed in both\n","\n+>>>>>>> .their");

             if($lst){foreach($lst as $i)
             {
                $p=("$dir/".rstub(stub($i,"\n")[0],' ')[2]); $x=expose($i,"\n@@ "," @@\n")[0]; $x=swap($x,['+','-'],'');
                $b=(stub($x,',')[0]*1); $x=swap($x,"$b,",''); $x=swap($x,' ',','); $x=json_decode("[$x]"); $x=(($x[1]-$x[0])-1);
                $l=($b+$x); $bdy->$p->fail=$l; $bdy->$p->flag='GC';
             }};
         }
         catch(\Exception $e){ };

         $rsl=knob(['host'=>$src,'head'=>['purl'=>$dir,'fork'=>$opt->NATIVE,'diff'=>self::strife($dir),'lead'=>$ldr],'body'=>$bdy]);
         path::make($tempPath, tval($rsl));
         return $rsl;
      }


      static function survey($dir,$brn=null,$whr=NATIVE,$all=null,$raw=null)
      {
         if(!$brn||($raw===null)){$dir=repoOf($dir); if(!$dir){return;}; if(!$brn){$brn=self::branch($dir);}};
         if(($whr!==NATIVE)&&($whr!==REMOTE)){fail('invalid arguments');};
         $wht=(($whr===NATIVE)?' ':" origin ");
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
         expect::purl($orgn); $info=path::info($orgn); if($info->plug==="file"){$orgn=path::purl($info,1);};
         if(!isWord($user)){$user=user('name');}; $u=$user; $p=isee("/User/data/$u");
         if(!$p){fail("user `$u` is undefined");}; $m=simp(pget("$p/mail"));
         if(!isee($trgt)){path::make("$trgt/");}; expect::fold($trgt,[R,W,E]);
         signal::dump("cloning repo `$orgn` into: $trgt");
         $q="git clone $orgn ."; if($bran){$q="git clone -b $bran --single-branch $orgn .";};
         exec::{"$q"}($trgt); $t=path($trgt); $cb=self::branch($trgt,$bran,1); if(!$cb){expect::repo($trgt);};
         exec::{'git config --local pack.windowMemory "10m"'}($trgt); // memory handling
         exec::{'git config --local pack.packSizeLimit "20m"'}($trgt); // memory handling
         exec::{"git config --local user.name \"$u\""}($t); exec::{"git config --local user.email \"$m\""}($t);
         $nb=(!$cb?"main":$cb);

         if($info->plug==="file")
         {
             $orgn=crop($info->path);
             // exec::{'git remote rm origin'}($t); exec::{"git remote add origin $o"}($t);
             exec::{"git pull"}($t);
             // exec::{"git checkout $nb"}($t);
             exec::{"git branch --set-upstream-to origin/$nb"}($t);
             exec::{"git add --all"}($t);
             exec::{"git commit --allow-empty -m \"initial commit\""}($t); exec::{"git push origin $nb"}($t);
         };

         return OK;
      }


      static function ignore($h,$a,$i)
      {
         // $omit = conf("Repo/runIgnor");
         // if ($omit !== true){ return OK; };
         if(isNuma($i)){foreach($i as $r){$z=self::ignore($h,$a,$r);}; return $z;}; // bulk rules
         expect::repo($h); $h=rshave($h,'/'); $p="$h/.git/info/exclude"; if(!$h){$h='/';}; expect::path($p,[W,F]);
         if(($a!==write)&&($a!==erase)){fail('expecting 2nd arg as either :write: or :erase:');};
         $i=trim($i); if(!isText($i,1)){return;}; $n=$i[0]; if($n==='!'){$i=substr($i,1);}else{$n='';}; // negated
         $i=lshave($i,'/'); if(arg($i)->startsWith('$/')){$i=stub($i,'/')[2]; $i=".anon.dir/$i";};
         $i=trim($i); if(!isText($i,1)){return;}; $i=($n.$i); $r=pget($p); $q="\n$i";
         if((($a===write)&&!isin($r,$q))||(($a===erase)&&isin($r,$q)))
         {
             signal::dump("$a ignore-rule: `$i` in: `$h`");
             if($a===write){$r.=$q;}else{$r=swap($r,$q,'');}; path::make($p,$r); // finish exclude
         };
         $c=frst($i); $i=lshave($i,'!'); $ig=((($a===write)&&($c!=='!'))?1:0); $l=scan($i); unset($p);
         set_time_limit(360); // all this may take a while, depending on size/complexity
         foreach($l as $p) // update git tracking
         {
             if(!isee("$h/$p")){continue;};
             if($ig)
             {
                 if(isFold("$h/$p")){$x="git rm -r --cached $p";}
                 else{$x="git rm --cached $p";};
             }
             else
             {
                 if(isFold("$h/$p")){$x="git add $p/*";}
                 else{$x="git add $p";};
             };
             // signal::dump("running: `$x` in: `$h`"); wait(150);
             try{exec::{$x}($h);}catch(\Exception $e){}; wait(10);
         };
         self::commit($h,"updated ignore rule: $i");
         return OK;
      }


      static function commit($dir,$msg,$psh=null,$brn=null)
      {
         expect::repo($dir); if(isText($msg)){$msg=trim($msg);}; expect::text($msg,1); $msg=swap($msg,'"',"`");
         exec::{'git add --all'}($dir); exec::{"git commit --allow-empty -m \"$msg\""}($dir);
         $hsh=exec::{'git rev-parse --short HEAD'}($dir);
         if(!$psh){return $hsh;}; // no pushing!

         exec::{"git repack -a -d -f --window=0"}($dir); // repair if needed
         exec::{"git fsck"}($dir); // repair if needed
         try{exec::{"git gc"}($dir);}catch(\Exception $e){}; // repair if needed .. shut up on fail
         if(!$brn){$brn=self::branch($dir);}elseif(!is_funnic($brn)){fail('invalid branch name');};
         signal::dump("repo update: `$dir` .. push origin $brn");
         exec::{"git pull origin $brn"}($dir);
         exec::{"git push origin $brn"}($dir);
         return $hsh;
      }


      static function update($dir,$brn=null,$run='pull',$nic='origin')
      {
         expect::repo($dir); if(isin($brn,['pull','push'])){$run="$brn"; $brn=null;};
         if(!$brn){$brn=self::branch($dir);};
         signal::dump("repo update: `$dir` .. $run $nic $brn");
         exec::{'git add --all'}($dir); exec::{"git commit --allow-empty -m \"$run $nic\""}($dir);
         exec::{"git repack -a -d -f --window=0"}($dir); // repair if needed
         exec::{"git fsck"}($dir); // repair if needed
         try{exec::{"git gc"}($dir);}catch(\Exception $e){}; // repair if needed .. shut up on fail
         if($run==='push'){exec::{"git pull origin $brn"}($dir);};
         exec::{"git $run $nic $brn"}($dir); $ph=md5($dir); $ch=self::status($dir,':HASH:');
         if(!$ch){fail::repo("could not get hash-reference from: $dir");exit;};
         path::make("$/Repo/vars/pathHash/$ph",$ch); // make this hash the last hash to check next time
         return true;
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
