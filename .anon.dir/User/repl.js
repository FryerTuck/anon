extend(MAIN)
({
   repl:
   {
      ENV:
      {
         cmdlog:
         {
            indx:VOID,
            list:[],
            feed:function(x)
            {
                if(vals(this.list,-1)==x){return}; // duplicate ignored
                this.list.push(x); this.indx=span(this.list);
            },
            seek:function(n, t,z,x,v)
            {
               t=select('#AnonReplFeed'); z=span(this.list); x=this.indx; // vars
               if((n!=1)&&(n!=(-1))){n=0}; if(isVoid(x)){return}; // validate
               x+=n; if(x<0){x=0}else if(x>z){x=(z-1)}; this.indx=x;  // set index value
               v=this.list[x]; if(!v){v=''}; t.value=v; // show value at index
               tick.after(0,()=>{t.selectionStart=t.selectionEnd=(t.value.length+1)}); // cursor to end of line
            },
         },

         ignore:"ENV PWD mumble noprom reprom name vivify pacify",
         target:'exec',

         argsOf:function(s, r,b,q)
         {
            r=[]; if(!isText(s,1)){return r}; b=''; q=0; s=s.trim();
            if(s.length<1){return r};  if(s.length<2){return [s];};
            s.split('').forEach(function(c)
            {
               if(isin(['"',"'",'`'],c))
               {if(!q){q=c;b+=c;return}; b+=c; if(q!=c){return}; q=0; r.push(b); b=''; return}; // quoted
               if(q){b+=c;return}; if(c!=' '){b+=c;return}; if(b!=''){r.push(b);b=''};
            });
            if(span(b)>1){r.push(b);};
            return r;
         },

         denied:['ENV','PWD','mumble','exit','echo','exec','clear','help','noprom','reprom','name','vivify','pacify','passwd'],

         cdInfo:function(tp,xp, xl,tl,fl)
         {
            xp=swap(xp,'//','/'); tp=ltrim(tp,'./'); if(!isin(['/','.','$','~'],tp[0])){tp=(xp+'/'+tp);}; tp=swap(tp,'//','/');
            if(((xp=='/')&&((tp=='/')||tp.startsWith('..')))||(tp=='./')){return}; // irrelevant

            xl=xp.split('/'); if(xl[0]==''){xl[0]='/'}; tl=tp.split('/'); if(tl[0]==''){tl[0]='/'}; let dd=0;

            fl=[]; tl.forEach((v,k)=>
            {
               if(v.startsWith('..')){if(!xl[k]){fl.push(v)}else{xl.pop(); dd=1}; return};
               if(!fl[0]&&dd){fl=fl.concat(xl)}; if(xl[k]!=v){fl.push(v);}else{fl.push(xl[k]);};
            });

            rp=xl.join('/'); fp=fl.join('/'); rp=swap(rp,'//','/'); fp=swap(fp,['/./','///','//'],'/');
            if(rp==fp){return}; return {remain:rp,lookup:fp};
         },
      },


      PWD:'~',


      mumble:function(a)
      {
         if(!isText(a)){a=tval(a)};
         select('#AnonReplFlog').insert({div:'.replEchoMumb',innerHTML:a}); // darker text output
         let v=select('#AnonReplPanl'); v.scrollTop=v.scrollHeight;
      },


      noprom:function()
      {
         p=select('#AnonReplProm'); f=select('#AnonReplFeed');
         p.modify({innerHTML:''}); f.modify({value:''}); f.style.display='none';
      },


      reprom:function(wht)
      {
         p=select('#AnonReplProm'); f=select('#AnonReplFeed'); if(!wht){wht=(sesn('USER')+'&nbsp;'+repl.PWD)};
         p.modify({innerHTML:('['+wht+']')}); f.type='text'; f.modify({value:''});
         f.style.display='inline-block'; f.focus();
      },


      vivify:function(a)
      {
          tick.after(10,()=>
          {
              select("#AnonReplView").setStyle({height:200});
              let pnl=select('#AnonReplPanl'); pnl.scrollTop=pnl.scrollHeight;
          });
      },


      pacify:function(a)
      {
          tick.after(110,()=>
          {
              select("#AnonReplView").setStyle({height:(!focusObj.node.contains(select('#AnonReplFeed'))?40:200)});
              let pnl=select('#AnonReplPanl'); pnl.scrollTop=pnl.scrollHeight;
          });
      },


      echo:function()
      {
         let a=listOf(arguments); if((a.length>1)&&((a[1]!='>>')||!isPath(a[2]))){repl.mumble('invalid arguments');};
         if(a.length>1)
         {
            repl.path('gain',a[2],a[0],(r)=>{repl.mumble(r)});
         };

         a=a.join(' ');
         repl.ENV.target='exec'; let i=select('#AnonReplFeed'); i.type='text'; i.value=''; a=tval(a); if(a=='""'){a='';};
         let p=('['+sesn('USER')+'&nbsp;'+repl.PWD+']'); select('#AnonReplProm').modify({innerHTML:p}); if(a==''){return};
         select('#AnonReplFlog').insert({div:[{span:'.replEchoProm',innerHTML:p},{span:'.replEchoCmnd',innerHTML:a}]});
         let v=select('#AnonReplPanl'); v.scrollTop=v.scrollHeight; i.focus();
      },


      exec:function(x, t,l,p,f,a,o)
      {
         if(isText(x)){x=x.trim()}; if(!isText(x,1)){return}; // validate
         t=repl.ENV.target; if(t!='exec'){repl[t](x);return}; // another function is controlling the input
         repl.echo(x); // show what has been said and reset prompt
         repl.ENV.cmdlog.feed(x); // remember command used and reset pointer
         repl.ENV.crntCmnd=x; // last command
         p=stub(x,' '); if(!p){f=x;a=[]}else{f=p[0];a=p[2]}; // separate function name from arguments
         if(!repl[f]){repl.mumble(' .. huh?');return}; // not defined
         o=repl.ENV.denied; if((f!='help')&&isin(o,f)&&!userDoes('work,geek,lead')){repl.mumble(' .. huh?');return}; // denied
         if(!isFunc(repl[f])){repl.mumble(repl[f]);return}; // a value, not a function
         a=repl.ENV.argsOf(a); let h=a[0]; if(h&&((h=='-h')||(h=='--help')||(h=='help'))){a=[f]; f='help'};
         repl[f].apply(this,a); // call target function with prepared arguments
      },


      exit:function()
      {
         if (server.stream){ server.stream.close() };
         window.onbeforeunload=null;
         navigator.sendBeacon('/User/doLogout','1');

         tick.after(250,(h)=>
         {
            h=sesn('HASH'); (cookie.select('*')||{}).each((v,k)=>{if(test(k,/^[a-z0-9]{40}$/)&&(k!=h)){cookie.delete(k)}});
            cookie.delete(h); repl.mumble('bye'); tick.after(500,()=>{newGui({APIKEY:h});});
         });


      },


      clear:function(){select('#AnonReplFlog').innerHTML='';},


      help:function(a, k,o,l)
      {
         if(isWord(a)&&isFunc(repl[a]))
         {
            repl.clear(); purl(('/User/replHelp/'+a),(r)=>
            {
               r=('\n'+r.body+'\n\n'); repl.mumble(r); select('#AnonReplPanl').scrollTop=0;
               let h=r.split('\n').length; if(h<9){return}; h=((h+1)*16); let m=Math.ceil((rectOf(document.body).height/4)*3);
               if(h>m){h=m}; select('#AnonReplPanl').parentNode.style.height=(h+'px');
            });
            return;
         };

         k=keys(repl); o=repl.ENV.denied;
         l=[]; k.forEach((i)=>{ if(!isin(repl.ENV.ignore,i) && (!isin(o,i) || userDoes("work"))){ l.push(i) }});
         repl.mumble('You can use any of these commands:'); repl.mumble('  '+l.join(' '));
         repl.mumble('To learn how to use a specific command, use e.g: help login');
      },
   },
});



(deconf(`(~replLogs~)`).reverse()).forEach((i)=>{repl.ENV.cmdlog.feed(i)});



purl.hook("/User/runRepel/*",function( cc,lc)
{
    cc=repl.ENV.crntCmnd; lc=repl.ENV.lastCmnd;
    if(cc==lc){return}; repl.ENV.lastCmnd=cc;
    return {convey:{cmnd:cc}}
});



(~commands~)
