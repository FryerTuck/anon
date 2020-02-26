<?
namespace Anon;



# tool :: ftp_plug : embedded database abstraction
# ---------------------------------------------------------------------------------------------------------------------------------------------
   class ftp_plug
   {
      public $mean=null;
      public $link=null;
      public $fail=null;
      public $cols=['repo','path','name','mime','type','size','time','mode','levl','data'];



      function __construct($x)
      {
         if(!$x->port){$x->port=21;}; $this->mean=$x;
      }



      function __destruct()
      {
         $this->pacify();
      }



      function __call($n,$a)
      {
         return call($this->$n,$a);
      }



      function vivify($chdr=true)
      {
         if($this->link){return $this->link;}; $I=$this->mean; $L=(new ftp($I->host,$I->port,$I->user,$I->pass));
         if($L->fail){fail($L->fail);}; $L->pasv(true); $this->link=$L;
         if(!$I->path||($I->path==='/')){$this->mean->type='fold'; return $this->link;};
         if(!$chdr){return $this->link;}; $L->chdir($I->path); if(!$L->fail){$this->mean->type='fold'; return $this->link;};

         $F=$L->fail; if(isin($F,'No such file or directory'))
         {
            $s=$L->size($I->path); if($s<0){fail($F);}; $L->fail=null;
            $L->chdir(path::twig($I->path)); if($L->fail){fail($L->fail);}; $this->mean->type='file';
         };

         return $this->link;
      }



      function pacify()
      {
         if($this->link){$this->link->close(); $this->link=null; return true;};
      }



      function exists($f=null)
      {
         $L=$this->vivify(0); $I=$this->mean; $s=$L->size($I->path);
         return ($s>=0);
      }



      function select($a)
      {
         $L=$this->vivify(); $I=$this->mean; $P=$I->path;

         if($I->type==='fold')
         {
            $D=$L->mlsd('.'); if($L->fail){fail($L->fail);}; $R=[]; $dl=[]; $fl=[]; foreach($D as $i)
            {
               if(substr($i['name'],0,1)==='.'){continue;}; $n=null; $p=("$P/".$i['name']); $t=$i['type']; if($t==='dir'){$t='fold';};
               $z=path::levl($p); $m=(($t=='fold')?mime($t):mime($p)); $s=(isset($i['size'])?$i['size']:null); $q=strtotime($i['modify']);
               $x=$i['UNIX.mode']; $o=knob
               ([
                  'repo'=>$n,'path'=>$p,'name'=>$i['name'],'mime'=>$m,'type'=>$t,'size'=>$s,'time'=>$q,'mode'=>$x,'levl'=>$z,'data'=>$n
               ]);
               if($t=='fold'){$o->data=[]; $dl[]=$o;}else{$fl[]=$o;};
            };
            foreach($dl as $di){$R[]=$di;}; foreach($fl as $fi){$R[]=$fi;};
         }
         else
         {
            $R=$L->read(path::leaf($P)); if($L->fail){fail($L->fail);};
         };


         if($a==='*'){return $R;};
      }



      function update($a)
      {
         $L=$this->vivify(); $I=$this->mean; $P=$I->path;

         if($I->type==='file')
         {
            expect::text($a); $L->write(path::leaf($P),$a); if($L->fail){fail($L->fail);};
            return true;
         };
      }



      function insert($a)
      {
         $L=$this->vivify(); $I=$this->mean; $P=$I->path; if(isAssa($a)){$a=knob($a,U);}; if(span($a)<1){return;};
         if(!isText($a)&&!isKnob($a)){fail('expecting text or assoc-array or object');};

         if(isKnob($a)&&($a->using||$a->write))
         {if($a->using){$L->chdir($a->using); if($L->fail){fail($L->fail);}}; if($a->write){$w=$a->write;}}
         else{$w=$a;};


         if($I->type==='file')
         {
            expect::text($w); $L->write(path::leaf($P),$w); if($L->fail){fail($L->fail);};
            return true;
         };


         if($I->type==='fold')
         {
            if(isText($w))
            {
               if(!isPath("/$w")){fail("invalid filename `$w`");};
               if(last($w)==='/'){$w=trim("$w",'/'); $L->mkdir($w);}else{$L->write($w,'');};
               if($L->fail){fail($L->fail);}; return true;
            };

            foreach($w as $k => $v)
            {
               if(!isPath("/$k")){fail("invalid filename `$k`");}; $f=[];
               if(last($k)==='/'){$k=trim("$k",'/'); $L->mkdir($k); if($L->fail){$f[]="$k failed: $L->fail"; $L->fail=null;}; continue;};
               if($v===null){$v='';}elseif(!isText($v)){$v=tval($v);};
               $L->write($k,$v); if($L->fail){$f[]="$k failed: $L->fail"; $L->fail=null;};
            };

            if(count($f)<1){return true;}; $f=fuse($f,"\n"); fail($f);
         }
      }



      function rename($a)
      {
         $L=$this->vivify(); $I=$this->mean; $P=$I->path; if(isAssa($a)){$a=knob($a,U);}; if(span($a)<1){return;};
         if(!isKnob($a)){fail('expecting assoc-array or object');};

         if($a->using||$a->write){if($a->using){$L->chdir($a->using); if($L->fail){fail($L->fail);}}; if($a->write){$w=$a->write;}}
         else{$w=$a;};

         foreach($w as $k => $v)
         {
            if(!isPath("/$k")){fail("invalid filename `$k`");}; $f=[];
            $L->rename($k,$v); if($L->fail){$f[]="$k failed: $L->fail"; $L->fail=null;};
         };

         if(count($f)<1){return true;}; $f=fuse($f,"\n"); fail($f);
      }



      function delete($a)
      {
         $L=$this->vivify(false); $I=$this->mean; $P=$I->path; if(isAssa($a)){$a=knob($a,U);}; if(span($a)<1){return;};
         $W=(isPath($P)?$P:'/'); if(!isText($a)&&!isKnob($a)){fail('expecting assoc-array, or string, or object');};

         if(isKnob($a)&&($a->using||$a->erase))
         {
            $u=$a->using; $e=$a->erase; if($u&&!isPath($u)){if(!isPath("/$u")){fail('invalid `using` clause');}; $u="./$u";};
            if($e&&!isPath($e)){if(!isPath("/$e")){fail('invalid `erase` clause');}; $e="./$e";};
            if($u){$W=path::fuse($W,$u);}; if($e){$W=path::fuse($W,$e);};
         }
         else
         {
            if($a==='/'){$a='*';}; if($a==='*'){$a='';}; if($a&&!isPath($a)){if(!isPath("/$a")){fail("invalid filename `$a`");}; $a="./$a";};
            if($a){$W=path::fuse($W,$a);};
         };

         $L->rdel($W); if($L->fail){fail($L->fail);}; return true;
      }
   }
# ---------------------------------------------------------------------------------------------------------------------------------------------
