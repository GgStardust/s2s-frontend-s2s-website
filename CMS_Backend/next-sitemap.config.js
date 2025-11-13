/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl: process.env.SITE_URL || 'https://s2s-dashboard.vercel.app',
  generateRobotsTxt: true,
  generateIndexSitemap: false,
  exclude: ['/api/*'],
  additionalPaths: async (config) => [
    // Orb pages
    { loc: '/orbs/origin-intelligence', changefreq: 'weekly', priority: 0.8 },
    { loc: '/orbs/resonance-mechanics', changefreq: 'weekly', priority: 0.8 },
    { loc: '/orbs/photonic-intelligence', changefreq: 'weekly', priority: 0.8 },
    { loc: '/orbs/harmonic-architectures', changefreq: 'weekly', priority: 0.8 },
    { loc: '/orbs/temporal-sovereignty', changefreq: 'weekly', priority: 0.8 },
    { loc: '/orbs/starline-memory', changefreq: 'weekly', priority: 0.8 },
    { loc: '/orbs/alchemical-current', changefreq: 'weekly', priority: 0.8 },
    { loc: '/orbs/quantum-intuition', changefreq: 'weekly', priority: 0.8 },
    { loc: '/orbs/temporal-fluidity', changefreq: 'weekly', priority: 0.8 },
    { loc: '/orbs/ancestral-repatterning', changefreq: 'weekly', priority: 0.8 },
    { loc: '/orbs/radiant-transparency', changefreq: 'weekly', priority: 0.8 },
    { loc: '/orbs/sovereign-field', changefreq: 'weekly', priority: 0.8 },
    { loc: '/orbs/bridging-intelligence', changefreq: 'weekly', priority: 0.8 },
    // Module pages
    { loc: '/modules/orb-explorer', changefreq: 'weekly', priority: 0.7 },
    { loc: '/modules/scrollstream', changefreq: 'weekly', priority: 0.7 },
    { loc: '/modules/undercurrents', changefreq: 'weekly', priority: 0.7 },
  ],
};
