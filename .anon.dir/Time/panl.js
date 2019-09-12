"use strict";


requires(['/Time/dcor/aard.css','/Proc/libs/chartist/chartist.css','/Proc/libs/chartist/chartist.js']);



select('#AnonAppsView').insert
([
   {panl:'#TimePanlSlab', contents:
   [
      {grid:'.AnonPanlSlab', contents:
      [
         {row:
         [
            {col:'.treeMenuView', contents:
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
                              if(this.info.type=='fold'){return}; let ctrl=evnt.ctrlKey; let shft=evnt.shiftKey;
                              if(ctrl||shft){evnt.stopImmediatePropagation(); evnt.preventDefault(); evnt.stopPropagation();};
                              Anon.Time.open(this.info.path,this.info.type,(ctrl?'ctrl':(shft?'shft':VOID)));
                           },

                           'mouseover,mouseout':function(evnt)
                           {
                              if(evnt.type=='mouseout'){this.declan('treeItemCtrl'); this.declan('treeItemShft'); this.blur(); return};
                              this.focus(); if(evnt.ctrlKey){this.enclan('treeItemCtrl')}else if(evnt.shiftKey){this.enclan('treeItemShft')};
                           },

                           'keydown,keyup':function(evnt)
                           {
                              let k=evnt.signal; if((k!='Control')&&(k!='Shift')){return}; k=((k=='Control')?'Ctrl':'Shft');
                              if(evnt.type=='keydown'){this.enclan('treeItem'+k);return}; this.declan('treeItem'+k);
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
                     {tabber:'#TimeTabber', tabStyle:'.tabsDark', target:'#TimeBodyPanl'}
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
            r=r.body; if(isJson(r)){this.view(r);return};
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
            this.view(r.body);
         });
      },



      view:function(txt)
      {
         dump(txt);
         if(!isJson(txt)){fail('expecting JSON (text)');return};
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
