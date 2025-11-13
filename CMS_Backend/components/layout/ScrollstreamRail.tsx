interface ScrollstreamRailProps {
  phrases: string[];
}

export default function ScrollstreamRail({ phrases }: ScrollstreamRailProps) {
  return (
    <div className="bg-deep-navy rounded-2xl p-6">
      <div className="flex items-center mb-4">
        <div className="w-3 h-3 bg-deep-gold rounded-full mr-3"></div>
        <h2 className="text-creamy-white font-montserrat font-semibold text-lg uppercase tracking-wide">
          Scrollstream
        </h2>
      </div>
      
      <div className="space-y-3">
        {phrases.slice(0, 5).map((phrase, index) => (
          <div 
            key={index}
            className="bg-cosmic-blue/20 rounded-lg px-4 py-3 border border-cosmic-blue/30"
          >
            <p className="text-creamy-white font-lora text-sm leading-relaxed">
              {phrase}
            </p>
            <div className="mt-2 text-cosmic-blue text-xs font-montserrat uppercase tracking-wide">
              Live Transmission
            </div>
          </div>
        ))}
      </div>
      
      <div className="mt-4 text-center">
        <div className="inline-flex items-center text-deep-gold font-montserrat text-sm uppercase tracking-wide">
          <div className="w-2 h-2 bg-deep-gold rounded-full mr-2 animate-pulse"></div>
          Live Feed Active
        </div>
      </div>
    </div>
  );
}
