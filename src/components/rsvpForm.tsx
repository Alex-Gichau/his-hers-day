"use client";

import * as React from "react";
import { Check, Send } from "lucide-react";

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
  const [values, setValues] = React.useState<FormValues>({});
  const [submitted, setSubmitted] = React.useState(false);

  const handleChange = (id: string, value: string) => {
    setValues((prev) => ({ ...prev, [id]: value }));
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSubmitted(true);
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
            setValues({});
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
      return (
        <GuestsSlider
          id={field.id}
          min={field.min ?? 1}
          max={field.max ?? 5}
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

      <Button type="submit" className="w-full rounded-full">
        {rsvp.submit}
        <Send className="h-4 w-4" aria-hidden="true" />
      </Button>
    </form>
  );
}

export default RsvpForm;
