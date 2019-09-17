extend(repl)
({
   sudo:function()
   {
      let c,a; c=listOf(arguments); if(c.length<1){return}; a=(lpop(c)).toLowerCase(); a=a.join(' ');

      if(w=='js'){eval(c);return}; // run client-side

      purl('/User/runRepel/sudo', {args:[a,c,repl.PWD]}, (r)=>
      {
         repl.mumble(r.body);
      });
   },
});
