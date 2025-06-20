/**
 * Client-side utility for uploading images to the server
 */

/**
 * Upload an image file to the server
 * @param file Image file to upload
 * @param folder Target subfolder in the public directory (defaults to 'uploads')
 * @returns The public path to the uploaded image
 * @throws Error if upload fails
 */
export async function uploadImage(file: File, folder: string) {
  try {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', 'products'); // Set your Cloudinary upload preset

    const response = await fetch(
      `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload`,
      {
        method: 'POST',
        body: formData,
      }
    );

    const data = await response.json();
    return data.secure_url;
  } catch (error) {
    console.error('Error uploading image:', error);
    throw new Error('Failed to upload image');
  }
}

/**
 * Upload a base64 image directly from client-side
 * This converts the base64 to a File object and uploads it
 * @param base64Image Base64 encoded image (with MIME type prefix)
 * @param filename Optional filename
 * @param folder Target subfolder
 * @returns Public path to the uploaded image
 */
export async function uploadBase64Image(
  base64Image: string,
  filename: string = 'image.jpg',
  folder: string = 'uploads'
): Promise<string> {
  try {
    // Extract MIME type and decode base64
    const matches = base64Image.match(/^data:([A-Za-z-+/]+);base64,(.+)$/);
    
    if (!matches || matches.length !== 3) {
      throw new Error('Invalid base64 image format');
    }
    
    const mimeType = matches[1];
    const base64Data = matches[2];
    
    // Convert base64 to Blob
    const byteCharacters = atob(base64Data);
    const byteArrays = [];
    
    for (let offset = 0; offset < byteCharacters.length; offset += 512) {
      const slice = byteCharacters.slice(offset, offset + 512);
      
      const byteNumbers = new Array(slice.length);
      for (let i = 0; i < slice.length; i++) {
        byteNumbers[i] = slice.charCodeAt(i);
      }
      
      const byteArray = new Uint8Array(byteNumbers);
      byteArrays.push(byteArray);
    }
    
    const blob = new Blob(byteArrays, { type: mimeType });
    
    // Convert Blob to File
    const file = new File([blob], filename, { type: mimeType });
    
    // Upload the file
    return uploadImage(file, folder);
  } catch (error) {
    console.error('Error uploading base64 image:', error);
    throw error;
  }
}

export default {
  uploadImage,
  uploadBase64Image
}; 