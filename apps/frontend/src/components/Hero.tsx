import { useEffect, useLayoutEffect, useRef } from "react";
import { ArrowRight, ArrowUpRight, Boxes, Code, Globe, ShoppingBag, ShoppingCart, Sparkles, TrendingUp, Zap } from "lucide-react";
import { Link } from "react-router-dom";
import { RoboticText } from "./RoboticText";
import { ThreeBackground } from "./ThreeBackground";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const headlineWords = [
  { text: "Turn", accent: false },
  { text: "your", accent: false },
  { text: "brand", accent: false },
  { text: "into", accent: false },
  { text: "a", accent: false },
  { text: "commerce", accent: true },
  { text: "powerhouse.", accent: true }
];

const heroStats = [
  { value: 100, suffix: "+", label: "Builds" },
  { value: 6, suffix: "", label: "Service Lines" },
  { value: 3, suffix: "", label: "Marketplaces" },
  { value: 100, suffix: "%", label: "Yours to Keep" }
];

// Live marketplace storefronts / listings for the brands we operate.
const marketplaceChannels: { name: string; href: string; external: boolean }[] = [
  {
    name: "Amazon",
    href: "https://www.amazon.in/stores/HenryCastleCo/page/EC65B8F2-B1B9-4C37-8BE1-F400657E6E8E",
    external: true
  },
  {
    name: "Flipkart",
    href: "https://www.flipkart.com/henry-castle-co-regular-men-grey-jeans/p/itm24371449d219c",
    external: true
  },
  // No live Myntra storefront yet — point to our marketplace case studies.
  { name: "Myntra", href: "/projects", external: false }
];

const floatingServices = [
  { name: "Website Dev",         slug: "website-design-development", accent: "#00a3ff", icon: Globe,        delay: "0s",    dur: "5.4s" },
  { name: "Application Dev",     slug: "application-development",    accent: "#ffe45c", icon: Zap,          delay: "0.3s",  dur: "6.6s" },
  { name: "Software Development",slug: "software-development",        accent: "#22d3ee", icon: Code,         delay: "0.7s",  dur: "5.8s" },
  { name: "E-commerce",          slug: "ecommerce-imaging",          accent: "#ff8a3d", icon: ShoppingCart, delay: "1.1s",  dur: "6.1s" },
  { name: "Marketplace Growth",  slug: "marketplace-growth",         accent: "#36f5a2", icon: ShoppingBag,  delay: "1.4s",  dur: "5.2s" },
  { name: "Digital Marketing",   slug: "digital-marketing",          accent: "#c084fc", icon: TrendingUp,   delay: "1.8s",  dur: "6.4s" },
  { name: "UI / UX Design",      slug: "ui-ux-design",               accent: "#ff5c35", icon: Sparkles,     delay: "2.1s",  dur: "5.6s" },
  { name: "Product Imaging",     slug: "ecommerce-imaging",          accent: "#fbbf24", icon: Boxes,        delay: "2.5s",  dur: "6.9s" }
];

export const Hero = () => {
  const heroRef = useRef<HTMLElement>(null);

  // Mouse-tracking spotlight
  useEffect(() => {
    const hero = heroRef.current;
    if (!hero) return;
    const onMove = (e: MouseEvent) => {
      const r = hero.getBoundingClientRect();
      hero.style.setProperty("--hero-mx", `${((e.clientX - r.left) / r.width) * 100}%`);
      hero.style.setProperty("--hero-my", `${((e.clientY - r.top) / r.height) * 100}%`);
    };
    hero.addEventListener("mousemove", onMove, { passive: true });
    return () => hero.removeEventListener("mousemove", onMove);
  }, []);

  // BG image parallax + badge stagger in
  useLayoutEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const ctx = gsap.context(() => {
      // Badge cards stagger in on load
      gsap.fromTo(
        ".hero-service-badge",
        { y: 36, autoAlpha: 0, scale: 0.88 },
        {
          y: 0, autoAlpha: 1, scale: 1,
          duration: 0.85, ease: "expo.out",
          stagger: 0.1, delay: 0.8
        }
      );

      // Stats dividers slide in
      gsap.fromTo(
        ".hero-stat",
        { y: 18, autoAlpha: 0 },
        {
          y: 0, autoAlpha: 1,
          duration: 0.7, ease: "expo.out",
          stagger: 0.08, delay: 0.5
        }
      );
    }, heroRef);
    return () => ctx.revert();
  }, []);

  return (
    <section className="hero" ref={heroRef}>
      <ThreeBackground variant="hero" />
      {/* Mouse-tracking spotlight */}
      <div className="hero-spotlight" aria-hidden="true" />

      <div className="hero-inner">
        {/* ── Left: copy ─────────────────── */}
        <div className="hero-copy" data-reveal="left">
          <RoboticText text="NEXTGEN VENTURES" className="eyebrow" />
          <h1 className="hero-headline">
            {headlineWords.map((word, i, arr) => (
              <span key={i} className="hero-word-wrap">
                <span
                  className={`hero-word${word.accent ? " hero-word--accent" : ""}`}
                  style={{ animationDelay: `${0.08 + i * 0.072}s` }}
                >
                  {word.text}
                </span>
                {i < arr.length - 1 && " "}
              </span>
            ))}
          </h1>

          <p>
            Marketplace management, digital marketing, UI/UX, website development, product imaging,
            and full-stack applications — everything your brand needs, from one focused studio in
            Bengaluru.
          </p>

          {/* Animated stat row */}
          <div className="hero-stats">
            {heroStats.map((stat, i) => (
              <div key={stat.label} className="hero-stat">
                {i > 0 && <div className="hero-stat__divider" aria-hidden="true" />}
                <strong data-count={stat.value} data-suffix={stat.suffix}>
                  {stat.value}{stat.suffix}
                </strong>
                <span>{stat.label}</span>
              </div>
            ))}
          </div>

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

        {/* ── Right: floating service badges ── */}
        <div
          className="hero-visual hero-services-panel"
          data-scale
          aria-label="NextGen Ventures service areas"
        >
          {/* Central glow orb behind the badges */}
          <div className="hero-panel-orb" aria-hidden="true" />

          <div className="hero-badges-grid">
            {floatingServices.map((service) => {
              const Icon = service.icon;
              return (
                <Link
                  key={service.name}
                  to={`/services/${service.slug}`}
                  className="hero-service-badge"
                  aria-label={`View ${service.name} service`}
                  style={
                    {
                      "--badge-accent": service.accent,
                      "--badge-delay": service.delay,
                      "--badge-dur": service.dur
                    } as React.CSSProperties
                  }
                >
                  <span className="hero-service-badge__icon">
                    <Icon size={20} aria-hidden="true" />
                  </span>
                  <span className="hero-service-badge__name">{service.name}</span>
                  <span className="hero-service-badge__dot" aria-hidden="true" />
                </Link>
              );
            })}
          </div>

          {/* Marketplace channel strip — live storefronts */}
          <div className="hero-channel-strip">
            {marketplaceChannels.map((ch) =>
              ch.external ? (
                <a
                  key={ch.name}
                  className="hero-channel-link"
                  href={ch.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`View our ${ch.name} storefront`}
                >
                  {ch.name}
                  <ArrowUpRight size={14} aria-hidden="true" />
                </a>
              ) : (
                <Link
                  key={ch.name}
                  className="hero-channel-link"
                  to={ch.href}
                  aria-label={`View our ${ch.name} marketplace work`}
                >
                  {ch.name}
                  <ArrowUpRight size={14} aria-hidden="true" />
                </Link>
              )
            )}
          </div>
        </div>
      </div>
    </section>
  );
};
