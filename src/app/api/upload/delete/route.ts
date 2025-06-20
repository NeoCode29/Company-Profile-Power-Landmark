import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function POST(request: NextRequest) {
  try {
    // Parse request body
    const { imagePath } = await request.json();
    
    if (!imagePath || typeof imagePath !== 'string') {
      return NextResponse.json(
        { error: 'Invalid image path' },
        { status: 400 }
      );
    }

    // Pastikan path dimulai dengan / dan tidak memiliki karakter ../ untuk menghindari directory traversal
    const sanitizedPath = imagePath.replace(/^\//, '').replace(/\.\.\//g, '');
    const fullPath = path.join(process.cwd(), 'public', sanitizedPath);

    // Cek apakah file ada
    if (!fs.existsSync(fullPath)) {
      return NextResponse.json(
        { message: 'File tidak ditemukan, mungkin sudah dihapus' },
        { status: 200 }
      );
    }

    // Hapus file
    fs.unlinkSync(fullPath);

    return NextResponse.json(
      { message: 'File berhasil dihapus' },
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