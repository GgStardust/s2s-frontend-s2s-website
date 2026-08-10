export const siteConfig = {
  /** Formspree/Getform endpoint — set NEXT_PUBLIC_CONTACT_FORM_ACTION in Vercel. */
  contactFormAction: process.env.NEXT_PUBLIC_CONTACT_FORM_ACTION || '',
  writingsUrl: 'https://stardusttosovereignty.substack.com',
  subscribeUrl: 'https://stardusttosovereignty.substack.com/subscribe',
  amazonUrl: 'https://www.amazon.com/gp/product/B0GXCNLMBQ',
} as const
