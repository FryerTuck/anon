<?
namespace Anon;


# info :: file : read this
# ---------------------------------------------------------------------------------------------------------------------------------------------
# this file is the base tool-library of any interface; it is used to functions and classes
# ---------------------------------------------------------------------------------------------------------------------------------------------



# shiv :: tools : provide expected functionality
# ---------------------------------------------------------------------------------------------------------------------------------------------
   function spanIs($d,$g=0,$l=0)
   {$s=span($d); $g=($g?$g:0); $l=($l?$l:$s); return (($s>=$g)&&($s<=$l));}

   function is_method($d)
   {
      if(!is_string($d)){return;}; if(strlen($d)<4){return;}; if(!strpos($d,'::')){return;};
      $p=explode('::',$d); $c=$p[0]; $m=$p[1]; $c=(class_exists($c,false)?$c:(class_exists("Anon\\$c",false)?"Anon\\$c":0));
      if(!$c){return;}; return method_exists($c,$m);
   };

   function isFlat($d,$g=null,$l=null)
   {
      if(!is_nokey_array($d)){return false;}; $l=['null','bool','numr','text']; $r=true;
      foreach($d as $i){if(!in_array(type($i),$l)){$r=false;break;};}; return (!is_int($g)?$r:spanIs($d,$g,$l));
   }

   function isDeep($d){return (is_array($d)&&!isFlat($d));}
   function isVoid($d){return ($d===null);}

   function isBool($d){return is_bool($d);}
   function isText($d,$g=null,$l=null){$r=is_string($d); if(!$r){return false;}; return (!is_int($g)?$r:spanIs($d,$g,$l));}
   function isWord($d){return test($d,'/^([a-zA-Z])([a-zA-Z0-9_]){1,36}$/');}
   function isMail($d){return test($d,'/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,4})+$/');}
   function isPass($d){return test($d,'/^(?=(?:.*[A-Z]){1,})(?=(?:.*[a-z]){1,})(?=(?:.*\d){1,})(?=(?:.*[!#$%^*\-_;,.~]){1,})(.{6,24})$/');};

   function isPath($d,$o=null)
   {
      $v=path($d); if(!$v){return false;}; if($o===null){return $v;}; // after this validation, all options need an existing path
      if((crop($v)!=='/')&&!is_dir(dirname($v))){return false;}; $l=is_link($v); if(!$l&&!file_exists($v)){return false;}; // avoids issues
      if(isText($o,3)){$o=[$o];}; if(!is_nokey_array($o)){return;}; // validate single option and options list
      $os=count($o); $of=0; foreach($o as $i) // loop through options list
      {
         if($i===X){$of++;} // already checked if it exists
         elseif(($i===L)&&$l){$of++;} // check link
         elseif(($i===F)&&is_file($v)&&!$l){$of++;} // check file
         elseif(($i===D)&&is_dir($v)&&!$l){$of++;} // check dir
         elseif(($i===R)&&is_readable($v)){$of++;} // check readable
         elseif(($i===W)&&is_writable($v)){$of++;} // check writable
         elseif($i===E)
         {
            $r=''; if(is_link($v)){$r=readlink($v);}elseif(is_file($v)){if(filesize($v)<3){$r=pget($v);}}else{$r=pget($v);};
            if(is_array($r)){$r=implode(' ',$r);}; $r=trim($r); if($r===''){$of++;}; // check empty
         };
      };

      if($os===$of){return $v;}; return false;
   };

   function isPurl($d)
   {
      if(!is_string($d)){return false;}; if($d!==trim($d)){return false;}; $l=strlen($d);
      if(($l<9)||(strlen($d)!==mb_strlen($d))){return false;}; $p=stub($d,['://','::']); if(!$p){return false;};
      if(!isWord($p[0])){return false;}; $p=$p[2]; if(strpos($p,'.')===false){return false;};
      $ci=strpos($p,':'); $ai=strpos($p,'@'); $di=strpos($p,'.'); if(($ci!==false)&&($ai===false)){return false;};
      if(($ci!==false)&&(($ci>$ai)||($ci>$di))){return false;}; if(($ai!==false)&&($ai>$di)){return false;};
      $p=explode('/',$p); $d=$p[0]; $d=explode('@',$d); $d=array_pop($d);  if(strpos($d,'.')===false){return false;};
      $d=swap($d,'.',''); if(test($d,'/^[a-z0-9-]{4,36}$/')){return true;}; if(!test($d,'/^[0-9]{5,12}$/')){return false;};
      if(!is_numeric($d)){return false;}; return true;
   }

   function isFold($d,$g=null,$l=null){$p=isPath($d,D); if(!$p){return;}; return $p;}
   function isFile($d,$g=null,$l=null){$p=isPath($d,F); if(!$p){return;}; return $p;}
   function isLink($d,$g=null,$l=null){$p=isPath($d,L); if(!$p){return;}; return $p;}

   function isRepo($d,$b=null)
   {
      if(!isFold($d)){return;}; if(!isee("$d/.git")){return false;}; try{$r=exec::{"git branch"}($d);}catch(\Exception $e){return false;};
      $r="$r\n"; if(!is_funnic($b)){$b=null;}; if($b){$b=strpos($r,"$b\n"); return (($b===false)?false:$b);}; // check for given branch
      $b=strpos($r,'* '); if($b===false){return false;}; $e=strpos($r,"\n",$b); $r=substr($r,$b,$e); $r=trim($r); $r=ltrim($r,'*');
      $r=trim($r); return $r;
   };

   function repoOf($p)
   {
      if(!isee($p)){return;}; while((strlen($p)>1)&&!isFold("$p/.git")){$p=path::twig($p);};
      if(isRepo($p)){return $p;};
   };

   function isDurl($d,$g=null,$l=null){return (isText($d,20)&&(strpos($d,'data:')===0)&&isin($d,';base64,'));}

   function isFunc($d,$s=null){if(!$s){return is_closure($d);}; $x=function_exists($d); if(!$x){$x=function_exists("Anon\\$d");}; return $x;}
   function isKnob($d,$g=null,$l=null){$r=is_object($d); return (!is_int($g)?$r:spanIs($d,$g,$l));}

   function isNumr($d,$g=null,$l=null){$r=is_number($d); return (!is_int($g)?$r:spanIs($d,$g,$l));}

   function isArra($d,$g=null,$l=null){$r=is_array($d); return (!is_int($g)?$r:spanIs($d,$g,$l));}
   function isAssa($d,$g=null,$l=null){$r=is_assoc_array($d); return (!is_int($g)?$r:spanIs($d,$g,$l));}
   function isAsso($d,$g=null,$l=null){$r=is_assoc_array($d); return (!is_int($g)?$r:spanIs($d,$g,$l));}
   function isNuma($d,$g=null,$l=null){$r=is_nokey_array($d); return (!is_int($g)?$r:spanIs($d,$g,$l));}
   function isList($d,$g=null,$l=null){return isNuma($d,$g,$l);}
# ---------------------------------------------------------------------------------------------------------------------------------------------



# func :: type : returns 4-char data-type
# ---------------------------------------------------------------------------------------------------------------------------------------------
   function type($d)
   {
      if($d===null){return 'null';}; if(($d===true)||($d===false)){return 'bool';}; $t=strtolower(gettype($d));
      if(in_array($t,['integer','double','float'])){return 'numr';} if($t=='object')
      {return (($d instanceof \Closure)?'func':((property_exists($d,'info')&&property_exists($d,'stat'))?'pipe':'knob'));}
      elseif($t=='string'){return 'text';}elseif($t=='array'){return 'list';}elseif($t=='unknown type'){return 'none';}; return substr($t,0,4);
   }
# ---------------------------------------------------------------------------------------------------------------------------------------------



# func :: keys : returns the keys of the given identifier as list -or- null (if not array and not object)
# ---------------------------------------------------------------------------------------------------------------------------------------------
   function keys($d,$h=0)
   {
      if(is_array($d)){return array_keys($d);};if(is_object($d)){$l=array_keys((get_object_vars($d)));$j=get_class_methods($d);
      foreach($j as $k){if(!$h&&strpos($k,'__')===0){continue;}; $l[]=$k;}; return $l;}elseif(is_string($d)&&class_exists($d,false))
      {$j=get_class_methods($d); if(!$j){$j=[];}; $l=array_keys(get_class_vars($d)); foreach($j as $k){$l[]=$k;};}else{$l=[];};
      $r=[]; foreach($l as $i){if(!$h&&strpos($i,'__')===0){continue;}; $r[]=$i;}; return $r;
   }
# ---------------------------------------------------------------------------------------------------------------------------------------------



# func :: vals : returns the values of the given identifier -or- null (if not array and not object) .. $x is item-index
# ---------------------------------------------------------------------------------------------------------------------------------------------
   function vals($d,$x=null)
   {
      if(is_array($d)){$r=array_values($d);}elseif(is_object($d)){$l=keys($d); $r=[]; foreach($l as $k){$r[]=$d->$k;};};
      if(!is_int($x)){return $r;}; $z=count($r); if($x<0){$x=($z+$x);}; if(array_key_exists($x,$r)){return $r[$x];};
   }
# ---------------------------------------------------------------------------------------------------------------------------------------------



# func :: span : returns the number of items in `$d`, func is number of args
# ---------------------------------------------------------------------------------------------------------------------------------------------
   function span($d,$s=null)
   {
      if(($d===null)||($d===false)||($d==='')){return 0;}; $t=type($d);  if($t=='bool'){return 1;};  if($t=='numr'){$t='text'; $d=("$d");};
      if(($t=='text')||($t=='blob')){return ($s?mb_substr_count($d,$s):mb_strlen($d));};
      if(($t=='list')||($t=='knob')||($t=='link')){return count(keys($d));};
      if($t=='func'){$i=(new \ReflectionFunction($d)); return $i->getNumberOfParameters();};
   }
# ---------------------------------------------------------------------------------------------------------------------------------------------



# func :: isin : check if haystack contains needle, case sensitive, works with types: numr,text,tool,list,knob .. returns bool -or null
# ---------------------------------------------------------------------------------------------------------------------------------------------
   function isin($h,$n,$o=AUTO)
   {
      if((span($h)<1)||(span($n)<1)){return false;}; if(is_number($h)){$h="$h";}; if(is_string($h)&&is_number($n)){$n="$n";};
      if(is_string($h)&&is_string($n)){if((strpos($h,'Anon\\')===0)&&is_class($h)){$h=keys($h);}else{return (mb_strpos($h,$n)!==false);};};
      if(is_nokey_array($h)&&(is_string($n)||is_number($n)||is_bool($n)||is_null($n))){return in_array($n,$h,true);};

      if((is_string($h)&&is_nokey_array($n))||(isFlat($h)&&isFlat($n))){$f=0; $t=count($n); foreach($n as $i)
      {$r=isin($h,$i); if($r){$f++;}}; if(!$f){return false;}; if($o!==XACT){return true;}; return (($f/$t)===1);};

      if((is_string($n)||is_number($n))&&(is_array($h)||is_object($h)))
      {if($o===AUTO){$o=(is_nokey_array($h)?VALS:KEYS);}; $h=(($o===VALS)?vals($h):keys($h)); return in_array($n,$h,true);};

      if(isDeep($h)&&isDeep($n)){foreach($h as $hi){foreach($n as $ni){if(mash($hi)===mash($ni)){return true;}}}; return false;};
   }
# ---------------------------------------------------------------------------------------------------------------------------------------------



# func :: dupe : returns a new (duplicate) of something - use with caution
# ---------------------------------------------------------------------------------------------------------------------------------------------
   function dupe($x,$n=null)
   {
      $t=substr(type($x),0,2); if(!$n&&($t!='li')&&($t!='no')){return $x;};
      if($t=='li'){$r=[]; $k=null; $v=null; foreach($x as $k => $v){$r[$k]=dupe($v);}; return $r;};
      if($t=='no'){$r=(clone $x); return $r;}; if(is_number($x)){$x="$x";};
      if(!is_string($x)||($n<1)){return $x;}; $r=''; for($i=0; $i<=$n; $i++){$r.=$x;}; return $r;
   }
# ---------------------------------------------------------------------------------------------------------------------------------------------



# func :: (lpop/rpop/xpop) : short for `array_shift` & `array_pop` & `(rip out by key-or-value)` .. if xpop $n is key/val, else $n is n-times
# ---------------------------------------------------------------------------------------------------------------------------------------------
   function lpop(&$a,$n=1)
   {
      if(!is_array($a)){return;}; if(count($a)<1){return;}; if(!is_int($n)){return;}; if($n<1){return;};
      $r=[]; do{$n--; $r[]=array_shift($a);}while($n>0); return ((count($r)===1)?$r[0]:$r);
   }

   function rpop(&$a,$n=1)
   {
      if(!is_array($a)){return;}; if(count($a)<1){return;}; if(!is_int($n)){return;}; if($n<1){return;};
      $r=[]; do{$n--; $r[]=array_pop($a);}while($n>0); return ((count($r)===1)?$r[0]:$r);
   }

   function xpop(&$a,$n)
   {
      if(!is_array($a)){return;}; $c=count($a); if($c<1){return;}; if(!is_int($n)){$n=array_search($n,$a);}elseif($n<1){$n=($c+$n);};
      if(!is_int($n)){return;}; $a=array_values($a); if(!isset($a[$n])){return;}; $r=$a[$n]; unset($a[$n]); $a=array_values($a); return $r;
   }
# ---------------------------------------------------------------------------------------------------------------------------------------------



# func :: (ladd/radd) : shorthands for `array_unshift` & `..the other thing`
# ---------------------------------------------------------------------------------------------------------------------------------------------
   function ladd(&$a,$i){if(is_array($a)){$r=array_unshift($a,$i); return $r;};}
   function radd(&$a,$i){if(is_array($a)){$a[count($a)]=$i; return count($a);};}
   function xadd(&$a,$i){ } // TODO
# ---------------------------------------------------------------------------------------------------------------------------------------------



# func :: frag : combined fragment tools like `explode, str_split, substr, array_slice`
# ---------------------------------------------------------------------------------------------------------------------------------------------
   function frag($x,$d=null,$i=null)
   {
      if(!is_string($x)&&!is_array($x)){return;}; $s=span($x); if(($s<1)&&($x!=='')){return;};

      if(is_string($x))
      {
         if(($i===null)&&(($d===null)||(is_int($d))||($d===''))){return ((is_int($d)&&($d>1))?str_split($x,$d):str_split($x));};
         if(($i===null)&&is_string($d)){return explode($d,$x);}; if(is_int($i)&&is_int($d)){return mb_substr($x,$d,$i);};
         return;
      };

      if(is_array($r)&&is_int($d)&&is_int($i))
      {
         if($i<0){$i=(count($r)+$i);}; $r=array_slice($r,$d,$i); return $r;
      };
   }
# ---------------------------------------------------------------------------------------------------------------------------------------------



# func :: swap : shorthand for `str_replace` - but can do so in arrays and objects
# ---------------------------------------------------------------------------------------------------------------------------------------------
   function swap($x,$f,$r,$o=KEYS)
   {
      if(is_number($x)){$x="$x";};
      if(is_string($x)){return str_replace($f,$r,$x);}; if(is_array($x)||is_object($x)){$y=(is_array($x)?[]:knob()); foreach($x as $k => $v)
      {if($o===KEYS){$k=swap($k,$f,$r); $z=dupe($v);}else{$z=swap($v,$f,$r);}; if(is_array($x)){$y[$k]=$z;}else{$y->$k=$z;};}; return $y;};
   }
# ---------------------------------------------------------------------------------------------------------------------------------------------



# func :: akin : check if needle is similar to hastack .. as in: "begins-with", "ends-with" or "contains" .. marked with `*`
# ---------------------------------------------------------------------------------------------------------------------------------------------
   function akin($h,$n)
   {
      if(!is_string($h)||!is_string($n)){return;}; if((strlen($h)<1)||(strlen($n)<1)){return;}; if(strpos($n,'*')===false){return ($h===$n);};
      if(strpos($n,'**')!==false){if((substr($n,0,2)==='**')||(substr($n,-2,2)==='**')){return;}};
      if($n==='*'){return true;};if((strlen($n)<2)||($n==='**')){return;}; if(wrapOf($n)==='**'){$n=unwrap($n);return (strpos($h,$n)!==false);};
      if($n[0]==='*'){$n=substr($n,1); $l=strlen($n); $f=substr($h,(0-$l),$l); return ($n===$f);};
      if(substr($n,-1,1)==='*'){$n=substr($n,0,(strlen($n)-2)); $l=strlen($n); $f=substr($h,0,$l); return ($n===$f);};
      if(!strpos($n,'**')){return false;}; $p=explode('**',$n); $b=akin($h,($p[0].'*')); $e=akin($h,('*'.$p[1])); return ($b&&$e);
   }
# ---------------------------------------------------------------------------------------------------------------------------------------------



# func :: scan : get contents of file or fold .. for fold it returns an array in which `$o` matches what to omit
# ---------------------------------------------------------------------------------------------------------------------------------------------
   function scan($p,$o=null)
   {
      if($p==='$'){$p=COREPATH;}else{$p=isee($p);}; if(!$p){return;}; if(is_string($o)){$o=[$o];};
      if(is_dir($p)){$r=array_values(($o?array_diff(scandir($p),['.','..']):pget($p)));}
      else{$r=(is_file($p)?file_get_contents($p):(is_link($p)?readlink($p):null));}

      if(!is_array($o)){return $r;}; if(!is_array($r)){return $r;}; $z=[]; ladd($o,VOID);

      $sh=xpop($o,HIDN); $se=xpop($o,EMPT); $sl=xpop($o,LINK); $sd=xpop($o,FOLD); $sf=xpop($o,FILE); xpop($o,VOID); $sa=rpop($o);
      if($sa==='*'){$sh=1;};
      foreach($r as $i)
      {
         $ih=($i[0]==='.'); if($ih&&!$sh){continue;};
         if($se)
         {
            $ie=0; if(is_link("$p/$i")){$d=trim(readlink("$p/$i"));if($d!==''){$ie=1;};}
            elseif(is_dir("$p/$i")){$d=pget("$p/$i");if(count($d)<1){$ie=1;}}
            else{$s=filesize("$p/$i");if($s<1){$ie=1;}elseif($s<3){$d=trim(pget("$p/$i"));if($d===''){$ie=1;}}};
         };
         if($sl){$il=is_link("$p/$i");}; if($sd){$id=is_dir("$p/$i");}; if($sf){$if=is_file("$p/$i");};
         if($sa){$ia=akin($i,$sa);};
         if
         (
            (!$sh||($sh&&($ih||($sa==='*')))) && (!$se||($se&&$ie)) && (!$sl||($sl&&$il)) &&
            (!$sd||($sd&&$id)) && (!$sf||($sf&&$if)) && (!$sa||($sa&&$ia))
         )
         {$z[]=$i;};
      };
      return $z;
   }
# ---------------------------------------------------------------------------------------------------------------------------------------------



# func :: conf : get/set config relative to path
# ---------------------------------------------------------------------------------------------------------------------------------------------
   function conf($d)
   {
      if(!is_string($d)){return;}; $d=trim($d,'/'); if(strlen($d)<1){return;};
      if(!strpos($d,'/')){$d="/$d/conf";}elseif(!strpos($d,'/conf/')){$p=stub($d,'/'); $d="/$p[0]/conf/$p[2]";}else{$d="/$d";}; $r=pget($d);
      if(!$r){return;}; if(!is_array($r)){$r=dval($r); if(is_assoc_array($r)||(is_array($r)&&!is_nokey_array($r))){$r=knob($r);}; return $r;};
      $z=knob(); foreach($r as $i){$z->$i=conf("$d/$i");}; return $z;
   }
# ---------------------------------------------------------------------------------------------------------------------------------------------



# tool :: test : test a single string with multiple tests -which can also have outcomes/results if test is key and outcome is val
# ---------------------------------------------------------------------------------------------------------------------------------------------
   class test
   {
      static function __callStatic($s,$a)
      {
         if(isset($a[0])&&(is_array($a[0])||is_object($a[0]))){$a=$a[0];}; if(span($a)<1){return;};
         if(is_nokey_array($a)){foreach($a as $t){$r=((wrapOf($t)==='//')?test($s,$t):akin($s,$t)); if($r){return $r;}}; return;};
         foreach($a as $k => $v){$r=((wrapOf($k)==='//')?test($s,$k):akin($s,$k)); if($r){return $v;}}; return;
      }
   }
# ---------------------------------------------------------------------------------------------------------------------------------------------



# func :: indx : returns key/index of $h that contains $n .. returns null if invalid or not-found
# ---------------------------------------------------------------------------------------------------------------------------------------------
   function indx($h,$n=0,$p=0)
   {
      if(!is_int($p)){$p=0;}; if(is_int($n)&&($n<0)){$n=(span($h)+$n);};

      if(is_string($h))
      {
         if(!isset($h[$p])){return;}; if(is_string($n)){$i=mb_strpos($h,$n,$p); return(($i===false)?null:$i);};
         if(is_int($n)){if(!isset($h[$n])){return;}; return mb_substr($h,$n,1); return;};
         if(is_nokey_array($n)){$r=null; do{$i=lpop($n); $x=indx($h,$i,$p); if(is_int($x)){$r=$x;break;}}while(count($n)); return $r;};
      };

      if(is_array($h))
      {
         if(is_string($n)){$r=array_search($n,$h); return (($r===false)?null:$r);};
         if(is_int($n)){$k=array_keys($h); return (isset($k[$n])?$k[$n]:null);}; return;
      };

      if(is_object($h))
      {
         if(is_string($n)){foreach($h as $k => $v){if($v===$n){return $k;};}; return;};
         if(is_int($n)){$k=keys($h); return (isset($k[$n])?$k[$n]:null);}; return;
      };
   }
# ---------------------------------------------------------------------------------------------------------------------------------------------



# func :: expose : extract strings between strings, returns list of extracted strings
# ---------------------------------------------------------------------------------------------------------------------------------------------
   function expose($t,$b,$e)
   {
      if(!is_string($t)||!is_string($b)||!is_string($e)||(mb_strpos($t,$b)===false)||(mb_strpos($t,$e)===false)){return;};
      $r=[]; $m=mb_strlen($b); $n=mb_strlen($e);
      do
      {
         $a=indx($t,$b,0); $i=($a+$m); $z=indx($t,$e,$i); $i++; $z=indx($t,$e,$i);
         if(($a===null)||($z===null)){break;}; $z+=$n; $x=mb_substr($t,($a+$m),($z-$a));
         $r[]=mb_substr($x,0,mb_strpos($x,$e)); $t=mb_substr($t,$z); if($x===false){break;};
      }
      while($t); return $r;
   }
# ---------------------------------------------------------------------------------------------------------------------------------------------



# func :: impose : replace strings between strings by reference
# ---------------------------------------------------------------------------------------------------------------------------------------------
   function impose($z,$b,$e,$v,$u=null)
   {
      $l=expose($z,$b,$e); if(!$l){return $z;}; if(!isKnob($v)){$v=knob();}; foreach($l as $i)
      {
         $f="{$b}{$i}{$e}"; if($u){$i=unwrap($i);}; $vn=is_funnic($i); $pn=isee($i);
         if($pn){$r=import($i,$v); if(isVoid($r)&&isFile($i)){$r=pget($i);}}
         elseif($vn){$r=$v->$i; if($r===null){$r=envi($i); if($r===''){$r=defn($i);}}}
         elseif(isin($i,'('))
         {
            $p=rshave($i,')'); $p=stub($p,'('); $n=$p[0]; $a=trim($p[2]); $a=swap("[$a]",["['","',","']"],['["','",','"]']);
            $a=dval($a); if(isFunc($n,1)){$r=call($n,$a);}
         }
         // elseif(isin($i,'(')){$p=rshave($i,')'); $p=stub($p,'('); $n=$p[0]; $a=$p[2]; $a=dval("[$a]"); if(isFunc($n)){$r=call($n,$a);}}
         else{$r='';};
         if(!is_string($r)){$r=tval($r);}; $z=str_replace($f,$r,$z);
      };
      return $z;
   }
# ---------------------------------------------------------------------------------------------------------------------------------------------



# func :: depose : delete strings between strings - including thre wrap
# ---------------------------------------------------------------------------------------------------------------------------------------------
   function depose($z,$b,$e)
   {
      $l=expose($z,$b,$e); if(!$l){return $z;};
      foreach($l as $i){$f="{$b}{$i}{$e}"; $r=''; $z=str_replace($f,$r,$z);};
      return $z;
   }
# ---------------------------------------------------------------------------------------------------------------------------------------------



# func :: qtFill : fills quoted text with some character
# ---------------------------------------------------------------------------------------------------------------------------------------------
   function qtFill($h,$n='ಠ')
   {
      if(!isText($h,1)||!isText($n,1,1)){return;};
      $qc=['"',"'",'`']; $qx=null; $en=null; $hs=strlen($h); $ns=strlen($n); $rt=''; for($i=0; $i<$hs; $i++)
      {$cc=$h[$i]; $en=($cc==='\\'); if(isin($qc,$cc)){$qx=((($qx===$cc)&&!$en)?null:$cc); $rt.=$cc; continue;}; $rt.=($qx?$n:$cc);};
      return $rt;
   }
# ---------------------------------------------------------------------------------------------------------------------------------------------



# func :: uqIndx : returns index of needle in haystack -in which quoted text is ignored
# ---------------------------------------------------------------------------------------------------------------------------------------------
   function uqIndx($h,$n,$p=0,$t=null)
   {
      if(!isText($h,1)||!isText($n,1)||!is_int($p)||($p<0)){return;};
      if(!$t){$t=qtFill($h);}; $r=mb_strpos($t,$n,$p); return $r;
   }
# ---------------------------------------------------------------------------------------------------------------------------------------------



# func :: bpIndx : returns bracket-pair indices found in haystack .. respects multi-level .. ignores quoted text
# ---------------------------------------------------------------------------------------------------------------------------------------------
   function bpIndx($h,$n,$p=0,$t=null)
   {
      if(!isText($h,1)||!isText($n,2,2)||!isin(['{}','()','[]'],$n)||!is_int($p)||($p<0)){return;}; if(!$t){$t=qtFill($h);};
      if(!isin($t,$n[0])||!isin($t,$n[1])){return;}; $hs=strlen($h); $bl=0; $bs=0; $xb=$n[0]; $xe=$n[1]; $r=[]; for($i=$p; $i<$hs; $i++)
      {
         $cc=mb_substr($t,$i,1); if(($cc!==$xb)&&($cc!==$xe)){continue;}; if($cc==$xb){$bl++;}else{$bl--;};
         if(($cc==$xb)&&($bs===0)&&($bl===1)){$bs=1; $r[]=$i;}elseif(($cc==$xe)&&($bs===1)&&($bl===0)){$r[]=$i; break;};
      };
      return $r;
   }
# ---------------------------------------------------------------------------------------------------------------------------------------------



# func :: blojob : quick-and-dirty closure serialization .. for use as job in another process .. use with caution and care .. because ... STDs
# ---------------------------------------------------------------------------------------------------------------------------------------------
   function blojob($a)
   {
      if(!isFunc($a)){return;}; $i=(new \ReflectionFunction($a)); $p=$i->getFileName();  $b=$i->getStartLine();  $e=$i->getEndLine();
      $t=pget($p); $l=explode("\n",$t); $t=array_slice($l,($b-1),(($e-$b)+1)); $w='function'; $f=$t[0]; $q=qtFill($f); $x=uqIndx($f,$w,0,$q);
      if(uqIndx($f,$w,($x+1),$q)){fail("ambiguous blojob in `$p` on line $b ... shameless");}; $t[0]=mb_substr($f,$x); $t=implode("\n",$t);
      $x=uqIndx($t,'{'); $h=mb_substr($t,0,$x); $b=mb_substr($t,$x); $x=bpIndx($b,'{}'); $b=mb_substr($b,$x[0],(($x[1]-$x[0])+1));
      $r=($h.$b.';'); return $r;
   }
# ---------------------------------------------------------------------------------------------------------------------------------------------



# func :: padded : pad sides of string with string .. 2 args pads both sides with same string .. supports arrays of strings also
# ---------------------------------------------------------------------------------------------------------------------------------------------
   function padded($x,$l,$r=null)
   {
      if(!is_string($x)&&!is_array($x)){return;}; if($r===null){$r=$l;};
      if(is_string($x)){return "{$l}{$v}{$r}";}; foreach($x as $k => $v){$x[$k]="{$l}{$v}{$r}";}; return $x;
   }
# ---------------------------------------------------------------------------------------------------------------------------------------------



# func :: concat : merge arrays or objects
# ---------------------------------------------------------------------------------------------------------------------------------------------
   function concat($a,$b)
   {
      if(is_nokey_array($a)&&is_nokey_array($b)){$r=array_merge($a,$b); return $r;};
      if(is_assoc_array($a)&&(is_assoc_array($b)||isKnob($b))){$r=dupe($a); foreach($a as $k => $v){$r[$k]=$v;}; return $r;};
      if(isKnob($a)&&(is_assoc_array($b)||isKnob($b))){$r=dupe($a); foreach($a as $k => $v){$r->$k=$v;}; return $r;};
   }
# ---------------------------------------------------------------------------------------------------------------------------------------------



# tool :: filter : apply the "select" CRUD filter on array of objects .. returns array
# ---------------------------------------------------------------------------------------------------------------------------------------------
   class filter
   {
      static function limit($d,$f)
      {
         if(!is_array($d)||(count($d)<1)||(is_int($f)&&($f<1))||!is_object($d[0])){return $d;}; // no limit possible
         if(is_int($f)&&($d[0]->levl===null)){return array_slice($d,0,$f);}; // normal slice without levl
         if(isText($f)&&isin($f,':')){$f=knob(dval($f));}; if(!isKnob($f)){return $d;}; // validate

         if($f->levl==='*'){$f->levl=$d[0]->levl;}; if(is_int($f->levl)&&is_int($d[0]->levl)&&($d[0]->levl>$f->levl)){return [];};
         $c=count($d); if(!is_int($f->rows)||($f->rows<1)||($f->rows>=$c)){return $d;};
         return array_slice($d,0,$f->rows);
      }


      static function shape($d,$f)
      {
         if(!is_array($d)||(count($d)<1)||!is_object($d[0])||!isText($f,3)){return $d;}; // no shape possible

         if(span($f,':')===1)
         {
            $p=explode(':',$f); $L=$p[0]; $R=$p[1]; $kl=implode(',',keys($d[0]));
            if(!isin($kl,[$L,$R])){fail("invalid `key:val` shape value `$shp` .. these columns are not in the result");};
            $r=knob(); foreach($d as $i)
            {
               $k=$i->$L; $v=$i->$R; if(is_array($v)&&isset($v[0])&&is_object($v[0])&&isin($v[0],$L)&&isin($v[0],$R)){$v=self::shape($v,$f);};
               $r->$k=$v;
            };
            return $r;
         };

         return $d;
      }
   }



   function filter($l,$f)
   {
      if(!isNuma($l)){fail('expecting 1st arg as auto-numeric array');}; if(isAssa($f)){$f=knob($f,U);};
      if(!isKnob($f)){fail('expecting 2nd arg as associative array -or object');};
      if(count($l)<1){return [];}; $k=keys($l[0]); if(!is_array($k)){fail('expecting 1st arg as list of objects -or assoc-arrays');};
      $k=implode(',',$k); if(($f->fetch==='*')||($f->fetch===null)){$f->fetch=$k;}; if(isText($f->fetch)){$f->fetch=frag($f->fetch,',');};
      if(($f->where!==null)&&!isNuma($f->where)){$f->where=[$f->where];};

      $r=[]; foreach($l as $i)
      {
         if(!isKnob($i)){$i=knob($i);}; $o=knob(); foreach($f->fetch as $c){$o->$c=$i->$c;}; $add=1;
         if($f->where){foreach($f->where as $w){if(!reckon($w,$i)){$add=0;}}; if($add){$r[]=$o;}}else{$r[]=$o;};
      };

      if(count($r)<1){return $r;}; unset($o); $o=$f->order; if(!$o){return $r;}; if(isText($o)){$o=dval($o);}; if(isAssa($o)){$o=knob($o);};
      if(!isKnob($o)){fail('invalid `order` clause');}; $ok=keys($o)[0]; $ov=$o->$ok; if(is_string($ov)){$ov=unwrap(strtolower($ov));};
      if(!isin($ov,['asc','dsc'])){fail('invalid `order` value');}; $rk=keys($r[0]);
      if(!isin($rk,$ok)){fail("cannot order by `$ok` .. it does not exist in the result");}; $o=[]; $z=[]; unset($i,$x);
      foreach($r as $x => $i){$o[$x]=$i->$ok;}; unset($x,$i); asort($o); foreach($o as $x => $i){$z[]=$r[$x];};
      if($ov==='dsc'){$z=array_reverse($z);};

      if($f->limit){$z=filter::limit($z,$f->limit);};
      if($f->shape){$z=filter::shape($z,$f->shape);};
      return $z;
   }
# ---------------------------------------------------------------------------------------------------------------------------------------------



# func :: mash : make-hash from multiple arguments of anything .. uses tval
# ---------------------------------------------------------------------------------------------------------------------------------------------
   function mash()
   {
      $a=func_get_args(); $r=''; foreach($a as $v){$r.=tval($v);}; return hash('sha256',$r);
   }
# ---------------------------------------------------------------------------------------------------------------------------------------------



# tool :: repo : repository tools .. only works with Git
# ---------------------------------------------------------------------------------------------------------------------------------------------
   class repo
   {
      static function create($h,$o=null,$u=null)
      {
         expect::path($h,[R,W,D]); if(isRepo($h)){fail("`$h` is already a repo");}; if(isWord($o)){$t="$u"; $u="$o"; $o="$t";}; // validate
         exec::{"git init ."}($h); if(isText($o)&&isin($o,'/')){exec::{"git remote add origin $o"}($h);}; exec::{"git add --all"}($h);
         $m=0; if(!isWord($u)){$u='master'; $m=TECHMAIL;}; $p=isee("/User/data/$u"); if(!$p){fail("user `$u` is undefined");};
         if(!$m){$m=pget("$p/mail");}; exec::{"git config --local user.name \"$u\""}($h); exec::{"git config --local user.email \"$m\""}($h);
         exec::{"git commit --allow-empty -m \"initial commit\""}($h);
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
         expect::repo($h); $h=rshave($h,'/'); $p="$h/.git/info/exclude"; expect::path($p,[W,F]);
         if(($a!==write)&&($a!==erase)){fail('expecting 2nd arg as either :write: or :erase:');};
         expect::text($i,2); $r=pget($p); $q="\n$i"; if((($a===write)&&isin($r,$q))||(($a===erase)&&!isin($r,$q))){return OK;};
         if($a===write){$r.=$q;}else{$r=swap($r,$q,'');}; path::make($p,$r); return OK;
      }


      static function commit($dir,$msg,$psh=null,$brn=null)
      {
         expect::repo($dir); if(isText($msg)){$msg=trim($msg);}; expect::text($msg,1); $msg=swap($msg,'"','`');
         exec::{'git add --all'}($dir); exec::{"git commit --allow-empty -m \"$msg\""}($dir); if(!$psh){return true;};
         if(!$brn){$brn=self::branch($dir);}elseif(!is_funnic($brn)){fail('invalid branch name');};
         exec::{"git pull origin $brn"}($dir); exec::{"git push origin $brn"}($dir); return true;
      }


      static function update($dir,$brn=null)
      {
         expect::repo($dir); if(!$brn){$brn=self::branch($dir);}elseif(!is_funnic($brn)){fail('invalid branch name');};
         exec::{"git pull origin $brn"}($dir); return true;
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



# tool :: path : plumbing tools
# ---------------------------------------------------------------------------------------------------------------------------------------------
   class path
   {
      static function info($d)
      {
         if(!isText($d,1)){fail('expecting non-empty text');}; $n=null; $h=HOSTNAME; if(path($d)){$d=crop($d); $d="file://{$h}{$d}";};
         if(isin($d,'::')){$s=stub($d,'::'); $d="{$s[0]}://{$h}{$s[2]}";}; $i=knob(parse_url($d)); $p=$i->path; $q=$i->query;
         if(!$i->scheme||!$i->host){fail('expecting valid path-string -or URL-string');}; $x=stub($d,['#','&','?','@',':']);
         if(isin($d,'@')){$x=stub($d,'@')[0]; if(isin($x,['#','&','?'])){fail('invalid URL');}};
         $r=knob(['plug'=>$n,'user'=>$n,'pass'=>$n,'host'=>$n,'path'=>$n,'levl'=>0,'stem'=>$n,'twig'=>$n,'leaf'=>$n,'type'=>$n,'vars'=>$n]);
         $r->plug=$i->scheme; $r->user=$i->user; $r->pass=$i->pass; $r->host=$i->host; $r->path=$p; $r->frag=$n; $s='/'; if($p)
         {$r->levl=span(trim($p,$s),$s); $r->stem=self::stem($p); $r->twig=self::twig($p); $r->leaf=self::leaf($p); $r->type=self::type($p);};
         if($q){parse_str($q,$v); $r->vars=knob($v);}; if($i->fragment){$r->frag=$i->fragment;}; $r->purl=$d;
         if($p){$r->levl=count(explode('/',trim($p,'/')));}; return $r;
      }

      static function size($d,$o=null)
      {
         $p=path($d);  if(!$p){return;}; if(isFile($p)){$r=filesize($p); return round(($r/1024),3);}; if(!isFold($p)){return;};
         $rp=ROOTPATH; $cp=COREPATH; $h=(isin($p,$cp)?$cp:$rp); $t=trim(self::twig($d),'/'); $h="$h/$t"; $f=self::leaf($p);
         if(!file_exists("$h/$f")){return;}; $r=exec::{"du -sb ./$f"}($h); $x=stub($r,[' ',"\t"]); if($x){$r=$x[0];};
         if(isNumr($r,1)){$r=($r*1); return round(($r/1024),3);}; fail("failed to get byte-size of: `$h/$f`");
      }


      static function stem($p)
      {
         if(!is_string($p)){return;}; $v=trim($p,'/'); if(!$v){return;}else{$v=explode('/',$v)[0];}; if(!is_funnic($v)){return;};
         if(!is_dir(path("/$v"))){return;}; $i=self::indx("/$v"); if(!$i){return;}; if(fext("/$v/$i")==='php'){return $v;};
      }


      static function twig($p)
      {
         return twig($p);
      }


      static function leaf($p)
      {
         $p=path($p); if(!$p){return;}; $l=trim($p,'/'); $l=explode('/',$l); $r=rpop($l); return $r;
      }


      static function type($p)
      {
         $b=self::leaf($p); if(!$b){return;}; $x=rstub($b,'.'); $x=($x?$x[2]:'none'); $p=isee($p); if(!$p){return $x;};
         if(is_dir($p)){return 'fold';}; return $x;
      }


      static function levl($p)
      {
         if(!path($p)){return;}; $r=span(trim($p,'/'),'/'); return $r;
      }


      static function fuse($p1,$p2,$dc=true)
      {
         if(!isPath($p1)||!isText($p2,1)){return;}; $p2=trim($p2);
         if(strpos($p2,'..')===0){if($p1==='/'){return '/';}; $h=frag(path($p1),'/'); $p=frag($p2,'/');};
         if(($p2==='')||($p2==='.')||($p2==='/')||($p2==='*')||($p2==='./')||($p2==='./*')||($p2===$p1)){return $p1;};
         if(strpos($p2,'./')===0){$p2=ltrim($p2,'./'); $r="$p1/$p2";}elseif(strpos($p2,'/')===0){$p2=ltrim($p2,'/'); $r="$p1/$p2";}
         elseif(strpos($p2,'..')===0){do{$x=lpop($p); if($x==='..'){rpop($h);}}while($x==='..'); $r=(fuse($h,'/').'/'.fuse($p,'/'));}
         else{$r="$p1/$p2";}; $r=str_replace('//','/',$r); $c=substr($r,0,1); if(!$r||!isin(['/','$','~'],$c)){$r="/$r";};
         if($dc){$r=crop($r);}; return $r;
      }


      static function line($p,$b,$e=null)
      {
         if(!isee($p)){fail("expecting readable path");};  if(isFold($p)){$r=knob(); $l=pget($p); foreach($l as $i)
         {$q=self::line("$p/$i",$b,$e); if(isKnob($q)){foreach($q as $k => $v){$r->$k=$v;}}elseif($q!==null){$r->{"$p/$i"}=$q;}}; return $r;};
         expect::file($p,R); $d=pget($p); if(!isin($d,$b)||($e!==null)&&!isin($d,$e)){return;}; $d=frag($d,"\n");
         if($e===null){foreach($d as $x => $l){if(isin($l,$b)){return ($x+1);}}; return;}; $r=[]; $bx=0; $ex=0; foreach($d as $i => $l)
         {$x=($i+1); $bx=(isin($l,$b)?$x:$bx); $ex=(isin($l,$e)?$x:0); if($bx&&$ex){$r[]=[$bx,$ex]; $bx=0; $ex=0;};};
         return ((span($r)<1)?null:$r);
      }


      static function inic($p)
      {
         if(!isPath($p)){return;}; $h=twig($p); $n=rstub($p,'/')[2];
         $s=rstub($n,'.'); $x=''; if($s){$n=$s[0]; $x=$s[2];}; $s=rstub($n,frag('0123456789',1));
         if(!$s){$i=0;}else{$i=($s[1].$s[2]); if(!is_numeric($i)){return $p;}; $n=$s[0]; $i=($i*1);}; $i+=1;
         return "$h/{$n}{$i}{$x}";
      }


      static function indx($p)
      {
         $p=isee($p); if(!$p){return;}; if(!is_dir($p)){$p=self::twig($p);};
         $c=knob(["name"=>["aard","index","auto"],"type"=>["php","htm","html","js","md"]]);
         $a=[]; foreach($c->name as $cn){foreach($c->type as $ct){$a[]="$cn.$ct";}}; $a[]='README.md';
         $r=null; foreach($a as $n){if(is_file("$p/$n")){$r=$n;break;};}; return $r;
      }


      static function pick()
      {
         $a=func_get_args(); if(isset($a[0])&&is_array($a[0])){$a=$a[0];}; if(count($a)<1){return;}; $r=null;
         do{$i=array_shift($a); if(!is_string($i)){continue;}; $i=('/'.trim($i,'/')); if(isee($i)){$r=$i;break;}}while(count($a)); return $r;
      }


      static function conf($h)
      {
         if(is_funnic($h)){$h="/$h";}; $p=path($h); if(!$p||($p&&!is_dir($p))){return;};
         $c=self::pick("$h/conf","$h/config","$h/settings","$h/cfg","$h/cnf"); return $c;
      }


      static function ctrl($p,$o=null)
      {
         if(!path($p)){return;}; if(($o!==null)&&!path($o)){return;}; $p=crop($p); if(is_string($o)){$o=[$o];}; if(!is_array($o)){$o=[];};
         $o=crop($o); $l=trim($p,'/'); if(!$l){$i=path::indx($p); if(!$i){return;}; $x=fext($i); return (($x==='php')?"/$i":null);};
         $l=explode('/',$l); $r=null; $b='';
         do{$b.=("/".lpop($l)); if(!is_dir(path($b))){$b=self::twig($b);}; $i=path::indx($b); if($i&&(fext("$b/$i")==='php')){$r="$b/$i";};
         if($r&&!in_array($r,$o)){break;}else{$r=null;}}while(count($l)); return $r;
      }


      static function call($p,$o=null,$a=null)
      {
         $p=crop($p); $s=self::stem($p); if(is_class($s)) // if existing class that was already loaded
         {
            $y=stub($p,"/$s/")[2]; if(!$y){return;}; $a=explode('/',$y); $f=lpop($a); if(!is_method("$s::$f")){return;}; // fail
            $r=call("$s::$f",$a); return (($r===null)?true:$r); // call controller .. good
         };

         $x=self::ctrl($p,$o); if(!$x){return;}; if(is_string($o)){$o=[$o];}; if(!is_array($o)){$o=[];}; $o=crop($o); // get controller path
         if(!is_array($a))
         {
            $y=rshave(stub($x,['aard.php','index.php','auto.php'])[0],'/'); $a=trim(str_replace($y,'',$p),'/'); // filter arguments
            $a=((strlen($a)<1)?[]:explode('/',$a)); // make arguments array
         };
         $r=import($x); if(is_closure($r)){return call($r,$a);}; if(!isset($a[0])){return $r;}; // load controller
         $f=lpop($a); if(is_class($r)&&is_method("$r::$f")){return call("$r::$f",$a);}; // call controller method
         if(is_object($r)&&is_closure($r->$f)){return call($r->$f,$a);}; $o[]=$x; $r=self::call($p,$o,$a); // call closure
         return (($r===null)?true:$r);
      }


      static function make($p,$v=null)
      {
         if(!path($p)){return;}; lock::awaits($p); $r=pset($p,$v); lock::remove($p); return (($r===false)?$r:true);
      }


      static function move($pf,$pt)
      {
         $pf=path($pf); $pt=path($pt); if(!$pf||!$pt){fail('expecting 2 paths');}; if(!isee($pf)){fail("`$pf` is undefined");};
         if(isee($pt)){if(!isPath($pt,[D,W])){fail("`$pt` exists and is not a writable folder");}; $pt=rshave($pt,'/'); $pt="$pt/";};
         $r=rename($pf,$pt); return $r;
      }


      static function copy($pf,$pt)
      {
         $pf=path($pf); $pt=path($pt); if(!$pf||!$pt){fail('expecting 2 paths');}; if(!isee($pf)){fail("`$pf` is undefined");};
         if(isee($pt)){if(!isPath($pt,[D,W])){fail("`$pt` exists and is not a writable folder");}; $pt=rshave($pt,'/'); $pt="$pt/";};
         exec::{"cp -R $pf $pt"}(); return true; // will fail if not OK
      }


      static function void($p)
      {
         if(!path($p)){return;}; lock::awaits($p); $r=void($p); lock::remove($p); return $r;
      }


      static function cols()
      {
         $r=['repo','path','name','mime','type','size','time','mode','levl','data'];
         return $r;
      }


      static function scan($q,$gr=null)
      {
         if(isAssa($q)){$q=knob($q,U);}; if(!isKnob($q)){fail('expecting assoc-array or object');}; $qu=$q->using; expect::path($qu,[D,R]);
         $qf=$q->fetch; if(span($qf)<1){return;}; $xc=self::cols(); if($qf==='*'){$qf=vals($xc);}
         elseif(isText($qf)){$qf=swap($qf,' ',''); if(isin($qf,',')){$qf=frag($qf,',');}else{$qf=[$qf];}};
         if(isNuma($qf)){$q->fetch=$qf; unset($qf); $qf=knob(); $em='invalid `fetch`'; foreach($q->fetch as $fi)
         {
            if(is_string($fi)){$fi=swap($fi,' ','');}; if(!isText($fi,1)){fail("$em column name");}; if(!isin($fi,':')){$fi="$fi:$fi";};
            $fp=explode(':',$fi); if(!$fp[0]||!$fp[1]){fail("$em column reference");}; $qf->{"$fp[0]"}=$fp[1];
         }};
         if(!isKnob($qf)){fail("$em parameter");}; $fc=keys($qf); foreach($fc as $cn){if(!isin($xc,$cn)){fail("$em column name");}};

         $qw=$q->where; if($qw&&is_string($qw)){$qw=[$qw];}; $ql=$q->limit;
         if($ql&&(!is_int($ql)||($ql<0))){fail('invalid `limit` parameter');};
         $dl=[]; $fl=[]; $l=pget($qu); if(count($l)<1){return $rl;}; $qu=crop($qu); if(!$gr&&isin($fc,'repo')){$gr=repo::status($qu);};

         if($gr&&!isKnob($gr)){$gr=null;}; if($qu==='/'){$qu='';}; unset($cn); $stop=0; foreach($l as $i)
         {
            if($stop){break;}; $p="$qu/$i"; $o=knob(); $t=(isFile($p)?'file':(isFold($p)?'fold':'link')); foreach($fc as $cn)
            {
               $cv=$qf->$cn; $ok="$cn"; if(is_string($cv)){$ok="$cv";$cv=null;}; $ov=null;
               if($cn==='repo'){$ov=($gr?$gr->$p:null);}elseif($cn==='path'){$ov="$p";}elseif($cn==='name'){$ov="$i";}
               elseif($cn==='type'){$ov=$t;}elseif($cn==='size'){$ov=self::size($p);}
               elseif($cn==='time'){$ii=info($p); $ov=$ii->mtime; unset($ii);}
               elseif($cn==='mode'){$ov=substr(sprintf('%o',fileperms(path($p))),-4);}elseif($cn==='levl'){$ov=lshave($p,'/');}
               elseif($cn==='data'){if(isFile($p)){$ov=pget($p);}elseif(isLink($p)){$ov=readlink(path($p));}else
               {
                  $dd=[]; $df=[]; $dc=pget($p); foreach($dc as $di){if(isFold("$p/$di")){$dd[]=$di;}else{$df[]=$di;}};
                  sort($dd); sort($df); $ov=array_merge($dd,$df); unset($dd,$df,$dc,$di);
               }};
               if(isFunc($cv)){$ov=$cv($ov);}; $o->$ok=$ov;
            };
            $ao=1; if($qw){foreach($qw as $wx){if(!reckon($wx,$o)){$ao=0;break;}};}; if($ql&&(count($rl)>$ql)){$ao=0; $stop=1;};
            if(!$ao){continue;}; if($t=='fold'){$dl[]=$o;}else{$fl[]=$o;};
         };

         $rl=array_merge($dl,$fl); return $rl;
      }


      static function ogle($h,$q=null,$repo=null,$levl=null)
      {
         if(isAssa($h)){$h=knob($h,U);}; if(isKnob($h)){$q=$h; $h=$q->using;};
         expect::path($h,[R,D]); $h=crop($h); $l=pget($h); $d=[]; $f=[]; if(!is_int($levl)||($levl<0)){$levl=0;}; $usr=user();
         if($q==='*'){$q=knob(['fetch'=>self::cols()]);}elseif(isAssa($q)){$q=knob($q,U);}elseif(!isKnob($q)){$q=null;};
         if(!isKnob($repo)){if(!$repo){$repo=knob();}elseif(isPath($repo)){$repo=repo::status($repo);}else{$repo=repo::status($h);}};
         $shp=null; if($levl===0){$shp=$q->shape; unset($q->shape);}; if(isin($q->limit,':')){$q->limit=knob(dval($q->limit));};
         if(isKnob($q)&&($q->fetch==='*')){$q->fetch=self::cols();};
         if(isKnob($q->limit)&&$q->limit->name&&!is_array($q->limit->name)){$q->limit->name=explode(',',swap($q->limit->name,' ',''));};
         $lmtn=null; if(isKnob($q->limit)){$lmtn=$q->limit->name; if(span($lmtn)<1){$lmtn=null;}};
         // if(isKnob($q->limit)&&is_int($q->limit->levl)&&($q->limit->levl<$levl)){return;};
         // $lmtp=[]; $lmtn=[];

         foreach($l as $x => $i)
         {
            // if($lmtn&&(isin($lmtn,"!$i")||(!isin($lmtn,"!$i")&&!isin($lmtn,$i)))){continue;};
            // if($lmtn&&(isin($lmtn,"!$i"))){continue;};
            // if(isKnob($q->limit)&&$q->limit->name){if(isin($q->limit->name,"!$i")){continue;}};
            $p=crop("$h/$i"); $t=(isFile($p)?'file':(isFold($p)?'fold':'link')); $fx=self::type($p); $fs=self::size($p); $mt=mime($p);
            if(isKnob($q->limit)&&$q->limit->type&&!isin($q->limit->type,$t)){continue;};
            $xp=isee($p); $pm=($xp?substr(sprintf('%o',fileperms($xp)),-4):null);
            $o=knob(['repo'=>null,'path'=>$p,'name'=>$i,'mime'=>$mt,'type'=>$t,'size'=>$fs,'time'=>info($p)->mtime,'mode'=>$pm,'levl'=>$levl,'data'=>null]);
            $rpo=null; if(($t==='fold')&&(span($repo)<1)){$rpo=isRepo($p);}; $o->repo=$repo->$p;
            if(!is_readable(path($p))){$o->data=403;}
            elseif($t==='file')
            {
               // if(!$o->repo&&(span($repo)>0)){$o->repo=knob(['flag'=>'UN','user'=>$usr->name,'mail'=>$usr->mail,'time'=>$o->time]);};
               $plg=(($fx==='url')?pget($p):null); if(($fx==='url')&&!isPurl($plg)){$o->mime='text/plain'; $plg=null;};
               if($plg){$o->data=[]; $o->type='plug';}
               elseif(isKnob($q->limit)&&($q->limit->data==='fold')){$o->data=null;}else{$o->data=pget($p);};
            }
            elseif(($t==='fold')&&$q&&$q->fetch&&isin($q->fetch,'data'))
            {
               if($rpo&&(span($repo)<1)){$repo=repo::status($p); $o->repo=knob(['host'=>$repo->host,'head'=>$repo->head]); $repo=$repo->body;};
               if(isKnob($q->limit)&&is_int($q->limit->levl)&&($levl>$q->limit->levl)){$o->data=null;}
               else{$o->data=self::ogle($p,$q,$repo,($levl+1));};
            }
            elseif($t==='link'){$o->data=readlink(path($p));}; if($t==='fold'){$d[]=$o;}else{$f[]=$o;};
         };

         if($q===null){return array_merge($d,$f);}; $d=filter($d,$q); $f=filter($f,$q);
         $r=array_merge($d,$f); if(count($r)<1){return $r;};
         if($q->limit){$r=filter::limit($r,$q->limit);};
         if($shp){$r=filter::shape($r,$shp);};
         return $r;
      }


      static function tree($h)
      {
         expect::fold($h); $h=crop($h); $r=(isRepo($h)?repo::status($h):null); if($r){unset($r->body);}; $n=self::leaf($h); $s=self::size($h);
         $z=knob(['repo'=>$r,'path'=>$h,'name'=>$n,'mime'=>mime($h),'type'=>'fold','size'=>$s,'time'=>info($h)->mtime,'data'=>null]);
         $z->data=self::ogle
         ([
            using => $h,
            fetch => self::cols(),
            limit => 'data:fold',
         ]);
         return $z;
      }


      static function purl($o)
      {
         if(isAssa($o)){$o=knob($o);}; if(!isKnob($o)){fail('expecting :knob:');};
         $r=''; if($o->plug){$r.="$o->plug://";}; if($o->user){$r.="$o->user";}; if($o->pass){$r.=":$o->pass";};
         if($o->host){$r.="@$o->host";}; if($o->path){$r.="$o->path";};
         if($o->vars){$v=[]; foreach($o->vars as $k => $v){$v[]="$k=$v";}; $v=fuse($v,'&'); $r.="?$v";};
         if($o->frag){$r.="#$o->frag";}; return $r;
      }
   }
# ---------------------------------------------------------------------------------------------------------------------------------------------



# func :: mime : returns the mime-type associated with $x
# ---------------------------------------------------------------------------------------------------------------------------------------------
   function mime($x)
   {
      if(!isText($x,1)){return;}; $x=trim($x); if(!$x){return;};
      if(isPath($x)){$x=path::type($x);}elseif(isin($x,'.')){$x=rstub($x,'.')[2]; $x=trim($x); if(!$x){return;}};
      $r=conf('/Proc/mimeType')->$x; return $r;
   }
# ---------------------------------------------------------------------------------------------------------------------------------------------



# func :: durl : returns data-url from file-path .. returns null if invalid-path or not-a-readable-file or no-extension or undefined-mime-type
# ---------------------------------------------------------------------------------------------------------------------------------------------
   function durl($d)
   {
      $p=path($d); $m=mime($p); if(!$p||!$m||!is_readable($p)){return;};
      $r=base64_encode((($m==='inode/directory')?json_encode(scan($d)):scan($d))); return "data:$m;base64,$r";
   }
# ---------------------------------------------------------------------------------------------------------------------------------------------



# func :: furl : reverses durl .. returns an object from data-url with keys: `mime` as mimeType and `data` as binary data
# ---------------------------------------------------------------------------------------------------------------------------------------------
   function furl($d)
   {
      if(!isDurl($d)){return;}; // validate
      $p=stub($d,';base64,'); $d=$p[2]; $m=stub($p[0],'data:')[2]; unset($p); return knob(['mime'=>$m,'data'=>base64_decode($d)]);
   }
# ---------------------------------------------------------------------------------------------------------------------------------------------



# func :: call : use it like: `call("Class::method",[$arg1,$arg2]);` .. or `call(function(){},[$a1,$a2]);` .. or `call("bark",[$a1,$a2]);`
# ---------------------------------------------------------------------------------------------------------------------------------------------
   function call($x,$a=[])
   {
      if(!is_nokey_array($a)){$a=[$a];}; if(is_string($x)&&(strpos($x,'Anon\\')===false)){$x="Anon\\$x";};
      if(is_string($x)&&isin($x,'::')){$p=frag($x,'::'); return call_user_func_array([$p[0],$p[1]],$a);};
      return call_user_func_array($x,$a);
   }
# ---------------------------------------------------------------------------------------------------------------------------------------------



# tool :: expect : assert or die .. works with functions beginning with `is` or `is_`
# ---------------------------------------------------------------------------------------------------------------------------------------------
   class expect
   {
      static function __callStatic($n,$a)
      {
         $n=trim($n); if(!$n){return;}; $lc="is_$n"; $uc=('is'.ucwords($n));
         if(function_exists("Anon\\$uc")){$f="Anon\\$uc";}elseif(function_exists("Anon\\$lc")){$f="Anon\\$lc";}
         elseif(function_exists($lc)){$f=$lc;}else{fail("functions `$uc` and `$lc` are undefined");};
         $r=call_user_func_array($f,$a); if($r){return $r;}; $m="expecting $n";
         if(isset($a[1])&&is_int($a[1])){$m="$m with an item count of between $a[0] and $a[1]";}
         elseif(isset($a[0])&&is_int($a[0])){$m="$m with an item count of at least $a[0]";}
         elseif(($n==='path')&&isset($a[1])&&(isText($a[1])||isNuma($a[1])))
         {
            $p=$a[0]; $a=$a[1]; if(isText($a)){$a=[$a];}; if(!isPath($p)){$p=type($p);}; $m="expecting `$p`"; foreach($a as $i)
            {
               if($i===X){$m="$m as existing path";}
               elseif($i===R){$m="$m as readable path";}
               elseif($i===W){$m="$m as writable path";}
               elseif($i===L){$m="$m as link";}
               elseif($i===F){$m="$m as file";}
               elseif($i===D){$m="$m as folder";}
               elseif($i===E){$m="$m as empty";};
            };
         }
         fail($m);
      }
   }
# ---------------------------------------------------------------------------------------------------------------------------------------------



# func :: ping : returns the ip address of a domain name, or null if unreachable
# ---------------------------------------------------------------------------------------------------------------------------------------------
   function ping($h)
   {
      expect::text($h,5); $r=gethostbyname("$h."); return $r;
   }
# ---------------------------------------------------------------------------------------------------------------------------------------------



# func :: online : check if domain is available .. if none is given then it is implied if `self` is online .. `$t` tries int number of times
# ---------------------------------------------------------------------------------------------------------------------------------------------
   function online($h=null,$t=null)
   {
      if($h===null){$h='example.com';}; if(!is_int($t)||($t<0)||($t>6)){$t=6;};
      $r=ping($h); if($r){return true;}; $t--; if($t<1){return false;}; wait(500); ping($h,$t);
   }
# ---------------------------------------------------------------------------------------------------------------------------------------------



# clan :: module : object
# ---------------------------------------------------------------------------------------------------------------------------------------------
   class module
   {
      function __construct($d=null)
      {
         if(!is_assoc_array($d)){return $this;}; foreach($d as $k => $v)
         {$k=trim($k); if(strlen($k)<1){continue;}; if(is_assoc_array($v)){$v=knob($v);}; $this->$k=$v;};
      }

      function __get($k){return null;}
      function __call($k,$a){if(property_exists($this,$k)){return call_user_func_array($this->$k,$a);};}
   }
# ---------------------------------------------------------------------------------------------------------------------------------------------



# func :: import : if PHP file -then require with vars; else get file contents and impose vars
# ---------------------------------------------------------------------------------------------------------------------------------------------
   function import($a,$v=null,$ni=null)
   {
      if(!is_string($a)){return;}; $p=isee((is_funnic($a)?"/$a":$a)); if(!$p){return;}; if(!is_object($v)){$v=knob($v);};
      if(is_dir($p)){$i=path::indx($p); if($i){$p="$p/$i";}else{return;}}; $x=fext($p); if(!$x){return;}; unset($i);

      if(!in_array($x,['php','htm','js','md','css','txt','html','json'])){return;};
      if(!defn('CTRLKEYS')){$y=conf('/User/viewConf'); defn(['CTRLKEYS'=>$y->toggleUserPanl]);};
      if($x!=='php') // htm js md txt json
      {
         $z=pget($p); $z=impose($z,'<!--[',']--->',$v); $z=impose($z,'/*{:',':}*/',$v,1); $z=impose($z,'{:',':}',$v,1);
         return $z;
      };

      $x=call_user_func_array(function($_PATH,$_VARS)
      {
         foreach($_VARS as $k => $v){$$k=$v;}; unset($k,$v); ob_start(); require($_PATH); $l=get_defined_vars(); $r=trim(ob_get_clean());
         foreach($l as $k => $v){if(($k=='_PATH')||($k=='_VARS')||property_exists($_VARS,$k)){unset($l[$k]);};}; return ['V'=>$l,'T'=>$r];
      },[$p,$v]);

      if($x['T']){return $x['T'];}; // the PHP script printed some stuff, it probably wanted to do that, we're done then
      $a=lshave($a,'/'); $a=rshave($a,'/aard.php'); if(isin($a,'/')){$a=rshave($a,'/index.php');}; $c="Anon\\$a"; if(!is_class($c)){$c=null;};

      if(isset($x['V']['export'])){$r=$x['V']['export']; if(is_class($r)&&!$c){$c="Anon\\$r"; unset($x['V']['export']);}else{return $r;};};
      if($c){if(isin($c,'meta')&&!$c::$meta){$c::$meta=knob();}; if(is_method("$c::__init")&&!$ni){call("$c::__init");}; return $c;};
      if(span($x['V'])>0){return (new module($x['V']));}; return true;
   }
# ---------------------------------------------------------------------------------------------------------------------------------------------
