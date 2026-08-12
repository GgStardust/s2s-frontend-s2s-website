import { redirect } from 'next/navigation'

/** Legacy checkout URL — canonical purchase flow is /order. */
export default function DirectOrderRedirect({
  searchParams,
}: {
  searchParams: Record<string, string | string[] | undefined>
}) {
  const canceled = searchParams.canceled === '1'
  redirect(canceled ? '/order?canceled=1' : '/order')
}
