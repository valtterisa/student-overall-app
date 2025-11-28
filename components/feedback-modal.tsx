"use client";

import { useState, type ComponentProps } from "react";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  FeedbackForm,
  type FeedbackFormProps,
} from "@/components/feedback-form";
import { cn } from "@/utils/cn";

type FeedbackModalProps = FeedbackFormProps & {
  triggerLabel: string;
  triggerClassName?: string;
  triggerVariant?: ComponentProps<typeof Button>["variant"];
  triggerSize?: ComponentProps<typeof Button>["size"];
};

export function FeedbackModal({
  triggerLabel,
  triggerClassName,
  triggerVariant,
  triggerSize,
  ...formProps
}: FeedbackModalProps) {
  const [open, setOpen] = useState(false);

  const close = () => setOpen(false);

  return (
    <>
      <Button
        type="button"
        onClick={() => setOpen(true)}
        className={triggerClassName}
        variant={triggerVariant}
        size={triggerSize}
      >
        {triggerLabel}
      </Button>
      {open ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
          <div className="absolute inset-0 bg-black/50" onClick={close} />
          <div className="relative z-10 w-full max-w-lg rounded-xl bg-white p-6 shadow-xl">
            <button
              type="button"
              onClick={close}
              className="absolute right-4 top-4 rounded-full p-1 text-muted-foreground transition hover:text-foreground"
              aria-label="Sulje palaute"
            >
              <X className="h-5 w-5" />
            </button>
            <FeedbackForm
              {...formProps}
              className={cn("mt-4", formProps.className)}
            />
          </div>
        </div>
      ) : null}
    </>
  );
}

