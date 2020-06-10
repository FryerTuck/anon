"use strict";


requires(["/Anon/bits/aard.css"]);



select("#AnonAppsView").insert
([
   {panl:"#AnonPanlSlab", contents:
   [
      {grid:".AnonPanlSlab", contents:
      [
         {row:
         [
            {col:".treeMenuView", contents:
            [
               {grid:
               [
                  {row:[{col:".slabMenuHead", contents:"Anon"}]},
                  {row:[{col:".panlHorzLine", contents:[{hdiv:""}]}]},
                  {row:[{col:".slabMenuBody", contents:[{panl:"#AnonToolMenu"}]}]},
               ]}
            ]},
            {col:".panlVertDlim", role:"gridFlex", axis:X, target:"<", contents:{vdiv:""}},
            {col:
            [
               {grid:
               [
                  {row:[{col:"#AnonHeadView .slabViewHead", contents:[{tabber:"#AnonTabber", theme:".dark", target:"#AnonBodyPanl"}]}]},
                  {row:[{col:".panlHorzLine", contents:{hdiv:""}}]},
                  {row:[{col:".slabViewBody", contents:{panl:"#AnonBodyPanl"}}]},
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


      init:function(mnu)
      {
         Busy.edit("/Anon/panl.js",100);
         mnu=select("#AnonToolMenu");
         mnu.insert
         ([
             {butn:".longMenuButn", text:"remote install",onclick:function()
             {
                 Anon.Anon.open("remoteDeploy");
             }},
         ]);
      },


      open:function(t, drv,ttl,tab)
      {
         drv=select('#AnonTabber').driver; ttl=`$/Anon/tool/${t}`; tab=drv.select(ttl); if(!!tab){return};
         drv.create({title:ttl}); tab=drv.select(ttl);

         tab.body.insert({grid:
         [
            {row:[{col:`.AnonPanlHead`, $:
            [
               {div:`.panlHeadBanr`, contents:[{grid:
               [
                  {row:
                  [
                     {col:[{input:`#deployPurl .toolTextFeed .dark`, demo:`insert target plug-url here`}]},
                  ]},
                  {row:
                  [
                     {butn:`.dark .good`, text:`deploy`, trgt:tab.body, hint:`deploy fresh Anon at the plug-url above`,
                         onclick:function(){Anon.Anon.tool.remoteDeploy(this.trgt)}
                     },
                  ]},
               ]}]}
             ]}]},
             {row:[{col:[{panl:`.AnonToolBody`, $:
             [
             ]}]}]},
         ]});
      },


      tool:
      {
          remoteDeploy:function(tgt)
          {
              tgt=tgt.select(".AnonToolBody")[0];
              tgt.innerHTML="test 1";
          },
      }
   }
});
