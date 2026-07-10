type Props = {
  index: string;
  title: string;
  tone?: "light" | "dark";
  className?: string;
};

export default function SectionChapterLabel({
  index,
  title,
  tone = "light",
  className = "",
}: Props) {
  return (
    <p
      className={`naga-chapter-label ${tone === "dark" ? "naga-chapter-label--dark" : ""} ${className}`.trim()}
      aria-hidden="true"
    >
      <span className="naga-chapter-index">{index}</span>
      <span className="naga-chapter-divider" />
      <span className="naga-chapter-title">{title}</span>
    </p>
  );
}
