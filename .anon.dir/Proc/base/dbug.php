<?
namespace Anon;


# info :: file : read this
# ---------------------------------------------------------------------------------------------------------------------------------------------
# this file is the error-detector and error-handler; it is used to debug the framework and handle error events gracefully
# ---------------------------------------------------------------------------------------------------------------------------------------------




# dbug :: path : expected files
# ---------------------------------------------------------------------------------------------------------------------------------------------
   if(!isee('/Proc/vars/lastDbug')){pset('/Proc/vars/lastDbug','0');};
   depend('F:/Proc/base/dbug.htm','WF:/Proc/vars/lastDbug','WF:/User/conf/inactive','F:/Proc/base/abec.php','F:/Proc/base/base.php');
   if(NAVIPATH===DBUGPATH){$r=pget(DBUGPATH); $r=str_replace('{:(TECHMAIL):}',TECHMAIL,$r); print_r($r); flush(); die();}; // must fail nicely
# ---------------------------------------------------------------------------------------------------------------------------------------------




# tool :: dbug : class
# ---------------------------------------------------------------------------------------------------------------------------------------------
   class dbug
   {
      private static $meta;
      private static $bufr=[];


      static $code = array
      (
         0=>'Usage', 1=>'Fatal', 2=>'Warning', 4=>'Parse', 8=>'Notice', 16=>'Core', 32=>'Warning', 64=>'Compile',
         128=>'Warning', 256=>'Coding', 512=>'Warning', 1024=>'Notice',2048=>'Strict',4096=>'Recoverable',
         8192=>'Deprecated', 16384=>'Deprecated'
      );


      static function init()
      {
         self::$meta=knob
         ([
            'listen'=>
            [
               'anon'=>function($e)
               {
                  dbug::spew($e);
                  exit; // eyecandy
               },
               'hush'=>function($e)
               {
                  dbug::bufr($e);
                  return true;
               },
            ],

            'active'=>'anon',
         ]);
      }


      static function name($d=0)
      {
         if(!is_int($d)){$d=0;}; if(isset(self::$code[$d])){return self::$code[$d];};
         $o=conf('Proc/httpCode'); if(isset($o[$d])){return $o[$d];}; return self::$code[0]; if($n===null){$n=0;};
      }


      static function spew($o)
      {
         $o->mesg=self::wash($o->mesg); $o->file=self::wash($o->file); $x=fext(NAVIPATH); $m=$o->mesg; $h="HTTP/1.1 500 Internal Server Error";
         $s=[]; foreach($o->stak as $i){$s[]="$i->func $i->file $i->line";}; $o->stak=$s; $n=$o->name; $f=$o->file; $l=$o->line; $t=tval($o);

         if(facing('API')){header($h); echo($t); exit;};  if(facing('DPR')&&($x=='js')){ekko("fail($t)");}; // API & js-dpr
         if(facing('DPR')){$m=str_replace(["\n",'"'],['',"`"],$m); $m=crop($m,60); harakiri("$n - $f - $l"); exit;}; // any other file
         if(facing('SSE')){if(is_class('Proc')){Proc::emit('fail',$t); exit;}; ekko($o); exit;}; // server side event
         if(facing('GUI')){$d=base64_encode($t); $r=str_replace('{:(DBUGDATA):}',$d,pget(envi('DBUGPATH'))); echo($r); exit;}; // GUI

         harakiri('Service Unavailable'); exit; // BOT,SYS,ETC ... ssssshhhh .. sweet screams
      }


      static function wash($m)
      {
         $p=[COREPATH,ROOTPATH]; $r=str_replace($p,'',$m);
         $b='basedir restriction in effect. File(';  $e=') is not within the';
         $s=explode($b,$r); if(count($s)<2){return $r;}; $r=explode($e,$s[1])[0];
         return "illegal path: $r";
      }


      static function trap($n=null,$f=null)
      {
         if($n===null){return self::$meta->active;};
         if(!is_funnic($n)){fail::dbugTrap('invalid trap name as 1st arg');}; $x=self::$meta->listen->$n;
         if(!$x&&!is_closure($f)){fail::dbugTrap('invalid trap func as 2nd arg');}; // validate
         if(self::$meta->active===$n){return ($f?false:true);}; // already active .. cannot override existing
         if(is_closure($x)){self::$meta->active=$n; return true;}; // switch to existing
         self::$meta->listen->$n=$f; self::$meta->active=$n; return true; // create new and switch to new
      }


      static function bufr($e=null)
      {
         if(is_object($e)){self::$bufr[]=$e; return true;};
         $rb=json_decode(json_encode(self::$bufr)); self::$bufr=[];
         return $rb;
      }


      static function view($o)
      {
         $n=self::$meta->active; $f=self::$meta->listen->$n;
         $r=$f($o);
      }
   }

   dbug::init();
# ---------------------------------------------------------------------------------------------------------------------------------------------



# tool :: fail : trigger custom error
# ---------------------------------------------------------------------------------------------------------------------------------------------
   class fail
   {
      static function __callStatic($n,$a)
      {
         $n=trim($n); if(strlen($n)<1){$n='Deliberate';}; $n=ucwords($n); $m=(isset($a[0])?$a[0]:'undefined'); $s=stak();
         $f=$s[0]->file; $l=$s[0]->line; $e=knob(['name'=>$n,'mesg'=>$m,'file'=>$f,'line'=>$l,'stak'=>$s]);
         dbug::view($e); exit;
      }
   }
# ---------------------------------------------------------------------------------------------------------------------------------------------



# func :: fail : throw exception shorthand
# ---------------------------------------------------------------------------------------------------------------------------------------------
   function fail($m)
   {
      if(is_string($m)){$m=trim($m);}; if(!is_string($m)||(strlen($m)<1)){$m='undefined';};
      $s=stak(); $f=$s[0]->file; $l=$s[0]->line; $e=knob(['name'=>'Deliberate','mesg'=>$m,'file'=>$f,'line'=>$l,'stak'=>$s]);
      dbug::view($e); exit;
   };
# ---------------------------------------------------------------------------------------------------------------------------------------------



# func :: (dbug) : disable and enable errors .. to silence warnings/notices picked up by error handler
# ---------------------------------------------------------------------------------------------------------------------------------------------
   function defail()
   {
      ob_start();
      $tn=dbug::trap(); dbug::trap('hush');
      return $tn;
   }

   function enfail($tn='anon',$rs=null)
   {
      $rb=dbug::bufr(); dbug::trap($tn); if(!$rs){return $rb;};
      $rs=[]; foreach($rb as $eo){$rs[]=$eo->mesg;}; $rs=implode("\n",$rs);
      return trim($rs);
   }
# ---------------------------------------------------------------------------------------------------------------------------------------------



# defn :: event : handlers
# ---------------------------------------------------------------------------------------------------------------------------------------------
   set_exception_handler(function($e)
   {
      $b=''; while(ob_get_level()){$b.=("\n".ob_get_clean());}; $b=trim($b);
      $e=knob(['name'=>dbug::name($e->getCode()),'mesg'=>trim($e->getMessage()."\n".$b),'file'=>$e->getFile(),'line'=>$e->getLine()]);
      $e->stak=stak(); dbug::view($e);
   });

   set_error_handler(function()
   {
      $b=''; while(ob_get_level()){$b.=("\n".ob_get_clean());}; $b=trim($b); $e=func_get_args();
      $e=knob(['name'=>dbug::name($e[0]),'mesg'=>trim($e[1]."\n".$b),'file'=>$e[2],'line'=>$e[3]]);
      $e->stak=stak(); dbug::view($e);
   });

   register_shutdown_function(function()
   {
      $e=error_get_last(); if(!$e){exit;}; error_clear_last(); $b=''; while(ob_get_level()){$b.=("\n".ob_get_clean());}; $b=trim($b);
      $e=knob(['name'=>dbug::name($e['type']),'mesg'=>trim($e['message']."\n".$b),'file'=>$e['file'],'line'=>$e['line']]);
      $e->stak=stak(); dbug::view($e); exit;
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
