"use strict";

requires
([
   '/Code/dcor/aard.css',
   '/Code/libs/codemirror/lib/codemirror.js',
   '/Code/libs/codemirror/lib/codemirror.css',
   '/Code/libs/codemirror/theme/seti.css',
],()=>
{
   requires('/Code/libs/codemirror/addon/edit/matchbrackets.js');
   requires('/Code/libs/codemirror/addon/comment/comment.js');
   requires('/Code/libs/codemirror/addon/search/searchcursor.js');
   requires('/Code/libs/codemirror/addon/search/search.js');
   requires('/Code/libs/codemirror/addon/search/jump-to-line.js');
});



select('#AnonAppsView').insert
([
   {panl:'#CodePanlSlab', contents:
   [
      {grid:'.AnonPanlSlab', contents:
      [
         {row:
         [
            {col:'.treeMenuView', contents:
            [
               {grid:
               [
                  {row:[{col:'.slabMenuHead', contents:'code'}]},
                  {row:[{col:'.panlHorzLine', contents:[{hdiv:''}]}]},
                  {row:[{col:'#CodeTreeView .slabMenuBody', contents:[{panl:'#CodeTreePanl'}]}]},
               ]}
            ]},
            {col:'.panlVertDlim', role:'gridFlex', axis:X, target:'<', contents:{vdiv:''}},
            {col:
            [
               {grid:'#CodeMainGrid', contents:
               [
                  {row:[{col:'#CodeHeadView .slabViewHead', contents:
                  [
                     {tabber:'#CodeTabber', tabStyle:'.tabsDark', target:'#CodeBodyPanl'}
                  ]}]},
                  {row:[{col:'.panlHorzLine', contents:[{hdiv:''}]}]},
                  {row:[{col:'.slabViewBody', contents:
                  [
                     {grid:'#CodeViewGrid', contents:
                     [
                        {row:'#CodeBodyView', contents:[{col:[{panl:'#CodeBodyPanl'}]}]},
                        {row:'#CodeToolView .hide', contents:[{col:[{panl:'#CodeToolWrap', contents:
                        [
                           {grid:
                           [
                              {row:[{col:'.panlHorzLine', contents:[{hdiv:''}]}]},
                              {row:[{col:[{panl:'#CodeToolPanl', contents:
                              [
                                 {grid:'#CodeToolFind .toolFormGrid', contents:
                                 [
                                    {row:
                                    [
                                       {col:'.toolFeedCell', contents:[{input:'.toolTextFeed .dark', name:'findText', demo:'what to find',
                                          listen:{'key:Enter':function(){Anon.Code.find.exec('bufr','seek');}},
                                       }]},
                                       {col:'.toolButnCell', contents:[{butn:'.toolButnDubl .dark',contents:'find in buffer',
                                          listen:{'click':function(){Anon.Code.find.exec('bufr','seek');}},
                                       }]},
                                    ]},
                                    {row:
                                    [
                                       {col:'.toolFeedCell', contents:[{input:'.toolTextFeed .dark', name:'swapText', demo:'replace with',
                                          listen:{'key:Enter':function(){Anon.Code.find.exec('bufr','swap');}},
                                       }]},
                                       {col:'.toolButnCell', contents:[{butn:'.toolButnDubl .dark', contents:'replace in buffer',
                                          listen:{'click':function(){Anon.Code.find.exec('bufr','swap');}},
                                       }]},
                                    ]},
                                    // {row:[{col:'.horzSpacer', contents:[{hdiv:''}]},{col:'.horzSpacer', contents:[{hdiv:''}]},]},
                                    // {row:[{col:'.panlHorzLine', contents:[{hdiv:''}]},{col:'.panlHorzLine', contents:[{hdiv:''}]},]},
                                    {row:
                                    [
                                       {col:'.toolFeedCell', contents:[{input:'.toolTextFeed .dark', name:'searchIn', demo:'look in here',
                                          listen:{'key:Enter':function(){Anon.Code.find.exec('bulk','seek');}},
                                       }]},
                                       {col:'.toolButnCell', contents:
                                       [
                                          {butn:'.toolButnSngl .hovrCool .dark', contents:'find all',
                                             listen:{'click':function(){Anon.Code.find.exec('bulk','seek');}},
                                          },
                                          {butn:'.toolButnSngl .hovrWarn .dark', contents:'replace all',
                                             listen:{'click':function(){Anon.Code.find.exec('bulk','swap');}},
                                          },
                                       ]},
                                    ]},
                                 ]},
                              ]}]}]}
                           ]}
                        ]}]}]},
                        {row:[{col:'.panlHorzLine', contents:[{hdiv:''}]}]},
                        {row:[{col:'#CodeInfoView', contents:[{panl:'#CodeInfoPanl'}]}]},
                     ]}
                  ]}]}
               ]}
            ]},
         ]}
      ]}
   ]}
]);




extend(Anon)
({
   Code:
   {
      vars:
      {
         extNeeds:
         {
            css:['css/css'],
            html:['xml/xml','javascript/javascript','css/css','htmlmixed/htmlmixed'],
            js:['javascript/javascript'],
            md:['xml/xml','markdown/markdown'],
            php:['xml/xml','javascript/javascript','css/css','htmlmixed/htmlmixed','clike/clike','php/php'],
            sql:['sql/sql'],
            xml:['xml/xml'],
         },

         activeInst:VOID,
      },



      keys:
      {
         'Control s':function(inst, ev)
         {
            if(inst.saved){return}; inst.value=inst.mytab.head.editor.getValue(); ev=Anon.Code.vars.external;

            if(isFunc(ev.saveBack)){ev.saveBack(inst,(sb)=>
            {
               if(sb==OK){inst.ohash=md5(inst.value);inst.check(inst.value);return};
               alert("failed saving: "+inst.ipath);
            });return};

            purl('/Code/saveFile',{path:inst.ipath,bufr:inst.value},function(rsp)
            {
               rsp=rsp.body; if(rsp!=OK){alert("failed saving: "+inst.ipath);return};
               inst.ohash=md5(inst.value); inst.check(inst.value);
               // select('#CodeTreeMenu').update();
            });
         },


         'Control /':function(inst, ev)
         {
            inst.mytab.head.editor.toggleComment();
         },


         'Control f':function(inst, ev)
         {
            let tv=select('#CodeToolView'); tv.reclan((isin(tv.className,'hide')?'hide:show':'show:hide'));
         },
      },



      conf:
      {
         tabSpace:(("{:/Code/conf/tabSpace:}"||3)*1),
         beatTime:(("{:/Code/conf/beatTime:}"||360)*1),
      },



      anew:function(cbf)
      {
         select('#CodeTabber').closeAll((tv)=>
         {
            tv=select('#CodeTreePanl').select('treeview');
            if(tv){tv[0].remove()}; tick.after(60,cbf);
         });
      },



      init:function(ini, mnu)
      {
         ini=(ini||{}); this.vars.external=ini;
         mnu={treeview:'#CodeTreeMenu', source:'/User/treeMenu', uproot:true, listen:
         {
            'LeftClick':function()
            {
               if(this.info.kids){return};
               Anon.Code.open(this.info);
            },
            'drop':function(data,file, inf,dir,pth)
            {
               this.declan('dragOver'); inf=this.info; dir=((inf.type=='fold')?inf.path:twig(inf.path));
               pth=(dir+'/'+file); Anon.Code.feed({from:'menu',path:pth,data:data});
            },
         }};
         ini.each((v,k)=>{mnu[k]=v}); select('#CodeTreePanl').insert(mnu);


         select('#CodeTreePanl').select('treeview')[0].listen('loaded',ONCE,()=>
         {
            Busy.edit('/Code/panl.js',100);
            // TODO .. repo stuff here
            if(!!ini.openItem){Anon.Code.open(ini.openItem);};
         });


         select('#CodeTabber').listen('focus',function(e, wrp)
         {
            wrp=VOID; wait.until
            (
               ()=>
               {
                  wrp=(e.detail.target.body.select('.CodeEditWrap')||e.detail.target.body.select('.CodeViewWrap'));
                  return ((span(wrp)>0)&&(!!e.detail.target.head.editor)&&(!!e.detail.target.head.editor.anon));
               },
               ()=>
               {
                  Anon.Code.vars.activeInst=e.detail.target.head.editor;
                  Anon.Code.info(e.detail.target.head.editor.anon);
               }
            );
         });

         select('#CodeTabber').listen('close',function(e)
         {
            let drv=e.detail.driver; let tgt=e.detail.target; tgt.head.hijacked=1;
            Anon.Code.shut(drv,tgt);
         });
      },



      open:function(nfo, drv,pth,tpe,ttl,tab,eav,ofp,ext,lng,wrp,opt,mim)
      {
         drv=select('#CodeTabber').driver; pth=nfo.path; tpe=nfo.type; ttl=`${pth}`;
         tab=drv.select(ttl); if(!!tab){return}; eav=this.vars.external; ofp=(eav.readPath||'/Code/openFile');
         ext=nfo.fext; if(ext=='htm'){ext='html'}; if(isin('gif,jpg,jpeg,png,svg,webp',ext)){this.view(nfo);return};
         lng=this.vars.extNeeds[ext]; drv.create({title:ttl, contents:[{div:'.CodeEditWrap'}]});

         if(lng){lng=padded(lng,'/Code/libs/codemirror/mode/','.js')};

         requires(lng,()=>
         {
            purl(ofp,{path:pth,type:tpe},(r)=>
            {
               tab=drv.select(ttl,0); wrp=tab.body.select('.CodeEditWrap')[0];
               lng=(lng||['/default.']).pop().split('/').pop().split('.')[0];
               opt={mode:lng, lineNumbers:true, theme:'seti', indentUnit:3, tabSize:3, matchBrackets:true, value:r.body};
               tab.head.editor=CodeMirror(wrp,opt); wrp.childNodes[0].setStyle({height:'100%'});

               tab.head.editor.anon=//object
               {
                  mytab:tab,
                  ipath:pth,
                  itype:tpe,
                  imime:r.head.ContentType.split(';charset=').join(' '),
                  iposi:[1,1],
                  ipick:[0,0],
                  irepo:nfo.repo,
                  saved:true,
                  ohash:md5(r.body),
                  check:function(hsh)
                  {hsh=md5(hsh); this.saved=(hsh==this.ohash); select('#CodeTabber').driver.edited(this.mytab.head.title,(!this.saved));},
               };
               tab.head.editor.on('change',function(cmi){cmi.anon.check(cmi.doc.getValue());});
               tab.head.editor.on('keydown',function(cmi,evt)
               {
                  if(!Anon.Code.keys[evt.signal]){return}; evt.stopImmediatePropagation(); evt.stopPropagation(); evt.preventDefault();
                  Anon.Code.keys[evt.signal](cmi.anon,evt);
               });
               tab.head.editor.on('cursorActivity',function(cmi)
               {
                  let kb,sd,cs; kb=cmi.doc.getCursor(); cmi.anon.iposi=[(kb.line+1),(kb.ch+1)]; sd='~(//*\\)~'; cs=cmi.doc.getSelection(sd);
                  let sc,cl,ll; sc=(cs||'').split(sd).pop(); cl=sc.length; ll=(cl?sc.split('\n').length:0); cmi.anon.ipick=[ll,cl];
                  Anon.Code.info(cmi.anon);
               });
               Anon.Code.info(tab.head.editor.anon);
               // doc.getSelection
               // tab.editor.execCommand('goDocStart');
               // mim=eav.mimeName; if(!mim){mim=mimeName(r.head.ContentType)};
            });
         });
      },



      view:function(nfo, pth,ttl,tpe,drv,tab,ext,wrp)
      {
         pth=nfo.path; ttl=pth; tpe=nfo.type; drv=select('#CodeTabber').driver; ext=fext(pth); //if(pth[0]=='~'){pth=('/'+pth);};
         if(!isin(['jpg','jpeg','png','svg','gif'],ext)){alert('previewing file type `'+ext+'` is not supported .. yet');return};

         purl('/Code/openFile',{path:pth,view:1},(r)=>
         {
            drv.create({title:ttl, contents:[{panl:'.CodeViewWrap', contents:
            [{img:'.CodeViewBufr', style:'display:block', src:r.body, listen:
            {
               ready:function()
               {
                  let bx=rectOf(this); this.dime=bx; this.editor.anon.ipick=[bx.width,bx.height];
                  Anon.Code.info(this.editor.anon);
               },
               mousemove:function()
               {
                  let bi,cp,pn,sd,ci,px,py; bi=this.dime; cp={x:(cursor.posx-bi.x),y:(cursor.posy-bi.y)}; pn=this.parentNode;
                  sd={x:pn.scrollLeft,y:pn.scrollTop}; px=((cp.x+sd.x)+1); py=((cp.y+sd.y)+1); this.editor.anon.iposi=[px,py];
                  ci=select('#CodeInfoPosi'); if(!ci){return}; ci.innerHTML=(px+':'+py);
               },
            }}]}]});
            tab=drv.select(ttl,0);
            tab.head.editor={anon:
            {
               mytab:tab,
               ipath:pth,
               itype:tpe,
               imime:nfo.mime,
               iposi:[1,1],
               ipick:[0,0],
               irepo:nfo.repo,
               saved:true,
            }};
            tab.body.select('.CodeViewBufr')[0].editor=tab.head.editor;
         });
      },


      info:function(inf)
      {
         let disp; disp=select('#CodeInfoPanl'); disp.innerHTML='';
         disp.insert
         ([
            {grid:[{row:
            [
               {col:'#CodeInfoBufr', contents:[{grid:[{row:
               [
                  {col:'.CodeInfoPadn'},{col:[{icon:'hubot'}]},{col:[{div:inf.imime}]},{col:'.CodeInfoPadn'},
                  {col:[{icon:'location'}]},{col:[{div:'#CodeInfoPosi', contents:inf.iposi.join(':')}]}, {col:'.CodeInfoPadn'},
                  {col:[{div:(inf.ipick&&inf.ipick[0]?('('+inf.ipick.join(',')+')'):'')}]},
               ]}]}]},
               {col:'#CodeInfoMisc', contents:[]},
               {col:'#CodeInfoRepo', contents:[{grid:[{row:
               [
                  (inf.irepo?{col:[{icon:'git-branch'}]}:VOID),
                  (inf.irepo?{col:[{div:(inf.irepo.fork)}]}:VOID),
                  {col:'.CodeInfoPadn'},
               ]}]}]},
            ]}]}
         ]);
      },


      feed:function(vrs)
      {
         if(vrs.from=='menu'){purl('/Code/feedFile',vrs,function(rsp)
         {
            if(rsp.body==OK){select('#CodeTreeMenu').update();return};
            alert('failed to upload `'+vrs.path+'`\n\n'+rsp.body);
         });return};
      },


      pull:function(rpo)
      {
         Anon.Code.tint(); if(rpo.diff.ahead||!rpo.diff.behind){return}; // pull is unwise .. ignored the following

         purl('/Code/pullRepo',{path:rpo.purl, fork:rpo.fork},function(rsp)
         {
            if(rsp.body!=OK){return};
            repl.mumble(rpo.lead.user+" "+rpo.lead.mesg+" .. changes pulled from origin/"+rpo.fork+" while safe");
            Anon.Code.rake('MR'); select('#CodeTreeMenu').update();
         });
      },


      rake:function(flg)
      {
         let lst=select('#CodeTreeMenu').select('.diff'+flg); if(!lst){return}; // get list for updating open tabs by item path
         let drv=select('#CodeTabber').driver; let cat=drv.active; let otl=[]; // define tab-driver, current-active-tab, open-tab-list

         lst.forEach((n)=>{n=n.parentNode; let i,p,t; i=n.info;p=i.path;t=drv.select(p,0); if(t&&(t.head.title==p)){radd(otl,{nfo:i,tab:t})}});
         if(span(otl)<1){return};
         tick.while(()=>{return (span(otl)>0)},()=>
         {
            let o=lpop(otl); let bfr=o.tab.body.select('.CodeEditBufr'); if(bfr&&!bfr[0].saved){return}; // ignore tabs with unsaved changes
            Anon.Code.shut(drv,o.tab); tick.after(250,()=>{Anon.Code.open(o.nfo)}); if((span(otl)>0)||!cat){return};
            tick.after(500,()=>{drv.select(cat.head.title)});
         },500);
      },


      find:
      {
         exec:function(op,fn)
         {
            let iv={}; select('#CodeToolFind').select('input').forEach((n)=>{iv[n.name]=n.value});
            this[op][fn](iv);
         },

         bufr:
         {
            seek:function(qry, cmi,pos,cur)
            {
               cmi=Anon.Code.vars.activeInst; pos={line:(cmi.anon.iposi[0]-1),ch:(cmi.anon.iposi[1]-1)};
               if(!qry.findText){return}; cur=cmi.getSearchCursor(qry.findText,pos);
               console.log(cur.findNext());
            },
            next:function(){},
            prev:function(){},
            swap:function(){},
            done:function(){},
         },

         bulk:
         {
            seek:function(){},
            swap:function(){},
            done:function(){},
         },
      },


      save:function(bfr,cbf, eav,nfo)
      {
         if(bfr.saved){select('#CodeTreeMenu').signal('loaded'); if(isFunc(cbf)){cbf(OK)};return};
         eav=(this.vars.external||{}); nfo=bfr.info;

         if(isFunc(eav.saveBack)){eav.saveBack(bfr,(rsp)=>
         {
            if(rsp==OK){bfr.hash=sha1(bfr.value); bfr.saved=TRUE;}else{console.error(rsp)};
            repl.mumble('saved '+(bfr.path)); if(isFunc(cbf)){cbf(rsp);return};
            if(rsp!=OK){alert('saving `'+bfr.path+'` failed\n\n'+rsp)};
         });return};

         purl('/Code/saveFile',{path:bfr.path, bufr:bfr.value, plug:nfo.plug},function(rsp)
         {
            rsp=rsp.body; if(rsp==OK){bfr.hash=sha1(bfr.value); bfr.saved=TRUE; select('#CodeTreeMenu').update()};
            repl.mumble('saved '+(bfr.path)); if(isFunc(cbf)){cbf(rsp);return};
            if(rsp!=OK){alert('saving `'+bfr.path+'` failed\n\n'+rsp)};
         });
      },


      tint:function()
      {
         var mnu,tab,bfr,gtr,tnt,lnh; mnu=select('#CodeTreeMenu'); tab=select('#CodeTabber').driver.active; if(!tab){return};
         bfr=tab.body.select('.CodeEditBufr')[0]; gtr=tab.body.select('.CodeGutrTint')[0]; gtr.innerHTML=''; tnt={}; lnh=14;

         let gc=mnu.select('.diffGC');

         if(gc){gc.each((i)=>{i=i.parentNode.info; if(i.repo&&i.repo.fail&&(i.path==bfr.path)){tnt.GC=i.repo.fail; return STOP}})};

         tnt.each((v,k)=>
         {
            gtr.insert({div:('.'+k), style:('top:'+((lnh*v)-lnh)+'px')});
         });
      },


      shut:function(drv,tgt, inf,dne)
      {
         inf=tgt.head.editor.anon; dne=inf.saved;
         if(!dne){dne=confirm('Discard unsaved changes?')};

         if(dne)
         {
            drv.delete(tgt.head.title,true); // delete with `No Signal Intercept`
            select('#CodeInfoPanl').innerHTML='';
            return;
         };
      },
   }
});
