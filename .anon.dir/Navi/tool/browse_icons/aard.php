<?
namespace Anon;



$init = function()
{
   $v=pget('$/Site/dcor/icon.fnt'); $v=stub($v,'/**********/')[2];
   $v=swap($v,'.icon-',''); $v=depose($v,':','}'); $v=encode::jso(frag(trim($v),"\n"));
   $r=import('$/Proc/tool/browse_icons/aard.js',['iconList'=>$v]); ekko($r);
};
