"use strict";


requires(['/Site/dcor/aard.css']);



select('#AnonAppsView').insert
([
   {panl:'#SitePanlSlab .scrollHide'}
]);




extend(Anon)
({
   Site:
   {
      vars:
      {
          conf:deconf(`(~enconf("Site/autoConf"~)`),
      },


      anew:function(cbf)
      {
          dump("anew!"); // testing 9
      },


      init:function()
      {


         if(isPath(this.vars.conf.adminUrl))
         {
             let panl=select(`#SitePanlSlab`);
             let view=create({iframe:`#SitePanlView .spanFull`, src:this.vars.conf.adminUrl, onload:function()
             {Busy.edit('/Site/panl.js',100); signal("SiteAppReady");}});
             panl.insert(view);
             return;
         };

         popAlert(`Missing Configuration : The Site app can't work unless the config is valid.\n\n>Missing: adminUrl`);
         AnonMenu.init(`Proc`); listen(`ProcAppReady`,()=>
         {
            let tv=select('#ProcTreePanl').select('treeview')[0];
            let ti=tv.locate("$/Site"); tv.status.togl(ti);
            Anon.Proc.open("$/Site/conf/autoConf");
            Busy.edit('/Site/panl.js',100);
         });
      },
   }
});
