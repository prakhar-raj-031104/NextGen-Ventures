type PlatformMarqueeProps = {
  items: string[];
};

export const PlatformMarquee = ({ items }: PlatformMarqueeProps) => (
  <section className="marquee-band" aria-label="Platforms">
    <div className="marquee-track">
      {[...items, ...items].map((item, index) => (
        <span key={`${item}-${index}`}>{item}</span>
      ))}
    </div>
  </section>
);
