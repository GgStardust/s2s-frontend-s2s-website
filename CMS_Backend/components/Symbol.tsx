import * as React from "react";

type SymbolName =
  | "orb"            // Consciousness Orbs
  | "field"          // Living Field Architecture
  | "resonance"      // Resonance-Based Guidance
  | "scrollstream"   // Scrollstream
  | "audio"          // Audio/Sound
  | "play"           // Play button
  | "pause"          // Pause button
  | "constellation"; // Constellation/Field Map

export interface SymbolProps extends React.SVGProps<SVGSVGElement> {
  name: SymbolName;
  size?: number | string;
  strokeWidth?: number;
  title?: string;
}

const paths: Record<SymbolName, React.ReactNode> = {
  orb: (
    <circle cx="32" cy="32" r="18" fill="none" stroke="currentColor" />
  ),
  field: (
    <>
      <rect x="16" y="16" width="32" height="32" rx="8" fill="none" stroke="currentColor" />
      <circle cx="32" cy="32" r="8" fill="currentColor" stroke="none" />
    </>
  ),
  resonance: (
    <>
      <circle cx="32" cy="32" r="20" fill="none" stroke="currentColor" />
      <path d="M20 32 Q32 20 44 32 Q32 44 20 32" fill="none" stroke="currentColor" />
    </>
  ),
  scrollstream: (
    <>
      <path d="M12 32 Q24 20 36 32 Q48 44 60 32" fill="none" stroke="currentColor" />
      <circle cx="24" cy="28" r="2" fill="currentColor" stroke="none" />
      <circle cx="40" cy="36" r="2" fill="currentColor" stroke="none" />
    </>
  ),
  audio: (
    <>
      <path d="M20 24 L20 40 L28 40 L36 48 L36 16 L28 24 Z" fill="currentColor" stroke="none" />
      <path d="M44 28 Q48 32 44 36" fill="none" stroke="currentColor" strokeWidth="2" />
      <path d="M48 24 Q54 30 48 36" fill="none" stroke="currentColor" strokeWidth="2" />
    </>
  ),
  play: (
    <polygon points="20 16 20 48 44 32" fill="currentColor" stroke="none" />
  ),
  pause: (
    <>
      <rect x="20" y="16" width="8" height="32" fill="currentColor" stroke="none" />
      <rect x="36" y="16" width="8" height="32" fill="currentColor" stroke="none" />
    </>
  ),
  constellation: (
    <>
      <circle cx="16" cy="42" r="2" fill="currentColor" stroke="none" />
      <circle cx="28" cy="22" r="2" fill="currentColor" stroke="none" />
      <circle cx="44" cy="30" r="2" fill="currentColor" stroke="none" />
      <circle cx="52" cy="46" r="2" fill="currentColor" stroke="none" />
      <path d="M16 42 L28 22 L44 30 L52 46" fill="none" stroke="currentColor" />
    </>
  ),
};

export function Symbol({
  name,
  size = 24,
  strokeWidth = 2,
  title,
  className,
  ...rest
}: SymbolProps) {
  return (
    <svg
      viewBox="0 0 64 64"
      width={size}
      height={size}
      role="img"
      aria-label={title || name}
      className={className}
      strokeWidth={strokeWidth}
      xmlns="http://www.w3.org/2000/svg"
      {...rest}
    >
      {title ? <title>{title}</title> : null}
      {paths[name]}
    </svg>
  );
}

export default Symbol;
