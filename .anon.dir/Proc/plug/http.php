<?
namespace Anon;



# tool :: http_plug : http requests using cURL
# ---------------------------------------------------------------------------------------------------------------------------------------------
   class http_plug
   {
      public $mean=null;
      public $link=null;
      public $fail=null;
      public $cols=['repo','path','name','mime','type','size','time','mode','levl','data'];



      function __construct($x)
      {
         if(!$x->port){$x->port=80;}; $this->mean=$x;
      }



      function __destruct()
      {
         $this->pacify();
      }



      function __call($n,$a)
      {
         return call($this->$n,$a);
      }



      function __get($n)
      {
         return;
      }


      function adjure($a)
      {
          $L=$this->vivify(); $I=$this->mean; if(isAsso($a)){$a=knob($a);};
          $cnf = conf("Proc/autoConf");

          $co=knob
          ([
              'TIMEOUT' => $cnf->httpTime,
              'HEADER' => true,
              'RETURNTRANSFER' => true,
              'SSL_VERIFYPEER' => false,
              'USERAGENT' => envi('USER_AGENT'),
              'REFERER' => envi('REFERER'),
              'URL' => $I->purl,
          ]);
          if(isKnob($a->using)){foreach($a->using as $ck => $cv){$co->$ck=$cv;}}; unset($ck,$cv);
          $ca=[]; foreach($co as $ck => $cv){$ck=lshave($ck,'CURLOPT_'); $ca[constant("CURLOPT_{$ck}")]=$cv;};
          curl_setopt_array($L,$ca);

          $ho=knob();
          if(isKnob($a->param)){foreach($a->param as $hk => $hv){$ho->$hk=$hv;}}; unset($hk,$hv);
          $ha=[]; foreach($ho as $hk => $hv){$ha[]="$hk: $hv";}; curl_setopt($L,CURLOPT_HTTPHEADER,$ha);

          $r=curl_exec($L); $e=null; if(!$r){$x=curl_error($L); if($x){$e=$x;}};

          if($e)
          {
              $this->pacify();
              return knob(["fail"=>$e]);
          };

          $i=curl_getinfo($L); $this->pacify(); $d="\r\n\r\n"; $s=stub($r,$d);
          if($s&&isin($s[0],'100 Continue')){$s=stub($s[2],$d);};
          $b=$s[2]; $l=frag(trim($s[0]),"\n"); $h=knob(); $pf=$co->POSTFIELDS;
          foreach($l as $q)
          {
              $y=stub($q,': '); if(!$y){continue;}; $k=$y[0]; if(!$k){continue;};
              $v=(isin($y[2],[':',','])?$y[2]:dval($y[2])); $h->$k=$v;
          };

          $r=knob(['sent'=>['head'=>$ho,'body'=>$pf],'info'=>$i,'head'=>$h,'body'=>$b]); return $r;
      }



      function vivify()
      {
          if($this->link){return $this->link;}; $this->link=curl_init();
          return $this->link;
      }



      function pacify()
      {
          if(!$this->link){return;}; curl_close($this->link); $this->link=null;
      }



      function exists()
      {
      }



      function select($a='*')
      {
          if($a==='*'){$a=[fetch=>'*'];}; expect::{'asso knob'}($a); if(isAsso($a)){$a=knob($a,1);}; // prep
          if(!$a->fetch){$a->fetch='*';};

          if($a->fetch==='*'){$r=$this->adjure($a); return $r;};
          todo("http plug :: select anything else than *");
      }



      function update($a)
      {
      }



      function insert($a)
      {
          expect::{'asso knob'}($a); if(isAsso($a)){$a=knob($a,1);}; // prep
          if(!$a->write){$a=knob(['write'=>$a]);}; if(!$a->using){$a->using=knob();};
          $pd=json_decode(json_encode($a->write),true); unset($a->write); $qp=$a->param; $mt='application/json';
          if(isDeep($pd)){$pd=((isKnob($qp)&&($qp->{'Content-Type'}===$mt))?json_encode($pd):http_build_query($pd));};
          $a->using->POSTFIELDS=$pd; $r=$this->adjure($a);
          $this->pacify(); return $r;
      }



      function delete($a)
      {
      }
   }
# ---------------------------------------------------------------------------------------------------------------------------------------------
