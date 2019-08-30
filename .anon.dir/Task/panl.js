"use strict";

requires(['/Task/dcor/base.css']);



select('#AnonAppsView').insert
([
   {panl:'#TaskPanlSlab', contents:
   [
      {grid:'.AnonPanlSlab', contents:
      [
         {row:
         [
            {col:
            [
               {grid:
               [
                  {row:[{col:'.slabMenuHead', contents:'todo'}]},
                  {row:[{col:'.panlHorzLine', contents:{hdiv:''}}]},
                  {row:[{col:'.slabMenuBody', contents:{panl:'#todoTaskList', role:'todo', sorted:'jobcard::info.editTime:ASC'}}]},
               ]}
            ]},
            {col:'.panlVertDlim', contents:{vdiv:''}},
            {col:
            [
               {grid:
               [
                  {row:[{col:'.slabMenuHead', contents:'busy'}]},
                  {row:[{col:'.panlHorzLine', contents:{hdiv:''}}]},
                  {row:[{col:'.slabMenuBody', contents:{panl:'#busyTaskList', role:'busy', sorted:'jobcard::info.editTime:ASC'}}]},
               ]}
            ]},
            {col:'.panlVertDlim', contents:{vdiv:''}},
            {col:
            [
               {grid:
               [
                  {row:[{col:'.slabMenuHead', contents:'hold'}]},
                  {row:[{col:'.panlHorzLine', contents:{hdiv:''}}]},
                  {row:[{col:'.slabMenuBody', contents:{panl:'#holdTaskList', role:'hold', sorted:'jobcard::info.editTime:ASC'}}]},
               ]}
            ]},
            {col:'.panlVertDlim', contents:{vdiv:''}},
            {col:
            [
               {grid:
               [
                  {row:[{col:'.slabMenuHead', contents:'test'}]},
                  {row:[{col:'.panlHorzLine', contents:{hdiv:''}}]},
                  {row:[{col:'.slabMenuBody', contents:{panl:'#testTaskList', role:'test', sorted:'jobcard::info.editTime:ASC'}}]},
               ]}
            ]},
            {col:'.panlVertDlim', contents:{vdiv:''}},
         ]}
      ]}
   ]}
]);




ordain('.slabMenuBody')
({
   listen:
   {
      focus:function()
      {
         select('#TaskPanlSlab .slabMenuHead').forEach((n)=>{n.declan('slabHasFocus')});
         this.select('^^ .slabMenuHead')[0].enclan('slabHasFocus');
      },
   }
});




extend(Anon)
({
   Task:
   {
      anew:function(cbf)
      {
         select('#TaskTabber').closeAll((tv)=>
         {
            tv=select('#TaskTreeView').select('treeview');
            if(tv){tv[0].remove()}; tick.after(60,cbf);
         });
      },



      init:function()
      {
         purl('/Task/dispense',(r)=>
         {
            r=decode.jso(r.body); r.each((v,k)=>{let j=select(('#JC'+k)); if(j){remove(j);}; Anon.Task.jobCards.render(v);});
         });

         server.listen('docketUpdate',(d)=>
         {
            let k,v,j; k=keys(d)[0]; v=d[k]; j=select(('#JC'+v.docketID));
            if((v.withUser&&(v.withUser!=sesn('USER')))||(v.withClan&&!userDoes(v.withClan))){if(j){remove(j)};return}; // not for me
            Anon.Task.jobCards.render(v);
         });
      },



      jobCards:
      {
         render:function(o, c,s,d)
         {
            let l,x; l=keys(o.comments); s=span(l); c={}; x=l.shift(); c[x]=o.comments[x]; if(s>1){x=l.pop(); c[x]=o.comments[x]};
            delete o.comments; d=0; c.each((v,k)=>
            {
               if(d<1){let pts=v.mesg.split('\n'); if(isin(pts[0],o.mesgHead)){pts.shift(); v.mesg=pts.join('\n')}};
               parsed(v.mesg,'markdown',function(p){p.info=this.dat; c[this.ref]=p;d++}.bind({ref:k,dat:v}));
            });
            wait.until(()=>{return !(d<s)},()=>
            {
               o.comments=c;
               let jcid=('#JC'+o.docketID); if(!select(jcid)){Anon.Task.jobCards.create(o,jcid);return};
               Anon.Task.jobCards.update(o,jcid);
            });
         },


         create:function(o,jcid,jico,cmnt)
         {
            cmnt=keys(o.comments)[0]; cmnt=o.comments[cmnt]; jico=((o.tagIcons||[])[0]||'note');

            select('#'+o.inColumn+'TaskList').insert
            ({
               jobcard:jcid, grabgoal:'.slabMenuBody>panl', info:o, listen:
               {
                  grablift:function(){this.enclan('.AnonCardLift')},
                  grabdrop:function(){this.declan('.AnonCardLift'); Anon.Task.jobCards.mvCard(this.info.docketID,this.parentNode.role);},
                  dblclick:function(){Anon.Task.jobCards.readMe(this.info);},
               },

               contents:
               [
                  {div:'.cardHeadPane', contents:
                  [
                     {grid:[{row:
                     [
                        {col:'.cardHeadIcon', contents:[{icon:jico}]},
                        {col:'.cardHeadText', contents:[{div:o.mesgHead}]},
                     ]}]}
                  ]},
                  {div:'.cardBodyPane', contents:cmnt},
                  {div:'.cardFootPane', contents:
                  [
                     {span:'.cardFootNick', contents:cmnt.info.nick},
                     {span:'.cardFootTime', contents:('- '+timePast(cmnt.info.time,server.ostime))},
                  ]},
               ],
            });
         },


         memory:{},


         update:function(obj,jid, slf,hsh,cmt,ico,crd)
         {
            slf=Anon.Task.jobCards; hsh=hash(obj); if(slf.memory[jid]==hsh){return}; // no update required
            cmt=keys(obj.comments)[0]; cmt=obj.comments[cmt]; ico=((obj.tagIcons||[])[0]||'note'); crd=select(jid);

            crd.select('.cardHeadIcon')[0].innerHTML=''; crd.select('.cardHeadIcon')[0].insert({icon:ico}); // head icon
            crd.select('.cardHeadText>div')[0].innerHTML=obj.mesgHead; // head text
            crd.select('.cardBodyPane')[0].innerHTML=''; crd.select('.cardBodyPane')[0].insert(cmt); // body text
            crd.select('.cardFootNick')[0].innerHTML=cmt.info.nick; // foot nick
            crd.select('.cardFootTime')[0].innerHTML=('- '+timePast(cmt.info.time,server.ostime)); // foot time
         },


         mvCard:function(dref,mvto)
         {
            purl('/Task/moveCard',{dref:dref,mvto:mvto},(r)=>
            {
               if(r.body!=':OK:'){dump(r.body); alert('something went wrong');};
            });
         },


         readMe:function(i)
         {
            popModal
            ({
               class:'AnonTaskDokt',
               info:i,
            })
            ({
               head:i.mesgHead,

               body:[{grid:[{row:
               [
                  {col:'.TaskDoktPage', contents:
                  [
                     {h2:i.mesgHead},
                  ]},
                  {col:'.TaskDoktFlap', contents:[{flap:'', goal:L, size:9, open:false, shut:true, togl:function(){}}]},
                  {col:'.TaskDoktConf', contents:
                  [

                  ]},
               ]}]}],

               foot:
               [
                  {butn:'.info', contents:'Save', onclick:function(){dump('save');}},
                  {butn:'.info', contents:'Close', onclick:function(){this.root.exit();}},
               ],
            });
         },
      },
   }
});
