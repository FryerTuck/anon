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
                  {row:[{col:'.slabMenuBody', contents:[{panl:'#TimeMainMenu', contents:[{grid:'.holdSpanSize', contents:
                  [
                     {row:[{col:'', style:'height:10px; padding:6px', contents:
                     [
                        {grid:'#TimeMenuFltr .hide', contents:
                        [
                           {row:[{col:[{input:'#TimeFltr_title', fltr:'title', placeholder:':title: name this filter'}]}]},
                           {row:[{col:[{input:'#TimeFltr_using', fltr:'using', placeholder:':using: date or date range'}]}]},
                           {row:[{col:[{input:'#TimeFltr_fetch', fltr:'fetch', placeholder:':fetch: column names'}]}]},
                           {row:[{col:[{input:'#TimeFltr_where', fltr:'where', placeholder:':where: expression'}]}]},
                           {row:[{col:[{input:'#TimeFltr_group', fltr:'group', placeholder:':group: unify similar'}]}]},
                           {row:[{col:[{input:'#TimeFltr_limit', fltr:'limit', placeholder:':limit: boundary'}]}]},
                           {row:[{col:[{grid:[{row:
                           [
                              {col:[{input:'#TimeFltrDraw', placeholder:'type', value:'Bar'}]},
                              {col:'.spacer'},
                              {col:[{input:'#TimeFltrDimW', placeholder:'width'}]},
                              {col:'.spacer'},
                              {col:[{input:'#TimeFltrDimH', placeholder:'height'}]},
                           ]}]}]}]},
                           {row:[{col:[{grid:[{row:
                           [
                              {col:[{butn:'.slabMenuButn', contents:'save', onclick:function(){Anon.Time.save()}}]},
                              {col:'.spacer'},
                              {col:[{butn:'.slabMenuButn', contents:'view', onclick:function(){Anon.Time.prep()}}]},
                           ]}]}]}]},
                        ]}
                     ]}]},
                     {row:[{col:'.panlHorzLine', contents:[{hdiv:''}]}]},
                     {row:[{col:'.timeToglCell', contents:[{icon:'#TimeFltrTogl', face:'chevron-down', onclick:function(){Anon.Time.mtgl()}}]}]},
                     {row:[{col:
                     [
                        {panl:'#TimeMenuExec'},
                     ]}]},
                  ]}]}]}]},
               ]}
            ]},
            {col:'.panlVertDlim', contents:[{vdiv:''}]},
            {col:
            [
               {grid:
               [
                  {row:[{col:'#TimeHeadView .slabViewHead', contents:[{tabber:'#TimeTabber', tabStyle:'.tabsDark', target:'#TimeBodyPanl'}]}]},
                  {row:[{col:'.panlHorzLine', contents:[{hdiv:''}]}]},
                  {row:[{col:'.slabViewBody', contents:{grid:[{row:
                  [
                     {col:'#TimeBodyView', contents:[{panl:'#TimeBodyPanl'}]},
                     {col:'.panlVertLine', contents:[{vdiv:''}]},
                     {col:'#TimeToolView', contents:[{panl:'#TimeToolPanl'}]},
                  ]}]}}]},
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
            select('#TimeMenuExec').innerHTML='';
         });
      },



      init:function(slf)
      {
         purl('/Time/initMenu',(rsp)=>
         {
            rsp=decode.jso(rsp.body); let mnu=select('#TimeMenuExec'); rsp.forEach((i)=>
            {
               let pts=rstub(i,'.'); let txt=pts[0]; let ico=((pts[2]=='json')?'filter':'power');
               mnu.insert({butn:'.longMenuButn', icon:ico, purl:i, contents:swap(txt,'_',' '), onclick:function(){Anon.Time.prep(this.purl)}});
            });
         });


         slf=this; requires('/Time/getTools.js',()=>
         {
            keys(slf.tool).forEach((k,v)=>
            {
               v=slf.tool[k]; if(!!v.keys)
               {
                  if(!!slf.vars.cmnd[v.keys]){fail('the keys `'+k+'` are already used by '+slf.vars.cmnd[v.keys]);return};
                  slf.vars.cmnd[v.keys]=k;
               };

               select('#TimeToolPanl').insert({butn:('#AnonTimeButn'+k+' .AnonToolButn .icon-'+v.icon), title:swap(k,'_',' ')});
            });

            // select('#TimeBodyPanl').listen(['keydown','keyup'],function(evnt)
            // {
            //    let tpe,sig,pck,cmd,btn,tgt,tnn; tpe=(isin(evnt.type,'down')?'dn':(isin(evnt.type,'up')?'up':'mv')); sig=evnt.signal;
            //    pck=Anon.Time.vars.keys; if(tpe=='up'){sig=pck}; cmd=Anon.Time.vars.cmnd[sig]; tgt=evnt.target; tnn=(nodeName(tgt));
            //    if(!cmd){return};
            //    if(tnn=='canvas'){tgt=tgt.parentNode.parentNode}; if(!isin(tgt.className,'DrawViewWrap')){return};
            //    btn=select('#AnonTimeButn'+cmd); if(tpe=='up'){Anon.Time.vars.keys=''; btn.declan('AnonActvKnob'); return};
            //    evnt.preventDefault(); evnt.stopPropagation(); Anon.Time.vars.keys=sig; btn.enclan('AnonActvKnob');
            //    Anon.Time.tool[cmd].exec(tgt,evnt);
            // });

            select('#TimeBodyPanl').focus();
         });

         select('#TimeBodyPanl').focus();
      },



      mtgl:function(a)
      {
         let fg=select('#TimeMenuFltr'); let ih=isin(fg.className,'hide'); if(!a){a=(ih?'show':'hide');};
         if(a=='show'){fg.declan('hide'); fg.enclan('show'); this.className='icon-chevron-up';}
         else{fg.declan('show'); fg.enclan('hide'); this.className='icon-chevron-down';};
      },



      save:function()
      {
         let fo={}; select('#TimeMenuFltr').select('input').forEach((n)=>{fo[n.fltr]=n.value});
         if(span(trim(fo.title))<1){fail('invalid :title: .. use words');return};
         if(!isin(fo.using,'-')){fail('invalid :using: statement');return};
         if(span(trim(fo.fetch))<1){fo.fetch='*'};

         purl('/Time/saveFltr',fo,(rsp)=>
         {
            dump(rsp.body);
         });
      },



      prep:function(p, ttl,pts)
      {
         Anon.Time.mtgl('show');

         if(p)
         {
            pts=rstub(p,'.'); ttl=swap(pts[0],'_',' '); if(pts[2]=='php'){Anon.Time.open(ttl,p);return};
            purl('/Time/openFltr',{path:p},(dta)=>
            {
               dta=decode.jso(dta.body); dta.title=ttl;
               dta.each((v,k)=>{select('#TimeFltr_'+k).value=v;}); Anon.Time.open(ttl,dta);
            });
         }
         else
         {
            let dta={}; select('#TimeMenuFltr').select('input').forEach((n)=>{dta[n.fltr]=n.value});
            ttl=dta.title; Anon.Time.open(ttl,dta);
         };
      },



      open:function(ttl,flt, drv,tab,tgt,atr,lbl,dta,opt,tpe)
      {
         drv=select('#TimeTabber').driver; tab=drv.select(ttl); if(!!tab){return};

         purl('/Time/readData',{fltr:flt},(rsp)=>
         {
            rsp=decode.jso(rsp.body);

            drv.create({title:ttl, contents:[{panl:'.TimeViewPanl'}]});

            tab=drv.select(ttl); tgt=tab.body.select('.TimeViewPanl')[0]; tgt.enclan('holdSpanSize');
            tpe=trim(select('#TimeFltrDraw').value); if(!tpe){tpe='Bar'};
            if(!Chartist[tpe]){fail('chart type `'+tpe+'` is undefined');return}; opt={};
            let sw,sh; sw=(trim(select('#TimeFltrDimW').value)*1); sh=(trim(select('#TimeFltrDimH').value)*1);
            if(!isNaN(sw)&&!isNaN(sh)){opt.width=sw; opt.height=sh};
            lbl=keys(rsp); dta=vals(rsp); if(tpe=='Bar'){dta=[dta]};
            new Chartist[tpe](tgt, {labels:lbl,series:dta}, opt);
         });
      },



      tool:
      {
      },
   }
});
