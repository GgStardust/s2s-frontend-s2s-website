type Props = {
  lines: readonly string[];
};

/** Principle lines styled as axioms (About page). */
export default function BookProseAxioms({ lines }: Props) {
  return (
    <div className="book-prose-axioms" aria-hidden="true">
      {lines.map((line) => (
        <p key={line}>{line}</p>
      ))}
    </div>
  );
}
