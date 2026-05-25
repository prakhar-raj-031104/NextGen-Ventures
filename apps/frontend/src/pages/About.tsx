import { ArrowRight, BadgeCheck, Handshake, Layers3 } from "lucide-react";
import { Link } from "react-router-dom";
import { SectionHeading } from "../components/SectionHeading";

const values = [
  {
    icon: BadgeCheck,
    title: "Outcome-led",
    text: "We start with revenue, conversion, workflow clarity, and speed of execution."
  },
  {
    icon: Layers3,
    title: "System-minded",
    text: "Every page, dashboard, and data model is built as part of a reusable operating system."
  },
  {
    icon: Handshake,
    title: "Partner energy",
    text: "We work closely with founders, ecommerce teams, designers, and operators from day one."
  }
];

const stats = [
  { value: "30+", label: "Builds delivered" },
  { value: "4", label: "Core service lines" },
  { value: "3", label: "Marketplace channels" },
  { value: "100%", label: "API-first architecture" }
];

export default function About() {
  return (
    <>
      <section className="page-hero section-shell">
        <div data-reveal="left">
          <p className="eyebrow">About Us</p>
          <h1>NextGen Ventures builds the digital infrastructure behind modern commerce teams.</h1>
        </div>
        <p data-reveal="right">
          We help companies turn scattered ideas, manual commerce operations, and unfinished
          product concepts into polished websites, reliable applications, and measurable marketplace
          workflows.
        </p>
      </section>

      <section className="section-shell about-story">
        <div className="story-media" data-scale />
        <div data-reveal="right">
          <p className="eyebrow">Our Direction</p>
          <h2>Motion-first design, engineering discipline, and a focus on outcomes that move numbers.</h2>
          <p>
            NextGen Ventures combines the taste of a premium web studio with the depth of a full-stack
            engineering partner. Every engagement is scoped for delivery — clear milestones,
            real content, tested code, and a project structure built to scale after launch.
          </p>
          <Link className="text-link" to="/services">
            Explore services
            <ArrowRight size={18} aria-hidden="true" />
          </Link>
        </div>
      </section>

      <section className="section-shell stats-band" data-stagger>
        {stats.map((stat) => (
          <article key={stat.label} data-card-interactive>
            <strong>{stat.value}</strong>
            <span>{stat.label}</span>
          </article>
        ))}
      </section>

      <section className="section-shell values-section">
        <SectionHeading
          eyebrow="Principles"
          title="What clients should feel while working with us."
          copy="Clear scope, strong design taste, calm engineering decisions, and visible progress."
        />
        <div className="values-grid" data-stagger>
          {values.map((value) => {
            const Icon = value.icon;
            return (
              <article key={value.title} data-card-interactive>
                <Icon size={24} aria-hidden="true" />
                <h3>{value.title}</h3>
                <p>{value.text}</p>
              </article>
            );
          })}
        </div>
      </section>
    </>
  );
}
