export type OrderStatus =
  | "Принято"
  | "Крой"
  | "Вышивка"
  | "Пошив"
  | "Готово"
  | "Отправка"
  | "Предоплата оплачена"
  | "Оплачено полностью"
  | "Выдано";

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
    chest: number;       // Og - обхват груди
    waist: number;       // Ot - обхват талии
    hips: number;        // Ob - обхват бедер
    chestHeight: number; // Vg - высота груди
    backWidth: number;   // Shsp - ширина спинки
    frontLength: number; // Dtp - длина полочки
    backLength: number;  // Dts - длина спинки
    shoulderLength: number; // Dplecha - длина плеча
    skirtLength: number; // Dyu - длина юбки
    garmentLength: number; // Dizd - длина изделия
    armCircumference: number; // Oruk - обхват руки
    sleeveLength: number;    // D ruk - длина рукавов
    neckCircumference: number; // обхват шеи
    height: number;      // рост
  };
  totalPrice: number;
  depositPaid: boolean;
  paymentMethod: string;
  status: OrderStatus;
  createdAt: string;
  statusUpdatedAt: string;
}
