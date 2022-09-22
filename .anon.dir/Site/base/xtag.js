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
      n.setAttribute('tabindex',-1); n.tabindex=-1; if(!c){c=a.text; delete a.text}; i=a.icon;
      n.modify(a); if((c!=VOID)&&(c!='')){n.insert(c)}; return DONE;
   },



   modal:function(n,a,c)
   {
      n.setAttribute('tabindex',-1); n.tabindex=-1;
   },



   icon:function(n,a,c, nico)
   {
        nico=VOID; if(isNumr(c)){c+=""}; if(!c){c='bug'}; if(!isText(a.face,1)){a.face=c}; if(isNumr(a.face)){a.face+=""};
        a.face=unwrap(a.face); nico=((isUpperCase(a.face)&&(span(a.face)<3))?1:0); if(!isText(a.font,1)){a.font=(nico?'hack':'icon')};
        a.size=(isInum(a.size)?(a.size+'px'):(isNumr(a.size)?(a.size+'rem'):(isText(a.size,3)?a.size:'16px')));
        let fce,fnt,sze,rot,clp; fce=a.face; fnt=a.font; sze=(a.size+""); clp=a.clip; delete a.face; delete a.font; delete a.size; delete a.clip;
        c=VOID; if(a.text){c=a.text; delete a.text}; rot=stub(fce,'@'); if(rot){fce=rot[0]; rot=(rot[2]*1); rot=(isNumr(rot)?round(rot,0):0)};
        if(nico){if(!a.style){a.style={}}; a.style.fontFamily=fnt; a.style.fontWeight="bold"; a.style.lineHeight=sze; n.innerHTML=fce};
        modify(n,a); n.setStyle({height:sze, fontSize:sze});
        if(!clp&&!nico){n.enclan(('.'+fnt+'-'+fce))};
        if(!c){n.setStyle({width:sze,transform:`rotate(${rot}deg)`})};


        if(c){n.insert({div:c}); return DONE;};
        if(!clp){return DONE;};

        n.size=sze; n.icon=fce; n.clip=clp;
        n.listen("ready",function()
        {
            let box=rectOf(this); let osz=this.size; let unt=(pick(osz,["px","rem","em"])||"px"); let nmr=(rtrim(osz,unt)*1);
            let cid=fash(); let clp=this.clip; let rad=Math.ceil(nmr/3); let cxy=rad; let cpn=keys(clp)[0]; let cpi=clp[cpn];
            let bxw=box.width; let bxh=box.height; let ico=this.icon; let par=n.parentNode; par.removeChild(n); let qr=(rad/4);
            let crd=
            {
                Tl:{cx:(cxy-qr),cy:(cxy-qr)},
                Tr:{cx:((bxw-cxy)+qr),cy:(cxy-qr)},
                Bl:{cx:(cxy-qr),cy:((bxh-cxy)+qr)},
                Br:{cx:((bxw-cxy)+qr),cy:((bxh-cxy)+qr)},
            };

            let lst=styleSheet('/Site/dcor/icon.woff'); let tnt=cStyle(par,"color"); let htm=''; let bip=crd[cpn];
            let uni=lst[`.icon-${ico}::before`]; uni=(isWord(ico)?uni.content:((isUpperCase(ico)&&(span(ico)<3))?ico:'?'));
            let tiu=lst[`.icon-${cpi}::before`]; tiu=(isWord(cpi)?tiu.content:((isUpperCase(cpi)&&(span(cpi)<3))?cpi:'?'));
            let stl=`fill="${tnt}" stroke="none" style="webkit-font-smoothing:greyscale"`; let tfs=(nmr/2);
            if(isText(cpi,1))
            {
                tfs*=0.8;
                // tip.y*=1.2;
            };
            let tic=
            {
                Tl:{cx:0,cy:(tfs-2)},
                Tr:{cx:(bxw-tfs),cy:(tfs-2)},
                Bl:{cx:0,cy:(bxh-2)},
                Br:{cx:(bxw-tfs),cy:(bxh-2)},
            };
            let tip=tic[cpn]; let fnt=(isText(cpi,2)?"icon":"hack");

            htm=`<svg width="${bxw}" height="${bxh}" viewbox="0 0 ${bxw} ${bxh}" class="cenmid">
                    <mask id="IconMask${cid}">
                        <rect x="0" y="0" width="100%" height="100%" fill="white" />
                        <circle cx="${bip.cx}" cy="${bip.cy}" r="${rad}" fill="black" />
                    </mask>
                    <text class="bigIcoTxt" x="2" y="${(bxh-3)}" ${stl} font-family="icon" font-size="${nmr}${unt}" mask="url(#IconMask${cid})">${uni}</text>
                    <text class="smlIcoTxt" x="${tip.cx}" y="${tip.cy}" font-family="${fnt}" ${stl} font-size="${tfs}${unt}">${tiu}</text>
                 </svg>`;

            par.insert({grid:'.iconGrid',$:[{row:[{col:[{wrap:htm}]}]}]});
        });

      return DONE;
   },



   item:function(n,a,c, i)
   {
      if(isText(a.text,1)&&isText(c,1)&&c.startsWith('$')){a.icon=c.slice(1); c=VOID};
      if(isText(a.text,1)){c=(a.text+''); delete a.text}; if(isText(a.icon,1)){i=(a.icon+''); delete a.icon};
      if(i){n.insert({icon:i,text:c})}else{n.insert({span:c})}; modify(n,a); return DONE;
   },



   svg:function(n,a,c)
   {
      if(isPath(c)){a.src=c; c=VOID}; if(!isPath(a.src)){return}; let src=`${a.src}`; delete a.src;
      n=create('holder');
      purl(src,function(r)
      {
         // r=furl(r.body).data; // ?
         r=r.body;
         if(!isin(r,'<svg')||!isin(r,'</svg>')){r=`<svg><text>?</text></svg>`}; let t=create('div'); t.innerHTML=r;
         let f=document.createDocumentFragment(); r=t.select('svg')[0]; r.modify(a); f.appendChild(r); t=VOID; n.replaceWith(r);
      });
      return n;
   },



   treeview:function(n,a,c)
   {
      n.setAttribute('tabindex',-1); n.tabindex=-1;
      if(!!a.events){n.events=a.events; delete a.events}else if(!!a.listen){n.events=a.listen; delete a.listen}else{n.events={}};


      if(a.feedable)
      {
         n.feedMe=function(fp,fd)
         {upload(pathOf(fp),fd,()=>{this.blur(); this.update();});};

         n.onFeed(function(fd,fn)
         {this.feedMe(`${repl.PWD}/${fn}`,fd);});

         n.listen("dragenter",function(){this.enclan(`dragover`);});
         n.listen("dragleave",function(){this.declan(`dragover`);});
         // n.events.feed=function(fd,fn, hp)
         // {
         //    hp=this.info.path; if(!isin(['fold','plug'],this.info.type)){twig(hp)};
         //    this.info.root.feedMe(`${hp}/${fn}`,fd);
         // };
      };


      if((n.events.RightClick===VOID)&&(n.events.contextmenu===VOID)){n.listen('RightClick',function(e, x,m,t,w,l)
      {
         x=VOID; x=e.srcElement;
         if(nodeName(x)!='treeview'){x=x.lookup('^',3); if(nodeName(x)!='treetwig'){x=x.parentNode}}
         else if(!x.info.path&&!x.info.mime){x.info={name:twig(repl.PWD),path:repl.PWD,mime:'inode/directory',type:'fold'}};
         m=VOID; if(!x.info.root){x.info.root=x;}; m=x.info.mime.split('/')[0]; t=x.info.type; w=t; if(t=='fold'){w='folder'};
         // dump(x.info);
         if(x.info.repo&&x.info.repo.head&&x.info.repo.host){t='repoMain'; w='repo';};

         l=//list
         [
            {h1:[{icon:x.info.root.status.mime[m]},{div:(w+' options')}]},
            {div:'.panlHorzDlim', contents:[{hdiv:[]}]},
            {item:'$spinner9', text:'refresh', onclick:function()
            {
                this.context.info.root.update();
            }},
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
            radd(l,{item:'$history1', text:'revert previous', onclick:function(){this.context.info.root.adjure('update','prev',this.context)}});
            radd(l,{item:'$cog', text:'modify origin', onclick:function(){this.context.info.root.adjure('modify','repo',this.context)}});
         };

         if(t=='plug')
         {
            radd(l,{line:[]}),
            radd(l,{item:'$cog', text:'modify plug link', onclick:function(){this.context.info.root.adjure('modify','plug',this.context)}});
         };

         if(!isin(['~','/'],x.info.path))
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
            ];

            if(t!='repo')
            {radd(b,{row:[{col:'.text', contents:'as'},{col:[{input:'', name:'args', placeholder:('new '+t+' name')}]}]});};

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


         update:function(a,t,p,x)
         {
            if(t=="pull")
            {
                purl('/User/treeExec',{exec:'update', type:"repo", todo:t, path:p},(ld)=>
                {ld=ld.body; if(ld!=OK){fail(ld);return}; x.info.root.update();}); return;
            };

            popModal({class:'AnonTreeModl', theme:'dark'})
            ({
               head:[{icon:'repo-push'},{span:`update repo ~ ${t}`}],
               body:
               [
                  {input:'',name:'mesg',placeholder:`commit message`,value:"latest updates"},
               ],
               foot:
               [
                  {butn:'.cool', contents:'update', from:x, vars:{todo:t,path:p}, onclick:function()
                  {
                     let d={exec:'update',type:"repo",todo:this.vars.todo,path:this.vars.path,mesg:this.dbox.select('input')[0].value};
                     purl('/User/treeExec',d,(r)=>{if(r.body!=OK){fail(r.body);return}; this.from.info.root.update(); this.root.exit();});
                  }},
                  {butn:'', contents:'cancel', onclick:function(){this.root.exit();}},
               ]
            });
         },


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
            popModal({class:'AnonTreeModl', theme:'dark', size:'360x190'})
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
                     purl('/User/treeExec',d,(r)=>
                     {
                         if(r.body!=OK){fail(r.body);return};
                         let tn=this.from;  let pi=tn.lookup("^",2).lookup("<");
                         remove(tn); tn=VOID; if(!pi){this.root.exit();return};
                         pi.info.root.status.togl(pi);
                         tick.after(250,()=>{pi.info.root.status.togl(pi)});
                         this.root.exit();
                     });
                  }},
                  {butn:'', contents:'cancel', onclick:function(){this.root.exit();}},
               ]
            });
         },
      });


      n.locate=function(p, r)
      {
          r=VOID; (n.select("treetwig")||[]).each((i)=>{if(i.info.path==p){r=i; return STOP}});
          return r;
      },


      n.status= // object
      {
         fold:{},

         togl:function(itm,sig, stmpth)
         {
            if(!itm.info.kids){return}; if(isin(sig,['Control','Shift'])){return};
            var p,s,i,d,e,f,k,l,r; p=itm.info.path; s=this.fold[p];
            s=((s=='shut')?'open':'shut'); i=((s=='open')?'down':'right');
            this.fold[p]=s; itm.select('.treeTwigArro i')[0].className=('icon-chevron-'+i);
            itm.select('>').style.display=((s=='open')?'block':'none');
            if(s!='open'){return};

            stmpth = (itm.info.root.boring || '/User/plugMenu');
            // stmpth = ('/User/plugMenu');

            l=itm.info.levl; d=(!!itm.draggable); e=(!!itm.info.root.feedable); r=itm.info.repo; if(r){r=r.fork};
            f=itm.select('>');

            if(!itm.info.root.fromPlug&&(itm.info.type=="fold")&&(f.childNodes.length<1)){purl('/User/foldMenu',{path:itm.info.path},(r)=>
            {
               if(!isJson(r.body))
               {dump(r.body); fail("got non-json response, see console"); return};
               r=decode.jso(r.body,1); if(r&&isList(r.data)){r=r.data}; if(!r){return};
               f.innerHTML='';
               r.each((v)=>
               {
                  v.path=(itm.info.path+"/"+v.name);
                  v.root=itm.info.root;
                  f.insert(itm.info.root.sprout(v,l,d,e,r));
               });
            });return};

            dump(stmpth, p, itm.info.type);
            if (stmpth.startsWith("/Data/") && !p.endsWith(".sdb")){ return }; // f*ck this sh!t Anon sucks!
            if(!isin('fold,plug,dbase,table',itm.info.type)){return;};

            itm.info.root.fromPlug = true;
            Busy.edit(stmpth,0);
            purl(stmpth,{path:itm.info.path},(r)=>
            {
               if(!isJson(r.body))
               {dump(r.body); alert("got non-json response, see console"); Busy.edit(stmpth,100);return};
               r=decode.jso(r.body,1); if(r&&isList(r.data)){r=r.data};
               if(!r){ dump(stmpth+" has no data"); return};  f.innerHTML='';
               // if(itm.info.path.includes(".url/") || itm.info.path.endsWith(".url")){f.innerHTML='';};

               r.each((v)=>
               {
                  if(!v){return};
                  v.root=itm.info.root;
                  v.path=(itm.info.path+"/"+v.name);
                  f.insert(itm.info.root.sprout(v,l,d,e,r));
               });
               Busy.edit(stmpth,100);
            });
         },

         mime:
         {
            auto:'file-text2',
            text:'file-text2',
            inode:'file-directory',
            image:'file-picture',
            link:'file-symlink-file',
            none:'file-empty',
            repoMain:'repo',
            repoFork:'repo-clone',
            linkFold:'file-symlink-directory',
            linkFile:'file-symlink-file',
            plug:'plug',
            database:'database',
            dbase:'database',
            table:'table',
            sproc:'cog',
            funct:'cogs',
            field:'ellipsis',
         },

         hash:hash(),
      };


      n.sprout = function(into,levl,drgs,eats,fork,prnt)
      {
         if(isNode(into)||!isKnob(into)){return}; if(!into.type){into.type="file"}; if(!into.mime){into.mime="auto/undefined"};
         let slf = this; let pth=into.path; let lib=slf.status.mime; levl+=1; let ext = into.mime.split('/')[0];
         let val=into.name; let tpe=into.type; let kds=((tpe=='fold')?into.data:(isin(['plug','dbase','table'],tpe)?[]:VOID));

         if (val === "MyRepo"){ return }; // this is not a hack, just a bad f*ckup .. for now we just hide it
         if (pth.startsWith("//")){ into.path = pth.slice(1);  pth = into.path };

         if(tpe=='fold'){delete into.data};
         if(!!kds&&!slf.status.fold[pth]){slf.status.fold[pth]='shut'};

         let aro = (!kds?VOID:('chevron-'+((slf.status.fold[pth]=='shut')?'right':'down')));
             aro = {i:('.icon-'+(kds?aro:"primitive-dot"))}; if(!kds){aro.style={opacity:0.2}};

         let rpo = into.repo; if(rpo&&rpo.host){ext=((rpo.host.fork==rpo.head.fork)?'repoMain':'repoFork');};
         let flg=(rpo?rpo.flag:'XX');
         let ico = (lib[ext]||lib[tpe]||lib.auto);
         let isr=(isin(['repoMain','repoFork'],ext)?' .isRepo':'');
         let txt = {input:'',type:'text',disabled:true,value:val,tabindex:null};
         let tid = (into.path||into.purl); if(!tid&&!!into.root&&!!into.root.initVars){tid=into.root.initVars.purl};

         if(!tid){fail('treeview item info-data is invalid');return}; tid=('#Path'+sha1(tid));
         if(!fork&&!!rpo&&!!rpo.head){fork=rpo.head.fork;}; if(fork&&into.repo){into.repo.fork=fork};
         let flt=(slf.filter||{}); let fxt=fext(into.name); into.fext=((into.type=='fold')?'dir':(fxt||'none'));

         let fbc=0; flt.each((fv,fn)=>
         {
            if((fn=='type')&&!isin(fv,into.type)){fbc=1; return};
            if((fn=='fext')&&!isin("fold,plug,dbase,table,field",into.type)&&!isin(fv,into.fext)){fbc=1; return};
            if(isin(fv,'*')){fv.split(",").forEach((fi)=>{if(!akin(into[fn],fi)){fbc=1}}); return};
            let fp=stub(fn,'_'); if(!fp){return};  let it=fp[0]; fn=fp[2]; if(into[fn]==VOID){return};
            if(into.type!=it){return};
         });
         if(fbc || !txt.value){return};
         if(txt.value.endsWith('.url')){txt.value=rtrim(txt.value,`.url`);}
         else if(isin(slf.hideFext,fxt)){txt.value=rtrim(txt.value,`.${fxt}`);};
         if(isKnob(slf.fextIcon)&&!!slf.fextIcon[fxt]){ico=slf.fextIcon[fxt]};

         into.levl=levl;

         let twg = create({treetwig:(tid+isr), info:into, tabindex:-1, listen:slf.events, contents:
         [
            {grid:('.diff'+flg), contents:[{row:
            [
               {col:'.treeTwigDent', style:('width:'+((levl<=0)?0:(levl*16))+'px')},
               {col:'.treeTwigArro', contents:[aro]},
               {col:'.treeTwigIcon', contents:[{i:('.icon-'+ico)}]},
               {col:'.treeTwigText', contents:[txt]},
            ]}]},
         ]});

          twg.listen('mouseover,mouseout',function(ev)
          {
             if(ev.type=='mouseout'){this.declan('treeItemCtrl'); this.declan('treeItemShft'); this.blur(); return};
             this.focus(); if(ev.ctrlKey){this.enclan('treeItemCtrl')}else if(ev.shiftKey){this.enclan('treeItemShft')};
          });

          twg.listen('keydown,keyup',function(ev)
          {
             let k=ev.signal; if((k!='Control')&&(k!='Shift')){return}; k=((k=='Control')?'Ctrl':'Shft');
             if(ev.type=='keydown'){this.enclan('treeItem'+k);return}; this.declan('treeItem'+k);
          });

         twg.listen('click',function(ev){this.info.root.status.togl(this,ev.signal)});
         if(!!kds){twg.info.kids=true};

         if(drgs){twg.listen('dragstart',function(e)
         {
            let tp=(this.info.plug||this.info.path); if(tp[0]=='~'){tp=('/'+tp);};
            e.dataTransfer.setData('text/plain',tp);
         })};

         twg.update=function(lv)
         {
             if(!isInum(lv)){lv=2};
             let pi=this.lookup("^",lv).lookup("<");
             if(!pi||!pi.info){return}; pi.info.root.status.togl(pi);
             tick.after(250,()=>{pi.info.root.status.togl(pi)});
         };

         if(eats)
         {
             twg.listen("dragenter",function(){this.enclan(`dragover`);});
             twg.listen("dragleave",function(){this.declan(`dragover`);});
             twg.onFeed(function(fd,fn)
             {
                 this.declan(`dragover`);  let tp,fp;  tp=this.info.type;  fp=this.info.path;
                 if(!isin(["fold","plug"],tp)){fp=twig(fp)};
                 upload(pathOf(`${fp}/${fn}`),fd,()=>
                 {
                     this.update();
                 });
             });
         };

         let frk = VOID; if(kds)
         {
            frk=[]; kds.each((v)=>
            {if(!v){return}; v.root=slf; if(!!v.repo){v.repo.fork=fork}; frk.push(slf.sprout(v,levl,drgs,eats,fork))});
            frk=create({treefork:frk}); if(aro=='chevron-down'){frk.style.display='block'};
         };

         let itm = create({treeface:[twg,frk]});
         return itm;
      };


      n.vivify = function(slnt, self,drgs,eats,fork,vars)
      {
         if(!isPath(this.source)){fail('expecting `source` attribute in treeview as path');return};
         self=this; vars=(self.initVars||{}); vars.root=repl.PWD; if(self.filter){vars.filter=self.filter;};
         if(self.draggable){drgs=TRUE; delete self.draggable}else{drgs=FALS};
         if(self.feedable){eats=TRUE;}else{eats=FALS};
         purl({target:this.source,convey:vars,silent:slnt},(r)=>
         {
            r=r.body; if((span(r)<1)||(r=='null')){return};
            if(!isJson(r)){if(r.startsWith("evnt: fail\n")){return}; fail('expecting json');return};
            r=decode.JSON(r); if(span(r)<1){return};

            self.repo=r.repo; r.root=self; delete r.repo; self.info={path:(r.path),type:r.type,mime:r.mime,time:r.time,repo:self.repo};
            if(isList(r)){self.uproot=1; r={name:'void',path:'/',mime:'inode/directory',type:'fold',data:r}};
            let rsl=self.sprout(r,(self.uproot?-2:-1),drgs,eats,fork);
            if(self.uproot&&!!rsl.select('treefork')){rsl=listOf(rsl.select('treefork')[0].childNodes);};

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
            expect({knob:obj}); if(!isFunc(cbf)){cbf=function(){}}; let ttl,bdy,slf,pid,tid,hdr,tgt,hid,bid,hob,bob,stl,spn,fso,flp,cls,rot;
            ttl=(obj.title||obj.head||obj.tab); bdy=(obj.contents||obj.body); if(!isText(ttl)){return}; if(bdy==VOID){bdy=''}; slf=this.entity;
            if(ttl.startsWith("/$/")||ttl.startsWith("/~/")){ttl=ltrim(ttl,"/")};
            expect({text:ttl}); if(!slf.id){slf.id=('TN'+hash())}; if(!isNumr(idx)){idx=0;}; stl=(slf.theme||'.dark'); spn=span(ttl);
            pid=slf.id; tid=sha1(pid+ttl); hdr=slf.select('.tabhdr')[0]; tgt=select(slf.target); cls=obj.canClose; if(cls==VOID){cls=1};
            hid=('#TAB'+tid+'HEAD'); bid=('#TAB'+tid+'BODY'); hob=select(hid); bob=select(bid); if(!!hob||!!bob){return}; if(!cls){cls=VOID};
            if(cls){cls={icon:'cross', title:'close', onclick:function(){this.select('^4').driver.delete(this.select('^^').title)}}};
            flp=(slf.flap||U); let ori=(isin([L,R],flp)?'.vert':'.horz'); let sze=12; this.opened[ttl]=1; let trn; n.enclan(ori);
            fso=//obj
            {
               [U]:{transform:'isoSkewX(15deg)',  height:(sze*2.4)},
               [D]:{transform:'isoSkewX(-15deg)', height:(sze*2.4), top:-4},
               [L]:{transform:'isoSkewY(-15deg)', width:(sze*2.4), height:(spn*sze), right:-4},
               [R]:{transform:'isoSkewY(15deg)',  width:(sze*2.4), height:(spn*sze), left:-4},
            };

            hdr.insert({tab:`${hid} .head ${ori} ${stl}`, style:{height:(spn*sze)}, title:ttl,
            listen:
            {
               click:function(){this.select('^^').driver.select(this.title)},
               ready:function()
               {
                  if(!isin(this.className,'vert')){return}; let de,te,db,tb,ld,dy,td;
                  de=this.select('.tabdeck')[0]; te=this.select('.tabtext')[0]; tb=rectOf(te);
                  this.setStyle({height:tb.height}); de.setStyle({height:Math.floor(tb.height)}); db=rectOf(de);
                  ld=Math.floor(tb.left-db.left); te.setStyle({marginLeft:(1-ld),bottom:(5-(tb.height/2))});
               },
            },
            contents:
            [
               {div:('.tabdeck'), style:fso[flp]},
               {div:`.tabtext ${ori}`, contents:[{span:ttl},cls]},
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
                  liv=(drv.viewed.length-1); if(liv<0){slf.signal('empty',{driver:drv});return}; // no "last viewed" tab to auto-select
                  liv=drv.viewed[liv]; drv.select(liv); // auto-select "last viewed"
               });
            });
            return TRUE;
         },
      };


      let ori=(isin([L,R],a.flap)?'.vert':'.horz');

      n.insert({div:`.tabhdr ${ori}`});
      if(!a.target){a.target=('#TT'+hash()); n.insert({div:(a.target+' .tabtgt')});}; n.modify(a);


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
         rsp=(isJson(rsp.body)?decode.jso(rsp.body):VOID);
         rs=span(rsp); rd=0; pd=0; if(!rsp||(rs<1)||!isList(rsp)){return};
         if(!isKnob(rsp[0])){fail('expecting list of objects for datagrid');return};

         if(rs>10){Busy.edit('dataRender',0)};
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

         tick.until(()=>{return (pd==100)},()=>
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
      })};

      return DONE;
   },



   flap:function(n,a,c)
   {
      if((a.open==VOID)&&(a.shut==VOID)){a.shut=1; a.open=0;}; if(a.shut==a.open){fail('flap `open` and `shut` cannot be the same');return};
      if(a.open==VOID){a.open=(a.shut?0:1);}else if(a.shut==VOID){a.shut=(a.open?0:1);}; if(!isInum(a.size)){a.size=9}; // defaults
      if(a.skew==VOID){a.skew=15}; let skw=a.skew;
      let w='chevron-'; let g=a.goal; let s=a.size;
      if(!isin([U,D,L,R],g)){fail('expecting `goal` as any: U, D, L, R');return}; n.modify(a); n.conf={};

      n.conf[U]={icon:`${w}up`,    togl:D, width:(s*4), height:(s*1.5), transform:`isoSkewX(${skw}deg)`, mrgn:'bottom', padn:'Top'};
      n.conf[D]={icon:`${w}down`,  togl:U, width:(s*4), height:(s*1.5), transform:`isoSkewX(-${skw}deg)`, mrgn:'top', padn:'Bottom'};
      n.conf[L]={icon:`${w}left`,  togl:R, width:(s*1.5), height:(s*4), transform:`isoSkewY(-${skw}deg)`, mrgn:'right', padn:'Left'};
      n.conf[R]={icon:`${w}right`, togl:L, width:(s*1.5), height:(s*4), transform:`isoSkewY(${skw}deg)`, mrgn:'left', padn:'Right'};

      n.face=(a.shut?g:n.conf[g].togl); let d=n.conf[n.face]; let b={w:d.width,h:d.height}; if(isin([U,D],g)){b.w+=s}else{b.h+=s};
      n.setStyle({width:b.w,height:b.h,overflow:'hidden'}); let m=d.mrgn; let p=('padding'+d.padn);
      let y={position:'absolute',width:d.width,height:d.height,transform:d.transform}; y[m]='-1px';

      let ins = // arr
      [
         {div:'', style:y},
      ];

      if (!isFunc(a.togl)) // no togl
      {
          n.setStyle({cursor:"default"});
      }
      else // can togl
      {
         ins.radd({icon:'.cenmid', face:n.conf[n.face].icon, size:s, style:{[p]:'3px'}});
      };

      n.insert(ins);

      n.listen('click',function()
      {
         if (!isFunc(this.togl)){return}; // no toggling
         this.face=this.conf[this.face].togl; let t,i; i=this.conf[this.face].icon;
         if(this.open){t=SHUT; this.open=0; this.shut=1;}else{t=OPEN; this.open=1; this.shut=0;};
         this.select('icon')[0].className=('cenmid icon-'+i); this.togl(t);
      });
      return DONE;
   },



   dropzone:function(n,a,c, x,f)
   {
      if(!c){c=[];}; if(span(c)<1){radd(c,{h3:'drop zone', style:{margin:0}})}; n.insert({div:c});
      x="drop,ondrop,onDrop,feed,onfeed,onFeed"; f=isin(a,x.split(","));
      if(!f||!isFunc(a[f])){fail(`expecting attribute like: ${x} -as function to handle drops`);return};
      f=a[f]; delete a[f]; n.listen('drop',f); n.modify(a);
      return DONE;
   },
});
