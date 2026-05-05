export type MailFormPayload = {
  formType: "reservation" | "contact";
  contact_name: string;
  contact_email: string;
  contact_phone: string;
  service_type: string;
  preferred_date?: string;
  preferred_time?: string;
  item_slug?: string;
  category_type?: string;
  message: string;
};

type MailerResponse = {
  success: boolean;
  message?: string;
};

export async function sendFormEmail(payload: MailFormPayload): Promise<void> {
  const endpoint = process.env.NEXT_PUBLIC_PHP_MAILER_ENDPOINT;

  if (!endpoint) {
    throw new Error("Missing NEXT_PUBLIC_PHP_MAILER_ENDPOINT in environment variables.");
  }

  const response = await fetch(endpoint, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  const result = (await response.json()) as MailerResponse;

  if (!response.ok || !result.success) {
    throw new Error(result.message || "Email sending failed.");
  }
}
