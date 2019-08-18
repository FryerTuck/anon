extend(repl)
({
   user:function()
   {
      let l,a,u,f; f=('make edit pass info list mesg void').split(' ');
      l=listOf(arguments); a=l.shift(); u=l.shift(); if(!isin(f,a)){repl.mumble('`'+a+'` is not an option');return};
      l=l.join('\n'); if((a=='pass')&&!repl.passwd.un){repl.passwd((u||VOID));return};

      purl('/User/runRepel/user', {args:[a,u,l]}, (r)=>
      {
         repl.mumble(r.body);
      });
   },

   useradd:function()
   {
      let l,a,u,o,m,c; l=listOf(arguments); a='make'; u=l.shift(); o=l.shift(); if(o=='-M'){m=('mail:'+l.shift())};
      o=l.shift(); if(o=='-G'){c=('clan:'+l.shift())}; repl.user(a,u,m,c);
   },

   usermod:function()
   {
      let l,a,o,u,m,c; l=listOf(arguments); a='edit'; o=l.shift();
      if(o[0]!='-'){u=o; o=l.shift(); if(o=='-M'){m=('mail:'+l.shift())}; o=l.shift(); if(o=='-G'){c=('clan:'+l.shift())}; repl.user(a,u,m,c);}
      else if(o=='-l'){d=l.shift(); u=l.shift(); repl.user(a,u,('name:'+d))};
   },

   id:function(u,d)
   {
      repl.user('info',u,d);
   },

   whois:function(u)
   {
      repl.user('info',u);
   },

   userdel:function(u)
   {
      repl.user('void',u);
   },

   lsusr:function(a)
   {
      repl.user('list',a);
   },

   invite:function(u,d)
   {
      d=('+'+d.split(',').join(',+'));
      repl.user('edit',u,('clan:'+d));
   },

   banish:function(u,d)
   {
      d=('-'+d.split(',').join(',-'));
      repl.user('edit',u,('clan:'+d));
   },
});
