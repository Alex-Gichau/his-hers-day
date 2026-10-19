// Verifies the scroll-reveal behaviour and the letter's sentence-by-sentence reveal.
// Usage: node scripts/probe-reveal.mjs <url> <port>
import { spawn } from "node:child_process";
import { setTimeout as delay } from "node:timers/promises";

const url = process.argv[2] ?? "http://localhost:3097";
const port = Number(process.argv[3] ?? 9232);
const EDGE = "C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe";
const userDir = "C:\\Users\\gicha\\AppData\\Local\\Temp\\edge-probe-reveal";

const child = spawn(
  EDGE,
  [
    "--headless=new",
    `--remote-debugging-port=${port}`,
    `--user-data-dir=${userDir}`,
    "--no-first-run",
    "--no-default-browser-check",
    "--disable-gpu",
    "--window-size=1440,900",
    "about:blank",
  ],
  { stdio: "ignore" },
);

async function findTarget() {
  for (let i = 0; i < 60; i++) {
    try {
      const res = await fetch(`http://127.0.0.1:${port}/json/list`);
      const list = await res.json();
      const page = list.find((t) => t.type === "page");
      if (page) return page.webSocketDebuggerUrl;
    } catch {
      /* not up yet */
    }
    await delay(250);
  }
  throw new Error("DevTools endpoint never became available");
}

const wsUrl = await findTarget();
const ws = new WebSocket(wsUrl);
await new Promise((resolve, reject) => {
  ws.addEventListener("open", resolve, { once: true });
  ws.addEventListener("error", reject, { once: true });
});

let nextId = 1;
const pending = new Map();
ws.addEventListener("message", (event) => {
  const msg = JSON.parse(event.data);
  if (msg.id && pending.has(msg.id)) {
    pending.get(msg.id)(msg);
    pending.delete(msg.id);
  }
});

function send(method, params = {}) {
  const id = nextId++;
  return new Promise((resolve) => {
    pending.set(id, resolve);
    ws.send(JSON.stringify({ id, method, params }));
  });
}

await send("Page.enable");
await send("Runtime.enable");

async function evaluate(expression) {
  const res = await send("Runtime.evaluate", {
    expression,
    returnByValue: true,
    awaitPromise: true,
  });
  if (res.result?.exceptionDetails) {
    throw new Error(JSON.stringify(res.result.exceptionDetails));
  }
  return res.result?.result?.value;
}

await send("Page.navigate", { url });
await delay(6000);

const script = `(async () => {
  document.documentElement.style.scrollBehavior = 'auto';
  await new Promise(r => setTimeout(r, 800));
  const V = {};

  const reveals = () => [...document.querySelectorAll('.reveal')];
  const sentenceEls = () => [...document.querySelectorAll('.letter-sentence')];

  V.revealCount = reveals().length;
  V.sentenceCount = sentenceEls().length;

  // At the top of the page, below-the-fold reveals must still be hidden.
  V.hiddenAtTop = reveals().filter(el => el.dataset.reveal === 'hidden').length;
  V.shownAtTop = reveals().filter(el => el.dataset.reveal === 'shown').length;
  V.sentencesHiddenAtTop = sentenceEls().filter(el => el.dataset.reveal === 'hidden').length;

  // Opacity of a below-the-fold reveal before scrolling.
  const belowFold = reveals().find(el => {
    const r = el.getBoundingClientRect();
    return r.top > window.innerHeight && el.dataset.reveal === 'hidden';
  });
  V.belowFoldOpacityBefore = belowFold ? getComputedStyle(belowFold).opacity : 'NONE';
  V.belowFoldTransformBefore = belowFold ? getComputedStyle(belowFold).transform : 'NONE';

  // Scroll to the letter section and watch the sentences appear one by one.
  const letter = document.getElementById('letter');
  letter.scrollIntoView({ behavior: 'auto', block: 'center' });
  await new Promise(r => setTimeout(r, 400));

  const counts = [];
  for (let i = 0; i < 16; i++) {
    counts.push(sentenceEls().filter(el => el.dataset.reveal === 'shown').length);
    await new Promise(r => setTimeout(r, 300));
  }
  V.sentenceShownCounts = counts;
  V.sentenceCountsIncreaseMonotonically = counts.every((c, i) => i === 0 || c >= counts[i - 1]);
  V.sentenceShownAtStart = counts[0];
  V.sentenceShownAtEnd = counts[counts.length - 1];

  // After the sequence completes, everything is shown.
  await new Promise(r => setTimeout(r, 2000));
  V.sentenceShownFinal = sentenceEls().filter(el => el.dataset.reveal === 'shown').length;
  V.signatureOpacity = getComputedStyle(document.querySelector('#letter p.font-hand:last-of-type') || document.querySelector('#letter')).opacity;

  // Scroll through the whole page and confirm everything ends up shown.
  const step = window.innerHeight * 0.7;
  for (let y = 0; y < document.body.scrollHeight; y += step) {
    window.scrollTo(0, y);
    await new Promise(r => setTimeout(r, 160));
  }
  await new Promise(r => setTimeout(r, 1200));
  V.revealsShownAfterFullScroll = reveals().filter(el => el.dataset.reveal === 'shown').length;
  V.revealsHiddenAfterFullScroll = reveals().filter(el => el.dataset.reveal === 'hidden').length;

  // Google Form must be gone.
  V.googleFormLinks = document.querySelectorAll('a[href*="docs.google.com"]').length;
  V.googleFormText = document.body.innerText.includes('Google Form');
  V.rsvpSubmitType = document.querySelector('#rsvp button[type="submit"]')?.textContent?.trim() ?? 'NONE';
  V.rsvpHasLocalForm = !!document.querySelector('#rsvp form');
  V.overflowPx = document.documentElement.scrollWidth - document.documentElement.clientWidth;
  return V;
})()`;

const values = await evaluate(script);
console.log(JSON.stringify(values, null, 2));

ws.close();
child.kill();
process.exit(0);
