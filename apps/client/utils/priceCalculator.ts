import { ProductPrice, OrnamentPrice } from "@kudagi/core";

export interface PriceBreakdown {
  garmentTotal: number;   // sum of garment base prices
  ornamentTotal: number;  // sum of ornament prices
  total: number;          // garmentTotal + ornamentTotal
  deposit: number;        // 50% of total
  lines: { label: string; amount: number }[];
}

export function calculatePrice(formData: any, prices: any[], ornamentPrices: any[]): PriceBreakdown {
  let lines: { label: string; amount: number }[] = [];
  let garmentTotal = 0;
  let ornamentTotal = 0;
  let total = 0;

  if (!formData) {
    return { garmentTotal: 0, ornamentTotal: 0, total: 0, deposit: 0, lines: [] };
  }

  // Хелпер для поиска цены модели изделия
  const getCleanPrice = (modelName: string) => {
    if (!modelName) return 0;
    let clean = modelName.trim().toLowerCase();
    
    // Хак на случай если в переводах "Чапан", а в БД "Шапан"
    if (clean === "чапан") clean = "шапан";

    const found = prices.find(p => (p.productModel || "").trim().toLowerCase() === clean);
    return found ? found.price_from : 0;
  };

  // Хелпер для поиска цены орнамента (устойчивый к регистру "Тип" / "тип")
  const getOrnamentPrice = (name: string) => {
    if (!name) return 0;
    const clean = name.trim().toLowerCase();

    const found = ornamentPrices.find(o => (o.name || "").trim().toLowerCase() === clean);
    return found ? found.price_from : 0;
  };

  if (formData.orderType === "Парный") {
    // ── Человек 1 ──
    if (formData.p1GarmentModel) {
      const p1Price = getCleanPrice(formData.p1GarmentModel);
      lines.push({ label: `Изделие 1 (${formData.p1GarmentModel})`, amount: p1Price });
      garmentTotal += p1Price;
      total += p1Price;
    }
    (formData.p1Ornaments || []).forEach((o: any) => {
      if (o?.type) {
        const op = getOrnamentPrice(o.type);
        lines.push({ label: `Орнамент 1: ${o.type}`, amount: op });
        ornamentTotal += op;
        total += op;
      }
    });

    // ── Человек 2 ──
    if (formData.p2GarmentModel) {
      const p2Price = getCleanPrice(formData.p2GarmentModel);
      lines.push({ label: `Изделие 2 (${formData.p2GarmentModel})`, amount: p2Price });
      garmentTotal += p2Price;
      total += p2Price;
    }
    (formData.p2Ornaments || []).forEach((o: any) => {
      if (o?.type) {
        const op = getOrnamentPrice(o.type);
        lines.push({ label: `Орнамент 2: ${o.type}`, amount: op });
        ornamentTotal += op;
        total += op;
      }
    });
  } else {
    // ── Одиночный стандартный заказ ──
    if (formData.garmentModel) {
      const itemPrice = getCleanPrice(formData.garmentModel);
      lines.push({ label: `Изделие: ${formData.garmentModel}`, amount: itemPrice });
      garmentTotal += itemPrice;
      total += itemPrice;
    }

    // Считаем поштучно из изолированного массива орнаментов
    (formData.ornaments || []).forEach((o: any) => {
      if (o?.type) {
        const op = getOrnamentPrice(o.type);
        // Добавляем в чек строку независимо от цены, чтобы пользователь видел все выбранные орнаменты
        lines.push({ label: `Орнамент: ${o.type}`, amount: op });
        ornamentTotal += op;
        total += op;
      }
    });
  }

  return {
    garmentTotal,
    ornamentTotal,
    total,
    deposit: Math.round(total / 2),
    lines,
  };
}