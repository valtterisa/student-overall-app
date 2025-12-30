import { colorData } from '@/data/mockData';

export function normalizeColorKey(colorInput: string | undefined): string | null {
  if (!colorInput) return null;
  
  const normalized = colorInput.toLowerCase().trim();
  
  for (const [key, data] of Object.entries(colorData.colors)) {
    if (data.main.some(c => c.toLowerCase() === normalized)) {
      return key;
    }
    if (data.shades.some(c => c.toLowerCase() === normalized)) {
      return key;
    }
  }
  
  const synonyms: Record<string, string> = {
    'white': 'white',
    'valkoinen': 'white',
    'valkoiset': 'white',
    'valkoisia': 'white',
    'valkoista': 'white',
    'black': 'black',
    'musta': 'black',
    'mustat': 'black',
    'punainen': 'punainen',
    'punaiset': 'punainen',
    'red': 'punainen',
    'sininen': 'sininen',
    'siniset': 'sininen',
    'blue': 'sininen',
    'vihreä': 'vihreä',
    'vihreät': 'vihreä',
    'green': 'vihreä',
    'keltainen': 'keltainen',
    'keltaiset': 'keltainen',
    'yellow': 'keltainen',
    'oranssi': 'oranssi',
    'oranssit': 'oranssi',
    'orange': 'oranssi',
    'violetti': 'violetti',
    'violetit': 'violetti',
    'violet': 'violetti',
    'purple': 'violetti',
    'pinkki': 'pinkki',
    'pinkit': 'pinkki',
    'pink': 'pinkki',
  };
  
  return synonyms[normalized] || null;
}

