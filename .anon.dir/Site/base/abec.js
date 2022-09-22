"use strict";


// defn :: MAIN : define immutable super-global reference and identify natives as INTRINSIC
// --------------------------------------------------------------------------------------------------------------------------------------------
   const MAIN = (this); // super-global .. refers to `self` or `window` or `global`
   (Object.getOwnPropertyNames(MAIN)).forEach(function(g)
   {
      if(['GLOBAL','root','MAIN','webkitURL','webkitStorageInfo'].indexOf(g)>-1){return}; var t=(typeof MAIN[g])[0]; let x='INTRINSIC';
      if((t=='f')||(t=='g')||(t=='c')){Object.defineProperty(MAIN[g],x,{writable:false,enumerable:false,configurable:false,value:true})}
   });
// --------------------------------------------------------------------------------------------------------------------------------------------



// shiv :: (polyfill) : make things normal
// --------------------------------------------------------------------------------------------------------------------------------------------
    if(!MAIN.URL){MAIN.URL=MAIN.webkitURL};
// --------------------------------------------------------------------------------------------------------------------------------------------



// defn :: (refs) : immutable
// --------------------------------------------------------------------------------------------------------------------------------------------
   const VOID = (function(){}()); // undefined
   const TRUE = (!0); // true
   const FALS = (!1); // false
   const SELF = ':SELF:'; // flag
   const VERT = ':VERT:'; // flag
   const HORZ = ':HORZ:'; // flag
// --------------------------------------------------------------------------------------------------------------------------------------------



// func :: span : length of anything
// --------------------------------------------------------------------------------------------------------------------------------------------
   const span = function(d,x)
   {
      if((d===null)||(d===VOID)||(!d&&isNaN(d))){return 0};  if(!isNaN(d)){d=(d+'')};
      if(x&&((typeof x)=='string')&&((typeof d)=='string')){d=(d.split(x).length-1); return d};
      let s = d.length; if(!isNaN(s)){return s;}; try{s=Object.getOwnPropertyNames(d).length; return s;}catch(e){return 0;}
   };

   const spanIs = function (d,g,l){let s=(((typeof d)=='number')?d:span(d)); g=(g||0); l=(l||s); return ((s>=g)&&(s<=l))};
// --------------------------------------------------------------------------------------------------------------------------------------------



// func :: akin : check if needle is similar to hastack .. as in: "begins-with", "ends-with" or "contains" .. marked with `*`
// ---------------------------------------------------------------------------------------------------------------------------------------------
   const akin = function(h,n, l,f,p,b,e)
   {
      if(!isText(h,1)||!isText(n,1)){return}; if(n.indexOf('*')<0){return (h===n)}; // validate
      if(n.indexOf('**')>-1){if(n.startsWith('**')||n.endsWith('**')){return;}}; // validate
      if(n==='*'){return TRUE;};if(n.length<2){return};if(wrapOf(n==='**')){n=unwrap(n); return (h.indexOf(n)>-1)}; // contains
      if(n.startsWith('*')){n=ltrim(n,'*'); return h.endsWith(n);}; // ends-with
      if(n.slice(-1)==='*'){n=rtrim(n,'*'); return h.startsWith(n);}; // starts-with
      if(n.indexOf('**')<1){return FALS;}; p=n.split('**'); b=akin(h,(p[0]+'*')); e=akin(h,('*'+p[1])); return (b&&e); // starts-&-ends-with
   };
// ---------------------------------------------------------------------------------------------------------------------------------------------



// func :: test : test a string against some Regex pattern
// --------------------------------------------------------------------------------------------------------------------------------------------
   const test = function(v,x)
   {
      if(((typeof v)!='string')||(v.length<1)){return FALS}; if(!x){return};
      if((typeof x)=='string'){if(wrapOf(x)!=='//'){return}; x=(new RegExp(x));}; if(!x){return};
      if(x.constructor&&(x.constructor.name=='RegExp')){return (x.test(v)?TRUE:FALS)};
      if(isFunc(x)){return x(v)};
   };
// --------------------------------------------------------------------------------------------------------------------------------------------



// shiv :: (types) : shorthands to identify any datatype .. g & l is "greater-than" & "less-than" -which supports counting items inside v
// --------------------------------------------------------------------------------------------------------------------------------------------
   const isVoid = function(v){return ((v===VOID)||(v===null));};
   const isBool = function(v){return ((v===TRUE)||(v===FALS));};

   const isNumr = function(v,g,l){if(!((typeof v)==='number')||isNaN(v)){return FALS}; return (isVoid(g)||spanIs(v,g,l))};
   const isFrac = function(v,g,l){if(!(isNumr(v)&&((v+'').indexOf('.')>0))){return FALS}; return (isVoid(g)||spanIs(v,g,l))};
   const isInum = function(v,g,l){if(!isNumr(v)||isFrac(v)){return FALS}; return (isVoid(g)||spanIs(v,g,l))};

   const isText = function(v,g,l){if(!((typeof v)==='string')){return FALS}; return (isVoid(g)||spanIs(v,g,l))};
   const isWord = function(v,g,l){if(!test(trim(v,'_'),/^([a-zA-Z])([a-zA-Z0-9_]{1,35})+$/)){return}; return (isVoid(g)||spanIs(v,g,l))};
   const isPath = function(v,g,l){if(!test(v,/^([a-zA-Z0-9-\/\._@~$]){1,432}$/)){return FALS}; return ((v[0]=='/')&&(isVoid(g)||spanIs(v,g,l)))};
   const isJson = function(v,g,l){return (isin(['[]','{}','""'],wrapOf(v))?TRUE:FALS);};
   const isDurl = function(v,g,l){return (isText(v)&&(v.indexOf('data:')===0)&&(v.indexOf(';base64,')>0));};
   const isHtml = function(v,g,l)
   {
       if(!isText(v)){return false}; v=v.trim(); if(!v){return false};
       // if(!(v.startsWith("<")&&v.endsWith(">"))){return false};
       let t="<html|<head|<body|<a |<i|<b|<p|<span|<div|<pre|<code|<button|<style|<table|<br|<meta|<link".split("|");
       if(!isin(v,t)||!isin(v,">")){return false}; return true;
   };

   const isList = function(v,g,l)
   {
      let t=Object.prototype.toString.call(v).toLowerCase();
      if((t.indexOf('arra')<0)&&(t.indexOf('argu')<0)&&(t.indexOf('list')<0)&&(t.indexOf('coll')<0)){return FALS};
      return (isVoid(g)||spanIs(v,g,l))
   };

   const isKnob = function(v,g,l){if(((typeof v)!='object')||isList(v)||isNode(v)){return FALS}; return (isVoid(g)||spanIs(v,g,l))};

   const isObja = function(d,g,l)
   {
       if(!isKnob(d)){return false}; let k,x,v; k=Object.keys(d); x=0;
       for(let i in k){if(!k.hasOwnProperty(i)){continue}; v=(k[i]*1); if(v!=x){return false}; x++};
       return (isVoid(g)||spanIs(k,g,l));
   };

   const isNode = function(v,g,l)
   {
       if(isVoid(v)||((typeof v)!='object')){return FALS}; if((typeof v.getBoundingClientRect)!='function'){return FALS};
       return (isVoid(g)||spanIs(v.childNodes.length,g,l))
   };

   const isTemp = function(v){return (v instanceof DocumentFragment)};
   const isMain = function(v){if(!v||isBool(v)){return FALS}; return (v.isMaster||v.isWorker);};

   const isFunc = function(v,g,l){if(!((typeof v)==='function')){return FALS}; return true;};
   const isTool = function(v, n)
   {if(!v||isBool(v)){return FALS}; n=(v.name||((!!v.constructor)?v.constructor.name:VOID)); return (v.INTRINSIC?true:(n&&(n=='RegExp')));};
// --------------------------------------------------------------------------------------------------------------------------------------------



// shiv :: (case) : set and test text-case
// --------------------------------------------------------------------------------------------------------------------------------------------
   const lowerCase = function(v){if(!isText(v,1)){return v}; return v.toLowerCase()};
   const upperCase = function(v){if(!isText(v,1)){return v}; return v.toUpperCase()};

   // const proprCase = function(v){if(!isText(v,1)){return v}; return (v[0].toUpperCase()+(v[1]?v.substring(1).toLowerCase():''))};
   const proprCase = function(v)
   {
       if(!isText(v,1)){return v};
       v=v.split(' ').join('-'); let r=[];
       v.split('-').forEach((i)=>
       {
           let x = r.length;
           let c = i.slice(0,1).toUpperCase();
           let z = i.slice(1).toLowerCase();
           r[x] = (c+""+z);
       });

       return r.join(" ");
   };

   const camelCase = function(v)
   {if(!isText(v,1)){return v}; v=v.split(' ').join('-'); let r='';v.split('-').forEach((i)=>{r+=proprCase(i)}); return r;};

   const isLowerCase = function(v){return (v===lowerCase(v));}
   const isUpperCase = function(v){return (v===upperCase(v));}
   const isProprCase = function(v){return (v===proprCase(v));}
   const isCamelCase = function(v){return (v===camelCase(v));}
// --------------------------------------------------------------------------------------------------------------------------------------------



// func :: extend : define hardened properties -- neat shorthand to define multiple immutable properties of multiple targets
// --------------------------------------------------------------------------------------------------------------------------------------------
   const extend = function()
   {
      var a = [].slice.call(arguments);
      return (function(d)
      {
         if(!isKnob(d)){return}; var o = {writable:FALS,enumerable:FALS,configurable:FALS,value:TRUE};  var r=TRUE;  a.forEach((i)=>
         {
            if((['o','f'].indexOf((typeof i)[0])<0)){r=FALS;return};  var m=(i.MAINROLE?TRUE:FALS);  var t=VOID;  for(var p in d)
            {
               if(!d.hasOwnProperty(p)){continue;};  var v=d[p];  var c={enumerable:FALS,configurable:FALS,writable:FALS};
               t=(typeof v)[0];if(v&&m&&((t=='f')||(t=='o'))){try{Object.defineProperty(v,'INTRINSIC',o)}catch(e){r=FALS;return}};
               c.value=v; if((t=='f')||(t=='o')){Object.defineProperty(v,'name',{writable:FALS,enumerable:FALS,configurable:FALS,value:p})};
               if(p=='each'){c.writable=TRUE}; try{Object.defineProperty(i,p,c)}catch(e){r=FALS;};
            };
            return r;
         });
      });
   };

   extend(Math)({name:'Math'});  extend(console)({name:'console'});
// --------------------------------------------------------------------------------------------------------------------------------------------



// func :: harden : make immutable
// --------------------------------------------------------------------------------------------------------------------------------------------
   const harden = function(t,o)
   {
      o=(o||MAIN); if(!o.hasOwnProperty){fail('invalid parent'); return;}; var k=(isText(t)?t:t.name);
      if(!k||!o.hasOwnProperty(k)){fail('invalid attribute `'+k+'`'); return;};
      Object.defineProperty(o,k,{writable:false,enumerable:false,configurable:false,value:o[k]});
   };
// --------------------------------------------------------------------------------------------------------------------------------------------



// cond :: role : process isWorker, or isMaster
// --------------------------------------------------------------------------------------------------------------------------------------------
   if(MAIN.isWorker){extend(MAIN)({isMaster:FALS})}else{extend({isWorker:(!MAIN.document),isMaster:(!!MAIN.document)});};
// --------------------------------------------------------------------------------------------------------------------------------------------



// func :: constant : get the value of a global constant by name
// --------------------------------------------------------------------------------------------------------------------------------------------
   const constant = function(a)
   {
      if((typeof a)!=='string'){return}; return (new Function('try{return '+a+';}catch(e){};'))();
   };
// --------------------------------------------------------------------------------------------------------------------------------------------



// func :: trap : neat Proxy
// --------------------------------------------------------------------------------------------------------------------------------------------
   const trap = function(o,p,t)
   {
      if(isVoid(p)){return (new Proxy(function(){},o))};
      if(!isWord(p)||!isKnob(t)||(!isVoid(t.get)&&!isFunc(t.get))||(!isVoid(t.set)&&!isFunc(t.set))){return};
      t.enumerable=FALS; t.configurable=FALS; Object.defineProperty(o,p,t); return true;
   };
// --------------------------------------------------------------------------------------------------------------------------------------------



// func :: swap : replace substrings .. yes we know it's a bit slower than [whatever], but it has no "issues"
// --------------------------------------------------------------------------------------------------------------------------------------------
   const swap = function(s,f,r)
   {
      if(isNumr(f)){f=(f+'')}; if(isNumr(r)){r=(r+'')};
      if(isText(f)&&isText(r)){s=s.split(f).join(r); return s};
      if(isList(f)&&isText(r)){f.forEach((i,x)=>{s=s.split(i).join(r);}); return s};
      if(isList(f)&&isList(r)){f.forEach((i,x)=>{s=s.split(i).join(r[x]);}); return s};
      return s;
   };
// --------------------------------------------------------------------------------------------------------------------------------------------



// func :: leaf : base-name from path
// ---------------------------------------------------------------------------------------------------------------------------------------------
   const leaf = function(p)
   {
      let r=pathOf(p); if(!r){r=pathOf('/'+p); if(!r){return}}; let b=r.split('/').pop(); return b;
   };
// ---------------------------------------------------------------------------------------------------------------------------------------------



// func :: fext : get valid file extension from path
// ---------------------------------------------------------------------------------------------------------------------------------------------
   const fext = function(p)
   {
      let r=pathOf(p); if(!r){r=pathOf('/'+p); if(!r){return}}; let b=r.split('/').pop(); if(!isin(b,'.')){return}; r=b.split('.').pop();
      if(test(r,/^[a-zA-Z0-9]{1,8}$/)){return r};
   };
// ---------------------------------------------------------------------------------------------------------------------------------------------



// func :: serializer : to use with JSON.stringify for circular references
// ---------------------------------------------------------------------------------------------------------------------------------------------
   const serializer = function (replacer, cycleReplacer)
   {
     var stack = [], keys = []

     if (cycleReplacer == null) cycleReplacer = function(key, value)
     {
       if (stack[0] === value) return "[Circular ~)"
       return "[Circular ~." + keys.slice(0, stack.indexOf(value)).join(".") + "]"
     }

     return function(key, value)
     {
       if (stack.length > 0)
       {
         var thisPos = stack.indexOf(this)
         ~thisPos ? stack.splice(thisPos + 1) : stack.push(this)
         ~thisPos ? keys.splice(thisPos, Infinity, key) : keys.push(key)
         if (~stack.indexOf(value)) value = cycleReplacer.call(this, key, value)
       }
       else stack.push(value)

       return replacer == null ? value : replacer.call(this, key, value)
     }
   }
// ---------------------------------------------------------------------------------------------------------------------------------------------



// func :: tval : turn any variable into text
// --------------------------------------------------------------------------------------------------------------------------------------------
   const tval = function(v)
   {
      if(isMain(v)){return ':MAIN:'}; if(isBool(v)||isNumr(v)){return JSON.stringify(v)}; if(isFunc(v)||isTool(v)){return v.toString()};
      if(isText(v)){if(v==''){return '""'}; let x=v.trim(); if(x!=''){return v}; return swap(v,["\n",' ',"\t"],['↵','␣','⇥']);};
      if((v===VOID)){return 'undefined'}; if(v===null){return 'null';};
      if(isNode(v)){return v.outerHTML}; if(isKnob(v)||(isList(v)&&!isNode(v[0]))){return JSON.stringify(v,serializer())};
      let r=''; v.forEach((n)=>{if(!isNode(n)){return}; r+=(n.outerHTML+'\n')}); return r;
   };
// --------------------------------------------------------------------------------------------------------------------------------------------



// func :: dump : console.log()
// --------------------------------------------------------------------------------------------------------------------------------------------
   globalThis.dump = console.log.bind(console);

   // const dump = function()
   // {
   //    let m,a,t,f,x,n,d; m=('dump log size of '+this.mkb+'Kb exceeded'); a=([].slice.call(arguments)); a.forEach((i)=>
   //    {
   //       n=time(); d=(n-this.old); t=tval(i); this.ckb+=(t.length/1024); f=(this.ckb>this.mkb); if(f){this.ckb=0; this.old=n;};
   //       if(f&&(d>5)){console.clear(); f=0}; x=(f?m:i); console[(f?'error':'log')](x);
   //       MAIN.dispatchEvent((new CustomEvent('dump',{detail:x})));
   //    });
   // }.bind({ckb:0,mkb:64,old:0});

   const dumpIf = function(c,d){if(c){dump(d)}};
// --------------------------------------------------------------------------------------------------------------------------------------------



// func :: fail : trigger error
// --------------------------------------------------------------------------------------------------------------------------------------------
   const fail = function(m, a,n,f,l,s,p,o)
   {
      if(!MAIN.BOOTED){console.error(`BOOT FAIL !!`); console.error(m);};
      if(MAIN.HALT){return}; MAIN.HALT=1; if(MAIN.Busy){Busy.tint('red')}; tick.after(2000,()=>{MAIN.HALT=0});
      if(isJson(m)&&(wrapOf(m)=="{}")){m=JSON.parse(m); dump([m.file,m.line]);};
      if(isText(m))
      {
          if(isin(m,"evnt: ")&&isin(m,"\nmesg: "))
          {
              a=m.split("\n"); lpop(a); m=stub(a[0],": ")[2]; n=stub(m,' - '); if(n&&isWord(n[0])){m=n[2];n=n[0]}else{n="Undefined"};
              f=stub(a[1],": ")[2]; l=stub(a[2],": ")[2]; a=decode.jso(atob(stub(a[3],": ")[2]));
              s=[]; a.forEach((i)=>{radd(s,`${i.func} ${i.file} ${i.line}`)}); o={evnt:n,mesg:m,file:f,line:l,stak:s};
              if(seenFail(o)){return}; MAIN.dispatchEvent((new CustomEvent('procFail',{detail:o}))); return;
          };
          if(!isin(m,' :: ')){m=('Usage :: '+m);}; n=stub(m,' :: '); m=n[2]; n=n[0]; s=stak(); p=(s[0]||"").split(" ");
          o={evnt:n,mesg:m,file:p[1],line:p[2],stak:s}; if(seenFail(o)){return};
          MAIN.dispatchEvent((new CustomEvent('procFail',{detail:o}))); return;
      };
      if(!isKnob(m)){console.error("wrong usage of fail()"); alert("an error has occurred, mistakes were made, me scuzi"); return};
      m.evnt=(m.evnt||m.name); if(!m.evnt){p=stub(m.mesg," - "); if(p&&isWord(p[0])){m.evnt=p[0]; m.mesg=p[2]}};
      m.stak=(m.stak||stak()); if(isKnob(m.stak[0])){s=[]; m.stak.forEach((i)=>{radd(s,`${i.func} ${i.file} ${i.line}`)}); m.stak=s};
      if(seenFail(m)){return};
      MAIN.dispatchEvent((new CustomEvent('procFail',{detail:m})));
   };

   const seenFail=function(d, r)
   {
       d=md5(`${d.evnt}${d.mesg}${d.file}${d.line}`); r=(this.hash==d); this.hash=d; return r;
   }.bind({hash:""});
// --------------------------------------------------------------------------------------------------------------------------------------------



// shiv :: (keys/vals) : helps a lot
// --------------------------------------------------------------------------------------------------------------------------------------------
   const keys = function(n,o,x, h,r,k)
   {
      if((' und nul boo num str').indexOf(((typeof n).substring(0,3)))>0){return []}; if(o==VOID){o=SELF};
      h=[]; if(o==SELF){h=Object.getOwnPropertyNames(n)}else{for(k in n){h.push(k)}}; if(x==VOID){return h};
      if(isNumr(x)){if(x<1){x=h.length-1}; return h[x]}; if(!isText(x)||(x.length<2)||((x[0]!='*')&&((x.slice(-1)!='*')))){return []};
      r=[]; let b,e,s; if(x[0]=='*'){e=1}else{b=1}; x=trim(x,'*'); s=x.length; if(s<1){return h};
      h.forEach((i)=>{if(b&&(i.slice(0,s)==x)){r.push(i)}else if(e&&(frag(i,(0-s),s)==x)){r.push(i)}}); return r;
   };

   const vals = function(d,x)
   {
      var r = [];  keys(d).forEach(function(k){r.push(d[k])}); if(!isNumr(x)){return r}; if(x<0){x=((r.length-1)+x)};
      return r[x];
   };
// --------------------------------------------------------------------------------------------------------------------------------------------



// func :: defn : constants .. if text given with no spaces it returns a defined constant -or undefined .. else sets constans
// --------------------------------------------------------------------------------------------------------------------------------------------
   const defn = function(v, d)
   {
      if(isText(v)){if(v.indexOf(" ")<0){return MAIN[v]}; d={}; v=v.split(' '); v.forEach((i)=>{d[i]=(':'+i+':')}); return extend(MAIN)(d);};
      if(isKnob(v)){return extend(MAIN)(v);};
   };
// --------------------------------------------------------------------------------------------------------------------------------------------



// defn :: flag : words .. do NOT define these earlier (up) .. defn() needs all the above
// --------------------------------------------------------------------------------------------------------------------------------------------
   defn('INIT AUTO COOL DARK LITE INFO GOOD NEED WARN FAIL NEXT SKIP STOP DONE ACTV NONE BUSY KEYS VALS ONCE EVRY BFOR AFTR UNTL EVNT FILL TILE SPAN OPEN SHUT');
   defn('KEEP SAVE');
   defn('TL TM TR RT RM RB BR BM BL LB LM LT');
   defn('A B C D E F G H I J K L M N O P Q R S T U V W X Y Z');
   defn('OK NA ANY ALL');
   // defn({ALPHABET:'abcdefghijklmnopqrstuvqxyzABCDEFGHIJKLMNOPQRSTUVQXYZ'});
// --------------------------------------------------------------------------------------------------------------------------------------------



// func :: isin : check if haystack contains needle, returns first needle found, or false if not found, or void if invalid
// --------------------------------------------------------------------------------------------------------------------------------------------
   const isin = function(h,n,aa, ht,nt,l,r,s,f,x)
   {
      if((!h&&(h!==0))||(h===null)||(h===true)||(h==="")||(n=="")||(h==[])){return}; if(aa!=ALL){aa=VOID}; ht=(typeof h);
      if(ht=="number"){h+=""}else if((ht=="object")&&(!h.forEach||!h.pop)){h=Object.getOwnPropertyNames(h);}; // str & arr only
      ht=(typeof h); nt=(typeof n); if((ht=="string")&&(nt==ht)){return ((h.indexOf(n)<0)?false:n)}; // strings implicit
      if(!h.length||!h.indexOf){return false}; l=(!!n&&(n!=null)&&((typeof n)!="string")&&!!n.forEach&&!!n.pop); // l == array
      if(!l){x=h.indexOf(n); r=h[x]; return ((x<0)?false:(r?r:(r+"")))}; f=0; s=n.length; r=VOID;
      for(let i in n){if(!n.hasOwnProperty(i)||(h.indexOf(n[i])<0)){continue}; r=n[i]; f++; if((r!==VOID)&&!aa){return (r?r:(r+""))}};
      return (aa?(f==s):((r===VOID)?false:(r?r:(r+""))));
   };
// --------------------------------------------------------------------------------------------------------------------------------------------



// func :: pick : look in haystack and return the 1st needle found in haystack from list of needles
// --------------------------------------------------------------------------------------------------------------------------------------------
   const pick = function(h,n, r)
   {
      if(isText(n)){n=n.split(',')}; if(!isList(n,1)){return}; r=isin(h,n); return r;
   };
// --------------------------------------------------------------------------------------------------------------------------------------------



// func :: padded : add left and right padding to text, or to text in a list, or to keys in an object
// --------------------------------------------------------------------------------------------------------------------------------------------
   const padded = function(d, pl,pr)
   {
      if(!isText(pl)){pl=(pl+'')}; if(!isText(pr)){pr=(pr+'')}; if(isText(d)){return (pl+d+pr);}; if(!isList(d)&&!isKnob(d)){return};
      let r=[]; d.each((v,k)=>{if(!isText(v)){return}; radd(r,(pl+v+pr))}); return r;
   };
// --------------------------------------------------------------------------------------------------------------------------------------------



// func :: copyOf : duplicate .. if numr or text then n repeats n-times
// --------------------------------------------------------------------------------------------------------------------------------------------
   const copyOf = function(v,n, r)
   {
      if(isVoid(v)||(v===null)||(v==="")||isBool(v)){return v};
      if(isNumr(v)||isText(v)){if(!n){return v}; v=(v+''); n=parseInt(n); r=''; for(let i=0;i<n;i++){r+=v}; return r};
      if((v instanceof Element)){return (v.cloneNode(true))};
      if(isList(v)){r=[]; v=([].slice.call(v)); v.forEach((i)=>{r.push(copyOf(i))}); return r};
      if(isKnob(v)||isFunc(v)){r={}; for(let k in v){if(!v.hasOwnProperty(k)){continue}; r[k]=copyOf(v[k])}; return (isFunc(v)?v.bind(r):r)};
   };
// --------------------------------------------------------------------------------------------------------------------------------------------
   const dupe = function(v,n)
   {
      return copyOf(v,n);
   };
// --------------------------------------------------------------------------------------------------------------------------------------------



// shiv :: (wrap) : related to distinct first and last character pairs in text
// --------------------------------------------------------------------------------------------------------------------------------------------
   const isWrap = function(v, r,l)
   {
      if(!isText(v,2)){return FALS}; r=(v.slice(0,1)+v.slice(-1)); l="\"\" '' `` {} [] () <> // :: \\\\ **".split(" ");
      return ((l.indexOf(r)<0)?FALS:r);
   };

   const wrapOf = function(v, w){w=isWrap(v); return (w?w:'')};
   const unwrap = function(v, w){w=isWrap(v); return (w?v.slice(1,-1):v)};
// --------------------------------------------------------------------------------------------------------------------------------------------



// shiv :: (cast) : shorthands to cast given variable to designated (implicit) datatype
// --------------------------------------------------------------------------------------------------------------------------------------------
   const boolOf = function(v)
   {
      if(isBool(v)){return v}; if(isNumr(v)){if(v<1){return FALS;}; v=(v+'')}; if(!isText(v)){v=(span(v)+'');}; v=v.toLowerCase(); let x;
      x='- 0 false fals none null void no deny denied kill killed ignore ignored fail failed failure error down off offline broken'.split(' ');
      if(span(v.trim())<1){return FALS;}; if(!isNaN(v)){if((v*1)<1){return FALS}}; return ((x.indexOf(v)>-1)?FALS:TRUE);
   };

   const numrOf = function(v){if(isNumr(v)){return v}; if(!isNaN(v)){return (v*1)}; return span(v);};
   const textOf = function(v){if(isText(v)){return v}; if(isFunc(v)){return v.toString()}; return JSON.stringify(v)};

   const listOf = function(v,o)
   {
      if((v==VOID)||(v=='')||(v==null)){return []};
      if(isList(v)){return ([].slice.call(v));};
      if(isNumr(v))
      {
         if(isFrac(v)){let x,s; x=(v+''); x=x.split('.')[1]; s=(x.length-1); if(s>5){return;}; i=(('0.'+copyOf('0',s)+'1')*1)}else{i=1};
         if(!o||!isNumr(o)){o=v;}; if(v===o){return [v]}; var r = [];
         if(v<o){for(v; v<=o; v++){r.push(v);}}else{for(o; o<=v; v--){r.push(v);}};  return r;
      };

      if(isFunc(v.toArray)){return v.toArray()};

      if(isKnob(v)&&!isNode(v))
      {
         if(span(v)<1){return []}; let k,f,l; k=keys(v); f=lpop(dupe(k)); l=rpop(dupe(k));
         if(!isNaN(f)&&!isNaN(l)){return (Object.entries(v).reduce((i,[k,v])=>(i[k]=v,i),[]))};
      };

      return [v];
   };

   const pathOf = function(v)
   {
      if(!isText(v)){return}; let r=trim(v); if(!r){return}; if(isPath(r)){return r;}; if(r.startsWith("~")){return ("/"+r);};
      if(!isText(v,2)){return}; r=v; if(isin(r,'://')){r=r.split('://')[1]}; r=stub(r,'/'); if(!r){return};
      r=('/'+r[2]); r=r.split('//').join('/'); r=r.split(' ').join('_'); r=r.split('?')[0];
      return (isPath(r)?r:VOID);
   };

   const argval = function(v)
   {
      if(isText(v)){v=trim(v)}; if(!isText(v,1)){return v}; let d=pick(v,[',',' x ',' ']);
      if(!d){return (!isNaN(v)?(v*1):v)}; let r=[]; v.split(d).forEach((i)=>{radd(r,(!isNaN(i)?(i*1):i))});
      return r;
   };

   const argToObj = function(a,o, r,i,l,z)
   {
      if(!isKnob(o)){return}; if(isText(a)){a=argval(a)}; if(!isList(a)){a=[a]}; r={}; i=(0-1); l=(a.length-1); z=a[(a.length-1)];
      o.each((v,k)=>
      {
         i++; let q=((i>l)?z:a[i]); if(v=='*'){r[k]=q;return};
         let f=constant(`is${proprCase(v)}`); if(!isFunc(f)||!f(q)){r=VOID; return STOP}; r[k]=q;
      });
      return r;
   };
// --------------------------------------------------------------------------------------------------------------------------------------------



// func :: reversed : reverse any string, array, or object
// --------------------------------------------------------------------------------------------------------------------------------------------
   const reversed = function(d, r)
   {
      if(!d||(span(d)<2)){return d}; if(isText(d)){r=d.split('').reverse().join(''); return r};
      if(isList(d)){r=d.reverse(); return r};
      if(!isKnob(d)){return d}; r={}; (keys(d).reverse()).forEach((k)=>{r[k]=d[k]}); return r;
   };
// --------------------------------------------------------------------------------------------------------------------------------------------



// shiv :: sha1 : hash
// --------------------------------------------------------------------------------------------------------------------------------------------
   !function(){"use strict";function t(t){t?(f[0]=f[16]=f[1]=f[2]=f[3]=f[4]=f[5]=f[6]=f[7]=f[8]=f[9]=f[10]=f[11]=f[12]=f[13]=f[14]=f[15]=0,this.blocks=f):this.blocks=[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],this.h0=1732584193,this.h1=4023233417,this.h2=2562383102,this.h3=271733878,this.h4=3285377520,this.block=this.start=this.bytes=this.hBytes=0,this.finalized=this.hashed=!1,this.first=!0}var h="object"==typeof window?window:{},s=!h.JS_SHA1_NO_NODE_JS&&"object"==typeof process&&process.versions&&process.versions.node;s&&(h=global);var i=!h.JS_SHA1_NO_COMMON_JS&&"object"==typeof module&&module.exports,e="function"==typeof define&&define.amd,r="0123456789abcdef".split(""),o=[-2147483648,8388608,32768,128],n=[24,16,8,0],a=["hex","array","digest","arrayBuffer"],f=[],u=function(h){return function(s){return new t(!0).update(s)[h]()}},c=function(){var h=u("hex");s&&(h=p(h)),h.create=function(){return new t},h.update=function(t){return h.create().update(t)};for(var i=0;i<a.length;++i){var e=a[i];h[e]=u(e)}return h},p=function(t){var h=eval("require('crypto')"),s=eval("require('buffer').Buffer"),i=function(i){if("string"==typeof i)return h.createHash("sha1").update(i,"utf8").digest("hex");if(i.constructor===ArrayBuffer)i=new Uint8Array(i);else if(void 0===i.length)return t(i);return h.createHash("sha1").update(new s(i)).digest("hex")};return i};t.prototype.update=function(t){if(!this.finalized){var s="string"!=typeof t;s&&t.constructor===h.ArrayBuffer&&(t=new Uint8Array(t));for(var i,e,r=0,o=t.length||0,a=this.blocks;r<o;){if(this.hashed&&(this.hashed=!1,a[0]=this.block,a[16]=a[1]=a[2]=a[3]=a[4]=a[5]=a[6]=a[7]=a[8]=a[9]=a[10]=a[11]=a[12]=a[13]=a[14]=a[15]=0),s)for(e=this.start;r<o&&e<64;++r)a[e>>2]|=t[r]<<n[3&e++];else for(e=this.start;r<o&&e<64;++r)(i=t.charCodeAt(r))<128?a[e>>2]|=i<<n[3&e++]:i<2048?(a[e>>2]|=(192|i>>6)<<n[3&e++],a[e>>2]|=(128|63&i)<<n[3&e++]):i<55296||i>=57344?(a[e>>2]|=(224|i>>12)<<n[3&e++],a[e>>2]|=(128|i>>6&63)<<n[3&e++],a[e>>2]|=(128|63&i)<<n[3&e++]):(i=65536+((1023&i)<<10|1023&t.charCodeAt(++r)),a[e>>2]|=(240|i>>18)<<n[3&e++],a[e>>2]|=(128|i>>12&63)<<n[3&e++],a[e>>2]|=(128|i>>6&63)<<n[3&e++],a[e>>2]|=(128|63&i)<<n[3&e++]);this.lastByteIndex=e,this.bytes+=e-this.start,e>=64?(this.block=a[16],this.start=e-64,this.hash(),this.hashed=!0):this.start=e}return this.bytes>4294967295&&(this.hBytes+=this.bytes/4294967296<<0,this.bytes=this.bytes%4294967296),this}},t.prototype.finalize=function(){if(!this.finalized){this.finalized=!0;var t=this.blocks,h=this.lastByteIndex;t[16]=this.block,t[h>>2]|=o[3&h],this.block=t[16],h>=56&&(this.hashed||this.hash(),t[0]=this.block,t[16]=t[1]=t[2]=t[3]=t[4]=t[5]=t[6]=t[7]=t[8]=t[9]=t[10]=t[11]=t[12]=t[13]=t[14]=t[15]=0),t[14]=this.hBytes<<3|this.bytes>>>29,t[15]=this.bytes<<3,this.hash()}},t.prototype.hash=function(){var t,h,s=this.h0,i=this.h1,e=this.h2,r=this.h3,o=this.h4,n=this.blocks;for(t=16;t<80;++t)h=n[t-3]^n[t-8]^n[t-14]^n[t-16],n[t]=h<<1|h>>>31;for(t=0;t<20;t+=5)s=(h=(i=(h=(e=(h=(r=(h=(o=(h=s<<5|s>>>27)+(i&e|~i&r)+o+1518500249+n[t]<<0)<<5|o>>>27)+(s&(i=i<<30|i>>>2)|~s&e)+r+1518500249+n[t+1]<<0)<<5|r>>>27)+(o&(s=s<<30|s>>>2)|~o&i)+e+1518500249+n[t+2]<<0)<<5|e>>>27)+(r&(o=o<<30|o>>>2)|~r&s)+i+1518500249+n[t+3]<<0)<<5|i>>>27)+(e&(r=r<<30|r>>>2)|~e&o)+s+1518500249+n[t+4]<<0,e=e<<30|e>>>2;for(;t<40;t+=5)s=(h=(i=(h=(e=(h=(r=(h=(o=(h=s<<5|s>>>27)+(i^e^r)+o+1859775393+n[t]<<0)<<5|o>>>27)+(s^(i=i<<30|i>>>2)^e)+r+1859775393+n[t+1]<<0)<<5|r>>>27)+(o^(s=s<<30|s>>>2)^i)+e+1859775393+n[t+2]<<0)<<5|e>>>27)+(r^(o=o<<30|o>>>2)^s)+i+1859775393+n[t+3]<<0)<<5|i>>>27)+(e^(r=r<<30|r>>>2)^o)+s+1859775393+n[t+4]<<0,e=e<<30|e>>>2;for(;t<60;t+=5)s=(h=(i=(h=(e=(h=(r=(h=(o=(h=s<<5|s>>>27)+(i&e|i&r|e&r)+o-1894007588+n[t]<<0)<<5|o>>>27)+(s&(i=i<<30|i>>>2)|s&e|i&e)+r-1894007588+n[t+1]<<0)<<5|r>>>27)+(o&(s=s<<30|s>>>2)|o&i|s&i)+e-1894007588+n[t+2]<<0)<<5|e>>>27)+(r&(o=o<<30|o>>>2)|r&s|o&s)+i-1894007588+n[t+3]<<0)<<5|i>>>27)+(e&(r=r<<30|r>>>2)|e&o|r&o)+s-1894007588+n[t+4]<<0,e=e<<30|e>>>2;for(;t<80;t+=5)s=(h=(i=(h=(e=(h=(r=(h=(o=(h=s<<5|s>>>27)+(i^e^r)+o-899497514+n[t]<<0)<<5|o>>>27)+(s^(i=i<<30|i>>>2)^e)+r-899497514+n[t+1]<<0)<<5|r>>>27)+(o^(s=s<<30|s>>>2)^i)+e-899497514+n[t+2]<<0)<<5|e>>>27)+(r^(o=o<<30|o>>>2)^s)+i-899497514+n[t+3]<<0)<<5|i>>>27)+(e^(r=r<<30|r>>>2)^o)+s-899497514+n[t+4]<<0,e=e<<30|e>>>2;this.h0=this.h0+s<<0,this.h1=this.h1+i<<0,this.h2=this.h2+e<<0,this.h3=this.h3+r<<0,this.h4=this.h4+o<<0},t.prototype.hex=function(){this.finalize();var t=this.h0,h=this.h1,s=this.h2,i=this.h3,e=this.h4;return r[t>>28&15]+r[t>>24&15]+r[t>>20&15]+r[t>>16&15]+r[t>>12&15]+r[t>>8&15]+r[t>>4&15]+r[15&t]+r[h>>28&15]+r[h>>24&15]+r[h>>20&15]+r[h>>16&15]+r[h>>12&15]+r[h>>8&15]+r[h>>4&15]+r[15&h]+r[s>>28&15]+r[s>>24&15]+r[s>>20&15]+r[s>>16&15]+r[s>>12&15]+r[s>>8&15]+r[s>>4&15]+r[15&s]+r[i>>28&15]+r[i>>24&15]+r[i>>20&15]+r[i>>16&15]+r[i>>12&15]+r[i>>8&15]+r[i>>4&15]+r[15&i]+r[e>>28&15]+r[e>>24&15]+r[e>>20&15]+r[e>>16&15]+r[e>>12&15]+r[e>>8&15]+r[e>>4&15]+r[15&e]},t.prototype.toString=t.prototype.hex,t.prototype.digest=function(){this.finalize();var t=this.h0,h=this.h1,s=this.h2,i=this.h3,e=this.h4;return[t>>24&255,t>>16&255,t>>8&255,255&t,h>>24&255,h>>16&255,h>>8&255,255&h,s>>24&255,s>>16&255,s>>8&255,255&s,i>>24&255,i>>16&255,i>>8&255,255&i,e>>24&255,e>>16&255,e>>8&255,255&e]},t.prototype.array=t.prototype.digest,t.prototype.arrayBuffer=function(){this.finalize();var t=new ArrayBuffer(20),h=new DataView(t);return h.setUint32(0,this.h0),h.setUint32(4,this.h1),h.setUint32(8,this.h2),h.setUint32(12,this.h3),h.setUint32(16,this.h4),t};var y=c();i?module.exports=y:(h.sha1=y,e&&define(function(){return y}))}();
// --------------------------------------------------------------------------------------------------------------------------------------------



// shiv :: md5 : hash
// --------------------------------------------------------------------------------------------------------------------------------------------
   !function(n){"use strict";function t(n,t){var r=(65535&n)+(65535&t);return(n>>16)+(t>>16)+(r>>16)<<16|65535&r}function r(n,t){return n<<t|n>>>32-t}function e(n,e,o,u,c,f){return t(r(t(t(e,n),t(u,f)),c),o)}function o(n,t,r,o,u,c,f){return e(t&r|~t&o,n,t,u,c,f)}function u(n,t,r,o,u,c,f){return e(t&o|r&~o,n,t,u,c,f)}function c(n,t,r,o,u,c,f){return e(t^r^o,n,t,u,c,f)}function f(n,t,r,o,u,c,f){return e(r^(t|~o),n,t,u,c,f)}function i(n,r){n[r>>5]|=128<<r%32,n[14+(r+64>>>9<<4)]=r;var e,i,a,d,h,l=1732584193,g=-271733879,v=-1732584194,m=271733878;for(e=0;e<n.length;e+=16)i=l,a=g,d=v,h=m,g=f(g=f(g=f(g=f(g=c(g=c(g=c(g=c(g=u(g=u(g=u(g=u(g=o(g=o(g=o(g=o(g,v=o(v,m=o(m,l=o(l,g,v,m,n[e],7,-680876936),g,v,n[e+1],12,-389564586),l,g,n[e+2],17,606105819),m,l,n[e+3],22,-1044525330),v=o(v,m=o(m,l=o(l,g,v,m,n[e+4],7,-176418897),g,v,n[e+5],12,1200080426),l,g,n[e+6],17,-1473231341),m,l,n[e+7],22,-45705983),v=o(v,m=o(m,l=o(l,g,v,m,n[e+8],7,1770035416),g,v,n[e+9],12,-1958414417),l,g,n[e+10],17,-42063),m,l,n[e+11],22,-1990404162),v=o(v,m=o(m,l=o(l,g,v,m,n[e+12],7,1804603682),g,v,n[e+13],12,-40341101),l,g,n[e+14],17,-1502002290),m,l,n[e+15],22,1236535329),v=u(v,m=u(m,l=u(l,g,v,m,n[e+1],5,-165796510),g,v,n[e+6],9,-1069501632),l,g,n[e+11],14,643717713),m,l,n[e],20,-373897302),v=u(v,m=u(m,l=u(l,g,v,m,n[e+5],5,-701558691),g,v,n[e+10],9,38016083),l,g,n[e+15],14,-660478335),m,l,n[e+4],20,-405537848),v=u(v,m=u(m,l=u(l,g,v,m,n[e+9],5,568446438),g,v,n[e+14],9,-1019803690),l,g,n[e+3],14,-187363961),m,l,n[e+8],20,1163531501),v=u(v,m=u(m,l=u(l,g,v,m,n[e+13],5,-1444681467),g,v,n[e+2],9,-51403784),l,g,n[e+7],14,1735328473),m,l,n[e+12],20,-1926607734),v=c(v,m=c(m,l=c(l,g,v,m,n[e+5],4,-378558),g,v,n[e+8],11,-2022574463),l,g,n[e+11],16,1839030562),m,l,n[e+14],23,-35309556),v=c(v,m=c(m,l=c(l,g,v,m,n[e+1],4,-1530992060),g,v,n[e+4],11,1272893353),l,g,n[e+7],16,-155497632),m,l,n[e+10],23,-1094730640),v=c(v,m=c(m,l=c(l,g,v,m,n[e+13],4,681279174),g,v,n[e],11,-358537222),l,g,n[e+3],16,-722521979),m,l,n[e+6],23,76029189),v=c(v,m=c(m,l=c(l,g,v,m,n[e+9],4,-640364487),g,v,n[e+12],11,-421815835),l,g,n[e+15],16,530742520),m,l,n[e+2],23,-995338651),v=f(v,m=f(m,l=f(l,g,v,m,n[e],6,-198630844),g,v,n[e+7],10,1126891415),l,g,n[e+14],15,-1416354905),m,l,n[e+5],21,-57434055),v=f(v,m=f(m,l=f(l,g,v,m,n[e+12],6,1700485571),g,v,n[e+3],10,-1894986606),l,g,n[e+10],15,-1051523),m,l,n[e+1],21,-2054922799),v=f(v,m=f(m,l=f(l,g,v,m,n[e+8],6,1873313359),g,v,n[e+15],10,-30611744),l,g,n[e+6],15,-1560198380),m,l,n[e+13],21,1309151649),v=f(v,m=f(m,l=f(l,g,v,m,n[e+4],6,-145523070),g,v,n[e+11],10,-1120210379),l,g,n[e+2],15,718787259),m,l,n[e+9],21,-343485551),l=t(l,i),g=t(g,a),v=t(v,d),m=t(m,h);return[l,g,v,m]}function a(n){var t,r="",e=32*n.length;for(t=0;t<e;t+=8)r+=String.fromCharCode(n[t>>5]>>>t%32&255);return r}function d(n){var t,r=[];for(r[(n.length>>2)-1]=void 0,t=0;t<r.length;t+=1)r[t]=0;var e=8*n.length;for(t=0;t<e;t+=8)r[t>>5]|=(255&n.charCodeAt(t/8))<<t%32;return r}function h(n){return a(i(d(n),8*n.length))}function l(n,t){var r,e,o=d(n),u=[],c=[];for(u[15]=c[15]=void 0,o.length>16&&(o=i(o,8*n.length)),r=0;r<16;r+=1)u[r]=909522486^o[r],c[r]=1549556828^o[r];return e=i(u.concat(d(t)),512+8*t.length),a(i(c.concat(e),640))}function g(n){var t,r,e="";for(r=0;r<n.length;r+=1)t=n.charCodeAt(r),e+="0123456789abcdef".charAt(t>>>4&15)+"0123456789abcdef".charAt(15&t);return e}function v(n){return unescape(encodeURIComponent(n))}function m(n){return h(v(n))}function p(n){return g(m(n))}function s(n,t){return l(v(n),v(t))}function C(n,t){return g(s(n,t))}function A(n,t,r){return t?r?s(t,n):C(t,n):r?m(n):p(n)}"function"==typeof define&&define.amd?define(function(){return A}):"object"==typeof module&&module.exports?module.exports=A:n.md5=A}(this);
// --------------------------------------------------------------------------------------------------------------------------------------------



// func :: path : returns normalised path, relative to docroot .. or undefined if invalid
// --------------------------------------------------------------------------------------------------------------------------------------------
   const path = function(p)
   {
      if(!isText(p,1)){return;};  var h,r; r=(p+''); if(isin(r,'://')){r=r.split('://')[1]}; if(r.length<1){return}; r=r.split('?')[0];
      if((r[0]!='/')&&!r.startsWith('~/')){let x=r.indexOf('/'); r=(x?r.substring(x):'/');}; if(r=='/'){return r};
      r=r.split('//').join('/'); if(r.startsWith('~/')){r=('/'+r)}; if(isPath(r)){return r;};
   };
// --------------------------------------------------------------------------------------------------------------------------------------------



// func :: twig : uses `path` then returns the path containing the last item
// --------------------------------------------------------------------------------------------------------------------------------------------
   const twig = function(p, t,r)
   {
      t=path(p); if(!t){return}; if(t=='/'){return t}; if(p.startsWith('~/')){t=ltrim(t,'/')}; if(!isin(ltrim(t,'/'),'/')){return '/'};
      p=rstub(t,'/'); r=p[0]; return r;
   };
// --------------------------------------------------------------------------------------------------------------------------------------------



// func :: indx : returns key/index of h that contains n .. returns VOID if invalid or not-found
// --------------------------------------------------------------------------------------------------------------------------------------------
   const indx = function(h,n,p)
   {
      if(!isInum(p)){p=0;}; let x,r;

      if(isList(h)){return h.indexOf(n);};

      if(isText(h))
      {
         if(!h[p]){return}; if(isNumr(n)){n=(n+'')}; if(!isText(n,1)){return};
         x=h.indexOf(n,p); return ((x<0)?VOID:x);
      };
   };
// --------------------------------------------------------------------------------------------------------------------------------------------



// func :: expose : returns a list of items found in string wrapped inside string-pair
// --------------------------------------------------------------------------------------------------------------------------------------------
   const expose = function(t,b,e,x)
   {
      if(!isText(t,1)||!isText(b,1)||!isText(e,1)||(t.indexOf(b)<0)||(t.indexOf(e)<0)){return};  // validate
      let r,ml,xb,xe,xs,bl,el; bl=b.length; el=e.length; ml=(bl+el); if(t.length<(ml+1)){return}; r=[];
      do
      {
         xb=t.indexOf(b); if(xb<0){break}; xe=t.indexOf(e,(xb+bl)); if(xe<0){break};
         xs=t.slice((xb+bl),xe); if(!x||test(xs,x)){r.push(xs); t=t.slice((xe+el));}else{t=t.slice(xe);};
      }
      while((t.length>ml)&&(xb>-1)&&(xe>-1))
      return ((r.length>0)?r:VOID);
   };
// --------------------------------------------------------------------------------------------------------------------------------------------



// func :: frag : returns part(s) of a string or array .. supports negative-start-pos-int and length-int .. supports negative-end-pos int
// --------------------------------------------------------------------------------------------------------------------------------------------
   const frag = function(d,x,l, s,p,i,r,z)
   {
      if(isVoid(l)&&(isVoid(x)||(x==='')||(x===0)||(x===1))){return (isText(d)?d.split(''):d)}; // chunk by 1
      if(!isText(d)&&!isList(d)){return}; if(isText(d)&&isText(x)&&isVoid(l)){return d.split(x)}; // chunk by delimiter
      if(isText(d)&&isNumr(x)&&isVoid(l)){s=Math.ceil(d.length/x);r=[];for(i=0;i<s;i++){p=(i*x);r[i]=d.substring(p,(p+x))};return r};// chunk n

      z=(span(d)-1); if(z<0){return}; if(isList(d)&&isVoid(l)){l=z}; if(isNumr(x)&&(x<0)){x=(z+x);if(isVoid(l)){l=z}};
      if(isNumr(l)&&(l<0)){l=(z+l);}; if(!isNumr(x)){x=d.indexOf(x)}; if(!isNumr(l)){l=d.indexOf(l)}; if((x<1)||(l<1)){return}; // void
      if(isText(d)){return d.substring(x,l)}; if(isList(d)){return d.slice(x,l)}; // slice
   };
// --------------------------------------------------------------------------------------------------------------------------------------------



// func :: hash : returns sha1 hash of given value .. if no value given then return hash of (timestamp + document-lifetime + 10-random-chars)
// --------------------------------------------------------------------------------------------------------------------------------------------
   const hash = function(v)
   {
      if(v==VOID){v=(Date.now()+''+performance.now()+''+(Math.random().toString(36).slice(2,12)));}else{v=tval(v)};
      return sha1(v);
   };
// --------------------------------------------------------------------------------------------------------------------------------------------



// func :: fash : faster prformance variant of `hash` .. not as "unique" (but unique to this runtime instance) and returns md5
// --------------------------------------------------------------------------------------------------------------------------------------------
   const fash = function(v)
   {
      if(v==VOID){v=(performance.now()+''+(Math.random().toString(36).slice(2,12)));}else{v=tval(v)};
      return md5(v);
   };
// --------------------------------------------------------------------------------------------------------------------------------------------



// func :: stub : split once on first occurance of delimeter
// --------------------------------------------------------------------------------------------------------------------------------------------
   const stub = function(t,a)
   {
      var c,i,b,e,s; c=isin(t,a); if(!c){return};
      s=c.length; i=t.indexOf(c);  b=((i>0)?t.slice(0,i):'');  e=(t[(i+s)]?t.slice((i+s)):'');  return [b,c,e];
   };

   const rstub = function(t,a)
   {
      var c,i,b,e,a,s;  c=isin(t,a); if(!c){return};
      s=c.length; i=t.lastIndexOf(c); b=((i>0)?t.slice(0,i):''); e=(t[(i+s)]?t.slice((i+s)):'');  return [b,c,e];
   };
// --------------------------------------------------------------------------------------------------------------------------------------------



// shiv :: (trim) : trim either white-space or substring from begin -and/or end of string
// --------------------------------------------------------------------------------------------------------------------------------------------
   const ltrim = function(t,c)
   {
      if(!isText(t,1)){return t}; if(c===VOID){return t.replace(/^\s+/g,'')};
      if(isNumr(c)){c=(c+'')}; if(!isText(c)){return t}; let s=c.length; while(t.indexOf(c)===0){t=t.slice(s);}; return t;
   };

   const rtrim = function(t,c)
   {
      if(!isText(t,1)){return t}; if(c===VOID){return t.replace(/\s+$/g,'')};
      if(isNumr(c)){c=(c+'')}; if(!isText(c)){return t}; let s=c.length;
      while(t.slice((0-s))==c){t=t.slice(0,(t.length-s));};
      return t;
   };

   const trim = function(t,b,e)
   {
      if(!isText(t,1)){return t}; if((b===VOID)&&(e===VOID)){return t.trim();}; if(isNumr(b)){b=(b+'')};
      if(e===VOID){e=b}else if(isNumr(e)){e=(b+'')}; if(b===e){t=rtrim(ltrim(t,b),e); return t;};
      if(b&&!e){return ltrim(t,b)}; if(e&&!b){return rtrim(t,e)}; return t;
   };
// --------------------------------------------------------------------------------------------------------------------------------------------



// shiv :: (array) : simple array tools .. for when "push" comes to shove(it)
// --------------------------------------------------------------------------------------------------------------------------------------------
   extend(Array.prototype)
   ({
      ladd:function(i){this.unshift(i); return this},
      radd:function(i){this[this.length]=i; return this},

      lpop:function(){let r=this.shift(); return r},
      rpop:function(){let r=this.pop(); return r},

      last:function(i){let z=(this.length-1); if(i){return z}; return ((z<0)?VOID:this[z])},
      item:function(x){if(!isInum(x)){return}; if(x<0){x=(this.length+x)}; return this[x];},
   });

   const ladd = function(a,i){a.ladd(i); return a};
   const radd = function(a,i){a.radd(i); return a};

   const lpop = function(a,i){let r=a.lpop(); return r};
   const rpop = function(a,i){let r=a.rpop(); return r};

   const last = function(a,i){let r=a.last(i); return r};
// --------------------------------------------------------------------------------------------------------------------------------------------



// func :: sval : simple string parsed value
// --------------------------------------------------------------------------------------------------------------------------------------------
   const sval = function(a)
   {
      if(!isText(a)){return}; let b=a.trim(); b=b.toLowerCase(); if((1>b.length)||("null"===b)||("undefined"===b)||(a==="VOID")){return null};
      if("true"===b){return!0}; if("false"===b){return!1}; if((a[0]=='+')&&!isNaN(a.slice(1))){a=a.slice(1)};
      if(!isNaN(a)){return (a*1)}; return a;
   };
// --------------------------------------------------------------------------------------------------------------------------------------------



// func :: dval : simple string parsing
// --------------------------------------------------------------------------------------------------------------------------------------------
   const dval = function(a)
   {
      let b=sval(a); if(b!=a){return b}; let w=wrapOf(a); let r=VOID;
      if(isin(["{}","[]"],w)){try{b=JSON.parse(a)}catch(c){return null}return b}; if(isin(['""',"''","``"],w)){return unwrap(a)};
      let q=a.indexOf(':'); if(q>-1){q=camelCase((a.slice(0,q)).trim())};  if((w==='<>')||!isWord(q)){return a};
      a=a.split("\r\n").join("\n").split("\n");  r=null; a.forEach((l)=>{let p=stub(l,':'); if(!r){r=(p?{}:[]);};
      if(!p){r[r.length]=dval(l);return;}; let k=camelCase(p[0].trim());
      let v=(((p[2].indexOf(':')>-1)&&(p[2].indexOf('{')<0))?p[2].trim():dval(p[2])); r[k]=v;}); return r;
   };
// --------------------------------------------------------------------------------------------------------------------------------------------



// func :: farg : extract argument values from function-like string .. `n` forces numeric if n is true .. typically used for CSS parsing
// --------------------------------------------------------------------------------------------------------------------------------------------
   const farg = function(d,n, t,r)
   {
      if(isText(d)){d=rtrim(trim(d),';')}; if(!isText(d,1)){return}; d=rtrim(d,')'); d=d.split('(').pop(); r=[]; d.split(',').forEach((v)=>
      {v=v.trim(); if(n&&v.endsWith('%')){t=rtrim(v,'%'); if(!isNaN(t)){v=((t*1)/100)}}; if(!isNaN(v)){v*=1}; r.radd(v)});
      return r;
   }
// --------------------------------------------------------------------------------------------------------------------------------------------



// func :: called : call a function .. or an object -or array of functions .. useful for many things
// --------------------------------------------------------------------------------------------------------------------------------------------
   const called = function(d,a, r)
   {
       if(isText(d,1)){d=MAIN[d]}; // name of function given
       if(!isList(a)){a=[a];}; // must be args-list
       if(isFunc(d)){return d.apply(d,a)}; // function given
       if(!isKnob(d)||!isList(d)){return}; // nohing to do

       r=(isKnob(d)?{}:(isList(d)?[]:VOID)); // set result as empty type-of given bulk operations
       d.each((v,k)=>{r[k]=(isFunc(v)?v.apply(d,a):v)}); // called function results now in place .. along with properties
       return r;
   };
// --------------------------------------------------------------------------------------------------------------------------------------------



// func :: parted : parsing function to separate text into parts according to a set of sub-tools .. use e.g: parted("123Kg").unitPart
// --------------------------------------------------------------------------------------------------------------------------------------------
   const parted = function(txt,sel,fnc, rsl)
   {
       if(!isText(txt,1)){return}; if(isFunc(sel)){fnc=sel;}; // validation
       return called((isWord(sel)?this[sel]:this),[txt,fnc]); // result
   }
   .bind
   ({
    // func :: numrUnit : get `numr` and mesurement `unit` from string .. returns object .. use e.g: parted("123Kg","unitPart") .. direct
    // ----------------------------------------------------------------------------------------------------------------------------------------
       numrUnit:function(txt,fnc, lst,nmr)
       {
           lst=txt.match(/[0-9\.]+|[a-zA-Z]+/g); // separate numbers from text
           if(span(lst)<2){return}; nmr=(lst[0]*1); if(!isNumr(nmr)||!test(lst[1],/[a-zA-Z]/)){return}; // validation
           return {numr:nmr,unit:lst[1]};
       },
    // ----------------------------------------------------------------------------------------------------------------------------------------
   });
// --------------------------------------------------------------------------------------------------------------------------------------------



// func :: reckon : calculate simple expressions in text .. works with mesurement-units too
// --------------------------------------------------------------------------------------------------------------------------------------------
   const reckon = function(txt, prt,lft,opr,rgt,rsl,pl,pr)
   {
       prt=stub(txt,keys(this)); if(!prt){return}; lft=trim(prt[0]); opr=prt[1]; rgt=trim(prt[2]); if(!this[opr]){return};
       if(!isNaN(lft)){lft*=1}; if(!isNaN(rgt)){rgt*=1}; if(isNumr(lft)&&isNumr(rgt)){return this[opr](lft,rgt)}; // quick
       if(isText(lft)){parted(lft,"numrUnit");}; if(isText(rgt)){parted(rgt,"numrUnit");}; // get units
       if(lft.unit&&rgt.unit&&(lft.unit!=rgt.unit)){return}; // cannot calculate different units
       rsl=this[opr]((lft.unit?lft.numr:lft),(rgt.unit?rgt.numr:rgt)); // get result
       if(lft.unit){rsl+=lft.unit}else if(rgt.unit){rsl+=rgt.unit}; // add unit to result if any
       return rsl;
   }
   .bind
   ({
       '<=':function(l,r){return (l<=r);},
       '>=':function(l,r){return (l>=r);},
       '+':function(l,r){return (l+r);},
       '-':function(l,r){return (l-r);},
       '*':function(l,r){return (l*r);},
       '/':function(l,r){return (l/r);},
       '%':function(l,r){return (l%r);},
       '~':function(l,r){return (l==r);},
       '=':function(l,r){return (l===r);},
       '<':function(l,r){return (l<r);},
       '>':function(l,r){return (l>r);},
       '|':function(l,r){return (l||r);},
   });
// --------------------------------------------------------------------------------------------------------------------------------------------



// func :: hext : validate, purify & enrich hex string .. removes `#` .. `o` is "octa"
// --------------------------------------------------------------------------------------------------------------------------------------------
   const hext = function(d,o, l)
   {
      if(isText(d)){d=lowerCase(trim(trim(d),'#'));}; if(!test(d,/^[a-f0-9]{3,8}$/)){return};
      if(d.length<5){l=[]; d.split('').forEach((c)=>{radd(l,(c+''+c))}); d=l.join('');};
      if(o&&d.length<8){d=(d+'ff')}; l=d.length; if((!o&&(l<6))||(o&&(l!=8))){return}; return d;
   };
// --------------------------------------------------------------------------------------------------------------------------------------------



// func :: (color-space) : convert between hsl,hsv,rgb,hex
// --------------------------------------------------------------------------------------------------------------------------------------------
   const hsv2hsl = (h,s,v,l=v-v*s/2,m=Math.min(l,1-l)) => [h,m?(v-l)/m:0,l];
   const hsl2hsv = (h,s,l,v=s*Math.min(l,1-l)+l) => [h, v?2-2*l/v:0, v];

   const rgb2hsv = function(r,g,b,a)
   {
      if(isText(r)){r=farg(r,1)}; if(isList(r)){a=r[3]; b=r[2]; g=r[1]; r=r[0]};
      let v=Math.max(r,g,b), n=v-Math.min(r,g,b); let h= n && ((v==r) ? (g-b)/n : ((v==g) ? 2+(b-r)/n : 4+(r-g)/n));
      let z=[60*(h<0?h+6:h), v&&n/v, v]; if(isNumr(a)){z.radd(a)}; return z;
   }

   const hsv2rgb = function(h,s,v,a)
   {
      if(isText(h)){h=farg(h,1)}; if(isList(h)){a=h[3]; v=h[2]; s=h[1]; h=h[0]};
      let f= (n,k=(n+h/60)%6) => v - v*s*Math.max( Math.min(k,4-k,1), 0);
      let z=[f(5),f(3),f(1)]; z.forEach((v,k)=>{z[k]=Math.round(v*255)});
      if(isNumr(a)){z.radd(a)}; return z;
   };

   const rgb2hsl = function(r,g,b,a)
   {
      if(isText(r)){r=farg(r,1)}; if(isList(r)){a=r[3]; b=r[2]; g=r[1]; r=r[0]};
      let q=Math.max(r,g,b), n=q-Math.min(r,g,b), f=(1-Math.abs(q+q-n-1));
      let h= n && ((q==r) ? (g-b)/n : ((q==g) ? 2+(b-r)/n : 4+(r-g)/n));
      let z=[60*(h<0?h+6:h), f ? n/f : 0, (q+q-n)/2]; if(isNumr(a)){z.radd(a)}; return z;
   }

   const hsl2rgb = function (h,s,l,a)
   {
      if(isText(h)){h=farg(h,1)}; if(isList(h)){a=h[3]; l=h[2]; s=h[1]; h=h[0]};
      let q=s*Math.min(l,1-l);
      let f= (n,k=(n+h/30)%12) => l - q*Math.max(Math.min(k-3,9-k,1),-1);
      let z=[f(0),f(8),f(4)]; z.forEach((v,k)=>{z[k]=Math.round(v*255)});
      if(isNumr(a)){z.radd(a)}; return z;
   }

   const hex2rgb = function(d)
   {
      let x,l,r; x=hext(d,((span(d)==4)||(span(d)==8))); if(!x){return}; l=frag(d,2); r=[];
      l.forEach((v,k)=>{v=ltrim(v,'0'); if(!v){v='0'}; radd(r,parseInt(v,16))}); if(r.length>3){r[3]=round((r[3]/255),4)};
      return r;
   };

   const rgb2hex = function(r,g,b,a)
   {
      let l; if(isText(r)){r=farg(r,1)}; if(isList(r)){l=r}else{l=[r,g,b,a]}; let z=[];
      l.forEach((v,k)=>{v=(v*1); if(k>2){v=Math.ceil(255*v)}; v=v.toString(16); if(span(v)<2){v=`0${v}`}; z.radd(v)});
      z=z.join(''); return z;
   };

   const hsl2hex = function(h,s,l,a)
   {
      return rgb2hex(hsl2rgb(h,s,l,a));
   };

   const hsv2hex = function(h,s,v,a)
   {
      return rgb2hex(hsv2rgb(h,s,v,a));
   };

   const hexTxt = function(t,o)
   {
      let p,s,f,r; p=stub(trim(t),'('); if(!p){r=hext(t,o); return (r?`#${r}`:VOID)}; s=rtrim(p[0],'a');
      f=constant(`${s}2hex`); if(!f){return}; r=f(t); if(!r){return}; if(o&&(r.length<8)){r+='ff'}; return `#${r}`;
   };

   const rgbTxt = function(t)
   {
      let p,s,f,r; p=stub(trim(t),'('); if(!p){t=hext(t); if(!t){return}; p=['hex'];}; s=rtrim(p[0],'a'); f=constant(`${s}2rgb`);
      if(!f){return}; r=f(t); if(!r){return}; s='rgb'; if(r.length>3){s+='a'}; r=r.join(','); return `${s}(${r})`;
   };
// --------------------------------------------------------------------------------------------------------------------------------------------



// func :: stackLog : get call-stack from (optional) error object `e` .. `o` is (optional) omit -which can be number, or string or array
// --------------------------------------------------------------------------------------------------------------------------------------------
   const stackLog = function(e,o)
   {
      var h,s,r,f,p,l,x; h=(location.protocol+'//'+location.hostname+''); s=(e||(new Error('.'))).stack;
      if((s.indexOf('\n')<0)||(s.indexOf('at ')<0)){return []}; s=s.split('\n'); r=[]; x=0; if(!isList(o)){o=[o]};
      o.push('stackLog'); s.forEach(function(i)
      {
         if(i.indexOf("at ")<0){return};
         i=i.split('at ')[1].split('(').join('').split(')').join('').split(' ');if(i.length<2){i.unshift('anonymous')};if(i.length>2){return};
         f=i[0]; i=i[1].split(h).join('').split(':'); p=(i[0]+'').trim(); if(p.indexOf(h)>-1){p=p.split(h).join('')}; l=(i[1]*1);
         let skp=false; each(o,(v)=>{if(skp){return STOP}; if((v===f)||(v===x)||(v===p)){skp=TRUE}});
         if(!skp&&f&&isPath(p)&&l){r.push({call:f,path:p,line:l});}; x++;
      });
      return r;
   };
// --------------------------------------------------------------------------------------------------------------------------------------------



// func :: xmlAtr : given an html attributes string, return an object
// --------------------------------------------------------------------------------------------------------------------------------------------
   const xmlAtr = function(d)
   {
      if(isText(d)){d=d.trim()}; if(!isText(d,1)){return}; let l,r; l=d.split('\n').join(' '); l+=' '; l=swap(l,['   ','  '],' ');
      r={}; l.split('" ').forEach((i)=>{i=i.trim().split('="'); let k=trim(i[0]); if(!k){return}; let v=sval(i[1]); r[k]=v});
      return r;
   };
// --------------------------------------------------------------------------------------------------------------------------------------------



// evnt :: fail : global error handler
// --------------------------------------------------------------------------------------------------------------------------------------------
   (function()
   {
      MAIN.addEventListener('error',function(event)
      {
         var e,m,f,l,s,i,n,h,o; event.preventDefault(); event.stopPropagation(); e=event.error;
         f=event.filename; l=event.lineno; if(!e||isText(e)||((e.stack+'').indexOf('\n')<0)){e=(new Error((e+'')))}; n=(e.name||'usage');
         // f=event.filename; l=event.lineno; if(!e||isText(e)||((e.stack+'').indexOf('\n')<0)){e=(new Error((e+'')))}; n=(e.name||'usage');
         m=e.message; if(!f){f=fail.maybe;}; if(!l){l=0;}; s=stak(); h=`https://${HOSTNAME}`; f=ltrim(f,h); f=rtrim(f,'?n=script');
         o={name:n, mesg:m, file:f, line:l, stak:s};
         if(!MAIN.BOOTED){ console.error(`BOOT FAIL !!`); console.error(o);};
         if(MAIN.Busy){Busy.tint('red')}; tick.after(2000,()=>{MAIN.HALT=0});
         if(MAIN.HALT){return}; MAIN.HALT=1;
         if(seenFail(o)){return}; MAIN.dispatchEvent((new CustomEvent('procFail',{detail:o})));
      });
   }());
// --------------------------------------------------------------------------------------------------------------------------------------------



// tool :: bore : get/set/rip keys of objects by dot-path reference
// --------------------------------------------------------------------------------------------------------------------------------------------
   const bore = function(o,k,v)
   {
      if(((typeof k)!='string')||(k.trim().length<1)){return}; // invalid
      if(v===VOID){return (new Function("a",`return a.${k}`))(o)}; // get
      if(v===null){(new Function("a",`delete a.${k}`))(o); return true}; // rip
      (new Function("a","z",`a.${k}=z`))(o,v); return true; // set
   };
// --------------------------------------------------------------------------------------------------------------------------------------------



// tool :: bake : define hardened properties
// --------------------------------------------------------------------------------------------------------------------------------------------
   const bake = function(o,k,v)
   {
      if(!o||!o.hasOwnProperty){return}; if(v==VOID){v=o[k]};
      let c={enumerable:false,configurable:false,writable:false,value:v};
      let r=true; try{Object.defineProperty(o,k,c);}catch(e){r=false};
      return r;
   };
// --------------------------------------------------------------------------------------------------------------------------------------------



// tool :: dubbed : define/change the name of a function
// --------------------------------------------------------------------------------------------------------------------------------------------
   const dubbed = function(n,f)
   {
      if(((typeof f)!='function')||((typeof n)!='string')||(n.trim().length<1)){return}; // validate
      f=f.toString(); f=f.slice(f.indexOf('(')); let r=(new Function("a",`return {[a]:function${f}}[a];`))(n);
      return r;
   };
// --------------------------------------------------------------------------------------------------------------------------------------------


// func :: isConstructor
// --------------------------------------------------------------------------------------------------------------------------------------------
   function isConstructor(f)
   {
      try{new f();}catch(e){if(e.message.indexOf('not a constructor')>=0){return false;}};
      return true;
   }
// --------------------------------------------------------------------------------------------------------------------------------------------



// func :: jack : intercept class-constructors or methods
// --------------------------------------------------------------------------------------------------------------------------------------------
   const jack = function(k,v,x)
   {
      if(((typeof k)!='string')||!k.trim()){return}; // invalid reference
      if(!!v&&((typeof v)!='function')){return}; // invalid callback func
      if(!v){return this[k]}; // return existing definition, or undefined
      if(k in this){this[k].list[(this[k].list.length)]=v; return}; //add
      if(!x||((typeof x)!='object')){x=VOID}; //  validate once as object
      let h,n,c,f; h=k.split('.'); n=h.pop(); h=h.join('.'); //short vars
      this[k]={func:bore(MAIN,k),list:[v],evnt:x}; // callback definition
      h=(h?bore(MAIN,h):MAIN); c=isConstructor(this[k].func); //obj & con
      this[k].cons=c; bore(MAIN,k,null); //set cons & delete the original

      f=function()
      {
         let n,r,j,a,z,q; j='_fake_'; r=stak(0,j); r=(r||'').split(' ')[0];
         if(r.startsWith(j)||(r.indexOf(`.${j}`)>0)){n=(r.split(j).pop())};
         if(!n&&(r=='new')&&!!this.constructor){n=this.constructor.name;};
         if(!n){console.error(`can't jack "${r}"`);return}; r=jack(n);
         a=([].slice.call(arguments)); for(let p in r.list)
         {if(!r.list.hasOwnProperty(p)){continue}; let i=dubbed(j,r.list[p]);
         q=i.apply(this,a); if(q!=VOID){break};}; if(!Array.isArray(q)){q=[q]};
         try{if(!r.cons){z=r.func.apply(this,q)}else
         {z=(new (Function.prototype.bind.apply(r.func,[null].concat(a))));}}
         catch(e){if(!!r.evnt&&!!r.evnt.error){r.evnt.error(e)}
         else{console.error(e)};return}; if(!!r.evnt&&!!z.addEventListener)
         {for(let en in r.evnt){if(r.evnt.hasOwnProperty(en))
         {z.addEventListener(en,r.evnt[en],false)}}}; return z;
      };

      if(!c){f=dubbed(`_fake_${k}`,f)}; bake(h,n,f);
      try{h[n].prototype=Object.create(this[k].func.prototype)}catch(e){};
   }.bind({});


   const hijack = function(l,f)
   {
      if(isList(l)){l.forEach((i)=>{jack(i,f)})};
      if(isKnob(l)){l.each((v,k)=>{jack(k,v)})};
   };
// --------------------------------------------------------------------------------------------------------------------------------------------



// tool :: time : returns seconds
// --------------------------------------------------------------------------------------------------------------------------------------------
   extend(MAIN)
   ({
      time:function(s)
      {
         let r=Math.round((Date.now()/1000));
         if (!isText(s)){ return r };

         s = s.trim().toLowerCase().split("  ").join(" ");

         if (s.startsWith("a ")){ s = ("1 "+s.slice(2)) };
         if (s.endsWith(" ago")){ s = ("-"+s.slice(0,-4)); };
         if (s.endsWith("s")){ s = s.slice(0,-1); };

         let p = s.split(" ");
         let n = (p[0] * 1);
         let u = p[1];

         if (!this[u]){ fail("undefined unit: "+u); dump(s); return };
         return (r + (this[u] * n));
      }
      .bind
      ({
          moment: 1,

          sc: 1,
          sec: 1,
          second: 1,

          mn:     60,
          min:    60,
          minute: 60,

          hr:     3600,
          hor:    3600,
          hour:   3600,

          day:    86400,
          week:   604800,
          mon:    2592000,
          month:  2592000,
          year:   31536000,
      }),


      round:function(n,d, r)
      {
         if(!isNumr(n)){return}; if(isInum(n)){return n}; if(!d||!isInum(d)){return Math.round(n)}; r=n.toFixed(d); r=rtrim(rtrim(r,'0'),'.');
         r=(r*1); return r;
      },
   });
// --------------------------------------------------------------------------------------------------------------------------------------------



// tool :: tick : waiting
// --------------------------------------------------------------------------------------------------------------------------------------------
   extend(MAIN)
   ({
       tick:
       {
          after:function(ws,cf){let rt = setTimeout(cf,ws); return rt},
          every:function(ws,cf){let rt = setInterval(cf,ws); return rt},
          while:function(w,c,i){let rt = setInterval((r)=>{r=w(); if(r===true){return}; clearInterval(rt); c(r)},(i||10)); return rt;},
          until:function(w,c,l, t,s,r,n)
          {
             s=time(); t=setInterval(()=>
             {
                r=w(); if(r){clearInterval(t);return}; c();
                if(!l){return}; n=time(); if((n-s)>l){clearInterval(t)};
             },10);
             return t;
          },
       },


       wait:
       {
          until:function(w,c,l, t,s,r,n)
          {
             s=time(); t=setInterval(()=>
             {
                r=w(); if(!isVoid(r)&&(r!==FALS)){clearInterval(t);c(r);return};
                if(!l){return}; n=time(); if((n-s)>l){clearInterval(t)};
             },10);
             return t;
          },

          while:function(w,c,i)
          {
              let rt = setInterval((r)=>{r=w(); if(r===true){return}; clearInterval(rt); c(r)},(i||10)); return rt;
          },
       }
   });
// --------------------------------------------------------------------------------------------------------------------------------------------



// func :: (misc) : tools
// --------------------------------------------------------------------------------------------------------------------------------------------
   extend(MAIN)
   ({
      escapeHtml:function(text)
      {
         if(!isText(text)){return text};
         var map = // object
         {
            '&': '&amp;',
            '<': '&lt;',
            '>': '&gt;',
            '"': '&quot;',
            "'": '&#039;'
         };

         return text.replace(/[&<>"']/g, function(m){return map[m];});
      },
   });
// --------------------------------------------------------------------------------------------------------------------------------------------



// func :: Each : loop almost anything
// --------------------------------------------------------------------------------------------------------------------------------------------
   const each = function(d,f)
   {
      var t=((typeof d)).substring(0,3);  if(t=='num'){d=listOf(d); t='arr'}else if(isList(d)){t='arr'};

      for (var k in d)
      {
         if(((k+'').length<1)||!d.hasOwnProperty(k)){continue}; if((t=='arr')&&!isNaN(k)){k=(k*1)};
         var z = f.apply(d,[d[k],k]);  if((z!==VOID)&&(z!==NEXT)&&(z!==SKIP)){break};
      };
   };
   extend(Number.prototype,String.prototype,Array.prototype,Object.prototype)({each:function(f){return each(this,f);}});
// --------------------------------------------------------------------------------------------------------------------------------------------



// tool :: fuse : concat Object
// --------------------------------------------------------------------------------------------------------------------------------------------
   extend(Object.prototype)
   ({
      fuse:function(a)
      {
         let r=dupe(this); if(!isKnob(a)&&!isList(a)){return r}; a.each((v,k)=>{r[k]=v}); return r;
      },

      unify:function(d, r)
      {
          if(!isText(d)){return}; r=[]; this.each((v,k)=>{radd(r,(k+d+v))}); return r;
      },
   });
// --------------------------------------------------------------------------------------------------------------------------------------------



// func :: expect : creates new event emitter .. o is (optional) properties object
// --------------------------------------------------------------------------------------------------------------------------------------------
   const expect = trap
   ({
      get:function(o,k)
      {
         return function(v, r)
         {
            r=FALS; k=k.split(' '); k.forEach((i)=>{let f=constant('is'+proprCase(i)); if(f&&f(v)){r=TRUE}});
            if(!r){k=k.join(', or '); fail('type :: expecting '+k);};
         };
      },
      apply:function(o,x,a, r)
      {
         // stak(KEEP);
         a=a[0]; if(!isKnob(a)){fail('calling `expect` directly requires an object');return}; r=true;
         a.each((v,k)=>{let f=constant('is'+proprCase(k)); if(f&&!f(v)){fail('expecting '+k); r=false; return STOP}});
         return r;
      },
   });
// --------------------------------------------------------------------------------------------------------------------------------------------



// tool :: (Encode/Decode)
// --------------------------------------------------------------------------------------------------------------------------------------------
   extend(MAIN)
   ({
      encode:
      {
         BLOB:function(arg1)
         {
            if(isList(arg1)||isText(arg1))
            {
                var resl = (new Blob([arg1],{type:(type||'text/plain')}));
                return resl;
            };

            if(isKnob(arg1)&&(isText(arg1.mime)||isText(arg1.type))&&!!arg1.data)
            {
                let l,s,a,r; s=arg1.data.length; l=(new Array(s));
                for(let i=0; i<s; i++){l[i]=arg1.data.charCodeAt(i)};
                a=(new Uint8Array(l)); r=(new Blob([a],{type:trim(arg1.mime)}));
                return r;
            };
         },

         JSON:function(data)
         {
            return JSON.stringify(data);
         },

         jso:function(data)
         {
            return JSON.stringify(data);
         },

         URL:function(o,x)
         {
            var r,p,k,v; r=[]; for (p in o)
            {
               if (!o.hasOwnProperty(p)){continue}; k=(x?(x+"["+p+"]"):p); v=o[p];
               r.push(((v!==null)&&((typeof v)==="object"))?encode.URL(v,k):(encodeURIComponent(k)+"="+encodeURIComponent(v)));
            }
            return r.join("&");
         },

         b64:function(s){return btoa(s);},
      },


      decode:
      {
         BLOB:function(d,f)
         {
             console.log(d);
            if((d instanceof Blob)||(!!d&&isPath(`/${d.type}`)&&isInum(d.size)&&isInum(d.lastModified)))
            {
                var p=(new FileReader()); p.onloadend=function(){f(p.result);};
                p.readAsDataURL(d); return;
            };

            if(isKnob(d)&&(isText(d.mime)||isText(d.type)))
            {
                let r=encode.BLOB(d);
                if(!r){fail("Type :: invalid blob(ish) object"); return};
                decode.BLOB(r,f); return;
            };

            console.error(d);
            fail("Args :: invalid 1st parameter");
         },

         JSON:function(data,nofail, r)
         {
            r=VOID; if(nofail){try{r=JSON.parse(data);}catch(e){r=VOID}; return r;};
            return JSON.parse(data);
         },

         jso:function(d,f)
         {
            return this.JSON(d,f);
         },

         b64:function(s){return atob(s);},
      },
   });
// --------------------------------------------------------------------------------------------------------------------------------------------



// func :: (time) : tools
// --------------------------------------------------------------------------------------------------------------------------------------------
   extend(MAIN)
   ({
      timeDiff:function(f,n, d,r,q,x)
      {
         if(isText(f)){f*=1}; if(isText(n)){n*=1}; if(!isNumr(f)||(span(f)<10)){fail('invalid timestamp');return}; f=(f.toFixed(3)*1);
         if(n){if(!isNumr(n)||(span(f)<10)){fail('invalid timestamp');return}; n=(n.toFixed(3)*1);}else{n=(Date.now()/1000)};
         d=((f<n)?(n-f):(f-n)); r={yrs:0,mth:0,wks:0,day:0,hrs:0,min:0,sec:0,ms:0}; if(d<1){r.ms=(d%1);return r};
         q={yrs:31557600,mth:2629800,wks:604800,day:86400,hrs:3600,min:60,sec:1};
         q.each((v,k)=>{x=Math.floor(d/v); if(x){r[k]=x; d-=(v*x);}}); r.ms=(d%1); r.ms=(r.ms.toFixed(3)*1);
         return r;
      },

      timePast:function(f,n, d,l,r)
      {
         d=timeDiff(f,n); l={yrs:'years',mth:'months',wks:'weeks',day:'days',hrs:'hours',min:'minutes',sec:'seconds'}; r=VOID;
         d.each((v,k)=>{if(v){r=(v+' '+((v>1)?l[k]:rtrim(l[k],'s'))+' ago'); return STOP}}); if(!r){r='1 second ago';};
         return r;
      },

      timeText:function(f,o, d,r)
      {
         if(isText(f)){f*=1}; if(!isNumr(f)||(span(f)<10)){fail('invalid timestamp');return};
         if(span(f)<13){f=(f*1000)}; if(!o){o='toGMTString'}; d=(new Date(f)); r=d[o]();
         return r;
      },
   });
// --------------------------------------------------------------------------------------------------------------------------------------------



// func :: (money) : tools
// --------------------------------------------------------------------------------------------------------------------------------------------
   extend(MAIN)
   ({
      currency:function(v, r,p)
      {
         if(!isNumr(v)){return}; r=round(v,2); r=(r+""); if(!isin(r,".")){r+="."};
         p=r.split("."); if(p[1].length<1){p[1]="00"}else if(p[1].length<2){p[1]+="0"};
         r=p.join("."); return r;
      },
   });
// --------------------------------------------------------------------------------------------------------------------------------------------



// func :: (money) : tools
// --------------------------------------------------------------------------------------------------------------------------------------------
   extend(MAIN)
   ({
      deconf:function(a)
      {
          return decode.jso(decode.b64(a));
      },
   });
// --------------------------------------------------------------------------------------------------------------------------------------------
