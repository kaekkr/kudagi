export type OrderStatus =
  | "Принято"
  | "Крой"
  | "Вышивка"
  | "Пошив"
  | "Готово"
  | "Отправка"
  | "Выдано";

/** Ornament config for a single garment item in the order */
export interface GarmentOrnament {
  ornamentType: string[];
  ornamentPosition: string[];
}

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
  /**
   * Legacy flat ornament fields (kept for backward compatibility with old orders).
   * For new orders with quantity > 1, use garmentOrnaments instead.
   */
  ornamentType: string[];
  ornamentPosition: string[];
  /**
   * Per-garment ornament configuration.
   * Index 0 = first garment, index 1 = second garment, etc.
   * If empty, fall back to ornamentType / ornamentPosition.
   */
  garmentOrnaments?: GarmentOrnament[];
  embroideryColor: string;
  contactPerson?: string;
  occasion?: string;
  desiredDate?: string;
  deliveryMethod?: string;
  comment?: string;
  referencePhotoUrl?: string;
  consentedToData?: boolean;
  measurements: {
    chest: number;
    waist: number;
    hips: number;
    chestHeight: number;
    backWidth: number;
    frontLength: number;
    backLength: number;
    shoulderLength: number;
    skirtLength: number;
    garmentLength: number;
    armCircumference: number;
    sleeveLength: number;
    neckCircumference: number;
    height: number;
  };
  totalPrice: number;
  depositPaid: boolean;
  fullPaid: boolean;
  paymentMethod: string;
  status: OrderStatus;
  createdAt: string;
  statusUpdatedAt: string;
}
