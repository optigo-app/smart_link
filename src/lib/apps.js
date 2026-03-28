import fs from 'fs';
import path from 'path';

const dataFilePath = path.join(process.cwd(), 'data', 'apps.json');

// Read all apps from JSON file
export function getApps() {
  try {
    const data = fs.readFileSync(dataFilePath, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    return [];
  }
}

// Write apps to JSON file
export function saveApps(apps) {
  try {
    fs.writeFileSync(dataFilePath, JSON.stringify(apps, null, 2), 'utf8');
    return true;
  } catch (error) {
    console.error('Error saving apps:', error);
    return false;
  }
}

// Get a single app by slug
export function getAppBySlug(slug) {
  const apps = getApps();
  return apps.find(app => app.slug === slug);
}

// Add a new app
export function addApp(app) {
  const apps = getApps();
  apps.unshift(app);
  return saveApps(apps);
}

// Generate a unique slug from app name
export function generateSlug(name) {
  return name
    .toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/[^a-z0-9-]/g, '')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');
}