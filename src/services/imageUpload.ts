import fs from 'fs';
import path from 'path';
import { randomUUID } from 'crypto';

// Allowed MIME types for images
const ALLOWED_MIME_TYPES = [
  'image/jpeg',
  'image/jpg',
  'image/png',
  'image/webp'
];

// Maximum file size (5MB)
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

// Error types
export class ImageUploadError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'ImageUploadError';
  }
}

export class InvalidImageTypeError extends ImageUploadError {
  constructor() {
    super('Invalid image type. Only jpg, jpeg, png, and webp are allowed.');
  }
}

export class FileSizeTooLargeError extends ImageUploadError {
  constructor() {
    super('File size too large. Maximum size is 5MB.');
  }
}

export class InvalidFolderNameError extends ImageUploadError {
  constructor() {
    super('Invalid folder name.');
  }
}

/**
 * Validates that the folder name is safe and doesn't contain path traversal attempts
 * @param folder Folder name to validate
 * @returns Sanitized folder name
 * @throws InvalidFolderNameError if folder name is invalid
 */
function validateAndSanitizeFolderName(folder: string): string {
  // Remove any leading/trailing slashes and normalize
  let sanitized = folder.trim().replace(/^\/+|\/+$/g, '');
  
  // Check for directory traversal attempts
  if (sanitized.includes('..') || sanitized.includes('~') || !sanitized.match(/^[a-zA-Z0-9_\/-]+$/)) {
    throw new InvalidFolderNameError();
  }
  
  return sanitized;
}

/**
 * Generate a unique filename based on original filename
 * @param originalFilename Original filename with extension
 * @returns Unique filename
 */
function generateUniqueFilename(originalFilename: string): string {
  const extension = path.extname(originalFilename).toLowerCase();
  const timestamp = Date.now();
  const uniqueId = randomUUID().slice(0, 8);
  
  return `${timestamp}-${uniqueId}${extension}`;
}

/**
 * Saves an image file to the public folder
 * @param file File or Blob to save
 * @param folder Subfolder within public directory
 * @returns Public path to the saved image
 */
export async function saveImageToPublic(
  file: File | Blob,
  folder: string = 'uploads'
): Promise<string> {
  // Check file type
  if (!file.type || !ALLOWED_MIME_TYPES.includes(file.type)) {
    throw new InvalidImageTypeError();
  }
  
  // Check file size
  if (file.size > MAX_FILE_SIZE) {
    throw new FileSizeTooLargeError();
  }
  
  // Validate and sanitize folder name
  const sanitizedFolder = validateAndSanitizeFolderName(folder);
  
  // Generate unique filename
  const fileName = generateUniqueFilename(file instanceof File ? file.name : 'image.jpg');
  
  // Create folder path if not exists
  const publicDir = path.join(process.cwd(), 'public');
  const folderPath = path.join(publicDir, sanitizedFolder);
  
  if (!fs.existsSync(folderPath)) {
    fs.mkdirSync(folderPath, { recursive: true });
  }
  
  // Full path to save the file
  const filePath = path.join(folderPath, fileName);
  
  // Convert blob/file to buffer and save
  const buffer = Buffer.from(await file.arrayBuffer());
  fs.writeFileSync(filePath, buffer);
  
  // Return the public path (relative to /public)
  return `/${sanitizedFolder}/${fileName}`;
}

/**
 * Save a base64 encoded image to the public folder
 * @param base64Data Base64 encoded image data (with or without MIME prefix)
 * @param folder Subfolder within public directory
 * @returns Public path to the saved image
 */
export async function saveBase64ImageToPublic(
  base64Data: string, 
  folder: string = 'uploads'
): Promise<string> {
  // Handle base64 data with or without MIME type prefix
  let base64Image = base64Data;
  let mimeType = '';
  
  // Extract MIME type if present
  if (base64Data.includes(';base64,')) {
    const [prefix, data] = base64Data.split(';base64,');
    mimeType = prefix.replace('data:', '');
    base64Image = data;
  }
  
  // Check MIME type
  if (mimeType && !ALLOWED_MIME_TYPES.includes(mimeType)) {
    throw new InvalidImageTypeError();
  }
  
  // Convert base64 to Blob
  const byteString = atob(base64Image);
  const ab = new ArrayBuffer(byteString.length);
  const ia = new Uint8Array(ab);
  
  for (let i = 0; i < byteString.length; i++) {
    ia[i] = byteString.charCodeAt(i);
  }
  
  const blob = new Blob([ab], { type: mimeType || 'image/jpeg' });
  
  // Check file size
  if (blob.size > MAX_FILE_SIZE) {
    throw new FileSizeTooLargeError();
  }
  
  // Save using the main function
  return saveImageToPublic(blob, folder);
}

export default {
  saveImageToPublic,
  saveBase64ImageToPublic
}; 