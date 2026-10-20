"use client";

import * as React from "react";
import { AlertCircle, Check, Loader2, Send } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { GuestsSlider } from "@/components/guestsSlider";
import type { RsvpData } from "@/types/data";

interface RsvpFormProps {
  rsvp: RsvpData;
}

type FormValues = Record<string, string>;

export function RsvpForm({ rsvp }: RsvpFormProps) {
  // Seed the range fields with their minimum so the slider's starting
  // position and the submitted payload are always the same number.
  const initialValues = React.useMemo<FormValues>(() => {
    const seeded: FormValues = {};

    for (const field of rsvp.fields) {
      if (field.type === "range") {
        seeded[field.id] = String(field.min ?? 1);
      }
    }

    return seeded;
  }, [rsvp.fields]);

  const [values, setValues] = React.useState<FormValues>(initialValues);
  const [submitted, setSubmitted] = React.useState(false);
  const [sending, setSending] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  const handleChange = (id: string, value: string) => {
    setValues((prev) => ({ ...prev, [id]: value }));
    setError(null);
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    setSending(true);
    setError(null);

    try {
      const response = await fetch("/api/rsvp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: values.name ?? "",
          guests: values.guests ?? "1",
          email: values.email ?? "",
          message: values.message ?? "",
        }),
      });

      const data = (await response.json().catch(() => ({}))) as {
        error?: string;
      };

      if (!response.ok) {
        throw new Error(data.error ?? "Something went wrong. Please try again.");
      }

      setSubmitted(true);
    } catch (submissionError) {
      setError(
        submissionError instanceof Error
          ? submissionError.message
          : "Something went wrong. Please try again.",
      );
    } finally {
      setSending(false);
    }
  };

  if (submitted) {
    return (
      <div className="flex flex-col items-center gap-4 rounded-2xl border border-primary/30 bg-primary/8 px-6 py-12 text-center">
        <span className="flex h-14 w-14 items-center justify-center rounded-full bg-primary/15 text-primary">
          <Check className="h-7 w-7" aria-hidden="true" />
        </span>
        <div className="space-y-1.5">
          <p className="font-wedding-alt text-3xl text-foreground">Thank you!</p>
          <p className="mx-auto max-w-sm text-sm leading-6 text-muted-foreground">
            {values.name
              ? `We have your RSVP, ${values.name}. We cannot wait to celebrate with you.`
              : "We have your RSVP. We cannot wait to celebrate with you."}
            {values.guests && values.guests !== "1"
              ? ` Party of ${values.guests}.`
              : ""}
          </p>
        </div>
        <Button
          variant="outline"
          className="rounded-full px-6"
          onClick={() => {
            setSubmitted(false);
            setValues(initialValues);
            setError(null);
          }}
        >
          Edit my RSVP
        </Button>
      </div>
    );
  }

  const halfFields = rsvp.fields.filter((field) => field.half);
  const fullFields = rsvp.fields.filter((field) => !field.half);

  const renderField = (field: (typeof rsvp.fields)[number]) => {
    if (field.type === "range") {
      const min = field.min ?? 1;
      const max = field.max ?? 5;
      const current = Number(values[field.id] ?? min);

      return (
        <GuestsSlider
          id={field.id}
          min={min}
          max={max}
          value={current}
          onValueChange={(value) => handleChange(field.id, String(value))}
        />
      );
    }

    if (field.type === "textarea") {
      return (
        <Textarea
          id={field.id}
          name={field.id}
          placeholder={field.placeholder}
          className="min-h-28"
          value={values[field.id] ?? ""}
          onChange={(event) => handleChange(field.id, event.target.value)}
        />
      );
    }

    return (
      <Input
        id={field.id}
        name={field.id}
        type={field.type}
        placeholder={field.placeholder}
        value={values[field.id] ?? ""}
        onChange={(event) => handleChange(field.id, event.target.value)}
      />
    );
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {halfFields.length > 0 && (
        <div className="grid gap-4 sm:grid-cols-2">
          {halfFields.map((field) => (
            <div key={field.id} className="space-y-2">
              <label htmlFor={field.id} className="text-sm font-medium text-foreground">
                {field.label}
              </label>
              {renderField(field)}
            </div>
          ))}
        </div>
      )}

      {fullFields.map((field) => (
        <div key={field.id} className="space-y-2">
          <label htmlFor={field.id} className="text-sm font-medium text-foreground">
            {field.label}
          </label>
          {renderField(field)}
        </div>
      ))}

      {error && (
        <p
          role="alert"
          className="flex items-start gap-2 rounded-xl border border-destructive/40 bg-destructive/10 px-4 py-3 text-sm text-destructive"
        >
          <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
          <span>{error}</span>
        </p>
      )}

      <Button type="submit" className="w-full rounded-full" disabled={sending}>
        {sending ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
            Sending…
          </>
        ) : (
          <>
            {rsvp.submit}
            <Send className="h-4 w-4" aria-hidden="true" />
          </>
        )}
      </Button>
    </form>
  );
}

export default RsvpForm;
