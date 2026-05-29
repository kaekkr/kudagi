import { useState, useEffect } from "react";
import { db } from "@kudagi/core";
import { ORNAMENT_PHOTOS, ORNAMENT_TYPES, TYPE_PHOTOS } from "@/constants/orderConstants";
import { uploadReferencePhoto } from "@/utils/storage";

// ── API helpers ──────────────────────────────────────────────────────────────

async function fetchRemoteOrnaments(): Promise<{ name: string; imageUrl: string }[]> {
  try {
    const data = await db("/ornaments?order=created_at.asc&select=name,image_url");
    return (data ?? []).map((r: any) => ({ name: r.name, imageUrl: r.image_url ?? "" }));
  } catch {
    return [];
  }
}

async function fetchRemoteOrderTypePhotos(): Promise<Record<string, string>> {
  try {
    const data = await db("/order_type_photos?select=order_type,image_url");
    const map: Record<string, string> = {};
    (data ?? []).forEach((r: any) => {
      if (r.image_url) map[r.order_type] = r.image_url;
    });
    return map;
  } catch {
    return {};
  }
}

// ── Hook ─────────────────────────────────────────────────────────────────────

export function useRemoteAssets() {
  const [remoteOrnaments,  setRemoteOrnaments]  = useState<{ name: string; imageUrl: string }[]>([]);
  const [remoteTypePhotos, setRemoteTypePhotos] = useState<Record<string, string>>({});
  const [isLoading,        setIsLoading]        = useState(true);

  useEffect(() => {
    let mounted = true;
    Promise.all([fetchRemoteOrnaments(), fetchRemoteOrderTypePhotos()])
      .then(([ornaments, photos]) => {
        if (!mounted) return;
        setRemoteOrnaments(ornaments);
        setRemoteTypePhotos(photos);
      })
      .catch(console.error)
      .finally(() => { if (mounted) setIsLoading(false); });
    return () => { mounted = false; };
  }, []);

  /** Remote ornament names if available, otherwise falls back to local constants. */
  const ornamentList = remoteOrnaments.length > 0
    ? remoteOrnaments.map((o) => o.name)
    : ORNAMENT_TYPES;

  /** Resolves an ornament name → image source. Priority: remote URL > local constant. */
  const getOrnamentImage = (name: string) => {
    const remote = remoteOrnaments.find((o) => o.name === name);
    if (remote?.imageUrl) return { uri: remote.imageUrl };
    return ORNAMENT_PHOTOS[name] ?? ORNAMENT_PHOTOS["Тип 1"];
  };

  /** Resolves an order type → image source. Priority: remote URL > local constant. */
  const getTypePhoto = (type: string) => {
    if (remoteTypePhotos[type]) return { uri: remoteTypePhotos[type] };
    return TYPE_PHOTOS[type] ?? TYPE_PHOTOS["Стандартный"];
  };

  return { ornamentList, getOrnamentImage, getTypePhoto, isLoading, uploadReferencePhoto };
}
