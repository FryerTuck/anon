extend(repl)
({
   sudo:function(w,c)
   {
      w=w.toLowerCase(); if(w=='js'){eval(c);return}; // run client-side
      purl('/User/runRepel/sudo', {args:[w,c,repl.PWD]}, (r)=>
      {
         repl.mumble(r.body);
      });
   },
});
