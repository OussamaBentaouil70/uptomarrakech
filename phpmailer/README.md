# PHPMailer Endpoint (MyMarrakechTrip)

This folder contains a standalone PHP endpoint that sends:

- Admin notification email (to your Gmail)
- Client thank-you email (to the form submitter)

## 1) Install dependencies

```bash
cd phpmailer
composer install
```

## 2) Configure Gmail SMTP

1. Copy `.env.example` to `.env`
2. Set values:
   - `SMTP_USER=yourgmail@gmail.com`
   - `SMTP_PASS=your Gmail app password`
   - `ADMIN_EMAIL=yourgmail@gmail.com`
   - `ALLOWED_ORIGIN=http://localhost:3000`

Gmail requires an **App Password** (2FA enabled), not your normal password.

## 3) Serve this endpoint with PHP/Apache

Use XAMPP (or any PHP server) so `send_email.php` is executable.

Example URL:

`http://localhost/uptomarrakech/phpmailer/send_email.php`

## 4) Connect Next.js forms to this endpoint

In your Next.js `.env`:

```env
NEXT_PUBLIC_PHP_MAILER_ENDPOINT=http://localhost/uptomarrakech/phpmailer/send_email.php
```

Then restart your Next.js dev server.
