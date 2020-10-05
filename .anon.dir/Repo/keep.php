<?
namespace Anon;


# cond :: repos : safely combine 2 repositories .. we need 5 .. 1 BARE .. 2 sources .. 1 test .. 1 root
# -----------------------------------------------------------------------------------------------------------------------------
    $ref=conf("Repo/gitRefer"); $cfo="$ref->SiteOrigin";
    $sto=(isRepo('/')?Repo::getURL('/','origin',false):''); $hst=HOSTNAME; $brn=$ref->AnonBranch;
    if($sto&&($sto!==$cfo)&&($cfo==="file://$/Repo/data/remote/tank.git"))
    {$ref->SiteOrigin=$sto; conf::{"Repo/gitRefer"}($ref);}; // auto-set SiteOrigin to existing repo origin .. if any
    $inf=path::info(crop($ref->SiteOrigin)); $ntv="$/Repo/data/native"; $rmt="$/Repo/data/remote";
    if(($inf->plug==="file")&&!isee($inf->path)){Repo::create($inf->path,BARE);}; // we will clone from here

    if(!isFold("$rmt/tank.git")){Repo::create("$rmt/tank.git",BARE,"master");}; // create local origin
    if(span(pget("$rmt/tank.git/objects/pack"))<1){$brn=null;}; // no branch yet
    if(!isRepo("$ntv/test")){Repo::cloned("file://$rmt/tank.git","$ntv/test",$brn,"master");}; // master = user

    if(!isRepo("$ntv/anon"))
    {
        Repo::cloned($ref->AnonOrigin,"$ntv/anon",$ref->AnonBranch,"master"); $lst=pget("$ntv/anon",false);
        xpop($lst,".git"); foreach($lst as $itm){path::copy("$ntv/anon/$itm","$ntv/test",true);}; unset($lst,$itm);
        Repo::commit("$ntv/test","cloned Anon",true);
    };

    if(!isRepo("$ntv/site"))
    {
        Repo::cloned($ref->SiteOrigin,"$ntv/site",$ref->SiteBranch,"master"); $lst=pget("$ntv/site",false);
        xpop($lst,".git"); foreach($lst as $itm){path::copy("$ntv/site/$itm","$ntv/test",true);}; unset($lst,$itm);
        Repo::commit("$ntv/test","cloned Site",true);
    };


    if($cfo!==$sto)
    {
        $hsh=PROCHASH; path::make("/$hsh/"); // make temporary empty folder for tank repo
        $tko=path::purl(path::info("$ntv/test"),true); // tank origin url
        $mpw=pget("$/User/data/master/pass"); // backup master password

        exec::{"git clone $tko ."}("/$hsh/"); // clone tank into temporary folder
        path::void("/.git"); $lst=pget("/$hsh/",false); // delete .git from web-root & get list of tank files

        foreach($lst as $itm)
        {
            path::copy("/$hsh/$itm","/",true); // copy all from tank into web-root & replace existing files
        };

        $u="master"; $m=pget("$/User/data/$u/mail"); path::void("/$hsh"); // get master info .. delete temporary tank folder
        path::make("$/User/data/master/pass",$mpw); // respore master password
        exec::{"git config --local user.name \"$u\""}("/"); exec::{"git config --local user.email \"$m\""}("/");
        Repo::commit("/","website backup",true); // add all & commit changes in web-root & push to tank-repo
        Repo::update('$/Repo/data/native/test','pull');
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
