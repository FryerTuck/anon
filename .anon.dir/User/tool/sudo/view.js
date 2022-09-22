extend(repl)
({
   sudo:function(c,a, u,s,p,f,ct,lt)
   {
      if(c&&c.length<1){return};
      u=sesn('USER'); s=this; p=select('#AnonReplProm'); f=select('#AnonReplFeed'); // short refs
      a=trim(a); ct=time(); lt=this.lastTime;
      if((ct-lt)<40){this.execCmnd(c,a);return}; // user is still here

      if(repl.ENV.target!='sudo') // no password given, command start
      {
         s.cmnd=c; s.exec=a; repl.mumble(`confirm that you are ${u}`); repl.ENV.target='sudo';
         p.modify({innerHTML:'password:'}); f.modify({type:'password'}); return;
      };

      repl.ENV.target='exec'; repl.reprom(); //repl.mumble('stand by ...');

      purl('/User/authSudo',{pw:c},function authSudo(ar)
      {
         if(ar.body!=OK){repl.mumble(ar.body);return};
         let rs=globVars({authTime:time()}); if(!rs){return};
         s.execCmnd(s.cmnd,s.exec);
      });
   }
   .bind
   ({
      lastTime:0,
      execCmnd:function(c,a)
      {
         this.lastTime=time();

         if(c=='js'){eval(unwrap(a));return}; // run client-side

         purl('/User/runRepel/sudo', {args:[c,a,repl.PWD]}, (r)=>
         {
            repl.mumble(r.body);
         });
      },
   }),


   git:function()
   {
      let arg=("git "+listOf(arguments).join(" "));
      repl.sudo("sh",arg);
   },
});
