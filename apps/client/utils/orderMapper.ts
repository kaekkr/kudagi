import { KuDagiOrder, GarmentOrnament } from "@kudagi/core";

export const mapFormToOrder = (data: any, referencePhoto: string | null): KuDagiOrder => {
  const qty = parseInt(data.quantity) || 1;

  // Build per-garment ornaments array
  // garmentOrnaments in form is: { ornamentType: string[], ornamentPosition: string[] }[]
  const garmentOrnaments: GarmentOrnament[] = [];
  if (qty > 1 && Array.isArray(data.garmentOrnaments) && data.garmentOrnaments.length > 0) {
    for (let i = 0; i < qty; i++) {
      garmentOrnaments.push({
        ornamentType: data.garmentOrnaments[i]?.ornamentType ?? [],
        ornamentPosition: data.garmentOrnaments[i]?.ornamentPosition ?? [],
      });
    }
  }

  // For legacy single-item orders, keep flat fields populated
  const flatOrnamentType = qty === 1
    ? (data.ornamentType ?? [])
    : (garmentOrnaments[0]?.ornamentType ?? data.ornamentType ?? []);
  const flatOrnamentPosition = qty === 1
    ? (data.ornamentPosition ?? [])
    : (garmentOrnaments[0]?.ornamentPosition ?? data.ornamentPosition ?? []);

  return {
    id: Date.now().toString(36) + Math.random().toString(36).substring(2, 7),
    clientName: data.clientName?.trim() || "Клиент",
    phone: data.phone?.trim() || "-",
    whatsApp: data.whatsApp?.trim() || "",
    city: data.city?.trim() || "",
    address: data.address?.trim() || "",
    contactPerson: data.contactPerson?.trim() || "",
    orderType: data.orderType,
    garmentModel: data.garmentModel,
    quantity: qty,
    fabricColor: data.fabricColor?.trim() || "",
    fabricType: data.fabricType?.trim() || "",
    ornamentType: flatOrnamentType,
    ornamentPosition: flatOrnamentPosition,
    garmentOrnaments: qty > 1 ? garmentOrnaments : [],
    embroideryColor: data.embroideryColor?.trim() || "",
    occasion: data.occasion,
    desiredDate: data.desiredDate?.trim() || "",
    deliveryMethod: data.deliveryMethod,
    comment: data.comment?.trim() || "",
    referencePhotoUrl: referencePhoto ?? "",
    consentedToData: data.consentedToData,
    measurements: {
      height: parseFloat(data.height) || 0,
      chest: parseFloat(data.chest) || 0,
      waist: parseFloat(data.waist) || 0,
      hips: parseFloat(data.hips) || 0,
      chestHeight: parseFloat(data.chestHeight) || 0,
      backWidth: parseFloat(data.backWidth) || 0,
      frontLength: parseFloat(data.frontLength) || 0,
      backLength: parseFloat(data.backLength) || 0,
      shoulderLength: parseFloat(data.shoulderLength) || 0,
      skirtLength: parseFloat(data.skirtLength) || 0,
      garmentLength: parseFloat(data.garmentLength) || 0,
      armCircumference: parseFloat(data.armCircumference) || 0,
      sleeveLength: parseFloat(data.sleeveLength) || 0,
      neckCircumference: parseFloat(data.neckCircumference) || 0,
    },
    totalPrice: 0,
    depositPaid: false,
    fullPaid: false,
    paymentMethod: data.paymentMethod,
    status: "Принято" as const,
    createdAt: new Date().toISOString(),
    statusUpdatedAt: new Date().toISOString(),
  };
};
