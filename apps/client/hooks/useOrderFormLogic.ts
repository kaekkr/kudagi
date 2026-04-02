import { useState, useEffect } from "react";
import { Platform } from "react-native";
import * as ImagePicker from "expo-image-picker";
import { useForm } from "react-hook-form";
import AsyncStorage from "@react-native-async-storage/async-storage";

const STORAGE_KEY = "kudagi_order_draft";

const DEFAULT_VALUES = {
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
  ornamentPosition: "Ворот",
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

export const useOrderFormLogic = (uploadReferencePhoto: (file: any) => Promise<string>) => {
  const [step, setStep] = useState(1);
  const [photoUploading, setPhotoUploading] = useState(false);
  const [referencePhoto, setReferencePhoto] = useState<string | null>(null);
  const [hydrated, setHydrated] = useState(false);

  const { control, handleSubmit, watch, reset, trigger, getValues } = useForm({
    defaultValues: DEFAULT_VALUES,
  });

  // Restore draft on mount
  useEffect(() => {
    AsyncStorage.getItem(STORAGE_KEY).then((raw) => {
      if (raw) {
        try {
          const { savedStep, savedValues, savedPhoto } = JSON.parse(raw);
          if (savedStep) setStep(savedStep);
          if (savedValues) reset(savedValues);
          if (savedPhoto) setReferencePhoto(savedPhoto);
        } catch {}
      }
      setHydrated(true);
    });
  }, []);

  // Save draft on every change
  useEffect(() => {
    if (!hydrated) return;
    const subscription = watch((values) => {
      AsyncStorage.setItem(STORAGE_KEY, JSON.stringify({
        savedStep: step,
        savedValues: values,
        savedPhoto: referencePhoto,
      }));
    });
    return () => subscription.unsubscribe();
  }, [watch, step, referencePhoto, hydrated]);

  // Also save when step changes (watch won't catch that)
  useEffect(() => {
    if (!hydrated) return;
    AsyncStorage.setItem(STORAGE_KEY, JSON.stringify({
      savedStep: step,
      savedValues: getValues(),
      savedPhoto: referencePhoto,
    }));
  }, [step, hydrated]);

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
      } catch (e) {
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
        } catch (e) {
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
    AsyncStorage.removeItem(STORAGE_KEY); // ← clear draft on intentional reset
  };

  return {
    step, setStep, control, handleSubmit, watch,
    handleNext, reset: resetAll, pickPhoto,
    photoUploading, referencePhoto, setReferencePhoto,
    hydrated, // ← export this so OrderForm can show a loader while restoring
  };
};
