import { siteConfig } from '@/lib/site/site-config'

type Props = {
  className?: string
}

export default function NewsletterSignup({ className = '' }: Props) {
  return (
    <div className={`newsletter ${className}`.trim()}>
      <p className="newsletter__label">S2S continues</p>
      <p className="newsletter__copy">
        New inquiries, observations, essays, images, field notes, and releases from Stardust to
        Sovereignty.
      </p>
      <p className="newsletter__links">
        <a
          className="text-link"
          href={siteConfig.subscribeUrl}
          target="_blank"
          rel="noopener noreferrer"
        >
          Join <span aria-hidden="true">→</span>
        </a>
      </p>
    </div>
  )
}
