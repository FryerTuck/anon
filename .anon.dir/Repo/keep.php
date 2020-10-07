<?
namespace Anon;


# prep :: repo : define vars .. create remote-BARE tank repo .. create native NON-BARE fuse repo cloned from tank
# -----------------------------------------------------------------------------------------------------------------------------
    $ref=conf("Repo/gitRefer"); $sto="$ref->SiteOrigin"; // $ref = config .. $sto = site-origin
    $wro=(isRepo('/')?Repo::getURL('/','origin',false):''); $hst=HOSTNAME; $brn=$ref->AnonBranch; // $wro = web-root-origin
    $hta=pget("/.htaccess"); if($hta){chmod((ROOTPATH."/.htaccess"),0644);};  // make web-root htaccess writable for now
    $ntv="$/Repo/data/native"; $rmt="$/Repo/data/remote";

    if($wro&&($wro!==$sto)&&($wro!==$ref->AnonOrigin)&&($sto==="file://$/Repo/data/remote/tank.git")) // if web-root is repo
    {$ref->SiteOrigin=$wro; conf::{"Repo/gitRefer"}($ref);}; // if so then write SiteOrigin-config as existing repo origin

    if(!isFold("$rmt/tank.git")){Repo::create("$rmt/tank.git",BARE,"master");}; // create local BARE tank repo as origin
    if(span(pget("$rmt/tank.git/objects/pack"))<1){$brn=null;}; // no branch yet
    if(!isRepo("$ntv/fuse")){Repo::cloned("file://$rmt/tank.git","$ntv/fuse",$brn,"master");}; // master = user .. not branch
# -----------------------------------------------------------------------------------------------------------------------------



# prep :: repo : clone site-repo from config SiteOrigin .. copy all from web-root to fuse-repo -EXCEPT Anon-related contents
# -----------------------------------------------------------------------------------------------------------------------------
    if(!isRepo("$ntv/site"))
    {
        Repo::cloned($ref->SiteOrigin,"$ntv/site",$ref->SiteBranch,"master"); // clone "remote" Site repo as native site-repo
        $srl=pget("$ntv/site",false); $wrl=pget("/",false); // get lists of site-repo-items & web-root-items
        $omt=[".anon.dir",".git",".anon.php",".htaccess"]; // omit these when copying below to avoid repo corruption
        foreach($srl as $sri){if(!isin($omt,$sri)){path::copy("/$sri","$ntv/fuse/$sri");}}; // all site-repo items to fuse-repo
        foreach($wrl as $wri){if(!isin($omt,$wri)&&!isin($lst,$wri)){path::copy("/$wri","$ntv/fuse/$wri");}}; // root to fuse
        $nht=pget("$ntv/site/.htaccess"); if($nht){$hta="$nht";}; unset($srl,$sri,$wrl,$wri,$nht);  // get htaccess rules
        unset($lst,$itm); Repo::commit("$ntv/fuse","cloned Site & fused htaccess",true); // track & commit & push changes
    };
# -----------------------------------------------------------------------------------------------------------------------------



# prep :: repo : clone anon-repo from config AnonOrigin .. fuse htaccess rules from site-repo .. copy all to fuse-repo
# -----------------------------------------------------------------------------------------------------------------------------
    if(!isRepo("$ntv/anon"))
    {
        Repo::cloned($ref->AnonOrigin,"$ntv/anon",$ref->AnonBranch,"master"); // clone "remote" Anon repo as native anon-repo
        $lst=pget("$ntv/anon",false); xpop($lst,".git"); // get list of anon-repo items to copy to fuse-repo .. omit `.git`
        foreach($lst as $itm){path::copy("$ntv/anon/$itm","$ntv/fuse",true);}; // copy all anon items to fuse-repo
        $fht=htbackup(($hta?$hta:""),pget("$ntv/anon/.htaccess")); path::make("$ntv/fuse/.htaccess",$fht); // fuse htaccess
        Repo::commit("$ntv/fuse","cloned Anon & fused htaccess",true); // track & commit & push fuse-repo-changes to tank
    };
# -----------------------------------------------------------------------------------------------------------------------------



# cond :: prep : if web-root-origin and tank-origin differ then clone tank as web-root .. all seems ready now
# -----------------------------------------------------------------------------------------------------------------------------
    $tko=path::purl(path::info("$rmt/tank.git"),true); // tank origin url

    if($wro!==$tko)
    {
        $hsh=PROCHASH; $usr="master"; $eml=simp(pget("$/User/data/$usr/mail")); $mpw=pget("$/User/data/$usr/pass"); // vars
        exec::{"rm -r ./.git && mkdir $hsh && git clone $tko ./$hsh && cp -r ./$hsh/.git . && rm -rf ./$hsh"}("/"); // copy git
        exec::{"git config --local user.name \"$usr\""}("/"); exec::{"git config --local user.email \"$eml\""}("/"); // Git ID
        path::make("$/User/data/$usr/pass",$mpw); chmod(ROOTPATH."/.htaccess",0444); // restore master password & harden hta
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
