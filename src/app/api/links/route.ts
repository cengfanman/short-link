import { NextRequest, NextResponse } from 'next/server';
import { shortLinkService } from '@/lib/shortLinkService';

export async function POST(request: NextRequest) {
  try {
    // Parse request body
    const body = await request.json();
    
    // Create short link
    const result = await shortLinkService.createShortLink(body);
    
    return NextResponse.json(
      { shortUrl: result.shortUrl },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error creating short link:', error);
    
    if (error instanceof Error) {
      return NextResponse.json(
        { error: error.message },
        { status: 400 }
      );
    }
    
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// Handle unsupported methods
export async function GET() {
  return NextResponse.json(
    { error: 'Method not allowed' },
    { status: 405 }
  );
} 