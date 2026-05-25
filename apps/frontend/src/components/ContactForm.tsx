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
  message: ""
};

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

    try {
      await api.submitLead(form);
      setStatus("success");
      setMessage("Your enquiry has been sent. We will get back to you shortly.");
      setForm(initialForm);
    } catch (error) {
      setStatus("error");
      setMessage(error instanceof Error ? error.message : "Unable to send your message.");
    }
  };

  return (
    <form className="contact-form" onSubmit={onSubmit} data-reveal data-card-interactive>
      <div className="form-grid">
        <label>
          Name
          <input
            required
            minLength={2}
            value={form.name}
            onChange={(event) => updateField("name", event.target.value)}
            placeholder="Your name"
          />
        </label>
        <label>
          Work Email
          <input
            required
            type="email"
            value={form.email}
            onChange={(event) => updateField("email", event.target.value)}
            placeholder="you@company.com"
          />
        </label>
        <label>
          Company
          <input
            required
            minLength={2}
            value={form.company}
            onChange={(event) => updateField("company", event.target.value)}
            placeholder="Company name"
          />
        </label>
        <label>
          Phone
          <input
            value={form.phone}
            onChange={(event) => updateField("phone", event.target.value)}
            placeholder="+91..."
          />
        </label>
      </div>

      <label>
        Service Interest
        <select
          value={form.serviceInterest}
          onChange={(event) => updateField("serviceInterest", event.target.value)}
        >
          <option value="">Select a service</option>
          {services.map((service) => (
            <option key={service.slug} value={service.title}>
              {service.title}
            </option>
          ))}
        </select>
      </label>

      <label>
        Project Brief
        <textarea
          required
          minLength={10}
          value={form.message}
          onChange={(event) => updateField("message", event.target.value)}
          placeholder="Tell us what you want to build, improve, or launch."
        />
      </label>

      <button className="button button--dark" type="submit" disabled={status === "sending"}>
        {status === "sending" ? "Sending" : "Send Enquiry"}
        <Send size={17} aria-hidden="true" />
      </button>

      {message ? <p className={`form-status form-status--${status}`}>{message}</p> : null}
    </form>
  );
};
