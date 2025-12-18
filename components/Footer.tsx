'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import NewsletterSignup from '@/components/NewsletterSignup';

export default function Footer() {
  const pathname = usePathname();
  
  // Hide footer on threshold page (/)
  if (pathname === '/') {
    return null;
  }

  return (
    <footer className="text-center text-base text-stone-200 py-12 border-t border-stone-300/30">
      <div className="max-w-6xl mx-auto px-6 space-y-6">
        <div>
          <p className="text-stone-300 mb-4">© {new Date().getFullYear()} Stardust to Sovereignty. All rights reserved.</p>
          <div className="flex flex-wrap justify-center gap-4 text-sm">
            <Link href="/about-gigi" className="text-stone-300 hover:text-cyan-300 underline underline-offset-4">
              About Gigi
            </Link>
            <Link href="/terms" className="text-stone-300 hover:text-cyan-300 underline underline-offset-4">
              Terms of Service
            </Link>
            <a href="mailto:gigi@stardusttosovereignty.com" className="text-stone-300 hover:text-cyan-300 underline underline-offset-4">
              Contact
            </a>
            <a href="https://www.instagram.com/gigi_stardust/" target="_blank" rel="noopener noreferrer" className="text-stone-300 hover:text-cyan-300 underline underline-offset-4">
              Instagram
            </a>
          </div>
        </div>
        <div className="pt-4 border-t border-stone-300/30">
          <p className="text-base text-stone-200 mb-3">Stay updated with preorder announcements and Console releases:</p>
          <div className="max-w-md mx-auto">
            <NewsletterSignup />
          </div>
        </div>
      </div>
    </footer>
  );
}
