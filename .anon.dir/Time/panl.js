"use strict";


requires
([
   '/Time/dcor/aard.css',
   '/Proc/libs/chartist/chartist.css',
   '/Proc/libs/chartist/chartist.js'
],
()=>
{
   // requires('/Proc/libs/chartist/legend.js');
});



select('#AnonAppsView').insert
([
   {panl:'#TimePanlSlab', contents:
   [
      {grid:'.AnonPanlSlab', contents:
      [
         {row:
         [
            {col:'.sideMenuView', contents:
            [
               {grid:
               [
                  {row:[{col:'.slabMenuHead', contents:'time'}]},
                  {row:[{col:'.panlHorzLine', contents:[{hdiv:''}]}]},
                  {row:[{col:'#TimeTreeView .slabMenuBody', contents:[{panl:'#TimeTreePanl', contents:
                  [
                     {treeview:'', source:'/User/treeMenu', uproot:true, filter:{file_name:'*.flt.php'}, hideFext:'php',
                        fextIcon:{php:'filter'},
                        listen:
                        {
                           'LeftClick':function(evnt)
                           {
                              if(isin(['fold','plug'],this.info.type)){return}; let ctrl=evnt.ctrlKey; let shft=evnt.shiftKey;
                              if(ctrl||shft){evnt.stopImmediatePropagation(); evnt.preventDefault(); evnt.stopPropagation();};
                              Anon.Time.open(this.info.path,this.info.type,(ctrl?'ctrl':(shft?'shft':VOID)));
                           },
                        }
                     }
                  ]}]}]},
               ]}
            ]},
            {col:'.panlVertDlim', role:'gridFlex', axis:X, target:'<', contents:{vdiv:''}},
            {col:
            [
               {grid:'#TimeMainGrid', contents:
               [
                  {row:[{col:'#TimeHeadView .slabViewHead', contents:
                  [
                     {tabber:'#TimeTabber', theme:'.dark', target:'#TimeBodyPanl'}
                  ]}]},
                  {row:[{col:'.panlHorzLine', contents:[{hdiv:''}]}]},
                  {row:[{col:'.slabViewBody', contents:
                  [
                     {grid:'#TimeViewGrid', contents:[{row:
                     [
                        {col:'#TimeBodyView', contents:[{panl:'#TimeBodyPanl'}]},
                        {col:'.panlVertLine', contents:[{vdiv:''}]},
                        {col:'#TimeToolView', contents:[{panl:'#TimeToolPanl'}]},
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
   Time:
   {
      vars:{cmnd:{},keys:''},



      anew:function(cbf)
      {
         select('#TimeTabber').closeAll((tv)=>
         {
            tv=select('#TimeTreeView').select('treeview');
            if(tv){tv[0].remove()}; tick.after(60,cbf);
         });
      },



      init:function(slf)
      {
         select('#TimeTreePanl').select('treeview')[0].listen('loaded',ONCE,()=>
         {
            Busy.edit('/Time/panl.js',100);
         });
      },



      open:function(pth,tpe,alt)
      {
         if(alt=='ctrl')
         {
            let ea={filter:{file_name:'*.flt.php'}, hideFext:'php', fextIcon:{php:'filter'}};
            ea.openItem={path:pth,type:tpe,mime:'application/x-httpd-php',fext:'php'};
            // ea.saveBack=function(bfr,cbf){Anon.Time.save(bfr.path,bfr.info.type,bfr.value, cbf);};
            AnonMenu.init('CodeMenuKnob',ea); return;
         };

         purl('/Time/openFltr',{path:pth},(r)=>
         {
            r=r.body; if(isJson(r)){this.view(r,pth);return};
            r=Function(`${r}`); r();
         });
      },



      exec:function(vrs)
      {
         if(!isKnob(vrs)){fail('expecting object');return};
         if(!isPath(vrs.path)&&!isPath(`/${vrs.path}`)){fail('invalid argumentObject.path .. expecting path');return};
         if(!isKnob(vrs.data)){fail('invalid argumentObject.data .. expecting object');return};

         purl('/Time/execFltr',vrs,(r)=>
         {
            this.view(r.body,vrs.path);
         });
      },



      view:function(txt,pth, dta,drv,tab,ttl,tpe,opt,tgt,box,lgn,usr,mda)
      {
         if(!isJson(txt)){fail('expecting JSON (text)');return}; dta=decode.jso(txt,1); if(span(dta)<1){alert('no data for graph');return};
         if(!isList(dta.labels)||!isList(dta.series)){fail('invalid graph data');return}; if(!dta.layout){dta.layout={}};
         if(!isKnob(dta.layout)){fail('expecting `layout` as object');}; if(!dta.layout.type){dta.layout.type='Line'}; tpe=dta.layout.type;
         if(!Chartist[tpe]){fail('graph type `'+tpe+'` is undefined');return}; opt=dta.layout; delete dta.layout;

         drv=select('#TimeTabber').driver; ttl=stub(pth,'.flt.')[0]; tab=drv.select(ttl); if(!!tab){return};
         drv.create({title:ttl, contents:[{panl:'.TimeViewPanl'}]}); tab=drv.select(ttl); tgt=tab.body.select('.TimeViewPanl')[0];

         tpe=`${opt.type}`; delete opt.type; if(!isInum(opt.width)||!isInum(opt.height))
         {box=rectOf(tgt); opt.width=(box.width-6); opt.height=(box.height-6);};
         opt.high=24; opt.low=0; opt.axisY={onlyInteger:true,offset:20};

         dta.series.forEach((o,i)=>{dta.series[i].data=listOf(o.data)});

         // usr=[]; mda=[]; dta.series.forEach((o)=>{radd(usr,o.name); radd(mda,vals(o.data));});
         // delete dta.series; dta.series=mda;
         // dump(dta); return;
         // opt.lineSmooth=Chartist.Interpolation.cardinal({fillHoles:true,});

         // lgn=[]; dta.series.forEach((o,i)=>{radd(lgn,{name:o.name,series:i})});
         // opt.plugins=[Chartist.plugins.legend({legendNames:lgn})];
         new Chartist[tpe](tgt,dta,opt);
      },



      save:function(pth,tpe,bfr,cbf)
      {
         dump('Time .. save this'); cbf(OK);
      },



      tool:
      {
      },
   }
});
