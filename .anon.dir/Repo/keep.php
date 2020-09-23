<?
namespace Anon;


// cond :: repos : safely combine 2 repositories .. we need 5 .. 1 BARE .. 2 sources .. 1 test .. 1 root
# -----------------------------------------------------------------------------------------------------------------------------
    $ref=conf("Repo/gitRefer"); $cfo="$ref->SiteOrigin";
    $sto=(isRepo('/')?Repo::getURL('/','origin',false):''); $hst=HOSTNAME;

    if($sto&&($sto!==$cfo)&&($cfo==="file://$/Repo/data/remote/$hst.git"))
    {$ref->SiteOrigin=$sto; conf::{"Repo/gitRefer"}($ref);}; // auto-set SiteOrigin to existing repo origin .. if any

    $inf=path::info($ref->SiteOrigin); $ntv="$/Repo/data/native"; $rmt="$/Repo/data/remote";
    if(($inf->plug==="file")&&!isee($inf->path)){Repo::create($inf->path,BARE);}; // we will clone from here

    if(!isFold("$rmt/tank")){Repo::create("$rmt/tank.git",BARE,"master");}; // create local origin
    if(!isRepo("$ntv/test")){Repo::cloned("file://$rmt/tank.git","$ntv/tank",$ref->AnonBranch,"master");};

    if(!isRepo("$ntv/anon"))
    {
        Repo::cloned($ref->AnonOrigin,"$ntv/anon",$ref->AnonBranch,"master"); $lst=pget("$ntv/anon",false);
        foreach($lst as $itm){path::copy("$ntv/anon/$itm","$ntv/test",true);}; unset($lst,$itm);
    };

    if(!isRepo("$ntv/site"))
    {
        Repo::cloned($ref->SiteOrigin,"$ntv/site",$ref->SiteBranch,"master"); $lst=pget("$ntv/site",false);
        foreach($lst as $itm){path::copy("$ntv/site/$itm","$ntv/test",true);}; unset($lst,$itm);
    };


    if($cfo!==$sto)
    {
        $lst=pget("/",false); $omt=[".git"]; foreach($lst as $itm)
        {
            if(isin($omt,$itm)){continue;}; // omit this
            path::copy("/$itm","$ntv/test",true); // copy .. replace existing
        };

        Repo::commit("$ntv/test","website backup",true); // commit changes in test & push test to tank

        $tko=path::purl(path::info("$rmt/tank"),true); // tank origin url
        exec::{"rm -r ./* & git clone $tko ."}("/"); // clean out web-root & clone tank as web-root
    };
# -----------------------------------------------------------------------------------------------------------------------------



// conf :: Anon : write the gitIgnor config into web-root .git/info/exclude .. this keeps Anon-config unchanged during updates
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

    $t=trim(pget("/.git/info/exclude")); // HACK :: remove unwanted trailing characters .. fix this elsewhere
    if(arg($t)->endsWith("!*")){$t=rshave($t,"!*"); $t=rshave($t,"*\n");}; // i mean this line
# -----------------------------------------------------------------------------------------------------------------------------
