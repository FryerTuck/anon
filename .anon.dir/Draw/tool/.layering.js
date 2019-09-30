extend(Anon.Draw.tool)
({
   ascend_item:
   {
      icon:'chevron-up',
      keys:'Control ArrowUp',
      exec:function(inst,evnt, l,o)
      {
         l=inst.vars.layers[inst.vars.tgtLayer]; o=tgt.vars.selected[0]; if(!o){return};
         o.moveUp(); l.draw(); Anon.Draw.deja.keep(inst);
      },
   },

   descend_item:
   {
      icon:'chevron-down',
      keys:'Control ArrowDown',
      exec:function(inst,evnt)
      {
         l=inst.vars.layers[inst.vars.tgtLayer]; o=tgt.vars.selected[0]; if(!o){return};
         o.moveDown(); l.draw(); Anon.Draw.deja.keep(inst);
      },
   },

   new_layer:
   {
      icon:'plus1',
      keys:'Shift +',
      exec:function(inst,evnt)
      {
         dump('new layer');
      },
   },

   delete_layer:
   {
      icon:'minus',
      keys:'Shift -',
      exec:function(inst,evnt)
      {
         dump('delete layer');
      },
   },

   ascend_layer:
   {
      icon:'move-up',
      keys:'Shift ArrowUp',
      exec:function(inst,evnt)
      {
         dump('move layer up');
      },
   },

   descend_layer:
   {
      icon:'move-down',
      keys:'Shift ArrowDown',
      exec:function(inst,evnt)
      {
         dump('move layer down');
      },
   },

   select_layer_above:
   {
      icon:'menu4',
      keys:'Alt ArrowUp',
      exec:function(inst,evnt)
      {
         dump('select layer above');
      },
   },

   select_layer_below:
   {
      icon:'menu3',
      keys:'Alt ArrowDown',
      exec:function(inst,evnt)
      {
         dump('select layer below');
      },
   },
});
