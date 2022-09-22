<?
namespace Anon;



# tool :: Time : assistance
# ---------------------------------------------------------------------------------------------------------------------------------------------
   class Time
   {
      static $meta;


      static function __init()
      {
         if(!isin(NAVIPATH,'/Time/getTools.js')){return;}; $h='/Time/tool'; $l=pget($h);
         $r="\"use strict\";\n\n"; foreach($l as $i){$s=pget("$h/$i"); $r.="$s\n\n\n";};
         ekko::head(['Content-Type'=>mime('js')]); echo $r; defn(['HALT'=>1]); exit;
      }


      static function initMenu()
      {
         $r=pget('/Time/menu'); dump($r);
      }


      static function saveFltr()
      {
         $v=knob($_POST); $n=swap($v->title,' ','_'); $u=swap($v->using,' ',''); $f=swap($v->fetch,' ',''); $w=swap($v->where,' ','');
         $g=swap($v->group,' ',''); $l=swap($v->limit,' ','');
         $d=knob
         ([
            'using' => ($u?frag($u,','):null),
            'fetch' => ($f?frag($f,','):null),
            'where' => ($w?frag($w,','):null),
            'group' => ($g?$g:null),
            'limit' => ($l?$l:null),
         ]);
         $d=encode::jso($d); path::make("/Time/menu/$n.json",$d);
         return OK;
      }


      static function openFltr()
      {
         $v=knob($_POST); $p=$v->path; import($p,['PATH'=>$p]);
         done(FAIL);
      }


      static function execFltr()
      {
         $v=knob($_POST); $p=$v->path; $v=$v->data; $v->PATH=$p; import($p,$v);
         done(FAIL);
      }


      static function readData()
      {
         $v=knob($_POST); $f=$v->fltr; if(isPath($f)){$r=import("/Time/menu/$f"); dump($f);}; unset($f->title);
         if(isText($f->using)){$f->using=swap($f->using,' ',''); $f->fetch=swap($f->fetch,' ',''); $f->where=swap($f->where,', ','');
         $f->group=swap($f->group,' ',''); $f->limit=swap($f->limit,' ',''); $f->using=($f->using?frag($f->using,','):null);
         $f->fetch=($f->fetch?frag($f->fetch,','):null); $f->where=($f->where?frag($f->where,','):null);
         $f->group=($f->group?$f->group:null); $f->limit=($f->limit?$f->limit:null);}; $l=$f->using; $u=[]; $q=pget('/Time/data');
         foreach($q as $i){if(rstub($i,'.')[2]==='sdb'){$a=0; foreach($l as $x){if(akin($i,"$x*")){$a=1;break;}}; if($a){$u[]=$i;}}};
         if(span($f->fetch)!==1){fail('invalid column selection');}; $fn=$f->fetch[0]; unset($o);
         if(isin(['epochSec','sesnBsec'],$fn)){fail('invalid column selection');}; $f->fetch[]='sesnBsec'; $f->where[]='sesnBsec > 0';

         unset($f->using); $f->using='logs'; $r=[]; foreach($u as $y)
         {
            $d=crud("sqlite::/Time/data/$y")->select($f); $r=concat($r,$d);
         };

         $z=knob(); foreach($r as $o){$cn=$o->$fn; if(!$z->$cn){$z->$cn=0;}; $z->$cn+=(($o->sesnBsec/60)/60);};
         dump($z);
      }


      static function logEvent($user=null,$clan=null,$face=null)
      {
         if(!$user){$user=user('name'); $clan=user('clan'); $face=envi('INTRFACE');}; $udef='?'; $pfat=''; $task=[];
         if(isin($face,['DPR','SSE'])||!isin($clan,['work','sudo'])){return;}; $npth=NAVIPATH; $lgfn=date("Y-m-d"); $vars=knob($_POST);
         if(isin(['/Proc/enhook','/','/Proc/busy.htm'],$npth)){return;};
         if(!isee('/Time/data/')){pset('/Time/data/');}; // TODO :: this needs to be done elsewhere
         $data=crud("sqlite::/Time/data/$lgfn.sdb");
         $arg=$vars->args; if(!is_array($arg)||!isset($arg[0])){$arg=null;};
         $wpth=($vars->purl?$vars->purl:($vars->path?$vars->path:$vars->trgt)); $nt=find::taskByPath($npth); $wt=find::taskByPath($wpth);
         if(!$wpth&&$arg){$a=$arg[0]; $wpth=(rstub($npth,"/$a")?((isset($arg[1])?$arg[1]:null)):$a);}; if($nt){$task[]=[$nt,$npth,$wpth];};
         if($wt&&($wt!==$nt)){$task[]=[$wt,$npth,$wpth];}; if(count($task)<1){$task[]=[$udef,$npth,$wpth];}; $ts=time(); $yr=(date('Y')*1);
         $mt=(date('n')*1); $da=(date('j')*1); $hr=(date('G')*1); $ms=date('M'); $ds=date('D'); $bs=sesn('BSEC'); $bs=($bs*1);

         foreach($task as $prts)
         {
            $dokt=$prts[0]; $npth=$prts[1]; $fa=$prts[2]; $firm=find::firmByTask($dokt); if(!isText($fa)){$fa=tval(($fa===null)?'':$fa);};
            $wpth=crop(trim($fa,'"'),60); if($pfat==="$firm.$dokt"){continue;}; $pfat="$firm.$dokt"; $dokt=(($dokt==='?')?'':$dokt);
            $data->insert([using=>'logs',write=>[$yr,$ms,$mt,$ds,$da,$hr,$ts,$bs,$firm,$dokt,$user,$clan,$npth,$wpth]]);
         };

         return true;
      }
   }
# ---------------------------------------------------------------------------------------------------------------------------------------------
