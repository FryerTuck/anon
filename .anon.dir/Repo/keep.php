<?
namespace Anon;


// cond :: repos : if the required repos don't exist, create them now
# -----------------------------------------------------------------------------------------------------------------------------
    $ref=conf("Repo/gitRefer"); $inf=path::info($ref->SiteOrigin); $pth="$/Repo/data/native";
    if(($inf->plug==="file")&&!isee($inf->path)){Repo::create($inf->path,BARE);}; // we will clone from here

    if(!isRepo("$pth/anon")){Repo::cloned($ref->AnonOrigin,"$pth/anon",$ref->AnonBranch,"master");}; // `master` user ;)
    if(!isRepo("$pth/site")){Repo::cloned($ref->SiteOrigin,"$pth/site",$ref->SiteBranch,"master");};
# -----------------------------------------------------------------------------------------------------------------------------



// conf :: git-ignore : write the gitIgnor config into local .git/info/exclude
# -----------------------------------------------------------------------------------------------------------------------------
    $h=ROOTPATH; $l=conf('Repo/gitIgnor'); unset($i);
    foreach($l as $i)
    {
        if(strlen(trim($i))<1){continue;}; // empty line
        if(substr($i,0,2)==='# '){continue;}; // commented out
        $c=substr($i,0,1); if($c==='!'){$i=substr($i,1);}else{$c='';}; // negation
        $a=''; if(last($i)==='*'){$a='*';}; $p=path(rshave($i,'*'));
        $p=swap($p,"$h/",''); $p.=$a; Repo::ignore('/',write,($c.$p));
    };

    $t=trim(pget("/.git/info/exclude")); // HACK :: fix this elsewhere
    if(arg($t)->endsWith("!*")){$t=rshave($t,"!*"); $t=rshave($t,"*\n");}; // i mean this line
# -----------------------------------------------------------------------------------------------------------------------------
