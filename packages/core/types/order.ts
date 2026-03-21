export type OrderStatus =
  | "Принято"
  | "Крой"
  | "Вышивка"
  | "Пошив"
  | "Готово"
  | "Отправка";

export interface KuDagiOrder {
  id: string;
  clientName: string;
  phone: string;
  whatsApp?: string;
  city?: string;
  address?: string;
  orderType: string;        // "Стандартный", "Парный", etc.
  garmentModel?: string;    // "Платье", "Жилет", "Чапан", etc.
  ornamentType: string;
  ornamentPosition: string;
  embroideryColor: string;
  measurements: {
    height: number;
    chest: number;
    waist: number;
    hips: number;
  };
  totalPrice: number;
  depositPaid: boolean;
  paymentMethod: string;
  status: OrderStatus;
  createdAt: string;
  statusUpdatedAt: string;
}
