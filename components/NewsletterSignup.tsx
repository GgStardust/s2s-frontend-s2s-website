'use client'

import { useState } from 'react'
import { siteConfig } from '@/lib/site/site-config'

type Props = {
  idPrefix?: string
  className?: string
}

export default function NewsletterSignup({ idPrefix = 'newsletter', className = '' }: Props) {
  const [email, setEmail] = useState('')
  const [submitted, setSubmitted] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const response = await fetch(siteConfig.newsletterFormAction, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        body: JSON.stringify({
          email,
          signup_source: 'website_newsletter',
          _subject: 'Newsletter signup (website)',
          _template: 'plain',
        }),
      })

      if (response.ok) {
        setSubmitted(true)
        setEmail('')
      } else {
        setError('There was an error. Please try again.')
      }
    } catch {
      setError('There was an error. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  if (submitted) {
    return (
      <div className={`newsletter ${className}`.trim()}>
        <p className="newsletter__thanks">Thank you. You are on the list.</p>
      </div>
    )
  }

  return (
    <form
      className={`newsletter ${className}`.trim()}
      onSubmit={handleSubmit}
      noValidate={false}
    >
      <p className="newsletter__label">S2S continues</p>
      <p className="newsletter__copy">
        New inquiries, observations, essays, images, field notes, and releases from Stardust to Sovereignty.
      </p>
      <div className="newsletter__row">
        <label className="sr-only" htmlFor={`${idPrefix}-email`}>
          Email address
        </label>
        <input
          id={`${idPrefix}-email`}
          type="email"
          name="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Your email"
          required
          autoComplete="email"
        />
        <button type="submit" disabled={loading}>
          {loading ? 'Sending…' : 'Join'}
        </button>
      </div>
      {error && (
        <p className="newsletter__error" role="alert">
          {error}
        </p>
      )}
    </form>
  )
}
