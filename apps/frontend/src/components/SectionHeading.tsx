type SectionHeadingProps = {
  eyebrow: string;
  title: string;
  copy?: string;
  align?: "left" | "center";
};

export const SectionHeading = ({ eyebrow, title, copy, align = "left" }: SectionHeadingProps) => (
  <div className={`section-heading section-heading--${align}`} data-reveal="left">
    <p className="eyebrow">{eyebrow}</p>
    <h2>{title}</h2>
    {copy ? <p>{copy}</p> : null}
  </div>
);
