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
  orderType: string;
  garmentModel?: string;
  quantity?: number;
  fabricColor?: string;
  fabricType?: string;
  ornamentType: string;
  ornamentPosition: string;
  embroideryColor: string;
  contactPerson?: string;
  occasion?: string;
  desiredDate?: string;
  deliveryMethod?: string;
  comment?: string;
  referencePhotoUrl?: string;
  consentedToData?: boolean;
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
