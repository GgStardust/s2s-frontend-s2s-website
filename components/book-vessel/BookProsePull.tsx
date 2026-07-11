import type { ReactNode } from 'react';

type Props = {
  children: ReactNode;
};

/** Emphasized line pulled from surrounding prose (ontology, author essence). */
export default function BookProsePull({ children }: Props) {
  return (
    <blockquote className="book-prose-pull">
      <p>{children}</p>
    </blockquote>
  );
}
