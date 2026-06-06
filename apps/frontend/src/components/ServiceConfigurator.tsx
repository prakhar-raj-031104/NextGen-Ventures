import { useMemo, useState } from "react";
import type { FormEvent } from "react";
import { ArrowRight, Check, RefreshCw, Send, Sparkles } from "lucide-react";
import { api } from "../lib/api";
import { formatINR, serviceConfigs } from "../data/serviceConfigurator";
import type { ConfigQuestion } from "../data/serviceConfigurator";
import type { InquirySelection } from "../types";

type Answers = Record<string, string[]>;

export function ServiceConfigurator({ defaultSlug }: { defaultSlug?: string }) {
  const [slug, setSlug] = useState(defaultSlug ?? serviceConfigs[0].slug);
  const [answers, setAnswers] = useState<Answers>({});
  const [contact, setContact] = useState({ name: "", email: "", phone: "", company: "", message: "" });
  const [status, setStatus] = useState<"idle" | "sending" | "success" | "error">("idle");
  const [error, setError] = useState("");

  const config = useMemo(() => serviceConfigs.find((c) => c.slug === slug)!, [slug]);

  const selectService = (next: string) => {
    setSlug(next);
    setAnswers({});
    setStatus("idle");
  };

  const toggle = (q: ConfigQuestion, value: string) => {
    setAnswers((prev) => {
      const current = prev[q.id] ?? [];
      if (q.type === "single") return { ...prev, [q.id]: [value] };
      return {
        ...prev,
        [q.id]: current.includes(value) ? current.filter((v) => v !== value) : [...current, value]
      };
    });
  };

  // Live estimate (only for estimatable services with a base selected).
  const estimate = useMemo(() => {
    if (!config.estimatable) return null;

    // Per-product services: estimate = quantity × sum of selected per-product rates.
    if (config.perProduct) {
      const qtyQ = config.questions.find((q) => q.type === "number");
      const qty = Number(qtyQ ? answers[qtyQ.id]?.[0] ?? "" : "");
      let perUnit = 0;
      config.questions.forEach((q) => {
        if (q.type === "number") return;
        (answers[q.id] ?? []).forEach((val) => {
          const opt = q.options.find((o) => o.value === val);
          if (opt?.price) perUnit += opt.price;
        });
      });
      return qty > 0 && perUnit > 0 ? qty * perUnit : null;
    }

    let total = 0;
    let hasBase = false;
    config.questions.forEach((q) => {
      (answers[q.id] ?? []).forEach((val) => {
        const opt = q.options.find((o) => o.value === val);
        if (opt?.price) {
          total += opt.price;
          if (q.id === "type") hasBase = true;
        }
      });
    });
    return hasBase ? total : null;
  }, [answers, config]);

  const estimateLabel = config.estimatable
    ? estimate !== null
      ? `${formatINR(estimate)}+ (indicative)`
      : config.perProduct
        ? "Enter quantity & pick services to see your estimate"
        : "Select a package to see your estimate"
    : "Custom quote — we'll price it for you";

  const buildSelections = (): InquirySelection[] =>
    config.questions
      .filter((q) => (answers[q.id] ?? []).length > 0)
      .map((q) => ({
        question: q.label,
        answers: (answers[q.id] ?? []).map((v) => q.options.find((o) => o.value === v)?.label ?? v)
      }));

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    setStatus("sending");
    setError("");
    try {
      await api.submitServiceInquiry({
        name: contact.name,
        email: contact.email,
        phone: contact.phone || undefined,
        company: contact.company || undefined,
        serviceSlug: config.slug,
        serviceName: config.name,
        selections: buildSelections(),
        estimate: config.estimatable && estimate !== null ? `${formatINR(estimate)}+` : "Custom quote",
        message: contact.message || undefined
      });
      setStatus("success");
    } catch (err) {
      setStatus("error");
      setError(err instanceof Error ? err.message : "Something went wrong. Please try again.");
    }
  };

  if (status === "success") {
    return (
      <div className="cfg-success">
        <div className="cfg-success__icon"><Check size={34} /></div>
        <h3>Request received 🎉</h3>
        <p>
          Thanks {contact.name.split(" ")[0] || "there"} — we've logged your {config.name.toLowerCase()} request
          {config.estimatable && estimate !== null ? ` (around ${formatINR(estimate)}+)` : ""}. Our team will reach out
          on <strong>{contact.email}</strong> with a tailored proposal.
        </p>
        <button
          className="button button--outline"
          onClick={() => { setStatus("idle"); setAnswers({}); setContact({ name: "", email: "", phone: "", company: "", message: "" }); }}
        >
          Configure another service <ArrowRight size={15} />
        </button>
      </div>
    );
  }

  return (
    <div className="cfg">
      {/* Service picker */}
      <div className="cfg-services" role="tablist" aria-label="Choose a service">
        {serviceConfigs.map((c) => {
          const Icon = c.icon;
          return (
            <button
              key={c.slug}
              type="button"
              role="tab"
              aria-selected={c.slug === slug}
              className={`cfg-service ${c.slug === slug ? "cfg-service--active" : ""}`}
              style={{ "--c": c.accent } as React.CSSProperties}
              onClick={() => selectService(c.slug)}
            >
              <Icon size={18} />
              <span>{c.name}</span>
            </button>
          );
        })}
      </div>

      <form className="cfg-body" onSubmit={submit}>
        <div className="cfg-questions">
          <p className="cfg-tagline" style={{ "--c": config.accent } as React.CSSProperties}>
            <Sparkles size={14} /> {config.tagline}
          </p>

          {config.questions.map((q) => (
            <fieldset key={q.id} className="cfg-q">
              <legend>{q.label}</legend>
              {q.hint && <span className="cfg-q__hint">{q.hint}</span>}
              {q.type === "number" ? (
                <input
                  type="number"
                  min={1}
                  className="cfg-q__number"
                  placeholder="e.g. 50"
                  value={answers[q.id]?.[0] ?? ""}
                  onChange={(e) =>
                    setAnswers((prev) => ({ ...prev, [q.id]: e.target.value ? [e.target.value] : [] }))
                  }
                />
              ) : (
              <div className="cfg-options">
                {q.options.map((o) => {
                  const active = (answers[q.id] ?? []).includes(o.value);
                  return (
                    <button
                      key={o.value}
                      type="button"
                      className={`cfg-opt ${active ? "cfg-opt--active" : ""}`}
                      style={{ "--c": config.accent } as React.CSSProperties}
                      onClick={() => toggle(q, o.value)}
                    >
                      <span className="cfg-opt__check">{active && <Check size={12} />}</span>
                      <span className="cfg-opt__label">{o.label}</span>
                    </button>
                  );
                })}
              </div>
              )}
            </fieldset>
          ))}
        </div>

        {/* Estimate + contact */}
        <aside className="cfg-summary">
          <div className="cfg-estimate" style={{ "--c": config.accent } as React.CSSProperties}>
            <span className="cfg-estimate__label">Estimated cost</span>
            <strong className="cfg-estimate__value">{estimateLabel}</strong>
            <span className="cfg-estimate__note">
              Final price may vary — this is a short estimate. Hosting is free for 3 years on new website
              builds; final pricing is confirmed before any work begins.
            </span>
          </div>

          <div className="cfg-fields">
            <input required placeholder="Your name" value={contact.name} onChange={(e) => setContact((p) => ({ ...p, name: e.target.value }))} />
            <input required type="email" placeholder="Email" value={contact.email} onChange={(e) => setContact((p) => ({ ...p, email: e.target.value }))} />
            <input placeholder="Phone (optional)" value={contact.phone} onChange={(e) => setContact((p) => ({ ...p, phone: e.target.value }))} />
            <input placeholder="Company / brand (optional)" value={contact.company} onChange={(e) => setContact((p) => ({ ...p, company: e.target.value }))} />
            <textarea rows={3} placeholder="Anything else we should know? (optional)" value={contact.message} onChange={(e) => setContact((p) => ({ ...p, message: e.target.value }))} />
          </div>

          {status === "error" && <p className="cfg-error">{error}</p>}

          <button className="button button--primary cfg-submit" type="submit" disabled={status === "sending"}>
            {status === "sending" ? <><RefreshCw size={16} className="spin" /> Sending…</> : <>Request this package <Send size={16} /></>}
          </button>
        </aside>
      </form>
    </div>
  );
}
