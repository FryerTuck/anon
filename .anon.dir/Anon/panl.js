"use strict";


requires(['/Anon/bits/aard.css']);



select('#AnonAppsView').insert
([
   {panl:'#AnonPanlSlab', contents:
   [
      {grid:'.AnonPanlSlab', contents:
      [
         {row:
         [
            {col:'.treeMenuView', contents:
            [
               {grid:
               [
                  {row:[{col:'.slabMenuHead', contents:'Anon'}]},
                  {row:[{col:'.panlHorzLine', contents:[{hdiv:''}]}]},
                  {row:[{col:'.slabMenuBody', contents:[{panl:'#AnonTreeMenu'}]}]},
               ]}
            ]},
            {col:'.panlVertDlim', role:'gridFlex', axis:X, target:'<', contents:{vdiv:''}},
            {col:
            [
               {grid:
               [
                  {row:[{col:'#AnonHeadView .slabViewHead', contents:[{tabber:'#AnonTabber', theme:'.dark', target:'#AnonBodyPanl'}]}]},
                  {row:[{col:'.panlHorzLine', contents:{hdiv:''}}]},
                  {row:[{col:'.slabViewBody', contents:{panl:'#AnonBodyPanl'}}]},
               ]}
            ]},
         ]}
      ]}
   ]}
]);




extend(Anon)
({
   Anon:
   {
      anew:function(cbf)
      {
      },

      init:function()
      {
         Busy.edit('/Anon/panl.js',100);
      },


      open:function(p)
      {
         dump('TODO :: Anon.open file: '+p);
      },
   }
});
