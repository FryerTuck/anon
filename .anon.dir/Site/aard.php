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
        $np="$p"; $fc=null; $sf=0; $ps=path::stem($np); if(!isWord($ps)||!isFold("$/$ps")){$ps=null;};
        if($ps&&($np==="/$ps/panl.js")){$fc=knob("$/$ps/pack.inf")->forClans;
        if($fc&&($fc!=='*')&&!userDoes($fc)&&!userDoes('sudo')){finish(403);exit;}};
        if(isFold($np)){$ix=path::indx($np,'aard.php'); if($ix){$np=(rshave($np,'/')."/$ix");}}; // get index-file
        if(($ps||(isin("anon nona",envi('RECEIVER'))))&&($np!=="/")&&facing("DPR")&&isee($np)){finish($np);}; // file request .. handle quick
        $tn=conf("Site/autoConf")->template; if(!isWord($tn)||!isee("$/Site/tmpl/$tn")){$tn="Anon";};
        $uc=sesn("CLAN"); $tp="$/Site/tmpl/$tn"; $tc=knob("$tp/conf"); $cv=$tc->clanView; $rc=null; $rp=null;
        $rp=test::{$np}($tc->redirect); if(is_int($rp)){finish($rp); exit;}elseif(isPath($rp)){$np=$rp;}; // graceful exit
        if(isKnob($cv)){$rc=pick($uc,keys($cv)); if($rc){$rp=$cv->$rc; if(!arg($rp)->startsWith("/")){$rp="$tp/$rp";}}};
        if($rp&&is_int($rp)){finish($rp); exit;};
        if(isText($rp,1)&&isee("/$rp")){$rp="/$rp"; $np=$rp; $sf=1;}; if(!$sf&&isPath($rp)&&isee($rp)){$sf=1; $np=$rp;};
        if(isPath($rp)&&!$sf){fail::config("override-path not found: `$rp`"); return;};
        if(isFold($np)&&!conf('Proc/autoConf')->viewDirs){finish(403);}; // configured to deny viewing folders

        finish($np);
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
          $span=span($list);
          signal::busy(['with'=>"/Site/importBrowse","done"=>1]);

          foreach($list as $indx => $item)
          {
              $name=expose($item,'<span class="name">','</span>')[0];
              $href=expose($item,'<a href="','"')[0];
              $href=("$host/assets/files".swap($href,$fixr,"$fixr/preview"));
              $face=expose($item,'<img src="','"')[0]; $face=swap($face,'/assets',"$host/assets");
              $mime=mime($face); $face=spuf($face,null,"$host/",12,1); $face=durl($face,$mime);
              $resl->lyst[]=knob(['name'=>$name,'href'=>"$href/",'face'=>$face]);
              signal::busy(['with'=>"/Site/importBrowse","done"=>floor(($indx/$span)*100)]);
          };

          ekko($resl);
      }



      static function importOpen()
      {
          permit::fubu("clan:work");
          $vars=knob($_POST); $purl=$vars->purl; $surl=rshave($purl,"/"); $hash=md5($purl);
          $path="~/.tmp/Site/$hash"; if(isee($path)){ekko($path); exit;}; // exit here
          $html=spuf($purl); if(!$html){done(FAIL);}; path::make("$path/");
          $info=path::info($purl);
          $hurl="$info->plug://$info->host"; $hpth=$info->path; $spuf=knob(); $refs=knob();


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

          $span=span($spuf); $indx=0; signal::busy(['with'=>"/Site/importOpen","done"=>0]);
          path::make("$path/aard.htm",$html);

          foreach($spuf as $furl => $save)
          {
              $leaf=frag($furl,"/"); $leaf=rpop($leaf); $fext=fext("/$leaf"); $fold="bits";
              $temp=spuf($furl,null,$purl,12,(isin("js css",$fext)?0:1));

              if($fext==="css")
              {
                  $list=expose($temp,"url(",")"); if(!$list){$list=[];};
                  $twig=rstub($furl,"/"); $twig=($twig?(swap($twig[0],$hurl,"")):$hpth);
                  $curl=($hurl.$twig);

                  foreach($list as $item)
                  {
                      if(isin($item,["http://","https://"])){continue;}; $href=unwrap($item); $span++;
                      $burl="$curl/$href"; $file=frag($href,"/"); $file=rpop($file); $q=stub($file,'?');
                      if($q){$file=$q[0]; $q="?$q[2]";}else{$q='';}; $pref=($q?swap($href,$q,''):$href);
                      if(strpos($href,"..")===0){$burl=($hurl.path::cdto($twig,$pref));};
                      $dest="/$path/bits/$file"; $temp=swap($temp,"url({$item})","url('{$dest}{$q}')");
                      $bufr=spuf($burl,null,$purl,12,1);
                      path::make($dest,$bufr); unset($bufr);
                      signal::busy(['with'=>"/Site/importOpen","done"=>floor(($indx/$span)*100)]);
                      $indx++;
                  };
                  unset($list,$item);
              }
              elseif($fext=='js')
              {
                  $temp=swap($temp,'assets/img',"$path/$fold");
              };

              path::make("$path/$fold/$leaf",$temp); unset($temp);
              signal::busy(['with'=>"/Site/importOpen","done"=>floor(($indx/$span)*100)]);
              $indx++;
          };

          ekko($path);
      }



      static function importSave()
      {
          permit::fubu("clan:work");
          $vars=knob($_POST); $purl=$vars->purl; $surl=rshave($purl,"/");
          $hash=md5($purl); $tmpl=rstub($surl,"/")[2];
          $temp="~/.tmp/Site/$hash"; $path="$/Site/tmpl"; $trgt="$path/$tmpl";

          if(isee("$path/$tmpl"))
          {
              $m="- first **void** it\n- then **import** it again and hit **save**";
              ekko("The ***$tmpl*** template is already saved.\n\nTo refresh it:\n$m");
              exit;
          };

          // path::make("$trgt/base/"); path::make("$trgt/conf/"); path::make("$trgt/bits/");
          path::copy("$path/Anon/base","$trgt/");
          path::copy("$path/Anon/conf","$trgt/");
          path::copy("$path/Anon/page/home.htm","$trgt/page/home.htm");
          path::copy("$temp/bits","$trgt/");
          path::copy("$temp/aard.htm","$trgt/base/surf.htm");

          $html=pget("$trgt/base/surf.htm"); $html=swap($html,$temp,$trgt);
          path::make("$trgt/base/surf.htm",$html);
          $bits=pget("$trgt/bits"); foreach($bits as $file)
          {
              if(!isin("css,js",fext("/$file"))){continue;};
              $bufr=pget("$trgt/bits/$file"); $bufr=swap($bufr,$temp,$trgt);
              path::make("$trgt/bits/$file",$bufr);
          };
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



      static function tmplList()
      {
          permit::fubu("clan:work");
          $r=array_values(array_diff(pget("$/Site/tmpl"),["Anon"]));
          ekko($r);
      }



      static function configPick()
      {
          // permit::fubu("clan:work"); $vars=knob($_POST); $tmpl=$vars->data; $bufr=[];
          // $conf=conf("Site/autoConf"); $conf->template=$tmpl;
          // foreach($conf as $k =>$v){$bufr[]="$k: $v";};
          // $bufr=fuse($bufr,"\n");
          // path::make("$/Site/conf/autoConf",$bufr);
          //
          // path::copy("$/Site/tmpl/$tmpl/","/www");

          ekko(OK);
      }



      static function treeMenu()
      {
          // permit::fubu("clan:work"); $up="~/root/www";
          // if(!isee($up)){path::copy("/www/",$up);};
          // $r=path::tree($up); ekko($r);
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
