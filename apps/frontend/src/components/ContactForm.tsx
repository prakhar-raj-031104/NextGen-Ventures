import { useState } from "react";
import type { FormEvent } from "react";
import { Plus, Send, X } from "lucide-react";
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

// Website / business types — used for the searchable Business Type field.
// Sorted alphabetically so the full list reads cleanly when no filter is typed.
const businessTypeOptions = [
  "Accounting & Bookkeeping Website",
  "Affiliate Marketing Website",
  "Agriculture & Farming Website",
  "Automobile / Car Dealership Website",
  "Bakery Website",
  "Beauty & Cosmetics Store",
  "Blog / Personal Website",
  "Bookstore",
  "Cafe / Coffee Shop Website",
  "Car Rental Website",
  "Catering Service Website",
  "Charity / Donation Website",
  "Classifieds Website",
  "Clinic Website",
  "Clothing & Apparel Store",
  "Cloud Kitchen Website",
  "Coaching & Tutoring Website",
  "College / University Website",
  "Community / Forum Website",
  "Construction & Architecture Website",
  "Consulting Firm Website",
  "Corporate / Business Website",
  "Cryptocurrency / Blockchain Website",
  "Dating Website",
  "Dental Clinic Website",
  "Diagnostic Lab Website",
  "Digital Agency Website",
  "Directory / Listing Website",
  "Doctor / Physician Website",
  "Dropshipping Store",
  "E-commerce Store",
  "Education / E-learning Website",
  "EdTech Platform",
  "Electronics Store",
  "Event Management Website",
  "Fashion & Lifestyle Store",
  "Finance & Banking Website",
  "Fintech / Payments Platform",
  "Fitness & Gym Website",
  "Flight & Hotel Booking Portal",
  "Food Delivery Website",
  "Footwear Store",
  "Freelance Marketplace",
  "Furniture & Home Decor Store",
  "Government / Public Sector Website",
  "Grocery / Supermarket Store",
  "Handicrafts & Artisan Store",
  "Healthcare / Medical Website",
  "Hospital Website",
  "Hotel & Resort Website",
  "Insurance Website",
  "Interior Design Website",
  "Investment & Trading Platform",
  "IT / Software Company Website",
  "Jewellery Store",
  "Job Portal / Recruitment Website",
  "Law Firm Website",
  "Loan & Mortgage Website",
  "Logistics & Supply Chain Website",
  "Manufacturing & Industrial Website",
  "Marketplace / Multi-vendor Website",
  "Matrimonial Website",
  "Membership / Subscription Website",
  "Mental Health & Therapy Website",
  "Music & Band Website",
  "News & Magazine Portal",
  "Non-profit / NGO Website",
  "Nutrition & Diet Website",
  "On-demand Service App Website",
  "Pet Supplies Store",
  "Pharmacy / Medical Store",
  "Photography Website",
  "Podcast Website",
  "Political Campaign Website",
  "Portfolio Website",
  "Property Listing Portal",
  "Real Estate Website",
  "Religious / Temple Website",
  "Restaurant Website",
  "SaaS Product Website",
  "Salon & Spa Website",
  "School Website",
  "Social Networking Platform",
  "Sports & Fitness Equipment Store",
  "Startup Landing Page",
  "Stationery Store",
  "Telemedicine Platform",
  "Tourism & Travel Website",
  "Toys & Games Store",
  "Travel Agency Website",
  "Vacation Rental Website",
  "Video Streaming Platform",
  "Wedding & Event Website",
  "Wedding Planner Website",
  "Yoga & Wellness Website",
  "Other"
];

// Extra services we can suggest beyond the core service list
const suggestedExtras = [
  "SEO Optimisation",
  "Branding & Logo Design",
  "Content Writing",
  "Hosting & Maintenance",
  "Social Media Management",
  "Analytics & Reporting"
];

export const ContactForm = ({ services }: ContactFormProps) => {
  const [form, setForm] = useState<LeadPayload>(initialForm);
  const [status, setStatus] = useState<"idle" | "sending" | "success" | "error">("idle");
  const [message, setMessage] = useState("");

  // Multi-select service interest
  const [selectedServices, setSelectedServices] = useState<string[]>([]);
  const [customService, setCustomService] = useState("");

  // Business-type searchable combobox
  const [btOpen, setBtOpen] = useState(false);

  const businessTypeMatches = (() => {
    const q = (form.businessType ?? "").trim().toLowerCase();
    if (!q) return businessTypeOptions;
    // Prefix match on the whole label or any word within it (e.g. "p" → Pharmacy, Photography).
    return businessTypeOptions.filter((opt) => {
      const label = opt.toLowerCase();
      return label.startsWith(q) || label.split(/[^a-z0-9]+/).some((word) => word.startsWith(q));
    });
  })();

  const updateField = (field: keyof LeadPayload, value: string) => {
    setForm((current) => ({ ...current, [field]: value }));
  };

  const syncServices = (next: string[]) => {
    setSelectedServices(next);
    setForm((current) => ({ ...current, serviceInterest: next.join(", ") }));
  };

  const addService = (value: string) => {
    const trimmed = value.trim();
    if (!trimmed || selectedServices.includes(trimmed)) return;
    syncServices([...selectedServices, trimmed]);
  };

  const removeService = (value: string) =>
    syncServices(selectedServices.filter((service) => service !== value));

  const addCustomService = () => {
    addService(customService);
    setCustomService("");
  };

  // Suggestions still available to add (core services + extras, minus chosen)
  const remainingSuggestions = [
    ...services.map((service) => service.title),
    ...suggestedExtras
  ].filter((title, index, all) => all.indexOf(title) === index && !selectedServices.includes(title));

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
      setSelectedServices([]);
      setCustomService("");
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
          <span className="field-label">Name <span className="required-mark">*</span></span>
          <input
            required
            minLength={2}
            value={form.name}
            onChange={(e) => updateField("name", e.target.value)}
            placeholder="Your name"
          />
        </label>
        <label>
          <span className="field-label">Work Email <span className="required-mark">*</span></span>
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
          <span className="field-label">Company <span className="required-mark">*</span></span>
          <input
            required
            minLength={2}
            value={form.company}
            onChange={(e) => updateField("company", e.target.value)}
            placeholder="Company name"
          />
        </label>
        <label>
          <span className="field-label">Phone <span className="form-optional">(optional)</span></span>
          <input
            value={form.phone}
            onChange={(e) => updateField("phone", e.target.value)}
            placeholder="+91 98765 43210"
          />
        </label>
      </div>

      {/* Service interest — multi-select with custom additions */}
      <div className="service-interest">
        <span className="field-label">Service Interest</span>

        {/* Selected services as removable chips */}
        {selectedServices.length > 0 && (
          <div className="service-chips">
            {selectedServices.map((service) => (
              <span key={service} className="service-chip">
                {service}
                <button
                  type="button"
                  onClick={() => removeService(service)}
                  aria-label={`Remove ${service}`}
                >
                  <X size={13} aria-hidden="true" />
                </button>
              </span>
            ))}
          </div>
        )}

        {/* Pick from suggestions */}
        <select
          value=""
          onChange={(e) => addService(e.target.value)}
          aria-label="Add a service"
        >
          <option value="">
            {selectedServices.length ? "Add another service…" : "Select a service"}
          </option>
          {remainingSuggestions.map((title) => (
            <option key={title} value={title}>
              {title}
            </option>
          ))}
        </select>

        {/* Quick-add suggestion chips */}
        {remainingSuggestions.length > 0 && (
          <div className="service-suggestions">
            <span className="service-suggestions__label">Suggested:</span>
            {remainingSuggestions.slice(0, 5).map((title) => (
              <button
                key={title}
                type="button"
                className="service-suggestion"
                onClick={() => addService(title)}
              >
                <Plus size={12} aria-hidden="true" />
                {title}
              </button>
            ))}
          </div>
        )}

        {/* Add your own custom service */}
        <div className="service-custom">
          <input
            value={customService}
            onChange={(e) => setCustomService(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                addCustomService();
              }
            }}
            placeholder="Add your own service…"
          />
          <button
            type="button"
            className="service-add-btn"
            onClick={addCustomService}
            disabled={!customService.trim()}
            aria-label="Add custom service"
          >
            <Plus size={16} aria-hidden="true" />
          </button>
        </div>
      </div>

      {/* Row 3: Business type + Budget */}
      <div className="form-grid form-grid--bt">
        <label>
          Business Type
          <div className="bt-combo">
            <input
              type="text"
              value={form.businessType ?? ""}
              onChange={(e) => {
                updateField("businessType", e.target.value);
                setBtOpen(true);
              }}
              onFocus={() => setBtOpen(true)}
              onBlur={() => window.setTimeout(() => setBtOpen(false), 120)}
              placeholder="Type a website / business type…"
              autoComplete="off"
              role="combobox"
              aria-expanded={btOpen}
              aria-autocomplete="list"
            />
            {btOpen && businessTypeMatches.length > 0 && (
              <ul className="bt-options" role="listbox">
                {businessTypeMatches.map((opt) => (
                  <li key={opt}>
                    <button
                      type="button"
                      role="option"
                      aria-selected={form.businessType === opt}
                      className={form.businessType === opt ? "bt-option bt-option--active" : "bt-option"}
                      onMouseDown={(e) => {
                        e.preventDefault();
                        updateField("businessType", opt);
                        setBtOpen(false);
                      }}
                    >
                      {opt}
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>
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
        <span className="field-label">Project Brief <span className="required-mark">*</span></span>
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
