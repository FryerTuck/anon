<?
namespace Anon;

$export=function($v)
{
   $bi='/Bill/data/contacts/.index'; $fa=$v->fromAddy; $sp=$v->savePath; $am='autoMail'; $ud='undefined'; $bn=pget("$bi/$fa");

   if(!$bn){path::make("$bi/$fa",$ud); $bn=$ud;}; if(!isee("$sp/business")){path::make("$sp/business",$bn);}; // assign a business to email
   $da=$v->destAddy; $ba=conf("Bill/$am"); if(!$ba){$ba=conf("Proc/$am");}; $i=path::info($ba); $ba="$i->user@$i->host"; // billing address

   if($da!==$ba){return;}; // not meant for billing

   // Do stuff here with billing
};
