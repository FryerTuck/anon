"use strict";


requires(['/Mail/dcor/aard.css']);



select('#AnonAppsView').insert
([
   {panl:'#MailPanlSlab', contents:
   [
      {grid:'.AnonPanlSlab', contents:
      [
         {row:
         [
            {col:'.sideMenuView', contents:
            [
               {grid:
               [
                  {row:[{col:'.slabMenuHead', contents:'mail'}]},
                  {row:[{col:'.panlHorzLine', contents:[{hdiv:''}]}]},
                  {row:[{col:'.slabMenuBody', contents:[{panl:'#MailPlugMenu'}]}]},
               ]}
            ]},
            {col:'.panlVertDlim', contents:[{vdiv:''}]},
            {col:
            [
               {grid:
               [
                  {row:[{col:'#MailHeadView .slabViewHead', contents:[{tabber:'#MailTabber', theme:'.dark', target:'#MailBodyPanl'}]}]},
                  {row:[{col:'.panlHorzLine', contents:[{hdiv:''}]}]},
                  {row:[{col:'.slabViewBody', contents:[{panl:'#MailBodyPanl'}]}]},
               ]}
            ]},
         ]}
      ]}
   ]}
]);




extend(Anon)
({
   Mail:
   {
      anew:function(cbf)
      {
         select('#MailTabber').closeAll(()=>
         {
            select('#MailPlugMenu').innerHTML='';
            tick.after(60,cbf);
         });
      },


      vars:
      {
         mbox:
         {
            inbox:'inbox',
            drafts:'drafts',
            flagged:'important',
            important:'important',
            starred:'important',
            junk:'spam',
            spam:'spam',
            sent:'sent',
            trash:'trash',
         },
         icon:
         {
            inbox:'inbox',
            drafts:'floppy-disk',
            important:'star',
            spam:'bug',
            sent:'truck',
            trash:'trashcan',
         },
      },


      init:function()
      {
         purl('/Mail/linkMenu',(r)=>
         {
            r=decode.jso(r.body);
            r.each((i)=>
            {
               i=rtrim(i,'.url'); select('#MailPlugMenu').insert
               ([{
                  butn:'.longMenuButn', icon:'plug', trgt:i, contents:i,
                  listen:
                  {
                     click:function(){Anon.Mail.open(this.trgt);},
                     focus:function(){select('.longMenuButn').each((n)=>{n.declan('longActvButn')}); this.enclan('longActvButn');},
                  }
               }]);
            });

            Busy.edit('/Mail/panl.js',100);
         });
      },


      open:function(itm, drv,ttl,tab)
      {
         drv=select('#MailTabber').driver; ttl=(itm+'');
         tab=drv.select(ttl); if(!!tab){return};

         purl('/Mail/openPlug',{purl:itm},function(rsp, mnu,usd)
         {
            rsp=decode.jso(rsp.body); mnu=[]; usd={}; rsp.forEach((p)=>
            {
               let n,s,i; n=lowerCase(p); s=stub(n,['/','\\']); if(s){n=s[2]}; n=stub(n,keys(Anon.Mail.vars.mbox));
               if(!n){return}; n=n[1]; n=Anon.Mail.vars.mbox[n]; if(!n){return}; if(usd[n]){return}; usd[n]=1;
               i=Anon.Mail.vars.icon[n]; radd(mnu,{butn:('#AnonMailButn'+n+' .AnonToolButn .icon-'+i), title:n, purl:itm, trgt:p, listen:
               {
                  click:function(){Anon.Mail.show(this.purl,this.trgt)},
               }});
            });

            drv.create({title:ttl, contents:[{panl:'.MailViewPanl', contents:[{grid:[{row:
            [
               {col:'.mboxMenu',contents:mnu},
               {col:'.panlVertLine', contents:[{vdiv:''}]},
               {col:'.mboxView',contents:[]},
            ]}]}]}]});
         });
      },


      show:function(prl,box, drv,tgt)
      {
         drv=select('#MailTabber').driver; tgt=drv.active.body.select('.mboxView')[0]; tgt.innerHTML='';
         purl('/Mail/readMbox',{purl:prl,mbox:box},function(rsp)
         {
            console.log(rsp.body); return;
            rsp=decode.jso(rsp.body); dump(rsp); return;
            rsp.forEach((obj)=>{tgt.insert({grid:'.mailItem', info:obj, contents:
            [
               {row:'.head'},
               {row:'.body'},
            ]})});
         });
      },
   }
});
