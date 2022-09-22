"use strict";


requires(["/Proc/dcor/panl.css","/Site/dcor/hack.woff"]);



select('#AnonAppsView').insert
([
   {panl:'#ProcPanlSlab', contents:
   [
      {grid:'.AnonPanlSlab', contents:
      [
         {row:
         [
            {col:'.sideMenuView', contents:
            [
               {grid:
               [
                  {row:[{col:'.slabMenuHead', contents:'proc'}]},
                  {row:[{col:'.panlHorzLine', contents:{hdiv:''}}]},
                  {row:[{col:'.slabMenuBody', contents:{panl:'#ProcTreePanl'}}]},
               ]}
            ]},
            {col:'.panlVertDlim', role:'gridFlex', axis:X, target:'<', contents:{vdiv:''}},
            {col:
            [
               {grid:
               [
                  {row:[{col:'#ProcHeadView .slabViewHead', contents:[{tabber:'#ProcTabber', theme:'.dark', target:'#ProcBodyPanl'}]}]},
                  {row:[{col:'.panlHorzLine', contents:{hdiv:''}}]},
                  {row:[{col:'.slabViewBody', contents:{panl:'#ProcBodyPanl'}}]},
               ]}
            ]},
         ]}
      ]}
   ]}
]);




extend(Anon)
({
   Proc:
   {
      vars:{propIndx:0},



      anew:function(cbf)
      {
         select('#ProcTabber').closeAll((tv)=>
         {
            tv=select('#ProcTreeMenu').select('treeview');
            if(tv){tv[0].remove()}; tick.after(60,cbf);
         });
      },



      init:function()
      {
         select('#ProcTreePanl').insert
         ([
            {treeview:'#ProcTreeMenu', source:'/Proc/treeMenu', listen:
            {
               'LeftClick':function()
               {
                  if(this.info.type=='fold'){return};
                  Anon.Proc.open(this.info.path);
               },
            }}
         ]);

         select('#ProcTreePanl').select('treeview')[0].listen('loaded',ONCE,()=>
         {
            Busy.edit('/Proc/panl.js',100);
            signal("ProcAppReady");
         });
      },


      open:function(pth, drv,tab,ttl,cnf,fln,nme)
      {
         drv=select('#ProcTabber').driver; ttl=(pth+'');
         tab=drv.select(ttl); if(!!tab){return};
         cnf=swap(ltrim(pth,'/$/'),'/conf','');
         fln=stub(cnf,"/")[2];
         nme=swap(cnf,"/","_");
         nme=swap(nme,"$","_");

         purl('/Proc/openConf',{path:pth},function(rsp)
         {
             drv.create({title:ttl, contents:[{grid:
             [
                 {row:[{col:`.ProcPanlHead`, $:
                 [
                    {div:`.panlHeadBanr`, contents:
                    [
                        {b:[`Configure`]}, {span:[cnf]},
                        {butn:`.dark .cool`, text:`Add`, confName:nme, fileName:fln, onclick:function()
                        {
                            let c,n,g,s,z,k; c=c=this.confName; n=this.fileName; g=select(`#ProcConfGrid_`+c);
                            s=span(listOf(g.childNodes)); z=(!s?0:g.lastChild.select(`input.ProcConfName`)[0].value);
                            k=((!s||!isNaN(z))?s:("prop"+(s+1))); Anon.Proc.radd({[k]:""},c,k);
                        }},
                        {butn:`.dark .good`, text:`Save`, confName:nme, confPath:pth, onclick:function()
                        {
                            Anon.Proc.save(this.confName,this.confPath);
                        }},
                     ]}
                  ]}]},
                  {row:[{col:[{panl:`.ProcPanlBody`, $:
                  [
                      {grid:`#ProcConfGrid_${nme} .noSpanVert`, confName:nme, onready:function()
                      {
                        rsp=rsp.body; if(!isJson(rsp)){dump(rsp);return};
                        Anon.Proc.radd(decode.jso(rsp),this.confName);
                      }}
                  ]}]}]},
             ]}]});
         });
      },


      radd:function(o,c, g,n)
      {
         g=select(`#ProcConfGrid_${c}`); o.each((v,k)=>
         {
            n=(`#ProcConfItem_`+fash());

            g.insert({row:n, $:
            [
               {col:`.toolFeedCell .ProcConfName`, $:[{input:`.ProcConfName .toolTextFeed .dark`, demo:`name`, value:k}]},
               {col:`.toolFeedCell .ProcConfValu`, $:[{input:`.ProcConfValu .toolTextFeed .dark`, demo:`value`, value:v}]},
               {col:`.toolFeedCell .ProcConfVoid`, $:[{butn:`.toolButnTiny .harm`, icon:`cross`, trgt:n, onclick:function()
               {
                  remove(select(this.trgt));
               }}]},
            ]});
         });
         return n;
      },


      save:function(c,p, g,d,l,w,r)
      {
         g=select(`#ProcConfGrid_${c}`); d={}; l=[`""`,`''`,"``",`[]`,`{}`];
         listOf(g.childNodes.forEach((n)=>
         {
            let k=trim(n.select(`input.ProcConfName`)[0].value);
            let v=sval(n.select(`input.ProcConfValu`)[0].value);
            let w=wrapOf(v); if(!w&&isin(v,[":"])&&isNaN(k)){v=`"${v}"`};
            d[k]=v;
         }));

         r=(isObja(d)?vals(d):d.unify(": ")).join("\n");

         purl(`/Proc/saveConf`,{path:p,bufr:encode.b64(r)},(rsp)=>
         {
            rsp=rsp.body; if(rsp!=OK){dump(rsp)};
            popModal({skin:`dark`,size:`300x150`,time:4})
            ({
               head:`System Configuration`,
               body:`Saved successfully`,
            });
         });
      },
   }
});
