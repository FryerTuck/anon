AnonDokt:
{
   open:function()
   {
      requires(['/Site/dcor/mrkd.js','/Site/dcor/prsm.js','/Site/dcor/mkdn.css','/Site/dcor/prsm.css'],()=>
      {

         let md='<a href="https://www.markdownguide.org/cheat-sheet/#basic-syntax" target="_blank">Markdown</a>';
         modal
         ({
            name:'#newDocket',
            head:'New Docket',

            body:
            [
               {p:'Kindly fill in your message details below and hit Create.'},
               {ul:
               [
                  {li:'You can use '+md+' syntax, but it\'s optional. Feel free to just type -or paste & edit your message.'},
                  {li:'Files you drag/drop will be inserted as dynamically linked references where you are typing.'},
                  {li:'Please be nice, else your ticket may be ignored automatically.'},
                  {li:'To preview, hit the <b>View</b> tab below.'},
               ]},
               {input:'#AnonDoktfromName', type:(userIs('.worker')?'hidden':'text'), placeholder:'nickname', required:true,
                  value:(userIs('.worker')?User('name'):''), pattern:/^[a-zA-Z][a-zA-Z0-9-_]{2,20}$/,
               },
               {input:'#AnonDoktfromAddy', type:(userIs('.worker')?'hidden':'text'), placeholder:'me@example.com', required:true,
                  value:(userIs('.worker')?User('mail'):''), pattern:/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,4})+$/,
               },
               {select:'#AnonDoktpriority', style:('display:'+(userIs('.worker')?'block':'none')), contents:
               [
                  {option:'normal'},
                  {option:'urgent'},
                  {option:'threat'},
               ]},
               {tabs:'#AnonDoktTabs', selected:0, contents:
               [
                  {Edit:
                  [
                     {textarea:'#AnonDoktmesgBody', placeholder:'enter text and drop files here', pattern:/^[\S\s]{10,12000}$/,
                        required:true,
                        target:'^2',
                        onfeed:function(v,f, n,x,self,vars)
                        {
                           x=f.rstub('.'); if(!x){alert('invalid image name: missing file-extension');return}; n=x[0]; x=x[2];
                           if(!(/^[a-zA-Z0-9_\.-]{3,40}$/).test(f)){n=md5(n); f=(n+'.'+x);}; self=this;
                           vars={type:'upload',file:f,durl:v,dref:self.dref,cref:self.cref};
                           purl({target:'/User/task/makeDokt',method:'POST',convey:vars},function()
                           {
                              let il=['jpg','jpeg','png','svg','gif','bmp']; let a=(il.hasAny(x)?'!':'');
                              self.insertAtCaret(a+'['+n+']('+f+')');
                              if(wrapOf(this.echo.body)!='{}'){fail('`'+this.purl+'` is broken','server'); return};
                              let ro=JSON.parse(this.echo.body); self.dref=ro.dref; self.cref=ro.cref;
                           });
                        },
                        onblur:function()
                        {
                        },
                     },
                  ]},
                  {View:'',
                     onshow:function()
                     {
                        var tsrc,trgt,path,text,imgl,bw,ew,mb,dr,cr; tsrc=Select('#AnonDoktmesgBody'); trgt=Select('#AnonDoktView');
                        trgt.innerHTML=''; text=(tsrc.value||'&nbsp;<br><br><br>&nbsp;'); dr=tsrc.dref; cr=tsrc.cref; bw='!['; ew=')';
                        imgl=text.expose(bw,ew); if(!imgl){imgl=[]}; path=('/User/task/list/'+dr+'/comments/'+cr); imgl.forEach((i)=>
                        {let f=(bw+i+ew); let p=i.stub(']('); let r=(bw+p[0]+']('+path+'/'+p[2]+ew); text=text.swap(f,r)});
                        Render(text,trgt,'md',()=>{});
                     },
                     contents:
                     [
                        {div:'#AnonDoktView', //onready:function(){Select('#AnonDoktmesgBody').Signal('blur')}
                        },
                     ]
                  },
               ]},
            ],

            foot:
            [
               {butn:'', contents:'Cancel', onclick:function(){Select('#modalView').Delete()}},
               {butn:'.Good', contents:'Create', onclick:function(v)
               {
                  let l=['fromName','fromAddy','priority','mesgBody']; v=VOID; v={}; let pass=true; l.Each((i)=>
                  {let n=i; let o=Select('#AnonDokt'+i); if(o.fail){pass=false; o.Signal('blur'); return STOP}; v[n]=o.value;});
                  if(!pass){return}; let mb=Select('#AnonDoktmesgBody'); v.dref=mb.dref; v.cref=mb.cref; v.type='create';
                  v.mesgHead=(window.top.document.title+'').trim(); AnonDokt.make(v,function(resp)
                  {
                     if(resp=='OK'){let mdl = Select('#modalView'); if(mdl){mdl.Delete()};  return};
                     alert(resp);
                  });
               }},
            ]
         });


      });
   },


   make:function(v,f)
   {
      purl({target:'/User/task/makeDokt',method:'POST',convey:v},function()
      {
         if(isFunc(f)){f(this.echo.body)};
      });
   },
},
