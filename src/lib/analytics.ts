import fs from 'fs';
import path from 'path';

const DATA_FILE = path.join(process.cwd(), 'data', 'analytics.json');

// Ensure data directory exists
if (!fs.existsSync(path.join(process.cwd(), 'data'))) {
  fs.mkdirSync(path.join(process.cwd(), 'data'), { recursive: true });
}

export type AnalyticsEvent = {
  asset_slug: string;
  event_type: 'view' | 'download';
  country: string;
  created_at: string;
};

let localAnalyticsStore: AnalyticsEvent[] = [];

try {
  if (fs.existsSync(DATA_FILE)) {
    localAnalyticsStore = JSON.parse(fs.readFileSync(DATA_FILE, 'utf-8'));
  }
} catch (e) {
  localAnalyticsStore = [];
}

export function saveLocalStore() {
  try {
    fs.writeFileSync(DATA_FILE, JSON.stringify(localAnalyticsStore, null, 2));
  } catch (e) {
    console.error('Failed to save analytics:', e);
  }
}

export function recordEventLocal(asset_slug: string, event_type: 'view' | 'download', country: string) {
  localAnalyticsStore.push({
    asset_slug,
    event_type,
    country,
    created_at: new Date().toISOString(),
  });
  saveLocalStore();
}

export function getEventsLocal(asset_slug: string) {
  return localAnalyticsStore.filter(e => e.asset_slug === asset_slug);
}
