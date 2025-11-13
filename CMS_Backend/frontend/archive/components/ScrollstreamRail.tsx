'use client';

import { useEffect, useState } from 'react';
import { ChevronRight, ChevronLeft } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface Scrollstream {
  id: string;
  content: string;
  orb_associations: number[];
}

export default function ScrollstreamRail() {
  const [scrollstreams, setScrollstreams] = useState<Scrollstream[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchScrollstreams();
  }, []);

  const fetchScrollstreams = async () => {
    try {
      const response = await fetch('/api/scrollstreams?status=published&limit=20');
      const data = await response.json();
      setScrollstreams(data.scrollstreams || []);
    } catch (error) {
      console.error('Failed to fetch scrollstreams:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % scrollstreams.length);
  };

  const handlePrevious = () => {
    setCurrentIndex((prev) => (prev - 1 + scrollstreams.length) % scrollstreams.length);
  };

  if (isLoading || scrollstreams.length === 0) {
    return null;
  }

  const currentScroll = scrollstreams[currentIndex];

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-gradient-to-r from-deep-indigo via-void-black to-deep-indigo border-t border-living-gold/30 backdrop-blur-sm">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between gap-4">
          {/* Previous button */}
          <button
            onClick={handlePrevious}
            className="flex-shrink-0 p-2 hover:bg-living-gold/10 rounded-full transition-colors"
            aria-label="Previous scroll"
          >
            <ChevronLeft className="w-5 h-5 text-living-gold" />
          </button>

          {/* Scrollstream content */}
          <div className="flex-1 overflow-hidden">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentScroll.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
                className="text-center"
              >
                <p className="text-bone-white font-lora italic text-base md:text-lg">
                  &quot;{currentScroll.content}&quot;
                </p>
                {currentScroll.orb_associations?.length > 0 && (
                  <div className="flex items-center justify-center gap-2 mt-2">
                    {currentScroll.orb_associations.map((orbId) => (
                      <span
                        key={orbId}
                        className="text-xs text-living-gold/70"
                      >
                        Orb {orbId}
                      </span>
                    ))}
                  </div>
                )}
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Next button */}
          <button
            onClick={handleNext}
            className="flex-shrink-0 p-2 hover:bg-living-gold/10 rounded-full transition-colors"
            aria-label="Next scroll"
          >
            <ChevronRight className="w-5 h-5 text-living-gold" />
          </button>
        </div>

        {/* Progress indicator */}
        <div className="flex items-center justify-center gap-1 mt-3">
          {scrollstreams.slice(0, 10).map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentIndex(index)}
              className={`h-1 rounded-full transition-all ${
                index === currentIndex
                  ? 'w-8 bg-living-gold'
                  : 'w-1 bg-living-gold/30 hover:bg-living-gold/50'
              }`}
              aria-label={`Go to scroll ${index + 1}`}
            />
          ))}
          {scrollstreams.length > 10 && (
            <span className="text-xs text-living-gold/50 ml-2">
              +{scrollstreams.length - 10} more
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
