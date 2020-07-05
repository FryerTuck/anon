<?
namespace Anon;

$export=function($v)
{
   if(!isin($v->clan,['work','lead','sudo'])){return;};
   $fn=conf('Bill/autoConf')->firmName; $um=$v->mail;

   $pl=plug("sqlite::$/Bill/data/contacts/");
   $ex=$pl->select
   ([
       using => "mailFirm",
       fetch => "firm",
       where => "mail = $um",
   ]);

   if(span($ex)<1)
   {
       $pl->insert
       ([
           using => "mailFirm",
           write =>
           [
               "mail" => $um,
               "firm" => $fn,
           ],
       ]);
   };

   $pl->pacify();
};
