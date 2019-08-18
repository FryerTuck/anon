<?
namespace Anon;



# tool :: Help : assistance
# ---------------------------------------------------------------------------------------------------------------------------------------------
   class Help
   {
      static $meta;


      static function treeMenu()
      {
         $cn='name,path,mime,type'; $al=path::ogle([using=>'$',fetch=>$cn,limit=>['type'=>'fold','levl'=>0]]);
         $ul=path::ogle([using=>'/',fetch=>$cn,limit=>['type'=>'fold','levl'=>0]]);
         $sl=fuse($al,$ul); $rl=[]; $cl=frag(user('clan'),','); foreach($sl as $so)
         {
            $pi="$so->path/pack.inf"; if(!isee($pi)){continue;}; $pi=knob(dval(pget($pi))); $fc=$pi->forClans;
            if($fc&&($fc!=='*')&&!isin($fc,$cl)){continue;}; $so->path=ltrim($so->path,'$'); $sp=$so->path; $so->data=[];
            $hd=path::ogle([using=>$sp,fetch=>$cn,where=>['name = help','type = fold']]);
            if(span($hd>0)){$hd[0]->data=path::ogle([using=>"$sp/help",fetch=>"$cn,data"]);$hd[0]->name='manual'; $so->data[]=$hd[0];};
            $rm=path::ogle([using=>$sp,fetch=>$cn,where=>['name = README.md']]); if(span($rm)>0){$rm[0]->name='README'; $so->data[]=$rm[0];};
            $rl[]=$so;
         };
         dump($rl);
         // dump(['data'=>$rl]);
      }


      static function openFile()
      {
         $v=knob($_POST); $p=$v->path; expect::path($p,[R,F]); $r=pget($p); ekko($r);
      }
   }
# ---------------------------------------------------------------------------------------------------------------------------------------------
