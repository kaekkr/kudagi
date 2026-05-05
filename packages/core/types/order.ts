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

/** Full config for one person in a paired order */
export interface PairedPerson {
  garmentModel: string;
  ornamentType: string[];
  ornamentPosition: string[];
  measurements: OrderMeasurements;
}

export interface KuDagiOrder {
  id: string;
  /** Client-defined name, e.g. "Куртка для сына". Used with phone for duplicate check. */
  orderName?: string;
  clientName: string;
  phone: string;
  whatsApp?: string;
  city?: string;
  address?: string;
  orderType: string;
  /** Used for standard/non-paired orders */
  garmentModel?: string;
  fabricColor?: string;
  fabricType?: string;
  ornamentType: string[];
  ornamentPosition: string[];
  garmentOrnaments?: GarmentOrnament[];
  /** Populated only when orderType === "Парный" */
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
  /** Measurements for standard orders (person1.measurements used for paired) */
  measurements: OrderMeasurements;
  totalPrice: number;
  depositPaid: boolean;
  fullPaid: boolean;
  paymentMethod: string;
  status: OrderStatus;
  createdAt: string;
  statusUpdatedAt: string;
}
