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
         select('#PlanTabber').closeAll((tv)=>
         {
            tv=select('#PlanTreeView').select('treeview');
            if(tv){tv[0].remove()}; tick.after(60,cbf);
         });
      },

      init:function()
      {
         select('#PlanTreeMenu').insert
         ([
            {treeview:'', source:'/Plan/treeMenu', uproot:true, listen:
            {
               'LeftClick':function()
               {
                  if(this.info.type=='fold'){return};
                  Anon.Plan.open(this.info.path);
               },
            }}
         ]);
      },


      open:function(p)
      {
         dump('TODO :: Plan.open file: '+p);
      },
   }
});
