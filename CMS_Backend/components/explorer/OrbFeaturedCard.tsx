import Link from 'next/link';
import { Orb } from '@/lib/types';

interface OrbFeaturedCardProps {
  orb: Orb;
}

export default function OrbFeaturedCard({ orb }: OrbFeaturedCardProps) {
  return (
    <div className="bg-white rounded-xl p-8 border border-deep-gold/20">
      <div className="flex items-center justify-between mb-6">
        <div className="w-20 h-20 bg-deep-gold rounded-full flex items-center justify-center text-creamy-white font-montserrat font-bold text-2xl">
          {orb.id}
        </div>
        <div className="text-deep-gold text-sm font-montserrat uppercase tracking-wide">
          Orb {orb.id}
        </div>
      </div>
      
      <h2 className="text-deep-navy font-montserrat font-bold text-3xl mb-4">
        {orb.title}
      </h2>
      
      <p className="text-deep-navy/80 font-lora text-lg leading-relaxed mb-8">
        {orb.synthesis}
      </p>
      
      <Link
        href={`/orbs/${orb.slug}`}
        className="inline-flex items-center bg-deep-gold text-creamy-white px-6 py-3 rounded-lg font-montserrat font-semibold text-sm hover:bg-deep-navy hover:text-creamy-white transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-deep-gold focus:ring-offset-2"
      >
        Explore Orb
        <svg className="ml-2 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </Link>
    </div>
  );
}
