<?
namespace Anon;


# info :: file : read this
# ---------------------------------------------------------------------------------------------------------------------------------------------
# this file is the error-detector and error-handler; it is used to debug the framework and handle error events gracefully
# ---------------------------------------------------------------------------------------------------------------------------------------------




# tool :: dbug : class
# ---------------------------------------------------------------------------------------------------------------------------------------------
   class dbug
   {
      private static $meta;
      private static $bufr=[];
      static $temp;


      static $code = array
      (
         0=>'Usage', 1=>'Fatal', 2=>'Warning', 4=>'Parse', 8=>'Notice', 16=>'Core', 32=>'Warning', 64=>'Compile',
         128=>'Warning', 256=>'Coding', 512=>'Warning', 1024=>'Notice',2048=>'Strict',4096=>'Recoverable',
         8192=>'Deprecated', 16384=>'Deprecated'
      );


      static function init()
      {
         $_SERVER['LASTFAIL']=null; $_SERVER['nofail']=0;

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
         if(!is_int($d)){$d=0;}; if(isset(self::$code[$d])){return self::$code[$d];}; $o=conf('Proc/httpCode');
         if(!isKnob($o)){$o=knob($o);}; if($d===null){$d=0;}; if($o->$d){return $o->$d;}; return self::$code[0];
      }


      static function spew($o)
      {
         $o->mesg=self::wash($o->mesg); $o->file=self::wash($o->file); $x=fext(NAVIPATH); $m=$o->mesg;
         // if (strpos($o->mesg,'stat(): stat failed for $/Proc/temp/sesn/')===0){ exit; };
         $h="HTTP/1.1 500 Internal Server Error"; $s=[]; if(!is_array($o->stak)){$o->stak=[];};
         foreach($o->stak as $i){$s[]="$i->func $i->file $i->line";}; $o->stak=$s; $n=$o->name; $f=$o->file; $l=$o->line; $t=tval($o);
         if(facing('API')){if(!headers_sent()){header($h);}; echo($t); exit;};
         if(facing('DPR')&&($x=='js')){\error_clear_last(); ekko("fail($t); "); exit;};//API & js-dpr
         if(facing('DPR')){if(is_class("Proc")){signal::fail($t);}; $m=str_replace(["\n",'"'],['',"`"],$m); $m=crop($m,60); harakiri("$m"); exit;}; // any other file
         if(facing('SSE')){if(is_class('Proc')){Proc::emit('fail',$t); exit;}; ekko($o); exit;}; // server side event
         if(facing('GUI'))
         {
             $d=base64_encode($t); $r=str_replace('(~DBUGDATA~)',$d,pget(envi('DBUGPATH')));
             $d=knob(dval(pget('$/Proc/conf/badRobot'))); $r=str_replace('(~GAGROBOT~)',$d->lure,$r);
             echo($r); exit;
         }; // GUI

         harakiri('Service Unavailable'); exit; // BOT,SYS,ETC ... ssssshhhh .. sweet screams
      }


      static function wash($m)
      {
         $p=[COREPATH,ROOTPATH]; $r=str_replace($p,['$',''],$m);
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
         if(runlevel(1)){siteLocked(false);}
         if(!is_object($o)){$o=knob($o);}; if(!is_array($o->stak)){$o->stak=[];};
         $n=self::$meta->active; $f=self::$meta->listen->$n;
         if((count($o->stak)<1)&&is_nokey_array(dbug::$temp)&&isset(dbug::$temp[0])&&is_object(dbug::$temp[0]))
         {$o->stak=dupe(dbug::$temp); dbug::$temp=null;}; $r=$f($o);
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
   function defail($de=0)
   {
      ob_start(); $tn=dbug::trap(); dbug::trap('hush');
      if($de){error_reporting(0);};
      return $tn;
   }

   function enfail($tn='anon',$rs=null)
   {
      $b=''; while(ob_get_level()){$b.=("\n".ob_get_clean());}; $b=trim($b);
      error_reporting(E_ALL); $rb=dbug::bufr(); dbug::trap($tn);
      if(!$rs){return $rb;}; // no result-string .. returns array
      $rs=[]; foreach($rb as $eo){$rs[]=$eo->mesg;}; $rs=implode("\n",$rs);
      return trim($rs."\n".$b);
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
      $e=knob(['name'=>dbug::name($e[0]),'mesg'=>trim($e[1]."\n".$b),'file'=>$e[2],'line'=>$e[3]]); $e->stak=stak(); $s=$e->stak;
      // if(isset($s[0])&&($s[0]->func==='imap_open')&&($e->name==='Warning')){return;}; // shut it!
      if(($e->name==='Warning')&&isset($s[1])) // let's see if this warning is necessary
      {
         if(($s[0]->func==='is_readable')&&($s[1]->func==='isee')){return;}; // shut it!
         if(($s[0]->func==='stat')&&($s[1]->func==='info')&&(strpos($e->mesg,'/Proc/temp/lock/'))){return;}; // quiet!
      };
      dbug::view($e);
   });

   register_shutdown_function(function()
   {
      $e=\error_get_last(); if(!$e||envi("HALT")){exit;}; \error_clear_last(); $b='';
      while(ob_get_level()){$b.=("\n".ob_get_clean());}; $b=trim($b);
      $e=knob(['name'=>dbug::name($e['type']),'mesg'=>trim($e['message']."\n".$b),'file'=>$e['file'],'line'=>$e['line']]);
      $e->stak=stak(); dbug::view($e); exit;
   });
# ---------------------------------------------------------------------------------------------------------------------------------------------
