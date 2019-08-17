<?
namespace Anon;



# tool :: Code : assistance
# ---------------------------------------------------------------------------------------------------------------------------------------------
   class Code
   {
      static $meta;


      static function treeMenu()
      {
         $u=user('name'); $h="/User/data/$u/home";

         if(!isee("$h/root"))
         {
            $b=conf('Code/forkName'); if(!is_funnic($b)){fail("invalid branch name in Code config");};
            if(!isRepo('/')){repo::create('/'); wait(50);}; repo::cloned('/',"$h/root",$b,user('name'));
         };

         $r=path::tree($h); dump($r);
      }


      static function openFile()
      {
         $v=knob($_POST); $p=$v->path; $x=$v->plug; $v=$v->view;
         if(!$x&&!$v){expect::path($p,[R,F]); ekko::path($p);}; // native edit
         if(!$x&&$v){expect::path($p,[R,F]); echo durl($p); done();}; // native view

         $r=crud($x)->select('*'); $m=mime($p);

         if(!$v){ekko::head(['Content-Type'=>$m]); echo $r; done();}; // remote edit
         ekko("data:$m;base64,".base64_encode($r)); // remote view
      }


      static function saveFile()
      {
         $v=knob($_POST); $p=$v->path; $x=$v->plug; $b=$v->bufr;

         if(!$x)
         {
            expect::path($p,[W,F]); path::make($p,$b);
            $b=repo::branch($p); if($b){repo::commit(repoOf($p),"saved '$p'");}
            elseif($p[0]!=='~'){Proc::signal('pathUpdate',['path'=>path::stem($p)],'.work');}; ekko(OK);
         };

         $r=crud($x)->update($b); ekko(($r?OK:FAIL));
      }


      static function feedFile()
      {
         $v=knob($_POST); $p=$v->path; path::make($p,furl($v->data)->data);
         $b=repo::branch($p); if($b){repo::commit(repoOf($p),"added '$p'");}
         elseif($p[0]!=='~'){Proc::signal('pathUpdate',['path'=>path::stem($p)],'.work');}; ekko(OK);
      }


      static function pullRepo()
      {
         $v=knob($_POST); $p=$v->path; $b=$v->fork; $s=repo::strife($p); if($s->ahead||!$s->behind){ekko('n/a');};
         try{repo::update($p,$b);}catch(\Exception $e){ekko(FAIL);}; ekko(OK);
      }


      static function pushRepo()
      {
         $v=knob($_POST); $p=$v->path; $b=$v->fork; $s=repo::strife($p); $n=($s->ahead+$s->behind);
         if(!$n){ekko(OK);}; $rsp=OK; try{repo::commit($p,"merge $n commit(s)",true,$b);}catch(\Exception $e){$rsp=$e->getMessage();};
         Proc::signal('repoUpdate',['fork'=>$b],'.work'); ekko($rsp);
      }
   }
# ---------------------------------------------------------------------------------------------------------------------------------------------
