<?
use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\SMTP;
use PHPMailer\PHPMailer\Exception;

   $h=__DIR__;
   require_once "$h/PHPMailer.php";
   require_once "$h/SMTP.php";
   require_once "$h/Exception.php";

   $export=(new PHPMailer());
