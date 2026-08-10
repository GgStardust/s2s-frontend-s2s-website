/* /s2s — paradigm registers + Living Field */
export default function PageMain() {
  return (
    <main id="main" className="page-s2s">

      <section className="register register--ink s2s-register s2s-threshold" aria-labelledby="threshold-title">
        <div className="s2s-register__inner">
          <p className="label label--light">Stardust to Sovereignty</p>
          <h1 id="threshold-title" className="display display--dark s2s-threshold__question">
            A paradigm for intelligence and sovereign participation across scale.
          </h1>
          <div className="s2s-prose">
            <p className="body-dark">
              Stardust to Sovereignty follows intelligence through body, relationship, place, land, society, civilization, Earth, galaxy, universe, future human, and unknown intelligence.
            </p>
            <p className="body-dark">
              Technology and creativity are active movements within that inquiry.
            </p>
            <p className="body-dark">
              Relationship is central to the work. Resonance, cohesion, consequence, and continuity form through encounter.
            </p>
            <p className="body-dark">
              Book One is the first completed literary embodiment. The larger S2S field continues through writing, making, observation, and future forms.
            </p>
          </div>
          <figure className="s2s-register__glyph" aria-hidden="true">
            <img src="/assets/glyphs/glyph_08.png" alt="" width={64} height={256} decoding="async" />
          </figure>
        </div>
      </section>

      <section className="register register--light s2s-register s2s-orbs" aria-labelledby="s2s-orbs-title">
        <div className="s2s-register__inner">
          <p className="label">The 13 Orbs</p>
          <h2 id="s2s-orbs-title" className="display display--section">
            The Orbs are primary<br />
            intelligences within S2S.
          </h2>
          <div className="s2s-prose s2s-prose--light">
            <p>
              S2S uses the Orbs as structural principles and design keys for tracking how pattern,
              memory, time, transformation, sovereignty, and relationship move through experience.
            </p>
            <p className="s2s-orb-chain">
              Origin. Resonance. Light. Pattern. Time. Memory. Transformation. Intuition. Fluidity. Inheritance. Transparency. Sovereignty. Bridging Intelligence.
            </p>
            <p>Each Orb changes what can be recognized.</p>
            <p>
              Together, they expand the ways we can perceive ourselves, the systems we inhabit, the world we are creating, and the larger reality in which we participate.
            </p>
          </div>
          <p className="s2s-register__cta">
            <a className="text-link" href="/orbs">Explore the Orbs <span aria-hidden="true">→</span></a>
          </p>
        </div>
      </section>

      {/* Living Field — first implementation */}
      <section
        className="register register--light living-field"
        id="living-field"
        aria-labelledby="living-field-title"
      >
        <header className="living-field__head">
          <p className="label">The Living Field</p>
          <h2 id="living-field-title" className="display display--section living-field__governing">
            Intelligence becomes visible through encounter.
          </h2>
        </header>

        <div className="living-field__body">
          <p className="lf-line lf-line--open">A body registering before thought catches up.</p>

          <p className="lf-line lf-line--wide">
            The shape of sound moving through a room and through the body.
          </p>

          <p className="lf-line lf-line--aside">
            A song heard live that changes the atmosphere between people.
          </p>

          <div className="lf-cluster lf-cluster--relation" aria-label="Human relationship">
            <p className="lf-line">
              A friendship through which another human becomes more knowable.
            </p>
            <p className="lf-line lf-line--quiet">
              A family pattern becoming visible through years of repetition.
            </p>
            <p className="lf-line lf-line--intimate">
              The intimacy that develops through attention, trust, humor, conflict, care, and return.
            </p>
            <p className="lf-line lf-line--quiet">
              Being seen. Seeing another person more clearly.
            </p>
            <p className="lf-line lf-line--quiet lf-line--dissonance">
              I love dissonance as much as synchronicity.
            </p>
          </div>

          <div className="lf-cluster lf-cluster--strangers" aria-label="Strangers and momentary collision">
            <p className="lf-line lf-line--solo">
              A stranger crossing your path for a few minutes and leaving something that stays.
            </p>
            <p className="lf-line lf-line--quiet lf-line--offset">
              A conversation between people who may never meet again.
            </p>
          </div>

          <p className="lf-line lf-line--wide lf-line--collective">
            A room of strangers becoming briefly coherent around music.
          </p>

          <div className="lf-cluster lf-cluster--species" aria-label="Place and other species">
            <p className="lf-line lf-line--shirley">
              The sea lions in the bay, all of whom I call Shirley.
            </p>
            <p className="lf-line lf-line--quiet">
              Crows nesting in the same magnolia tree each spring.
            </p>
            <p className="lf-line lf-line--edge">A whale entering familiar water.</p>
            <p className="lf-line lf-line--edge lf-line--quiet">Porpoises passing through.</p>
          </div>

          <p className="lf-line lf-line--light">
            The same horizon producing a different sunrise every morning.
          </p>

          <div className="lf-pair" aria-label="Scent and atmosphere">
            <p className="lf-line lf-line--scent">Moist air carrying one world of scent.</p>
            <p className="lf-line lf-line--scent">Dry air carrying sagebrush and creosote.</p>
          </div>

          <p className="lf-line lf-line--place">
            A familiar place revealing itself through season, weather, recurrence, and absence.
          </p>

          <p className="lf-line lf-line--quiet">
            Land, weather, route, and recurrence become fields of inquiry through which place becomes knowable.
          </p>

          <p className="lf-line lf-line--aside">
            A conversation that changes what becomes perceptible.
          </p>

          <p className="lf-line lf-line--quiet lf-line--offset">
            A meal carrying appetite, memory, culture, labor, and place.
          </p>

          <div className="lf-cluster lf-cluster--tech" aria-label="Technology in ordinary life">
            <p className="lf-line">A machine changing the rhythm of ordinary life.</p>
            <p className="lf-line lf-line--quiet">
              A technology becoming familiar enough that its influence becomes difficult to see.
            </p>
          </div>

          <p className="lf-line lf-line--art">
            A work of art giving form to something language has not yet reached.
          </p>

          <div className="lf-cluster lf-cluster--time" aria-label="Temporal recognition">
            <p className="lf-line lf-line--deep">
              A pattern encountered for years before its architecture becomes visible.
            </p>
            <p className="lf-line lf-line--deep lf-line--interrupt">
              Something appearing once and changing what is recognized afterward.
            </p>
          </div>

          <div className="lf-cluster lf-cluster--resonance" aria-label="Signature and afterlife of encounter">
            <p className="lf-line lf-line--signature">
              Through the vastness and depth of all my encounters and relationships, as brief or long-lasting as they are, each carries its own signature resonance and quality.
            </p>
            <p className="lf-line lf-line--quiet lf-line--offset">
              There are encounters that continue long after their visible form changes.
            </p>
          </div>
        </div>

        <footer className="living-field__close">
          <p className="lf-line lf-line--close">
            Stardust to Sovereignty follows intelligence where it appears: through what repeats, changes, arrives, disappears, returns, resonates, and becomes available to recognition.
          </p>
          <img
            className="living-field__glyph"
            src="/assets/glyphs/glyph_16.png"
            alt=""
            width={120}
            height={40}
            decoding="async"
          />
        </footer>
      </section>

      <section
        className="register register--light s2s-register s2s-creativity"
        aria-labelledby="creativity-title"
      >
        <div className="s2s-creativity__inner">
          <p className="label">Creativity</p>
          <p className="s2s-creativity__inherent">Creativity is inherent.</p>
          <h2 id="creativity-title" className="display display--section s2s-creativity__q">
            Making is part of the inquiry.
          </h2>
          <p className="s2s-creativity__line">
            Creativity is a capacity through which intelligence becomes form.
          </p>
          <p className="s2s-creativity__line s2s-creativity__line--follow">
            Stardust to Sovereignty follows that capacity through writing, perception, making, inquiry, and the human who comes next.
          </p>
        </div>
      </section>

      <section className="register register--ink s2s-register s2s-future" aria-labelledby="future-human-title">
        <div className="s2s-register__inner">
          <p className="label label--light">The Future Human</p>
          <h2 id="future-human-title" className="display display--dark">
            We are already designing the human who comes next.
          </h2>
          <div className="s2s-prose">
            <p className="body-dark">Every convenience removes a demand.</p>
            <p className="body-dark">Every automation transfers a capacity.</p>
            <p className="body-dark">
              Every structure we repeat becomes easier to inhabit and harder to imagine living without.
            </p>
            <p className="body-dark">
              We can dislike the systems around us and still participate in building them.
            </p>
          </div>

          <figure className="book-quote book-quote--s2s book-quote--ink">
            <p className="book-quote__label book-quote__label--light">From The Cosmic Tapestry</p>
            <blockquote>
              <p>Technology reflects the coherence of the human systems that design and use it.</p>
            </blockquote>
          </figure>

          <div className="s2s-prose">
            <p className="body-dark">
              The question beneath progress is larger than what technology can do.
            </p>
            <p className="body-dark">
              Technology can support human capacity. It can also substitute for it.
            </p>
            <p className="body-dark">
              As systems grow easier, what forms of perception, attention, memory, creativity, and agency receive less practice?
            </p>
            <p className="body-dark">
              The future human is shaped by which capacities are strengthened, which are allowed
              to disappear, and which choices become ordinary.
            </p>
          </div>

          <div className="s2s-future-primitive">
            <p className="label label--light">Future Primitive</p>
            <p className="s2s-pressure-line">
              Progress can recover human capacity instead of trading it away.
            </p>
            <p className="s2s-future-primitive__horizon">
              It asks what an advanced civilization might recover: direct perception, embodied intelligence, relationship with place, creativity, and sovereign participation with technology.
            </p>
          </div>
        </div>
      </section>

      <section className="register register--ink s2s-register s2s-sovereignty" aria-labelledby="sovereignty-title">
        <div className="s2s-register__inner">
          <p className="label label--light">Sovereignty</p>
          <h2 id="sovereignty-title" className="display display--dark">
            Sovereignty means staying whole<br />
            inside larger systems.
          </h2>
          <div className="s2s-prose">
            <p className="body-dark">
              Sovereignty is coherent self-holding within relationship.
            </p>
            <p className="body-dark">
              It includes participation, discernment, refusal, transformation, inheritance, completion, and continuation.
            </p>
            <p className="body-dark s2s-scale-words">Human. Technological. Planetary. Cosmic.</p>
            <p className="body-dark">Sovereignty strengthens as the field becomes larger.</p>
            <p className="body-dark">
              The movement from stardust to sovereignty is participation at greater scale, held through coherent selfhood.
            </p>
          </div>

          <p className="s2s-closing-q">
            The work asks how we meet the future without giving away human capacity.
          </p>

          <figure className="s2s-register__glyph s2s-register__glyph--end" aria-hidden="true">
            <img src="/assets/glyphs/glyph_10.png" alt="" width={36} height={36} decoding="async" />
          </figure>
        </div>
      </section>

      <section
        className="register register--light s2s-register s2s-future-forms"
        aria-labelledby="future-forms-title"
      >
        <div className="s2s-future-forms__inner">
          <p className="label" id="future-forms-title">
            Future Forms
          </p>
          <p className="s2s-future-forms__copy">
            Stardust to Sovereignty may continue through books, essays, images, field notes, and future encounters. Those forms will be shared when they are ready.
          </p>
        </div>
      </section>

    </main>
  )
}
