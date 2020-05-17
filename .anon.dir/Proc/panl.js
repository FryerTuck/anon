"use strict";


requires(["/Proc/dcor/panl.css","/Proc/dcor/hack.woff"]);



select('#AnonAppsView').insert
([
   {panl:'#ProcPanlSlab', contents:
   [
      {grid:'.AnonPanlSlab', contents:
      [
         {row:
         [
            {col:'.treeMenuView', contents:
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
         });
      },


      open:function(pth, drv,tab,ttl,cnf)
      {
         drv=select('#ProcTabber').driver; ttl=(pth+'');
         tab=drv.select(ttl); if(!!tab){return};
         cnf=swap(ltrim(pth,'/$/'),'/conf','');

         purl('/Proc/openConf',{path:pth},function(rsp)
         {
             rsp=rsp.body; if(!isJson(rsp)){dump(rsp);return}; rsp=decode.jso(rsp);

             let rws=[]; rsp.each((v,k)=>{radd(rws,{row:
             [
                 {col:`.toolFeedCell .ProcConfName`, $:[{input:`#ProcConf_Name_${k} .toolTextFeed .dark`, value:k}]},
                 {col:`.toolFeedCell .ProcConfValu`, $:[{input:`#ProcConf_Valu_${k} .toolTextFeed .dark`, value:v}]},
                 {col:`.toolFeedCell .ProcConfVoid`, $:[{butn:`.toolButnTiny .harm`, icon:`cross`, title:`delete ${k}`}]},
             ]})});

             drv.create({title:ttl, contents:[{grid:
             [
                 {row:[{col:`.ProcPanlHead`, $:
                 [
                    {div:`.panlHeadBanr`, contents:
                    [
                        {b:[`Configure`]}, {span:[cnf]},
                        {butn:`.dark .cool`, text:`Add`, onclick:function()
                        {

                        }},
                        {butn:`.dark .good`, text:`Save`, onclick:function()
                        {

                        }},
                    ]}
                 ]}]},
                 {row:[{col:[{panl:`.ProcPanlBody`, $:[{grid:`.noSpanVert`, $:[rws]}]}]}]},
             ]}]});
         });
      },
   }
});
