"use strict";

const HOSTNAME='(~HOSTNAME~)';
const HOSTPURL=('https://'+HOSTNAME);
const UNDF=(function(){}());
//  https://github.com/js-cookie/js-cookie  v.2021-12-01
!function(e,t){"object"==typeof exports&&"undefined"!=typeof module?module.exports=t():"function"==typeof define&&define.amd?define(t):(e=e||self,function(){var n=e.Cookies,o=e.Cookies=t();o.noConflict=function(){return e.Cookies=n,o}}())}(this,(function(){"use strict";function e(e){for(var t=1;t<arguments.length;t++){var n=arguments[t];for(var o in n)e[o]=n[o]}return e}return function t(n,o){function r(t,r,i){if("undefined"!=typeof document){"number"==typeof(i=e({},o,i)).expires&&(i.expires=new Date(Date.now()+864e5*i.expires)),i.expires&&(i.expires=i.expires.toUTCString()),t=encodeURIComponent(t).replace(/%(2[346B]|5E|60|7C)/g,decodeURIComponent).replace(/[()]/g,escape);var c="";for(var u in i)i[u]&&(c+="; "+u,!0!==i[u]&&(c+="="+i[u].split(";")[0]));return document.cookie=t+"="+n.write(r,t)+c}}return Object.create({set:r,get:function(e){if("undefined"!=typeof document&&(!arguments.length||e)){for(var t=document.cookie?document.cookie.split("; "):[],o={},r=0;r<t.length;r++){var i=t[r].split("="),c=i.slice(1).join("=");try{var u=decodeURIComponent(i[0]);if(o[u]=n.read(c,u),e===u)break}catch(e){}}return e?o[e]:o}},remove:function(t,n){r(t,"",e({},n,{expires:-1}))},withAttributes:function(n){return t(this.converter,e({},this.attributes,n))},withConverter:function(n){return t(e({},this.converter,n),this.attributes)}},{attributes:{value:Object.freeze(o)},converter:{value:Object.freeze(n)}})}({read:function(e){return'"'===e[0]&&(e=e.slice(1,-1)),e.replace(/(%[\dA-F]{2})+/gi,decodeURIComponent)},write:function(e){return encodeURIComponent(e).replace(/%(2[346BF]|3[AC-F]|40|5[BDE]|60|7[BCD])/g,decodeURIComponent)}},{path:"/"})}));
Cookies.defaults={expires:null, path:'/', domain:HOSTNAME, secure:true, sameSite:"Strict"};

Math.rand=function(min,max){return Math.floor(Math.random()*(max-min+1)+min);};

const wack = function(r)
{
   let z,x,m,d;  z=this.line.length; x=Math.floor(Math.random()*z); m=this.line[x]; if(r){return m}; if(this.done||window.HALT){return};
   window.HALT=1; this.done=1; d=document.body; d.style.backgroundSize=`cover`; d.style.backgroundImage=`url('/User/dcor/anm1.gif')`;
   d.innerHTML=`<div style="height:100%; background:hsla(0,0%,0%,0.7);padding:10px">${m}</div>`;
   setTimeout(function(){d.style.backgroundImage=`url('/User/dcor/wal1.jpg')`;},Math.rand(900,3000));
}
.bind({line:atob("(~encode::b64('$/Proc/info/hack.inf'~)").split('\n'),done:0});

const stak = function(x,a, e,s,r,h,o,sve)
{
   a=(a||''); e=(new Error('.')); s=e.stack.split('\n'); s.shift();  r=[]; h=HOSTPURL; o=['_fake_']; s.forEach((i)=>
   {
      if(i.indexOf(h)<0){return}; let p,c,f,l,q; q=1; p=i.trim().split(h); c=p[0].split('@').join('').split('at ').join('').trim();
      c=c.split(' ')[0];if(!c){c='anon'}; o.forEach((y)=>{if(((c.indexOf(y)==0)||(c.indexOf('.'+y)>0))&&(a.indexOf(y)<0)){q=0}}); if(!q){return};
      p=p[1].split(' '); f=p[0]; if(f.indexOf(':')>0){p=f.split(':'); f=p[0]}else{p=p.pop().split(':')}; if(f=='/'){return};
      l=p[1]; r[r.length]=([c,f,l]).join(' ');
   });
   if((x==':KEEP:')||(x==':SAVE:'))
   {do{this.saved.unshift(r.pop())}while(r.length>0); while(this.saved.length>500){this.saved.pop()}; return;};
   if(this.saved.length>0){this.saved.forEach((sl)=>{r.push(sl);})};
   if(!isNaN(x*1)){return r[x]}; return r;
}
.bind({saved:[]});

const sesn = function(a)
{
    if(!stak(0)&&window.ANONGATEPREP){wack();return};
    if(((typeof a)!='string')||(a.length<1)||!this[a]){return};
    return this[a];
}
.bind({USER:'(~SESNUSER~)',MAIL:'(~SESNMAIL~)',CLAN:'(~SESNCLAN~)',HASH:'(~SESNHASH~)'});

const bz=function(p){Busy.edit('/anonBoot',p);};


window.AnonBusy=setInterval(function(snth)
{
    snth=document.getElementById('snth'); if(!snth){return;}; clearInterval(AnonBusy); // wait until ready
    AnonBusy=(atob('(~busyGear~)')).split('<script>'); snth.innerHTML=AnonBusy[0]; AnonBusy=AnonBusy[1].split('</script>')[0];
    if(sesn('CLAN').indexOf('work')>-1){window.ANONSHOWBUSY=1;};
    Object.defineProperty(window,'ANONGATEPREP',{writable:false,enumerable:false,configurable:false,value:1});

    script(AnonBusy,(s,c)=>
    {
        delete window.AnonBusy; snth.parentNode.removeChild(snth);

        if((~denyDomainSpoofs~))
        {
            s=HOSTNAME.split('.'); c=location.host.split('.');
            if((s.length<3)||(c.length<3)){console.error("invalid hostname");wack();return};
            s.shift(); s=s.join('.'); c.shift(); c=c.join('.');
            if(c!=s){console.error("hostname mismatch",s,c);wack();return};
        };

        Object.keys(Cookies.get()).forEach((k)=>{if(k.length!=40){return}; Cookies.remove(k)});
        Cookies.set("(~SESNHASH~)","...",Cookies.defaults); bz(0); script('/Site/base/abec.js',()=>{bz(10); script('/Site/base/base.js',()=>
        {bz(20); script('/Proc/libs/opentype/opentype.min.js',()=>{bz(30); script('/Site/base/boot.js')})})});
    });
},10);
