"use strict";

const HOSTNAME='(~HOSTNAME~)';
const HOSTPURL=('https://'+HOSTNAME);
const UNDF=(function(){}());

!function(e){var n=!1;if("function"==typeof define&&define.amd&&(define(e),n=!0),"object"==typeof exports&&(module.exports=e(),n=!0),!n){var o=window.Cookies,t=window.Cookies=e();t.noConflict=function(){return window.Cookies=o,t}}}(function(){function g(){for(var e=0,n={};e<arguments.length;e++){var o=arguments[e];for(var t in o)n[t]=o[t]}return n}return function e(l){function C(e,n,o){var t;if("undefined"!=typeof document){if(1<arguments.length){if("number"==typeof(o=g({path:"/"},C.defaults,o)).expires){var r=new Date;r.setMilliseconds(r.getMilliseconds()+864e5*o.expires),o.expires=r}o.expires=o.expires?o.expires.toUTCString():"";try{t=JSON.stringify(n),/^[\{\[]/.test(t)&&(n=t)}catch(e){}n=l.write?l.write(n,e):encodeURIComponent(String(n)).replace(/%(23|24|26|2B|3A|3C|3E|3D|2F|3F|40|5B|5D|5E|60|7B|7D|7C)/g,decodeURIComponent),e=(e=(e=encodeURIComponent(String(e))).replace(/%(23|24|26|2B|5E|60|7C)/g,decodeURIComponent)).replace(/[\(\)]/g,escape);var i="";for(var c in o)o[c]&&(i+="; "+c,!0!==o[c]&&(i+="="+o[c]));return document.cookie=e+"="+n+i}e||(t={});for(var a=document.cookie?document.cookie.split("; "):[],s=/(%[0-9A-Z]{2})+/g,f=0;f<a.length;f++){var p=a[f].split("="),d=p.slice(1).join("=");this.json||'"'!==d.charAt(0)||(d=d.slice(1,-1));try{var u=p[0].replace(s,decodeURIComponent);if(d=l.read?l.read(d,u):l(d,u)||d.replace(s,decodeURIComponent),this.json)try{d=JSON.parse(d)}catch(e){}if(e===u){t=d;break}e||(t[u]=d)}catch(e){}}return t}}return(C.set=C).get=function(e){return C.call(C,e)},C.getJSON=function(){return C.apply({json:!0},[].slice.call(arguments))},C.defaults={},C.remove=function(e,n){C(e,"",g(n,{expires:-1}))},C.withConverter=e,C}(function(){})});
Cookies.defaults.path='/'; Cookies.defaults.domain=HOSTNAME;

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
        Cookies.set("(~SESNHASH~)","..."); bz(0); script('/Site/base/abec.js',()=>{bz(10); script('/Site/base/base.js',()=>
        {bz(20); script('/Proc/libs/opentype/opentype.min.js',()=>{bz(30); script('/Site/base/boot.js')})})});
    });
},10);
