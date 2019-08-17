"use strict";


requires(['/Bill/dcor/aard.css']);



select('#AnonAppsView').insert
([
   {panl:'#BillPanlSlab', contents:
   [
      {grid:'.AnonPanlSlab', contents:
      [
         {row:
         [
            {col:'.treeMenuView', contents:
            [
               {grid:
               [
                  {row:[{col:'.slabMenuHead', contents:'bill'}]},
                  {row:[{col:'.panlHorzLine', contents:{hdiv:''}}]},
                  {row:[{col:'.slabMenuBody', contents:{panl:'#BillTreeMenu'}}]},
               ]}
            ]},
            {col:'.panlVertDlim', contents:{vdiv:''}},
            {col:
            [
               {grid:
               [
                  {row:[{col:'.slabMenuHead'}]},
                  {row:[{col:'.panlHorzLine', contents:{hdiv:''}}]},
                  {row:[{col:'.slabMenuBody', contents:{panl:'#BillTreeView'}}]},
               ]}
            ]},
         ]}
      ]}
   ]}
]);




extend(Anon)
({
   Bill:
   {
      anew:function(cbf)
      {
         select('#BillTabber').closeAll((tv)=>
         {
            tv=select('#BillTreeView').select('treeview');
            if(tv){tv[0].remove()}; tick.after(60,cbf);
         });
      },



      init:function()
      {
         server.listen('bark',(d)=>{dump(d);});

         purl('/Bill/treeMenu',()=>{});

         // select('#BillTreeMenu').insert
         // ([
         //    {treeview:'', source:'/Bill/treeMenu', uproot:true, listen:
         //    {
         //       'LeftClick':function()
         //       {
         //          if(this.info.type=='fold'){return};
         //          Anon.Bill.open(this.info.path);
         //       },
         //    }}
         // ]);
      },


      open:function(p)
      {
         dump('TODO :: Bill.open file: '+p);
      },
   }
});
