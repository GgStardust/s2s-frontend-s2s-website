import { BOOK_VOLUME_LABEL, SERIES_NAME } from '@/lib/homepageCopy';

type Props = {
  className?: string;
  centered?: boolean;
};

/** Series → volume eyebrow above book title (Stardust to Sovereignty / Book One). */
export default function BookSeriesEyebrow({ className = '', centered = true }: Props) {
  return (
    <div className={`space-y-0.5 ${centered ? 'text-center' : ''} ${className}`}>
      <p className="text-xs uppercase tracking-[0.2em] text-stone-500 font-sans">{SERIES_NAME}</p>
      <p className="text-[11px] uppercase tracking-[0.18em] text-stone-600 font-sans">{BOOK_VOLUME_LABEL}</p>
    </div>
  );
}
