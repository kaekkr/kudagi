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
    quantity: row.quantity ?? 1,
    fabricColor: row.fabric_color ?? "",
    fabricType: row.fabric_type ?? "",
    ornamentType: row.ornament_type ?? "",
    ornamentPosition: row.ornament_position ?? "",
    embroideryColor: row.embroidery_color ?? "",
    contactPerson: row.contact_person ?? "",
    occasion: row.occasion ?? "",
    desiredDate: row.desired_date ?? "",
    deliveryMethod: row.delivery_method ?? "",
    comment: row.comment ?? "",
    referencePhotoUrl: row.reference_photo_url ?? "",
    consentedToData: row.consented_to_data ?? false,
    measurements: {
      height: row.height ?? 0,
      chest: row.chest ?? 0,
      waist: row.waist ?? 0,
      hips: row.hips ?? 0,
      chestHeight: row.chest_height ?? 0,
      backWidth: row.back_width ?? 0,
      frontLength: row.front_length ?? 0,
      backLength: row.back_length ?? 0,
      shoulderLength: row.shoulder_length ?? 0,
      skirtLength: row.skirt_length ?? 0,
      garmentLength: row.garment_length ?? 0,
      armCircumference: row.arm_circumference ?? 0,
      sleeveLength: row.sleeve_length ?? 0,
      neckCircumference: row.neck_circumference ?? 0,
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
    quantity: order.quantity ?? 1,
    fabric_color: order.fabricColor,
    fabric_type: order.fabricType,
    ornament_type: order.ornamentType,
    ornament_position: order.ornamentPosition,
    embroidery_color: order.embroideryColor,
    contact_person: order.contactPerson,
    occasion: order.occasion,
    desired_date: order.desiredDate,
    delivery_method: order.deliveryMethod,
    comment: order.comment,
    reference_photo_url: order.referencePhotoUrl,
    consented_to_data: order.consentedToData,
    height: order.measurements?.height ?? null,
    chest: order.measurements?.chest ?? null,
    waist: order.measurements?.waist ?? null,
    hips: order.measurements?.hips ?? null,
    chest_height: order.measurements?.chestHeight ?? null,
    back_width: order.measurements?.backWidth ?? null,
    front_length: order.measurements?.frontLength ?? null,
    back_length: order.measurements?.backLength ?? null,
    shoulder_length: order.measurements?.shoulderLength ?? null,
    skirt_length: order.measurements?.skirtLength ?? null,
    garment_length: order.measurements?.garmentLength ?? null,
    arm_circumference: order.measurements?.armCircumference ?? null,
    sleeve_length: order.measurements?.sleeveLength ?? null,
    neck_circumference: order.measurements?.neckCircumference ?? null,
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
  updateDepositPaid: (id: string, depositPaid: boolean) => void;
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

  updateDepositPaid: (id: string, depositPaid: boolean) => {
    set((state) => ({
      orders: state.orders.map((o) =>
        o.id === id ? { ...o, depositPaid } : o
      ),
    }));
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
