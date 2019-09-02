"use strict";


requires(['/Code/dcor/aard.css','/Proc/libs/prism/prism.js','/Proc/libs/prism/prism.css']);



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
                  {row:[{col:'.slabMenuBody', contents:[{panl:'#CodeTreeView'}]}]},
               ]}
            ]},
            {col:'.panlVertDlim', contents:[{vdiv:''}]},
            {col:
            [
               {grid:'.holdSpanSize', contents:
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
                        {row:'#CodeBodyView', contents:[{col:[{panl:'#CodeBodyPanl .holdSpanSize'}]}]},
                        {row:'#CodeToolView', contents:[{col:[{panl:'#CodeToolWrap', contents:
                        [
                           {grid:
                           [
                              {row:[{col:'.panlHorzLine', contents:[{hdiv:''}]}]},
                              {row:[{col:[{panl:'#CodeToolPanl'}]}]}
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
      vars:{},

      conf:
      {
         tabSpace:(("{:/Code/conf/tabSpace:}"||3)*1),
         beatTime:(("{:/Code/conf/beatTime:}"||360)*1),
      },

      anew:function(cbf)
      {
         select('#CodeTabber').closeAll((tv)=>
         {
            tv=select('#CodeTreeView').select('treeview');
            if(tv){tv[0].remove()}; tick.after(60,cbf);
         });
      },



      init:function(ea, dir,tmr)
      {
         ea=(ea||{}); this.vars.external=ea; dir=(ea.treePath||'/User/treeMenu');
         tmr=Anon.Code.conf.beatTime; if(!isNumr(tmr)||isFrac(tmr)||(tmr<100)){fail('invalid beatTime .. expecting INT >= 100');return};


         select('#CodeTabber').listen('close',function(e)
         {
            let drv=e.detail.driver; let tgt=e.detail.target; tgt.head.hijacked=1;
            Anon.Code.shut(drv,tgt);
         });


         select('#CodeTabber').listen('focus',function(e, bfr)
         {
            bfr=VOID; wait.until
            (
               ()=>
               {
                  bfr=(e.detail.target.body.select('.CodeEditBufr')||e.detail.target.body.select('.CodeViewBufr'));
                  return ((span(bfr)>0)&&(span(bfr[0].vars)>0))
               },
               ()=>{Anon.Code.info(bfr[0])}
            );
         });


         select('#CodeTreeView').insert
         ([
            {treeview:'#CodeTreeMenu', source:dir, uproot:true, initVars:ea.initVars, listen:
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
            }}
         ]);


         select('#CodeTreeMenu').listen('loaded',ONCE,()=>
         {
            select('#CodeTreeMenu').listen('loaded',function()
            {
               let rpo=select('#CodeTreeMenu').select('.isRepo'); if(!rpo){return};
               rpo=rpo[0].info.repo.head; Anon.Code.pull(rpo);
            });

            if(!select('#CodeTreeMenu').select('.isRepo')){server.listen('pathChange',(v)=>
            {
               let upd=0; if(rm.select('#Path'+sha1(v.path))){upd=1};
               if(upd){select('#CodeTreeMenu').update();};
            });return}; // .. so if there is no "repo" in the tree, then the code below is ignored

            select('#CodePanlSlab').listen('Control f',(evnt)=>
            {
               evnt.preventDefault(); evnt.stopPropagation(); evnt.stopImmediatePropagation(); let od=rectOf(select('#CodeBodyPanl'));
               let vg,bv,tv,gs,bs,ts,hd; vg=select('#CodeBodyView'); bv=select('#CodeBodyView'); tv=select('#CodeToolView');
               if(isin(tv.className,'show')){tv.declan('show'); bv.setStyle({height:od.height}); holdSpanSize(); return};
               gs=rectOf(vg); bs=rectOf(bv); tv.enclan('show'); ts=rectOf(tv); hd=(bs.height-ts.height);
               bv.setStyle({height:hd}); bv.childNodes[0].setStyle({height:hd}); holdSpanSize();
               return;
            });

            select('#CodePanlSlab').listen('Control Shift S',()=>
            {
               let inf=select('#CodeTreeMenu').select('.isRepo')[0].info;
               let drv=select('#CodeTabber').driver; let tab=drv.active; let bfr={saved:1};
               if(tab){bfr=tab.body.select('.CodeEditBufr')[0]}; let nfo=encode.jso((bfr.info||{}));
               Anon.Code.save(bfr,()=>
               {
                  purl('/Code/pushRepo',{path:inf.path,fork:inf.repo.fork},(rsp)=>
                  {
                     rsp=rsp.body; if(rsp==OK){return};
                     if(!isin(rsp,'CONFLICT')){console.error(rsp.body); repl.mumble('something went wrong, try again?'); return};
                     repl.mumble('merge conflict .. have a look?'); if(!nfo){return};
                     Anon.Code.shut(drv,tab); nfo=decode.jso(nfo); tick.after(250,()=>{Anon.Code.open(nfo);});
                  });
               });
            });

            server.listen('repoUpdate',(v)=>
            {
               let upd=0; select('#CodeTreeMenu').select('.isRepo').each((n)=>
               {if(n.info.repo.head.fork==v.fork){upd=1; return STOP}}); if(!upd){return};
               select('#CodeTreeMenu').update();
            });
         });


         if(ea.openItem){this.open(ea.openItem);};
      },



      open:function(nfo, vrs,p,tpe,tabr,tab,code,info,file,mime,extn,spel,bfr,box,bin,eav,ofp,ttl,beat,plg)
      {
         vrs=this.vars; beat=Anon.Code.conf.beatTime;

         p=(nfo.purl||nfo.path); tpe=nfo.type; ttl=((tpe=='file')?nfo.path:(tpe+' '+nfo.path)); plg=nfo.plug;
         eav=(this.vars.external||{}); ofp=(eav.openPath||'/Code/openFile');
         tabr=select('#CodeTabber').driver; tab=tabr.select(ttl,0); if(!!tab){return}; file=p.split('/').pop();
         extn=(fext(p)||'txt'); if(eav.fileType){extn=eav.fileType};
         if(!isin(['htm','html','xml','css','js','json','php','md','sql','txt','inf'],extn)){this.view(nfo);return};
         spel=isin(['txt','md'],extn);
         purl(ofp,{path:p,purl:p,type:tpe,plug:plg},function(r)
         {
            mime=mimeName(r.head.ContentType); if(eav.mimeType){mime=eav.mimeType};
            tabr.create({title:ttl, contents:[{grid:
            [
               {row:[{col:'.CodeEditView', contents:[{grid:[{row:
               [
                  {col:'.CodeGutrView', contents:[{div:'.CodeGutrPanl', contents:[{grid:'.CodeGutrBase',contents:[{row:
                     [{col:'.CodeGutrNumr',contents:[]},{col:'.CodeGutrTint',contents:[]}]}]}
                  ]}]},
                  {col:'.CodeEditHpad'},
                  {col:'.CodeEditHold', contents:[{panl:'.CodeEditPanl .holdSpanSize', contents:
                  [
                     {pre:('.CodeEditBase .language-'+mime), contents:[{code:('.CodeEditDeck .language-'+mime)}]},
                     {div:'.CodeEditCrsr'},
                     {textarea:'.CodeEditBufr', tab:ttl, path:p, info:nfo, hash:sha1(r.body), value:r.body, spelling:spel,
                        time:(beat*3), typing:FALS,
                     },
                  ]}]},
               ]}]}]}]},
            ]}]});

            tab=tabr.select(ttl,0); bfr=tab.body.select('.CodeEditBufr')[0]; bin=bfr.parentNode; bin.dime=rectOf(bin);
            tab.body.select('.CodeEditPanl')[0].listen('scroll',function()
            {
               this.select('^^').select('.CodeGutrBase')[0].style.top=((0-this.scrollTop)+'px');
            });

            bfr.base=select('<<',bfr); bfr.seek=select('<',bfr);
            bfr.gutr={numr:tab.body.select('.CodeGutrNumr')[0],tint:tab.body.select('.CodeGutrTint')[0]};
            bfr.vars={}; bfr.saved=TRUE;

            bfr.listen(['keydown','keyup'],function(evnt)
            {
               if((evnt.type=='keyup')&&!isin(['Control','Shift','Meta','Alt'],evnt.signal))
               {this.time=0;};

               if((evnt.signal=='Tab')&&(evnt.type=='keydown'))
               {
                  evnt.preventDefault(); evnt.stopPropagation(); evnt.stopImmediatePropagation(); this.focus();
                  let stab=dupe(' ',Anon.Code.conf.tabSpace); this.insertAtCaret(stab);
               }
               else if((evnt.signal=='Enter')&&(evnt.type=='keyup'))
               {
                  this.insertAtCaret(this.vars.dent);
               }
               Anon.Code.draw(this);
            });

            bfr.listen(['mousedown','mouseup'],function(){Anon.Code.seek(this)});
            bfr.listen('Control s',function(){Anon.Code.save(this)});
            bfr.listen('focus',function(){this.hasFocus=1});
            bfr.listen('blur',function(){this.hasFocus=0});

            bfr.focus(); Anon.Code.draw(bfr);
            tick.after(250,()=>{Anon.Code.tint();});

            if(!vrs.tikr)
            {
               vrs.tikr=tick.every(beat,function()
               {
                  let lst=select('#CodeBodyPanl').select('.CodeEditCrsr');
                  if(span(lst)<1){clearInterval(vrs.tikr); vrs.tikr=VOID; return};

                  lst.forEach((itm)=>
                  {
                     let dsp=itm.style.display; dsp=((dsp=='inline-block')?'none':'inline-block');
                     let bfr=itm.select('>'); if(!bfr.hasFocus){dsp='none'}; itm.style.display=dsp;
                     bfr.time+=beat; if(bfr.time<(beat*2)){bfr.typing=TRUE; bfr.saved=FALS; return};
                     bfr.typing=FALS; if(bfr.time>(beat*3)){bfr.time=(beat*3);return}; // prevent overflow
                     if(bfr.time>beat){let hsh=sha1(bfr.value); bfr.saved=(hsh==bfr.hash)};
                     select('#CodeTabber').driver.edited(bfr.tab,(!bfr.saved));
                  });
               });
            };
         });
      },



      view:function(nfo, pth,drv,ext,img,plg)
      {
         pth=nfo.path; drv=select('#CodeTabber').driver; ext=fext(pth); if(pth[0]=='~'){pth=('/'+pth);}; plg=nfo.plug;
         if(!isin(['jpg','jpeg','png','svg','gif'],ext)){alert('previewing file type `'+ext+'` is not supported .. yet');return};

         purl('/Code/openFile',{path:pth,plug:plg,view:1},(r)=>
         {
            r=r.body; drv.create({title:pth, contents:[{panl:'.CodeSeeOther .holdSpanSize', contents:
            [{img:'.CodeViewBufr', style:'display:block', src:r, info:nfo, vars:{}, listen:
            {
               ready:function(){this.vars={line:0,char:0, pick:{line:this.width,char:this.height}, dime:rectOf(this)}},
               mousemove:function()
               {
                  let bi,cp,pn,sd,ci; bi=this.vars.dime; cp={x:(cursor.posx-bi.x),y:(cursor.posy-bi.y)}; pn=this.parentNode;
                  sd={x:pn.scrollLeft,y:pn.scrollTop}; ci=select('#CodeInfoPosi'); if(!ci){return};
                  ci.innerHTML=(((cp.x+sd.x)+1)+':'+((cp.y+sd.y)+1));
               },
            }}]}]});
         });
      },



      draw:function(bfr, sho,lns,dim)
      {
         // if(!(bfr.value+'').endsWith('\n')){bfr.value=(bfr.value+'\n');};
         // dim=bfr.getBoundingClientRect();
         // bfr.setStyle({width:dim.width,height:dim.height});
         bfr.setStyle({width:(bfr.scrollWidth+1),height:(bfr.scrollHeight+1)});
         sho=bfr.base.childNodes[0]; sho.textContent=bfr.value; Prism.highlightAllUnder(bfr.base);
         lns=bfr.value.split('\n'); bfr.gutr.numr.innerHTML='';
         lns.forEach((v,k)=>{bfr.gutr.numr.insert({span:('.ln'+(k+1)),contents:((k+1)+'')})});
         this.seek(bfr);
      },


      seek:function(bfr, crs,pos,pts,row,col,pvl,pvc,tmp,dnt,inf,lno,lnl)
      {
         bfr.focus(); crs=bfr.seek; crs.style.display='inline-block';
         pos=bfr.selectionStart; pts=bfr.value.substr(0,pos).split('\n');
         row=pts.length; col=(pts[(row-1)].length+1); row-=1; col-=1;
         crs.style.top=((row*14)+'px'); crs.style.left=((col*6)+'px');

         pvl=(pts[row]||''); pvc=((col<1)?'':pvl.slice((col-1),col));
         tmp=ltrim(pvl); dnt=(pvl.length-tmp.length); dnt=((dnt<1)?'':dupe(' ',dnt)); row+=1; col+=1;
         bfr.vars.dent=dnt; bfr.vars.line=row; bfr.vars.char=col;
         lnl=bfr.gutr.numr.select('span'); if(lnl){lnl.forEach((n)=>{n.declan('crntLine')})};
         lno=bfr.gutr.numr.select('.ln'+row); if(lno){lno[0].enclan('crntLine')};
         inf=select('#CodeInfoPosi'); if(inf){inf.innerHTML=(row+':'+col)};
      },


      info:function(bfr)
      {
         let disp,info,vars; disp=select('#CodeInfoPanl'); info=bfr.info; vars=bfr.vars; disp.innerHTML='';
         disp.insert
         ([
            {grid:[{row:
            [
               {col:'#CodeInfoBufr', contents:[{grid:[{row:
               [
                  {col:'.CodeInfoPadn'},{col:[{icon:'hubot'}]},{col:[{div:info.mime}]},{col:'.CodeInfoPadn'},
                  {col:[{icon:'location'}]},{col:[{div:'#CodeInfoPosi', contents:(vars.line+':'+vars.char)}]}, {col:'.CodeInfoPadn'},
                  {col:[{div:(vars.pick?('('+vars.pick.line+','+vars.pick.char+')'):'')}]},
               ]}]}]},
               {col:'#CodeInfoMisc', contents:[]},
               {col:'#CodeInfoRepo', contents:[{grid:[{row:
               [
                  (info.repo?{col:[{icon:'git-branch'}]}:VOID),
                  (info.repo?{col:[{div:(info.repo.fork)}]}:VOID),
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


      shut:function(drv,tgt, bfr,dne)
      {
         bfr=tgt.body.select('.CodeEditBufr'); dne=(bfr?bfr[0].saved:1);
         if(!dne){dne=confirm('Discard unsaved changes?')};

         if(dne)
         {
            drv.delete(tgt.head.title,true); // delete with `No Signal Intercept`
            tick.after(60,()=>{select('#CodeInfoPanl').innerHTML='';}); // wait for `select` info update, then vacuum
            return;
         };
      },
   }
});
