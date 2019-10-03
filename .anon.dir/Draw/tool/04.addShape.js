

select('#DrawToolPanl').insert
([
   {butn:'#DrawButnMakeText .AnonToolButn .icon-text-color', title:'add text', onclick:function(){Anon.Draw.tool.makeText()}},
   {div:'.panlHorzLine', contents:[{hdiv:''}]},
]);


extend(Anon.Draw.tool)
({
   makeText:function()
   {
      let inst=Anon.Draw.vars.actv; let face=inst.vars.canvas; face.find('Transformer').destroy(); face.batchDraw();
      let layr=inst.vars.layers[inst.vars.tgtLayer];
   },
});
