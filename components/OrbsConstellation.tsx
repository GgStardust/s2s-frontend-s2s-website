import { ORBS_CONSTELLATION } from '@/lib/orbsConstellation'

type OrbsConstellationProps = {
  /** When true, list is collapsed behind a disclosure control (About page). */
  collapsible?: boolean
}

export default function OrbsConstellation({ collapsible = false }: OrbsConstellationProps) {
  const list = (
    <dl className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-5">
      {ORBS_CONSTELLATION.map((orb) => (
        <div key={orb.number}>
          <dt className="text-sm font-medium text-stone-200 font-sans">
            <span className="text-stone-500 font-normal tabular-nums">{orb.number}. </span>
            {orb.name}
          </dt>
          <dd className="mt-1 text-sm text-stone-500 leading-relaxed font-serif">{orb.summary}</dd>
        </div>
      ))}
    </dl>
  )

  if (collapsible) {
    return (
      <details className="group">
        <summary className="cursor-pointer text-stone-400 hover:text-stone-200 font-medium text-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-stone-400/50 rounded-sm font-sans">
          View all thirteen capacities (from Appendix A) →
        </summary>
        <div className="mt-6 pt-6 border-t border-stone-500/25">{list}</div>
      </details>
    )
  }

  return list
}
