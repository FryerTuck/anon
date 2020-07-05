<?
namespace Anon;

$export=function($v)
{
   if(!isin($v->clan,['work','lead','sudo'])){return;};
   $ci='/Bill/data/contacts/.index'; $cn=conf('Bill/autoConf')->firmName; $um=$v->mail;
   path::make("$ci/$um",$cn);
};
