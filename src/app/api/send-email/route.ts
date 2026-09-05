import { NextResponse } from "next/server";
import nodemailer from "nodemailer";

type MailFormPayload = {
  formType: "reservation" | "contact";
  contact_name: string;
  contact_email: string;
  contact_phone: string;
  service_type: string;
  preferred_date?: string;
  preferred_time?: string;
  number_of_persons?: number;
  item_slug?: string;
  category_type?: string;
  flight_type?: string;
  stay_location?: string;
  message: string;
};

function cleanText(value: unknown): string {
  return String(value ?? "").trim();
}

function escapeHtml(value: string): string {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

function nl2br(value: string): string {
  return value.replaceAll("\n", "<br />\n");
}

function buildAdminHtml(payload: MailFormPayload, logoUrl: string) {
  const primaryColor = "#C39A5A";
  const textColor = "#1F1B16";
  const bgColor = "#F8F2E8";

  const styles = `
    body { font-family: Arial, Helvetica, sans-serif; background: ${bgColor}; margin:0; padding:0; color: ${textColor}; }
    .container { max-width: 640px; margin: 24px auto; background: #fff; border: 1px solid rgba(195,154,90,.2); border-radius: 18px; padding: 30px; }
    .logo { max-width: 180px; height: auto; display:block; margin: 0 auto 22px; }
    .title { font-size: 24px; text-align:center; margin: 0 0 20px; color: ${textColor}; }
    .label { font-size: 11px; letter-spacing: 1.7px; text-transform: uppercase; color: ${primaryColor}; margin-top: 16px; }
    .value { font-size: 16px; line-height: 1.6; margin-top: 6px; }
    .divider { height: 1px; background: linear-gradient(to right, transparent, ${primaryColor}, transparent); margin: 20px 0; }
    .footer { font-size: 12px; text-align:center; color: #8A7B67; margin-top: 24px; }
  `;

  const preferredInfo = `${cleanText(payload.preferred_date || "")} ${cleanText(payload.preferred_time || "")}`.trim();
  const itemInfo = `${cleanText(payload.item_slug || "")} ${cleanText(payload.category_type || "")}`.trim();
  const numberPersons = payload.number_of_persons ? `<div class='label'>Number of Persons</div><div class='value'>${payload.number_of_persons}</div>` : "";
  const flightType = payload.flight_type ? `<div class='label'>Flight Type</div><div class='value'>${escapeHtml(payload.flight_type)}</div>` : "";
  const stayLocation = payload.stay_location ? `<div class='label'>Stay Location</div><div class='value'>${escapeHtml(payload.stay_location)}</div>` : "";

  return `<!DOCTYPE html>
<html>
  <head>
    <style>${styles}</style>
  </head>
  <body>
    <div class='container'>
      <img class='logo' src='${escapeHtml(logoUrl)}' alt='MyMarrakechTrip logo'>
      <h1 class='title'>New ${escapeHtml(payload.formType)} Submission</h1>

      <div class='label'>Name</div>
      <div class='value'>${escapeHtml(payload.contact_name)}</div>

      <div class='label'>Email</div>
      <div class='value'>${escapeHtml(payload.contact_email)}</div>

      <div class='label'>Phone</div>
      <div class='value'>${escapeHtml(payload.contact_phone)}</div>

      <div class='label'>Service</div>
      <div class='value'>${escapeHtml(payload.service_type)}</div>

      ${preferredInfo ? `<div class='label'>Preferred Date / Time</div><div class='value'>${escapeHtml(preferredInfo)}</div>` : ""}

      ${numberPersons}

      ${flightType}

      ${stayLocation}

      ${itemInfo ? `<div class='label'>Item Slug / Category</div><div class='value'>${escapeHtml(itemInfo)}</div>` : ""}

      <div class='divider'></div>

      <div class='label'>Message</div>
      <div class='value'>${nl2br(escapeHtml(payload.message))}</div>

      <div class='footer'>Internal notification - MyMarrakechTrip</div>
    </div>
  </body>
</html>`;
}

function buildClientHtml(name: string, logoUrl: string, siteUrl: string) {
  const primaryColor = "#C39A5A";
  const textColor = "#1F1B16";
  const bgColor = "#F8F2E8";

  const styles = `
    body { font-family: Arial, Helvetica, sans-serif; background: ${bgColor}; margin:0; padding:0; color: ${textColor}; }
    .container { max-width: 640px; margin: 24px auto; background: #fff; border: 1px solid rgba(195,154,90,.2); border-radius: 18px; padding: 30px; }
    .logo { max-width: 180px; height: auto; display:block; margin: 0 auto 22px; }
    .title { font-size: 24px; text-align:center; margin: 0 0 20px; color: ${textColor}; }
    .value { font-size: 16px; line-height: 1.6; margin-top: 6px; text-align:center; }
    .divider { height: 1px; background: linear-gradient(to right, transparent, ${primaryColor}, transparent); margin: 20px 0; }
    .footer { font-size: 12px; text-align:center; color: #8A7B67; margin-top: 24px; }
    .link { color:#8A7B67; text-decoration:none; }
  `;

  return `<!DOCTYPE html>
<html>
  <head>
    <style>${styles}</style>
  </head>
  <body>
    <div class='container'>
      <img class='logo' src='${escapeHtml(logoUrl)}' alt='MyMarrakechTrip logo'>
      <h1 class='title'>Thank You ${escapeHtml(name)}</h1>
      <div class='value'>
        We received your request and our team will get back to you shortly.<br>
        We are excited to help you create your Marrakech experience.
      </div>
      <div class='divider'></div>
      <div class='footer'>
        <a href='${escapeHtml(siteUrl)}' class='link'>${escapeHtml(siteUrl)}</a>
      </div>
    </div>
  </body>
</html>`;
}

export async function POST(request: Request) {
  const smtpHost = process.env.SMTP_HOST;
  const smtpPortRaw = process.env.SMTP_PORT;
  const smtpUser = process.env.SMTP_USER;
  const smtpPass = process.env.SMTP_PASS;
  const smtpSecureRaw = String(process.env.SMTP_SECURE || "").toLowerCase();
  const fromEmail = process.env.FROM_EMAIL;
  const fromName = process.env.FROM_NAME || "MyMarrakechTrip";
  const adminEmail = process.env.ADMIN_EMAIL;
  const logoUrl = process.env.LOGO_URL || "https://i.postimg.cc/L8kqSsCc/logo-mymarrakechtrip.webp";
  const siteUrl = process.env.SITE_URL || "https://mymarrakechtrip.com";

  if (!smtpHost || !smtpPortRaw || !smtpUser || !smtpPass || !fromEmail || !adminEmail) {
    return NextResponse.json({ success: false, message: "Missing SMTP configuration. Set SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS, FROM_EMAIL, ADMIN_EMAIL." }, { status: 500 });
  }

  const smtpPort = Number.parseInt(smtpPortRaw, 10);
  if (!Number.isFinite(smtpPort)) {
    return NextResponse.json({ success: false, message: "Invalid SMTP_PORT value." }, { status: 500 });
  }

  const smtpSecure = smtpSecureRaw === "ssl" ? true : false;

  let body: any;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ success: false, message: "Invalid JSON payload." }, { status: 400 });
  }

  const payload: MailFormPayload = {
    formType: (body?.formType === "contact") ? "contact" : "reservation",
    contact_name: cleanText(body?.contact_name || ""),
    contact_email: cleanText(body?.contact_email || ""),
    contact_phone: cleanText(body?.contact_phone || ""),
    service_type: cleanText(body?.service_type || "General inquiry"),
    preferred_date: cleanText(body?.preferred_date || ""),
    preferred_time: cleanText(body?.preferred_time || ""),
    number_of_persons: typeof body?.number_of_persons === "number" ? body.number_of_persons : undefined,
    item_slug: cleanText(body?.item_slug || ""),
    category_type: cleanText(body?.category_type || ""),
    flight_type: cleanText(body?.flight_type || ""),
    stay_location: cleanText(body?.stay_location || ""),
    message: cleanText(body?.message || ""),
  };

  if (!payload.contact_name || !payload.contact_email) {
    return NextResponse.json({ success: false, message: "Name and valid email are required" }, { status: 422 });
  }

  try {
    const transporter = nodemailer.createTransport({
      host: smtpHost,
      port: smtpPort,
      secure: smtpSecure,
      auth: {
        user: smtpUser,
        pass: smtpPass,
      },
    });

    // Send admin notification
    await transporter.sendMail({
      from: `${fromName} <${fromEmail}>`,
      to: adminEmail,
      replyTo: payload.contact_email,
      subject: `MyMarrakechTrip ${payload.formType}: ${payload.contact_name}`,
      html: buildAdminHtml(payload, logoUrl),
    });

    // Send thank you email to client
    await transporter.sendMail({
      from: `${fromName} <${fromEmail}>`,
      to: payload.contact_email,
      subject: "Thank you - MyMarrakechTrip",
      html: buildClientHtml(payload.contact_name, logoUrl, siteUrl),
    });

    return NextResponse.json({ success: true, message: "Emails sent successfully" });
  } catch (error) {
    console.error("Nodemailer send failed", error);
    return NextResponse.json({ success: false, message: "Mailer Error: Failed to send email" }, { status: 500 });
  }
}
