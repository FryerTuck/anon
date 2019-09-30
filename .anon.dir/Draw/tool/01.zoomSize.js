

select('#DrawPropCanv').insert
([
   {grid:'.noSpan', contents:
   [
      {row:[{col:
      [{input:'#DrawPropZoom .toolTextFeed .dark',icon:'search1',demo:'100%', title:'zoom', listen:{'key:Enter':function(e)
      {
         let ns=((this.value.trim()||'100').split('%').join('')*1); if(!isNumr(ns)){return}; Anon.Draw.tool.zoom(ns/100);
      }}}]}]},
      {row:[{col:[{input:'#DrawPropSize .toolTextFeed .dark', icon:'enlarge', demo:'0 x 0', title:'size', listen:{'key:Enter':function(e)
      {
         let nv,nw,nh; nv=this.value.trim().split(' ').join('').split('x'); nw=(nv[0]*1); nh=(nv[1]*1); Anon.Draw.tool.size(nw,nh);
      }}}]}]},
   ]}
]);



extend(Anon.Draw.tool)
({
   zoom:function(ns,fm, sx,sy,nw,nh,os,zs,sb)
   {
      if(!isNumr(ns)){return}; let inst=Anon.Draw.vars.actv; let face=inst.vars.canvas; face.find('Transformer').destroy();
      zs=face.dime.zoom.scal; os=face.dime.size; sx=os.sclx; sy=os.scly;
      if(fm){sb=((ns/1000)/2); ns=(zs+sb); this.input.value=round(ns*100);}; sx*=ns; sy*=ns;
      face.scaleX(sx); face.scaleY(sy); nw=(os.crpw*ns); nh=(os.crph*ns); face.width(nw); face.height(nh);
      inst.setStyle({width:nw,height:nh}); face.batchDraw();
      face.dime.zoom.scal=ns;
   }
   .bind({input:select('#DrawPropZoom')}),

   size:function(nw,nh,fm, zs,os,sx,sy)
   {
      let inst=Anon.Draw.vars.actv; let face=inst.vars.canvas; face.find('Transformer').destroy(); if(fm){dump('do mouse resize');return};
      zs=face.dime.zoom.scal; os=face.dime.size; sx=(nw/os.ownw); sy=(nh/os.ownh);
      face.dime.size={sclx:sx,scly:sy,crpw:nw,crph:nh,ownw:os.ownw,ownh:os.ownh}; this.input.value=`${nw} x ${nh}`; nw*=zs; nh*=zs;
      face.scaleX(sx*zs); face.scaleY(sy*zs); face.width(nw); face.height(nh); inst.setStyle({width:nw,height:nh});
      face.batchDraw(); Anon.Draw.deja.keep(inst);
      select('#DrawPropCrop').value=`${nw} x ${nh}`;
   }
   .bind({input:select('#DrawPropSize')}),
});



select('#DrawBodyPanl').listen('tabfocus',function(e)
{
   let ds=e.detail.vars.canvas.dime.size; select('#DrawPropSize').value=`${ds.crpw} x ${ds.crph}`;
});


select('#DrawBodyPanl').listen('Control MouseWheel',function(evnt)
{
   let sv; sv=evnt.coords[1]; Anon.Draw.tool.zoom(sv,1);
});


select('#DrawBodyPanl').listen('Meta MouseWheel',function(evnt)
{
   let vx,vy; vx=evnt.coords[0]; vy=evnt.coords[1]; Anon.Draw.tool.size(vx,vy,1);
});
