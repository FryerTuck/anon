
   extend(parser)
   ({
      image:function(d,f)
      {
         // let b=decode.BLOB({mime:d.head.ContentType,data:d.body});
         // let s=URL.createObjectURL(b);
         f(create({img:"",src:d.body}));
      },



      markdown:function(d,f)
      {
         if(d&&d.body){d=d.body};
         requires
         ([
            'marked:/Proc/libs/marked/marked.js','/Proc/libs/marked/marked.css',
            '/Proc/libs/prism/prism.js','/Proc/libs/prism/prism.css'
         ],()=>
         {
            wait.until(()=>{return (((typeof marked)!='undefined')&&((typeof Prism)!='undefined'))},()=>
            {
               d=d.split("\n\n\n\n").join("\n\n<br><br>\n\n");
               d=d.split("\n\n\n").join("\n\n<br>\n\n");
               d=d.split("\n\n\n\n").join("\n\n");

               let dl,cb,li,tl; dl=d.split("\n"); dl.forEach((l,x)=>
               {
                   tl="";  tl=(l+"").trim(); if(!tl){li=0; return};  if(tl.startsWith("```")){cb=(cb?0:1); return};
                   if(cb){return}; if(tl.startsWith("- ")){li=1; dl[x]=tl; return}; if(!li){return};
                   if(!tl.startsWith("- ")){dl[(x-1)]+=` ${tl}`; dl[x]=""};
               });
               let ul=[]; dl.forEach((l)=>{radd(ul,l)}); d=ul.join("\n");

               marked(d,{gfm:true,breaks:true},function(e,r)
               {
                  if(e){throw (e); return}; let n,p,c,h; h=('#MD'+hash());
                  let el=expose(r,':',':',/^[a-zA-Z0-9\-]+$/);
                  (el||[]).forEach((en)=> // check for emoji
                  {let ef=(':'+en+':'); let er=('<i class="icon-'+en+'" style="font-size:1.2em"></i>'); r=r.split(ef).join(er);}); // implement emoji

                  n=create({div:(h+' .markdown-body'),contents:r});

                  (n.select('[class^="language-"], [class*=" language-"]')||[]).forEach((i)=>
                  {p=(i.className+'').trim(); c='line-numbers'; if(!isin(p,c)){i.className=(p+' '+c).trim();};});
                  Prism.highlightAllUnder(n); f(n);
               });
            });
         });
      },


      plain:function(d,f)
      {
         if(d&&d.body){d=d.body};
         f(create({pre:".spanFull", $:d}));
      },


      html:function(d,f)
      {
         if(d&&d.body){d=d.body};
         if(!isin(d,"</html>")){f(xdom(d));return};
         f(create({iframe:`.posAbs .spanFull`, srcdoc:d}));

      },



      javascript:function(d,f)
      {
         if (d.body){d=d.body}; d=(""+d).trim();
         if(d.endsWith(";")){d=d.slice(0,(d.length-2))};
         if
         (
             (d.startsWith("(") && d.endsWith(")")) ||
             (d.startsWith("[") && d.endsWith("]")) ||
             (d.startsWith("{") && d.endsWith("}"))
         )
         {
             let resl = (Function(` try{ return ( ${d} ); }catch(fail){ moan(fail); return fail; } `))();
             f(resl); return;
         };

         let n = {script:d};
         n = create(n);
         document.head.insert(n);
         tick.after(150,f);
      },
   });
