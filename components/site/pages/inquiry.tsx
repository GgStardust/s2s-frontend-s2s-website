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
      'Participation builds the future quietly.',
      'Repeated participation gives patterns stability. Stable patterns become conditions that shape what later participants experience as ordinary, available, necessary, desirable, or possible.',
    ],
    provisional: [
      'The future is rehearsed in ordinary behavior before it becomes policy, culture, interface, or law.',
      'Recognition creates the possibility of seeing what our ordinary enactments are making real and choosing what we reinforce, alter, or carry forward.',
    ],
    coordinates: ['Participation', 'Consequence', 'Civilization', 'Inheritance'],
  },
  {
    number: '02',
    question: 'What are YOU doing with all your extra time?',
    readsAs: [
      'Saved time becomes a question of human capacity.',
      'Technology, infrastructure, medicine, automation, wealth, and efficiency can reduce demands that once required human time, attention, memory, labor, or skill.',
    ],
    provisional: [
      'The opening is larger than efficiency: capacity can return to perception, creativity, relationship, play, care, agency, rest, and deeper experience.',
      'S2S asks whether returned capacity becomes lived capacity, more throughput, or another system waiting to absorb it.',
    ],
    coordinates: ['Future Primitive', 'Technology', 'Human Capacity', 'Attention'],
  },
  {
    number: '03',
    question: 'What will the humans who inherit our choices think we were doing?',
    readsAs: [
      'The future reading our choices through what remains.',
      'Future beings encounter our values through the material and cultural conditions we leave behind.',
    ],
    provisional: [
      'Future humans will meet the difference between what we valued and what we made durable.',
      "What we normalize, preserve, automate, repair, extract, protect, and leave unfinished becomes part of someone else's starting point.",
    ],
    coordinates: ['Inheritance', 'Deep Time', 'Stewardship', 'Civilization'],
  },
  {
    number: '04',
    question: 'What did we build in our society that we now find difficult to be part of?',
    readsAs: [
      'Inhabitation revealing what a society has trained.',
      'Human systems establish rhythms, expectations, incentives, permissions, and forms of relationship. Those structures shape the people who participate within them, while those participants continually reproduce or revise the structures.',
    ],
    provisional: [
      'Difficulty is evidence. It shows where the order organizing life and the needs of coherent participation have moved out of resonance.',
      'S2S asks what kinds of structures support agency, relationship, creativity, bodily intelligence, care, time, correction, and the ability to remain oneself while participating in something larger.',
    ],
    coordinates: ['Coherence', 'Civilization', 'Participation', 'Human Systems'],
  },
  {
    number: '05',
    question: 'What forms the human who comes next?',
    readsAs: [
      'The future human is already being formed.',
      'Every environment exercises some capacities, strengthens some patterns, and makes particular ways of perceiving and participating feel ordinary.',
    ],
    provisional: [
      'The future human is practiced into being by the environments surrounding the body each day.',
      'Childhood, education, food, medicine, technology, land, culture, work, relationship, and infrastructure all contribute to what future humans perceive, practice, value, expect, and become capable of doing.',
    ],
    coordinates: ['Future Human', 'Future Primitive', 'Embodiment', 'Civilization'],
  },
  {
    number: '06',
    question: 'What becomes possible when technology supports human capacity rather than replacing its practice?',
    readsAs: [
      'Technology as a developmental force.',
      'Technology changes what humans need to remember, perceive, practice, navigate, make, decide, and do for themselves.',
    ],
    provisional: [
      'The opportunity is developmental: systems can free capacity for deeper human practice instead of routing every gain back into speed.',
      'The deeper inquiry asks which human capacities become stronger as our systems become more capable, and which receive less practice because infrastructure has begun carrying them for us.',
    ],
    coordinates: ['Technology', 'Human Capacity', 'Future Primitive', 'Sovereignty'],
  },
  {
    number: '07',
    question: 'What helps something become visible before we decide what it is?',
    readsAs: [
      'Recognition before the form has finished arriving.',
      'Something may first appear as attraction, pattern, contradiction, sensation, image, recurring observation, question, relationship, or sense of fit.',
    ],
    provisional: [
      'Some intelligence needs encounter, repetition, attention, relationship, and time before it becomes legible.',
      'S2S gives recognition enough room for a form to reveal more of its pattern and shape before interpretation closes around it.',
    ],
    coordinates: ['Recognition', 'Creativity', 'Emergence', 'Perception'],
  },
  {
    number: '08',
    question: 'What form can carry something without reducing what makes it alive?',
    readsAs: [
      'Form as an act of carrying.',
      'Form participates in meaning. A book, image, sound, field report, fiction, conversation, interface, or system makes particular relationships perceptible.',
    ],
    provisional: [
      'A vessel succeeds when it preserves relation, depth, and movement.',
      'Some intelligence can live coherently in one vessel. Other intelligence needs to move across forms in order to remain dimensional.',
    ],
    coordinates: ['Form', 'Authorship', 'Living Form', 'Translation'],
  },
  {
    number: '09',
    question: 'What becomes knowable through relationship that cannot be known alone?',
    readsAs: [
      'Relationship as a way of knowing.',
      'Another person can reveal aspects of self, difference, attachment, perception, care, conflict, attraction, intimacy, recognition, and possibility that isolation cannot generate in the same way.',
    ],
    provisional: [
      'Some parts of a person become available in the presence of another.',
      'Friendship, family, intimacy, strangers, conversation, care, conflict, humor, attention, and being seen can each alter what becomes perceptible.',
    ],
    coordinates: ['Relationship', 'Recognition', 'Intimacy', 'Sovereignty'],
  },
  {
    number: '10',
    question: 'What becomes visible when we remain in relationship with a place long enough to recognize its patterns?',
    readsAs: [
      'Place teaching through recurrence.',
      'Land, weather, animals, plants, water, light, scent, season, recurrence, absence, and human activity form relationships that become increasingly perceptible through attention over time.',
    ],
    provisional: [
      'A place moves from backdrop to relationship when attention learns its returns.',
      'What returns, what changes, what disappears, what arrives, and what the body learns to recognize can become a living field of relationship.',
    ],
    coordinates: ['Place', 'Living Field', 'Ecology', 'Temporal Recognition'],
  },
  {
    number: '11',
    question: 'What draws us toward life, creation, relationship, and discovery?',
    readsAs: [
      'Attraction as intelligence moving toward participation.',
      'This remains an active and developing area within S2S.',
    ],
    provisional: [
      'Attraction may be one way intelligence finds the next relationship.',
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
            Open a question to enter its S2S orientation.
          </p>
        </div>
      </section>

      <section className="register register--ink inquiry-field" aria-label="Current inquiries">
        <div className="inquiry-field__inner">
          {inquiries.map((inquiry) => (
            <details
              className="inquiry-unit"
              data-inquiry={inquiry.number}
              id={`inquiry-${inquiry.number}`}
              key={inquiry.number}
            >
              <summary className="inquiry-unit__trigger">
                <span className="inquiry-unit__fold" aria-hidden="true"></span>
                <span className="inquiry-unit__num" aria-hidden="true">{inquiry.number}</span>
                <span className="inquiry-spark">
                  {inquiry.question}
                </span>
              </summary>
              <div className="inquiry-unit__depth" id={`inquiry-depth-${inquiry.number}`}>
                <div className="inquiry-arch">
                  <p className="inquiry-layer__label">S2S reads this as...</p>
                  {inquiry.readsAs.map((paragraph) => (
                    <p key={paragraph}>{paragraph}</p>
                  ))}
                </div>
                <div className="inquiry-response">
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
            </details>
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
