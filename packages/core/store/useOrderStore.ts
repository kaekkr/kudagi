import { create } from "zustand";
import { KuDagiOrder, OrderMeasurements, OrderStatus, PairedPerson } from "../types/order";

const SUPABASE_URL = process.env.EXPO_PUBLIC_SUPABASE_URL!;
const SUPABASE_KEY = process.env.EXPO_PUBLIC_SUPABASE_KEY!;

const BASE_HEADERS = {
  "Content-Type": "application/json",
  "apikey": SUPABASE_KEY,
  "Authorization": `Bearer ${SUPABASE_KEY}`,
};

function parseMeasurements(row: any, prefix = ""): OrderMeasurements {
  const p = prefix ? `${prefix}_` : "";
  return {
    height:           row[`${p}height`]            ?? 0,
    chest:            row[`${p}chest`]             ?? 0,
    waist:            row[`${p}waist`]             ?? 0,
    hips:             row[`${p}hips`]              ?? 0,
    chestHeight:      row[`${p}chest_height`]      ?? 0,
    backWidth:        row[`${p}back_width`]        ?? 0,
    frontLength:      row[`${p}front_length`]      ?? 0,
    backLength:       row[`${p}back_length`]       ?? 0,
    shoulderLength:   row[`${p}shoulder_length`]   ?? 0,
    skirtLength:      row[`${p}skirt_length`]      ?? 0,
    garmentLength:    row[`${p}garment_length`]    ?? 0,
    armCircumference: row[`${p}arm_circumference`] ?? 0,
    sleeveLength:     row[`${p}sleeve_length`]     ?? 0,
    neckCircumference:row[`${p}neck_circumference`]?? 0,
  };
}

function fromRow(row: any): KuDagiOrder {
  const isPaired = row.order_type === "Парный";

  const person1: PairedPerson | undefined = isPaired ? {
    garmentModel:     row.p1_garment_model    ?? "",
    ornamentType:     row.p1_ornament_type    ?? [],
    ornamentPosition: row.p1_ornament_position ?? [],
    measurements:     parseMeasurements(row, "p1"),
  } : undefined;

  const person2: PairedPerson | undefined = isPaired ? {
    garmentModel:     row.p2_garment_model    ?? "",
    ornamentType:     row.p2_ornament_type    ?? [],
    ornamentPosition: row.p2_ornament_position ?? [],
    measurements:     parseMeasurements(row, "p2"),
  } : undefined;

  return {
    id:               row.id,
    orderName:        row.order_name          ?? "",
    clientName:       row.client_name,
    phone:            row.phone               ?? "",
    whatsApp:         row.whats_app           ?? "",
    city:             row.city                ?? "",
    address:          row.address             ?? "",
    orderType:        row.order_type          ?? "",
    garmentModel:     row.garment_model       ?? "",
    fabricColor:      row.fabric_color        ?? "",
    fabricType:       row.fabric_type         ?? "",
    ornamentType:     row.ornament_type       ?? [],
    ornamentPosition: row.ornament_position   ?? [],
    garmentOrnaments: row.garment_ornaments   ?? [],
    person1,
    person2,
    embroideryColor:  row.embroidery_color    ?? "",
    contactPerson:    row.contact_person      ?? "",
    occasion:         row.occasion            ?? "",
    desiredDate:      row.desired_date        ?? "",
    deliveryMethod:   row.delivery_method     ?? "",
    comment:          row.comment             ?? "",
    referencePhotoUrl:row.reference_photo_url ?? "",
    consentedToData:  row.consented_to_data   ?? false,
    measurements:     parseMeasurements(row),
    totalPrice:       row.total_price         ?? 0,
    depositPaid:      row.deposit_paid        ?? false,
    fullPaid:         row.full_paid           ?? false,
    paymentMethod:    row.payment_method      ?? "",
    status:           row.status as OrderStatus,
    createdAt:        row.created_at,
    statusUpdatedAt:  row.status_updated_at,
  };
}

function measurementsToRow(m: OrderMeasurements | undefined, prefix = "") {
  const p = prefix ? `${prefix}_` : "";
  return {
    [`${p}height`]:             m?.height            ?? null,
    [`${p}chest`]:              m?.chest             ?? null,
    [`${p}waist`]:              m?.waist             ?? null,
    [`${p}hips`]:               m?.hips              ?? null,
    [`${p}chest_height`]:       m?.chestHeight       ?? null,
    [`${p}back_width`]:         m?.backWidth         ?? null,
    [`${p}front_length`]:       m?.frontLength       ?? null,
    [`${p}back_length`]:        m?.backLength        ?? null,
    [`${p}shoulder_length`]:    m?.shoulderLength    ?? null,
    [`${p}skirt_length`]:       m?.skirtLength       ?? null,
    [`${p}garment_length`]:     m?.garmentLength     ?? null,
    [`${p}arm_circumference`]:  m?.armCircumference  ?? null,
    [`${p}sleeve_length`]:      m?.sleeveLength      ?? null,
    [`${p}neck_circumference`]: m?.neckCircumference ?? null,
  };
}

function toRow(order: KuDagiOrder) {
  const isPaired = order.orderType === "Парный";
  return {
    id:                   order.id,
    order_name:           order.orderName          ?? "",
    client_name:          order.clientName,
    phone:                order.phone,
    whats_app:            order.whatsApp,
    city:                 order.city,
    address:              order.address,
    order_type:           order.orderType,
    garment_model:        order.garmentModel,
    fabric_color:         order.fabricColor,
    fabric_type:          order.fabricType,
    ornament_type:        order.ornamentType        ?? [],
    ornament_position:    order.ornamentPosition    ?? [],
    garment_ornaments:    order.garmentOrnaments    ?? [],
    // Paired person fields
    p1_garment_model:     isPaired ? (order.person1?.garmentModel    ?? "") : null,
    p1_ornament_type:     isPaired ? (order.person1?.ornamentType    ?? []) : null,
    p1_ornament_position: isPaired ? (order.person1?.ornamentPosition ?? []) : null,
    p2_garment_model:     isPaired ? (order.person2?.garmentModel    ?? "") : null,
    p2_ornament_type:     isPaired ? (order.person2?.ornamentType    ?? []) : null,
    p2_ornament_position: isPaired ? (order.person2?.ornamentPosition ?? []) : null,
    ...measurementsToRow(order.measurements),
    ...(isPaired ? measurementsToRow(order.person1?.measurements, "p1") : {}),
    ...(isPaired ? measurementsToRow(order.person2?.measurements, "p2") : {}),
    embroidery_color:     order.embroideryColor,
    contact_person:       order.contactPerson,
    occasion:             order.occasion,
    desired_date:         order.desiredDate,
    delivery_method:      order.deliveryMethod,
    comment:              order.comment,
    reference_photo_url:  order.referencePhotoUrl,
    consented_to_data:    order.consentedToData,
    total_price:          order.totalPrice,
    deposit_paid:         order.depositPaid,
    full_paid:            order.fullPaid,
    payment_method:       order.paymentMethod,
    status:               order.status,
    created_at:           order.createdAt,
    status_updated_at:    order.statusUpdatedAt,
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
  updateOrderPayment: (id: string, updates: { depositPaid?: boolean; fullPaid?: boolean }) => Promise<void>;
  checkDuplicate: (phone: string, orderName: string) => Promise<KuDagiOrder | null>;
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

  checkDuplicate: async (phone: string, orderName: string) => {
    if (!orderName.trim()) return null;
    try {
      const encodedPhone = encodeURIComponent(phone.trim());
      const encodedName  = encodeURIComponent(orderName.trim());
      const data = await db(
        `/orders?phone=eq.${encodedPhone}&order_name=eq.${encodedName}&select=*&limit=1`
      );
      if (data && data.length > 0) return fromRow(data[0]);
      return null;
    } catch {
      return null;
    }
  },

  updateOrderPayment: async (id: string, updates: { depositPaid?: boolean; fullPaid?: boolean }) => {
    set((state) => ({
      orders: state.orders.map((o) => o.id === id ? { ...o, ...updates } : o),
    }));
    try {
      const body: any = {};
      if (updates.depositPaid !== undefined) body.deposit_paid = updates.depositPaid;
      if (updates.fullPaid    !== undefined) body.full_paid    = updates.fullPaid;
      await db(`/orders?id=eq.${id}`, {
        method: "PATCH",
        headers: { Prefer: "return=minimal" },
        body: JSON.stringify(body),
      });
    } catch {
      get().fetchOrders();
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
