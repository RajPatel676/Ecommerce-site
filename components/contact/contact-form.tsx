"use client";

import { useState } from "react";
import { Check, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Field, Input, Textarea } from "@/components/ui/field";
import { useStore } from "@/components/store/store-provider";

interface Values {
  name: string;
  phone: string;
  email: string;
  message: string;
}

export function ContactForm() {
  const { toast } = useStore();
  const [v, setV] = useState<Values>({ name: "", phone: "", email: "", message: "" });
  const [errors, setErrors] = useState<Partial<Values>>({});
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);

  const set = (k: keyof Values, val: string) => {
    setV((s) => ({ ...s, [k]: val }));
    setErrors((e) => ({ ...e, [k]: undefined }));
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    const err: Partial<Values> = {};
    if (v.name.trim().length < 2) err.name = "Please tell us your name.";
    if (!/^(\+91[\s-]?)?[6-9]\d{9}$/.test(v.phone.replace(/\s/g, "")))
      err.phone = "Enter a valid 10-digit mobile number.";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v.email))
      err.email = "Enter a valid email address.";
    if (v.message.trim().length < 10)
      err.message = "A line or two more would help us answer properly.";
    setErrors(err);
    if (Object.keys(err).length) return;

    setSending(true);
    await new Promise((r) => setTimeout(r, 1100));
    setSending(false);
    setSent(true);
    toast({
      title: "Message sent",
      description: "We usually reply within one working day.",
      tone: "success",
    });
  };

  if (sent) {
    return (
      <div className="flex flex-col items-center justify-center rounded-2xl border border-leaf-200 bg-leaf-50 px-6 py-14 text-center">
        <span className="grid h-16 w-16 place-items-center rounded-full bg-leaf-100 text-leaf-500">
          <Check className="h-7 w-7" strokeWidth={2.5} />
        </span>
        <h3 className="mt-5 font-display text-xl text-clay-600">
          Thank you, {v.name.split(" ")[0]}.
        </h3>
        <p className="mt-2 max-w-sm text-[0.88rem] leading-relaxed text-clay-400">
          Your message is with us. We reply to everything within one working day —
          usually a lot sooner.
        </p>
        <p className="mt-2 font-gujarati text-[0.85rem] text-terracotta-400">
          આભાર — અમે જલદી જવાબ આપીશું.
        </p>
        <Button
          variant="outline"
          className="mt-6"
          onClick={() => {
            setSent(false);
            setV({ name: "", phone: "", email: "", message: "" });
          }}
        >
          Send another message
        </Button>
      </div>
    );
  }

  return (
    <form onSubmit={submit} noValidate className="grid gap-4 sm:grid-cols-2">
      <Field label="Name" htmlFor="c-name" required error={errors.name}>
        <Input
          id="c-name"
          value={v.name}
          invalid={!!errors.name}
          onChange={(e) => set("name", e.target.value)}
          placeholder="Your name"
          autoComplete="name"
        />
      </Field>
      <Field label="Phone" htmlFor="c-phone" required error={errors.phone}>
        <Input
          id="c-phone"
          type="tel"
          value={v.phone}
          invalid={!!errors.phone}
          onChange={(e) => set("phone", e.target.value)}
          placeholder="98250 41133"
          autoComplete="tel"
        />
      </Field>
      <Field
        label="Email"
        htmlFor="c-email"
        required
        error={errors.email}
        className="sm:col-span-2"
      >
        <Input
          id="c-email"
          type="email"
          value={v.email}
          invalid={!!errors.email}
          onChange={(e) => set("email", e.target.value)}
          placeholder="you@example.in"
          autoComplete="email"
        />
      </Field>
      <Field
        label="Message"
        htmlFor="c-message"
        required
        error={errors.message}
        hint="Sizes, bulk orders, a custom colour — anything."
        className="sm:col-span-2"
      >
        <Textarea
          id="c-message"
          value={v.message}
          invalid={!!errors.message}
          onChange={(e) => set("message", e.target.value)}
          placeholder="Tell us what you need…"
        />
      </Field>
      <div className="sm:col-span-2">
        <Button type="submit" size="lg" loading={sending}>
          {!sending && <Send className="h-4 w-4" />}
          {sending ? "Sending…" : "Send Message"}
        </Button>
      </div>
    </form>
  );
}
