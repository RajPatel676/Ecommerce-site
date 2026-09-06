"use client";

import { useState } from "react";
import { Check, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Field, Input, Textarea } from "@/components/ui/field";
import { useStore } from "@/components/store/store-provider";
import { useT } from "@/components/i18n/language-provider";

interface Values {
  name: string;
  phone: string;
  email: string;
  message: string;
}

export function ContactForm() {
  const { toast } = useStore();
  const t = useT();
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
    if (v.name.trim().length < 2) err.name = t.contact.errors.name;
    if (!/^(\+91[\s-]?)?[6-9]\d{9}$/.test(v.phone.replace(/\s/g, "")))
      err.phone = t.contact.errors.phone;
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v.email))
      err.email = t.contact.errors.email;
    if (v.message.trim().length < 10)
      err.message = t.contact.errors.message;
    setErrors(err);
    if (Object.keys(err).length) return;

    setSending(true);
    await new Promise((r) => setTimeout(r, 1100));
    setSending(false);
    setSent(true);
    toast({
      title: t.toast.messageSent,
      description: t.toast.messageSentDesc,
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
          {t.contact.thanks(v.name.split(" ")[0])}
        </h3>
        <p className="mt-2 max-w-sm text-[0.88rem] leading-relaxed text-clay-400">
          {t.contact.thanksBody}
        </p>
        <p className="mt-2 font-gujarati text-[0.85rem] text-terracotta-400">
          {t.contact.thanksGu}
        </p>
        <Button
          variant="outline"
          className="mt-6"
          onClick={() => {
            setSent(false);
            setV({ name: "", phone: "", email: "", message: "" });
          }}
        >
          {t.contact.sendAnother}
        </Button>
      </div>
    );
  }

  return (
    <form onSubmit={submit} noValidate className="grid gap-4 sm:grid-cols-2">
      <Field label={t.contact.name} htmlFor="c-name" required error={errors.name}>
        <Input
          id="c-name"
          value={v.name}
          invalid={!!errors.name}
          onChange={(e) => set("name", e.target.value)}
          placeholder=""
          autoComplete="name"
        />
      </Field>
      <Field label={t.contact.phone} htmlFor="c-phone" required error={errors.phone}>
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
        label={t.contact.email}
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
        label={t.contact.message}
        htmlFor="c-message"
        required
        error={errors.message}
        hint={t.contact.messageHint}
        className="sm:col-span-2"
      >
        <Textarea
          id="c-message"
          value={v.message}
          invalid={!!errors.message}
          onChange={(e) => set("message", e.target.value)}
          placeholder={t.contact.messagePlaceholder}
        />
      </Field>
      <div className="sm:col-span-2">
        <Button type="submit" size="lg" loading={sending}>
          {!sending && <Send className="h-4 w-4" />}
          {sending ? t.contact.sending : t.contact.send}
        </Button>
      </div>
    </form>
  );
}
