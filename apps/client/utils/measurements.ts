import { Lang } from "@/constants/translations";

export interface MeasurementField {
  name: string;
  abbr: string;
  label: string;
}

/** Returns the ordered list of measurement fields with localised labels. */
export function getMeasurementFields(lang: Lang): MeasurementField[] {
  return [
    { name: "chest",             abbr: "Ог",     label: lang === "kaz" ? "Кеуде өлшемі"    : "Обхват груди" },
    { name: "waist",             abbr: "От",     label: lang === "kaz" ? "Бел өлшемі"       : "Обхват талии" },
    { name: "hips",              abbr: "Об",     label: lang === "kaz" ? "Жамбас өлшемі"    : "Обхват бедер" },
    { name: "chestHeight",       abbr: "Вг",     label: lang === "kaz" ? "Кеуде биіктігі"   : "Высота груди" },
    { name: "backWidth",         abbr: "Шсп",    label: lang === "kaz" ? "Арқа ені"         : "Ширина спинки" },
    { name: "frontLength",       abbr: "Дтп",    label: lang === "kaz" ? "Алдыңғы ұзындық" : "Длина полочки" },
    { name: "backLength",        abbr: "Дтс",    label: lang === "kaz" ? "Арқа ұзындығы"   : "Длина спинки" },
    { name: "shoulderLength",    abbr: "Дплеча", label: lang === "kaz" ? "Иық ұзындығы"    : "Длина плеча" },
    { name: "skirtLength",       abbr: "Дю",     label: lang === "kaz" ? "Юбка ұзындығы"   : "Длина юбки" },
    { name: "garmentLength",     abbr: "Дизд",   label: lang === "kaz" ? "Бұйым ұзындығы"  : "Длина изделия" },
    { name: "armCircumference",  abbr: "Орук",   label: lang === "kaz" ? "Қол өлшемі"      : "Обхват руки" },
    { name: "sleeveLength",      abbr: "Д рук",  label: lang === "kaz" ? "Жең ұзындығы"    : "Длина рукавов" },
    { name: "neckCircumference", abbr: "Шея",    label: lang === "kaz" ? "Мойын өлшемі"    : "Обхват шеи" },
    { name: "height",            abbr: "Бой",    label: lang === "kaz" ? "Бойы"             : "Рост" },
  ];
}
