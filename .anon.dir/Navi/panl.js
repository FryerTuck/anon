"use strict";


requires(['/Navi/dcor/aard.css']);



select('#AnonAppsView').insert
([
   {panl:'#NaviPanlSlab', contents:
   [
      {grid:'.AnonPanlSlab', contents:
      [
         {row:
         [
            {col:'.treeMenuView', contents:
            [
               {grid:
               [
                  {row:[{col:'.slabMenuHead', contents:'navi'}]},
                  {row:[{col:'.panlHorzLine', contents:[{hdiv:''}]}]},
                  {row:[{col:'.slabMenuBody', contents:[{grid:
                  [
                     {row:[{col:'#NaviTreeView', contents:[{panl:'#NaviTreePanl', contents:
                     [
                        {treeview:'', source:'/User/treeMenu', uproot:true, listen:
                        {
                           'LeftClick':function(evnt)
                           {
                              let ctrl=evnt.ctrlKey; let shft=evnt.shiftKey;
                              if(ctrl||shft){evnt.stopImmediatePropagation(); evnt.preventDefault(); evnt.stopPropagation();};
                              Anon.Navi.open(this.info.path,this.info.type,(ctrl?'ctrl':(shft?'shft':VOID)));
                           },

                           'mouseover,mouseout':function(evnt)
                           {
                              if(evnt.type=='mouseout'){this.declan('treeItemCtrl'); this.declan('treeItemShft'); this.blur(); return};
                              this.focus(); if(evnt.ctrlKey){this.enclan('treeItemCtrl')}else if(evnt.shiftKey){this.enclan('treeItemShft')};
                           },

                           'keydown,keyup':function(evnt)
                           {
                              let k=evnt.signal; if((k!='Control')&&(k!='Shift')){return}; k=((k=='Control')?'Ctrl':'Shft');
                              if(evnt.type=='keydown'){this.enclan('treeItem'+k);return}; this.declan('treeItem'+k);
                           },
                        }}
                     ]}]}]},
                     {row:[{col:'.panlHorzLine', contents:[{hdiv:''}]}]},
                     {row:[{col:'#NaviToolView', contents:[{panl:'#NaviToolPanl'}]}]},
                  ]}]}]},
               ]}
            ]},
            {col:'.panlVertDlim', role:'gridFlex', axis:X, target:'<', contents:{vdiv:''}},
            {col:
            [
               {grid:'#NaviMainGrid', contents:
               [
                  {row:[{col:'#NaviHeadView .slabViewHead', contents:
                  [
                     {tabber:'#NaviTabber', theme:'.dark', target:'#NaviBodyPanl'}
                  ]}]},
                  {row:[{col:'.panlHorzLine', contents:[{hdiv:''}]}]},
                  {row:[{col:'.slabViewBody', contents:[{panl:'#NaviBodyPanl'}]}]},
               ]}
            ]},
         ]}
      ]}
   ]}
]);




extend(Anon)
({
   Navi:
   {
      anew:function(cbf)
      {
      },

      init:function()
      {
         select('#NaviTreePanl').select('treeview')[0].listen('loaded',ONCE,()=>
         {
            requires('/Navi/getTools.js',()=>
            {
               keys(Anon.Navi.tool).forEach((i)=>
               {
                  select('#NaviToolPanl').insert
                  ({butn:'.longMenuButn', tool:i, text:swap(i,'_',' '), onclick:function(){Anon.Navi.exec(this.tool)}});
               });
               Busy.edit('/Navi/panl.js',100);
            });
         });
      },


      exec:function(t, ttl,drv,tab)
      {
         ttl=`/Navi/tool/${t}`; drv=select('#NaviTabber').driver; tab=drv.select(ttl); if(!!tab){return};
         drv.create({title:ttl, contents:[{panl:'.NaviViewPanl'}]}); tab=drv.select(ttl);
         Anon.Navi.tool[t](tab);
      },


      tool:{},


      open:function(p)
      {
         dump('TODO :: Navi.open path: '+p);
      },
   }
});
