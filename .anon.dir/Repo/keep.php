<?
namespace Anon;


  if(!isRepo('/'))
  {Repo::create('/'); wait(50);}
  else
  {
      $fa=conf('Repo/fromAnon'); $lo=Repo::origin('/');
      $lr=path("$/Repo/data/".HOSTNAME.".git");
      if(!isee($lr)){Repo::create('/',BARE);};

      if($lo===$fa)
      {
          exec::{"git remote rename origin fromAnon"}('/');
          exec::{"git remote add origin $lr"}('/');
      }
      else
      {
          $ao=Repo::getURL('/','fromAnon');
          if(!$ao){exec::{"git remote set-url fromAnon $fa"}('/');};
      };
  };

  $h=ROOTPATH; $l=conf('Repo/gitIgnor'); unset($i);
  foreach($l as $i)
  {
     if(strlen(trim($i))<1){continue;}; // empty line
     if(substr($i,0,2)==='# '){continue;}; // commented out
     $c=substr($i,0,1); if($c==='!'){$i=substr($i,1);}else{$c='';}; // negation
     $a=''; if(last($i)==='*'){$a='*';}; $p=path(rshave($i,'*'));
     $p=swap($p,"$h/",''); $p.=$a;
     Repo::ignore('/',write,($c.$p));
  };
