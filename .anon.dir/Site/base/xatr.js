extend(custom.attrib)
({
   // src:function(v,n,a, r)
   // {r=(isPath(v)?r=(v+'?n='+nodeName(n)):(v+'')); n.setAttribute('src',r); n.src=r; return TRUE;},
   //
   // href:function(v,n,a, r)
   // {r=(isPath(v)?r=(v+'?n='+nodeName(n)):(v+'')); n.setAttribute('href',r); n.src=r; return TRUE;},
   //
   // data:function(v,n,a, r)
   // {r=(isPath(v)?r=(v+'?n='+nodeName(n)):(v+'')); n.setAttribute('data',r); n.src=r; return TRUE;},

   demo:function(v,n,a, r)
   {if(!isin('input,textarea',nodeName(n))){return}; n.setAttribute('placeholder',v); n.placeholder=v;},

   regx:function(v,n,a, r)
   {if(!isin('input,textarea',nodeName(n))){return}; if(isFunc(v)){return}; n.pattern=v; n.setAttribute('pattern',v); },


   icon:function(v,n,a, t,p,pb,nb,ml,mt,pr,pt,fs,fc,bw,so,il)
   {
      if(isin(v," ")){il=v.split(" "); v=lpop(il); il=rpop(il); v=(v+" "+il); il=VOID;};
      n.setAttribute('icon',v); n.icon=v;

      wait.until(()=>{return (!!n.parentNode)},()=>
      {
         t=nodeName(n); p=n.parentNode; pb=rectOf(p); nb=rectOf(n); mt=cStyle(n,'margin-top'); ml=cStyle(n,'margin-left');
         pr=cStyle(n,'padding-right'); pt=cStyle(n,'padding-top'); fs=cStyle(n,'font-size'); fc=cStyle(n,'color'); bw=cStyle(n,'border-width');
         il=stub(v," "); if(il){v=il[0]; il=dval(il[2]);};

         let lico=n.select(".iconGrid"); if(!lico){lico=n.select("icon");};
         remove(lico);

         if(t=='butn')
         {
            if(il)
            {
               n.insert({icon:"", face:v, size:fs, clip:il});
               return;
            };

            let c=n.innerHTML; n.innerHTML='';
            let r=[{col:'.butnIcon',contents:[{icon:'', face:v, size:fs}]}];
            if(c){r.radd({col:'.butnLine',contents:[{vdiv:''}]}); r.radd({col:'.butnText',contents:c})};
            n.insert({grid:'.iconGrid',$:[{row:r}]});
            return;
         };

         if(t=='input')
         {
            so={marginLeft:(ml+pr+(bw*2)),marginTop:(mt+pt+(bw*2)),color:fc};
            p.insert({icon:'.absTop .absLft', face:v, size:(fs-2), style:so});
            n.setStyle({paddingLeft:round((fs*1.6),0)});
            return;
         };
      });

      return TRUE;
   },


   hint:function(v,n,a, data)
   {
      if(isFunc(v))
      {
         fail('hint callbacks not supported yet'); return;
      };

      if(!isKnob(v)){v={text:tval(v)}}; if(!v.tone){v.tone=LITE}; if(!v.arro){v.arro=TM};
      if(!v.attr){v.attr={}}; if(!v.attr.style){v.attr.style={}};
      if(!isNumr(v.attr.style.left)){v.attr.style.left=0}; if(!isNumr(v.attr.style.top)){v.attr.style.top=0};

      if(v.text){data={span:v.text}}else if(v.peek)
      {
         if(!isPath(v.peek)){fail('expecting path');return}; let fx=fext(v.peek); let fn=leaf(v.peek); let img,ico;
         if(isin(['jpg','jpeg','png','gif','svg','webp'],fx)){img={backgroundImage:`url(${v.peek})`}}
         else{ico={icon:'', face:'file', size:40}};
         data={div:'.hintWrap', contents:
         [
            {div:'.hintDeck', style:(img||{}), contents:[ico]},
            {div:'.hintText', contents:fn},
         ]};

      };

      n.hint=notify(data,v.tone,v.arro,v.attr,0); n.hint.enclan('hide'); if(v.peek){n.hint.enclan('hintPeek')};
      n.hint.attr=v.attr; document.body.appendChild(n.hint);
      n.listen('mouseover',function()
      {
         this.hint.reclan('hide:show'); if(!this.hint.posi)
         {
            let pbx,nbx,phw,nhw; pbx=rectOf(this); nbx=rectOf(this.hint); phw=(pbx.width/2); nhw=(nbx.width/2);
            this.hint.setStyle({left:((pbx.x+phw)-nhw),top:(pbx.y+pbx.height+5)});
            this.hint.posi=1;
         };
      });

      n.listen('mouseout',function(){this.hint.reclan('show:hide')});

      return TRUE;
   },



   role:function(v,n,a, f)
   {
      if(!isWord(v)||!this[v]){return}; f=a.onready; delete a.onready; // hold onready until we're done here
      n.setAttribute('role',v); n.role=v; n.listen('ready',ONCE,(e)=> // only enact when ready, else dependencies may be unavailable
      {
         this[v](n,a); // call role handler
         if(isFunc(f)){f.apply(n,[e])}; // if onready was held, call it now
      });
      return TRUE;
   }
   .bind
   ({
      gridFlex:function(n,a, t,mx,my,tp)
      {
         if((a.axis!=X)&&(a.axis!=Y)){fail('invalid gridflex axis');return}; t=a.target; // validate
         if(t&&!isin(t,['>','<'])){fail('expecting gridflex target as sibling-selector');}; // validate
         mx=(a.axis==X); my=(!mx);  n.enclan(('move'+(mx?'Horz':'Vert'))); // which axis to lock .. indicate with cursor
         if(t){tp=(isin(t,'>')?'>':'<'); t=n.select(t); if(!t){fail('invalid gridflex target')}}
         else{t=n.select((mx?'>':'^ > col')); tp='>'; if(!t){tp='<'; t=n.select((mx?'<':'^ < col'))}};
         if(isList(t)){t=t[0]}; if(!isNode(t)){fail('invalid gridflex target');return}; // validate
         n.modify({draggable:true}); n.flxVrs={trgt:t,arro:tp,axis:(mx?X:Y)};

         n.addEventListener('dragstart',function(e)
         {
            this.flxVrs.opos=[cursor.posx,cursor.posy]; this.flxVrs.lpos=[cursor.posx,cursor.posy];
            let b=this.flxVrs.trgt.getBoundingClientRect(); this.flxVrs.odim=[b.width,b.height]; let i=(new Image());
            i.src = 'data:image/gif;base64,R0lGODlhAQABAIAAAAUEBAAAACwAAAAAAQABAAACAkQBADs='; e.dataTransfer.setDragImage(i,0,0);
            e.dataTransfer.setData(null,null); // firefox bein' a dick
// dump('drag init');
         },false);

         n.addEventListener('drag',function(e)
         {
            let fv,tn,ar,lp,cx,cy,ox,oy,lx,ly,ow,oh,ax,mx,my,mv,pd,bd,cw,ch,nw,nh; fv=this.flxVrs; tn=fv.trgt; ar=fv.arro; lp=fv.lpos;
            cx=cursor.posx; cy=cursor.posy; ox=fv.opos[0]; oy=fv.opos[1]; lx=lp[0]; ly=lp[1]; ow=fv.odim[0]; oh=fv.odim[1];
            ax=fv.axis; mx=(ax==X); my=(ax==Y); if(cx===lx){mx=VOID;}; if(cy===ly){my=VOID;};
            if((ax==X)&&!mx){return}; if((ax==Y)&&!my){return}; mv=(mx?((cx<lx)?L:R):((cy<ly)?U:D));
// dump('drag move');
            bd=tn.getBoundingClientRect(); cw=bd.width; ch=bd.height; // box dimensions
            pd=((mv==U)?(ly-cy):((mv==D)?(cy-ly):((mv==L)?(lx-cx):(cx-lx)))); // pixel difference

            if(ar=='>'){if(mx){nw=((mv==L)?(cw+pd):(cw-pd))}else{nh=((mv==U)?(ch+pd):(ch-pd))}}
            else{if(mx){nw=((mv==L)?(cw-pd):(cw+pd))}else{nh=((mv==U)?(ch-pd):(ch+pd))}}

            if(mx){tn.style.width=(nw+'px')}else{tn.style.height=(nh+'px')};
            this.flxVrs.lpos=[cx,cy]; tn.signal('flex');
         },false);
      },
   }),



   onflex:function(v,n,a)
   {
      // window.listen('resize',function(){this.trgt.signal('flex');}.bind({trgt:n}));
      // n.listen('flex',v); return TRUE;
   },



   listen:function(v,n,a, l)
   {
      if(!isKnob(v)){fail('expecting `listen` attrinute as object');return TRUE};
      v.each((f,e)=>{if(isText(e,1)&&isFunc(f)){n.listen(e.split(','),v[e])}}); return TRUE;
   },



   hideIf:function(v,n,a)
   {
      if(!v){return}; n.style.display='none';
      if(isText(a.style)){a.style=trim(a.style);a.style=trim(a.style,';');a.style+=(';display:none;');a.style=trim(a.style,';'); return TRUE};
      if(isKnob(a.style)){a.style.display='none';};
   },



   grabgoal:function(v,n,a)
   {
      n.dropPick=v;

      n.listen('Control LeftClick',function()
      {
         this.myorigin=this.parentNode; this.dropInto={}; this.isLifted=TRUE;
         this.ostyle={width:this.style.width, height:this.style.height};
         let l=select(this.dropPick); if(!l){return}; if(!isList(l)){l=[l]}; l.forEach((i,q)=>
         {
            if(!i.id){i.id=('EL'+q+hash())}; q=i.getBoundingClientRect(); if(!i.tabindex){i.tabindex=-1; i.setAttribute('tabindex',-1)};
            this.dropInto[i.id]={tl:[q.x,q.y], tr:[(q.x+q.width),q.y], bl:[q.x,(q.y+q.height)], br:[(q.x+q.width),(q.y+q.height)]};
         });
         let d=this.getBoundingClientRect(); let f=document.createDocumentFragment(); f.appendChild(this);
         this.style.position='absolute'; this.style.zIndex=9991; this.style.left=(d.x+'px'); this.style.top=(d.y+'px');
         this.style.width=(d.width+'px'); this.style.height=(d.height+'px'); document.body.appendChild(this);
         document.body.appendChild(this); cursor.glue(this,d.x,d.y); this.signal('grablift',{origin:this.myorigin,target:this.myorigin});
      });

      n.listen('boundmove',function(e)
      {
         this.landZone=VOID; let cx,cy; cx=e.detail.x; cy=e.detail.y; let tn=VOID; this.dropInto.each((xy,id)=>
         {if((cx>xy.tl[0])&&(cx<xy.tr[0])&&(cy>xy.tl[1])&&(cy<xy.bl[1])){tn=id}; select('#'+id).blur();});
         tn=(tn?select('#'+tn):VOID); this.signal('grabmove',{origin:this.myorigin,target:tn});
         if(!tn){return}; this.landZone=('#'+tn.id); tn.focus();
      });

      n.listen('mouseup',function(e)
      {
         if(!this.isLifted){return;};
         cursor.drop(this); let lz=this.landZone; lz=(select(lz)||this.myorigin).appendChild(this); let os=this.ostyle;
         this.style.position='relative'; this.style.top='0px'; this.style.left='0px';
         this.style.width=os.width; this.style.height=os.height; this.isLifted=VOID;
         this.signal('grabdrop',{origin:this.myorigin,target:lz});
      });
   },



   sorted:function(v,n,a)
   {
      n.setAttribute('sorted',v); n.sorted=v; n.listen('insert',function(e)
      {
         this.assort(this.sorted);
      });
   },



   style:function(v,n,a)
   {
      if(!isKnob(v)){return}; n.setStyle(v);
      return TRUE;
   },



   canFocus:function(v,n,a)
   {
      if((v==TRUE)||(v=='yes')||(v==1)){v=1}else{v=0}; if(!v){return};
      n.setAttribute('tabindex',-1); n.tabindex=-1; return TRUE;
   },



   format:function(v,n,a,c)
   {
      if(v==`markdown`){c=c.split(`\n`); c.forEach((t,l)=>{c[l]=trim(t)}); c=c.join(`\n`);};
      n.listen('ready',()=>
      {
         parsed(c,v,(r)=>{n.innerHTML=''; n.textContent=''; n.insert(r)});
      });
      return TRUE;
   },



   editLock:function(v,n,a,c, r)
   {
      delete a.readOnly; delete a.readonly; r='readonly'; n.enbool(r); if(!v){return TRUE}; // editLock is just locked
      if(!a.class){a.class=''}; a.class=a.class.split(' '); radd(a.class,'editLock'); a.class=a.class.join(' ');

      n.listen('keydown,keyup,mouseover,mouseout,click'.split(','),function(e)
      {
         let s=e.signal; let o=(!this.readonly);
         if(o&&(s=='Enter')){this.enbool(r); this.declan('editLockOpen'); this.blur(); return}; // done
         if(o){return}; // open, only `Enter` (above line) will lock it now .. else just leave it open .. lockpicker's choice
         if(s=='MouseOver'){this.focus();return}; // locked .. focus on it when pointed at in order to listen `on-key` events
         if(s=='MouseOut'){this.blur();return}; // locked .. not interested in unlocking now
         if((e.type=='keydown')&&(s=='Control')){this.enclan('editLockFeel');return}; // locked .. checking if it can be unlocked
         if((e.type=='keyup')&&(s=='Control')){this.declan('editLockFeel');return}; // locked .. not interested in unlocking now
         if(s=='Control LeftClick'){this.debool(r); this.declan('editLockFeel'); this.enclan('editLockOpen');}; // unlocked
      });
   },
});
