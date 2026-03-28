import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

const dataFilePath = path.join(process.cwd(), 'data', 'apps.json');

function getApps() {
  try {
    const data = fs.readFileSync(dataFilePath, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    return [];
  }
}

function saveApps(apps) {
  try {
    fs.writeFileSync(dataFilePath, JSON.stringify(apps, null, 2), 'utf8');
    return true;
  } catch (error) {
    console.error('Error saving apps:', error);
    return false;
  }
}

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const slug = searchParams.get('slug');
  
  let apps = getApps();
  
  // Filter by slug if provided
  if (slug) {
    apps = apps.filter(app => app.slug === slug);
  }
  
  return NextResponse.json(apps);
}

export async function POST(request) {
  try {
    const newApp = await request.json();
    const apps = getApps();
    
    // Add new app to the beginning
    apps.unshift(newApp);
    
    const success = saveApps(apps);
    
    if (success) {
      return NextResponse.json({ success: true, app: newApp });
    } else {
      return NextResponse.json({ success: false, error: 'Failed to save app' }, { status: 500 });
    }
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function PUT(request) {
  try {
    const updatedApp = await request.json();
    let apps = getApps();
    
    // Find and update the app
    const index = apps.findIndex(app => app.id === updatedApp.id);
    if (index === -1) {
      return NextResponse.json({ success: false, error: 'App not found' }, { status: 404 });
    }
    
    apps[index] = { ...apps[index], ...updatedApp };
    
    const success = saveApps(apps);
    
    if (success) {
      return NextResponse.json({ success: true, app: apps[index] });
    } else {
      return NextResponse.json({ success: false, error: 'Failed to update app' }, { status: 500 });
    }
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function DELETE(request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    
    if (!id) {
      return NextResponse.json({ success: false, error: 'App ID required' }, { status: 400 });
    }
    
    let apps = getApps();
    apps = apps.filter(app => app.id !== parseInt(id));
    
    const success = saveApps(apps);
    
    if (success) {
      return NextResponse.json({ success: true });
    } else {
      return NextResponse.json({ success: false, error: 'Failed to delete app' }, { status: 500 });
    }
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}