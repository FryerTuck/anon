<?
namespace Anon;


# tool :: sqlite_plug : embedded database abstraction
# ---------------------------------------------------------------------------------------------------------------------------------------------
   class sqlite_plug
   {
      public $info=null;
      public $mean=null;
      private $link=null;
      private $vars=null;


      function __construct($x)
      {
         $this->vars=knob(); $this->info=knob(['maxLevel'=>2]); $m=$x->meta;
         $s=stub($m->path,'.sdb'); if($s){$m->path=($s[2]); $m->base=($m->base.$s[0].'.sdb');}; unset($s);

         if(!isee($m->base)||fext($m->base)!=='sdb')
         {
             $m->base=($m->base.(isFold($m->base)?'/base.sdb':((fext($m->base)!=='sdb')?'.sdb':'')));
             $x->meta=$m;
         };

         $h=path::twig($m->base); if(!isee($h)){path::make("$h/");}; $x->mime='application/sql'; $x->path=$m->path;
         $this->mean=$x; if(!isee($m->base)||(path::size($m->base)<1)){$this->create();}; unset($x);

         $x=['table','field']; $l=$m->levl;
         if($l>$this->info->maxLevel){fail::database('path-depth unreachable');exit;};
         $this->mean->levl=$l; $p=shaved($m->path,'/'); $r=knob();
         if(!$p){$r->basis="dbase"; $r->dbase=path::leaf($m->base);}
         else{$p=frag($p,'/'); foreach($p as $k => $v){$r->{$x[$k]}=$v; $r->basis=$x[$k];}};

         $this->mean->refs=$r; if($l<2){return;};

         // $b=$r->dbase; $t="$r->table"; $q="STATUS where Db = '$b' AND Name = '$t'"; $sp=$this->adjure("SHOW PROCEDURE $q");
         // if(span($sp<1)){$sp=0;}; $fn=$this->adjure("SHOW FUNCTION $q"); if(span($fn<1)){$fn=0;}; if(!$sp&&!$fn){return;};
         // $z=($sp?'sproc':'funct'); unset($r->table); $r->$z=$t; $r->basis=$z; $this->mean->refs=$r; $this->mean->mime='application/sql';
      }


      function __destruct()
      {
         $this->pacify();
      }


      function __call($n,$a)
      {
         return call($this->$n,$a);
      }


      function vivify()
      {
         if($this->link!==null){return $this->link;}; $p=$this->mean->meta->base;
         if(!isFile($p)||(path::size($p)<1)){$this->create();};
         if(isFold($p)&&isFile("$p/base.sdb")){$p="$p/base.sdb";};
         // $this->link=(new \SQLite3($p, SQLITE3_OPEN_CREATE | SQLITE3_OPEN_READWRITE));
         lock::awaits($p);
         try{$this->link=(new \SQLite3(path($p), SQLITE3_OPEN_READWRITE));}
         catch(\Exception $e)
         {lock::remove($p); $f=$e->getMessage(); fail::database("$f\n\ntried to vivify: $p"); exit;};
         lock::remove($p);
         $this->link->busyTimeout(6); $this->link->enableExceptions(true);
         return $this->link;
      }


      function pacify()
      {
         if($this->link===null){return true;}; $this->link->close(); $p=$this->mean->meta->base;
         lock::remove($p); //unset($this->vars->deja->$p);
         $this->link=null; return true;
      }


      function create($d=null)
      {
         $i=$this->mean; $p=$i->meta->base; if(isFile($p)&&(path::size($p)>0)){return;};
         if(!lock::exists($p)){lock::awaits($p);}; // lock it .. just incase
         $h=path::twig($p); signal::dump("creating new SQLite database: $p");
         try{$l=(new \SQLite3(path($p), SQLITE3_OPEN_CREATE | SQLITE3_OPEN_READWRITE));}
         catch(\Exception $e){$m=$e->getMessage(); lock::remove($p); fail::plug("$m .. `$p`"); exit;};
         if(!isee($p)){$l->close(); lock::remove($p); fail::database("unable to create file: `$p`"); exit;};
         if(!$d&&isee("$h/defn.php")){$d=import("$h/defn.php");}; if(isAssa($d)){$d=knob($d);};
         $l->close(); wait(10); lock::remove($p);
         if(!isKnob($d,1)){signal::dump("no database definition specified for: $p"); wait(150); return true;};
         $this->link=(new \SQLite3(path($p), SQLITE3_OPEN_READWRITE));
         $l=$this->link; $tl=keys($this->descry('*'));
         signal::dump("populating new SQLite database: $p"); wait(150);

         foreach($d as $tn => $td)
         {
            if(!isWord($tn)){$this->pacify(); fail::database("invalid table-name `$tn`");}; if(isin($tl,$tn)){continue;};
            if(!isKnob($td->cols)){$this->pacify(); fail::database("invalid table definition .. expeciting `cols` as object"); exit;};
            $cl=[]; foreach($td->cols as $cn => $cd)
            {
                if(!isWord($cn)){$this->pacify(); fail::database("invalid column name `$cn`"); exit;};
                radd($cl,"$cn $cd");
            };
            $cl=implode(', ',$cl); $l->exec("CREATE TABLE $tn ($cl);\n"); if(!$td->rows){continue;};
            if(!isNuma($td->rows)){$this->pacify(); fail::database('invalid rows definition .. expecting `rows` as numeric-key-array .. or not-defined at all');};
            $this->insert([using=>$tn,write=>$td->rows]);
            // todo::{'sqlite plug'}("upon `create`, if `rows` are defined, insert them",FAIL);
         };

         $this->pacify(); wait(10); return true;
      }


      function adjure($q,$b=[],$l=null,$rt=null)
      {
         if(is_string($q)){$q=trim($q); $q=trim($q,';'); $q.=';';};
         if(!isText($q,10)){$q=tval($q); fail("invalid SQL, query used:\n`$q`\n"); exit;};
         // signal::dump("running SQLite query: $q");
         $a=strtoupper(stub($q,' ')[0]); $l=(($this->link===null)?0:1);
         $c=($l?$this->link:$this->vivify());

         if(isin(['SELECT','INSERT','UPDATE','DELETE','PRAGMA'],$a))
         {
            $eh=defail();
            try{$x=$c->prepare($q);}catch(\Exception $f)
            {
               $m=$f->getMessage();
               if(isin($m,'Unable to prepare statement: 5, database is locked'))
               {$p=$this->mean->path; $m="database `$p` is locked";};
               enfail($eh,1); fail::database("$m\n\nQUERY:\n$q"); exit;
            };
            $et=enfail($eh,1);

            if($et)
            {
                if(!$rt&&isin($et,"not been correctly initialised"))
                {$c->close(); $this->pacify(); wait(250); $z=$this->adjure($q,$b,null,1); return $z;};
                fail::database("$et\n\nQUERY:\n$q"); exit;
            };

            foreach($b as $k => $v){$x->bindValue($k,$v);};
            $er=''; $mn=$this->mean; do
            {
               $r=$x->execute(); $f=($c->lastErrorCode()?lowerCase($c->lastErrorMsg()):null);
               if($f){if(isin($f,'lock')){wait(50);}else
               {$er="$f ..\nPATH: `$mn->path`\nBASE: `$mn->base`\nEXEC: `$q`"; $f=null;}};
            }while($f);

            if($er){fail::database($er);exit;};

            if($a==='SELECT')
            {
               $n=$r->numColumns(); if($n<1){$this->pacify(); return [];};
               $z=[]; while($i=$r->fetchArray(SQLITE3_ASSOC)){$z[]=knob($i);};
               if(!$l){$this->pacify();}; return $z;
            };

            if($a==='INSERT'){$z=knob(['deed'=>$a,'done'=>$c->changes(),'last'=>$c->lastInsertRowID()]);if(!$l){$this->pacify();}; return $z;};
            if(($a==='UPDATE')||($a==='DELETE')){$z=knob(['deed'=>$a,'done'=>$c->changes()]); if(!$l){$this->pacify();}; return $z;};
            if($a==='PRAGMA'){$z=[]; while($i=$r->fetchArray(SQLITE3_ASSOC)){$z[]=knob($i,V);}; if(!$l){$this->pacify();}; return $z;};
         };

         if(!$l){$this->pacify();}; return true;
      }


      function descry($x='*')
      {
         $y=(!$this->link?1:0);
         if(isWord($x))
         {
            $this->mean->tabl=$x;
            $this->vivify(); $i=$this->adjure("PRAGMA table_info('$x')"); if(count($i)<1){$this->pacify(); return;};
            $n=$this->adjure("SELECT COUNT(rowid) AS 'rows' FROM $x"); $n=$n[0]->rows; $c=knob();
            $l=$this->adjure("SELECT rowid AS 'last' FROM $x ORDER BY rowid DESC LIMIT 1"); $l=((count($l)>0)?$l[0]->last:0);
            foreach($i as $k => $v)
            {
               $c->{$v->name}=knob
               ([
                  'name'=>$v->name,'type'=>$v->type,'pkey'=>($v->pk?true:false),
                  'ordr'=>$v->cid,'dflt'=>$v->dflt_value,'null'=>($v->notnull?false:true)
               ]);
            };

            if($y){$this->pacify();}; return knob(['name'=>$x,'cols'=>$c,'rows'=>$n,'lrid'=>$l]);
         };

         if($x==='*')
         {
            $this->vivify(); $l=$this->adjure("SELECT name AS 'table' FROM sqlite_master WHERE type='table'");
            $r=knob(); foreach($l as $i){$r->{$i->table}=$this->descry($i->table);};
            if($y){$this->pacify();}; return $r;
         }
      }


      function exists()
      {
         $a=func_get_args(); if(isset($a[0])&&isNuma($a[0])){$a=$a[0];}; $s=span($a); $f=[]; $p=path($this->mean->path);
         $e=isFile($p); if(!$e){return false;}; if($s<1){return true;}; if(($s>0)&&(filesize($p)<2)){return false;};
         $this->vivify(); $e=0; foreach($a as $i)
         {$i=explode(':',$i); $t=$i[0]; $c=(isset($i[1])?$i[1]:0); $d=$this->descry($t); if(!$d){continue;}; $e+=(!$c?1:($d->cols->$c?1:0));};
         $this->pacify(); return ($s===$e);
      }


      function insert($x,$t=null)
      {
         if(!$t)
         {
            $xr = $this->mean->refs;
            if(isAssa($x)){$x=knob($x,U);}; if(!isKnob($x)){fail("expecting :assa: or :knob: but given: ".tval($x));};
            if(!$x->using && ($xr->basis=="table")){$x->using = $xr->table;};
            if(!isWord($x->using)){fail('expecting `using` as :word:');}; $t=$x->using; if(!$this->link){$this->vivify();};
            $z=knob(['deed'=>'INSERT','done'=>0,'last'=>0]); $w=$x->write; if(span($w)<1){return $z;};
            if(isNuma($w)&&!isNuma($w[0])&&!isAssa($w[0])&&!isKnob($w[0])){$w=[$w];};
            if(!isNuma($w)){$w=[$w];}; $this->mean->tabl=$t;
            if(isNuma($w) && isKnob($w[0])){ $l=keys($w[0]); }
            else{ $d=$this->descry($t); if(!$d){fail("table `$t` is undefined");}; $l=keys($d->cols); };
            $this->{":$t:"}=$l;
            foreach($w as $i){$r=$this->insert($i,$t); $z->done++; $z->last=$r->last;};
            $this->pacify(); return $z;
         }

         if(isNuma($x))
         {
            $c=$this->{":$t:"}; $y=knob(); foreach($c as $k => $v){$y->$v=(isset($x[$k])?$x[$k]:'');}; $x=$y;
         };

         $ref=[]; $k=keys($x); $v=vals($x); $c=fuse($k,', '); $sql="INSERT INTO $t ($c) VALUES"; foreach($v as $vk => $vv)
         {$n=($k[$vk]); if(!isText($vv)&&!isNumr($vv)){$vv=tval($vv);}; $vr=":{$n}_write"; $ref[$vr]=$vv; $v[$vk]=$vr;};
         $v=fuse($v,', '); $sql.=" ($v)";
         $r=$this->adjure($sql,$ref); if($r){return $r;}; return knob(['done'=>0,'last'=>0]);
      }



      function select($x='*',$tre=null)
      {
         $inf=$this->mean; $lvl=$inf->levl; $rfs=$inf->refs; $tpe=$rfs->basis; $ref=$rfs->$tpe;

         if(($x==='*')&&($tre===TREE))
         {
            if($tpe==='dbase')
            {
               $r=$this->adjure("SELECT name AS 'table' FROM sqlite_master WHERE type = 'table'");
               $z=padded(unbury($r,"table"),'table::','');
               return $z;
            };

            if($tpe==='table')
            {
               $z=padded(unbury($this->adjure("PRAGMA table_info('$ref')"),'name'),'field::',''); return $z;
            };

            if(($tpe==='sproc')||($tpe==='funct'))
            {
               $nic=$rfs->$tpe; $ucw=(($tpe==='sproc')?'PROCEDURE':'FUNCTION'); $pcw=proprCase($ucw);
               $z=$this->adjure("SHOW CREATE $ucw $nic")[0]->{"Create $pcw"}; return $z;
            };

            if($tpe==='field')
            {
               $z=$this->adjure("SELECT $rfs->field FROM $rfs->table"); return $z;
            };
         };


         if($x==='*'){return $this->descry();}; $ref=[]; $q=(isAssa($x)?knob($x,U):knob($x)); $x=null; $alt=[]; $tbl='';
         if(!isKnob($q)){fail('expecting :assa: or :knob:');}; $sql='SELECT '; $opr=padded((explode(' ',EXPROPER)),' ');
         if(!$q->using&&($tpe==='table')){$q->using=$rfs->$tpe;};
         if($q->using&&is_string($q->using)){$q->using=[$q->using];};
         if($q->count&&is_string($q->count)){$q->count=[$q->count];};
         if($q->fetch&&is_string($q->fetch)){$q->fetch=[$q->fetch];};
         if($q->where&&is_string($q->where)){$q->where=[$q->where];};

         if(isin($q,'parse')){if(!$q->parse){$this->parsed=false;}};

         if($q->count){$x=$q->count; foreach($x as $k => $v){$x[$k]=swap($v,':',' AS ');}; $sql.=fuse($x,', '); unset($x,$k,$v);};

         if($q->alter)
         {
            $a=$q->alter; if(isText($a)){$a=[$a];}; if(!isNuma($a)){fail('expecting `alter` as :text: or :numa:');};
            foreach($a as $i){if(!pick($i,[':','@','.'],XACT)){fail('invalid alter expression');}; $i=explode(':',$i); $alt[$i[0]]=$i[1];};
         };

         if($q->fetch)
         {
            if((span($q->fetch)===1)&&($q->fetch[0]==='*')&&(span($q->using)===1))
            {
               unset($q->fetch); $cols=$this->descry($q->using[0]); $q->fetch=keys($cols->cols);
            };
            $x=$q->fetch; foreach($x as $k => $v)
            {
               // if(isin($v,':')){$zoo=$v;};
               // if(pick($v,[':','@','.'],XACT)){$v=explode(':',$v); $alt[(isset($v[2])?$v[2]:$v[0])]=$v[1];unset($v[1]);$v=fuse($v,':');};
               $x[$k]=swap($v,':',' AS ');
            };
            $sql.=fuse($x,', '); unset($x,$k,$v);
         };

         if($q->using)
         {
            $x=$q->using; $tbl=fuse($x,', '); $this->mean->tabl=$tbl; foreach($x as $k => $v){$x[$k]=swap($v,':',' AS ');};
            $sql.=" FROM $tbl"; unset($x,$k,$v);
         };

         if($q->where)
         {
            foreach($q->where as $k => $v)
            {
               $o=stub($v,$opr); if(!$o||(strlen($o[0])<1)||(strlen($o[2])<1)){fail('invalid `where` expression');}; $l=trim($o[0]);
               $r=trim($o[2]); $o=$o[1]; if(($o===' ~ ')&&(($r[0]==='*')||(substr($r,-1,1)==='*'))){$o=' LIKE ';$r=swap($r,'*','%');};
               $x=":{$l}_where"; $ref["$x"]=unwrap($r); $q->where[$k]="{$l}{$o}{$x}";
            };
            $sql.=(' WHERE '.fuse($q->where,' AND ')); unset($x,$k,$v);
         };

         if($q->group){$x=$q->group; $sql.=" GROUP BY $x";};
         if($q->order){$x=$q->order; $p=explode(':',$x); $p[1]=((isset($p[1])&&($p[1]==='ASC'))?'ASC':'DESC'); $sql.=" ORDER BY $p[0] $p[1]";};
         if($q->limit){$x=$q->limit; $sql.=" LIMIT $x";}; $sql.=";"; $this->vivify();

         $r=$this->adjure($sql,$ref); unset($i,$t,$c,$f,$a,$k,$v,$x,$y,$z,$sql); if(count($r)<1){$this->pacify(); return $r;};
         if(count($alt)>0)
         {
            foreach($r as $k => $v)
            {
               foreach($alt as $a => $i)
               {
                  if(!strpos($i,'@')||!strpos($i,'.')||($v->$a===null)){continue;}; $i=explode('@',$i); $f=$i[0]; $i=explode('.',$i[1]);
                  $t=$i[0]; $c=$i[1]; if(!isWord($f)||!isWord($t)||!isWord($c)){fail('invalid sub-query');}; $x=$v->$a; if(!isNuma($x)){$x=[$x];};
                  $z=[]; foreach($x as $y)
                  {
                     if(!isNumr($y)){$y=("'".tval($y)."'");}; $sql="SELECT $f FROM $t where $c = $y LIMIT 1"; $rsl=$this->adjure($sql);
                     if(count($rsl)<1){continue;}; $z[]=$rsl[0]->$f;
                  };
                  if(!isNuma($v->$a)){$z=fuse($z);}; $r[$k]->$a=$z;
               };
            };
         };

         $this->pacify();

         if($q->shape)
         {
            unset($k,$v,$z,$i); $x=$q->shape;

            if(is_string($x)&&strpos($x,':'))
            {
               $x=explode(':',$x); $k=trim($x[0]); $v=trim($x[1]); $z=knob(); $dbp=$this->mean->path; $dbn=$this->mean->base;
               if(span($v)<1){fail('invalid `shape` argument');}; $f="is undefined in table: `$tbl` .. in dbase: `$dbn` ($dbp)";
               if(!isWord($v)){if($v==='*'){$v=keys($r[0]);}else{$v=frag(swap($v,[', ',','],' '),' ');};};
               foreach($r as $i)
               {
                  if(!exists($i,$k)){fail("column `$k` $f");};
                  if(isWord($v)){$z->{$i->$k}=$i->$v; continue;}; $z->{$i->$k}=knob(); $c=null;
                  foreach($v as $c){if(!exists($i,$c)){fail("column `$c` $f");}; $z->{$i->$k}->$c=$i->$c;};
               };
               return $z;
            };

            if(is_string($x)&&(wrapOf($x)==='[]'))
            {
               $c=unwrap($x); $k=keys($r[0]); $z=[];
               if(isin($k,$c))
               {
                  foreach($r as $i){$z[]=$i->$c;};
                  return $z;
               };

               if(isin($c,' '))
               {
                  unset($l,$q); $l=frag($c,' ');
                  foreach($r as $i){$t=''; foreach($l as $q){$t.=($i->$q." ");}; $z[]=trim($t);};
                  return $z;
               };

               fail('invalid `shape` argument');
            };
         };

         return $r;
      }


      function update($x)
      {

         $q=(isAssa($x)?knob($x,U):$x); $x=null; $alt=[]; $ref=[];
         $xr = $this->mean->refs;
         if(!isKnob($q)){fail('expecting :assa: or :knob:');}; $sql='UPDATE '; $opr=padded((explode(' ',EXPROPER)),' ');
         if(!$q->using && ($xr->basis=="table")){$q->using = $xr->table;};
         if(!$q->using){fail('expecting `using` as table reference');}; if(!isNuma($q->using)){$q->using=[$q->using];};
         if($q->where&&is_string($q->where)){$q->where=[$q->where];};
         if(!isAssa($q->write)&&!isKnob($q->write)){fail('expecting `write` as :assa: or :knob:');};

         $x=$q->using; foreach($x as $k => $v){if(!isWord($v)){fail('expecting `using` as :text-list:');}; $x[$k]=swap($v,':',' AS ');};
         $sql.=fuse($x,', '); $sql.=' SET '; $z=[]; $this->mean->tabl=fuse($x,', '); unset($x,$k,$v);
         foreach($q->write as $k => $v){if(!isText($v)&&!isNumr($v)){$v=tval($v);}; $ref[":{$k}_write"]=$v; $z[]="$k = :{$k}_write";};
         $sql.=fuse($z,', ');

         if($q->where)
         {
            foreach($q->where as $k => $v)
            {
               $o=stub($v,$opr); if(!$o||(strlen($o[0])<1)||(strlen($o[2])<1)){fail('invalid `where` expression');}; $l=trim($o[0]);
               $r=trim($o[2]); $o=$o[1]; if(($o===' ~ ')&&(($r[0]==='*')||(substr($r,-1,1)==='*'))){$o=' LIKE ';$r=swap($r,'*','%');};
               $x=":{$l}_where"; $ref["$x"]=unwrap($r); $q->where[$k]="{$l}{$o}{$x}";
            };
            $sql.=(' WHERE '.fuse($q->where,' AND ')); unset($x,$k,$v);
         };

         if($q->limit){$x=$q->limit; $sql.=" LIMIT $x";}; $sql.=";";
         $r=$this->adjure($sql,$ref); $this->pacify(); return $r;
      }


      function delete($x)
      {
         $q=(isAssa($x)?knob($x,U):$x); if(!isKnob($q)){fail('expecting :assa: or :knob:');}; $x=null; $alt=[]; $ref=[];
         if($q->purge)
         {
            $t=$q->purge; expect::word($t); $r=$this->adjure("DELETE FROM $t;");
            // $this->adjure("DELETE FROM SQLITE_SEQUENCE WHERE name='$t';");
            $this->pacify(); return $r;
         };
         $sql='DELETE FROM '; $opr=padded((explode(' ',EXPROPER)),' ');
         $xr = $this->mean->refs;
         if(!$q->using && ($xr->basis=="table")){$q->using = $xr->table;};
         if(!$q->using){fail('expecting `using` as table reference');}; if(!isNuma($q->using)){$q->using=[$q->using];};
         if($q->where&&is_string($q->where)){$q->where=[$q->where];};

         $x=$q->using; foreach($x as $k => $v){if(!isWord($v)){fail('expecting `using` as :text-list:');}; $x[$k]=swap($v,':',' AS ');};
         $sql.=fuse($x,', '); $this->mean->tabl=fuse($x,', '); unset($x,$k,$v);

         if($q->where)
         {
            foreach($q->where as $k => $v)
            {
               $o=stub($v,$opr); if(!$o||(strlen($o[0])<1)||(strlen($o[2])<1)){fail('invalid `where` expression');}; $l=trim($o[0]);
               $r=trim($o[2]); $o=$o[1]; if(($o===' ~ ')&&(($r[0]==='*')||(substr($r,-1,1)==='*'))){$o=' LIKE ';$r=swap($r,'*','%');};
               $x=":{$l}_where"; $ref["$x"]=unwrap($r); $q->where[$k]="{$l}{$o}{$x}";
            };
            $sql.=(' WHERE '.fuse($q->where,' AND ')); unset($x,$k,$v);
         };

         if($q->limit){$x=$q->limit; $sql.=" LIMIT $x";}; $sql.=";";
         $r=$this->adjure($sql,$ref); $this->pacify(); return $r;
      }


      function verify($x)
      {
         $x=(isAssa($x)?knob($x,U):$x); if(!isKnob($x)){fail('expecting :assa: or :knob:');};
         expect::{'text numa'}($x->using); if(!isNuma($x->using)){$x->using=[$x->using];};
         expect::{'text numa'}($x->where); if(!isNuma($x->where)){$x->where=[$x->where];};
         expect::{'text numa'}($x->claim); if(!isNuma($x->claim)){$x->claim=[$x->claim];};
         $q=[using=>$x->using,count=>'rowid',where=>fuse($x->where,$x->claim),limit=>1];
         $r=$this->select($q); $z=[knob(['bool'=>false])]; if(count($r)>0){$z[0]->bool=true;}; return $z;
      }


      function ensure($x)
      {
         $x=(isAssa($x)?knob($x,U):$x); if(!isKnob($x)){fail('expecting :assa: or :knob:');};
         expect::{'text numa'}($x->using); $tbl=$x->using; // if(!isNuma($x->using)){$x->using=[$x->using];};
         expect::{'text numa'}($x->where); if(!isNuma($x->where)){$x->where=[$x->where];}; expect::{'numa'}($x->claim);
         if(count($x->claim)<1){return;}; if(isFlat($x->claim)||isMixd($x->claim)){fail('expecting uniform multi-dimensional array');};
         $t=expect::{'numa assa knob'}($x->claim[0]); $q=[using=>$tbl,fetch=>'*',where=>$x->where]; $r=$this->select($q); $q=$x->claim;
         if(count($r)<1){$r=$this->insert([using=>$tbl,write=>$q]); return $r;}; $c=keys($r[0]); $so=span($r);

         foreach($q as $k => $v)
         {
            if($t!=='knob'){$v=(($t==='numa')?infuse($c,$v):knob($v));}; foreach($v as $vk => $vv){if(isText($vv)){$v->$vk=dval($vv);};};
            $q[$k]=$v;
         };

         $d=diff($r,$q); if(span($d)<1){return true;}; $c=[];$w=[]; foreach($x->where as $i){$c[]=stub($i,' ')[0];};
         foreach($d as $di){foreach($c as $ci){$dc=$di->$ci; $w[]=("$ci = '$dc'");};}; unset($di); $z=knob(['deed'=>'?','done'=>0]);
         $r=$this->select([using=>$tbl,fetch=>'*',where=>$w]); $sq=span($q); $sr=span($r);

         if(($sr<=$sq)&&isin($q,$d))
         {
            if($sr<1){$r=$this->insert([using=>$tbl,write=>$d]); return $r;};
            foreach($d as $di){$r=$this->update([using=>$tbl,where=>$w,write=>$di]); $z->deed='INSERT'; $z->done+=$r->done;}; return $z;
         }
         elseif(($so>$sq)&&isin($r,$d))
         {
            foreach($d as $di){$r=$this->delete([using=>$tbl,where=>$w]); $z->deed='DELETE'; $z->done+=$r->done;}; return $z;
         }
      }


      function modify()
      {
         dump('TODO :: sqlite : modify()');
      }


      function invoke()
      {
         dump('TODO :: sqlite : invoke()');
      }


      function import()
      {
         $a=func_get_args(); if(isset($a[0])){if(isNuma($a[0])){$a=$a[0];}elseif(isAssa($a[0])&&isset($a[0][using])){$a=$a[0][using];};};
         if(is_string($a)){$a=[$a];}; $d=null; if(!$this->exists()){$d=$this->create();}; foreach($a as $p)
         {$p=path($p); if($p===$d){continue;}; if(!isFile($p)){fail("expecting `$p` as readable file");}; $this->adjure(path::scan($p));};
         return true;
      }


      function export()
      {
         dump('TODO :: sqlite : export()');
      }
   }
# ---------------------------------------------------------------------------------------------------------------------------------------------



// $qr = file_get_contents(COREPATH."/sys/data.sql");
// $db = (new \SQLite3(COREPATH."/sys/data.sdb", SQLITE3_OPEN_CREATE | SQLITE3_OPEN_READWRITE));
// $db->enableExceptions(true);
// $db->query($qr);
// $db->close();

// $db = (new \SQLite3(COREPATH."/sys/data.sdb", SQLITE3_OPEN_CREATE | SQLITE3_OPEN_READWRITE));
// $db->enableExceptions(true);
// $pq = $db->prepare('SELECT * from conf');
// $rs = $pq->execute();
// $rn = $rs->numColumns();
//
// while ($row = $rs->fetchArray(SQLITE3_ASSOC))
// {
//    print_r($row); echo "\n\n";
// }
//
// $db->close();

// var_dump($rn);
