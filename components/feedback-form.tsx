"use client";

import { useActionState, useEffect, useId, useRef } from "react";
import {
  submitFeedbackAction,
  type FeedbackFormState,
} from "@/app/actions";
import { SubmitButton } from "@/components/submit-button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { FormMessage } from "@/components/form-message";
import { cn } from "@/utils/cn";

export type FeedbackFormProps = {
  type: "complaint" | "general";
  title: string;
  description?: string;
  submitLabel: string;
  className?: string;
  sourceId?: string;
  sourceName?: string;
  includeEmailField?: boolean;
  messageLabel?: string;
  messagePlaceholder?: string;
  emailPlaceholder?: string;
};

const initialState: FeedbackFormState = { status: "idle" };

export function FeedbackForm({
  type,
  title,
  description,
  submitLabel,
  className,
  sourceId,
  sourceName,
  includeEmailField = true,
  messageLabel = "Viesti",
  messagePlaceholder = "Kerro ajatuksesi...",
  emailPlaceholder = "sina@example.com",
}: FeedbackFormProps) {
  const formRef = useRef<HTMLFormElement>(null);
  const [state, formAction] = useActionState(
    submitFeedbackAction,
    initialState
  );
  const id = useId();

  useEffect(() => {
    if (state.status === "success") {
      formRef.current?.reset();
    }
  }, [state]);

  const statusMessage =
    state.status === "success"
      ? { success: state.message }
      : state.status === "error"
        ? { error: state.message }
        : null;

  return (
    <form
      ref={formRef}
      action={formAction}
      className={cn("space-y-4", className)}
    >
      <input type="hidden" name="type" value={type} />
      {sourceId ? <input type="hidden" name="sourceId" value={sourceId} /> : null}
      {sourceName ? (
        <input type="hidden" name="sourceName" value={sourceName} />
      ) : null}
      <div>
        <h3 className="text-lg font-semibold">{title}</h3>
        {description ? (
          <p className="text-sm text-muted-foreground mt-1">{description}</p>
        ) : null}
      </div>
      {includeEmailField ? (
        <div className="space-y-2">
          <Label htmlFor={`${id}-email`}>Sähköposti (vapaaehtoinen)</Label>
          <Input
            id={`${id}-email`}
            name="email"
            type="email"
            placeholder={emailPlaceholder}
            autoComplete="email"
          />
        </div>
      ) : null}
      <div className="space-y-2">
        <Label htmlFor={`${id}-message`}>{messageLabel}</Label>
        <textarea
          id={`${id}-message`}
          name="message"
          required
          minLength={10}
          placeholder={messagePlaceholder}
          className="min-h-[120px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-green focus-visible:ring-offset-2"
        />
      </div>
      <SubmitButton
        pendingText="Lähetetään..."
        className="bg-green text-white hover:bg-green/90"
      >
        {submitLabel}
      </SubmitButton>
      {statusMessage ? <FormMessage message={statusMessage} /> : null}
    </form>
  );
}

