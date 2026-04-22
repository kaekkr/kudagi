import { View, Text, Pressable, Image, ActivityIndicator } from "react-native";
import { Control, Controller, useWatch } from "react-hook-form";
import { Camera } from "lucide-react-native";
// UI Components
import { InputField } from "./ui/InputField";
import { SectionLabel } from "./ui/SectionLabel";
import { ChipSelector } from "./ui/ChipSelector";
import { OrnamentCarousel } from "./ui/OrnamentCarousel";
import { MultiChipSelector } from "./ui/MultiChipSelector";
// Constants
import { GARMENT_MODELS_T, ORNAMENT_POSITIONS_T } from "@/constants/translations";
import { KU_GOLD } from "@/constants/orderConstants";

interface StepTwoProps {
  t: any;
  control: Control<any>;
  lang: any;
  ornamentList: any[];
  getOrnamentImage: (type: string) => any;
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

  // Watch quantity to show per-garment ornament sections
  const rawQuantity = useWatch({ control, name: "quantity", defaultValue: "1" });
  const quantity = Math.max(1, parseInt(rawQuantity) || 1);
  const isMultiple = quantity > 1;

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
      <InputField control={control} name="fabricColor" placeholder={t.fabricColor} />

      <SectionLabel>{t.fabricType}</SectionLabel>
      <InputField control={control} name="fabricType" placeholder={t.fabricType} />

      {/* ── Ornament selection ── */}
      {isMultiple ? (
        // Per-garment ornament selection
        <View>
          {Array.from({ length: quantity }).map((_, i) => (
            <View
              key={i}
              style={{
                borderWidth: 1,
                borderColor: "#E5E7EB",
                borderRadius: 16,
                padding: 14,
                marginBottom: 14,
              }}
            >
              {/* Garment item header */}
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  marginBottom: 10,
                }}
              >
                <View
                  style={{
                    backgroundColor: KU_GOLD,
                    borderRadius: 8,
                    paddingHorizontal: 10,
                    paddingVertical: 4,
                    marginRight: 8,
                  }}
                >
                  <Text style={{ color: "white", fontWeight: "700", fontSize: 12 }}>
                    #{i + 1}
                  </Text>
                </View>
                <Text style={{ fontWeight: "600", color: "#374151" }}>
                  {lang === "kaz" ? `${i + 1}-ші бұйым` : `Изделие ${i + 1}`}
                </Text>
              </View>

              {/* Ornament type for this garment */}
              <Text style={{ fontSize: 12, color: "#6B7280", marginBottom: 6 }}>
                {t.ornamentType}
              </Text>
              <Controller
                control={control}
                name={`garmentOrnaments.${i}.ornamentType` as any}
                defaultValue={[]}
                render={({ field: { onChange, value } }) => (
                  <OrnamentCarousel
                    value={value}
                    onChange={onChange}
                    ornamentList={ornamentList}
                    getOrnamentImage={getOrnamentImage}
                  />
                )}
              />

              {/* Ornament position for this garment */}
              <Text style={{ fontSize: 12, color: "#6B7280", marginTop: 10, marginBottom: 6 }}>
                {t.ornamentPosition}
              </Text>
              <Controller
                control={control}
                name={`garmentOrnaments.${i}.ornamentPosition` as any}
                defaultValue={[]}
                render={({ field: { onChange, value } }) => (
                  <View className="flex-row flex-wrap">
                    {currentOrnamentPositions.map((opt: string) => {
                      const isSelected = (value ?? []).includes(opt);
                      return (
                        <Pressable
                          key={opt}
                          onPress={() => {
                            if (isSelected) {
                              onChange((value ?? []).filter((v: string) => v !== opt));
                            } else {
                              onChange([...(value ?? []), opt]);
                            }
                          }}
                          style={{
                            marginRight: 8,
                            marginBottom: 8,
                            paddingHorizontal: 14,
                            paddingVertical: 8,
                            borderRadius: 12,
                            borderWidth: 1,
                            borderColor: isSelected ? KU_GOLD : "#F3F4F6",
                            backgroundColor: isSelected ? `${KU_GOLD}1A` : "white",
                          }}
                        >
                          <Text
                            style={{
                              color: isSelected ? KU_GOLD : "#9CA3AF",
                              fontWeight: isSelected ? "700" : "400",
                            }}
                          >
                            {opt}
                          </Text>
                        </Pressable>
                      );
                    })}
                  </View>
                )}
              />
            </View>
          ))}
        </View>
      ) : (
        // Single garment — original flat selectors
        <View>
          <SectionLabel>{t.ornamentType}</SectionLabel>
          <OrnamentCarousel
            control={control}
            name="ornamentType"
            ornamentList={ornamentList}
            getOrnamentImage={getOrnamentImage}
          />
          <SectionLabel>{t.ornamentPosition}</SectionLabel>
          <MultiChipSelector
            control={control}
            name="ornamentPosition"
            options={currentOrnamentPositions}
          />
        </View>
      )}

      <SectionLabel>{t.embroideryColor}</SectionLabel>
      <InputField control={control} name="embroideryColor" placeholder={t.embroideryColor} />

      {/* Reference Photo */}
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
