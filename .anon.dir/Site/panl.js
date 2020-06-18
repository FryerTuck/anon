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
            {butn:`.longMenuButn`, text:`create template`, onclick:function(){Anon.Site.open(`create`,`brandNew`)}},
         ]);

         Busy.edit('/Site/panl.js',100);
      },



      open:function(t,s,a, drv,ttl,tab)
      {
         drv=select('#SiteTabber').driver; ttl=`$/Site/tool/${t}/${s}`; tab=drv.select(ttl); if(!!tab){return};
         drv.create({title:ttl}); tab=drv.select(ttl);
         Anon.Site.tool[t][s](tab,a);
      },



      tool:
      {
         import:
         {
             filter:[],

             catMnu:function(f, l)
             {
                 l=[]; this.filter.forEach((i)=>
                 {
                     if(!isin(i,f)){return};
                     radd(l,{item:"", text:i, onclick:function()
                     {select(`#browseFltr`).value=this.text}});
                 });
                 remove(`#AnonDropMenu`); if(l.length<1){return};
             },

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
                             {col:[{input:`#browseIndx .toolTextFeed .dark`, demo:`0`, hint:`start from`}]},
                             {col:[{input:`#browseFltr .toolTextFeed .dark`, demo:`*`, hint:`category`}]},
                             {col:[{butn:`#browseButn .AnonToolButn`, icon:`eye`,
                                 onclick:function()
                                 {
                                     select(`#SiteBrwsBody`).innerHTML="";
                                     Anon.Site.tool.import.lazyLoad();
                                 }}
                             ]},
                          ]},
                       ]}]}
                     ]}]},
                     {row:[{col:[{panl:`#SiteBrwsBody`, $:
                     [
                     ]}]}]},
                ]});

                select(`#SiteBrwsBody`).listen(`scrollStop`,function(ev)
                {
                    let ed=ev.detail; //dump(ed);
                    if((ed[2]!=D)||(ed[5]>400)){return};
                    Anon.Site.tool.import.lazyLoad();
                });

                select(`#browseFltr`).listen(`focus`,function(ev)
                {
                    dropMenu();
                });

                select(`#browseFltr`).listen(`typingStop`,function(ev)
                {
                    dump(`stopped typing`);
                });

                Anon.Site.tool.import.lazyLoad();
             },


             lazyLoad:function(idx, frm,flt,bdy,ldd)
             {
                 frm=((select(`#browseIndx`).value.trim()*1)||0);
                 flt=(select(`#browseFltr`).value.trim()||"*");
                 if(!isInum(frm)){popAlert(`invalid "start from" number`);return};
                 bdy=select(`#SiteBrwsBody`);
                 ldd=bdy.select(`.tmplItem`); if(ldd){frm+=ldd.length};

                 purl(`Site/importBrowse`,{from:frm,fltr:flt},(rsp)=>
                 {
                     rsp=decode.jso(rsp.body);
                     if((frm==0)&&(flt=='*')){Anon.Site.tool.import.filter=rsp.cats};
                     rsp.lyst.forEach((o)=>
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
                             {butn:`.dark .warn`, text:`load`, hint:`loads the template in the URL above`, onclick:function(){Anon.Site.tool.import.load()}},
                             {butn:`.dark .good`, text:`save`, hint:`saves changes made to the loaded template`, onclick:function(){Anon.Site.tool.import.save()}},
                             {butn:`.dark .need`, text:`pick`, hint:`use this template as main website template`, onclick:function(){Anon.Site.tool.import.pick()}},
                             {butn:`.dark .harm`, text:`void`, hint:`forgets this loaded/saved template so it can be loaded fresh`, onclick:function(){Anon.Site.tool.import.void()}},
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
                        }

                        .AnonInspPick
                        {
                          outline:auto !important;
                          outline-color:hsla(100,100%,60%,1) !important;
                          background-color:hsla(100,100%,60%,0.3) !important;
                          box-shadow:0px 0px 1px hsla(0,0%,100%,1), 0px 0px 2px hsla(0,0%,100%,1), 0px 0px 15px hsla(0,0%,0%,0.5) !important;
                        }
                        `;

                        cntx.head.appendChild(focs);

                        listOf(cntx.body.getElementsByTagName("*")).forEach((n)=>
                        {
                            n.ROOT=root; n.CNTX=cntx;

                            if(nodeName(n)==`a`)
                            {
                                let hr=n.getAttribute(`href`); if(isVoid(hr)){hr=""};
                                if(hr.startsWith(`http:/`)||hr.startsWith(`https:/`)||hr.startsWith(`//`))
                                {n.setAttribute(`href`,`#`)};
                            };

                            let ch=(n.onclick||n.onClick||n.getAttribute("onclick")||n.getAttribute("onClick"));
                            if(isFunc(ch)){ch=ch.toString()}; if(isin(ch,["window.open","location.href"]))
                            {
                                delete n.onclick; delete n.onClick;
                                n.removeAttribute("onclick"); n.removeAttribute("onClick");
                            };

                            n.addEventListener(`mouseover`,function(ev)
                            {
                                if(!ev.ctrlKey){return};
                                ev.preventDefault();  ev.stopPropagation();  ev.stopImmediatePropagation();
                                let cc=this.className; if(!isText(cc)){cc=""};
                                if(isin(cc,`AnonInspPick`)){return}; // this is selected .. do nothing
                                cc=cc.split(` AnonInspects`).join(""); cc+=` AnonInspects`; // add focussed class
                                delete this.className; this.className=cc;
                            },false);

                            n.addEventListener(`mouseout`,function(ev)
                            {
                                ev.stopPropagation();  let cc=this.className; if(!isText(cc)){cc=""};
                                cc=cc.split(` AnonInspects`).join("");
                                delete this.className; this.className=cc;
                            },false);

                            n.addEventListener(`dblclick`,function(ev)
                            {
                                ev.preventDefault(); ev.stopPropagation(); ev.stopImmediatePropagation();
                                Anon.Site.tool.update.popOptions(this);
                            },false);
                        });

                        Busy.edit(`/Site/importOpen`,100);
                    }});
                    bdy.insert(frm);
                });
            },


            save:function()
            {
                dump(`save`);
            },


            pick:function()
            {
                dump(`pick`);
            },


            void:function()
            {
                dump(`void`);
            },


            edit:function(n)
            {
                popAlert(`Edit Imported Template : Editing parts of an imported template`);
            },
         },



         create:
         {
             brandNew:function(tab)
             {
                 popAlert(`TODO : This feature is not available yet.`);
             },
         },



         update:
         {
             popOptions:function(n)
             {
                 popAlert(`TODO : This feature is not available yet.`);
             },
         },
      },
   }
});
