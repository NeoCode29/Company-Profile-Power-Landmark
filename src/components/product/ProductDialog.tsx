import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";
import Image from 'next/image';
import { ScrollArea } from "@/components/ui/scroll-area";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface ProductDialogProps {
  mode: 'create' | 'edit' | 'view';
  open: boolean;
  onOpenChange: (open: boolean) => void;
  product?: {
    id: string;
    name: string;
    price: number;
    stock: number;
    description: string;
    image: { id: string; url: string }[];
    category: string;
  };
  onSubmit?: (formData: FormData) => Promise<void>;
}

export function ProductDialog({
  mode,
  open,
  onOpenChange,
  product,
  onSubmit
}: ProductDialogProps) {
  const [selectedImage, setSelectedImage] = React.useState<string>('');
  const [previewImages, setPreviewImages] = React.useState<{ url: string; file?: File }[]>([]);
  const [category, setCategory] = React.useState<string>(product?.category || '');
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  React.useEffect(() => {
    if (product?.image && product.image.length > 0) {
      setSelectedImage(product.image[0].url);
      setPreviewImages(product.image.map(img => ({ url: img.url })));
    } else {
      setPreviewImages([]);
    }
    setCategory(product?.category || '');
  }, [product]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length + previewImages.length > 5) {
      alert('Maximum 5 images allowed');
      return;
    }

    const newPreviewImages = files.map(file => ({
      url: URL.createObjectURL(file),
      file
    }));

    setPreviewImages(prev => [...prev, ...newPreviewImages]);
    if (!selectedImage && newPreviewImages.length > 0) {
      setSelectedImage(newPreviewImages[0].url);
    }
  };

  const removeImage = (index: number) => {
    setPreviewImages(prev => {
      const newImages = [...prev];
      const removedImage = newImages.splice(index, 1)[0];
      
      // Revoke object URL if it was a preview
      if (removedImage.file) {
        URL.revokeObjectURL(removedImage.url);
      }
      
      // Update selected image if necessary
      if (selectedImage === removedImage.url) {
        setSelectedImage(newImages[0]?.url || '');
      }
      
      return newImages;
    });
  };

  const isViewMode = mode === 'view';
  const title = {
    create: 'Add New Product',
    edit: 'Edit Product',
    view: 'Product Details'
  }[mode];

  const handleSubmit = async (formData: FormData) => {
    // Add all files to form data
    const imageFiles = previewImages
      .filter(img => img.file)
      .map(img => img.file as File);
    
    formData.delete('images'); // Remove any existing images
    imageFiles.forEach(file => {
      formData.append('images', file);
    });

    // Add existing image URLs
    const existingUrls = previewImages
      .filter(img => !img.file)
      .map(img => img.url);
    formData.append('existingImages', JSON.stringify(existingUrls));

    // Add category from state
    formData.append('category', category);

    await onSubmit?.(formData);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh]">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>
        <ScrollArea className="h-[70vh] w-full pr-2">
        <form action={handleSubmit} className="space-y-6">
          <div className="space-y-4">
            {previewImages.length > 0 && (
              <>
                  <div className="relative w-full aspect-square max-h-[400px]">
                  <Image
                    src={selectedImage || previewImages[0].url}
                    alt="Selected product image"
                    fill
                      className="object-cover rounded-lg"
                  />
                </div>
                <div className="flex gap-2 overflow-x-auto py-2">
                  {previewImages.map((img, index) => (
                    <div
                      key={img.url}
                      className="relative"
                    >
                      <div
                          className={`relative w-20 h-20 aspect-square cursor-pointer border-2 rounded-lg overflow-hidden
                          ${selectedImage === img.url ? 'border-blue-500' : 'border-transparent'}`}
                        onClick={() => setSelectedImage(img.url)}
                      >
                        <Image
                          src={img.url}
                          alt="Product thumbnail"
                          fill
                          className="object-cover"
                        />
                      </div>
                      {!isViewMode && (
                        <button
                          type="button"
                          className="absolute -top-2 -right-2 bg-red-500 rounded-full p-1 hover:bg-red-600"
                          onClick={() => removeImage(index)}
                        >
                          <X className="w-4 h-4 text-white" />
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>

          {mode !== 'view' && (
            <div className="space-y-2">
              <Label htmlFor="images">Product Images (Max 5)</Label>
              <Input
                id="images"
                name="images"
                type="file"
                accept="image/*"
                multiple
                disabled={isViewMode || previewImages.length >= 5}
                ref={fileInputRef}
                onChange={handleImageChange}
              />
              {previewImages.length >= 5 && (
                <p className="text-sm text-red-500">Maximum number of images reached</p>
              )}
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="name">Product Name</Label>
            <Input
              id="name"
              name="name"
              defaultValue={product?.name}
              readOnly={isViewMode}
              required
            />
          </div>

            <div className="space-y-2">
              <Label htmlFor="category">Category</Label>
              <Select 
                name="category" 
                value={category} 
                onValueChange={setCategory}
                disabled={isViewMode} 
                required
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select a category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="FURNITURE">Furniture</SelectItem>
                  <SelectItem value="LIGHTING">Lighting</SelectItem>
                  <SelectItem value="DECORATION">Decoration</SelectItem>
                  <SelectItem value="KITCHEN">Kitchen</SelectItem>
                  <SelectItem value="BATHROOM">Bathroom</SelectItem>
                  <SelectItem value="BEDROOM">Bedroom</SelectItem>
                  <SelectItem value="LIVING_ROOM">Living Room</SelectItem>
                  <SelectItem value="OFFICE">Office</SelectItem>
                  <SelectItem value="OUTDOOR">Outdoor</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="price">Price</Label>
              <Input
                id="price"
                name="price"
                type="number"
                defaultValue={product?.price}
                readOnly={isViewMode}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="stock">Stock</Label>
              <Input
                id="stock"
                name="stock"
                type="number"
                defaultValue={product?.stock}
                readOnly={isViewMode}
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              name="description"
              defaultValue={product?.description}
              readOnly={isViewMode}
              required
            />
          </div>

          {mode !== 'view' && (
            <div className="flex justify-end gap-2">
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                Cancel
              </Button>
              <Button type="submit">
                {mode === 'create' ? 'Create' : 'Save Changes'}
              </Button>
            </div>
          )}

          {product?.id && mode !== 'view' && (
            <input type="hidden" name="id" value={product.id} />
          )}
        </form>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
} 