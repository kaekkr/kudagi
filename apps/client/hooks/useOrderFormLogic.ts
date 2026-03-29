import { useState } from "react";
import { Platform } from "react-native";
import * as ImagePicker from "expo-image-picker";
import { useForm } from "react-hook-form";

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

  const { control, handleSubmit, watch, reset, trigger } = useForm({
    defaultValues: {
      orderType: "Стандартный", garmentModel: "Платье", quantity: "1",
      ornamentType: "Тип 1", ornamentPosition: "Ворот",
      deliveryMethod: "Самовывоз", measurementMethod: "самостоятельно",
      paymentMethod: "Kaspi Перевод", // ... add other defaults
    },
  });

  const handleNext = async () => {
    const valid = await trigger(STEP_FIELDS[step] as any);
    if (valid) setStep((prev) => prev + 1);
  };

  const pickPhoto = async () => {
    if (Platform.OS === "web") {
      const input = document.createElement("input");
      input.type = "file";
      input.accept = "image/*";
      input.onchange = async (e: any) => {
        const file = e.target.files?.[0];
        if (!file) return;
        setPhotoUploading(true);
        try {
          const url = await uploadReferencePhoto(file);
          setReferencePhoto(url);
        } finally { setPhotoUploading(false); }
      };
      input.click();
    } else {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        quality: 0.7,
      });
      if (!result.canceled) setReferencePhoto(result.assets[0].uri);
    }
  };

  return {
    step, setStep, control, handleSubmit, watch,
    handleNext, reset, pickPhoto,
    photoUploading, referencePhoto, setReferencePhoto
  };
};
