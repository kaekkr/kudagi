import { Linking } from "react-native";

const WHATSAPP_NUMBER = "77072847407";

/**
 * Opens WhatsApp with a pre-filled order summary message.
 * Called after the client fills the form and wants to confirm via WhatsApp.
 */
export function sendOrderToWhatsApp(data: any): void {
  const isPaired = data.orderType === "Парный";
  const garmentInfo = isPaired
    ? `Человек 1: ${data.p1GarmentModel}\nЧеловек 2: ${data.p2GarmentModel}`
    : `Модель: ${data.garmentModel}`;

  const msg = encodeURIComponent(
    `Пожалуйста внимательно проверьте параметры вашего заказа.\n\n` +
    `Название: ${data.orderName}\n` +
    `Клиент: ${data.clientName}\n` +
    `Телефон: ${data.phone}\n` +
    `Вид заказа: ${data.orderType}\n` +
    `${garmentInfo}\n` +
    `Цвет ткани: ${data.fabricColor || "—"}\n` +
    `Тип ткани: ${data.fabricType || "—"}\n` +
    `Цвет ниток: ${data.embroideryColor || "—"}\n` +
    `Повод: ${data.occasion}\n` +
    `Нужен к: ${data.desiredDate || "—"}\n` +
    `Доставка: ${data.deliveryMethod}\n` +
    `Оплата: ${data.paymentMethod}\n` +
    (data.comment ? `Комментарий: ${data.comment}\n` : "") +
    `\nЕсли всё указано верно, напишите:\n` +
    `Подтверждаю заказ. Все параметры указаны верно. С условиями ознакомлен(а) и согласен(на).`
  );

  Linking.openURL(`https://wa.me/${WHATSAPP_NUMBER}?text=${msg}`);
}
