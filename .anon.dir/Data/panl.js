"use strict";


requires(['/Data/dcor/aard.css']);




select('#AnonAppsView').insert
([
   {panl:'#DataPanlSlab', contents:
   [
      {grid:'.AnonPanlSlab', contents:
      [
         {row:
         [
            {col:'.treeMenuView', contents:
            [
               {grid:
               [
                  {row:[{col:'.slabMenuHead', contents:'data'}]},
                  {row:[{col:'.panlHorzLine', contents:{hdiv:''}}]},
                  {row:[{col:'.slabMenuBody', contents:{panl:'#DataTreeMenu'}}]},
               ]}
            ]},
            {col:'.panlVertDlim', role:'gridFlex', axis:X, target:'<', contents:{vdiv:''}},
            {col:
            [
               {grid:
               [
                  {row:[{col:'#DataHeadView .slabViewHead', contents:[{tabber:'#DataTabber', tabStyle:'.tabsDark', target:'#DataBodyPanl'}]}]},
                  {row:[{col:'.panlHorzLine', contents:{hdiv:''}}]},
                  {row:[{col:'.slabViewBody', contents:{grid:
                  [
                     {row:[{col:'#DataBodyView', contents:{panl:'#DataBodyPanl'}}]},
                     {row:'#DataToolView', contents:[{col:
                     [
                        {grid:
                        [
                           {row:[{col:'.panlHorzLine', contents:{hdiv:''}}]},
                           {row:[{col:[{panl:'#DataToolPanl'}]}]}
                        ]}
                     ]}]},
                  ]}}]},
               ]}
            ]},
         ]}
      ]}
   ]}
]);




extend(Anon)
({
   Data:
   {
      anew:function(cbf)
      {
         select('#DataTabber').closeAll((tv)=>
         {
            tv=select('#DataTreeMenu').select('treeview');
            if(tv){tv[0].remove()}; tick.after(60,cbf);
         });
      },



      init:function()
      {
         select('#DataTreeMenu').insert
         ([
            {treeview:'', source:'/Data/treeMenu', uproot:true, draggable:true, listen:
            {
               'LeftClick':function(evnt)
               {
                  let ctrl=evnt.ctrlKey; let meta=evnt.shiftKey;
                  if((this.info.kids&&!ctrl&&!meta)||(this.info.levl<1)){return};
                  if(ctrl||meta){evnt.stopImmediatePropagation(); evnt.preventDefault(); evnt.stopPropagation();};
                  Anon.Data.open(this.info.purl,this.info.type,ctrl);
               },

               'RightClick':function()
               {
                  dump('yo');
               },

               'mouseover,mouseout':function(evnt)
               {
                  if(evnt.type=='mouseout'){this.declan('treeItemCtrl'); this.declan('treeItemShft'); this.blur(); return}; this.focus();
                  if(evnt.ctrlKey){this.enclan('treeItemCtrl')}else if(evnt.shiftKey){this.enclan('treeItemShft')};
               },

               'keydown,keyup':function(evnt)
               {
                  let k=evnt.signal; if((k!='Control')&&(k!='Shift')){return}; k=((k=='Control')?'Ctrl':'Shft');
                  if(evnt.type=='keydown'){this.enclan('treeItem'+k);return}; this.declan('treeItem'+k);
               },
            }}
         ]);
      },



      open:function(prl,tpe,alt)
      {
         this.repl.init(prl,tpe);

         if(isin(['sproc','funct'],tpe))
         {
            let iv=this.repl.vars; let ih=(iv.plug+iv.path);
            let ea={treePath:'/Data/treeMenu', initVars:{purl:ih,fltr:'sproc,funct'}, fileType:'sql', mimeType:'sql', openPath:'/Data/openItem'};
            ea.openItem={path:iv.fpth,purl:prl,type:tpe};
            ea.saveBack=function(bfr,cbf){Anon.Data.save(bfr.path,bfr.info.type,bfr.value, cbf);};
            AnonMenu.init('CodeMenuKnob',ea); return;
         };


         Anon.Data.show('/Data/openItem',{purl:prl,type:tpe,ctrl:alt});


         // purl('/Data/openItem',{purl:prl,type:tpe,ctrl:alt},(rsp)=>
         // {
         //    Anon.Data.show(rsp.body,prl,tpe,alt);
         // });
      },



      save:function(prl,tpe,val,cbf)
      {
         purl('/Data/saveItem',{purl:prl,type:tpe,data:btoa(val)},(rsp)=>
         {
            if(isFunc(cbf)){cbf(rsp.body)};
         });
      },



      show:function(pth,vrs, drv,tpe,ttl,tab,tgt,slf)
      {
         slf=this; vrs=(vrs||{}); drv=select('#DataTabber').driver; tpe=vrs.type; ttl=(tpe+' '+this.repl.vars.path);
         tab=drv.select(ttl); if(!!tab){return};

         drv.create({title:ttl, contents:[{panl:'.DataViewPanl', contents:
         [
            {datagrid:'.darkSide', contents:{live:false,from:pth,vars:vrs}, listen:
            {
               client:
               {
                  'keydown,keyup,click,mouseout':function(evnt)
                  {
                     var sig,tgt,row,col,val,edt,inf; sig=evnt.signal; tgt=evnt.target; inf=this.info;
                     if(nodeName(tgt)=='col')
                     {
                        row=tgt.parentNode.rowid;
                     }
                     else if(nodeName(tgt)=='input')
                     {
                        row=tgt.parentNode.parentNode.rowid; col=tgt.field; val=tgt.value; edt=(!tgt.readonly);
                        if((sig=='Control')&&(evnt.type=='keydown')){tgt.enclan('ctrlWarn')};
                        if((sig=='Control')&&(evnt.type=='keyup')&&!edt){tgt.declan('ctrlWarn')};
                        if((evnt.type=='mouseout')&&!edt){tgt.declan('ctrlWarn')}
                        if(sig=='Control LeftClick'){tgt.readonly=false; tgt.removeAttribute('readonly'); tgt.oval=val;};
                        if((sig=='Enter')&&(evnt.type=='keyup')&&edt)
                        {
                           tgt.readonly=true; tgt.setAttribute('readonly','true');
                           Anon.Data.edit({purl:inf.purl, type:inf.type, data:val, row:row, col:col},(rsp)=>
                           {
                              if(rsp==OK){tgt.declan('ctrlWarn'); tgt.enclan('ctrlGood'); return};
                              tgt.value=tgt.oval;
                           });
                        };
                     };
                  },
               },
               server:{},
            }}
         ]}]});
         tab=drv.select(ttl);
      },



      edit:function(v,cbf)
      {
         v.data=btoa(v.data); purl('/Data/saveItem',v,(rsp)=>
         {
            cbf(rsp.body);
         });
      },



      exec:function(prl,sql,cbf)
      {
         purl('/Data/runQuery',{purl:prl,exec:btoa(sql)},(rsp)=>
         {
            cbf(rsp.body);
         });
      },



      repl:
      {
         vars:{},

         init:function(prl,tpe, pts,ptc,usr,dom,pth)
         {
            pts=stub(prl,'://'); ptc=pts[0]; pts=stub(pts[2],'@');
            usr=stub(pts[0],':')[0]; pts=stub(pts[2],'/'); dom=pts[0]; pth=('/'+(pts[2]||''));
            this.vars.plug=swap(prl,('@'+dom+pth),('@'+dom)); this.vars.fpth=pth;
            if(isin(['sproc','funct'],tpe)){pth=rstub(pth,'/')[0];}; this.vars.path=pth;
            this.vars.purl=prl; this.vars.prom=(ptc+' '+usr+'@'+dom+' '+pth);

            repl.runsql=function(a){Anon.Data.repl.exec(a);};
            repl.ENV.target='runsql'; this.prom();
         },


         prom:function(a, prl)
         {
            repl.reprom((a||this.vars.prom));
         },


         echo:function(a)
         {
            let i,p; i=select('#AnonReplFeed'); i.type='text'; i.value=''; p=('['+this.vars.prom+']');
            select('#AnonReplFlog').insert({div:[{span:'.replEchoProm',innerHTML:p},{span:'.replEchoCmnd',innerHTML:a}]});
            let v=select('#AnonReplPanl'); v.scrollTop=v.scrollHeight; i.focus();
         },


         exec:function(a, cmd,arg,slf,drv)
         {
            repl.ENV.cmdlog.feed(a); this.echo(a); cmd=stub(a,' '); slf=Anon.Data.repl;
            if(!cmd){cmd=a}else{arg=cmd[2]; cmd=cmd[0]; if(!this[cmd]){cmd=VOID}};
            if(cmd&&isFunc(this[cmd])){this[cmd].apply(this,[arg]);return};
            if(cmd){this.echo(this[cmd]);return}; cmd=stub(a,' '); if(!cmd){return}; cmd=cmd[0];
            if(!isin(['SELECT','SHOW','DESCRIBE'],upperCase(cmd)))
            {Anon.Data.exec((slf.vars.plug+slf.vars.path),a,(r)=>{repl.mumble(' '+r)})};
            if(!slf.vars.custom){slf.vars.custom=0}; slf.vars.custom++;
            Anon.Data.show('/Data/runQuery',{purl:(slf.vars.plug+slf.vars.path),cmnd:btoa(a),type:('qry'+slf.vars.custom+' in ')});
         },


         show:function(a)
         {
            Anon.Data.exec((this.vars.plug+this.vars.path),('show '+a),(r)=>
            {
               if(!isJson(r)){repl.mumble(' .. '+r+'\n\n');return};
               r=decode.jso(r); r.forEach((i)=>{repl.mumble(' '+i)}); repl.mumble('\n');
            });
         },


         ls:function(a)
         {
            this.show((a||'*'));
         },


         cd:function(a, i,r,l,p)
         {
            i=repl.ENV.cdInfo(a,this.vars.path); if(!i){return}; r=i.remain; l=i.lookup;
            if(!l){this.vars.path=r; p=this.vars.prom.split(' '); p.pop(); p.push(r); this.vars.prom=p.join(' '); this.prom(); return};

            purl('/Data/exists',{purl:(this.vars.plug+l)},(rsp)=>
            {
               rsp=rsp.body; if(rsp!=':OK:'){repl.mumble(' .. '+rsp.split('\n')[0]);return};
               this.vars.path=l; p=this.vars.prom.split(' '); p.pop(); p.push(l); this.vars.prom=p.join(' '); this.prom();
            });
         },
      },
   }
});
