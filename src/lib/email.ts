type InquiryNotification = {
  inquiryId: string;
  name: string;
  phone: string;
  email: string | null;
  message: string;
  source: string;
};

function escapeHtml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

export async function sendInquiryNotification({
  inquiryId,
  name,
  phone,
  email,
  message,
  source,
}: InquiryNotification) {
  const apiKey = process.env.RESEND_API_KEY;
  const to = process.env.INQUIRY_NOTIFICATION_EMAIL;
  const from = process.env.INQUIRY_FROM_EMAIL;

  if (!apiKey || !to || !from) return;

  const subject = `New ${source} enquiry from ${name}`;
  const safeMessage = escapeHtml(message).replace(/\n/g, "<br />");

  try {
    const response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from,
        to: [to],
        reply_to: email ?? undefined,
        subject,
        text: [
          `New ${source} enquiry`,
          "",
          `Name: ${name}`,
          `Phone: ${phone}`,
          `Email: ${email ?? "Not provided"}`,
          `Reference: ${inquiryId}`,
          "",
          message,
        ].join("\n"),
        html: `
          <h2>New ${escapeHtml(source)} enquiry</h2>
          <p><strong>Name:</strong> ${escapeHtml(name)}<br />
          <strong>Phone:</strong> ${escapeHtml(phone)}<br />
          <strong>Email:</strong> ${escapeHtml(email ?? "Not provided")}<br />
          <strong>Reference:</strong> ${escapeHtml(inquiryId)}</p>
          <p>${safeMessage}</p>
        `,
      }),
      signal: AbortSignal.timeout(8000),
    });

    if (!response.ok) {
      console.error(
        `[ivory-oak] Email notification failed for enquiry ${inquiryId} (${response.status}).`,
      );
    }
  } catch (error) {
    console.error(
      `[ivory-oak] Email notification failed for enquiry ${inquiryId}.`,
      error,
    );
  }
}
