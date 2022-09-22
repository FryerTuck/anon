<?
namespace Anon;




class Data
{
   static $meta;

   private static function dataTree($lnk,$flt=null,$lvl=0)
   {
      if($lvl>3){return;};
      $sdb = null;
      if(isFold($lnk))
      {
         $rsl=listOf(path::ogle([using=>$lnk,fetch=>'name,path,mime,type',limit=>['levl'=>1]]));
         foreach($rsl as $idx => $obj)
         {
            $p=$obj->path; $x=fext($p);
            if(isFold($p)){$rsl[$idx]->data=listOf(self::dataTree($p,$flt,($lvl+1)));continue;};
            if($x!=="sdb"){continue;};
            $rsl[$idx]->type="dbase"; $rsl[$idx]->mime="application/database"; $rsl[$idx]->path="sqlite::$p";
         };
         return $rsl;
      }
      elseif(fext($lnk)==="sdb"){ $sdb = true; };

      $obj=plug($lnk); if(!$lvl&&!$sdb){$lvl=$obj->mean->levl;}; $inf=$obj->info; if(!$inf){$inf=knob();};
      $mxl=$inf->maxLevel; if($mxl===null){$mxl=($lvl+1);}; $lvt=$inf->levlType; $tpe=($sdb?"plug":($lvt?$lvt[$lvl]:'none'));
      $lst=$obj->select('*',TREE); if(!isNuma($lst)){$lst=[$lst];}; $prl=$obj->mean->purl; $pth=$obj->mean->path; $rsl=[];

      foreach($lst as $itm)
      {
         $pts=stub($itm,'::'); $tpe=$pts[0]; $itm=$pts[2]; if($flt&&!isin($flt,$tpe)){continue;};
         $dat=knob
         ([
            "repo"=>null,
            "purl"=>"$prl/$itm",
            "path"=>swap("$pth/$itm",'//','/'),
            "levl"=>($lvl+0),
            "name"=>$itm,
            "mime"=>null,
            "type"=>$tpe,
            "size"=>0,
            "time"=>0,
            "data"=>null,
         ]);

         $kds=isin(['dbase','table'],$tpe);
         if($kds){$kds=self::dataTree("$lnk/$itm",$flt,($lvl+1)); $dat->size=span($kds); $dat->data=$kds;};

         $rsl[]=$dat;
      };

      return $rsl;
   }



   static function treeMenu()
   {
      permit::fubu("clan:mind,sudo"); $cn='name,path,mime,type';

      $al=path::ogle([using=>'$',fetch=>$cn,limit=>['type'=>'fold','levl'=>0]]);
      $ul=path::ogle([using=>'/',fetch=>$cn,limit=>['type'=>'fold','levl'=>0]]);

      $sl=array_merge($al,$ul); $rl=[]; foreach($sl as $so)
      {
         $sp="$so->path/data"; if(!isFold($sp)){continue;};
         // $hd=path::ogle([using=>$sp,fetch=>$cn,where=>['type = fold']]);
         $so->data=self::dataTree($sp);
         $rl[]=$so;
      };

      ekko($rl);
   }



   static function plugMenu()
   {
      permit::fubu("clan:mind,sudo");
      $rl = self::dataTree(posted("path"));
      ekko($rl);
   }



   static function openItem()
   {
      $vrs=knob($_POST); $tpe=$vrs->type;
      $prl=(($tpe==="file")?"sqlite::$vrs->path":xeno::showHyperConduit($vrs->path));

      $dbc=plug($prl); $lmt=50; $qry=null; $rsl=null;

      if(!isin("field",$tpe)){$rsl=$dbc->select([fetch=>'*',limit=>$lmt]); done($rsl);};
      $rsl=$dbc->descry('*'); done([$rsl]);

      // if($tpe==='dbase')
      // {};
      //
      // if(isin(['table','field'],$tpe))
      // {
      //    // $rsl=$dbc->select([using=>fetch=>(($tpe==='table')?'*':$dbc->mean->refs->field),limit=>$lmt]); dump($rsl);
      // };
      //
      // if(isin(['sproc','funct'],$tpe))
      // {
      //    $nic=$dbc->mean->leaf; $rsl=$dbc->select('*');
      //    dump($rsl);
      // };

   }



   static function saveItem()
   {
      $vrs=knob($_POST); $prl=xeno::showHyperConduit($vrs->path); $tpe=$vrs->type; $dta=decode::b64($vrs->data);
      $dbc=plug($prl); $rfs=$dbc->mean->refs; $nic=$dbc->mean->leaf;

      if(isin(['sproc','funct'],$tpe))
      {
         $wrd=(($tpe==='sproc')?sproc:funct); $bdy=expose($dta,"\nBEGIN\n","\nEND");
         if(!$bdy){fail("invalid $wrd syntax .. expecting `BEGIN` and `END` each on their own line");};
         $rsl=$dbc->delete([$wrd=>$nic]); $rsl=$dbc->adjure($dta);
         done(($rsl?OK:FAIL));
      };

      if($tpe=='table')
      {
         if($vrs->row&&$vrs->col)
         {
            $pts=stub($vrs->row,':'); $ridk=$pts[0]; $ridv=$pts[2];
            $rsl=$dbc->update
            ([
               using => $rfs->table,
               where => "$ridk = $ridv",
               write => ["$vrs->col"=>$dta],
               limit => 1,
            ]);
            done(($rsl===true)?OK:FAIL);
         };
      };
   }



   static function runQuery()
   {
      $vrs=knob($_POST); $prl=$vrs->purl; $sql=decode::b64($vrs->cmnd); $tmp=lowerCase($sql);
      $sho=pick($tmp,['show *','show all','show databases','show dbases','show tables','show fields']);

      if($sho&&(indx($tmp,$sho)===0))
      {
         $arg=null; if(span($tmp,' ')>1){$pts=rstub($tmp,' '); $arg=$pts[2]; $tmp=$pts[0];}; $inf=path::info($prl); $lvl=$inf->levl;
         if(isin($tmp,'fields')&&($lvl<2)){ekko('fields of which table?');}; if(isin($tmp,'tables')&&($lvl<1)){ekko('tables of which dbase?');};
         $tmp=swap($tmp,'data','d'); $dbc=plug($prl); $rfs=$dbc->mean->refs; if($tmp==='show dbases'){$rsl=$dbc->descry('*',0,$rfs);}
         elseif($tmp==='show tables'){$rsl=$dbc->descry('*',1,$rfs);}else{$rsl=$dbc->descry('*');};
         ekko($rsl);
      };

      $rsl=plug($prl)->adjure($sql); ekko($rsl);
   }



   static function exists()
   {
      $vrs=knob($_POST); $prl=$vrs->purl;
      try{$rsl=plug($prl)->descry(); ekko(OK);}catch(\Exception $e){$e=$e->getMessage(); ekko("FAIL .. $e");};
   }
}
