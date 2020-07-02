"use strict";


requires(["/AnonStem/bits/aard.css"]);



select("#AnonAppsView").insert
([
   {panl:"#AnonStemPanlSlab", contents:
   [
      {grid:".AnonPanlSlab", contents:
      [
         {row:
         [
            {col:".treeMenuView", contents:
            [
               {grid:
               [
                  {row:[{col:".slabMenuHead", contents:"AnonStem"}]},
                  {row:[{col:".panlHorzLine", contents:[{hdiv:""}]}]},
                  {row:[{col:".slabMenuBody", contents:[{panl:"#AnonStemTreeMenu"}]}]},
               ]}
            ]},
            {col:".panlVertDlim", role:"gridFlex", axis:X, target:"<", contents:[{vdiv:""}]},
            {col:
            [
               {grid:
               [
                  {row:[{col:"#AnonStemHeadView .slabViewHead", contents:[{tabber:"#AnonStemTabber", theme:".dark", target:"#AnonStemBodyPanl"}]}]},
                  {row:[{col:".panlHorzLine", contents:[{hdiv:""}]}]},
                  {row:[{col:".slabViewBody", contents:[{panl:"#AnonStemBodyPanl"}]}]},
               ]}
            ]},
         ]}
      ]}
   ]}
]);




extend(Anon)
({
   AnonStem:
   {
      anew:function(cbf)
      {
      },


      init:function()
      {
         Busy.edit("/AnonStem/panl.js",100);
         signal("AnonStemAppReady");
      },


      open:function(p)
      {
         dump("TODO :: AnonStem.open "+p);
      },
   }
});
