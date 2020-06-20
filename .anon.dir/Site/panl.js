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
            {butn:`.longMenuButn`, text:`template config`, onclick:function(){Anon.Site.open(`config`,`template`)}},
            // {butn:`.longMenuButn`, text:`create template`, onclick:function(){Anon.Site.open(`create`,`brandNew`)}},
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

             catMnu:function(f, l,n)
             {
                 if(!f){f="*"}; l=[]; n=select(`#browseFltr`);
                 this.filter.forEach((i)=>
                 {
                     if((f!="*")&&!isin(i,f)){return};
                     radd(l,{item:"", text:i, onclick:function()
                     {n.value=this.select("span")[0].innerHTML}});
                 });
                 remove(`#AnonDropMenu`); if(l.length<1){return};
                 // dump(l,n.parentNode);

                 tick.after(60,()=>
                 {
                     dropMenu({class:"SiteBrwsCats"},n.parentNode)(l);
                 });
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
                             {col:[{input:`#browseFltr .toolTextFeed .dark`, demo:`*`, hint:`category`, autocomplete:"off"}]},
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
                    tick.after(60,()=>{Anon.Site.tool.import.catMnu()});
                });

                select(`#browseFltr`).listen(`typingStop`,function(ev)
                {
                    Anon.Site.tool.import.catMnu(this.value);
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
                     if((frm==0)&&(flt=='*')){Anon.Site.tool.import.filter=rsp.cats.sort()};
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
                             {butn:`.dark .good`, text:`load`, hint:`loads the template in the URL above`, onclick:function(){Anon.Site.tool.import.load()}},
                             {butn:`.dark .cool`, text:`save`, hint:`save this template to use later`, onclick:function(){Anon.Site.tool.import.save(tab)}},
                             {butn:`.dark .need`, text:`edit`, hint:`modify saved template`, onclick:function(){Anon.Site.tool.import.edit(tab)}},
                             {butn:`.dark .harm`, text:`void`, hint:`forgets this loaded/saved template so it can be loaded fresh`, onclick:function(){Anon.Site.tool.import.void(tab)}},
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
                                if(hr.startsWith(`http:/`)||hr.startsWith(`https:/`)||hr.startsWith(`//`)||isPath(hr)||isPath('/'+hr))
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
                                Anon.Site.tool.modify.elem(this);
                            },false);
                        });

                        Busy.edit(`/Site/importOpen`,100);
                    }});
                    bdy.insert(frm);
                });
            },


            save:function(tab, drv,url,nme)
            {
                url=select(`#importPurl`).value; nme=rstub(rtrim(url,"/"),"/")[2];
                purl(`/Site/importSave`,{purl:url},(r)=>
                {
                    if(r.body!=OK){popAlert(r.body); return};
                    popAlert(`thumbs-up :: Saved : The ***${nme}*** template is ready to use.`);
                    // drv=select('#SiteTabber').driver;
                    // drv.delete(tab.head.title,true);
                    // Anon.Site.tool.modify.load(nme);
                });
            },


            edit:function(tab, drv,url,nme)
            {
                url=select(`#importPurl`).value; nme=rstub(rtrim(url,"/"),"/")[2];
                repl.exec(`cd $/Site/tmpl/${nme}`);
                AnonMenu.init(`Code`);
            },


            void:function(tab, drv,url,nme,msg)
            {
                url=select(`#importPurl`).value; nme=rstub(rtrim(url,"/"),"/")[2];
                msg=`You are about to delete the stored template: "${nme}" -and site data related to it.\n\nAre you sure?`;
                if(!confirm(msg)){return};

                purl(`/Site/importVoid`,{purl:url},(r)=>
                {
                    if(r.body!=OK){popAlert(r.body); return};
                    popAlert(`thumbs-up :: Deleted : The ***${nme}*** template is gone from memory and can be imported anew.`);
                    drv=select('#SiteTabber').driver;
                    drv.delete(tab.head.title,true);
                    // Anon.Site.tool.modify.load(nme);
                });
            },
         },



         config:
         {
             tmplList:[],


             template:function(tab, drv)
             {
                drv=select('#SiteTabber').driver;

                purl(`/Site/tmplList`,(r)=>
                {
                    r=decode.jso(r.body);
                    if(r.length<1)
                    {
                        drv.delete(tab.head.title,true);
                        Anon.Site.open(`import`,`browse`);
                        popAlert(`There are no saved templates; browse and choose one, then hit **save**.`);
                        return;
                    };

                    tab.body.insert({grid:
                    [
                        {row:[{col:`.SitePanlHead`, $:
                        [
                           {div:`.panlHeadBanr`, contents:[{grid:
                           [
                              {row:
                              [
                                 {col:[{input:`#configTmpl .toolTextFeed .dark`, style:{width:200}, demo:`template`, value:""}]},
                              ]},
                              {row:
                              [
                                 {butn:`.dark .good`, text:`view`, hint:`opens the template chosen above`, onclick:function(){Anon.Site.tool.config.view()}},
                                 {butn:`.dark .cool`, text:`save`, hint:`save changes made to the chosen template`, onclick:function(){Anon.Site.tool.config.save(tab)}},
                                 {butn:`.dark .need`, text:`pick`, hint:`choose the above template for live website`, onclick:function(){Anon.Site.tool.config.pick(tab)}},
                                 {butn:`.dark .harm`, text:`void`, hint:`delete all saved data related to the chosen template above`, onclick:function(){Anon.Site.tool.config.void(tab)}},
                              ]},
                           ]}]}
                         ]}]},
                         {row:[{col:[{panl:`#SiteTmplBody .SiteTmplBody`, $:
                         [
                         ]}]}]},
                    ]});


                    this.tmplList=[];

                    r.forEach((i)=>
                    {
                        radd(this.tmplList,{item:"", text:i, onclick:function()
                        {select(`#configTmpl`).value=this.select("span")[0].innerHTML}});
                    });


                    select(`#configTmpl`).listen(`focus`,function(ev)
                    {
                        tick.after(1000,()=>
                        {
                            dropMenu({class:"SiteBrwsCats"},this.parentNode)
                            (Anon.Site.tool.config.tmplList);
                        });
                    });
                });
             },


         },



         modify:
         {
             elem:function(n)
             {
                 popAlert(`TODO : modify.load("${n}")`);
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
