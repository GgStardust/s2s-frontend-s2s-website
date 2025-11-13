import { PublicCodex, Orb, Module } from './types';

let cachedCodex: PublicCodex | null = null;

export function getPublicCodex(): PublicCodex {
  if (!cachedCodex) {
    try {
      const codexData = require('../data/public_codex.json');
      cachedCodex = codexData;
    } catch (error) {
      console.error('Error loading public codex:', error);
      throw new Error('Failed to load public codex data');
    }
  }
  return cachedCodex!;
}

export function getAllOrbs(): Orb[] {
  if (!cachedCodex) {
    try {
      const codexData = require('../data/public_codex.json');
      cachedCodex = codexData;
    } catch (error) {
      console.error('Error loading public codex:', error);
      return [];
    }
  }
  return cachedCodex!.orbs;
}

export function getOrbBySlug(slug: string): Orb | null {
  const orbs = getAllOrbs();
  return orbs.find(orb => orb.slug === slug) || null;
}

export function getAllModules(): Module[] {
  if (!cachedCodex) {
    try {
      const codexData = require('../data/public_codex.json');
      cachedCodex = codexData;
    } catch (error) {
      console.error('Error loading public codex:', error);
      return [];
    }
  }
  return cachedCodex!.modules;
}

export function getModuleBySlug(slug: string): Module | null {
  const modules = getAllModules();
  return modules.find(module => module.slug === slug) || null;
}

export function getAllScrollstream(): string[] {
  if (!cachedCodex) {
    try {
      const codexData = require('../data/public_codex.json');
      cachedCodex = codexData;
    } catch (error) {
      console.error('Error loading public codex:', error);
      return [];
    }
  }
  return cachedCodex!.scrollstream;
}
