<?
namespace Anon;



# tool :: Code : assistance
# ---------------------------------------------------------------------------------------------------------------------------------------------
   class Code
   {
      static $meta;


      static function treeMenu()
      {
         // $un=user('name'); $hp="/User/data/$u/home";
         // $r=path::tree($h); dump($r);
      }


      static function openFile()
      {
         $v=knob($_POST); $p=crop($v->path); $x=xeno::showHyperConduit($p); $v=$v->view;
         if(!$x&&!$v){expect::path($p,[R,F]); ekko::path($p);}; // native edit
         if(!$x&&$v){expect::path($p,[R,F]); ekko(durl($p));}; // native view

         $r=crud($x)->select('*'); $m=mime($p);

         if(!$v){ekko::head(['Content-Type'=>$m]); echo $r; done();}; // remote edit
         ekko("data:$m;base64,".base64_encode($r)); // remote view
      }


      static function saveFile()
      {
         $v=knob($_POST); $p=$v->path; $x=xeno::showHyperConduit($p); $b=$v->bufr;

         if(!$x)
         {
            expect::path($p,[W,F]); $r=path::make($p,$b); if(!$r){ekko(FAIL);}; $b=Repo::branch($p);
            if($b){Repo::commit(repoOf($p),"saved '$p'");}elseif($p[0]!=='~'){Proc::signal('pathUpdate',['path'=>$p],'.work');};
            ekko(OK);
         };

         lock::create($p); try{$r=crud($x)->update($b);}catch(\Exception $e){$r=null;}; lock::remove($p);
         if($r){Proc::signal('pathUpdate',['path'=>$p],'.work');};
         ekko(($r?OK:FAIL));
      }


      static function feedFile()
      {
         $v=knob($_POST); $p=$v->path; path::make($p,furl($v->data)->data);
         $b=Repo::branch($p); if($b){Repo::commit(repoOf($p),"added '$p'");}
         elseif($p[0]!=='~'){Proc::signal('pathUpdate',['path'=>path::stem($p)],'.work');}; ekko(OK);
      }


      static function pullRepo()
      {
         $v=knob($_POST); $p=$v->path; $b=$v->fork; $s=Repo::strife($p); if($s->ahead||!$s->behind){ekko('n/a');};
         try{Repo::update($p,$b);}catch(\Exception $e){ekko(FAIL);}; ekko(OK);
      }


      static function pushRepo()
      {
         $v=knob($_POST); $p=$v->path; $b=$v->fork; $s=Repo::strife($p); $n=($s->ahead+$s->behind);
         if(!$n){ekko(OK);}; $rsp=OK; try{Repo::commit($p,"merge $n commit(s)",true,$b);}catch(\Exception $e){$rsp=$e->getMessage();};
         Proc::signal('repoUpdate',['fork'=>$b],'.work'); ekko($rsp);
      }


      static function bulkFind()
      {
         $v=knob($_POST); $p=$v->path; $f=$v->find;
         if(!isPath($p,[D,R])){done("expecting `$p` as readable folder");};
         $r=path::line($p,$f); ekko($r);
      }


      static function bulkSwap()
      {
         $v=knob($_POST); $l=$v->{'list'}; $f=$v->find; $s=$v->swap; $v=null;
         foreach($l as $p){$v=pget($p); $v=swap($v,$f,$s); path::make($p,$v);};
         done(OK);
      }
   }
# ---------------------------------------------------------------------------------------------------------------------------------------------
