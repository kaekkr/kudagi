import { uploadToSupabaseStorage, pickFileWeb } from "@kudagi/core";

/** Upload an image file to the ornaments bucket. Returns the public URL. */
export async function uploadOrnamentImage(file: File): Promise<string> {
  return uploadToSupabaseStorage(file, "ornaments");
}

/** Upload an image file to the order-types bucket. Returns the public URL. */
export async function uploadOrderTypeImage(file: File): Promise<string> {
  return uploadToSupabaseStorage(file, "order-types");
}

/** Re-export the generic web file picker for convenience. */
export { pickFileWeb };
