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
  // ДОБАВЛЯЕМ: Время последнего изменения статуса
  statusUpdatedAt?: string;
}

interface OrderState {
  orders: Order[];
  addOrder: (order: Order) => void;
  updateOrderStatus: (id: string, status: OrderStatus) => void;
}

export const useOrderStore = create<OrderState>((set) => ({
  orders: [],
  addOrder: (order) =>
    set((state) => ({
      orders: [
        {
          ...order,
          statusUpdatedAt: new Date().toLocaleString("ru-RU"), // Ставим время при создании
        },
        ...state.orders,
      ],
    })),
  updateOrderStatus: (id, status) =>
    set((state) => ({
      orders: state.orders.map((o) =>
        o.id === id
          ? {
              ...o,
              status,
              statusUpdatedAt: new Date().toLocaleString("ru-RU"), // Обновляем время при смене статуса
            }
          : o,
      ),
    })),
}));
