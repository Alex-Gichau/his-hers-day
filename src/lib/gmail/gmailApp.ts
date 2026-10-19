import "server-only";

import { google } from "googleapis";
import type { gmail_v1 } from "googleapis";

/**
 * A small server-side wrapper around the Gmail API, modelled on Google Apps
 * Script's `GmailApp.sendEmail()`.
 *
 * Everything here runs on the server only — the OAuth refresh token and
 * client secret never reach the browser.
 */

export interface SendEmailOptions {
  /** Recipient(s). A plain string is treated as a single address. */
  to: string | string[];
  /** Subject line. */
  subject: string;
  /** Plain-text body. */
  body: string;
  /** Optional HTML alternative for the body. */
  html?: string;
  /** Display name shown in the "From" field, e.g. "Hers & His". */
  senderName?: string;
  /** Reply-to address — typically the guest's own address. */
  replyTo?: string;
}

export interface SendEmailResult {
  id: string;
  threadId: string;
  labelIds?: string[];
}

/**
 * Builds the raw RFC 2822 message that the Gmail `messages.send` endpoint
 * expects. Using `raw` (rather than the structured `message` payload) keeps
 * headers such as `senderName` under our control.
 */
function buildRawMessage({
  to,
  subject,
  body,
  html,
  senderName,
  replyTo,
  from,
}: SendEmailOptions & { from: string }): string {
  const recipients = Array.isArray(to) ? to : [to];

  // The `From` address must be the authenticated mailbox (or one of its
  // aliases) — Gmail rejects the request otherwise. The guest's address
  // belongs in `Reply-To` so the couple can hit reply.
  const headers = [
    `To: ${recipients.join(", ")}`,
    `Subject: ${subject}`,
    `From: ${formatAddress(from, senderName)}`,
    "MIME-Version: 1.0",
  ];

  if (replyTo && replyTo !== from) {
    headers.push(`Reply-To: ${replyTo}`);
  }

  const textBody = body.replace(/\r?\n/g, "\r\n");

  // A multipart message keeps the plain-text fallback; Gmail renders the HTML
  // part and clients that cannot show HTML fall back to the text part.
  if (html) {
    headers.push('Content-Type: multipart/alternative; boundary="rsvp_boundary"');

    const htmlBody = html.replace(/\r?\n/g, "\r\n");
    const multipart = [
      `--rsvp_boundary`,
      `Content-Type: text/plain; charset="UTF-8"`,
      ``,
      textBody,
      ``,
      `--rsvp_boundary`,
      `Content-Type: text/html; charset="UTF-8"`,
      ``,
      htmlBody,
      ``,
      `--rsvp_boundary--`,
      ``,
    ].join("\r\n");

    return `${headers.join("\r\n")}\r\n\r\n${multipart}`;
  }

  headers.push('Content-Type: text/plain; charset="UTF-8"');
  return `${headers.join("\r\n")}\r\n\r\n${textBody}`;
}

/** Formats an address for a header, e.g. `Hers & His <rsvp@example.com>`. */
function formatAddress(address: string, displayName?: string): string {
  if (!displayName) return address;
  // Quote the display name when it contains characters that would break the
  // header syntax.
  const name = /[",:;<>@[\]\\]/.test(displayName)
    ? `"${displayName.replace(/"/g, '\\"')}"`
    : displayName;
  return `${name} <${address}>`;
}

/** Encodes a string as base64url, which is what the Gmail API expects. */
function encodeBase64Url(value: string): string {
  return Buffer.from(value, "utf8")
    .toString("base64")
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/, "");
}

let cachedAuth: { client: string; refreshToken: string } | null = null;

function getAuthConfig(): { client: string; refreshToken: string } {
  const client =
    process.env.GMAIL_CLIENT_ID ?? process.env.GOOGLE_CLIENT_ID ?? "";
  const refreshToken =
    process.env.GMAIL_REFRESH_TOKEN ?? process.env.GOOGLE_REFRESH_TOKEN ?? "";

  if (!client || !refreshToken) {
    throw new Error(
      "Gmail is not configured. Set GMAIL_CLIENT_ID and GMAIL_REFRESH_TOKEN (see .env.example).",
    );
  }

  cachedAuth = { client, refreshToken };
  return cachedAuth;
}

/** True when the server has enough configuration to send mail. */
export function isGmailConfigured(): boolean {
  return Boolean(
    (process.env.GMAIL_CLIENT_ID ?? process.env.GOOGLE_CLIENT_ID) &&
      (process.env.GMAIL_REFRESH_TOKEN ?? process.env.GOOGLE_REFRESH_TOKEN) &&
      (process.env.GMAIL_SENDER_ADDRESS ??
        process.env.GMAIL_USER_ID ??
        process.env.GOOGLE_USER_ID),
  );
}

function createGmailClient() {
  const { client, refreshToken } = getAuthConfig();

  const oauth2 = new google.auth.OAuth2(
    client,
    process.env.GMAIL_CLIENT_SECRET ?? process.env.GOOGLE_CLIENT_SECRET,
  );

  oauth2.setCredentials({ refresh_token: refreshToken });

  return google.gmail({ version: "v1", auth: oauth2 });
}

/**
 * Sends an email via Gmail.
 *
 * Mirrors `GmailApp.sendEmail({ to, subject, body, senderName })` from Google
 * Apps Script. Resolves with the Gmail message id on success.
 */
export async function sendEmail(
  options: SendEmailOptions,
): Promise<SendEmailResult> {
  const gmail = createGmailClient();

  const from =
    process.env.GMAIL_SENDER_ADDRESS ??
    process.env.GMAIL_USER_ID ??
    process.env.GOOGLE_USER_ID ??
    "";

  if (!from) {
    throw new Error(
      "Gmail is not configured. Set GMAIL_SENDER_ADDRESS to the mailbox the mail is sent from (see .env.example).",
    );
  }

  const raw = buildRawMessage({
    ...options,
    from,
  });

  const response = await gmail.users.messages.send({
    userId: "me",
    requestBody: {
      raw: encodeBase64Url(raw),
    },
  });

  const message = response.data as gmail_v1.Schema$Message;

  return {
    id: message.id ?? "",
    threadId: message.threadId ?? "",
    labelIds: message.labelIds ?? undefined,
  };
}

const gmailApp = { sendEmail, isGmailConfigured };

export default gmailApp;
