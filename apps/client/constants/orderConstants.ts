export const KU_GOLD = "#C5A059";

export const TYPE_PHOTOS: Record<string, any> = {
  Стандартный: require("../assets/images/standard.jpg"),
  Парный: require("../assets/images/pair.jpg"),
  Семейный: require("../assets/images/family.jpg"),
  Срочный: require("../assets/images/urgent.jpg"),
  VIP: require("../assets/images/vip.jpg"),
};

export const ORNAMENT_TYPES = [
  "Тип 1","Тип 2","Тип 3","Тип 4","Тип 5",
  "Тип 6","Тип 7","Тип 8","Тип 9","Тип 10",
];

export const ORNAMENT_PHOTOS: Record<string, any> = {
  "Тип 1": require("../assets/images/ornament1.png"),
  "Тип 2": require("../assets/images/ornament2.png"),
  "Тип 3": require("../assets/images/ornament3.png"),
  "Тип 4": require("../assets/images/ornament4.png"),
  "Тип 5": require("../assets/images/ornament5.png"),
  "Тип 6": require("../assets/images/ornament6.png"),
  "Тип 7": require("../assets/images/ornament7.png"),
  "Тип 8": require("../assets/images/ornament8.png"),
  "Тип 9": require("../assets/images/ornament9.png"),
  "Тип 10": require("../assets/images/ornament10.png"),
};

export const GARMENT_MODELS = ["Платье", "Жилет", "Чапан", "Пальто", "Другое"];
export const ORNAMENT_POSITIONS = ["Ворот", "Рукав", "Карман", "Подол", "Другое"];
export const OCCASIONS = ["Свадьба", "Праздник", "Юбилей", "Другое"];
export const DELIVERY_METHODS = ["Самовывоз", "Курьер", "Почта / межгород"];

export const SUPABASE_URL = process.env.EXPO_PUBLIC_SUPABASE_URL!;
export const SUPABASE_KEY = process.env.EXPO_PUBLIC_SUPABASE_KEY!;
export const BASE_HEADERS = {
  apikey: SUPABASE_KEY,
  Authorization: `Bearer ${SUPABASE_KEY}`,
};
