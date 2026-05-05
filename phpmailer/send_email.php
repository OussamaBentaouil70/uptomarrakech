<?php

declare(strict_types=1);

use Dotenv\Dotenv;
use PHPMailer\PHPMailer\Exception;
use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\SMTP;

require __DIR__ . '/vendor/autoload.php';

if (file_exists(__DIR__ . '/.env')) {
    Dotenv::createImmutable(__DIR__)->safeLoad();
}

function envValue(string $key, ?string $default = null): ?string
{
    $value = $_ENV[$key] ?? $_SERVER[$key] ?? getenv($key);
    if ($value === false || $value === null || $value === '') {
        return $default;
    }
    return (string) $value;
}

function cleanText(string $value): string
{
    return htmlspecialchars(trim($value), ENT_QUOTES, 'UTF-8');
}

$allowedOrigin = envValue('ALLOWED_ORIGIN', '*');
header("Access-Control-Allow-Origin: {$allowedOrigin}");
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');
header('Content-Type: application/json; charset=utf-8');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(204);
    exit;
}

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['success' => false, 'message' => 'Method not allowed']);
    exit;
}

$smtpHost = envValue('SMTP_HOST', 'smtp.gmail.com');
$smtpUser = envValue('SMTP_USER', '');
$smtpPass = envValue('SMTP_PASS', '');
$smtpPort = (int) envValue('SMTP_PORT', '465');
$smtpSecure = strtolower((string) envValue('SMTP_SECURE', 'ssl'));
$adminEmail = envValue('ADMIN_EMAIL', $smtpUser);
$fromEmail = envValue('FROM_EMAIL', $smtpUser);
$fromName = envValue('FROM_NAME', 'MyMarrakechTrip');

if ($smtpUser === '' || $smtpPass === '' || $adminEmail === '' || $fromEmail === '') {
    http_response_code(500);
    echo json_encode(['success' => false, 'message' => 'Server mail configuration is incomplete']);
    exit;
}

$raw = file_get_contents('php://input');
$data = json_decode($raw, true);
if (!is_array($data)) {
    http_response_code(400);
    echo json_encode(['success' => false, 'message' => 'Invalid JSON payload']);
    exit;
}

$formType = cleanText((string) ($data['formType'] ?? 'contact'));
$name = cleanText((string) ($data['contact_name'] ?? ''));
$emailRaw = trim((string) ($data['contact_email'] ?? ''));
$email = filter_var($emailRaw, FILTER_VALIDATE_EMAIL) ?: '';
$phone = cleanText((string) ($data['contact_phone'] ?? ''));
$service = cleanText((string) ($data['service_type'] ?? 'General inquiry'));
$preferredDate = cleanText((string) ($data['preferred_date'] ?? ''));
$preferredTime = cleanText((string) ($data['preferred_time'] ?? ''));
$itemSlug = cleanText((string) ($data['item_slug'] ?? ''));
$categoryType = cleanText((string) ($data['category_type'] ?? ''));
$message = nl2br(cleanText((string) ($data['message'] ?? '')));

if ($name === '' || $email === '' || $message === '') {
    http_response_code(422);
    echo json_encode(['success' => false, 'message' => 'Name, valid email and message are required']);
    exit;
}

$logoUrl = envValue('LOGO_URL', 'https://i.postimg.cc/L8kqSsCc/logo-mymarrakechtrip.webp');
$siteUrl = envValue('SITE_URL', 'https://mymarrakechtrip.com');

$primaryColor = '#C39A5A';
$textColor = '#1F1B16';
$bgColor = '#F8F2E8';

$styles = "
<style>
  body { font-family: Arial, Helvetica, sans-serif; background: {$bgColor}; margin:0; padding:0; color: {$textColor}; }
  .container { max-width: 640px; margin: 24px auto; background: #fff; border: 1px solid rgba(195,154,90,.2); border-radius: 18px; padding: 30px; }
  .logo { max-width: 180px; height: auto; display:block; margin: 0 auto 22px; }
  .title { font-size: 24px; text-align:center; margin: 0 0 20px; color: {$textColor}; }
  .label { font-size: 11px; letter-spacing: 1.7px; text-transform: uppercase; color: {$primaryColor}; margin-top: 16px; }
  .value { font-size: 16px; line-height: 1.6; margin-top: 6px; }
  .divider { height: 1px; background: linear-gradient(to right, transparent, {$primaryColor}, transparent); margin: 20px 0; }
  .footer { font-size: 12px; text-align:center; color: #8A7B67; margin-top: 24px; }
</style>
";

$adminBody = "
<!DOCTYPE html><html><head>{$styles}</head><body>
  <div class='container'>
    <img class='logo' src='{$logoUrl}' alt='MyMarrakechTrip logo'>
    <h1 class='title'>New {$formType} Submission</h1>

    <div class='label'>Name</div>
    <div class='value'>{$name}</div>

    <div class='label'>Email</div>
    <div class='value'>{$email}</div>

    <div class='label'>Phone</div>
    <div class='value'>{$phone}</div>

    <div class='label'>Service</div>
    <div class='value'>{$service}</div>

    <div class='label'>Preferred date / time</div>
    <div class='value'>{$preferredDate} {$preferredTime}</div>

    <div class='label'>Item slug / category</div>
    <div class='value'>{$itemSlug} {$categoryType}</div>

    <div class='divider'></div>

    <div class='label'>Message</div>
    <div class='value'>{$message}</div>

    <div class='footer'>Internal notification - MyMarrakechTrip</div>
  </div>
</body></html>
";

$clientBody = "
<!DOCTYPE html><html><head>{$styles}</head><body>
  <div class='container'>
    <img class='logo' src='{$logoUrl}' alt='MyMarrakechTrip logo'>
    <h1 class='title'>Thank You {$name}</h1>
    <div class='value' style='text-align:center;'>
      We received your request and our team will get back to you shortly.<br>
      We are excited to help you create your Marrakech experience.
    </div>
    <div class='divider'></div>
    <div class='footer'>
      <a href='{$siteUrl}' style='color:#8A7B67; text-decoration:none;'>{$siteUrl}</a>
    </div>
  </div>
</body></html>
";

$mail = new PHPMailer(true);

try {
    $mail->isSMTP();
    $mail->Host = $smtpHost;
    $mail->SMTPAuth = true;
    $mail->Username = $smtpUser;
    $mail->Password = $smtpPass;
    $mail->SMTPSecure = $smtpSecure === 'tls'
        ? PHPMailer::ENCRYPTION_STARTTLS
        : PHPMailer::ENCRYPTION_SMTPS;
    $mail->Port = $smtpPort;
    $mail->CharSet = 'UTF-8';
    $mail->Timeout = 20;
    $mail->SMTPDebug = SMTP::DEBUG_OFF;

    $mail->setFrom($fromEmail, $fromName);
    $mail->addAddress($adminEmail);
    $mail->addReplyTo($email, $name);
    $mail->isHTML(true);
    $mail->Subject = "MyMarrakechTrip {$formType}: {$name}";
    $mail->Body = $adminBody;
    $mail->send();

    $mail->clearAddresses();
    $mail->clearReplyTos();
    $mail->addAddress($email, $name);
    $mail->Subject = 'Thank you - MyMarrakechTrip';
    $mail->Body = $clientBody;
    $mail->send();

    echo json_encode(['success' => true, 'message' => 'Emails sent successfully']);
} catch (Exception $e) {
    error_log('PHPMailer Error: ' . $mail->ErrorInfo);
    http_response_code(500);
    echo json_encode(['success' => false, 'message' => 'Mailer Error: ' . $mail->ErrorInfo]);
}
