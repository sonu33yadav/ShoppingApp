<?php
//defined('BASEPATH') OR exit('No direct script access allowed');

/**
 * CodeIgniter PHPMailer Class
 *
 * This class enables SMTP email with PHPMailer
 *
 * @category    Libraries
 * @author      CodexWorld
 * @link        https://www.codexworld.com
 */

use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;
class PHPMailer_Lib
{
    public function __construct(){
        log_message('Debug', 'PHPMailer class is loaded.');
    }

    public function load(){
        // Include PHPMailer library files
        require_once APPPATH.'third_party/PHPMailer/Exception.php';
        require_once APPPATH.'third_party/PHPMailer/PHPMailer.php';
        require_once APPPATH.'third_party/PHPMailer/SMTP.php';
        
        $mail = new PHPMailer;
        return $mail;
    }

    function sendEmail ($fullName, $invoiceNo, $totalAmount, $attachment)
    {
        $subject = "RapidTest - Invoice from $fullName";
        $htmlContent = "<html><head><style>div{border-radius:5px;}#title{margin-left:3%;}.stuff{display:inline-block;margin-top:6px;margin-left:55px;width:75%;height:1000px;}p,li{font-family:'CormorantGaramond';}.head{font-size:20px;}#name{font-family:Sacramento;float:right;margin-top:10px;margin-right:4%;}a{color:black;text-decoration:none;}</style></head><body>
        <p>Dear Sir/Madam,</p>
        <p>Please find attached invoice of $fullName for amount of CAD $totalAmount.</p>
        
        <p>Thank you,</p>
        <p>Rapid Test & Trace Canada</p>
        </div></body></html>";
        
        //$headers = "MIME-Version: 1.0" . "\r\n";
        //$headers .= "Content-type:text/html;charset=UTF-8" . "\r\n";
        //$headers .= 'From: Vyapar Kesari <nnsonline@nnsonline.com>' . "\r\n";
        //$headers .= "Bcc: $email" . "\r\n";
        $attachmentName = "Invoice of " . $fullName;
        $this->send($subject, $htmlContent, $attachment, $attachmentName);
    }


    function sendInvoiceStatusEmail ($fullName, $email, $invoiceNo, $message)
    {
        $subject = "RapidTest - Your Invoice ($invoiceNo) Status";
        $htmlContent = "<html><head><style>div{border-radius:5px;}#title{margin-left:3%;}.stuff{display:inline-block;margin-top:6px;margin-left:55px;width:75%;height:1000px;}p,li{font-family:'CormorantGaramond';}.head{font-size:20px;}#name{font-family:Sacramento;float:right;margin-top:10px;margin-right:4%;}a{color:black;text-decoration:none;}</style></head><body>
        <p>Dear $fullName,</p>
        <p>$message</p>
        
        <p>Thank you,</p>
        <p>Rapid Test & Trace Canada</p>
        </div></body></html>";
        
        require_once APPPATH.'third_party/PHPMailer/Exception.php';
        require_once APPPATH.'third_party/PHPMailer/PHPMailer.php';
        require_once APPPATH.'third_party/PHPMailer/SMTP.php';
        $mail = new PHPMailer;
        // SMTP configuration
        $mail->isSMTP();
        $mail->Host     = 'smtp-relay.sendinblue.com';
        $mail->SMTPAuth = true;
        $mail->Username = 'adam@turkeyburg.ca';
        $mail->Password = 'xsmtpsib-23819a964e5862e05eb6325d524915651f33aa182c8f0ffb947d8ced3c2646c2-9IUEScLCKGPJMq13';
        //$mail->SMTPSecure = 'ssl';
        $mail->Port = 587;
        $mail->setFrom('mobile@rapidtestandtrace.ca', 'RTT Invoice');
        //$mail->addReplyTo('info@example.com', 'CodexWorld');
        // Add a recipient
        $mail->addAddress($email);
        // Add cc or bcc 
        //$mail->addCC('panditsha.1991@gmail.com');  
        //$mail->addCC('umakantgoyal1@gmail.com');        
        // Email subject
        $mail->Subject = $subject;
        // Set email format to HTML
        $mail->isHTML(true);
        // Email body content
        $mail->Body = $htmlContent;

        // Send email
        if(!$mail->send()){
            log_message('error', "Mail - " . $mail->ErrorInfo);
        }else{
            log_message('error', "Mail has been sent");
        }
    }

    function send($subject, $body, $attachment, $attachmentName){
		require_once APPPATH.'third_party/PHPMailer/Exception.php';
        require_once APPPATH.'third_party/PHPMailer/PHPMailer.php';
        require_once APPPATH.'third_party/PHPMailer/SMTP.php';
        $mail = new PHPMailer;
        // SMTP configuration
        $mail->isSMTP();
        $mail->Host     = 'smtp-relay.sendinblue.com';
        $mail->SMTPAuth = true;
        $mail->Username = 'adam@turkeyburg.ca';
        $mail->Password = 'xsmtpsib-23819a964e5862e05eb6325d524915651f33aa182c8f0ffb947d8ced3c2646c2-9IUEScLCKGPJMq13';
        //$mail->SMTPSecure = 'ssl';
        $mail->Port = 587;
        $mail->setFrom('mobile@rapidtestandtrace.ca', 'RTT Testing');
        //$mail->addReplyTo('info@example.com', 'CodexWorld');
        // Add a recipient
        $mail->addAddress('umakantgoyal1@gmail.com');
        //$mail->addAddress('panditsha.1991@gmail.com');
        // Add cc or bcc 
        //$mail->addCC('panditsha.1991@gmail.com');        
        // Email subject
        $mail->Subject = $subject;
        // Set email format to HTML
        $mail->isHTML(true);
        // Email body content
        $mail->Body = $body;
        if ('' != $attachment)
            $mail->AddAttachment($attachment, $attachmentName ,  $encoding = 'base64', $type = 'application/pdf');

        // Send email
        if(!$mail->send()){
            log_message('error', "Mail - " . $mail->ErrorInfo);
        }else{
            log_message('error', "Mail has been sent");
        }
    }

}
