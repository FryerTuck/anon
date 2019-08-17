"use strict";

requires(['/Proc/dcor/panl.css']);




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
                  {row:[{col:'.slabMenuBody', contents:{panl:'#ProcToolMenu'}}]},
               ]}
            ]},
            {col:'.panlVertDlim', contents:{vdiv:''}},
            {col:
            [
               {grid:
               [
                  {row:[{col:'.slabMenuHead'}]},
                  {row:[{col:'.panlHorzLine', contents:{hdiv:''}}]},
                  {row:[{col:'.slabMenuBody', contents:{panl:'#ProcToolView'}}]},
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
            tv=select('#ProcTreeView').select('treeview');
            if(tv){tv[0].remove()}; tick.after(60,cbf);
         });
      },



      init:function()
      {
         purl('/Proc/toolMenu',(r)=>
         {
            r=decode.jso(r.body);
            r.each((i)=>
            {
               select('#ProcToolMenu').insert
               ([{
                  butn:'.procMenuButn', contents:i.split('_').join(' '), trgt:i,
                  listen:
                  {
                     click:function(){Anon.Proc.open(this.trgt);},
                     focus:function(){select('.procMenuButn').each((n)=>{n.declan('procActvButn')}); this.enclan('procActvButn');},
                  }
               }]);
            });
         });
      },


      vars:{},


      open:function(n, tn,et)
      {
         (select('.procActvTool')||[]).each((n)=>{n.style.display='none'});
         tn=('#ProcTool_'+n); et=select(tn); if(et){et.style.display='block';return};
         purl(('/Proc/userTool/'+n+'/init'),(r)=>
         {
            document.head.insert([{script:'',innerHTML:r.body}]);
         });
      },
   }
});
