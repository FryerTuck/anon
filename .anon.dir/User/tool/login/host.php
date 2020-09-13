<?
namespace Anon;

$export=function($td,$un,$pw)
{
   $h="/User/data/$un"; if(!isee($h)){ekko("username `$un` is undefined");};


   if($td==='login')
   {
      $r=password_verify($pw,pget("$h/pass")); if(!$r){ekko('invalid password'); exit;}; // RTFC
      $k=sesn('HASH'); path::make("$/Proc/temp/sesn/$k/USER",$un); // update session server side
      $c=pget("/User/data/$un/clan"); $_SERVER['SESNUSER']=$un; $_SERVER['SESNCLAN']=$c;
      Time::logEvent($un,$c,'API');
// done('testing host');
      // $cv=guiStrap($un,0); $_COOKIE[$k]=$cv;
      ekko(OK); // update session client side .. the client must refresh upon OK response
   };


   if($td==='passwd')
   {
      if($un==='anonymous'){ekko(wack());}; $uc=sesn('CLAN');
      if((sesn('USER')!==$un)&&!isin($uc,'sudo')){ekko("only members of the `sudo` clan can change the passwords of others");};
      if(!isText($pw,6,36)){ekko('accepted character count is from 6 to 36');};
      if(isin($pw,["\n","\t","\r"," "])){ekko('no white-space allowed, sorry');};
      $x=password_hash($pw,PASSWORD_DEFAULT); pset("$h/pass",$x); ekko(OK);
   };
};
