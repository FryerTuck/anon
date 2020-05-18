"use strict";



// hack :: protection : hijack some functions and methods that can be used against us using dev-tools and address-bar
// --------------------------------------------------------------------------------------------------------------------------------------------
   select('script').forEach((n)=>{remove(n)});
   hijack(['eval','Element.prototype.appendChild','Element.prototype.setAttribute','Element.prototype.addEventListener','XMLHttpRequest.prototype.open'],function()
   {if(stak(0)){return listOf(arguments)}; wack()});
// --------------------------------------------------------------------------------------------------------------------------------------------



// defn :: conf : front-end configuration
// --------------------------------------------------------------------------------------------------------------------------------------------
   const conf = // object
   {
      {:'/Proc/conf/viewConf':}
   };

   const badCfg='{:badCfg:}';

   globVars({mime:decode.jso(`{:conf('Proc/mimeType'):}`)});
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
   (function(l)
   {
      Cookies.set(sesn('HASH'),'...');
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


         listen('procFail',function(e)
         {
            Busy.done(); MAIN.HALT++; if(MAIN.HALT>2){return};
            let hint=`An error was triggered and for some reason it was not handled.`;

            let apnd=`This could be trivial, but may cause issues with your session.
                      - if you have no unsaved progress, just hit the "refresh" button below
                      - you can also close/ignore this prompt and manually refresh later
                      - if this recurs, hit "report bug and refresh" .. it's immediate and anonymous

                      What will you do?`;

            let info=e.detail; let mesg=info.mesg; let nick=(info.evnt||info.name||"Unknown").split("Error").join("");

            if(!userDoes('geek','sudo')){mesg=hint;}else
            {
                console.error(info);
                mesg+=("<br><br>\n\n```\n"+`file: ${info.file}\nline: ${info.line}`+"\n```\n\n<br>");
                mesg+=("\n\n```\n"+info.stak.join("\n")+"\n```\n\n<br>");
            };
            mesg+=`\n\n${apnd}`;
            popConfirm(`${nick} Fail`,mesg,`dark`,`auto`,`bug`,`500x260`)
            ({
               'need::report bug and refresh':function(ce, fm)
               {
                  fm="Failed to report bug :(\n\nPlease contact tech support:\n{:TECHMAIL:}";
                  try{purl("/Proc/makeTodo",{mesg:btoa(encode.jso(e.detail))},(r)=>
                  {
                     dump(r.body);
                     if(r.body!=OK){alert(fm);return}; newGui({APIKEY:sesn('HASH')});
                  });}catch(err){alert(fm);};
               },
               'warn::refresh':function(){newGui({APIKEY:sesn('HASH')});},
               'harm::ignore':function(){this.root.exit();},
            });
         });


         extend(MAIN)({focusObj:{hash:VOID,node:VOID}});

         tick.every(100,function()
         {
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
      let bl=decode.JSON(('{:bootList:}'||'[]'));
      extend(MAIN)({Anon:{}}); bz(50);
      requires(bl,()=>
      {
         bz(60);
            console.clear();
         let np=location.href; render(np,(r)=>
         {
            let mv=select('#anonMainView'); mv.insert(r);
            bz(80);
            tick.after(250,()=>
            {
               window.BOOTED=1;
               signal("boot");
               bz(100);
               Busy.done();
            });
         });
      });
   });
// --------------------------------------------------------------------------------------------------------------------------------------------
