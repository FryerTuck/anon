extend(Anon.Draw.tool)
({
   zoom:
   {
      icon:'search1',
      keys:'Control MouseWheel',
      exec:function(inst,evnt)
      {
         let v=evnt.coords[1]; let face=inst.vars.canvas; face.find('Transformer').destroy(); let os,sb,ns,nw,nh,co,kc,ce,br;
         os=face.scaleX(); sb=((v/1000)/2); ns=(os+sb); if(ns<0){ns=0}; face.scale({x:ns,y:ns});
         br=face.getClientRect(); nw=br.width; nh=br.height; face.width(nw); face.height(nh);
         inst.setStyle({width:nw,height:nh}); face.batchDraw();
      },
   },

   crop:
   {
      icon:'crop',
      keys:'Control Shift MouseWheel',
      exec:function(inst,evnt, face,vx,vy)
      {
         face=inst.vars.canvas; vx=evnt.coords[0]; vy=evnt.coords[1]; face.find('Transformer').destroy();
         let os,ns,br,sb,nw,nh; br=(inst.cb?{width:face.width(),height:face.height()}:face.getClientRect()); inst.cb=1;
         nw=Math.trunc(br.width+(vx/2)); nh=Math.trunc(br.height+(vy/2)); face.width(nw); face.height(nh);
         face.dime.crop={s:face.scaleX(),w:nw,h:nh}; inst.setStyle({width:nw,height:nh}); face.batchDraw();
         Anon.Draw.deja.keep(inst);
      },
   },
});
