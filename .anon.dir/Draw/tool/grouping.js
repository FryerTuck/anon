extend(Anon.Draw.tool)
({
   group:
   {
      icon:'make-group',
      keys:'Control g',
      exec:function(inst,evnt, s,g,l,f)
      {
         s=inst.vars.selected; g=(new Konva.Group({x:0,y:0,draggable:true})); l=inst.vars.layers[inst.vars.tgtLayer];
         inst.vars.canvas.find('Transformer').destroy(); s.forEach((o)=>{o.draggable(false); o.moveTo(g)});
         l.add(g); f=(new Konva.Transformer()); l.add(f); f.attachTo(g); f.forceUpdate(); l.draw(); inst.vars.selected=[g];
         Anon.Draw.deja.keep(inst);
      },
   },

   ungroup:
   {
      icon:'ungroup',
      keys:'Control Shift G',
      exec:function(inst,evnt, s,d)
      {
         app=this; s=inst.vars.selected; inst.vars.selected=[]; inst.vars.canvas.find('Transformer').destroy();
         s.forEach(function(g)
         {
            if(g.nodeType!='Group'){return}; d=1; let p=g.parent; g.children.forEach((o)=>
            {o.draggable(true); o.moveTo(p); let f=(new Konva.Transformer()); p.add(f); f.attachTo(o);}); if(p.draw)(p.draw());
         });
         if(d){Anon.Draw.deja.keep(inst);};
      },
   },
});
