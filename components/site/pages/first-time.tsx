/* Public homepage — first-time encounter sequence.
   Previous homepage preserved at `/previous`. */

import FirstTimeInquiry from '@/components/site/FirstTimeInquiry'

const ORB_MARKS = [
  '/assets/orbs/orb_01_origin_intelligence.png?v=hi13',
  '/assets/orbs/orb_02_resonance_mechanics.png?v=hi13',
  '/assets/orbs/orb_03_photonic_intelligence.png?v=hi13',
  '/assets/orbs/orb_04_harmonic_architectures.png?v=hi13',
  '/assets/orbs/orb_05_temporal_sovereignty.png?v=hi13',
  '/assets/orbs/orb_06_starline_memory.png?v=hi13',
  '/assets/orbs/orb_07_alchemical_current.png?v=hi13',
  '/assets/orbs/orb_08_quantum_intuition.png?v=hi13',
  '/assets/orbs/orb_09_temporal_fluidity.png?v=hi13',
  '/assets/orbs/orb_10_ancestral_repatterning.png?v=hi13',
  '/assets/orbs/orb_11_radiant_transparency.png?v=clip',
  '/assets/orbs/orb_12_sovereign_field.png?v=hi13',
  '/assets/orbs/orb_13_bridging_circle.png?v=dark2',
] as const

export default function PageMain() {
  return (
    <main id="main" className="page-first-time">
      <section className="register register--light hero" id="top" aria-labelledby="hero-title">
        <div className="hero__grid">
          <div className="hero__copy">
            <p className="label">An evolving inquiry by Gigi Stardust</p>
            <h1 id="hero-title" className="display display--hero">
              Stardust to<br />
              Sovereignty
            </h1>
            <p className="lede">
              What does it mean to remain whole while participating in systems
              larger than ourselves?
            </p>
            <p className="lede lede--quiet">
              Enter through the body, relationship, technology, place, art,
              questions, Book One, and the patterns of intelligence already
              active in ordinary life.
            </p>
            <p className="hero__links">
              <a className="text-link" href="/s2s">
                Explore S2S <span aria-hidden="true">→</span>
              </a>
              <a className="text-link" href="/book-one">
                Enter Book One <span aria-hidden="true">→</span>
              </a>
            </p>
          </div>
          <figure className="hero__glyph">
            <img
              src="/assets/glyphs/glyph_01.png?v=ink1"
              alt=""
              width={241}
              height={455}
              decoding="async"
            />
            <figcaption className="sr-only">Authored glyph</figcaption>
          </figure>
        </div>
        <div className="rule rule--full" aria-hidden="true"></div>
      </section>

      <section className="register register--light encounter" aria-label="Lived encounter">
        <div className="encounter__moment">
          <p className="encounter__vast">A body registering before thought catches up.</p>
        </div>

        <div className="encounter__moment">
          <p className="encounter__second">A machine changing the rhythm of ordinary life.</p>
        </div>

        <div className="encounter__moment encounter__moment--marginal">
          <p className="encounter__marginal">
            A work of art giving form to something language has not yet reached.
          </p>
        </div>
      </section>

      <section className="register register--ink encounter-name" aria-labelledby="hinge-title">
        <div className="encounter__hinge">
          <h2 id="hinge-title" className="encounter__hinge-line">
            What if these are not separate things?
          </h2>
        </div>
      </section>

      <section className="register register--ink paradigm" aria-labelledby="s2s-name-title">
        <div className="paradigm__grid encounter-name__body">
          <div className="paradigm__copy">
            <p className="label label--light">S2S</p>
            <h3 id="s2s-name-title" className="display display--dark">
              An invitation to remain whole inside larger systems.
            </h3>
            <p className="paradigm__support">
              A first orientation into intelligence, coherence, and sovereign
              participation across scale.
            </p>
            <p className="body-dark">
              Enter through what can be observed: a body registering before
              thought, a relationship changing perception, a technology altering
              capacity, a pattern repeating until it becomes structure.
            </p>
            <p className="body-dark">
              The inquiry moves from the body into relationship, place, land,
              technology, society, civilization, and Earth.
            </p>
            <p className="body-dark">
              From there, the same movement can open toward the future human,
              the cosmic scale, and forms of intelligence not yet fully known.
            </p>
          </div>
          <aside className="paradigm__aside" aria-hidden="true">
            <figure className="paradigm__glyph">
              <img src="/assets/glyphs/glyph_08.png" alt="" width={80} height={320} decoding="async" />
            </figure>
          </aside>
        </div>
      </section>

      <section className="register register--light book" id="book-one" aria-labelledby="book-title">
        <div className="book__grid">
          <div className="book__text">
            <p className="label">Book One</p>
            <h2 id="book-title" className="display display--section">The Cosmic Tapestry</h2>
            <p className="lede">
              The first completed literary embodiment of Stardust to Sovereignty.
              Available now in paperback, hardcover, and ebook.
            </p>
            <p className="keywords">
              Origin · Embodiment · Relationship · Recognition · Sovereignty
            </p>
            <p className="order-row book__home-links">
              <a className="text-link book__enter" href="/book-one">
                Enter Book One <span className="book__enter-rule" aria-hidden="true"></span><span aria-hidden="true">→</span>
              </a>
              <a className="text-link book__enter" href="/order">
                Buy the book <span className="book__enter-rule" aria-hidden="true"></span><span aria-hidden="true">→</span>
              </a>
            </p>
          </div>
          <aside className="book__object" aria-label="Book One">
            <figure className="book-photo">
              <img
                src="/assets/book/book-one-mockup.png?v=spine"
                alt="The Cosmic Tapestry, Book One by Gigi Stardust"
                width={819}
                height={1024}
                decoding="async"
              />
            </figure>
          </aside>
        </div>
      </section>

      <section className="register register--light book-quote-register" aria-label="From The Cosmic Tapestry">
        <figure className="book-quote book-quote--home">
          <p className="book-quote__label">From The Cosmic Tapestry</p>
          <blockquote>
            <p>
              With every breath, matter forged in stellar fire crosses the threshold into you, continuing a journey that began long before Earth existed.
            </p>
          </blockquote>
        </figure>
      </section>

      <section className="register register--ink paradigm" id="field" aria-labelledby="field-title">
        <div className="paradigm__grid">
          <div className="paradigm__copy">
            <p className="label label--light">S2S</p>
            <h2 id="field-title" className="display display--dark">
              The wider field
            </h2>
            <p className="body-dark">
              Book One is the first completed literary embodiment. The larger S2S field remains active through writing, making, observation, and public forms still coming into view.
            </p>
            <p className="body-dark">
              Stardust to Sovereignty is larger than any single vessel. The Cosmic Tapestry is Book One and stands complete on its own.
            </p>
            <p className="band-copy">
              Experience raises questions.<br />
              Questions change what we notice.<br />
              Patterns become easier to see.<br />
              What we see changes how we participate.
            </p>
            <p className="body-dark s2s-scale-words">Human. Technological. Planetary. Cosmic.</p>
            <a className="text-link text-link--light" href="/s2s">
              Explore S2S <span aria-hidden="true">→</span>
            </a>
          </div>
          <aside className="paradigm__aside" aria-hidden="true">
            <figure className="paradigm__glyph">
              <img src="/assets/glyphs/glyph_16.png" alt="" width={80} height={80} decoding="async" />
            </figure>
          </aside>
        </div>
      </section>

      <FirstTimeInquiry />

      <section className="register register--light orbs orbs--reveal" id="orbs" aria-labelledby="orbs-turn">
        <div className="orbs-reveal" aria-hidden="true">
          {ORB_MARKS.map((src) => (
            <img key={src} src={src} alt="" />
          ))}
        </div>
        <p className="orbs-reveal__13" aria-hidden="true">
          13
        </p>
        <h2 id="orbs-turn" className="display display--section orbs-reveal__turn">
          There is an architecture beneath the inquiry.
        </h2>
        <p className="orbs__cta">
          <a className="text-link" href="/orbs">Explore the Orbs <span aria-hidden="true">→</span></a>
        </p>
      </section>

      <section className="register register--light gigi-method" aria-labelledby="gigi-method-title">
        <div className="gigi-method__inner">
          <p className="label">How Inquiry Moves</p>
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
          <h2 id="gigi-method-title" className="display display--section gigi-method__turn">
            The pattern gathers before it has a name.
          </h2>
        </div>
      </section>

      <section className="register register--light gigi" id="gigi" aria-labelledby="gigi-title">
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
            <h2 id="gigi-title" className="display display--section">Author and creator.</h2>
            <p className="gigi-verbs">
              Encountering. Noticing. Questioning. Connecting. Writing. Making. Following what begins to resonate.
            </p>
            <a className="text-link" href="/gigi">
              Meet Gigi <span aria-hidden="true">→</span>
            </a>
          </div>
          <figure className="gigi__wave-wrap" aria-hidden="true">
            <img className="gigi__wave" src="/assets/glyphs/glyph_16.png" alt="" width={280} height={80} />
          </figure>
        </div>
      </section>

      <section className="register register--ink close" aria-label="Closing">
        <div className="close__inner">
          <p className="close__mark">Stardust to Sovereignty</p>
          <img className="close__glyph" src="/assets/glyphs/glyph_10.png" alt="" width={28} height={28} />
        </div>
      </section>
    </main>
  )
}
