'use client'

import { useState } from 'react'

const sparks = [
  {
    number: '01',
    question: 'What are we building simply by continuing to participate?',
    response: 'Participation builds the future quietly.',
  },
  {
    number: '02',
    question: 'What are YOU doing with all your extra time?',
    response: 'Saved time becomes a question of human capacity.',
  },
  {
    number: '05',
    question: 'What forms the human who comes next?',
    response: 'The future human is already being formed.',
  },
] as const

export default function FirstTimeInquiry() {
  const [open, setOpen] = useState<string | null>(null)

  return (
    <section className="register register--ink inquiry ft-inquiry" id="inquiry" aria-labelledby="inquiry-title">
      <p className="label label--light" id="inquiry-title">
        The Inquiry
      </p>
      <ul className="ft-inquiry__list">
        {sparks.map((spark) => {
          const selected = open === spark.number
          return (
            <li key={spark.number} className={selected ? 'is-open' : undefined}>
              <button
                type="button"
                className="ft-inquiry__q"
                aria-expanded={selected}
                aria-controls={`ft-inquiry-${spark.number}`}
                onClick={() => setOpen(selected ? null : spark.number)}
              >
                {spark.question}
              </button>
              <div
                className="ft-inquiry__response"
                id={`ft-inquiry-${spark.number}`}
                hidden={!selected}
              >
                <p>{spark.response}</p>
                <a className="text-link text-link--light" href={`/inquiry#inquiry-${spark.number}`}>
                  Follow this inquiry <span aria-hidden="true">→</span>
                </a>
              </div>
            </li>
          )
        })}
      </ul>
    </section>
  )
}
