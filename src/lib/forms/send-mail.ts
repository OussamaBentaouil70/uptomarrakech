import nodemailer from "nodemailer";
import { prepareEmails, readMailConfig, type MailEnv, type MailResult } from "./email-templates";

/**
 * Full send_email.php flow with Nodemailer: read config, validate payload,
 * send the admin notification, then the client thank-you email.
 * Works in Node.js (next dev) and on Cloudflare Workers/Pages (nodejs_compat).
 */
export async function handleMailRequest(rawBody: string, env: MailEnv): Promise<MailResult> {
  const config = readMailConfig(env);
  if ("status" in config) return config;

  let data: unknown;
  try {
    data = JSON.parse(rawBody);
  } catch {
    data = null;
  }

  const emails = prepareEmails(data, config);
  if (!Array.isArray(emails)) return emails;

  const transporter = nodemailer.createTransport({
    host: config.host,
    port: config.port,
    secure: config.secure, // true = SMTPS (465), false = STARTTLS (587)
    requireTLS: !config.secure,
    auth: { user: config.user, pass: config.pass },
    connectionTimeout: 20_000, // PHPMailer Timeout = 20
    greetingTimeout: 20_000,
    socketTimeout: 20_000,
  });

  try {
    for (const email of emails) {
      await transporter.sendMail({
        from: { name: config.fromName, address: config.fromEmail },
        to: email.to,
        replyTo: email.replyTo,
        subject: email.subject,
        html: email.html,
        encoding: "utf-8",
      });
    }
    return { status: 200, body: { success: true, message: "Emails sent successfully" } };
  } catch (error) {
    const info = error instanceof Error ? error.message : String(error);
    console.error("Nodemailer Error:", info);
    return { status: 500, body: { success: false, message: `Mailer Error: ${info}` } };
  } finally {
    transporter.close();
  }
}
