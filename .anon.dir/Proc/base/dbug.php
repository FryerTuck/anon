<?
namespace Anon;


# info :: file : read this
# ---------------------------------------------------------------------------------------------------------------------------------------------
# this file is the error-detector and error-handler; it is used to debug the framework and handle error events gracefully
# ---------------------------------------------------------------------------------------------------------------------------------------------




# dbug :: path : expected files
# ---------------------------------------------------------------------------------------------------------------------------------------------
   depend('F:/Proc/base/dbug.htm','WF:/Proc/vars/lastDbug','WF:/User/conf/inactive','F:/Proc/base/abec.php','F:/Proc/base/base.php');
   // if(!isee('/Proc/dbug.htm')||!isee('/Proc/vars/lastDbug')||!is_writable(path('/Proc/vars/lastDbug'))){halt(424,'Failed Dependency - dbug');};
   // if(!isee('/User/conf/inactive')){halt(424,'Failed Dependency - dbug');}; // NB
   if(NAVIPATH===DBUGPATH){$r=pget(DBUGPATH); $r=str_replace('{:(TECHMAIL):}',TECHMAIL,$r); print_r($r); flush(); die();}; // must fail nicely
# ---------------------------------------------------------------------------------------------------------------------------------------------




# tool :: dbug : class
# ---------------------------------------------------------------------------------------------------------------------------------------------
   class dbug
   {
      static $meta=['stak'=>null,'file'=>null,'line'=>null];


      private static $code = array
      (
         0=>'Usage', 1=>'Fatal', 2=>'Warning', 4=>'Parse', 8=>'Notice', 16=>'Core', 32=>'Warning', 64=>'Compile',
         128=>'Warning', 256=>'Coding', 512=>'Warning', 1024=>'Notice',2048=>'Strict',4096=>'Recoverable',
         8192=>'Deprecated', 16384=>'Deprecated'
      );


      static function name($d=0)
      {
         if(!is_int($d)){$d=0;}; if(isset(self::$code[$d])){return self::$code[$d];};
         $o=conf('Proc/httpCode'); if(isset($o[$d])){return $o[$d];}; return self::$code[0]; if($n===null){$n=0;};
      }


      static function view($o)
      {
         $o->mesg=str_replace([COREPATH,ROOTPATH],'',$o->mesg);
         $o->file=crop($o->file); if($o->file==='/Proc/base.php'){$q=$o->stak[0]; $o->file=$q->file; $o->line=$q->line;};
         if(facing('BOT')||facing('SYS')){finish(503);}; $n=$o->name; $m=$o->mesg; $f=$o->file; $l=$o->line; $j=JSON_UNESCAPED_SLASHES;
         if(facing('DPR')){$m=str_replace(["\n",'"'],['',"`"],$m); $m=crop($m,64); halt(500,"$n - $m - $f - $l",$f,$l,tval($o));};
         if(facing('SSE')&&envi('SSEREADY')){$r=base64_encode(tval($o)); print_r("event: fail\ndata: $r\n\n"); flush(); return;};
         if(facing('API')){$r=((USERMIME==='application/json')?json_encode($o,$j):"evnt: fail\nmesg: $n - $m\nfile: $f\nline: $l"); die($r);};
         $d=base64_encode(tval($o)); $r=pget(envi('DBUGPATH')); $r=str_replace('{:(DBUGDATA):}',$d,$r); print_r($r); die(); // GUI
      }


      static function fail($m,$n=null,$s=null,$y=null)
      {
         // if($_SERVER['nofail']){return;};
         $f=$_SERVER['LASTFAIL']; if($f){self::view($f); die();}; defn(['HALT'=>1]); $m=str_replace('Anon\\','',$m);
         if($n!==null){$n=((is_numeric($n))?self::name(($n*1)):$n); $m="{$n}Error: $m";}; $p=stub($m,'Error: '); $x=self::$meta;
         $n=$p[0]; $m=$p[2]; $f=$x['file']; $l=$x['line']; $s=stak(dbug::$meta['stak']); $u=sesn('USER'); $c=sesn('CLAN');
         if(strpos($f,'dbug.php')&&isset($s[0])){$f=$s[0]->file; $l=$s[0]->line;}; $m=trim($m);
         $o=knob(['name'=>$n, 'mesg'=>$m, 'file'=>$f, 'line'=>$l, 'stak'=>$s, 'user'=>$u, 'clan'=>$c]); $_SERVER['LASTFAIL']=$o;
         $m=str_replace([COREPATH,ROOTPATH],'',$m); $f=crop($f);
         if(class_exists("Anon\\Proc",false)){Proc::signal('fail',['mesg'=>$m,'file'=>$f,'line'=>$l]);};
         self::view($o);
      }
   }
# ---------------------------------------------------------------------------------------------------------------------------------------------



# tool :: fail : trigger custom error
# ---------------------------------------------------------------------------------------------------------------------------------------------
   class fail
   {
      static function __callStatic($n,$a)
      {
         $n=trim($n); if(strlen($n)<1){$n='Undefined';}; $n=ucwords($n);
         $m=(isset($a[0])?$a[0]:'undefined'); $s=(isset($a[1])?$a[1]:null); $y=(isset($a[2])?$a[2]:'dbug::fail');
         if(!dbug::$meta['stak']){$e=(new \Exception); dbug::$meta['stak']=$e->getTraceAsString();};
         $s=stak(dbug::$meta['stak'])[0]; dbug::$meta['file']=$s->file; dbug::$meta['line']=$s->line; dbug::fail("{$n}Error: $m",null,$s,$y);
      }
   }
# ---------------------------------------------------------------------------------------------------------------------------------------------



# func :: fail : throw exception shorthand
# ---------------------------------------------------------------------------------------------------------------------------------------------
   function fail($m)
   {
      if(is_string($m)){$m=trim($m);}; if(!is_string($m)||(strlen($m)<3)){$m='UsageError: misuse of `fail()`';};
      throw (new \ErrorException("$m"));
   };
# ---------------------------------------------------------------------------------------------------------------------------------------------



# defn :: event : handlers
# ---------------------------------------------------------------------------------------------------------------------------------------------
   set_exception_handler(function($e)
   {
      while(ob_get_level()){ob_end_clean();}; if($_SERVER['nofail']){$_SERVER['obfail']=$e->getMessage(); return;};
      dbug::$meta['stak']=$e->getTraceAsString(); dbug::$meta['file']=$e->getFile(); dbug::$meta['line']=$e->getLine();
      dbug::fail($e->getMessage(),$e->getCode()); exit;
   });

   set_error_handler(function()
   {
      $b=''; while(ob_get_level()){$b.=trim("\n".ob_get_clean());}; $e=func_get_args();
      if($_SERVER['nofail']||(envi('INTRFACE')==='TPI'))
      {if(!$b){$b=$e[1];}; $_SERVER['obfail']=$b; $cb=$_SERVER['cbfail']; if($cb){$cb($b);}; return;};

      $x=(new \Exception); dbug::$meta['stak']=$x->getTraceAsString();
      dbug::$meta['file']=$e[2]; dbug::$meta['line']=$e[3]; dbug::fail(($e[1].$b),$e[0]); exit;
   });

   register_shutdown_function(function()
   {
      if((defn('INTRFACE')==='TPI')||defn('HALT')){exit();}; $e=error_get_last(); if($e===null){exit();};
      while(ob_get_level()){ob_end_clean();};
      $x=(new \Exception); dbug::$meta['stak']=$x->getTraceAsString(); dbug::$meta['file']=$e['file']; dbug::$meta['line']=$e['line'];
      if(ob_get_level()){ob_get_clean();}; dbug::fail($e['message'],$e['type']); exit;
   });
# ---------------------------------------------------------------------------------------------------------------------------------------------



# dbug :: stem : reference - check for ambiguous stem names
# ---------------------------------------------------------------------------------------------------------------------------------------------
   $l=pget('/'); foreach($l as $i)
   {
      if(!file_exists(COREPATH."/$i")){continue;}; $a=strtolower($i);
      fail::ambiguity("`/$i` (proprCase) in your web-root folder is reserved\n- try using `/$a` (lowerCase) instead");
   };
   unset($l,$i,$a);
   $_SERVER['LASTFAIL']=null; $_SERVER['nofail']=0;
# ---------------------------------------------------------------------------------------------------------------------------------------------
