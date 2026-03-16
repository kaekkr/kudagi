import { create } from "zustand";

export type OrderStatus =
  | "Принято"
  | "Крой"
  | "Вышивка"
  | "Пошив"
  | "Готово"
  | "Отправка";

export interface Order {
  id: string;
  clientName: string;
  phone: string;
  orderType: string;
  status: OrderStatus;
  totalPrice: number;
  createdAt: string;
}

interface OrderState {
  orders: Order[];
  addOrder: (order: Order) => void;
  updateOrderStatus: (id: string, status: OrderStatus) => void; // <--- Add this
}

export const useOrderStore = create<OrderState>((set) => ({
  orders: [],
  addOrder: (order) => set((state) => ({ orders: [order, ...state.orders] })),
  updateOrderStatus: (id, status) =>
    set((state) => ({
      orders: state.orders.map((o) => (o.id === id ? { ...o, status } : o)),
    })),
}));
