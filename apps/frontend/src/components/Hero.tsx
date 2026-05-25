import { ArrowRight, Boxes, LineChart, ShoppingBag } from "lucide-react";
import { Link } from "react-router-dom";
import { RoboticText } from "./RoboticText";
import { ThreeBackground } from "./ThreeBackground";

const headline = "We build the digital infrastructure serious commerce brands run on.";

export const Hero = () => (
  <section className="hero">
    <ThreeBackground variant="hero" />

    <div className="hero-inner">
      <div className="hero-copy" data-reveal="left">
        <RoboticText text="NEXTGEN VENTURES" className="eyebrow" />
        <h1 className="hero-headline">
          {headline.split(" ").map((word, i, arr) => (
            <span key={i} className="hero-word-wrap">
              <span className="hero-word" style={{ animationDelay: `${0.08 + i * 0.065}s` }}>
                {word}
              </span>
              {i < arr.length - 1 && " "}
            </span>
          ))}
        </h1>
        <p>
          Marketplace systems, premium UI/UX design, conversion-focused websites, and full-stack
          applications — for brands competing on Amazon, Myntra, Flipkart, and their own channels.
        </p>
        <div className="hero-actions">
          <Link className="button button--dark" to="/services">
            View Services
            <ArrowRight size={18} aria-hidden="true" />
          </Link>
          <Link className="button button--light" to="/projects">
            See Projects
            <ArrowRight size={18} aria-hidden="true" />
          </Link>
        </div>
      </div>

      <div className="hero-visual" data-scale aria-label="NextGen Ventures commerce dashboard preview">
        <div className="dashboard-shell">
          <div className="dashboard-topbar">
            <span />
            <span />
            <span />
          </div>
          <div className="dashboard-grid">
            <article className="dashboard-card dashboard-card--large" data-card-interactive>
              <div>
                <ShoppingBag size={22} aria-hidden="true" />
                <span>Marketplace Revenue</span>
              </div>
              <strong>₹2.84 Cr</strong>
              <div className="chart-bars" aria-hidden="true" data-animate-bars>
                <span />
                <span />
                <span />
                <span />
                <span />
                <span />
              </div>
            </article>
            <article className="dashboard-card" data-card-interactive>
              <LineChart size={22} aria-hidden="true" />
              <strong>31%</strong>
              <span>Listing score lift</span>
            </article>
            <article className="dashboard-card" data-card-interactive>
              <Boxes size={22} aria-hidden="true" />
              <strong>1.8k</strong>
              <span>SKUs tracked</span>
            </article>
            <div className="marketplace-stack">
              <span>Amazon</span>
              <span>Myntra</span>
              <span>Flipkart</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
);
