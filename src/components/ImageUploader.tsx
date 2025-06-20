'use client'

import React, { useState } from 'react'
import { uploadImage } from '@/lib/uploadImage'
import { Button } from '@/components/ui/button'

interface ImageUploaderProps {
  onUploadComplete?: (imagePath: string) => void
  folder?: string
  buttonText?: string
  allowedTypes?: string
  maxSizeMB?: number
}

const ImageUploader: React.FC<ImageUploaderProps> = ({
  onUploadComplete,
  folder = 'uploads',
  buttonText = 'Upload Image',
  allowedTypes = 'image/jpeg, image/jpg, image/png, image/webp',
  maxSizeMB = 5
}) => {
  const [isUploading, setIsUploading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [preview, setPreview] = useState<string | null>(null)
  const [uploadedPath, setUploadedPath] = useState<string | null>(null)
  const maxSizeBytes = maxSizeMB * 1024 * 1024

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    setError(null)
    
    if (!file) return
    
    // Client-side validations
    if (!file.type.startsWith('image/')) {
      setError('Selected file is not an image')
      return
    }
    
    if (file.size > maxSizeBytes) {
      setError(`File size exceeds ${maxSizeMB}MB limit`)
      return
    }
    
    // Generate preview
    const reader = new FileReader()
    reader.onload = (event) => {
      setPreview(event.target?.result as string)
    }
    reader.readAsDataURL(file)
    
    // Upload the file
    try {
      setIsUploading(true)
      const imagePath = await uploadImage(file, folder)
      setUploadedPath(imagePath)
      onUploadComplete?.(imagePath)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to upload image')
    } finally {
      setIsUploading(false)
    }
  }

  return (
    <div className="w-full max-w-md">
      <div className="mb-4 flex flex-col items-center">
        {/* Preview Area */}
        {preview && (
          <div className="relative mb-4 w-full max-h-64 overflow-hidden rounded border">
            <img 
              src={preview} 
              alt="Preview" 
              className="w-full h-auto object-contain"
            />
          </div>
        )}
        
        {/* Upload Status */}
        {uploadedPath && (
          <div className="w-full mb-4 p-2 bg-green-50 text-green-700 border border-green-200 rounded text-sm">
            Image uploaded successfully! Path: {uploadedPath}
          </div>
        )}
        
        {/* Error Message */}
        {error && (
          <div className="w-full mb-4 p-2 bg-red-50 text-red-700 border border-red-200 rounded text-sm">
            {error}
          </div>
        )}
        
        {/* File Input */}
        <div className="relative w-full">
          <input
            type="file"
            id="file-upload"
            className="absolute inset-0 w-full h-full opacity-0 z-10 cursor-pointer"
            onChange={handleFileChange}
            accept={allowedTypes}
            disabled={isUploading}
          />
          <Button 
            className="w-full relative" 
            disabled={isUploading}
          >
            {isUploading ? 'Uploading...' : buttonText}
          </Button>
        </div>
        
        <p className="mt-2 text-xs text-gray-500">
          Max size: {maxSizeMB}MB. Supported formats: JPEG, PNG, WebP
        </p>
      </div>
    </div>
  )
}

export default ImageUploader 