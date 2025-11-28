import nodemailer from "nodemailer";

type FeedbackEmailPayload = {
  type: string;
  message: string;
  email: string | null;
  sourceId: string | null;
  sourceName: string | null;
  origin: string | null;
  referer: string | null;
};

const smtpHost = process.env.SMTP_HOST;
const smtpPort = process.env.SMTP_PORT
  ? Number(process.env.SMTP_PORT)
  : undefined;
const smtpUser = process.env.SMTP_USER;
const smtpPass = process.env.SMTP_PASS;
const smtpSecure = process.env.SMTP_SECURE === "true";
const feedbackTo = process.env.FEEDBACK_EMAIL_TO;
const feedbackFrom =
  process.env.FEEDBACK_EMAIL_FROM || process.env.SMTP_USER || "noreply@haalarikone.fi";

const transporter =
  smtpHost && smtpPort && smtpUser && smtpPass
    ? nodemailer.createTransport({
        host: smtpHost,
        port: smtpPort,
        secure: smtpSecure,
        auth: {
          user: smtpUser,
          pass: smtpPass,
        },
      })
    : null;

export async function sendFeedbackEmail(payload: FeedbackEmailPayload) {
  if (!transporter || !feedbackTo) {
    console.warn(
      "Feedback email skipped: transporter or recipient missing. Check SMTP_* and FEEDBACK_EMAIL_TO env vars."
    );
    return;
  }

  const subject =
    payload.type === "complaint"
      ? "Haalarikone - uusi korjauspyyntö"
      : "Haalarikone - uusi palaute";

  const html = `
    <p>Uusi palaute Haalarikoneesta.</p>
    <ul>
      <li><strong>Tyyppi:</strong> ${payload.type}</li>
      ${
        payload.sourceName
          ? `<li><strong>Kohde:</strong> ${payload.sourceName}</li>`
          : ""
      }
      ${
        payload.sourceId
          ? `<li><strong>Kohteen ID:</strong> ${payload.sourceId}</li>`
          : ""
      }
      ${
        payload.email
          ? `<li><strong>Yhteystieto:</strong> ${payload.email}</li>`
          : ""
      }
      ${payload.origin ? `<li><strong>Origin:</strong> ${payload.origin}</li>` : ""}
      ${payload.referer ? `<li><strong>Referer:</strong> ${payload.referer}</li>` : ""}
    </ul>
    <p><strong>Viesti:</strong></p>
    <pre style="padding:12px;background:#f7f7f7;border-radius:8px;">${payload.message}</pre>
  `;

  const textLines = [
    `Uusi palaute (${payload.type})`,
    payload.sourceName ? `Kohde: ${payload.sourceName}` : null,
    payload.sourceId ? `Kohteen ID: ${payload.sourceId}` : null,
    payload.email ? `Yhteystieto: ${payload.email}` : null,
    payload.origin ? `Origin: ${payload.origin}` : null,
    payload.referer ? `Referer: ${payload.referer}` : null,
    "",
    "Viesti:",
    payload.message,
  ]
    .filter(Boolean)
    .join("\n");

  await transporter.sendMail({
    from: feedbackFrom,
    to: feedbackTo,
    subject,
    text: textLines,
    html,
  });
}

