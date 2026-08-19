export const siteConfig = {
  writingsUrl: 'https://stardusttosovereignty.substack.com',
  subscribeUrl: 'https://stardusttosovereignty.substack.com/subscribe',
  amazonUrl: 'https://www.amazon.com/gp/product/B0GXCNLMBQ',
  /**
   * Legacy contact form endpoint (Formspree/Getform).
   * Kept for older scripts that still reference `siteConfig.contactFormAction`.
   */
  contactFormAction: process.env.NEXT_PUBLIC_CONTACT_FORM_ACTION || '',

  /**
   * Legacy newsletter endpoint used by `NewsletterSignup` in the older site
   * (Formspree form `xgvgzgaj`). Prefer env override when rotating providers.
   * Kept for backwards compatibility with any legacy integration.
   */
  newsletterFormAction:
    process.env.NEXT_PUBLIC_NEWSLETTER_FORM_ACTION || 'https://formspree.io/f/xgvgzgaj',
} as const
