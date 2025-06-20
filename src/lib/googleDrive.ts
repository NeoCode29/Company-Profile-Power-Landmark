import { google } from 'googleapis';
import { Readable } from 'stream';

// Initialize Google Drive API with service account
const auth = new google.auth.GoogleAuth({
  credentials: JSON.parse(process.env.GOOGLE_SERVICE_ACCOUNT_KEY || ''),
  scopes: ['https://www.googleapis.com/auth/drive.file']
});

const drive = google.drive({ version: 'v3', auth });

export async function uploadToGoogleDrive(file: Blob, filename: string): Promise<string> {
  try {
    if (!process.env.GOOGLE_DRIVE_FOLDER_ID) {
      throw new Error('Google Drive folder ID is not configured');
    }

    // Convert File/Blob to Buffer
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    const mimeType = file.type || 'application/octet-stream';

    // Create file metadata
    const fileMetadata = {
      name: filename,
      parents: [process.env.GOOGLE_DRIVE_FOLDER_ID]
    };

    // Create media
    const media = {
      mimeType: mimeType,
      body: Readable.from(buffer)
    };

    // Upload file to Google Drive
    const response = await drive.files.create({
      requestBody: fileMetadata,
      media: media,
      fields: 'id'
    });

    if (!response.data.id) {
      throw new Error('Failed to get file ID from Google Drive');
    }

    // Make the file publicly accessible
    await drive.permissions.create({
      fileId: response.data.id,
      requestBody: {
        role: 'reader',
        type: 'anyone'
      }
    });

    // Get the direct download link that works with next/image
    const fileUrl = `https://lh3.googleusercontent.com/d/${response.data.id}`;
    return fileUrl;
  } catch (error) {
    console.error('Error uploading to Google Drive:', error);
    throw new Error('Failed to upload image to Google Drive');
  }
}

export async function deleteFromGoogleDrive(fileUrl: string): Promise<void> {
  try {
    // Extract file ID from URL
    let fileId: string | null = null;

    // Handle both URL formats
    if (fileUrl.includes('lh3.googleusercontent.com/d/')) {
      fileId = fileUrl.split('lh3.googleusercontent.com/d/')[1];
    } else if (fileUrl.includes('drive.google.com/uc?export=view&id=')) {
      fileId = fileUrl.split('id=')[1];
    }

    if (!fileId) {
      throw new Error('Could not extract file ID from URL');
    }

    // Delete file from Google Drive
    await drive.files.delete({
      fileId: fileId
    });
  } catch (error) {
    console.error('Error deleting file from Google Drive:', error);
    // Don't throw error here as we want to continue with product deletion even if file deletion fails
  }
} 