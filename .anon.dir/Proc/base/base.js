
// incl :: abec : tools
// --------------------------------------------------------------------------------------------------------------------------------------------
{:'/Proc/base/abec.js':}
// --------------------------------------------------------------------------------------------------------------------------------------------



// "use strict"; .. already defined in abec.js


// shiv :: Cookies : https://github.com/js-cookie/js-cookie
// --------------------------------------------------------------------------------------------------------------------------------------------
   !function(e){var n=!1;if("function"==typeof define&&define.amd&&(define(e),n=!0),"object"==typeof exports&&(module.exports=e(),n=!0),!n){var o=window.Cookies,t=window.Cookies=e();t.noConflict=function(){return window.Cookies=o,t}}}(function(){function g(){for(var e=0,n={};e<arguments.length;e++){var o=arguments[e];for(var t in o)n[t]=o[t]}return n}return function e(l){function C(e,n,o){var t;if("undefined"!=typeof document){if(1<arguments.length){if("number"==typeof(o=g({path:"/"},C.defaults,o)).expires){var r=new Date;r.setMilliseconds(r.getMilliseconds()+864e5*o.expires),o.expires=r}o.expires=o.expires?o.expires.toUTCString():"";try{t=JSON.stringify(n),/^[\{\[]/.test(t)&&(n=t)}catch(e){}n=l.write?l.write(n,e):encodeURIComponent(String(n)).replace(/%(23|24|26|2B|3A|3C|3E|3D|2F|3F|40|5B|5D|5E|60|7B|7D|7C)/g,decodeURIComponent),e=(e=(e=encodeURIComponent(String(e))).replace(/%(23|24|26|2B|5E|60|7C)/g,decodeURIComponent)).replace(/[\(\)]/g,escape);var i="";for(var c in o)o[c]&&(i+="; "+c,!0!==o[c]&&(i+="="+o[c]));return document.cookie=e+"="+n+i}e||(t={});for(var a=document.cookie?document.cookie.split("; "):[],s=/(%[0-9A-Z]{2})+/g,f=0;f<a.length;f++){var p=a[f].split("="),d=p.slice(1).join("=");this.json||'"'!==d.charAt(0)||(d=d.slice(1,-1));try{var u=p[0].replace(s,decodeURIComponent);if(d=l.read?l.read(d,u):l(d,u)||d.replace(s,decodeURIComponent),this.json)try{d=JSON.parse(d)}catch(e){}if(e===u){t=d;break}e||(t[u]=d)}catch(e){}}return t}}return(C.set=C).get=function(e){return C.call(C,e)},C.getJSON=function(){return C.apply({json:!0},[].slice.call(arguments))},C.defaults={},C.remove=function(e,n){C(e,"",g(n,{expires:-1}))},C.withConverter=e,C}(function(){})});
   Cookies.defaults.path='/'; harden('Cookies');

   extend(MAIN)
   ({
      cookie:
      {
         exists:function(b,v){v=Cookies.get(b); return isVoid(v);},
         create:function(b,a,c,d){Cookies.set(b,btoa(JSON.stringify(a)),{expires:c||null,path:d||"/"}); return true;},
         update:function(b,a,c,d){Cookies.set(b,a,{expires:c||null,path:d||"/"}); return true;},
         delete:function(b,a){return Cookies.remove(b,{path:a||"/"})},
         select:function(b, r,v,t)
         {
            if(b=='*'){b=VOID}; r=Cookies.get(b); if(isVoid(r)){return}; if((b==VOID)){try{v=JSON.parse(atob(r))}catch(e){v=r}; return v};
            r.each((v,k)=>{try{t=JSON.parse(atob(v))}catch(e){t=v}; r[k]=t;}); return r;
         },
      }
   });
// --------------------------------------------------------------------------------------------------------------------------------------------



// incl :: RequireJS : dynamic dependency loader
// --------------------------------------------------------------------------------------------------------------------------------------------
// '/Proc/libs/require/require.js'
// --------------------------------------------------------------------------------------------------------------------------------------------



// tool :: copyToClipboard : use like: `copyToClipboard('whatever')`
// --------------------------------------------------------------------------------------------------------------------------------------------
   const copyToClipboard = str =>
   {
     const el=document.createElement('textarea'); el.value=str; el.setAttribute('readonly',''); el.style.position='absolute';
     el.style.left='-9999px'; document.body.appendChild(el); el.select(); document.execCommand('copy'); document.body.removeChild(el);
   };
// --------------------------------------------------------------------------------------------------------------------------------------------



// tool :: xdom : xml-to-dom elements
// --------------------------------------------------------------------------------------------------------------------------------------------
   const xdom = function(v)
   {
      if(isText(v)){v=v.trim()}; if(wrapOf(v)!='<>'){return};
      let n=document.createElement('div'); n.innerHTML=v; let l=listOf(n.childNodes); let r=[]; l.forEach((i)=>
      {
         let t=i.nodeName.toLowerCase(); if((t=='#text')&&(i.textContent.trim()=='')){return}; // whitespace
         if(t=='script'){t=i.innerHTML; i=VOID; i=document.createElement('script'); i.innerHTML=t; t='script'}; // permission
         r.push(i);
      });
      return r;
   };
// --------------------------------------------------------------------------------------------------------------------------------------------



// tool :: (Array.prototype) : select
// --------------------------------------------------------------------------------------------------------------------------------------------
   extend(Array.prototype)
   ({
      select:function(x)
      {
         if(!isText(x,1)||(this.length<1)||!isNode(this[0])){return}; let c,r; c=x[0]; r=[];
         if(!isin(['#','.'],c)){c=VOID}; if(c){x=x.substring(1)}; this.forEach((i)=>
         {
            let n=(isNode(i)?i.nodeName.toLowerCase():(isKnob(i)?keys(i)[0]:VOID)); if(!n){return};
            if(!c){if(x==n){r.push(n)};return}; if((c=='#')&&(x==n)){r.push(n);return}; if((c=='.')&&isin(i.className(x))){r.push(n);return};
         });
         return r;
      },
   });
// --------------------------------------------------------------------------------------------------------------------------------------------



// func :: userDoes : assert if the current user is in a clan -or list of clans .. can be given string, or multiple args or array
// --------------------------------------------------------------------------------------------------------------------------------------------
   const userDoes = function()
   {
      let a=listOf(arguments); if(a.length<1){return}; if(isList(a[0])){a=a[0]}; if(a.length<1){return}; // validate
      if((a.length<2)&&isText(a[0])&&isin(a[0],',')){a=a[0]; a=a.split(' ').join('').split(',')}; // correct
      let l,n,f,c; l=[]; n=[]; a.forEach((i)=>{if(f||!isText(i,4)){f=1;return}; c=i[0]; i=ltrim(i,'!'); l.push(i); if(c=='!'){n.push(i)}});
      if(f){fail('invalid clan assertion');return}; let r=isin(sesn('CLAN'),l); if(n.length<1){return r};
      if(r&&isin(n,r)){return false}; if(r){return ('!'+r)}; return a.join(',');
   };
// --------------------------------------------------------------------------------------------------------------------------------------------



// func :: nodeName : of node/knob
// --------------------------------------------------------------------------------------------------------------------------------------------
   const nodeName = function(o)
   {
      if(isNode(o)){return o.nodeName.toLowerCase()}; if(isKnob(o)){return keys(o)[0]};
   };
// --------------------------------------------------------------------------------------------------------------------------------------------



// func :: purl : process/path-URL
// --------------------------------------------------------------------------------------------------------------------------------------------
   const purl = function(p,d,f, o,x,e,cb,pe)
   {
      if(MAIN.HALT){return};
      if(isText(p)&&isVoid(d)&&isVoid(f)){o={target:p,method:'GET',listen:{}}} // only URL given
      else if(isText(p)&&isFunc(d)&&isVoid(f)){o={target:p,method:'GET',listen:{loadend:d}}} // URL + callback
      else if(isText(p)&&isKnob(d)&&isVoid(f)){o=d; o.target=p; if(!isKnob(o.listen)){o.listen={}};} // URL + options
      else if(isText(p)&&isKnob(d)&&isFunc(f)){o={target:p,method:'POST',convey:d,listen:{loadend:f}}} // URL + data + callback
      else if(isKnob(p)&&isFunc(d)&&isVoid(f)){o=p; if(!isKnob(o.listen)){o.listen={}}; o.listen.loadend=d} // options + callback
      else if(isKnob(p)&&isVoid(d)&&isVoid(f)){o=p}; // options only

      e='invalid purl arguments'; if(!isKnob(o)){fail(e);return}; if(!isText(o.target,1)){fail(e);return}; // validate
      if(!isKnob(o.listen)){fail(e);return}; if(!isFunc(o.listen.loadend)){fail(e);return}; // validate
      if(!isFunc(o.listen.progress)){o.listen.progress=function(){}}; pe=o.listen.progress; delete o.listen.progress;

      o.listen.progress=function(b)
      {
         if(!this.done){this.done=0}; let q=(Math.floor(b.loaded/b.total)*100);
         if(this.done<q){this.done=q};pe(q,this.purl); if(this.busy&&!!MAIN.Busy){Busy.edit(this.purl,q)};
      };

      cb=o.listen.loadend; delete o.listen.loadend; o.listen.loadend=function() // event done
      {
         let h=dval(this.getAllResponseHeaders()); if((h!=null)&&h.Cookies){h.Cookies=decode.jso(decode.b64(h.Cookies))};
         let r={path:this.purl,head:h,body:this.response}; if(!this.done){this.done=0};
         if((this.status==200)&&(this.done<100)){pe(100,this.purl);if(this.busy&&!!MAIN.Busy){Busy.edit(this.purl,100)};};
         if(x.silent){tick.after(250,()=>{delete server.silent.busy})};
         if(MAIN.HALT){return}; cb(r);
      };

      if(o.silent){server.silent.busy=1};
      if(!o.method){o.method='POST'}; if(!o.expect){o.expect='text'}; if(!isKnob(o.header)){o.header={}}; // method, responseType, headerOBJ
      if(!o.header.INTRFACE){o.header.INTRFACE='API'}; x=(new XMLHttpRequest()); x.open(o.method,o.target);
      // x.withCredentials=true;
      x.responseType=o.expect;
      x.purl=o.target; o.listen.each((v,k)=>{x.addEventListener(k,v)}); o.header.each((v,k)=>{x.setRequestHeader(k,v)}); // events, headers
      x.silent=o.silent; tick.after(500,()=>{if(x.done&&(x.done>99)){return}; x.busy=(x.silent?0:1)}); // show busy if true
      x.send((isKnob(o.convey)?encode.JSON(o.convey):VOID)); // dispatch request
   };
// --------------------------------------------------------------------------------------------------------------------------------------------



// func :: entity : creates new event emitter .. o is (optional) properties object
// --------------------------------------------------------------------------------------------------------------------------------------------
   const entity = function(o, r)
   {r=(new EventTarget()); if(isKnob(o)){for(var k in o){r[k]=o[k];}}; return r;};
// --------------------------------------------------------------------------------------------------------------------------------------------



// tool :: (events)
// --------------------------------------------------------------------------------------------------------------------------------------------
   extend(EventTarget.prototype)
   ({
      signal:function(e,d,o, n,self,evnt)
      {
         self=(this||MAIN); expect.word(e); n=('on'+e); if(isText(d)&&isin([ONCE,EVRY],d)){o=d;d=VOID};
         if(o!=EVRY){o=ONCE}; if((d!==VOID)&&!d.detail){d={detail:d}}; evnt=(d?(new CustomEvent(e,d)):(new Event(e)));
         if(self[n]&&isFunc(self[n])){self[n].apply(self,[evnt]);
         if(o==ONCE){if(self[n].__evntID){delete listen.jobs[self[n].__evntID]};self[n]=null}; return;};
         self.dispatchEvent(evnt);
      },


      listen:function(evt,opt,hash,cbf, self,obst,fltr)
      {
         if(isNode(this)&&isKnob(evt))
         {
            evt.each((ef,en)=>{this.listen(en,ef)}); return this;
         };

         if(isFunc(evt)){cbf=evt;evt=VOID}; if(isFunc(opt)){cbf=opt;opt=EVRY}else if(isKnob(opt)){fltr=opt; opt=EVRY};
         if(!listen.jobs){extend(listen)({jobs:{},hash:function(f,x){this.x+=1; return sha1(this.x+cbf.toString())}.bind({x:0})})};
         if(isFunc(hash)){cbf=hash;hash=VOID}; self=(this||MAIN); if(!isText(hash)){hash=listen.hash(cbf)}else{cbf=listen.jobs[hash]};
         if(!opt){opt=EVRY}else if(!isin([ONCE,EVRY],opt)){opt=EVRY}; expect.func(cbf); if(evt==VOID){evt=AUTO}; let ice;
         if(evt==AUTO){evt=keys(self,AUTO,'on*');}; if(!isList(evt)){if(isin(evt,' ')){ice=evt; evt=['keydown','mousedown']}else{evt=[evt]}};
         if(!self.events){self.events={}}; obst=this; if(!!obst&&!obst.listensFor){obst.listensFor=[]};
         if(!!obst&&!!ice){radd(obst.listensFor,ice)}; evt.forEach((e)=>
         {
            if(e.slice(0,2)=='on'){e=e.slice(2)}; self.events[e]=hash; if(!!obst&&!!ice){radd(obst.listensFor,e)};
            listen.jobs[hash]=[e,cbf]; let alt=VOID;

            if(obst&&(e=='dragstart')){obst.draggable=true; obst.setAttribute('draggable',true);};
            if(obst&&((e=='drop')||(e=='feed'))){obst.onFeed(cbf);return};

            if(isin(e,['down','up','key','click','Click','contextmenu','mouse','Mouse','wheel']))
            {
               let kpr; if(isin(e,'key')&&isin(e,':')){kpr=stub(e,':'); e=kpr[0]; kpr=kpr[2]; if(e=='key'){e='keydown'}};
               if(e=='LeftClick'){e='click';}else if(e=='RightClick'){e='contextmenu'};

               alt=function(evnt)
               {
                  let evn,btn,tgt,kcl,hcn,cmb,dev,crd,rpt,pvk,rkc,rsp,grb,key; evn=evnt.type; tgt=evnt.target; cmb=[];
                  dev=(isin(evn,'key')?'keyboard':'pointer'); pvk=this.pvk; rpt=evnt.repeat; key=this.kpr;
                  if((evnt instanceof MouseEvent)||(evnt instanceof WheelEvent)){dev='pointer'};
                  if(dev=='keyboard')
                  {
                     btn=evnt.key; if(btn==' '){btn='Space'};
                     if(key&&(btn.slice(0,key.length)==key)){key=btn}else{key=VOID};
                     if(!this.ice&&this.kpr){if(key==btn){this.run(evnt);};return};
                  }
                  else
                  {
                     // if(evnt.ctrlKey){grb=1};
                     if(evnt.which==null){btn=((evnt.button<2)?"LeftClick":((event.button==4)?"MiddleClick":"RightClick"))}
                     else{(btn=(evnt.which<2)?"LeftClick":((evnt.which==2)?"MiddleClick":"RightClick"))};
                     if((evnt.type=='mousewheel')||(evnt.type=='wheel')){btn='MouseWheel'}else if(evnt.type=='mousemove'){btn='MouseMove'};
                     crd=[evnt.clientX,evnt.clientY]; if(btn=='MouseWheel')
                     {
                        // dump(evnt);
                        let x=(Math.round(evnt.deltaX)||0); let y=(Math.round(evnt.deltaY)||0); if(!x){x=0;}; if(!y){y=0;};
                        if(evnt.deltaMode==1){x*=12; y*=12}; crd=[x,y];
                     };
                  };

                  if((btn=='RightClick')){grb=1;};
                  kcl={ctrlKey:'Control',shiftKey:'Shift',metaKey:'Meta',altKey:'Alt'};
                  kcl.each((v,k)=>{if(evnt[k]||isin(btn,v)){cmb.push(v)}; if(isin(btn,v)){hcn=1}});
                  if((span(cmb)>0)&&!rpt&&!hcn){if(!isin(pvk,btn)){pvk.push(btn)}; this.pvk=pvk; cmb=cmb.concat(pvk);};

                  cmb=cmb.join(' ').trim(); if(!isin(cmb,' ')){cmb=VOID}; if(!cmb){this.pvk=[];}; if(cmb&&rpt){return};
                  evnt.device=dev; evnt.signal=(cmb||btn); evnt.coords=crd;
                  if(!this.ice){this.run(evnt,grb); return};
                  if(cmb&&(this.ice==cmb)){grb=1; this.run(evnt,grb); return};
                  return;
               }
               .bind({tgt:self,cbf:cbf,ice:ice,pvk:[],kpr:kpr,run:function(fe,ge)
               {
                  if(ge){fe.preventDefault(); fe.stopPropagation();};
                  fe.Target=fe.currentTarget; this.cbf.apply(this.tgt,[fe]);
                  return false;
               }});
            };

            if(!alt)
            {
               alt=function(evnt){evnt.Target=evnt.currentTarget; this.cbf.apply(this.tgt,[evnt]);}.bind({tgt:self,cbf:cbf});
               if(isin(e,'mutation'))
               {
                  alt.worker=(new MutationObserver(function(l)
                  {
                     let q=addStack.log; if(!fubu('worker.MutationObserver.bind')){wack();return}; addStack.log=q;

                     let k,v,h,r; for(var m of l)
                     {
                        if(!this.flt){this.tgt.signal(this.evt,{detail:m});continue};
                        k=keys(this.flt)[0]; v=this.flt[k]; h=m[k]; r=[]; if(!h||(h.length<1)){continue}; h=listOf(h);
                        h.each((n)=>{let x=n.select(v); if(!isList(x)){x=[x]}; r=r.concat(x)}); if(r.length<1){continue};
                        this.tgt.signal(this.evt,{detail:r});
                     };
                  }.bind({tgt:(obst||self),evt:e,flt:fltr})));
                  alt.worker.observe((obst||document.documentElement),{childList:true,subtree:true,attributes:true});
               };
            };

            listen.jobs[hash][1]=alt;

            if(opt==EVRY){self.addEventListener(e,listen.jobs[hash][1],true);return};
            if(opt==ONCE){self[('on'+e)]=listen.jobs[hash][1]; self[('on'+e)].__evntID=hash;return};
         });
         return hash;
      },


      ignore:function(e,f, n,self,hash,x)
      {
         expect.text(e); self=(this||MAIN); if(!self.events){self.events={}};
         if(isFunc(f)){hash=sha1(f.toString());}else{hash=(!!listen.jobs[e]?e:self.events[e])};
         x=listen.jobs[hash]; if(!x){fail('event hash `'+hash+'` is undefined');return};
         if(f===VOID){e=x[0]; f=x[1]}; expect.word(e); expect.func(f); n=('on'+e);
         if(self[n]===f){self[n]=VOID}else{self.removeEventListener(e,f,true);}; delete listen.jobs[hash];
         if(!self.seized){self.seized={}}; self.seized[e]=1; return true;
      },
   });
// --------------------------------------------------------------------------------------------------------------------------------------------



// tool :: server : listen & trigger server events .. `server.listen()` happens on a single stream which is used to listen on multiple events
// --------------------------------------------------------------------------------------------------------------------------------------------
   extend(MAIN)
   ({
      server:
      {
         ostime:(("{:BOOTTIME:}").split('.')[0]*1),
         stream:VOID,
         sensor:{},
         silent:{},
         hashes:{},


         vivify:function(f)
         {
            if(!!this.stream&&isFunc(f)){f(this.stream);return}; let p=('/Proc/listen');

            this.stream=(new EventSource(p,{withCredentials:true})); this.stream.purl=p; server.sensor.live=0;
            // this.stream.listen('open',function(evnt){});
            this.stream.listen('ping',function(evnt){server.sensor.live=1});
            this.stream.listen('shut',function(evnt){server.stream.close(); server.sensor.live=0});
            this.stream.listen('fail',function(evnt){if(MAIN.Busy){Busy.tint('red')}; fail(atob(evnt.data));});

            this.stream.listen('error',function(evnt) // this happens on reconnect -or "connection fail", only the latter is an error
            {
               if(!server.sensor.live)
               {
                  server.stream.close(); // prevent reconnect flood for in case the server disconnects upon connect
                  purl(evnt.Target.purl,(rsp)=>
                  {
                     // debug this issue by visiting the event emitter via API interface
                     fail('server event emitter `'+evnt.Target.purl+'` has issues\n\nDetails:\n'+(rsp.body||'undefined'));
                  });
               };
            });

            if(isFunc(f)){f(this.stream);};
         },


         listen:function(e,f,h, t)
         {
            if(isFunc(h)){t=f; f=h; h=t;}; // swapped args
            if(isText(h,1)&&!!server.hashes[h]){return}; // already listening for this
            if(!isWord(e)){fail('expecting 1st arg as :word:');return}; if(!isFunc(f)){fail('expecting 2nd arg as :func:');return};
            this.vivify(()=>{server.stream.addEventListener(e,function(evnt){let d=dval(atob(evnt.data)); this.cb(d);}.bind({cb:f}),false);});
            if(!isText(h,1)){return}; server.hashes[h]=1;
         },


         signal:function(e,d,t)
         {
            if(!isWord(e)){fail('SignalError: expecting 1st arg as word');return};
            if(!isKnob(d,1)){fail('SignalError: expecting 2nd arg as non-empty object');return};
            if(isText(t,1)&&((t!=='*')&&(t[0]!=='#')&&(t[0]!=='.')))
            {fail('SignalError: invalid target,\nexpecting any 1 of: `*`, `#userName`, `.clanName`');return};

            purl({target:'/Proc/signal', method:'POST', convey:{evnt:e,data:btoa(encode.JSON(d)),trgt:(t||null)}}, function(r)
            {
               if(r.body!=OK){fail(r.body)};
            });
         },
      },
   });

   const UNIQUE = ':UNIQUE:';

   tick.after(1500,function()
   {
      server.listen('busy',function(d){if(server.silent.busy){return}; Busy.edit(d.with,d.done)});
      server.listen('done',function(d){Busy.done();});
      server.listen('dump',function(d){dump(d)});
   });

   setInterval(()=>{server.ostime+=1;},1000);
// --------------------------------------------------------------------------------------------------------------------------------------------



// func :: requires : versatile preloader
// --------------------------------------------------------------------------------------------------------------------------------------------
   const requires = function(l,cbfn, s,a,slf,d)
   {
      if(MAIN.HALT){return}; addStack(); if(!isFunc(cbfn)){cbfn=function(){}}; slf=this; a={}; d=0;
      if(!l||(span(l)<1)){f();return}; if(!isList(l)){l=[l]}; //dump(`${this.decr} ${s}`,'\n');
      l.each((i)=>
      {
         let p=stub(i,':'); if(p){i=p[2]; p=p[0]; a[p]=VOID}; let x=fext(i);
         if(x=='fnt'){x='css'}; if(!x){fail('expecting valid path');return STOP}; // validate
         if(slf.done[i]){return}; d++; let t=VOID;

         if(x=='js')
         {
            if(p)
            {
               // require.config({paths:{[p]:i}});
               // require([i],function(m){extend(MAIN)({[(this.nick)]:m}); d--; slf.done[this.purl]=1; a[this.nick]=m}.bind({nick:p,purl:i}));
            };
            let n=create('script'); n.purl=i; n.listen('ready',function(){d--; slf.done[this.purl]=1;});
            n.modify({src:i}); document.head.insert(n); return;
         };

         if(x=='css')
         {
            let n=create('link'); n.purl=i; n.listen('ready',function(){d--; slf.done[this.purl]=1});
            n.modify({rel:'stylesheet',href:i}); document.head.insert(n); return;
         };

         if((x=='htm')||(x=='html'))
         {
            purl(i,(r,d)=>
            {
               d=(xdom(r.body)||[]); d.forEach((n)=> // html - insert each element into its implied DOM parent
               {document[(isin(['script','style'],nodeName(n))?'head':'body')].insert(n);});
               tick.after(50,()=>{d--; slf.done[r.path]=1})
            }); return NEXT;
         };

         fail('unsupported file-extension `'+x+'`'); return STOP; // loop must not reach here
      });

      // if(slf.decr<1){f();return}; // if already loaded before - no need to wait any longer
      wait.until(()=>{return (d<1)},()=>{tick.after(250,()=>{cbfn()})});
   }
   .bind({call:{},done:{}});
// --------------------------------------------------------------------------------------------------------------------------------------------



// tool :: custom : library for custom `domtag` and `attrib` .. extend anywhere with: `extend(custom.domtag)({newtag:funcion(){}})`
// --------------------------------------------------------------------------------------------------------------------------------------------
   const custom = {domtag:{},attrib:{}};

   {:'/Proc/base/xtag.js':}

   {:'/Proc/base/xatr.js':}
// --------------------------------------------------------------------------------------------------------------------------------------------



// func :: create : create DOM nodes from string, list, object .. custom nodes are defined in `/Proc/base/xtag.js`
// --------------------------------------------------------------------------------------------------------------------------------------------
   const create = function(t,a,c, r,x,n)
   {
      if(MAIN.HALT){return};
      if(isList(t)){r=[]; t.forEach((o)=>{r.push(create(o,a,c))}); return r}; // list of nodes
      if(wrapOf(trim(t))=='<>'){return xdom(t)}; // xml to node-list
      if(isText(t,1)){t={[t]:(a||''),contents:c}}; if(!isKnob(t)){return}; // validate

      a=t; t=VOID; t=keys(a)[0]; n=document.createElement(t); // new element
      if(isList(a[t])){c=a[t];} // tag value is contents
      else if(isText(a[t],2)&&((a[t][0]=='#')||(a[t][0]=='.'))) // tag value is id and/or classes
      {
         x=a[t]; delete a[t]; if(!a.class){a.class=''}; a.class=a.class.split(' '); // quick id & non/existing classes
         x.split(' ').forEach((i)=>{c=i[0]; i=i.slice(1); if(c=='#'){a.id=i; a.name=i}else{a.class.push(i)}}); // set id/classes
         a.class=a.class.join(' ').trim(); c=a.contents; // normalized classes string - now containing `.class` if defined
      }
      else if(isText(a[t])&&isVoid(a.contents)){c=a[t];} // tag value is contents
      else if(!isVoid(a.contents)){c=a.contents}; // contents explicitly defined
      delete a[t]; delete a.contents; // tag-name and `contents` are not attributes, get rid of them

      let fc=a.forClans; if(!isVoid(fc)){delete a.forClans; if(!userDoes(fc)){return}}; // ignore if not for this user's clan
      // if(isKnob(a.style)){a.style.each((v,k)=>{n.style[k]=v}); delete a.style}; // style object
      if(isFunc(custom.domtag[t])){let dt=custom.domtag[t](n,a,c); if(dt==DONE){return n}}; // handle this node exclusively
      r=modify(n,a,c); // set this node's attributes, the result is the updated node
      if((r.childNodes.length<1)&&(c!=VOID)&&(c!='')){r=r.insert(c)}; // insert content if xtag & xatr did not
      return r; // done
   }
// --------------------------------------------------------------------------------------------------------------------------------------------



// func :: modify : define -or update exising DOM-node-attributes .. custom attributes are defined in `/Proc/base/xatr.js`
// --------------------------------------------------------------------------------------------------------------------------------------------
   const modify = function(n,a,c)
   {
      if(MAIN.HALT){return}; if(!isNode(n)||!isKnob(a)){return}; // validate
      let slog=getStack(); addStack.log=slog;
      a.each((v,k)=>
      {
         if(isFunc(custom.attrib[k])){if(!isVoid(custom.attrib[k](v,n,a,c))){return}}; // set attribute from custom, VOID returns get ignored
         // if(isin(['src','href'],k)&&v.startsWith('~/')){v=ltrim(v,'~/'); v=('/User/data/'+sesn('USER')+'/home/'+v);};
         if(!isFunc(v)&&!isKnob(v)&&(k!='innerHTML')){n.setAttribute(k,v);}; // normal attribute
         if(k=='class'){k='className'}; // prep attribute name for JS
         n[k]=v; // set attribute as property -which possibly triggers some intrinsic JS event
      });
      addStack.log=slog;
      return n;
   }

   extend(Element.prototype)
   ({
      modify:function(a)
      {
         return modify(this,a);
      },
   });
// --------------------------------------------------------------------------------------------------------------------------------------------



// tool :: (Element.prototype) : insert .. handy appendChild/innerHTML .. converts object/list/html to nodes .. converts non-text to text
// --------------------------------------------------------------------------------------------------------------------------------------------
   extend(Element.prototype)
   ({
      insert:function(v)
      {
         if(MAIN.HALT){return}; if(v==VOID){return this}; addStack(); let t=nodeName(this);
         if(isList(v)){var s=this; listOf(v).forEach((o)=>{s.insert(o)});return s}; // works with nodelist or list-of-anything
         this.signal('insert');
         if(t=='img'){return this}; // TODO :: impose?
         if(t=='input'){this.value=tval(v); return this}; // form input text
         if(isNode(v)){this.appendChild(v); return this}; // normal DOM-node append
         if(isKnob(v)){this.appendChild(create(v));return this}; // create it first then append
         if(isText(v)&&(wrapOf(trim(v))=='<>')){this.innerHTML=v; return this}; // convert html to nodes and try again
         if(!isText(v)){v=tval(v);}; // convert any non-text to text .. circular, boolean, number, function, etc.
         if(isin(['code','text'],t)){this.textContent=v; return this;}; // insert as TEXT
         if(isin(['style','script','pre','span','p','a','i','b'],t)){this.innerHTML=v; return this}; // insert as HTML
         let n=document.createElement('span'); n.innerHTML=v; this.appendChild(n); return this; // append text as span-node
      },
   });
// --------------------------------------------------------------------------------------------------------------------------------------------



// shim :: TextAreaElement : insertAtCaret
// --------------------------------------------------------------------------------------------------------------------------------------------
   extend(HTMLTextAreaElement.prototype)
   ({
      insertAtCaret:function(text)
      {
           text = text || '';
           if (document.selection) {
             // IE
             this.focus();
             var sel = document.selection.createRange();
             sel.text = text;
           } else if (this.selectionStart || this.selectionStart === 0) {
             // Others
             var startPos = this.selectionStart;
             var endPos = this.selectionEnd;
             this.value = this.value.substring(0, startPos) +
               text +
               this.value.substring(endPos, this.value.length);
             this.selectionStart = startPos + text.length;
             this.selectionEnd = startPos + text.length;
           } else {
             this.value += text;
           }
      }
   });
// --------------------------------------------------------------------------------------------------------------------------------------------



// func :: remove : deletes element from DOM
// --------------------------------------------------------------------------------------------------------------------------------------------
   const remove = function(q, x,d)
   {
      if(isText(q))
      {
         try{x=select(q);if(!x){return}}catch(e){return;}; d=VOID;
         if(isNode(x)){if(!x.parentNode){return}; x.parentNode.removeChild(x); return true;};
         if(!x){return}; x.forEach((n)=>{if(!!n.parentNode){n.parentNode.removeChild(n); d=true}}); return d;
      };

      if(!isNode(q)||!q.parentNode){return}; q.parentNode.removeChild(q); return true;
   };
// --------------------------------------------------------------------------------------------------------------------------------------------



// func :: newGui : reboots the gui .. if path given it does a relocate, else reload
// --------------------------------------------------------------------------------------------------------------------------------------------
   const newGui = function(p,v, t,b)
   {
      server.stream.close(); if(isPath(p)){t=(location.protocol+'//'+location.host+p)}else{t=location.href};
      b=[{input:'#INTRFACE', type:'hidden', value:'GUI'}]; if(isKnob(p)){v=p};
      if(isKnob(v)){v.each((vd,vn)=>{radd(b,{input:`#${vn}`, type:'hidden', value:vd})})};
      document.body.insert([{form:'#anonReboot', action:t, method:'POST', style:'position:absolute;opacity:0', contents:b}]);
      select('#anonReboot').submit();
   };
// --------------------------------------------------------------------------------------------------------------------------------------------



// func :: durl : create data-url from path -or blob
// --------------------------------------------------------------------------------------------------------------------------------------------
   const durl = function(d,f, n)
   {
      if(pathOf(d)){n=d.split('/').pop(); purl('/Proc/makeDurl',{purl:d},(r)=>{f(r.body,n)}); return;};
      decode.BLOB(d,f);
   };
// --------------------------------------------------------------------------------------------------------------------------------------------



// tool :: onFeed : drop-on event trap
// --------------------------------------------------------------------------------------------------------------------------------------------
   extend(Element.prototype)
   ({
      onFeed:function(h)
      {
         this.ondragover=function(e){e.preventDefault();e.stopPropagation();}; this.handle=h; this.ondrop=function(e,s)
         {
            e.preventDefault(); e.stopPropagation(); var d,l,z; d=e.dataTransfer; l=d.files; s=this; z=([...l]);
            if(z.length<1){let r=d.getData('text/plain'); if(pathOf(r)){durl(r,function(t,f){s.handle(t,f);});return}; s.handle(r);return;};
            z.forEach(function(f){decode.BLOB(f,function(r){s.handle(r,f.name);})});
         };
      },
   });
// --------------------------------------------------------------------------------------------------------------------------------------------



// tool :: (canvas) :  draw image on canvas with these methods
// --------------------------------------------------------------------------------------------------------------------------------------------
   extend(MAIN)
   ({
      drawPrep:function(x,i,f)
      {
         if(!x||!x.canvas){fail('expecting canvas context as 1st argument');return}; // validate
         if(!x.canvas.parentNode){fail('expecting canvas to be appended to the DOM');return}; // validate
         if(nodeName(i)!='img'){fail('expecting img element as 2nd agument');return}; // validate
         if(!isFunc(f)){fail('expecting callback as 3rd argument');return}; // validate
         i.rectInfo((d)=>{f(x.canvas.width,x.canvas.height,d.width,d.height)}); // respond with image dimensions
      },

      drawFill:function(x,i,f){drawPrep(x,i,(cw,ch,iw,ih)=>
      {
         let xr,yr,dr,mx,my; xr=(cw/iw); yr=(ch/ih); dr=Math.max(xr,yr);
         mx=((cw-iw*dr)/2); my=((ch-ih*dr)/2); x.drawImage(i,0,0,iw,ih,mx,my,(iw*dr),(ih*dr)); f();
      })},

      drawTile:function(x,i,f){drawPrep(x,i,(cw,ch,iw,ih)=>
      {
         let p=x.createPattern(i,'repeat'); x.rect(0,0,cw,ch); x.fillStyle=p; x.fill(); f();
      })},

      drawSpan:function(x,i,f){drawPrep(x,i,(cw,ch,iw,ih)=>
      {
         x.drawImage(i,0,0,iw,ih,0,0,cw,ch); f();
      })},
   });
// --------------------------------------------------------------------------------------------------------------------------------------------



// tool :: (img Element.prototype) : impose .. super-impose images into the origin .. the origin does not have to be in the DOM
// --------------------------------------------------------------------------------------------------------------------------------------------
   extend(HTMLImageElement.prototype)
   ({
      impose:function(v,f, s,c,x,l)
      {
         if(!isFunc(f)){fail('expecting callback');return}; if(isPath(v)){v={[v]:FILL}}; // validate
         if(!isNode(v)&&(!isKnob(v)||!isPath(keys(v)[0]))){fail('invalid image reference');return}; // validate
         s=this; s.rectInfo((sd)=> // get origin demensions
         {
            c=create({canvas:'',width:sd.width,height:sd.height,style:'position:absolute;top:0;left:0;opacity:1'}); // create canvas as origin
            document.body.insert(c); x=c.getContext('2d'); x.drawImage(s,0,0); // draw origin on canvas
            if(isNode(v)&&(nodeName(v)=='img')){x.drawImage(r,0,0)}else{l=span(v); v.each((w,p)=> // draw if image, else walk path object
            {
               if(!isPath(p)||!isin([FILL,TILE,SPAN],w)){remove(c);fail('invalid image reference');return STOP}; // validate
               purl({target:p,header:{ACCEPT:'text/plain'}},(r)=> // fetch the image as dataURL
               {
                  let i=create({img:'',src:r.body}); w=('draw'+proprCase(unwrap(w))); MAIN[w](x,i,()=>
                  {l--; if(l==0){let z=create({img:'',src:c.toDataURL()}); x=VOID; remove(c); c=VOID; r=VOID; f(z)}});
               });
            })};
         });
      },
   });
// --------------------------------------------------------------------------------------------------------------------------------------------



// tool :: (Element.prototype) : select .. handy document.getElement(s)By .. select ancestor with `^ ^2` .. and siblings with `< > <4 >2 << >>`
// --------------------------------------------------------------------------------------------------------------------------------------------
   const select = function(x,h, l,p,c,n,r,f)
   {
      if(isText(x)){x=x.trim()}; if(!isText(x,1)){return}; if(!isNode(h)){h=document.documentElement}; c=VOID; n=1; // validate
      c=isin(x,['^^','<<','>>','^','<','>']); if(c&&(x.indexOf(c)>0)){c=VOID}; // validate special-select
      if(c){p=stub(x,c); x=p[2]; p=stub(x,' '); if(p){n=(p[0]);x=p[2]}else if(!isNaN(x)){n=x;x=''}};
      if(c){h=h.lookup(c,n); if(!x){return h}; return select(x,h)}; f='querySelectorAll'; // lookup relatives .. line below is all children *
      if(x=='*'){r=[]; l=listOf(h.childNodes); l.forEach((i)=>{if(!((i.nodeName=='#text')&&!i.textContent.trim())){r.push(i)}}); return r};
      c=x[0]; l=h[f](':scope '+x); if((l.length<1)&&(c=='#')&&(x.indexOf(' ')<1)){l=h[f](':scope [name='+x.slice(1)+']')}; // pseudo-selector
      if(l.length<1){return}; r=[]; listOf(l).forEach((i)=>{r.push(i)}); if((c=='#')&&!isin(x,' ')){r=((r.length>0)?r[0]:VOID)}; return r;
   };


   extend(Element.prototype)
   ({
      Select:Element.prototype.select,
      select:function(x)
      {
         if(isin('textarea,input',nodeName(this))){return this.Select.apply(this,listOf(arguments))};
         return select(x,this);
      },

      lookup:function(c,n, r,w)
      {
         if(!n){if(c=='^'){return this.parentNode}; if(c=='<'){return this.previousSibling}; if(c=='>'){return this.nextSibling}};
         if((c=='<<')||(c=='>>')){r=this.parentNode; return (!r?VOID:((c=='<<')?r.firstElementChild:r.lastElementChild))};
         if(!isText(c,1)){return}; if(c=='^^'){c='^',n=2}; n=(n*1); if(!isin(['^','<','>'],c)||!isInum(n)||(n<1)){return this}; // validate
         r=this; w=((c=='^')?'parentNode':((c=='<')?'previousSibling':'nextSibling')); while(n){n--; if(!!r[w]){r=r[w]}else{break}}; // find
         return r; // returns found-relative, or self if relative-not-found
      },
   });
// --------------------------------------------------------------------------------------------------------------------------------------------



// tool :: parser : tool library for `parsed` .. extend this anywhere with: `extend(parser)({mimeType:function(){}})`
// --------------------------------------------------------------------------------------------------------------------------------------------
   const parsed = function(v,x,f)
   {
      if(MAIN.HALT){return};
      if(!isText(v,1)){fail('expecting 1st arg as text');return}; v=v.trim(); if(v.length<1){f(v);};
      if(!isText(x)){fail('expecting 2nd arg as text');return}; if(!isin(parser,x)){fail('no parser defined for mimeType `'+x+'`');return};
      if(!isFunc(parser[x])){fail('expecting parser extension `'+x+'` as a function');return};
      if(!isFunc(f)){fail('expecting 3rd arg as callback-function');return}; return parser[x](v,f);
   };

   const parser = {};

   {:'/Proc/base/ximp.js':}
// --------------------------------------------------------------------------------------------------------------------------------------------



// func :: render : get remote asset and make it DOM-usable
// --------------------------------------------------------------------------------------------------------------------------------------------
   const render = function(p,f, s)
   {
      if(MAIN.HALT){return}; addStack(); if(!p){p='/'};
      expect({path:p,func:f}); s=this; purl({target:p,header:{Accept:'text/plain'}},(r)=>
      {
         if(MAIN.HALT){return};
         let m,q,t,x; m=r.head.ContentType.split(';')[0].split('/x-').join('/'); q=m.split('/'); t=q[0]; x=q[1];
         if(!isin(parser,t)){t=x}; parsed(r.body,t,(z)=>
         {

            if(t=='markdown'){z=create({div:'.markdown-page',contents:[z]})}; f(z);
         });
      });
   }
// --------------------------------------------------------------------------------------------------------------------------------------------



// tool :: (Element.prototype) : view .. shorthand for: `Element.style.display='shomeSh!t'`
// --------------------------------------------------------------------------------------------------------------------------------------------
   extend(Element.prototype)
   ({
      view:function(v)
      {
         if(!isWord(v)){v='none'}; this.style.display=v;
      },
   });
// --------------------------------------------------------------------------------------------------------------------------------------------



// tool :: (Element.prototype) : enclan/declan .. add/remove classNames of an element
// --------------------------------------------------------------------------------------------------------------------------------------------
   extend(Element.prototype)
   ({
      enclan:function()
      {
         let c,l,a,slf; slf=this; c=(slf.className||'').trim(); l=(c?c.split(' '):[]); a=listOf(arguments); a.forEach((v,k)=>
         {
            v=ltrim(v,'.'); if(!isin(l,v))
            {
               l.push(v);
            }
         });
         this.className=l.join(' ');
      },

      declan:function()
      {
         var c,l,a,x; c=(this.className||'').trim(); l=(c?c.split(' '):[]); a=listOf(arguments);
         a.forEach((i)=>{x=l.indexOf(ltrim(i,'.')); if(x>-1){l.splice(x,1)}}); this.className=l.join(' ');
      },
   });
// --------------------------------------------------------------------------------------------------------------------------------------------




// tool :: (Element.prototype) : assort .. sort node children/siblings placement order either by `sorted` (arg/parent), or `placed` of siblings
// --------------------------------------------------------------------------------------------------------------------------------------------
   extend(Element.prototype)
   ({
      assort:function(a, l)
      {
         if(!isText(a,6)){if(!this.parentNode){return}; a=this.parentNode.sorted; if(!isText(a,6)){l=listOf(this.parentNode.childNodes)}};
         if(!l&&isText(a,6))
         {
            let p=stub(a,'::'); if(!p||!isin(p[2],':')){fail('invalid assort parameters');return};
            // console.log('TODO :: Element.prototype.assort() .. '+a);
         };
      },
   });
// --------------------------------------------------------------------------------------------------------------------------------------------




// tool :: (Element.prototype) : setStyle
// --------------------------------------------------------------------------------------------------------------------------------------------
   extend(Element.prototype)
   ({
      setStyle:function(o,y, n)
      {
         n=this; if(isText(o)){o={[o]:y};}; expect({knob:o}); o.each((sv,sk)=>
         {
            if(isNumr(sv)&&!isin(['zIndex','opacity'],sk)){sv=(sv+'px')};
            n.style[sk]=sv;

            if((sk=='transform')&&isin(sv,['isoSkewX','isoSkewY']))
            {
               let pt=stub(sv,'('); sk=pt[0]; sv=(swap(rtrim(pt[2],')'),'deg','')*1); if(isNaN(sv)){sv=45}; sv=(sv%90);
               if(!n.postProc){n.postProc={}}; if(!n.postProc.transform){n.postProc.transform={}}; n.postProc.transform[sk]=sv;
               n.onready=function()
               {
                  let pt,sx,sy,iw,ih,ml,mt,ob,nb,wd,hd,xd,yd; pt=this.postProc.transform; sx=pt.isoSkewX; sy=pt.isoSkewY;
                  ob=this.getBoundingClientRect(); iw=ob.width; ih=ob.height;
                  if(sx){this.style.transform=('perspective('+((iw/2)-(ih/2))+'px) rotateX('+sx+'deg)');}
                  else{this.style.transform=('perspective('+((ih/2)-(iw/2))+'px) rotateY('+sy+'deg)');};
                  nb=this.getBoundingClientRect();
                  if(nb.x<ob.x){this.style.marginLeft=((ob.x-nb.x)+'px'); this.style.marginRight=((ob.x-nb.x)+'px');}
                  else if(nb.x>ob.x){this.style.marginLeft=(0-(nb.x-ob.x)+'px');};
                  if(nb.y<ob.y){this.style.marginTop=((ob.y-nb.y)+'px');}else if(nb.y>ob.y){this.style.marginTop=(0-(nb.y-ob.y)+'px');};
               };
            };
         });
         return
      },
   });
// --------------------------------------------------------------------------------------------------------------------------------------------




// func :: avatar : returns a gravatar URL from given email address .. for options see: https://en.gravatar.com/site/implement/images/
// --------------------------------------------------------------------------------------------------------------------------------------------
   const avatar = function(a,d,s)
   {
      if(isText(a)){a=a.trim().toLowerCase()}; if(!isText(a,8)||!isin(a,'@')||!isin(a,'.')){fail('invalid email address');return};
      if(isNumr(d)){s=d;d=VOID}; if(!d){d='robohash'}; if(!s){s=80};
      return ('https://www.gravatar.com/avatar/'+md5(a)+'?d='+d+'&s='+s);
   };
// --------------------------------------------------------------------------------------------------------------------------------------------




// tool :: ordain : define CSS classes that respond on events
// --------------------------------------------------------------------------------------------------------------------------------------------
   const ordain = function(a)
   {
      if(isText(a)){a=a.trim()}; if(!isText(a,1)){fail('invalid CSS selector');return function(){}};
      return function(o)
      {
         if(!isKnob(o)){fail('expecting 1st argument as object');return}; let ot,oi; ot=this.target;
         oi=ot.replace(/[^A-Za-z0-9]/g,''); if(span(oi)<1){fail('invalid CSS selector');return}; // oi=('#ORDAINED_'+oi);
         // if(isText(o.style)){document.head.insert([{style:oi,innerHTML:(ot+'\n{\n'+o.ornate+'\n}\n')}])};
         ordained.chosen[ot]=o; ordained.vivify();
      }
      .bind({target:a});
   };


   const ordained = // object
   {
      chosen:{},

      vivify:function()
      {
         this.chosen.each((v,k)=>
         {
            let l=select(k); if(!l){return NEXT}; // nobody to anoint
            if(!isList(l)){l=[l]}; l.forEach((n)=>
            {
               if(n.anointed){return}; n.modify(v); n.anointed=true;
            });
         });
      },
   };
// --------------------------------------------------------------------------------------------------------------------------------------------




// func :: newTab : creates a tabbed browsing interface in the target-node -or adds a new tab to an existing interface .. unique by tab-title
// --------------------------------------------------------------------------------------------------------------------------------------------
   const newTab = function(o)
   {
      expect({knob:o}); if(!o.listen){o.listen={}}; expect({text:o.titled, knob:o.holder, knob:o.listen});
      let prnt=o.holder.select('tabs'); if(prnt){prnt=prnt[0]}; if(!prnt){prnt=create('tabs'); prnt.modify(o); o.holder.insert(prnt);};
      dump('newTab - continue');
   };
// --------------------------------------------------------------------------------------------------------------------------------------------



// func :: mimeName : get the relevant mime-name from a mime-type-string
// --------------------------------------------------------------------------------------------------------------------------------------------
   const mimeName = function(v, r)
   {
      if(!isText(v,3)||!isin(trim(v,'/'),'/')){return}; r=v.split(';')[0].split('/')[1].split('-').pop();
      return r;
   };
// --------------------------------------------------------------------------------------------------------------------------------------------



// func :: validate : validates form(ish) elements according to their attributes .. expects an array of elements
// --------------------------------------------------------------------------------------------------------------------------------------------
   const validate = function(l, f,d,r)
   {
      f='expecting array of elements'; if(!isList(l)){fail(f);return}; d={}, r={}; l.each((n)=> // first pass .. check geek-fail .. register
      {
         if(!isNode(n)){fail(f);return STOP}; if(!isWord(n.name)){fail('expecting element.name as :word:');return STOP}; // geek-fail
         if(isin(keys(d),n.name)){fail(`duplicate element name '${n.name}'`); return STOP}; // geek-fail
         if(!n.required&&!n.optional&&!n.pattern){return NEXT}; // nothing to validate .. move along
         n.listen('focus',function(){this.declan('validateFail','validateNeed')}); // when user attemps change then "de-fail" this temporarily
         let vp=TRUE; if(n.required&&(span(n.value)<1)){vp=FALS}; // check required
         if((n.pattern||n.regx)&&!test(n.value,(n.pattern||n.regx))){vp=FALS}; // test value on regx/function
         n.validatePass=vp; d[n.name]=n; // record this as a dependant ..we need to have a temporary node registry for "optional:dep" cases
      });

      if(MAIN.HALT){return}; f=VOID; r={}; d.each((n,k)=>
      {
         r[k]=n.value; if(n.validatePass==TRUE){return NEXT}; // it's good! .. move along
         let nm,nv,fc,od; nm=(n.placeholder||n.title||k); nv=n.value; fc='validateFail'; od=(n.optional+''); od=(od?od.split(','):VOID);
         if(n.required){n.enclan(fc); f=((span(nv)<1)?`"${nm}" is required`:`"${nm}" is invalid`); return STOP};  // validate required + regx
         if(!od||isin(od,['true','1'])){return NEXT}; // optional with no dependecies .. move along
         od.each((rd)=>
         {
            if(!d[rd]){fail(`optional dependency '${rd}' is invalid`);return STOP}; // geek-fail .. invalid dependency
            if(!d[rd].validatePass)
            {
               nm=(d[rd].placeholder||d[rd].title||r); f=((span(d[rd].value)<1)?`"${nm}" is required`:`"${nm}" is invalid`);
               d[rd].enclan('validateNeed'); return STOP
            }
         });
      });

      if(MAIN.HALT){return}; return (f||r);
   };
// --------------------------------------------------------------------------------------------------------------------------------------------



// func :: cStyle : computed-style of elements
// --------------------------------------------------------------------------------------------------------------------------------------------
   const cStyle = function(n,p)
   {
      if(!n||!n.style||!isText(p,1)){fail('invalid arguments');return}; if(!n.parentNode){fail('element must be inside the DOM');return};
      let s=getComputedStyle(n); let v=s.getPropertyValue(p); if(v&&!isNaN(rtrim(v,'px'))){v=(rtrim(v,'px')*1)}; return v;
   };
// --------------------------------------------------------------------------------------------------------------------------------------------



// func :: popModal : opens a modal dialogue
// --------------------------------------------------------------------------------------------------------------------------------------------
   const popModal = function(a1,a2)
   {
      if(isText(a1)){return this.txtBased(a1,a2);};
      if(isKnob(a1))
      {
         if(a1.head&&a1.body){return this.objBased(a1);};
         return function(a3){return this.fnc(a3,this.atr)}.bind({fnc:this.objBased,atr:a1});
      };
   }
   .bind
   ({
      txtBased:function(a1,a2)
      {
         return function(arg)
         {
            var mid,ttl,txt,btn,tmo,box,rsl; mid=('#MDL'+hash()); if(isKnob(arg)||isText(arg)){arg=[arg]};
            txt=stub(this.txt,' :: '); if(txt){ttl=txt[0]; txt=txt[2]}else{txt=this.txt}; btn=[]; tmo=this.tmo;

            if(!isList(arg)){fail('invalid arguments');return}; arg.each((o)=>
            {
               if(isText(o)){o={[o]:1}}; if(!isKnob(o)){fail('invalid arguments');}; let k,v,p,c; k=keys(o)[0]; v=o[k]; o=VOID;
               if(!v){return NEXT}; if(!isFunc(v)){v=function(){}}; c='Auto'; p=stub(k,' :: '); if(p){c=p[0]; k=p[2]};
               radd(btn,{butn:('.butn'+c), onclick:v, contents:k});
            });

            box=create({grid:'.cenmid .modalBox', contents:
            [
               {row:[{col:'.head', contents:[{div:[{span:ttl},{icon:'.shut', face:'cross', onclick:function(){this.root.exit()}}]}]}]},
               {row:[{col:'.body', contents:[{grid:[{row:
               [
                  {col:'.view', contents:[{panl:txt}]},
                  {col:'.side ', contents:[{div:'.xbar'}]},
               ]}]}]}]},
               {row:[{col:'.foot', contents:[{grid:[{row:
               [
                  {col:'.footLeft', contents:[]},
                  {col:'.footRait', contents:btn},
               ]}]}]}]},
            ]});


            rsl=create({modal:mid, contents:[{wrap:[box]}]});
            rsl.exit=function(){if(this.ticker){clearInterval(this.ticker)}; this.signal('exit'); tick.after(60,()=>{this.remove()})};
            rsl.gone=function(sec)
            {
               let bar=this.select('.xbar')[0]; let hgt=rectOf(this.select('.body')[0]).height; bar.view('block');
               let unt=(hgt/sec); bar.setStyle({height:hgt}); this.ticker=tick.every(1000,()=>
               {
                  sec--; bar.setStyle({height:Math.floor(unt*sec)}); if(sec>0){return}; clearInterval(this.ticker); this.signal('gone');
                  tick.after(60,()=>{this.remove()});
               });
            };

            document.body.appendChild(rsl); (rsl.select('butn')||[]).forEach((b)=>{b.root=rsl}); rsl.select('.shut')[0].root=rsl;
            if(tmo){tick.after(60,()=>{rsl.gone(tmo)})}; rsl.focus(); return rsl;
         }
         .bind({txt:a1,tmo:a2});
      },


      objBased:function(obj,atr)
      {
         if(!isKnob(obj)){fail('expecting object');return};
         if(!isText(obj.head,1)&&!isList(obj.head,1)&&!isKnob(obj.head,1)){fail('invalid modal head');};
         if(!isText(obj.body,1)&&!isList(obj.body,1)&&!isKnob(obj.body,1)){fail('invalid modal body');};
         if((obj.info!=VOID)&&!isText(obj.info,1)&&!isList(obj.info,1)&&!isKnob(obj.info,1)){fail('invalid modal info');};

         if(!atr){atr={}}; var mid,thm,box,inf,rsl; mid=('MDL'+hash()); if(!atr.class){atr.class='';}; atr.class=atr.class.trim().split(' ');
         ladd(atr.class,'modalBox'); ladd(atr.class,'cenmid'); thm=atr.theme; if(thm){radd(atr.class,thm)}; atr.class=atr.class.join(' ');

         if(isText(obj.head)){obj.head={span:obj.head}}; let fiob,liob,pagr;
         if(!isList(obj.head)){obj.head=[obj.head]}; radd(obj.head,{icon:'.shut', face:'cross', onclick:function(){this.root.exit()}});
         if(isList(obj.body,2)&&isKnob(obj.body[0])){fiob=obj.body[0];}; if(!!fiob&&isKnob(vals(obj.body,-1))){liob=vals(obj.body,-1)};

         if(!!fiob&&(isText(fiob.panl)||isText(fiob.page))&&!!liob&&(isText(liob.panl)||isText(liob.page)))
         {
            delete obj.foot; pagr=1; if(!isList(obj.info)){obj.info=[];}; obj.body.each((o,x)=>
            {
               let t=(o.panl||o.page); if(!isText(t)){t=(o.info||o.title)}else{if(o.panl){obj.body[x].panl=''}else{obj.body[x].page=''}};
               obj.body[x].id=(mid+'PGE'+x); if(!isText(t)||isin(['#','.'],t[0])){fail('invalid title for modal-body item '+x); return STOP};
               if(x>0){let cn=o.class; if(!cn){cn=''}; cn=cn.split(' '); radd(cn,'hide'); cn=cn.join(' '); obj.body[x].class=cn;};
               radd(obj.info,{div:('#'+mid+'INF'+x+' .modlInfoItem'),contents:[{icon:((x>0)?'primitive-dot':'arrow-right1')},{span:t}],
               status:((x>0)?AUTO:ACTV),
               change:function(a)
               {
                  let l={[AUTO]:'primitive-dot',[ACTV]:'arrow-right1',[BUSY]:'hour-glass',[DONE]:'checkmark',[FAIL]:'warning'};
                  let i=l[a]; if(!i){fail('invalid modal page status');};
                  this.select('icon')[0].className=('icon-'+i); this.status=a;
               }});

            });

            obj.foot=[{grid:[{row:
            [
               {col:'.footLeft', contents:
               [
                  {butn:'', contents:'Back', onclick:function(){this.root.page('<')}},
                  {butn:'', contents:'Next', onclick:function(){this.root.page('>')}},
               ]},
               {col:'.footRait', contents:
               [
                  {butn:'', contents:'Done', onclick:function(){this.root.done()}},
                  {butn:'', contents:'Cancel', onclick:function(){this.root.exit()}},
               ]},
            ]}]}];
         };

         box=create({grid:'', contents:
         [
            {row:[{col:'.head', contents:[{div:obj.head}]}]},
            {row:[{col:'.body', contents:[{panl:'.wrap', contents:[{grid:[{row:
            [
               (obj.info?{col:'.info', contents:obj.info}:VOID),{col:'.view', contents:obj.body}
            ]}]}]}]}]},
            {row:[{col:'.foot', contents:obj.foot}]},
         ]});

         let sze=atr.size; if(sze){delete atr.size}; if(isText(sze)){sze=stub(sze,['x',',',' ',':']); if(sze){sze=[(sze[0]*1),(sze[2]*1)]}};
         if(isList(sze)&&((span(sze)<2)||!isNumr(sze[0])||!isNumr(sze[1]))){sze=VOID};
         if(sze){if(!isKnob(atr.style)){atr.style={}}; atr.style.width=sze[0]; atr.style.height=sze[1];};
         box.modify(atr);

         rsl=create({modal:mid, contents:[{wrap:[box]}]});
         rsl.page=function(d, me,cx,lx,nx,nl,fn)
         {
            if(!this.pageIndx){this.pageIndx=0;}; me=this; cx=me.pageIndx; nl=listOf(me.select('.view')[0].childNodes);
            lx=(nl.length-1); nx=cx; if(d=='<'){nx-=1}else if(d=='>'){nx+=1}else if(isNumr(d)){nx=((d<0)?(nx+d):d)}else{return}; // validate
            if((nx<0)||(nx>lx)){return}; if(!nl[nx]){return}; // boundaries

            fn=function(sw)
            {
               if(!sw){sw=DONE}; me.pageIndx=nx; nl[cx].declan('show'); nl[cx].enclan('hide'); nl[nx].declan('hide'); nl[nx].enclan('show');
               nl=VOID; nl=me.select('.modlInfoItem'); nl[cx].change(sw); nl[nx].change(ACTV);
               me.signal('page',{indx:nx,info:nl[nx].select('span')[0].innerHTML});
            };

            if(!isFunc(nl[cx].validate)){fn(DONE);}
            else
            {
               me.select('.modlInfoItem')[cx].change(BUSY);
               nl[cx].validate(fn);
            };
         };

         rsl.done=function(me,cx,pl,il,lx,ad)
         {
            if(!this.pageIndx){this.pageIndx=0;}; me=this; cx=me.pageIndx; pl=listOf(me.select('.view')[0].childNodes);
            il=me.select('.modlInfoItem'); lx=(pl.length-1); if(!isFunc(pl[cx].validate)){pl[cx].validate=function(cb){cb(DONE)}};
            if(il[cx].status!=DONE){il[cx].change(BUSY); pl[cx].validate((sw)=>{if(!sw){sw=DONE}; il[cx].change(sw);});};
            wait.until(()=>{ad=true; il.forEach((sn)=>{if(sn.status!=DONE){ad=false}}); return ad},()=>
            {me.signal('done'); tick.after(60,()=>{if(!me.wait){me.exit()};});});
         };

         rsl.exit=function(){if(this.ticker){clearInterval(this.ticker)}; this.signal('exit'); tick.after(60,()=>{this.remove()})};
         document.body.appendChild(rsl); (rsl.select('butn')||[]).forEach((b)=>{b.root=rsl; b.dbox=box; b.enclan(thm)});
         rsl.select('.shut')[0].root=rsl; (rsl.select('treeview')||[]).forEach((b)=>{b.main=rsl});
      },
   });
// --------------------------------------------------------------------------------------------------------------------------------------------



// tool :: (Element.prototype) : rectInfo .. getBoundingRect info of element on-the-fly
// --------------------------------------------------------------------------------------------------------------------------------------------
   extend(Element.prototype)
   ({
      rectInfo:function(f)
      {
         if(!isFunc(f)){return}; if(this.parentNode){f(this.getBoundingClientRect());return};
         let p=(this.style.position||'relative'); let o=(this.style.opacity||1); this.style.position='absolute'; this.style.opacity=0;
         document.body.appendChild(this); this.listen('ready',()=>
         {
            let i=this.getBoundingClientRect(); this.parentNode.removeChild(this); this.style.position=p; this.style.opacity=o; f(i);
         });
         // tick.after(10,()=>
         // {
         //    let i=this.getBoundingClientRect(); this.parentNode.removeChild(this); this.style.position=p; this.style.opacity=o; f(i);
         // });
      },

      resizeTo:function(tgt, slf)
      {
         // slf=this; if(isText(tgt)){tgt=select(tgt,slf);}; expect({node:tgt});
         // wait.until(()=>{return (!!tgt.parentNode)},()=>
         // {
         //    let i,w,h; i=tgt.getBoundingClientRect(); w=Math.ceil(i.width); h=Math.ceil(i.height); slf.width=w; slf.height=h;
         //    slf.setStyle({width:w, height:h, minWidth:w, minHeight:h, maxWidth:w, maxHeight:h});
         // });
      },
   });

   const rectOf = function(a)
   {
      if(isText(a)){a=select(a)}; if(!isNode(a)){fail('expecting node or #nodeID');return};
      if(!a.parentNode){fail('node is not attached to the DOM .. yet');return};
      let r=a.getBoundingClientRect(); return r;
   };
// --------------------------------------------------------------------------------------------------------------------------------------------




// tool :: dropMenu
// --------------------------------------------------------------------------------------------------------------------------------------------
   extend(MAIN)
   ({
      dropMenu:function(a)
      {
         remove('#AnonDropMenu'); if(isList(a)){return this.make(a)};
         if(isKnob(a)){return function(l){return this.fnc(l,this.atr)}.bind({fnc:this.make,atr:a});};
         fail('expecting list or knob');
      }
      .bind({make:function(l,a, r,c)
      {
         if(!isKnob(l[0])){return}; r=create('dropmenu'); if(!isKnob(a)){a={}}; a.id='AnonDropMenu';
         c=a.context; delete a.context; r.modify(a); r.setStyle({left:cursor.posx,top:cursor.posy});
         l.forEach((i)=>{i.context=c; r.insert(i)}); document.body.insert(r);
      }}),
   });

   document.body.addEventListener('click',function(){remove('#AnonDropMenu');},false);
// --------------------------------------------------------------------------------------------------------------------------------------------




// glob :: prop : CURSOR
// --------------------------------------------------------------------------------------------------------------------------------------------
   extend(MAIN)
   ({
      cursor:
      {
         posx:0, posy:0, refs:{},

         bind:function(r,x,y)
         {
            if(isNode(r)){if(!r.id){r.id=('EL'+hash())}; r=('#'+r.id)}; let n=select(r);
            if(!isNode(n)){fail('expecting node with id '+r+' to exist in the DOM');}; let dx,dy;
            dx=(cursor.posx-x); dy=(cursor.posy-y);
            if(!isNumr(x)){x=0;}; if(!isNumr(y)){y=0;}; this.refs[r]={xd:dx,yd:dy};
         },

         drop:function(r)
         {
            if(isNode(r)){r=('#'+r.id)}; let n=select(r); if(!isNode(n)){fail('invalid reference');return};
            delete this.refs[r];
         },

         move:function(x,y)
         {
            cursor.posx=x; cursor.posy=y; if(span(cursor.refs)<1){return}; let nx,ny;
            cursor.refs.each((p,r)=>
            {
               let n=select(r); if(!isNode(n)){return}; if(n.style.position!='absolute'){return};
               nx=(x-p.xd); ny=(y-p.yd);
               n.style.left=(nx+'px'); n.style.top=(ny+'px');
               n.signal('boundmove',{x:x,y:y});
            });
         },
      }
   });
// --------------------------------------------------------------------------------------------------------------------------------------------
   document.addEventListener("mousemove", function(e){cursor.move(e.clientX,e.clientY);},false);
   document.addEventListener("dragover", function(e){cursor.move(e.pageX,e.pageY);},false);
// --------------------------------------------------------------------------------------------------------------------------------------------
