import { ProductPrice, OrnamentPrice } from "@kudagi/core";

export interface PriceBreakdown {
  garmentTotal: number;   // sum of garment base prices
  ornamentTotal: number;  // sum of ornament prices
  total: number;          // garmentTotal + ornamentTotal
  deposit: number;        // 50% of total
  lines: { label: string; amount: number }[];
}

/**
 * Calculates the estimated price from form data + price lists.
 * Returns a breakdown with line items.
 */
export function calculatePrice(
  formData: any,
  garmentPrices: ProductPrice[],
  ornamentPrices: OrnamentPrice[]
): PriceBreakdown {
  const lines: { label: string; amount: number }[] = [];
  const isPaired = formData.orderType === "Парный";

  const findGarment = (model: string) =>
    garmentPrices.find((p) => p.productModel === model)?.price_from ?? 0;

  const findOrnament = (name: string) =>
    ornamentPrices.find((o) => o.name === name)?.price_from ?? 0;

  let garmentTotal = 0;
  let ornamentTotal = 0;

  if (isPaired) {
    // Person 1
    const p1Model = formData.p1GarmentModel ?? "Платье";
    const p1Price = findGarment(p1Model);
    if (p1Price) { lines.push({ label: `Человек 1 — ${p1Model}`, amount: p1Price }); garmentTotal += p1Price; }

    const p1Ornaments: { type: string }[] = formData.p1Ornaments ?? [];
    p1Ornaments.forEach(({ type }) => {
      const price = findOrnament(type);
      if (price) { lines.push({ label: `Орнамент (чел. 1) — ${type}`, amount: price }); ornamentTotal += price; }
    });

    // Person 2
    const p2Model = formData.p2GarmentModel ?? "Платье";
    const p2Price = findGarment(p2Model);
    if (p2Price) { lines.push({ label: `Человек 2 — ${p2Model}`, amount: p2Price }); garmentTotal += p2Price; }

    const p2Ornaments: { type: string }[] = formData.p2Ornaments ?? [];
    p2Ornaments.forEach(({ type }) => {
      const price = findOrnament(type);
      if (price) { lines.push({ label: `Орнамент (чел. 2) — ${type}`, amount: price }); ornamentTotal += price; }
    });
  } else {
    const model = formData.garmentModel ?? "Платье";
    const gPrice = findGarment(model);
    if (gPrice) { lines.push({ label: model, amount: gPrice }); garmentTotal += gPrice; }

    const ornamentTypes: string[] = formData.ornamentType ?? [];
    ornamentTypes.forEach((type) => {
      const price = findOrnament(type);
      if (price) { lines.push({ label: `Орнамент — ${type}`, amount: price }); ornamentTotal += price; }
    });
  }

  const total = garmentTotal + ornamentTotal;
  return {
    garmentTotal,
    ornamentTotal,
    total,
    deposit: Math.ceil(total / 2),
    lines,
  };
}
