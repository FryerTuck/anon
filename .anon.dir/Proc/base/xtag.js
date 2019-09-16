extend(custom.domtag)
({
   panl:function(n,a,c)
   {
      n.setAttribute('tabindex',-1); n.tabindex=-1;
   },



   card:function(n,a,c)
   {
      n.setAttribute('tabindex',-1); n.tabindex=-1;
   },



   butn:function(n,a,c, i)
   {
      n.setAttribute('tabindex',-1); n.tabindex=-1; if(!c){c=a.text; delete a.text}; i=a.icon; delete a.icon;
      if(!c&&!i&&!isin(a.class,'icon-')){c='?'}; n.modify(a); n.insert(c); if(!i){return DONE;};
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
      c=VOID; if(a.text){c=a.text; delete a.text};
      modify(n,a); n.enclan(('.'+fnt+'-'+fce)); n.style.fontSize=sze; // n.style.lineHeight=a.size;
      if(c){n.insert({div:c})};
      return DONE;
   },



   item:function(n,a,c, i)
   {
      if(isText(a.text,1)&&isText(c,1)&&c.startsWith('$')){a.icon=c.slice(1); c=VOID};
      if(isText(a.text,1)){c=(a.text+''); delete a.text}; if(isText(a.icon,1)){i=(a.icon+''); delete a.icon};
      if(i){n.insert({icon:i,text:c})}else{n.insert({span:c})}; modify(n,a); return DONE;
   },



   treeview:function(n,a,c)
   {
      n.setAttribute('tabindex',-1); n.tabindex=-1;
      if(!!a.events){n.events=a.events; delete a.events}else if(!!a.listen){n.events=a.listen; delete a.listen}else{n.events={}};

      if(n.events.dragover===VOID){n.events.dragover=function(){this.enclan('dragOver');};};
      if(n.events.dragleave===VOID){n.events.dragleave=function(){this.declan('dragOver');};};
      if(n.events.drop===VOID){n.events.drop=function(){dump('caught drop event on `'+this.info.path+'`');};};


      if((n.events.RightClick===VOID)&&(n.events.contextmenu===VOID)){n.listen('RightClick',function(e, x,m,t,w,l)
      {
         x=VOID; x=e.srcElement; if(nodeName(x)!='treeview'){x=x.lookup('^',3); if(nodeName(x)!='treetwig'){x=x.parentNode}};
         m=VOID; if(!x.info.root){x.info.root=x;}; m=x.info.mime.split('/')[0]; t=x.info.type; w=t; if(t=='fold'){w='folder'};
         if(x.info.repo&&x.info.repo.fork&&x.info.repo.head&&x.info.repo.host){t='repoMain'; w='repo';};

         l=//list
         [
            {h1:[{icon:x.info.root.status.mime[m]},{div:(w+' options')}]},
            {div:'.panlHorzDlim', contents:[{hdiv:[]}]},
            {item:'$plus', text:'create folder', onclick:function(){this.context.info.root.adjure('create','fold',this.context)}},
            {item:'$plus', text:'create file', onclick:function(){this.context.info.root.adjure('create','file',this.context)}},
            {item:'$plus', text:'create plug', onclick:function(){this.context.info.root.adjure('create','plug',this.context)}},
         ];

         if(t=='fold')
         {radd(l,{item:'$repo-clone', text:'import git repo', onclick:function(){this.context.info.root.adjure('create','repo',this.context)}});};

         if(isin(t,'repo'))
         {
            radd(l,{line:[]});
            radd(l,{item:'$repo-pull', text:'receive changes', onclick:function(){this.context.info.root.adjure('update','pull',this.context)}});
            radd(l,{item:'$repo-push', text:'publish changes', onclick:function(){this.context.info.root.adjure('update','push',this.context)}});
            radd(l,{item:'$warning', text:'discard changes', onclick:function(){this.context.info.root.adjure('update','anew',this.context)}});
            radd(l,{item:'$history1', text:'revert previous', onclick:function(){this.context.info.root.adjure('update','anew',this.context)}});
         };

         if(t=='plug')
         {
            radd(l,{line:[]}),
            radd(l,{item:'$cog', text:'modify plug link', onclick:function(){this.context.info.root.adjure('modify','plug',this.context)}});
         };

         if(x.info.path!='~')
         {
            radd(l,{line:[]}),
            radd(l,{item:'$copy', text:('clone this '+w), onclick:function(){this.context.info.root.adjure('cloned',t,this.context)}});
            radd(l,{item:'$tag', text:('rename this '+w), onclick:function(){this.context.info.root.adjure('rename',t,this.context)}});
            radd(l,{item:'$trashcan', text:('delete this '+w), onclick:function(){this.context.info.root.adjure('delete',t,this.context)}});
         };

         dropMenu({context:x})(l);
      })};


      n.adjure = function(a,t,x,p)
      {
         if(!p){p=(x.info.path||x.info.purl)};
         return this[a](a,t,p,x);
      }
      .bind
      ({
         create:function(a,t,p,x, b)
         {
            if(isin(['file'],x.info.type)){p=twig(p);};
            b=//list
            [
               {row:[{col:'.text', contents:'in'},{col:[{input:'', name:'path', placeholder:'folder path', value:p}]}]},
               {row:[{col:'.text', contents:'as'},{col:[{input:'', name:'args', placeholder:('new '+t+' name')}]}]},
            ];
            if((t=='plug')||(t=='repo'))
            {radd(b,{row:[{col:'.text', contents:'to'},{col:[{input:'', name:'link', placeholder:(t+' source URL')}]}]});};
            popModal({class:'AnonTreeModl', theme:'dark', size:'360x190'})
            ({
               head:[{icon:'plus'},{span:`create ${t}`}],
               body:[{grid:'.noSpanVert', contents:[b]},{small:[{i:'TIP : see the manual for "legal" characters'}]}],
               foot:
               [
                  {butn:'.cool', contents:'create', from:x, make:t, onclick:function()
                  {
                     let d={exec:'create',type:this.make}; (this.dbox.select('input')).forEach((i)=>{d[i.name]=i.value});
                     purl('/User/treeExec',d,(r)=>{if(r.body!=OK){fail(r.body);return}; this.from.info.root.update(); this.root.exit();});
                  }},
                  {butn:'', contents:'cancel', onclick:function(){this.root.exit();}},
               ]
            });
         },

         update:function(a,t,p,x){dump('update '+t);},

         modify:function(a,t,p,x)
         {
            purl('/User/treeExec',{exec:'descry', type:t, path:p},(ld)=>
            {
               ld=ld.body; if(!isPath(ld)&&!isin(ld,'://')&&(ld!='')){alert(ld); return};
               popModal({class:'AnonTreeModl', theme:'dark', size:'400x130'})
               ({
                  head:[{icon:'tag'},{span:`modify ${t} link`}],
                  body:
                  [
                     {input:'',name:'path',type:'hidden',value:p},{input:'',name:'args',placeholder:`${t} link`,value:ld},
                  ],
                  foot:
                  [
                     {butn:'.warn', contents:'modify', from:x, make:t, onclick:function()
                     {
                        let d={exec:'modify',type:this.make}; (this.dbox.select('input')).forEach((i)=>{d[i.name]=i.value});
                        purl('/User/treeExec',d,(r)=>{if(r.body!=OK){fail(r.body);return}; this.from.info.root.update(); this.root.exit();});
                     }},
                     {butn:'', contents:'cancel', onclick:function(){this.root.exit();}},
                  ]
               });
            });
         },

         cloned:function(a,t,p,x)
         {
            dump('cloned '+t);
         },

         rename:function(a,t,p,x)
         {
            popModal({class:'AnonTreeModl', theme:'dark'})
            ({
               head:[{icon:'tag'},{span:`rename ${t}`}],
               body:
               [
                  {input:'',name:'path',type:'hidden',value:p},{input:'',name:'args',placeholder:`${t} name`,value:x.info.name},
               ],
               foot:
               [
                  {butn:'.warn', contents:'rename', from:x, make:t, onclick:function()
                  {
                     let d={exec:'rename',type:this.make}; (this.dbox.select('input')).forEach((i)=>{d[i.name]=i.value});
                     purl('/User/treeExec',d,(r)=>{if(r.body!=OK){fail(r.body);return}; this.from.info.root.update(); this.root.exit();});
                  }},
                  {butn:'', contents:'cancel', onclick:function(){this.root.exit();}},
               ]
            });
         },

         delete:function(a,t,p,x)
         {
            popModal({class:'AnonTreeModl', theme:'dark', size:'320x190'})
            ({
               head:[{icon:'trashcan'},{span:`delete ${t}`}],
               body:
               [
                  {b:`Confirm deletion of:`},{pre:p},{span:'WARNING - this action cannot be undone'}
               ],
               foot:
               [
                  {butn:'.harm', contents:'delete', from:x, make:t, onclick:function()
                  {
                     let d={exec:'delete',type:this.make,path:x.info.path};
                     purl('/User/treeExec',d,(r)=>{if(r.body!=OK){fail(r.body);return}; this.from.info.root.update(); this.root.exit();});
                  }},
                  {butn:'', contents:'cancel', onclick:function(){this.root.exit();}},
               ]
            });
         },
      });


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
            if((n.info.type!='plug')&&!isin(n.info.path,'.url/')){return;}; if(s!='open'){return};

            l=n.info.levl; d=(!!n.draggable); r=n.info.repo; if(r){r=r.fork}; f=n.select('>'); f.innerHTML='';
            Busy.edit('/User/plugMenu',0);
            purl('/User/plugMenu',{path:n.info.path},(r)=>
            {
               r=decode.jso(r.body,1); if(!r){return}; r.each((v)=>
               {
                  v.path=(n.info.path+'/'+v.path); v.root=n.info.root;
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
         let val=into.name; let tpe=into.type; let kds=((tpe=='fold')?into.data:(isin(['plug','dbase','table'],tpe)?[]:VOID));

         if(tpe=='fold'){delete into.data}; if(!!kds&&!slf.status.fold[pth]){slf.status.fold[pth]='shut'};

         let aro = (!kds?VOID:('chevron-'+((slf.status.fold[pth]=='shut')?'right':'down')));
         let rpo = into.repo; if(rpo&&rpo.host){ext=((rpo.host.fork==rpo.head.fork)?'repoMain':'repoFork');}; let flg=(rpo?rpo.flag:'XX');

         let ico = (lib[ext]?lib[ext]:lib.auto); let isr=(isin(['repoMain','repoFork'],ext)?' .isRepo':'');
         let txt = {input:'',type:'text',disabled:true,value:val,tabindex:null};
         let tid = (into.path||into.purl); if(!tid&&!!into.root&&!!into.root.initVars){tid=into.root.initVars.purl};

         if(!tid){fail('treeview item info-data is invalid');return}; tid=('#Path'+sha1(tid));
         if(!fork&&!!rpo&&!!rpo.head){fork=rpo.head.fork;}; if(fork&&into.repo){into.repo.fork=fork};
         let flt=(slf.filter||{}); let fxt=fext(into.name); into.fext=((into.type=='fold')?'dir':(fxt||'none'));
         let fbc=0; flt.each((fv,fn)=>
         {
            if((fn=='type')&&!isin(fv,into.type)){fbc=1; return}; if((fn=='fext')&&!isin(fv,into.fext)){fbc=1; return};
            let fp=stub(fn,'_'); if(!fp){return};  let it=fp[0]; fn=fp[2]; if(into[fn]==VOID){return};
            if(into.type!=it){return}; if(isin(fv,'*')){let fr=akin(into[fn],fv); if(!fr){fbc=1}; return};
         });
         if(fbc){return};
         if(txt.value.endsWith('.url')){txt.value=rtrim(txt.value,`.url`);}
         else if(isin(slf.hideFext,fxt)){txt.value=rtrim(txt.value,`.${fxt}`);};
         if(isKnob(slf.fextIcon)&&!!slf.fextIcon[fxt]){ico=slf.fextIcon[fxt]};

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
         if(drgs){twg.listen('dragstart',function(e)
         {
            let tp=(this.info.plug||this.info.path); if(tp[0]=='~'){tp=('/'+tp);};
            e.dataTransfer.setData('text/plain',tp);
         })};

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
         self=this; vars=(self.initVars||{}); if(self.filter){vars.filter=self.filter;};
         if(self.draggable){drgs=TRUE; delete self.draggable}else{drgs=FALS};
         purl({target:this.source,convey:vars,silent:slnt},(r)=>
         {
            r=r.body; if((span(r)<1)||(r=='null')){return};
            if(!isJson(r)){fail('expecting json');return}; r=decode.JSON(r); if(span(r)<1){return};

            self.repo=r.repo; r.root=self; delete r.repo; self.info={path:(r.path),type:r.type,mime:r.mime,time:r.time,repo:self.repo};
            if(isList(r)){self.uproot=1; r={name:'void',path:'/',mime:'inode/directory',type:'fold',data:r}};
            let rsl=self.sprout(r,(self.uproot?-32:-16),drgs);
            if(self.uproot){rsl=listOf(rsl.select('treefork')[0].childNodes);};

            self.innerHTML=''; self.insert(rsl); tick.after(60,()=>
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


      n.listen('ready',ONCE,function()
      {
         this.vivify();
      });

      // return DONE;
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
                  let xw=((span(rv)*7)+8); if(xw>120){xw=120}; if(!rx){rx=(rc+':'+rv);};
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



   flap:function(n,a,c)
   {
      if((a.open==VOID)&&(a.shut==VOID)){a.shut=1; a.open=0;}; if(a.shut==a.open){fail('flap `open` and `shut` cannot be the same');return};
      if(a.open==VOID){a.open=(a.shut?0:1);}else if(a.shut==VOID){a.shut=(a.open?0:1);}; if(!isInum(a.size)){a.size=9}; // defaults
      if(!isFunc(a.togl)){fail('expecting `togl` as func');return};  let w='chevron-'; let g=a.goal; let s=a.size;
      if(!isin([U,D,L,R],g)){fail('expecting `goal` as any: U, D, L, R');return}; n.modify(a); n.conf={};

      n.conf[U]={icon:`${w}up`,    togl:D, width:(s*4), height:(s*1.5), transform:'isoSkewX(15deg)', mrgn:'bottom', padn:'Top'};
      n.conf[D]={icon:`${w}down`,  togl:U, width:(s*4), height:(s*1.5), transform:'isoSkewX(-15deg)', mrgn:'top', padn:'Bottom'};
      n.conf[L]={icon:`${w}left`,  togl:R, width:(s*1.5), height:(s*4), transform:'isoSkewY(-15deg)', mrgn:'right', padn:'Left'};
      n.conf[R]={icon:`${w}right`, togl:L, width:(s*1.5), height:(s*4), transform:'isoSkewY(15deg)', mrgn:'left', padn:'Right'};

      n.face=(a.shut?g:n.conf[g].togl); let d=n.conf[n.face]; let b={w:d.width,h:d.height}; if(isin([U,D],g)){b.w+=s}else{b.h+=s};
      n.setStyle({width:b.w,height:b.h,overflow:'hidden'}); let m=d.mrgn; let p=('padding'+d.padn);
      let y={position:'absolute',width:d.width,height:d.height,transform:d.transform}; y[m]='-1px';

      n.insert
      ([
         {div:'', style:y},
         {icon:'.cenmid', face:n.conf[n.face].icon, size:s, style:{[p]:'3px'}},
      ]);

      n.listen('click',function()
      {
         this.face=this.conf[this.face].togl; let t,i; i=this.conf[this.face].icon;
         if(this.open){t=SHUT; this.open=0; this.shut=1;}else{t=OPEN; this.open=1; this.shut=0;};
         this.select('icon')[0].className=('cenmid icon-'+i); this.togl(t);
      });
      return DONE;
   },



   dropzone:function(n,a,c)
   {
      if(!c){c=[];}; if(span(c)<1){radd(c,{h3:'drop zone'})};
      n.insert({div:c});
      n.listen('drop',(a.feed||a.onfeed||a.onFeed||a.drop||a.ondrop||a.onDrop));
      return DONE;
   },
});
