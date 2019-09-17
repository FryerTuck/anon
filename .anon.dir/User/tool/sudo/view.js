extend(repl)
({
   sudo:function(a,c, u,s,p,f)
   {
      if(c&&c.length<1){return}; u=sesn('USER'); s=repl.sudo; p=select('#AnonReplProm'); f=select('#AnonReplFeed'); // short refs

      if(repl.ENV.target!='sudo') // no password given, command start
      {
         s.cmnd=a; s.exec=c; repl.mumble(`confirm that you are ${u}`); repl.ENV.target='sudo';
         p.modify({innerHTML:'password:'}); f.modify({type:'password'}); return;
      };

      repl.ENV.target='exec'; repl.reprom(); //repl.mumble('stand by ...');

      purl('/User/authSudo',{args:`${a} ${c}`,pw:a},(ar)=>
      {
         if(ar.body!=OK){repl.mumble(ar.body);return};

         if(a=='js'){eval(c);return}; // run client-side

         purl('/User/runRepel/sudo', {args:[s.cmnd,s.exec,repl.PWD]}, (r)=>
         {
            repl.mumble(r.body);
         });
      });
   },
});
