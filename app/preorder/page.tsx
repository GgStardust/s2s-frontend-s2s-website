'use client';

import { useState } from 'react';
import Link from 'next/link';
import Button from '@/components/ui/Button';
import NewsletterSignup from '@/components/NewsletterSignup';

export default function PreorderPage() {
  const [selectedOrder, setSelectedOrder] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  const handleCardClick = (orderType: string) => {
    setSelectedOrder(orderType);
  };

  const validateForm = (formData: FormData): Record<string, string> => {
    const errors: Record<string, string> = {};
    const name = formData.get('name') as string;
    const email = formData.get('email') as string;
    const order = formData.get('order') as string;

    if (!name || name.trim().length < 2) {
      errors.name = 'Name must be at least 2 characters';
    }
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      errors.email = 'Please enter a valid email address';
    }
    if (!order) {
      errors.order = 'Please select an order type';
    }
    if (order === 'print' || order === 'bundle') {
      const street = formData.get('street') as string;
      const city = formData.get('city') as string;
      const state = formData.get('state') as string;
      const zip = formData.get('zip') as string;
      
      if (!street || street.trim().length < 5) {
        errors.street = 'Please provide a street address';
      }
      if (!city || city.trim().length < 2) {
        errors.city = 'Please provide a city';
      }
      if (!state || state.trim().length < 2) {
        errors.state = 'Please provide a state';
      }
      if (!zip || !/^\d{5}(-\d{4})?$/.test(zip.trim())) {
        errors.zip = 'Please provide a valid ZIP code';
      }
    }

    return errors;
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSubmitError('');
    setFieldErrors({});
    
    const form = e.currentTarget;
    const formData = new FormData(form);
    
    const errors = validateForm(formData);
    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      const response = await fetch('https://formspree.io/f/xgvgzgaj', {
        method: 'POST',
        body: formData,
        headers: {
          Accept: 'application/json',
        },
      });

      if (response.ok) {
        setSubmitted(true);
        form.reset();
        setSelectedOrder('');
      } else {
        const data = await response.json();
        setSubmitError(data.error || 'There was an error submitting your preorder. Please try again.');
      }
    } catch (error) {
      setSubmitError('There was an error submitting your preorder. Please check your connection and try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <main className="min-h-screen bg-structural-grid">
        <section className="max-w-4xl mx-auto py-20 px-6 text-center">
          <h1 className="text-4xl font-bold mb-6 tracking-tight text-stone-100">Thank You</h1>
          <p className="text-base leading-relaxed text-stone-200 mb-4">
          Your preorder has been received. You'll receive a confirmation email with payment information (Zelle or Venmo) within 24-48 hours.
          </p>
          <p className="text-base leading-relaxed text-stone-200 mb-4">
          Books will ship on February 28, 2026. Digital editions will be delivered in mid-February 2026.
          </p>
          <p className="text-base leading-relaxed text-cyan-300 mb-8 font-medium">
          Console access will be announced via email to all preorder participants. We're targeting mid-February 2026, but it may be available sooner.
          </p>
          <Button href="/" variant="tertiary">
          Return to Home
          </Button>
        </section>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-structural-grid">
      {/* Header */}
      <section className="max-w-4xl mx-auto py-20 px-6">
        <div className="text-center">
          <h1 className="text-5xl md:text-6xl font-bold mb-6 tracking-tight text-stone-100">Reserve Your First Edition Copy</h1>
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-stone-200">
            Book One: The Cosmic Tapestry
        </h2>
          <p className="text-base leading-relaxed text-stone-200 max-w-3xl mx-auto mb-4">
          Book One is a cosmological field report and foundational field manual. It introduces the structure of the Sovereign Field and the full system of sovereign intelligences that shape coherent human identity.
        </p>
          <p className="text-base text-cyan-300 mb-6 font-medium">
            Order before February 28, 2026
          </p>
        </div>
      </section>

      {/* What's Inside */}
      <section className="max-w-4xl mx-auto py-16 lg:py-24 border-t border-stone-300/30 px-6 ">
        <div className="terminator-border">
          <div className="p-8 bg-cosmic-blue rounded-lg">
            <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
              <div className="lg:col-span-2">
                <h2 className="text-2xl lg:text-3xl font-semibold tracking-tight text-cyan-300">
                  What Book One Contains
                </h2>
              </div>
              <div className="lg:col-span-3">
                <ul className="space-y-4 text-base leading-relaxed text-stone-200">
                  <li className="flex items-start">
                    <span className="text-cyan-300 mr-3 mt-1">•</span>
                    <span><strong>The Sovereign Field:</strong> Your internal coherence system and how to recognize it</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-cyan-300 mr-3 mt-1">•</span>
                    <span><strong>The Full System of Sovereign Intelligences:</strong> Structural coordinates that map perception, timing, orientation, and identity</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-cyan-300 mr-3 mt-1">•</span>
                    <span><strong>Recognition, Perception, and Coherence Shifts:</strong> The natural movements of awareness when the architecture is active</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-cyan-300 mr-3 mt-1">•</span>
                    <span><strong>Living Architecture:</strong> A system that orients through recognition rather than doing</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-cyan-300 mr-3 mt-1">•</span>
                    <span><strong>Coherent Perception:</strong> The natural state when the architecture is active</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
      </div>
      </section>

      {/* Pricing Cards */}
      <section className="max-w-4xl mx-auto py-16 lg:py-24 border-t border-stone-300/30 px-6 ">
        <h2 className="text-2xl lg:text-3xl font-semibold tracking-tight text-stone-100 mb-8 text-center">Choose Your Edition</h2>
        <div className="grid md:grid-cols-3 gap-6">
          {/* Print Edition Card */}
          <div
            className={`relative cursor-pointer transition-all duration-300
              ${selectedOrder === 'print' ? '' : ''}`}
            onClick={() => handleCardClick('print')}
          >
            <div className="terminator-border">
              <div className="p-8 bg-cosmic-blue rounded-lg">
            {selectedOrder === 'print' && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-cyan-500 text-cosmic-blue text-xs font-bold px-3 py-1 rounded-full z-10">
                Selected
              </div>
            )}
                <h3 className="text-xl font-semibold mb-3 tracking-tight text-cyan-300">Print Edition</h3>
                <p className="text-sm text-stone-300 mb-2">Softcover, black & white</p>
                <p className="text-sm text-stone-300 mb-4">Ships February 28, 2026</p>
                <p className="text-3xl font-bold text-cyan-300">$44 USD</p>
              </div>
            </div>
          </div>

          {/* Digital Edition Card */}
          <div
            className={`relative cursor-pointer transition-all duration-300
              ${selectedOrder === 'digital' ? '' : ''}`}
            onClick={() => handleCardClick('digital')}
          >
            <div className="terminator-border">
              <div className="p-8 bg-cosmic-blue rounded-lg">
            {selectedOrder === 'digital' && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-cyan-500 text-cosmic-blue text-xs font-bold px-3 py-1 rounded-full z-10">
                Selected
              </div>
            )}
                <h3 className="text-xl font-semibold mb-3 tracking-tight text-cyan-300">Digital Edition</h3>
                <p className="text-sm text-stone-300 mb-2">Delivered instantly (EPUB and web access)</p>
                <p className="text-sm text-stone-300 mb-4">Releases mid-February 2026</p>
                <p className="text-3xl font-bold text-cyan-300">$22 USD</p>
              </div>
            </div>
          </div>

          {/* Bundle Edition Card */}
          <div
            className={`relative cursor-pointer transition-all duration-300
              ${selectedOrder === 'bundle' ? '' : ''}`}
            onClick={() => handleCardClick('bundle')}
          >
            <div className="terminator-border">
              <div className="p-8 bg-cosmic-blue rounded-lg">
            {selectedOrder === 'bundle' && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-cyan-500 text-cosmic-blue text-xs font-bold px-3 py-1 rounded-full z-10">
                Selected
              </div>
            )}
                <h3 className="text-xl font-semibold mb-3 tracking-tight text-cyan-300">Bundle</h3>
                <p className="text-sm text-stone-300 mb-2">Print + Digital</p>
                <p className="text-sm text-stone-300 mb-4">Save $11!</p>
                <p className="text-3xl font-bold text-cyan-300">$55 USD</p>
              </div>
            </div>
          </div>
        </div>
        <p className="text-sm text-stone-300 mt-8 text-center">
          No sales tax or shipping within the U.S.<br />
          International orders may require a customs fee depending on location.
        </p>
      </section>

      {/* Preorder Form */}
      <section className="max-w-4xl mx-auto py-16 lg:py-24 border-t border-stone-300/30 px-6 ">
        <div className="terminator-border mb-8">
          <div className="p-8 bg-cosmic-blue rounded-lg">
            <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
              <div className="lg:col-span-2">
                <h2 className="text-2xl lg:text-3xl font-semibold tracking-tight text-cyan-300">
                  How to Complete Your Preorder
                </h2>
              </div>
              <div className="lg:col-span-3">
                <p className="text-base leading-relaxed text-stone-200 mb-6">
          Preorders support the first printing of this self-published book. By completing this form, 
          you reserve your copy and contribute to bringing this work into the world.
        </p>
                <div className="mb-6">
                  <ul className="space-y-3 text-sm text-stone-200">
            <li className="flex items-start">
                      <span className="text-cyan-300 mr-3">•</span>
              <span>Preorders Open Now.</span>
            </li>
            <li className="flex items-start">
                      <span className="text-cyan-300 mr-3">•</span>
                      <span>Print editions ship on <span className="font-semibold">February 28, 2026</span> (softcover, black & white).</span>
            </li>
            <li className="flex items-start">
                      <span className="text-cyan-300 mr-3">•</span>
                      <span>Digital editions release <span className="font-semibold">mid-February 2026</span> (EPUB and web access).</span>
            </li>
          </ul>
        </div>
                <p className="text-sm text-stone-300">
          You'll receive a confirmation and payment instructions via email.
        </p>
              </div>
            </div>
          </div>
        </div>

        <div className="terminator-border">
          <div className="p-8 bg-cosmic-blue rounded-lg">
            <form onSubmit={handleSubmit} className="max-w-2xl mx-auto space-y-6">
          <div>
            <label htmlFor="name" className="block text-sm font-medium mb-2 text-stone-300">
              Name
            </label>
            <input
              type="text"
              id="name"
              name="name"
              required
              className={`w-full px-4 py-3 bg-stone-800/50 border rounded-md text-stone-100 placeholder-stone-500 focus:outline-none focus:ring-2 ${
                fieldErrors.name 
                  ? 'border-red-400 focus:border-red-400 focus:ring-red-500/20' 
                  : 'border-stone-600/50 focus:border-cyan-400 focus:ring-cyan-500/20'
              }`}
              aria-invalid={!!fieldErrors.name}
              aria-describedby={fieldErrors.name ? 'name-error' : undefined}
            />
            {fieldErrors.name && (
              <p id="name-error" className="text-red-400 text-sm mt-1" role="alert">{fieldErrors.name}</p>
            )}
          </div>

          <div>
            <label htmlFor="email" className="block text-sm font-medium mb-2 text-stone-300">
              Email
            </label>
            <input
              type="email"
              id="email"
              name="email"
              required
              className={`w-full px-4 py-3 bg-stone-800/50 border rounded-md text-stone-100 placeholder-stone-500 focus:outline-none focus:ring-2 ${
                fieldErrors.email 
                  ? 'border-red-400 focus:border-red-400 focus:ring-red-500/20' 
                  : 'border-stone-600/50 focus:border-cyan-400 focus:ring-cyan-500/20'
              }`}
              aria-invalid={!!fieldErrors.email}
              aria-describedby={fieldErrors.email ? 'email-error' : undefined}
            />
            {fieldErrors.email && (
              <p id="email-error" className="text-red-400 text-sm mt-1" role="alert">{fieldErrors.email}</p>
            )}
          </div>

          <div>
            <label htmlFor="order" className="block text-sm font-medium mb-2 text-stone-300">
              Order Type
            </label>
            <select
              id="order"
              name="order"
              required
              value={selectedOrder}
              onChange={(e) => {
                setSelectedOrder(e.target.value);
                if (fieldErrors.order) {
                  setFieldErrors(prev => ({ ...prev, order: '' }));
                }
              }}
              className={`w-full px-4 py-3 bg-stone-800/50 border rounded-md text-stone-100 focus:outline-none focus:ring-2 ${
                fieldErrors.order 
                  ? 'border-red-400 focus:border-red-400 focus:ring-red-500/20' 
                  : 'border-stone-600/50 focus:border-cyan-400 focus:ring-cyan-500/20'
              }`}
              aria-invalid={!!fieldErrors.order}
              aria-describedby={fieldErrors.order ? 'order-error' : undefined}
            >
              <option value="" disabled>Select an option</option>
              <option value="print">Print $44</option>
              <option value="digital">Digital $22</option>
              <option value="bundle">Print + Digital $55</option>
            </select>
            {fieldErrors.order && (
              <p id="order-error" className="text-red-400 text-sm mt-1" role="alert">{fieldErrors.order}</p>
            )}
          </div>

          {(selectedOrder === 'print' || selectedOrder === 'bundle') && (
            <>
              <div className="border-t border-stone-600/30 pt-6">
                <label className="block text-sm font-medium mb-4 text-cyan-300">
                  Shipping Address
                </label>
                
                <div className="mb-4">
                  <label htmlFor="street" className="block text-sm font-medium mb-2 text-stone-300">
                    Street Address
                  </label>
                  <input
                    type="text"
                    id="street"
                    name="street"
                    required={selectedOrder === 'print' || selectedOrder === 'bundle'}
                    className={`w-full px-4 py-3 bg-stone-800/50 border rounded-md text-stone-100 placeholder-stone-500 focus:outline-none focus:ring-2 ${
                      fieldErrors.street 
                        ? 'border-red-400 focus:border-red-400 focus:ring-red-500/20' 
                        : 'border-stone-600/50 focus:border-cyan-400 focus:ring-cyan-500/20'
                    }`}
                    aria-invalid={!!fieldErrors.street}
                    aria-describedby={fieldErrors.street ? 'street-error' : undefined}
                  />
                  {fieldErrors.street && (
                    <p id="street-error" className="text-red-400 text-sm mt-1" role="alert">{fieldErrors.street}</p>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                  <div>
                    <label htmlFor="city" className="block text-sm font-medium mb-2 text-stone-300">
                      City
                    </label>
                    <input
                      type="text"
                      id="city"
                      name="city"
                      required={selectedOrder === 'print' || selectedOrder === 'bundle'}
                      className={`w-full px-4 py-3 bg-stone-800/50 border rounded-md text-stone-100 placeholder-stone-500 focus:outline-none focus:ring-2 ${
                        fieldErrors.city 
                          ? 'border-red-400 focus:border-red-400 focus:ring-red-500/20' 
                          : 'border-stone-600/50 focus:border-cyan-400 focus:ring-cyan-500/20'
                      }`}
                      aria-invalid={!!fieldErrors.city}
                      aria-describedby={fieldErrors.city ? 'city-error' : undefined}
                    />
                    {fieldErrors.city && (
                      <p id="city-error" className="text-red-400 text-sm mt-1" role="alert">{fieldErrors.city}</p>
                    )}
                  </div>

                  <div>
                    <label htmlFor="state" className="block text-sm font-medium mb-2 text-stone-300">
                      State
                    </label>
                    <input
                      type="text"
                      id="state"
                      name="state"
                      required={selectedOrder === 'print' || selectedOrder === 'bundle'}
                      className={`w-full px-4 py-3 bg-stone-800/50 border rounded-md text-stone-100 placeholder-stone-500 focus:outline-none focus:ring-2 ${
                        fieldErrors.state 
                          ? 'border-red-400 focus:border-red-400 focus:ring-red-500/20' 
                          : 'border-stone-600/50 focus:border-cyan-400 focus:ring-cyan-500/20'
                      }`}
                      aria-invalid={!!fieldErrors.state}
                      aria-describedby={fieldErrors.state ? 'state-error' : undefined}
                    />
                    {fieldErrors.state && (
                      <p id="state-error" className="text-red-400 text-sm mt-1" role="alert">{fieldErrors.state}</p>
                    )}
                  </div>

                  <div>
                    <label htmlFor="zip" className="block text-sm font-medium mb-2 text-stone-300">
                      ZIP Code
                    </label>
                    <input
                      type="text"
                      id="zip"
                      name="zip"
                      required={selectedOrder === 'print' || selectedOrder === 'bundle'}
                      className={`w-full px-4 py-3 bg-stone-800/50 border rounded-md text-stone-100 placeholder-stone-500 focus:outline-none focus:ring-2 ${
                        fieldErrors.zip 
                          ? 'border-red-400 focus:border-red-400 focus:ring-red-500/20' 
                          : 'border-stone-600/50 focus:border-cyan-400 focus:ring-cyan-500/20'
                      }`}
                      aria-invalid={!!fieldErrors.zip}
                      aria-describedby={fieldErrors.zip ? 'zip-error' : undefined}
                    />
                    {fieldErrors.zip && (
                      <p id="zip-error" className="text-red-400 text-sm mt-1" role="alert">{fieldErrors.zip}</p>
                    )}
                  </div>
                </div>
              </div>
            </>
          )}

          <div>
            <label htmlFor="notes" className="block text-sm font-medium mb-2 text-stone-300">
              Notes / Special Instructions
            </label>
            <textarea
              id="notes"
              name="notes"
              rows={3}
              className="w-full px-4 py-3 bg-stone-800/50 border border-stone-600/50 rounded-md text-stone-100 placeholder-stone-500 focus:outline-none focus:border-cyan-400 focus:ring-2 focus:ring-cyan-500/20 resize-none"
            />
          </div>

          {submitError && (
            <div className="p-4 bg-red-500/10 border border-red-400/30 rounded-md">
              <p className="text-red-400 text-sm" role="alert">{submitError}</p>
            </div>
          )}
          <div>
          <button
            type="submit"
            disabled={isSubmitting}
            className="px-6 py-3 rounded-md bg-cyan-500 text-cosmic-blue hover:bg-cyan-400 hover:shadow-lg hover:shadow-cyan-500/50 transition-all font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            {isSubmitting ? (
              <>
                <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Submitting...
              </>
            ) : (
              'Submit Preorder'
            )}
          </button>
          </div>
        </form>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="max-w-4xl mx-auto py-16 lg:py-24 border-t border-stone-300/30 px-6 ">
        <div className="terminator-border">
          <div className="p-8 bg-cosmic-blue rounded-lg">
            <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
              <div className="lg:col-span-2">
                <h2 className="text-2xl lg:text-3xl font-semibold tracking-tight text-cyan-300">
                  Frequently Asked Questions
                </h2>
              </div>
              <div className="lg:col-span-3 space-y-6">
                <div>
                  <h3 className="text-lg font-semibold mb-2 text-cyan-300">When will I receive my book?</h3>
                  <p className="text-base leading-relaxed text-stone-200">
                    Print editions ship on <strong>February 28, 2026</strong>. Digital editions (EPUB and web access) release in <strong>mid-February 2026</strong>.
                  </p>
                </div>
                <div>
                  <h3 className="text-lg font-semibold mb-2 text-cyan-300">What format is the digital edition?</h3>
                  <p className="text-base leading-relaxed text-stone-200">
                    The digital edition includes both EPUB format (for e-readers) and web access, so you can read it on any device.
                  </p>
                </div>
                <div>
                  <h3 className="text-lg font-semibold mb-2 text-cyan-300">What's included in the bundle?</h3>
                  <p className="text-base leading-relaxed text-stone-200">
                    The bundle includes both the print edition (softcover, black & white) and the digital edition (EPUB + web access), saving you $11.
                  </p>
                </div>
                <div>
                  <h3 className="text-lg font-semibold mb-2 text-cyan-300">Do you ship internationally?</h3>
                  <p className="text-base leading-relaxed text-stone-200">
                    Yes, we ship internationally. No sales tax or shipping within the U.S. International orders may require a customs fee depending on location.
                  </p>
                </div>
                <div>
                  <h3 className="text-lg font-semibold mb-2 text-cyan-300">Why self-published?</h3>
                  <p className="text-base leading-relaxed text-stone-200">
                    This work is self-published to maintain its integrity and ensure the field encoded within it remains alive and unmediated. Preorders support the first printing and help bring this work into the world.
                  </p>
                </div>
                <div>
                  <h3 className="text-lg font-semibold mb-2 text-cyan-300">What happens after I preorder?</h3>
                  <p className="text-base leading-relaxed text-stone-200 mb-2">
                    You'll receive a confirmation email with payment information (Zelle or Venmo) within 24-48 hours. Books will ship on February 28, 2026. Digital editions will be delivered in mid-February 2026.
                  </p>
                  <p className="text-base leading-relaxed text-cyan-300">
                    Console access will be announced via email to all preorder participants. We're targeting mid-February 2026, but it may be available sooner.
                  </p>
                </div>
                <div>
                  <h3 className="text-lg font-semibold mb-2 text-cyan-300">How do I pay?</h3>
                  <p className="text-base leading-relaxed text-stone-200">
                    Payment instructions will be sent via email after you place your preorder. We accept Zelle and Venmo. Payment is due within 7 days of receiving instructions.
                  </p>
                </div>
                <div>
                  <h3 className="text-lg font-semibold mb-2 text-cyan-300">What is the refund policy?</h3>
                  <p className="text-base leading-relaxed text-stone-200">
                    This is a limited first edition supporting self-publishing. No refunds will be issued. All sales are final.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Future Volumes */}
      <section className="max-w-4xl mx-auto py-16 lg:py-24 border-t border-stone-300/30 px-6 ">
        <div className="terminator-border">
          <div className="p-8 bg-cosmic-blue rounded-lg">
            <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
              <div className="lg:col-span-2">
                <h2 className="text-2xl lg:text-3xl font-semibold tracking-tight text-cyan-300">
                  Future Volumes
                </h2>
              </div>
              <div className="lg:col-span-3">
                <p className="text-base leading-relaxed text-stone-200 mb-6">
          Book Two (<em>The Architecture of Civilization</em>) and Book Three (<em>The Resonant Species</em>) 
          are currently in development. Preorder announcements will be shared through the Console and newsletter.
        </p>
                <p className="text-base leading-relaxed text-stone-200 mb-4">
          Join the list to receive preorder announcements, Codex releases, and Console updates:
        </p>
                <div className="max-w-md">
                  <NewsletterSignup />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
