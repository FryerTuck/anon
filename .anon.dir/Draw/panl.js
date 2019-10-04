"use strict";


requires(['/Draw/dcor/aard.css','/Proc/libs/konva/konva.min.js']);



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
                     {treeview:'', source:'/User/treeMenu', uproot:true, draggable:true, listen:
                     {
                        'LeftClick':function()
                        {
                           if(this.info.type=='fold'){return};
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
                                 {title:'Active', canClose:0, contents:[{grid:
                                 [
                                    {row:[{col:'.DrawPropView',contents:'Active'}]},
                                    {row:[{col:'.panlHorzLine', contents:[{hdiv:''}]}]},
                                    {row:[{col:[{panl:'#DrawPropItem .DrawPropPanl'}]}]}
                                 ]}]},
                                 {title:'Undone', canClose:0, contents:[{grid:
                                 [
                                    {row:[{col:'.DrawPropView',contents:'Undone'}]},
                                    {row:[{col:'.panlHorzLine', contents:[{hdiv:''}]}]},
                                    {row:[{col:[{panl:'#DrawPropDone .DrawPropPanl'}]}]}
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
               s=this; if(n){Anon.Draw.feed(s,d,n);return}; n=d.split('/').pop();
               Anon.Draw.load(d,(r)=>{Anon.Draw.feed(s,r.src,n);});
            });

            tgt.vars=slf.deja.pick(tgt,0); //tgt.vars.canvas.find('Transformer').destroy();
            // tick.after(10,()=>{select('#DrawBodyPanl').signal('open',tgt)});
         });
      },



      feed:function(tgt,v,n,atr, dk,slf,m,l,o,f,q)
      {
         slf=this; tgt.vars.canvas.find('Transformer').destroy(); m=stub(v,';base64,')[0].split(':')[1];
         l=swap((rstub(n.split('/').pop(),'.')[0]),'.','_'); q=select('#DrawPropLayrMake'); q.value=l; l=Anon.Draw.tool.layrMake(q);

         if(isin(m,'image')){create({img:'', src:v, onload:function()
         {
            if(!atr){dk=1; atr={x:0, y:0, width:this.width, height:this.height, draggable:true, image:this}}
            else{delete atr.nick; delete atr.kind; delete atr.data; atr.image=this;};
            o=Anon.Draw.fumb((new Konva.Image(atr))); o.nick=n;

            l.add(o); f=(new Konva.Transformer()); l.add(f); f.attachTo(o); l.draw(); tgt.vars.selected=[o];
            if(dk){slf.deja.keep(tgt);};

            // select('#DrawBodyPanl').focus();
         }});return};

         alert('mime type `'+m+'` is not supported .. yet');
      },



      fumb:function(o)
      {
         o.fumble=function(){let i=this.parent; do{i=i.parent}while(i.nodeType!='Stage'); Anon.Draw.deja.keep(i.attrs.container);};
         o.on('dragend',function(){this.fumble()}); o.on('transformend',function(){this.fumble()});
         o.on('mousedown',function(){Anon.Draw.tool.pickItem(this)});
         return o;
      },



      deja:
      {
         keep:function(tgt, slf,vrs,cux,lux,cnv,dim,mim,rsl,atr)
         {
            slf=this; vrs=tgt.vars; cux=vrs.unredo.indx; if(!!vrs.unredo.keep[(cux+1)])
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
               rsl=(new Konva.Layer()); rsl.nick=node.nick; prnt.add(rsl);
               node.data.forEach((o)=>{slf.face(o,rsl)}); return rsl;
            };

            if(node.type=='Image')
            {node.attr.draggable=true, node.attr.image=create({img:'', src:node.data}); rsl=(new Konva.Image(node.attr));};

            rsl.nick=node.nick; rsl=Anon.Draw.fumb(rsl);

            if(!!prnt&&(prnt.nodeType=='Layer'))
            {prnt.add(rsl); box=(new Konva.Transformer()); prnt.add(box); box.attachTo(rsl);};
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
               let f=(new Konva.Transformer()); o.parent.add(f); f.attachTo(o); o.parent.draw();
               tgt.vars.selected.push(o);
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
