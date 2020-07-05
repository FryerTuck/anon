<?
namespace Anon;

$export=function($v)
{
   $fa=$v->fromAddy; $sp=$v->savePath; $am='autoMail'; $bn=find::firmByMail($fa);
   if(!isee("$sp/business")){path::make("$sp/business",$bn);}; // assign a business to email
   $ba=conf("Bill/$am"); if(!$ba){$ba=conf("Proc/$am");};
   $da=$v->destAddy; $i=path::info($ba); $ba="$i->user@$i->host"; // billing address

   if($da!==$ba){return;}; // not meant for billing

   // Do stuff here with billing
};
