import { NextRequest, NextResponse } from 'next/server';
import { saveImageToPublic, ImageUploadError } from '@/services/imageUpload';

export async function POST(request: NextRequest) {
  try {
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

    // Save the image and get the public path
    const imagePath = await saveImageToPublic(file, folder);

    // Return success response
    return NextResponse.json({ success: true, path: imagePath });
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

// Set the maximum content length to slightly over 5MB
export const config = {
  api: {
    bodyParser: {
      sizeLimit: '6mb',
    },
  },
}; 