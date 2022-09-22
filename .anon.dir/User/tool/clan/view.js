extend(repl)
({
   clan:function()
   {
      let l,a,c,d,f; f=('list make edit user void').split(' ');
      l=listOf(arguments); a=l.shift(); c=l.shift(); d=l.shift(); if(!isin(f,a)){repl.mumble('`'+a+'` is not an option');return};

      purl('/User/runRepel/clan', {args:[a,c,d]}, (r)=>
      {
         repl.mumble(r.body);
      });
   },

   lsgrp:function(x)
   {
      repl.clan('list',x);
   },
});
