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
      if(!is_nokey_array($d)){return false;}; if(count($d)<1){return true;}; $l=['null','bool','numr','text'];
      $r=true; foreach($d as $i){if(!in_array(type($i),$l)){$r=false;break;};};
      return (!is_int($g)?$r:spanIs($d,$g,$l));
   }

   function isDeep($d){return (is_array($d)&&!isFlat($d));}
   function isVoid($d){return ($d===null);}

   function isBool($d){return is_bool($d);}
   function isText($d,$g=null,$l=null){$r=is_string($d); if(!$r){return false;}; return (!is_int($g)?$r:spanIs($d,$g,$l));}
   function isWord($d){return test($d,'/^([a-zA-Z])([a-zA-Z0-9_]){1,36}$/');}
   function isMail($d){return test($d,'/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,4})+$/');}

   function isPass($d,$g=null,$l=null)
   {
       if(!$g){$g=6;}; if(!$l){$l=32;}; if(!isText($d,$g,$l)){return false;};
       if(!test($d,'/[a-z]/')||!test($d,'/[A-Z]/')||!test($d,'/[0-9]/')){return false;};
       $sc=str_split('`~!#$%^*()_-+=[]\/|{};,<>'); return (isin($d,$sc)?true:false);
   };

   function isPath($d,$o=null)
   {
      $v=path($d); if(!$v){return false;}; if($o===null){return $v;}; // after this validation, all options need an existing path
      $l=null; $x=null; $x=isee($v); if(!$x){return false;}; $l=is_link($x); // avoid issues here
      if((crop($v)!=='/')&&!is_dir(dirname($v))){return false;};
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
            $r=''; if(is_link($v)){$r=readlink($v);}elseif(is_file($v)){if(filesize($v)<3){$r=pget($v);}}else{$r=pget($v,0);};
            if(is_array($r)){$r=implode(' ',$r);}; $r=trim($r); if($r===''){$of++;}; // check empty
         };
      };

      if($os===$of){return $v;}; return false;
   };

   function isPurl($d)
   {
      if(!is_string($d)){return false;}; if($d!==trim($d)){return false;}; $l=strlen($d);
      if(($l<9)||(strlen($d)!==mb_strlen($d))){return false;}; if(!isin($d,['://','::'])){return false;};
      return isKnob(path::info($d,0));
   }

   function isPlug($d){return isPurl($d);}

   function isJson($d,$g=null,$l=null)
   {
       if(!isText($d,$g,$l)){return false;};
       try{$r=json_decode($d); return $r;}catch(\Exception $e){return;};
   };

   function isFold($d,$g=null,$l=null){$p=isPath($d,D); if(!$p){return;}; return $p;}
   function isFile($d,$g=null,$l=null){$p=isPath($d,F); if(!$p){return;}; return $p;}
   function isLink($d,$g=null,$l=null){$p=isPath($d,L); if(!$p){return;}; return $p;}

   function isRepo($d,$b=null)
   {
      if(!isFold($d)){return;}; $dp=(isee("$d/.git")?"$d/.git":$d); if(!isee("$dp/info/exclude")){return false;};
      if(($b===null)&&(fext($d)==="git")){return BARE;}; try{$r=exec::{"git branch"}($d);}catch(\Exception $e){return false;};
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
   function isInum($d,$g=null,$l=null){$r=is_int($d); return (!is_int($g)?$r:spanIs($d,$g,$l));}

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
      if(!is_string($x)||($n<1)){return $x;}; $r=''; for($i=0; $i<$n; $i++){$r.=$x;}; return $r;
   }
# ---------------------------------------------------------------------------------------------------------------------------------------------



# func :: listOf : returns numeric-key array of given argument -only if it's not already
# ---------------------------------------------------------------------------------------------------------------------------------------------
   function listOf($a)
   {
      return (isNuma($a)?$a:[$a]);
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



# func :: xord : re-order numeric-key-array alpha-numerically, optionally make sure the result starts with and in order of `$b`
# ---------------------------------------------------------------------------------------------------------------------------------------------
    function xord($q,$b=null)
    {
        expect::numa($q); if(count($q)<1){return [];}; // empty
        $a=dupe($q); sort($a); if(span($b)<1){return $a;}; // normal
        $o=dupe($b); if(isText($o)){$o=dval($o); if(isText($o)){$o=[$o];}; }elseif(isKnob($o)){$o=((array)$o);}; // normalize
        if(isAsso($o)){$o=array_flip($o); ksort($o); $o=array_values($o);}; expect::numa($o); $r=[]; // ready
        foreach($o as $s){if(isin($a,$s)){$r[]=xpop($a,$s);}}; $r=array_merge($r,$a); // done
        return $r;
    }
# ---------------------------------------------------------------------------------------------------------------------------------------------



# func :: frag : combined fragment tools like `explode, str_split, substr, array_slice`
# ---------------------------------------------------------------------------------------------------------------------------------------------
   function frag($x,$d=null,$i=null)
   {
      if(!is_string($x)&&!is_array($x)){return;}; $s=span($x); if(($s<1)&&($x!=='')){return;};

      if(is_string($x))
      {
         if(is_int($d)&&is_int($i)){if($i<$d){return;}; return mb_substr($x,$d,($i-$d));};
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



# func :: flip : swap values for keys and keys for values
# ---------------------------------------------------------------------------------------------------------------------------------------------
   function flip($x,$d=null,$i=null)
   {
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



# func :: pick : look in haystack and return the first item found in needle
# ---------------------------------------------------------------------------------------------------------------------------------------------
   function pick($h,$n)
   {
      if(!$h){return;}; expect::flat($n,1);
      foreach($n as $i)
      {
          if(strpos($i,'*')!==false){if(span(akin($h,$i))>0){return $i;};continue;};
          if(isin($h,$i)){return $i;};
      };
   }
# ---------------------------------------------------------------------------------------------------------------------------------------------



# func :: akin : check if needle is similar to hastack .. as in: "begins-with", "ends-with" or "contains" .. marked with `*`
# ---------------------------------------------------------------------------------------------------------------------------------------------
   function akin($h,$n)
   {
      if(isFlat($h)){$r=[]; foreach($h as $i){if(akin($i,$n)){radd($r,$i);}}; return $r;};
      if(!is_string($h)||!is_string($n)){return;}; if((strlen($h)<1)||(strlen($n)<1)){return;}; if(strpos($n,'*')===false){return ($h===$n);};
      if(strpos($n,'**')!==false){if((substr($n,0,2)==='**')||(substr($n,-2,2)==='**')){return;}};
      if($n==='*'){return true;};if((strlen($n)<2)||($n==='**')){return;}; if(wrapOf($n)==='**'){$n=unwrap($n);return (strpos($h,$n)!==false);};
      if($n[0]==='*'){$n=substr($n,1); $l=strlen($n); $f=substr($h,(0-$l),$l); return ($n===$f);};
      if(substr($n,-1,1)==='*'){$n=substr($n,0,(strlen($n)-2)); $l=strlen($n); $f=substr($h,0,$l); return ($n===$f);};
      if(!strpos($n,'**')){return false;}; $p=explode('**',$n); $b=akin($h,($p[0].'*')); $e=akin($h,('*'.$p[1])); return ($b&&$e);
   }
# ---------------------------------------------------------------------------------------------------------------------------------------------



# func :: scan : shorthand for path::xume .. used for uniformity in path-search expressions
# ---------------------------------------------------------------------------------------------------------------------------------------------
   function scan($q,$o=null)
   {
      if(!is_string($q)){return;}; $q=trim($q); if(strlen($q)<1){return;};
      $c=frst($q); $h=path(isin('~$',$c)?$c:'/'); $q=lshave($q,'$'); $q=shaved($q,'/');
      $q=swap($q,'//','/'); $q=swap($q,'**','*'); $q=swap($q,['/.*/','/*.*/'],'/*/');
      if(!isFlat($o)){$o=(isText($o,1)?[$o]:[]);}; $r=path::xume($h,$q,$o);
      return (is_array($r)?$r:[]);
   }
# ---------------------------------------------------------------------------------------------------------------------------------------------



// func :: bore : get/set/rip keys of objects by path reference
// --------------------------------------------------------------------------------------------------------------------------------------------
   function bore($o,$p,$v=null)
   {
      if(isAsso($o)){$o=knob($o);}; $k=shaved($p,"/"); // prep
      if(!isKnob($o,1)||!isText($k,1)){return $o;}; // invalid/undefined
      $l=explode("/",$k); $r=dupe($o);

      if($v===null) // get
      {
          if(isin(keys($o),$p)){return $o->$p;}; // whole path is key
          do{$i=array_shift($l); $r=$r->$i; if(!isKnob($r)){break;}}while(count($l)); return $r;
      };

      if($v!==VOID){todo("bore :: make set available");};
      todo("bore :: make rip available");
  };
// --------------------------------------------------------------------------------------------------------------------------------------------



# tool :: conf : get/set config relative to stem/path
# ---------------------------------------------------------------------------------------------------------------------------------------------
   class conf
   {
      private static $meta=[];
      static function __callStatic($n,$a)
      {
         $n=trim($n); $n=shaved($n,"/"); if(strlen($n)<3){return;}; $a=(isset($a[0])?$a[0]:null);
         $s=stub($n,"/"); $f=null; $b=null; if($s){$f=$s[2]; $s=$s[0];}else{$s=$n;};
         if($f){$b=stub($f,"/"); if($b){$f=$b[0]; $b=$b[2];}}; if(is_assoc_array($a)){$a=knob($a);};

         if(!isKnob($a))
         {
             $p=($f?"/$s/conf/$f":"/$s/conf");
             if(isset(self::$meta[$p])){$r=self::$meta[$p]; return ($b?bore($r,$b):$r);}; // cache & bore
             $q=pget($p); if($q===null){return;}; // undefined
             if(is_string($q)) //file
             {
                 $r=dval($q); if(is_assoc_array($r)){$r=knob($r);};
                 self::$meta[$p]=dupe($r); return ($b?bore($r,$b):$r);
             };
             if(!is_array($q)){return;}; $r=knob(); // folder
             foreach($q as $i){$r->$i=dval(pget("$p/$i")); if(is_assoc_array($r->$i)){$r->$i=knob($r->$i);}};
             self::$meta[$p]=dupe($r); return ($b?bore($r,$b):$r);
         };

         if(!isFold("/$s/conf")){fail::reference("expecting `/$s/conf` as folder"); exit;};
         self::$meta[$n]=dupe($a); if($f){$a=knob([$f=>$a]);};
         foreach($a as $k => $nd)
         {
             $fp="/$s/conf/$f"; $xd=dval(pget($fp)); if(is_assoc_array($xd)){$xd=knob($xd);};
             if(is_assoc_array($nd)){$nd=knob($nd);};
             if(isKnob($xd)&&isKnob($nd)){foreach($nd as $nk => $nv){$xd->$nk=$nv;}; $nd=$xd;};
             pset($fp,tval($nd));
         };

         return OK;
      }
   }
# ---------------------------------------------------------------------------------------------------------------------------------------------



# func :: conf : get/set config relative to path
# ---------------------------------------------------------------------------------------------------------------------------------------------
   function conf($d)
   {
       if(is_string($d)){return conf::{"$d"}();};
   }

   function enconf($d)
   {
       if(isText($d,1)&&isPath("/$d")){$d=conf($d);}
       return encode::b64(tval($d));
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
         if(!isAsso($a)&&!isKnob($a)){return;};
         foreach($a as $k => $v){$r=((wrapOf($k)==='//')?test($s,$k):akin($s,$k)); if($r){return $v;}}; return;
      }
   }
# ---------------------------------------------------------------------------------------------------------------------------------------------



# tool :: vars : immutable blobal variables
# ---------------------------------------------------------------------------------------------------------------------------------------------
    class vars
    {
        private static $meta;

        static function init()
        {
            self::$meta=knob();
        }

        static function get($d)
        {
            if($d==='*'){return self::$meta;};
            return bore(self::$meta,$d);
        }

        static function set($k,$v)
        {
            if(!isText($k,1)){return;}; // invalid
            if(span(self::$meta->$k)>0){return;}; // denied
            self::$meta->$k=$v; return true;
        }
    }

    function vars($d)
    {
        if(is_string($d)){return vars::get($d);};
        if(is_assoc_array($d)){$d=knob($d);};
        if(!is_object($d)){return;};
        foreach($d as $k => $v){vars::set($k,$v);};
    }

    vars::init();
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
         $a=indx($t,$b,0); $i=($a+$m+0); $z=indx($t,$e,$i);
         if(($a===null)||($z===null)){break;}; $z+=$n; $x=mb_substr($t,($a+$m),($z-$a));
         $r[]=mb_substr($x,0,mb_strpos($x,$e)); $t=mb_substr($t,$z); if($x===false){break;};
      }
      while($t); return $r;
   }
# ---------------------------------------------------------------------------------------------------------------------------------------------



# func :: impose : replace strings between strings by reference
# ---------------------------------------------------------------------------------------------------------------------------------------------
   function impose($z,$b,$e,$v=null,$u=null)
   {
      $l=expose($z,$b,$e); if(!$l){return $z;};
      if(is_assoc_array($v)){$v=knob($v);}elseif(!isKnob($v)){$v=knob();};
      foreach($l as $i)
      {
         $f="{$b}{$i}{$e}"; $i=trim($i); if($u){$i=unwrap($i);}; $vn=is_funnic($i); $pn=isee($i);
         if($pn){$r=import($i,$v); if(isVoid($r)&&isFile($i)){$r=pget($i);}}
         elseif($vn){$r=$v->$i; if($r===null){$r=envi($i); if($r===''){$r=defn($i);}}}
         elseif(isin($i,'('))
         {
            $p=rshave($i,')'); $p=stub($p,'('); $n=trim($p[0]); $a=trim($p[2]); $a=lshave($a,'(');
            // $a=swap("[$a]",["['","',","']"],['["','",','"]']); // fix array args
            if(!isText($n,1)){continue;}; $a=dval($a); if(isin(["''",'""','``'],wrapOf($a))){$a=unwrap($a);};
            if(isPath($a)){vars::set($a,$v);}; $r=call($n,$a);
            if(isin($r,$b)&&isin($r,$e)){$r=impose($r,$b,$e,$v,$u);};
         }
         else{$r='';};
         if(!is_string($r)){$r=tval($r);}; $z=str_replace($f,$r,$z);
      };
      return $z;
   }
# ---------------------------------------------------------------------------------------------------------------------------------------------



# func :: depose : delete strings between strings - including thre wrap
# ---------------------------------------------------------------------------------------------------------------------------------------------
   function depose($z,$b,$e,$r='')
   {
      $l=expose($z,$b,$e); if(!$l){return $z;};
      foreach($l as $i){$f="{$b}{$i}{$e}"; $z=str_replace($f,$r,$z);};
      return $z;
   }
# ---------------------------------------------------------------------------------------------------------------------------------------------



# func :: redact : replace characters between strings with other characters .. string length remains the same
# ---------------------------------------------------------------------------------------------------------------------------------------------
   function redact($t,$b,$e,$r='█')
   {
      $z="$t"; if((span($b)===1)&&($b===$e)){$t=str_replace("\\$b",($r.$r),$z); unset($z); $z="$t";};
      $l=expose($t,$b,$e); if(!$l){return $t;}; foreach($l as $i)
      {
          $f=($b.$i.$e); $n=($b.dupe($r,mb_strlen($i)).$e);
          $z=explode("$f",$z); $z=implode("$n",$z);
      };
      return $z;
   }
# ---------------------------------------------------------------------------------------------------------------------------------------------



# func :: bpIndx : returns bracket-pair indices found in haystack .. respects multi-level .. ignores quoted text
# ---------------------------------------------------------------------------------------------------------------------------------------------
   function bpIndx($h,$n,$p=0)
   {
      if(!isText($h,1)||!isText($n,2,2)||!isin(['{}','()','[]','<>'],$n)||!is_int($p)||($p<0)){return;};
      $hs=mb_strlen($h); $bl=0; $bs=0; $xb=$n[0]; $xe=$n[1]; $r=[]; if(!isin($h,$xb)||!isin($h,$xe)){return;};
      for($i=$p; $i<$hs; $i++)
      {
         $cc=mb_substr($h,$i,1);
         if($cc===$xb){$bl++; if($bl===1){$r[]=$i;}; continue;};
         if($cc===$xe){$bl--; if($bl===0){$r[]=$i; break;}};
      };
      return $r;
   }
# ---------------------------------------------------------------------------------------------------------------------------------------------



# func :: blojob : quick-and-dirty function-to-string .. for use as job in another process .. use with care and caution .. because ... STDs
# ---------------------------------------------------------------------------------------------------------------------------------------------
   function blojob($a)
   {
      if(!isFunc($a)){return;}; $i=(new \ReflectionFunction($a)); $p=$i->getFileName(); $b=$i->getStartLine(); $e=$i->getEndLine();
      $t=pget($p); $l=explode("\n",$t); $t=array_slice($l,($b-1),(($e-$b)+1)); $t=implode("\n",$t);  // now `$t` is interesting
      $q=redact($t,'"','"'); $q=redact($q,"'","'"); $q=redact($q,"/*","*/");  $q=redact($q,"//","\n"); $q=redact($q,"#","\n");
      $l=explode("\n",$q); $f=$l[0]; $hx=indx($f,'function');
      if(indx($f,'function',($hx+1))){fail("multi-job in `$p` on line $b ... shameless"); exit;}; $bx=bpIndx($q,'{}');
      $h=frag($t,$hx,$bx[0]); $b=frag($t,$bx[0],($bx[1]+1));
      $r=($h.$b); return $r;
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



# tool :: path : plumbing tools
# ---------------------------------------------------------------------------------------------------------------------------------------------
   class path
   {
      static function info($d, $fail=true)
      {
         if(!isText($d,1)){fail('expecting non-empty text');}; $n=null; $h=HOSTNAME;
         if(path($d)){$p=crop($d); if(frst($p)==='$'){$p=substr($p,1);}; $d="file://{$h}{$p}";};
         if(isin($d,'::')){$s=stub($d,'::'); $p=crop($s[2]); if(frst($p)==='$'){$p=$p=substr($p,1);}; $d="{$s[0]}://{$h}{$p}";};
         $i=knob(parse_url($d)); $p=crop(path($i->path)); $q=$i->query; $skm=$i->scheme; $hst=$i->host;
         if(!$skm||(($skm!=='file')&&!$hst)){if(!$fail){return;}; fail('expecting valid path-string -or URL-string');}; $x=stub($d,['#','&','?','@',':']);
         if(isin($d,'@')){$x=stub($d,'@')[0]; if(isin($x,['#','&','?'])){fail('invalid URL');}}; if(($skm==='file')&&($hst==='$')){$hst=null; $i->host=null;};
         $r=knob(['plug'=>$n,'user'=>$n,'pass'=>$n,'host'=>$n,'port'=>$n,'path'=>$n,'levl'=>0,'stem'=>$n,'twig'=>$n,'leaf'=>$n,'type'=>$n,'vars'=>$n]);
         $r->plug=$i->scheme; $r->path=$p; $r->frag=$n; $s='/'; if($skm!=='file'){$r->user=$i->user; $r->pass=$i->pass; $r->host=$hst; $r->port=$i->port;};
         if($p){$r->meta=self::meta($p); $r->levl=self::levl($p); $r->stem=self::stem($p); $r->twig=self::twig($p); $r->leaf=self::leaf($p); $r->type=self::type($p);};
         if($q){parse_str($q,$v); $r->vars=knob($v);}; if($i->fragment){$r->frag=$i->fragment;}; $r->purl=$d;
         return $r;
      }


      static function meta($d)
      {
         $r=knob(['base'=>$d,'path'=>'','levl'=>0]); if(!isText($d,3)){return $r;};
         $d=rshave(shaved($d),'/'); if(!isText($d,3)){return $r;};
         if(isee($d)){return $r;}; if(!isin($d,'/')){return $r;};
         $l=frag($d,'/'); $f=[]; $y=0;
         do{$i=rpop($l); ladd($f,$i); $b=fuse($l,'/'); if(!$y&&isee($b)){$y=1; $r->base=$b; break;}}while(count($l)&&($y<1));
         if(!$y){return $r;}; $r->path=('/'.fuse($f,'/')); $r->levl=count($f);
         return $r;
      }


      static function size($d,$o=null)
      {
         $p=isee($d);  if(!$p){$p=tval($d); fail("expecting `$p` to exist as readable path"); return;};
         if(is_file($p)){$r=filesize($p); return round(($r/1024),3);}; if(!is_dir($p)){return;};
         $r=exec::{"du -sb ."}($p); $x=stub($r,[' ',"\t"]); if($x){$r=$x[0];};
         if(is_numeric($r)){$r=($r*1); return round(($r/1024),3);};
         fail("failed to get size of: `$d`");
      }


      static function span($p)
      {
          $r = pget($p);
          if (!$r){ return; };
          if (isText($r)){$r = explode("\n",$r);};
          $r = count($r);
          return $r;
      }


      static function stem($p)
      {
         if(!is_string($p)){return;}; $r=trim($p,'/'); if(!$r){return;}else{$r=explode('/',$r)[0];};
         if(!is_funnic($r) || !isee("/$r") || !is_dir(path("/$r"))){return;};
         $i=self::indx("/$r"); if(!$i){return;}; if(fext("/$r/$i")==='php'){return $r;};
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


      static function cdto($p1,$p2)
      {
         if(!isPath($p1)||!isText($p2,1)){return;}; if($p1!=='/'){$p1=rshave($p1,'/');}; $p2=trim($p2);
         if((strlen($p2)<1)||($p2==='.')||($p2==='./')){return $p1;}; // unchanged
         if(strpos($p2,'./')===0){$p2=lshave($p2,'./');}; // same-dir
         if(strpos($p2,'/')===0){$p2=lshave($p2,'/');}; // prep for next
         if(strpos($p2,'../')!==0){return (($p1==='/')?"/$p2":"$p1/$p2");}; // simple concat
         if($p1==='/'){return '/';}; // can't go deeper than root
         $a1=frag($p1,'/'); $a2=frag($p2,'/');
         while(isset($a1[0])&&isset($a2[0])&&($a2[0]==='..')){lpop($a2); rpop($a1);};
         $r1=fuse($a1,'/'); $r2=fuse($a2,'/');
         return (($r1==='/')?"/$r2":"$r1/$r2");
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


      static function indx($p,$o=null)
      {
         $p=isee($p); if(!$p){return;}; if(!is_dir($p)){$p=self::twig($p);}; if(isText($o,2)){$o=[$o];}; if(!isNuma($o)){$o=[];};
         $c=knob(["name"=>["aard","index","README"],"type"=>["php","js","mjs","htm","html","md"]]);
         $a=[]; foreach($c->name as $cn){foreach($c->type as $ct){$a[]="$cn.$ct";}};
         $r=null; foreach($a as $n){if(isin($o,$n)){continue;}; if(is_file("$p/$n")){$r=$n;break;};};
         return $r;
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

         if(strpos($x,'//')===0){$x=crop($x);};
         if(($x==='/index.php')&&(envi('RECEIVER')==='nona')){return;};
         $r=import($x);  if(($r===true)&&is_class($s)){$r=$s;};

         if(is_closure($r)){return call($r,$a);}; if(!isset($a[0])){return $r;}; // load controller
         $f=lpop($a); if (isee($p)){return;}; // controller did not handle path
         if(is_class($r)&&is_funnic($f)){return call("$r::$f",$a);}; // call controller method

         if(is_object($r)&&is_closure($r->$f)){return call($r->$f,$a);}; $o[]=$x; $r=self::call($p,$o,$a); // call closure
         return (($r===null)?true:$r);
      }


      static function make($p,$v=null)
      {
         if(!path($p)){return;}; lock::awaits($p); $r=pset($p,$v);
         if(($r!==false)&&($r!==null)){lock::remove($p); return true;}; // done first try
         $t=self::twig($p); $t=frag($t,"/"); $q="";
         foreach($t as $i){$q.="$i/"; if(!isee($q)){$r=pset($q); if(($r===false)||($r===null)){break;}}};
         if(($r===false)||($r===null)){return false;}; $r=pset($p,$v); lock::remove($p);
         return ((($r===false)||($r===null))?false:true);
      }


      static function copy($pf,$pt,$rx=null)
      {
         $of=path($pf); $ot=path($pt); if(!$of||!$ot){fail('expecting 2 paths');}; if(!isee($of)){fail("`$of` is undefined");};
         $tx=isee($ot); if(!$tx){$np=(isFold($of)?$ot:self::twig($ot)); pset("$np/");}; if(last($pf)==="/"){$of.="/.";};
         $rn=($rx?"rm -rf $ot && cp -r $of $ot":"cp -r $of $ot"); lock::awaits($ot); exec::{"$rn"}('/'); lock::remove($ot);
         return true; // will fail if not OK
      }


      static function void($p)
      {
         if(!path($p)){return;}; lock::awaits($p); $r=void($p); lock::remove($p); return $r;
      }


      static function move($pf,$pt)
      {
         $r=self::copy($pf,$pt); $r=self::void($pf); return $r;
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
         $dl=[]; $fl=[]; $l=pget($qu); if(count($l)<1){return $rl;}; $qu=crop($qu); if(!$gr&&isin($fc,'repo')){$gr=Repo::status($qu);};

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
         if(!isKnob($repo)){if(!$repo){$repo=knob();}elseif(isPath($repo)){$repo=Repo::status($repo,$q->param);}else{$repo=Repo::status($h,$q->param);}};
         $shp=null; if($levl===0){$shp=$q->shape; unset($q->shape);}; if(isin($q->limit,':')){$q->limit=knob(dval($q->limit));};
         if(isKnob($q)&&($q->fetch==='*')){$q->fetch=self::cols();};
         if(isKnob($q->limit)&&$q->limit->name&&!is_array($q->limit->name)){$q->limit->name=explode(',',swap($q->limit->name,' ',''));};
         $lmtn=null; if(isKnob($q->limit)){$lmtn=$q->limit->name; if(span($lmtn)<1){$lmtn=null;}};
         $omit=['/Proc/temp'];
         // if(isKnob($q->limit)&&is_int($q->limit->levl)&&($q->limit->levl<$levl)){return;};
         // $lmtp=[]; $lmtn=[];

// $zee = null;
// if (isin($l,"ShareAVilla")){ $zee = $h; };
// if ($zee){ ekko(["lala",$h,isRepo($h),$repo]); };


         foreach($l as $x => $i)
         {
            $p=crop("$h/$i"); if(isin($p,$omit)||!isee($p)){continue;}
            // $p=crop(('/'.lshave("$h/$i",'//')));
            // $p=crop("$h/$i");
            $t=(isFile($p)?'file':(isFold($p)?'fold':'link'));
            $fx=self::type($p); $fs=self::size($p); $mt=mime($p);
            if(isKnob($q->limit)&&$q->limit->type&&!isin($q->limit->type,$t)){continue;};
            $xp=isee($p); $pm=($xp?substr(sprintf('%o',fileperms($xp)),-4):null);
            $o=knob(['repo'=>null,'path'=>$p,'name'=>$i,'mime'=>$mt,'type'=>$t,'size'=>$fs,'time'=>info($p)->mtime,'mode'=>$pm,'levl'=>$levl,'data'=>null]);
            $rpo=null; if(($t==='fold')){$rpo=isRepo($p);};
            if($rpo){ $repo=knob(); };
            $o->repo=$repo->$p;

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
               if(isKnob($q->limit)&&is_int($q->limit->levl)&&($levl>$q->limit->levl))
               { $o->data=null; }
               else
               {
                   if($rpo&&(span($repo)<1))
                   {$repo=Repo::status($p,$q->param); if(isKnob($repo)){$o->repo=knob(['host'=>$repo->host,'head'=>$repo->head]); $repo=$repo->body;}};
                   $o->data=self::ogle($p,$q,$repo,($levl+1));
               };
            }
            elseif($t==='link'){$o->data=readlink(path($p));}; if($t==='fold'){$d[]=$o;}else{$f[]=$o;};
         };

         if($q===null){return array_merge($d,$f);}; $d=filter($d,$q); $f=filter($f,$q);
         sort($d); sort($f); // separately sort dir -and file-names alpha-numerically before merge
         $r=array_merge($d,$f); if(count($r)<1){return $r;};
         if($q->limit){$r=filter::limit($r,$q->limit);};
         if($shp){$r=filter::shape($r,$shp);};
         return $r;
      }


      static function tree($h,$l=1)
      {
         expect::fold($h); $i=info($h); if(!isKnob($i)){fail("expect failed on `$h`"); return;};
         $h=crop($h); $r=(isRepo($h)?Repo::status($h):null); if($r){unset($r->body);}; $n=self::leaf($h); $s=self::size($h);

         $z=knob(['repo'=>$r,'path'=>$h,'name'=>$n,'mime'=>mime($h),'type'=>'fold','size'=>$s,'time'=>$i->mtime,'data'=>null]);
         if(!$l){return $z;};

         $z->data=self::ogle
         ([
            using => $h,
            fetch => self::cols(),
            limit => "data: fold\nlevl: $l",
         ]);

         return $z;
      }


      static function purl($o,$fp=null)
      {
         if(isAssa($o)){$o=knob($o);}; if(!isKnob($o)){fail('expecting :knob:'); exit;};
         $r=''; if($o->plug){$r.="$o->plug://";}; if($o->user){$r.="$o->user";}; if($o->pass){$r.=":$o->pass";};
         if($o->host){$r.="@$o->host";}; if($o->path){$p=$o->path; if($fp&&$o->plug==='file'){$p=path($p);}; $r.="$p";};
         if($o->vars){$v=[]; foreach($o->vars as $k => $v){$v[]="$k=$v";}; $v=fuse($v,'&'); $r.="?$v";};
         if($o->frag){$r.="#$o->frag";}; return $r;
      }


      static function xume($pth,$fnd=null,$omt=null,$lvl=null,$dja=null)
      {
          $rpn=ROOTPATH; if(!$dja)
          {
              if(!isFold($pth)){return;}; if($fnd===null){$fnd='*';};
              if(is_string($fnd)){$fnd=explode('/',shaved($fnd,'/'));};
              if(!is_array($omt)){$omt=[];}; if(!is_int($lvl)){$lvl=0;};
              $pth=swap(path($pth),"$rpn/",'');
          };

          if(!isset($fnd[$lvl])){return;}; // safety first
          $end=(count($fnd)-1); $akn=$fnd[$lvl];
          $akn=((strpos($akn,'*')===false)?"*/$akn":$akn);
          $wss=implode('/',$fnd); if((wrapOf($wss)!=='**')||(span($wss,'*')!==2)){$wss=null;};
          $lst=pget("/$pth",false); $rsl=[]; foreach($lst as $itm)
          {
              $tps="$pth/$itm"; if(pick($tps,$omt)!==null){continue;}; // omitted explicitly
              if(!akin($tps,$akn)&&!akin($tps,$wss)){continue;}; // not matching find
              if($lvl===$end){radd($rsl,swap($tps,"$rpn/",''));};
              if(!isFold("/$tps")){continue;};
              $sub=path::xume($tps,$fnd,$omt,($lvl+1),true);
              if(is_array($sub)){$rsl=array_merge($rsl,$sub);};
          };
          return $rsl;
      }


      static function swap($p,$f,$r)
      {
          expect::path($p); expect::text($f); expect::text($r); $p=crop($p); $d=pget($p);
          if(isArra($d)){foreach($d as $i){self::swap("$p/$i",$f,$r);}; return true;};
          if(!isFile($p)){return;}; $d=swap($d,$f,$r); path::make($p,$d);
          return true;
      }
   }
# ---------------------------------------------------------------------------------------------------------------------------------------------



# func :: mime : returns the mime-type associated with $x
# ---------------------------------------------------------------------------------------------------------------------------------------------
   function mime($x)
   {
      if(!isText($x,1)){return;}; $x=trim($x); if(!$x){return;};
      if(isPath($x)){$x=path::type($x);}elseif(isin($x,'.')){$x=rstub($x,'.')[2]; $x=trim($x); if(!$x){return;}};
      $r=conf('Proc/mimeType')->$x; return $r;
   }
# ---------------------------------------------------------------------------------------------------------------------------------------------



# func :: durl : returns data-url from file-path .. returns null if invalid-path or not-a-readable-file or no-extension or undefined-mime-type
# ---------------------------------------------------------------------------------------------------------------------------------------------
   function durl($d,$m=null)
   {
      if(isText($m,3)&&isin($m,'/')&&is_string($d)){$r=base64_encode($d); return "data:$m;base64,$r";};
      $p=crop(isee($d)); $m=mime($p); if(!$p||!$m){return;}; // invalid path or invalid mime
      $r=base64_encode(isFold($p)?json_encode(pget($p)):import($p,vars($p)));
      return "data:$m;base64,$r"; // you get access to ENV variables related to any path ref ;)
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
   function call($x,$a=[],$z=null)
   {
      if(!is_nokey_array($a)){$a=[$a];}; $ns='Anon\\';
      if(isPath($x)){$x=swap(shaved($x,"/"),"/","::");};
      if(is_string($x)&&(strpos($x,$ns)===false)){$x=($ns.$x);};
      if($z){ob_start(null,0,PHP_OUTPUT_HANDLER_STDFLAGS);};

      if(is_string($x)&&isin($x,'::'))
      {
         $p=frag($x,'::');
         $r=call_user_func_array([$p[0],$p[1]],$a);
      }
      elseif(!is_string($x))
      {
         $r=call_user_func_array($x,$a);
      }
      elseif(!function_exists($x))
      {
         $y=lshave($x,$ns);
         if(function_exists($y)){$x=$y;}else{fail::reference("function `$x` -and `$y` is undefined");exit;};
         $r=call_user_func_array($x,$a);
      }
      else
      {
         $r=call_user_func_array($x,$a);
      }

      if($z){$b=trim(ob_get_clean()); if(($b!=='')&&($r===false)||($r===null)){$r=$b;}};
      return $r;
   }
# ---------------------------------------------------------------------------------------------------------------------------------------------



# tool :: expect : assert or die .. works with functions beginning with `is` or `is_`
# ---------------------------------------------------------------------------------------------------------------------------------------------
   class expect
   {
      static function __callStatic($n,$a)
      {
         $n=trim($n); if(!$n){return;}; $l=null; if(strpos($n,' ')){$l=explode(' ',$n);};
         $any=(isset($a[1])&&($a[1]===ANY)); if($any&&isNuma($a[0])){$a=$a[0];};
         if($l){$r=null; foreach($l as $i){$r=expect::{"$i"}($a,ANY); if($r){break;}}; if(!$r){fail("expecting any: $n");}; return;};
         $lc="is_$n"; $uc=('is'.ucwords($n));
         if(function_exists("Anon\\$uc")){$f="Anon\\$uc";}elseif(function_exists("Anon\\$lc")){$f="Anon\\$lc";}
         elseif(function_exists($lc)){$f=$lc;}else{fail("functions `$uc` and `$lc` are undefined");};
         $r=call_user_func_array($f,$a); if($r){return $r;};
         $m="expecting $n"; if(isset($a[1])&&is_int($a[1])&&isset($a[0])&&($a[0]==='')){lpop($a);};
         if(isset($a[0])&&is_int($a[0])&&isset($a[1])&&is_int($a[1])){$m="$m with an item count of between $a[0] and $a[1]";}
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
         };
         if(!$any){fail($m);};
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
      if(is_dir($p)){$i=path::indx($p); if($i){$p="$p/$i";}else{return;}}; $x=fext($p); if(!$x){return pget($p);}; unset($i);

      if(!in_array($x,['php','htm','js','md','css','txt','html','json'])){return pget($p);};
      if(!defn('CTRLKEYS')){$y=conf('User/viewConf'); defn(['CTRLKEYS'=>$y->toggleUserPanl]);};
      if($x!=='php') // htm js md txt json
      {
         $z=pget($p); $z=impose($z,'<!--[',']--->',$v); $z=impose($z,'/*(~','~)*/',$v,1); $z=impose($z,'(~','~)',$v,1);
         return $z;
      };

      if(($a!=='Proc')&&!is_object(Proc::$meta)){Proc::$meta=knob();};

      $x=call_user_func_array(function($_PATH,$_VARS)
      {
         foreach($_VARS as $k => $v){$$k=$v;}; unset($k,$v); $_BUFR=ob_start(); require($_PATH); clearstatcache(true);
         $l=get_defined_vars(); $r=ob_get_clean(); foreach($l as $k => $v)
         {if(((substr($k,0,1)==='_')&&(upperCase($k)===$k))||property_exists($_VARS,$k)){unset($l[$k]);};}; return ['V'=>$l,'T'=>$r];
      },[$p,$v]);

      if($x['T']){return $x['T'];}; // the PHP script printed some stuff, it probably wanted to do that, we're done then
      $a=lshave($a,'/'); $a=rshave($a,'/aard.php'); if(isin($a,'/')){$a=rshave($a,'/index.php');}; $c="Anon\\$a"; if(!is_class($c)){$c=null;};
      if(isset($x['V']['export'])){$r=$x['V']['export']; if(is_class($r)&&!$c){$c="Anon\\$r"; unset($x['V']['export']);}else{return $r;}};
      if(!$c){if(span($x['V'])>0){return (new module($x['V']));}; return true;}; // not a class
      if(isin($c,'meta')&&!$c::$meta){$c::$meta=knob();}; $im=is_method("$c::__init"); if(!$im||($im&&$ni)){return $c;}; // no calling __init
      $e=null; try{$ic=$c::__init(); $e=\error_get_last();}catch(\Exception $er){throw $er;}; if(!$e){return true;}; $b="";
      dbug::view(knob(['name'=>dbug::name($e['type']),'mesg'=>trim($e['message']."\n".$b),'file'=>$e['file'],'line'=>$e['line']]));
   }
# ---------------------------------------------------------------------------------------------------------------------------------------------
