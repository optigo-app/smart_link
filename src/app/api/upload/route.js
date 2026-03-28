import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function POST(request) {
  try {
    const formData = await request.formData();
    const file = formData.get('file');
    const appName = formData.get('appName');
    const oldIcon = formData.get('oldIcon');

    if (!file || !appName) {
      return NextResponse.json(
        { success: false, error: 'File and app name required' },
        { status: 400 }
      );
    }

    // Delete old icon if exists
    if (oldIcon) {
      const oldIconPath = path.join(process.cwd(), 'public', oldIcon.replace(/^\//, ''));
      if (fs.existsSync(oldIconPath)) {
        try {
          fs.unlinkSync(oldIconPath);
        } catch (err) {
          console.error('Error deleting old icon:', err);
        }
      }
    }

    // Create directory if it doesn't exist
    const uploadDir = path.join(process.cwd(), 'public', 'appicons');
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }

    // Generate unique filename based on app name
    const fileName = appName.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '') + '-' + Date.now() + path.extname(file.name);
    const filePath = path.join(uploadDir, fileName);

    // Convert file to buffer and save
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    fs.writeFileSync(filePath, buffer);

    // Return the public URL path
    const iconPath = `/appicons/${fileName}`;

    return NextResponse.json({ 
      success: true, 
      iconPath 
    });
  } catch (error) {
    console.error('Upload error:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}