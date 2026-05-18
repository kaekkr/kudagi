import { uploadToSupabaseStorage } from "@kudagi/core";

/**
 * Uploads a reference photo (File or Blob) to the reference-photos bucket.
 * Returns the public URL.
 */
export async function uploadReferencePhoto(file: File | Blob): Promise<string> {
  const named = file instanceof File ? file : new File([file], "photo.jpg", { type: file.type });
  return uploadToSupabaseStorage(named, "reference-photos");
}
