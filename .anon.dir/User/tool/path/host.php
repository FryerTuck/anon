<?
namespace Anon;



$export=function($x,$a,$h)
{
   $s=span($a); $y="sorry, `..` is not allowed this way, use: `cd` or `goto` then try again"; $u=sesn('USER'); $c=sesn('CLAN');
   foreach($a as $k => $v){if((strpos($v,'..')!==false)&&($x!=='goto')){ekko($y);}; $a[$k]=dval($v);}; // security
   if(($x==='void')&&($s>0)&&isin($a[0],'-r')&&($h===ROOTPATH)&&($u!=='master')){ekko(wack());}; // security
   $plug=null; if(isPurl($h)){$plug=path::info($h);}elseif(isin($h,'.url'))
   {
      $pstb=stub($h,'.url'); $ppth=($pstb[0].'.url'); $purl=pget($ppth); if(isPurl($purl))
      {$plug=path::info($purl); if(isPath($pstb[2])){$plug->path.=$pstb[2];}; $plug=path::info(path::purl($plug));};
   };


   if($x==='make')
   {
       if(isArra($a,2)&&($a[0]==="stem"))
       {
           $a=ucwords($a[1]);
           if(!is_funnic($a)){return "expecting stem-name as plain word";};
           if(isee("$/$a") || (isee("/$a/pack.inf"))){return "stem `$a` already exists and is not empty";};
           path::copy("$/Proc/tmpl/AnonStem/","/$a/");
           path::swap("/$a","AnonStem",$a);
           return OK;
       };

      if($s<1){return 'missing path';}; $p=path::fuse($h,$a[0]); if(!isPath($p)){return 'invalid path';};
      if(isee($p)&&(($s<2)||is_dir(path($p)))){return 'already exists';};
      $d=(isset($a[1])?$a[1]:null); $r=path::make($p,$d);
      Proc::signal('replPath',['action'=>$x,'target'=>$p]);
      return ($r?OK:FAIL);
   };


   if($x==='scan')
   {
      $p=null; $o=null; if($s<1){$p='.';}elseif($s<2){$p=$a[0];}else{$p=$a[0];$o=$a[1];}; // set path and option
      if(is_int($p)||($p==='-a')||($p==='-A')){$t=$o; $o=$p; $p=$t;}; if($p===null){$p='.';}; // swap path and option
      if(!$plug){$p=path::fuse($h,$p); $r=pget($p,(isin(['-a','-A'],$o)?0:1)); return $r;};
      $r=crud($plug->purl)->select('*'); return $r;
   };


   if($x==='goto')
   {
      if($s<1){return 'missing path';}; $a=$a[0]; $c=substr($a,0,1); if(isin(['/','$','~'],$a)){return $a;};
      $r=(isin(['/','$','~'],$c)?$a:path::fuse($h,$a)); if(!isee($r)){return "`$r` is either undefined, or unreachable from here";};

      if(fext($r)==='url')
      {
         $p=pget($r); if(!isPurl($p)){return "`$r` does not contain a valid plug-url";};
         $D=crud($p); $I=$D->mean; $L=null; $F=null; $L=$D->vivify(); return $r;
      };

      if(!isFold($r)){return "`$r` is not a folder";};
      $rp=path($r); $up=path('~'); $cp=path('$'); $fc=substr($r,0,1); if(($fc==='/')&&!isin($rp,$up)&&isin($rp,$cp)){$r=('$'.$r);};
      Proc::signal('replPath',['action'=>$x,'target'=>$r]);
      return $r;
   };


   if($x==='gain')
   {
      $p=$a[0]; $v=$a[1]; if(!isPath($p)){ekko('expecting valid path');}; // validate
      if((substr($p,-1,1)==='/')||isFold($p)){ekko('cannot write to folders this way');}; // validate
      $q=isee($p); $l=0; $f=0; $w=0; if($q){$l=is_link($q); if(!$l){$f=is_file($q);}; $w=is_writable($q);}; // vars
      if($q&&!$w){return "`$p` is not writable";}; // permission
      if($l){return "`$p` is a link";};
      if(!$q||($q&&$f)){$r=($q?pget($p):''); $r=path::make($p,"{$r}{$v}");}; // write to existing or non-existing file
      if(!$r){return FAIL;};
      Proc::signal('replPath',['action'=>$x,'target'=>$p]);
      return OK;
   };


   if($x==='mode')
   {
      $m=null; if($s<1){$p='.';}elseif($s<2){$p=$a[0];}else{$p=$a[0];$m=$a[1];}; // set path and mode
      if(is_int($p)){$t=$m; $m=$p; $p=$t;}; if($p===null){$p='.';}; // swap path and mode
      $p=path::fuse($h,$p); $t=path($p);

      if(!$m){$r=exec::{"stat -c %a $t"}($h); return $r;}; if(!is_int($m)||(span($m<3))){return 'invalid mode';};
      $n="$m"; $n=($n[0]*1); if($n<4){return "that's unwise, or rather clever, but no, I won't .. for now";};
      try{exec::{"chmod -R $m $t"}($h);}catch(\Exception $e){$r=$e->getMessage(); return $r;};
      Proc::signal('replPath',['action'=>$x,'target'=>$p]);
      return OK;
   };


   if($x==='copy')
   {
      if($s<2){return 'expecting 2 arguments';}; $pf=path(path::fuse($h,$a[0])); $pt=path(path::fuse($h,$a[1]));
      if(!$pf||!$pt){return 'expecting 2 paths';}; if(!isee($pf)){return "`$a[0]` is undefined";};
      if(isee($pt)){if(!isPath($pt,[D,W])){return "`$a[1]` exists and is not a writable folder";}; $pt=rshave($pt,'/'); $pt="$pt/";};
      $r=OK; try{exec::{"cp -R $pf $pt"}($h);}catch(\Exception $e){$r=$e->getMessage();};
      Proc::signal('replPath',['action'=>$x,'target'=>crop($pt)]);
      return $r;
   };


   if($x==='move')
   {
      if($s<2){return 'expecting 2 arguments';}; $pf=path(path::fuse($h,$a[0])); $pt=path(path::fuse($h,$a[1]));
      if(!$pf||!$pt){fail('expecting 2 paths');}; if(!isee($pf)){return "`$a[0]` is undefined";};
      if(isee($pt)){if(!isPath($pt,[D,W])){return "`$a[1]` exists and is not a writable folder";}; $pt=rshave($pt,'/'); $pt="$pt/";};
      $r=rename($pf,$pt);
      Proc::signal('replPath',['action'=>$x,'target'=>crop($pt)]);
      return ($r?OK:FAIL);
   };


   if($x==='void')
   {
      if($s<1){return 'missing path';}; $p=path::fuse($h,$a[0]); if(!isPath($p)){return 'invalid path';};
      if(($a[0]==='.')||(indx($a[0],'..')===0)){return 'can only remove contents from here';}; $r=void($p);
      Proc::signal('replPath',['action'=>$x,'target'=>$p]);
      return ($r?OK:FAIL);
   };


   todo("CLI path :: define action `$x`");
};
