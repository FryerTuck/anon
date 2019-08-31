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

      vars:
      {
         icon:
         {
            auto:'file',
            csv:'file-excel',
            css:'file-code',
            doc:'file-word',
            docx:'file-word',
            htm:'file-code',
            html:'file-code',
            jpg:'file-picture',
            jpeg:'file-picture',
            js:'file-code',
            mp3:'file-music',
            ogg:'file-music',
            mp4:'file-video',
            gif:'file-picture',
            odf:'file-openoffice',
            pdf:'file-pdf1',
            php:'file-code',
            png:'file-picture',
            sql:'file-code',
            xls:'file-excel',
            zip:'file-zip1',
         },
      },

      init:function()
      {
         purl('/Task/dispense',(r)=>
         {
            Anon.Task.jobCards.prerun(decode.jso(r.body));
         });

         server.listen('docketUpdate',(d)=>
         {
            Anon.Task.jobCards.prerun(d);
         });
      },



      jobCards:
      {
         prerun:function(d)
         {
            let l=select('#TaskPanlSlab').select('jobcard'); (l||[]).forEach((n)=>{if(!d[n.info.docketID]){remove(n)}});
            d.each((v,k)=>{Anon.Task.jobCards.render(v);});
         },


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
            purl('/Task/openDokt',{dref:i.docketID},(r, d)=>
            {
               d=VOID; d=[{h2:i.mesgHead}]; r=decode.jso(r.body);

               r.forEach((v)=>
               {
                  let a=[]; if(!isList(v.atch)){v.atch=[]}; v.atch.forEach((f)=>
                  {
                     let x=fext(f); if(!x){x='auto'}; x=Anon.Task.vars.icon[x]; if(!x){x=Anon.Task.vars.icon.auto};
                     radd(a,{icon:'', face:x, size:16, title:f, path:`/Task/data/${i.docketID}/comments/${v.cref}/${f}`, onclick:function()
                     {Anon.Task.jobCards.viuAtc(this.path)}});
                  });
                  let p=v.mesg.split('\n'); (['# ','## ','### ','#### ']).forEach((h)=>{if(p[0].startsWith(h+i.mesgHead)){lpop(p)}});
                  v.mesg=p.join('\n');

                  radd(d,{div:'.DoktCmntWrap', contents:
                  [
                     {grid:'.DoktCmntData', contents:[{row:
                     [
                        {col:'.DoktCmntText', contents:[{div:'', format:'markdown', contents:v.mesg}]},
                        {col:'.DoktCmntAtch', contents:a},
                     ]}]},
                     {grid:'.DoktCmntInfo', contents:[{row:
                     [
                        {col:'.DoktCmntTime', contents:timeText(v.time)},
                        {col:'.DoktCmntRate', contents:
                        [
                           {div:[{icon:'triangle-up', dref:i.docketID, cref:v.cref, onclick:function()
                           {Anon.Task.jobCards.rating(this.dref,this.cref,'+',this.select('^>'))}}]},
                           {div:v.rate},
                           {div:[{icon:'triangle-down', dref:i.docketID, cref:v.cref, onclick:function()
                           {Anon.Task.jobCards.rating(this.dref,this.cref,'-',this.select('^<'))}}]},
                        ]},
                        {col:'.DoktCmntUser', contents:[{grid:[{row:
                        [
                           {col:'.DoktUserFace', contents:[{div:
                           [
                              {img:'',src:avatar(v.mail,'blank',60)},
                              {img:'',src:'/User/dcor/mug2.jpg'},
                           ]}]},
                           {col:'.DoktUserInfo', contents:[{b:v.nick},{b:v.rank}]},
                        ]}]}]},
                     ]}]},
                  ]});
               });

               popModal
               ({
                  class:'AnonTaskDokt',
                  info:i,
               })
               ({
                  head:('Docket #'+i.docketID+' - '+i.mesgHead),

                  body:[{grid:[{row:
                  [
                     {col:'.TaskDoktPage', contents:[{panl:d}]},
                     {col:'.TaskDoktFlap', contents:[{flap:'', goal:L, size:12, open:false, shut:true, togl:function(v)
                     {
                        let t=this.select('^>'); let c=lowerCase(unwrap(v)); t.declan('open','shut'); t.enclan(c);
                     }}]},
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
            });
         },


         viuAtc:function(p)
         {
            dump(`popModal for '${p}'`);
         },


         rating:function(d,c,v,n, p)
         {
            purl('/Task/voteNote',{dref:d,cref:c,vote:v},(r)=>
            {
               if(r.body!=OK){return}; n=n.childNodes[0]; p=((v=='+')?1:-1); v=((n.textContent.trim())*1); v=(v+p);
               n.textContent=v;
            });
         },
      },
   }
});
