import { View, Text, Pressable, Image, ActivityIndicator } from "react-native";
import { Control } from "react-hook-form";
import { Camera } from "lucide-react-native";

// UI Components
import { InputField } from "./ui/InputField";
import { SectionLabel } from "./ui/SectionLabel";
import { ChipSelector } from "./ui/ChipSelector";
import { OrnamentCarousel } from "./ui/OrnamentCarousel";

// Constants
import { GARMENT_MODELS, ORNAMENT_POSITIONS } from "@/constants/orderConstants";
import { GARMENT_MODELS_T, ORNAMENT_POSITIONS_T } from "@/constants/translations";

interface StepTwoProps {
  t: any;
  control: Control<any>;
  lang: any;
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
  lang,
  ornamentList,
  getOrnamentImage,
  photoUploading,
  referencePhoto,
  pickPhoto,
  setReferencePhoto,
}: StepTwoProps) => {
  const currentGarmentModels = lang === "kaz" ? GARMENT_MODELS_T.kaz : GARMENT_MODELS_T.rus;
  const currentOrnamentPositions = lang === "kaz" ? ORNAMENT_POSITIONS_T.kaz : ORNAMENT_POSITIONS_T.rus;


  return (
    <View>
      <Text className="text-3xl font-bold mb-1">{t.newOrder}</Text>
      <Text className="text-gray-400 mb-6">{t.step2title}</Text>

      <SectionLabel>{t.garmentModel}</SectionLabel>
      <ChipSelector control={control} name="garmentModel" options={currentGarmentModels} />

      <SectionLabel>{t.quantity}</SectionLabel>
      <InputField
        control={control}
        name="quantity"
        placeholder="1"
        keyboardType="numeric"
        rules={{ required: t.errorRequired, min: { value: 1, message: t.errorQty } }}
      />

      <SectionLabel>{t.fabricColor}</SectionLabel>
      <InputField control={control} name="fabricColor" placeholder={t.fabricColor}/>

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
      <ChipSelector control={control} name="ornamentPosition" options={currentOrnamentPositions} />

      <SectionLabel>{t.embroideryColor}</SectionLabel>
      <InputField control={control} name="embroideryColor" placeholder={t.embroideryColor} />

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
              <Text className="text-gray-400 text-sm mt-2">{t.photoUploading}</Text>
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
              <Text className="text-gray-400 text-sm mt-2">{t.tapToAttach}</Text>
              <Text className="text-gray-300 text-xs mt-1">{t.optional}</Text>
            </View>
          )}
      </Pressable>

      {referencePhoto && (
        <Pressable onPress={() => setReferencePhoto(null)} className="self-center mb-4">
            <Text className="text-red-400 text-sm">{t.removePhoto}</Text>
          </Pressable>
      )}
    </View>
  );
};
