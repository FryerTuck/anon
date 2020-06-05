<?
namespace Anon;



# tool :: Site : web-facing GUI
# ---------------------------------------------------------------------------------------------------------------------------------------------
   class Site
   {
      static $meta;



      static function __init()
      {
         // self::$meta->done=[];
         $ac=conf('Site/autoConf'); $cp=conf('Site/clanPath'); $cc=sesn('CLAN'); $np=NAVIPATH; $un=sesn('USER');

         if($cp->$cc){finish($cp->$cc); exit;}; // serve for specified clans explicitly
         // ekko("Hello $un");
      }



      static function importBrowse()
      {
          $vars=knob($_POST); $from=$vars->from; $host="https://www.free-css.com";
          $html=spuf("$host/free-css-templates?start=$from",null,"$host/");
          if(!$html){done(FAIL);}; $fixr='/free-css-templates';
          $list=expose($html,"<figure>","</figure>"); $resl=[];

          foreach($list as $item)
          {
              $name=expose($item,'<span class="name">','</span>')[0];
              $href=expose($item,'<a href="','"')[0];
              $href=("$host/assets/files".swap($href,$fixr,"$fixr/preview"));
              $face=expose($item,'<img src="','"')[0]; $face=swap($face,'/assets',"$host/assets");
              $resl[]=knob(['name'=>$name,'href'=>"$href/",'face'=>$face]);
          };

          ekko($resl);
      }



      static function importOpen()
      {
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
                  $dest="/$path/dcor/$file"; $repl=swap($repl,"url({$item})","url('$dest')");
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
                  $dest="/$path/dcor/$file"; $repl=swap($repl,"url({$item})","url('$dest')");
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
              $dest="/$path/dcor/$leaf"; $repl=swap($item,"href=\"$href\"","href=\"$dest\"");
              $html=swap($html,"<link {$item}>","<link {$repl}>");
              $spuf->$burl=$dest;
          };
          unset($list,$item);


          $list=expose($html,' src="','"'); if(!$list){$list=[];};
          foreach($list as $item)
          {
              $href="$item"; $burl="$surl/$href"; $leaf=frag($href,"/"); $leaf=rpop($leaf);
              $fext=fext("/$leaf"); if(strpos($href,"..")===0){$burl=($hurl.path::cdto($hpth,$href));};
              $fold=(($fext==='js')?'libs':'dcor'); $dest="/$path/$fold/$leaf";
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
              $dest="/$path/dcor/$file"; $html=swap($html,"-src=\"$href\"","-src=\"$dest\"");
              $spuf->$burl=$dest; $refs->$href=$dest;
          };
          unset($list,$item);

          $span=span($spuf); $indx=0; signal::busy(['with'=>"/Site/importOpen","done"=>10]);

          foreach($spuf as $furl => $save)
          {
              $indx++;
              $leaf=frag($furl,"/"); $leaf=rpop($leaf); $fext=fext("/$leaf"); $fold=(($fext==="js")?"libs":"dcor");
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
                      $dest="/$path/dcor/$file"; $temp=swap($temp,"url({$item})","url('{$dest}{$q}')");
                      $bufr=spuf($burl,null,$purl,12,1);
                      path::make($dest,$bufr); unset($bufr);
                  };
                  unset($list,$item);
              };

              path::make("$path/$fold/$leaf",$temp); unset($temp);
              signal::busy(['with'=>"/Site/importOpen","done"=>floor((($indx+1)/$span)*100)]);
          };

          path::make("$path/aard.htm",$html);
          ekko($path);
      }



      static function brandNew()
      {
          for($i=0; $i<=100; $i++)
          {
              signal::busy(['with'=>"/Site/brandNew","done"=>$i]);
          };

          ekko(OK);
      }
   }
# ---------------------------------------------------------------------------------------------------------------------------------------------
