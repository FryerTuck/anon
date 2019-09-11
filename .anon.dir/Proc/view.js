
// mode :: strict : prevents bugs
// --------------------------------
   "use strict";
// --------------------------------





// slog :: ignore : stack-logs .. for cleaner dbug
// --------------------------------------------------------------------------------------------------------------------------------------------
   // cStack.ignore
   // ([
   //    {func:"XMLHttpRequest.<anonymous>",path:"/c0r3/lib/core/view.js"},
   //    {func:"XMLHttpRequest.open",path:"/c0r3/htm/boot.htm"},
   //    {func:"Object.Render",path:"/c0r3/lib/core/view.js"},
   //    {func:"anonymous",path:"/c0r3/lib/core/view.js"},
   //    {func:"p",path:"/Proc/dcor/mrkd.js"},
   //    {func:"m",path:"/Proc/dcor/mrkd.js"},
   //    {func:"EventTarget.ondone",path:"/c0r3/lib/core/view.js"},
   // ]);
// --------------------------------------------------------------------------------------------------------------------------------------------





// tool :: (CRUD) : Main
// --------------------------------------------------------------------------------------------------------------------------------------------
   Extend(Main)
   ({
      nodeOf:function(n){if((n instanceof Element)){return (n.nodeName.toLowerCase())}},

      Create:function(d)
      {
         if(d==VOID){return}; var temp;
         if(isText(d)&&(wrapOf(d)=='<>'))
         {
            let h,r,l,s; h=document.createElement('div'); h.innerHTML=d; l=list(h.childNodes); r=[];
            l.forEach((n)=>{if((n.nodeName=='#text')&&(n.text.trim().length<1)){return};r[r.length]=n});
            s=r.length; return ((s<1)?VOID:((s<2)?r[0]:r));
         };
         expect(d,[TRON,WORDTEXT]); if(isText(d)){return document.createElement(d)}; var t,x,n,l,c; t=keys(d)[0]; x=d[t]; delete d[t];
         n=document.createElement(t); if(isText(x)&&((x[0]=='#')||(x[0]=='.'))){l=x.split(' ').forEach((i)=>
         {
            i=i.trim(); if(i.length<2){return}; c=i[0]; i=i.substr(1); c=((c=='#')?'id':((c=='.')?'class':null)); if(!c){return};
            if(c=='class'){if(!d.class){d.class=''}; d.class+=(' '+i); return}; d.id=i; d.name=i;
         });if(d.class){d.class=d.class.trim()}}else if(d.contents===VOID){d.contents=x};

         if(t=='icon')
         {
            if(!d.face){d.face=d.contents; delete d.contents};
            if(d.size){if(isNumr(d.size)){n.style.lineHeight=((d.size/3)+'em'); d.size=(d.size+'em')};}else{d.size='inherit'};
            if(!d.class){d.class=''}; d.class=('icon-'+d.face+' '+d.class).trim(); n.style.fontSize=d.size;
            delete d.face; delete d.size;
         }
         else if(t=='img')
         {
            if(isText(d.contents)&&!d.src){d.src=d.contents; delete d.contents};
         }
         else if(t=='option')
         {
            if(d.value==VOID){d.value=d.contents;};
         }
         else if((t=='tabs')&&(d.class!='ctrl')&&(d.class!='view'))
         {
            // if(!d.viewsize){d.viewsize=''}; let vp,vw,vh; vp=d.viewsize.split(' '); vw=(vp[0]||'100%'); vh=(vp[1]||'3rem');
            temp=d.contents; delete d.contents; let tctr=[]; let tvew=[]; let actv=(d.selected||0);
            if(!d.id){d.id=('t'+unique());}; temp.forEach((ti,tx)=>
            {
               let tn,tc,tr,tk,te,th; tk=keys(ti); tn=(ti.tab||tk[0]); tc=(ti[tn]||ti.contents); tr=('#'+d.id+md5(tn));
               th={tab:'.head',name:tn,indx:tx,href:tr,contents:tn,onclick:function(){this.parentNode.view(this.name)}};
               tk.forEach((an)=>{if(an.substring(0,2)=='on'){th[an]=ti[an]}}); tctr.push(th);
               tvew.push({tab:(tr+' .body'),style:('display:'+(((tx==actv)||(tn==actv))?'block':'none')),contents:tc}); tc=VOID; tr=VOID;
            });

            let ctrl={tabs:'.ctrl',contents:tctr,view:function(tn)
            {
               let cn,cs,cr,to,al,md,mv,mw,xi; al=cStyle(this,'text-align'); mw=('margin-'+al);
               if(isNumr(tn)){tn=this.childNodes[tn].name}; xi=((al=='left')?0:(this.childNodes.length-1)); this.childNodes.forEach((co,cx)=>
               {
                  cn=co.name; cs=(cn==tn); cr=co.href; to=Select(cr); to.style.display=(cs?'block':'none'); co.style.zIndex=(cs?2:0);
                  if(cs){co.enclan('actv'); co.Signal('show');}else{co.declan('actv'); co.Signal('hide');};
                  if(cx==xi){co.style[mw]=0; return}; if(mv==VOID){mv=(cStyle(co,mw)||-1)}; co.style[mw]=mv;
               });
            }};
            d.contents=[ctrl, {tabs:'.view',contents:tvew,onready:function(){this.previousSibling.view(this.parentNode.selected)}}];
            tctr=VOID; tvew=VOID;
         };

         if(!!d.required&&!!d.pattern&&!!d.pattern.test)
         {
            n.pass=false; n.fail=true;
            n.addEventListener('blur',function()
            {
               let x,s; x=this.pattern; if(isText(x)){x=(new RegExp(unwrap(x)));}; let f=(!x.test(this.value+'')); this.fail=f; this.pass=(!f);
               s=(f?'fail':'pass'); let o=(isText(this.target)?this.select(this.target):this); o.style.outline=(f?'#ff0000 solid 1px':'none');
               this.Signal(s);
            });
            n.addEventListener('focus',function(){let o=(isText(this.target)?this.select(this.target):this); o.style.outline='auto';});
         };

         if(isFunc(d.onfeed))
         {
            n.onFeed(d.onfeed);
         };

         if(isTron(d.style))
         {
            d.style.Each((sv,sk)=>
            {
               n.style[sk]=sv; if((sk!='transform')){return;}; if(!isText(sv)){return;}; if(!sv.hasAny('isoSkewX','isoSkewY')){return;};
               let pt=sv.stub('('); sk=pt[0]; sv=(pt[2].Trim(')').swap('deg','')*1); if(isNaN(sv)){sv=45}; sv=(sv%90);
               if(!n.postProc){n.postProc={}}; if(!n.postProc.transform){n.postProc.transform={}}; n.postProc.transform[sk]=sv;
               n.onready=function()
               {
                  let pt,sx,sy,iw,ih,ml,mt,mr,ob,nb,wd,hd,xd,yd; pt=this.postProc.transform; sx=pt.isoSkewX; sy=pt.isoSkewY;
                  mr=(Math.atan(sx*(Math.PI/180))); ob=this.getBoundingClientRect(); iw=ob.width; ih=ob.height;
                  this.style.transform=('perspective('+((iw/2)-(ih/2))+'px) rotateX('+sx+'deg)'); nb=this.getBoundingClientRect();
                  if(nb.x<ob.x){this.style.marginLeft=((ob.x-nb.x)+'px'); this.style.marginRight=((ob.x-nb.x)+'px');}else if(nb.x>ob.x){this.style.marginLeft=(0-(nb.x-ob.x)+'px');};
                  if(nb.y<ob.y){this.style.marginTop=((ob.y-nb.y)+'px');}else if(nb.y>ob.y){this.style.marginTop=(0-(nb.y-ob.y)+'px');};
               };
            });
            delete d.style;
         };

         if(isText(d.class)&&d.class.hasAny('moveHorz','moveVert','moveBoth')&&isText(d.target))
         {
            d.onmousedown=function(e)
            {
               let cn,mx,my,te; cn=this.className; if(cn.hasAny('moveBoth','moveHorz')){mx=1};  if(cn.hasAny('moveBoth','moveVert')){my=1};
               if((!mx&&!my)||!isText(this.target)){return}; te=this.target; te=((te[0]=='^')?this.select(te):Select(te));
               if(te&&!isList(te)){te=[te]}; if(!te||te.length<1){fail('target selection `'+this.target+'` yielded nothing');return};
               te.Each((el)=>{el.m3ta={lw:cStyle(el,'width'),lh:cStyle(el,'height')}}); this.m3ta={}; this.m3ta.move=function(e)
               {
                  var mx,my,lx,ly,cx,cy,lw,lh,pd; mx=this.mx; my=this.my; lx=this.lx; ly=this.ly; cx=e.clientX; cy=e.clientY;
                  this.te.forEach((tn)=>
                  {
                     if(mx){lw=tn.m3ta.lw; pd=((cx<lx)?(0-(lx-cx)):(cx-lx)); tn.style.width=((lw+pd)+'px');};
                     if(my){lh=tn.m3ta.lh; pd=((cy<ly)?(ly-cy):(0-(cy-ly))); tn.style.height=((lh+pd)+'px');};
                  });
               }.bind({te:te,mx:mx,my:my,lx:e.clientX,ly:e.clientY}); this.m3ta.done=function()
               {
                  document.removeEventListener('mousemove',this.trgt.m3ta.move,true); document.body.style.cursor='default';
                  document.removeEventListener('mouseup',this.trgt.m3ta.done,true); delete this.trgt.m3ta
               }.bind({trgt:this}); let crsr=(cStyle(this,'cursor')||'default'); document.body.style.cursor=crsr;
               document.addEventListener('mousemove',this.m3ta.move,true); document.addEventListener('mouseup',this.m3ta.done,true);
            };
         };

         var o=['ready'];
         Each(d,(v,k)=>{if(k=='contents'){if(span(v)>0){n.Insert(v)}}else
         {
            if(isBool(v)||isNumr(v)||isText(v)){n.setAttribute(k,v)}; if(k=='class'){k='className'}; if((k.substr(0,2)=='on')&&isFunc(v))
            {k=k.substr(2); k=k.Trim('_').split('_'); let i=(o.hasAny(k)?ONCE:EVRY); n.Listen(k,i,v); return}; n[k]=v;
         }});
         return n;
      },


      Select:function(d)
      {
         var h,f,r,a,n,s,l,c,x,p; h=this; if(isText(d)&&(d[0]=='^'))
         {d=d.substr(1); x=d.stub(' '); if(x){d=x[2];x=x[0];p=1}else{x=d;d=VOID}; x=((!x||isNaN(x))?1:(x*1)); r=h.Parent(x); if(!d){return r}; h=r;};
         if(['<<','>>','<','>'].hasAny(d)){if(!h||!h.parentNode){return}; if(d=='<'){return h.previousElementSibling}; if(d=='>')
         {return h.nextElementSibling}; h=h.parentNode; if(d=='<<'){return h.firstElementChild}; return h.lastElementChild};
         if(!h){h=document}; a=list(arguments); if(p){a[0]=d}; s=a.length; f='querySelectorAll'; r=[]; if((s==1)&&((a[0]=='*')||((typeof a[0])=='number')))
         {
            a=a[0]; l=list(h.childNodes); l.forEach((q)=>{if((q.nodeName=='#text')&&(q.textContent.trim().length<1)){return};r[r.length]=q;});
            if(a=='*'){return r}; if(a<0){a=r.length+a}; return r[a];
         }
         a.forEach((v)=>
         {
            if(!isText(v,1)){return}; c=v[0]; n=h[f](':scope '+v); if((n.length<1)&&(c=='#')&&(v.indexOf(' ')<1))
            {n=h[f](':scope [name='+v.substr(1)+']')}; if(n.length<1){return}; ([].slice.call(n)).forEach((i)=>{r.push(i)});
         });
         if((c==='#')&&(s<2)&&(!d.hasAny(' '))){r=((r.length>0)?r[0]:VOID)}; return r;
      },


      Import:function(v,p)
      {
         if(!Export.jobs){Export.jobs=[]}; let j=Export.jobs.length;
         let n=Create('script'); n.purl=p; n.innerHTML=v; slog(PUSH); fail.maybe=p;
         document.head.appendChild(n);
         let r=Export.jobs[j]; return r;
      },


      Export:function(v)
      {
         Export.jobs[Export.jobs.length]=v;
      },


      Delete:function()
      {
         var l; l=list(arguments); if(isList(l[0])){l=l[0]}; l.Each((a)=>
         {if(isText(a)){a=Select(a)}; if(!isList(a)){a=[a]}; a.Each((n)=>
         {if(n&&n.parentNode){n.Delete()}})});
      },


      Render:function Render(v,h,o,f, s)
      {
         s=this; if(!h){h=document.body}; expect(h,NODE); if(isNode(v)){h.appendChild(v); if(isFunc(o)){o()}; return;};
         if(isText(v)&&isPath(v.rtrim('?'))){v=v.rtrim('?')}; if(isText(v)&&!isPath(v)&&isText(o)&&!!s[o]){s[o]({page:false},v,h,f); return;};
         if(!isPath(v)||(isPath(v)&&(o===XACT))){v=JSON.stringify(v); if(wrapOf(v)=='""'){v=unwrap(v)}; v=document.createTextNode(v);};

         expect(v,PATH); let opt={target:v};
         let bin=['jpg','jpeg','png','svg','gif','bmp','mp4','mp3','ogg','ogv','pdf','zip','opus'];
         if(v.hasAny('.')){let x=v.split('.').pop(); if(bin.hasAny(x)){opt.expect='blob';}};

         purl(opt,function()
         {
            if(window.HALT){return};
            let e=this.echo; let t=e.head.renderType; if(!t){t='txt'};
            if(t=='html'){t='htm'};
            if(t.hasAny('jpg','jpeg','png','svg','gif','bmp')){t='img'};
            if(!!s[t]){s[t](e.head,e.body,h,o); return;}; fail('no renderer defined for type: '+t);
         });
      }
      .bind
      ({
         txt:function(head,body,trgt,cbfn)
         {
            var n=document.createElement('pre'); n.innerHTML=body; trgt.appendChild(n); if(isFunc(cbfn)){cbfn();};
         },


         js:function(head,body,trgt,cbfn)
         {
            let r=Import(body,head.path); if(r){trgt.Insert(r)}; if(isFunc(cbfn)){cbfn();};
         },


         md:function(head,body,trgt,cbfn)
         {
            var b,m,t,l,p1,p2; b=body.trim(); m={}; p1=b.indexOf('<!--'); p2=b.indexOf('-->');
            l=['/Proc/dcor/mrkd.js','/Proc/dcor/prsm.js','/Proc/dcor/mkdn.css','/Proc/dcor/prsm.css'];
            t=(b+'\n').stub('\n'); if(t&&t[0].locate('# ')){t=t[0].stub('# ')[2].trim(); window.top.document.title=t;};
            requires(l,function()
            {
               marked(b,{gfm:true,breaks:true},function(e,r)
               {
                  if(e){throw (e); return}; var n=document.createElement('div'); n.setAttribute('class','markdown-view');
                  r=('<div class="markdown-body">'+r+'</div>'); if(head.page!==false){r=('<div class="markdown-page">'+r+'</div>');};
                  n.innerHTML=r; trgt.appendChild(n); var l=n.select('[class^="language-"], [class*=" language-"]').forEach((i)=>
                  {var c=i.className; if(!c.locate('line-numbers')){i.className = (c+' line-numbers');}; Prism.highlightAllUnder(n);});
                  if(isFunc(cbfn)){cbfn();};
               });
            });
         },


         htm:function(head,body,trgt,cbfn)
         {
            let b,e,l;
            b='<!--'; e='-->'; l=body.expose(b,e); if(l){l.forEach((i)=>{let f=(b+i+e); body=body.split(f).join('');})};
            b='<script'; e='</script>'; l=body.expose(b,e); if(l){l.forEach((i)=>
            {
               let f=(b+i+e); body=body.split(f).join(''); f=dval(f)[0].select('script')[0]; i=Create('script');
               if(!!f.src){i.src=f.src}else{i.innerHTML=f.innerHTML}; document.head.appendChild(i);
            })};
            l=undefined; l=Create('div'); l.innerHTML=body; l=list(l.childNodes); l.forEach((n)=>{trgt.appendChild(n)});
            if(isFunc(cbfn)){cbfn();};
         },


         img:function(head,body,trgt,cbfn)
         {
            decode.BLOB(body,function(r)
            {
               trgt.Insert({img:r, onload:function(){if(isFunc(cbfn)){cbfn();};}});
            });
         },
      }),
   });
// --------------------------------------------------------------------------------------------------------------------------------------------




// tool :: (CRUD) : proto
// --------------------------------------------------------------------------------------------------------------------------------------------
   Extend(Element.prototype)
   ({
      Select:function()
      {
         return Select.apply(this,list(arguments));
      },


      Parent:function(x)
      {
         var p,c,w,r,t,y,id,cn,tn,an,av,pt; if((typeof x)=='number'){p=this; while((x>0)&&p){x--; p=p.parentNode}; return p};
         if(((typeof x)!='string')||(x.length<1)){return;}; c=x[0]; w=wrapOf(x); r=VOID; p=this.parentNode;
         if(c=='#'){id=x.substr(1)}else if(c=='.'){cn=x.substr(1)}else if(x.hasAll('[',']'))
         {
            if(c!='['){y=x.stub('['); tn=y[0]; x=('['+y[2]);}; y=unwrap(x); if(isWord(y)){an=y}
            else if(y.hasAny('=')){y=y.split('='); an=y[0]; av=y[1]; if(wrapOf(av)=='""'){av=unwrap(av)}};
            if(an){c=an.frag(-1,1); if(c.hasAny('~','|','^','$','*')){an=an.frag(0,-2)}}; if(tn){tn=tn.toLowerCase()};
         }else{tn=x};

         while(!r&&p)
         {
            if(!p||!p.nodeName){break}; pt=p.nodeName.toLowerCase();
            if(id&&(p.id==id)){r=p;break}else if(cn&&p.className.hasAny(cn)){r=p;break}
            else if(tn&&!an&&(pt==tn)){r=p;break}else if(an)
            {
               if(tn&&(pt!=tn)){p=p.parentNode;continue}; y=(p.hasAttribute(an)||p.hasOwnProperty(an)); if(!y){p=p.parentNode;continue};
               if(av){y=(p.getAttribute(an)||p[an]); if(y!=av){p=p.parentNode;continue}}; r=p; break;
            };
            p=p.parentNode;
         };
         return r;
      },


      Insert:function(v,p)
      {
         var s,b,h,n; s=this; if(!v||!v.forEach){v=[v]}; v.forEach((n)=>
         {
            if(n==VOID){return};if(isText(n)||!(n instanceof Element)){if(isText(n)&&(wrapOf(n)!='<>')){n=('<span>'+n+'</span>');}; n=Create(n)};
            if((p===VOID)||(p===-1)){s.appendChild(n);return}; if((typeof p)=='number'){b=s.select(p); s.insertBefore(n,b);return};
            if(!(['<<','>>','<','>']).hasAny(p)){return}; h=s.parentNode; if(p=='>>'){h.appendChild(n);return};
            if(p=='<'){h.insertBefore(n,s);return}; b=s.select(p); h.insertBefore(n,b);
         });
         return s;
      },


      Import:function(d,f)
      {
         Import(d,this,f);
      },


      Delete:function()
      {
         var s,l; s=this; l=list(arguments); if(isList(l[0])){l=l[0]}; if(span(l)<1){s.Signal('delete'); s.parentNode.removeChild(s)};
         l.Each((a)=>{if(isText(a)){a=s.select(a)}; if(!isList(a)){a=[a]}; a.Each((n)=>
         {if(n&&n.parentNode){n.Signal('delete'); n.parentNode.removeChild(n)}})});
      },


      onFeed:function(h)
      {
         this.ondragover=function(e){e.preventDefault();e.stopPropagation();}; this.handle=h; this.ondrop=function(e,s)
         {
            e.preventDefault(); e.stopPropagation(); var d,l,z; d=e.dataTransfer; l=d.files; s=this; z=([...l]);
            if(z.length<1){let r=d.getData('text/plain'); if(isPath(r)){durl(r,function(t){s.handle(t);});return}; s.handle(r);return;};
            z.forEach(function(f){decode.BLOB(f,function(r){s.handle(r,f.name);})});
         };
      },


      enclan:function()
      {
         let l,a; l=(((this.className||'').frag(' '))||[]); a=list(arguments); this.className=l.concat(a).join(' ');
      },


      declan:function()
      {
         var l,a,x; l=(this.className||'').frag(' '); a=list(arguments);
         a.Each((i)=>{x=l.indexOf(i); if(x>-1){l.splice(x,1)}}); this.className=l.join(' ');
      },


      render:function(s,h)
      {
         if(h===VOID){this.style.display=s;return}; let d=cStyle(this,'display');
         let r=((d==s)?h:s); this.style.display=r; return ((r=='none')?false:true);
      },


      notify:function(mesg,tone,arro,posi)
      {
         let t,a; t=[AUTO,GOOD,INFO,NEED,WARN,FAIL]; a=[TL,TM,TR,RT,RM,RB,BR,BM,BL,LB,LM,LT]; if(!isText(mesg)){mesg=''};
         if(a.hasAny(tone)){arro=tone;tone=VOID;};if(!isText(tone)){tone=AUTO};tone=unwrap(tone).toProperCase();if(!a.hasAny(arro)){arro=TL};
         let note={notedeck:('.'+tone), contents:[{noteface:mesg.swap('\n','<br>')},{notearro:('.'+unwrap(arro)), contents:[{div:''}]}]};
         if(isList(posi)){note.style=('left:'+posi[0]+'px; top:'+posi[1]+'px;')}else if(isText(posi)){note.notedeck=posi};
         note=Create(note); this.Insert(note,'>'); setTimeout(()=>{this.Delete(note)},4000);
      },


      MoveTo:function(h)
      {
         if(isText(h)){h=Select(h)}; if(!isNode(h)){fail('expecting #text or node');};
         h.appendChild(this);
      },
   });
// --------------------------------------------------------------------------------------------------------------------------------------------




// tool :: Upload
// --------------------------------------------------------------------------------------------------------------------------------------------
   Extend(Main)
   ({
      Upload:
      {
         create:function(o)
         {
            expect(o,{parent:'htmltron|text',submit:FUNC}); if(isText(o.parent)){o.parent=Select(o.parent); expect(o.parent,HTMLTRON);};
            let n=Create('div'); n.className='dropZone';
            n.innerHTML='<table><tr><td>drop files here</td></tr><tr><td class="dropZoneInfo"></td></tr></table>';
            n.onchange=function(){this.submit=o.submit; this.submit()};
            n.ondragover=function(e){e.preventDefault(); e.stopPropagation();}; n.ondrop=function(e,s)
            {
               e.preventDefault(); e.stopPropagation(); var d,l; d=e.dataTransfer; l=d.files; s=this;
               ([...l]).forEach(function(f){decode.BLOB(f,function(r){s.submit('files',f.name,r);})});
            };
            o.parent.appendChild(n); n.onchange();
         },
      },
   });
// --------------------------------------------------------------------------------------------------------------------------------------------




// tool :: dropMenu
// --------------------------------------------------------------------------------------------------------------------------------------------
   Extend(Main)
   ({
      dropMenu:function(list,evnt,clan)
      {
         let n=Select('.dropMenu')[0]; if(n){n.parentNode.removeChild(n)};
         let node,posi,menu; node=(evnt.Target||evnt.currentTarget); posi=(evnt.coords||[evnt.clientX,evnt.clientY]);

         menu=Create('div'); menu.className=('dropMenu'+(clan?(' '+clan):''));
         menu.style.left=(posi[0]+'px'); menu.style.top=(posi[1]+'px'); list.forEach((i)=>
         {
            let item=Create('div'); item.className='dropMenuItem'; if(!isList(i)){i=[i]}; if(!i[0]||(i[0].length<3)){return};
            let text=i[0];if(text.substr(0,3)=='---'){item.className='panlHorzLine';item.innerHTML='<hdiv></hdiv>';menu.appendChild(item);return};
            let note=i[1]; let func=i[2]; item.innerHTML=text; if(isText(note)){item.title=note}else{func=note;};
            if(isFunc(func)){item.onmousedown=function(){this.func.apply(this.trgt,this.args)}.bind({trgt:node,func:func,args:[text]})};
            menu.appendChild(item);
         });

         document.body.Insert(menu);
         document.body.Listen('click',function(){let n=Select('.dropMenu')[0]; if(n){n.parentNode.removeChild(n)}});
      }
   });
// --------------------------------------------------------------------------------------------------------------------------------------------




// tool :: modal
// --------------------------------------------------------------------------------------------------------------------------------------------
   Extend(Main)
   ({
      modal:function(conf)
      {
         if(Select('#modalView')){return;};
         expect(conf,{name:'text', head:'text list tron', body:'text list tron', foot:'list tron'});
         Select('body')[0].Insert
         ([
            {view:'#modalView', contents:
            [
               {div:(conf.name+' .modalPanl'), contents:
               [
                  {div:'.modalHead', contents:conf.head},
                  {div:'.modalBody', contents:conf.body},
                  {div:'.modalFoot', contents:conf.foot},
               ]},
            ]},
         ]);
      }
   });
// --------------------------------------------------------------------------------------------------------------------------------------------




// func :: from
// --------------------------------------------------------------------------------------------------------------------------------------------
   Extend(Main)
   ({
      from:function(p)
      {
         if(!isPath(p)){fail('expecting :path:');}; return ({import:'', purl:p, on_ready:function()
         {Render(this.purl,this.parentNode); Delete(this);}});
      }
   });
// --------------------------------------------------------------------------------------------------------------------------------------------




// glob :: prop : CURSOR
// --------------------------------------------------------------------------------------------------------------------------------------------
   Extend(Main)
   ({
      Cursor:
      {
         posx:0, posy:0, refs:{},
         bind:function(r,x,y)
         {
            let f='expecting #id or node-with-id'; let e='reference'; if(isNode(r)){if(!r.id){fail(f,e); return}; r=('#'+r.id)};
            if(!isText(r)){fail(f,e)}; let n=Select(r); if(!isNode(n)){fail('expecting defined node with id '+r);};
            let b=n.getBoundingClientRect(); if(!isNumr(x)){x=0;}; if(!isNumr(y)){y=0;}; this.refs[r]={x:x,y:y};
         },
         drop:function(r)
         {
            let f='expecting text or node with id'; let e='reference';
            if(isText(r)){};
            if(isNode(r)){if(!r.id){fail(f,e); return}; r=('#'+r.id)};
            if(isText(r)){delete this.refs[r];}else{fail(f,e);};
         },
         move:function(x,y)
         {
            Cursor.posx=x; Cursor.posy=y; if(span(Cursor.refs)<1){return}; //console.log(x+' '+y);
            Cursor.refs.Each((p,n)=>
            {
               n=Select(n); n.style.left=(x+p.x+'px'); n.style.top=(y+p.y+'px');
               if(n.eventsrc){n.eventsrc.Signal('dragmove')}else{n.Signal('dragmove')};
            });
         },
      }
   });
// --------------------------------------------------------------------------------------------------------------------------------------------
   document.addEventListener("mousemove", function(e){Cursor.move(e.clientX,e.clientY);},false);
   document.addEventListener("dragover", function(e){Cursor.move(e.pageX,e.pageY);},false);
// --------------------------------------------------------------------------------------------------------------------------------------------





// shim :: TextAreaElement : insertAtCaret
// --------------------------------------------------------------------------------------------------------------------------------------------
   Extend(HTMLTextAreaElement.prototype)
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




// tool :: pathMenu
// --------------------------------------------------------------------------------------------------------------------------------------------
   // Extend(Main)
   // ({
   //    pathMenu:function(o)
   //    {
   //       if(!o||!o.target||!o.onload){fail('expecting purl config object with `onload` event callback');return};
   //       purl({});
   //       purl(o.target,function(){o.onload(this);});
   //    }.bind
   //    ({
   //       icon:
   //       {
   //          auto:'file',
   //          repo:'repo',
   //          fold:'file-directory',
   //          none:'file-empty',
   //          jpg:'file-media',
   //          png:'file-media',
   //          gif:'file-media',
   //          ico:'file-media',
   //       },
   //    })
   // });
// --------------------------------------------------------------------------------------------------------------------------------------------
