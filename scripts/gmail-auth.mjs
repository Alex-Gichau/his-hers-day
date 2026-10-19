/**
 * One-time helper that generates a Gmail OAuth refresh token.
 *
 * Run it once, follow the printed URL, grant access, and paste the refresh
 * token into `.env.local` as `GMAIL_REFRESH_TOKEN`.
 *
 *   node scripts/gmail-auth.mjs
 *
 * Required environment variables (or a `.env.local` file):
 *   GMAIL_CLIENT_ID      — from Google Cloud Console > APIs & Services > Credentials
 *   GMAIL_CLIENT_SECRET  — the client secret of the same OAuth client
 *   GMAIL_REDIRECT_URI   — e.g. http://localhost:3000/oauth2callback
 */

import { createServer } from "node:http";
import { readFileSync, existsSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const here = dirname(fileURLToPath(import.meta.url));
const projectRoot = join(here, "..");

/** Minimal .env.local loader so the script works without dotenv. */
function loadEnvFile() {
  for (const name of [".env.local", ".env"]) {
    const path = join(projectRoot, name);
    if (!existsSync(path)) continue;

    for (const line of readFileSync(path, "utf8").split(/\r?\n/)) {
      const match = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*)\s*$/);
      if (!match) continue;
      const [, key, rawValue] = match;
      const value = rawValue.replace(/^["']|["']$/g, "");
      if (!process.env[key]) process.env[key] = value;
    }
  }
}

loadEnvFile();

const CLIENT_ID = process.env.GMAIL_CLIENT_ID;
const CLIENT_SECRET = process.env.GMAIL_CLIENT_SECRET;
const REDIRECT_URI = process.env.GMAIL_REDIRECT_URI ?? "http://localhost:3000/oauth2callback";
const PORT = Number(new URL(REDIRECT_URI).port || 3000);

if (!CLIENT_ID || !CLIENT_SECRET) {
  console.error(
    "Missing GMAIL_CLIENT_ID and/or GMAIL_CLIENT_SECRET.\n" +
      "Put them in .env.local (see .env.example) or pass them as environment variables.",
  );
  process.exit(1);
}

const SCOPES = ["https://www.googleapis.com/auth/gmail.send"];

const authUrl =
  "https://accounts.google.com/o/oauth2/v2/auth?" +
  new URLSearchParams({
    client_id: CLIENT_ID,
    redirect_uri: REDIRECT_URI,
    response_type: "code",
    scope: SCOPES.join(" "),
    access_type: "offline",
    prompt: "consent",
  }).toString();

console.log("\n1. Open this URL in your browser and sign in:\n");
console.log(authUrl);
console.log("\n2. Accept the permissions — you will be redirected to a localhost page.");
console.log("3. Copy the `code` from the URL and paste it below.\n");

const server = createServer((request, response) => {
  const url = new URL(request.url ?? "/", `http://localhost:${PORT}`);

  if (url.pathname !== new URL(REDIRECT_URI).pathname) {
    response.writeHead(404).end("Not found");
    return;
  }

  const code = url.searchParams.get("code");
  const error = url.searchParams.get("error");

  response.writeHead(200, { "Content-Type": "text/html; charset=utf-8" });

  if (error) {
    response.end(
      `<h1>Authorization failed</h1><p>${error}</p><p>Check the OAuth client type and redirect URI in the Google Cloud Console.</p>`,
    );
    server.close();
    return;
  }

  if (!code) {
    response.end("<h1>No code received</h1>");
    server.close();
    return;
  }

  response.end("<h1>Got it!</h1><p>You can close this tab and return to the terminal.</p>");

  server.close();

  exchangeCodeForTokens(code)
    .then((tokens) => {
      console.log("\nSuccess. Add these to .env.local:\n");
      console.log(`GMAIL_REFRESH_TOKEN=${tokens.refresh_token}`);
      if (tokens.access_token) {
        console.log(`# temporary access token: ${tokens.access_token}`);
      }
      console.log("\nThe refresh token does not expire, so you only need to do this once.");
      process.exit(0);
    })
    .catch((exchangeError) => {
      console.error("\nToken exchange failed:", exchangeError.message);
      process.exit(1);
    });
});

async function exchangeCodeForTokens(code) {
  const response = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      code,
      client_id: CLIENT_ID,
      client_secret: CLIENT_SECRET,
      redirect_uri: REDIRECT_URI,
      grant_type: "authorization_code",
    }).toString(),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error_description ?? data.error ?? `HTTP ${response.status}`);
  }

  return data;
}

server.listen(PORT, () => {
  console.log(`Waiting for the callback on ${REDIRECT_URI} ...\n`);
});
