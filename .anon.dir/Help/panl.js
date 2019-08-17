"use strict";


requires(['/Help/dcor/aard.css']);



select('#AnonAppsView').insert
([
   {panl:'#HelpPanlSlab', contents:
   [
      {grid:'.AnonPanlSlab', contents:
      [
         {row:
         [
            {col:'.treeMenuView', contents:
            [
               {grid:
               [
                  {row:[{col:'.slabMenuHead', contents:'help'}]},
                  {row:[{col:'.panlHorzLine', contents:{hdiv:''}}]},
                  {row:[{col:'.slabMenuBody', contents:{panl:'#HelpTreeMenu'}}]},
               ]}
            ]},
            {col:'.panlVertDlim', role:'gridFlex', axis:X, target:'<', contents:{vdiv:''}},
            {col:
            [
               {grid:
               [
                  {row:[{col:'#HelpHeadView .slabViewHead', contents:[{tabber:'#HelpTabber', tabStyle:'.tabsDark', target:'#HelpBodyPanl'}]}]},
                  {row:[{col:'.panlHorzLine', contents:{hdiv:''}}]},
                  {row:[{col:'.slabViewBody', contents:{panl:'#HelpBodyPanl'}}]},
               ]}
            ]},
         ]}
      ]}
   ]}
]);




extend(Anon)
({
   Help:
   {
      anew:function(cbf)
      {
         select('#HelpTabber').closeAll((tv)=>
         {
            tv=select('#HelpTreeMenu').select('treeview');
            if(tv){tv[0].remove()}; tick.after(60,cbf);
         });
      },



      init:function()
      {
server.listen('testing',function()
{
   dump('yup, server events are working');
});
         select('#HelpTreeMenu').insert
         ([
            {treeview:'', source:'/Help/treeMenu', uproot:true, listen:
            {
               'LeftClick':function()
               {
                  if(this.info.type=='fold'){return};
                  Anon.Help.open(this.info.path);
               },
            }}
         ]);
      },


      open:function(pth, drv,tab,ttl)
      {
         drv=select('#HelpTabber').driver; ttl=(pth+'');
         if(ttl.startsWith('/Help/data/')){ttl=stub(ttl,'/Help/data/'); ttl=ttl[2]};
         if(ttl.endsWith('.md')){ttl=ttl.split('.'); ttl.pop(); ttl=ttl.join('.')};
         tab=drv.select(ttl); if(!!tab){return};

         purl('/Help/openFile',{path:pth},function(rsp)
         {
            parsed(rsp.body,'markdown',(obj)=>
            {
               drv.create({title:ttl, contents:[{panl:'.HelpViewPanl', contents:[obj]}]});
            });
         });
      },
   }
});
