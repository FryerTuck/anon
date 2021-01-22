<?
namespace Anon;



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
     if((!MADEFUBU&&!facing('API')&&!facing('DPR'))||facing('BOT GUI'))
     {
        $c=conf('Site/autoConf'); $v=knob(); $t=$c->template; $o=($c->showBusy?1:0); $h=sesn('HASH'); $u=sesn('USER');
        $v->SESNUSER=$u; $v->SESNCLAN=pget("$/User/data/$u/clan"); $v->SESNMAIL=user('mail');
        $v->denyDomainSpoofs=tval(conf("Proc/antiHack")->denyDomainSpoofs);
        //ekko::head(['Referrer-Policy'=>'origin','cache'=>false,'cookies'=>true]); // send bootStrap headers

        $v->busyGear=base64_encode(import("$/Site/tmpl/$t/base/busy.htm",["showBusy"=>$o]));
        $v->botHoney=conf('Proc/badRobot')->lure;
        $v=fuse($v,conf('Site/identity')); $r=import('$/Site/base/aard.htm',$v);
        if(userDoes(keys(conf('Site/clanView')))){$_SERVER['RECEIVER']='anon';};
        kuki($h,'...'); kuki("RECEIVER",envi("RECEIVER"));
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

        if(!kuki("INTRFACE")&&MADEFUBU&&(envi("RECEIVER")==='nona')){$v->INTRFACE="ALT";};
        finish(NAVIPATH,$v,FORGET);
    };
# ---------------------------------------------------------------------------------------------------------------------------------------------
