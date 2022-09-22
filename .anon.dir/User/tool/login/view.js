extend(repl)
({
   login:function(a, s,p,f)
   {
      s=repl.login; p=select('#AnonReplProm'); f=select('#AnonReplFeed'); // short refs

      if(repl.ENV.target!='login') // no password given, command start
      {
         if(!a){a='master'}; if(!isWord(a)){repl.mumble('invalid username');return}; s.un=a;
         repl.ENV.target='login'; p.modify({innerHTML:'password:'}); f.enclan("passwd"); return;
      }; // default user & prompt password

      if(!isText(a,6)){repl.mumble('try again');return}; s.pw=a; // validate password
      repl.mumble('verifying ...');
      purl('/User/runRepel/login',{args:['login',s.un,s.pw]},(r,b)=>
      {
         s.un=VOID; s.pw=VOID; b=r.body; if(b!=OK) // login check
         {
            repl.mumble(b); repl.ENV.target='exec';  f.declan("passwd"); f.modify({value:''}); // notify & reset
            p.modify({innerHTML:('['+sesn('USER')+'&nbsp;'+repl.PWD+']')}); return;  // reset mechanism
         };

         var sh=sesn('HASH'); //cookie.delete(sh);
         repl.noprom(); repl.mumble('access granted'); repl.mumble('refreshing ...'); // notify the user what's happening
         window.onbeforeunload=null; tick.after(150,()=> // wait for DOM to settle then reboot GUI
         {newGui({APIKEY:sh});});
      });
   },



   su:function(a){this.login(a)},



   passwd:function(a, s)
   {
      s=repl.passwd; p=select('#AnonReplProm'); f=select('#AnonReplFeed');
      if(repl.ENV.target!='passwd') // no password given, command start
      {
         if(!a){a=sesn('USER')}; if(!isWord(a)){repl.mumble('invalid username');return};
         if(a=='anonymous'){repl.mumble('nice try ;)');return};
         if((sesn('USER')!=a)&&!isin(sesn('CLAN'),'sudo'))
         {repl.mumble("only members of the `sudo` clan can change the passwords of others"); return};

         s.un=a; repl.ENV.target='passwd'; repl.mumble('enter new password');
         p.modify({innerHTML:'password:'}); f.modify({type:'password'}); return;
      }; // default user & prompt password
      if(!isText(a,6)){repl.mumble('lame, try again');return}; s.pw=a; // validate password
      repl.noprom();
      repl.mumble('verifying ...'); purl('/User/runRepel/login',{args:['passwd',s.un,s.pw]},(r,b)=>
      {
         let un=s.un; s.un=VOID; s.pw=VOID; repl.ENV.target='exec'; b=r.body; repl.mumble(b);
         if(b!=':OK:') // change failed
         {
            repl.mumble(b); f.modify({type:'text'}); f.modify({value:''}); // notify & reset
            p.modify({innerHTML:('['+sesn('USER')+'&nbsp;'+repl.PWD+']')}); return;  // reset mechanism
         };

         repl.mumble('password changed successfully'); // notify the user what's happening
         if((un=='master')&&(getBadConf()=='editRootPass')){newGui('/');return}; // needs to refresh
         repl.reprom();
      });
   },



   whoami:function(a, r)
   {
      if(!!repl.user){repl.user('info',sesn('USER'));return};
      repl.mumble(sesn('USER')+' .. '+sesn('CLAN'));
   },
});
