'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useEffect, useState } from 'react'

const NAV = [
  { href: '/book-one', label: 'Book One' },
  { href: '/inquiry', label: 'Inquiry' },
  { href: '/s2s', label: 'S2S' },
  { href: '/gigi', label: 'Gigi' },
] as const

export default function SiteHeader() {
  const pathname = usePathname()
  const [open, setOpen] = useState(false)

  useEffect(() => {
    setOpen(false)
  }, [pathname])

  return (
    <header className="site-header">
      <div className="site-header__inner">
        <Link className="site-mark" href="/">
          Stardust to Sovereignty
        </Link>
        <nav className="site-nav" aria-label="Primary">
          {NAV.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              aria-current={pathname === item.href || pathname.startsWith(`${item.href}/`) ? 'page' : undefined}
            >
              {item.label}
            </Link>
          ))}
        </nav>
        <button
          className="nav-toggle"
          type="button"
          aria-expanded={open}
          aria-controls="mobile-nav"
          aria-label={open ? 'Close menu' : 'Open menu'}
          onClick={() => setOpen((v) => !v)}
        >
          <span></span>
          <span></span>
        </button>
      </div>
      <nav id="mobile-nav" className="mobile-nav" hidden={!open}>
        {NAV.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            aria-current={pathname === item.href || pathname.startsWith(`${item.href}/`) ? 'page' : undefined}
          >
            {item.label}
          </Link>
        ))}
      </nav>
    </header>
  )
}
