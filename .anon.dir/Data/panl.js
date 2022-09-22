"use strict";


requires(["/Data/dcor/aard.css","/Site/dcor/hack.woff"]);




select('#AnonAppsView').insert
([
   {panl:'#DataPanlSlab', contents:
   [
      {grid:'.AnonPanlSlab', contents:
      [
         {row:
         [
            {col:'.sideMenuView', contents:
            [
               {grid:
               [
                  {row:[{col:'.slabMenuHead', contents:'data'}]},
                  {row:[{col:'.panlHorzLine', contents:{hdiv:''}}]},
                  {row:[{col:'.slabMenuBody', contents:{panl:'#DataTreePanl'}}]},
               ]}
            ]},
            {col:'.panlVertDlim', role:'gridFlex', axis:X, target:'<', contents:{vdiv:''}},
            {col:
            [
               {grid:
               [
                  {row:[{col:'#DataHeadView .slabViewHead', contents:[{tabber:'#DataTabber', theme:'.dark', target:'#DataBodyPanl'}]}]},
                  {row:[{col:'.panlHorzLine', contents:{hdiv:''}}]},
                  {row:[{col:'.slabViewBody', contents:{grid:
                  [
                     {row:
                     [
                        {col:'#DataBodyView', contents:[{panl:'#DataBodyPanl'}]},
                        {col:'.panlVertLine', contents:[{vdiv:''}]},
                        {col:'#DataToolView', contents:[{panl:'#DataToolPanl'}]},
                     ]},
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
         select('#DataTreePanl').insert
         ([
            {treeview:'', source:'/Data/treeMenu', boring:'/Data/plugMenu', uproot:true, filter:{fext:"sdb,url"}, listen:
            {
               'LeftClick':function(evnt)
               {
                  let ctrl=evnt.ctrlKey; let meta=evnt.shiftKey;
                  if((this.info.kids&&!ctrl&&!meta)){return};
                  if(ctrl||meta){evnt.stopImmediatePropagation(); evnt.preventDefault(); evnt.stopPropagation();};
                  Anon.Data.open(this.info.path,this.info.type,ctrl);
               },
            }}
         ]);

         select('#DataTreePanl').select('treeview')[0].listen('loaded',ONCE,()=>
         {
            requires('/Data/tool/',()=>{Busy.done();});
         });
      },



      open:function(prl,tpe,alt)
      {
         this.repl.init(prl,tpe);

         if(isin(['sproc','funct'],tpe))
         {
            let ea={source:'/Data/treeMenu', readPath:'/Data/openItem'};
            ea.openItem={path:prl,type:tpe,mime:'application/sql',fext:'sql'};
            ea.saveBack=function(inst,cbfn){Anon.Data.save(inst.ipath,inst.itype,inst.value, cbfn);};
            AnonMenu.init('CodeMenuKnob',ea); return;
         };

         Anon.Data.show('/Data/openItem',{path:prl,type:tpe,ctrl:alt});

         // purl('/Data/openItem',{purl:prl,type:tpe,ctrl:alt},(rsp)=>
         // {
         //    Anon.Data.show(rsp.body,prl,tpe,alt);
         // });
      },



      save:function(prl,tpe,val,cbf)
      {
         purl('/Data/saveItem',{path:prl,type:tpe,data:btoa(val)},(rsp)=>
         {
            if(isFunc(cbf)){cbf(rsp.body)}; if((rsp.body!=OK)||!isin(['sproc','funct'],tpe)){return}; let pts,tmp;
            pts=stub(val,"\nBEGIN\n"); tmp=pts[0]; if(!tmp.endsWith(' ')&&!tmp.endsWith('\n')&&!isin(tmp,'--')){return}; // all is well

            popModal('bug :: Attention!')
            (`
               Your ***${tpe}*** was saved, however:
               - any **comments** -or extra **whitespace** before \`BEGIN\` will be ignored!\n
               <tiny>This is a database concern and not in our control, so if these vanish, stay calm .. sweet screams.</tiny>
            `);
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
                           Anon.Data.edit({path:inf.path, type:inf.type, data:val, row:row, col:col},(rsp)=>
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

         init:function(pth,tpe, pts,plg,dir)
         {
            if(isin(['sproc','funct'],tpe)){pth=rstub(pth,'/')[0];};
            this.vars.path=pth; this.vars.prom=pth;

            repl.runsql=Anon.Data.repl.exec;
            this.prom();
         },


         prom:function(a, prl)
         {
            repl.ENV.target='runsql';
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
            {Anon.Data.exec((slf.vars.plug+slf.vars.path),a,(r)=>{repl.mumble(' '+r); slf.prom()})};
            if(!slf.vars.custom){slf.vars.custom=0}; slf.vars.custom++;
            Anon.Data.show('/Data/runQuery',{purl:((slf.vars.plug||'')+slf.vars.path),cmnd:btoa(a),type:('qry'+slf.vars.custom+' in ')});
            slf.prom();
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



      tool:{},
   }
});
