

select('#DataToolPanl').insert
([
   {butn:'.AnonToolButn', style:"font-size:20px", icon:'database1 tl:arrow-right2', title:'import from file', onclick:function(){Anon.Data.tool.import()}},
   {butn:'.AnonToolButn', style:"font-size:20px", icon:'database1 br:arrow-down2', title:'export to file', onclick:function(){Anon.Data.tool.export()}},

   {div:'.panlHorzLine', contents:[{hdiv:''}]},
]);



Anon.Data.tool.import = function()
{
   todo("import data");
};



Anon.Data.tool.export = function()
{
   todo("export data");
};
