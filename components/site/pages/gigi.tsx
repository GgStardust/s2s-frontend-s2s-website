import { CONTACT_EMAIL } from '@/lib/content'

export default function PageMain() {
  return (
    <main id="main">

      <section className="register register--light gigi page-gigi" aria-labelledby="gigi-title">
        <div className="gigi__grid">
          <div className="gigi__portrait-stack">
            <figure className="gigi__portrait">
              <img
                src="/assets/gigi/gigi-profile-bw.jpg"
                alt="Gigi Stardust"
                width={900}
                height={1124}
                decoding="async"
              />
            </figure>
            <p className="gigi-field__coord">37.86° N · 122.48° W</p>
          </div>
          <div className="gigi__copy">
            <p className="label">Gigi Stardust</p>
            <h1 id="gigi-title" className="display display--section">Author and creator.</h1>
            <p className="gigi-verbs">
              Encountering. Noticing. Questioning. Connecting. Writing. Making. Following what begins to resonate.
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
            Gigi Stardust is an author, technologist, systems thinker, and creator whose work begins close to lived experience.
          </p>
          <p>
            Something catches: a conversation, a technology, a place, a pattern in the body, a piece of music, an animal returning, a contradiction in ordinary life.
          </p>
          <p>
            A question forms. Another apparently separate thing begins speaking to it. More lines of inquiry appear. Connections gather until resonance becomes perceptible and a larger pattern begins to show itself.
          </p>
          <p>
            Stardust to Sovereignty emerged through that movement: observation, inquiry, writing, making, technology, place, art, music, human encounter, and the recognition of patterns across scale.
          </p>
          <p className="gigi-bio__method gigi-bio__method-note">
            The way I unlock what is beyond my comprehension is to encounter life, people, place, beauty, conflict, and surprise as living material that changes the work and changes me.
          </p>
          <p>
            <em>The Cosmic Tapestry</em> is the first completed literary embodiment of that inquiry.
          </p>
        </div>
      </section>

      <section className="register register--light gigi-method" aria-labelledby="gigi-method-title">
        <div className="gigi-method__inner">
          <p className="label">How Inquiry Moves</p>
          <h2 id="gigi-method-title" className="display display--section">
            The pattern gathers before it has a name.
          </h2>
          <ol className="gigi-method__steps">
            <li>
              <span>Experience</span>
              <p>A lived encounter produces curiosity, dissonance, attraction, recognition, or refusal.</p>
            </li>
            <li>
              <span>Question</span>
              <p>The question forms because the encounter will not quite resolve.</p>
            </li>
            <li>
              <span>Lines Of Inquiry</span>
              <p>Technology, body, place, art, music, systems, animals, memory, and human life may begin speaking to the same pressure.</p>
            </li>
            <li>
              <span>Resonance</span>
              <p>Apparently separate things start to reveal a shared signal or pattern.</p>
            </li>
            <li>
              <span>Architecture</span>
              <p>When enough resonance gathers, a larger order becomes visible enough to write, make, test, or carry forward.</p>
            </li>
          </ol>
        </div>
      </section>

      <section className="register register--light gigi-contact" id="contact" aria-labelledby="contact-heading">
        <div className="gigi-contact__inner">
          <p className="label" id="contact-title">Contact</p>
          <h2 id="contact-heading" className="display display--section">Get in touch.</h2>
          <p className="lede">
            For publishing, media, collaboration, speaking, and general inquiries.
          </p>

          <p className="contact-direct">
            <a className="text-link" href={`mailto:${CONTACT_EMAIL}`}>
              {CONTACT_EMAIL} <span aria-hidden="true">→</span>
            </a>
          </p>
        </div>
      </section>
    
    </main>
  )
}
