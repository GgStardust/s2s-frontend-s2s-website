export default function PageMain() {
  return (
    <main id="main">

      <section className="register register--light gigi page-gigi" aria-labelledby="gigi-title">
        <div className="gigi__grid">
          <div className="gigi__portrait-stack">
            <figure className="gigi__portrait">
              <img
                src="/assets/gigi/gigi-portrait.jpg?v=assert"
                alt="Gigi Stardust"
                width={639}
                height={834}
                decoding="async"
              />
            </figure>
            <p className="gigi-field__coord">37.86° N · 122.48° W</p>
          </div>
          <div className="gigi__copy">
            <p className="label">Gigi Stardust</p>
            <h1 id="gigi-title" className="display display--section">Author and creator.</h1>
            <p className="gigi-verbs">
              Observing. Questioning. Writing. Building. Making. Following the questions as they become form.
            </p>
          </div>
          <figure className="gigi__wave-wrap" aria-hidden="true">
            <img className="gigi__wave" src="/assets/glyphs/glyph_16.png" alt="" width={280} height={80} />
          </figure>
        </div>
      </section>

      <section className="register register--light gigi-bio-register" aria-labelledby="gigi-bio-heading">
        <div className="gigi-bio">
          <h2 id="gigi-bio-heading" className="sr-only">Biography</h2>
          <p>
            Gigi Stardust is an author, systems thinker, technologist, and creator whose work moves between lived observation and systems architecture.
          </p>
          <p>
            Her inquiry developed through years of working with technology and complex systems alongside an equally sustained attention to consciousness, relationship, creativity, place, art, music, and the patterns that become visible through ordinary life.
          </p>
          <p>
            Stardust to Sovereignty emerged from that convergence. Rather than separating the human from the systems, environments, technologies, relationships, and larger realities it inhabits, the work follows what becomes visible when they are considered in relationship across scale.
          </p>
          <p>
            <em>The Cosmic Tapestry</em> is the first completed literary embodiment of that inquiry.
          </p>
          <p className="gigi-bio__method gigi-bio__method-note">
            The way I unlock what is beyond my comprehension is to encounter life, people, place, beauty, conflict, and surprise as living material that changes the work and changes me.
          </p>
        </div>
      </section>

      <section className="register register--light gigi-contact" id="contact" aria-labelledby="contact-heading">
        <div className="gigi-contact__inner">
          <p className="label" id="contact-title">Contact</p>
          <h2 id="contact-heading" className="display display--section">Get in touch.</h2>
          <p className="lede">
            For publishing, media, collaboration, speaking, and general inquiries.
          </p>

          <form className="contact-form" id="contact-form" noValidate>
            <div className="contact-form__field">
              <label htmlFor="contact-name">Name</label>
              <input id="contact-name" name="name" type="text" autoComplete="name" required />
            </div>
            <div className="contact-form__field">
              <label htmlFor="contact-email">Email</label>
              <input id="contact-email" name="email" type="email" autoComplete="email" required />
            </div>
            <div className="contact-form__field">
              <label htmlFor="contact-message">Message</label>
              <textarea id="contact-message" name="message" rows={6} required></textarea>
            </div>
            <button className="contact-form__submit" type="submit">Send</button>
            <p className="contact-form__status" id="contact-status" role="status" aria-live="polite" hidden={true} />
          </form>
        </div>
      </section>
    
    </main>
  )
}
