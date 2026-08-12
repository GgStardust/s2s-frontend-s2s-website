import { AMAZON_LISTING_URL, BOOK_CATALOG } from '@/lib/publishingMetadata'

export default function PageMain() {
  return (
    <main id="main" className="page-book-one">

      <section className="register register--light book page-book" aria-labelledby="book-title">
        <div className="book__grid">
          <div className="book__text">
            <p className="label">Book One</p>
            <h1 id="book-title" className="display display--section">The Cosmic Tapestry</h1>
            <p className="lede">
              The first completed literary embodiment of Stardust to Sovereignty.
              Available now in paperback, hardcover, and ebook.
            </p>
            <p className="book-reader-proposition">
              Thirteen Orbs move through fourteen structural chapters, from origin into embodied sovereignty.
            </p>
            <p className="order-row book__order-links">
              <a className="text-link" href="/order">
                Buy directly from Gigi <span aria-hidden="true">→</span>
              </a>
              <a className="text-link" href="#purchase">
                See all editions <span aria-hidden="true">→</span>
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

      <section className="register register--light book-purchase" id="purchase" aria-labelledby="purchase-title">
        <div className="book-purchase__inner">
          <p className="label">The Cosmic Tapestry</p>
          <h2 id="purchase-title" className="display display--section book-purchase__title">Book One</h2>

          <dl className="edition-facts">
            <div>
              <dt>Publication</dt>
              <dd>{BOOK_CATALOG.publicationDateDisplay}</dd>
            </div>
            <div>
              <dt>Formats</dt>
              <dd>Paperback · Hardcover · Ebook</dd>
            </div>
            <div>
              <dt>Trim</dt>
              <dd>{BOOK_CATALOG.trimSize} · {BOOK_CATALOG.pageCountIngramAmazon} pp.</dd>
            </div>
          </dl>

          <div className="order-row">
            <a className="text-link" href="/order">
              Buy directly from Gigi <span aria-hidden="true">→</span>
            </a>
            <a
              className="text-link"
              href={AMAZON_LISTING_URL}
              target="_blank"
              rel="noopener noreferrer"
            >
              Order on Amazon <span aria-hidden="true">→</span>
            </a>
            <p className="order-note">
              Direct orders include standard shipping and support the work directly.
            </p>
          </div>
        </div>
      </section>

      <section
        className="register register--light book-passage-head"
        aria-labelledby="passage-heading"
      >
        <h2 id="passage-heading" className="display display--section book-passage-head__title">
          A passage through Book One
        </h2>
      </section>

      <section
        className="register register--light book-passage book-passage--origin"
        aria-labelledby="passage-01"
      >
        <header className="book-passage__meta">
          <p className="label">01 · Origin Intelligence</p>
          <h3 id="passage-01" className="book-passage__chapter">
            The Stardust Within
          </h3>
        </header>
        <blockquote className="book-passage__text">
          <p className="book-passage__line book-passage__line--elemental">
            With every breath, matter forged in stellar fire crosses the threshold into you, continuing a journey that began long before Earth existed.
          </p>
        </blockquote>
      </section>

      <section
        className="register register--light book-passage book-passage--resonance"
        aria-labelledby="passage-02"
      >
        <header className="book-passage__meta">
          <p className="label">02 · Resonance Mechanics</p>
          <h3 id="passage-02" className="book-passage__chapter">
            The Body as Advanced Biological Technology
          </h3>
        </header>
        <blockquote className="book-passage__text">
          <p className="book-passage__line book-passage__line--guide">
            How does intelligence translate into lived, biological experience?
          </p>
          <p className="book-passage__line book-passage__line--embodied">
            Hum a single note. The vibration moves through your chest, your ribs, the space around you. The body registers it before thought names it. Your voice creates waves that travel through air, walls, and the space between you and another. Inwardly, the same movement occurs. Pattern expresses as sensation, rhythm, and internal shift before language forms.
          </p>
        </blockquote>
      </section>

      <section
        className="register register--light book-passage book-passage--starline"
        aria-labelledby="passage-06"
      >
        <header className="book-passage__meta">
          <p className="label">06 · Starline Memory</p>
          <h3 id="passage-06" className="book-passage__chapter">
            Stepping Beyond Limitations
          </h3>
        </header>
        <blockquote className="book-passage__text">
          <p>
            There are moments when the story you tell about yourself recedes. A decision lands and you find yourself weighing it against something longer. A generation. A lineage. A pattern that began before you and will continue after. The shift is quiet. The frame changes. Continuity becomes the reference point.
          </p>
          <p>
            Orientation moves toward longer arcs. Meaning organizes around participation in what continues. Responsibility forms as stewardship across lineage, collective systems, and future time.
          </p>
          <p>
            Consider the scale at which the galaxy operates. Stellar processes circulate elements across vast distances. Patterned relation precedes human culture and historical time. At that level, existence functions as an ordered web. Stars, matter, and life arise within the same lawful structure. What persists does so through ongoing stellar formation, elemental exchange, and relational pattern across immense spans. Continuity is active participation rather than stored record.
          </p>
          <p>
            Living systems inherit that structure. Conscious systems arise within it. Recognition follows. Perspective reorients.
          </p>
          <p>
            Starline Memory names this stellar continuity as it becomes perceptible within consciousness. Perception widens toward pattern and origin. Reference expands beyond the personal frame. Existence becomes legible as participation in an order that precedes and shapes life.
          </p>
          <p>
            Old light travels across distance. Matter forged in stellar cores circulates through living form. Memory moves as structure in motion.
          </p>
          <p className="book-passage__line book-passage__line--nest">Layers nest.</p>
          <p>
            At the stellar layer, matter forged in cosmic processes anchors inheritance beyond history. At the ancestral layer, continuity carries through lineage as transmission. At the cellular layer, pattern registers as rhythm and response within biology. What carries forward is the pattern that enables recognition, responsibility, and future transmission.
          </p>
        </blockquote>
      </section>

      <section
        className="register register--light book-passage book-passage--disintegration"
        aria-labelledby="passage-08"
      >
        <header className="book-passage__meta">
          <p className="label" id="passage-08">
            08 · Sovereign Disintegration
          </p>
        </header>
        <blockquote className="book-passage__text">
          <p>Moving through this threshold is registered first in the body.</p>
          <p>Balance adjusts.</p>
          <p>Breath deepens or pauses.</p>
          <p>Ground reorganizes.</p>
          <p>Effort decreases in holding position.</p>
          <p>Clarity increases in movement.</p>
          <p>Familiar patterns release.</p>
          <p>Space opens.</p>
          <p>Relief accompanies release.</p>
          <p className="book-passage__line book-passage__line--turn">
            Direction forms within openness.
          </p>
          <p className="book-passage__line book-passage__line--continue">
            Sensation refines. Context becomes readable through the body. Precision appears. As structure releases, navigation sharpens. Direction remains steady while prior frameworks fall behind, like light extending forward as it moves.
          </p>
        </blockquote>
      </section>

      <section
        className="register register--light book-passage book-passage--bridging"
        aria-labelledby="passage-13"
      >
        <header className="book-passage__meta">
          <p className="label" id="passage-13">
            13 · Bridging Intelligence
          </p>
        </header>
        <blockquote className="book-passage__text">
          <p className="book-passage__encounter book-passage__encounter--a">
            You are with others and the next step becomes obvious without instruction. No one directs. No one yields authority. Each remains self-directed while something shared holds the orientation. Coordination is already underway. That is the bridge in lived form.
          </p>
          <p className="book-passage__encounter book-passage__encounter--b">
            You stand with an animal or in a place and your breath shifts before thought arrives. Attention settles. You feel yourself and you feel met. No force moves between you. Alignment organizes the exchange.
          </p>
          <p className="book-passage__encounter book-passage__encounter--c">
            You engage a tool or system and it responds without friction. Intention translates cleanly into function. Feedback clarifies rather than resists. The interaction feels reciprocal rather than compliant.
          </p>
          <p className="book-passage__encounter book-passage__encounter--d">
            A group reaches shared orientation while everyone remains sovereign. The step appears to many at once. Movement proceeds without central command.
          </p>
          <p className="book-passage__encounter book-passage__encounter--close">
            In each case, distinct participants remain intact while something common organizes timing and response. Coordination arises through shared alignment. That is the bridge operating in your life.
          </p>
        </blockquote>
      </section>

      <section
        className="register register--light book-passage book-passage--blueprint"
        aria-labelledby="passage-blueprint"
      >
        <header className="book-passage__meta">
          <h3 id="passage-blueprint" className="book-passage__blueprint-title">
            The Living Blueprint
          </h3>
        </header>
        <blockquote className="book-passage__text book-passage__text--blueprint">
          <p>Structure is seen.</p>
          <p>Recognition rests.</p>
          <p>Breath moves.</p>
          <p>Presence holds.</p>
          <p className="book-passage__line book-passage__line--terminal">The blueprint stands revealed</p>
        </blockquote>
      </section>

      <section className="register register--light book-passage-return" aria-label="Continue with Book One">
        <div className="order-row book-passage-return__links">
          <a className="text-link" href="/order">
            Buy directly from Gigi <span aria-hidden="true">→</span>
          </a>
          <a className="text-link" href="#purchase">
            See all editions <span aria-hidden="true">→</span>
          </a>
          <a
            className="text-link"
            href={AMAZON_LISTING_URL}
            target="_blank"
            rel="noopener noreferrer"
          >
            Order on Amazon <span aria-hidden="true">→</span>
          </a>
        </div>
      </section>

    </main>
  )
}
