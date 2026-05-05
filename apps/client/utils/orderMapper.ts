import { KuDagiOrder, OrderMeasurements, PairedPerson } from "@kudagi/core";

function parseMeasurementsFromForm(data: any, prefix = ""): OrderMeasurements {
  const p = prefix ? `${prefix}.` : "";
  const get = (key: string) => parseFloat(data[`${p}${key}`] ?? data[key] ?? "0") || 0;
  return {
    height:            get("height"),
    chest:             get("chest"),
    waist:             get("waist"),
    hips:              get("hips"),
    chestHeight:       get("chestHeight"),
    backWidth:         get("backWidth"),
    frontLength:       get("frontLength"),
    backLength:        get("backLength"),
    shoulderLength:    get("shoulderLength"),
    skirtLength:       get("skirtLength"),
    garmentLength:     get("garmentLength"),
    armCircumference:  get("armCircumference"),
    sleeveLength:      get("sleeveLength"),
    neckCircumference: get("neckCircumference"),
  };
}

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

export const mapFormToOrder = (data: any, referencePhoto: string | null): KuDagiOrder => {
  const isPaired = data.orderType === "Парный";

  const person1: PairedPerson | undefined = isPaired ? {
    garmentModel:     data.p1GarmentModel ?? "Платье",
    ornamentType:     data.p1OrnamentType ?? [],
    ornamentPosition: data.p1OrnamentPosition ?? [],
    measurements:     parsePairedMeasurements(data.p1Measurements),
  } : undefined;

  const person2: PairedPerson | undefined = isPaired ? {
    garmentModel:     data.p2GarmentModel ?? "Платье",
    ornamentType:     data.p2OrnamentType ?? [],
    ornamentPosition: data.p2OrnamentPosition ?? [],
    measurements:     parsePairedMeasurements(data.p2Measurements),
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
    ornamentType:     isPaired ? [] : (data.ornamentType ?? []),
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
      ? parsePairedMeasurements(data.p1Measurements) // fallback for admin display
      : parseMeasurementsFromForm(data),
    totalPrice:       0,
    depositPaid:      false,
    fullPaid:         false,
    paymentMethod:    data.paymentMethod,
    status:           "Принято" as const,
    createdAt:        new Date().toISOString(),
    statusUpdatedAt:  new Date().toISOString(),
  };
};
