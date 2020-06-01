"use strict";


requires(['/Site/dcor/aard.css']);



select('#AnonAppsView').insert
([
   {panl:'#SitePanlSlab', contents:
   [
      {grid:'.AnonPanlSlab', contents:
      [
         {row:
         [
            {col:'.treeMenuView', contents:
            [
               {grid:
               [
                  {row:[{col:'.slabMenuHead', contents:'Site'}]},
                  {row:[{col:'.panlHorzLine', contents:[{hdiv:''}]}]},
                  {row:[{col:'.slabMenuBody', contents:[{panl:'#SiteToolMenu'}]}]},
               ]}
            ]},
            {col:'.panlVertDlim', role:'gridFlex', axis:X, target:'<', contents:{vdiv:''}},
            {col:
            [
               {grid:
               [
                  {row:[{col:'#SiteHeadView .slabViewHead', contents:[{tabber:'#SiteTabber', theme:'.dark', target:'#SiteBodyPanl'}]}]},
                  {row:[{col:'.panlHorzLine', contents:{hdiv:''}}]},
                  {row:[{col:'.slabViewBody', contents:{panl:'#SiteBodyPanl'}}]},
               ]}
            ]},
         ]}
      ]}
   ]}
]);




extend(Anon)
({
   Site:
   {
      anew:function(cbf)
      {
      },

      init:function()
      {
         Busy.edit('/Site/panl.js',100);
      },


      open:function(p)
      {
         dump('TODO :: Site.open file: '+p);
      },
   }
});
