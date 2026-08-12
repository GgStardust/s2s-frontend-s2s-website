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
              Enter through the body: calcium, iron, breath, water, charge. Book One follows the signals already active in ordinary life until human experience becomes readable as matter, memory, timing, relationship, and choice.
            </p>
            <p className="order-row book__order-links">
              <a className="text-link" href="/order/direct">
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
            <a className="text-link" href="/order/direct">
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

      <section className="register register--light book-body" aria-labelledby="book-open-line">
        <div className="book-body__inner">
          <h2 id="book-open-line" className="display display--section book-body__lead">
            The body is where the universe becomes personal.
          </h2>
          <div className="book-body__prose">
            <p className="book-body__elements">
              Carbon. Oxygen. Calcium. Iron. Water. Electrical charge.
            </p>
            <p>
              Ancient matter became metabolism, sensation, memory, perception, imagination, and choice. It became the body sitting in the room, the breath changing before an answer arrives, the nervous system knowing more than the explanation can carry.
            </p>
            <p>
              Book One follows that recognition as it becomes perception, memory, timing,
              pressure, language, relationship, and sovereignty.
            </p>
          </div>
        </div>
      </section>

      <section className="register register--light book-quote-register" aria-label="Book One body signal quote">
        <figure className="book-quote book-quote--opening">
          <p className="book-quote__label">Body Signal</p>
          <blockquote>
            <p>
              Alignment registers in the body before it reaches thought.
            </p>
          </blockquote>
        </figure>
      </section>

      <section className="register register--ink book-desc" aria-labelledby="book-desc-title">
        <div className="book-desc__inner">
          <h2 id="book-desc-title" className="display display--dark book-desc__question">
            Start where the body is already telling the truth.
          </h2>

          <div className="book-desc__stages">
            <p className="body-dark">
              Book One begins with carbon, oxygen, calcium, iron, water, and
              electrical charge. The body carries evidence.
            </p>
            <p className="body-dark">
              Breath changes before an answer arrives. Timing opens or closes.
              Pressure gathers until structure reorganizes. Memory moves as
              pattern. Relationship reveals what one body could not read alone.
            </p>
            <p className="body-dark">
              The question becomes immediate: what kind of human becomes possible
              when ordinary experience is trusted as an instrument of perception?
            </p>
            <p className="body-dark">
              Gigi Stardust follows coherence through rhythm, light, pressure,
              memory, language, and time. The movement widens into inheritance,
              visibility, relationship, technology, and contact with other forms
              of intelligence.
            </p>
            <p className="body-dark">
              Thirteen Orbs name capacities already active within awareness.
              Fourteen structural chapters carry them from origin into embodied
              sovereignty. Some passages speak with precision. Some open as
              myth. Some make the nervous system notice what it already knew.
            </p>
            <p className="body-dark book-desc__turn">Identity becomes relational.</p>
            <p className="body-dark book-desc__turn">
              Sovereignty becomes participation.
            </p>
            <p className="body-dark book-desc__turn">
              The body has been reading the field all along.
            </p>
          </div>
        </div>
      </section>

      <section className="register register--ink book-quote-register book-quote-register--ink" aria-label="Book One carrying form quote">
        <figure className="book-quote book-quote--wide book-quote--ink">
          <div className="book-quote__rule" aria-hidden="true"></div>
          <p className="book-quote__label book-quote__label--light">Carrying Form</p>
          <blockquote>
            <p>What endures is the capacity to discover a form that can carry what is asking to be carried.</p>
          </blockquote>
          <img className="book-quote__glyph" src="/assets/glyphs/glyph_08.png" alt="" width={36} height={140} decoding="async" />
        </figure>
      </section>

      <section className="register register--light book-quote-register" aria-label="Book One timing quote">
        <figure className="book-quote book-quote--intimate">
          <p className="book-quote__label">Timing</p>
          <blockquote>
            <p>The body reports timing continuously.</p>
          </blockquote>
        </figure>
      </section>

      <section className="register register--light book-excerpt" aria-labelledby="excerpt-label">
        <div className="book-excerpt__inner">
          <p className="label" id="excerpt-label">Ch. 8 · Sovereign Disintegration</p>
          <blockquote className="manuscript-excerpt">
            <p>
              Disintegration functions as a threshold. It marks the moment when familiar structures release and orientation shifts from reference-based navigation to direct sensing. Before this threshold, maps, roles, and rules provide direction. Crossing it establishes a different mode. Direction arises from alignment with signal rather than reliance on reference.
            </p>
          </blockquote>
        </div>
      </section>

      <section className="register register--light book-quote-register" aria-label="Book One deep distance quote">
        <figure className="book-quote book-quote--late">
          <p className="book-quote__label">Deep Distance</p>
          <blockquote>
            <p>Across deep distance, recognition does not fade. It changes scale.</p>
          </blockquote>
        </figure>
      </section>

    </main>
  )
}

