"use strict";




// init :: panl : view
// --------------------------------------------------------------------------------------------------------------------------------------------
   requires(['/User/dcor/aard.css','/User/dcor/icon.fnt','/User/dcor/code.fnt','/User/dcor/head.fnt','/User/dcor/butn.fnt'],()=>
   {
      if(userDoes('work')){select('#anonPanlView').style.height='100%'};
      select('#anonPanlView').insert
      ([
         {grid:'#AnonMainGrid', style:('width:100%;'+(userDoes('work')?' height:100%':' height:10px')), contents:
         [
            {row:'', forClans:'work', contents:
            [
               {col:'', style:'position:relative; width:100%', contents:
               [
                  {panl:'#AnonMainPanl', contents:
                  [
                     {grid:'', style:'width:100%; height:100%', contents:
                     [
                        {row:'', style:'height:100%', contents:
                        [
                           {col:'#AnonAppsMenu', style:'height:100%', contents:(function()
                           {
                              var mods={:(mods):}; var btns=[];
                              mods.each((v,k)=>{btns.push({butn:('#'+k+'MenuKnob .AnonMainButn .icon-'+v), title:k, listen:
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
                              }});}); return btns;
                           }())},
                           {col:'.panlVertDlim', style:'height:100%',  contents:{vdiv:''}},
                           {col:'#AnonAppsDeck', style:'height:100%', contents:[{panl:'#AnonAppsView'}]},
                        ]},
                     ]},
                  ]},
               ]}
            ]},
            {row:
            [
               {col:'.panlHorzDlim', role:'gridFlex', axis:Y, contents:{hdiv:''}},
            ]},
            {row:
            [
               {col:'#AnonReplView', listen:{flex:function(){(select('.holdSpanSize')||[]).forEach((n)=>{n.resizeTo('^')});}}, contents:
               [
                  {panl:'#AnonReplPanl', onmouseup:function(){select('#AnonReplFeed').focus()}, contents:
                  [
                     {pre:'#AnonReplFlog'},
                     {grid:
                     [
                        {row:
                        [
                           {col:'#AnonReplProc',contents:{pre:'#AnonReplProm',contents:('['+sesn('USER')+'&nbsp;~]')}},
                           {col:'',style:'width:6px'},
                           {col:[{input:'#AnonReplFeed',type:'text',spellcheck:FALS, autocomplete:'off', listen:
                           {
                              'key:Enter':function(){repl.exec(this.value)},
                              'key:ArrowUp':function(){repl.ENV.cmdlog.seek(-1)},
                              'key:ArrowDown':function(){repl.ENV.cmdlog.seek(1)},
                              'Control c':function(){repl.echo('')},
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
            select('#anonPanlView').view('block'); os=this.vars.active; ns=id.slice(0,4); // references
            this.vars.active=ns;

            ob=select(('#'+os+'MenuKnob')); if(ob){ob.declan('AnonActvKnob')}; // de-focus old-button
            op=select(('#'+os+'PanlSlab')); if(op){op.view('none')}; // hide old-panel
            nb=select(('#'+ns+'MenuKnob')); if(nb){nb.enclan('AnonActvKnob')}; // en-focus new-button
            np=select(('#'+ns+'PanlSlab')); if(np){np.view('block')}; // show new-panel

            if(np&&!ea){return};
            if(np&&ea&&!dj&&!!Anon[ns]&&isFunc(Anon[ns].anew)){Anon[ns].anew(()=>{AnonMenu.init(id,ea,1)});return};

            requires(('/'+ns+'/panl.js'),(r)=> // get new-panel
            {
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
            select('#anonPanlView').view('block'); this.actv=1;
            select('#AnonReplFeed').focus();
         },
         hide:function()
         {
            select('#anonPanlView').view('none'); this.actv=0;
         },
         actv:0,
      },
   });
// --------------------------------------------------------------------------------------------------------------------------------------------




// togl :: hide : on-escape
// --------------------------------------------------------------------------------------------------------------------------------------------
   listen('key:Esc',function(evnt)
   {
      if(Busy.node){Busy.kill(); return};
      let mdl = select('modal'); if(mdl){mdl[0].remove();return};
      AnonPanl.hide();
   });
// --------------------------------------------------------------------------------------------------------------------------------------------




// evnt :: create : docket
// --------------------------------------------------------------------------------------------------------------------------------------------
   listen(conf.toggleMakeDokt,function()
   {
      AnonDokt.open();
   });
// --------------------------------------------------------------------------------------------------------------------------------------------
