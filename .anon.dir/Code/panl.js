// "use strict";


requires
([
   '/Code/dcor/aard.css',
   '/Code/libs/ace/ace.js',
],()=>
{
   requires('/Code/libs/ace/theme-tomorrow_night.js');

   jack('Blob',function()
   {
      let a,s; a=listOf(arguments); if(!isList(a[0])){return a}; s=a[0][0];
      if(!s.startsWith(`importScripts(`)||!s.endsWith(`.js');`)){return a};
      s=rstub(s,`');`); s[0]+=`?k=${sesn('HASH')}`; s=s.join(''); a[0][0]=s;
      return a;
   });
});




select('#AnonAppsView').insert
([
   {panl:'#CodePanlSlab', contents:
   [
      {grid:'.AnonPanlSlab', contents:
      [
         {row:
         [
            {col:'.sideMenuView', contents:
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
                     {tabber:'#CodeTabber', theme:'.dark', target:'#CodeBodyPanl'}
                  ]}]},
                  {row:[{col:'.panlHorzLine', contents:[{hdiv:''}]}]},
                  {row:[{col:'.slabViewBody', contents:
                  [
                     {grid:'#CodeViewGrid', contents:
                     [
                        {row:'#CodeBodyView', contents:[{col:[{panl:'#CodeBodyPanl'}]}]},
                        {row:'#CodeToolHold .show', contents:[{col:'#CodeToolView', contents:[{panl:'#CodeToolWrap', contents:
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
                                          listen:
                                          {
                                             'key:Enter':function(){Anon.Code.find.exec('bufr','seek');},
                                             'focus':function(){this.parentNode.select('> butn')[0].enclan('subfocus')},
                                             'blur':function(){this.parentNode.select('> butn')[0].declan('subfocus')},
                                          },
                                       }]},
                                       {col:'.toolButnCell', contents:
                                       [
                                          {butn:'.toolButnSngl .dark', contents:'find one',
                                             listen:{'click':function(){Anon.Code.find.exec('bufr','seek',0);}},
                                          },
                                          {butn:'.toolButnSngl .dark', contents:'find all',
                                             listen:{'click':function(){Anon.Code.find.exec('bufr','seek',1);}},
                                          },
                                       ]},
                                    ]},
                                    {row:
                                    [
                                       {col:'.toolFeedCell', contents:[{input:'.toolTextFeed .dark', name:'swapText', demo:'replace with',
                                          listen:
                                          {
                                             'key:Enter':function(){Anon.Code.find.exec('bufr','swap');},
                                             'focus':function(){this.parentNode.select('> butn')[0].enclan('subfocus')},
                                             'blur':function(){this.parentNode.select('> butn')[0].declan('subfocus')},
                                          },
                                       }]},
                                       {col:'.toolButnCell', contents:
                                       [
                                          {butn:'.toolButnSngl .dark', contents:'swap one',
                                             listen:{'click':function(){Anon.Code.find.exec('bufr','swap',0);}},
                                          },
                                          {butn:'.toolButnSngl .dark', contents:'swap all',
                                             listen:{'click':function(){Anon.Code.find.exec('bufr','swap',1);}},
                                          },
                                       ]},
                                    ]},
                                    {row:
                                    [
                                       {col:'.toolFeedCell', contents:[{input:'.toolTextFeed .dark', name:'searchIn', demo:'look in here',
                                          listen:
                                          {
                                             'key:Enter':function(){Anon.Code.find.exec('bulk','seek');},
                                             'focus':function(){this.parentNode.select('> butn')[0].enclan('subfocus')},
                                             'blur':function(){this.parentNode.select('> butn')[0].declan('subfocus')},
                                          },
                                       }]},
                                       {col:'.toolButnCell', contents:
                                       [
                                          {butn:'.toolButnSngl .hovrCool .dark', contents:'BULK FIND',
                                             listen:{'click':function(){Anon.Code.find.exec('bulk','seek');}},
                                          },
                                          {butn:'.toolButnSngl .hovrWarn .dark', contents:'BULK SWAP',
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
            css:'css',
            html:'html',
            ini:'ini',
            js:'javascript',
            json:'json',
            md:'markdown',
            php:'php',
            sql:'sql',
            svg:'svg',
            txt:'plain_text',
            xml:'xml',
         },

         activeInst:VOID,
      },



      keys:
      [
         {name:'save', bindKey:{win:'Ctrl-S',mac:'Ctrl-S'}, exec:function(inst, ev)
         {
            if(inst.anon.saved){return}; inst.anon.value=inst.getValue(); ev=Anon.Code.vars.external;

            if(isFunc(ev.saveBack)){ev.saveBack(inst.anon,(sb)=>
            {
               if(sb==OK){inst.anon.ohash=md5(inst.anon.value);inst.anon.check(inst.anon.value);return};
               fail(`failed saving: \`${inst.anon.ipath}\``);
            });return};

            purl('/Code/saveFile',{path:inst.anon.ipath,bufr:inst.anon.value},function(rsp)
            {
               rsp=rsp.body; if(rsp!=OK){fail(`failed saving: \`${inst.anon.ipath}\``);return};
               inst.anon.ohash=md5(inst.anon.value); inst.anon.check(inst.anon.value);
               renderPath();
               // select('#CodeTreeMenu').update();
            });
         }},
      ],



      conf:
      {
         tabSpace:(("(~/Code/conf/tabSpace~)"||3)*1),
         beatTime:(("(~/Code/conf/beatTime~)"||360)*1),
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
         mnu={treeview:'#CodeTreeMenu', source:'/User/foldMenu', uproot:true, draggable:true, feedable:true, listen:
         {
            'LeftClick':function(evnt)
            {
               if(isin(['fold','plug'],this.info.type)){return}; let ctrl=evnt.ctrlKey; let shft=evnt.shiftKey;
               if(ctrl||shft){evnt.stopImmediatePropagation(); evnt.preventDefault(); evnt.stopPropagation();};
               Anon.Code.open(this.info,(ctrl?'ctrl':(shft?'shft':VOID)));
            },
         }};
         ini.each((v,k)=>{mnu[k]=v}); select('#CodeTreePanl').insert(mnu);


         select('#CodeTreePanl').select('treeview')[0].listen('loaded',ONCE,()=>
         {
            select('#CodeToolHold').reclan('show:hide');
            Busy.edit('/Code/panl.js',100); signal("CodeAppReady");
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
                  // dump(e.detail.target.head.title);
                  Anon.Code.vars.activeInst=e.detail.target.head.editor;
                  Anon.Code.info(e.detail.target.head.editor.anon);
                  let tlv,hdn,fnd,val; tlv=select('#CodeToolHold'); hdn=(isin(tlv.className,'hide')?1:0); if(hdn){return};
                  fnd=tlv.select('#CodeToolFind'); hdn=(isin(fnd.className,'hide')?1:0); if(hdn){return};
                  val=fnd.select('input')[0].value; if(!val){return}; Anon.Code.find.exec('bufr','seek');
               }
            );
         });

         select('#CodeTabber').listen('close',function(e)
         {
            let drv=e.detail.driver; let tgt=e.detail.target; tgt.head.hijacked=1;
            Anon.Code.shut(drv,tgt);
         });

         select('#CodeBodyPanl').focus();
         select('#CodeBodyPanl').listen
         ({
            'Control f':function(e)
            {
               let tlv=select('#CodeToolHold'); let hdn=(isin(tlv.className,'hide')?1:0);  tlv.reclan((hdn?'hide:show':'show:hide'));
               e.hijack(); hdn=(hdn?0:1); if(!!Anon.Code.vars.activeInst){Anon.Code.vars.activeInst.resize()}; if(hdn){return};
               select('#CodeToolFind').select('input')[0].focus();
            },
         });

         listen('key:Esc',function(e)
         {
            let tlv=select('#CodeToolHold'); let hdn=(isin(tlv.className,'hide')?1:0); if(hdn){return};
            e.hijack(select('#CodeToolWrap')); tlv.reclan('show:hide'); select('#CodeBodyPanl').focus();
            if(!!Anon.Code.vars.activeInst){Anon.Code.vars.activeInst.resize()};
         });
      },



      open:function(nfo,how, drv,pth,tpe,ttl,lib,tab,eav,ofp,ext,lng,wrp,opt,mim,mde)
      {
         drv=select('#CodeTabber').driver; pth=nfo.path; tpe=nfo.type; ttl=`${pth}`; lib='/Code/libs/ace';
         tab=drv.select(ttl); if(!!tab){return}; eav=this.vars.external; ofp=(eav.readPath||'/Code/openFile');
         ext=nfo.fext; if(ext=='htm'){ext='html'}; if((how=='shft')||isin('gif,jpg,jpeg,png,svg,webp',ext)){this.view(nfo);return};
         drv.create({title:ttl, contents:[{div:'.CodeEditWrap'}]}); tab=drv.select(ttl,0); wrp=tab.body.select('.CodeEditWrap')[0];
         lng=this.vars.extNeeds[ext]; if(!lng){lng=this.vars.extNeeds.txt}; mde=`${lng}`; lng=padded(lng,`${lib}/mode-`,'.js');

         requires(lng,()=>{purl(ofp,{path:pth,type:tpe},(r)=>
         {
            wrp.textContent=r.body;
            tab.head.editor=ace.edit(wrp); tab.head.editor.setTheme('ace/theme/tomorrow_night');
            mde=ace.require(`ace/mode/${mde}`).Mode; tab.head.editor.session.setMode(new mde());

            tab.head.editor.setDisplayIndentGuides(false);
            tab.head.editor.setPrintMarginColumn(128);

            tab.head.editor.locate=function(qry, len,bfr,idx,pfx,fr,fc,tr,tc)
            {
               len=qry.length; if(len<1){return}; bfr=this.getValue(); idx=bfr.indexOf(qry); if(idx<0){return};
               pfx=bfr.slice(0,idx); // dump(pfx);
            };

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

            Anon.Code.keys.forEach((o)=>{tab.head.editor.commands.addCommand(o);});
            tab.head.editor.on('change',function(o,e){e.anon.check(e.getValue())});
            tab.head.editor.session.selection.on('changeSelection',function(a1,a2)
            {
               let ed=Anon.Code.vars.activeInst; ed.anon.iposi=[(a2.cursor.row+1),(a2.cursor.column+1)];
               let st=ed.getSelectedText(); let sc=st.length; let sl=st.split('\n'); if(vals(sl,-1)==''){rpop(sl)}; sl=sl.length;
               ed.anon.ipick=[sl,sc]; Anon.Code.info(ed.anon);
            });

            select('#CodeBodyPanl').focus();
         })});
      },



      find:
      {
         exec:function(op,fn,a1)
         {
            let iv={}; select('#CodeToolFind').select('input').forEach((n)=>{iv[n.name]=n.value});
            this[op][fn](iv,a1);
         },

         bufr:
         {
            seek:function(qry,arg, edt,len,pos,fnd,bgn,opt,fnc,sel,fbx,bdy,nte)
            {
               edt=Anon.Code.vars.activeInst; fnd=qry.findText; len=fnd.length;
               pos={row:(arg?0:(edt.anon.iposi[0]-1)),col:(arg?0:(edt.anon.iposi[1]-1))},
               bgn=(new ace.Range(pos.row,pos.col,pos.row,pos.col)); bdy=document.body;
               fbx=rectOf(select('#CodeToolFind').select('input')[0]); nte=['?',NEED,BL,[fbx.left,(fbx.top-fbx.height-6)]];

               if(len<1){nte[0]=wack(1); bdy.notify.apply(bdy,nte); return};

               opt=//obj
               {
                  backwards: false,
                  wrap: false,
                  caseSensitive: true,
                  wholeWord: false,
                  range:null,
                  regExp: false,
                  start:bgn,
               };

               fnc=(arg?'findAll':'find'); sel=edt[fnc](fnd,opt); if(!!sel){return sel}; // found .. return selection
               if(!arg){opt.start=(new ace.Range(0,0,0,0)); sel=edt.find(fnd,opt); if(!!sel){return sel}}; // try again for `one`

               nte[0]='not found'; bdy.notify.apply(bdy,nte);
            },

            swap:function(qry,arg, sel,edt,rpl,fnc)
            {
               sel=this.seek(qry,arg); if(!sel){return}; edt=Anon.Code.vars.activeInst; rpl=qry.swapText;
               fnc=(arg?'replaceAll':'replace'); edt[fnc](rpl);
            },
         },

         bulk:
         {
            seek:function(qry,arg, inp,fnd,pwd,sch,pth,drv,ttl,tab,rsl)
            {
               inp=select('#CodeToolFind').select('input'); fnd=qry.findText;
               pwd=rtrim(repl.PWD,'/'); if(!fnd){inp[0].notify('nothing to find',NEED);return};
               sch=ltrim(qry.searchIn,'./'); sch=ltrim(sch,'/');  sch=rtrim(sch,'/');
               pth=rtrim(`${pwd}/${sch}`,'/'); if(!isPath(pth)&&!isPath(`/${pth}`)){inp[2].notify('invalid path',FAIL);return};
               drv=select('#CodeTabber').driver; ttl=`bulkFind`; tab=drv.select(ttl); if(!!tab){drv.delete(ttl,true)};
               tick.after(60,()=>
               {
                  drv.create({title:ttl,contents:[{panl:'#CodeBulkPanl', style:{padding:10},contents:[{h3:`searching...`}]}]});
                  tab=drv.select(ttl,0); tab.head.editor={anon:{saved:1}}; rsl=tab.body.select('#CodeBulkPanl');
                  purl('/Code/bulkFind',{path:pth,find:qry.findText},(r)=>
                  {
                     r=r.body; rsl.innerHTML=''; if(!isJson(r)){rsl.insert({span:r}); inp[2].notify(r,FAIL); return};
                     r=decode.jso(r); rsl.insert({h3:'', pick:(!!arg), contents:((span(r)>0)?'found:':'nothing found')});
                     let l=[]; let d=(arg?'inline-block':'none'); let t='replace in this file'; r.each((v,k)=>
                     {
                        radd(l,{grid:'.noSpan', contents:[{row:
                        [
                           {col:[{input:'', type:'checkbox', style:{display:d, width:20}, title:t, checked:true, value:k}]},
                           {col:[{div:'.link', contents:`${k} (${v})`, onclick:function()
                           {
                              let nfo={path:this.path,type:'file',fext:fext(this.path)};
                              Anon.Code.open(nfo);
                           }
                           .bind({path:k,find:fnd})}]},
                        ]}]});
                     });
                     rsl.insert(l);
                  });
               });
            },

            swap:function(qry,arg, slf,blk,lst,vrs)
            {
               slf=this; if(!select('#CodeBulkPanl')){this.seek(qry,'swap'); wait.until(()=>
               {return (!!select('#CodeBulkPanl')&&!!select('#CodeBulkPanl').select('h3'))},()=>{this.swap(qry,arg)});return};
               blk=select('#CodeBulkPanl'); lst=blk.select('input'); if(!lst){return}; // nothing found
               if(!blk.select('h3')[0].pick){blk.select('h3')[0].pick=1; lst.each((n)=>{n.view('inline-block')}); return}; // show checkboxes
               vrs={list:[],find:qry.findText,swap:qry.swapText}; lst.each((n)=>{if(n.checked){radd(vrs.list,n.value)}});
               popConfirm(`Confirm BULK replace :: This action cannot be "undone".\nAre you sure you want to do this?`)
               ({
                  'warn::Ok':function(){purl('/Code/bulkSwap',vrs,()=>{slf.seek(qry)});this.root.exit()},
               });
            },

            done:function(){},
         },
      },



      view:function(nfo, pth,ttl,tpe,drv,tab,ext,wrp)
      {
         pth=nfo.path; ttl=pth; tpe=nfo.type; drv=select('#CodeTabber').driver; ext=fext(pth); //if(pth[0]=='~'){pth=('/'+pth);};
         if(!isin(['jpg','jpeg','png','svg','gif','md'],ext)){alert('previewing file type `'+ext+'` is not supported .. yet');return};

         Busy.edit('/Code/openFile',0);
         purl('/Code/openFile',{path:pth,view:1},(r)=>
         {
            if(ext=='md')
            {
               r=stub(r.body,';base64,')[2]; parsed(atob(r),'markdown',(dne)=>
               {
                  drv.create({title:ttl, contents:[{panl:'.CodeViewBufr', style:{background:'hsla(0,0%,100%,0.9)',padding:16}, contents:dne}]});
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
            }
            else
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
            };
            Busy.edit('/Code/openFile',100);
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
            repl.mumble('saved '+(bfr.path)); if(isFunc(cbf)){signal("ready"); cbf(rsp); return};
            if(rsp!=OK){alert('saving `'+bfr.path+'` failed\n\n'+rsp); return};
            renderPath();
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
            if(!!tgt.head.editor.destroy){tgt.head.editor.destroy(); tgt.head.editor.container.remove()};
            drv.delete(tgt.head.title,true); // delete with `No Signal Intercept`
            select('#CodeInfoPanl').innerHTML='';
            return;
         };
      },
   }
});
