export type OrderStatus =
  | "Принято"
  | "Крой"
  | "Вышивка"
  | "Пошив"
  | "Готово"
  | "Отправка"
  | "Выдано";

export interface GarmentOrnament {
  ornamentType: string[];
  ornamentPosition: string[];
}

export interface OrderMeasurements {
  height: number;
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
}

/**
 * One ornament type with its selected positions.
 * Used in paired orders so each ornament type has its own position list.
 */
export interface OrnamentEntry {
  type: string;
  positions: string[];
}

/** Full config for one person in a paired order */
export interface PairedPerson {
  garmentModel: string;
  /**
   * Each selected ornament type paired with its positions.
   * e.g. [{ type: "Тип 1", positions: ["Ворот", "Рукав"] }, ...]
   */
  ornaments: OrnamentEntry[];
  measurements: OrderMeasurements;
}

export interface KuDagiOrder {
  id: string;
  orderName?: string;
  clientName: string;
  phone: string;
  whatsApp?: string;
  city?: string;
  address?: string;
  orderType: string;
  garmentModel?: string;
  fabricColor?: string;
  fabricType?: string;
  ornamentType: string[];
  ornamentPosition: string[];
  garmentOrnaments?: GarmentOrnament[];
  person1?: PairedPerson;
  person2?: PairedPerson;
  embroideryColor: string;
  contactPerson?: string;
  occasion?: string;
  desiredDate?: string;
  deliveryMethod?: string;
  comment?: string;
  referencePhotoUrl?: string;
  consentedToData?: boolean;
  measurements: OrderMeasurements;
  totalPrice: number;
  depositPaid: boolean;
  fullPaid: boolean;
  paymentMethod: string;
  status: OrderStatus;
  createdAt: string;
  statusUpdatedAt: string;
}
