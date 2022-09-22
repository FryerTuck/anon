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
                  {row:[{col:'.slabMenuHead', contents:'done'}]},
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
            Busy.edit('/Task/panl.js',100);
         });

         server.listen('docketUpdate',(d)=>
         {
            Anon.Task.jobCards.prerun(decode.jso(d));
         });

         server.listen('docketDelete',(d)=>
         {
            remove(`#JC${d}`); Busy.edit(`delete${d}`,100);
         });

         server.listen('docketReturn',(d)=>
         {
            remove(`#JC${d}`); Busy.edit(`return${d}`,100);
         });

         server.listen('docketFinish',(d)=>
         {
            remove(`#JC${d}`);
            popAlert(`flag-checkered :: Completed : ### Job done :cool:\n>${d}`);
         });
      },



      jobCards:
      {
         memory:{},

         prerun:function(d)
         {
            // (select('#TaskPanlSlab').select('jobcard')||[]).forEach((n)=>{if(!d[n.info.docketID]){remove(n)}});
            d.each((v,k)=>
            {
               let jc=select('#JC'+v.docketID);
               if(v.withClan&&!isin(v.withClan,sesn('CLAN').split(','))&&(v.fromUser!=sesn('USER'))){remove(jc); return NEXT};
               if(v.withUser&&(v.withUser!=sesn('USER'))){remove(jc); return NEXT};
               if(!v.withUser&&(v.fromUser!=sesn('USER'))){v.inColumn='todo'};
               Anon.Task.jobCards.render(v);
            });
         },



         render:function(o, c,s,d)
         {
            let l,x; l=keys(o.comments); s=span(l); c={}; x=l.shift(); c[x]=o.comments[x]; if(s>1){x=l.pop(); c[x]=o.comments[x]};
            o.mesgHead=decode.b64(o.mesgHead); delete o.comments; d=0;
            c.each((v,k)=>
            {
               v.mesg=decode.b64(v.mesg); v.mesg=trim(v.mesg); v.mesg=trim(v.mesg,"<br>"); v.mesg=trim(v.mesg,"<br />");
               v.mesg=trim(v.mesg); if(d<1){let pts=(stub(v.mesg,"\n")||[0]); if(isin(pts[0],o.mesgHead)){v.mesg=pts[2]}};
               if(isHtml(v.mesg)){c[k]=v}
               else{ dump(v.mesg); parsed(v.mesg,'markdown',function(p){p.info=this.dat; c[this.ref]=p;d++}.bind({ref:k,dat:v}))};
            });
            wait.until(()=>{return !(d<s)},()=>
            {
               o.comments=c;
               let jcid=('#JC'+o.docketID); if(!select(jcid)){Anon.Task.jobCards.create(o,jcid)}
               else{Anon.Task.jobCards.update(o,jcid)};
            });
         },



         create:function(o,jcid,jico,cmnt,lane)
         {
            cmnt=keys(o.comments)[0]; cmnt=o.comments[cmnt]; jico=((o.tagIcons||[])[0]||'note'); lane=select('#'+o.inColumn+'TaskList');
            if(!cmnt||!cmnt.info){console.log("no comment .. ticket skipped"); return};

            lane.insert
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

            lane.assort();
         },



         update:function(obj,jid, slf,hsh,cmt,ico,crd)
         {
            slf=Anon.Task.jobCards; hsh=hash(obj); if(slf.memory[jid]==hsh){return}; // no update required
            cmt=keys(obj.comments)[0]; cmt=obj.comments[cmt]; ico=((obj.tagIcons||[])[0]||'note'); crd=select(jid);

            crd.select('.cardHeadIcon')[0].innerHTML=''; crd.select('.cardHeadIcon')[0].insert({icon:ico}); // head icon
            crd.select('.cardHeadText>div')[0].innerHTML=obj.mesgHead; // head text
            crd.select('.cardBodyPane')[0].innerHTML=''; crd.select('.cardBodyPane')[0].insert(cmt); // body text
            crd.select('.cardFootNick')[0].innerHTML=cmt.info.nick; // foot nick
            crd.select('.cardFootTime')[0].innerHTML=('- '+timePast(cmt.info.time,server.ostime)); // foot time
            crd.info=obj; crd.parentNode.assort();
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
            Busy.edit("/Task/openDokt",1);
            purl('/Task/openDokt',{dref:i.docketID},(r, d)=>
            {
               d=VOID; d=[{h2:i.mesgHead}]; r=decode.jso(r.body);

               r.forEach((v)=>
               {
                  let a=[]; if(!isList(v.atch)){v.atch=[]};
                  if(span(v.atch)>0){radd(a,{icon:'floppy-disk', class:'DoktAtchKnob', size:16, title:'save attached', onclick:function()
                  {Anon.Task.jobCards.savAtc(this.parentNode.attached);}})};
                  v.atch.forEach((f)=>
                  {
                     let x=fext(f); if(!x){x='auto'}; x=Anon.Task.vars.icon[x]; if(!x){x=Anon.Task.vars.icon.auto};
                     radd(a,{icon:'', face:x, size:16, hint:{peek:`/Task/data/${i.docketID}/comments/${v.cref}/atch/${f}`}});
                  });
                  let p=v.mesg.split('\n'); let mkdn=1;
                  (['# ','## ','### ','#### ']).forEach((h)=>{if(p[0].startsWith(h+i.mesgHead)){lpop(p)}}); v.mesg=p.join('\n');
                  if(isHtml(v.mesg)){mkdn=0; v.mesg=(`<div style="padding:10px; font-size:13px">`+v.mesg+`</div>`)};

                  radd(d,{div:'.DoktCmntWrap', contents:[{grid:'', contents:[{row:
                  [
                     {col:'.DoktCmntData', contents:
                     [
                        {div:'.DoktCmntText', format:(mkdn?"markdown":VOID), contents:v.mesg},
                        {grid:'.DoktCmntInfo', contents:[{row:
                        [
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
                                 {img:'',src:'/User/dcor/mug2.jpg'},
                                 {img:'',src:avatar(v.mail,'blank',60)},
                              ]}]},
                              {col:'.DoktUserInfo', contents:[{b:v.nick},{span:v.mail},{span:(v.repu+'')}]},
                           ]}]}]},
                           {col:''},
                           {col:'.DoktCmntMade', contents:[{span:timeText(v.time)},{b:v.firm}]},
                        ]}]},
                     ]},
                     {col:'.DoktCmntAtch', attached:{path:`/Task/data/${i.docketID}/comments/${v.cref}/atch`,data:v.atch}, contents:a},
                  ]}]}]});
               });

               radd(d,{div:'.DoktCmntWrap', contents:[{grid:'#DoktMakeCmnt', dref:i.docketID, contents:[{row:
               [
                  {col:'.DoktCmntData', contents:
                  [
                     {textarea:'.DoktCmntMake', placeholder:'write some comment'},
                  ]},
                  {col:'.DoktCmntAtch', contents:
                  [
                     {icon:'attachment', class:'DoktAtchKnob', size:16, title:'attach files', onclick:function()
                     {
                        let il=Anon.Task.vars.icon; Anon.Task.jobCards.attach((al)=>
                        {
                           this.parentNode.attached=al; al.each((v,k)=>
                           {let x=(il[fext(k)]||il.auto); this.parentNode.insert({icon:x,title:k})});
                        });
                     }}
                  ]},
               ]}]}]});

               radd(d,{small:[{i:
               [
                  'TIP : If you want your comment automatially sent via email, begin the comment with:<br>'+
                  '&nbsp; e.g.&nbsp; " #jane@example.com " &nbsp; -without the quotes; this is the very first text on its own line;<br>'+
                  '&nbsp; this tag will not appear in the comment -or in the email message at all.'
               ]}]});

               let c=[{h4:``, style:{marginTop:0}, $:[{icon:`cog`},{span:'Docket Config'}]},{div:``,$:`#${i.docketID}`}];
               let q=keys(i).sort(); q.forEach((k)=>
               {
                  if(isin(`docketID editTime initTime comments destAddy editLogs tagIcons workflow`,k)){return}; // not for config
                  let v=i[k]; radd(c,{input:'.toolTextFeed .dark', type:'text', placeholder:k, title:k, inival:v, value:v});
               });

               radd(c,{grid:`.DoktConfButnGrid`, $:
               [
                   {row:
                   [
                      {col:[{butn:'.good', contents:'Save', onclick:function(){Anon.Task.jobCards.config.save(this.root.select('grid')[0])}}]},
                      {col:[{butn:'.cool', contents:'Undo', onclick:function(){Anon.Task.jobCards.config.undo(this.root.select('grid')[0])}}]},
                   ]},
                   {row:
                   [
                      {col:[{butn:'.need', contents:'Return', onclick:function(){Anon.Task.jobCards.config.ject(this.root.select('grid')[0])}}]},
                      {col:[{butn:'.harm', contents:'Delete', onclick:function(){Anon.Task.jobCards.config.void(this.dbox)}}]},
                   ]},
               ]});

               popModal({class:'AnonTaskDokt',info:i, onidle:function()
               {
                  let te=this.select('.TaskDoktConf')[0];
                  te.reclan('shut:open'); tick.after(10,()=>{te.reclan('open:shut');});
                  tick.after(250,()=>{Busy.done();});
               }})
               ({
                  head:(i.mesgHead||`(no subject)`),

                  body:[{grid:'', contents:[{row:
                  [
                     {col:'.TaskDoktPage', contents:[{panl:d}]},
                     {col:'.TaskDoktPage', contents:[{panl:[]}]},
                     {col:'.TaskDoktFlap', contents:[{flap:'', goal:L, size:12, open:false, shut:true, togl:function(v)
                     {let t=this.select('^>'); let c=lowerCase(unwrap(v)); t.declan('open','shut'); t.enclan(c);}}]},
                     {col:'.TaskDoktConf .shut', contents:[{panl:[c]}]},
                  ]}]}],

                  foot:
                  [
                     {butn:'.auto', contents:'Done', onclick:function()
                     {
                        let ncwe=this.root.select('#DoktMakeCmnt'); let ncev=ncwe.select('.DoktCmntMake')[0].value;
                        if(ncev.trim().length<1){this.root.exit(); return}; Anon.Task.jobCards.mkCmnt(ncwe,()=>{this.root.exit();});
                     }},
                  ],
               });

               Busy.edit("/Task/openDokt",100);
            });
         },



         rating:function(d,c,v,n, p)
         {
            purl('/Task/voteNote',{dref:d,cref:c,vote:v},(r)=>
            {
               if(r.body!=OK){alert(r.body); return}; n=n.childNodes[0]; p=((v=='+')?1:-1);
               v=((n.textContent.trim())*1); v=(v+p); n.textContent=v;
            });
         },



         config:
         {
            save:function(m, l,o,j,k,v)
            {
               l=m.select('.TaskDoktConf')[0].select('input'); o={}; o.dref=m.info.docketID; j=select('#JC'+o.dref); l.forEach((n)=>
               {v=n.value;k=n.placeholder; if(n.inival==v){return}; if((k=='business')&&!v){v='Unknown Company Name'}; o[k]=v; j.info[k]=v});
               purl('/Task/saveConf',o,(r)=>
               {
                  if(r.body!=OK){fail(r.body);};
               });
            },


            undo:function(d, l)
            {
               l=d.select('.TaskDoktConf')[0].select('input');
               l.forEach((n)=>{n.value=n.inival});
            },


            ject:function(d, di,dr,wl,wf,lu,un,um,dm)
            {
               di=d.info; dr=di.docketID; wl=di.workflow.split("\n"); wf=dupe(wl);
               do{lu=lpop(wf);}while((wf.length>0)&&isin(lu,sesn(`MAIL`)));
               lu=lu.split("\t"); lu={time:(lu[0]*1),name:lu[1],mail:lu[2]}; um=userInfo(lu.name).mail;
               un=lu.name; if((wf.length<1)||(sesn(`MAIL`)==um)){un=`yourself`};
               dm=(um?"TODO":`email (${lu.mail})`);

               popModal({size:`420x255`})
               ({
                  head:`backward :: Confirm`,
                  body:[{panl:
                  [
                     {div:``, format:`markdown`, $:
                     `
                        ### Really return this docket?
                        >It will return to **${un}** as ${dm}
                     `},
                     {textarea:`#TaskJectMesg`, demo:`type return message here`}
                  ]}],
                  foot:
                  [
                     {butn:`.need`, text:`Return`, vars:{dref:dr,user:un,mail:lu.mail,trgt:dm}, onclick:function(e,x,v)
                     {
                        v=this.vars; x=v.dref;  v.mesg=trim(select(`#TaskJectMesg`).value);
                        if(span(v.mesg)<1){popAlert(`A return message is required`);return};
                        Busy.edit(`return${x}`,30);
                        purl(`/Task/jectDokt`,v,(r)=>
                        {
                           this.root.exit(); r=r.body;
                           if(r!=OK){Busy.edit(`return${x}`,100); dump(`Could not return docket: ${x}\n\n>${r}`);return};
                           Busy.edit(`return${x}`,60); wait.until(()=>{return !select(`#JC${x}`)},()=>{d.root.exit()});
                        });
                     }},
                     {butn:`Cancel`},
                  ],
               });
            },


            void:function(d)
            {
               popConfirm(`### Really delete this docket?\n\n>This action cannot be undone`)
               ({
                  'harm::Delete':function(e,x)
                  {
                     x=d.info.docketID; Busy.edit(`delete${x}`,30);
                     purl('/Task/voidDokt',{dref:x},(r)=>
                     {
                        this.root.exit(); r=r.body;
                        // dump("testicles 1,2");
                        if(r!=OK){Busy.edit(`delete${x}`,100); fail(`Could not delete docket: ${x}\n\n>${r}`);return};
                        Busy.edit(`delete${x}`,60); wait.until(()=>{return !select(`#JC${x}`)},()=>{d.root.exit()});
                     });
                  },
               });
            },
         },



         savAtc:function(ad, cb)
         {
            cb=function(sp,mo)
            {
               ad.dest=sp; purl('/Task/saveAtch',ad,(r)=>{r=r.body; if(r!=OK){alert(r);return};mo.exit()});
            };

            popModal({class:'DoktCmntModl AtchSavePanl',theme:'dark'})
            ({
               head:'Save attachments',
               body:[{slab:[{grid:
               [
                  {row:[{col:'.AtchSavePath', style:{height:1}, contents:[{input:'', type:'text', value:'~'}]}]},
                  {row:[{col:
                  [
                     {panl:
                     [
                        {treeview:'', source:'/User/treeMenu', filter:{type:'fold,plug'}, uproot:true, listen:
                        {
                           'LeftClick':function()
                           {
                              if(!this.info.kids){return}; let i=this.info; let v=i.path;
                              this.info.root.main.select('.AtchSavePath>input')[0].value=v;
                           },
                        }}
                     ]}
                  ]}]}
               ]}]}],


               // body:[{grid:
               // [
               //    {row:[{col:'.AtchSavePath', contents:[{input:'', type:'text', value:'~'}]}]},
               //    {row:[{col:'.AtchSaveTree', contents:[{panl:[]}]}]},
               // ]}],


               foot:[{butn:'', contents:'Done', onclick:function()
               {
                  cb(this.root.select('.AtchSavePath>input')[0].value,this.root);
               }}],
            });
         },



         attach:function(cb)
         {
            popModal({class:'DoktCmntModl CmntAtchPanl',theme:'dark'})
            ({
               head:'Attach files to comment',
               body:[{grid:[{row:
               [
                  {col:'.CmntAtchMenu', contents:[{panl:
                  [
                     {treeview:'', source:'/User/treeMenu', uproot:true, draggable:true},
                  ]}]},
                  {col:'.CmntAtchView', contents:[{panl:
                  [
                     {dropzone:'', onfeed:function(fd,fn)
                     {
                        let tn,il,fx,fi; tn=this.select('^2 >'); if(!tn.attached){tn.attached={}}; il=Anon.Task.vars.icon;
                        if(!!tn.attached[fn]){alert(`duplicate filename "${fn}"\ntry rename it then try again, or choose another`);return};
                        tn.attached[fn]=fd; fx=fext(fn); fi=(il[fx]||il.auto);
                        tn.select('panl')[0].insert({icon:`.hybrid`, face:fi,text:fn});
                     }},
                  ]}]},
                  {col:'.CmntAtchList', contents:[{panl:[{b:'Attachments'}]}]},
               ]}]}],
               foot:[{butn:'', contents:'Done', onclick:function()
               {
                  cb(this.root.select('.CmntAtchList')[0].attached||{}); this.root.exit();
               }}],
            });
         },



         mkCmnt:function(g,f)
         {
            let dr,mt,af; dr=g.dref; mt=g.select('.DoktCmntMake')[0].value; af=g.select('.DoktCmntAtch')[0].attached;
            purl('/Task/makeCmnt',{dref:dr,mesg:(mt+'').trim(),atch:af},(r)=>
            {
               r=r.body; if(r!=OK){alert(r);return}; f();
            });
         },
      },
   }
});
