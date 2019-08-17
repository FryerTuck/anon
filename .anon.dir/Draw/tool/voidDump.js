extend(Anon.Draw.tool)
({
   remove_selected_item:
   {
      icon:'trashcan',
      keys:'Delete',
      exec:function(inst,evnt)
      {
         s=inst.vars.selected; if(s.length<1){return}; inst.vars.canvas.find('Transformer').destroy();
         s.forEach(function(o){let p=o.parent; o.destroy(); p.draw()}); inst.vars.selected=[];
         Anon.Draw.deja.keep(inst);
      },
   },

   undo_all:
   {
      icon:'flame',
      keys:'Control Delete',
      exec:function(inst,evnt)
      {
         dump('undo all');
      },
   },
});
