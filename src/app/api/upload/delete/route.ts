import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import fs from 'fs';
import path from 'path';

export async function POST(request: NextRequest) {
  try {
    // Check authentication
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json(
        { error: 'Unauthorized. Please login first.' },
        { status: 401 }
      );
    }

    // Parse request body
    const { imagePath } = await request.json();
    
    if (!imagePath || typeof imagePath !== 'string') {
      return NextResponse.json(
        { error: 'Invalid image path' },
        { status: 400 }
      );
    }

    // Enhanced security: validate that path is for allowed directories
    const allowedPrefixes = ['/products/', '/services/', '/uploads/'];
    const isAllowedPath = allowedPrefixes.some(prefix => imagePath.startsWith(prefix));
    
    if (!isAllowedPath) {
      return NextResponse.json(
        { error: 'Access denied. Invalid path.' },
        { status: 403 }
      );
    }

    // Sanitize path and prevent directory traversal
    const sanitizedPath = imagePath.replace(/^\//, '').replace(/\.\.\//g, '');
    const fullPath = path.join(process.cwd(), 'public', sanitizedPath);

    // Additional security: ensure the resolved path is still within public directory
    const publicDir = path.join(process.cwd(), 'public');
    const resolvedPath = path.resolve(fullPath);
    const resolvedPublicDir = path.resolve(publicDir);
    
    if (!resolvedPath.startsWith(resolvedPublicDir)) {
      return NextResponse.json(
        { error: 'Access denied. Invalid path.' },
        { status: 403 }
      );
    }

    // Check if file exists
    if (!fs.existsSync(fullPath)) {
      return NextResponse.json(
        { message: 'File not found, may have been already deleted' },
        { status: 200 }
      );
    }

    // Delete file
    fs.unlinkSync(fullPath);

    return NextResponse.json(
      { message: 'File deleted successfully' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error deleting file:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 