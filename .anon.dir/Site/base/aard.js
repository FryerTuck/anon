window.pageGone=0;
window.onbeforeunload=function(){pageGone=1};
window.dump=function(){console.log.apply(console,([].slice.call(arguments)));};
window.fail=function(a){console.error(a);};
window.onerror=function(m,f,l)
{
    if(window.Busy){Busy.tint('red')};
    if(!window.BOOTED){console.error("Unhandled BOOT ERROR!\n"+m+"\n"+f+"  "+l);}
};


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
    var char=((url.indexOf("?")<0)?"?":"&"); //url+=(char+"i=PROCHASH");
    view.setAttribute('class','layr'); view.setAttribute('src',url); view.onload=cbf;
    document.getElementById('anonMainView').appendChild(view);
};


window.script=function(src,cbf, txt,nde)
{
    txt=src.trim(); nde=document.createElement('script'); nde.onload=cbf;
    if(!txt.startsWith('/')||!txt.endsWith('.js')){txt=('data:application/javascript;base64,'+btoa(txt))};
    nde.src=txt; document.head.appendChild(nde);
};


window.bootAnon=function(gate)
{
    if(((typeof gate)=="string")&&(gate.indexOf("/")>-1)){script(gate); return};
    gate=gate.getAttribute("data-src").split(";base64,").pop();
    try{gate=atob(gate);}catch(e){console.error(gate); return}; script(gate);
};


window.isModern.t=setInterval(function(gate)
{
    gate=document.getElementById("AnonGate"); if(!gate){return;}; clearInterval(window.isModern.t); // wait until ready
    if("(~RECEIVER~)"=="nona"){document.body.style.backgroundColor="(~conf('Site/bootSkin/handlrBG'~)"} // blend althandler
    else if(window.self!==window.top){document.body.style.backgroundColor="(~conf('Site/bootSkin/parentBG'~)"};// blend parent

    setTimeout(function(){isModern(function(really) // wait for evasive snth to misbehave
    {
        if(pageGone){return}; // gotcha bitch .. smart-bot
        if(!really){userView("(~DBUGPATH~)?#lcjs"); return};  // bad browser goes to graceful fail
        // console.log("receiver: (~RECEIVER~)");
        if("(~RECEIVER~)"=="anon"){bootAnon(gate); return}; // no other framework detected
        userView("(~NAVIPURL~)",function(){bootAnon(gate)}); // boot handler first -if present
    })},250);
},10);
