"use strict";



// hack :: protection : hijack some functions and methods that can be used against us using dev-tools and address-bar
// --------------------------------------------------------------------------------------------------------------------------------------------
   select('script').forEach((n)=>{remove(n)}); extend(Element.prototype)
   ({
      appendChild:function(n){return proc('add',n,this)},
      setAttribute:function(k,v){return proc('mod',[k,v],this)}
   });
   extend(XMLHttpRequest.prototype)({open:function(m,u){return proc('xhr',[m,u],this)}});
// --------------------------------------------------------------------------------------------------------------------------------------------



// defn :: conf : front-end configuration
// --------------------------------------------------------------------------------------------------------------------------------------------
   const conf = // object
   {
      {:'/Proc/conf/viewConf':}
   };
// --------------------------------------------------------------------------------------------------------------------------------------------



// defn :: view : structure
// --------------------------------------------------------------------------------------------------------------------------------------------
   select('body')[0].insert
   ([
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
                     tick.after(250,()=>{this.signal('ready'); tick.after(10,()=>{this.signal('idle')});});
                  });

                  let tmo,itv; tmo=tick.after(750,()=>{clearInterval(itv); delete s._waiting; dump(`delayed: ${p}`);});
                  itv=tick.every(10,()=>
                  {
                     if(s.done<100){return}; clearInterval(itv); clearTimeout(tmo); delete s._waiting;
                     if(s.loaded){return;}; tick.after(250,()=>
                     {if(s.loaded){return}; s.loaded=1; s.signal('ready'); tick.after(10,()=>{s.signal('idle')});});
                  });
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
