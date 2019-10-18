"use strict";


requires
([
   '/Draw/dcor/aard.css','Konva:/Proc/libs/konva/konva.min.js',
   'iro:/Proc/libs/iro/iro.min.js','iro.iroTransparencyPlugin:/Proc/libs/iro/iro-transparency-plugin.min.js'
],()=>
{
   (function()
   {
      let func = Konva.Group.prototype.getClientRect;
      let orig = {enumerable:false, configurable:false, writable:false, value:func};
      let altr = {enumerable:false, configurable:false, writable:false, value:function(t)
      {
         let attr = this.attrs;
         let resl = this.getOrigClientRect(t);
         if(attr.hasOwnProperty('clipWidth')){resl.width=attr.clipWidth};
         if(attr.hasOwnProperty('clipHeight')){resl.height=attr.clipHeight};
         return resl;
      }};
      Object.defineProperty(Konva.Group.prototype,'getOrigClientRect', orig);
      Object.defineProperty(Konva.Group.prototype,'getClientRect', altr);
   })();
});




select('#AnonAppsView').insert
([
   {panl:'#DrawPanlSlab', contents:
   [
      {grid:'.AnonPanlSlab', contents:
      [
         {row:
         [
            {col:'.treeMenuView', contents:
            [
               {grid:
               [
                  {row:[{col:'.slabMenuHead', contents:'draw'}]},
                  {row:[{col:'.panlHorzLine', contents:[{hdiv:''}]}]},
                  {row:[{col:'#DrawTreeView .slabMenuBody', contents:[{panl:'#DrawTreePanl', contents:
                  [
                     {treeview:'', source:'/User/treeMenu', uproot:true, draggable:true, feedable:true, listen:
                     {
                        'LeftClick':function()
                        {
                           if(isin(['fold','plug'],this.info.type)){return};
                           Anon.Draw.open(this.info.path);
                        },
                     }}
                  ]}]}]},
               ]}
            ]},
            {col:'.panlVertDlim', role:'gridFlex', axis:X, target:'<', contents:{vdiv:''}},
            {col:
            [
               {grid:'#DrawMainGrid', contents:
               [
                  {row:[{col:'#DrawHeadView .slabViewHead', contents:
                  [
                     {tabber:'#DrawTabber', theme:'.dark', target:'#DrawBodyPanl'}
                  ]}]},
                  {row:[{col:'.panlHorzLine', contents:[{hdiv:''}]}]},
                  {row:[{col:'.slabViewBody', contents:
                  [
                     {grid:'#DrawViewGrid', contents:[{row:
                     [
                        {col:'#DrawToolView .hide', contents:[{panl:'#DrawToolPanl'}]},
                        {col:'.panlVertLine', contents:[{vdiv:''}]},
                        {col:'#DrawBodyView', contents:[{panl:'#DrawBodyPanl'}]},
                        {col:'.panlVertLine', contents:[{vdiv:''}]},
                        {col:'#DrawPropView', contents:[{grid:'#DrawPropGrid', contents:[{row:
                        [
                           {col:'#DrawPropTabH',contents:
                           [
                              {tabber:'#DrawPropTabr', theme:'.dark', flap:L, target:'#DrawPropTabB', contents:
                              [
                                 {title:'Canvas', canClose:0, contents:[{grid:
                                 [
                                    {row:[{col:'.DrawPropView',contents:'Canvas'}]},
                                    {row:[{col:'.panlHorzLine', contents:[{hdiv:''}]}]},
                                    {row:[{col:[{panl:'#DrawPropCanv .DrawPropPanl'}]}]}
                                 ]}]},
                                 {title:'Layers', canClose:0, contents:[{grid:
                                 [
                                    {row:[{col:'.DrawPropView',contents:'Layers'}]},
                                    {row:[{col:'.panlHorzLine', contents:[{hdiv:''}]}]},
                                    {row:[{col:[{panl:'#DrawPropLayr .DrawPropPanl'}]}]}
                                 ]}]},
                                 {title:'Detail', canClose:0, contents:[{grid:
                                 [
                                    {row:[{col:'.DrawPropView',contents:'Detail'}]},
                                    {row:[{col:'.panlHorzLine', contents:[{hdiv:''}]}]},
                                    {row:[{col:[{panl:'#DrawPropItem .DrawPropPanl'}]}]}
                                 ]}]},
                                 {title:'Filter', canClose:0, contents:[{grid:
                                 [
                                    {row:[{col:'.DrawPropView',contents:'Filter'}]},
                                    {row:[{col:'.panlHorzLine', contents:[{hdiv:''}]}]},
                                    {row:[{col:[{panl:'#DrawPropFilt .DrawPropPanl'}]}]}
                                 ]}]},
                              ]}
                           ]},
                           {col:'.panlVertLine', contents:[{vdiv:''}]},
                           {col:'#DrawPropTabB'}
                        ]}]}]},
                     ]}]}
                  ]}]},
                  {row:[{col:'.panlHorzLine', contents:[{hdiv:''}]}]},
                  {row:[{col:'#DrawSeedView', contents:[{panl:'#DrawSeedPanl'}]}]}
               ]}
            ]},
         ]}
      ]}
   ]}
]);




extend(Anon)
({
   Draw:
   {
      vars:{actv:VOID},



      anew:function(cbf)
      {
         select('#DrawTabber').closeAll((tv)=>
         {
            tv=select('#DrawTreeView').select('treeview');
            if(tv){tv[0].remove()}; tick.after(60,cbf);
         });
      },



      init:function(slf)
      {
         select('#DrawTabber').listen('focus',function(e)
         {
            let drv=e.detail.driver; let tgt=e.detail.target.body.select('.DrawViewWrap')[0];
            wait.until(()=>{return (!!tgt.vars&&!!tgt.vars.canvas)},()=>
            {Anon.Draw.vars.actv=tgt; select('#DrawBodyPanl').signal('tabfocus',tgt);});
         });

         select('#DrawTabber').listen('close',function(e)
         {
            let drv=e.detail.driver; let tgt=e.detail.target; tgt.head.hijacked=1;
            Anon.Draw.shut(drv,tgt);
         });

         select('#DrawTabber').listen('empty',function(e)
         {
            select('#DrawToolView').reclan('show:hide');
            select('#DrawPropView').reclan('show:hide');
         });

         select('#DrawTreePanl').select('treeview')[0].listen('loaded',ONCE,()=>
         {
            select('#DrawPropView').reclan('show:hide');
            requires('/Draw/getTools.js',()=>{Busy.edit('/Draw/panl.js',100);});
         });
      },



      load:function(pth,cbf, ext,img)
      {
         purl('/Draw/loadFile',{path:pth},function(rsp)
         {
            ext=fext(pth); if(isin(['png','jpg','jpeg','svg','gif'],ext))
            {
               img=create({img:'', src:rsp.body, onload:function(){this.rectInfo((i)=>
               {this.width=i.width; this.height=i.height; cbf(this)})}}); return;
            };

            // if(isin(['js','json','css','htm','html','txt','php','inf'],ext))
            // {
            //    rsp=stub(rsp.body,';base64,')[2]; rsp=atob(rsp); img=create({code:'',contents:rsp}); img.rectInfo((i)=>
            //    {img=VOID; img=create({svg:'', width:Math.ceil(i.width), height:Math.ceil(i.height), contents:[{text:rsp.body}]}); cbf(img)});
            // };

            alert('file type `'+ext+'` is not supported .. yet');
         });
      },



      open:function(pth, drv,tab,ttl,tgt,slf,mim,lay)
      {
         slf=this; drv=select('#DrawTabber').driver; ttl=(pth+''); tab=drv.select(ttl);
         if(!!tab){return}; this.load(pth,(img,nic)=>
         {
            select('#DrawToolView').reclan('hide:show');
            select('#DrawPropView').reclan('hide:show');
            drv.create({title:ttl, contents:[{panl:'.DrawViewPanl', contents:[{div:'.DrawViewWrap', canFocus:1}]}]});
            tab=drv.select(ttl); tgt=tab.body.select('.DrawViewWrap')[0]; tgt.vars={}; mim=stub(img.src,';base64,')[0].split(':')[1];
            lay=swap((rstub(ttl.split('/').pop(),'.')[0]),'.','_');
            tgt.vars.path=pth; tgt.vars.mime=mim;

            tgt.vars.unredo={indx:0,keep:
            [
               {type:'Stage', nick:pth, mime:mim, face:0, attr:{width:img.width, height:img.height, scale:1}, data:
               [
                  {type:'Layer', nick:lay, data:
                  [{type:'Image', nick:pth.split('/').pop(), attr:{x:0,y:0,width:img.width,height:img.height}, data:img.src}]}
               ]}
            ]};

            tgt.vars.saved=1;

            tgt.onFeed(function(d,n, s)
            {
               if(n){Anon.Draw.feed(s,d,n);return}; n=d.split('/').pop();
               Anon.Draw.load(d,(r)=>{Anon.Draw.feed(r.src,n);});
            });

            Anon.Draw.vars.actv=tgt;
            tgt.vars=slf.deja.pick(tgt,0); //tgt.vars.canvas.find('Transformer').destroy();
            // tick.after(10,()=>{select('#DrawBodyPanl').signal('open',tgt)});
         });
      },



      feed:function(v,n,l, s,m,c)
      {
         s=this; m=stub(v,';base64,')[0].split(':')[1];

         if(isin(m,'image')){create({img:'', src:v, onload:function()
         {s.make({nick:n,type:'Rect', x:0, y:0, width:this.width, height:this.height,fillPatternImage:this},1,l)}});return};

         alert('mime type `'+m+'` is not supported .. yet');
      },



      fumb:function(o)
      {
         o.fumble=function(){select('#DrawBodyPanl').signal('editItem',this); Anon.Draw.deja.keep()};
         o.on('dragend',function(){this.fumble()}); o.on('transformend',function(){this.fumble()});
         return o;
      },


      fidl:function(f)
      {
         f=VOID; f=(new Konva.Transformer
         ({
            rotateAnchorOffset:10,
            anchorCornerRadius:3,
            anchorFill: 'yellow',
            anchorSize: 6,
            anchorStroke: 'red',
            borderDash: [3,3],
            borderStroke: 'white',
            borderStrokeWidth:1,
         }));
         return f;
      },


      make:function(o,i,l, a,c,t,x,n,fg,bg,f)
      {
         a=Anon.Draw.vars.actv; c=a.vars.canvas; c.find('Transformer').destroy(); c.batchDraw(); t=o.type; delete o.type;
         if(isVoid(o.x)){o.x=0}; if(isVoid(o.y)){o.y=0}; if(isVoid(o.width)){o.width=60}; if(isVoid(o.height)){o.height=30};
         if(isVoid(o.draggable)){o.draggable=true}; x=(o.nick||t); delete o.nick; if(!l){l=Anon.Draw.tool.layrMake(x)};
         n=Anon.Draw.fumb((new Konva.Group({x:o.x,y:o.y,draggable:o.draggable,clip:{x:0,y:0,width:o.width,height:o.height}})));
         delete o.x; delete o.y; delete o.draggable; if(i&&!!o.fillPatternImage){bg=(new Konva[t](o))};
         if(!!bg){n.add(bg); delete o.fillPatternImage}; fg=(new Konva[t](o)); n.add(fg);
         // n.attrs.width=o.width; n.attrs.height=o.height;

         l.add(n); f=this.fidl(); l.add(f); f.attachTo(n);

         // n.size=function( a){a=this.attrs; return {width:(a.width||a.clipWidth), height:(a.height||a.clipHeight)}};
         // extend(n)({getClientRect:function()
         // {
         //    let a=this.attrs; return {width:(a.width||a.clipWidth), height:(a.height||a.clipHeight)}
         // }});


         delete a.vars.selected; a.vars.selected=[n]; l.batchDraw();
         n.nick=l.nick; if(!!bg){n.bg=n.children[0]; n.fg=n.children[1]}else{n.fg=n.children[0]}; n.tr=f;
         this.deja.keep(); select('#DrawBodyPanl').signal('pickItem',n); return n;
      },


      edit:function(p,v,s, i,l,n)
      {
         i=Anon.Draw.vars.actv; l=i.vars.flayer; n=i.vars.active;

         if(!isin(p,['fill','stroke'])){n[p](v)}
         else
         {
            n.fg[p](v);
         }

         l.batchDraw();
         if(s||(s==VOID)){select('#DrawBodyPanl').signal('editItem',n);};
         this.deja.keep();
      },


      deja:
      {
         keep:function(tgt, slf,vrs,cux,lux,cnv,dim,mim,rsl,atr)
         {
            if(!tgt){tgt=Anon.Draw.vars.actv}; slf=this; vrs=tgt.vars; cux=vrs.unredo.indx; if(!!vrs.unredo.keep[(cux+1)])
            {do{lux=(vrs.unredo.keep.length-1); if(lux>cux){vrs.unredo.keep.pop()}}while(lux>cux);}; // destroy all after this index

            cnv=vrs.canvas; dim=cnv.dime; mim=tgt.vars.mimeType; atr={width:dim.size.crpw,height:dim.size.crph,scale:dim.zoom.scal};
            rsl={type:'Stage', nick:vrs.filePath, mime:mim, face:vrs.tgtLayer, attr:atr};
            rsl.data=slf.make(cnv); tgt.vars.unredo.indx++; tgt.vars.unredo.keep.push(rsl);
         },


         make:function(obj, slf,rsl)
         {
            slf=this; rsl=[]; obj.getChildren().forEach((n,x)=>
            {
               let t,a,o; t=(n.className||n.nodeType); a=decode.JSON(encode.JSON(n.attrs));
               // a.each((v,k)=>{a[k]=n[k]()});
               o={type:t, nick:(n.nick||(t+x)), attr:a};
               if(t=='Transformer'){return}
               else if(t=='Layer'){o.data=slf.make(n)}
               else if(t=='Image'){o.data=n.attrs.image.currentSrc}
               else{o.data=''}; rsl.push(o);
            });
            return rsl;
         },


         face:function(node,prnt, slf,rsl,box)
         {
            slf=this;

            if(node.type=='Layer')
            {
               rsl=Anon.Draw.tool.layrMake(node.nick);
               node.data.forEach((o)=>{slf.face(o,rsl)}); return rsl;
            };

            if(node.type=='Image')
            {Anon.Draw.feed(node.data,node.nick,prnt)}
            else
            {node.attr.nick=node.nick; Anon.Draw.make(node.attr,VOID,prnt);};
         },


         pick:function(tgt,tux, slf,vrs,cux,cnv,atr,scl,aw,ah)
         {
            tux=((tux=='<')?(-1):((tux=='>')?1:tux)); slf=this; vrs=tgt.vars; cux=vrs.unredo.indx; tux=(cux+tux); cnv=vrs.unredo.keep[tux];

            if(!cnv){return}; vrs.unredo.indx=tux; atr=cnv.attr; scl=atr.scale; delete vrs.selected;
            if(!!vrs.canvas){vrs.canvas.destroyChildren(); vrs.canvas.draw(); vrs.canvas.destroy(); delete vrs.canvas; tgt.innerHTML='';};

            aw=atr.width; ah=atr.height; vrs.canvas=(new Konva.Stage({container:tgt, width:aw, height:ah})); vrs.canvas.scale({x:scl,y:scl});
            vrs.canvas.width(aw); vrs.canvas.height(ah); tgt.setStyle({width:aw,height:ah}); // boundaries
            vrs.canvas.dime={zoom:{scal:scl}, size:{sclx:scl,scly:scl,ownw:aw,ownh:ah,crpw:aw,crph:ah}}; // for zoom, scale & crop later
            cnv.data.forEach((o)=>{delete vrs.flayer; vrs.flayer=slf.face(o,vrs.canvas); vrs.canvas.draw()}); // create layers and contents
            vrs.filePath=cnv.nick; vrs.mimeType=cnv.mime;
            vrs.canvas.on('mousedown',function(evnt)
            {
               let o=evnt.target; if(o.attrs.name&&isin(o.attrs.name,' _anchor')){return}; let c=this; let tgt=c.attrs.container;
               if(o.parent&&(o.parent.nodeType=='Group')){o=o.parent}; if(!o.parent||!evnt.evt.ctrlKey)
               {c.find('Transformer').destroy(); c.children.forEach((i)=>{i.draw()}); if(!o.parent){tgt.vars.selected=[];return}};
               if(!evnt.evt.ctrlKey){c.find('Transformer').destroy(); o.parent.draw(); tgt.vars.selected=[]};
               let f=Anon.Draw.fidl(); o.parent.add(f); f.attachTo(o); o.parent.draw(); o.tr=f;
               radd(tgt.vars.selected,o); select('#DrawBodyPanl').signal('pickItem',o);
            });
            return vrs;
         },
      },



      exec:function(tgt,fnc,arg)
      {
         this.deja.keep(tgt); this.tool[fnc].apply(tgt,arg);
      },



      save:function(tgt, face,file,mime,durl,scal,ndim,zdim,cdim)
      {
         face=tgt.vars.canvas; file=tgt.vars.filePath; mime=tgt.vars.mimeType; face.find('Transformer').destroy();
         ndim={s:face.scaleX(),w:face.width(),h:face.height()}; zdim=face.dime.zoom; cdim=face.dime.crop;

         if(ndim.s!=zdim.s)
         {
            let cs,cw,ch; cs=cdim.s; cw=((cdim.w)*(1/cs)); ch=((cdim.h)*(1/cs));
            face.scale({x:1,y:1}); face.width(cw); face.height(ch);
            durl=face.toDataURL({mimeType:mime,quality:0.9});
            face.scale({x:ndim.s,y:ndim.s}); face.width(ndim.w); face.height(ndim.h);
         }
         else
         {
            durl=face.toDataURL({mimeType:mime,quality:0.9});
         };

         purl('/Draw/saveFile',{path:file,bufr:durl},(rsp)=>
         {
            dump(rsp.body);
         });
      },



      shut:function(drv,tab, bfr,dne)
      {
         bfr=tab.body.select('.DrawViewWrap'); dne=(bfr?bfr[0].vars.saved:1);

         if(!dne){dne=confirm('Discard unsaved changes?')};

         if(dne)
         {
            drv.delete(tab.head.title,true); // delete with `No Signal Intercept`
            // tick.after(60,()=>{select('#DrawInfoPanl').innerHTML='';}); // wait for `select` info update, then vacuum
            return;
         };
      },



      tool:{},



      prop:{},
   }
});
