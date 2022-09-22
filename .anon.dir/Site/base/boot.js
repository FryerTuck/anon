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


// func :: siteLocked
// --------------------------------------------------------------------------------------------------------------------------------------------
    const siteLocked = function()
    {
        return (select("#AnonSystemLock")?true:false);
    };
// --------------------------------------------------------------------------------------------------------------------------------------------



// defn :: conf : front-end configuration
// --------------------------------------------------------------------------------------------------------------------------------------------
   globVars({antiHack:deconf(`(~enconf('Proc/antiHack'~)`)});
   const timeVars = {e6:0};

   const badCfg='(~badCfg~)';

   globVars({mime:deconf(`(~enconf('Proc/mimeType'~)`)});
// --------------------------------------------------------------------------------------------------------------------------------------------



// hack :: protection : hijack some functions and methods that can be used against us using dev-tools and address-bar
// --------------------------------------------------------------------------------------------------------------------------------------------
   select('script').forEach((n)=>{remove(n)});

   globVars({jack:
   {
       main:
       [
           'eval','alert','Element.prototype.appendChild','Element.prototype.setAttribute',
           'Element.prototype.addEventListener','EventTarget.prototype.addEventListener','XMLHttpRequest.prototype.open'
       ],
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
          if(userDoes(`geek sudo`)){return listOf(arguments);}; // see console output
          tick.after(10,()=>{console.clear();}); // .. sweet screams
       });
   };
// --------------------------------------------------------------------------------------------------------------------------------------------




// load :: auto : control DOM mutation and boot any other front-end features
// --------------------------------------------------------------------------------------------------------------------------------------------
   const fixCookies = function(ns)
   {
        (cookie.select('*')||{}).each((cv,cn)=>
        {
            if(!test(cn,/^[a-z0-9]{40}$/)){return};
            if(cn!=sesn("HASH")){cookie.delete(cn);return};
            if(!ns){cookie.update(cn,"...");return};
            cookie.delete(cn);
        });
   };


   const ScreenInfo = function()
   {
        let info = rectOf(document.body);
        let rota = ((info.width >= info.height) ? HORZ : VERT);
        Screen.info = {width:info.width, height:info.height, rotation:rota};
        return Screen.info;
   };


   (function(l)
   {
      // Cookies.set(sesn('HASH'),'...');

      let hr,fg;  hr=location.href;  fg=stub(hr,"?freshGui=");
      if(fg)
      {
          hr = (fg[0] + fg[2].slice(32));
          window.history.replaceState(null,"",hr);
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
            let elem=(select(`script[src="${info.file}"]`)||[])[0];
            if (!!elem){elem.signal("error",info)};
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
                  fm="Failed to report bug :(\n\nPlease contact tech support:\n(~TECHMAIL~)";
                  try{purl("/Proc/makeTodo",{mesg:btoa(encode.jso(e.detail))},(r)=>
                  {
                     if(r.body!=OK){console.error(r.body); this.root.exit(); popAlert(fm);return};
                     newGui({APIKEY:sesn('HASH')});
                  });}catch(err){this.root.exit(); popAlert(fm);};
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
            MAIN.guiResizing.tikr=setTimeout(()=>
            {
                MAIN.guiResizing.busy=0;
                signal("resizeDone", ScreenInfo());
            },300);
         });


         extend(MAIN)
         ({
            focusObj:{hash:VOID,node:VOID},
            ProcInfo:
            {
               sysClock:deconf(`(~enconf('Proc/sysClock'~)`).client,
            },
         });


         tick.every(ProcInfo.sysClock,function()
         {
            signal("tick");
            let e=document.activeElement; if(!e){return}; if(!e.UniqueID){extend(e)({UniqueID:('NODE'+fash())})};
            if(focusObj.hash==e.UniqueID){return}; focusObj.hash=e.UniqueID; focusObj.node=e; signal('focuschange',e);
         });

         tick.every(1000,function()
         {
            server.ostime+=1;
            signal('clockSec');
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
      let rpl=select("#AnonReplView"); if(rpl && (rpl.getStyle("height") > 0)){rpl.setStyle({overflow:"hidden",height:0});return};
      initPanl();
   })});
// --------------------------------------------------------------------------------------------------------------------------------------------



// func :: renderPath : redraw view
// --------------------------------------------------------------------------------------------------------------------------------------------
    extend(MAIN)({renderPath:function(np,av,fn)
    {
        if (!np){ np=location.href };
        signal("renderPath",np);
        dump(`renderPath( "${np}" )`);

         ScreenInfo();
         av=select(`#AnonView`);
         select('#anonMainView').innerHTML = "";

         fn=function(evnt,dm,dw,db,se,pn)
         {
             pn=this.parentNode; pn.enclan("scrollHide");
             dm=this.contentDocument; if(!dm){fail("iframe :: invalid DOM"); return};
             dw=this.contentWindow; db=dm.body.parentNode; dm.AnonSiteView=this;

             dw.onunload=function(){bz(1); signal("AnonSiteViewUnload",this);};
             signal("AnonSiteViewLoaded",dw);
             db.addEventListener("click",tapper);

             if(this.booted){bz(100); return};
             // dump("preboot-a .. MAIN.BOOTED: ", (!!MAIN.BOOTED));
             if (!MAIN.BOOTED){ signal("boot") };
         };

         if(!av)
         {
             np+=((isin(np,"?")?"&":"?")+"init="+fash()); render(np,(r)=>
             {
                 let fr=(nodeName(r)=="iframe");
                 if(fr)
                 {
                     r.id="AnonSiteView";
                     r.listen("load", (isFunc(av)?av:fn));
                 };
                 select('#anonMainView').insert(r);
                 if(!fr){tick.after(250,()=>
                 {
                     // dump("preboot-b .. MAIN.BOOTED: ", (!!MAIN.BOOTED));
                     if (!MAIN.BOOTED){ signal("boot") };
                     bz(100); Busy.done();
                 });};
             });
             return;
         };

         av.onload=VOID; av.onload=fn;
         av.onload();

    }});
// --------------------------------------------------------------------------------------------------------------------------------------------



// evnt :: ready : fires once when dependencies are loaded
// --------------------------------------------------------------------------------------------------------------------------------------------
   listen("ready",function(evnt)
   {
      if(!MAIN.Anon){extend(MAIN)({Anon:{}})};
      bz(50);
      let list = decode.jso((`(~bootList~)`||`[]`));
      let stms = [...(new Set([...list].map((item)=>{ return item.split("/")[1] })))];

      requires(list,(av,np,fn)=>
      {
         bz(60);
         renderPath();
         listen("boot",()=>
         {
             stms.map((stem)=>{ if (isKnob(MAIN[stem]) && isFunc(MAIN[stem].init)){ MAIN[stem].init() } });
         })
      });
   });
// --------------------------------------------------------------------------------------------------------------------------------------------



// font rendering issue hacking below .. for when the viewport width is odd pixel number
// --------------------------------------------------------------------------------------------------------------------------------------------
   listen("boot",function()
   {
      // listen("tick",function()
      // {
      // });
      //
      //
      // listen("resizeInit",function()
      // {
      // });

      dump("boot: init");

      server.listen('busy',function(d,w)
      {
          if(!isJson(d)){return}; d=decode.jso(d); w=d.with; d=d.done;
          if(!isText(w,1)||!isInum(d)){return};
          if(server.silent[w]){return};
          Busy.edit(w,d);
      });


      server.listen('done',function(d){if(d!="!"){dump(`\nserver is done with:\n${d}`)}; Busy.done();});
      server.listen('dump',function(d, v){v=(isJson(d)?decode.jso(d):sval(d)); dump(v)});
      server.listen("SoftwareUpdate: sudo,lead,gang",function(d){signal("SoftwareUpdate",d);});
      server.listen("lockAllClients",function(d, pt,lm,el,id,et)
      {
          // dump(`signal-handler: lockAllClients ${d}`);
          id="#AnonSystemLock"; el=select(id);
          if(d=="end")
          {
              // server.vivify();
              remove(el); return
          };

          if(!!el){dump(`lockAllClients already applied .. ignoring ${lm}`); return};
          // server.pacify();
          if(!isin(d,":")){d=(d+':system locked')}; pt=stub(d,":"); lm=pt[2]; d=pt[0];
          et=(userDoes("sudo")?select("#AnonMainPanl"):document.body);
          et.insert({div:`${id} .layr`,$:
          [
              {div:`.cenmid .cntrChld`, style:{marginBottom:50}, $:
              [
                  {icon:`lock1`, size:40},
                  {p:``, style:{marginTop:10}, $:lm},
                  {tiny:`one moment please`},
              ]}
          ]});
      });


      listen("SoftwareUpdate",function(d)
      {
          d=d.detail; if(d==OK){return};
          if(!isJson(d)){console.error(`SoftwareUpdate fail: ${d}`); return};
          d=decode.jso(d); dump("SoftwareUpdate signal handler triggered");

          if(!select("#AnonPanlSlab"))
          {
              let mbtn,bico,uspn; mbtn=select("#AnonMenuKnob"); bico=mbtn.icon; uspn=d.diff.split("\n").length;
              remove("#AnonMenuKnobInfo"); mbtn.notify({icon:uspn},NEED,TR,{id:"AnonMenuKnobInfo"});
              return;
          };


          popModal(`cog :: New Updates`)
          ({
              body:[{panl:
              [
                  {h2:`${d.from} Updates available`},
                  {b:`${d.mesg}<br><br>`},
                  {pre:d.diff},
                  {p:`<br>You can merge this for testing, or install now.`},
              ]}],
              foot:
              [
                  {butn:`.good`, text:"Just Fuse", onclick:function(e,s)
                  {
                      Busy.edit("SoftwareUpdate",0); s=this; d.type="fuse";
                      purl("/Proc/update",d,(r)=>
                      {
                          Busy.edit("SoftwareUpdate",100); r=r.body;
                          if(r!=OK){fail("SoftwareUpdate: "+r); s.root.exit(); return;};
                          popAlert(`thumbs-up :: fuse-repo updated : New updates are available for testing, not live.`);
                          s.root.exit();
                      });
                  }},
                  {butn:`.warn`, text:"Install", onclick:function(e,s)
                  {
                      Busy.edit("SoftwareUpdate",0); s=this; d.type="full";
                      purl("/Proc/update",d,(r)=>
                      {
                          Busy.edit("SoftwareUpdate",100); r=r.body;
                          if(r!=OK){fail("SoftwareUpdate: "+r); s.root.exit(); return;};
                          // popAlert(`thumbs-up :: web-root repo updated : New updates are installed and running live.`);
                          s.root.exit();
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


      server.listen("siteEvent: sudo",function(d, v)
      {
          v=(isJson(d)?decode.jso(d):sval(d));
          if(v.USERNAME==sesn("USER")){dump("otherSiteEvent - ignored for listener"); return;};
          signal("otherSiteEvent: sudo",v);
      });


      server.listen("href",function(d)
      {
          window.location.href=d;
      });


      // listen("AnonSiteViewUnload",function(evnt){});
      // listen("AnonSiteViewLoaded",function(evnt){});

      listen("serverReady",()=>
      {
          MAIN.BOOTED = true;
          dump("boot: done"); signal("loaded");
      });

      server.vivify();

   });
// --------------------------------------------------------------------------------------------------------------------------------------------
