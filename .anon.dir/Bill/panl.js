"use strict";


requires(["/Bill/bits/aard.css"]);



select("#AnonAppsView").insert
([
   {panl:"#BillPanlSlab", contents:
   [
      {grid:".AnonPanlSlab", contents:
      [
         {row:
         [
            {col:".sideMenuView", contents:
            [
               {grid:
               [
                  {row:[{col:".slabMenuHead", contents:"Bill"}]},
                  {row:[{col:".panlHorzLine", contents:[{hdiv:""}]}]},
                  {row:[{col:'.slabMenuBody', contents:[{grid:
                  [
                     {row:[{col:'#BillToolView', contents:[{panl:'#BillToolPanl .sideMenuToolPanl', contents:
                     [
                         {butn:'.longMenuButn', tool:"makeFirm", text:"Add Company", onclick:function(){Anon.Bill.tool[this.tool]()}},
                     ]}]}]},
                     {row:[{col:'.panlHorzLine', contents:[{hdiv:''}]}]},
                     {row:[{col:'#BillTreeView', contents:[{panl:'#BillTreePanl', contents:
                     [
                        {treeview:'', source:'/User/treeMenu', uproot:true, listen:
                        {
                           'LeftClick':function(evnt)
                           {
                              let ctrl=evnt.ctrlKey; let shft=evnt.shiftKey;
                              if(ctrl||shft){evnt.stopImmediatePropagation(); evnt.preventDefault(); evnt.stopPropagation();};
                              Anon.Bill.open(this.info.path,this.info.type,(ctrl?'ctrl':(shft?'shft':VOID)));
                           },
                        }}
                     ]}]}]},
                  ]}]}]},
               ]}
            ]},
            {col:".panlVertDlim", role:"gridFlex", axis:X, target:"<", contents:[{vdiv:""}]},
            {col:
            [
               {grid:
               [
                  {row:[{col:"#BillHeadView .slabViewHead", contents:[{tabber:"#BillTabber", theme:".dark", target:"#BillBodyPanl"}]}]},
                  {row:[{col:".panlHorzLine", contents:[{hdiv:""}]}]},
                  {row:[{col:".slabViewBody", contents:[{panl:"#BillBodyPanl"}]}]},
               ]}
            ]},
         ]}
      ]}
   ]}
]);




extend(Anon)
({
   Bill:
   {
      vars:
      {
          conf:deconf(`(~enconf("Bill/autoConf"~)`),
          anon:decode.jso(`(~knob("$/Bill/tmpl/conf"~)`),
      },


      anew:function(cbf)
      {
      },


      init:function()
      {
         Busy.edit("/Bill/panl.js",100); signal("BillAppReady");
         let nu=[]; this.vars.conf.each((v,k)=>{if(v==this.vars.anon[k]){radd(nu,k)}});
         if(nu.length<1){return}; nu=nu.join(", "); // all is well

         popAlert(`Missing Configuration : Billing can't work unless all your company details are set.\n\n>Missing: ${nu}`);
         AnonMenu.init(`Proc`); listen(`ProcAppReady`,()=>
         {
            let tv=select('#ProcTreePanl').select('treeview')[0];
            let ti=tv.locate("$/Bill"); tv.status.togl(ti);
            Anon.Proc.open("$/Bill/conf/autoConf");
         });
      },


      conf:
      {

      },


      tool:
      {
          makeFirm:function()
          {

          },
      },


      open:function(p)
      {
         dump("TODO :: Bill.open "+p);
      },
   }
});
