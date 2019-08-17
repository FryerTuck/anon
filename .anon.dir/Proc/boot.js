"use strict";


// defn :: conf : front-end configuration
// --------------------------------------------------------------------------------------------------------------------------------------------
   const conf = // object
   {
      {:'/Proc/conf/viewConf':}
   };
// --------------------------------------------------------------------------------------------------------------------------------------------



// defn :: view : structure
// --------------------------------------------------------------------------------------------------------------------------------------------
   select('body')[0].insert
   ([
      {div:'#anonMarkView .view', style:'overflow:hidden; opacity:0.1', contents:
      [
         // {img:'.cenmid', src:'/Proc/dcor/mark.svg'}
      ]},
      {div:'#anonMainView .view'},
      {div:'#anonPanlView', style:('position:fixed; display:block; width:100%; overflow:hidden; z-index:9990; display:none')},
      {div:'#anonModlView .view', style:'display:none'},
      {div:'#anonNoteView .view', style:'display:none'},
   ]);
// --------------------------------------------------------------------------------------------------------------------------------------------



// load :: auto : boot any other front-end features
// --------------------------------------------------------------------------------------------------------------------------------------------
   (function(l)
   {
      l=decode.JSON(('{:bootList:}'||'[]')); requires(l,()=>
      {
         let np=pathOf(location.href); render(np,(r)=>
         {
            let mv=select('#anonMainView'); mv.insert(r);
         });
      });
   }());
// --------------------------------------------------------------------------------------------------------------------------------------------
