
   extend(parser)
   ({
      image:function(d,f)
      {
         let n=create({img:'',src:d}); n.rectInfo((i)=>
         {
            n.width=i.width; n.height=i.height; let pp,ps,pm; pp=conf.protectImgPath; ps=conf.protectImgSize; pm=conf.protectImgMark; // set vars
            if(!pp||!ps||!pm){f(n);return}; // no protection .. all 3 these must be defined and valid
            if(!isList(pp)){pp=[pp];}; let pe=0; let ppm=FALS;  pp.forEach((pi)=>{if(!isText(pi,2)){pe=1}else if(akin(d.path,pi)){ppm=TRUE}});
            if(pe){fail('invalid protectImgPath value in viewConfig');return}; if(!ppm){f(n);return}; // no protetion
            if(!isKnob(ps)||!isInum(ps.w)||!isInum(ps.h)){fail('invalid protectImgSize value in viewConfig');return}; // validate
            if(!isPath(pm)&&!isKnob(pm)){fail('invalid protectImgMark value in viewConfig');return}; // validate
            if((i.width<=ps.w)&&(i.height<=ps.h)){f(n);return}; // no protection for this image's dimensions
            n.impose(pm,f);
         });
      },


      markdown:function(d,f)
      {
         requires
         ([
            '/User/dcor/icon.fnt','/Proc/libs/marked/marked.js','/Proc/libs/marked/marked.css',
            '/Proc/libs/prism/prism.js','/Proc/libs/prism/prism.css'
         ],()=>
         {
            marked(d,{gfm:true,breaks:true},function(e,r)
            {
               if(e){throw (e); return}; let n,p,c,h; h=('#MD'+hash());
               let el=expose(r,':',':',/^[a-z]+$/);
               (el||[]).forEach((en)=> // check for emoji
               {let ef=(':'+en+':'); let er=('<i class="icon-'+en+'"></i>'); r=r.split(ef).join(er);}); // implement emoji

               n=create({div:(h+' .markdown-body'),contents:r});

               (n.select('[class^="language-"], [class*=" language-"]')||[]).forEach((i)=>
               {p=(i.className+'').trim(); c='line-numbers'; if(!isin(p,c)){i.className=(p+' '+c).trim();};});
               Prism.highlightAllUnder(n); f(n);
            });
         });
      },


      html:function(d,f)
      {
         f(xdom(d));
      },
   });
