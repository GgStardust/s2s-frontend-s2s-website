import Link from 'next/link'
import NewsletterSignup from '@/components/NewsletterSignup'
import { siteConfig } from '@/lib/site/site-config'

export default function SiteFooter() {
  return (
    <footer className="site-footer">
      <div className="site-footer__grid site-footer__grid--links">
        <Link href="/s2s">S2S</Link>
        <Link href="/inquiry">Inquiry</Link>
        <Link href="/book-one">Book One</Link>
        <Link href="/orbs">Orbs</Link>
        <Link href="/gigi">Gigi</Link>
        <a href={siteConfig.writingsUrl} target="_blank" rel="noopener noreferrer">
          Writings
        </a>
        <a href={siteConfig.subscribeUrl} target="_blank" rel="noopener noreferrer">
          Subscribe
        </a>
        <Link href="/gigi#contact">Contact</Link>
      </div>

      <div className="site-footer__newsletter">
        <NewsletterSignup />
      </div>

      <div className="site-footer__base">
        <p>© Stardust to Sovereignty UNA</p>
        <img className="site-footer__mark" src="/assets/glyphs/glyph_10.png" alt="" width={20} height={20} />
        <p className="quiet-13" aria-hidden="true">
          13
        </p>
      </div>
    </footer>
  )
}
