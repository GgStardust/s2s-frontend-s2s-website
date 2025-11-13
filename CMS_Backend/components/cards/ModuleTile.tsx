import Link from 'next/link';
import { Module } from '@/lib/types';

interface ModuleTileProps {
  module: Module;
}

export default function ModuleTile({ module }: ModuleTileProps) {
  return (
    <Link
      href={`/modules/${module.slug}`}
      className="group block bg-deep-navy rounded-2xl shadow-lg hover:shadow-xl transition-all duration-200 p-6 border-2 border-deep-gold/20 hover:border-deep-gold/40"
    >
      <div className="flex items-center justify-between mb-4">
        <div className="w-12 h-12 bg-cosmic-blue rounded-full flex items-center justify-center text-creamy-white font-montserrat font-bold text-lg">
          {module.title.charAt(0)}
        </div>
        <div className="text-creamy-white/60 text-sm font-montserrat uppercase tracking-wide">
          {module.category}
        </div>
      </div>
      
      <h3 className="text-creamy-white font-montserrat font-semibold text-xl mb-3 group-hover:text-deep-gold transition-colors duration-200">
        {module.title}
      </h3>
      
      <p className="text-creamy-white/80 font-lora text-sm leading-relaxed mb-4">
        {module.summary}
      </p>
      
      <div className="flex items-center text-deep-gold font-montserrat text-sm uppercase tracking-wide group-hover:text-creamy-white transition-colors duration-200">
        Explore Module
        <svg className="ml-2 w-4 h-4 transform group-hover:translate-x-1 transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </div>
    </Link>
  );
}
