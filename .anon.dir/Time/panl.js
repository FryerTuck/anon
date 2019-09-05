"use strict";


requires(['/Time/dcor/aard.css','/Proc/libs/chartist/chartist.css','/Proc/libs/chartist/chartist.js']);



select('#AnonAppsView').insert
([
   {panl:'#TimePanlSlab', contents:
   [
      {grid:'.AnonPanlSlab', contents:
      [
         {row:
         [
            {col:'.treeMenuView', contents:
            [
               {grid:
               [
                  {row:[{col:'.slabMenuHead', contents:'time'}]},
                  {row:[{col:'.panlHorzLine', contents:[{hdiv:''}]}]},
                  {row:[{col:'#TimeTreeView .slabMenuBody', contents:[{panl:'#TimeTreePanl', contents:
                  [
                     {treeview:'', source:'/User/treeMenu', uproot:true, listen:
                     {
                        'LeftClick':function()
                        {
                           if(this.info.type=='fold'){return};
                           Anon.Time.open(this.info.path);
                        },
                     }}
                  ]}]}]},
               ]}
            ]},
            {col:'.panlVertDlim', role:'gridFlex', axis:X, target:'<', contents:{vdiv:''}},
            {col:
            [
               {grid:'#TimeMainGrid', contents:
               [
                  {row:[{col:'#TimeHeadView .slabViewHead', contents:
                  [
                     {tabber:'#TimeTabber', tabStyle:'.tabsDark', target:'#TimeBodyPanl'}
                  ]}]},
                  {row:[{col:'.panlHorzLine', contents:[{hdiv:''}]}]},
                  {row:[{col:'.slabViewBody', contents:
                  [
                     {grid:'#TimeViewGrid', contents:[{row:
                     [
                        {col:'#TimeBodyView', contents:[{panl:'#TimeBodyPanl'}]},
                        {col:'.panlVertLine', contents:[{vdiv:''}]},
                        {col:'#TimeToolView', contents:[{panl:'#TimeToolPanl'}]},
                     ]}]}
                  ]}]},
               ]}
            ]},
         ]}
      ]}
   ]}
]);




extend(Anon)
({
   Time:
   {
      vars:{cmnd:{},keys:''},



      anew:function(cbf)
      {
         select('#TimeTabber').closeAll((tv)=>
         {
            tv=select('#TimeTreeView').select('treeview');
            if(tv){tv[0].remove()}; tick.after(60,cbf);
         });
      },



      init:function(slf)
      {
      },



      open:function(pth)
      {
      },



      tool:
      {
      },
   }
});
