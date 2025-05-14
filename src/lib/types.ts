export interface TransformRecord {
    id: string;
    publicId: string;        // original Cloudinary public ID
    transformedUrl: string;  // final URL with transformations
    from?: string;           // generative replace prompt
    to?: string;
    overlay?: string;        // overlay text or image ID
    overlayMode?: 'text' | 'image';
    pos?: { x: number; y: number };
    createdAt: number;
}
