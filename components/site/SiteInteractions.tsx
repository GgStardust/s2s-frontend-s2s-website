'use client'

import { useEffect } from 'react'
import { usePathname } from 'next/navigation'

export default function SiteInteractions() {
  const pathname = usePathname()

  useEffect(() => {
    /* Viewport-triggered reveals */
    const revealNodes = document.querySelectorAll(
      [
        '.hero__copy',
        '.hero__glyph',
        '.book__text',
        '.book-photo',
        '.book-body__inner',
        '.book-desc__inner',
        '.book-excerpt__inner',
        '.book-purchase__inner',
        '.book-reader-proposition',
        '.paradigm__copy',
        '.paradigm__aside',
        '.inquiry-list li',
        '.inquiry-unit',
        '.inquiry-engine__label',
        '.inquiry-engine__q--primary',
        '.inquiry-attraction__q',
        '.inquiry-close__inner',
        '.orb-grid li',
        '.orb-lens',
        '.gigi__grid',
        '.gigi-bio',
        '.gigi-contact__inner',
        '.close__inner',
        '.s2s-register__inner',
        '.s2s-map__inner',
        '.living-field__head',
        '.lf-line:not(.lf-line--quiet):not(.lf-line--interrupt):not(.lf-line--signature)',
        '.lf-cluster',
        '.lf-pair',
        '.living-field__close',
        '.s2s-creativity__inner',
        '.inquiry-attraction__word:not(.inquiry-attraction__word--soft)',
        '.book-quote:not(.book-quote--intimate):not(.book-quote--late)',
      ].join(', ')
    )

    const slowRevealNodes = document.querySelectorAll(
      [
        '.inquiry-engine__q--secondary',
        '.inquiry-attraction__word--soft',
        '.lf-line--quiet',
        '.lf-line--interrupt',
        '.lf-line--signature',
        '.book-quote--intimate',
        '.book-quote--late',
        '.gigi-bio__method',
      ].join(', ')
    )

    revealNodes.forEach((el, i) => {
      el.classList.add('reveal')
      if (i % 3 === 1) el.classList.add('reveal-delay-1')
      if (i % 3 === 2) el.classList.add('reveal-delay-2')
    })

    slowRevealNodes.forEach((el, i) => {
      el.classList.add('reveal', 'reveal-slow')
      if (i % 2 === 1) el.classList.add('reveal-delay-slow')
    })

    const allReveal = [...revealNodes, ...slowRevealNodes]
    const revealVisibleInViewport = () => {
      allReveal.forEach((el) => {
        if (el.classList.contains('is-visible')) return
        const rect = el.getBoundingClientRect()
        if (rect.top < window.innerHeight && rect.bottom > 0) {
          el.classList.add('is-visible')
        }
      })
    }

    let io: IntersectionObserver | null = null
    if ('IntersectionObserver' in window) {
      io = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              entry.target.classList.add('is-visible')
              io?.unobserve(entry.target)
            }
          })
        },
        { rootMargin: '0px 0px -8% 0px', threshold: 0.12 }
      )
      allReveal.forEach((el) => io?.observe(el))
    } else {
      allReveal.forEach((el) => el.classList.add('is-visible'))
    }

    const fallbackTimer = window.setTimeout(revealVisibleInViewport, 900)

    /* /orbs progressive lenses */
    const orbField = document.querySelector('.orb-field')
    const cleanupFns: Array<() => void> = []

    if (orbField) {
      const lenses = [...orbField.querySelectorAll('.orb-lens')]

      const closeLens = (lens: Element) => {
        const trigger = lens.querySelector('.orb-lens__trigger')
        const desc = lens.querySelector('.orb-desc')
        lens.classList.remove('is-open')
        trigger?.setAttribute('aria-expanded', 'false')
        desc?.setAttribute('aria-hidden', 'true')
      }

      const openLens = (lens: Element) => {
        lenses.forEach((other) => {
          if (other !== lens) closeLens(other)
        })
        const trigger = lens.querySelector('.orb-lens__trigger')
        const desc = lens.querySelector('.orb-desc')
        lens.classList.add('is-open')
        trigger?.setAttribute('aria-expanded', 'true')
        desc?.setAttribute('aria-hidden', 'false')
      }

      const onOrbClick = (event: Event) => {
        const trigger = (event.target as Element).closest('.orb-lens__trigger')
        if (!trigger || !orbField.contains(trigger)) return
        event.stopPropagation()
        const lens = trigger.closest('.orb-lens')
        if (!lens) return
        if (lens.classList.contains('is-open')) closeLens(lens)
        else openLens(lens)
      }

      const onKey = (event: KeyboardEvent) => {
        if (event.key === 'Escape') lenses.forEach(closeLens)
      }

      const onPointer = (event: Event) => {
        if ((event.target as Element).closest('.orb-lens')) return
        lenses.forEach(closeLens)
      }

      orbField.addEventListener('click', onOrbClick)
      document.addEventListener('keydown', onKey)
      document.addEventListener('pointerdown', onPointer)
      cleanupFns.push(() => {
        orbField.removeEventListener('click', onOrbClick)
        document.removeEventListener('keydown', onKey)
        document.removeEventListener('pointerdown', onPointer)
      })
    }

    /* /inquiry anchored details */
    const inquiryField = document.querySelector('.inquiry-field')

    if (inquiryField) {
      const units = [...inquiryField.querySelectorAll<HTMLDetailsElement>('.inquiry-unit')]

      const setUnitState = (unit: HTMLDetailsElement, open: boolean) => {
        unit.open = open
        unit.classList.toggle('is-arch', open)
        unit.classList.toggle('is-field', open)

        const trigger = unit.querySelector('.inquiry-unit__trigger')
        const arch = unit.querySelector('.inquiry-arch')
        const response = unit.querySelector('.inquiry-response')

        trigger?.setAttribute('aria-expanded', open ? 'true' : 'false')
        arch?.setAttribute('aria-hidden', open ? 'false' : 'true')
        response?.setAttribute('aria-hidden', open ? 'false' : 'true')
      }

      const openFromHash = () => {
        if (!window.location.hash.startsWith('#inquiry-')) return

        const target = document.querySelector<HTMLDetailsElement>(window.location.hash)
        if (!target || !inquiryField.contains(target)) return

        units.forEach((unit) => setUnitState(unit, unit === target))

        requestAnimationFrame(() => {
          target.scrollIntoView({ block: 'start' })
        })
      }

      const onToggle = (event: Event) => {
        const unit = event.currentTarget as HTMLDetailsElement
        if (!unit.open) {
          setUnitState(unit, false)
          return
        }

        units.forEach((other) => {
          if (other !== unit) setUnitState(other, false)
        })
        setUnitState(unit, true)
      }

      units.forEach((unit) => unit.addEventListener('toggle', onToggle))
      window.addEventListener('hashchange', openFromHash)
      openFromHash()

      cleanupFns.push(() => {
        units.forEach((unit) => unit.removeEventListener('toggle', onToggle))
        window.removeEventListener('hashchange', openFromHash)
      })
    }

    return () => {
      window.clearTimeout(fallbackTimer)
      io?.disconnect()
      cleanupFns.forEach((fn) => fn())
    }
  }, [pathname])

  return null
}
