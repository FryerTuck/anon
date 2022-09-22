"use strict";




// init :: panl : view
// --------------------------------------------------------------------------------------------------------------------------------------------
   requires(['/User/dcor/aard.css','/Site/dcor/hack.woff','/Site/dcor/head.fnt'],()=>
   {
      select('#anonPanlView').enclan((userDoes('work')?'full':'part'));
      select('#anonPanlView').insert
      ([
         {grid:'#AnonMainGrid', $:
         [
            {row:'#MainGridRow1', forClans:'work', $:
            [
               {col:'#MainGridCol1', $:
               [
                  {panl:'#AnonMainPanl', $:
                  [
                     {grid:'#AnonAppsGrid', $:
                     [
                        {row:'', style:'height:100%', $:
                        [
                           {col:'#AnonAppsMenu', $:(function()
                           {
                              var mods=(~mods~); var btns=[];
                              mods.each((v,k)=>{btns.push({butn:('#'+k+'MenuKnob .AnonMainButn'), icon:v, title:k, listen:
                              {
                                 'mouseover,mouseout':function(evnt)
                                 {
                                    if(evnt.type=='mouseover'){this.focus();return}; this.blur(); this.declan('AnonButnWarn');
                                 },
                                 'keydown,keyup':function(evnt)
                                 {
                                    if(evnt.signal!='Control'){return}; if(!isin(this.className,'AnonActvKnob')){return};
                                    if(evnt.type=='keydown'){this.enclan('AnonButnWarn');return}; this.declan('AnonButnWarn');
                                 },
                                 'LeftClick':function(evnt){AnonMenu.init(this.id,evnt.ctrlKey)},
                              }});}); return [{wrap:[{div:[btns]}]}];
                           }())},
                           {col:'.panlVertDlim', style:'height:100%',  $:{vdiv:''}},
                           {col:'#AnonAppsDeck', style:'height:100%', $:[{wrap:[{panl:'#AnonAppsView'}]}]},
                        ]},
                     ]},
                  ]},
               ]}
            ]},
            {row:'#MainGridRow2', $:
            [
               {col:'#MainGridCol2 .panlHorzDlim', role:'gridFlex', axis:Y, $:{hdiv:''}},
            ]},
            {row:'#MainGridRow3', $:
            [
               {col:'#AnonReplView', $:
               [
                  {panl:'#AnonReplPanl', onmouseup:function()
                  {
                      if(!this.getSelection()){select('#AnonReplFeed').focus()};
                  }, $:
                  [
                     {pre:'#AnonReplFlog'},
                     {grid:'#AnonReplForm .noSpanVert', $:
                     [
                        {row:
                        [
                           {col:'#AnonReplProc',$:{pre:'#AnonReplProm',$:('['+sesn('USER')+'&nbsp;~]')}},
                           {col:'',style:'width:6px'},
                           {col:[{input:'#AnonReplFeed',type:'text',spellcheck:FALS, autocomplete:'off', listen:
                           {
                              'key:Enter':function(){repl.exec(this.value)},
                              'key:ArrowUp':function(){repl.ENV.cmdlog.seek(-1)},
                              'key:ArrowDown':function(){repl.ENV.cmdlog.seek(1)},
                              // 'Control c':function(){repl.echo('Ctrl c')},
                              'focus':function(){repl.vivify();},
                              'blur':function(){repl.pacify();},
                           }}]},
                        ]}
                     ]}
                  ]}
               ]},
            ]},
         ]}
      ]);
   });
// --------------------------------------------------------------------------------------------------------------------------------------------




// tool :: Anon : feature
// --------------------------------------------------------------------------------------------------------------------------------------------
   extend(MAIN)
   ({
      Anon:{},


      AnonMenu:
      {
         vars:{active:VOID},

         init:function(id,ea,dj, os,ns, ob,op, nb,np)
         {
            select('#anonPanlView').declan('hide');  //select('#anonPanlView').enclan('show');
            os=this.vars.active; ns=id.slice(0,-8);  // references
            this.vars.active=ns;

            ob=select(('#'+os+'MenuKnob')); if(ob){ob.declan('AnonActvKnob')}; // de-focus old-button
            op=select(('#'+os+'PanlSlab')); if(op){op.declan('show'); op.enclan('hide');}; // hide old-panel
            nb=select(('#'+ns+'MenuKnob')); if(nb){nb.enclan('AnonActvKnob')}; // en-focus new-button
            np=select(('#'+ns+'PanlSlab')); if(np){np.declan('hide'); np.enclan('show');}; // show new-panel

            if(np&&!ea){return};
            if(np&&ea&&!dj&&!!Anon[ns]&&isFunc(Anon[ns].anew)){Anon[ns].anew(()=>{AnonMenu.init(id,ea,1)});return};
            Busy.edit(('/'+ns+'/panl.js'),0);

            requires(('/'+ns+'/panl.js'),()=>{},()=> // get new-panel
            {
               Busy.edit(('/'+ns+'/panl.js'),30);
               let nn=('#'+ns+'PanlSlab'); np=select(nn); if(!np){fail(('expecting new panel id for `'+ns+'` as `'+nn+'`'));return};
               if(nodeName(np)!='panl'){fail('expecting `'+nn+'` as `panl` element');return};
               if(np.parentNode.id!='AnonAppsView'){fail('expecting `'+nn+'` as childNode of #AnonAppsView');return};
               if(!isKnob(Anon[ns])){fail('expecting `'+ns+'` as object that extends `Anon`');return};
               if(!isFunc(Anon[ns].init)){fail('expecting `Anon.'+ns+'.init` as function');return};
               if(!isFunc(Anon[ns].anew)){fail('expecting `Anon.'+ns+'.anew` as function');return};
               Anon[ns].init(ea);
            });
         },
      },


      popModal:{},


      AnonPanl:
      {
         show:function()
         {
            select('#anonPanlView').reclan('hide:show'); this.actv=1;
            if(isin("anonymous master",sesn("USER"))){select('#AnonReplFeed').focus();}
         },
         hide:function()
         {
            select('#anonPanlView').reclan('show:hide'); this.actv=0;
         },
         actv:0,
      },
   });
// --------------------------------------------------------------------------------------------------------------------------------------------




// evnt :: create : docket
// --------------------------------------------------------------------------------------------------------------------------------------------
   // listen(conf.toggleMakeDokt,function()
   // {
   //    AnonDokt.open();
   // });
// --------------------------------------------------------------------------------------------------------------------------------------------
