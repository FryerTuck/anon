

select('#DrawToolPanl').insert
([
   {butn:'#DrawButnPickArro .AnonToolButn .icon-point-up', title:'pick tool', onclick:function(){Anon.Draw.tool.pickArro()}},
   {butn:'#DrawButnArroNone .AnonToolButn .icon-circle-slash', title:'pick none', onclick:function(){Anon.Draw.tool.pickNone()}},
   {div:'.panlHorzLine', contents:[{hdiv:''}]},
]);


extend(Anon.Draw.tool)
({
   pickArro:function()
   {
      let inst=Anon.Draw.vars.actv; let face=inst.vars.canvas;
   },

   pickNone:function()
   {
      let inst=Anon.Draw.vars.actv; let face=inst.vars.canvas; face.find('Transformer').destroy(); face.batchDraw();
   },
});
