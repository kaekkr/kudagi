/**
 * Shared Supabase REST client helper.
 * Both apps read credentials from EXPO_PUBLIC_* env vars.
 */

const SUPABASE_URL = process.env.EXPO_PUBLIC_SUPABASE_URL!;
const SUPABASE_KEY = process.env.EXPO_PUBLIC_SUPABASE_KEY!;

export const BASE_HEADERS = {
  "Content-Type": "application/json",
  apikey: SUPABASE_KEY,
  Authorization: `Bearer ${SUPABASE_KEY}`,
};

/**
 * Generic Supabase REST fetch.
 * Throws on non-OK responses with the response body as the error message.
 */
export async function db(path: string, options: RequestInit = {}): Promise<any> {
  const res = await fetch(`${SUPABASE_URL}/rest/v1${path}`, {
    ...options,
    headers: { ...BASE_HEADERS, ...(options.headers ?? {}) },
  });
  if (!res.ok) throw new Error(await res.text());
  const text = await res.text();
  return text ? JSON.parse(text) : null;
}

/**
 * Upload a file blob to a Supabase Storage bucket.
 * Returns the public URL of the uploaded file.
 */
export async function uploadToSupabaseStorage(
  file: { name?: string; type?: string; [key: string]: any },
  bucket: string
): Promise<string> {
  const ext = (file.name ?? "file").split(".").pop() ?? "jpg";
  const fileName = `${Date.now()}-${Math.random().toString(36).substring(2, 6)}.${ext}`;

  const res = await fetch(
    `${SUPABASE_URL}/storage/v1/object/${bucket}/${fileName}`,
    {
      method: "POST",
      headers: {
        apikey: SUPABASE_KEY,
        Authorization: `Bearer ${SUPABASE_KEY}`,
        "Content-Type": file.type ?? "application/octet-stream",
        "x-upsert": "true",
      },
      body: file as any,
    }
  );
  if (!res.ok) throw new Error(await res.text());
  return `${SUPABASE_URL}/storage/v1/object/public/${bucket}/${fileName}`;
}

/**
 * Web-only: opens a native file picker and resolves with the chosen File,
 * or null if the user cancelled.
 */
export function pickFileWeb(accept = "image/*"): Promise<File | null> {
  return new Promise((resolve) => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = accept;
    input.onchange = (e: any) => resolve(e.target.files?.[0] ?? null);
    input.oncancel = () => resolve(null);
    input.click();
  });
}
