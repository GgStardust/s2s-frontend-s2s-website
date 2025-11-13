import Link from 'next/link';
import { Orb } from '@/lib/types';

interface OrbCardProps {
  orb: Orb;
}

export default function OrbCard({ orb }: OrbCardProps) {
  return (
    <Link 
      href={`/orbs/${orb.slug}`}
      className="group block bg-creamy-white rounded-2xl shadow-md hover:shadow-lg transition-shadow duration-200 p-6 border border-deep-navy/10"
    >
      <div className="flex items-center justify-between mb-4">
        <div className="w-12 h-12 bg-deep-gold rounded-full flex items-center justify-center text-deep-navy font-montserrat font-bold text-lg">
          {orb.id}
        </div>
        <div className="text-deep-navy/60 text-sm font-montserrat uppercase tracking-wide">
          Orb {orb.id}
        </div>
      </div>
      
      <h3 className="text-deep-navy font-montserrat font-semibold text-xl mb-3 group-hover:text-deep-gold transition-colors duration-200">
        {orb.title}
      </h3>
      
      <p className="text-deep-navy/80 font-lora text-sm leading-relaxed line-clamp-3">
        {orb.synthesis}
      </p>
      
      <div className="mt-4 flex items-center text-deep-gold font-montserrat text-sm uppercase tracking-wide group-hover:text-deep-navy transition-colors duration-200">
        Explore Orb
        <svg className="ml-2 w-4 h-4 transform group-hover:translate-x-1 transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </div>
    </Link>
  );
}
