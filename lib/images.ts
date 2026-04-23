/**
 * Returns the public URL for a product image.
 * In dev (IMAGE_PROVIDER=local): returns the /public path directly.
 * In production (IMAGE_PROVIDER=cloudinary): returns Cloudinary URL.
 */
export function getImageUrl(path: string, width = 800): string {
  const provider = process.env.IMAGE_PROVIDER ?? "local";

  if (provider === "cloudinary") {
    const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
    if (!cloudName) throw new Error("CLOUDINARY_CLOUD_NAME not set");
    // path is the Cloudinary public_id
    return `https://res.cloudinary.com/${cloudName}/image/upload/w_${width},f_auto,q_auto/${path}`;
  }

  // local: path is relative to /public
  return path;
}

/**
 * Parse the images JSON string stored in the database.
 */
export function parseImages(imagesJson: string): string[] {
  try {
    return JSON.parse(imagesJson) as string[];
  } catch {
    return [];
  }
}
