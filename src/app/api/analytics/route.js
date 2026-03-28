import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

function getAnalyticsFilePath() {
  return path.join(process.cwd(), 'data', 'analytics.json');
}

function readAnalytics() {
  try {
    const filePath = getAnalyticsFilePath();
    if (fs.existsSync(filePath)) {
      const data = fs.readFileSync(filePath, 'utf8');
      return JSON.parse(data);
    }
  } catch (error) {
    console.error('Error reading analytics:', error);
  }
  return { analytics: [] };
}

function writeAnalytics(data) {
  try {
    const filePath = getAnalyticsFilePath();
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
  } catch (error) {
    console.error('Error writing analytics:', error);
  }
}

export async function POST(request) {
  try {
    const body = await request.json();
    const { appId, appSlug, appName, platform, country, userAgent, timestamp } = body;

    if (!appId || !appSlug) {
      return NextResponse.json(
        { success: false, error: 'App ID and slug required' },
        { status: 400 }
      );
    }

    const analyticsData = readAnalytics();
    
    // Determine device type from user agent
    let deviceType = 'unknown';
    const ua = (userAgent || '').toLowerCase();
    if (ua.includes('android')) {
      deviceType = 'android';
    } else if (ua.includes('iphone') || ua.includes('ipad') || ua.includes('ipod')) {
      deviceType = 'ios';
    } else if (/mobile|android|iphone|ipad|ipod/.test(ua)) {
      deviceType = 'mobile';
    } else {
      deviceType = 'desktop';
    }

    // Determine country from user agent or use default
    const countryCode = country || 'Unknown';

    const newClick = {
      id: Date.now().toString(),
      appId,
      appSlug,
      appName: appName || 'Unknown App',
      platform: platform || 'web',
      deviceType,
      country: countryCode,
      userAgent: userAgent || '',
      timestamp: timestamp || new Date().toISOString(),
      createdAt: new Date().toISOString()
    };

    analyticsData.analytics.push(newClick);
    writeAnalytics(analyticsData);

    return NextResponse.json({ 
      success: true, 
      clickId: newClick.id 
    });
  } catch (error) {
    console.error('Error tracking click:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const appId = searchParams.get('appId');
    const appSlug = searchParams.get('appSlug');
    const period = searchParams.get('period') || '7d'; // 7d, 30d, all

    const analyticsData = readAnalytics();
    let filteredAnalytics = analyticsData.analytics;

    // Filter by app
    if (appId) {
      filteredAnalytics = filteredAnalytics.filter(a => a.appId.toString() === appId.toString());
    } else if (appSlug) {
      filteredAnalytics = filteredAnalytics.filter(a => a.appSlug === appSlug);
    }

    // Filter by period
    if (period !== 'all') {
      const days = parseInt(period.replace('d', ''));
      const cutoffDate = new Date();
      cutoffDate.setDate(cutoffDate.getDate() - days);
      filteredAnalytics = filteredAnalytics.filter(a => new Date(a.timestamp) >= cutoffDate);
    }

    // Calculate stats
    const totalClicks = filteredAnalytics.length;
    const uniqueUsers = new Set(filteredAnalytics.map(a => a.userAgent)).size;
    const androidClicks = filteredAnalytics.filter(a => a.deviceType === 'android').length;
    const iosClicks = filteredAnalytics.filter(a => a.deviceType === 'ios').length;
    
    // Calculate conversion rate (clicks that resulted in actual store visit)
    const conversionRate = totalClicks > 0 ? ((androidClicks + iosClicks) / totalClicks * 100).toFixed(1) : 0;
    
    // Average session time (simulated for now)
    const avgSessionTime = '2m 34s';

    // Group by date for chart
    const clicksByDate = {};
    filteredAnalytics.forEach(click => {
      const date = new Date(click.timestamp).toISOString().split('T')[0];
      clicksByDate[date] = (clicksByDate[date] || 0) + 1;
    });

    // Recent activity (last 5 clicks)
    const recentActivity = filteredAnalytics
      .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
      .slice(0, 5)
      .map(click => ({
        time: getRelativeTime(new Date(click.timestamp)),
        action: `Scan from ${getDeviceName(click.deviceType)}`,
        location: click.country
      }));

    return NextResponse.json({
      success: true,
      stats: {
        totalClicks,
        uniqueUsers,
        androidClicks,
        iosClicks,
        conversionRate,
        avgSessionTime,
        clicksByDate,
        recentActivity
      }
    });
  } catch (error) {
    console.error('Error fetching analytics:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

function getRelativeTime(date) {
  const now = new Date();
  const diffMs = now - date;
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 1) return 'Just now';
  if (diffMins < 60) return `${diffMins} min ago`;
  if (diffHours < 24) return `${diffHours} hour ago`;
  if (diffDays < 7) return `${diffDays} day ago`;
  return date.toLocaleDateString();
}

function getDeviceName(deviceType) {
  const deviceNames = {
    'android': 'Android Device',
    'ios': 'iPhone/iPad',
    'mobile': 'Mobile Device',
    'desktop': 'Desktop',
    'unknown': 'Unknown Device'
  };
  return deviceNames[deviceType] || 'Unknown Device';
}