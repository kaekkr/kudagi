import { View, Text, Pressable, Image, ActivityIndicator } from "react-native";
import { Control } from "react-hook-form";
import { Camera } from "lucide-react-native";

// UI Components
import { InputField } from "./ui/InputField";
import { SectionLabel } from "./ui/SectionLabel";
import { ChipSelector } from "./ui/ChipSelector";
import { OrnamentCarousel } from "./ui/OrnamentCarousel";
import { Checkbox } from "./ui/Checkbox";

// Constants
import { GARMENT_MODELS, ORNAMENT_POSITIONS } from "@/constants/orderConstants";

interface StepTwoProps {
  t: any;
  control: Control<any>;
  // Asset Props
  ornamentList: any[];
  getOrnamentImage: (type: string) => any;
  // Photo Props
  photoUploading: boolean;
  referencePhoto: string | null;
  pickPhoto: () => Promise<void>;
  setReferencePhoto: (uri: string | null) => void;
}

export const StepTwo = ({
  t,
  control,
  ornamentList,
  getOrnamentImage,
  photoUploading,
  referencePhoto,
  pickPhoto,
  setReferencePhoto,
}: StepTwoProps) => {
  return (
    <View>
      <Text className="text-3xl font-bold mb-1">{t.newOrder}</Text>
      <Text className="text-gray-400 mb-6">{t.step2title}</Text>

      <SectionLabel>{t.garmentModel}</SectionLabel>
      <ChipSelector control={control} name="garmentModel" options={GARMENT_MODELS} />

      <SectionLabel>{t.quantity}</SectionLabel>
      <InputField
        control={control}
        name="quantity"
        placeholder="1"
        keyboardType="numeric"
        rules={{ required: t.errorRequired, min: { value: 1, message: t.errorQty } }}
      />

      <SectionLabel>{t.fabricColor}</SectionLabel>
      <InputField control={control} name="fabricColor" placeholder={t.fabricColor} rules={{ required: t.errorColor }} />

      <SectionLabel>{t.fabricType}</SectionLabel>
      <InputField control={control} name="fabricType" placeholder={t.fabricType} />

      <SectionLabel>{t.ornamentType}</SectionLabel>
      <OrnamentCarousel
        control={control}
        name="ornamentType"
        ornamentList={ornamentList}
        getOrnamentImage={getOrnamentImage}
      />

      <SectionLabel>{t.ornamentPosition}</SectionLabel>
      <ChipSelector control={control} name="ornamentPosition" options={ORNAMENT_POSITIONS} />

      <SectionLabel>{t.embroideryColor}</SectionLabel>
      <InputField control={control} name="embroideryColor" placeholder={t.embroideryColor} rules={{ required: t.errorThread }} />

      <Checkbox control={control} name="colorConfirmed" text={t.confirmColor} rules={{ required: t.errorConfirmColor }} />

      {/* Reference Photo Section */}
      <SectionLabel>{t.referencePhoto}</SectionLabel>
      <Pressable
        onPress={pickPhoto}
        disabled={photoUploading}
        className="border-2 border-dashed border-gray-200 rounded-2xl p-5 items-center mb-4"
      >
        {photoUploading ? (
          <View className="items-center py-4">
            <ActivityIndicator color="#C5A059" />
            <Text className="text-gray-400 text-sm mt-2">Загрузка фото...</Text>
          </View>
        ) : referencePhoto ? (
          <Image
            source={{ uri: referencePhoto }}
            style={{ width: "100%", height: 180, borderRadius: 12 }}
            resizeMode="cover"
          />
        ) : (
          <View className="items-center">
            <Camera size={32} color="#C1C1C1" />
            <Text className="text-gray-400 text-sm mt-2">Нажмите, чтобы прикрепить фото</Text>
            <Text className="text-gray-300 text-xs mt-1">Необязательно</Text>
          </View>
        )}
      </Pressable>

      {referencePhoto && (
        <Pressable onPress={() => setReferencePhoto(null)} className="self-center mb-4">
          <Text className="text-red-400 text-sm">Удалить фото</Text>
        </Pressable>
      )}
    </View>
  );
};
