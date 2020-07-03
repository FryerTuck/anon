"use strict";


requires(["/Bill/bits/aard.css"]);



select("#AnonAppsView").insert
([
   {panl:"#BillPanlSlab", contents:
   [
      {grid:".AnonPanlSlab", contents:
      [
         {row:
         [
            {col:".sideMenuView", contents:
            [
               {grid:
               [
                  {row:[{col:".slabMenuHead", contents:"Bill"}]},
                  {row:[{col:".panlHorzLine", contents:[{hdiv:""}]}]},
                  {row:[{col:'.slabMenuBody', contents:[{grid:
                  [
                     {row:[{col:'#BillToolView', contents:[{panl:'#BillToolPanl'}]}]},
                     {row:[{col:'.panlHorzLine', contents:[{hdiv:''}]}]},
                     {row:[{col:'#BillTreeView', contents:[{panl:'#BillTreePanl', contents:
                     [
                        {treeview:'', source:'/User/treeMenu', uproot:true, listen:
                        {
                           'LeftClick':function(evnt)
                           {
                              let ctrl=evnt.ctrlKey; let shft=evnt.shiftKey;
                              if(ctrl||shft){evnt.stopImmediatePropagation(); evnt.preventDefault(); evnt.stopPropagation();};
                              Anon.Bill.open(this.info.path,this.info.type,(ctrl?'ctrl':(shft?'shft':VOID)));
                           },
                        }}
                     ]}]}]},
                  ]}]}]},
               ]}
            ]},
            {col:".panlVertDlim", role:"gridFlex", axis:X, target:"<", contents:[{vdiv:""}]},
            {col:
            [
               {grid:
               [
                  {row:[{col:"#BillHeadView .slabViewHead", contents:[{tabber:"#BillTabber", theme:".dark", target:"#BillBodyPanl"}]}]},
                  {row:[{col:".panlHorzLine", contents:[{hdiv:""}]}]},
                  {row:[{col:".slabViewBody", contents:[{panl:"#BillBodyPanl"}]}]},
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
      },


      init:function()
      {
         Busy.edit("/Bill/panl.js",100);
         signal("BillAppReady");
      },


      open:function(p)
      {
         dump("TODO :: Bill.open "+p);
      },
   }
});
