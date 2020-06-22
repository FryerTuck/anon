"use strict";


// func :: getBadConf : returns the first configuration item name that needs attention
// --------------------------------------------------------------------------------------------------------------------------------------------
   const getBadConf = function()
   {
      let l,r; try{l=JSON.parse(atob(badCfg))}catch(e){l=[]}; if(l.length<1){return}; return l;
   };
// --------------------------------------------------------------------------------------------------------------------------------------------



// func :: userInfo : returns an object .. if user does not exist it is empty
// --------------------------------------------------------------------------------------------------------------------------------------------
   const userInfo = function(d, slf)
   {
      if(!userDoes(`work lead sudo`)){return {}}; if(!stak(0)){wack();return};  // security
      if(!isText(d,1)){return {}}; if(d!=INIT){return (this[d]||{})}; slf=this; // validation & existing
      purl
      ({
          target:`/User/getUsers`,
          silent:true,
          listen:
          {
              error:function(e)
              {
                  if(isin(e,"<title>403 - Forbidden</title>")){repl.exit();};
              },
              loadend:function(r)
              {
                  if(!isJson(r.body)){fail(`expecting JSON`); return};
                  r=decode.jso(r.body); r.each((v,k)=>{slf[k]=v;})
              },
          }
      });
   }
   .bind({});
// --------------------------------------------------------------------------------------------------------------------------------------------



// defn :: (config) : upgrade conf with this stem's viewConf
// --------------------------------------------------------------------------------------------------------------------------------------------
   const conf={};
   (function(c,h,m)
   {
      // Busy.kill();
      c={ {:'/User/conf/viewConf':} }; c.each((v,k)=>{if(conf[k]){fail('`conf.'+k+'` is already defined');return}; conf[k]=v});
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
                  tick.after(250,()=> // force Busy to close after 0.25 sec
                  {
                     if(!select('#busyPane')){return}; if(span(Busy.jobs)>0){Busy.tint('yellow');}; Busy.kill();
                  }); // but show that+why it was forced

                  if(!userDoes('work,sudo,lead')){return}; // we want to do something (next) that requires privileges
                  userInfo(INIT); // populate user-info
                  let c=getBadConf(); if(!c){return}; // check for bad config, if none then all is good

                  if(isin(c,"editRootPass")&&isin(c,"confAutoMail"))
                  {
                      popModal(`cog :: Base system configuration`)
                      ({
                          body:[{panl:
                          [
                              {p:`The master password and default mail account needs to be set before this system can be used.`},
                              {input:`#AnonRootPass`, type:`password`, demo:`master password`, style:{marginBottom:10}},
                              {input:`#AnonAutoMail`, type:`text`, demo:`mail://username:PassW0rd@example.com`},
                          ]}],
                          foot:
                          [
                              {butn:`.good`, text:`Save`, onclick:function()
                              {
                                  let pw,em; pw=select(`#AnonRootPass`).value; em=select(`#AnonAutoMail`).value;
                                  purl(`/User/initConf`,{pass:pw,mail:em},(r)=>
                                  {
                                      r=r.body; if(r!=OK){return}; let m;
                                      m=`Now create a power-user that belongs to (at least) these clans: \`work sort sudo\`\n`+
                                        `For help on this, type \`help user\` in the terminal and hit Enter on your keyboard.`;
                                      popAlert(`thumbs-up :: Success! : Initial config set.\n\n${m}`);
                                      this.root.exit();
                                  });
                              }},
                              {butn:`Cancel`},
                          ],
                      });
                      return;
                  };

                  purl(('/User/readNote/'+c),(r)=>
                  {
                     r=('\n'+r.body+'\n\n'); repl.mumble(r); let h=r.split('\n').length; select('#AnonReplPanl').scrollTop=0;
                     if(h<9){return}; h=((h+1)*16); select('#AnonReplPanl').parentNode.style.height=(h+'px');
                  });
               });
            });
         }});
      }});
   };
// --------------------------------------------------------------------------------------------------------------------------------------------



// evnt :: tap4 : init workPanl
// --------------------------------------------------------------------------------------------------------------------------------------------
    listen("tap4",function()
    {
        // if(!!select(`#AnonReplPanl`)){return};
        initPanl();
    });
// --------------------------------------------------------------------------------------------------------------------------------------------



// cond :: clan : if user is logged in and is worker -then show the panel
// --------------------------------------------------------------------------------------------------------------------------------------------
   if(userDoes("work sudo"))
   {
      globVars({idleTime:{:'/User/conf/inactive':}});
      globVars({authTime:time()},[`XMLHttpRequest.authSudo /User/getRepel`]);
      globVars({mailBusy:0},[`Object.mailTime /User/boot.js`,`XMLHttpRequest.pingMail /User/boot.js`]);


      listen("clockSec",function()
      {
         let tl=globVars("activity").last;  this.incr++;
         let tn=time();  let ti=(globVars("idleTime")-12);
         if((tn-tl)>=ti){imHere(0); signal("sesnFade",{time:12});};
      }.bind({incr:0}));


      // server.listen("mailTime",function mailTime(obj)
      // {
      //    if(!server.stream||globVars(`mailBusy`)){return}; globVars({mailBusy:1});
      //    // dump("mail init");
      //    purl
      //    ({
      //       target:`/Proc/xenoCall`,
      //       silent:true,
      //       convey:{func:`xena::fetchNewAutoMail`,deps:`Mail`},
      //       listen:
      //       {
      //          error:function pingMail(r)
      //          {
      //             globVars({mailBusy:0});
      //             if(isJson(r)){fail(decode.jso(r));return};
      //             if(isin(r,"Network :: 503 Connection Failure")){return};
      //             dump("pingMail error:\n"+r);
      //          },
      //          loadend:function pingMail(r)
      //          {
      //             r=r.body; globVars({mailBusy:0}); if(r==OK){return;};
      //             if(isin(r,":BUSY:")){return};
      //             dump(`mail fail:\n${r}\n\n`);
      //          },
      //       }
      //    });
      // });


      server.listen("newEmail",function()
      {
         dump("new email!");
      });


      server.listen("sesnFade",function(obj)
      {
          signal(`sesnFade`,obj);
      });


      listen("sesnFade",function(obj)
      {
         let tn=time(); if(obj.detail){obj=obj.detail}; if(isJson(obj)){obj=decode.jso(obj);};
dump("sesnFade called");
         if(!globVars("activity").idle)
         {
            Cookies.set(sesn('HASH'),'...'); navigator.sendBeacon('/User/isActive','1');
dump("sesnFade ignored");
            return; // user is active
         };

         let pm=popModal({skin:`dark`,size:`300x150`,time:obj.time})
         ({
            head:`Idle Session`,
            body:`Your session is about to expire`,
            foot:{butn:`I'm here`, onclick:function(){this.root.exit()}},
         });

         if(!pm){return}; // already open
         pm.listen
         ({
            gone:function(){repl.exit();},
            exit:function(){Cookies.set(sesn('HASH'),'...'); navigator.sendBeacon('/User/isActive','1');},
         });
      });


      initPanl();
   };
// --------------------------------------------------------------------------------------------------------------------------------------------



// evnt :: exit : destroy server session
// --------------------------------------------------------------------------------------------------------------------------------------------
   window.onbeforeunload=function(e)
   {
      // Cookies.set(sesn('HASH'),'...'); navigator.sendBeacon('/User/doLogout','1');
      server.stream.close();
      // return true;
   };

   // document.addEventListener('visibilitychange',function()
   // {
   //    if(document.visibilityState=='unloaded'){navigator.sendBeacon('/User/doLogout','1'); server.stream.close();};
   // });

   (function()
   {
      (cookie.select('*')||{}).each((v,k)=>{if(!test(k,/^[a-z0-9]{40}$/)){return}; if(k!=sesn('HASH')){cookie.delete(k)};});
   }());
// --------------------------------------------------------------------------------------------------------------------------------------------



// evnt :: (keys) : hotkeys
// --------------------------------------------------------------------------------------------------------------------------------------------
   listen(conf.toggleUserPanl,function()
   {
      initPanl();
   });


   listen(conf.toggleReplView,function()
   {
      let rpl,max,min,hgt; rpl=select('#MainGridCol3'); if(!rpl){return}; max=100; min=1; hgt=rectOf(rpl).height;
      rpl.setStyle({height:((hgt>=max)?min:max)});
   });


   listen('Control r',function()
   {
      newGui({APIKEY:sesn('HASH')});
   });


   listen('key:F5',function(e)
   {
      // if(e.signal=='Control F5'){return;};
      e.preventDefault(); e.stopPropagation();
      // window.onbeforeunload=null;
      newGui({APIKEY:sesn('HASH')});
   });
// --------------------------------------------------------------------------------------------------------------------------------------------
