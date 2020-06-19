<?
namespace Anon;


// defn :: required : libs
// ----------------------------------------------------------------------------------------------------------------------------
   $h=__DIR__;
   require_once "$h/Exception.php";
   require_once "$h/PHPMailer.php";
   require_once "$h/SMTP.php"; unset($h);
// ----------------------------------------------------------------------------------------------------------------------------



// func :: (anon/auto) : run this only when applicable .. we want this to fail & exit with as much useful info as possible
// ----------------------------------------------------------------------------------------------------------------------------
   if(isset($_POST['sendMail'])){call(function()
   {
      $O=knob($_POST['sendMail']); $L=(new PHPMailer()); $Y=['mesgHead','htmlBody','textBody'];
      $V=frag('smtpHost smtpAuth smtpSecu smtpPort smtpUser smtpPass fromAddr fromName destAddr destName mesgHead htmlBody textBody',' ');

      foreach($V as $R)
      {
         $X=$O->$R; if($X===null){header("HTTP/1.1 424 Failed Dependency"); die("missing `$R`"); exit;};
         if(!isin($Y,$R)){$O->$R=dval($X);};
      };

      $L->SMTPDebug  = 3;              // Enable verbose debug output
      $L->Host       = $O->smtpHost;   // Set the SMTP server to send through
      $L->SMTPAuth   = $O->smtpAuth;   // Enable SMTP authentication
      $L->SMTPSecure = $O->smtpSecu;   // Enable TLS/SSL encryption; `PHPMailer::ENCRYPTION_SMTPS` encouraged
      $L->Port       = $O->smtpPort;   // TCP port to connect to, use 465 for `PHPMailer::ENCRYPTION_SMTPS` above
      $L->Username   = $O->smtpUser;   // SMTP username
      $L->Password   = $O->smtpPass;   // SMTP password

      $L->isSMTP();                    // Send using SMTP

      if($O->certFail)
      {
        $L->SMTPAutoTLS = false;
        $L->SMTPOptions = array(
            'ssl' => array(
                'verify_peer' => false,
                'verify_peer_name' => false,
                'allow_self_signed' => true
            )
        );
      };

      $L->isHTML(true);                // Use HTML formatted mail
      $L->setFrom($O->fromAddr,$O->fromName);
      $L->addAddress($O->destAddr,$O->destName);

      $L->Subject = $O->mesgHead;
      $L->Body    = $O->htmlBody;
      $L->AltBody = $O->textBody;

      if($O->attached){foreach($O->attached as $ak => $av)
      {
         if(is_int($ak)&&isPath($av)){$L->addAttachment(path($av)); continue;}; if(!isText($ak,1)||!isDurl($av)){continue;};
         $av=furl($av); $L->AddStringAttachment($av->data,$ak,'base64',$av->mime);
      }};

      ob_start(); $r=$L->send(); $ob=ob_get_clean();
      if($r){ekko(OK); exit;};
      print_r($ob); exit;
   });};
// ----------------------------------------------------------------------------------------------------------------------------
