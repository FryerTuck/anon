extend(Anon.Draw.tool)
({
   undo:
   {
      icon:'undo2',
      keys:'Control z',
      exec:function(inst,evnt)
      {
         Anon.Draw.deja.pick(inst,'<');
      },
   },

   redo:
   {
      icon:'redo2',
      keys:'Control Shift Z',
      exec:function(inst,evnt)
      {
         Anon.Draw.deja.pick(inst,'>');
      },
   },
});
