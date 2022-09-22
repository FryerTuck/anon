

select('#DrawToolPanl').insert
([
   {butn:'#DrawButnMakeRect .AnonToolButn', icon:'checkbox-unchecked', title:'rectangle ~ detail', onclick:function(){Anon.Draw.tool.makeRect()}},
   {butn:'#DrawButnMakeElip .AnonToolButn', icon:'radio-unchecked', title:'ellipse ~ detail', onclick:function(){Anon.Draw.tool.makeElip()}},

   {butn:'#DrawButnMakeLine .AnonToolButn', icon:'opt', title:'line ~ detail', onclick:function(){Anon.Draw.tool.makeLine()}},
   {butn:'#DrawButnMakeText .AnonToolButn', icon:'star-empty', title:'polygon ~ detail', onclick:function(){Anon.Draw.tool.makePoly()}},

   {butn:'#DrawButnMakeText .AnonToolButn', icon:'text-color', title:'text ~ detail', onclick:function(){Anon.Draw.tool.makeText()}},
   {butn:'#DrawButnMakeText .AnonToolButn', icon:'sphere', title:'mesh ~ detail', onclick:function(){Anon.Draw.tool.makeMesh()}},

   {div:'.panlHorzLine', contents:[{hdiv:''}]},

   {butn:'#DrawButnMakeText .AnonToolButn', title:'stencil-inside ~ detail', contents:[{icon:'scissors@180'}],
      onclick:function(){Anon.Draw.tool.cutBelow(O)
   }},
   {butn:'#DrawButnMakeText .AnonToolButn', title:'stencil-outside ~ detail', contents:[{icon:'scissors'}],
      onclick:function(){Anon.Draw.tool.cutBelow(I)
   }},

   {div:'.panlHorzLine', contents:[{hdiv:''}]},
]);


select('#DrawPropItem').insert
([
   {grid:
   [
      {row:
      [
         {col:'.tiny', contents:
         [
            {div:'#DrawPropItemName .cntrChld', style:{padding:6,whiteSpace:'nowrap'}, contents:'undefined'},
         ]},
      ]},
      {row:
      [
         {col:'.tiny', contents:[{wrap:'#DrawPropItemAttr', style:{padding:6}, contents:
         [
            {div:'', style:{padding:2}, contents:[{input:'#DrawPropItemPosi .toolTextFeed .dark', icon:'location', demo:'0 x 0',
               title:'location (X,Y)', value:'', listen:{'key:Enter':function(e)
               {let v=argToObj(this.value,{x:'numr',y:'numr'}); if(v){Anon.Draw.edit('position',v)}}}
            }]},


            {div:'', style:{padding:2}, contents:[{input:'#DrawPropItemRota .toolTextFeed .dark', icon:'spinner11', demo:'0',
               title:'rotation (deg)', value:'', listen:{'key:Enter':function(e)
               {let v=argval(this.value); if(isNumr(v)){Anon.Draw.edit('rotation',v)}}}
            }]},


            {div:'', style:{padding:2}, contents:[{input:'#DrawPropItemScal .toolTextFeed .dark', icon:'versions', demo:'0 x 0',
               title:'scale (X,Y)', value:'', listen:{'key:Enter':function(e)
               {let v=argToObj(this.value,{x:'numr',y:'numr'}); if(v){Anon.Draw.edit('scale',v)}}}
            }]},


            {div:'', style:{padding:2}, contents:[{input:'#DrawPropItemSkew .toolTextFeed .dark', icon:'diamonds@60', demo:'0 x 0',
               title:'skew (X,Y)', value:'', listen:{'key:Enter':function(e)
               {let v=argToObj(this.value,{x:'numr',y:'numr'}); if(v){Anon.Draw.edit('skew',v)}}}
            }]},


            {div:'', style:{padding:2}, contents:[{input:'#DrawPropItemSize .toolTextFeed .dark', icon:'enlarge', demo:'0 x 0',
               title:'size (W,H)', value:'', listen:{'key:Enter':function(e)
               {
                  let v=argToObj(this.value,{width:'numr',height:'numr'}); if(v){Anon.Draw.edit('size',v)};
                  // dump(v);
               }}
            }]},


            {div:'', style:{padding:2}, contents:[{input:'#DrawPropItemCrop .toolTextFeed .dark', icon:'crop', demo:'0 x 0',
               title:'crop (W,H)', value:'', listen:{'key:Enter':function(e)
               {
                  let v=argToObj(this.value,{width:'numr',height:'numr'}); if(!v){return};
                  let s=dupe(v); v.x=0; v.y=0; Anon.Draw.edit('clip',v); tick.after(10,()=>{Anon.Draw.edit('size',s)});
               }}
            }]},


            {div:'', style:{padding:2}, contents:[{input:'#DrawPropItemFill .toolTextFeed .dark', icon:'paint-format', demo:'sol:1^0 #BadA5588',
               title:'fill (style:size^angle color1+color2)', value:'',

               prep:function()
               {
                  let d,r,o,p,l,f,a,s; d=this.value.trim();  d=swap(d,['   ','  '],' '); d=swap(d,['#',';'],''); r=['sol',1,0,['BadA5588']];
                  let c=rgbTxt(d); if(c){r[3][0]=hexTxt(c)}; o=['sol','lin','rad']; p=stub(d,' '); if(!p){return r}; f=p[0]; l=p[2].split('+');
                  r[3]=l; if((l.length>1)){f=swap(f,'sol','lin')}; if(isin(o,f)){r[0]=f; return r}; p=stub(f,':'); if(!p){return r};
                  f=pick(f,o); p=stub(p[2],'^'); if(!f||!p){return r}; a=(p[0]*1); s=(p[2]*1); if(!isNumr(a)||!isNumr(s)){return r};
                  return [f,a,s,l];
               },

               pres:function(a){this.value=`${a[0]}:${a[1]}^${a[2]} ${a[3].join('+')}`;},

               indxOf:function(r)
               {
                  dump('indx modda uka');
               },


               paint:function()
               {
                  let i,v,l,e,d; i=Anon.Draw.vars.actv; v=i.vars; l=v.flayer; e=v.active; d=this.prep();
                  let f,s,a,c,o; f=d[0]; s=d[1]; a=d[2]; c=d[3]; e.fg.fill(null); let ea=e.fg.attrs;

                  if(f=='sol'){e.fg.fill(rgbTxt(c[0])); l.batchDraw(); return};

                  if(f=='pat')
                  {
                     e.fg.fill(null);
                     dump(c);
                     l.batchDraw(); return;
                  };

                  let b,p,z,x,q; b={width:e.attrs.clipWidth,height:e.attrs.clipHeight}; s/=6; p=rectAnglPlot(b,a,s); z=c.last(1);
                  let m={}; q=[]; s=(1/z); x=0; c.forEach((h,k)=>{if(k==z){x=1}; q.radd(x); q.radd(rgbTxt(h)); x=round((x+s),3)});
                  let r=(((ea.width>ea.height)?ea.width:ea.height)*d[1]); m.x=(ea.width/2); m.y=(ea.height/2);

                  if(f=='lin')
                  {
                     e.fg.fill(null);
                     e.fg.fillLinearGradientStartPoint(p.bgn); e.fg.fillLinearGradientEndPoint(p.end);
                     e.fg.fillLinearGradientColorStops(q); l.batchDraw(); return;
                  };

                  if(f=='rad')
                  {
                     e.fg.fill(null);
                     e.fg.fillRadialGradientStartPoint(m); e.fg.fillRadialGradientEndPoint(m); e.fg.fillRadialGradientStartRadius(0);
                     e.fg.fillRadialGradientEndRadius(r); e.fg.fillRadialGradientColorStops(q); l.batchDraw(); return;
                  };
               },

               listen:
               {
                  'RightClick':function()
                  {
                     let sc,si,bx; sc=this.getSelection(); if(sc){sc=rgbTxt(sc)}; if(sc){si=this.indxOf(this.getSelection(1));};
                     let va,sw,ga; va=this.prep(); if(!si){si=(va[3].length-1); sc=rgbTxt(va[3][si])}; this.indx=si;
                     sw=round((va[1]/10),3); ga=va[2]; this.pres(va); bx=popColor(this,DARK,sc,sw,ga);

                     bx.listen('change',function(e)
                     {
                        let va,ed,ti; va=this.target.prep(); ed=e.detail; ti=this.target.indx; if(ed.colr){va[3][ti]=ltrim(ed.colr,'#')};
                        if(ed.scal){va[1]=round((ed.scal*10),3)}; if(ed.angl){va[2]=ed.angl}; this.target.pres(va); this.target.paint();
                     });

                     bx.listen('close',function(e){this.target.indx=VOID});
                  },

                  'key:Enter':function(e)
                  {
                     this.paint();
                  },
               }
            }]},


            {div:'', style:{padding:2}, contents:[{input:'#DrawPropItemStrk .toolTextFeed .dark', icon:'pencil', demo:'sol:1^0 #BadA5588',
               title:'stroke (style:size^angle color1+color2)', value:'',

               prep:function()
               {
                  let d,r,o,p,l,f,a,s; d=this.value.trim();  d=swap(d,['   ','  '],' '); d=swap(d,['#',';'],''); r=['sol',1,0,['000000ff']];
                  let c=rgbTxt(d); if(c){r[3][0]=hexTxt(c)}; o=['sol','lin','rad']; p=stub(d,' '); if(!p){return r}; f=p[0]; l=p[2].split('+');
                  r[3]=l; if((l.length>1)){f=swap(f,'sol','lin')}; if(isin(o,f)){r[0]=f; return r}; p=stub(f,':'); if(!p){return r};
                  f=pick(f,o); p=stub(p[2],'^'); if(!f||!p){return r}; a=(p[0]*1); s=(p[2]*1); if(!isNumr(a)||!isNumr(s)){return r};
                  return [f,a,s,l];
               },

               pres:function(a){this.value=`${a[0]}:${a[1]}^${a[2]} ${a[3].join('+')}`;},

               indxOf:function(r)
               {
                  dump('indx modda uka');
               },

               paint:function()
               {
                  let i,v,l,e,d; i=Anon.Draw.vars.actv; v=i.vars; l=v.flayer; e=v.active; d=this.prep();
                  let f,s,a,c,o; f=d[0]; s=d[1]; a=d[2]; c=d[3]; o=(e.fg.strokeWidth()||0); let b=((e.fg.shadowBlur()||0)*3);

                  if(s!=o){let y=[(e.fg.width()+o+b),(e.fg.height()+o+b)]; e.fg.strokeWidth(s); l.batchDraw(); Anon.Draw.grow(y);};
                  if(f=='sol'){e.fg.stroke(rgbTxt(c[0])); l.batchDraw(); return;};

                  let p,z,x,q; b={width:e.attrs.clipWidth,height:e.attrs.clipHeight}; s/=6; p=rectAnglPlot(b,a,s); z=c.last(1);
                  q=[]; s=(1/z); x=0; c.forEach((h,k)=>{if(k==z){x=1}; q.radd(x); q.radd(rgbTxt(h)); x=round((x+s),3)});
                  e.fg.stroke(null);

                  if(f=='lin')
                  {
                     e.fg.strokeLinearGradientStartPoint(p.bgn); e.fg.strokeLinearGradientEndPoint(p.end);
                     e.fg.strokeLinearGradientColorStops(q); l.batchDraw(); return;
                  };

                  if(f=='rad')
                  {
                     dump('TODO :: stroke radial gradient');
                  };

                  l.batchDraw();
               },

               listen:
               {
                  'RightClick':function()
                  {
                     let sc,si,bx; sc=this.getSelection(); if(sc){sc=rgbTxt(sc)}; if(sc){si=this.indxOf(this.getSelection(1));};
                     let va,sw,ga; va=this.prep(); if(!si){si=(va[3].length-1); sc=rgbTxt(va[3][si])}; this.indx=si;
                     sw=round((va[1]/50),3); ga=va[2]; this.pres(va); bx=popColor(this,DARK,sc,sw,ga);

                     bx.listen('change',function(e)
                     {
                        let va,ed,ti; va=this.target.prep(); ed=e.detail; ti=this.target.indx; if(ed.colr){va[3][ti]=ltrim(ed.colr,'#')};
                        if(ed.scal){va[1]=round((ed.scal*50),3)}; if(ed.angl){va[2]=ed.angl}; this.target.pres(va); this.target.paint();
                     });

                     bx.listen('close',function(e){this.target.indx=VOID});
                  },

                  'key:Enter':function(e)
                  {
                     this.paint();
                  }
               }
            }]},


            {div:'', style:{padding:2}, contents:[{input:'#DrawPropItemGlow .toolTextFeed .dark', icon:'sun1', demo:'0 0 9 #BadA5588',
               title:'glow (x y blur color)', value:'',

               prep:function( v,p,x,y,b,c)
               {
                  v=this.value.trim(); if(!v){return}; v=swap(this.value,['   ','  '],' '); p=stub(v,' '); if(!p){return};
                  x=(p[0]*1); p=stub(p[2],' '); if(!isNumr(x)||!p){return}; y=(p[0]*1); p=stub(p[2],' '); if(!isNumr(y)||!p){return};
                  b=(p[0]*1); c=ltrim((hexTxt(swap(p[2],' ',''))),'#'); if(!isNumr(b)||(!isText(c,8,8))){return};
                  v=[x,y,b,c]; this.value=v.join(' '); return v;
               },

               paint:function()
               {
                  let i,v,l,e,d,x,y,b,c,w,s,q; i=Anon.Draw.vars.actv; v=i.vars; l=v.flayer; e=v.active.fg; d=this.prep();
                  if(!d){return}; x=d[0]; y=d[1]; b=d[2]; c=rgbTxt(d[3]); w=((e.shadowBlur()||0)*3); s=(e.strokeWidth()||0);
                  e.shadowOffset({x:x,y:y}); e.shadowBlur(b); e.shadowColor(c); l.batchDraw();
                  if(w!=b){q=[(e.width()+s+w),(e.height()+s+w)]; Anon.Draw.grow(q);};
               },

               listen:
               {
                  'RightClick':function()
                  {
                     let sc,va,bx; sc=this.getSelection(); if(sc){sc=rgbTxt(sc)};
                     va=this.prep(); if(!va){this.value=("0 0 9 "+(sc?rgb2hex(sc):"bada55ff")); va=this.prep(); this.paint()};
                     if(!sc){sc=rgbTxt(va[3])}; bx=popColor(this,DARK,sc,round((va[2]/50),3));

                     bx.listen('change',function(e)
                     {
                        let v,d,b,c; v=this.target.prep(); d=e.detail;
                        if(d.scal){v[2]=round((d.scal*50),0);}; if(d.colr){v[3]=d.colr;};
                        this.target.value=v.join(' '); this.target.paint();
                     });

                     // bx.listen('close',function(e){this.target.paint()});
                  },

                  'key:Enter':function(e)
                  {
                     this.paint();
                  }
               }
            }]},


            {div:'', style:{padding:2}, contents:[{input:'#DrawPropItemXarc .toolTextFeed .dark', icon:'flattr', demo:'0',
               title:'arc (TL TR BR BL)', value:'',
               paint:function(t,d)
               {
                  let l=Anon.Draw.vars.actv.vars.flayer; let e=Anon.Draw.vars.actv.vars.active;
                  if(t=='Arc')
                  {
                     if(d.length<2){this.paint(l,e,'Circle',d); return};
                     d[0]=(d[0]||0); d[1]=(d[1]||360); d[2]=(d[2]||60); d[3]=(d[3]||0);
                     if(d[0]<0){d[0]=(360-d[0])}; if(d[1]<0){d[1]=(360-d[1])};
                     e.fg.rotation(d[0]);
                     l.batchDraw(); return;
                  };

                  if(t=='Circle')
                  {
                     if(d.length>3){this.paint(l,e,'Arc',d); return};
                     let s,o; s=e.fg.strokeWidth(); o=[(e.fg.width()+s),(e.fg.height()+s)]; d[0]=(d[0]||60); e.fg.radius(d[0]);
                     l.batchDraw(); Anon.Draw.grow(o); return;
                  };

                  if(t=='Rect')
                  {
                     d[0]=(d[0]||0); d[1]=(d[1]||0); d[2]=(d[2]||0); d[3]=(d[3]||0);
                     e.fg.cornerRadius(d); l.batchDraw(); return;
                  };

                  if(t=='Text')
                  {
                      let sr,dr,dp,ts,td,bx,pd,bw,bh; dp=d[1].split(""); ts=dp[0]; td=dp[1]; pd=d[3];
                      sr={A:"normal",B:"bold",I:"italic"}; dr={A:"",L:"line-through",U:"underline"};
                      e.fg.fontFamily(d[0]); e.fg.fontStyle(sr[ts]); e.fg.textDecoration(dr[td]); 
                      e.fg.fontSize(d[2]); e.fg.padding(pd); l.draw(); bx=e.fg.getClientRect(); 
                      bw=(bx.width); bh=(bx.height); e.bg.setAttrs({width:bw,height:bh}); 
                      e.clipWidth(bw); e.clipHeight(bh); l.draw(); e.tf.forceUpdate(); l.batchDraw();
                  };
               },

               listen:{'key:Enter':function()
               {
                  let i,v,l,e,t,d,f; i=Anon.Draw.vars.actv; v=i.vars; l=v.flayer; e=v.active; t=(e.fg.className||e.fg.nodeType);
                  d=swap(swap(this.value.trim(),',',' '),['   ','  '],' ').trim(); if(!d){return}; d=d.split(' ');
                  d.forEach((x,k)=>{if(!isNaN(x)){x*=1}; if(!isNumr(x)&&((t!="Text")||((t=="Text")&&(k>1)))){f=1;return}; d[k]=x});
                  if((t=="Text")&&(span(d)<4)){f=1}; if((t=="Text")&&!isin("AA,AL,AU,BA,BL,BU,IA,IL,IU".split(","),d[1])){f=1}; 
                  if(f){this.notify(`invalid input`);return}; this.paint(t,d);
               }}
            }]},
         ]}]},
      ]},
      {row:[{col:'.panlHorzLine', contents:[{hdiv:''}]}]},
      {row:[{col:'', style:{paddingRight:14, paddingBottom:14}, contents:
      [
         {grid:[{row:[{col:
         [
            {textarea:'#DrawPropItemText .toolTextFeed .dark .hide', demo:"Text", listen:
            {
               keyup:function()
               {
                  let i,v,l,e,t,d,c,b; i=Anon.Draw.vars.actv; v=i.vars; l=v.flayer; e=v.active; d=this.value; e.fg.text(d);
                  l.draw(); b=e.fg.getClientRect(); e.bg.setAttrs({width:b.width,height:b.height}); 
                  e.clipWidth(b.width); e.clipHeight(b.height); e.tf.forceUpdate(); l.draw();
               },
            }},
         ]}]}]},
      ]}]},
   ]}
]);



extend(Anon.Draw.tool)
({
   pickItem:function(pi)
   {
      let ai,ci,ip; ai=Anon.Draw.vars.actv; ci=ai.vars.canvas; if(!pi.anon){pi.anon={}};
      let nt,na,nc; nt=(pi.fg.className||pi.fg.nodeType); na=pi.attrs; nc=select('#DrawPropItemAttr');
      let av=pi.anon; Anon.Draw.vars.actv.vars.active=pi; delete nc.target; nc.target={layr:ai.vars.flayer,item:pi};
      select('#DrawPropFiltWrap').reclan('hide:show'); select('#DrawPropFiltWrap').reclan('hide:show');
      select('#DrawPropFiltType').innerHTML=nt; select('#DrawPropItemText').reclan('show:hide');
      select('#DrawPropTabr').driver.select('Detail');
      select('#DrawPropItemName').innerHTML=pi.nick;
      let sz=pi.size(); if(!sz.width){sz={width:na.clipWidth,height:na.clipHeight};};
      let fa=pi.fg.attrs; let iv={}; let rc=(fa.cornerRadius||[]);
      if(rc.length>0){rc[0]=(rc[0]||0); rc[1]=(rc[1]||0); rc[2]=(rc[2]||0); rc[3]=(rc[3]||0);}; rc=rc.join(' ').trim();

      iv.Posi=`${round(na.x,4)} x ${round(na.y,4)}`;
      iv.Rota=`${round((na.rotation||0),4)}`;
      iv.Scal=`${round((na.scaleX||0),4)} x ${round((na.scaleY||0),4)}`;
      iv.Skew=`${round((na.skewX||0),4)} x ${round((na.skewY||0),4)}`;
      iv.Size=`${round(sz.width,4)} x ${round(sz.height,4)}`;
      iv.Crop=`${Math.floor(na.clipWidth)} x ${Math.floor(na.clipHeight)}`;
      iv.Fill=(av.fill||(!fa.fill?"":`sol:1^0 ${rgb2hex(fa.fill)}`));
      iv.Strk=(av.strk||(!fa.stroke?"":`sol:${(fa.strokeWidth||0)}^0 ${rgb2hex(fa.stroke)}`));
      iv.Xarc=((nt=='Circle')?fa.radius:((nt=='Arc')?`${fa.outerRadius} ${(fa.innerRadius||0)}`:rc));
      iv.Glow=([fa.shadowOffsetX,fa.shadowOffsetY,fa.shadowBlur,(fa.shadowColor?rgb2hex(fa.shadowColor):'')]).join(' ').trim();
      iv.Text=fa.text;

      if(nt=="Text")
      {
          let ts,td; ts=upperCase((fa.fontStyle||"a").slice(0,1)); td=upperCase((fa.textDecoration||"a").slice(0,1)); 
          if(ts=="N"){ts="A"}; iv.Xarc=`${fa.fontFamily} ${ts}${td} ${fa.fontSize} ${fa.padding}`;
      };

      iv.each((xv,xk)=>{select(`#DrawPropItem${xk}`).value=xv});
      this[nt](select('#DrawPropItemAttr'),pi,na);
   }
   .bind
   ({
      Image:function(h,n,a)
      {
         // dump(a);
      },

      Rect:function(a)
      {
         select('#DrawPropItemXarc').title=`cornerRadius (TL TR BR BL)`;
         select('#DrawPropItemXarc').modify({demo:'60 0 60 0'});
      },

      Arc:function(a)
      {
         select('#DrawPropItemXarc').title=`arc (beginAngle endAngle outerRadius innerRadius) .. 1 val = circle`;
         select('#DrawPropItemXarc').modify({demo:'30 330 60 0'});
      },

      Circle:function(a)
      {
         select('#DrawPropItemXarc').title=`cirle (radius) .. 4 vals = arc`;
         select('#DrawPropItemXarc').modify({demo:'60'});
      },

      Text:function(a)
      {
         select('#DrawPropItemXarc').title=`Font StyleDecor Size Padding`;
         select('#DrawPropItemXarc').modify({demo:'Calibri AA 30 0'});
         select('#DrawPropItemText').reclan("hide:show");
      },
   }),


   makeRect:function()
   {
      let ai,ci,fl; ai=Anon.Draw.vars.actv; ci=ai.vars.canvas; fl=ai.vars.flayer;
      let ao=Anon.Draw.make
      ({
         type:'Rect',
         width: 180,
         height: 120,
      });
   },


   makeElip:function()
   {
      let ai,ci,fl,ra; ai=Anon.Draw.vars.actv; ci=ai.vars.canvas; fl=ai.vars.flayer;
      let ao=Anon.Draw.make
      ({
         type:'Circle',
         radius:60,
         // type:'Arc',
         // angle:360,
         // // clockwise:true,
         // rotation:180,
         // outerRadius:60,
      });
   },


   makeLine:function()
   {
      let ai,ci,fl; ai=Anon.Draw.vars.actv; ci=ai.vars.canvas; fl=ai.vars.flayer;
      let ao=Anon.Draw.make
      ({
         type:'Rect',
      });
   },


   makeText:function()
   {
      let ai,ci,fl,bx; ai=Anon.Draw.vars.actv; ci=ai.vars.canvas; fl=ai.vars.flayer;
      let gc,bg,fg,tf; gc=Anon.Draw.fumb(new Konva.Group({x:20,y:20,clip:{x:0,y:0,width:6,height:6}}));
      bg=(new Konva.Rect({width:6,height:6})); fg=(new Konva.Text({fontSize:30,fontFamily:'Calibri',text:'Text',padding:0}));
      gc.add(bg); gc.add(fg); gc.bg=bg; gc.fg=fg; fl.add(gc); fl.draw(); bx=gc.fg.getClientRect(); 
      gc.bg.setAttrs({width:bx.width,height:bx.height}); gc.clipWidth(bx.width); gc.clipHeight(bx.height);
      tf=Anon.Draw.fidl(); fl.add(tf); tf.attachTo(gc); gc.tf=tf; fl.draw(); select('#DrawBodyPanl').signal('pickItem',gc);
   },
});



select('#DrawBodyPanl').listen(['pickItem','editItem'],function(e)
{
   Anon.Draw.tool.pickItem(e.detail);
});
