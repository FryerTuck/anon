

select('#DrawPropCanv').insert
([
   {grid:'.noSpan', contents:
   [
      {row:[{col:
      [{input:'#DrawPropScal .toolTextFeed .dark',icon:'versions',demo:'1', title:'scale', listen:{'key:Enter':function(e)
      {
         let nv,sx,sy; nv=this.value.trim().split(' ').join('').split('x'); sx=((nv[0]||1)*1); sy=((nv[1]||sx)*1); Anon.Draw.tool.scal(sx,sy);
         let ns=(this.value.trim()*1); if(!isNumr(ns)){return}; Anon.Draw.tool.scal(ns);
      }}}]}]},
      {row:[{col:[{input:'#DrawPropCrop .toolTextFeed .dark', icon:'crop', demo:'0 x 0', title:'crop', listen:{'key:Enter':function(e)
      {
         let nv,nw,nh; nv=this.value.trim().split(' ').join('').split('x'); nw=(nv[0]*1); nh=(nv[1]*1); Anon.Draw.tool.crop(nw,nh);
      }}}]}]},
   ]}
]);



extend(Anon.Draw.tool)
({
   scal:function(sx,sy,fm, nw,nh,os,zs,sb)
   {
      if(!isNumr(sx)||!isNumr(sy)){return}; let inst=Anon.Draw.vars.actv; let face=inst.vars.canvas; face.find('Transformer').destroy();
      zs=face.dime.zoom.scal; os=face.dime.size; dump(sx,sy);
      if(fm){sb=((ns/1000)/2); sx=round((os.sclx+sb),4); sy=round((os.scly+sb),4); let sv=((sx==sy)?sx:`${sx} x ${sy}`); this.input.value=sv;};
      face.scaleX(sx); face.scaleY(sy); nw=(os.crpw*sx); nh=(os.crph*sy); face.width(nw); face.height(nh);
      inst.setStyle({width:nw,height:nh}); face.batchDraw();
      face.dime.size={sclx:sx,scly:sy,crpw:nw,crph:nh,ownw:os.ownw,ownh:os.ownh};
      select('#DrawPropSize').value=`${nw} x ${nh}`; select('#DrawPropCrop').value=`${nw} x ${nh}`;
   }
   .bind({input:select('#DrawPropScal')}),

   crop:function(nw,nh,fm, zs,os,sx,sy)
   {
      let inst=Anon.Draw.vars.actv; let face=inst.vars.canvas; face.find('Transformer').destroy(); if(fm){dump('do mouse crop');return};
      zs=face.dime.zoom.scal; os=face.dime.size; sx=(nw/os.ownw); sy=(nh/os.ownh);
      face.dime.size.crpw=nw; face.dime.size.crph=nh; this.input.value=`${nw} x ${nh}`; nw*=zs; nh*=zs;
      face.width(nw); face.height(nh); inst.setStyle({width:nw,height:nh});
      face.batchDraw(); Anon.Draw.deja.keep(inst);
      select('#DrawPropSize').value=`${nw} x ${nh}`;
   }
   .bind({input:select('#DrawPropCrop')}),
});



select('#DrawBodyPanl').listen('tabfocus',function(e)
{
   let ds=e.detail.vars.canvas.dime.size; select('#DrawPropCrop').value=`${ds.crpw} x ${ds.crph}`;
});


select('#DrawBodyPanl').listen('Control Shift MouseWheel',function(evnt)
{
   let sv; sv=evnt.coords[1]; Anon.Draw.tool.zoom(sv,1);
});


select('#DrawBodyPanl').listen('Meta Shift MouseWheel',function(evnt)
{
   let vx,vy; vx=evnt.coords[0]; vy=evnt.coords[1]; Anon.Draw.tool.size(vx,vy,1);
});
