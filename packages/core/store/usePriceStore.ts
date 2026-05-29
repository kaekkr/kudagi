import { create } from "zustand";
import { db } from "../supabase";

export interface ProductPrice {
  id: string;
  productModel: string;
  price_from: number; // Frontend domain schema
}

export interface OrnamentPrice {
  id: string;
  name: string;
  imageUrl: string;
  price_from: number; // Frontend domain schema
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
      // 🚀 FIX: Added sorting order parameter so the items stay fixed in place
      const data = await db("/product_prices?select=*&order=productmodel.asc");
      
      const mapped = (data ?? []).map((row: any) => ({
        id: row.id,
        productModel: row.productmodel,
        price_from: row.pricefrom ?? 0,
      }));
      set({ prices: mapped, loading: false });
    } catch {
      set({ loading: false });
    }
  },

  fetchOrnamentPrices: async () => {
    set({ loading: true });
    try {
      // 🚀 OPTIMIZATION: Pull all data (including pricefrom) in 1 single network request
      const data = await db("/ornaments?select=id,name,image_url,pricefrom&order=created_at.asc");
      
      const mapped = (data ?? []).map((row: any) => ({
        id:        row.id,
        name:      row.name,
        imageUrl:  row.image_url ?? "",
        price_from: row.pricefrom ?? 0, // Direct clean mapping
      }));
      set({ ornamentPrices: mapped, loading: false });
    } catch {
      set({ loading: false });
    }
  },

  updatePrice: async (id, price_from) => {
    await db(`/product_prices?id=eq.${id}`, {
      method: "PATCH",
      body: JSON.stringify({ pricefrom: price_from }), 
      headers: { Prefer: "return=minimal" },
    });
    get().fetchPrices();
  },

  updateOrnamentPrice: async (id, price_from) => {
    try {
      await db(`/ornaments?id=eq.${id}`, {
        method: "PATCH",
        body: JSON.stringify({ pricefrom: price_from }),
        headers: { Prefer: "return=minimal" },
      });
      get().fetchOrnamentPrices();
    } catch (e: any) {
      if (e.message?.includes("pricefrom") || e.message?.includes("price_from")) {
        throw new Error('Добавьте колонку "pricefrom" (integer, default 0) в таблицу ornaments в Supabase');
      }
      throw e;
    }
  },
}));