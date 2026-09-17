import type { RecommendationProfile } from './types.ts'

export const CATEGORY_DEFAULTS: Record<string, Partial<RecommendationProfile>> = {
  'micros-dynamiques': { role: 'microphone', subtype: 'dynamic' },
  'micros-condensateurs': { role: 'microphone', subtype: 'condenser' },
  'micros-usb': { role: 'microphone', connections: ['USB'] },
  'micros-shotgun': { role: 'microphone', subtype: 'shotgun' },
  'cartes-son': { role: 'interface' },
  'casques-studio': { role: 'headphones', connections: ['jack'] },
  enceintes: { role: 'monitors', connections: ['XLR', 'TRS'] },
  'hybrides-mirrorless': { role: 'camera', connections: ['HDMI'] },
  'webcams-pro': { role: 'camera', subtype: 'webcam', connections: ['USB'] },
  'action-cams': { role: 'camera', connections: ['USB'] },
  keylight: { role: 'lighting', subtype: 'keylight' },
  softbox: { role: 'lighting', subtype: 'softbox' },
  'rgb-ambiance': { role: 'lighting', subtype: 'ambient' },
  'traitement-acoustique': { role: 'treatment', subtype: 'absorption', roomFit: ['untreated', 'treated'] },
  'cable-xlr': { role: 'cable', subtype: 'xlr', connections: ['XLR'] },
  'cable-management': { role: 'cable' },
  'bras-articules': { role: 'stand', subtype: 'boom_arm' },
}
