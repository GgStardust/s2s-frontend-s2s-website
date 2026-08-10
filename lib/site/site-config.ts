export const siteConfig = {
  /** Formspree/Getform endpoint — set NEXT_PUBLIC_CONTACT_FORM_ACTION in Vercel. */
  contactFormAction: process.env.NEXT_PUBLIC_CONTACT_FORM_ACTION || '',
  /** Kept for when Writings / Substack are ready to surface again. */
  writingsUrl: 'https://stardusttosovereignty.substack.com',
  subscribeUrl: 'https://stardusttosovereignty.substack.com/subscribe',
  amazonUrl: 'https://www.amazon.com/gp/product/B0GXCNLMBQ',
  /**
   * Legacy newsletter endpoint used by `NewsletterSignup`
   * (Formspree form `xgvgzgaj`). Prefer env override when rotating providers.
   */
  newsletterFormAction:
    process.env.NEXT_PUBLIC_NEWSLETTER_FORM_ACTION || 'https://formspree.io/f/xgvgzgaj',
} as const
