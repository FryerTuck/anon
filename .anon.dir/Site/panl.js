"use strict";


requires(['/Site/dcor/aard.css']);



select('#AnonAppsView').insert
([
   {panl:'#SitePanlSlab', contents:
   [
      {grid:'.AnonPanlSlab', contents:
      [
         {row:
         [
            {col:'.treeMenuView', contents:
            [
               {grid:
               [
                  {row:[{col:'.slabMenuHead', contents:'Site'}]},
                  {row:[{col:'.panlHorzLine', contents:[{hdiv:''}]}]},
                  {row:[{col:'.slabMenuBody', contents:[{panl:'#SiteToolMenu'}]}]},
               ]}
            ]},
            {col:'.panlVertDlim', role:'gridFlex', axis:X, target:'<', contents:{vdiv:''}},
            {col:
            [
               {grid:
               [
                  {row:[{col:'#SiteHeadView .slabViewHead', contents:[{tabber:'#SiteTabber', theme:'.dark', target:'#SiteBodyPanl'}]}]},
                  {row:[{col:'.panlHorzLine', contents:{hdiv:''}}]},
                  {row:[{col:'.slabViewBody', contents:{panl:'#SiteBodyPanl'}}]},
               ]}
            ]},
         ]}
      ]}
   ]}
]);




extend(Anon)
({
   Site:
   {
      anew:function(cbf)
      {
      },



      init:function()
      {
         let panl=select(`#SiteToolMenu`);

         panl.insert
         ([
            {butn:`.longMenuButn`, text:`browse templates`, onclick:function(){Anon.Site.open(`import`,`browse`)}},
            {butn:`.longMenuButn`, text:`import from URL`, onclick:function(){Anon.Site.open(`import`,`fromURL`)}},
         ]);

         Busy.edit('/Site/panl.js',100);
      },



      open:function(t,s,a, drv,ttl,tab)
      {
         drv=select('#SiteTabber').driver; ttl=`/Site/tool/${t}/${s}`; tab=drv.select(ttl); if(!!tab){return};
         drv.create({title:ttl}); tab=drv.select(ttl);
         Anon.Site.tool[t][s](tab,a);
      },



      tool:
      {
         import:
         {
             browse:function(tab)
             {
                tab.body.insert({grid:
                [
                    {row:[{col:`.SitePanlHead`, $:
                    [
                       {div:`.panlHeadBanr`, contents:[{grid:`.noSpan`, $:
                       [
                          {row:
                          [
                             {col:[{input:`#browseIndx .toolTextFeed .dark`, demo:`0`, title:`start from`}]},
                             {col:[{butn:`#browseButn .AnonToolButn`, icon:`eye`, onclick:function(){this.exec()}, exec:function()
                             {
                                 let frm=((select(`#browseIndx`).value.trim()*1)||0);
                                 if(!isInum(frm)){popAlert(`invalid "start from" number`);return};
                                 // Busy.edit(`/Site/importBrowse`,0);
                                 purl(`Site/importBrowse`,{from:frm},(rsp)=>
                                 {
                                     rsp=decode.jso(rsp.body);  let bdy=select(`#SiteBrwsBody`);
                                     bdy.innerHTML=""; rsp.forEach((o)=>
                                     {
                                         bdy.insert({wrap:
                                         [
                                             {div:`.tmplItem .spanBoth`,
                                                style:{backgroundImage:`url('${o.face}')`},
                                                title:o.name,
                                                targt:o.href,
                                                onclick:function()
                                                {
                                                    Anon.Site.open(`import`,`fromURL`,this.targt);
                                                }
                                             }
                                         ]});
                                     });
                                 });
                             }}]},
                          ]},
                       ]}]}
                     ]}]},
                     {row:[{col:[{panl:`#SiteBrwsBody`, $:
                     [
                     ]}]}]},
                ]});

                select(`#browseButn`).exec();
             },


             fromURL:function(tab,url)
             {
                tab.body.insert({grid:
                [
                    {row:[{col:`.SitePanlHead`, $:
                    [
                       {div:`.panlHeadBanr`, contents:[{grid:
                       [
                          {row:
                          [
                             {col:[{input:`#importPurl .toolTextFeed .dark`, demo:`paste free template URL here`, value:(url||"")}]},
                          ]},
                          {row:
                          [
                             {butn:`.dark .need`, text:`load`, onclick:function(){Anon.Site.tool.import.load()}},
                             {butn:`.dark .good`, text:`save`},
                             {butn:`.dark .auto`, text:`void`},
                          ]},
                       ]}]}
                     ]}]},
                     {row:[{col:[{panl:`#SiteTmplBody .SiteTmplBody`, $:
                     [
                     ]}]}]},
                ]});

                if(url){Anon.Site.tool.import.load()};
            },


            load:function(url,bdy,pth,frm)
            {
                url=select(`#importPurl`).value;
                bdy=select(`#SiteTmplBody`); bdy.innerHTML="";
                Busy.edit(`/Site/importOpen`,0);
                purl(`/Site/importOpen`,{purl:url},function(rsp)
                {
                    pth=rsp.body;
                    frm=create({iframe:`#SiteXenoTmpl`, src:pth, onload:function()
                    {
                        let root=this.contentWindow;
                        let cntx=root.document;

                        let focs=cntx.createElement("style");
                        focs.innerHTML=`
                        .AnonInspects
                        {
                          outline:auto !important;
                          outline-color:hsla(220,100%,60%,1) !important;
                          background-color:hsla(220,100%,60%,0.3) !important;
                          box-shadow:0px 0px 1px hsla(0,0%,100%,1), 0px 0px 2px hsla(0,0%,100%,1), 0px 0px 15px hsla(0,0%,0%,0.5) !important;
                        }`;
                        cntx.head.appendChild(focs);

                        listOf(cntx.body.getElementsByTagName("*")).forEach((n)=>
                        {
                            n.ROOT=root; n.CNTX=cntx;

                            n.addEventListener(`mouseover`,function(ev)
                            {
                                ev.stopPropagation();  let cc=this.className; if(!isText(cc)){cc=""};
                                cc=cc.split(` AnonInspects`).join(""); cc+=` AnonInspects`;
                                delete this.className; this.className=cc;
                            },false);

                            n.addEventListener(`mouseout`,function(ev)
                            {
                                ev.stopPropagation();  let cc=this.className; if(!isText(cc)){cc=""};
                                cc=cc.split(` AnonInspects`).join("");
                                delete this.className; this.className=cc;
                            },false);

                            if(nodeName(n)==`a`)
                            {
                                let hr=n.getAttribute(`href`);
                                if(!hr.startsWith(`#`)){n.setAttribute(`href`,`#`)};
                            };

                            let ch=(n.onclick||n.onClick||n.getAttribute("onclick")||n.getAttribute("onClick"));
                            if(isFunc(ch)){ch=ch.toString()}; if(isin(ch,["window.open","location.href"]))
                            {
                                delete n.onclick; delete n.onClick;
                                n.removeAttribute("onclick"); n.removeAttribute("onClick");
                            };
                        });

                        Busy.edit(`/Site/importOpen`,100);
                    }});
                    bdy.insert(frm);
                });
            },
         },
      },
   }
});
