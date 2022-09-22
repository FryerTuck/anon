<?
namespace Anon;


# prep :: repo : define vars .. create remote-BARE tank-repo .. create native NON-BARE fuse-repo cloned from tank
# -----------------------------------------------------------------------------------------------------------------------------
    $ref=conf("Repo/gitRefer"); $wro=(isRepo('/')?Repo::getURL('/','origin',false):''); // $wro = web-root-origin
    $hta=pget("/.htaccess"); $ntv="$/Repo/data/native"; $rmt="$/Repo/data/remote";

    if(!isFold("$rmt/tank.git")){Repo::create("$rmt/tank.git",BARE,"main");}; // create local BARE tank repo as origin
    if(span(pget("$rmt/tank.git/objects/pack"))<1){$brn=null;}; // no branch yet
    if(!isRepo("$ntv/fuse"))
    {
        Repo::cloned("file://$rmt/tank.git","$ntv/fuse",$brn,"master"); // master = user .. not branch
        // exec::{"git checkout -b tinker"}("$ntv/fuse");
        // exec::{"git checkout master"}("$ntv/fuse");
    };
# -----------------------------------------------------------------------------------------------------------------------------



# prep :: repo : clone anon-repo from config AnonOrigin .. copy all to fuse-repo
# -----------------------------------------------------------------------------------------------------------------------------
    if(isPlug($ref->AnonOrigin)&&!isRepo("$ntv/anon"))
    {
        Repo::cloned($ref->AnonOrigin,"$ntv/anon",$ref->AnonBranch,"master"); // clone remote anon-repo to native
        $lst=pget("$ntv/anon",false); xpop($lst,".git"); // get list of anon-repo items to copy to fuse-repo .. omit `.git`
        foreach($lst as $itm){path::copy("$ntv/anon/$itm","$ntv/fuse/$itm",true);}; // copy all anon-items to fuse-repo
        $fht=htbackup($hta,pget("$ntv/anon/.htaccess")); if($hta){chmod((ROOTPATH."/.htaccess"),0644);};
        path::make("$ntv/fuse/.htaccess",$fht); chmod((ROOTPATH."/.htaccess"),0444);
        $lst=pget("/",false); xpop($lst,".git"); $omt=[".anon.dir",".git",".anon.php",".htaccess"]; // web-root contents
        foreach($lst as $itm){if(!isin($omt,$itm)){path::copy("/$itm","$ntv/fuse/$itm",true);}}; // copied web-root to fuse
        unset($lst,$itm); Repo::commit("$ntv/fuse","cloned Anon",true); // track & commit & push fuse-repo-changes to tank
        Repo::ignore("$ntv/fuse",write,conf('Repo/gitIgnor')); // things to ignore for this repo
    };
# -----------------------------------------------------------------------------------------------------------------------------



# prep :: repo : clone site-repo from config SiteOrigin .. copy all from web-root to fuse-repo -EXCEPT Anon-related contents
# -----------------------------------------------------------------------------------------------------------------------------
    if(isPlug($ref->SiteOrigin)&&!isRepo("$ntv/site"))
    {
        siteLocked(true);
        Repo::cloned($ref->SiteOrigin,"$ntv/site",$ref->SiteBranch,"master"); // clone remote site-repo to native
        $lst=pget("$ntv/site",false); xpop($lst,".git"); // get list of site-repo items to copy to fuse-repo .. omit `.git`
        foreach($lst as $itm){path::copy("$ntv/site/$itm","$ntv/fuse/$itm",true);}; // copy all site-items to fuse-repo
        $hta=htbackup(pget("$ntv/site/.htaccess"),pget("$ntv/anon/.htaccess")); // get fused htaccess rules
        path::make("$ntv/fuse/.htaccess",$hta); // write anon-site-fused htaccess rules to fuse-repo
        unset($lst,$itm); Repo::commit("$ntv/fuse","cloned Site",true); // track & commit & push fuse-repo-changes to tank
        chmod((ROOTPATH."/.htaccess"),0644);
        Repo::update('/','pull'); chmod(ROOTPATH."/.htaccess",0444);
        Repo::ignore("$ntv/site",write,conf('Repo/gitIgnor')); // things to ignore for this repo
        siteLocked(false);
    };
# -----------------------------------------------------------------------------------------------------------------------------



# cond :: prep : web-root fusion
# -----------------------------------------------------------------------------------------------------------------------------
    $tko=path::purl(path::info("$rmt/tank.git"),true); // tank origin url

    if($wro!==$tko)
    {
        siteLocked(true); chmod((ROOTPATH."/.htaccess"),0644);
        $hsh=PROCHASH; $usr="master"; $eml=simp(pget("$/User/data/$usr/mail")); $mpw=pget("$/User/data/$usr/pass"); // vars
        exec::{"rm -r ./.git && mkdir $hsh && git clone $tko ./$hsh && cp -r ./$hsh/.git . && rm -rf ./$hsh"}("/"); // copy git
        wait(60); // breathe
        if (!isRepo('/')){ fail::upkeep("expecting: `/` as a repository"); };
        exec::{'git config --local pack.windowMemory 10m'}('/'); // memory handling
        exec::{'git config --local pack.packSizeLimit 20m'}('/'); // memory handling
        exec::{"git config --local user.name \"$usr\""}("/"); exec::{"git config --local user.email \"$eml\""}("/"); // Git ID
        Repo::commit("/","cloned web-root",true);
        Repo::update('/','pull'); chmod(ROOTPATH."/.htaccess",0444);
        path::make("$/User/data/$usr/pass",$mpw); // restore master password & harden hta
        siteLocked(false);
    };
# -----------------------------------------------------------------------------------------------------------------------------



# exec :: keep : run this every time on upkeep
# -----------------------------------------------------------------------------------------------------------------------------
    $tolu=(pget('$/Proc/vars/lastUpdt','0') * 1); $tnow=time();
    if(($tnow-$tolu)<=conf("Proc/sysClock/upkeep"))
    {
        signal::dump("checking repo-ignore-rules after update"); wait(150);
        Repo::ignore("/",write,conf('Repo/gitIgnor'));
    };
# -----------------------------------------------------------------------------------------------------------------------------
