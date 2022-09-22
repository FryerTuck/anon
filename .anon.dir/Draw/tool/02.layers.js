

select('#DrawPropLayr').insert
([
   {grid:
   [
      {row:[{col:'.tiny', contents:[{grid:[{row:
      [
         {col:'.midlChld', contents:[{input:'#DrawPropLayrMake .toolTextFeed .dark', demo:'newLayer', listen:
            {'key:Enter':function(){Anon.Draw.tool.layrMake(this)}}
         }]},
         {col:'.midlChld', contents:[{butn:'.dark .toolButnTiny .icon-plus', onclick:function()
            {Anon.Draw.tool.layrMake(this.select('^ < input')[0])}
         }]},
      ]}]}]}]},
      {row:[{col:'.panlHorzLine', contents:[{hdiv:''}]}]},
      {row:[{col:'#DrawPropLayrWrap', contents:[{panl:'#DrawPropLayrView .cntrChld', contents:[{tiny:'no layers'}]}]}]},
      {row:[{col:'.panlHorzLine', contents:[{hdiv:''}]}]},
      {row:
      [
         {col:'#DrawPropLayrActv .tiny', contents:
         [
            {div:'#DrawPropLayrName .cntrChld', style:{padding:6,whiteSpace:'nowrap'}, contents:'undefined'},
            {div:'#DrawPropLayrBtns', style:{marginTop:6,marginBottom:6}, contents:
            [
               {butn:'.dark .toolButnTiny .icon-eye1', name:'hide', onclick:function(){Anon.Draw.tool.layrTogl('hide')}},
               {butn:'.dark .toolButnTiny .icon-lock1', name:'lock', onclick:function(){Anon.Draw.tool.layrTogl('lock')}},
               {butn:'.dark .toolButnTiny .icon-chevron-up', name:'mvup', onclick:function(){Anon.Draw.tool.layrShft('up')}},
               {butn:'.dark .toolButnTiny .icon-chevron-down', name:'mvdn', onclick:function(){Anon.Draw.tool.layrShft('dn')}},
               {butn:'.dark .toolButnTiny .icon-copy', name:'copy', onclick:function(){Anon.Draw.tool.layrCopy()}},
               {butn:'.dark .toolButnTiny .icon-screen-normal', name:'span', onclick:function(){Anon.Draw.tool.layrSpan()}},
               {butn:'.dark .toolButnTiny .icon-download2', name:'mrge', onclick:function(){Anon.Draw.tool.layrMrgd()}},
               {butn:'.dark .toolButnTiny .icon-cross', name:'void', onclick:function(){Anon.Draw.tool.layrVoid()}},
            ]},
         ]},
      ]},
   ]}
]);




extend(Anon.Draw.tool)
({
   layrNick:function(n)
   {
      if(isText(n)){n=trim(n);}; if(!isText(n,1)){n='newLayer'}; let s,l,i,r;
      l=select(`#DrawPropLayrView grid[name="${n}"]`); if(!l){return n}; s=rstub(n,'0123456789'.split(''));
      if(s&&isNaN((s[0]*1))){i=`${s[1]}${s[2]}`; i=(i*1); i++; n=`${s[0]}${i}`;}else{n=`${n}1`};
      r=this.layrNick(n); return r;
   },


   layrMake:function(n)
   {
      if(isText(n)){let q=n.split('/').pop(); q=swap(((rstub(q,'.')||[q])[0]),'.','_'); q=swap(q,'-','_'); n=select('#DrawPropLayrMake'); n.value=q};
      let v,b; v=trim(n.value); b=rectOf(n); if(!v){v=this.layrNick()};
      if(!isWord(v)){select('#DrawPropTabr').driver.select('Layers'); n.notify('invalid layer name',NEED,TL,[0,(b.height+6)]); return};
      v=this.layrNick(v); let inst=Anon.Draw.vars.actv; let face=inst.vars.canvas;
      let fnd = face.find('Transformer');  if(!!fnd && isFunc(fnd.destroy)){ fnd.destroy(); };
      let layr=(new Konva.Layer()); layr.nick=v; face.add(layr); face.batchDraw();
      inst.vars.flayer=layr; this.layrAnew(); n.value=''; return layr;
   },


   layrAnew:function()
   {
      let ai,ci,ll,lv; ai=Anon.Draw.vars.actv; ci=ai.vars.canvas; ll=listOf(ci.children); lv=select('#DrawPropLayrView'); lv.innerHTML='';
      if(span(ll)<1){lv.insert({tiny:'no layers'}); select('#DrawPropLayrActv').reclan('show:hide'); return};
      select('#DrawPropLayrActv').reclan('hide:show');

      reversed(ll).forEach((lo)=>
      {
         if(!lo.anon){lo.anon={name:lo.nick,lock:0,hide:0}};
         let hdn,lck; hdn=(lo.anon.hide?'eye-blocked':'eye1'); lck=(lo.anon.lock?'lock1':'unlocked');
         lv.insert({grid:'.noSpanVert .selectable', name:lo.nick, info:lo.anon, canFocus:1,
         listen:{click:function(){Anon.Draw.tool.layrPick(this);}},
         contents:[{row:
         [
            {col:[{input:'.toolTextFeed .dark', value:lo.nick, editLock:true, layer:lo,
               listen:{'change':function(e){Anon.Draw.tool.layrName(this);}},
            }]},
            {col:'', style:{width:32,opacity:0.7}, contents:
            [
               {icon:'', face:hdn, size:12},
               {icon:'', face:lck, size:12, style:{marginLeft:3}},
            ]},
         ]}]});
      });
      this.layrPick(ai.vars.flayer.nick);
   },


   layrPick:function(gn)
   {
      let ai,ci,gi; ai=Anon.Draw.vars.actv; ci=ai.vars.canvas;
      let fnd = ci.find('Transformer');  if(!!fnd && isFunc(fnd.destroy)){ fnd.destroy(); };
      ci.batchDraw();
      select('#DrawPropLayrView grid').forEach((n)=>{n.declan('hasFocus'); if(isText(gn)&&(n.info.name==gn)){gn=n}});
      ai.vars.flayer=gn.select('input')[0].layer; gi=gn.info; gn.enclan('hasFocus'); select('#DrawPropLayrName').innerHTML=gi.name;
      select('#DrawPropLayrBtns butn').forEach((b)=>
      {
         if(b.name=='hide'){b.declan('icon-eye1','icon-eye-blocked'); b.enclan(gi.hide?'icon-eye1':'icon-eye-blocked'); return};
         if(b.name=='lock'){b.declan('icon-lock1','icon-unlocked'); b.enclan(gi.lock?'icon-unlocked':'icon-lock1'); return};
         if(gi.lock){b.enbool('disabled')}else{b.debool('disabled')};
      });
   },


   layrName:function(n)
   {
      let v,b; v=trim(n.value); b=rectOf(n); if(!isWord(v)){n.notify('invalid layer name',NEED,TL,[0,(b.height+6)]); return};
      let o,g; o=n.layer.nick; g=select(`#DrawPropLayrView grid[name="${o}"]`)[0]; n.layer.nick=v; n.layer.anon.name=v;
      g.name=v; g.info.name=v; n.blur();
   },


   layrTogl:function(d)
   {
      let ai,ci,th,tl; ai=Anon.Draw.vars.actv; ci=ai.vars.canvas; ci.find('Transformer').destroy(); ci.batchDraw();
      if(d=='hide'){th=(ai.vars.flayer.anon.hide?0:1); ai.vars.flayer.anon.hide=th; if(th){ai.vars.flayer.hide()}else{ai.vars.flayer.show()}};
      if(d=='lock'){tl=(ai.vars.flayer.anon.lock?0:1); ai.vars.flayer.anon.lock=tl;};
      this.layrAnew();
   },


   layrShft:function(d)
   {
      let ai,ci; ai=Anon.Draw.vars.actv; ci=ai.vars.canvas; ci.find('Transformer').destroy(); ci.batchDraw();
      if(d=='up'){ai.vars.flayer.moveUp()}else{ai.vars.flayer.moveDown()};
      this.layrAnew();
   },


   layrSpan:function(d, w,h)
   {
      let ai,ci; ai=Anon.Draw.vars.actv; ci=ai.vars.canvas; ci.find('Transformer').destroy(); ci.batchDraw();
      let lr,lc; lr=ai.vars.flayer; lc=lr.getChildren(); w=0; h=0;
      lc.forEach((n)=>{let bx=n.fg.getClientRect(); w+=bx.width; h+=bx.height;});
      Anon.Draw.tool.crop(w,h);
   },


   layrMrgd:function( ai,ci,fl,tl,fr,tr,nn)
   {
      ai=Anon.Draw.vars.actv; ci=ai.vars.canvas; ci.find('Transformer').destroy(); ci.batchDraw();
      fl=ai.vars.flayer; tl=select(`#DrawPropLayrView grid[name="${fl.nick}"]`)[0].select('>'); if(isVoid(tl)){tl=VOID}; // get both layers
      nn=fl.nick; fr=create({img:'',src:fl.toDataURL(),onload:function(){this.done=1}}); // rasterize "from" layer
      if(!!tl){tl=tl.select('input')[0].layer; tr=create({img:'',src:tl.toDataURL(),onload:function(){this.done=1}}); tl.destroy()}; // "to"
      fl.removeChildren(); wait.until(()=>{let fd=fr.done; let td=(tr?tr.done:1); return (fd&&td)}, ()=>
      {
         let d,f,t; d={w:fr.width,h:fr.height}; if(tr){t=(new Konva.Image({x:0,y:0,width:d.w,height:d.h,image:tr})); fl.add(t); fl.draw();};
         f=(new Konva.Image({x:0,y:0,width:d.w,height:d.h,image:fr})); fl.add(f); fl.draw(); fr=VOID; tr=VOID;
         let fi=fl.toDataURL(); fl.removeChildren(); create({img:'',src:fi,onload:function()
         {
            let z=Anon.Draw.fumb(new Konva.Image({x:0,y:0,width:this.width,height:this.height,draggable:true,image:this}));
            z.nick=nn; fl.add(z); fl.draw(); Anon.Draw.deja.keep(ai); Anon.Draw.tool.layrAnew();
         }});

      });
   },


   layrCopy:function()
   {
      let ai,ci,fl,nn,tl,fk; ai=Anon.Draw.vars.actv; ci=ai.vars.canvas; ci.find('Transformer').destroy(); ci.batchDraw();
      fl=ai.vars.flayer; nn=this.layrNick(fl.nick); tl=(new Konva.Layer()); tl.nick=nn; ci.add(tl); tl.anon=dupe(fl.anon); tl.anon.name=nn;
      listOf(fl.children).forEach((o)=>{tl.add(Anon.Draw.fumb(o.clone())); tl.draw()}); ci.batchDraw(); ai.vars.flayer=tl;
      this.layrAnew();
   },


   layrVoid:function(n)
   {
      let ai,ci,fl,gn,nn; ai=Anon.Draw.vars.actv; ci=ai.vars.canvas; ci.find('Transformer').destroy(); ci.batchDraw();
      fl=ai.vars.flayer; gn=select(`#DrawPropLayrView grid[name="${fl.nick}"]`)[0]; nn=gn.select('<'); if(isVoid(nn)){nn=gn.select('>');};
      fl.destroy(); delete ai.vars.flayer; remove(gn); if(!isVoid(nn)){ai.vars.flayer=nn.select('input')[0].layer};
      this.layrAnew();
   },
});




select('#DrawBodyPanl').listen('tabfocus',function()
{
   Anon.Draw.tool.layrAnew();
});



// tick.every(500,function()
// {
//    let inst,lays,l=Anon.Draw.vars.actv; let lays=select('#DrawPropLayrList'); let if(!inst){return};
// });
