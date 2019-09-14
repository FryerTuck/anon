<?
namespace Anon;

$export=function($td,$un,$pw)
{
   $h="/User/data/$un"; if(!isee($h)){ekko("username `$un` is undefined");};


   if($td==='login')
   {
      $h=pget("$h/pass"); $r=password_verify($pw,$h); if(!$r){ekko('invalid password');}; // RTFC
      $k=sesn('HASH'); path::make("/Proc/temp/sesn/$k/USER",$un); // update session server side
      Time::logEvent($un,pget("/User/data/$un/clan"),'API');
      $l=array_keys($_COOKIE); $t='/^[a-z0-9]{40}$/';
      foreach($l as $i){if(!test($i,$t)||($i===$h)){continue;}; kuki($i,null); unset($_COOKIE[$i]); void("/Proc/temp/sesn/$i");};
      $cv=guiStrap($un,0); $_COOKIE[$k]=$cv;
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
