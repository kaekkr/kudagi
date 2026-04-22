import { useState, useEffect } from "react";
import { Platform } from "react-native";
import * as ImagePicker from "expo-image-picker";
import { useForm } from "react-hook-form";
import AsyncStorage from "@react-native-async-storage/async-storage";

const STORAGE_KEY = "kudagi_order_draft";

export const DEFAULT_VALUES = {
  clientName: "",
  phone: "",
  whatsApp: "",
  city: "",
  address: "",
  contactPerson: "",
  orderType: "Стандартный",
  garmentModel: "Платье",
  quantity: "1",
  fabricColor: "",
  fabricType: "",
  ornamentType: [],
  ornamentPosition: [],
  // Per-garment ornaments: array of { ornamentType: string[], ornamentPosition: string[] }
  // Indexed by garment item (0-based). Populated dynamically based on quantity.
  garmentOrnaments: [] as { ornamentType: string[]; ornamentPosition: string[] }[],
  embroideryColor: "",
  colorConfirmed: false,
  occasion: "Праздник",
  desiredDate: "",
  deadlineConfirmed: false,
  deliveryMethod: "Самовывоз",
  measurementMethod: "самостоятельно",
  chest: "", waist: "", hips: "", height: "",
  chestHeight: "", backWidth: "", frontLength: "",
  backLength: "", shoulderLength: "", skirtLength: "",
  garmentLength: "", armCircumference: "", sleeveLength: "",
  neckCircumference: "", comment: "",
  confirmData: false,
  paymentMethod: "Kaspi Перевод",
  agreedToTerms: false,
  consentedToData: false,
};

const STEP_FIELDS: Record<number, string[]> = {
  1: ["clientName", "phone", "city"],
  2: ["quantity", "fabricColor", "embroideryColor", "colorConfirmed"],
  3: ["desiredDate", "deadlineConfirmed", "confirmData"],
  4: ["agreedToTerms", "consentedToData"],
};

/**
 * Validates a date string in dd.mm.yyyy format.
 * Year must be between 2000 and 2090.
 */
export function validateDate(value: string): true | string {
  if (!value || value.length < 10) return "Введите дату в формате дд.мм.гггг";
  const parts = value.split(".");
  if (parts.length !== 3) return "Неверный формат даты";
  const [dd, mm, yyyy] = parts.map(Number);
  if (isNaN(dd) || isNaN(mm) || isNaN(yyyy)) return "Неверный формат даты";
  if (yyyy < 2000 || yyyy > 2090) return "Год должен быть от 2000 до 2090";
  if (mm < 1 || mm > 12) return "Неверный месяц";
  if (dd < 1 || dd > 31) return "Неверный день";
  return true;
}

export const useOrderFormLogic = (uploadReferencePhoto: (file: any) => Promise<string>) => {
  const [step, setStep] = useState(1);
  const [photoUploading, setPhotoUploading] = useState(false);
  const [referencePhoto, setReferencePhoto] = useState<string | null>(null);
  const [hydrated, setHydrated] = useState(false);

  const { control, handleSubmit, watch, reset, trigger, getValues } = useForm({
    defaultValues: DEFAULT_VALUES,
  });

  // Restore draft on mount — always start at step 1 to prevent accidental re-submit
  useEffect(() => {
    AsyncStorage.getItem(STORAGE_KEY).then((raw) => {
      if (raw) {
        try {
          const { savedValues, savedPhoto } = JSON.parse(raw);
          // Note: savedStep is intentionally ignored — always start at step 1
          if (savedValues) reset(savedValues);
          if (savedPhoto) setReferencePhoto(savedPhoto);
        } catch {}
      }
      setHydrated(true);
    });
  }, []);

  // Save draft when step changes
  useEffect(() => {
    if (!hydrated) return;
    AsyncStorage.setItem(STORAGE_KEY, JSON.stringify({
      savedStep: step, // kept for reference but not restored
      savedValues: getValues(),
      savedPhoto: referencePhoto,
    }));
  }, [step, hydrated]);

  // Save draft when form values change
  useEffect(() => {
    if (!hydrated) return;

    const subscription = watch((values) => {
      if (JSON.stringify(values) === JSON.stringify(DEFAULT_VALUES)) return;

      AsyncStorage.setItem(STORAGE_KEY, JSON.stringify({
        savedStep: step,
        savedValues: values,
        savedPhoto: referencePhoto,
      }));
    });

    return () => subscription.unsubscribe();
  }, [watch, step, referencePhoto, hydrated]);

  const handleNext = async () => {
    const valid = await trigger(STEP_FIELDS[step] as any);
    if (valid) setStep((prev) => prev + 1);
  };

  const pickPhoto = async () => {
    if (Platform.OS === "web") {
      const input = document.createElement("input");
      input.type = "file";
      input.accept = "image/*";

      const file: File = await new Promise((resolve) => {
        input.onchange = (e: any) => resolve(e.target.files?.[0]);
        input.click();
      });

      if (!file) return;

      setPhotoUploading(true);
      try {
        const url = await uploadReferencePhoto(file);
        setReferencePhoto(url);
      } catch {
        alert("Ошибка загрузки в облако");
      } finally {
        setPhotoUploading(false);
      }
    } else {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        quality: 0.7,
      });

      if (!result.canceled) {
        setPhotoUploading(true);
        try {
          const asset = result.assets[0];
          const response = await fetch(asset.uri);
          const blob = await response.blob();
          const url = await uploadReferencePhoto(blob);
          setReferencePhoto(url);
        } catch {
          alert("Ошибка загрузки в облако");
        } finally {
          setPhotoUploading(false);
        }
      }
    }
  };

  const resetAll = () => {
    reset(DEFAULT_VALUES);
    setStep(1);
    setReferencePhoto(null);
    setPhotoUploading(false);
    AsyncStorage.removeItem(STORAGE_KEY);
  };

  return {
    step, setStep, control, handleSubmit, watch,
    handleNext, reset: resetAll, pickPhoto,
    photoUploading, referencePhoto, setReferencePhoto,
    hydrated,
  };
};
