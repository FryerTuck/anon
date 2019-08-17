<?
namespace Anon;

$export=function($v)
{
   if(!isin($v->clan,['work','lead','sudo'])){return;};
   $ci='/Bill/data/contacts/.index'; $cn=conf('Bill/firmName'); $um=$v->mail;
   path::make("$ci/$um",$cn);
};
