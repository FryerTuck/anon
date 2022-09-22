"use strict";


// func :: globVars : mutable/immutable globals that smells less funky .. i mean it has good enough security
// --------------------------------------------------------------------------------------------------------------------------------------------
   const globVars = function(d,f, fs,si,y,r,rb)
   {
      // fs=stak(); if(!fs){console.error(fs);wack();return}; // get the call-stack, if empty -> wack the abuser, else use it for from-auth
      if(isText(f)){f=[f];}; if((f!==VOID)&&!isList(f)){fail("invalid globVars auth-from");return}; // verify auth, must be text-list, or VOID
      if(f){y=0;f.forEach((p)=>{if(!isText(p)){fail("invalid globVars auth-from");y=1}}); if(y){return}}; // verify each text if from-auth
      if(isText(d,1)){return dupe(this.vars[d])}; if(!isKnob(d,1)){return}; // return copy of requested value, or VOID if not object
      // below will attempt to create/update global variables using from-auth security (if any -else it's immutable)
      // si=rstub(fs[1]," ")[0];
      rb=true; d.each((v,k)=>
      {
         if(k.length<1){return}; r=this.vars[k]; // sanitize & prep
         if(r===VOID){this.vars[k]=v; this.auth[k]=f; return}; // not defined yet, so create it now using auth-from (if any)
         // if(!isin(this.auth[k],si)){rb=false; console.error(fs); wack(); return STOP}; // not authorized to change this variable
         this.vars[k]=v; // update existing variable, cannot re-auth, only initial creation can set auth
      });
      return rb;
   }
   .bind({vars:{},auth:{}});
// --------------------------------------------------------------------------------------------------------------------------------------------




// func :: mimeType|typeMime : return mime-type from path/extn -OR- return extn from mime-type
// --------------------------------------------------------------------------------------------------------------------------------------------
   const mimeType = function(d)
   {
      if(!isText(d)){return}; if(isin(d,'.')){d=d.split('.').pop()}; if(!isText(d,1)){return};
      return globVars('mime')[d];
   };

   const typeMime = function(d)
   {
      if(!isText(d,3)||!isin(d,'/')){return};
   };
// --------------------------------------------------------------------------------------------------------------------------------------------




// shiv :: Cookies : https://github.com/js-cookie/js-cookie .. the `Cookies` global has been defined in `aard.htm`
// --------------------------------------------------------------------------------------------------------------------------------------------
   harden('Cookies');

   extend(MAIN)
   ({
      cookie:
      {
         config:{expires:null, path:Cookies.defaults.path, domain:Cookies.defaults.domain, secure:true, sameSite:"Strict"},
         exists:function(b,v){v=Cookies.get(b); return isVoid(v);},

         create:function(b,a,c,d)
         {
             let o = copyOf(this.config);
             Cookies.set(b,btoa(JSON.stringify(a)),o); return true;
         },

         update:function(b,a,c,d)
         {
             let o = copyOf(this.config);
             Cookies.set(b,a,o); return true;
         },

         delete:function(b,a){return Cookies.remove(b,{path:a||this.config.path,domain:this.config.domain})},
         select:function(b, r,v,t)
         {
            if(b=='*'){b=VOID}; r=Cookies.get(b); if(isVoid(r)){return}; if((b!=VOID)){try{v=JSON.parse(atob(r))}catch(e){v=r}; return v};
            r.each((v,k)=>{try{t=JSON.parse(atob(v))}catch(e){t=v}; r[k]=t;}); return r;
         },
      }
   });
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
         if(t=='script')
         {
            let c=(i.innerHTML+"").trim(); let s=i.getAttribute("src"); i=VOID; i=document.createElement('script');
            if(c){i.innerHTML=c}else if(s){i.setAttribute("src",s)};
         };
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
            if(!c){if(x==n){r.push(n)};return}; if((c=='#')&&(x==n)){r.push(n);return}; if((c=='.')&&isin(i.className,x)){r.push(n);return};
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
      if((a.length<2)&&isText(a[0])&&isin(a[0],[',',' '])){a=a[0]; a=a.split(' ').join(',').split(',')}; // correct
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



// func :: imsafe : quick security check for sensitive functions
// --------------------------------------------------------------------------------------------------------------------------------------------
    const imsafe = function()
    {
        if(!!stak(0)){return true;}; dump("securityyyyyy !!!"); wack(); return false;
    };
// --------------------------------------------------------------------------------------------------------------------------------------------



// func :: purl : process/path-URL
// --------------------------------------------------------------------------------------------------------------------------------------------
   const purl = function(p,d,f, o,x,e,cb,pe,ee)
   {
      if(MAIN.HALT){dump("purl ignored .. MAIN is halted"); return};
      if(siteLocked()&&(p!='/User/runRepel/sudo')&&!userDoes('sudo')){dump("purl ignored .. siteLocked"); return};

      // stak(KEEP);
      if(isText(p)&&isVoid(d)&&isVoid(f)){o={target:p,method:'GET',listen:{}}} // only URL given
      else if(isText(p)&&isFunc(d)&&isVoid(f)){o={target:p,method:'GET',listen:{loadend:d}}} // URL + callback
      else if(isText(p)&&isKnob(d)&&isVoid(f)){o=d; o.target=p; if(!isKnob(o.listen)){o.listen={}};} // URL + options
      else if(isText(p)&&isKnob(d)&&isFunc(f)){o={target:p,method:'POST',convey:d,listen:{loadend:f}}} // URL + data + callback
      else if(isKnob(p)&&isFunc(d)&&isVoid(f)){o=p; if(!isKnob(o.listen)){o.listen={}}; o.listen.loadend=d} // options + callback
      else if(isKnob(p)&&isVoid(d)&&isVoid(f)){o=p}; // options only

      e='invalid purl arguments'; if(!isKnob(o)){fail(e);return}; if(!isText(o.target,1)){fail(e);return}; // validate
      if(!isKnob(o.listen)){fail(e);return}; if(!isFunc(o.listen.loadend)){fail(e);return}; // validate
      if(!isFunc(o.listen.progress)){o.listen.progress=function(){}}; pe=o.listen.progress; delete o.listen.progress;
      if(!isFunc(o.listen.error)){o.listen.error=function(ea)
      {
          if (!isText(ea) || !ea.trim().startsWith("<!DOCTYPE html>")){ fail(ea); return };
          let ifrm = create({iframe:"#failView .layr"});
          select( (globVars("mainView") || "#anonMainView") ).insert(ifrm);
          tick.after(60,()=>{ ifrm.contentDocument.write(ea) });
      }};
      ee=o.listen.error; delete o.listen.error;

      o.listen.progress=function(b)
      {
         let q=(Math.floor(b.loaded/b.total)*100); if(this.done<q){this.done=q};pe(q,this.purl);
         if(this.busy&&!!select("#busyPane")){Busy.edit(this.purl,q)};
      };

      cb=o.listen.loadend; delete o.listen.loadend; o.listen.loadend=function() // event done
      {
         let h=dval(this.getAllResponseHeaders());
         if((h!=null)&&h.Cookies){h.Cookies=decode.jso(decode.b64(h.Cookies)); h.each((v,k)=>{h[k]=trim(v)});};
         let r={path:this.purl,head:h,body:this.response}; this.done=100;  let s=this.status;
         if(s==200){pe(100,this.purl);if(this.busy&&!!select("#busyPane")){Busy.edit(this.purl,100)};};
         if(x.silent){tick.after(250,()=>{delete server.silent[this.purl]})};
         if((s<400)||(this.purl.endsWith("?init")&&(s<500))){cb.apply(this,[r]);return}; // all good
         if(MAIN.HALT){console.error("xhrMuted");return}; let eo=trim(r.body);
         if(eo.startsWith(`{"name":`)&&isin(eo,`"mesg":`)&&isin(eo,`]}<br />`)){eo=(stub(eo,`]}<br />`)[0]+"]}");};
         ee.apply(this,[eo]);
      };


      if(o.silent){server.silent[o.target]=1};
      if(!o.method){o.method='POST'}; if(!o.expect){o.expect='text'}; if(!isKnob(o.header)){o.header={}}; // method, responseType, headerOBJ
      if(!o.header.INTRFACE){o.header.INTRFACE='API'}; x=(new XMLHttpRequest()); x.open(o.method,o.target); x.responseType=o.expect; x.done=0;

      let hk=purl.hook(o.target); if(isList(hk)){hk.forEach((hf)=>
      {
          let ho=hf(); if(!isKnob(ho)){return};
          if(isKnob(ho.listen)){ho.listen.each((v,k)=>{x.addEventListener(k,v)})};
          if(isKnob(ho.convey)){o.convey=dupe(o.convey).fuse(dupe(ho.convey));};
      })};

      if(!o.silent){x.wait=function(){if(this.done<100){Busy.edit(this.purl,this.done)}}; tick.after(1250,()=>{x.wait()})};
      x.purl=o.target; o.listen.each((v,k)=>{x.addEventListener(k,v)}); o.header.each((v,k)=>{x.setRequestHeader(k,v)}); // events, headers
      x.silent=o.silent; tick.after(750,()=>{if(x.done&&(x.done>99)){return}; x.busy=(x.silent?0:1)}); // show busy if true

      x.send((isKnob(o.convey)?encode.JSON(o.convey):VOID)); // dispatch request
  };
// --------------------------------------------------------------------------------------------------------------------------------------------



// xtnd :: purl.hook : hook in a callback to use on purl events associated with path
// --------------------------------------------------------------------------------------------------------------------------------------------
    extend(purl)
    ({
        hook:function(p,f)
        {
            if(!imsafe()){return}; expect.text(p,1); // security !! .. let the evil gears in you head enlighten us both .. contribute!

            if(!f) // return hooked object
            {
                let m; keys(this).forEach((i)=>{if(akin(p,i)){m=i; return STOP}}); if(!m){return};
                let r=this[m]; return r;
            };

            expect.func(f); if(!this[p]){this[p]=[]}; // path must be array
            radd(this[p],f); // call back added
        }
        .bind
        ({

        }),
    });
// --------------------------------------------------------------------------------------------------------------------------------------------



// func :: upload : post string-chunks to server until done, then callback is called
// --------------------------------------------------------------------------------------------------------------------------------------------
   const upload = function(fp,fd,cb, ts,cs,ca)
   {
      if(!isPath(fp)){fail(`expecting path as 1st arg`);return};
      if(!isDurl(fd)){fail(`expecting data-URL as 2nd arg`);return};
      if(!isFunc(cb)){fail(`expecting callback as 3rd arg`);return};

      cs=12000; ts=fd.length; ca=frag(fd,cs);
      this.send(fp,ts,ca,cb,1);
   }
   .bind
   ({
      send:function(fp,fs,da,cb,fc, dc,tb,tn,bu)
      {
         if(fc){Busy.edit(fp,1);}; dc=lpop(da);
         purl(`/User/upload`,{path:fp,size:fs,data:dc},(ra)=>
         {
            ra=ra.body; if(ra==FAIL){fail(`failed to upload: ${fp}`);};
            if(!isJson(ra)){dump(ra);return}; ra=decode.jso(ra); let pp=Math.floor((ra[0]/ra[1])*100);
            Busy.edit(fp,pp); if(pp==100){cb();return;}; this.send(fp,fs,da,cb);
         });
      },
   });
// --------------------------------------------------------------------------------------------------------------------------------------------



// func :: entity : creates new event emitter .. o is (optional) properties object
// --------------------------------------------------------------------------------------------------------------------------------------------
   const entity = function(o, r)
   {r=(new EventTarget()); if(isKnob(o)){for(var k in o){r[k]=o[k];}}; return r;};
// --------------------------------------------------------------------------------------------------------------------------------------------



// tool :: (events)
// --------------------------------------------------------------------------------------------------------------------------------------------
   extend(MAIN)
   ({
      Listen:
      {
         jobs:{},
         hash:function(f)
         {
            if(!isFunc(f)){fail("expecting function");return};
            this.x+=1; return sha1(this.x+f.toString());
         }.bind({x:0}),
         keys:
         {
            from:function(e, r)
            {
               r=e.key; if(e.keyCode==91){r='Meta';}else if(r==' '){r='Space'};
               return r;
            },
            down:{},
         },
      },
   });


   document.body.addEventListener('keydown',function(evnt)
   {
      if(evnt.ctrlKey&&(evnt.key=='s')){evnt.preventDefault(); evnt.stopPropagation()};
      let butn=Listen.keys.from(evnt); Listen.keys.down[butn]=1;
   });


   document.body.addEventListener('keyup',function(evnt)
   {
      let butn=Listen.keys.from(evnt); delete Listen.keys.down[butn];
      imHere(1);
   });


   extend(EventTarget.prototype)
   ({
      signal:function(q,d,o, e,n,self,evnt,im,ec)
      {
         if(!isin(q,":")){e=q}else{ec=stub(q,":"); e=trim(ec[0]); im=`event signal "${e}" reserved for clans: ${ec}`};
         if(ec){ec=trim(ec[2]); if(!userDoes(ec)){dump(im);return;}};
         self=(this||MAIN); expect.word(e); n=('on'+e); if(isText(d)&&isin([ONCE,EVRY],d)){o=d;d=VOID};
         if(o!=EVRY){o=ONCE}; if((d!==VOID)&&!d.detail){d={detail:d}}; evnt=(d?(new CustomEvent(e,d)):(new Event(e)));
         if(self[n]&&isFunc(self[n])){self[n].apply(self,[evnt]);
         if(o==ONCE){if(self[n].__evntID){delete Listen.jobs[self[n].__evntID]};self[n]=null}; return;};
         self.dispatchEvent(evnt);
      },


      listen:function(evt,opt,hash,cbf, self,obst,fltr,once)
      {
         if(isNode(this)&&isKnob(evt))
         {
            evt.each((ef,en)=>{this.listen(en,ef)}); return this;
         };

         if(isText(evt)&&isin(evt,",")){evt=evt.split(",")};

         if(isFunc(evt)){cbf=evt;evt=VOID}; if(isFunc(opt)){cbf=opt;opt=EVRY}else if(isKnob(opt)){fltr=opt; opt=EVRY};
         if(isFunc(hash)){cbf=hash;hash=VOID}; self=(this||MAIN); if(!isText(hash)){hash=Listen.hash(cbf)}else{cbf=Listen.jobs[hash]};
         if(!opt){opt=EVRY}else if(!isin([ONCE,EVRY],opt)){opt=EVRY}; expect.func(cbf); if(evt==VOID){evt=AUTO}; let ice;
         if(evt==AUTO){evt=keys(self,AUTO,'on*');};
         if(!isList(evt)){if(isin(evt,' ')){ice=evt; evt=['keydown','mousedown','wheel','mousemove']}else{evt=[evt]}};
         if(!self.events){self.events={}}; obst=this; if(!!obst&&!obst.listensFor){obst.listensFor=[]}; once=['ready','idle'];
         if(!!obst&&!!ice){radd(obst.listensFor,ice)}; evt.forEach((e)=>
         {
            if(e.slice(0,2)=='on'){e=e.slice(2)}; self.events[e]=hash; if(!!obst&&!!ice){radd(obst.listensFor,e)};
            Listen.jobs[hash]=[e,cbf]; let alt=VOID; let evn=e;

            if(obst&&(e=='dragstart')){obst.draggable=true; obst.setAttribute('draggable',true);};
            if(obst&&((e=='drop')||(e=='feed'))){obst.onFeed(cbf);return};
            if(isin(once,e)){opt=ONCE};

            if(isin(e,['down','up','key','click','Click','contextmenu','mouse','Mouse','wheel','scroll']))
            {
               let kpr; if(isin(e,'key')&&isin(e,':')){kpr=stub(e,':'); e=kpr[0]; kpr=kpr[2]; if(e=='key'){e='keydown'}};
               if(e=='LeftClick'){e='click';}else if(e=='RightClick'){e='contextmenu'}else if(e=='scroll'){e='wheel'};

               alt=function(evnt)
               {
                  extend(evnt)({hijack:function(frce)
                  {if(frce){this.stopImmediatePropagation()}; this.jacked=(frce||true); this.preventDefault(); this.stopPropagation();}});
                  let evn,btn,tgt,kcl,hcn,cmb,dev,crd,rpt,pvk,rkc,rsp,grb,key,ffmeta; evn=evnt.type; tgt=evnt.target; cmb=[];
                  dev=(isin(evn,'key')?'keyboard':'pointer'); pvk=this.pvk; rpt=evnt.repeat; key=this.kpr;
                  if((evnt instanceof MouseEvent)||(evnt instanceof WheelEvent)){dev='pointer'};
                  if(dev=='keyboard')
                  {
                     btn=Listen.keys.from(evnt);
                     if(key&&(btn.slice(0,key.length)==key)){key=btn}else{key=VOID};
                     if(!this.ice&&this.kpr){if(key==btn){this.run(evnt);};return};
                     if(tgt.typing){clearTimeout(tgt.typing)};
                     tgt.typing=setTimeout(()=>{tgt.signal('typingStop',crd)},500);
                  }
                  else
                  {
                     // if(evnt.ctrlKey){grb=1};
                     if(isin('mousewheel,wheel',evnt.type)){btn='MouseWheel'}else if(evnt.type=='mousemove'){btn='MouseMove'}
                     else if(evnt.type=='mouseover'){btn='MouseOver'}else if(evnt.type=='mouseout'){btn='MouseOut'}
                     else if(evnt.which==null){btn=((evnt.button<2)?"LeftClick":((event.button==4)?"MiddleClick":"RightClick"))}
                     else{(btn=(evnt.which<2)?"LeftClick":((evnt.which==2)?"MiddleClick":"RightClick"))};
                     crd=[evnt.clientX,evnt.clientY];
                     if(btn=='MouseWheel')
                     {
                        // dump(evnt);
                        let x=(Math.round(evnt.deltaX)||0); let y=(Math.round(evnt.deltaY)||0); let ew,sw,sl,bx,xr,xd,xp,a;
                        let d; if(!x){x=0;}; if(!y){y=0;}; if(evnt.deltaMode==1){x*=12; y*=12}; let eh,sh,st,el,yr,yd,yp,p;
                        el=tgt; bx=rectOf(el); ew=bx.width; eh=bx.height; sw=el.scrollWidth; sh=el.scrollHeight;
                        d=((sw>ew)?((x>0)?R:((x<0)?L:M)):((sh>eh)?((y>0)?D:((y<0)?U:M)):M)); let z;
                        a=((d==M)?M:(((d==L)||(d==R))?X:Y)); sl=el.scrollLeft; st=el.scrollTop;
                        p=round(((a==X)?((sl+ew)/sw):((st+eh)/sh)),1);
                        z=round((a==M)?0:((a==X)?(sw-(sl+ew)):(sh-(st+eh)))); crd=[x,y,d,a,p,z];
                        if(tgt.scrolling){clearTimeout(tgt.scrolling)};
                        tgt.scrolling=setTimeout(()=>{tgt.signal('scrollStop',crd)},300);
                     };
                  };

                  if((btn=='RightClick')){grb=1;}; kcl={ctrlKey:'Control',shiftKey:'Shift',metaKey:'Meta',altKey:'Alt'};
                  // if(ffmeta){pvk.push(btn); hcn=1}else{kcl.each((v,k)=>{if(evnt[k]){cmb.push(v)}; if(isin(btn,v)){hcn=1}})};
                  // if((span(cmb)>0)&&!rpt&&!hcn&&!isin(pvk,btn)){pvk.push(btn); this.pvk=pvk; cmb=cmb.concat(pvk);};
                  cmb=keys(Listen.keys.down); if(!isin(cmb,btn)){cmb.push(btn);};
                  cmb=cmb.join(' ').trim(); if(!isin(cmb,' ')){cmb=VOID}; if(!cmb){this.pvk=[];}; if(cmb&&rpt){return};
                  evnt.device=dev; evnt.signal=(cmb||btn); evnt.coords=crd;
                  if(!this.ice){this.run(evnt,grb); return};
                  if(cmb&&(this.ice==cmb)){grb=1; this.run(evnt,grb); return};
                  return;
               }
               .bind({tgt:self,cbf:cbf,ice:ice,pvk:[],kpr:kpr,evn:e,run:function(fe,ge)
               {
                  if(ge){fe.preventDefault(); fe.stopPropagation();};
                  if(isNode(this.tgt)&&this.tgt.disabled&&this.tgt.inclan('disabled')){return};
                  fe.Target=fe.currentTarget; this.cbf.apply(this.tgt,[fe]);
                  return false;
               }});
            };

            if(!alt)
            {
               alt=function(evnt)
               {
                  if(isNode(this.tgt)&&this.tgt.disabled&&this.tgt.inclan('disabled')){return};
                  evnt.Target=evnt.currentTarget; this.cbf.apply(this.tgt,[evnt]);
               }
               .bind({tgt:self,cbf:cbf});
               if(e=='mutation')
               {
                  alt.worker=(new MutationObserver(function(l)
                  {
                     if(!stak(0)){wack();return};

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

            Listen.jobs[hash][1]=alt;

            if(opt==EVRY){self.addEventListener(e,Listen.jobs[hash][1],true);return};
            if(opt==ONCE){self[('on'+e)]=Listen.jobs[hash][1]; self[('on'+e)].__evntID=hash;return};
         });
         return hash;
      },


      ignore:function(e,f, n,self,hash,x)
      {
         expect.text(e); self=(this||MAIN); if(!self.events){self.events={}};
         if(isFunc(f)){hash=sha1(f.toString());}else{hash=(!!Listen.jobs[e]?e:self.events[e])};
         x=Listen.jobs[hash]; if(!x){console.error('event hash `'+hash+'` is undefined');return};
         if(f===VOID){e=x[0]; f=x[1]}; expect.word(e); expect.func(f); n=('on'+e);
         if(self[n]===f){self[n]=VOID}else{self.removeEventListener(e,f,true);}; delete Listen.jobs[hash];
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
         ostime:(("(~BOOTTIME~)").split('.')[0]*1),
         stream:VOID,
         sensor:{},
         silent:{},
         hashes:{},
         status:VOID,
         timing:setTimeout(function(){server.sensor.live=0},1),
         events:{},
         opened:0,


         vivify:function(f)
         {
            if(!!this.stream&&isFunc(f)){f(this.stream);return}; let p=('/Proc/listen');

            this.stream=(new EventSource(p,{withCredentials:true})); this.stream.purl=p; server.sensor.live=0;
            this.stream.onmessage=function(evnt)
            {
                let mesg=atob(evnt.data);
                if(isJson(mesg)&&isin(mesg,[`"name":`,`"mesg":`,`"file":`,`"line":`],ALL)){fail(decode.jso(mesg));return};
                dump("unhandled server mesg:\n"+atob(evnt.data));
            };
            this.stream.listen('open',function(evnt)
            {
               server.sensor.live=1; server.status="open"; if(!server.opened){server.opened=1;};
               clearTimeout(server.timing); setTimeout(function(){server.sensor.live=0},6000);
            });
            this.stream.listen('ping',function(evnt)
            {
               server.sensor.live=1; server.status="open"; clearTimeout(server.timing);
            });

            this.stream.listen('gone',function(evnt){server.status="gone"; server.sensor.live=0;});
            this.stream.listen('fail',function(evnt){fail(decode.jso(atob(evnt.data)))});
            this.stream.listen('close',function(evnt){server.status="shut"; console.error("SSE closed");});

            this.stream.listen('error',function(evnt) // this happens on reconnect -or "connection fail", only the latter is an error
            {
               tick.after(6100,()=>
               {
                  if(server.sensor.live){server.status="open"; return};
                  // prevent reconnect flood for in case the server disconnects upon connect
                  // debug this issue by visiting the event emitter via API interface
                  purl
                  ({
                     target:evnt.Target.purl,
                     silent:true,
                     listen:
                     {
                        error:function(e)
                        {
                           let cde=this.status; if(cde==419){return;};
                           console.error(e);
                        },
                        loadend:function(rsp, cde,dne,stb)
                        {
                           rsp=rsp.body; cde=this.status; dne=(!rsp&&((cde<1)||(cde==503)));
                           if(server.sensor.live||(server.status=="gone")||(cde==200)||(cde==419)){return}; // all is well
                           if(cde!=200){server.stream.close(); console.error("SSE issue, checking health with XHR splilled this:\n"+rsp);}
                           if(dne){server.stream.close(); console.error('SSE stopped');};
                           if(!rsp&&(cde<1)){popAlert("link :: Connection : Unable to connect; refreshing now."); tick.after(6,()=>{repl.exit();}); return};
                           if(!rsp&&(cde==503)){popAlert("link :: Session Expired : Refreshing now."); tick.after(6,()=>{repl.exit();}); return};
                           if(rsp.startsWith(": \nevent: init\ndata: IQ==")&&isin(rsp,"clean exit; no errors")){return};
                           if(!rsp){rsp="undefined"}; stb=stub(rsp,"event: fail\ndata: ");
                           if(stb){rsp=trim(stb[2]); console.log(rsp); rsp=decode.jso(atob(rsp)); fail(rsp); return};
                           if(isJson(rsp)){rsp=decode.jso(rsp); fail(rsp); return}; let prl=evnt.Target.purl;
                           fail(`Server Side Events :: emitter **${prl}** died unexpectedly.\n${rsp}`);
                        },
                     }
                  });
               });
            });

            if(isFunc(f)){f(this.stream); return};


            dump("SSE init");
            wait.until(()=>{return (!!server.opened)},()=>
            {
                dump("SSE idle");  signal("serverReady");
                this.events.each((l,e)=>
                {l.forEach((o)=>{server.listen(e,o.func,o.hash,1)})});
            });
         },


         listen:function(e,f,h,deja, t,c)
         {
            if(!stak(0)){wack();return}; // omg! securityyyyy!!
            if(isFunc(h)){t=f; f=h; h=t;}; // swapped args
            if(isText(h,1)&&!!server.hashes[h]){return}; // i keel yoo

            if(isin(e,":")){c=stub(e,":"); e=trim(c[0]); c=trim(c[2]);};
            if(!isWord(e)){fail('expecting 1st arg as :word:');return};
            if(!isFunc(f)){fail('expecting 2nd arg as :func:');return};

            if(c&&!userDoes(c)){dump(`listening on event "${e}" requires "${c}" privileges`);return};
            // specify clan after event .. server.listen("DataReady: geek mind",()=>{});

            if(!server.events[e]){server.events[e]=[];}; // array of events handlers per event
            if(!deja){radd(server.events[e],{func:f,hash:h});};
            if(!server.opened&&deja){fail(`server is not ready yet !!!!`); return;}; // ?
            if(!server.opened){return;}; // added this to server events, will be called when vivified

            this.vivify(()=>{server.stream.addEventListener(e,function(evnt)
            {
               if(this.au&&!userDoes(this.au)){return;}; // security
               let d=atob(evnt.data);
               // if(isJson(d)){d=(decode.jso(d)||d)}; d=sval(d);
               this.cb(d);
            }.bind({cb:f,au:c}),false);});
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


         pacify:function()
         {
             server.stream.close(); server.opened=0;
             dump("SSE pacified");
         },
      },
   });

   const UNIQUE = ':UNIQUE:';
// --------------------------------------------------------------------------------------------------------------------------------------------



// incl :: RequireJS : dynamic dependency loader
// --------------------------------------------------------------------------------------------------------------------------------------------
   // '/Proc/libs/require/require.js'
// --------------------------------------------------------------------------------------------------------------------------------------------



// func :: loadFont : fix for openType
// --------------------------------------------------------------------------------------------------------------------------------------------
   const loadFont = function(fp,cb,rt, slf)
   {
      if(!rt){rt=1}; slf=this; if(!!this.done[fp]){cb(this.done[fp]);return}; // already loaded

      tick.after(8000,()=>
      {
         if(rt>4){alert("check your internet connection, then hit refresh");return};
         if(!slf.rtrn[fp]||!slf.done[fp]){loadFont(fp,cb,(rt+1));return};
         cb(slf.done[fp]);
      });

      slf.rtrn[fp]=opentype.load(fp,function(err,fnt)
      {
         if(err){console.error(err); return};
         if(!slf.rtrn[fp]){console.error(`openType.load failed to return anything of: ${fp}`); return};
         slf.done[fp]=fnt; cb(slf.done[fp]);
      });
   }
   .bind({rtrn:{},done:{}});
// --------------------------------------------------------------------------------------------------------------------------------------------



// func :: requires : versatile preloader
// --------------------------------------------------------------------------------------------------------------------------------------------
   const requires = function(l,cbfn,cbpi, s,a,slf,bzy,ztst)
   {
      // stak(KEEP);
      // if(MAIN.HALT){return};
      if(!stak(0)){wack();return};
      if(!isFunc(cbfn)){cbfn=function(){}}; if(!isFunc(cbpi)){cbpi=function(){}};
      slf=this; a={};

      if(isPath(l)&&l.endsWith('/'))
      {
         purl('/Proc/scanFold',{path:l},(r)=>{r=r.body; r=((wrapOf(r)=="[]")?decode.jso(r):[]); requires(r,cbfn,cbpi)});
         return;
      };

      if(!l||(span(l)<1)){cbfn();return}; if(!isList(l)){l=[l]}; bzy={todo:0,done:0,jobs:l,hash:md5(l.join(""))};
      if(slf.seen[bzy.hash]){cbfn();return}; slf.seen[bzy.hash]=1;


      l.each((i)=>
      {
         let p=stub(i,':'); if(p){i=p[2]; p=p[0]; a[p]=VOID}; let x=fext(i);
         if(x=='fnt'){x='css'}; if(!x){fail('expecting valid path');return STOP}; // validate
         bzy.todo++; if(slf.done[i]){bzy.done++; cbpi(i);return}; // already loaded
         let t=VOID;

         if((x=='js') || (x=='mjs'))
         {
            let n=create({script:"", src:i}); n.purl=i;
            n.listen('ready',function(){slf.done[this.purl]=1; bzy.done++; cbpi(this.purl);});
            n.listen('error',function(ev)
            {
                slf.done[this.purl]=1; bzy.done++;
                ev = (ev.detail ? ev.detail : ev);
                if (ev.mesg !== "SyntaxError: Unexpected token '<'"){return}; MAIN.HALT = 0;

                let itv = setInterval(()=>
                {
                    let m = (select("modal")||[])[0];
                    if (m){ remove(m); clearInterval(itv); };
                },1);

                purl(ev.file,(refl)=>
                {
                    MAIN.HALT = 0;   refl = refl.body.trim();
                    if (!isHtml(refl)){return};
                    if (!refl.endsWith("</html>")){ refl = ("<html>"+refl+"</html>"); };
                    let v = create({iframe:".layr"});
                    v.listen("load",()=>
                    {
                        v.contentWindow.document.write(refl);
                    });
                    select("#anonMainView").innerHTML="";
                    select("#anonMainView").insert(v);
                    v.contentDocument.body.parentNode.addEventListener("click",tapper);
                });
                MAIN.HALT = 1;
            });

            document.head.insert(n);
            return;
         };

         if(x=='css')
         {
            let n=create('link'); n.purl=i;
            n.listen('ready',function(){slf.done[this.purl]=1; bzy.done++; cbpi(this.purl);});
            n.modify({rel:'stylesheet',href:i}); document.head.insert(n); return;
         };

         if((x=='htm')||(x=='html'))
         {
            purl(i,(r,dm)=>
            {
               dm=(xdom(r.body)||[]); dm.forEach((n)=> // html - insert each element into its implied DOM parent
               {
                   n.setAttribute("srcdoc",r.path); n.setAttribute("purl",r.path);
                   document[(isin(['script','link','style'],nodeName(n))?'head':'body')].insert(n);
               });
               tick.after(50,()=>{slf.done[r.path]=1; bzy.done++; cbpi(r.path);})
            }); return;
         };

         if(isin(['woff','ttf','otf'],x))
         {
            loadFont(i,function(fnt)
            {
               if(!!slf.done[this.pth]){return}; slf.done[this.pth]=1; bzy.done++;
               let fln,fam,mim,css,hsh,fmt,ico,reg;
               fln=this.pth.split('/').pop().split('.')[0]; fam=this.fam;if(!fam){fam=(fnt.names.fontFamily.en||fln)};fam=swap(fam,' ','-');
               hsh=md5(this.pth); fmt=fnt.outlinesFormat; ico=(isin(lowerCase(fam),'icon')||isin(lowerCase(fln),'icon'));
               reg=(ico||isin(lowerCase(fnt.names.fontSubfamily),'regular')); reg=((reg||ico)?` font-weight:normal; font-style:normal;`:'');
               css=`@font-face{font-family:'${fam}'; src:url('${this.pth}') format('${fmt}');${reg}}\n\n`;
               css+=`[class^="${fam}-"], [class*=" ${fam}-"] {font-family:'${fam}' !important; `
               if(ico){css+=`speak:none; font-style:normal; font-weight:normal; font-variant:normal; text-transform:none; line-height:1; `};
               css+=`-webkit-font-smoothing:antialiased; -moz-osx-font-smoothing: grayscale;}\n\n`
               if((this.fam||ico)&&(fnt.glyphNames.names.length>0)){fnt.glyphs.glyphs.each((g)=>
               {
                  if(!g.unicode||!g.name||g.name.startsWith('.')){return}; let c=g.unicode.toString(16);
                  css+=`.${fam}-${g.name}:before{content:"\\${c}";}\n`;
               })}
               else
               {
                  for(let gx=33; gx<256; gx++)
                  {let hx=gx.toString(16); while(hx.length<4){hx=`0${hx}`}; css+=`.${fam}-${hx}:before{content:"\\${hx}";}\n`;};
               };
               document.head.insert({style:'', purl:this.pth, contents:css});
               cbpi(this.pth);
            }.bind({fam:p,pth:i}));
            return;
         };

         console.error('requires() :: unsupported file-extension `'+x+'`'); return STOP; // loop must not reach here
      });

      if(bzy.done==bzy.todo){cbfn();return}; // already loaded

      let ticr=setInterval(()=>
      {
         let tprc=Math.ceil((bzy.done/bzy.todo)*100);
         if(((typeof Busy)!="undefined")&&(slf.tprc!=tprc)){Busy.edit(`/${bzy.hash}`,tprc)};
         slf.tprc=tprc; if(tprc>99){clearInterval(ticr); slf.tprc=0; cbfn()};
      },10);
   }
   .bind({call:{},done:{},seen:{},tprc:0});
// --------------------------------------------------------------------------------------------------------------------------------------------



// tool :: custom : library for custom `domtag` and `attrib` .. extend anywhere with: `extend(custom.domtag)({newtag:funcion(){}})`
// --------------------------------------------------------------------------------------------------------------------------------------------
   const custom = {domtag:{},attrib:{}};
// --------------------------------------------------------------------------------------------------------------------------------------------



// func :: create : create DOM nodes from string, list, object .. custom nodes are defined in `/Site/base/xtag.js`
// --------------------------------------------------------------------------------------------------------------------------------------------
   const create = function(t,a,c, r,x,n,ca)
   {
      // if(MAIN.HALT){return};
      if(isList(t)){r=[]; t.forEach((o)=>{r.push(create(o,a,c))}); return r}; // list of nodes
      if(wrapOf(trim(t))=='<>'){return xdom(t)}; // xml to node-list
      if(isText(t,1)){t={[t]:(a||''),contents:c}}; if(!isKnob(t)){return}; // validate

      a=t; t=VOID; t=keys(a)[0]; n=document.createElement(t); // new element
      ca=isin(a,["contents","$","children"]);
      if(isList(a[t])||isNumr(a[t])){c=a[t];} // tag value is contents
      else if(isText(a[t],2)&&((a[t][0]=='#')||(a[t][0]=='.'))&&test(a[t],/^([a-zA-Z0-9- _\.#]){2,432}$/)) // tag value is id and/or classes
      {
         x=a[t]; delete a[t]; if(!a.class){a.class=''}; a.class=a.class.split(' '); // quick id & non/existing classes
         x.split(' ').forEach((i)=>{c=i[0]; i=i.slice(1); if(c=='#'){a.id=i; a.name=i}else{a.class.push(i)}}); // set id/classes
         a.class=a.class.join(' ').trim(); // normalized classes string - now containing `.class` if defined
         c=(ca?a[ca]:VOID);
      }
      else if(isText(a[t])&&(!ca||isVoid(a[ca]))){c=a[t];} // tag value is contents
      else if(ca&&!isVoid(a[ca])){c=a[ca]}; // contents explicitly defined
      delete a[t]; if(ca){delete a[ca]}; // tag-name and `contents` are not attributes, get rid of them

      let fc=a.forClans; if(!isVoid(fc)){delete a.forClans; if(!userDoes(fc)){return}}; // ignore if not for this user's clan
      // if(isKnob(a.style)){a.style.each((v,k)=>{n.style[k]=v}); delete a.style}; // style object
      if(isFunc(custom.domtag[t]))
      {
         let dt=custom.domtag[t](n,a,c); if(dt==DONE){return n}; if(isNode(dt)||isTemp(dt)){return dt};
      }; // handle this node
      r=modify(n,a,c); // set this node's attributes, the result is the updated node
      if((r.childNodes.length<1)&&(c!=VOID)&&(c!='')){r=r.insert(c)}; // insert content if xtag & xatr did not
      return r; // done
   }
// --------------------------------------------------------------------------------------------------------------------------------------------



// func :: modify : define -or update exising DOM-node-attributes .. custom attributes are defined in `/Site/base/xatr.js`
// --------------------------------------------------------------------------------------------------------------------------------------------
   const modify = function(n,a,c,o)
   {
      // if(MAIN.HALT){return};
      if(!isNode(n)||!isKnob(a)){return}; // validate
      a.each((v,k)=>
      {
         if(o&&isin(o,k)){return};
         if(isFunc(custom.attrib[k])){if(!isVoid(custom.attrib[k](v,n,a,c))){return}}; // set attribute from custom, VOID returns get ignored
         // if(isin(['src','href'],k)&&v.startsWith('~/')){v=ltrim(v,'~/'); v=('/User/data/'+sesn('USER')+'/home/'+v);};
         if(!isFunc(v)&&!isKnob(v)&&(k!='innerHTML')){n.setAttribute(k,v);}; // normal attribute
         if(k=='class'){k='className'}; // prep attribute name for JS
         if((k=='className')&&!trim(v)){return};
         n[k]=v; // set attribute as property -which possibly triggers some intrinsic JS event
      });
      return n;
   }

   extend(Element.prototype)
   ({
      modify:function(a,o)
      {
         return modify(this,a,VOID,o);
      },
   });
// --------------------------------------------------------------------------------------------------------------------------------------------



// tool :: (Element.prototype) : insert .. handy appendChild/innerHTML .. converts object/list/html to nodes .. converts non-text to text
// --------------------------------------------------------------------------------------------------------------------------------------------
   extend(Element.prototype)
   ({
      insert:function(v)
      {
         // if(MAIN.HALT){return};
         if(v==VOID){return this}; let t=nodeName(this);
// dump(this, v);
         if(isList(v)){var s=this; listOf(v).forEach((o)=>{s.insert(o)});return s}; // works with nodelist or list-of-anything
         this.signal('insert');
         if(t=='img'){return this}; // TODO :: impose?
         if(t=='input'){this.value=tval(v); return this}; // form input text
         if(isNode(v)||isTemp(v)){this.appendChild(v); return this}; // normal DOM-node append
         if(isKnob(v)){let n=create(v); if(!isNode(n)){return this}; this.appendChild(n);return this}; // create it first then append
         if(isText(v)&&(wrapOf(trim(v))=='<>')){this.innerHTML=v; return this}; // convert html to nodes and try again
         if(!isText(v)){v=tval(v);}; // convert any non-text to text .. circular, boolean, number, function, etc.
         if(isin(['code','text'],t)){this.textContent=v; return this;}; // insert as TEXT
         if(isin("style,script,pre,span,h1,h2,h3,h4,h5,h6,p,a,i,b",t)){this.innerHTML=v; return this}; // insert as HTML
         let n=document.createElement('span'); n.innerHTML=v; this.appendChild(n); return this; // append text as span-node
      },

      render:function(d,f)
      {
          render.apply(this, [d,(r)=>
          {
              if(isFunc(f)){f.apply(this,[r]); return};
              this.innerHTML=""; this.insert(r);
          }]);
      },
   });
// --------------------------------------------------------------------------------------------------------------------------------------------



// tool :: (Object.prototype) : fuse ..
// --------------------------------------------------------------------------------------------------------------------------------------------
   extend(Object.prototype)
   ({
      fuse:function(that,flag)
      {
          if(isFunc(that)){return that.bind(this)};
          if(!expect.knob(that)){return}; // can only merge objects
          if((flag!==F)&&isin(keys(this),keys(that))){fail("danger :: force-override-existing-key with: `foo.fuse(bar,F)`");return};
          that.each((v,k)=>{this[k]=v;}); return this;
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
      let a=listOf(arguments); if(a.length>1){q=a;}; if(isList(q,1,1)){q=q[0];};
      if(isList(q)){q.forEach((i)=>{remove(i);}); return true};

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
   const newGui = function(p,v, t,b,a)
   {
      if(!!server && !!server.stream){server.stream.close()};
      MAIN.CONFIRMLEAVE=0; if(isKnob(p)){v=p; p=VOID};
      if(isPath(p)){t=(location.protocol+'//'+location.host+p)}else{t=location.href};
      if (!isin(t,"freshGui"))
      { a=rstub(t,"#"); if(a){t=a[0]; a=("#"+a[2])}else{a=""}; t=((!isin(t,"?")?"?":"&")+"freshGui="+fash()+a); };
      b=[{input:'#INTRFACE', type:'hidden', value:'GUI'}]; cookie.delete("RECEIVER");
      if(isKnob(v)){v.each((vd,vn)=>{radd(b,{input:`#${vn}`, type:'hidden', value:vd})})};
      document.body.insert([{form:'#anonReboot', action:t, method:'POST', style:'position:absolute;opacity:0', contents:b}]);
      tick.after(250,()=>{select('#anonReboot').submit()});
   };
// --------------------------------------------------------------------------------------------------------------------------------------------



// func :: durl : create data-url from path -or blob
// --------------------------------------------------------------------------------------------------------------------------------------------
   const durl = function(d,f, p,n,o)
   {
      if (isText(d) && isText(f))
      {
          return ("data:"+f+";base64,"+encode.b64(d));
      };
      if(!!d&&(isDurl(d)||isDurl(d.data))){f(!!d.data?d.data:d);return};
      p=pathOf(d); if(!p){decode.BLOB(d,f); return};
      n=d.split('/').pop(); o=select(`img[src="${p}"]`);
      if(o){d=o[0].toDataURL(mimeType(n)); f(d,n);return};
      purl('/Proc/makeDurl',{purl:d},(r)=>{f(r.body,n)});
   };
// --------------------------------------------------------------------------------------------------------------------------------------------



// func :: furl : decode data-URL .. returns object with keys: mime & data
// --------------------------------------------------------------------------------------------------------------------------------------------
   const furl = function(x,f, p,d,m,r)
   {
      if(!isDurl(x)){fail("expecting data-URL");return};
      p=stub(x,';base64,'); d=p[2]; m=stub(p[0],'data:')[2]; x=VOID; p=VOID;
      r={mime:m,data:decode.b64(d)}; d=VOID; if(!isFunc(f)){return r}; f(r);
   };
// --------------------------------------------------------------------------------------------------------------------------------------------



// tool :: onFeed : drop-on event trap
// --------------------------------------------------------------------------------------------------------------------------------------------
   extend(Element.prototype)
   ({
      onFeed:function(h)
      {
         this.handle=h;
         this.ondragover=function(e){e.preventDefault();e.stopPropagation(); this.focus()};
         this.ondragenter=function(e){this.focus()};
         this.ondragleave=function(e){this.blur()};
         this.ondrop=function(e,s)
         {
            e.preventDefault(); e.stopPropagation(); var d,l,z; d=e.dataTransfer; l=d.files; s=this; z=([...l]);
            if(z.length>0){z.forEach(function(f){decode.BLOB(f,function(r){s.handle(r,f.name);})});return};
            let r=d.getData('text/plain'); if(pathOf(r)){durl(r,function(t,f){s.handle(t,f);});return};
            s.handle(r);
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
   const select = function(x,h, l,p,c,n,r,f,y)
   {
      if(isText(x)){x=x.trim()}; if(!isText(x,1)){return}; if(!isNode(h)){h=document.documentElement}; c=VOID; n=1; // validate
      c=isin(x,['^^','<<','>>','^','<','>']); if(c&&(x.indexOf(c)>0)){c=VOID}; // validate special-select
      if(c){p=stub(x,c); x=p[2]; p=stub(x,' '); if(p){n=(p[0]);x=p[2]}else if(!isNaN(x)){n=x;x=''}}; r=[];
      if(c){h=h.lookup(c,n); if(!x){return h}; return select(x,h)}; f='querySelectorAll'; // lookup relatives .. line below is all children *
      if(x=='*'){l=listOf(h.childNodes); l.forEach((i)=>{if(!((i.nodeName=='#text')&&!i.textContent.trim())){r.push(i)}}); return r};
      c=x[0]; l=h[f](':scope '+x); if((l.length<1)&&(c=='#')&&(x.indexOf(' ')<1)){x=x.slice(1);l=h[f](':scope [name='+x+']')}; // pseudo-selector
      if(l.length<1){return}; listOf(l).forEach((i)=>
      {if(isin(x,"[value=")){y=stub(x,"=")[2]; y=unwrap(rstub(y,"]")[0]); if(i.value!=y){return}}; radd(r,i);}); // fixed querySelector bug
      if(r.length<1){return}; if((c=='#')&&!isin(x,' ')){r=r[0]}; return r;
   };


   extend(HTMLInputElement.prototype)
   ({
      All:HTMLInputElement.prototype.select,
      select:function(x)
      {
         if(!isText(x,1)){return this.All.apply(this,listOf(arguments))};
         return select(x,this);
      },
      getSelection:function(r)
      {
         let v,b,e; v=this.value; if(v.length<1){return ''}; b=this.selectionStart; e=this.selectionEnd;
         if(!(b<e)){return (r?VOID:'')}; if(r){return [b,e]}; r=v.slice(b,e); return r;
      },
      setSelection:function(b,e,f)
      {
         let v,x; v=this.value; if(v.length<1){return}; if(isText(b)){x=v.indexOf(b); e=(x+b.length); b=x;};
         if(isInum(e)&&(e<0)){e=(v.length+e)}; if(!isInum(b)||!isInum(e)||(b<0)){return};
         this.setSelectionRange(b,e); if(f||(f==VOID)){this.focus()};
      },
   });


   extend(Element.prototype)
   ({
      select:function(x)
      {
         // if(isin('textarea,input',nodeName(this))&&!isText(x,1)){return this.oSelect.apply(this,listOf(arguments))};
         return select(x,this);
      },

      getSelection:function(fn, so,sn)
      {
          so=getSelection(); if(so.isCollapsed){return ""}; sn=so.focusNode; if(!this.contains(sn)){return ""};
          return (so+"");
      },

      lookup:function(c,n, r,w)
      {
         if(!n){if(c=='^'){return this.parentNode}; if(c=='<'){return this.previousSibling}; if(c=='>'){return this.nextSibling}};
         if((c=='<<')||(c=='>>')){r=this.parentNode; return (!r?VOID:((c=='<<')?r.firstElementChild:r.lastElementChild))};
         if(!isText(c,1)){return}; if(c=='^^'){c='^',n=2}; n=(n*1); if(!isin(['^','<','>'],c)||!isInum(n)||(n<1)){return this}; // validate
         r=this; w=((c=='^')?'parentNode':((c=='<')?'previousSibling':'nextSibling')); while(n){n--; if(!!r[w]){r=r[w]}else{break}}; // find
         return r; // returns found-relative, or self if relative-not-found
      },

      getElder:function(d, p,c,f,v,r)
      {
          if(isNumr(d)){return this.lookup("^",d);}; if(!isText(d,1)){return}; c=d[0]; f=(isin("#.",c)?d.slice(1):d);
          p=this.parentNode; if(!p){return}; v=((c=="#")?p.id:((c==".")?p.className:nodeName(p))); if(v==f){return p}; do
          {p=p.parentNode; if(!p){break; return}; v=((c=="#")?p.id:((c==".")?p.className:nodeName(p))); if(v==f){r=p;break}}
          while(!r&&!!p); return r;
      },

      houses:function(n, h,p,r)
      {
         h=this.UniqueID; p=n.parentNode; r=false; if(!p){return r}; if(p.UniqueID==h){return true};
         do{p=p.parentNode; if(!p){break}else if(p.UniqueID==h){r=true;break}}while(!r&&!!p);
         return r;
      },
   });

   extend(HTMLImageElement.prototype)
   ({
      toDataURL:function(m,q)
      {
         let c=document.createElement('canvas');
         c.width=this.naturalWidth; c.height=this.naturalHeight;
         c.getContext('2d').drawImage(this,0,0); return c.toDataURL(m,q);
      },
   });
// --------------------------------------------------------------------------------------------------------------------------------------------



// tool :: parser : tool library for `parsed` .. extend this anywhere with: `extend(parser)({mimeType:function(){}})`
// --------------------------------------------------------------------------------------------------------------------------------------------
   const parsed = function(v,x,f)
   {
      // if(MAIN.HALT){return};
      if(!isText(v,1)&&!isKnob(v)){fail('expecting 1st arg as text -or knob');return};
      if(!isText(x)){fail('expecting 2nd arg as text');return};
      if(!isin(keys(parser),x)){fail('no parser defined for mimeType `'+x+'`');return};
      if(!isFunc(parser[x])){fail('expecting parser extension `'+x+'` as a function');return};
      if(!isFunc(f)){fail('expecting 3rd arg as callback-function');return};

      return parser[x](v,f);
   };

   const parser = {};

   (~'/Site/base/ximp.js'~)
// --------------------------------------------------------------------------------------------------------------------------------------------



// func :: render : get remote asset and make it DOM-usable
// --------------------------------------------------------------------------------------------------------------------------------------------
   const render = function(p,f,  s,x)
   {
      s = (this || select("#anonMainView"));

      if(isKnob(p)||isList(p)||isNode(p))
      {
          let n=(isNode(p)?p:create(p));
          s.innerHTML="";
          s.insert(n);
          if(!isFunc(f)){return n};
          n.listen("ready",f); return;
      };
      // if(MAIN.HALT){return};
      if(!p){p='/'};  s=this;  x=fext(p);

      purl(p,(r)=>
      {
         let m,q,t,x; m=r.head.ContentType.split(';')[0].split('/x-').join('/');
         q=m.split('/'); t=trim(q[0]); x=trim(q[1]); if(!isin(keys(parser),t)){t=x};
         if(!trim(r.body)){if(!isFunc(f)){s.innerHTML="";}else{f("")}; return};

         parsed(r,t,(z)=>
         {
            if(t=='markdown'){z=create({div:'.markdown-page',contents:[z]})};
            if(isFunc(f)){f.apply(s,[z]); return};
            // s.innerHTML="";
            // s.insert(z);
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
         if(!isText(v,1)){return}; this.style.display=v;
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


      reclan:function()
      {
         var a; a=listOf(arguments); a.forEach((i)=>
         {
            if(!isText(i)||!isin(i,':')){return}; let p=i.split(':'); let f=p[0].trim(); let t=p[1].trim();
            if(!f||!t){return}; this.declan(f); this.enclan(t);
         });
      },


      inclan:function()
      {
         var a,c,r; a=listOf(arguments); c=(this.className||'').trim(); r=FALS;
         a.each((i)=>{i=ltrim(i,'.'); if(isin(c),i){r=TRUE;return STOP}});
         return r;
      },


      enbool:function(w)
      {
         if(!isText(w,1)){return}; this[w]=true; this.setAttribute(w,w); this.enclan(w);
      },


      debool:function(w)
      {
         if(!isText(w,1)){return}; this[w]=false; this.removeAttribute(w); this.declan(w);
      },
   });
// --------------------------------------------------------------------------------------------------------------------------------------------




// tool :: (Element.prototype) : assort .. sort node children/siblings placement order either by `sorted` (arg/parent), or `placed` of siblings
// --------------------------------------------------------------------------------------------------------------------------------------------
   extend(Element.prototype)
   ({
      assort:function(r, f,w)
      {
         if(!r){r=this.sorted}; w=`assort rule: ${r}`; f=`invalid ${w}`;  let prts,slct,attr,ordr,indx,fltr;
         if(!isText(r,6)||!isin(r,"::")){fail(f);return}; prts=stub(r,"::"); slct=trim(prts[0]); prts=stub(trim(prts[2]),":");
         if(!slct||!prts){console.warn(f);return}; attr=trim(prts[0]); ordr=lowerCase(trim(prts[2])); if(!attr||!ordr){console.warn(f);return};
         slct=this.select(slct); if(!slct){console.warn(`no childNodes match ${w}`);return}; indx={};
         slct.forEach((n)=>{let a=bore(n,attr); if(isVoid(a)){return}; indx[a]=n; remove(n)}); fltr=(keys(indx)).sort();
         if(ordr=="dsc"){fltr.reverse()}; fltr.forEach((i)=>{this.appendChild(indx[i])});
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
            let bx=n.getBoundingClientRect(); n.style[sk]=sv;

            if((sk=='transform')&&isin(sv,['isoSkewX','isoSkewY']))
            {
               let pt=stub(sv,'('); sk=pt[0]; sv=(swap(rtrim(pt[2],')'),'deg','')*1); if(isNaN(sv)){sv=45}; sv=(sv%90);
               if(!n.postProc){n.postProc={}}; if(!n.postProc.transform){n.postProc.transform={}}; n.postProc.transform[sk]=sv;
               n.onready=function()
               {
                  let pt,sx,sy,ob,iw,ih,ml,mt,nb,wd,hd,xd,yd; pt=this.postProc.transform; sx=pt.isoSkewX; sy=pt.isoSkewY;
                  ob=this.getBoundingClientRect(); iw=ob.width; ih=ob.height;
                  if(sx){this.style.transform=('perspective('+((iw/2)-(ih/2))+'px) rotateX('+sx+'deg)');}
                  else{this.style.transform=('perspective('+((ih/2)-(iw/2))+'px) rotateY('+sy+'deg)');};
                  nb=this.getBoundingClientRect();
                  if(nb.x<ob.x){this.style.marginLeft=((ob.x-nb.x)+'px'); this.style.marginRight=((ob.x-nb.x)+'px');}
                  else if(nb.x>ob.x){this.style.marginLeft=(0-(nb.x-ob.x)+'px');};
                  if(nb.y<ob.y){this.style.marginTop=((ob.y-nb.y)+'px');}else if(nb.y>ob.y){this.style.marginTop=(0-(nb.y-ob.y)+'px');};
               };
            }
            else if((sk=='transform')&&isin(sv,['scale','scaleX','scaleY']))
            {
               let ob,nb,xd,yd,ml,mt; ob=bx; nb=n.getBoundingClientRect(); ml=(n.getStyle('margin-left')||0); mt=(n.getStyle('margin-top')||0);
               xd=((nb.x<ob.x)?(ob.x-nb.x):(nb.x-ob.x)); yd=((nb.y<ob.y)?(ob.y-nb.y):(nb.y-ob.y));
               if(nb.x<ob.x){xd=(ml+xd); n.style.marginLeft=`${xd}px`;}else if(nb.x>ob.x){xd=(ml-xd); n.style.marginLeft=`${xd}px`;}
               if(nb.y<ob.y){yd=(mt+yd); n.style.marginTop=`${yd}px`;}else if(nb.y>ob.y){yd=(mt-yd); n.style.marginTop=`${yd}px`;}
            }
         });
         return
      },


      getStyle:function(d, r,q,z)
      {
         if(isList(d)){r={}; d.forEach((i)=>{r[i]=cStyle(this,i)}); return r}; if(!isText(d)){return}; r=cStyle(this,d);
         if(r=='none'){return}; if((d!='transform')||!isin(r,'(')){return r}; q=this.style[d].split(')'); r=VOID; r={};
         q.forEach((i)=>{i=trim(i).split('('); let k=trim(i[0]); let v=trim(i[1]); if(!k||!v){return}; if(!isNaN(v)){v*=1}; r[k]=v});
         return r;
      },
   });


   const styleSheet = function(d)
   {
      let r,z; r=VOID; z={}; if(!isText(d,1)){return}; (document.styleSheets.each((v)=>
      {if((v.ownerNode.purl==d)||isin(v.ownerNode.href,d)||(v.ownerNode.id==d)||isin(v.className,d)){r=listOf(v.rules); return STOP}}));
      if(!r){return}; r.forEach((i)=>
      {
         let s=i.selectorText; let p={}; if(!s||!isin(i.cssText,';')){return}; let q=trim(unwrap(trim(i.cssText.split(s)[1]))).split(';');
         q.forEach((y)=>{y=stub(y,':'); if(!y){return}; let k=trim(y[0]); let v=trim(y[2]); if(isNumr(v)){v*=1}else{v=unwrap(v)}; p[k]=v});
         z[s]=p;
      });
      return z;
   };
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




// func :: todo : creates/updates a task related to title & file
// --------------------------------------------------------------------------------------------------------------------------------------------
   const todo = function(a, e,p,t,m,s)
   {
      if(isText(a)){a=a.trim()}; e='invalid use of `todo()`'; p=stub(a,' :: '); if(!isText(a,8)||!p){fail(e);return};
      t=trim(p[0]); m=trim(p[2]); if(!isText(t,2)||!isText(m,2)){fail(e);return}; s=stackLog()[0];
      dump(s);
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
   const popModal = function(arg)
   {
      // stak(KEEP);
      if(isKnob(arg))
      {
         let a,h,b,f; a=arg.attr; h=arg.head; b=arg.body; f=arg.foot;
         delete arg.attr;  delete arg.head;  delete arg.body;  delete arg.foot; if(span(arg)<1){arg=VOID};
         if(!a){a=arg}; if(!a&&!!h&&!!b){return this.fnc({head:h,body:b,foot:f});}; // single call, no attr
         if(isKnob(a)){return function(dfn){return this.fnc(dfn,this.atr)}.bind({fnc:this.fnc,atr:a})}; // double-call
         fail("invalid use of `popModal()`");
      };

      if(isList(arg))
      {
         return function(d)
         {
            let o={head:this.ttl};
            if(!isKnob(d)){o.body=d}else{o.body=d.body; o.foot=d.foot;};
            return this.fnc(o);
         }
         .bind({fnc:this.fnc,ttl:arg});
      };

      if(isText(arg))
      {
         let b,s,i,h; b=trim(arg); if(!b||isin(b,"\n")){fail("invalid use of `popModal()`");return};
         s=stub(b," :: "); if(s){i=trim(s[0]); b=trim(s[2])}else{i="info"}; s=stub(b," : "); if(s){h=trim(s[0]); b=trim(s[2])};
         if(h&&b){return this.fnc({head:[{icon:i},{span:h}],body:b})};  // simplest modal definition .. single-call .. ("head : body")
         return function(d)
         {
            let o={head:[{icon:this.ico},{span:this.ttl}]};
            if(isKnob(d)){o.body=d.body; o.foot=d.foot;}else if(isList(d)){o.body=d};
            if(!isText(d)){return this.fnc(o)};
            parsed(d,'markdown',(htm)=>{o.body=htm; this.fnc(o)}); // TODO :: await : make synchronous to return modal object
         }
         .bind({fnc:this.fnc,ico:i,ttl:b}); // double-call .. ("head")(*)
      };

      fail("invalid use of `popModal()`");
   }
   .bind
   ({
      fnc:function(obj,atr)
      {
         if(!isKnob(obj)){fail('expecting object');return};
         if(!isText(obj.head,1)&&!isList(obj.head,1)&&!isKnob(obj.head,1)){fail('invalid modal head');};
         if(!isText(obj.body,1)&&!isList(obj.body,1)&&!isKnob(obj.body,1)){fail('invalid modal body');};
         if((obj.info!=VOID)&&!isText(obj.info,1)&&!isList(obj.info,1)&&!isKnob(obj.info,1)){fail('invalid modal info');};

         if(!atr){atr={}}; var mid,thm,box,inf,rsl; mid=('MDL'+hash()); if(!atr.class){atr.class='';}; atr.class=atr.class.trim().split(' ');
         ladd(atr.class,'modalBox'); ladd(atr.class,'cenmid'); thm=(atr.theme||atr.skin); if(!thm){thm=(userDoes("work,sudo")?"dark":"lite")};
         if(thm){radd(atr.class,thm)}; atr.class=atr.class.join(' ');  let ti,tv; ti=`info`;

         if(isText(obj.head)){tv=stub(obj.head," :: "); if(tv){ti=tv[0];obj.head=tv[2]}; obj.head={span:obj.head}};
         if(!isList(obj.head)){obj.head=[obj.head]}; if(!(obj.head[0]||{}).icon){ladd(obj.head,{icon:ti})};
         let xash=sha1(encode.jso(obj.head));  let stop=0; (select('modal')||[]).each((mn)=>{if(mn.xash==xash){stop=1}});
         if(stop){dump("ignored attempt to open duplicate modal");return}; // already open

         let fiob,liob,pagr,clot,tout; clot=(thm?` .${thm}`:"");
         tout=atr.time; if(!isInum(tout)){tout=VOID};
         radd(obj.head,{icon:`.shut${clot}`, face:'cross', title:"close", onclick:function(){this.root.exit()}});
         if(isList(obj.body,2)&&isKnob(obj.body[0])){fiob=obj.body[0];}; if(!!fiob&&isKnob(vals(obj.body,-1))){liob=vals(obj.body,-1)};
         if(isText(obj.body)){obj.body=[{panl:obj.body}]}; if(!obj.foot){obj.foot=`Okay`};
         if(isText(obj.foot)){obj.foot={butn:obj.foot}}; if(!isList(obj.foot)){obj.foot=[obj.foot]};

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


         if(isList(obj.foot))
         {
            obj.foot.forEach((b,i)=>
            {
               if(isin(["cancel","okay","ok"],lowerCase((b.text||b.contents||b.$||b.butn)+""))&&!b.onclick&&!b.listen)
               {obj.foot[i].onclick=function(){this.root.exit()}};
            });
         };

         box=create({grid:'.cenmid', contents:
         [
            {row:[{col:'.head', contents:[{div:obj.head}]}]},
            {row:[{col:'.body', contents:[{panl:'.wrap', contents:[{grid:[{row:
            [
               (obj.info?{col:'.info', contents:obj.info}:VOID),
               {col:'.view', contents:obj.body},
               (tout?{col:'.side', contents:[{div:'.xbar'}]}:VOID),
            ]}]}]}]}]},
            {row:[{col:'.foot', contents:obj.foot}]},
         ]});

         let sze=(atr.size||"400x230"); if(sze){delete atr.size}; if(isText(sze)){sze=stub(sze,['x',',',' ',':']);
         if(sze){sze=[(trim(sze[0])*1),(trim(sze[2])*1)]}};
         if(isList(sze)&&((span(sze)<2)||!isNumr(sze[0])||!isNumr(sze[1]))){sze=VOID};
         if(sze){if(!isKnob(atr.style)){atr.style={}}; atr.style.width=sze[0]; atr.style.height=sze[1];};
         box.modify(atr);

         rsl=create({modal:mid, xash:xash, contents:[{wrap:[box]}]}); box.root=rsl;
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


        rsl.gone=function(sec)
        {
           let bar=this.select('.xbar')[0]; let hgt=rectOf(this.select('.body')[0]).height; bar.view('block');
           let unt=(hgt/sec); bar.setStyle({height:hgt}); this.ticker=tick.every(1000,()=>
           {
              sec--; bar.setStyle({height:Math.floor(unt*sec)}); if(sec>0){return};
              this.signal('gone'); tick.after(60,()=>{this.exit()});
           });
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
         box=rsl.select('.modalBox')[0];
         // let bxd=rectOf(box); box.declan('cenmid');
         // box.setStyle({position:'absolute',left:Math.floor(bxd.left),top:Math.floor(bxd.top)});
         if(tout){tick.after(60,()=>{rsl.gone(tout)})}; rsl.focus();
         let il=rsl.select("input"); if(!il){il=rsl.select("textarea")};  if(!!il&&!!il[0]){il[0].focus()};
         return rsl;
      },
   });
// --------------------------------------------------------------------------------------------------------------------------------------------



// func :: popAlert : opens a pre-formatted modal dialogue .. requires a heading
// --------------------------------------------------------------------------------------------------------------------------------------------
   const popAlert = function(msg,tme, stb,ico,ttl,bdy)
   {
      msg=trim(msg); msg=msg.split('\n'); msg.forEach((l,x)=>{msg[x]=l.trim()}); msg=msg.join('\n');
      stb=stub(msg,` :: `); if(stb){ico=stb[0]; msg=stb[2];}else{ico=`warning`};
      stb=stub(msg,` : `); if(stb){ttl=stb[0]; bdy=stb[2];}else{ttl=`Attention!`; bdy=msg};

      parsed(bdy,'markdown',(htm)=>
      {
         popModal({class:'AnonPopAlert',time:tme})
         ({
            head:[{icon:ico},{span:ttl}],
            body:
            [
               {layr:'.bodyicon', contents:[{icon:ico}]},
               {panl:'.bodymesg', contents:[htm]},
            ],
            foot:
            [
               {butn:`OK`},
            ],
         });
      });
   };
// --------------------------------------------------------------------------------------------------------------------------------------------



// func :: popConfirm : opens a pre-formatted modal dialogue .. requires a heading, message and a button
// --------------------------------------------------------------------------------------------------------------------------------------------
   const popConfirm = function(mesg,skin,tone,icon,size, titl)
   {
      let mp=stub(mesg,"::"); if(mp){titl=trim(mp[0]); mesg=trim(mp[2])}else{titl="Confirm"};
      return function(butn, txt,btn)
      {
         txt=trim(this.msg); txt=txt.split('\n'); txt.forEach((l,x)=>{txt[x]=l.trim()}); txt=txt.join('\n'); btn=[];
         if(!this.skn){this.skn=(userDoes("work")?"dark":"lite")};
         butn.each((v,k)=>
         {let p,t; p=stub(k,'::'); if(p){t=trim(p[0]); k=trim(p[2])}else{t='auto'}; radd(btn,{butn:`.${t}`, text:k, onclick:v})});
         if(btn.length<2){radd(btn,{butn:'', text:'Cancel'})};
         parsed(txt,'markdown',(msg)=>
         {
            let modl = popModal({class:'AnonPopAlert', theme:this.skn, size:this.sze})
            ({
               head:[{icon:this.ico},this.ttl],
               body:
               [
                  {layr:'.bodyicon', contents:[{icon:`.${this.tne}`,face:this.ico}]},
                  {panl:'.bodymesg', contents:[msg]},
               ],
               foot:btn,
            });
            return modl;
         });
      }
      .bind({ttl:titl,msg:mesg,skn:skin,tne:(tone||'auto'),ico:(icon||'question-circle'),sze:size});
   };
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
      },

      resizeTo:function(tgt, slf)
      {
         slf=this; if(isText(tgt)){tgt=select(tgt,slf);}; expect({node:tgt});
         wait.until(()=>{return (!!tgt.parentNode)},()=>
         {
            let i,w,h; i=tgt.getBoundingClientRect(); w=Math.ceil(i.width); h=Math.ceil(i.height); slf.width=w; slf.height=h;
            slf.setStyle({width:w, height:h, minWidth:w, minHeight:h, maxWidth:w, maxHeight:h});
         });
      },
   });

   const rectOf = function(a)
   {
      if(isText(a)){a=select(a)}; if(!isNode(a)){fail('expecting node or #nodeID');return};
      if(!a.parentNode){fail('node is not attached to the DOM .. yet');return};
      let r=decode.jso(encode.jso(a.getBoundingClientRect())); r.each((v,k)=>{r[k]=Math.round(v)});
      return r;
   };
// --------------------------------------------------------------------------------------------------------------------------------------------




// tool :: dropMenu
// --------------------------------------------------------------------------------------------------------------------------------------------
   extend(MAIN)
   ({
      dropMenu:function(a,h)
      {
         remove('#AnonDropMenu'); if(isList(a)){return this.make(a,{},h)};
         if(isKnob(a)){return function(l){return this.fnc(l,this.atr,this.tgt)}.bind({fnc:this.make,atr:a,tgt:h});};
         fail('expecting list or knob');
      }
      .bind({make:function(l,a,h, r,p,c,b)
      {
         if(!isKnob(l[0])){return}; r=create('dropmenu'); if(!isKnob(a)){a={}}; a.id='AnonDropMenu';
         if(!isNode(h)){p={x:cursor.posx,y:cursor.posy}}
         else{b=rectOf(h); p={x:b.x,y:(b.y+b.height)}};
         c=a.context; delete a.context; r.modify(a); r.setStyle({left:p.x,top:p.y});
         l.forEach((i)=>{i.context=c; r.insert(i)}); document.body.insert(r);
      }}),
   });

   document.body.addEventListener('click',function(){remove('#AnonDropMenu');},false);
// --------------------------------------------------------------------------------------------------------------------------------------------




// tool :: dropMenu
// --------------------------------------------------------------------------------------------------------------------------------------------
   extend(MAIN)
   ({
      notify:function(mesg,tone,arro,attr,tout, note,icon,dime,posi,size)
      {
         if(isText(mesg)){mesg=swap((mesg.trim()||'example mesg'),'\n','<br>')}; if(!isList(mesg)){mesg=[mesg];};
         if(isin(this.arro,tone)){let t=[arro,tone]; tone=VOID;arro=VOID; tone=lpop(t);arro=rpop(t)};
         if(!tone||!isin(this.tone,tone)){tone=LITE}; tone=lowerCase(unwrap(tone));
         if(!arro||!isin(this.arro,arro)){arro=TM}; arro=unwrap(arro);

         if(isKnob(mesg[0])&&(keys(mesg[0])[0]=='icon'))
         {
             if(!isKnob(attr)){attr={}}; if(!isKnob(attr.style)){attr.style={}}; tout=0; icon=1; dime=attr.parentRect;
             if(!isKnob(dime)){fail("context :: expecting parentRect object for coordinates"); return};
             size=Math.floor(dime.height/3); if(size<12){size=12}; if(!mesg[0].size){mesg[0].size=size};
             if(!attr.style.borderRadius){attr.style.borderRadius=(Math.ceil(size/2)+6);}; // compensate for 2px padding
             delete attr.dime; let dx,dy,dw,dh; dx=dime.x; dy=dime.y; dw=dime.width; dh=dime.height;
             posi=//object
             {
                 TL:[dx, dy],
                 TR:[(dx+dw), dy],
                 BL:[dx, (dy+dh)],
                 BR:[(dx+dw), (dy+dh)],
             };
             posi=posi[arro]; attr.style.left=posi[0]; attr.style.top=posi[1];
             note=create({noteicon:`.${tone}`, $:mesg});
         }
         else
         {note=create({notedeck:`.${tone}`,canFocus:1,contents:[{noteface:mesg},{notearro:`.${arro}`, contents:[{div:''}]}]})};

         if(isList(attr)&&isNumr(attr[0])&&isNumr(attr[1])){attr={style:{left:attr[0],top:attr[1]}}}; note.modify(attr);
         if((tout===VOID)||(isNumr(tout)&&(tout>0))){note.expire=tick.after((isInum(tout)?tout:3000),()=>{remove(note)})};
         if(!icon){note.listen('blur',function(){this.signal('close'); tick.after(10,()=>{remove(this)})})};
         if(!note.expire&&!icon){note.listen('ready',function(){this.focus()})};
         return note;
      }
      .bind
      ({
         tone:[DARK,LITE,GOOD,COOL,NEED,WARN,FAIL],
         arro:[TL,TM,TR,RT,RM,RB,BR,BM,BL,LB,LM,LT],
      }),
   });

   extend(Element.prototype)
   ({
      notify:function(mesg,tone,arro,attr,tout)
      {
         let dime=rectOf(this); if(!isKnob(attr)){attr={}}; if(!isKnob(attr.style)){attr.style={}};
         if(isKnob(mesg)&&isin(keys(mesg),'icon')){attr.parentRect=dime};
         attr.style.left=dime.x; attr.style.top=(dime.y+dime.height);
         let note=notify(mesg,tone,arro,attr,tout); if(!note){return};
         document.body.appendChild(note);
         // let trgt=this; let t=nodeName(this);
         // if(isin('input,select,video,audio',t)){trgt=trgt.parentNode};
         // trgt.appendChild(note);
         return note;
      },
   });
// --------------------------------------------------------------------------------------------------------------------------------------------



// tool :: RotScaTra : `.knob` given a transorm-string, this returns rotation + scale + translate as object .. `.text` turns it back to string
// --------------------------------------------------------------------------------------------------------------------------------------------
   const RotScaTra= // obj
   {
      knob:function(q)
      {
         if(!isText(q)||!isin(q,'(')||!isin(q,')')){return}; q=q.trim(); q+=' '; let l,r; l=q.split(') '); l.pop(); r={};
         l.forEach((i)=>
         {
            let p=i.split('('); let k=trim(p[0]); let s=trim(p[1]).split(', ').join(','); let d=pick(s,[' ',',']);
            let a=((!d)?[s]:s.split(d)); a.forEach((v,x)=>{v=swap(v,['%','deg','px'],''); if(!isNaN(v)){a[x]=(v*1)}}); r[k]=a;
         });
         return r;
      },

      text:function(d,o)
      {
         if(!isKnob(d)){return}; let r=''; d.each((v,k)=>{v=v.join(','); r+=`${k}(${v}) `});
         r=r.trim(); return r;
      },
   };
// --------------------------------------------------------------------------------------------------------------------------------------------



// func :: minMaxOf : given a number - this returns the given maximum -or minimum value .. or just the unchanged number if not exceeded
// --------------------------------------------------------------------------------------------------------------------------------------------
   const minMaxOf = function(n,mn,mx)
   {
      if(n<mn){return mn}; if(n>mx){return mx}; return n;
   };
// --------------------------------------------------------------------------------------------------------------------------------------------



// func :: swapPolarity : changes a number from positive to negative, or whatever
// --------------------------------------------------------------------------------------------------------------------------------------------
   const swapPolarity = function(n)
   {
      if(isNaN(n)){return}; n=(n*1); return ((n<0)?(n*-1):(0-n));
   };
// --------------------------------------------------------------------------------------------------------------------------------------------



// func :: pledge : neat promise
// --------------------------------------------------------------------------------------------------------------------------------------------
    extend(MAIN)
    ({
        pledge: function(ctx,cbf)
        {
            return new Promise(cbf.bind(ctx));
        },
    });
// --------------------------------------------------------------------------------------------------------------------------------------------



// func :: addIfMissing : takes a string and an object, adds object value to result string if object key is missing
// --------------------------------------------------------------------------------------------------------------------------------------------
   const addIfMissing = function(q,o)
   {
      if(!isText(q)||!isKnob(o)){return q}; let r=`${q}`; o.each((v,k)=>{if(isin(r,k)){return}; r+=v});
      return r;
   };
// --------------------------------------------------------------------------------------------------------------------------------------------



// func :: rectAnglEdge : get coords in a rect by angle in degrees
// --------------------------------------------------------------------------------------------------------------------------------------------
   const rectAnglEdge = function(rect, deg)
   {
     var twoPI = Math.PI*2;
     var theta = deg * Math.PI / 180;

     while (theta < -Math.PI) {
       theta += twoPI;
     }

     while (theta > Math.PI) {
       theta -= twoPI;
     }

     var rectAtan = Math.atan2(rect.height, rect.width);
     var tanTheta = Math.tan(theta);
     var region;

     if ((theta > -rectAtan) && (theta <= rectAtan)) {
         region = 1;
     } else if ((theta > rectAtan) && (theta <= (Math.PI - rectAtan))) {
         region = 2;
     } else if ((theta > (Math.PI - rectAtan)) || (theta <= -(Math.PI - rectAtan))) {
         region = 3;
     } else {
         region = 4;
     }

     var edgePoint = {x: rect.width/2, y: rect.height/2};
     var xFactor = 1;
     var yFactor = 1;

     switch (region) {
       case 1: yFactor = -1; break;
       case 2: yFactor = -1; break;
       case 3: xFactor = -1; break;
       case 4: xFactor = -1; break;
     }

     if ((region === 1) || (region === 3)) {
       edgePoint.x += xFactor * (rect.width / 2.);
       edgePoint.y += yFactor * (rect.width / 2.) * tanTheta;
     } else {
       edgePoint.x += xFactor * (rect.height / (2. * tanTheta));
       edgePoint.y += yFactor * (rect.height /  2.);
     }

     return edgePoint;
   };
// --------------------------------------------------------------------------------------------------------------------------------------------




// func :: rectAnglPlot : takes in object (numeric `width` & `height`) and agngle (numeric degrees) .. returns relative beginXY & endXY
// --------------------------------------------------------------------------------------------------------------------------------------------
   const rectAnglPlot = function(o,d,s)
   {
      if(!isKnob(o)||!isNumr(o.width)||!isNumr(o.height)){return}; if(!isNumr(d)){return}; d=(d%360); if(d<0){d=(360-d)}; // validate
      let e,r,b; e=rectAnglEdge(o,d); e.x=round(e.x); e.y=round(e.y); r={bgn:{x:0,y:e.y},end:{x:e.x,y:0}};
      r.bgn.x=(o.width-e.x); r.end.y=(o.height-e.y); if(!s||!isNumr(s)||(s==1)){return r}; // done - without scale
      b=dupe(o); b.width*=s; b.height*=s; r=VOID; r=rectAnglPlot(b,d); d={w:((o.width-b.width)/2),h:((o.height-b.height)/2)};
      r.bgn.x=round(r.bgn.x+d.w); r.bgn.y=round(r.bgn.y+d.h); r.end.x=round(r.end.x+d.w); r.end.y=round(r.end.y+d.h); // shift coords
      return r;
   };
// --------------------------------------------------------------------------------------------------------------------------------------------




// func :: image2Canvas : shorthand to load an image from URL into a hidden canvas
// --------------------------------------------------------------------------------------------------------------------------------------------
   const image2Canvas = function(iu,fn)
   {
      if(!isText(iu)||!isFunc(fn)){return};
      create({img:'',src:iu, onload:function(ev, rc,ow,oh,hv,rx)
      {
         ow=this.width; oh=this.height; rc=create({canvas:'', width:ow, height:oh, style:{width:ow,height:oh}});
         hv=select('#anonHidnView'); hv.appendChild(rc); rx=rc.getContext('2d'); rx.drawImage(this,0,0);
         fn(rc,rx);
      }});
   };
// --------------------------------------------------------------------------------------------------------------------------------------------




// func :: popColor : color picker
// --------------------------------------------------------------------------------------------------------------------------------------------
   const popColor = function(el,bg,sc,gs,gr, mb,bx,pw)
   {
      if(isFunc(bg)){cb=bg; bg=VOID; bg=LITE;}; remove('#AnonPopColor');
      if(!isNode(el)){fail('expecting 1st arg as :node:');return};
      mb=el.notify('loading...',bg,VOID,VOID,false); let nf=mb.select('noteface')[0]; nf.innerHTML=''; bx=rectOf(el);
      pw=14; requires(['/Proc/libs/iro/iro.min.js','/Proc/libs/iro/iro-transparency-plugin.min.js'],()=>
      {
         iro.use(iroTransparencyPlugin); mb.id='AnonPopColor'; let ew=(bx.width-pw); //nf.insert({div:'#AnonPopColorPanl'});
         nf.insert({div:'', style:{width:ew, height:(ew*1.2)}, contents:
         [
            {div:'#AnonPopColorPanl .posAbs', style:{padding:18}},
            {div:'.posAbs', style:{width:ew, height:ew, pointerEvents:'none'}, contents:
            [
               {svg:'#AnonPopColorDial', src:'/Site/dcor/dial.svg',
                  onready:function(){this.initRota()},
                  initRota:function(degr,di,dw,dh,hw,hh,rc,rota,scal,so)
                  {
                     let vs=stub(el.value,'+'); if(!vs||(!vs[2].trim())||isVoid(gr)){gr=0; so=1}; //if(isNaN(gs)){gs=1};
                     this.style.opacity=1; this.root=mb; rc=50;
                     degr=this.select('#AnonColrDialDegr'); di=rectOf(this); dw=di.width; dh=di.height; hw=(dw/2); hh=(dh/2);
                     rota=this.select('#AnonColrDegrRota'); scal=this.select('#AnonColrDialScal');
                     if(so){rota.style.opacity=0;}else{rota.style.opacity=1;}; if(this.rotaInited){return}; this.rotaInited=1;
                     rota.setAttribute(`transform`,`rotate(${gr} ${rc} ${rc})`);
                     scal.setAttribute(`transform`,`rotate(${gr} ${rc} ${rc}) matrix(${gs},0,0,${gs},${rc-gs*rc},${rc-gs*rc})`);
                     degr.listen('mousemove',(e)=>
                     {
                        if(!cursor.grab){return}; let c,x,y,r,d,q,s; c=e.coords; x=(c[0]-di.x); x=((x<hw)?(0-(hw-x)):((x>hw)?(x-hw):0));
                        y=(c[1]-di.y); y=((y<hh)?(0-(hh-y)):((y>hh)?(y-hh):0)); r=Math.atan2(y,x); d=(r*(180/Math.PI)); c=50; s=1;
                        d+=180; d=round(d,3); if(d>359.999){d=0}; rota.setAttribute(`transform`,`rotate(${d} ${c} ${c})`);
                        q=(scal.getAttribute(`transform`)||'');
                        q=RotScaTra.knob(addIfMissing(q,{rotate:`rotate(0 ${c} ${c})`, matrix:` matrix(${gs},0,0,${gs},${c-s*c},${c-s*c})`}));
                        q.rotate=[d,c,c]; scal.setAttribute(`transform`,RotScaTra.text(q)); this.root.signal('change',{angl:d});
                     });
                     mb.listen('wheel',(e)=>
                     {
                        let w,q,c,s,t; w=round((swapPolarity(e.coords[1])/1000),3); q=(scal.getAttribute(`transform`)||''); c=50; s=1;
                        q=RotScaTra.knob(addIfMissing(q,{rotate:`rotate(0 ${c} ${c})`, matrix:` matrix(${gs},0,0,${gs},${c-s*c},${c-s*c})`}));
                        s=q.matrix[0]; s=minMaxOf((s+w),0.01,2.5); q.matrix=[s,0,0,s,(c-s*c),(c-s*c)];
                        scal.setAttribute(`transform`,RotScaTra.text(q));
                        this.root.signal('change',{scal:round(s,3)});
                     });
                  },
               }
            ]},
         ]});

         let cw = (new iro.ColorPicker("#AnonPopColorPanl",
         {
            width: (ew-36),
            borderWidth:1,
            wheelAngle:180,
            padding: 1,
            handleRadius: 3,
            sliderMargin:22,
            wheelDirection:'clockwise',
            color:sc,
            layout:
            [
               {
                  component:iro.ui.Wheel,
                  options:{borderColor:'#cccccc'},
               },
               {
                  component:iro.ui.Slider,
                  options:{borderColor:'none'},
               },
               {
                  component:iro.ui.TransparencySlider,
                  options:{sliderMargin:6,borderColor:'none'},
               },
            ],
         }));

         cw.root=mb; cw.on('input:change',function(c)
         {
            c=c.hex8String;
            if(this.root.target.value.endsWith('+')){this.root.target.value+=c; this.root.target.indx+=1};
            this.root.signal('change',{colr:c});
            this.root.select('#AnonPopColorDial').initRota();
         });
      });
      mb.target=el;
      mb.listen(['keydown','keyup'],(e)=>
      {
         if(e.signal!='Control'){return}; let kd=(e.type=='keydown'); let ku=(e.type=='keyup');
         if(kd&&el.value.endsWith('+')){return}; if(kd){el.value+='+';return};
         if(ku&&el.value.endsWith('+')){el.value=trim(trim(el.value,'+'))};
      });
      return mb;
   };
// --------------------------------------------------------------------------------------------------------------------------------------------




// glob :: prop : CURSOR
// --------------------------------------------------------------------------------------------------------------------------------------------
   extend(MAIN)
   ({
      cursor:
      {
         posx:0, posy:0, refs:{}, grab:0,

         glue:function(r,x,y)
         {
            if(isNode(r)){if(!r.id){r.id=('EL'+hash())}; r=('#'+r.id)}; let n=select(r);
            if(!isNode(n)){fail('expecting node with id '+r+' to exist in the DOM');}; let dx,dy;
            dx=(cursor.posx-x); dy=(cursor.posy-y);
            if(!isNumr(x)){x=0;}; if(!isNumr(y)){y=0;}; this.refs[r]={xd:dx,yd:dy};
         },

         bind:function(r,x,y)
         {
            if(isNode(r)){if(!r.id){r.id=('EL'+hash())}; r=('#'+r.id)}; let n=select(r);
            if(!isNode(n)){fail('expecting node with id '+r+' to exist in the DOM');return};
            if(cStyle(n,'position')!='absolute'){fail('expecting `position:absolute`');return};
            if(!isNumr(x)){x=0;}; if(!isNumr(y)){y=0;}; this.refs[r]={xd:x,yd:y};
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
               let n=document.getElementById(r.slice(1)); if(!n){return};
               nx=(x-p.xd); ny=(y-p.yd);
               n.style.left=(nx+'px'); n.style.top=(ny+'px');
               n.signal('boundmove',{x:x,y:y,n:n});
            });
         },

         hint:function(m,t,s, b,a)
         {
            a=VOID; b=notify(m,t,a,VOID,(s||1000));
            b.setStyle({left:(cursor.posx+14),top:cursor.posy});
            document.body.insert(b);
         },

         hits:0,
      }
   });
// --------------------------------------------------------------------------------------------------------------------------------------------
   globVars({activity:{idle:0,last:time()}},[`imHere /Site/base/base.js`]);

   const imHere = function(here)
   {
      globVars({activity:{idle:(here?0:1),last:time()}});
   };

   const tapper=function(e)
   {
       MAIN.cursor.hits+=1; if(MAIN.cursor.hits>2){signal(`tap${MAIN.cursor.hits}`);};
       if(MAIN.cursor.tick){clearTimeout(MAIN.cursor.tick)};
       MAIN.cursor.tick=setTimeout(()=>{MAIN.cursor.hits=0;},350);
   };

   document.addEventListener("mousemove", function(e){cursor.move(e.clientX,e.clientY);},false);
   document.addEventListener("dragover", function(e){cursor.move(e.pageX,e.pageY);},false);
   document.addEventListener("mousedown", function(e){if(isin(e.signal,'LeftClick')){cursor.grab=1;};},false);
   document.addEventListener("mouseup", function(e){cursor.grab=0; imHere(1); },false);
   document.addEventListener("click", tapper,false);
   document.addEventListener("keypress", function keyListener(ev)
   {
       if (ev.keyCode !== 13){ return };
       let tgt = select("modal");      if (!tgt||!tgt[0]){ return };  tgt = tgt[0];
       tgt = tgt.select("butn.cool");  if (!tgt||!tgt[0]){ return };  tgt = tgt[0];
       tgt.signal("click");
   },false);
// --------------------------------------------------------------------------------------------------------------------------------------------
