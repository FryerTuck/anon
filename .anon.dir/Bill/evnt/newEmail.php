<?
namespace Anon;

$export=function($v)
{
   $fa=$v->fromAddy; $sp=$v->savePath; $am='autoMail'; $bn=find::firmByMail($fa);
   if(!isee("$sp/business")){path::make("$sp/business",$bn);}; // assign a business to email


   $pl=plug("sqlite::$/Bill/data/contacts/");
   $ex=$pl->select
   ([
       using => "mailFirm",
       fetch => "firm",
       where => "mail = $fa",
   ]);

   if(span($ex)<1)
   {
       $pl->insert
       ([
           using => "mailFirm",
           write =>
           [
               "mail" => $fa,
               "firm" => $bn,
           ],
       ]);
   };

   $pl->pacify();

   $ba=conf("Bill/$am"); if(!$ba){$ba=conf("Proc/$am");}; // autoMail
   $da=$v->destAddy; $i=path::info($ba); $ba="$i->user@$i->host"; // billing address
   if($da!==$ba){return;}; // not meant for billing

   // Do stuff here with billing
};
