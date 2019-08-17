"use strict";

requires(['/Proc/tool/browse_icons/aard.css']);



select('#ProcToolView').insert
([
   {div:'#ProcTool_browse_icons'}
]);



(function(v,l,s,t,i,d,p)
{
   v=select('#ProcTool_browse_icons'); Busy.edit('thinking',1); l=decode.jso('{:iconList:}'); s=l.length; d=0; p=0;

   tick.while(()=>{return (p<100)},()=>
   {
      i=l.shift(); v.insert
      ([
         {div:'.iconCardPane', tabindex:-1, onclick:function(){copyToClipboard(this.select('input')[0].value); this.focus()}, contents:[{grid:'.iconCardGrid',contents:
         [
            {row:[{col:'.iconCardFace',contents:[{i:('.icon-'+i)}]}]},
            {row:[{col:'.iconCardText',contents:[{input:'',type:'text',readonly:true,value:i}]}]},
         ]}]}
      ]);
      d++; p=Math.floor((d/s)*100); Busy.edit('thinking',p);
   });
}());
