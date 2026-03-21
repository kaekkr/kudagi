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
  modelType: "платье" | "жилет" | "чапан" | "пальто" | "другое";
  measurements: {
    height: number;
    chest: number;
    waist: number;
    hips: number;
  };
  totalPrice: number;
  depositPaid: boolean;
  status: OrderStatus;
  createdAt: string;
}
