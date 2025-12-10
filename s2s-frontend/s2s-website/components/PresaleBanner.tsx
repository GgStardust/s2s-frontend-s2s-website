import { PRESALE_INFO } from '@/lib/content';

interface PresaleBannerProps {
  variant?: 'full' | 'short';
  className?: string;
}

export default function PresaleBanner({ variant = 'full', className = '' }: PresaleBannerProps) {
  const text = variant === 'full' 
    ? PRESALE_INFO.announcement 
    : PRESALE_INFO.shortAnnouncement;

  return (
    <div className={`text-center space-y-4 ${className}`}>
      <div className="inline-block terminator-border-rounded">
        <div className="px-8 py-3 bg-cosmic-blue/95 backdrop-blur-sm rounded-full">
          <p className="text-base md:text-lg text-cyan-300 font-medium">
            {text}
          </p>
        </div>
      </div>
    </div>
  );
}
