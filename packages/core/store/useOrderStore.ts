import { create } from "zustand";
import { KuDagiOrder, OrderStatus } from "../types/order";

const SUPABASE_URL = "https://klvotqhinoapghxinrmy.supabase.co";
const SUPABASE_KEY = "sb_publishable_OJn9yxGI168WN4T5jb7nSQ_G-GhJHFD";

const BASE_HEADERS = {
  "Content-Type": "application/json",
  "apikey": SUPABASE_KEY,
  "Authorization": `Bearer ${SUPABASE_KEY}`,
};

function fromRow(row: any): KuDagiOrder {
  return {
    id: row.id,
    clientName: row.client_name,
    phone: row.phone ?? "",
    whatsApp: row.whats_app ?? "",
    city: row.city ?? "",
    address: row.address ?? "",
    orderType: row.order_type ?? "",
    garmentModel: row.garment_model ?? "",
    ornamentType: row.ornament_type ?? "",
    ornamentPosition: row.ornament_position ?? "",
    embroideryColor: row.embroidery_color ?? "",
    measurements: {
      height: row.height ?? 0,
      chest: row.chest ?? 0,
      waist: row.waist ?? 0,
      hips: row.hips ?? 0,
    },
    totalPrice: row.total_price ?? 0,
    depositPaid: row.deposit_paid ?? false,
    paymentMethod: row.payment_method ?? "",
    status: row.status as OrderStatus,
    createdAt: row.created_at,
    statusUpdatedAt: row.status_updated_at,
  };
}

function toRow(order: KuDagiOrder) {
  return {
    id: order.id,
    client_name: order.clientName,
    phone: order.phone,
    whats_app: order.whatsApp,
    city: order.city,
    address: order.address,
    order_type: order.orderType,
    garment_model: order.garmentModel,
    ornament_type: order.ornamentType,
    ornament_position: order.ornamentPosition,
    embroidery_color: order.embroideryColor,
    height: order.measurements?.height ?? null,
    chest: order.measurements?.chest ?? null,
    waist: order.measurements?.waist ?? null,
    hips: order.measurements?.hips ?? null,
    total_price: order.totalPrice,
    deposit_paid: order.depositPaid,
    payment_method: order.paymentMethod,
    status: order.status,
    created_at: order.createdAt,
    status_updated_at: order.statusUpdatedAt,
  };
}

async function db(path: string, options: RequestInit = {}) {
  const res = await fetch(`${SUPABASE_URL}/rest/v1${path}`, {
    ...options,
    headers: { ...BASE_HEADERS, ...(options.headers ?? {}) },
  });
  if (!res.ok) throw new Error(await res.text());
  const text = await res.text();
  return text ? JSON.parse(text) : null;
}

interface OrderState {
  orders: KuDagiOrder[];
  loading: boolean;
  error: string | null;
  fetchOrders: () => Promise<void>;
  addOrder: (order: KuDagiOrder) => Promise<void>;
  updateOrderStatus: (id: string, status: OrderStatus) => Promise<void>;
}

export const useOrderStore = create<OrderState>((set, get) => ({
  orders: [],
  loading: false,
  error: null,

  fetchOrders: async () => {
    set({ loading: true, error: null });
    try {
      const data = await db("/orders?order=created_at.desc&select=*");
      set({ orders: (data ?? []).map(fromRow), loading: false });
    } catch (e: any) {
      set({ loading: false, error: e.message });
    }
  },

  addOrder: async (order: KuDagiOrder) => {
    set((state) => ({ orders: [order, ...state.orders] }));
    try {
      await db("/orders", {
        method: "POST",
        headers: { Prefer: "return=minimal" },
        body: JSON.stringify(toRow(order)),
      });
    } catch (e: any) {
      set((state) => ({
        orders: state.orders.filter((o) => o.id !== order.id),
        error: e.message,
      }));
    }
  },

  updateOrderStatus: async (id: string, status: OrderStatus) => {
    const now = new Date().toISOString();
    set((state) => ({
      orders: state.orders.map((o) =>
        o.id === id ? { ...o, status, statusUpdatedAt: now } : o
      ),
    }));
    try {
      await db(`/orders?id=eq.${id}`, {
        method: "PATCH",
        headers: { Prefer: "return=minimal" },
        body: JSON.stringify({ status, status_updated_at: now }),
      });
    } catch {
      get().fetchOrders();
    }
  },
}));
