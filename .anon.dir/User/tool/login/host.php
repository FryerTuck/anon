<?
namespace Anon;

$export=function($td,$un,$pw)
{
   $h="/User/data/$un"; if(!isee($h)){ekko("username `$un` is undefined");};


   if($td==='login')
   {
      $h=pget("$h/pass"); $r=password_verify($pw,$h); if(!$r){ekko('invalid password');}; // RTFC
      $k=acid(); pset("/Proc/temp/sesn/$k/USER",$un); // update session server side
      // Time::logEvent($un,pget("/User/data/$un/clan"),'API'); 
      wait(50); guiStrap(); ekko(OK); // update session client side .. the client must refresh upon OK response
   };


   if($td==='passwd')
   {
      if($un==='anonymous'){ekko('hahaha :D');}; $uc=sesn('CLAN');
      if((sesn('USER')!==$un)&&!isin($uc,'sudo')){ekko("only members of the `sudo` clan can change the passwords of others");};
      if(!isText($pw,6,36)){ekko('accepted character count is from 6 to 36');};
      if(isin($pw,["\n","\t","\r"," "])){ekko('no white-space allowed, sorry');};
      $x=password_hash($pw,PASSWORD_DEFAULT); pset("$h/pass",$x); ekko(OK);
   };
};
