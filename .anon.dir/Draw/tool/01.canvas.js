

select('#DrawToolPanl').insert
([
   {butn:'#DrawButnPickArro .AnonToolButn', icon:'floppy-disk', title:'save session ~ canvas', onclick:function(){Anon.Draw.tool.saveDraw()}},
   {butn:'#DrawButnArroNone .AnonToolButn', icon:'circle-slash', title:'un-select all ~ canvas', onclick:function(){Anon.Draw.tool.pickNone()}},

   {butn:'#DrawButnArroNone .AnonToolButn', icon:'eyedropper', title:'find colour ~ canvas', onclick:function(){Anon.Draw.tool.findColr()}},
   {butn:'#DrawButnArroNone .AnonToolButn', icon:'fold', title:'merge all ~ canvas', onclick:function(){Anon.Draw.tool.pickNone()}},

   {div:'.panlHorzLine', contents:[{hdiv:''}]},
]);




select('#DrawPropCanv').insert
([
   {grid:'.noSpanVert', contents:
   [
      {row:
      [
         {col:'.tiny .midlChld', contents:[{icon:'', face:'search1', size:12}]},
         {col:'.midlChld', contents:[{input:'#DrawPropZoomKnob .dark', type:'range', min:1, max:500, step:1, value:100, oninput:function()
         {let v=(this.value*1); this.select('^ > input')[0].value=`${v}%`; Anon.Draw.tool.zoom(v/100)}}]},
         {col:'.tiny .midlChld', contents:[{input:'#DrawPropZoomText .toolTextFeed .dark .mini', value:'100%',  demo:'100%', title:'zoom',
            listen:{'key:Enter':function(){let ns=((this.value.trim()||'100').split('%').join('')*1); Anon.Draw.tool.zoom(ns/100);}},
         }]},
      ]},
      {row:
      [
         {col:'.tiny .midlChld', contents:[{icon:'', face:'versions', size:12}]},
         {col:'.midlChld', contents:[{input:'.dark', type:'range', min:0.05, max:10, step:0.05, value:1, oninput:function()
         {let v=(this.value*1); this.select('^ > input')[0].value=v; Anon.Draw.tool.scal(v,v)}}]},
         {col:'.tiny .midlChld', contents:[{input:'.toolTextFeed .dark .mini', value:'1 x 1',  demo:'1 x 1', title:'scale',
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
   zoom:function(ns,fm, sx,sy,bx,nw,nh,os,zs,sb,nv,el)
   {
      if(!isNumr(ns)){return}; let inst=Anon.Draw.vars.actv; let face=inst.vars.canvas;
      let fnd = face.find('Transformer');  if(!!fnd && isFunc(fnd.destroy)){ fnd.destroy(); };
      zs=face.dime.zoom.scal; os=face.dime.size; sx=os.sclx; sy=os.scly;
      if(fm){sb=((ns/1000)/2); ns=(zs+sb); nv=round(ns*100); el=this.input; el.value=nv; el.select('^ < input')[0].value=nv}; sx*=ns; sy*=ns;
      face.scaleX(sx); face.scaleY(sy); face.batchDraw(); bx=face.getClientRect(); nw=Math.floor(bx.width); nh=Math.floor(bx.height);
      face.width(nw); face.height(nh); inst.setStyle({width:nw,height:nh});  face.dime.zoom.scal=ns;
   }
   .bind({input:select('#DrawPropZoomText')}),


   scal:function(sx,sy,fm, bx,nw,nh,os,zs,sb)
   {
      if(!isNumr(sx)||!isNumr(sy)){return}; let inst=Anon.Draw.vars.actv; let face=inst.vars.canvas; face.find('Transformer').destroy();
      zs=face.dime.zoom.scal; os=face.dime.size;
      if(fm){sb=((ns/1000)/2); sx=round((os.sclx+sb),4); sy=round((os.scly+sb),4); let sv=((sx==sy)?sx:`${sx} x ${sy}`); this.input.value=sv;};
      face.scaleX(sx); face.scaleY(sy); face.batchDraw(); bx=face.getClientRect(); nw=Math.floor(bx.width); nh=Math.floor(bx.height);
      face.width(nw); face.height(nh); inst.setStyle({width:nw,height:nh});
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


   saveSesn:function()
   {
   },


   saveDraw:function( ai,ci,iv)
   {
      ai=Anon.Draw.vars.actv; iv=ai.vars; ci=iv.canvas; ci.find('Transformer').destroy(); ci.batchDraw();

      popModal({class:'AnonTreeModl', theme:'dark'})
      ({
         head:[{icon:'floppy-disk'},{span:`save drawing`}],
         body:
         [
            {input:'',name:'args',placeholder:`${iv.path}`,value:iv.path},
         ],
         foot:
         [
            {butn:'', contents:'save', canv:ci, onclick:function()
            {
               let p,m,v,o,b; p=this.dbox.select('input')[0].value; m=mimeType(p);
               v=select('#DrawPropCrop').value.split(' ').join('').split('x'); v[0]*=1; v[1]*=1;
               o={mimeType:m, x:0, y:0, width:v[0], height:v[1]}; b=this.canv.toDataURL(o); v={path:p,bufr:b};
               purl('/Draw/saveFile',v,(r)=>{if(r.body!=OK){fail(r.body);return}; this.root.exit();});
            }},
            {butn:'', contents:'cancel', onclick:function(){this.root.exit();}},
         ]
      });
   },


   pickNone:function()
   {
      let ai,ci; ai=Anon.Draw.vars.actv; ci=ai.vars.canvas; ci.find('Transformer').destroy(); ci.batchDraw();
      select('#DrawPropFiltWrap').reclan('show:hide');
      delete Anon.Draw.vars.actv.vars.active;
   },


   findColr:function( ai,iv,ci,cp,bx)
   {
      ai=Anon.Draw.vars.actv; iv=ai.vars; if(!!iv.picr){return}; ci=iv.canvas; ci.find('Transformer').destroy(); ci.batchDraw();
      cp=create({div:'.posAbs', style:{display:'none',left:0,top:0,width:24,height:24,zIndex:9999,border:'1px solid #FFF',borderRadius:2}});
      cp.setStyle({boxShadow:'0px 0px 1px #000'}); if(!ai.events){ai.events={}}; select('#anonPanlView').insert(cp); cursor.bind(cp,14,-4);
      bx=rectOf(ai); image2Canvas(ci.toDataURL(),(co,cx)=>
      {
         ai.vars.picr={canvas:cx,cursor:cp};
         cp.listen('boundmove',(ev)=>
         {
            let ep=ev.detail; ep.x-=bx.x; ep.y-=bx.y; if((ep.x<0)||(ep.y<0)||(ep.x>bx.width)||(ep.y>bx.height)){return};
            let pc=ai.vars.picr.canvas.getImageData(ep.x,ep.y,1,1).data; pc[3]/=255; pc=pc.join(','); pc=`rgba(${pc})`;
            cp.style.background=pc; ai.vars.picr.picked=pc;
         });
      });

      if(!ai.events.mouseover)
      {
         ai.listen('mouseover',function(ev,po){po=this.vars.picr; if(!po){return}; po.cursor.view('block');});
         ai.listen('mouseout',function(ev,po){po=this.vars.picr; if(!po){return}; po.cursor.view('none');});
         ai.listen('mousedown',function(ev,po)
         {
            po=this.vars.picr; if(!po){return}; cursor.drop(po.cursor); remove(po.cursor); remove(po.canvas);
            let pc=this.vars.picr.picked; delete this.vars.picr; cp=VOID; let hx=ltrim(hexTxt(pc),'#');
            copyToClipboard(hx); repl.mumble(`chosen ${pc} as ${hx}`); cursor.hint(`copied!`);
         });
      };
   },
});




select('#DrawBodyPanl').listen('mouseover',function(e)
{
   this.focus();
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


select('#DrawBodyPanl').listen('key:Delete',function(evnt)
{
   let i,c,l,e; i=Anon.Draw.vars.actv; c=i.vars.canvas; l=i.vars.flayer; e=i.vars.active; if(!e){return};
   c.find('Transformer').destroy(); e.destroy(); Anon.Draw.vars.actv.vars.active=VOID; c.batchDraw();
});
