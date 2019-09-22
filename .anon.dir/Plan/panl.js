"use strict";


requires(['/Plan/dcor/aard.css']);



select('#AnonAppsView').insert
([
   {panl:'#PlanPanlSlab', contents:
   [
      {grid:'.AnonPanlSlab', contents:
      [
         {row:
         [
            {col:'.treeMenuView', contents:
            [
               {grid:
               [
                  {row:[{col:'.slabMenuHead', contents:'plan'}]},
                  {row:[{col:'.panlHorzLine', contents:{hdiv:''}}]},
                  {row:[{col:'.slabMenuBody', contents:{panl:'#PlanTreeMenu'}}]},
               ]}
            ]},
            {col:'.panlVertDlim', contents:{vdiv:''}},
            {col:
            [
               {grid:
               [
                  {row:[{col:'.slabMenuHead'}]},
                  {row:[{col:'.panlHorzLine', contents:{hdiv:''}}]},
                  {row:[{col:'.slabMenuBody', contents:{panl:'#PlanTreeView'}}]},
               ]}
            ]},
         ]}
      ]}
   ]}
]);




extend(Anon)
({
   Plan:
   {
      anew:function(cbf)
      {
      },

      init:function()
      {
         Busy.edit('/Plan/panl.js',100);
      },


      open:function(p)
      {
         dump('TODO :: Plan.open file: '+p);
      },
   }
});
