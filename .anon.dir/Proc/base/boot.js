"use strict";



// hack :: protection : hijack some functions and methods that can be used against us using dev-tools and address-bar
// --------------------------------------------------------------------------------------------------------------------------------------------
   select('script').forEach((n)=>{remove(n)});
   hijack(['eval','Element.prototype.appendChild','Element.prototype.setAttribute','XMLHttpRequest.prototype.open'],function()
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
            if(MAIN.HALT){return}; if(!e.detail||(e.detail.type!='childList')){return};
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
                  s.listen('load',ONCE,function()
                  {
                     this.done=100; delete this._waiting; this.loaded=1; if(this.failed){return};
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


         // ordain('.parentSize')
         // ({
         //    onidle:function()
         //    {
         //       let bx=rectOf(this.parentNode); if(!bx){return};
         //       this.setStyle({width:bx.width,height:bx.height});
         //    },
         // });


         listen('procFail',function(e)
         {
            Busy.done();
            let hint=`An error was triggered and for some reason it was not handled.`;

            let apnd=`This could be trivial, but may cause issues with your session.
                      - if you have no unsaved progress, just hit the "refresh" button below
                      - you can also close/ignore this prompt and manually refresh later
                      - if this recurs, hit "report bug and refresh" .. it's immediate and anonymous

                      What will you do?`;

            let info=e.detail; if(!userDoes('geek','sudo')){info.mesg=hint}
            else{info.mesg+=("<br><br>\n\n```"+`\nfile: ${info.file}\nline: ${info.line}\n`+"```\n\n<br>")};
            info.mesg+=`\n\n${apnd}`;
            popConfirm(`${info.name} Fail`,info.mesg,`dark`,`harm`,`bug`,`500x250`)
            ({
               'need::report bug and refresh':function(){dump('bug'); newGui({APIKEY:sesn('HASH')});},
               'warn::refresh':function(){newGui({APIKEY:sesn('HASH')});},
               'harm::ignore':function(){this.root.exit();},
            });
         });



         l=decode.JSON(('{:bootList:}'||'[]')); requires(l,()=>
         {
            let np=pathOf(location.href); render(np,(r)=>
            {
               let mv=select('#anonMainView'); mv.insert(r);
               Busy.done();
            });
         });
      });
   }());
// --------------------------------------------------------------------------------------------------------------------------------------------




// defn :: (event:focuschange) : define an event emitter that signals "focuschange" when focus changes on any node
// --------------------------------------------------------------------------------------------------------------------------------------------
   globVars({focussed:{hash:VOID,node:VOID}});
   tick.every(10,function()
   {
      let e=document.activeElement; if(!e){return}; if(!e.UniqueID){e.modify({UniqueID:('NODE'+fash())}); harden('UniqueID',e)};
      if(globVars('focussed').hash==e.UniqueID){return};
      globVars('focussed').hash=e.UniqueID; globVars('focussed').node=e; signal('focuschange',e);
   });
// --------------------------------------------------------------------------------------------------------------------------------------------




// evnt :: key:Esc : hide on-escape
// --------------------------------------------------------------------------------------------------------------------------------------------
   listen('key:Esc',function(evnt){tick.after(1,(dc,je,se,fe)=>
   {
      dc=1; je=evnt.jacked; if(isText(je)){je=select(je)}; se=evnt.srcElement;
      fe=globVars('focussed').node; if(isNode(je)&&(je.houses(se)||je.houses(fe))){dc=0};
      if(!dc){return}; // hijacked .. we no longer have control here

      if(Busy.node){Busy.kill(); return};
      let mnu=select('#AnonDropMenu'); if(mnu){remove(mnu);return};
      let mdl=select('modal'); if(mdl){vals(mdl,-1).exit();return};
      AnonPanl.hide();
   })});
// --------------------------------------------------------------------------------------------------------------------------------------------
