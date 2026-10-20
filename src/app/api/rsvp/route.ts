import { NextResponse } from "next/server";

import { isGmailConfigured, sendEmail } from "@/lib/gmail/gmailApp";
import { siteData } from "@/data";

/**
 * Receives an RSVP and emails it to the couple via Gmail.
 *
 * The subject and body are derived from the submitted form:
 *   - Subject: "<Name> has RSVP'd" (or "<Name> has RSVP'd with <n> Guests")
 *   - Body:    the "Message" field
 *
 * The `senderName` is set on the outgoing mail so the couple's Gmail shows a
 * friendly name instead of a bare address.
 */

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

interface RsvpPayload {
  name?: string;
  guests?: string | number;
  email?: string;
  message?: string;
  [key: string]: unknown;
}

/** Reads the recipient address from the environment. */
function getRecipient(): string {
  return (
    process.env.RSVP_TO_EMAIL ??
    process.env.GMAIL_RECIPIENT ??
    process.env.RSVP_RECIPIENT ??
    ""
  ).trim();
}

/** Builds the display name shown in the "From" field. */
function getSenderName(): string {
  return (
    process.env.RSVP_SENDER_NAME ??
    siteData.couple.displayName ??
    "Hers & His"
  ).trim();
}

/** A pragmatic email shape check — not RFC 5322, but enough to catch typos. */
const EMAIL_PATTERN = /^[^\s@,;<>"\\]+@[^\s@,;<>"\\]+\.[^\s@,;<>"\\]{2,}$/;

/** Upper bounds so a single request cannot build an enormous email. */
const MAX_NAME_LENGTH = 200;
const MAX_MESSAGE_LENGTH = 5000;

/**
 * "Ada Lovelace" -> "Ada has RSVP'd"
 * "Ada Lovelace" + 4 guests -> "Ada Lovelace has RSVP'd with 4 Guests"
 */
function buildSubject(name: string, guests: number | null): string {
  const trimmed = name.trim() || "A guest";
  const base = `${trimmed} has RSVP'd`;

  if (guests && guests > 1) {
    return `${base} with ${guests} Guests`;
  }

  return base;
}

/** Builds the plain-text body from the "Message" field. */
function buildBody(message: string, name: string, guests: number | null, email: string): string {
  const trimmedMessage = message.trim();

  const lines = [
    trimmedMessage || "No message was left.",
    "",
    "---",
    `Name: ${name.trim() || "—"}`,
    `Guests: ${guests ?? 1}`,
  ];

  if (email.trim()) {
    lines.push(`Email: ${email.trim()}`);
  }

  return lines.join("\n");
}

export async function POST(request: Request) {
  let payload: RsvpPayload;

  try {
    payload = (await request.json()) as RsvpPayload;
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  const name = typeof payload.name === "string" ? payload.name : "";
  const email = typeof payload.email === "string" ? payload.email : "";
  const message = typeof payload.message === "string" ? payload.message : "";

  if (!name.trim()) {
    return NextResponse.json({ error: "Please add your name." }, { status: 400 });
  }

  // The email is optional, but if one is given it must be usable — it ends up
  // in the `Reply-To` header.
  if (email.trim() && !EMAIL_PATTERN.test(email.trim())) {
    return NextResponse.json(
      { error: "Please check the email address." },
      { status: 400 },
    );
  }

  // Keep the payload within sane limits so one request cannot produce an
  // enormous email.
  if (name.length > MAX_NAME_LENGTH) {
    return NextResponse.json(
      { error: "That name is too long." },
      { status: 400 },
    );
  }

  if (message.length > MAX_MESSAGE_LENGTH) {
    return NextResponse.json(
      { error: "That message is too long." },
      { status: 400 },
    );
  }

  const guests = Number(payload.guests);
  const guestCount = Number.isFinite(guests) && guests > 0 ? Math.round(guests) : null;

  const recipient = getRecipient();

  if (!recipient) {
    return NextResponse.json(
      { error: "RSVP is not configured. Set RSVP_TO_EMAIL on the server." },
      { status: 500 },
    );
  }

  if (!isGmailConfigured()) {
    return NextResponse.json(
      {
        error:
          "RSVP is not configured. Set GMAIL_CLIENT_ID, GMAIL_REFRESH_TOKEN and GMAIL_SENDER_ADDRESS on the server.",
      },
      { status: 500 },
    );
  }

  try {
    const result = await sendEmail({
      to: recipient,
      subject: buildSubject(name, guestCount),
      body: buildBody(message, name, guestCount, email),
      senderName: getSenderName(),
      replyTo: email.trim() || undefined,
    });

    return NextResponse.json({ ok: true, messageId: result.id });
  } catch (error) {
    console.error("[rsvp] Failed to send Gmail message:", error);

    return NextResponse.json(
      { error: "We could not send your RSVP. Please try again in a moment." },
      { status: 502 },
    );
  }
}
