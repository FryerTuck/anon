"use strict";



// func :: getBadConf : returns the first configuration item name that needs attention
// --------------------------------------------------------------------------------------------------------------------------------------------
   const getBadConf = function()
   {
      let l,r; try{l=JSON.parse(atob(badCfg))}catch(e){l=[]}; if(l.length<1){return}; r=l.shift(); return r;
   };
// --------------------------------------------------------------------------------------------------------------------------------------------



// defn :: (config) : upgrade conf with this stem's viewConf
// --------------------------------------------------------------------------------------------------------------------------------------------
   (function(c,h,m)
   {
      c={ {:'/User/conf/viewConf':} }; c.each((v,k)=>{if(conf[k]){fail('`conf.'+k+'` is already defined');return}; conf[k]=v});

      c=getBadConf(); if(!c){return}; // check for bad config, if none then all is good
      c=(location.protocol+'//'+location.host); m=rtrim(location.href,'/'); if(m!=c){newGui('/'); return};
      tick.after(999,()=>
      {
         m="!!! WARNING !!!\nYou are about to be infected with the nastiest virus on the planet!\n\nKidding, but now that "+
           "I have your attention, if you're just a malicious (-or innocent) bystander then you'e welcome to come back later "+
           "when this site is ready.\n\nIf you've just installed this site, you can stop panicking now, just read the README "+
           "dock below this alert-box .. though, if you know how to login, you'll see the cause of this alert.";
         alert(m);
      });
   }());
// --------------------------------------------------------------------------------------------------------------------------------------------



// func :: initPanl : initialize workPanel
// --------------------------------------------------------------------------------------------------------------------------------------------
   const initPanl = function()
   {
      if((typeof AnonPanl)!='undefined'){if(!AnonPanl.actv){AnonPanl.show();return}; AnonPanl.hide();return}; // panl exists .. show/hide

      Busy.edit('initPanl',1); document.head.insert({script:'',src:'/User/getPanel', onready:function() // load the panl once
      {
         Busy.edit('initPanl',41); document.head.insert({script:'',src:'/User/getRepel', onready:function() // load the repl once
         {
            Busy.edit('initPanl',61); wait.until(()=>{return (!!select('#AnonReplFeed'))},()=>
            {
               Busy.edit('initPanl',81); requires(['/User/initBoot/skin.css','/User/initBoot/hack.js'],()=>
               {
                  Busy.edit('initPanl',100); AnonPanl.show(); // finish up as expected
                  tick.after(1250,()=> // force Busy to close after 1 second
                  {if(!select('#busyPane')){return}; dump(Busy.jobs); Busy.tint('yellow'); Busy.done()}); // but show that+why it was forced

                  if(!isin(sesn('CLAN',1),'work')){return}; // we want to do something (next) that requires privileges
                  let c=getBadConf(); if(!c){return}; // check for bad config, if none then all is good

                  purl(('/User/readNote/'+c),(r)=>
                  {
                     r=('\n'+r.body+'\n\n'); repl.mumble(r); let h=r.split('\n').length; select('#AnonReplPanl').scrollTop=0;
                     if(h<9){return}; h=((h+1)*16); select('#AnonReplView').style.height=(h+'px');
                  });
               });
            });
         }});
      }});
   };
// --------------------------------------------------------------------------------------------------------------------------------------------



// evnt :: keyboard : toggle worker-panel upon keyboard shortcut
// --------------------------------------------------------------------------------------------------------------------------------------------
   listen(conf.toggleUserPanl,function()
   {
      initPanl();
   });

   document.body.addEventListener('keydown',function(e)
   {
      if(e.ctrlKey&&(e.key=='s')){e.preventDefault(); e.stopPropagation()};
   });
// --------------------------------------------------------------------------------------------------------------------------------------------



// cond :: clan : if user is logged in and is worker -then show the panel
// --------------------------------------------------------------------------------------------------------------------------------------------
   if(userDoes('work','sudo'))
   {
      server.listen('sesnFade',function(obj)
      {
         popModal('Idle :: Your session is about to expire.',obj.time)
         ([
            {"Good :: I'm still here":function(){this.root.close()}},
         ])
         .listen
         ({
            stale:function(){repl.exit();},
            close:function(){navigator.sendBeacon('/User/isActive','1');},
         });
      });

      initPanl();
   };
// --------------------------------------------------------------------------------------------------------------------------------------------



// evnt :: exit : destroy server session
// --------------------------------------------------------------------------------------------------------------------------------------------
   window.onbeforeunload=function(e)
   {
      navigator.sendBeacon('/User/doLogout','1');
      server.stream.close();
      return true;
   };


   listen('Control r',function()
   {
      window.onbeforeunload=null; newGui();
   });


   // document.addEventListener('visibilitychange',function()
   // {
   //    if(document.visibilityState=='unloaded'){navigator.sendBeacon('/User/doLogout','1'); server.stream.close();};
   // });
// --------------------------------------------------------------------------------------------------------------------------------------------
