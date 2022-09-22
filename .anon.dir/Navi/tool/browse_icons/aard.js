"use strict";

requires(['/Navi/tool/browse_icons/aard.css']);


extend(Anon.Navi.tool)
({
   browse_icons:function(tab, v,g)
   {
      v=tab.body.select('.NaviViewPanl')[0];

      v.insert
      ([
         {grid:
         [
            {row:[{col:'#NaviIconFind .posRel', contents:[{input:'.toolTextFeed .dark', icon:'search1', listen:{'key:Enter':function()
            {
               select('#NaviIconList').doSearch(this.value);
            }}}]}]},
            {row:[{col:'.panlHorzLine', contents:[{hdiv:''}]}]},
            {row:[{col:[{panl:'#NaviIconList', contents:
            [
               {div:'', style:'padding:10px', contents:
               [
                  {h3:`Search for icons`},
                  {div:`Type what you're looking for in the search-input above and press "Enter" on your keyboard.`},
                  {div:`To show ALL the icons, type: *`},
                  {tiny:`There are many icons and it's frustrating to wait for ALL of them to render every time.`},
               ]},
            ]}]}]},
         ]},
      ]);

      select('#NaviIconFind input')[0].focus(); g=select('#NaviIconList'); let x=keys(styleSheet('/Site/dcor/icon.woff'));
      g.iconList=[]; x.forEach((i)=>{if(i.startsWith('.icon-')){i=i.split('::')[0].slice(6); radd(g.iconList,i)}}); x=VOID;

      g.doSearch=function(w, l,k,s,t,i,d,p)
      {
         w=w.trim(); this.innerHTML=''; if(!w){this.insert({p:'', style:'padding:10px', contents:'nothing to find'});return};
         if(w=='*'){l=dupe(this.iconList)}else{l=[]; this.iconList.forEach((q)=>{if(isin(q,w)){radd(l,q)}})}; s=l.length; d=0; p=0;
         if(s<1){this.insert({p:'', style:'padding:10px', contents:`nothing matched "${w}" .. try: *`});return};

         Busy.edit('thinking',1);
         tick.until(()=>{return (p>99)},()=>
         {
            i=l.shift();
            g.insert
            ([
               {div:'.iconCardPane', tabindex:-1, onclick:function(){copyToClipboard(this.select('input')[0].value); this.focus()},
               contents:
               [
                  {grid:'.iconCardGrid',contents:
                  [
                     {row:[{col:'.iconCardFace',contents:[{i:('.icon-'+i)}]}]},
                     {row:[{col:'.iconCardText',contents:[{input:'',type:'text',readonly:true,value:i}]}]},
                  ]}
               ]}
            ]);
            d++; p=Math.floor((d/s)*100); Busy.edit('thinking',p);
         });

      };
   },
});
