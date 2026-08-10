import { siteConfig } from './site-config.js'

const toggle = document.querySelector('.nav-toggle')
const mobileNav = document.querySelector('#mobile-nav')

if (toggle && mobileNav) {
  toggle.addEventListener('click', () => {
    const open = toggle.getAttribute('aria-expanded') === 'true'
    toggle.setAttribute('aria-expanded', String(!open))
    toggle.setAttribute('aria-label', open ? 'Open menu' : 'Close menu')
    mobileNav.hidden = open
  })

  mobileNav.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', () => {
      toggle.setAttribute('aria-expanded', 'false')
      toggle.setAttribute('aria-label', 'Open menu')
      mobileNav.hidden = true
    })
  })
}

/* Viewport-triggered reveals — only when sections enter view */
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
    '.book-quote',
    '.paradigm-band__grid',
    '.paradigm__copy',
    '.paradigm__aside',
    '.inquiry-list li',
    '.inquiry-unit',
    '.inquiry-engine',
    '.inquiry-close__inner',
    '.orb-grid li',
    '.gigi__grid',
    '.gigi-bio',
    '.gigi-contact__inner',
    '.close__inner',
    '.s2s-register__inner',
  ].join(', ')
)

revealNodes.forEach((el, i) => {
  el.classList.add('reveal')
  if (i % 3 === 1) el.classList.add('reveal-delay-1')
  if (i % 3 === 2) el.classList.add('reveal-delay-2')
})

if ('IntersectionObserver' in window) {
  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible')
          io.unobserve(entry.target)
        }
      })
    },
    { rootMargin: '0px 0px -8% 0px', threshold: 0.12 }
  )
  revealNodes.forEach((el) => io.observe(el))
} else {
  revealNodes.forEach((el) => el.classList.add('is-visible'))
}

/* /orbs — progressive lens disclosure */
const orbField = document.querySelector('.orb-field')
if (orbField) {
  const lenses = [...orbField.querySelectorAll('.orb-lens')]

  const closeLens = (lens) => {
    const trigger = lens.querySelector('.orb-lens__trigger')
    const desc = lens.querySelector('.orb-desc')
    lens.classList.remove('is-open')
    if (trigger) trigger.setAttribute('aria-expanded', 'false')
    if (desc) desc.setAttribute('aria-hidden', 'true')
  }

  const openLens = (lens) => {
    lenses.forEach((other) => {
      if (other !== lens) closeLens(other)
    })
    const trigger = lens.querySelector('.orb-lens__trigger')
    const desc = lens.querySelector('.orb-desc')
    lens.classList.add('is-open')
    if (trigger) trigger.setAttribute('aria-expanded', 'true')
    if (desc) desc.setAttribute('aria-hidden', 'false')
  }

  const toggleLens = (lens) => {
    if (lens.classList.contains('is-open')) closeLens(lens)
    else openLens(lens)
  }

  orbField.addEventListener('click', (event) => {
    const trigger = event.target.closest('.orb-lens__trigger')
    if (!trigger || !orbField.contains(trigger)) return
    event.stopPropagation()
    toggleLens(trigger.closest('.orb-lens'))
  })

  document.addEventListener('keydown', (event) => {
    if (event.key !== 'Escape') return
    lenses.forEach(closeLens)
  })

  document.addEventListener('pointerdown', (event) => {
    if (event.target.closest('.orb-lens')) return
    lenses.forEach(closeLens)
  })
}

/* /inquiry — progressive spark → architecture → field */
const inquiryField = document.querySelector('.inquiry-field')
if (inquiryField) {
  const units = [...inquiryField.querySelectorAll('.inquiry-unit')]
  const finePointer = () =>
    window.matchMedia('(hover: hover) and (pointer: fine)').matches

  const setArch = (unit, on) => {
    const arch = unit.querySelector('.inquiry-arch')
    unit.classList.toggle('is-arch', on)
    if (arch) arch.setAttribute('aria-hidden', on ? 'false' : 'true')
  }

  const setField = (unit, on) => {
    const response = unit.querySelector('.inquiry-response')
    const trigger = unit.querySelector('.inquiry-unit__trigger')
    unit.classList.toggle('is-field', on)
    if (response) response.setAttribute('aria-hidden', on ? 'false' : 'true')
    if (trigger) trigger.setAttribute('aria-expanded', on ? 'true' : 'false')
    if (on) setArch(unit, true)
  }

  const resetUnit = (unit) => {
    setField(unit, false)
    setArch(unit, false)
  }

  const resetOthers = (unit) => {
    units.forEach((other) => {
      if (other !== unit) resetUnit(other)
    })
  }

  units.forEach((unit) => {
    const trigger = unit.querySelector('.inquiry-unit__trigger')

    unit.addEventListener('pointerenter', () => {
      if (!finePointer()) return
      setArch(unit, true)
    })

    unit.addEventListener('pointerleave', () => {
      if (!finePointer()) return
      if (!unit.classList.contains('is-field')) setArch(unit, false)
    })

    trigger.addEventListener('focus', () => {
      setArch(unit, true)
    })

    trigger.addEventListener('blur', () => {
      if (!unit.classList.contains('is-field') && !unit.matches(':hover')) {
        setArch(unit, false)
      }
    })

    trigger.addEventListener('click', (event) => {
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
    })
  })

  document.addEventListener('keydown', (event) => {
    if (event.key !== 'Escape') return
    units.forEach(resetUnit)
  })

  document.addEventListener('pointerdown', (event) => {
    if (event.target.closest('.inquiry-unit')) return
    units.forEach(resetUnit)
  })
}

/* Quiet contact form — destination configured off-site */
const contactForm = document.querySelector('#contact-form')
if (contactForm) {
  const status = document.querySelector('#contact-status')
  const submit = contactForm.querySelector('.contact-form__submit')

  const setStatus = (message, kind = 'info') => {
    if (!status) return
    status.hidden = false
    status.dataset.kind = kind
    status.textContent = message
  }

  contactForm.addEventListener('submit', async (event) => {
    event.preventDefault()

    const action = siteConfig.contactFormAction.trim()
    if (!action) {
      setStatus('Contact is not configured yet. Please try again later.', 'error')
      return
    }

    const formData = new FormData(contactForm)
    submit.disabled = true
    setStatus('Sending…', 'info')

    try {
      const response = await fetch(action, {
        method: 'POST',
        body: formData,
        headers: { Accept: 'application/json' },
      })

      if (!response.ok) {
        throw new Error(`Request failed: ${response.status}`)
      }

      contactForm.reset()
      setStatus('Message sent.', 'success')
    } catch {
      setStatus('Unable to send right now. Please try again later.', 'error')
    } finally {
      submit.disabled = false
    }
  })
}
