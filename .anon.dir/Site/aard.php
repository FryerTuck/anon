<?
namespace Anon;



# tool :: Site : web-facing GUI
# ---------------------------------------------------------------------------------------------------------------------------------------------
   class Site
   {
      static $meta;



      static function __init()
      {
      }



      static function handle($p)
      {
        $sc=conf("Site/autoConf"); $tn=$sc->template; $ap="/Site/tmpl/Anon"; $np="$p";
        $tp="/Site/tmpl/$tn"; if(!isee($tp)){fail::template("missing path: `$tp`"); exit;};
        if(isFold($np)){$ix=path::indx($np,'aard.php'); if($ix){$np=(rshave($np,'/')."/$ix");}}; // check for index-file
        $tc=knob("/Site/tmpl/$tn/conf"); $rp=test::{$np}($tc->redirect);
        if(is_int($rp)){finish($rp,['tmpl'=>"$tp/page/stat.htm"]); exit;}; // EXIT :: graceful status
        if(isText($rp,1)&&(isPath($rp)||isPath("/$rp"))){$np=(arg($rp)->startsWith("/")?$rp:"$tp/$rp");}; // got redirected path
        $fx=fext($np); if(isFold($np)&&!conf('Proc/viewDirs')){finish(403);}; // configured to deny viewing folders


        if(facing("DPR")||($fx==="php"))
        {
            if(isee($np)){finish($np);}; // assests NOT in template
            if(isee("$tp/$np")){finish("$tp/$np");}; // assests in template
            if(isee("$ap/$np")){finish("$ap/$np");}; // assests in Anon template
            finish($np); // 404 or 403
        };


        $cv=$tc->clanView; $uc=sesn("CLAN"); $rc=null; if(isKnob($cv)){$rc=pick($uc,keys($cv));};
        $rp=null; if($rc&&isKnob($cv)){$rp=$cv->$rc;};

        if($rp&&(is_int($rp)||isPath($rp)||isPath("/$rp")))
        {
            if(is_int($rp)){finish($rp,['tmpl'=>"$tp/page/stat.htm"]); exit;};
            $rp=(arg($rp)->startsWith("/")?$rp:"$tp/$rp"); if(!isee($rp)){fail::config("file not found: `$rp`");};
            $np="$rp";
        }

        if(!$rc)
        {
            $cl=["peek","surf","back","work","lead","sudo"];
            $rc=isin($uc,$cl); if(!$rc){fail::template("invalid user clan: `$uc`");};
        };

        $gv=knob($_GET); if(!$gv->init){finish($np);}; // serve without template
        $pt=null; $tl=["$tp/base/$rc.$fx","$ap/base/aard.$fx","$ap/base/$rc.$fx","$ap/base/aard.$fx"];
        if(!arg($np)->startsWith("$tp/base/")){foreach($tl as $xt){if(isee($tl)){$pt="$xt"; break;}}};
        if(!$pt){finish($np); exit;}; // without template
        finish($pt,['contents'=>$np]); exit; // with template
      }



      static function importBrowse()
      {
          permit::fubu("clan:work");
          $vars=knob($_POST); $from=$vars->from; $fltr=$vars->fltr; $host="https://www.free-css.com";
          $lpth=(($fltr==='*')?'free-css-templates':"template-categories/$fltr");
          $resl=knob(['cats'=>[],'lyst'=>[]]);

          if(($from===0)&&($fltr==='*'))
          {
              $html=spuf("$host/template-categories");
              $html=expose($html,'<ul id="taglist"','</ul>')[0];
              $resl->cats=expose($html,'/template-categories/','">');
          };

          $html=spuf("$host/$lpth?start=$from",null,"$host/");
          if(!$html){done(FAIL);}; $fixr='/free-css-templates';
          $list=expose($html,"<figure>","</figure>"); if(!$list){$list=[];};

          foreach($list as $item)
          {
              $name=expose($item,'<span class="name">','</span>')[0];
              $href=expose($item,'<a href="','"')[0];
              $href=("$host/assets/files".swap($href,$fixr,"$fixr/preview"));
              $face=expose($item,'<img src="','"')[0]; $face=swap($face,'/assets',"$host/assets");
              $resl->lyst[]=knob(['name'=>$name,'href'=>"$href/",'face'=>$face]);
          };

          ekko($resl);
      }



      static function importOpen()
      {
          permit::fubu("clan:work");
          $vars=knob($_POST); $purl=$vars->purl; $surl=rshave($purl,"/"); $hash=md5($purl);
          $path="~/.tmp/Site/$hash"; if(isee($path)){ekko($path);}; // exit here
          $html=spuf($purl); if(!$html){done(FAIL);}; path::make("$path/");
          $info=path::info($purl); $hurl="$info->plug://$info->host"; $hpth=$info->path; $spuf=knob(); $refs=knob();


          $list=expose($html,"<style ","</style>"); if(!$list){$list=[];};
          foreach($list as $skin)
          {
              $ulst=expose($skin,"url(",")"); if(!$ulst){$ulst=[];}; $repl="$skin";
              foreach($ulst as $item)
              {
                  if(isin($item,["http://","https://"])){continue;}; $href=unwrap($item);
                  $burl="$surl/$href"; $file=frag($href,"/"); $file=rpop($file);
                  if(strpos($href,"..")===0){$burl=($hurl.path::cdto($hpth,$href));};
                  $dest="/$path/bits/$file"; $repl=swap($repl,"url({$item})","url('$dest')");
                  $spuf->$burl=$dest; $refs->$href=$dest;
              };
              unset($ulst,$item);
              $html=swap($html,"<style {$skin}</style>","<style {$repl}</style>");
          };
          unset($list,$skin);


          $list=expose($html,'style="','>'); if(!$list){$list=[];};
          foreach($list as $skin)
          {
              $ulst=expose($skin,"url(",")"); if(!$ulst){$ulst=[];}; $repl="$skin";
              foreach($ulst as $item)
              {
                  if(isin($item,["http://","https://"])){continue;}; $href=unwrap($item);
                  $burl="$surl/$href"; $file=frag($href,"/"); $file=rpop($file);
                  if(strpos($href,"..")===0){$burl=($hurl.path::cdto($hpth,$href));};
                  $dest="/$path/bits/$file"; $repl=swap($repl,"url({$item})","url('$dest')");
                  $spuf->$burl=$dest; $refs->$href=$dest;
              };
              unset($ulst,$item);
              $html=swap($html,"style=\"{$skin}>","style=\"{$repl}>");
          };
          unset($list,$skin);


          $list=expose($html,"<link ",">"); if(!$list){$list=[];};
          foreach($list as $item)
          {
              if(!isin($item,"stylesheet")){continue;};
              $href=expose($item,'href="','"'); if(!$href||isin($href[0],["http://","https://"])){continue;}; $href=$href[0];
              $burl="$surl/$href"; $leaf=frag($href,"/"); $leaf=rpop($leaf);
              if(strpos($href,"..")===0){$burl=($hurl.path::cdto($hpth,$href));};
              $dest="/$path/bits/$leaf"; $repl=swap($item,"href=\"$href\"","href=\"$dest\"");
              $html=swap($html,"<link {$item}>","<link {$repl}>");
              $spuf->$burl=$dest;
          };
          unset($list,$item);


          $list=expose($html,' src="','"'); if(!$list){$list=[];};
          foreach($list as $item)
          {
              $href="$item"; $burl="$surl/$href"; $leaf=frag($href,"/"); $leaf=rpop($leaf);
              $fext=fext("/$leaf"); if(strpos($href,"..")===0){$burl=($hurl.path::cdto($hpth,$href));};
              $fold='bits'; $dest="/$path/$fold/$leaf";
              $repl=swap($item,$href,$dest);
              $html=swap($html," src=\"{$item}\""," src=\"{$repl}\"");
              $spuf->$burl=$dest; $refs->$href=$dest;
          };
          unset($list,$item);


          $list=expose($html,' poster="','"'); if(!$list){$list=[];};
          foreach($list as $item)
          {
              $href="$item"; $burl="$surl/$href"; $leaf=frag($href,"/"); $leaf=rpop($leaf);
              if(strpos($href,"..")===0){$burl=($hurl.path::cdto($hpth,$href));};
              $dest="/$path/$fold/$leaf"; $repl=swap($item,$href,$dest);
              $html=swap($html," poster=\"{$item}\""," poster=\"{$repl}\"");
              $spuf->$burl=$dest; $refs->$href=$dest;
          };
          unset($list,$item,$temp);


          $list=expose($html,'-src="','"'); if(!$list){$list=[];};
          foreach($list as $item)
          {
              if(isin($item,["http://","https://"])){continue;}; $href="$item";
              $burl="$surl/$href"; $file=frag($href,"/"); $file=rpop($file);
              if(strpos($href,"..")===0){$burl=($hurl.path::cdto($hpth,$href));};
              $dest="/$path/bits/$file"; $html=swap($html,"-src=\"$href\"","-src=\"$dest\"");
              $spuf->$burl=$dest; $refs->$href=$dest;
          };
          unset($list,$item);

          $span=span($spuf); $indx=0; signal::busy(['with'=>"/Site/importOpen","done"=>10]);

          foreach($spuf as $furl => $save)
          {
              $indx++;
              $leaf=frag($furl,"/"); $leaf=rpop($leaf); $fext=fext("/$leaf"); $fold="bits";
              $temp=spuf($furl,null,$purl,12,(isin("js css",$fext)?0:1));

              if($fext==="css")
              {
                  $list=expose($temp,"url(",")"); if(!$list){$list=[];};
                  $twig=rstub($furl,"/"); $twig=($twig?(swap($twig[0],$hurl,"")):$hpth);
                  $curl=($hurl.$twig);

                  foreach($list as $item)
                  {
                      if(isin($item,["http://","https://"])){continue;}; $href=unwrap($item);
                      $burl="$curl/$href"; $file=frag($href,"/"); $file=rpop($file); $q=stub($file,'?');
                      if($q){$file=$q[0]; $q="?$q[2]";}else{$q='';}; $pref=($q?swap($href,$q,''):$href);
                      if(strpos($href,"..")===0){$burl=($hurl.path::cdto($twig,$pref));};
                      $dest="/$path/bits/$file"; $temp=swap($temp,"url({$item})","url('{$dest}{$q}')");
                      $bufr=spuf($burl,null,$purl,12,1);
                      path::make($dest,$bufr); unset($bufr);
                  };
                  unset($list,$item);
              }
              elseif($fext=='js')
              {
                  $temp=swap($temp,'assets/img',"$path/$fold");
              };

              path::make("$path/$fold/$leaf",$temp); unset($temp);
              signal::busy(['with'=>"/Site/importOpen","done"=>floor((($indx+1)/$span)*100)]);
          };

          path::make("$path/aard.htm",$html);
          ekko($path);
      }



      static function importSave()
      {
          permit::fubu("clan:work");
          $vars=knob($_POST); $purl=$vars->purl; $surl=rshave($purl,"/");
          $hash=md5($purl); $tmpl=rstub($surl,"/")[2]; $temp="~/.tmp/Site/$hash"; $path="$/Site/tmpl";

          if(isee("$path/$tmpl"))
          {
              $m="- first **void** it\n- then **import** it again and hit **save**";
              ekko("The ***$tmpl*** template is already saved.\n\nTo refresh it:\n$m");
              exit;
          };

          path::copy("$path/Anon/base","$path/$tmpl/base");
          path::copy("$path/Anon/conf","$path/$tmpl/conf");
          path::copy("$temp/bits","$path/$tmpl/bits");
          path::move("$temp/aard.htm","$path/$tmpl/base/surf.htm");

          ekko(OK);
      }



      static function importVoid()
      {
          permit::fubu("clan:work");
          $vars=knob($_POST); $purl=$vars->purl; $surl=rshave($purl,"/");
          $hash=md5($purl); $tmpl=rstub($surl,"/")[2]; $temp="~/.tmp/Site/$hash"; $path="$/Site/tmpl";

          path::void("$path/$tmpl");
          path::void($temp);

          ekko(OK);
      }



      static function brandNew()
      {
          permit::fubu("clan:work");
          for($i=0; $i<=100; $i++)
          {
              signal::busy(['with'=>"/Site/brandNew","done"=>$i]);
          };

          ekko(OK);
      }
   }
# ---------------------------------------------------------------------------------------------------------------------------------------------
