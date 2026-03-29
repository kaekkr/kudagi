import { useState, useEffect } from 'react';
// Replace these with your actual path to constants
import {
  ORNAMENT_PHOTOS,
  ORNAMENT_TYPES,
  TYPE_PHOTOS,
  SUPABASE_URL,
  SUPABASE_KEY,
  BASE_HEADERS
} from '@/constants/orderConstants';

// --- Helper Functions (External to the hook) ---

/**
 * Uploads a file to Supabase Storage and returns the public URL.
 */
export async function uploadReferencePhoto(file: File): Promise<string> {
  const ext = file.name.split(".").pop() ?? "jpg";
  const fileName = `ref-${Date.now()}-${Math.random().toString(36).substring(2, 6)}.${ext}`;

  const res = await fetch(
    `${SUPABASE_URL}/storage/v1/object/reference-photos/${fileName}`,
    {
      method: "POST",
      headers: {
        apikey: SUPABASE_KEY,
        Authorization: `Bearer ${SUPABASE_KEY}`,
        "Content-Type": file.type,
        "x-upsert": "true",
      },
      body: file,
    }
  );

  if (!res.ok) throw new Error(await res.text());

  // Note: This requires the 'reference-photos' bucket to be PUBLIC in Supabase
  return `${SUPABASE_URL}/storage/v1/object/public/reference-photos/${fileName}`;
}

/**
 * Fetches the list of ornaments from the Supabase database.
 */
async function fetchRemoteOrnaments(): Promise<{ name: string; imageUrl: string }[]> {
  try {
    const res = await fetch(
      `${SUPABASE_URL}/rest/v1/ornaments?order=created_at.asc&select=name,image_url`,
      { headers: { ...BASE_HEADERS, "Content-Type": "application/json" } }
    );
    if (!res.ok) return [];
    const data = await res.json();
    return data.map((r: any) => ({
      name: r.name,
      imageUrl: r.image_url ?? ""
    }));
  } catch {
    return [];
  }
}

/**
 * Fetches the mapping of order types to their specific display photos.
 */
async function fetchRemoteOrderTypePhotos(): Promise<Record<string, string>> {
  try {
    const res = await fetch(
      `${SUPABASE_URL}/rest/v1/order_type_photos?select=order_type,image_url`,
      { headers: { ...BASE_HEADERS, "Content-Type": "application/json" } }
    );
    if (!res.ok) return {};
    const data = await res.json();
    const map: Record<string, string> = {};
    data.forEach((r: any) => {
      if (r.image_url) map[r.order_type] = r.image_url;
    });
    return map;
  } catch {
    return {};
  }
}

// --- The Main Hook ---

export function useRemoteAssets() {
  const [remoteOrnaments, setRemoteOrnaments] = useState<{ name: string; imageUrl: string }[]>([]);
  const [remoteTypePhotos, setRemoteTypePhotos] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    async function loadAll() {
      try {
        const [ornaments, photos] = await Promise.all([
          fetchRemoteOrnaments(),
          fetchRemoteOrderTypePhotos()
        ]);

        if (isMounted) {
          setRemoteOrnaments(ornaments);
          setRemoteTypePhotos(photos);
        }
      } catch (error) {
        console.error("Failed to load remote assets:", error);
      } finally {
        if (isMounted) setIsLoading(false);
      }
    }

    loadAll();

    return () => {
      isMounted = false;
    };
  }, []);

  /**
   * Returns remote ornament names if available, otherwise falls back to local constants.
   */
  const ornamentList = remoteOrnaments.length > 0
    ? remoteOrnaments.map((o) => o.name)
    : ORNAMENT_TYPES;

  /**
   * Resolves an ornament name to an image source object.
   * Priority: Remote URL > Local Constant > Default Fallback
   */
  const getOrnamentImage = (name: string) => {
    const remote = remoteOrnaments.find((o) => o.name === name);
    if (remote?.imageUrl) return { uri: remote.imageUrl };

    return ORNAMENT_PHOTOS[name] ?? ORNAMENT_PHOTOS["Тип 1"];
  };

  /**
   * Resolves an order type to an image source object.
   * Priority: Remote URL > Local Constant > Default Fallback
   */
  const getTypePhoto = (type: string) => {
    if (remoteTypePhotos[type]) return { uri: remoteTypePhotos[type] };

    return TYPE_PHOTOS[type] ?? TYPE_PHOTOS["Стандартный"];
  };

  return {
    ornamentList,
    getOrnamentImage,
    getTypePhoto,
    isLoading,
    uploadReferencePhoto
  };
}
