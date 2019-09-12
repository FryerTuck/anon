<?
namespace Anon;
$post = knob($_POST);


# cond :: open : view modal
# ---------------------------------------------------------------------------------
	if (NAVIPATH === '/Time/openFltr')
   {
		ob_start();  // JavaScript begin .. compliment syntax highlighting
		?><script>

   	ordain('.AnonFltrModl .noWrap')({style:{width:1,padding:6,fontSize:12}});
   	ordain('.AnonFltrModl input')({style:{display:'inline-block',width:155,margin:6}});
   
		popModal({class:'AnonFltrModl', theme:'dark', size:'420x170'})
		({
			head:'workers time graph',

         body:[{grid:
         [
            {row:
            [
               {col:'.noWrap', contents:'date range'},
               {col:[{input:'', name:'fd', type:'date'},{input:'', name:'td', type:'date'}]}
            ]},
            {row:
            [
               {col:'.noWrap', contents:'users, clans'},
               {col:
               [
                  {input:'', name:'un', type:'text', placeholder:'* .. or frodo, mika'},
                  {input:'', name:'cn', type:'text', placeholder:'* .. or work .. or geek'},
               ]},
            ]},
         ]}],

         foot:
         [
            {butn:'.cool', text:'view', onclick:function()
            {
               let v={}; this.dbox.select('input').each((n)=>{v[n.name]=n.value});
               Anon.Time.exec({path:"<?=$PATH;?>",data:v}); this.root.exit();
            }},
            {butn:'', text:'cancel', onclick:function(){this.root.exit()}},
         ],
		});

             
		</script><? // JavaScript end .. strip tags to expose clean JS code

      $js=expose(ob_get_clean(),'<script>','</script>')[0];
      ekko($js);
   };
# ---------------------------------------------------------------------------------



# cond :: exec : prepare data for viewing
# ---------------------------------------------------------------------------------
	dump([$fd,$td,$un,$cn]);
# ---------------------------------------------------------------------------------
