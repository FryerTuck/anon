<?
namespace Anon;


# prep :: repo : define vars .. create remote-BARE tank repo .. create native NON-BARE fuse repo cloned from tank
# -----------------------------------------------------------------------------------------------------------------------------
    $ref=conf("Repo/gitRefer"); $sto="$ref->SiteOrigin"; // $ref = config .. $sto = site-origin
    $wro=(isRepo('/')?Repo::getURL('/','origin',false):''); $hst=HOSTNAME; $brn=$ref->AnonBranch; // $wro = web-root-origin
    $hta=pget("/.htaccess"); if($hta){chmod((ROOTPATH"/.htaccess"),0644);  // make web-root htaccess writable for now
    $ntv="$/Repo/data/native"; $rmt="$/Repo/data/remote";

    if($wro&&($wro!==$sto)&&($wro!==$ref->AnonOrigin)&&($sto==="file://$/Repo/data/remote/tank.git")) // if web-root is repo
    {$ref->SiteOrigin=$wro; conf::{"Repo/gitRefer"}($ref);}; // if so then write SiteOrigin-config as existing repo origin

    if(!isFold("$rmt/tank.git")){Repo::create("$rmt/tank.git",BARE,"master");}; // create local BARE tank repo as origin
    if(span(pget("$rmt/tank.git/objects/pack"))<1){$brn=null;}; // no branch yet
    if(!isRepo("$ntv/fuse")){Repo::cloned("file://$rmt/tank.git","$ntv/fuse",$brn,"master");}; // master = user .. not branch
# -----------------------------------------------------------------------------------------------------------------------------



# prep :: repo : site .. clone from config SiteOrigin .. if empty then copy all from web-root -EXCEPT Anon-related contents
# -----------------------------------------------------------------------------------------------------------------------------
    if(!isRepo("$ntv/site"))
    {
        Repo::cloned($ref->SiteOrigin,"$ntv/site",$ref->SiteBranch,"master"); // clone tank-repo as site-repo

        $lst=pget("$ntv/site",false); xpop($lst,".git"); if(span($lst)<1) // SiteOrigin is empty .. copy from web-root
        {
            $lst=pget("/",false); $omt=[".anon.dir",".git",".anon.php"]; // get all items to copy .. $omt = omit
            foreach($lst as $itm)
            {
                if(isin($omt,$itm)){if($itm!==".git"){path::void("$ntv/site/$itm");};continue;}; // remove & ignore Anon files
                path::copy("/$itm","$ntv/site",true);
            };
            if($hta){$hta=explode("# === ANONDONE === #",$hta); $hta=rpop($hta); $hta=trim($hta);};
            path::make("$ntv/site/.htaccess",$hta);};
            unset($lst,$itm,$omt,$dlm); // remove Anon from htaccess
        };

        unset($lst); $lst=pget("$ntv/site",false); xpop($lst,".git"); // copy site items to fuse repo
        foreach($lst as $itm){path::copy("$ntv/site/$itm","$ntv/fuse",true);}; unset($lst,$itm);

        Repo::commit("$ntv/fuse","cloned Site",true); // track & commit & push fuse-repo-changes to tank
    };
# -----------------------------------------------------------------------------------------------------------------------------



# prep :: repo : anon .. clone from config AnonOrigin .. fuse htaccess rules from site-repo .. copy all to fuse-repo
# -----------------------------------------------------------------------------------------------------------------------------
    if(!isRepo("$ntv/anon"))
    {
        Repo::cloned($ref->AnonOrigin,"$ntv/anon",$ref->AnonBranch,"master"); // clone remote Anon repo as native anon-repo
        $lst=pget("$ntv/anon",false); xpop($lst,".git"); // list of items to copy .. omit `.git`
        foreach($lst as $itm){path::copy("$ntv/anon/$itm","$ntv/fuse",true);}; // copy all to fuse-repo
        $hta=pget("$ntv/site/.htaccess"); if(!$hta){$hta='';}; $hta=htbackup($hta,pget("$ntv/anon/.htaccess"));// fuse htaccess
        path::make("$ntv/fuse/.htaccess",$hta); unset($lst,$itm,$hta); // write fused htaccess to fuse-repo
        Repo::commit("$ntv/fuse","cloned Anon",true); // track & commit & push fuse-repo-changes to tank
    };
# -----------------------------------------------------------------------------------------------------------------------------



# cond :: prep : if configured-from-origin and site-origin differ then the following must be run
# -----------------------------------------------------------------------------------------------------------------------------
    $tko=path::purl(path::info("$rmt/tank.git"),true); // tank origin url

    if($wro!==$tko)
    {
        $hsh=PROCHASH; path::make("/$hsh/"); // make temporary empty folder for tank repo
        $mpw=pget("$/User/data/master/pass"); // backup master password

        exec::{"git clone $tko ."}("/$hsh/"); // clone tank into temporary folder .. can only clone into empty folder
        path::void("/.git"); $lst=pget("/$hsh/",false); // delete .git from web-root & get list of tank files
        foreach($lst as $itm){path::copy("/$hsh/$itm","/",true);}; // copy all from tank into web-root & replace existing

        path::make("/.htaccess",pget("$ntv/fuse/.htaccess")); // write fused htaccess .. -before anything goes wrong!
        path::make("$/User/data/master/pass",$mpw); // restore master password .. just in case
        path::void("/$hsh"); $u="master"; $m=pget("$/User/data/$u/mail"); // delete temp-tank folder .. get master-user info
        exec::{"git config --local user.name \"$u\""}("/"); exec::{"git config --local user.email \"$m\""}("/");
        Repo::commit("/","website backup",true); // track & commit & push root-repo-changes to tank
        Repo::update("$ntv/fuse",'pull'); // pull any cnages made in tank into fuse-repo
        chmod(ROOTPATH."/.htaccess",0444); // make htaccess read-only
    };
# -----------------------------------------------------------------------------------------------------------------------------



# conf :: Anon : write the gitIgnor config into web-root .git/info/exclude .. this keeps Anon-config unchanged during updates
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
