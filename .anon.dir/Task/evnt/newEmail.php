<?
namespace Anon;

$export=function($v)
{
   wait(60); // wait for `Bill` to assign business-name

   $mo=path::ogle
   ([
      using => $v->savePath,
      fetch => '*',
      // limit => ['levl'=>0, 'name'=>'mesgHead,fromName,fromAddy,textBody,business,attached'],
      shape => 'name:data',
   ]);

   $nd=0; $od=0; $dj=0; $mh=$mo->mesgHead; $dr=expose($mh,'#',' -'); if($dr){$dr=$dr[0]; if(!test($dr,'/^[a-zA-Z0-9]{12}$/')){$dr=null;}};
   if(!$dr){$nd=1; $dr=gudref('/Task/data',12);}else{$od=isee("/Task/data/$dr"); if(!$od){$nd=1;$dj=1;}}; $fa=$mo->fromAddy; $fn=$mo->fromName;
   if($fn){$fn=frag($fn,' ')[0];}else{$fn=stub($fa,'@')[0]; $fn=frag($fn,'.')[0];}; $un=find::userByMail($fa); $ft='xenoMail';

   if(!$nd||$od||$dj){$mh=trim(stub($mh,"#$dr -")[1]);}; $tb=$mo->textBody; $mp=stub($tb,"\r\n>");
   if($mp){$tb=$mp[0];}; $mb=rstub($tb,["\r\n\r\n\r\nOn ","\r\n\r\n"]); $mb=($mb?$mb[0]:$tb); if(!$mb){$mb='(no message)';};
   $dd=knob(['dref'=>$dr,'nick'=>$fn,'user'=>$un,'mail'=>$fa,'dest'=>$mo->destAddy,'firm'=>$mo->business,'tags'=>$ft,'atch'=>$mo->attached]);
   if($dj){$dd->tags='dejavu';};

   Proc::impede('busy.mail');
   if($nd)
   {
      $dd->mesg="# $mh\n$mb"; Task::makeDokt($dd); $r=xeno::sendMarkDownMail
      ([
         'fromAddy'=>$mo->destAddy,'destAddy'=>$fa, 'mesgBody'=>'/Task/note/doktMade.md',
         'runDebug'=>true,
         'varsUsed'=>['docketID'=>$dr,'mesgHead'=>$mh,'fromName'=>$fn,'mesgBody'=>$mb],
      ]);
   }
   else
   {
      // $dd['cref']=gudref("/Task/data/$dr/comments",16);
      $dd->mesg=$mb; $r=Task::makeNote($dd); $r=xeno::sendMarkDownMail
      ([
         'fromAddy'=>$mo->destAddy,'destAddy'=>$fa, 'mesgBody'=>'/Task/note/noteMade.md',
         'runDebug'=>true,
         'varsUsed'=>['docketID'=>$dr,'mesgHead'=>$mh,'fromName'=>$fn,'mesgBody'=>$mb],
      ]);
   };
   Proc::resume('busy.mail');

   return $r;
};
