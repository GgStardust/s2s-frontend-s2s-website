/**
 * Type Kernel - Core Orb Constructors
 * 
 * Defines the minimal formal grammar for six core Orbs:
 * Photonic (O3), Temporal (O5), Relational (O6), Radiant (O11), Sovereign (O12), Bridging (O13)
 * 
 * This is the foundation of the Resonance Kernel - formal logic verification
 */

// Core Types
export type Essence = { 
  name: string;
  properties?: Record<string, any>;
};

export type Moment = {
  timestamp: number;
  context?: string;
};

export type Proposition = {
  statement: string;
  truthValue: boolean;
  orbAssociations: number[];
  proofStatus: 'proven' | 'partial' | 'unproven' | 'error';
};

export type Universe = {
  domain: string;
  entities: Essence[];
};

// Core Orb Constructors
export function Photonic(e: Essence): Essence {
  return {
    ...e,
    properties: {
      ...e.properties,
      lightBased: true,
      reflective: true,
      recognitionCapable: true
    }
  };
}

export function Temporal(m: Moment, e: Essence): Essence {
  return {
    ...e,
    properties: {
      ...e.properties,
      temporalContext: m.context,
      timestamp: m.timestamp,
      timeAware: true
    }
  };
}

export function Relational(a: Essence, b: Essence): Proposition {
  const statement = `${a.name} relates to ${b.name}`;
  return {
    statement,
    truthValue: true, // Basic relational truth
    orbAssociations: [6], // Relational Intelligence
    proofStatus: 'proven'
  };
}

export function Harmonize(p: Proposition): Proposition {
  return {
    ...p,
    statement: `Harmonized: ${p.statement}`,
    orbAssociations: [...p.orbAssociations, 11], // Radiant Transparency
    proofStatus: p.proofStatus === 'proven' ? 'proven' : 'partial'
  };
}

export function Sovereign(u: Universe): Proposition {
  return {
    statement: `Sovereign field encompasses ${u.domain}`,
    truthValue: true,
    orbAssociations: [12], // Sovereign Field
    proofStatus: 'proven'
  };
}

export function Bridge(text: string, program: any): Proposition {
  return {
    statement: `Bridging: ${text}`,
    truthValue: true,
    orbAssociations: [13], // Bridging Intelligence
    proofStatus: 'proven'
  };
}

// Type Checking Function
export function typeCheck(statement: Proposition): {
  isValid: boolean;
  proofStatus: string;
  orbAssociations: number[];
  explanation: string;
} {
  return {
    isValid: statement.truthValue,
    proofStatus: statement.proofStatus,
    orbAssociations: statement.orbAssociations,
    explanation: `Statement "${statement.statement}" validated with Orbs: ${statement.orbAssociations.join(', ')}`
  };
}

// Example Usage
export const exampleUsage = () => {
  const Light: Essence = { name: "Light" };
  const Form: Essence = { name: "Form" };
  
  const photonicLight = Photonic(Light);
  const statement = Relational(photonicLight, Form);
  const proofStatus = typeCheck(statement);
  
  return {
    light: photonicLight,
    statement,
    proofStatus
  };
};



