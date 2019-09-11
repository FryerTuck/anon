"use strict";


requires(['/Draw/dcor/aard.css','/Proc/libs/konva/konva.js']);



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
                     {tabber:'#DrawTabber', tabStyle:'.tabsDark', target:'#DrawBodyPanl'}
                  ]}]},
                  {row:[{col:'.panlHorzLine', contents:[{hdiv:''}]}]},
                  {row:[{col:'.slabViewBody', contents:
                  [
                     {grid:'#DrawViewGrid', contents:[{row:
                     [
                        {col:'#DrawBodyView', contents:[{panl:'#DrawBodyPanl'}]},
                        {col:'.panlVertLine', contents:[{vdiv:''}]},
                        {col:'#DrawToolView', contents:[{panl:'#DrawToolPanl'}]},
                     ]}]}
                  ]}]},
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
      vars:{cmnd:{},keys:''},



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
         select('#DrawTabber').listen('close',function(e)
         {
            let drv=e.detail.driver; let tgt=e.detail.target; tgt.head.hijacked=1;
            Anon.Draw.shut(drv,tgt);
         });

         slf=this; requires('/Draw/getTools.js',()=>
         {
            keys(slf.tool).forEach((k,v)=>
            {
               v=slf.tool[k]; if(!!v.keys)
               {
                  if(!!slf.vars.cmnd[v.keys]){fail('the keys `'+k+'` are already used by '+slf.vars.cmnd[v.keys]);return};
                  slf.vars.cmnd[v.keys]=k;
               };

               select('#DrawToolPanl').insert({butn:('#AnonDrawButn'+k+' .AnonToolButn .icon-'+v.icon), title:swap(k,'_',' ')});
            });

            select('#DrawBodyPanl').listen(['keydown','keyup','mousewheel','mousemove','wheel','click'],function(evnt)
            {
               let tpe,sig,pck,cmd,btn,tgt,tnn; tpe=(isin(evnt.type,'down')?'dn':(isin(evnt.type,'up')?'up':'mv')); sig=evnt.signal;
               pck=Anon.Draw.vars.keys; if(tpe=='up'){sig=pck}; cmd=Anon.Draw.vars.cmnd[sig]; tgt=evnt.target; tnn=(nodeName(tgt));
               if(!cmd){return}; if(tnn=='canvas'){tgt=tgt.parentNode.parentNode}; if(!isin(tgt.className,'DrawViewWrap')){return};
               btn=select('#AnonDrawButn'+cmd); if(tpe=='up'){Anon.Draw.vars.keys=''; btn.declan('AnonActvKnob'); return};
               evnt.preventDefault(); evnt.stopPropagation(); Anon.Draw.vars.keys=sig; btn.enclan('AnonActvKnob');
               Anon.Draw.tool[cmd].exec(tgt,evnt);
            });

            select('#DrawBodyPanl').focus();
         });

         select('#DrawBodyPanl').focus();
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



      open:function(pth, drv,tab,ttl,tgt,slf,mim)
      {
         slf=this; drv=select('#DrawTabber').driver; ttl=(pth+''); tab=drv.select(ttl);
         if(!!tab){return}; this.load(pth,(img,nic)=>
         {
            drv.create({title:ttl, contents:[{panl:'.DrawViewPanl', contents:[{div:'.DrawViewWrap', canFocus:1}]}]});
            tab=drv.select(ttl); tgt=tab.body.select('.DrawViewWrap')[0]; tgt.vars={}; mim=stub(img.src,';base64,')[0].split(':')[1];

            tgt.vars.unredo={indx:0,keep:
            [
               {type:'Stage', nick:pth, mime:mim, face:0, attr:{width:img.width, height:img.height, scale:1}, data:
               [
                  {type:'Layer', nick:'Layer0', data:
                  [{type:'Image', nick:pth.split('/').pop(), attr:{x:0,y:0,width:img.width,height:img.height}, data:img.src}]}
               ]}
            ]};

            tgt.vars.saved=1;
            slf.deja.pick(tgt,0); //tgt.vars.canvas.find('Transformer').destroy();

            tgt.onFeed(function(d,n, s)
            {
               s=this; if(n){Anon.Draw.feed(s,d,n);return}; n=d.split('/').pop();
               Anon.Draw.load(d,(r)=>{Anon.Draw.feed(s,r.src,n);});
            });

            select('#DrawBodyPanl').focus();
         });
      },



      make:function(tgt,tpe,atr)
      {

      },



      feed:function(tgt,v,n,atr, dk,slf,m,l,o,f)
      {
         slf=this; tgt.vars.canvas.find('Transformer').destroy(); m=stub(v,';base64,')[0].split(':')[1];
         l=tgt.vars.layers[tgt.vars.tgtLayer];

         if(isin(m,'image')){create({img:'', src:v, onload:function()
         {
            if(!atr){dk=1; atr={x:0, y:0, width:this.width, height:this.height, draggable:true, image:this}}
            else{delete atr.nick; delete atr.kind; delete atr.data; atr.image=this;};
            o=(new Konva.Image(atr)); o.nick=n;

            o.fumble=function()
            {let inst=this.parent; do{inst=inst.parent}while(inst.nodeType!='Stage'); Anon.Draw.deja.keep(inst.attrs.container);};
            o.on('dragend',function(){this.fumble()}); o.on('transformend',function(){this.fumble()});

            l.add(o); f=(new Konva.Transformer()); l.add(f); f.attachTo(o); l.draw(); tgt.vars.selected=[o];
            if(dk){slf.deja.keep(tgt);};

            select('#DrawBodyPanl').focus();
         }});return};

         alert('mime type `'+m+'` is not supported .. yet');
      },



      deja:
      {
         keep:function(tgt, slf,vrs,cux,lux,cnv,dim,mim,rsl)
         {
            slf=this; vrs=tgt.vars; cux=vrs.unredo.indx; if(!!vrs.unredo.keep[(cux+1)])
            {do{lux=(vrs.unredo.keep.length-1); if(lux>cux){vrs.unredo.keep.pop()}}while(lux>cux);}; // destroy all after this index

            cnv=vrs.canvas; dim=cnv.dime; mim=tgt.vars.mimeType;
            rsl={type:'Stage', nick:vrs.filePath, mime:mim, face:vrs.tgtLayer, attr:{width:dim.crop.w, height:dim.crop.h, scale:dim.zoom.s}};
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

            rsl.nick=node.nick; rsl.fumble=function()
            {let tgt=this.parent; do{tgt=tgt.parent}while(tgt.nodeType!='Stage'); Anon.Draw.deja.keep(tgt.attrs.container);};
            rsl.on('dragend',function(){this.fumble()}); rsl.on('transformend',function(){this.fumble()});

            if(!!prnt&&(prnt.nodeType=='Layer'))
            {prnt.add(rsl); box=(new Konva.Transformer()); prnt.add(box); box.attachTo(rsl);};
         },


         pick:function(tgt,tux, slf,vrs,cux,cnv,atr,scl)
         {
            tux=((tux=='<')?(-1):((tux=='>')?1:tux)); slf=this; vrs=tgt.vars; cux=vrs.unredo.indx; tux=(cux+tux); cnv=vrs.unredo.keep[tux];

            if(!cnv){return}; vrs.unredo.indx=tux; atr=cnv.attr; scl=atr.scale; delete vrs.selected; delete vrs.tgtLayer; delete vrs.layers;
            if(!!vrs.canvas){vrs.canvas.destroyChildren(); vrs.canvas.draw(); vrs.canvas.destroy(); delete vrs.canvas; tgt.innerHTML='';};

            vrs.canvas=(new Konva.Stage({container:tgt, width:atr.width, height:atr.height})); vrs.canvas.scale({x:scl,y:scl}); // new stage
            vrs.canvas.width(atr.width); vrs.canvas.height(atr.height); tgt.setStyle({width:atr.width,height:atr.height}); // boundaries
            vrs.canvas.dime={zoom:{s:scl,w:atr.width,h:atr.height}, crop:{s:scl,w:atr.width,h:atr.height}}; // for zoom & crop later
            vrs.layers=[]; cnv.data.forEach((o)=>{vrs.layers.push(slf.face(o,vrs.canvas)); vrs.canvas.draw()}); // create layers and contents
            vrs.filePath=cnv.nick; vrs.mimeType=cnv.mime; vrs.tgtLayer=cnv.face; // set active layer
            vrs.canvas.on('mousedown',function(evnt)
            {
               let o=evnt.target; if(o.attrs.name&&isin(o.attrs.name,' _anchor')){return}; let c=this; let tgt=c.attrs.container;
               if(o.parent&&(o.parent.nodeType=='Group')){o=o.parent}; if(!o.parent||!evnt.evt.ctrlKey)
               {c.find('Transformer').destroy(); c.children.forEach((i)=>{i.draw()}); if(!o.parent){tgt.vars.selected=[];return}};
               if(!evnt.evt.ctrlKey){c.find('Transformer').destroy(); o.parent.draw(); tgt.vars.selected=[]};
               let f=(new Konva.Transformer()); o.parent.add(f); f.attachTo(o); o.parent.draw();
               tgt.vars.selected.push(o);
            });

         },
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



      exec:function(tgt,fnc,arg)
      {
         this.deja.keep(tgt); this.tool[fnc].apply(tgt,arg);
      },



      tool:
      {
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
   }
});
