import { PRICING } from '@/lib/publishingMetadata'

/** USD price for direct Stripe checkout (shipping included). Defaults to PRICING.directPaperbackUsd. Set DIRECT_SALE_PRICE_USD in Vercel to override without a code change. */
export function getDirectSalePriceUsd(): number {
  const env = process.env.DIRECT_SALE_PRICE_USD
  if (env !== undefined && env !== '') {
    const n = Number(env)
    if (!Number.isFinite(n) || n <= 0) {
      throw new Error('Invalid DIRECT_SALE_PRICE_USD')
    }
    return n
  }
  return PRICING.directPaperbackUsd
}

export function directSalePriceCents(): number {
  return Math.round(getDirectSalePriceUsd() * 100)
}
