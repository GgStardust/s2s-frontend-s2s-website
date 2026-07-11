type Props = {
  lines: readonly string[];
};

/** Quiet centered lines between prose blocks (comet epigraph, principles). */
export default function BookProseInterlude({ lines }: Props) {
  return (
    <div className="book-prose-interlude" aria-hidden="true">
      {lines.map((line) => (
        <p key={line}>{line}</p>
      ))}
    </div>
  );
}
