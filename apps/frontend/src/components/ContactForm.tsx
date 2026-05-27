import { useState } from "react";
import type { FormEvent } from "react";
import { Send } from "lucide-react";
import { api } from "../lib/api";
import type { LeadPayload, Service } from "../types";

type ContactFormProps = {
  services: Service[];
};

const initialForm: LeadPayload = {
  name: "",
  email: "",
  company: "",
  phone: "",
  serviceInterest: "",
  budget: "",
  timeline: "",
  businessType: "",
  message: ""
};

const budgetOptions = [
  "Under ₹25,000",
  "₹25,000 – ₹1,00,000",
  "₹1,00,000 – ₹5,00,000",
  "₹5,00,000+",
  "Not sure yet"
];

const timelineOptions = [
  "ASAP / This week",
  "Within 1 month",
  "1 – 3 months",
  "3+ months",
  "Just exploring"
];

const businessTypeOptions = [
  "Marketplace brand (Amazon / Flipkart / Myntra)",
  "Startup / new business",
  "Service company / agency",
  "Corporate / enterprise",
  "Individual / freelancer",
  "Other"
];

export const ContactForm = ({ services }: ContactFormProps) => {
  const [form, setForm] = useState<LeadPayload>(initialForm);
  const [status, setStatus] = useState<"idle" | "sending" | "success" | "error">("idle");
  const [message, setMessage] = useState("");

  const updateField = (field: keyof LeadPayload, value: string) => {
    setForm((current) => ({ ...current, [field]: value }));
  };

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setStatus("sending");
    setMessage("");

    // Append qualifying info into the message so the backend Lead record captures everything
    const qualifiers = [
      form.businessType && `Business type: ${form.businessType}`,
      form.budget && `Budget: ${form.budget}`,
      form.timeline && `Timeline: ${form.timeline}`
    ]
      .filter(Boolean)
      .join(" | ");

    const enrichedMessage = qualifiers
      ? `[${qualifiers}]\n\n${form.message}`
      : form.message;

    try {
      await api.submitLead({ ...form, message: enrichedMessage });
      setStatus("success");
      setMessage("Your enquiry has been sent. We will get back to you within one business day.");
      setForm(initialForm);
    } catch (error) {
      setStatus("error");
      setMessage(error instanceof Error ? error.message : "Unable to send your message. Please try again.");
    }
  };

  return (
    <form className="contact-form" onSubmit={onSubmit} data-reveal data-card-interactive>

      {/* Row 1: Name + Email */}
      <div className="form-grid">
        <label>
          Name <span className="required-mark">*</span>
          <input
            required
            minLength={2}
            value={form.name}
            onChange={(e) => updateField("name", e.target.value)}
            placeholder="Your name"
          />
        </label>
        <label>
          Work Email <span className="required-mark">*</span>
          <input
            required
            type="email"
            value={form.email}
            onChange={(e) => updateField("email", e.target.value)}
            placeholder="you@company.com"
          />
        </label>
      </div>

      {/* Row 2: Company + Phone */}
      <div className="form-grid">
        <label>
          Company <span className="required-mark">*</span>
          <input
            required
            minLength={2}
            value={form.company}
            onChange={(e) => updateField("company", e.target.value)}
            placeholder="Company name"
          />
        </label>
        <label>
          Phone <span className="form-optional">(optional)</span>
          <input
            value={form.phone}
            onChange={(e) => updateField("phone", e.target.value)}
            placeholder="+91 98765 43210"
          />
        </label>
      </div>

      {/* Service interest */}
      <label>
        Service Interest
        <select
          value={form.serviceInterest}
          onChange={(e) => updateField("serviceInterest", e.target.value)}
        >
          <option value="">Select a service</option>
          {services.map((service) => (
            <option key={service.slug} value={service.title}>
              {service.title}
            </option>
          ))}
        </select>
      </label>

      {/* Row 3: Business type + Budget */}
      <div className="form-grid">
        <label>
          Business Type
          <select
            value={form.businessType}
            onChange={(e) => updateField("businessType", e.target.value)}
          >
            <option value="">Select business type</option>
            {businessTypeOptions.map((opt) => (
              <option key={opt} value={opt}>{opt}</option>
            ))}
          </select>
        </label>
        <label>
          Budget Range
          <select
            value={form.budget}
            onChange={(e) => updateField("budget", e.target.value)}
          >
            <option value="">Select budget range</option>
            {budgetOptions.map((opt) => (
              <option key={opt} value={opt}>{opt}</option>
            ))}
          </select>
        </label>
      </div>

      {/* Timeline */}
      <label>
        Project Timeline
        <select
          value={form.timeline}
          onChange={(e) => updateField("timeline", e.target.value)}
        >
          <option value="">When do you need this?</option>
          {timelineOptions.map((opt) => (
            <option key={opt} value={opt}>{opt}</option>
          ))}
        </select>
      </label>

      {/* Message */}
      <label>
        Project Brief <span className="required-mark">*</span>
        <textarea
          required
          minLength={10}
          value={form.message}
          onChange={(e) => updateField("message", e.target.value)}
          placeholder="Tell us what you want to build, launch, improve, or automate."
        />
      </label>

      <button className="button button--dark" type="submit" disabled={status === "sending"}>
        {status === "sending" ? "Sending…" : "Send Enquiry"}
        <Send size={17} aria-hidden="true" />
      </button>

      {message ? (
        <p className={`form-status form-status--${status}`}>{message}</p>
      ) : null}
    </form>
  );
};
