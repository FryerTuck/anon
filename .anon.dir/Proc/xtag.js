extend(custom.domtag)
({
   panl:function(n,a,c)
   {
      n.setAttribute('tabindex',-1); n.tabindex=-1;
   },



   butn:function(n,a,c)
   {
      n.setAttribute('tabindex',-1); n.tabindex=-1; if(!a.icon){return}; let i=a.icon; delete a.icon; n.modify(a);
      n.insert([{grid:[{row:
      [
         {col:'.butnIcon',contents:[{icon:i}]},
         {col:'.butnLine',contents:[{vdiv:''}]},
         {col:'.butnText',contents:c},
      ]}]}]);
      n.listen('ready',ONCE,function()
      {
         let bs,pl,pr,ts,th,io,fc,lc; bs=rectOf(this); fc=this.select('.butnIcon')[0]; io=fc.childNodes[0]; lc=this.select('.butnText')[0];
         pl=cStyle(this,'padding-left'); pr=cStyle(this,'padding-right'); ts=cStyle(this,'font-size'); th=cStyle(this,'line-height');
         fc.setStyle({paddingRight:pl}); lc.style.paddingLeft=(pr+'px');
         io.setStyle({display:'block',fontSize:(ts*1.2),lineHeight:(ts*1.5),paddingTop:2});
      });
      return DONE;
   },



   modal:function(n,a,c)
   {
      n.setAttribute('tabindex',-1); n.tabindex=-1;
   },



   icon:function(n,a,c)
   {
      if(!c){c='bug'}; if(!isText(a.face,1)){a.face=c}; if(!isText(a.font,1)){a.font='icon'};
      a.size=(isInum(a.size)?(a.size+'px'):(isNumr(a.size)?(a.size+'rem'):(isText(a.size,3)?a.size:'16px')));
      let fce,fnt,sze; fce=a.face; fnt=a.font; sze=a.size; delete a.face; delete a.font; delete a.size;
      modify(n,a); n.enclan(('.'+fnt+'-'+fce)); n.style.fontSize=sze; // n.style.lineHeight=a.size;
      return DONE;
   },



   card:function(n,a,c)
   {
      n.setAttribute('tabindex',-1); n.tabindex=-1;
   },



   treeview:function(n,a,c)
   {
      n.setAttribute('tabindex',-1); n.tabindex=-1; n.events=(a.listen||a.events); delete a.listen; delete a.events;

      if(!n.events.dragover){n.events.dragover=function(){this.enclan('dragOver');};};
      if(!n.events.dragleave){n.events.dragleave=function(){this.declan('dragOver');};};
      if(!n.events.drop){n.events.drop=function(){dump('caught drop event on `'+this.info.path+'`');};};

      n.status= // object
      {
         fold:{},

         togl:function(n)
         {
            if(!n.info.kids){return};
            var p,s,i,d,f,k,l,r; p=n.info.path; s=this.fold[p];
            s=((s=='shut')?'open':'shut'); i=((s=='open')?'down':'right');
            this.fold[p]=s; n.select('.treeTwigArro i')[0].className=('icon-chevron-'+i);
            n.select('>').style.display=((s=='open')?'block':'none');
            if((n.info.type=='plug')&&!n.info.plug){n.info.plug=n.info.data;};
            if(!n.info.plug){return}; if(s!='open'){return};

            l=n.info.levl; d=(!!n.draggable); r=n.info.repo; if(r){r=r.fork}; f=n.select('>'); f.innerHTML='';
            Busy.edit('/User/plugMenu',0);
            purl('/User/plugMenu',{purl:n.info.plug},(r)=>
            {
               r=decode.jso(r.body); r.each((v)=>
               {
                  v.plug=(n.info.plug+'/'+v.name); v.root=n.info.root;
                  f.insert(n.info.root.sprout(v,l,d,r));
               });
               Busy.edit('/User/plugMenu',100);
            });
         },

         mime:
         {
            auto:'file',
            text:'file',
            inode:'file-directory',
            image:'file-media',
            none:'file-empty',
            repoMain:'repo',
            repoFork:'repo-clone',
            linkFold:'file-symlink-directory',
            linkFile:'file-symlink-file',
            plug:'plug',
            dbase:'database',
            table:'table',
            sproc:'cog',
            funct:'cogs',
            field:'ellipsis',
         },

         hash:hash(),
      };


      n.sprout = function(into,levl,drgs,fork)
      {
         if(isNode(into)){return};
         let slf = this; let pth=into.path; let lib=slf.status.mime; levl+=16; let ext = (into.mime||into.type||'').split('/')[0];
         let val=into.name; let tpe=into.type; let kds=((tpe=='fold')?into.data:((tpe=='plug')?[]:VOID));

         if(tpe=='fold'){delete into.data}; if(!!kds&&!slf.status.fold[pth]){slf.status.fold[pth]='shut'};

         let aro = (!kds?VOID:('chevron-'+((slf.status.fold[pth]=='shut')?'right':'down')));
         let rpo = into.repo; if(rpo&&rpo.host){ext=((rpo.host.fork==rpo.head.fork)?'repoMain':'repoFork');}; let flg=(rpo?rpo.flag:'XX');

         let ico = (lib[ext]?lib[ext]:lib.auto); let isr=(isin(['repoMain','repoFork'],ext)?' .isRepo':'');
         let txt = {input:'',type:'text',disabled:true,value:val};
         let tid = (into.path||into.purl); if(!tid&&!!into.root&&!!into.root.initVars){tid=into.root.initVars.purl};
                   if(!tid){fail('treeview item info-data is invalid');return}; tid=('#Path'+sha1(tid));

         if(!fork&&!!rpo&&!!rpo.head){fork=rpo.head.fork;}; if(fork&&into.repo){into.repo.fork=fork};
         into.levl=levl;

         let twg = create({treetwig:(tid+isr), info:into, tabindex:-1, listen:slf.events, contents:
         [
            {grid:('.diff'+flg), contents:[{row:
            [
               {col:'.treeTwigDent', style:('width:'+((levl<0)?0:levl)+'px')},
               {col:'.treeTwigArro', contents:[(kds?{i:('.icon-'+aro)}:VOID)]},
               {col:'.treeTwigIcon', contents:[{i:('.icon-'+ico)}]},
               {col:'.treeTwigText', contents:[txt]},
            ]}]},
         ]});

         twg.listen('click',function(){this.info.root.status.togl(this)});
         if(!!kds){twg.info.kids=true};
         if(drgs){twg.listen('dragstart',function(e){e.dataTransfer.setData('text/plain',this.info.path);})};

         let frk = VOID; if(kds)
         {
            frk=[]; kds.each((v)=>{v.root=slf; if(!!v.repo){v.repo.fork=fork}; frk.push(slf.sprout(v,levl,drgs,fork))});
            frk=create({treefork:frk}); if(aro=='chevron-down'){frk.style.display='block'};
         };

         let itm = create({treeface:[twg,frk]});
         return itm;
      };


      n.vivify = function(slnt, self,drgs,vars)
      {
         if(!isPath(this.source)){fail('expecting `source` attribute in treeview as path');return};
         self=this; vars=(self.initVars||{});
         if(self.draggable){drgs=TRUE; delete self.draggable}else{drgs=FALS};
         purl({target:this.source,convey:vars,silent:slnt},(r)=>
         {
            r=r.body; if((span(r)<1)||(r=='null')){return};
            if(!isJson(r)){fail('expecting json');return}; r=decode.JSON(r); if(span(r)<1){return};
            self.repo=r.repo; r.root=self; delete r.repo;
            if(isList(r)){self.uproot=1; r={name:'void',path:'/',mime:'inode/directory',type:'fold',data:r}};
            let rsl=self.sprout(r,(self.uproot?-32:-16),drgs);
            if(self.uproot){rsl=listOf(rsl.select('treefork')[0].childNodes);};
            self.innerHTML=''; self.insert(rsl);
            tick.after(250,()=>
            {
               self.select('treetwig').forEach((rn)=>
               {
                  // if(!rn.info.repo){return};
                  let an,mn,mr,gc,dr;
                  an=(rn.parentNode.select('.diffAN'));
                  mn=(rn.parentNode.select('.diffMN'));
                  mr=(rn.parentNode.select('.diffMR'));
                  gc=(rn.parentNode.select('.diffGC'));
                  if(an){rn.select('grid')[0].className='diffAN';};
                  if(mn){rn.select('grid')[0].className='diffMN';};
                  if(mr){rn.select('grid')[0].className='diffMR';};
                  if(gc){rn.select('grid')[0].className='diffGC'; return};
                  if(an&&mr){rn.select('grid')[0].className='diffANMR'; return};
                  if(an&&mn){rn.select('grid')[0].className='diffANMN'; return};
               });
               self.signal('loaded');
               server.listen('replPath',self.status.hash,function(d)
               {
                  this.tree.update();
               }.bind({tree:self}));
            });
         });
      };


      n.update = function()
      {
         this.vivify(1);
      };


      n.listen('ready',ONCE,function(){this.vivify()});
   },



   tabber:function(n,a,c)
   {
      n.driver=
      {
         entity:n,
         viewed:[],
         opened:{},
         active:VOID,


         create:function(obj,cbf,idx)
         {
            expect({knob:obj}); if(!isFunc(cbf)){cbf=function(){}}; let ttl,bdy,slf,pid,tid,hdr,tgt,hid,bid,hob,bob,stl,lip;
            ttl=(obj.title||obj.head); bdy=(obj.contents||obj.body); if(!ttl){return}; if(bdy==VOID){bdy=''}; slf=this.entity;
            expect({text:ttl}); if(!slf.id){slf.id=('TN'+hash())}; if(!isNumr(idx)){idx=0;}; stl=(slf.tabStyle||'.tabsDark');
            pid=slf.id; tid=sha1(pid+ttl); hdr=slf.select('.tabhdr')[0]; tgt=select(slf.target);
            hid=('#TAB'+tid+'HEAD'); bid=('#TAB'+tid+'BODY'); hob=select(hid); bob=select(hid); if(!!hob||!!bob){return};
            this.opened[ttl]=1;

            hdr.insert({tab:(hid+' .head '+stl), title:ttl, onclick:function(){this.select('^^').driver.select(this.title)}, contents:
            [
               {div:('.tabdeck'), style:{transform:'isoSkewX(15deg)'}},
               {div:'.tabtext',contents:[{span:ttl},{icon:'cross', title:'close', onclick:function()
               {this.select('^4').driver.delete(this.select('^^').title)}}]},
            ]});

            tgt.insert({tab:(bid+' .body'), contents:bdy}); tick.after(20,()=>
            {if(idx<1){let rsl=this.select(ttl); cbf(rsl)}});
         },


         select:function(ttl,sig)
         {
            expect({text:ttl}); let slf,pid,tid,hid,bid,hob,bob,hdr,tgt,nod,liv,drv; slf=this.entity; drv=this; pid=slf.id; tid=sha1(pid+ttl);
            hid=('#TAB'+tid+'HEAD'); bid=('#TAB'+tid+'BODY'); hob=select(hid); bob=select(bid); if(!hob||!bob){return};
            liv=(this.viewed.length-1); if(this.viewed[liv]!=ttl){this.viewed[this.viewed.length]=ttl}; if(sig==VOID){sig=1};
            if(span(this.viewed)>span(this.opened)){this.viewed.shift()};

            hdr=hob.select('^'); tgt=bob.select('^'); hdr.select('.head').forEach((o)=>
            {
               let d,t; d=o.select('.tabdeck')[0]; t=o.select('.tabtext')[0]; o.declan('actv');  o.declan('pasv'); o.enclan('pasv');
               d.declan('actv'); d.declan('pasv'); d.enclan('pasv'); t.declan('actv'); t.declan('pasv'); t.enclan('pasv');
               if(isin(hid,o.id)){o.declan('pasv'); o.enclan('actv'); d.declan('pasv'); d.enclan('actv'); t.declan('pasv'); t.enclan('actv');}
            });
            tgt.select('.body').forEach((o)=>{o.style.display='none'}); bob.style.display='block';
            let rsl={head:hob,body:bob}; drv.active=rsl; if(sig){slf.signal('focus',{driver:drv,target:rsl})};

            return rsl;
         },


         edited:function(ttl,val, tgt,nin,ico)
         {
            tgt=this.select(ttl,0); nin=(val?'radio-checked2':'cross'); ico=tgt.head.select('icon')[0];
            ico.className=('icon-'+nin); ico.declan('shutEdit');
            if(val){ico.enclan('shutEdit');};
         },


         delete:function(ttl,nsi)
         {
            let tgt=this.select(ttl,0); if(!tgt){return}; let slf=this.entity; let drv=this; let liv=0;
            tick.after(20,()=> // wait for other events
            {
               if(!nsi){slf.signal('close',{driver:drv,target:tgt})}; // signal `close` event - only if NOT `No Signal Intercept`
               tick.after(20,()=> // wait for event interceptors
               {
                  if(!tgt.head||!tgt.head.id||!tgt.body||!tgt.body.id){return}; // missing .. bad interceptor
                  if(!select('#'+tgt.head.id)||!select('#'+tgt.body.id)){return}; // not in DOM .. bad interceptor
                  if(!nsi&&tgt.head.hijacked){return}; // the close event was intercepted and ignored
                  tgt.head.remove(); tgt.body.remove(); // no interceptor interference, just close it
                  delete drv[ttl]; drv.viewed.pop(); // remove this item from "view order"
                  liv=(drv.viewed.length-1); if(liv<0){return}; // no "last viewed" tab to auto-select
                  liv=drv.viewed[liv]; drv.select(liv); // auto-select "last viewed"
               });
            });
            return TRUE;
         },
      };


      n.insert({div:'.tabhdr'}); if(!a.target){a.target=('#TT'+hash()); n.insert({div:(a.target+' .tabtgt')});}; n.modify(a);


      n.closeAll=function(cbf, drv,hdr,lst)
      {
         drv=this.driver; hdr=this.select('.tabhdr')[0]; lst=(hdr.select('tab')||[]);
         lst.forEach((i)=>{drv.delete(i.title)});
         wait.until(()=>{return (span(hdr.select('tab'))<1)},cbf,30);
      };


      if(!isList(c)){return DONE;};
      wait.until(()=>{return (!!select(a.target))},()=>{c.forEach((o,x)=>{n.driver.create(o,VOID,x)});});

      return DONE;
   },



   textarea:function(n,a,c)
   {
      if(a.spelling==VOID){return};
      if(!a.spelling){a.autocomplete="off"; a.autocorrect="off"; a.autocapitalize="off"; a.spellcheck=false};
   },



   datagrid:function(n,a,c, ae,rh,rk,rs,rd,pd)
   {
      ae=(a.listen||{}); if((span(ae)<1)||!!ae.client||!!ae.server){delete a.listen;};
      if(ae.client){a.listen=ae.client}; if(isKnob(c)){a.info=c.vars}; n.modify(a);

      if(!isKnob(c)||!isPath(c.from)){return}; if(!c.clan){c.clan='darkSide'};

      if(!c.live){purl(c.from,c.vars,(rsp,dta)=>
      {
         rsp=(isJson(rsp.body)?decode.jso(rsp.body):VOID); rs=span(rsp); rd=0; pd=0; if(!rsp||(rs<1)){return};
         if(isList(rsp))
         {
            if(!isKnob(rsp[0])){fail('expecting list of objects for datagrid');return}; if(rs>10){Busy.edit('dataRender',0)};
            rh={row:'', contents:[]}; rk=keys(rsp[0]); rk.forEach((rc)=>
            {
               let xw=((span(rc)*6)+8); if(xw>120){xw=120};
               rh.contents.radd({col:('.head'),contents:
               [{input:'', field:rc, style:('min-width:'+xw+'px'), readonly:true, contents:rc, listen:
               {
                  mouseover:function(){this.focus()}, mouseout:function(){this.blur()},
               }}]})
            });
            n.insert(rh);

            tick.while(()=>{return (pd<100)},()=>
            {
               let ri=rsp.shift(); let rb={row:'', canFocus:true, contents:[]}; let rx=VOID; ri.each((rv,rc)=>
               {
                  let xw=((span(rv)*6)+8); if(xw>120){xw=120}; if(!rx){rx=(rc+':'+rv);};
                  rb.contents.radd({col:('.body'),contents:
                  [{input:'', field:rc, style:('min-width:'+xw+'px'), readonly:true, contents:rv, listen:
                  {
                     mouseover:function(){this.focus()}, mouseout:function(){this.blur()},
                  }}]});
               });
               rb.rowid=rx; n.insert(rb); rd++; pd=Math.floor((rd/rs)*100); Busy.edit('dataRender',pd);
            });

            return;
         };
      })};

      return DONE;
   },


   // flap:function(n,a,c)
   // {
   //    let ctrl,stat,fbdy,func,hrvr,icon; ctrl=a.control; if(!ctrl){return}; if(a.open==VOID){a.open=TRUE}; stat=(a.open?'Open':'Shut');
   //    if(!isin([(VERT+BFOR),(VERT+AFTR),(HORZ+BFOR),(HORZ+AFTR)],ctrl))
   //    {fail('invalid `control` value .. expecting VOID or :VERT::AFTR: or :HORZ::BFOR: .. or some such');return};
   //    func=(isin(ctrl,BFOR)?'unshift':'push'); hrvr=proprCase(unwrap(ctrl).split('::')[0]); n.modify(a);
   //    icon=(isin(ctrl,VERT)?((a.open||isin(ctrl,BFOR))?'circle-up':'circle-down'):((a.open||isin(ctrl,BFOR))?'circle-left':'circle-right'));
   //    fbdy=[{div:('.flapFace'+hrvr), style:('display:'+(a.open?'block':'none')), contents:c}]; fbdy[func]({div:('.flapCtrl'+hrvr), contents:
   //    [
   //       {div:'.flapKnob .midcen', contents:[{icon:icon}]}
   //    ]});
   //    n.insert(fbdy);
   //    return DONE;
   // },
})
