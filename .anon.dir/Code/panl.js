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
         }
      },



      keys:
      {
         'Control s':function(inst, ev)
         {
            if(inst.saved){return}; inst.value=inst.mytab.editor.getValue(); ev=Anon.Code.vars.external;

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
            inst.mytab.editor.toggleComment();
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
            // TODO .. repo stuff here
            if(!!ini.openItem){Anon.Code.open(ini.openItem);};
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
               tab.editor=CodeMirror(wrp,opt); wrp.childNodes[0].setStyle({height:'100%'});
               tab.editor.anon=//object
               {
                  mytab:tab,
                  ipath:pth,
                  itype:tpe,
                  saved:true,
                  ohash:md5(r.body),
                  check:function(hsh)
                  {hsh=md5(hsh); this.saved=(hsh==this.ohash); select('#CodeTabber').driver.edited(this.mytab.head.title,(!this.saved));},
               };
               tab.editor.on('change',function(cmi){cmi.anon.check(cmi.doc.getValue());});
               tab.editor.on('keydown',function(cmi,evt)
               {if(!Anon.Code.keys[evt.signal]){return}; Anon.Code.keys[evt.signal](cmi.anon);});
               // mim=eav.mimeName; if(!mim){mim=mimeName(r.head.ContentType)};
            });
         });
      },



      view:function(nfo, pth,drv,ext,img,plg)
      {
         pth=nfo.path; drv=select('#CodeTabber').driver; ext=fext(pth); if(pth[0]=='~'){pth=('/'+pth);}; plg=nfo.plug;
         if(!isin(['jpg','jpeg','png','svg','gif'],ext)){alert('previewing file type `'+ext+'` is not supported .. yet');return};

         purl('/Code/openFile',{path:pth,plug:plg,view:1},(r)=>
         {
            r=r.body; drv.create({title:pth, contents:[{panl:'.CodeSeeOther', contents:
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
