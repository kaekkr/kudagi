import { KuDagiOrder, OrnamentEntry, OrderMeasurements, PairedPerson } from "@kudagi/core";

function parsePairedMeasurements(m: any): OrderMeasurements {
  return {
    height:            parseFloat(m?.height)            || 0,
    chest:             parseFloat(m?.chest)             || 0,
    waist:             parseFloat(m?.waist)             || 0,
    hips:              parseFloat(m?.hips)              || 0,
    chestHeight:       parseFloat(m?.chestHeight)       || 0,
    backWidth:         parseFloat(m?.backWidth)         || 0,
    frontLength:       parseFloat(m?.frontLength)       || 0,
    backLength:        parseFloat(m?.backLength)        || 0,
    shoulderLength:    parseFloat(m?.shoulderLength)    || 0,
    skirtLength:       parseFloat(m?.skirtLength)       || 0,
    garmentLength:     parseFloat(m?.garmentLength)     || 0,
    armCircumference:  parseFloat(m?.armCircumference)  || 0,
    sleeveLength:      parseFloat(m?.sleeveLength)      || 0,
    neckCircumference: parseFloat(m?.neckCircumference) || 0,
  };
}

function parseStandardMeasurements(data: any): OrderMeasurements {
  return {
    height:            parseFloat(data.height)            || 0,
    chest:             parseFloat(data.chest)             || 0,
    waist:             parseFloat(data.waist)             || 0,
    hips:              parseFloat(data.hips)              || 0,
    chestHeight:       parseFloat(data.chestHeight)       || 0,
    backWidth:         parseFloat(data.backWidth)         || 0,
    frontLength:       parseFloat(data.frontLength)       || 0,
    backLength:        parseFloat(data.backLength)        || 0,
    shoulderLength:    parseFloat(data.shoulderLength)    || 0,
    skirtLength:       parseFloat(data.skirtLength)       || 0,
    garmentLength:     parseFloat(data.garmentLength)     || 0,
    armCircumference:  parseFloat(data.armCircumference)  || 0,
    sleeveLength:      parseFloat(data.sleeveLength)      || 0,
    neckCircumference: parseFloat(data.neckCircumference) || 0,
  };
}

export const mapFormToOrder = (data: any, referencePhoto: string | null): KuDagiOrder => {
  const isPaired = data.orderType === "Парный";

  const person1: PairedPerson | undefined = isPaired ? {
    garmentModel: data.p1GarmentModel ?? "Платье",
    ornaments:    (data.p1Ornaments ?? []) as OrnamentEntry[],
    measurements: parsePairedMeasurements(data.p1Measurements),
  } : undefined;

  const person2: PairedPerson | undefined = isPaired ? {
    garmentModel: data.p2GarmentModel ?? "Платье",
    ornaments:    (data.p2Ornaments ?? []) as OrnamentEntry[],
    measurements: parsePairedMeasurements(data.p2Measurements),
  } : undefined;

  return {
    id:               Date.now().toString(36) + Math.random().toString(36).substring(2, 7),
    orderName:        data.orderName?.trim()        || "",
    clientName:       data.clientName?.trim()       || "Клиент",
    phone:            data.phone?.trim()            || "-",
    whatsApp:         data.whatsApp?.trim()         || "",
    city:             data.city?.trim()             || "",
    address:          data.address?.trim()          || "",
    contactPerson:    data.contactPerson?.trim()    || "",
    orderType:        data.orderType,
    garmentModel:     isPaired ? "" : data.garmentModel,
    fabricColor:      data.fabricColor?.trim()      || "",
    fabricType:       data.fabricType?.trim()       || "",
    ornamentType:     isPaired ? [] : (data.ornamentType  ?? []),
    ornamentPosition: isPaired ? [] : (data.ornamentPosition ?? []),
    garmentOrnaments: [],
    person1,
    person2,
    embroideryColor:  data.embroideryColor?.trim()  || "",
    occasion:         data.occasion,
    desiredDate:      data.desiredDate?.trim()      || "",
    deliveryMethod:   data.deliveryMethod,
    comment:          data.comment?.trim()          || "",
    referencePhotoUrl:referencePhoto                ?? "",
    consentedToData:  data.consentedToData,
    measurements:     isPaired
      ? parsePairedMeasurements(data.p1Measurements)
      : parseStandardMeasurements(data),
    totalPrice:       0,
    depositPaid:      false,
    fullPaid:         false,
    paymentMethod:    data.paymentMethod,
    status:           "Принято" as const,
    createdAt:        new Date().toISOString(),
    statusUpdatedAt:  new Date().toISOString(),
  };
};
