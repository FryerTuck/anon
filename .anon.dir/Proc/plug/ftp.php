<?
namespace Anon;


// require_once(path('$/Proc/libs/ftp/ftp.php'));


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
         if($this->link){return $this->link;}; $I=$this->mean; $S=(($I->port===21)?false:true);
         $L=(new ftp($I->host,$I->port,$I->user,$I->pass,$S)); if($L->fail){fail($L->fail);};
         // $L->set_option(FTP_USEPASVADDRESS,false);
         $L->pasv(true);
         $this->link=$L;
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
            $A=0; $T=[]; $R=[]; $dl=[]; $fl=[]; $D=$L->mlsd('.');
            if(!$D||$L->fail){$L->fail=null; $D=$L->nlist('.'); if($L->fail){fail($L->fail);return;}; $A=1;};

            if($A){fail("FTP_plug .. dir listing via nlist succeeded mlsd .. this needs filtering");};

            foreach($D as $i)
            {
               if(substr($i['name'],0,1)==='.'){continue;}; $n=null; $p=("$P/".$i['name']); $t=$i['type']; if($t==='dir'){$t='fold';};
               $m=(($t=='fold')?mime($t):mime($p)); if(isin($t,'link')){$t='link'; $m='link/resource';};
               $z=path::levl($p); $s=(isset($i['size'])?$i['size']:null); $q=strtotime($i['modify']);
               $x=$i['UNIX.mode']; $o=knob
               ([
                  'repo'=>$n,'path'=>$p,'name'=>$i['name'],'mime'=>$m,'type'=>$t,'size'=>$s,'time'=>$q,'mode'=>$x,'levl'=>$z,'data'=>$n
               ]);
               $lcn = lowerCase($i['name']);
               if($t=='fold'){$o->data=[]; $dl[]=$lcn;}else{$fl[]=$lcn;};
               $T[]=$o;
            };

            sort($dl);  sort($fl);  $Q = array_merge($dl,$fl);
            foreach($Q as $Qi)
            {
                $fnd = null;
                foreach($T as $Ti)
                {
                    if ($fnd){ break; };
                    if (lowerCase($Ti->name) !== $Qi){ continue; };
                    $R[]=$Ti; $fnd=true;
                };
            };
         }
         else
         {
            $pt=path::twig($P); $fn=path::leaf($P); $L->chdir($pt);
            $R=$L->read($fn); if($L->fail){fail($L->fail);};
         };


         if($a==='*'){return $R;};
      }



      function update($a)
      {
         $L=$this->vivify(); $I=$this->mean; $P=$I->path;

         if(isText($a))
         {
            $L->write($P,$a); if($L->fail){fail($L->fail);};
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



      function delete($a='*',$deja=0)
      {
         $L=$this->vivify(false); $I=$this->mean; $P=$I->path; if(isAssa($a)){$a=knob($a,U);}; if(span($a)<1){return;};
         $W=(isPath($P)?$P:'/'); $n=['*','.','/','./','/*','./*'];


         if(isText($a))
         {
            if($a===""){return;}; if(isin($n,$a)){$a="";};
            if(($a!=="")&&!isPath($a)){if(!isPath("/$a")){fail::ftpPlug("invalid filename `$a`");}; $a="./$a";};
            if(($a!=="")&&!$deja){$W=path::fuse($W,$a);}else{$W="$a";};
            $L->rdel($W); $f=$L->fail; if($f&&!isin($f,['o such file or dir'])){fail::ftpPlug($f); exit;};
            return true;
         };


         if(isNuma($a))
         {
             $r=true; foreach($a as $i){$d=path::fuse($W,$i); $r=$this->delete($d,1); if(!$r){break;}};
             if(!$r){$f=$L->fail; fail::ftpPlug($f?$f:"unknown error"); exit;};
             return $r;
         };


         if(isKnob($a))
         {
            $u=$a->using; $e=$a->erase; if(span($e)<1){return;}; if(!isNuma($e)){$e=[$e];};
            if(span($u)<1){$u=null;}; if(($u!==null)&&!isText($u)){fail::ftpPlug('invalid `using` clause'); exit;};
            if(($u!==null)&&!isPath($u)&&!isPath("/$u")){fail::ftpPlug('invalid `using` clause'); exit;};
            if(($u!==null)&&!isPath($u)&&!arg($u)->startsWith('./')){$u="./$u";}; $f=0; $r=true;
            foreach($e as $i)
            {
                if(!isText($i,1)){continue;}; if($f||!$r){break;}; // nothing to do
                $x=isin($n,$i); if(!$x&&!isPath($i)&&!isPath("/$i")){$f='invalid `erase` clause'; break;};
                $i="./$i"; $d="$W"; if($u!==null){$d=path::fuse($d,$u);};
                if(!$x){$d=path::fuse($d,$i);}; $r=$this->delete($d,1);
            };
            if($f||!$r){fail::ftpPlug($f?$f:$L->fail); exit;};
            return true;
         };


         fail::ftpPlug('expecting any: text, numa, knob');
      }
   }
# ---------------------------------------------------------------------------------------------------------------------------------------------
