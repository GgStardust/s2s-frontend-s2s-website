/** Mixam POD embed - custom element from https://mixam.com/embed.js */
declare namespace JSX {
  interface IntrinsicElements {
    'embeddable-printlink': React.DetailedHTMLProps<
      React.HTMLAttributes<HTMLElement> & {
        publicationid?: string
        domain?: string
        locale?: string
      },
      HTMLElement
    >
  }
}
