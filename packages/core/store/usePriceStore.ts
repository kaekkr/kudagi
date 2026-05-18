import { create } from "zustand";
import { db } from "../supabase";

export interface ProductPrice {
  id: string;
  productModel: string;
  price_from: number;
}

export interface OrnamentPrice {
  id: string;
  name: string;
  imageUrl: string;
  price_from: number;
}

interface PriceState {
  prices: ProductPrice[];
  ornamentPrices: OrnamentPrice[];
  loading: boolean;
  fetchPrices: () => Promise<void>;
  fetchOrnamentPrices: () => Promise<void>;
  updatePrice: (id: string, price_from: number) => Promise<void>;
  updateOrnamentPrice: (id: string, price_from: number) => Promise<void>;
}

export const usePriceStore = create<PriceState>((set, get) => ({
  prices: [],
  ornamentPrices: [],
  loading: false,

  fetchPrices: async () => {
    set({ loading: true });
    try {
      const data = await db("/product_prices?select=*");
      const mapped = (data ?? []).map((row: any) => ({
        id: row.id,
        productModel: row.productmodel,
        price_from: row.price_from ?? 0,
      }));
      set({ prices: mapped, loading: false });
    } catch {
      set({ loading: false });
    }
  },

  fetchOrnamentPrices: async () => {
    set({ loading: true });
    try {
      // Fetch without price_from first — that column may not exist yet
      const data = await db("/ornaments?select=id,name,image_url&order=created_at.asc");
      // Try to get price_from separately; if the column doesn't exist the query fails silently
      let priceMap: Record<string, number> = {};
      try {
        const priceData = await db("/ornaments?select=id,price_from&order=created_at.asc");
        (priceData ?? []).forEach((r: any) => { priceMap[r.id] = r.price_from ?? 0; });
      } catch {
        // column doesn't exist yet — all prices default to 0
      }
      const mapped = (data ?? []).map((row: any) => ({
        id:        row.id,
        name:      row.name,
        imageUrl:  row.image_url ?? "",
        price_from: priceMap[row.id] ?? 0,
      }));
      set({ ornamentPrices: mapped, loading: false });
    } catch {
      set({ loading: false });
    }
  },

  updatePrice: async (id, price_from) => {
    await db(`/product_prices?id=eq.${id}`, {
      method: "PATCH",
      body: JSON.stringify({ price_from: price_from }),
      headers: { Prefer: "return=minimal" },
    });
    get().fetchPrices();
  },

  updateOrnamentPrice: async (id, price_from) => {
    try {
      await db(`/ornaments?id=eq.${id}`, {
        method: "PATCH",
        body: JSON.stringify({ price_from: price_from }),
        headers: { Prefer: "return=minimal" },
      });
      get().fetchOrnamentPrices();
    } catch (e: any) {
      // If price_from column doesn't exist yet, show a helpful message
      if (e.message?.includes("price_from")) {
        throw new Error('Добавьте колонку "price_from" (integer, default 0) в таблицу ornaments в Supabase');
      }
      throw e;
    }
  },
}));
