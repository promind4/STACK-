import React, { useRef, useState } from 'react';
import { supabase } from '../../lib/supabaseClient';
import { Upload, Trash2, Loader2, ImageIcon, X, Star, Maximize2 } from 'lucide-react';

interface ImageUploaderProps {
    currentUrl: string | null;
    onUpload: (url: string) => void;
    onDelete: () => void;
    productSlug: string;
    label?: string;
    isMain?: boolean;
}

const BUCKET_NAME = 'images-produit';

export const ImageUploader: React.FC<ImageUploaderProps> = ({
    currentUrl,
    onUpload,
    onDelete,
    productSlug,
    label = 'Image',
    isMain = false
}) => {
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [uploading, setUploading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [showPreview, setShowPreview] = useState(false);

    const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        // Validate file type
        const validTypes = ['image/png', 'image/jpeg', 'image/webp', 'image/jpg'];
        if (!validTypes.includes(file.type)) {
            setError('Format non supporté. Utilisez PNG, JPG ou WEBP.');
            return;
        }

        // Validate file size (5MB max)
        if (file.size > 5 * 1024 * 1024) {
            setError('Image trop lourde. Maximum 5MB.');
            return;
        }

        setError(null);
        setUploading(true);

        try {
            // Generate unique filename
            const ext = file.name.split('.').pop()?.toLowerCase() || 'jpg';
            const timestamp = Date.now();
            const filename = `${productSlug}-${isMain ? 'main' : 'gallery'}-${timestamp}.${ext}`;

            // Upload to Supabase Storage
            const { data, error: uploadError } = await supabase.storage
                .from(BUCKET_NAME)
                .upload(filename, file, {
                    cacheControl: '3600',
                    upsert: false
                });

            if (uploadError) {
                throw uploadError;
            }

            // Get public URL
            const { data: urlData } = supabase.storage
                .from(BUCKET_NAME)
                .getPublicUrl(data.path);

            onUpload(urlData.publicUrl);

        } catch (err: any) {
            console.error('Upload error:', err);
            setError(err.message || 'Erreur lors de l\'upload.');
        } finally {
            setUploading(false);
            // Reset file input
            if (fileInputRef.current) {
                fileInputRef.current.value = '';
            }
        }
    };

    const handleDelete = async () => {
        if (!currentUrl) return;

        // Extract filename from URL to delete from storage
        try {
            const urlParts = currentUrl.split('/');
            const filename = urlParts[urlParts.length - 1];

            // Only delete from storage if it's our bucket
            if (currentUrl.includes(BUCKET_NAME)) {
                const { error: deleteError } = await supabase.storage
                    .from(BUCKET_NAME)
                    .remove([filename]);

                if (deleteError) {
                    console.warn('Storage delete warning:', deleteError);
                    // Continue even if storage delete fails (image might be external)
                }
            }

            onDelete();
        } catch (err) {
            console.error('Delete error:', err);
            onDelete(); // Still clear the URL even if storage delete fails
        }
    };

    return (
        <div className="relative group">
            <input
                ref={fileInputRef}
                type="file"
                accept="image/png,image/jpeg,image/webp"
                onChange={handleFileSelect}
                className="hidden"
            />

            <div className={`
                aspect-square rounded-xl border-2 border-dashed transition-all
                flex items-center justify-center overflow-hidden
                ${currentUrl ? 'border-border bg-white' : 'border-zinc-300 bg-zinc-50 hover:border-primary hover:bg-primary/5'}
                ${uploading ? 'opacity-50 pointer-events-none' : ''}
            `}>
                {uploading ? (
                    <div className="flex flex-col items-center gap-2 text-muted-foreground">
                        <Loader2 className="w-8 h-8 animate-spin" />
                        <span className="text-xs">Upload...</span>
                    </div>
                ) : currentUrl ? (
                    <>
                        <img
                            src={currentUrl}
                            alt={label}
                            className="w-full h-full object-contain p-2 cursor-zoom-in"
                            onClick={() => setShowPreview(true)}
                        />
                        {isMain && (
                            <span className="absolute top-2 left-2 px-2 py-1 bg-primary text-white text-[10px] font-bold rounded">
                                PRINCIPALE
                            </span>
                        )}
                    </>
                ) : (
                    <div
                        onClick={() => fileInputRef.current?.click()}
                        className="flex flex-col items-center gap-2 text-muted-foreground cursor-pointer p-4"
                    >
                        <Upload className="w-8 h-8" />
                        <span className="text-xs text-center">Cliquez pour uploader</span>
                    </div>
                )}
            </div>

            {/* Action Buttons */}
            {currentUrl && !uploading && (
                <div className="absolute top-2 right-2 flex gap-1">
                    {/* Preview/Expand */}
                    <button
                        type="button"
                        onClick={() => setShowPreview(true)}
                        className="p-1.5 bg-white shadow-md rounded-full text-zinc-600 hover:bg-zinc-100 border border-zinc-200 transition-colors"
                        title="Voir en grand"
                    >
                        <Maximize2 className="w-3 h-3" />
                    </button>
                    {/* Replace */}
                    <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        className="p-1.5 bg-white shadow-md rounded-full text-blue-500 hover:bg-blue-50 border border-blue-100 transition-colors"
                        title="Remplacer l'image"
                    >
                        <Upload className="w-3 h-3" />
                    </button>
                    {/* Delete */}
                    <button
                        type="button"
                        onClick={handleDelete}
                        className="p-1.5 bg-white shadow-md rounded-full text-red-500 hover:bg-red-50 border border-red-100 transition-colors"
                        title="Supprimer l'image"
                    >
                        <X className="w-3 h-3" />
                    </button>
                </div>
            )}

            {/* Error message */}
            {error && (
                <p className="absolute -bottom-5 left-0 right-0 text-center text-[10px] text-red-500">
                    {error}
                </p>
            )}

            {/* LIGHTBOX PREVIEW MODAL */}
            {showPreview && currentUrl && (
                <div
                    className="fixed inset-0 z-[9999] bg-black/90 flex items-center justify-center p-4"
                    onClick={() => setShowPreview(false)}
                >
                    {/* Close button */}
                    <button
                        type="button"
                        onClick={() => setShowPreview(false)}
                        className="absolute top-4 right-4 p-3 bg-white/10 hover:bg-white/20 rounded-full text-white transition-colors"
                    >
                        <X className="w-6 h-6" />
                    </button>

                    {/* Delete button in preview */}
                    <button
                        type="button"
                        onClick={(e) => {
                            e.stopPropagation();
                            handleDelete();
                            setShowPreview(false);
                        }}
                        className="absolute bottom-4 left-1/2 -translate-x-1/2 px-6 py-3 bg-red-500 hover:bg-red-600 text-white font-bold rounded-full flex items-center gap-2 shadow-lg transition-colors"
                    >
                        <Trash2 className="w-5 h-5" />
                        Supprimer cette image
                    </button>

                    {/* Image */}
                    <img
                        src={currentUrl}
                        alt={label}
                        className="max-w-full max-h-[85vh] object-contain rounded-lg shadow-2xl"
                        onClick={(e) => e.stopPropagation()}
                    />

                    {/* Label */}
                    <p className="absolute top-4 left-4 text-white/80 text-sm font-medium">
                        {isMain ? '⭐ Image Principale' : label} • Appuyez sur ESC ou cliquez pour fermer
                    </p>
                </div>
            )}
        </div>
    );
};

// Multi-image gallery uploader
interface GalleryUploaderProps {
    images: string[];
    onChange: (images: string[]) => void;
    productSlug: string;
    maxImages?: number;
    onSetAsMain?: (url: string) => void; // New: promote gallery image to main
    mainImageUrl?: string; // Current main image URL
}

export const GalleryUploader: React.FC<GalleryUploaderProps> = ({
    images,
    onChange,
    productSlug,
    maxImages = 10,
    onSetAsMain,
    mainImageUrl
}) => {
    const multiFileInputRef = useRef<HTMLInputElement>(null);
    const [isUploading, setIsUploading] = useState(false);
    const [uploadProgress, setUploadProgress] = useState<{ current: number; total: number } | null>(null);

    const handleImageUpload = (index: number, url: string) => {
        const newImages = [...images];
        newImages[index] = url;
        onChange(newImages);
    };

    const handleImageDelete = (index: number) => {
        const newImages = images.filter((_, i) => i !== index);
        onChange(newImages);
    };

    // MULTI-FILE UPLOAD HANDLER
    const handleMultiUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        let files: File[] = Array.from(e.target.files || []);
        if (files.length === 0) return;

        // SORT FILES ALPHABETICALLY by filename for consistent order
        // This ensures: 01_front.jpg, 02_side.jpg, 03_back.jpg = correct order
        files = files.sort((a, b) => a.name.localeCompare(b.name, 'fr', { numeric: true }));

        // Limit to remaining slots
        const currentCount = images.filter(img => img).length;
        const availableSlots = maxImages - currentCount;
        const filesToUpload = files.slice(0, availableSlots);

        if (filesToUpload.length === 0) {
            alert(`Maximum ${maxImages} images atteint.`);
            return;
        }

        setIsUploading(true);
        setUploadProgress({ current: 0, total: filesToUpload.length });

        const uploadedUrls: string[] = [];

        for (let i = 0; i < filesToUpload.length; i++) {
            const file = filesToUpload[i];
            setUploadProgress({ current: i + 1, total: filesToUpload.length });

            // Validate file
            const validTypes = ['image/png', 'image/jpeg', 'image/webp', 'image/jpg'];
            if (!validTypes.includes(file.type)) continue;
            if (file.size > 5 * 1024 * 1024) continue; // Skip >5MB

            try {
                const ext = file.name.split('.').pop()?.toLowerCase() || 'jpg';
                const timestamp = Date.now() + i; // Unique timestamp
                const filename = `${productSlug}-gallery-${timestamp}.${ext}`;

                const { data, error } = await supabase.storage
                    .from('images-produit')
                    .upload(filename, file, {
                        cacheControl: '3600',
                        upsert: false
                    });

                if (error) throw error;

                const { data: urlData } = supabase.storage
                    .from('images-produit')
                    .getPublicUrl(data.path);

                uploadedUrls.push(urlData.publicUrl);
            } catch (err) {
                console.error('Upload error for file', file.name, err);
            }
        }

        // Add uploaded URLs to existing images
        if (uploadedUrls.length > 0) {
            const existingValid = images.filter(img => img);
            onChange([...existingValid, ...uploadedUrls]);
        }

        setIsUploading(false);
        setUploadProgress(null);

        // Reset file input
        if (multiFileInputRef.current) {
            multiFileInputRef.current.value = '';
        }
    };

    const handleSetAsMain = (index: number) => {
        const imageUrl = images[index];
        if (!imageUrl || !onSetAsMain) return;

        // Move this image to the first position (make it main)
        const newImages = [...images];
        // Remove from current position
        newImages.splice(index, 1);
        // Insert at beginning
        newImages.unshift(imageUrl);
        onChange(newImages);

        // Also update the main image URL in parent
        onSetAsMain(imageUrl);
    };

    const moveImage = (fromIndex: number, direction: 'up' | 'down') => {
        const toIndex = direction === 'up' ? fromIndex - 1 : fromIndex + 1;
        if (toIndex < 0 || toIndex >= images.length) return;

        const newImages = [...images];
        const temp = newImages[fromIndex];
        newImages[fromIndex] = newImages[toIndex];
        newImages[toIndex] = temp;
        onChange(newImages);
    };

    const addSlot = () => {
        if (images.length < maxImages) {
            onChange([...images, '']);
        }
    };

    // If there are no images at all, show one empty slot by default
    const displayImages = images.length === 0 ? [''] : images;

    return (
        <div className="space-y-4">
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
                {displayImages.map((img, idx) => (
                    <div key={idx} className="relative group">
                        <ImageUploader
                            currentUrl={img || null}
                            onUpload={(url) => handleImageUpload(idx, url)}
                            onDelete={() => handleImageDelete(idx)}
                            productSlug={productSlug}
                            label={`Image ${idx + 1}`}
                            isMain={idx === 0}
                        />

                        {/* Reorder buttons - show on hover when there's an image */}
                        {img && displayImages.length > 1 && (
                            <div className="absolute top-2 left-2 flex flex-col gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                {idx > 0 && (
                                    <button
                                        type="button"
                                        onClick={() => moveImage(idx, 'up')}
                                        className="p-1 bg-white shadow-md rounded text-zinc-600 hover:bg-zinc-100 border border-zinc-200 transition-colors text-xs"
                                        title="Déplacer vers la gauche"
                                    >
                                        ←
                                    </button>
                                )}
                                {idx < displayImages.length - 1 && (
                                    <button
                                        type="button"
                                        onClick={() => moveImage(idx, 'down')}
                                        className="p-1 bg-white shadow-md rounded text-zinc-600 hover:bg-zinc-100 border border-zinc-200 transition-colors text-xs"
                                        title="Déplacer vers la droite"
                                    >
                                        →
                                    </button>
                                )}
                            </div>
                        )}

                        {/* Position indicator */}
                        {img && (
                            <span className={`absolute bottom-2 right-2 px-2 py-0.5 rounded text-[10px] font-bold ${idx === 0 ? 'bg-primary text-white' : 'bg-white/80 text-zinc-600 border'}`}>
                                {idx === 0 ? '★ PRINCIPALE' : `#${idx + 1}`}
                            </span>
                        )}

                        {/* Set as Main button - only show for non-first images */}
                        {img && idx > 0 && onSetAsMain && (
                            <button
                                type="button"
                                onClick={() => handleSetAsMain(idx)}
                                className="absolute bottom-2 left-1/2 -translate-x-1/2 px-2 py-1 bg-zinc-800 text-white text-[10px] font-bold rounded-full shadow-lg hover:bg-zinc-700 transition-all flex items-center gap-1 opacity-0 group-hover:opacity-100"
                                title="Mettre en première position (image principale)"
                            >
                                <Star className="w-3 h-3" />
                                1ère pos.
                            </button>
                        )}
                    </div>
                ))}

                {/* Add single slot button */}
                {displayImages.length < maxImages && !isUploading && (
                    <button
                        type="button"
                        onClick={addSlot}
                        className="aspect-square rounded-xl border-2 border-dashed border-zinc-300 bg-zinc-50 hover:border-primary hover:bg-primary/5 transition-all flex flex-col items-center justify-center gap-2 text-muted-foreground"
                    >
                        <ImageIcon className="w-6 h-6" />
                        <span className="text-xs">+ 1 photo</span>
                    </button>
                )}
            </div>

            {/* MULTI-UPLOAD SECTION */}
            <div className="flex flex-col items-center gap-3 pt-2 border-t border-border/50">
                {/* Hidden multi-file input */}
                <input
                    ref={multiFileInputRef}
                    type="file"
                    accept="image/png,image/jpeg,image/webp"
                    multiple
                    onChange={handleMultiUpload}
                    className="hidden"
                />

                {/* Upload progress indicator */}
                {isUploading && uploadProgress && (
                    <div className="flex items-center gap-3 px-4 py-2 bg-primary/10 rounded-lg">
                        <Loader2 className="w-5 h-5 animate-spin text-primary" />
                        <span className="text-sm font-medium">
                            Upload {uploadProgress.current}/{uploadProgress.total}...
                        </span>
                    </div>
                )}

                {/* Multi-upload button */}
                {!isUploading && images.filter(i => i).length < maxImages && (
                    <button
                        type="button"
                        onClick={() => multiFileInputRef.current?.click()}
                        className="flex items-center gap-2 px-4 py-2 bg-primary text-white font-bold rounded-lg hover:bg-primary/90 transition-colors shadow-sm"
                    >
                        <Upload className="w-4 h-4" />
                        Téléverser plusieurs photos (5-10)
                    </button>
                )}

                <p className="text-xs text-muted-foreground text-center">
                    {images.filter(i => i).length}/{maxImages} images • <strong>La 1ère = Principale</strong> • PNG/JPG/WEBP • Max 5MB
                </p>
            </div>
        </div>
    );
};

