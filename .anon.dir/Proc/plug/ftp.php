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



      function vivify()
      {
         if($this->link){return $this->link;}; $I=$this->mean; $L=(new ftp($I->host,$I->port,$I->user,$I->pass));
         if($L->fail){fail($L->fail);}; $L->pasv(true); $this->link=$L; if(!$I->path){return $this->link;};

         $L->chdir($I->path); if(!$L->fail){$this->mean->type='fold'; return $this->link;}; $F=$L->fail;

         if(isin($F,'No such file or directory'))
         {
            $s=$L->size($I->path); if($s<0){fail($F);}; $L->fail=null;
            $L->chdir(path::twig($I->path)); if($L->fail){fail($L->fail);};
            $this->mean->type='file';
         };

         return $this->link;
      }



      function pacify()
      {
         if($this->link){$this->link->close(); $this->link=null; return true;};
      }



      function select($a)
      {
         $L=$this->vivify(); $I=$this->mean; $P=$I->path;

         if($I->type==='fold')
         {
            $D=$L->mlsd('.'); if($L->fail){fail($L->fail);}; $R=[]; foreach($D as $i)
            {
               if(substr($i['name'],0,1)==='.'){continue;}; $n=null; $p=("$P/".$i['name']); $t=$i['type']; if($t==='dir'){$t='fold';};
               $z=path::levl($p); $m=(($t=='fold')?mime($t):mime($p)); $s=(isset($i['size'])?$i['size']:null); $q=strtotime($i['modify']);
               $x=$i['UNIX.mode']; $o=knob
               ([
                  'repo'=>$n,'path'=>$p,'name'=>$i['name'],'mime'=>$m,'type'=>$t,'size'=>$s,'time'=>$q,'mode'=>$x,'levl'=>$z,'data'=>$n
               ]);
               if($t=='fold'){$o->data=[];}; $R[]=$o;
            };
         }
         else
         {
            $R=$L->read(path::leaf($P)); if($L->fail){fail($L->fail);};
         }


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
   }
# ---------------------------------------------------------------------------------------------------------------------------------------------
