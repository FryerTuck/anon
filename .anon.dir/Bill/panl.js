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
            {col:".treeMenuView", contents:
            [
               {grid:
               [
                  {row:[{col:".slabMenuHead", contents:"Bill"}]},
                  {row:[{col:".panlHorzLine", contents:[{hdiv:""}]}]},
                  {row:[{col:".slabMenuBody", contents:[{panl:"#BillTreeMenu"}]}]},
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
