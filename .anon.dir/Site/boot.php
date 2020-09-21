<?
namespace Anon;



# func :: guiStrap : make & send boot cookie
# ---------------------------------------------------------------------------------------------------------------------------------------------
   function guiStrap($u=null,$sc=1)
   {
      $h=sesn('HASH'); $v=knob(); $p='$/Site/base/aard.js'; $d=[];
      if(!$u){$u=sesn('USER');}; $v->SESNUSER=$u; $v->SESNCLAN=pget("$/User/data/$u/clan"); $v->SESNMAIL=user('mail');
      $v->denyDomainSpoofs=tval(conf("Proc/antiHack")->denyDomainSpoofs);
      foreach($_COOKIE as $cn => $cv){if(test($cn,'/^[a-z0-9]{40}$/')&&($cn!==$h)){kuki($cn,VOID);}};
      $c=import($p,$v); $c=base64_encode(strrev($c)); $m=4000;

      $f="after encoding, `$p` exceeds maximum cookie size of $m bytes";
      if(span($c)>$m){fail::boot($f);};

      if($sc){kuki($h,$c);return true;}; return $c;
   }
# ---------------------------------------------------------------------------------------------------------------------------------------------



# evnt :: siteEvent : signal `siteEvent` only if so configured
# ---------------------------------------------------------------------------------------------------------------------------------------------
    if(!facing('SSE')&&!facing('DPR')&&conf('Proc/autoConf')->eventSpy)
    {
        $d=['USERNAME'=>user('name'),'USERCLAN'=>user('clan'),'USERMAIL'=>user('mail'),'SESNHASH'=>sesn('HASH')];
        $o='SSL_SERVER_CERT '; foreach($_SERVER as $k => $v)
        {$x='REDIRECT_'; $a=str_replace($x,'',$k); if(!array_key_exists($a,$d)&&!isin($o,$a)){$d[$a]=$v;}};
        signal::siteEvent($d,'.sudo');
    };
# ---------------------------------------------------------------------------------------------------------------------------------------------



# cond :: identify : the request
# ---------------------------------------------------------------------------------------------------------------------------------------------
    $ai=conf('Site/identity')->appImage; if((NAVIPATH===$ai)&&isee($ai)){finish($ai); exit;}; unset($ai); // for openGraph and friends
# ---------------------------------------------------------------------------------------------------------------------------------------------



# cond :: boot : GUI .. boot view first
# ---------------------------------------------------------------------------------------------------------------------------------------------
     if(facing('GUI BOT'))
     {
        guiStrap();
        //ekko::head(['Referrer-Policy'=>'origin','cache'=>false,'cookies'=>true]); // send bootStrap headers
        $v=['botHoney'=>conf('Proc/badRobot')->lure,'busyGear'=>base64_encode(pget('$/Site/base/busy.htm'))];
        $v['WACKMESG']=base64_encode(pget('$/Proc/info/hack.inf'));
        $v=fuse($v,conf('Site/identity'));
        $r=import('$/Site/base/aard.htm',$v);
        echo($r); done(); // send BootStrap GUI keeping headers intact
     };

     if(facing('DPR')&&(NAVIPATH==='/Site/base/boot.js'))
     {
        $l=stemList(A); $r=[]; foreach($l as $i)
        {
           $p=path::conf($i); if(!$p){continue;}; $d=dval(pget("$p/siteBoot"));
           if(!$d){continue;}; if(isText($d)){$d=[$d];}; if(!isNuma($d)){continue;};
           foreach($d as $f){if(!isText($f)){fail("invalid config in: `$p/siteBoot`");}; $r[]=$f;};
        };

        $v=knob(['bootList'=>tval($r)]); unset($d); $d=[]; $x=pget('$/Proc/info/pass.inf');
        $c=pget('$/User/data/master/pass'); if(!$c){wack();}; if(password_verify($x,$c)){$d[]='editRootPass';};
        $c=pget('$/Proc/conf/autoMail'); if(!isin($c,'mail://')||!isin($c,'@')||!isin($c,'.')){$d[]='confAutoMail';}; // debug automail
        $v->badCfg=base64_encode(tval($d));

        if(!kuki("INTRFACE")&&MADEFUBU&&envi("ALTHANDLER")){$v->INTRFACE="ALT"; kuki("ALTHANDLER","yes");};
        finish(NAVIPATH,$v,FORGET);
    };
# ---------------------------------------------------------------------------------------------------------------------------------------------
