import { NextRequest, NextResponse } from 'next/server';
import { shortLinkService } from '@/lib/shortLinkService';

export async function GET(
  request: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    const { slug } = params;
    
    // Get the original URL
    const originalUrl = await shortLinkService.getOriginalUrl(slug);
    
    if (!originalUrl) {
      return NextResponse.json(
        { error: 'Short link not found' },
        { status: 404 }
      );
    }
    
    // Return 301 permanent redirect
    return NextResponse.redirect(originalUrl, 301);
  } catch (error) {
    console.error('Error redirecting short link:', error);
    
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// Handle unsupported methods
export async function POST() {
  return NextResponse.json(
    { error: 'Method not allowed' },
    { status: 405 }
  );
} 