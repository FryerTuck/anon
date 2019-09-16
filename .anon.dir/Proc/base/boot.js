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
            if(MAIN.HALT){return}; if(!e.detail){return};
            l=e.detail.addedNodes; if(isList(l)){l=listOf(l);}else{return}; // validate
            this.walk(l); // check all new nodes - including their children
            tick.after(50,()=>{ordained.vivify()}); // anoint the ordained ones (if any)
         }
         .bind
         ({
            walk:function(l,p, s,k)
            {
               s=this; l.forEach((n)=>{let t=nodeName(n); if(!t||(p=='svg')){return}; s.fire(n,t);
               k=listOf(n.childNodes); if(k.length>0){s.walk(k,t)}});
            },

            fire:function(n,tn, pr)
            {
               if(!!n._waiting){return}; pr=path(n.src||n.href); if(pr){n.purl=pr}; n._waiting=function(t, p,s)
               {
                  p=this.purl; s=this;
                  if(!p||(t=='a')){tick.after(1,()=>{s.signal('ready')}); delete s._waiting; return};
                  s.listen('error',function(){this.failed=1; Busy.tint('red'); this.signal('load')}); // onfail
                  s.listen('load',ONCE,function()
                  {this.done=100; delete this._waiting; this.loaded=1; if(!this.failed){tick.after(250,()=>{this.signal('ready')})}});
                  let tmo,itv; tmo=tick.after(750,()=>{clearInterval(itv); delete s._waiting; dump(`delayed: ${p}`);});
                  itv=tick.every(10,()=>
                  {
                     if(s.done<100){return}; clearInterval(itv); clearTimeout(tmo); delete s._waiting;
                     if(s.loaded){return;}; tick.after(250,()=>{if(s.loaded){return}; s.signal('ready')});
                  });
               };
               n._waiting(tn);
            }
         }));


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
