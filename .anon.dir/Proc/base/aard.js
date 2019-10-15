"use strict";

const HOSTNAME='{:HOSTNAME:}';
const UNDF=(function(){}());

const wack = function(r)
{
   let z,x,m,t;  z=this.line.length; x=Math.floor(Math.random()*z); m=this.line[x]; if(r){return m}; if(this.done||window.HALT){return};
   window.HALT=1; this.done=1; document.documentElement.innerHTML=('<head></head><body>'+m+'</body>');
}
.bind({line:atob('{:WACKMESG:}').split('\n'),done:0});

const addStack = function(e, s,l)
{
   if(!e||!e.stack){e=(new Error('.'))}; s=e.stack.split('\n'); s.shift(); l=[]; if(!addStack.log){addStack.log=''};
   s.forEach((i)=>{i=i.trim(); if((i.indexOf('<anonymous>')<0)&&(addStack.log.indexOf(i)<0)&&(l.indexOf(i)<0)){l.push(i)}});
   s=l.join('\n'); s+=('\n'+addStack.log); s=s.trim(); addStack.log=s;
};

const getStack = function(e,k, r){addStack(e); r=addStack.log; if(!k){addStack.log=''}; return r};

const fubu = function(o,k)
{
   let l,r; if(k==UNDF){k=1}; l=getStack(0,k).split('\n'); r=(!1); if((typeof o)!='string'){o=''};
   l.forEach((i)=>{if(o&&(i.indexOf(o)>-1)){return}; if(i.indexOf(HOSTNAME)>0){r=(!0)}}); return r;
};

const sesn = function(a,k)
{if(!fubu(0,k)){wack();return}; if(((typeof a)!='string')||(a.length<1)||!this[a]){return (!0)}; return this[a];}.bind
({USER:'{:SESNUSER:}',CLAN:'{:SESNCLAN:}',HASH:'{:SESNHASH:}'});

const proc = function(n,v,c)
{
   if(((typeof n)!='string')||(n.length<1)||!this[n]){return}; if(!v){return}; if(!v.forEach){v=[v]}; let z=0; let s=addStack.log;
   if(!fubu()){wack();return}; addStack.log=s; return this[n].apply((c||null),v);
}.bind({evl:window.eval,add:Element.prototype.appendChild,mod:Element.prototype.setAttribute,xhr:XMLHttpRequest.prototype.open});

window.eval=null;
const badCfg='{:badCfg:}';
(function(a,b,s,c)
{
   s=HOSTNAME.split('.'); c=location.host.split('.'); if((s.length<3)||(c.length<3)){wack();return};
   s.shift(); s=s.join('.'); c.shift(); c=c.join('.');if((location.host!=s)&&(c!=s)){wack();return};
   a=document.createElement('script'); a.src='/Proc/base/base.js'; a.onload=function()
   {
      extend(window)({eval:function(s){return proc('evl',s,window)}});
      requires(['/Proc/base/busy.htm','/Proc/dcor/aard.css','/Proc/base/boot.js']);
   };document.head.appendChild(a);
}());
