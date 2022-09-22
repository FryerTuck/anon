extend(repl)
({
   path:function()
   {
      let l,a,x,f,s; f=('mode make gain scan goto copy move void').split(' ');
      l=listOf(arguments); x=l.shift(); if(!x){repl.mumble('use: help path'); return};
      if(!isin(f,x)){repl.mumble('`'+x+'` is not an option');return};
      var cb=VOID; a=[]; l.forEach((i)=>{if(!i){return}; if(isFunc(i)){cb=i;return}; a.push(i)});

      var tmo=1; tick.after(1250,()=>{if(tmo){repl.mumble('one moment ...')};});
      purl('/User/runRepel/path', {args:[x,a,repl.PWD]}, (r)=>
      {
         tmo=VOID; r=r.body; if(isin(r,'evnt: fail\n')&&isin(r,'\nmesg: ')&&isin(r,'\nfile: '))
         {r=r.split('\nmesg: ')[1]; r=r.split('\nfile: ')[0]; r=ltrim(r,'Usage - '); repl.mumble('Failed .. '+r); return;};
         if(cb){cb(r);return}; repl.mumble(r);
      });
   },


   touch:function(a,b)
   {a=rtrim(a,'/'); repl.path('make',a);},

   mkdir:function(a,b)
   {a=rtrim(a,'/'); a=(a+'/'); repl.path('make',a);},

   chmod:function(a,b)
   {repl.path('mode',a,b);},

   cat:function(a,b)
   {repl.path('scan',a,b);},

   ls:function(a,b)
   {repl.path('scan',a,b);},

   cd:function(a)
   {
      repl.path('goto',a,(r)=>
      {
         if(!isPath(r)&&!isPath(`/${r}`)){repl.mumble(r);return};
         repl.PWD=r; repl.reprom();
      });
   },

   cp:function(a,b)
   {repl.path('copy',a,b);},

   mv:function(a,b)
   {repl.path('move',a,b);},

   rm:function(a,b)
   {repl.path('void',a,b);},

   create:function(a,b)
   {
       repl.path('make','stem',b);
   },
});
