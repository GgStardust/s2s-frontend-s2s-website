type Inquiry = {
  number: string
  question: string
  readsAs: string[]
  provisional: string[]
  coordinates: string[]
}

const inquiries: Inquiry[] = [
  {
    number: '01',
    question: 'What are we building simply by continuing to participate?',
    readsAs: [
      'Participation as structure in motion.',
      'Repeated participation gives patterns stability. Stable patterns become conditions that shape what later participants experience as ordinary, available, necessary, desirable, or possible.',
    ],
    provisional: [
      'We are continuously participating in the formation of the conditions through which future participation will occur.',
      'Recognition creates the possibility of seeing what our ordinary enactments are making real and choosing what we reinforce, alter, or carry forward.',
    ],
    coordinates: ['Participation', 'Consequence', 'Civilization', 'Inheritance'],
  },
  {
    number: '02',
    question: 'What are YOU doing with all your extra time?',
    readsAs: [
      'A question about human capacity.',
      'Technology, infrastructure, medicine, automation, wealth, and efficiency can reduce demands that once required human time, attention, memory, labor, or skill.',
    ],
    provisional: [
      'When a system reduces a demand, some human capacity may become available for another use.',
      'S2S asks where that capacity goes next: toward perception, creativity, relationship, play, care, agency, rest, deeper experience, more throughput, or another system waiting to absorb it.',
    ],
    coordinates: ['Future Primitive', 'Technology', 'Human Capacity', 'Attention'],
  },
  {
    number: '03',
    question: 'What will the humans who inherit our choices think we were doing?',
    readsAs: [
      'Responsibility traveling across time.',
      'Future beings encounter our values through the material and cultural conditions we leave behind.',
    ],
    provisional: [
      'Infrastructure becomes a record of what a civilization repeatedly chose to make possible.',
      "What we normalize, preserve, automate, repair, extract, protect, and leave unfinished becomes part of someone else's starting point.",
    ],
    coordinates: ['Inheritance', 'Deep Time', 'Stewardship', 'Civilization'],
  },
  {
    number: '04',
    question: 'What did we build in our society that we now find difficult to be part of?',
    readsAs: [
      'A question of coherent inhabitation.',
      'Human systems establish rhythms, expectations, incentives, permissions, and forms of relationship. Those structures shape the people who participate within them, while those participants continually reproduce or revise the structures.',
    ],
    provisional: [
      'A society becomes difficult to inhabit when the order organizing life no longer sustains the capacities required for coherent participation.',
      'S2S asks what kinds of structures support agency, relationship, creativity, bodily intelligence, care, time, correction, and the ability to remain oneself while participating in something larger.',
    ],
    coordinates: ['Coherence', 'Civilization', 'Participation', 'Human Systems'],
  },
  {
    number: '05',
    question: 'What forms the human who comes next?',
    readsAs: [
      'The future human forming through repeated relationship with present conditions.',
      'Every environment exercises some capacities, strengthens some patterns, and makes particular ways of perceiving and participating feel ordinary.',
    ],
    provisional: [
      'The conditions surrounding a human participate in the capacities developing within that human.',
      'Childhood, education, food, medicine, technology, land, culture, work, relationship, and infrastructure all contribute to what future humans perceive, practice, value, expect, and become capable of doing.',
    ],
    coordinates: ['Future Human', 'Future Primitive', 'Embodiment', 'Civilization'],
  },
  {
    number: '06',
    question: 'What becomes possible when technology supports human capacity rather than replacing its practice?',
    readsAs: [
      'A question about the relationship between technological capability and human development.',
      'Technology changes what humans need to remember, perceive, practice, navigate, make, decide, and do for themselves.',
    ],
    provisional: [
      'Technology can extend human capacity while preserving perception, agency, creativity, relationship, and meaningful participation.',
      'The deeper inquiry asks which human capacities become stronger as our systems become more capable, and which receive less practice because infrastructure has begun carrying them for us.',
    ],
    coordinates: ['Technology', 'Human Capacity', 'Future Primitive', 'Sovereignty'],
  },
  {
    number: '07',
    question: 'What helps something become visible before we decide what it is?',
    readsAs: [
      'Recognition before premature closure.',
      'Something may first appear as attraction, pattern, contradiction, sensation, image, recurring observation, question, relationship, or sense of fit.',
    ],
    provisional: [
      'Some intelligence becomes recognizable through encounter, repetition, attention, relationship, and time.',
      'S2S gives recognition enough room for a form to reveal more of its pattern and shape before interpretation closes around it.',
    ],
    coordinates: ['Recognition', 'Creativity', 'Emergence', 'Perception'],
  },
  {
    number: '08',
    question: 'What form can carry something without reducing what makes it alive?',
    readsAs: [
      'A question of correspondence between intelligence and vessel.',
      'Form participates in meaning. A book, image, sound, field report, fiction, conversation, interface, or system makes particular relationships perceptible.',
    ],
    provisional: [
      'The appropriate form is the one capable of preserving the relationships that matter within what is being carried.',
      'Some intelligence can live coherently in one vessel. Other intelligence needs to move across forms in order to remain dimensional.',
    ],
    coordinates: ['Form', 'Authorship', 'Living Form', 'Translation'],
  },
  {
    number: '09',
    question: 'What becomes knowable through relationship that cannot be known alone?',
    readsAs: [
      'Relationship as a condition through which new intelligence becomes perceptible.',
      'Another person can reveal aspects of self, difference, attachment, perception, care, conflict, attraction, intimacy, recognition, and possibility that isolation cannot generate in the same way.',
    ],
    provisional: [
      'Relationship creates conditions in which people become more deeply knowable to one another and to themselves.',
      'Friendship, family, intimacy, strangers, conversation, care, conflict, humor, attention, and being seen can each alter what becomes perceptible.',
    ],
    coordinates: ['Relationship', 'Recognition', 'Intimacy', 'Sovereignty'],
  },
  {
    number: '10',
    question: 'What becomes visible when we remain in relationship with a place long enough to recognize its patterns?',
    readsAs: [
      'Place becoming knowable through continued encounter.',
      'Land, weather, animals, plants, water, light, scent, season, recurrence, absence, and human activity form relationships that become increasingly perceptible through attention over time.',
    ],
    provisional: [
      'A place reveals itself through continuity and variation.',
      'What returns, what changes, what disappears, what arrives, and what the body learns to recognize can transform landscape from backdrop into a living field of relationship.',
    ],
    coordinates: ['Place', 'Living Field', 'Ecology', 'Temporal Recognition'],
  },
  {
    number: '11',
    question: 'What draws us toward life, creation, relationship, and discovery?',
    readsAs: [
      'An inquiry into the generative forces that draw intelligence toward participation.',
      'This remains an active and developing area within S2S.',
    ],
    provisional: [
      'Desire, beauty, play, pleasure, curiosity, and wonder may act as orienting forces that draw attention toward encounter, relationship, exploration, and creation.',
      'S2S is asking whether intelligence moves toward participation through attraction as well as necessity.',
    ],
    coordinates: ['Generative Attraction', 'Creativity', 'Relationship', 'Living Field'],
  },
]

const attractionWords = ['Desire', 'Beauty', 'Play', 'Pleasure', 'Curiosity', 'Wonder']

export default function PageMain() {
  return (
    <main id="main" className="page-inquiry-live">

      <section className="register register--ink inquiry-open" aria-labelledby="inquiry-title">
        <div className="inquiry-open__inner">
          <p className="label label--light">The Inquiry</p>
          <h1 id="inquiry-title" className="display display--dark">
            Questions S2S is actively exploring.
          </h1>
          <p className="inquiry-open__lede">
            Each question opens into a short S2S orientation while the inquiry remains alive.
          </p>
        </div>
      </section>

      <section className="register register--ink inquiry-field" aria-label="Current inquiries">
        <div className="inquiry-field__inner">
          {inquiries.map((inquiry) => (
            <article className="inquiry-unit" data-inquiry={inquiry.number} key={inquiry.number}>
              <button
                type="button"
                className="inquiry-unit__trigger"
                aria-expanded="false"
                aria-controls={`inquiry-depth-${inquiry.number}`}
              >
                <span className="inquiry-unit__num" aria-hidden="true">{inquiry.number}</span>
                <span className="inquiry-spark">
                  {inquiry.question}
                </span>
              </button>
              <div className="inquiry-unit__depth" id={`inquiry-depth-${inquiry.number}`}>
                <div className="inquiry-arch" aria-hidden="true">
                  <p className="inquiry-layer__label">S2S reads this as...</p>
                  {inquiry.readsAs.map((paragraph) => (
                    <p key={paragraph}>{paragraph}</p>
                  ))}
                </div>
                <div className="inquiry-response" aria-hidden="true">
                  <p className="inquiry-layer__label">Provisional response...</p>
                  {inquiry.provisional.map((paragraph) => (
                    <p key={paragraph}>{paragraph}</p>
                  ))}
                  <p className="inquiry-layer__label inquiry-layer__label--coordinates">
                    Where this inquiry lives...
                  </p>
                  <p className="inquiry-coordinates">{inquiry.coordinates.join(' · ')}</p>
                </div>
              </div>
            </article>
          ))}

          <div className="inquiry-attraction-field" aria-labelledby="attraction-field-title">
            <h2 id="attraction-field-title" className="inquiry-attraction__q">
              What draws us toward life, creation, relationship, and discovery?
            </h2>
            <ul className="inquiry-attraction" aria-label="Forces of attraction">
              {attractionWords.map((word) => (
                <li
                  className={`inquiry-attraction__word inquiry-attraction__word--${word.toLowerCase()}${
                    word === 'Beauty' || word === 'Pleasure' ? ' inquiry-attraction__word--soft' : ''
                  }`}
                  key={word}
                >
                  {word}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      <section className="register register--ink inquiry-close" aria-labelledby="inquiry-close-q">
        <div className="inquiry-close__inner">
          <h2 id="inquiry-close-q" className="display display--dark inquiry-close__q">
            The questions are meant to be entered, not solved all at once.
          </h2>
          <p className="inquiry-close__line">Each opens a different path through Stardust to Sovereignty.</p>
          <img
            className="inquiry-close__glyph"
            src="/assets/glyphs/glyph_12.png"
            alt=""
            width={40}
            height={40}
            decoding="async"
          />
        </div>
      </section>
    
    </main>
  )
}
