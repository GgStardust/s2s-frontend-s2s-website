/* Auto-ported from cleanroom — preserve copy exactly */
export default function PageMain() {
  return (
    <main id="main">

      <section className="register register--light hero" id="top" aria-labelledby="hero-question">
        <div className="hero__grid">
          <div className="hero__copy">
            <p className="label">A question currently under pressure</p>
            <h1 id="hero-question" className="display display--hero">
              What are we building<br />
              simply by continuing<br />
              to participate?
            </h1>
          </div>
          <figure className="hero__glyph">
            <img
              src="/assets/glyphs/glyph_01.png"
              alt=""
              width={420}
              height={720}
              decoding="async"
            />
            <figcaption className="sr-only">Authored glyph</figcaption>
          </figure>
        </div>
        <div className="rule rule--full" aria-hidden="true"></div>
        <p className="quiet-13" aria-hidden="true">13</p>
      </section>

      <section className="register register--light book" id="book-one" aria-labelledby="book-title">
        <div className="book__grid">
          <div className="book__text">
            <p className="label">Book One</p>
            <h2 id="book-title" className="display display--section">The Cosmic Tapestry</h2>
            <p className="lede">
              The first completed literary embodiment of Stardust to Sovereignty.
            </p>
            <p className="keywords">
              Origin · Embodiment · Relationship · Recognition · Sovereignty
            </p>
            <a className="text-link book__enter" href="/book-one">
              Enter the book <span className="book__enter-rule" aria-hidden="true"></span><span aria-hidden="true">→</span>
            </a>
          </div>
          <aside className="book__object" aria-label="Book One">
            <figure className="book-photo">
              <img
                src="/assets/book/book-one-mockup.png?v=spine"
                alt="The Cosmic Tapestry — Book One by Gigi Stardust"
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
            <p>The continuity was always there. The view has caught up.</p>
          </blockquote>
        </figure>
      </section>

      <section className="register register--light scale" aria-labelledby="scale-label">
        <p id="scale-label" className="label">The inquiry moves across scale</p>
        <ul className="scale-list">
          <li>Body</li>
          <li>Relationship</li>
          <li>Place</li>
          <li>Land</li>
          <li>Society</li>
          <li>Civilization</li>
          <li>Earth</li>
          <li>Future Human</li>
          <li>Universe</li>
          <li>Galaxy</li>
          <li>Unknown Intelligence</li>
        </ul>
      </section>

      <section className="register register--ink paradigm" id="paradigm" aria-labelledby="paradigm-title">
        <div className="paradigm__grid">
          <div className="paradigm__copy">
            <p className="label label--light">S2S</p>
            <h2 id="paradigm-title" className="display display--dark">
              Stardust to Sovereignty
            </h2>
            <p className="paradigm__support">
              A dynamic paradigm of discovery.
            </p>
            <p className="band-copy">
              Experience opens a question.<br />
              A question alters perception.<br />
              Recognition reveals architecture.<br />
              Architecture changes what becomes perceptible next.
            </p>
            <p className="body-dark">
              Stardust to Sovereignty follows questions across body, relationship, place, land,
              Earth, society, civilization, future human, universe, galaxy, and unknown
              intelligence.
            </p>
            <p className="body-dark">Each can become a field of inquiry.</p>
            <p className="body-dark">
              S2S also lives at the scale of ordinary human relationship: conversation, attention,
              care, being seen, and the intelligence that forms between people.
            </p>
            <p className="body-dark">
              Stardust to Sovereignty provides an architecture for exploring those fields across scale.
            </p>
            <a className="text-link text-link--light" href="/s2s">
              Explore S2S <span aria-hidden="true">→</span>
            </a>
          </div>
          <aside className="paradigm__aside" aria-hidden="true">
            <figure className="paradigm__glyph">
              <img src="/assets/glyphs/glyph_08.png" alt="" width={80} height={320} decoding="async" />
            </figure>
            <div className="paradigm__meta">
              <div className="rule rule--light" aria-hidden="true"></div>
              <p className="quiet-13 quiet-13--light">13</p>
            </div>
          </aside>
        </div>
      </section>

      <section className="register register--ink inquiry" id="inquiry" aria-labelledby="inquiry-title">
        <div className="inquiry__layout">
          <div className="inquiry__aside">
            <p className="label label--light" id="inquiry-title">The Inquiry</p>
            <img className="inquiry__mark" src="/assets/glyphs/glyph_12.png" alt="" width={48} height={48} />
          </div>
          <div className="inquiry__main">
            <p className="inquiry__intro">
              Questions currently being explored through the S2S lens.
            </p>
            <ol className="inquiry-list">
              <li>
                <span>What are we building simply by continuing to participate?</span>
              </li>
              <li>
                <span>What are YOU doing with all your extra time?</span>
              </li>
              <li>
                <span>What forms the human who comes next?</span>
              </li>
              <li>
                <span>What will the humans who inherit our choices think we were doing?</span>
              </li>
              <li>
                <span>What draws us toward life, creation, relationship, and discovery?</span>
              </li>
            </ol>
            <p className="inquiry__cta">
              <a className="text-link text-link--light" href="/inquiry">
                Enter the Inquiry <span aria-hidden="true">→</span>
              </a>
            </p>
          </div>
        </div>
      </section>

      <section className="register register--light gigi" id="gigi" aria-labelledby="gigi-title">
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
            <h2 id="gigi-title" className="display display--section">Author and creator.</h2>
            <p className="gigi-verbs">
              Observing. Questioning. Writing. Building. Making. Following the questions as they move across scale.
            </p>
            <a className="text-link" href="/gigi">Meet Gigi <span aria-hidden="true">→</span></a>
          </div>
          <figure className="gigi__wave-wrap" aria-hidden="true">
            <img className="gigi__wave" src="/assets/glyphs/glyph_16.png" alt="" width={280} height={80} />
          </figure>
        </div>
      </section>

      <section className="register register--light orbs" id="orbs" aria-labelledby="orbs-title">
        <div className="orbs__intro">
          <div className="orbs__intro-copy">
            <p className="label">The 13 Orbs</p>
            <h2 id="orbs-title" className="display display--section">
              Change the lens.<br />
              Change what becomes visible.
            </h2>
            <p className="lede">
              The thirteen Orbs form the core architecture of Stardust to Sovereignty.
            </p>
          </div>
        </div>
        <ul className="orb-grid">
          <li>
            <span className="orb-num">01</span>
            <div className="orb-mark"><img src="/assets/orbs/orb_01_origin_intelligence.png?v=hi13" alt="" /></div>
            <span className="orb-name">Origin Intelligence</span>
          </li>
          <li>
            <span className="orb-num">02</span>
            <div className="orb-mark"><img src="/assets/orbs/orb_02_resonance_mechanics.png?v=hi13" alt="" /></div>
            <span className="orb-name">Resonance Mechanics</span>
          </li>
          <li>
            <span className="orb-num">03</span>
            <div className="orb-mark"><img src="/assets/orbs/orb_03_photonic_intelligence.png?v=hi13" alt="" /></div>
            <span className="orb-name">Photonic Intelligence</span>
          </li>
          <li>
            <span className="orb-num">04</span>
            <div className="orb-mark"><img src="/assets/orbs/orb_04_harmonic_architectures.png?v=hi13" alt="" /></div>
            <span className="orb-name">Harmonic Architectures</span>
          </li>
          <li>
            <span className="orb-num">05</span>
            <div className="orb-mark"><img src="/assets/orbs/orb_05_temporal_sovereignty.png?v=hi13" alt="" /></div>
            <span className="orb-name">Temporal Sovereignty</span>
          </li>
          <li>
            <span className="orb-num">06</span>
            <div className="orb-mark"><img src="/assets/orbs/orb_06_starline_memory.png?v=hi13" alt="" /></div>
            <span className="orb-name">Starline Memory</span>
          </li>
          <li>
            <span className="orb-num">07</span>
            <div className="orb-mark"><img src="/assets/orbs/orb_07_alchemical_current.png?v=hi13" alt="" /></div>
            <span className="orb-name">Alchemical Current</span>
          </li>
          <li>
            <span className="orb-num">08</span>
            <div className="orb-mark"><img src="/assets/orbs/orb_08_quantum_intuition.png?v=hi13" alt="" /></div>
            <span className="orb-name">Quantum Intuition</span>
          </li>
          <li>
            <span className="orb-num">09</span>
            <div className="orb-mark"><img src="/assets/orbs/orb_09_temporal_fluidity.png?v=hi13" alt="" /></div>
            <span className="orb-name">Temporal Fluidity</span>
          </li>
          <li>
            <span className="orb-num">10</span>
            <div className="orb-mark"><img src="/assets/orbs/orb_10_ancestral_repatterning.png?v=hi13" alt="" /></div>
            <span className="orb-name">Ancestral Repatterning</span>
          </li>
          <li>
            <span className="orb-num">11</span>
            <div className="orb-mark"><img src="/assets/orbs/orb_11_radiant_transparency.png?v=clip" alt="" /></div>
            <span className="orb-name">Radiant Transparency</span>
          </li>
          <li>
            <span className="orb-num">12</span>
            <div className="orb-mark"><img src="/assets/orbs/orb_12_sovereign_field.png?v=hi13" alt="" /></div>
            <span className="orb-name">Sovereign Field</span>
          </li>
          <li className="orb-grid__bridge">
            <span className="orb-num">13</span>
            <div className="orb-mark orb-mark--bridge">
              <img src="/assets/orbs/orb_13_bridging_circle.png?v=dark2" alt="" />
            </div>
            <span className="orb-name">Bridging Intelligence</span>
          </li>
        </ul>
        <p className="orbs__cta">
          <a className="text-link" href="/orbs">Explore the Orbs <span aria-hidden="true">→</span></a>
        </p>
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
