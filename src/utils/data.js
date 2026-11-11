/**
 * Cosmic data constants and celestial presets for Galactic Gateway
 */

export const CELESTIAL_TARGETS = [
  { name: 'Mars', query: 'mars', type: 'Planet', description: 'The Red Planet, home to rovers and ancient river valleys' },
  { name: 'Saturn', query: 'saturn', type: 'Gas Giant', description: 'Famous for its complex and extensive ring system' },
  { name: 'Jupiter', query: 'jupiter', type: 'Gas Giant', description: 'Largest planet in our solar system with the Great Red Spot' },
  { name: 'Earth', query: 'earth', type: 'Terrestrial', description: 'Our home planet, viewed from ISS, Landsat, and MODIS' },
  { name: 'Moon', query: 'moon', type: 'Natural Satellite', description: 'Earth\'s moon, craters, mare, and Apollo landing sites' },
  { name: 'Sun', query: 'sun', type: 'Star', description: 'Our solar heart, coronal mass ejections, and solar flares' },
  { name: 'Nebula', query: 'nebula', type: 'Deep Space', description: 'Stellar nurseries and remnant clouds captured by Hubble & JWST' },
  { name: 'Galaxy', query: 'galaxy', type: 'Deep Space', description: 'Spiral, elliptical, and deep field galaxy clusters' },
];

export const POPULAR_KEYWORDS = [
  'mars',
  'saturn',
  'jupiter',
  'earth',
  'moon',
  'sun',
  'nebula',
  'galaxy',
  'black hole',
  'asteroid',
];

export function formatDate(isoString) {
  if (!isoString) return 'Date unknown';
  try {
    const d = new Date(isoString);
    if (isNaN(d.getTime())) return isoString;
    return d.toLocaleDateString(undefined, {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  } catch {
    return isoString;
  }
}

const data = {
  CELESTIAL_TARGETS,
  POPULAR_KEYWORDS,
  formatDate,
};

export default data;
