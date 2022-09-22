<?
namespace Anon;


# tool :: git_plug : git abstraction
# ---------------------------------------------------------------------------------------------------------------------------------------------
   class git_plug
   {
      private $mean=null;
      private $link=null;


      function __construct($x)
      {
         // if(($x->plug==='git')&&($x->user)&&isFold("$x->path")){};
         $this->mean=$x;
         // emit($x);
      }


      function __destruct()
      {
         $this->pacify();
      }


      function __call($n,$a)
      {
         return call($this->$n,$a);
      }


      function status()
      {
         $r=tron(['code'=>null,'fork'=>null,'head'=>['index'=>0,'ahead'=>0,'behind'=>0],'body'=>null]); $L=$this->link;
         if($L){$r->code=200; $r->fork=$L->forkName; $r->head=$L->position; $L->body=$L->pathInfo; return $r;};
         $plug=$this->mean->plug; $purl=$this->mean->purl; $path=$this->mean->path;

         if(isin($plug,'http'))
         {
            if(!online()){$r->code=502;}else
            {
               try{$x=exec::{"git ls-remote $purl"}();}catch(\Exception $e){$x=$e->getMessage();};
               if(!isin($x,'fatal: ')){$r->code=200;}else{$r->code=(isin($x,'not read Password')?401:(isin($x,' not found')?501:404));};
            };
         }
         elseif(isin(['git','file'],$plug))
         {
            $c=path::code($path); if($c!==200){$r->code=$c;}elseif(!isRepo($path)){$r->code=501;}else
            {try{$x=exec::{"git branch"}($path);}catch(\Exception $e){$x=null;}; $r->code=((!$x||!isin($x,'main'))?501:200);};
         }
         else{$r->code=417;};

         if(($r->code!==200)||isin($plug,'http')){return $r;}; $h=$path; $r->fork=exec::{'git rev-parse --abbrev-ref HEAD'}($h);
         exec::{'git gc --auto'}($h); $hr=$this->reflog($h,'>'); $r->head->index=$hr->indx; $r->head->commit=$hr->hash; $posi=$hr->indx;
         exec::{'git add --all'}($h); try{exec::{'git commit -am "auto"'}($h);}catch(\Exception $e){};

         $nl=$this->summon($h,'N'); exec::{"git fetch --all"}($h); $x=$this->strife($h);

         $b=$r->fork; $ah=$x->ahead; $bh=$x->behind; $r->head->ahead=$ah; $r->head->behind=$bh; $rt='';
         if($ah||$bh)
         {
            $rt=exec::{"git merge origin/$b $b"}($h); $hr=$this->reflog($h,'>'); $r->head->index=$hr->indx; $r->head->commit=$hr->hash;

            unset($l,$i); $rl=$this->summon($h,'R');
            foreach($rl as $rp => $rd){if((!$nl->$rp)||($rd->time>$nl->$rp->time))
            {$nl->$rp=$rd; };};
            // foreach($nl as $np => $nd){if((!$rl->$np)||(($nd->time>=$rl->$np->time)&&$nd->mail===$rl->$np->mail)){$rl->$np=$nd;};};

            $l=expose($rt,'CONFLICT (content): Merge conflict in ',"\n");
            if($l){foreach($l as $i){$y=path::line("$h/$i",'<<<<<<<','======='); $rl->{"/$i"}->fail=$y;}};
         };
         try{exec::{"git revert HEAD@{".$posi."}"}($h);}catch(\Exception $e){};
         // $r->body=tron(); foreach($nl as $np => $nd){if($np->stat==='DN'){}};
         $r->body=$nl; return $r;
      }


      function strife($p)
      {
         $r=tron(['ahead'=>0,'behind'=>0]); $s=exec::{"git status -sb"}($p); $s=frag($s,"\n")[0]; $s=expose($s,'[',']');
         if($s){$r=decode::jso('{'.swap($s[0],['ahead ','behind '],['"ahead":','"behind":']).'}');};
         if(!$r->ahead){$r->ahead=0;}; if(!$r->behind){$r->behind=0;}; return $r;
      }


      function reflog($p,$y=null)
      {
         $r=tron(); $t=trim(exec::{'git reflog'}($p)); $l=explode("\n",$t);
         foreach($l as $i){$x=expose($i,' HEAD@{','}: ')[0]; $h=trim(exec::{'git rev-parse HEAD@{'.$x.'}'}($p)); $r->$x=$h;};
         $z=tron(); unset($l,$i,$x); $l=keys($r); asort($l); foreach($l as $i){$z->$i=$r->$i;}; if($y===null){return $z;};
         $q=tron(); if($y==='>'){$y=rpop($l);}elseif($y==='<'){$y=lpop($l);}; $q->indx=$y; $q->hash=$z->$y; return $q;
      }


      function summon($h,$w)
      {
         $d='<|>'; $l=frag((exec::{"git log --name-status --date=raw --pretty=tformat:\"{$d}%H{$d}%ct{$d}%cn{$d}%ce{$d}%s{$d}\""}($h)),"\n{$d}");
         $k=['hash','time','user','mail','mesg','stat','path']; $r=tron(); foreach($l as $i)
         {
            $i=frag(trim($i,$d),$d); if(!isset($i[5])){continue;}; $s=trim($i[5]);$i[5]=$s[0]; $i[]=("/".trim(substr($s,1))); unset($o,$x);
            $o=tron(); foreach($k as $x => $n){$v=$i[$x]; if($n==='time'){$v=($v*1);}; $o->$n=$v;}; $o->path=swap($o->path,'/.gitkeep','');
            $p=$o->path; $o->type=path::type("$h/$p"); $o->size=path::size("$h/$p"); $o->stat=($o->stat.$w); $o->fail='';
            if(!$r->$p||($r->$p->time<$o->time)){$r->$p=$o;};
         };
         return $r;
      }


      function exists($o=null,$s=null)
      {
         if($this->link){return true;}; if($s===null){$s=$this->status();}; if($s!==200){return false;};
         $r=(isin($this->mean->plug,'http')?REMOTE:NATIVE); return (($o===null)?$r:($r===$o));
      }


      function deploy($d,$b='main')
      {
         $i=$this->mean; $p=$i->purl; if(isin($p,'file:')||isin($p,'git:')){$p=path($i->path);}; $s=$this->status()->code;
         if($s!==200){$s=conf('c0r3/stat')->$s; fail("`$p` is $s");}; $d=crop(path($d)); if(!$d){fail('invalid destination');};
         if(!exists($d)){path::make($d,FOLD);}; expect::{'path:E,W,D'}($d); $u=USERNAME; $m=USERMAIL;
         // exec::{"git clone -b $b --single-branch $p ."}($d);
         exec::{"git clone $p ."}($d); exec::{'git remote rm origin'}($d); exec::{"git remote add origin $p"}($d);
         exec::{"git fetch --all"}($d); $l=exec::{'git branch'}($d); if(!isin($l,'main')){fail("missing main branch in `$p`");};
         exec::{"git config user.name \"$u\""}($d);
         exec::{"git checkout -b $b"}($d); exec::{"git branch --set-upstream-to origin/$b"}($d);
         $x="$d/.git/.anon"; path::make($x,FOLD); path::copy('/c0r3/lib/data/repo.php',"$x/cols.php");
         $this->mean=path::info($d); return "git::$d";
      }


      function vivify()
      {
         if($this->link){return $this->link;}; $i=$this->mean; $p=$i->path; $s=$this->status(); $x=$this->exists(null,$s->code); $H=HOSTNAME;
         if($x!==NATIVE){$s=conf('c0r3/stat')->{$s->code}; $m=(!$x?"is $s":'has not been deployed locally'); fail("repo `$i->purl` $m");};
         $L=tron(); $L->repoPurl=exec::{'git config --get remote.origin.url'}($p); if(!$L->repoPurl){$L->repoPurl="file://$H{$p}";};
         $L->repoPath=$p; $L->repoData=('sqlite://'.swap("$H{$p}/.git/.anon",'//','/')); $L->forkName=$s->fork; $L->forkList=[];
         $l=frag(exec::{'git branch'}($p),"\n"); foreach($l as $i){$i=trim(ltrim(trim($i),'*')); if($i){$L->forkList[]=$i;}};
         $L->position=$s->head; $L->pathInfo=$s->body; $this->link=$L; $ah=$s->head->ahead; $bh=$s->head->behind; $h=$p; unset($p,$i);
         if(!$ah&&!$bh){return $this->link;}; $b=$s->fork; $l=path::scan($h,TUPL,DEEP); $C=target($L->repoData); $C->vivify();
         $d=$C->select([using=>$b,fetch=>['path','time']]); $pi=$s->body; $has=tron();
         foreach($d as $o){$p=$o->path; if(!isin($l,$p)){$C->delete([using=>$b,where=>"path = $p"]);}else{$has->$p=$o->time;};};
         foreach($l as $i){$i=swap($i,$h,''); $i=swap($i,'/.gitkeep',''); $o=$pi->$i; if(!$o){fail("missing commit for `$i`");};
         $x=$has->$i; if(!$x){$C->insert([using=>$b,write=>$o]);}elseif($x<$o->time){$C->update([using=>$b,where=>"path = $i",write=>$o]);}};
         return $this->link;
      }


      function pacify()
      {
         if(!$this->link){return;};
         // if(!$this->link->isNative){path::void($this->link->diskPath);};
         $this->link=null;
      }


      function adjure($x,$e=null)
      {
         $q=$x; if(is_string($q)){$q=trim($x); if(strpos($q,'git ')===0){$q=ltrim($q,'git ');}}; expect::{'text:1'}($q); $L=$this->vivify();
         $p=$L->repoPath; $r=null; $f=null; try{$r=exec::{"git $x"}($p);}catch(\Exception $e){$f=$e->getMessage();}; if(!$f){return $r;};
         if(!$e){fail($f);}; return $f;
      }


      function create()
      {
         $i=$this->mean; $p=$i->path; if(!exists($p)){path::make($p,FOLD);}; expect::{'path:W,D'}($p); exec::{'git init'}($p);
         if($p==='/'){$y="$p/.git/info/exclude"; $x=path::scan($y); $x.="\n/.an0nbas3/\n/.auto.php\n/.htaccess"; path::make($y,$x,FILE);};
         $u=USERNAME; $m=USERMAIL; exec::{"git config --local user.email \"$m\""}($p); exec::{"git config --local user.name \"$u\""}($p);
         $c='git commit --allow-empty -m "init"'; exec::{$c}($p); exec::{'git checkout -b tanker'}($p); exec::{'git checkout master'}($p);
         // $x="$p/.git/.anon"; path::make($x,FOLD); path::copy('/c0r3/lib/repo/cols.php',"$x/cols.php");
         $this->mean=path::info($p); $L=$this->vivify(); return $L;
      }


      function descry($b=null)
      {
         emit('ello fro git_crud->descry');
      }


      function select($q)
      {
         $L=$this->vivify(); $b=$L->forkName; if(isScal($q)){if(!isset($q[using])){$q[using]=$b;}}
         elseif(isTron($q)){if(!$q->using){$q->using=$b;}}; $r=target($L->repoData)->select($q); return $r;
      }


      function update($q=NATIVE)
      {

      }
   }
# ---------------------------------------------------------------------------------------------------------------------------------------------
