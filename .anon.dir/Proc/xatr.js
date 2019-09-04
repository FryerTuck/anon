extend(custom.attrib)
({
   src:function(v,n,a, r)
   {r=(isPath(v)?r=(v+'?n='+nodeName(n)):(v+'')); n.setAttribute('src',r); n.src=r; return TRUE;},

   href:function(v,n,a, r)
   {r=(isPath(v)?r=(v+'?n='+nodeName(n)):(v+'')); n.setAttribute('href',r); n.src=r; return TRUE;},

   data:function(v,n,a, r)
   {r=(isPath(v)?r=(v+'?n='+nodeName(n)):(v+'')); n.setAttribute('data',r); n.src=r; return TRUE;},



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
         },false);

         n.addEventListener('drag',function(e)
         {
            let fv,tn,ar,lp,cx,cy,ox,oy,lx,ly,ow,oh,ax,mx,my,mv,pd,bd,cw,ch,nw,nh; fv=this.flxVrs; tn=fv.trgt; ar=fv.arro; lp=fv.lpos;
            cx=cursor.posx; cy=cursor.posy; ox=fv.opos[0]; oy=fv.opos[1]; lx=lp[0]; ly=lp[1]; ow=fv.odim[0]; oh=fv.odim[1];
            ax=fv.axis; mx=(ax==X); my=(ax==Y); if(cx===lx){mx=VOID;}; if(cy===ly){my=VOID;};
            if((ax==X)&&!mx){return}; if((ax==Y)&&!my){return}; mv=(mx?((cx<lx)?L:R):((cy<ly)?U:D));
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
         document.body.appendChild(this); cursor.bind(this,d.x,d.y); this.signal('grablift',{origin:this.myorigin,target:this.myorigin});
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
      n.listen('ready',()=>
      {
         parsed(c,v,(r)=>{n.innerHTML=''; n.textContent=''; n.insert(r)});
      });
      return TRUE;
   },
});
