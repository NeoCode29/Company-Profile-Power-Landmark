import { NextRequest, NextResponse } from 'next/server';
import { saveImageToPublic, ImageUploadError } from '@/services/imageUpload';
import { auth } from '@/auth';

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

    // Get the form data
    const formData = await request.formData();
    const file = formData.get('file') as File | null;
    const folder = formData.get('folder') as string || 'uploads';

    // Check if the file exists
    if (!file) {
      return NextResponse.json(
        { error: 'No file provided' },
        { status: 400 }
      );
    }

    // Additional security checks
    const allowedFolders = ['products', 'services', 'uploads'];
    if (!allowedFolders.includes(folder)) {
      return NextResponse.json(
        { error: 'Invalid folder name' },
        { status: 400 }
      );
    }

    // Validate file type more strictly
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json(
        { error: 'Invalid file type. Only JPEG, PNG, and WebP are allowed.' },
        { status: 400 }
      );
    }

    // Check file size (5MB limit)
    const maxSize = 5 * 1024 * 1024; // 5MB
    if (file.size > maxSize) {
      return NextResponse.json(
        { error: 'File too large. Maximum size is 5MB.' },
        { status: 400 }
      );
    }

    // Validate file signature (magic bytes) for additional security
    const buffer = Buffer.from(await file.arrayBuffer());
    const isValidImage = validateImageSignature(buffer, file.type);
    
    if (!isValidImage) {
      return NextResponse.json(
        { error: 'Invalid file format or corrupted image.' },
        { status: 400 }
      );
    }

    // Save the image and get the public path
    const imagePath = await saveImageToPublic(file, folder);

    // Return success response
    return NextResponse.json({ 
      success: true, 
      path: imagePath,
      message: 'Image uploaded successfully'
    });
  } catch (error) {
    console.error('Error uploading image:', error);

    // Handle known errors
    if (error instanceof ImageUploadError) {
      return NextResponse.json(
        { error: error.message },
        { status: 400 }
      );
    }

    // Handle unknown errors
    return NextResponse.json(
      { error: 'Failed to upload image' },
      { status: 500 }
    );
  }
}

/**
 * Validate image file signature (magic bytes) to ensure it's a real image
 * @param buffer File buffer
 * @param mimeType Expected MIME type
 * @returns boolean indicating if the file is valid
 */
function validateImageSignature(buffer: Buffer, mimeType: string): boolean {
  if (buffer.length < 4) return false;

  const signature = buffer.subarray(0, 4);
  
  switch (mimeType) {
    case 'image/jpeg':
    case 'image/jpg':
      // JPEG signature: FF D8 FF
      return signature[0] === 0xFF && signature[1] === 0xD8 && signature[2] === 0xFF;
    
    case 'image/png':
      // PNG signature: 89 50 4E 47
      return signature[0] === 0x89 && signature[1] === 0x50 && 
             signature[2] === 0x4E && signature[3] === 0x47;
    
    case 'image/webp':
      // WebP signature: check for "RIFF" and "WEBP"
      if (buffer.length < 12) return false;
      const riff = buffer.subarray(0, 4);
      const webp = buffer.subarray(8, 12);
      return riff.toString() === 'RIFF' && webp.toString() === 'WEBP';
    
    default:
      return false;
  }
}

// Set the maximum content length to slightly over 5MB
export const config = {
  api: {
    bodyParser: {
      sizeLimit: '6mb',
    },
  },
}; 