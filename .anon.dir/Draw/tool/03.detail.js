

select('#DrawToolPanl').insert
([
   {butn:'#DrawButnMakeRect .AnonToolButn', icon:'checkbox-unchecked', title:'rectangle ~ detail', onclick:function(){Anon.Draw.tool.makeRect()}},
   {butn:'#DrawButnMakeElip .AnonToolButn', icon:'radio-unchecked', title:'ellipse ~ detail', onclick:function(){Anon.Draw.tool.makeElip()}},

   {butn:'#DrawButnMakeLine .AnonToolButn', icon:'opt', title:'line ~ detail', onclick:function(){Anon.Draw.tool.makeLine()}},
   {butn:'#DrawButnMakeText .AnonToolButn', icon:'star-empty', title:'polygon ~ detail', onclick:function(){Anon.Draw.tool.makePoly()}},

   {butn:'#DrawButnMakeText .AnonToolButn', icon:'text-color', title:'text ~ detail', onclick:function(){Anon.Draw.tool.makeText()}},
   {butn:'#DrawButnMakeText .AnonToolButn', icon:'sphere', title:'mesh ~ detail', onclick:function(){Anon.Draw.tool.makeMesh()}},

   {div:'.panlHorzLine', contents:[{hdiv:''}]},

   {butn:'#DrawButnMakeText .AnonToolButn', title:'stencil-inside ~ detail', contents:[{icon:'.flipVert', face:'scissors'}],
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
         {col:[{wrap:'#DrawPropItemAttr', style:{padding:6}}]},
      ]},
   ]}
]);



extend(Anon.Draw.tool)
({
   pickItem:function(pi)
   {
      let ai,ci,ip; ai=Anon.Draw.vars.actv; ci=ai.vars.canvas; if(!pi.anon){pi.anon={}};
      let nt,na,nc; nt=(pi.fg.className||pi.fg.nodeType); na=pi.attrs; nc=select('#DrawPropItemAttr');
      let av=pi.anon; Anon.Draw.vars.actv.vars.active=pi; delete nc.target; nc.target={layr:ai.vars.flayer,item:pi};
      select('#DrawPropFiltWrap').reclan('hide:show');
      select('#DrawPropFiltType').innerHTML=nt; select('#DrawPropFiltName').innerHTML=pi.nick;
      select('#DrawPropTabr').driver.select('Detail');
      select('#DrawPropItemName').innerHTML=pi.nick; nc.innerHTML='';
      let sz=pi.size(); if(!sz.width){sz={width:na.clipWidth,height:na.clipHeight};};

      nc.insert
      ([
         {div:'', style:{padding:2}, contents:[{input:'#DrawPropItemPosi .toolTextFeed .dark', icon:'location', demo:'0 x 0',
            title:'location (X,Y)', value:`${round(na.x,4)} x ${round(na.y,4)}`, listen:{'key:Enter':function(e)
            {let v=argToObj(this.value,{x:'numr',y:'numr'}); if(v){Anon.Draw.edit('position',v)}}}
         }]},
         {div:'', style:{padding:2}, contents:[{input:'#DrawPropItemRota .toolTextFeed .dark', icon:'spinner11', demo:'0',
            title:'rotation (deg)', value:`${round((na.rotation||0),4)}`, listen:{'key:Enter':function(e)
            {let v=argval(this.value); if(isNumr(v)){Anon.Draw.edit('rotation',v)}}}
         }]},
         {div:'', style:{padding:2}, contents:[{input:'#DrawPropItemScal .toolTextFeed .dark', icon:'versions', demo:'0 x 0',
            title:'scale (X,Y)', value:`${round((na.scaleX||0),4)} x ${round((na.scaleY||0),4)}`, listen:{'key:Enter':function(e)
            {let v=argToObj(this.value,{x:'numr',y:'numr'}); if(v){Anon.Draw.edit('scale',v)}}}
         }]},
         {div:'', style:{padding:2}, contents:[{input:'#DrawPropItemSkew .toolTextFeed .dark', icon:'italic1', demo:'0 x 0',
            title:'skew (X,Y)', value:`${round((na.skewX||0),4)} x ${round((na.skewY||0),4)}`, listen:{'key:Enter':function(e)
            {let v=argToObj(this.value,{x:'numr',y:'numr'}); if(v){Anon.Draw.edit('skew',v)}}}
         }]},
         {div:'', style:{padding:2}, contents:[{input:'#DrawPropItemSize .toolTextFeed .dark', icon:'enlarge', demo:'0 x 0',
            title:'size (W,H)', value:`${round(sz.width,4)} x ${round(sz.height,4)}`, listen:{'key:Enter':function(e)
            {
               let v=argToObj(this.value,{width:'numr',height:'numr'}); if(v){Anon.Draw.edit('size',v)};
               // dump(v);
            }}
         }]},
         {div:'', style:{padding:2}, contents:[{input:'#DrawPropItemCrop .toolTextFeed .dark', icon:'crop', demo:'0 x 0',
            title:'crop (W,H)', value:`${Math.floor(na.clipWidth)} x ${Math.floor(na.clipHeight)}`, listen:{'key:Enter':function(e)
            {
               let v=argToObj(this.value,{width:'numr',height:'numr'}); if(!v){return};
               let s=dupe(v); v.x=0; v.y=0; Anon.Draw.edit('clip',v); tick.after(10,()=>{Anon.Draw.edit('size',s)});
            }}
         }]},
         {div:'', style:{padding:2}, contents:[{input:'#DrawPropItemFill .toolTextFeed .dark', icon:'paint-format', demo:'#BadA5588',
            title:'fill (hex|rgb|hsl|hsv)', value:`${(av.fill||'')}`,

            paint:function(c)
            {
               let d,s,p,f,l,x,a,v; d=this.value.trim(); if(!d&&!c){return}; d=swap(d,['#',';'],''); if(c&&d.endsWith('+')){d+=c};
               let q=['sol','rad','lin']; s=stub(d,' '); if(s&&isin(s[0],q)){f=s[0]; l=s[2]}else{f='?'; l=d}; l=swap(l,' ','');
               if(isin(l,q)){f=l;l=''}else if(!isin(f,q)){f=(isin(l,'+')?'lin:0^1':'sol')}; if((l.length<3)&&!c){this.value=''; return};
               if(c){c=ltrim(c,'#')}; l=((c&&!l)?[c]:l.split('+'));  if((l.length>1)&&(f=='sol')){f='lin:0^1'}else if(l.length<2){f='sol'};
               l.forEach((i,k)=>{l[k]=ltrim(hexTxt(i,1),'#')});  s=(this.getSelection()||l.last()); x=l.indexOf(s);
               if(c){l[x]=c}; a=l[x]; v=l.join('+').trim(); this.value=`${f} ${v}`; d=this.value;
               Anon.Draw.vars.actv.vars.active.anon.fill=d; if(l.length<2){Anon.Draw.edit('fill',rgbTxt(l[0]),0);return};

               p=stub(f,':'); if(!p){return}; f=p[0]; p=stub(p[2],'^'); if(!p){return}; a=(p[0]*1); s=(p[2]*1); if(isNaN(a)||isNaN(s)){return};
               let ae,bx,gp,cs,si,sx,li; ae=Anon.Draw.vars.actv.vars.active; if(!ae){return}; bx=ae.size();
               if(!bx.width){bx={width:ae.attrs.clipWidth,height:ae.attrs.clipHeight};}; gp=rectAnglPlot(bx,a,s); li=(l.length-1);
               cs=[]; si=(1/(l.length-1)); sx=0; l.forEach((i,k)=>{if(k==li){sx=1}; cs.radd(sx); cs.radd(rgbTxt(i)); sx=round((sx+si),3)});

               if(f=='lin')
               {
                  ae.fg.fill(null);
                  ae.fg.fillLinearGradientStartPoint(gp.bgn);
                  ae.fg.fillLinearGradientEndPoint(gp.end);
                  ae.fg.fillLinearGradientColorStops(cs);
                  Anon.Draw.vars.actv.vars.flayer.draw();
                  return;
               };

               if(f=='rad')
               {
                  dump('TODO :: radial fill');
               };
            },

            listen:
            {
               'RightClick':function()
               {
                  let sr,ev,vp,fs,gr,gs,cl,si,sc,bx; sr=this.getSelection(1); ev=this.value; vp=stub(ev,' ');  if(vp){fs=vp[0]; cl=vp[2]};
                  if(sr&&vp&&isin(cl,' ')){this.notify(`extra space wastes the selection index`);return};
                  sc=this.getSelection(); if(sc){sc=rgbTxt(sc)}else{sc=VOID};
                  if(fs&&isin(fs,'^')){vp=stub(fs,':'); fs=vp[0]; vp=stub(vp[2],'^'); gr=(vp[0]*1); gs=(vp[2]*1);};
                  if(!isNumr(gr)){gr=0}; if(!isNumr(gs)){gs=1};
                  if(cl){cl=cl.split('+'); if(!sc){sc=rgbTxt(cl.pop())}};

                  bx=popColor(this,DARK,sc,gr,gs);

                  bx.listen('change',function(e)
                  {
                     let d=e.detail; if(d.colr){this.target.paint(d.colr);return};
                     let v,p,f,a,s,l; v=this.target.value; p=stub(v,' '); l=p[2]; p=stub(p[0],':');
                     if(!p){return}; f=p[0]; p=stub(p[2],'^'); if(!p){return}; a=p[0]; s=p[2];
                     if(d.angl!=VOID){a=d.angl;}; if(d.scal!=VOID){s=d.scal;};
                     this.target.value=`${f}:${a}^${s} ${l}`; this.target.paint();
                  });

                  bx.listen('close',function(e){this.target.paint()});
               },

               'key:Enter':function(e)
               {
                  this.paint();
               },
            }
         }]},

         {div:'', style:{padding:2}, contents:[{input:'#DrawPropItemStrk .toolTextFeed .dark', icon:'pencil', demo:'1 solid #BadA5588',
            title:'stroke (width type color)', value:``, listen:{'key:Enter':function(e)
            {
               dump(this.value);
               // Anon.Draw.edit('stroke',v);
            }}
         }]},

         {div:'.panlHorzLine', contents:[{hdiv:''}]},
      ]);

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
         // dump(a);
      },
   }),


   makeRect:function()
   {
      let ai,ci,fl; ai=Anon.Draw.vars.actv; ci=ai.vars.canvas; fl=ai.vars.flayer;
      let ao=Anon.Draw.make
      ({
         type:'Rect',
         x: 10,
         y: 10,
         width: 180,
         height: 120,
         stroke: '#000',
         fill: 'rgba(255,255,255,0.5)',
         cornerRadius: 10,
      });
   },


   makeElip:function()
   {
      let ai,ci,fl; ai=Anon.Draw.vars.actv; ci=ai.vars.canvas; fl=ai.vars.flayer;
      let ao=Anon.Draw.make
      ({
         type:'Rect',
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
      let ai,ci,fl; ai=Anon.Draw.vars.actv; ci=ai.vars.canvas; fl=ai.vars.flayer;
      let ao=Anon.Draw.make
      ({
         type:'Rect',
      });
   },
});



select('#DrawBodyPanl').listen(['pickItem','editItem'],function(e)
{
   Anon.Draw.tool.pickItem(e.detail);
});
