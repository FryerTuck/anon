<?
namespace Anon;


# tool :: mysql_plug : embedded database abstraction
# ---------------------------------------------------------------------------------------------------------------------------------------------
   class mysql_plug
   {
      public $info=null;
      public $mean=null;
      private $link=null;



      function __construct($x)
      {
         todo::{'Data mysql_plug'}('change API to use `PDO` instead of `mysqli` in order to standardize and use prepared statements');
         if(!$x->port){$x->port=3306;}; if(!$x->path){$x->path='/';}; $p=$x->path; $this->mean=$x;
         $p=frag(shaved($x->path,'/'),'/'); if(!$p){$p=[];}; $r=knob(); $x=['dbase','table','field'];
         $this->info=knob(['maxLevel'=>3,'levlType'=>$x]); if($this->mean->levl>$this->info->maxLevel){fail('path-depth unreachable');exit;};
         foreach($p as $k => $v){$r->{$x[$k]}=$v; $r->basis=$x[$k];}; $lvl=$this->mean->levl; $this->mean->refs=$r; if($lvl<2){return;};
         $b=$r->dbase; $t="$r->table"; $q="STATUS where Db = '$b' AND Name = '$t'"; $sp=$this->adjure("SHOW PROCEDURE $q");
         if(span($sp<1)){$sp=0;}; $fn=$this->adjure("SHOW FUNCTION $q"); if(span($fn<1)){$fn=0;}; if(!$sp&&!$fn){return;};
         $z=($sp?'sproc':'funct'); unset($r->table); $r->$z=$t; $r->basis=$z; $this->mean->refs=$r; $this->mean->mime='application/sql';
      }



      function __destruct()
      {
         $this->pacify();
      }



      function __call($n,$a)
      {
         return call($this->$n,$a);
      }



      function engage($h,$u,$p,$b)
      {
         $c=null; $eh=defail(); $c=mysqli_connect($h,$u,$p,$b); $eb=enfail($eh); // hammer of deh gaahds!! .. - thor SC2
         if($c){return $c;}; throw (new \ErrorException("no connection using `mysql://$u:****@$h/$b`"));
      }



      function vivify()
      {
         if($this->link){return $this->link;}; $i=$this->mean; $r=$i->refs; $b=$r->dbase; if(!$b){$b='mysql';}; $m=null;
         try{$this->link=$this->engage($i->host,$i->user,$i->pass,$b);}catch(\Exception $e){$m=$e->getMessage();};
         if($m){if(isin($m,'using password: YES')){$m='invalid authorization credentials';}; fail($m);};
         if(!$this->link){fail('some horrible bullshit is at foot here');return;};
         mysqli_set_charset($this->link,'utf8'); return $this->link;
      }



      function pacify()
      {
         if($this->link){mysqli_close($this->link); $this->link=null; return true;};
      }



      function adjure($q,$l=null)
      {
         if(is_string($q)){$q=trim($q); $q=trim($q,';');}; if(!isText($q,10)){fail('invalid SQL');}; $a=strtoupper(frag($q,0,4));
         $z=0; $r=null; $c=$this->vivify(); // if(isin(['SELE','INSE','UPDA','DELE','PRAG'],$a)){}; // prepare query .. ?
         try{$x = @mysqli_query($this->link,$q);}catch(\Exception $e){$z=1; $m=$e->getMessage(); fail($m);};

         if(!$z&&mysqli_errno($this->link)){$z=1; $m=mysqli_error($this->link);}; if($z)
         {
            $f=stub($m,'server version for the right syntax to use'); if($f){$m="MySQL syntax error $f[2]";};
            $this->pacify(); fail("$m\n\nQuery used:\n$q");
         };

         if(isin('SELE,SHOW,DESC',$a))
         {$r=[]; $y=[]; $i=0; while($y[]=mysqli_fetch_assoc($x)){if($y[$i]!==null){$r[]=knob($y[$i]); $i++;}}; mysqli_free_result($x);}
         elseif(isin('INSE',$a)){$r=mysqli_insert_id($this->link);}
         elseif(isin('UPDA,DELE',$a)){$r=mysqli_affected_rows($this->link);};
         if(!$l){$this->pacify();}; return $r;
      }



      function create($a=null)
      {
         $i=$this->mean; $l=$i->levl; $r=$i->refs; if(isAsso($a)){$a=knob($a,1);}; // prep

         if(isKnob($a))
         {
            $what=unwrap($a->basis); $name=$a->named; $avl=['dbase','table','sproc','funct','field'];
            if(!$what){foreach($avl as $itm){if($a->$itm){$what=$itm; $name=$a->$itm; break;}}};
            if(!isin($avl,$what)){fail('create only works on basis of: '.fuse($avl,','));};
            if(!is_funnic($name)){fail("invalid $what name");}; $body=($a->using?$a->using:$a->write);

            if($what==='dbase')
            {$q="CREATE SCHEMA `$name` DEFAULT CHARACTER SET utf8"; $this->adjure($q); return true;};

            if($what==='table')
            {
               if(!$r->dbase){fail('dbase is undefined');};
               expect::knob($body,1); $c=[]; foreach($body as $k => $v){$c[]="$k $v";};
               $c=fuse($c,','); $q="CREATE TABLE $name ($c)"; $this->adjure($q); return true;
            };

            if(($what=='sproc')||($what=='funct'))
            {
               if(!$r->dbase){fail('dbase is undefined');}; $para=$a->param;
               $test=$this->adjure("SELECT * FROM INFORMATION_SCHEMA.ROUTINES WHERE ROUTINE_NAME='$name'");
               if(span($test)>0){fail("$what `$name` already exists .. use `modify` to edit, or `delete` it first");};
               if($para===null){$para=[];}elseif(isText($para)){$para=[$para];}; if(!isNuma($para)){fail('invalid parameters');};
               $para=implode(', ',$para); if(isText($body)){$body=swap(trim($body),"\t",' '); if($body){$body=explode("\n",$body);}};
               if(!isNuma($body,1)){fail("cannot write invalid $what body");}; $lv=vals($body,-1);
               if(trim($lv)!=='END'){fail("invalid $what `END` statement");}; $lv=rtrim($lv); $lv=span(swap($lv,'END',''));
               foreach($body as $k => $v){$v=rtrim($v); if($lv&&(trim(substr($v,0,$lv))==='')){$v=substr($v,$lv);}; $body[$k]=$v;}; // indent
               $body=implode("\n",$body); $w=(($what==='sproc')?'PROCEDURE':'FUNCTION'); $q="CREATE $w `$name`($para)\n$body";
               $rsl=$this->adjure($q); return $rsl;
            };

            if($what=='field')
            {
               if(!$r->dbase){fail('dbase is undefined');};
               if(!$r->table){fail('table is undefined');};
               if(!$a->after){$a->after=unbury($this->adjure("DESCRIBE $r->table"),'Field'); $a->after=rpop($a->after);};
               expect::knob($body,1); $k=keys($body)[0]; $v=$a->$k;
               $q="ALTER TABLE $r->table ADD COLUMN $name $k $v AFTER $a->after"; $this->adjure($q); return true;
            };

            fail('stranger things');
         };


         if($l<1)
         {
            if(!isText($a->dbase,2)){fail('expecting valid `dbase` reference');};
            $q="CREATE SCHEMA `$a->dbase` DEFAULT CHARACTER SET utf8"; $this->adjure($q); return true;
         };

         if($l<2)
         {
            if(!isText($a->table,2)){fail('expecting valid `table` reference');};
            $a=($a->using?$a->using:$a->write); expect::knob($a,1); $c=[]; foreach($a as $k => $v){$c[]="$k $v";};
            $c=fuse($c,','); $q="CREATE TABLE $a->table ($c)"; $this->adjure($q); return true;
         };

         if($l<3)
         {
            if(!isText($a->field,2)){fail('expecting valid `field` reference');};
            if(!$a->after){$a->after=unbury($this->adjure("DESCRIBE $r->table"),'Field'); $a->after=rpop($a->after);};
            $a=($a->using?$a->using:$a->write); expect::knob($a,1); $k=keys($a)[0]; $v=$a->$k;
            $q="ALTER TABLE $r->table ADD COLUMN $a->field $k $v AFTER $a->after"; $this->adjure($q); return true;
         }
      }



      function descry($x='*', $tm=true)
      {
         $i=$this->mean; $l=$i->levl; $r=dupe($i->refs); $z=null; $b=$r->dbase;
         if(isAsso($x)){$x=knob($x,1);}; // prep
         if(isKnob($x)&&isText($x->using,1)){$x=$x->using;};

         if(!isText($x,1)){fail("expecting non-empty text");return;};

         if($x!=='*')
         {
            $x=swap($x,'.','/'); $p=frag(trim($x,'/'),'/');
            $x=['dbase','table','field']; if($l>0){lpop($x);}; if($l>1){lpop($x);};
            foreach($p as $k => $v){$r->{$x[$k]}=$v;}; $l+=span($p);
         };


         if($l<1)
         {
            $z=unbury($this->adjure("SHOW DATABASES"),"Database",['information_schema','mysql','performance_schema']);
            if($tm){$z=padded($z,'dbase::','');}; return $z;
         };

         if($l<2)
         {
            $dt=unbury($this->adjure("SHOW TABLES"),"Tables_in_$b"); if($tm){$dt=padded($dt,'table::','');};
            $sp=unbury($this->adjure("SHOW PROCEDURE STATUS where Db = \"$b\""),'Name'); if($tm){$sp=padded($sp,'sproc::','');};
            $fn=unbury($this->adjure("SHOW FUNCTION STATUS where Db = \"$b\""),'Name'); if($tm){$fn=padded($fn,'funct::','');};
            $z=concat($dt,$sp); $z=concat($z,$fn); return $z;
         };

         if($l<3){$z=unbury($this->adjure("DESCRIBE $r->table"),'Field'); if($tm){$z=padded($z,'field::','');}; return $z;};
         if($l<4){$i=$this->adjure("DESCRIBE $r->table"); foreach($i as $o){if($o->Field===$r->field){$z=$o;break;}}; return $z;};
      }



      function exists()
      {
         $a=func_get_args(); if(isset($a[0])&&isArra($a[0])){$a=$a[0];}; $r=knob();
         // foreach($a as $i){};
      }



      function insert($x,$t=null)
      {
         if(!$this->link){$this->vivify();};

         if(!$t)
         {
            if(isAsso($x)){$x=knob($x,1);}; if(!isKnob($x)){fail('expecting :asso: or :knob:');}; $t=$x->using;
            if(!isWord($t)){fail('expecting value of `using` as word');return;};
            $l=$this->descry($t); $this->{":$t:"}=$l; $w=$x->write; $z=knob(['done'=>0,'last'=>0]); if(span($w)<1){return $z;};
            if(isNuma($w)&&!isNuma($w[0])&&!isAsso($w[0])&&!isKnob($w[0])){$w=[$w];};
            if(!isNuma($w)){$w=[$w];}; $z=knob(['deed'=>'INSERT','done'=>0,'last'=>0]); $this->mean->tabl=$t;
            foreach($w as $i){$r=$this->insert($i,$t); $z->done++; $z->last=$r->last;}; $this->pacify(); return $z;
         }

         if(isNuma($x))
         {
            $c=$this->{":$t:"}; $y=knob(); foreach($c as $k => $v){$y->$v=(isset($x[$k])?$x[$k]:'');}; $x=$y;
         };

         $ref=[]; $k=keys($x); $v=vals($x); $c=implode(', ',$k); $sql="INSERT INTO $t ($c) VALUES"; foreach($v as $vk => $vv)
         {if(isText($vv)){$vv=mysqli_real_escape_string($this->link,$vv); $vv="'{$vv}'";}else{$vv=tval($vv);}; $v[$vk]=$vv;};
         $v=implode(', ',$v); $sql.=" ($v)"; $r=$this->adjure($sql,$ref); $z=knob(['done'=>0,'last'=>0]);
         if($r){$z->done=1; $z->last=$r;}; return $z;
      }



      function select($arg='*',$tre=null)
      {
         $inf=$this->mean; $lvl=$inf->levl; $rfs=$inf->refs; $tpe=$rfs->basis; if(isAsso($arg)){$arg=knob($arg,1);}; // prep
         if(($arg!=='*')&&!isKnob($arg)){fail('invalid argument, expecting object');};


         if(($arg==='*')&&($tre===TREE))
         {
            if($lvl<1)
            {
               $z=padded(unbury($this->adjure("SHOW DATABASES"),"Database",['information_schema','mysql','performance_schema']),'dbase::','');
               return $z;
            };

            if($tpe==='dbase')
            {
               $b=$rfs->dbase; $dt=padded(unbury($this->adjure("SHOW TABLES"),"Tables_in_$b"),'table::','');
               $sp=padded(unbury($this->adjure("SHOW PROCEDURE STATUS where Db = \"$b\""),'Name'),'sproc::','');
               $fn=padded(unbury($this->adjure("SHOW FUNCTION STATUS where Db = \"$b\""),'Name'),'funct::','');
               $z=concat($dt,$sp); $z=concat($z,$fn); return $z;
            };

            if($tpe==='table')
            {
               $z=padded(unbury($this->adjure("DESCRIBE $rfs->table"),'Field'),'field::',''); return $z;
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


         if(($arg->fetch==='*')&&(($tpe==='sproc')||($tpe==='funct')))
         {
            $nic=$rfs->$tpe; $ucw=(($tpe==='sproc')?'PROCEDURE':'FUNCTION'); $pcw=proprCase($ucw);
            $z=$this->adjure("SHOW CREATE $ucw $nic")[0]->{"Create $pcw"}; return $z;
         };


         if(($arg->fetch==='*')&&($lvl<2)&&($arg->limit!==null))
         {
            $q=(($lvl<1)?'SHOW DATABASES':'SHOW TABLES'); $z=$this->adjure($q);
            $rsl=filter($z,$arg); return $rsl;
         };


         $opr=padded((explode(' ',EXPROPER)),' '); $sql='SELECT '; $x=null; $alt=[]; $tbl='';
         if(!$arg->using&&($lvl>0)){$arg->using=(($lvl<2)?$rfs->dbase:$rfs->table);};
         if($arg->count&&is_string($arg->count)){$arg->count=[$arg->count];}; if($arg->fetch&&is_string($arg->fetch)){$arg->fetch=[$arg->fetch];};
         if($arg->using&&is_string($arg->using)){$arg->using=[$arg->using];}; if($arg->where&&is_string($arg->where)){$arg->where=[$arg->where];};

         if($arg->count){$x=$arg->count; foreach($x as $k => $v){$x[$k]=swap($v,':',' AS ');}; $sql.=implode(', ',$x); unset($x,$k,$v);};

         if($arg->alter)
         {
            $a=$arg->alter; if(isText($a)){$a=[$a];}; if(!isNuma($a)){fail('expecting `alter` as :text: or :numa:');};
            foreach($a as $i){if(!pick($i,[':','@','.'],XACT)){fail('invalid alter expression');}; $i=explode(':',$i); $alt[$i[0]]=$i[1];};
         };

         if($arg->fetch)
         {
            $x=$arg->fetch; foreach($x as $k => $v)
            {
               if(pick($v,[':','@','.'],XACT)){$v=explode(':',$v); $alt[(isset($v[2])?$v[2]:$v[0])]=$v[1];unset($v[1]);$v=implode(':',$v);};
               $x[$k]=swap($v,':',' AS ');
            };
            $sql.=implode(', ',$x); unset($x,$k,$v);
         };

         if($arg->using)
         {
            $x=$arg->using; $tbl=implode(', ',$x); $this->mean->tabl=$tbl; foreach($x as $k => $v){$x[$k]=swap($v,':',' AS ');};
            $sql.=" FROM $tbl"; unset($x,$k,$v);
         };

         if($arg->where)
         {
            foreach($arg->where as $k => $v)
            {
               $o=stub($v,$opr); if(!$o||(strlen($o[0])<1)||(strlen($o[2])<1)){fail('invalid `where` expression');}; $l=trim($o[0]);
               $r=trim($o[2]); $o=$o[1]; if(($o===' ~ ')&&(($r[0]==='*')||(substr($r,-1,1)==='*'))){$o=' LIKE ';$r=swap($r,'*','%');};
               $x=":{$l}_where"; $ref["$x"]=unwrap($r); $arg->where[$k]="{$l}{$o}{$x}";
            };
            $sql.=(' WHERE '.implode(' AND ',$arg->where)); unset($x,$k,$v);
         };

         if($arg->group){$x=$arg->group; $sql.=" GROUP BY $x";};
         if($arg->order){$x=$arg->order; $p=explode(':',$x); $p[1]=((isset($p[1])&&($p[1]==='ASC'))?'ASC':'DESC'); $sql.=" ORDER BY $p[0] $p[1]";};
         if($arg->limit){$x=$arg->limit; $sql.=" LIMIT $x";}; $sql.=";";

         $this->vivify(); $rsl=$this->adjure($sql); if(count($rsl)<1){$this->pacify(); return [];}; // do nothing with empty result

         if(count($alt)>0)
         {
            foreach($rsl as $k => $v)
            {
               foreach($alt as $a => $i)
               {
                  if(!strpos($i,'@')||!strpos($i,'.')||($v->$a===null)){continue;}; $i=explode('@',$i); $f=$i[0]; $i=explode('.',$i[1]);
                  $t=$i[0]; $c=$i[1]; if(!isWord($f)||!isWord($t)||!isWord($c)){fail('invalid sub-query');}; $x=$v->$a; if(!isNuma($x)){$x=[$x];};
                  $z=[]; foreach($x as $y)
                  {
                     if(!isNumr($y)){$y=("'".tval($y)."'");}; $sql="SELECT $f FROM $t where $c = $y LIMIT 1"; $r=$this->adjure($sql);
                     if(count($r)<1){continue;}; $z[]=$r[0]->$f;
                  };
                  if(!isNuma($v->$a)){$z=implode($z);}; $rsl[$k]->$a=$z;
               };
            };
         };

         $this->pacify();

         if($arg->shape)
         {
            unset($k,$v,$z,$i); $x=$arg->shape;

            if(is_string($x)&&strpos($x,':'))
            {
               $x=explode(':',$x); $k=trim($x[0]); $v=trim($x[1]); $z=knob(); $dbp=$inf->path; $dbn=$rfs->dbase;
               if(span($v)<1){fail('invalid `shape` argument');}; $f="is undefined in table: `$tbl` .. in dbase: `$dbn` ($dbp)";
               if(!isWord($v)){if($v==='*'){$v=keys($rsl[0]);}else{$v=frag(swap($v,[', ',','],' '),' ');};};
               foreach($rsl as $i)
               {
                  if(!exists($i,$k)){fail("column `$k` $f");};
                  if(isWord($v)){$z->{$i->$k}=$i->$v; continue;}; $z->{$i->$k}=knob(); $c=null;
                  foreach($v as $c){if(!exists($i,$c)){fail("column `$c` $f");}; $z->{$i->$k}->$c=$i->$c;};
               };
               return $z;
            };

            if(is_string($x)&&(wrapOf($x)==='[]'))
            {
               $c=unwrap($x); $k=keys($rsl[0]); $z=[];
               if(isin($k,$c))
               {
                  foreach($rsl as $i){$z[]=$i->$c;};
                  return $z;
               };

               if(isin($c,' '))
               {
                  unset($l,$q); $l=frag($c,' ');
                  foreach($rsl as $i){$t=''; foreach($l as $q){$t.=($i->$q." ");}; $z[]=trim($t);};
                  return $z;
               };

               fail('invalid `shape` argument');
            };
         };

         return $rsl;
      }



      function update($x)
      {
         $q=(isAsso($x)?knob($x,U):$x); $x=null; $alt=[]; $ref=[];
         if(!isKnob($q)){fail('expecting :numa: or :knob:');}; $sql='UPDATE '; $opr=padded((explode(' ',EXPROPER)),' ');
         if(!$q->using){fail('expecting `using` as table reference');}; if(!isNuma($q->using)){$q->using=[$q->using];};
         if($q->where&&is_string($q->where)){$q->where=[$q->where];};
         if(!isAsso($q->write)&&!isKnob($q->write)){fail('expecting `write` as :numa: or :knob:');};

         $x=$q->using; foreach($x as $k => $v){if(!isWord($v)){fail('expecting `using` as array of strings');}; $x[$k]=swap($v,':',' AS ');};
         $sql.=implode(', ',$x); $sql.=' SET '; $z=[]; $this->mean->tabl=implode(', ',$x); unset($x,$k,$v);
         if(!$this->link){$this->vivify();};
         foreach($q->write as $k => $v)
         {
            if(isText($v)){$v=mysqli_real_escape_string($this->link,$v); $v="'$v'";}
            else{$v=tval($v);};  $z[]="$k = $v";
         };
         $sql.=implode(', ',$z);

         if($q->where)
         {
            foreach($q->where as $k => $v)
            {
               $o=stub($v,$opr); if(!$o||(strlen($o[0])<1)||(strlen($o[2])<1)){fail('invalid `where` expression');}; $l=trim($o[0]);
               $r=trim($o[2]); $o=$o[1]; if(($o===' ~ ')&&(($r[0]==='*')||(substr($r,-1,1)==='*'))){$o=' LIKE ';$r=swap($r,'*','%');};
               $x=":{$l}_where"; $ref["$x"]=unwrap($r);
               $q->where[$k]="{$l}{$o}{$r}";
            };
            $sql.=(' WHERE '.implode(' AND ',$q->where)); unset($x,$k,$v);
         };

         if($q->limit){$x=$q->limit; $sql.=" LIMIT $x";};  //$sql.=";";
         $r=$this->adjure($sql); $this->pacify(); if(!$r&&isNumr($r)){$r=true;};
         $z=knob(['done'=>$r]); return $z;
      }



      function delete($a=null)
      {
         $i=$this->mean; $l=$i->levl; $r=$i->refs; if(isAsso($a)){$a=knob($a,1);}; // prep
         $z=knob(['done'=>null]); $opr=padded((explode(' ',EXPROPER)),' ');

         if(isKnob($a)&&$a->using&&$a->where)
         {
            if(!isNuma($a->where)){$a->where=[$a->where];};
            $sql="DELETE FROM $a->using WHERE "; $r=null;
            foreach($a->where as $k => $v)
            {
               $o=stub($v,$opr); if(!$o||(strlen($o[0])<1)||(strlen($o[2])<1)){fail('invalid `where` expression');}; $l=trim($o[0]);
               $r=trim($o[2]); $o=$o[1]; if(($o===' ~ ')&&(($r[0]==='*')||(substr($r,-1,1)==='*'))){$o=' LIKE ';$r=swap($r,'*','%');};
               $x=":{$l}_where"; $ref["$x"]=unwrap($r);
               $q->where[$k]="{$l}{$o}{$r}";
            };
            $sql.=implode(' AND ',$q->where);
            $r=$this->adjure($sql); if(!$r&&isNumr($r)){$r=true;}; $z->done=$r;
            return $z;
         };

         if(isKnob($a))
         {
            $what=unwrap($a->basis); $name=$a->named; $avl=['dbase','table','sproc','funct','field'];
            if(!$what){foreach($avl as $itm){if($a->$itm){$what=$itm; $name=$a->$itm; break;}}};
            if(!isin($avl,$what)){fail('delete only works on basis of: '.fuse($avl,','));};
            if(!is_funnic($name)){fail("invalid $what name");};

            if($what==='dbase'){return $this->adjure("DROP DATABASE IF EXISTS $name");};

            if(!$r->dbase){fail('dbase is undefined');};

            if($what==='table'){return $this->adjure("DROP TABLE IF EXISTS $name");};
            if($what==='sproc'){return $this->adjure("DROP PROCEDURE IF EXISTS $name");};
            if($what==='funct'){return $this->adjure("DROP FUNCTION IF EXISTS $name");};

            if(!$r->table){fail('table is undefined');};

            if($what==='field'){return $this->adjure("ALTER TABLE $r->table DROP COLUMN $name");};
         };
      }



      function verify($x)
      {
         $x=(isAsso($x)?knob($x,U):$x); if(!isKnob($x)){fail('expecting :scal: or :tron:');};
         expect::{'text tupl'}($x->using); if(!isNuma($x->using)){$x->using=[$x->using];};
         expect::{'text tupl'}($x->where); if(!isNuma($x->where)){$x->where=[$x->where];};
         expect::{'text tupl'}($x->claim); if(!isNuma($x->claim)){$x->claim=[$x->claim];};
         $q=[using=>$x->using,count=>'rowid',where=>fuse($x->where,$x->claim),limit=>1];
         $r=$this->select($q); $z=[knob(['bool'=>false])]; if(count($r)>0){$z[0]->bool=true;}; return $z;
      }



      function ensure($x)
      {
         $x=(isAsso($x)?knob($x,U):$x); if(!isKnob($x)){fail('expecting :scal: or :tron:');};
         expect::{'text tupl'}($x->using); $tbl=$x->using; // if(!isNuma($x->using)){$x->using=[$x->using];};
         expect::{'text tupl'}($x->where); if(!isNuma($x->where)){$x->where=[$x->where];}; expect::{'tupl'}($x->claim);
         if(count($x->claim)<1){return;}; if(isFlat($x->claim)||isMixd($x->claim)){fail('expecting uniform multi-dimensional array');};
         $t=expect::{'tupl scal tron'}($x->claim[0]); $q=[using=>$tbl,fetch=>'*',where=>$x->where]; $r=$this->select($q); $q=$x->claim;
         if(count($r)<1){$r=$this->insert([using=>$tbl,write=>$q]); return $r;}; $c=keys($r[0]); $so=span($r);

         foreach($q as $k => $v)
         {
            if($t!=='tron'){$v=(($t==='tupl')?infuse($c,$v):knob($v));}; foreach($v as $vk => $vv){if(isText($vv)){$v->$vk=parsed($vv);};};
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



      function modify($a)
      {
         dump('TODO :: mysql : modify()');
      }



      function invoke()
      {
         dump('TODO :: mysql : invoke()');
      }



      function import()
      {
         $a=func_get_args(); if(isset($a[0])){if(isNuma($a[0])){$a=$a[0];}elseif(isAsso($a[0])&&isset($a[0][using])){$a=$a[0][using];};};
         if(is_string($a)){$a=[$a];}; $d=null; if(!$this->exists()){$d=$this->create();}; foreach($a as $p)
         {$p=path($p); if($p===$d){continue;}; if(!isFile($p)){fail("expecting `$p` as readable file");}; $this->adjure(path::scan($p));};
         return true;
      }



      function export()
      {
         dump('TODO :: mysql : export()');
      }
   }
# ---------------------------------------------------------------------------------------------------------------------------------------------
