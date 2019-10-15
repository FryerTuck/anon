

select('#DrawPropFilt').insert
([
   {div:'#DrawPropFiltWrap .hide', contents:
   [
      {div:'#DrawPropFiltType', contents:'undefined type'},
      {tiny:'#DrawPropFiltName', contents:'undefined name'},
      {grid:'.noSpan', style:{marginTop:6}, contents:
      [
         {row:
         [
            {col:'.tiny .midlChld', contents:'H'},
            {col:'.midlChld', contents:[{input:'.dark', type:'range', min:0, max:359, step:1, value:0, oninput:function()
            {let v=(this.value*1); this.select('^ > input')[0].value=v; Anon.Draw.tool.layrHSLA(H,v)}}]},
            {col:'.tiny .midlChld', contents:[{input:'.toolTextFeed .dark .mini', value:0}]},
         ]},
         {row:
         [
            {col:'.tiny .midlChld', contents:'S'},
            {col:'.midlChld', contents:[{input:'.dark', type:'range', min:-6, max:6, step:0.05, value:0, oninput:function()
            {let v=(this.value*1); this.select('^ > input')[0].value=v; Anon.Draw.tool.layrHSLA(S,v)}}]},
            {col:'.tiny .midlChld', contents:[{input:'.toolTextFeed .dark .mini', value:0}]},
         ]},
         {row:
         [
            {col:'.tiny .midlChld', contents:'L'},
            {col:'.midlChld', contents:[{input:'.dark', type:'range', min:-2, max:2, step:0.05, value:0, oninput:function()
            {let v=(this.value*1); this.select('^ > input')[0].value=v; Anon.Draw.tool.layrHSLA(L,v)}}]},
            {col:'.tiny .midlChld', contents:[{input:'.toolTextFeed .dark .mini', value:0}]},
         ]},
         {row:
         [
            {col:'.tiny .midlChld', contents:'A'},
            {col:'.midlChld', contents:[{input:'.dark', type:'range', min:0, max:1, step:0.01, value:1, oninput:function()
            {let v=(this.value*1); this.select('^ > input')[0].value=v; Anon.Draw.tool.layrHSLA(A,v)}}]},
            {col:'.tiny .midlChld', contents:[{input:'.toolTextFeed .dark .mini', value:1}]},
         ]},
         {row:
         [
            {col:'.tiny .midlChld', contents:'B'},
            {col:'.midlChld', contents:[{input:'.dark', type:'range', min:0, max:60, step:0.05, value:0, oninput:function()
            {let v=(this.value*1); this.select('^ > input')[0].value=v; Anon.Draw.tool.layrHSLA(B,v)}}]},
            {col:'.tiny .midlChld', contents:[{input:'.toolTextFeed .dark .mini', value:0}]},
         ]},
      ]},
   ]},
]);




extend(Anon.Draw.tool)
({
   layrHSLA:function(w,v)
   {
      let ai,ci; ai=Anon.Draw.vars.actv; ci=ai.vars.canvas;
      let fl,tn; fl=ai.vars.flayer; tn=ai.vars.active; if(!tn.anon){tn.anon={}};

      if(!tn.anon.hsla){tn.anon.hsla={H:0,S:0,L:0,A:1}; tn.cache(); tn.filters([Konva.Filters.HSL,Konva.Filters.Blur])};

      if(w==H){tn.hue(v); fl.draw(); return};
      if(w==S){tn.saturation(v); fl.draw(); return};
      if(w==L){tn.luminance(v); fl.draw(); return};
      if(w==A){tn.opacity(v); fl.draw(); return};
      if(w==B){tn.blurRadius(v); fl.draw(); return};
   },
});
