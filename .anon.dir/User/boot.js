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
                  if(!isJson(r.body)){return};
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
      c=deconf(`(~enconf("User/viewConf"~)`);
      c.each((v,k)=>{if(conf[k]){fail('`conf.'+k+'` is already defined');return}; conf[k]=v});
   }());
   MAIN.CONFIRMLEAVE=1;
// --------------------------------------------------------------------------------------------------------------------------------------------



// func :: initPanl : initialize workPanel
// --------------------------------------------------------------------------------------------------------------------------------------------
   const initPanl = function()
   {
      window.ANONSHOWBUSY=1;
      if((typeof AnonPanl)!='undefined')
      {
          if(!AnonPanl.actv){AnonPanl.show();return};
          window.ANONSHOWBUSY=0; AnonPanl.hide();return
      }; // panl exists .. show/hide

      Busy.edit('initPanl',1); document.head.insert({script:'',src:'/User/getPanel', onready:function() // load the panl once
      {
         Busy.edit('initPanl',41); document.head.insert({script:'',src:'/User/getRepel', onready:function() // load the repl once
         {
            Busy.edit('initPanl',61); wait.until(()=>{return (!!select('#AnonReplFeed'))},()=>
            {
               Busy.edit('initPanl',81);
               requires(['/User/initBoot/pretty.css','/User/initBoot/client.js'],()=>
               {
                  Busy.edit('initPanl',100); AnonPanl.show(); // finish up as expected
                  tick.after(250,()=> // force Busy to close after 0.25 sec
                  {
                     if(!select('#busyPane')){return}; if(span(Busy.jobs)>0){Busy.tint('yellow');}; Busy.kill();
                  }); // but show that+why it was forced

                  if(!userDoes('work,sudo,lead'))
                  {
                        popModal({size:`324x174`,skin:`dark`})
                        ({
                            head:`unlock-alt :: Login`,
                            body:[{panl:
                            [
                                {input:`#anonSuUser`, type:`text`, demo:`username`, style:`margin-bottom:8px`},
                                {input:`#anonSuPass`, type:`password`, demo:`password`},
                            ]}],
                            foot:
                            [
                                {butn:`Cancel`},
                                {butn:`.cool`, text:`Login`, onclick:function()
                                {
                                    let un,pw,sh; un=select(`#anonSuUser`); pw=select(`#anonSuPass`);
                                    purl(`/User/runRepel/login`,{args:["login",un.value,pw.value]},(rsp)=>
                                    {
                                        rsp=rsp.body; if(rsp!=OK){popAlert(rsp); return};
                                        sh=sesn('HASH'); this.root.exit();
                                        tick.after(50,()=>{newGui({APIKEY:sh})});
                                    });
                                }},
                            ]
                        });
                  };

                  if(!userDoes('work,sudo,lead')){return}; // we want to do something (next) that requires privileges
                  userInfo(INIT); // populate user-info
                  let c=getBadConf(); if(!c){return}; // check for bad config, if none then all is good

                  if(isin(c,"editRootPass")&&isin(c,"confAutoMail"))
                  {
                      popModal({size:`500x230`,skin:`dark`})
                      ({
                          head:`cog :: System Configuration`,
                          body:[{panl:
                          [
                              {p:`The master password and default mail account needs to be set before this system can be used.`},
                              {input:`#AnonRootPass`, type:`password`, demo:`master password`, style:{marginBottom:10}},
                              {input:`#AnonAutoMail`, type:`text`, demo:`mail://username:PassW0rd@example.com:993/?smtp=mailhost.me:465`},
                          ]}],
                          foot:
                          [
                              {butn:`.good`, text:`Save`, onclick:function()
                              {
                                  let pw,em; pw=select(`#AnonRootPass`).value; em=select(`#AnonAutoMail`).value;
                                  purl(`/User/initConf`,{pass:pw,mail:em},(r)=>
                                  {
                                      r=r.body; if(r!=OK){return}; let m;
                                      m=`Now create a power-user that belongs to (at least) these clans:\n\`work,sort,bill,draw,geek,mind,gang,sudo\`\n`+
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
        initPanl();
    });
// --------------------------------------------------------------------------------------------------------------------------------------------



// cond :: clan : if user is logged in and is worker -then show the panel
// --------------------------------------------------------------------------------------------------------------------------------------------
   if(userDoes("work,sudo"))
   {
      globVars({idleTime:(~'/User/conf/inactive'~)});
      globVars({authTime:time()},[`XMLHttpRequest.authSudo /User/getRepel`]);
      globVars({mailBusy:0},[`Object.mailTime /User/boot.js`,`XMLHttpRequest.pingMail /User/boot.js`]);


      // listen("SSEReady",function()
      // {
      // });


      listen("clockSec",function()
      {
         let tl=globVars("activity").last;  this.incr++;
         let tn=time();  let ti=(globVars("idleTime")-12);
         if((tn-tl)>=ti){imHere(0); signal("sesnFade",{time:12});};
      }.bind({incr:0}));


      // server.listen("newEmail",function()
      // {
      //    dump("new email!");
      // });


      server.listen("sesnFade",function(obj)
      {
          signal(`sesnFade`,obj);
      });


     listen("beforeunload",function(ev)
     {
        cookie.delete("RECEIVER");
        fixCookies(); // prevent 431 error
        // cookie.delete("INTRFACE");
        if (server.stream){ server.stream.close() };
        // if(globVars("activity").idle){return}; // don't confirm "leave site"
        // if(!isin(sesn("CLAN"),["work","lead","sudo"])){return}; // don't confirm "leave site"
        if(!MAIN.CONFIRMLEAVE){return};
        ev.preventDefault(); ev.returnValue=''; // confirm "leave site"
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
