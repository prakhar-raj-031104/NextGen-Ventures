import { useSearchParams } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { Check } from "lucide-react";
import { ServiceConfigurator } from "../components/ServiceConfigurator";
import { SectionHeading } from "../components/SectionHeading";
import { addOnEstimates, fallbackServices } from "../data/fallback";
import { serviceConfigs } from "../data/serviceConfigurator";

const websitePlans = fallbackServices.find((s) => s.slug === "website-design-development")?.plans ?? [];

export default function Estimate() {
  const [params] = useSearchParams();
  const requested = params.get("service");
  const defaultSlug = serviceConfigs.some((c) => c.slug === requested) ? requested ?? undefined : undefined;

  return (
    <>
      <Helmet>
        <title>Build Your Package — NextGen Ventures | Service Add-ons & Estimate</title>
        <meta name="description" content="Configure your service, choose add-ons like WhatsApp, payment gateway, social and API integration, and get an instant estimate from NextGen Ventures." />
      </Helmet>

      <section className="page-hero section-shell">
        <div data-reveal="left">
          <p className="eyebrow">Build Your Package</p>
          <h1>Pick a service, choose your add-ons, get an instant estimate.</h1>
        </div>
        <p data-reveal="right">
          Answer a few quick questions about what you need — integrations, scope, platforms — and we'll
          tailor a package and price for you. No commitment; we confirm everything before any work starts.
        </p>
      </section>

      <section className="section-shell">
        <ServiceConfigurator defaultSlug={defaultSlug} />
      </section>

      {/* Website pricing tiers */}
      {websitePlans.length > 0 && (
        <div className="section-bg-warm">
          <section className="section-shell plans-section">
            <SectionHeading
              eyebrow="Website Packages"
              title="Transparent website pricing."
              copy="Every website build includes free hosting for the first 3 years. Add-ons are priced per the rate card below."
            />
            <div className="plans-grid">
              {websitePlans.map((plan) => (
                <article key={plan.name} className={`plan-card${plan.highlight ? " plan-card--featured" : ""}`} data-card-interactive>
                  {plan.highlight && <span className="plan-badge">Most Popular</span>}
                  <div className="plan-header">
                    <h3 className="plan-name">{plan.name}</h3>
                    <div className="plan-price-row">
                      <strong className="plan-price">{plan.price}</strong>
                      {plan.priceNote && <span className="plan-price-note">{plan.priceNote}</span>}
                    </div>
                    <p className="plan-desc">{plan.description}</p>
                  </div>
                  <ul className="plan-features">
                    {plan.features.map((f) => (
                      <li key={f}><Check size={14} aria-hidden="true" /><span>{f}</span></li>
                    ))}
                  </ul>
                </article>
              ))}
            </div>
          </section>
        </div>
      )}

      {/* Add-on rate card */}
      <section className="section-shell">
        <SectionHeading eyebrow="Add-on Rate Card" title="Common add-ons, clearly priced." />
        <div className="est-addons">
          {addOnEstimates.map((a) => (
            <div key={a.label} className="est-addon">
              <div>
                <strong>{a.label}</strong>
                {a.note && <small>{a.note}</small>}
              </div>
              <div className="est-addon__price">
                <span>{a.price}</span>
                <small>{a.unit}</small>
              </div>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}
