"use strict";


requires(['/Repo/bits/aard.css']);



select('#AnonAppsView').insert
([
   {panl:'#RepoPanlSlab', contents:
   [
      {grid:'.AnonPanlSlab', contents:
      [
         {row:
         [
            {col:'.sideMenuView', contents:
            [
               {grid:
               [
                  {row:[{col:'.slabMenuHead', contents:'repo'}]},
                  {row:[{col:'.panlHorzLine', contents:[{hdiv:''}]}]},
                  {row:[{col:'.slabMenuBody', contents:[{panl:'#RepoTreeMenu'}]}]},
               ]}
            ]},
            {col:'.panlVertDlim', role:'gridFlex', axis:X, target:'<', contents:{vdiv:''}},
            {col:
            [
               {grid:
               [
                  {row:[{col:'#RepoHeadView .slabViewHead', contents:[{tabber:'#RepoTabber', theme:'.dark', target:'#RepoBodyPanl'}]}]},
                  {row:[{col:'.panlHorzLine', contents:{hdiv:''}}]},
                  {row:[{col:'.slabViewBody', contents:{panl:'#RepoBodyPanl'}}]},
               ]}
            ]},
         ]}
      ]}
   ]}
]);




extend(Anon)
({
   Repo:
   {
      anew:function(cbf)
      {
      },

      init:function()
      {
         Busy.edit('/Repo/panl.js',100);
         dump(`Repo ready`);
      },


      open:function(p)
      {
         dump('TODO :: Repo.open file: '+p);
      },
   }
});
