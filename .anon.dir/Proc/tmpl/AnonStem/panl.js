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
            {col:".sideMenuView", contents:
            [
               {grid:
               [
                  {row:[{col:".slabMenuHead", contents:"AnonStem"}]},
                  {row:[{col:".panlHorzLine", contents:[{hdiv:""}]}]},
                  {row:[{col:'.slabMenuBody', contents:[{grid:
                  [
                     {row:[{col:'#AnonStemToolView', contents:[{panl:'#AnonStemToolPanl .sideMenuToolPanl', contents:
                     [

                     ]}]}]},
                     {row:[{col:'.panlHorzLine', contents:[{hdiv:''}]}]},
                     {row:[{col:'#AnonStemTreeView', contents:[{panl:'#AnonStemTreePanl .sideMenuTreePanl', contents:
                     [
                        {treeview:'', source:'/User/treeMenu', uproot:true, listen:
                        {
                           'LeftClick':function(evnt)
                           {
                              let ctrl=evnt.ctrlKey; let shft=evnt.shiftKey;
                              if(ctrl||shft){evnt.stopImmediatePropagation(); evnt.preventDefault(); evnt.stopPropagation();};
                              Anon.AnonStem.open(this.info.path,this.info.type,(ctrl?'ctrl':(shft?'shft':VOID)));
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
