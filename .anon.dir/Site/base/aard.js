window.WACKMESG="{:WACKMESG:}";
window.pageGone=0;
window.onbeforeunload=function(){pageGone=1};
window.dump=function(){console.log.apply(console,([].slice.call(arguments)));};
window.fail=function(a){console.error(a);};
window.onerror=function(m,f,l)
{if(!window.BOOTED){console.error("Unhandled BOOT ERROR!\n"+m+"\n"+f+"  "+l);}};


window.isModern=function(cb)
{
    var x='(function(){class $_$ extends Array{constructor(j=`a`,...c){const q=(({u:e})=>{return {[`${c}`]:Symbol(j)};})({});'+
    'super(j,q,...c)}}new Promise(f=>{const a=function*(){return "\u{20BB7}".match(/./u)[0].length===2||!0};for (let z of a())'+
    '{const [x,y,w,k]=[new Set(),new WeakSet(),new Map(),new WeakMap()];break}f(new Proxy({},{get:(h,i)=>i in h ?h[i]:"j".repeat'+
    '(0o2)}))}).then(t=>new $_$(t.d)); if(btoa("jz\'")!=="anon"){throw "!"};})(); ';

    if(!window.addEventListener){cb(false);return;}; var n=document.createElement('script'); n.ondone=function(event,s)
    {
        s=this; if(s.done){window.removeEventListener('error',s.ondone,true); if(s.parentNode){s.parentNode.removeChild(s)}; return};
        this.done=1; cb(((event&&event.error)?false:true));
    };

    window.addEventListener('error',n.ondone,true); n.appendChild(document.createTextNode(x));
    n.id='dbug'; document.head.appendChild(n); setTimeout(n.ondone,1);
};


window.userView=function(url,cbf)
{
    var view=document.createElement('iframe'); if(!cbf){cbf=function(){}};
    view.setAttribute('id','AnonView'); view.setAttribute('frameborder',0);
    view.setAttribute('src',url); view.done=cbf; view.onload=function(){this.done(this)};
    document.body.innerHTML=""; document.body.appendChild(view);
};


window.script=function(src,cbf)
{
    var n=document.createElement('script');
    if(src.startsWith('/')&&src.endsWith('.js')){n.src=src;}
    else{n.innerHTML=src}; n.onload=cbf; document.head.appendChild(n);
    return n;
};


window.bootAnon=function(gate)
{
    if(!gate){gate=document.getElementById('AnonGate')};
    gate=gate.getAttribute('data-src').split(';base64,').pop();
    script(atob(gate));
};


window.isModern.t=setInterval(function()
{
    if(!document.getElementById('nojs')){return;}; clearInterval(window.isModern.t); // wait for document to load
    if(window.self===window.top){document.body.style.backgroundColor="{:conf('Site/bootSkin/parentBG'):}"}; // blend in

    setTimeout(function(){isModern(function(really) // wait for evasive snth to misbehave
    {
        if(pageGone){return}; // gotcha bitch .. smart-bot
        if(!really){userView('{:DBUGPATH:}?#lcjs'); return};  // bad browser goes to graceful fail
        if('{:ALTHANDLER:}'!='yes'){bootAnon(); return}; // no other framework detected
        userView('{:viewPath:}',bootAnon); // boot handler first -if present
    })},250);
},10);
