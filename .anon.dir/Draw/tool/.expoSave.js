extend(Anon.Draw.tool)
({
   save:
   {
      icon:'floppy-disk',
      keys:'Control s',
      exec:function(inst,evnt)
      {
         Anon.Draw.save(inst);
      },
   },

   export:
   {
      icon:'download2',
      keys:'Control Shift S',
      exec:function(inst,evnt)
      {
         dump('expo');
      },
   },
});
