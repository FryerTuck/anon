"use strict";


// func :: envi : this is used for syntax-sugar only .. the argument-value is got from server at serve-time
// --------------------------------------------------------------------------------------------------------------------------------------------
   const envi = function(s)
   {
      if(!stak(0)){wack();return}; // keep out some hackers
      if(!isText(s,1)||!s.startsWith("$")){fail(`expecting text that starts with $`);return};
      let v=sval(s.slice(1));  return v;
   };
// --------------------------------------------------------------------------------------------------------------------------------------------



// defn :: conf : front-end configuration
// --------------------------------------------------------------------------------------------------------------------------------------------
   globVars({antiHack:deconf(`{:enconf('Proc/antiHack'):}`)});

   const timeVars = {e6:0};

   const badCfg='{:badCfg:}';

   globVars({mime:deconf(`{:enconf('Proc/mimeType'):}`)});
// --------------------------------------------------------------------------------------------------------------------------------------------



// hack :: protection : hijack some functions and methods that can be used against us using dev-tools and address-bar
// --------------------------------------------------------------------------------------------------------------------------------------------
   select('script').forEach((n)=>{remove(n)});

   globVars({jack:
   {
       main:['eval','alert','Element.prototype.appendChild','Element.prototype.setAttribute','Element.prototype.addEventListener','XMLHttpRequest.prototype.open'],
       info:[`console.log`,`console.error`,`console.debug`,`console.warn`,`console.info`],
   }});


   if(globVars(`antiHack`).denyScriptInject)
   {
       hijack(globVars(`jack`).main,function()
       {if(stak(0)){return listOf(arguments)}; wack()});
   };


   if(!globVars(`antiHack`).seeConsoleOutput)
   {
       hijack(globVars(`jack`).info,function()
       {
          let j={"[Intervention] Slow network":`Fallback font will be used`}; // junk
          let a,i; a=listOf(arguments); a.forEach((s)=>{j.each((v,k)=>{if(isin(s,k)&&isin(s,v)){i=1;return STOP}})});
          if(i||!userDoes(`geek sudo`)){return}; // .. sweet screams
          return a;
       });
   };
// --------------------------------------------------------------------------------------------------------------------------------------------



// defn :: view : structure
// --------------------------------------------------------------------------------------------------------------------------------------------
   select('body')[0].insert
   ([
      {view:'#anonHidnView .full', style:'overflow:hidden; opacity:0'},
      {view:'#anonMarkView .full', style:'overflow:hidden; opacity:0.1', contents:
      [
         // {img:'.cenmid', src:'/Proc/dcor/mark.svg'}
      ]},
      {view:'#anonMainView .full'},
      {view:'#anonPanlView .hide'},
      {view:'#anonModlView .hide'},
      {view:'#anonNoteView .hide'},
   ]);
// --------------------------------------------------------------------------------------------------------------------------------------------




// load :: auto : control DOM mutation and boot any other front-end features
// --------------------------------------------------------------------------------------------------------------------------------------------
   const fixCookies = function(ns)
   {
        // (cookie.select('*')||{}).each((cv,cn)=>
        // {
        //     if(!test(cn,/^[a-z0-9]{40}$/)){return};
        //     if(cn!=sesn("HASH")){cookie.delete(cn);return};
        //     if(!ns){cookie.update(cn,"...");return};
        //     cookie.delete(cn);
        // });
   };


   (function(l)
   {
      // Cookies.set(sesn('HASH'),'...');

      let hr=location.href; let fg=stub(hr,["?freshGui","&freshGui"]);
      if(fg)
      {
          hr=(fg[0]+(fg[0].startsWith("?")?"?":"")+(fg[2]||""));
          window.history.replaceState({id:"100"},"freshGui",hr);
      };

      wait.until(()=>{return (!!MAIN.Busy)},()=>
      {
         listen('mutation',function(e, l)
         {
            // if(MAIN.HALT){return};
            if(!e.detail||(e.detail.type!='childList')){return};
            l=e.detail.addedNodes; if(isList(l)){l=listOf(l);}else{return}; if(l.length<1){return}; // validate
            this.walk(l); // check all new nodes - including their children
            tick.after(50,()=>{ordained.vivify()}); // anoint the ordained ones (if any)
         }
         .bind
         ({
            walk:function(l, s,k)
            {
               s=this; l.forEach((n)=>
               {
                  let t=nodeName(n); if(!t||!n.parentNode){return}; s.fire(n,t); if(t=='svg'){return};
                  k=listOf(n.childNodes); if(k.length<1){return}; s.walk(k);
               });
            },

            fire:function(n,tn, pr)
            {
               pr=path(n.src||n.href); if(pr){n.purl=pr}; n._waiting=function(t, p,s)
               {
                  if(!this.purl||(t=='a'))
                  {tick.after(10,()=>{delete this._waiting; this.signal('ready'); tick.after(10,()=>{this.signal('idle')});}); return};

                  p=this.purl; s=this;
                  s.listen('error',function(){this.failed=1; Busy.tint('red'); this.signal('load')}); // onfail
                  s.listen('load',function()
                  {
                     if(!this._waiting){return}; this.done=100; delete this._waiting; this.loaded=1; if(this.failed){return};
                     tick.after(50,()=>{this.signal('ready'); tick.after(10,()=>{this.signal('idle')});});
                  });

                  // let tmo,itv; tmo=tick.after(750,()=>{clearInterval(itv); delete s._waiting; dump(`delayed: ${p}`);});
                  // itv=tick.every(10,()=>
                  // {
                  //    if(s.done<100){return}; clearInterval(itv); clearTimeout(tmo); delete s._waiting;
                  //    if(s.loaded){return;}; tick.after(250,()=>
                  //    {if(s.loaded){return}; s.loaded=1; s.signal('ready'); tick.after(10,()=>{s.signal('idle')});});
                  // });
               };
               n._waiting(tn);
            }
         }));
// --------------------------------------------------------------------------------------------------------------------------------------------


// --------------------------------------------------------------------------------------------------------------------------------------------
         listen('procFail',function(e)
         {
            Busy.done(); MAIN.HALT++; if(MAIN.HALT>2){return};

            let info=e.detail; if((info.name=="Error")&&(info.mesg=="null")){return};
            console.error(info);
            let hint=`An error was triggered and for some reason it was not handled.`;

            let apnd=`This could be trivial, but may cause issues with your session.
                      - if you have no unsaved progress, just hit the "refresh" button below
                      - you can also close/ignore this prompt and manually refresh later
                      - if this recurs, hit "report bug and refresh" .. it's immediate and anonymous

                      What will you do?`;

            let mesg=info.mesg; let nick=(info.evnt||info.name||"Unknown").split("Error").join("");

            if(!userDoes('geek','sudo')){mesg=hint;}else
            {
                // console.error(info);
                mesg+=("<br><br>\n\n```\n"+`file: ${info.file}\nline: ${info.line}`+"\n```\n\n<br>");
                mesg+=("\n\n```\n"+info.stak.join("\n")+"\n```\n\n<br>");
            };
            mesg+=`\n\n${apnd}`;
            popConfirm(`${nick} Fail :: ${mesg}`,`dark`,`auto`,`bug`,`500x260`)
            ({
               'need::report bug and refresh':function(ce, fm)
               {
                  fm="Failed to report bug :(\n\nPlease contact tech support:\n{:TECHMAIL:}";
                  try{purl("/Proc/makeTodo",{mesg:btoa(encode.jso(e.detail))},(r)=>
                  {
                     if(r.body!=OK){console.error(r.body); alert(fm);return}; newGui({APIKEY:sesn('HASH')});
                  });}catch(err){alert(fm);};
               },
               'warn::refresh':function(){newGui({APIKEY:sesn('HASH')});},
               'harm::ignore':function(){this.root.exit();},
            });

            tick.after(250,()=>{Busy.done()});
         });
// --------------------------------------------------------------------------------------------------------------------------------------------




// envi :: evnt : set up environment & events
// --------------------------------------------------------------------------------------------------------------------------------------------
         extend(MAIN)({guiResizing:{tikr:null,busy:0}});

         listen("resize",function()
         {
            clearTimeout(MAIN.guiResizing.tikr);
            if(!MAIN.guiResizing.busy){signal("resizeInit")}; MAIN.guiResizing.busy=1;
            MAIN.guiResizing.tikr=setTimeout(()=>{MAIN.guiResizing.busy=0; signal("resizeDone")},300);
         });


         extend(MAIN)
         ({
            focusObj:{hash:VOID,node:VOID},
            ProcInfo:
            {
               sysClock:deconf(`{:enconf('Proc/sysClock'):}`).client,
            },
         });


         tick.every(ProcInfo.sysClock,function()
         {
            signal("tick");
            let e=document.activeElement; if(!e){return}; if(!e.UniqueID){extend(e)({UniqueID:('NODE'+fash())})};
            if(focusObj.hash==e.UniqueID){return}; focusObj.hash=e.UniqueID; focusObj.node=e; signal('focuschange',e);
         });

         tick.after(250,()=>{signal("ready")});
      });
   }());
// --------------------------------------------------------------------------------------------------------------------------------------------




// evnt :: key:Esc : hide on-escape
// --------------------------------------------------------------------------------------------------------------------------------------------
   listen('key:Esc',function(evnt){tick.after(1,(dc,je,se,fe)=>
   {
      dc=1; je=evnt.jacked; if(isText(je)){je=select(je)}; se=evnt.srcElement;
      fe=focusObj.node; if(isNode(je)&&(je.houses(se)||je.houses(fe))){dc=0};
      if(!dc){return}; // hijacked .. we no longer have control here

      if(Busy.node){Busy.kill(); return};
      let mnu=select('#AnonDropMenu'); if(mnu){remove(mnu);return};
      let mdl=select('modal'); if(mdl){vals(mdl,-1).exit();return};
      // AnonPanl.hide();
   })});
// --------------------------------------------------------------------------------------------------------------------------------------------



// evnt :: ready : fires once when dependencies are loaded
// --------------------------------------------------------------------------------------------------------------------------------------------
   listen("ready",function()
   {
      let bl=decode.jso((`{:bootList:}`||`[]`));

      extend(MAIN)({Anon:{}}); bz(50);
      requires(bl,( np,ah,ab)=>
      {
         bz(60);
         ab=function(evnt,dm,db,se,pn)
         {
             pn=this.parentNode; pn.enclan("scrollHide"); pn.style.backgroundColor="#FFFFFF";
             dm=this.contentDocument; if(!dm){fail("iframe :: invalid DOM"); return};
             db=dm.body.parentNode; dm.AnonSiteView=this; db.tapHit=0;

             if(!db.tapSeq)
             {
                 db.tapSeq=1;
                 db.addEventListener("click",function(ev,ms)
                 {
                     ms=this; ms.tapHit+=1;
                     if(ms.tapTmo){clearTimeout(ms.tapTmo)};
                     if(ms.tapHit<4){ms.tapTmo=setTimeout(()=>{ms.tapHit=0;},350); return;};
                     ms.tapHit=0; initPanl();
                 });
             };

             if(("{:INTRFACE:}"=="ALT"))
             {
                 dump(window.location.href);
             };

             bz(80); tick.after(250,()=>
             {
                window.BOOTED=1;
                signal("boot");
                bz(100);
                Busy.done();
             });
         };

         np=location.href;

         if("{:INTRFACE:}"=="ALT")
         {
             let r=create({iframe:"#AnonSiteView .spanFull", src:np}); r.listen("load",ab);
             select('#anonMainView').insert(r);
             return;
         };

         np+=((isin(np,"?")?"&":"?")+"init");
         render(np,(r)=>
         {
             let fr=(nodeName(r)=="iframe"); if(fr){r.id="AnonSiteView"; r.listen("load",ab);};
             select('#anonMainView').insert(r);
             if(!fr){tick.after(250,()=>{window.BOOTED=1; signal("boot"); bz(100); Busy.done();});};
         });
      });
   });
// --------------------------------------------------------------------------------------------------------------------------------------------



// font rendering issue hacking below .. for when the viewport width is odd pixel number
// --------------------------------------------------------------------------------------------------------------------------------------------
   listen("boot",function()
   {


   // tick.after(1500,function()
   // {
   //    server.listen('busy',function(d,w)
   //    {
   //        if(!isJson(d)){return}; d=decode.jso(d); w=d.with; d=d.done;
   //        if(!isText(w,1)||!isInum(d)){return};
   //        if(server.silent[w]){return};
   //        Busy.edit(w,d);
   //    });
   //
   //    server.listen('done',function(d){if(d!="!"){dump(`\nserver is done with:\n${d}`)}; Busy.done();});
   //    server.listen('dump',function(d){dump(d)});
   // });
   //
   // setInterval(()=>
   // {
   //    server.ostime+=1;
   //    signal('clockSec');
   // },1000);


      listen("tick",function()
      {
         if(MAIN.guiResizing.busy){return};
         (select(".modalBox")||[]).forEach((n)=>
         {
            if(n.reposi){return};
            let r,x,y; r=rectOf(n); x=r.x; y=r.y; n.reclan("cenmid:posAbs");
            x=Math.floor(x); y=Math.floor(y); n.style.left=`${x}px`; n.style.top=`${y}px`;
            n.reposi=1;
         });
      });


      listen("resizeInit",function()
      {
         (select(".modalBox")||[]).forEach((n)=>
         {
            n.reclan("posAbs:cenmid");
         });
      });


      server.listen("AnonUpdate: sudo lead gang",function(d)
      {
          popModal(`cog :: New Updates`)
          ({
              body:[{panl:
              [
                  {h2:`Updates available`},
                  {pre:d},
                  {p:`Would you like to install now?`},
              ]}],
              foot:
              [
                  {butn:`.cool`, text:"Update Now", onclick:function(e,s)
                  {
                      Busy.edit("AnonUpdate",0); s=this;
                      purl("/Proc/update",(r)=>
                      {
                          Busy.edit("AnonUpdate",100); r=r.body;
                          if(r==OK){s.root.exit(); return};
                          fail("AnonUpdateError: ".r); s.root.exit();
                      });
                  }},
                  {butn:`.auto`, text:"Maybe Later", onclick:function()
                  {
                      this.root.exit()
                  }},
              ]
          });
      });


      server.listen("ClientReboot",function(d)
      {
          let m=(d||`system request`);
          popConfirm
          (`
              ### Refresh Required
              This session needs to be refreshed as soon as possible.
              > ${m}

              If you have any unsaved work, please save and manually refresh.
          `)
          ({
              "good :: refresh now":function(){newGui({APIKEY:sesn('HASH')});},
              "warn :: later":function(){this.root.exit()},
          });
      });
   });
// --------------------------------------------------------------------------------------------------------------------------------------------
