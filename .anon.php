<?php
## no namespace here


# info :: file : read this
# ---------------------------------------------------------------------------------------------------------------------------------------------
# this file is the main entry-point of any interface; it's compatible with ancient PHP (versions < 4) and used for graceless fail without issue
# at this point we don't know if PHP knows what version it is, or if the framework is intact, or if some swamp crawler is on the hunt for blood
# ...
# THE CHRONICLE
# here we are in "the mud"; we need to get out as fast as possible; we only grab our boots and hurry out, we can strap 'em later when it's safe
# who knows what lurks in the shadows of a place where even ground beneath your feet is unsteady ..and the air carries the scent of uncertainty
# ---------------------------------------------------------------------------------------------------------------------------------------------



# func :: harakiri : let be known that we died honorably .. commit suicide due to some unfortunate issue, without leaving a "body"
# ---------------------------------------------------------------------------------------------------------------------------------------------
   function harakiri($m)
   {
      if(FALSE == isset($_SERVER)){die("$m\n");}; if(FALSE == isset($_SERVER['HTTP_USER_AGENT'])){die("$m\n");}; // most probably CLI
      header("HTTP/1.1 503 $m"); die();
   }
# ---------------------------------------------------------------------------------------------------------------------------------------------



# flow :: initialize : no love for PHPv < 5.6 .. and CLI has no business here .. set the PWD, then initialize the boot sequence
# ---------------------------------------------------------------------------------------------------------------------------------------------
   $m="this server's software is older than my dead grandmother's fashionable bloomers";
   if(FALSE == function_exists('version_compare')){harakiri($m);};         // YOU HAVE DIED
   if(version_compare(phpversion(),'5.6','<')){harakiri($m);};             // YOU HAVE DIED
   if(php_sapi_name() === 'cli'){harakiri("use a headless web browser");}; // YOU HAVE DIED
   if(FALSE == isset($_SERVER)){harakiri("invalid platform");};            // YOU HAVE DIED
   if(FALSE == isset($_COOKIE)){harakiri("invalid platform");};            // YOU HAVE DIED

   $r=__DIR__; chdir($r); $_SERVER['ROOTPATH']=$r; $c="$r/.anon.dir"; $_SERVER['COREPATH']=$c;
   if(!is_readable("$c/Proc/base/aard.php")){harakiri("framework structure compromised, check permissions, or re-install");}; // YOU HAVE DIED

   ini_set('expose_php',false);
   ini_set('short_open_tag',true);
   ini_set('display_errors',true);
   ini_set('max_execution_time',60);
   ini_set('default_charset','UTF-8');

   unset($m,$r,$c); require ($_SERVER['COREPATH'].'/Proc/base/aard.php'); // whew .. made it out of "the mud" .. now we face "the swamp"
# ---------------------------------------------------------------------------------------------------------------------------------------------
