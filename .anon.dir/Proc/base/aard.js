"use strict";

const HOSTNAME='{:HOSTNAME:}';
const HOSTPURL=('https://'+HOSTNAME);
const UNDF=(function(){}());

const wack = function(r)
{
   let z,x,m,t;  z=this.line.length; x=Math.floor(Math.random()*z); m=this.line[x]; if(r){return m}; if(this.done||window.HALT){return};
   window.HALT=1; this.done=1; document.documentElement.innerHTML=('<head></head><body>'+m+'</body>');
}
.bind({line:atob('{:WACKMESG:}').split('\n'),done:0});

const stak = function(x,a, e,s,r,h,o)
{
   a=(a||''); e=(new Error('.')); s=e.stack.split('\n'); s.shift();  r=[]; h=HOSTPURL; o=['_fake_']; s.forEach((i)=>
   {
      if(i.indexOf(h)<0){return}; let p,c,f,l,q; q=1; p=i.trim().split(h); c=p[0].split('@').join('').split('at ').join('').trim();
      c=c.split(' ')[0];if(!c){c='anon'}; o.forEach((y)=>{if(((c.indexOf(y)==0)||(c.indexOf('.'+y)>0))&&(a.indexOf(y)<0)){q=0}}); if(!q){return};
      p=p[1].split(' '); f=p[0]; if(f.indexOf(':')>0){p=f.split(':'); f=p[0]}else{p=p.pop().split(':')}; if(f=='/'){return};
      l=p[1]; r[r.length]=([c,f,l]).join(' ');
   });
   if(!isNaN(x*1)){return r[x]}; return r;
};

const sesn = function(a)
{if(!stak(0)){wack();return}; if(((typeof a)!='string')||(a.length<1)||!this[a]){return}; return this[a];}.bind
({USER:'{:SESNUSER:}',CLAN:'{:SESNCLAN:}',HASH:'{:SESNHASH:}'});

const script=function(p,f, n){n=document.createElement('script'); n.src=`${p}`; n.onload=f; document.head.appendChild(n);};
(function(s,c)
{
   document.cookie=`{:SESNHASH:}=...;domain=${HOSTNAME};path=/`;
   s=HOSTNAME.split('.'); c=location.host.split('.'); if((s.length<3)||(c.length<3)){wack();return};
   s.shift(); s=s.join('.'); c.shift(); c=c.join('.');if((location.host!=s)&&(c!=s)){wack();return};
   script('/Proc/base/abec.js',()=>
   {
      script('/Proc/base/base.js',()=>{requires
      ([
         '/Proc/base/busy.htm','/Proc/dcor/aard.css','/Proc/base/xtag.js','/Proc/base/xatr.js',
         '/Proc/libs/opentype/font.js','/Proc/base/boot.js'
      ])});
   });
}());
