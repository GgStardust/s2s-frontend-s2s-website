'use client'

import { useEffect } from 'react'
import { siteConfig } from '@/lib/site/site-config'

export default function SiteInteractions() {
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
        '.s2s-practice__inner',
        '.inquiry-index',
        '.inquiry-list li',
        '.inquiry-unit',
        '.inquiry-engine__label',
        '.inquiry-engine__q--primary',
        '.inquiry-attraction__q',
        '.inquiry-close__inner',
        '.orb-grid li',
        '.orb-demo',
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
        '.s2s-future-forms__inner',
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

    /* /inquiry progressive units */
    const inquiryField = document.querySelector('.inquiry-field')
    if (inquiryField) {
      const units = [...inquiryField.querySelectorAll('.inquiry-unit')]
      const finePointer = () => window.matchMedia('(hover: hover) and (pointer: fine)').matches

      const syncExpanded = (unit: Element) => {
        const trigger = unit.querySelector('.inquiry-unit__trigger')
        const expanded =
          unit.classList.contains('is-arch') || unit.classList.contains('is-field')
        trigger?.setAttribute('aria-expanded', expanded ? 'true' : 'false')
      }

      const setArch = (unit: Element, on: boolean) => {
        const arch = unit.querySelector('.inquiry-arch')
        unit.classList.toggle('is-arch', on)
        arch?.setAttribute('aria-hidden', on ? 'false' : 'true')
        syncExpanded(unit)
      }

      const setField = (unit: Element, on: boolean) => {
        const response = unit.querySelector('.inquiry-response')
        unit.classList.toggle('is-field', on)
        response?.setAttribute('aria-hidden', on ? 'false' : 'true')
        if (on) setArch(unit, true)
        else syncExpanded(unit)
      }

      const resetUnit = (unit: Element) => {
        unit.classList.remove('is-field')
        unit.querySelector('.inquiry-response')?.setAttribute('aria-hidden', 'true')
        setArch(unit, false)
      }

      const resetOthers = (unit: Element) => {
        units.forEach((other) => {
          if (other !== unit) resetUnit(other)
        })
      }

      const unitCleanups: Array<() => void> = []

      units.forEach((unit) => {
        const trigger = unit.querySelector('.inquiry-unit__trigger')
        if (!trigger) return

        const onEnter = () => {
          if (!finePointer()) return
          setArch(unit, true)
        }
        const onLeave = () => {
          if (!finePointer()) return
          if (!unit.classList.contains('is-field')) setArch(unit, false)
        }
        const onFocus = () => setArch(unit, true)
        const onBlur = () => {
          if (!unit.classList.contains('is-field') && !unit.matches(':hover')) {
            setArch(unit, false)
          }
        }
        const onClick = (event: Event) => {
          event.stopPropagation()
          resetOthers(unit)
          if (!finePointer()) {
            if (!unit.classList.contains('is-arch')) {
              setArch(unit, true)
              return
            }
            if (!unit.classList.contains('is-field')) {
              setField(unit, true)
              return
            }
            resetUnit(unit)
            return
          }
          if (unit.classList.contains('is-field')) setField(unit, false)
          else setField(unit, true)
        }

        unit.addEventListener('pointerenter', onEnter)
        unit.addEventListener('pointerleave', onLeave)
        trigger.addEventListener('focus', onFocus)
        trigger.addEventListener('blur', onBlur)
        trigger.addEventListener('click', onClick)
        unitCleanups.push(() => {
          unit.removeEventListener('pointerenter', onEnter)
          unit.removeEventListener('pointerleave', onLeave)
          trigger.removeEventListener('focus', onFocus)
          trigger.removeEventListener('blur', onBlur)
          trigger.removeEventListener('click', onClick)
        })
      })

      const onKey = (event: KeyboardEvent) => {
        if (event.key === 'Escape') units.forEach(resetUnit)
      }
      const onPointer = (event: Event) => {
        if ((event.target as Element).closest('.inquiry-unit')) return
        units.forEach(resetUnit)
      }
      document.addEventListener('keydown', onKey)
      document.addEventListener('pointerdown', onPointer)
      cleanupFns.push(() => {
        unitCleanups.forEach((fn) => fn())
        document.removeEventListener('keydown', onKey)
        document.removeEventListener('pointerdown', onPointer)
      })
    }

    /* Contact form */
    const contactForm = document.querySelector('#contact-form') as HTMLFormElement | null
    if (contactForm) {
      const status = document.querySelector('#contact-status') as HTMLElement | null
      const submit = contactForm.querySelector('.contact-form__submit') as HTMLButtonElement | null

      const setStatus = (message: string, kind = 'info') => {
        if (!status) return
        status.hidden = false
        status.dataset.kind = kind
        status.textContent = message
      }

      const onSubmit = async (event: Event) => {
        event.preventDefault()
        const action = siteConfig.contactFormAction.trim()
        if (!action) {
          setStatus('Contact is not configured yet. Please try again later.', 'error')
          return
        }
        const formData = new FormData(contactForm)
        if (submit) submit.disabled = true
        setStatus('Sending…', 'info')
        try {
          const response = await fetch(action, {
            method: 'POST',
            body: formData,
            headers: { Accept: 'application/json' },
          })
          if (!response.ok) throw new Error(`Request failed: ${response.status}`)
          contactForm.reset()
          setStatus('Message sent.', 'success')
        } catch {
          setStatus('Unable to send right now. Please try again later.', 'error')
        } finally {
          if (submit) submit.disabled = false
        }
      }

      contactForm.addEventListener('submit', onSubmit)
      cleanupFns.push(() => contactForm.removeEventListener('submit', onSubmit))
    }

    return () => {
      io?.disconnect()
      cleanupFns.forEach((fn) => fn())
    }
  }, [])

  return null
}
