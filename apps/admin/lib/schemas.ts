import * as z from "zod";

export const orderSchema = z.object({
  // STEP 1 - Client & Order Type (Already have these)
  clientName: z.string().min(2, "Имя обязательно"),
  phone: z.string().min(10, "Номер обязателен"),
  whatsApp: z.string().optional(),
  city: z.string().min(2, "Город обязателен"),
  address: z.string().optional(),
  orderType: z.enum(["Стандартный", "Парный", "Семейный", "Срочный", "VIP"]),

  // STEP 1 - Product Parameters (NEW)
  productModel: z.string().min(1, "Модель обязательна"),
  itemQuantity: z.string().default("1"), // String because input is text
  modelPhotoUri: z.string().optional(), // Move this from Step 2 -> Step 1

  // STEP 2 - Tailoring Details (NEW)
  fabricColor: z.string().min(1, "Цвет ткани обязателен"),
  colorConfirmed: z.boolean().default(false), // Checkbox
  fabricType: z.string().optional(),
  ornamentType: z.string().optional(),
  embroideryColor: z.string().optional(),
  ornamentPosition: z
    .enum(["ворот", "рукав", "карман", "подол", "другое"])
    .optional(),

  // STEP 2 - Measurements (Already have these)
  measurements: z
    .object({
      height: z.string().min(1),
      chest: z.string().min(1),
      waist: z.string().min(1),
      hips: z.string().min(1),
      sleeve: z.string().min(1),
      length: z.string().min(1),
    })
    .optional(),
  measurementMethod: z.enum(["клиент самостоятельно", "мастер KuDAGI"]),

  // STEP 3 - Dates & Summary
  orderDate: z.date().default(new Date()),
  requiredDate: z.date().optional(),
  occasion: z.string().optional(),
  datesConfirmed: z.boolean().default(false),

  // STEP 3 - Payment & Terms (NEW)
  paymentMethod: z.enum([
    "Kaspi Перевод",
    "Kaspi QR",
    "Банковский перевод",
    "Наличные",
  ]),
  totalPrice: z.string().min(1, "Стоимость обязательна"), // Total cost *is* user input
  agreedToTerms: z
    .boolean()
    .refine((val) => val === true, "Согласие обязательно"),
});

export type OrderFormData = z.infer<typeof orderSchema>;
