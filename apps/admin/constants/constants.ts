import { OrderStatus } from "@kudagi/core";

export const STATUS_ORDER: OrderStatus[] = [
  "Принято", "Крой", "Вышивка", "Пошив", "Готово", "Отправка", "Выдано",
];

export const STATUS_STYLE: Record<OrderStatus, { bg: string; text: string; dot: string }> = {
  Принято:  { bg: "bg-blue-50",   text: "text-blue-600",   dot: "bg-blue-400" },
  Крой:     { bg: "bg-yellow-50", text: "text-yellow-600", dot: "bg-yellow-400" },
  Вышивка:  { bg: "bg-purple-50", text: "text-purple-600", dot: "bg-purple-400" },
  Пошив:    { bg: "bg-orange-50", text: "text-orange-600", dot: "bg-orange-400" },
  Готово:   { bg: "bg-green-50",  text: "text-green-600",  dot: "bg-green-500" },
  Отправка: { bg: "bg-gray-100",  text: "text-gray-600",   dot: "bg-gray-400" },
  Выдано:   { bg: "bg-indigo-50", text: "text-indigo-600", dot: "bg-indigo-400" },
};
