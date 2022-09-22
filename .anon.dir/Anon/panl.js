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
            {col:".sideMenuView", contents:
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
          dump("anew"); // testing 2
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
             {butn:".longMenuButn", text:"check updates",onclick:function()
             {
                 purl("/Anon/checkUpdates",(rsl)=>
                 {
                     rsl=rsl.body;
                     if(rsl==OK){popAlert("thumbs-up :: All is well : There are no new updates.");return};
                     signal("SoftwareUpdate",rsl);
                 });
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
                     {butn:`.dark .harm`, icon:`skull`, text:`deploy`, trgt:tab.body, hint:`this is dangerous`,
                         onclick:function(evnt,trgt)
                         {
                             trgt=this.trgt;
                             let pn,pv,pc; pn=select(`#deployPurl`); pv=pn.value;
                             if(!pv.startsWith(`ftp://`)){pn.notify(`Only "ftp" is currently supported`); return};
                             popConfirm(`warning :: Are you sure you want to destroy everything at the target specified?`)
                             ({
                                 "harm :: confirm":function()
                                 {
                                     Anon.Anon.tool.remoteDeploy(trgt);
                                     this.root.exit();
                                 },
                             });
                         }
                     },
                  ]},
               ]}]}
             ]}]},
             {row:[{col:[{panl:`.AnonPanlBody`, $:
             [
             ]}]}]},
         ]});
      },



      tool:
      {
          remoteDeploy:function(bdy, tgt)
          {
              bdy=bdy.select(".AnonPanlBody")[0]; bdy.innerHTML="";
              tgt=select("#deployPurl").value;

              purl("/Anon/remoteDeploy",{purl:tgt},(rsl)=>
              {
                  rsl=rsl.body; if(!((rsl||"").startsWith("https://"))){dump(rsl); return};
                  popModal
                  ({
                      head:`thumbs-up :: Deployed!`,
                      body:[{panl:
                      [
                          {h2:`Good News!`},
                          {p:`Anon was deployed successfully.`}
                      ]}],
                      foot:
                      [
                          {butn:`.cool`, text:`visit now`, trgt:rsl, onclick:function()
                          {
                              window.open(this.trgt.split('?')[0]); this.root.exit();
                          }},
                          {butn:`.auto`, text:`maybe later`, trgt:rsl, onclick:function()
                          {
                              this.root.exit();
                          }},
                      ]
                  });
              });
          },
      },
   }
});
