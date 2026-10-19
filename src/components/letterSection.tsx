"use client";

import * as React from "react";

import type { LetterData } from "@/types/data";

interface LetterSectionProps {
  letter: LetterData;
}

/**
 * Splits a paragraph into sentences so each one can be revealed on its own.
 *
 * A trailing fragment that contains no letters or digits (a lone emoji, for
 * example) is folded back into the sentence it belongs to, so the reveal
 * never shows a stray emoji on its own.
 */
function splitSentences(text: string): string[] {
  const parts = text.match(/[^.!?]+[.!?]*\s*/g);
  if (!parts) return [text];

  const sentences: string[] = [];

  for (const part of parts) {
    const trimmed = part.trim();
    if (!trimmed) continue;

    const hasWord = /[\p{L}\p{N}]/u.test(trimmed);
    const previous = sentences[sentences.length - 1];

    if (!hasWord && previous) {
      sentences[sentences.length - 1] = `${previous} ${trimmed}`;
      continue;
    }

    sentences.push(trimmed);
  }

  return sentences;
}

export function LetterSection({ letter }: LetterSectionProps) {
  const containerRef = React.useRef<HTMLDivElement | null>(null);
  const [started, setStarted] = React.useState(false);
  const [visibleSentences, setVisibleSentences] = React.useState(0);

  // Flatten every paragraph into a single list of sentences so the reveal
  // continues smoothly from one paragraph to the next.
  const sentences = React.useMemo(
    () => letter.paragraphs.flatMap((paragraph) => splitSentences(paragraph)),
    [letter.paragraphs],
  );

  // Start the sequence only once the letter is on screen.
  React.useEffect(() => {
    const node = containerRef.current;
    if (!node) return;

    if (
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    ) {
      setStarted(true);
      setVisibleSentences(sentences.length);
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setStarted(true);
            observer.disconnect();
          }
        }
      },
      { threshold: 0.05, rootMargin: "0px 0px -5% 0px" },
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, [sentences.length]);

  // Reveal one sentence at a time once the section has been reached.
  React.useEffect(() => {
    if (!started) return;
    if (visibleSentences >= sentences.length) return;

    const timer = window.setTimeout(() => {
      setVisibleSentences((count) => count + 1);
    }, 400);

    return () => window.clearTimeout(timer);
  }, [started, visibleSentences, sentences.length]);

  // Render the paragraphs, revealing each sentence as the sequence advances.
  let sentenceIndex = 0;

  return (
    <section id="letter" className="scroll-mt-20">
      <div
        ref={containerRef}
        className="relative overflow-hidden rounded-3xl border border-border/70 bg-card/60 px-6 py-12 shadow-sm sm:px-10 sm:py-16"
      >
        {/* paper texture + soft ruled lines for a handwritten feel */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 opacity-[0.35]"
          style={{
            backgroundImage:
              "repeating-linear-gradient(to bottom, transparent, transparent 37px, rgba(217,170,153,0.10) 37px, rgba(217,170,153,0.10) 38px)",
          }}
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -left-24 -top-24 h-64 w-64 rounded-full bg-primary/10 blur-3xl"
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -bottom-24 -right-24 h-64 w-64 rounded-full bg-primary/10 blur-3xl"
        />

        <div className="relative mx-auto max-w-3xl space-y-6">
          <div
            data-reveal={started ? "shown" : "hidden"}
            className="letter-sentence space-y-2 text-center"
          >
            <p className="text-xs uppercase tracking-[0.35em] text-primary/90">
              {letter.eyebrow}
            </p>
            <h2 className="font-wedding text-4xl leading-tight text-foreground sm:text-5xl">
              {letter.title}
            </h2>
            <div
              aria-hidden="true"
              className="mx-auto h-px w-40 bg-gradient-to-r from-transparent via-primary/60 to-transparent"
            />
          </div>

          <div className="space-y-5">
            {letter.paragraphs.map((paragraph, paragraphIndex) => (
              <p
                key={paragraphIndex}
                className="font-hand text-xl leading-[1.9] text-foreground/90 sm:text-2xl"
              >
                {splitSentences(paragraph).map((sentence) => {
                  const index = sentenceIndex++;
                  const shown = index < visibleSentences;

                  return (
                    <span
                      key={index}
                      data-reveal={shown ? "shown" : "hidden"}
                      className="letter-sentence inline"
                    >
                      {sentence}{" "}
                    </span>
                  );
                })}
              </p>
            ))}
          </div>

          <div className="flex items-center gap-4 pt-2">
            <span
              aria-hidden="true"
              className="h-px flex-1 bg-gradient-to-r from-transparent via-border to-transparent"
            />
            <p
              data-reveal={visibleSentences >= sentences.length ? "shown" : "hidden"}
              className="letter-sentence font-hand text-2xl text-primary sm:text-3xl"
            >
              {letter.signature}
            </p>
            <span
              aria-hidden="true"
              className="h-px flex-1 bg-gradient-to-r from-transparent via-border to-transparent"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
