

select('#DrawPropCanv').insert
([
   {grid:'.noSpanVert', contents:
   [
      {row:
      [
         {col:'.tiny .midlChld', contents:[{icon:'', face:'search1', size:12}]},
         {col:'.midlChld', contents:[{input:'.dark', type:'range', min:1, max:500, step:1, value:100, oninput:function()
         {let v=(this.value*1); this.select('^ > input')[0].value=`${v}%`; Anon.Draw.tool.zoom(v/100)}}]},
         {col:'.tiny .midlChld', contents:[{input:'.toolTextFeed .dark .mini', value:'100%',  demo:'100%', title:'zoom',
            listen:{'key:Enter':function(){let ns=((this.value.trim()||'100').split('%').join('')*1); Anon.Draw.tool.zoom(ns/100);}},
         }]},
      ]},
      {row:
      [
         {col:'.tiny .midlChld', contents:[{icon:'', face:'versions', size:12}]},
         {col:'.midlChld', contents:[{input:'.dark', type:'range', min:0.05, max:10, step:0.05, value:1, oninput:function()
         {let v=(this.value*1); this.select('^ > input')[0].value=v; Anon.Draw.tool.scal(v,v)}}]},
         {col:'.tiny .midlChld', contents:[{input:'.toolTextFeed .dark .mini', value:'1 x 1',  demo:'1', title:'scale',
            listen:{'key:Enter':function()
            {
               let nv,nw,nh; nv=this.value.trim().split(' ').join('').split('x'); nw=(nv[0]*1); nh=(nv[1]*1); Anon.Draw.tool.scal(nw,nh);
            }},
         }]},
      ]},
   ]},

   {grid:'.noSpanVert', contents:
   [
      {row:[{col:[{input:'#DrawPropSize .toolTextFeed .dark', icon:'enlarge', demo:'0 x 0', title:'size', listen:{'key:Enter':function(e)
      {
         let nv,nw,nh; nv=this.value.trim().split(' ').join('').split('x'); nw=(nv[0]*1); nh=(nv[1]*1); Anon.Draw.tool.size(nw,nh);
      }}}]}]},
      {row:[{col:[{input:'#DrawPropCrop .toolTextFeed .dark', icon:'crop', demo:'0 x 0', title:'crop', listen:{'key:Enter':function(e)
      {
         let nv,nw,nh; nv=this.value.trim().split(' ').join('').split('x'); nw=(nv[0]*1); nh=(nv[1]*1); Anon.Draw.tool.crop(nw,nh);
      }}}]}]},
      {row:[{col:'.panlHorzLine', contents:[{hdiv:''}]}]},
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


   scal:function(sx,sy,fm, nw,nh,os,zs,sb)
   {
      if(!isNumr(sx)||!isNumr(sy)){return}; let inst=Anon.Draw.vars.actv; let face=inst.vars.canvas; face.find('Transformer').destroy();
      zs=face.dime.zoom.scal; os=face.dime.size; dump(sx,sy);
      if(fm){sb=((ns/1000)/2); sx=round((os.sclx+sb),4); sy=round((os.scly+sb),4); let sv=((sx==sy)?sx:`${sx} x ${sy}`); this.input.value=sv;};
      face.scaleX(sx); face.scaleY(sy); nw=Math.floor(os.crpw*sx); nh=Math.floor(os.crph*sy); face.width(nw); face.height(nh);
      inst.setStyle({width:nw,height:nh}); face.batchDraw();
      face.dime.size={sclx:sx,scly:sy,crpw:nw,crph:nh,ownw:os.ownw,ownh:os.ownh};
      select('#DrawPropSize').value=`${nw} x ${nh}`; select('#DrawPropCrop').value=`${nw} x ${nh}`;
   }
   .bind({input:select('#DrawPropScal')}),


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
   let ds=e.detail.vars.canvas.dime.size; select('#DrawPropSize').value=`${ds.crpw} x ${ds.crph}`;
   select('#DrawPropCrop').value=`${ds.crpw} x ${ds.crph}`;
});


select('#DrawBodyPanl').listen('Control MouseWheel',function(evnt)
{
   let sv; sv=evnt.coords[1]; Anon.Draw.tool.zoom(sv,1);
});


select('#DrawBodyPanl').listen('Meta MouseWheel',function(evnt)
{
   let vx,vy; vx=evnt.coords[0]; vy=evnt.coords[1]; Anon.Draw.tool.size(vx,vy,1);
});


select('#DrawBodyPanl').listen('Control Shift MouseWheel',function(evnt)
{
   let sv; sv=evnt.coords[1]; Anon.Draw.tool.zoom(sv,1);
});


select('#DrawBodyPanl').listen('Meta Shift MouseWheel',function(evnt)
{
   let vx,vy; vx=evnt.coords[0]; vy=evnt.coords[1]; Anon.Draw.tool.size(vx,vy,1);
});
