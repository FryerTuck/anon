<?
namespace Anon;



$export=function($a,$u,$d)
{
   $d=dval($d); if(is_assoc_array($d)){$d=knob($d);}; $h="/User/data/$u"; $sudo=isin(user('clan'),'sudo');
   if(isin(['anonymous','master'],$u)){ekko("cannot perform `$a` on user `$u`");};


   if($a==='make')
   {
      if(isee($h)){ekko("username `$u` is taken");}; if(!isKnob($d)){ekko("invalid data given");};
      if(span($d)<2){ekko("missing arguments");}; if(!isMail($d->mail)){ekko("invalid email address");};
      $m=$d->mail; if(!is_nokey_array($d->clan)){$d->clan=[$d->clan];}; $co=knob(); foreach($d->clan as $c)
      {
         if(!isWord($c)){ekko("invalid group-name `$c`");}; $cd=pget("/User/clan/$c");
         if((span($cd)<4)){ekko("invalid description in clan `$c`");}; $co->$c=$cd;
      };
      $l=pget('/User/data'); foreach($l as $i){if(pget("/User/$i/mail")===$m){ekko("email address `$m` is taken");}};

      requires::stem('Mail'); // dependencies
      $p=random(8); $x=password_hash($p,PASSWORD_DEFAULT);
      $cl=[]; foreach($co as $cn => $cv){$cl[]="- **$cn** - $cv";}; $cl=implode("\n",$cl); $vc=knob(dval(pget('/User/conf/viewConf')));
      $ck=$vc->toggleUserPanl; if(isin($ck,'`')){$ck="` $ck `";};

      pset("$h/name",$u); pset("$h/pass",$x); pset("$h/mail",$m); pset("$h/clan",implode(',',$d->clan));
      pset("$h/face",'/User/dcor/mug2.jpg'); pset("$h/rate",'0'); $v=['userName'=>$u]; $p="$h/home/boot"; pset("$p/");
      pset("$p/hack.js",import('/User/tmpl/bootHack.js',$v)); pset("$p/skin.css",import('/User/tmpl/bootSkin.css',$v));
      Proc::signal('madeUser',['nick'=>$u,'mail'=>$m,'clan'=>$cl]);

      signal::busy(['with'=>"mail",'done'=>50]);
      xeno::sendMarkDownMail
      ([
         'destAddy'=>$m, 'mesgBody'=>'/User/note/userMadeMail.md',
         'varsUsed'=>['username'=>$u, 'password'=>$p, 'clanList'=>$cl, 'ctrlKeys'=>$ck],
         'runDebug'=>true,
      ]);
      signal::busy(['with'=>"mail",'done'=>100]);

      ekko(OK);
   };



   if($a==='edit')
   {
      if(!isee($h)){ekko("user `$u` is undefined");}; $cuc=frag(user('clan'),','); $tuc=frag(pget("$h/clan"),',');

      if($d->clan)
      {
         $dcl=(isArra($d->clan)?$d->clan:[$d->clan]);
         foreach($dcl as $dc)
         {
            if(span($dc)<2){ekko('invalid clan name');}; $ca=$dc[0]; $cn=substr($dc,1);
            if(($ca!=='+')&&($ca!=='-')){ekko('invalid clan action');}; $w=(($ca==='+')?'invite others to':'banish members from');

            if(!isin($cuc,$cn)&&!$sudo){ekko("you can only $w clans you belong to .. unless you're a sudoer");};
            if(isin($tuc,$cn)&&($ca==='+')){ekko("$u is already a {$cn}er");};
            if(!isin($tuc,$cn)&&($ca==='-')){ekko("$u is not a {$cn}er");};
            if(!isee("/User/clan/$cn")){ekko("clan `$cn` is undefined");};
            if(($cn==='sudo')&&!isin($cuc,'sudo')&&!isin($cuc,'lead')){ekko('only a sudo leader can do that');};
            if(!isin($cuc,['gang','lead','sudo'])){ekko('only gangers, leaders and sudoers can do that');};

            if($ca==='+'){radd($tuc,$cn);}else{xpop($tuc,$cn);};
         };
         $tuc=fuse($tuc,','); path::make("$h/clan",$tuc); ekko(OK);
      };

      if($d->mail)
      {
         $m=$d->mail; if(!isMail($m)){ekko('invalid email address');};
         if(($u!==user('name'))&&!isin($cuc,['gang','lead','sudo'])){ekko("only `$u` and gangers, leaders, sudoers can do that");};
         path::make("$h/mail",$m); if(isRepo("$h/home/root")){exec::{"git config --local user.email \"$m\""}("$h/home/root");};
         // if the user has other repositories, then the above should be done for each
         ekko(OK);
      };

      if($d->name)
      {
         todo::{'develop `change username`'}('This could be very complex, but, convenient to have.');
      };

      if($d->pass)
      {
         if($u!==user('name')){ekko('a user can only change their own password');};
         $p=$d->pass; if(!isPass($p)){ekko('invalid (or weak) password .. use: `help user` for more info');};
         $x=password_hash($p,PASSWORD_DEFAULT); path::make("$h/mail",$x); ekko(OK);
      };

      ekko("invalid edit option `$a` .. use: `help user` for more info");
   };



   if($a==='info')
   {
      $m=pget("$h/mail"); $c=pget("$h/clan"); ekko("$m .. $c");
   };



   if($a==='list')
   {
      $r=pget('/User/data'); $r=fuse($r,"\n"); ekko($r);
   };



   if($a==='void')
   {
      if(!userDoes("sudo lead")){ekko("only leaders and sudoers can do that"); exit;};
      if(!isee($h)){ekko("user `$u` is undefined"); exit;};  $s=find::sesnByUser($u);
      signal::ClientReboot("user deleted","#$u");
      if($s){path::void("/Proc/temp/sesn/$s");}; path::void($h);
      ekko(OK);
   };


   ekko("user command `$a` has not been developed .. yet");
};
