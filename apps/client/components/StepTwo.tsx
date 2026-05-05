import { View, Text, Pressable, Image, ActivityIndicator } from "react-native";
import { Control, Controller, useWatch } from "react-hook-form";
import { Camera } from "lucide-react-native";
import { InputField } from "./ui/InputField";
import { SectionLabel } from "./ui/SectionLabel";
import { ChipSelector } from "./ui/ChipSelector";
import { OrnamentCarousel } from "./ui/OrnamentCarousel";
import { MultiChipSelector } from "./ui/MultiChipSelector";
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

/** Ornament + position selectors for a single person, using direct value/onChange */
const PersonOrnamentBlock = ({
  control,
  personPrefix,
  ornamentList,
  getOrnamentImage,
  positions,
  t,
}: {
  control: Control<any>;
  personPrefix: "p1" | "p2";
  ornamentList: any[];
  getOrnamentImage: (type: string) => any;
  positions: string[];
  t: any;
}) => (
  <View>
    <Text style={{ fontSize: 12, color: "#6B7280", marginBottom: 6 }}>{t.ornamentType}</Text>
    <Controller
      control={control}
      name={`${personPrefix}OrnamentType` as any}
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
    <Text style={{ fontSize: 12, color: "#6B7280", marginTop: 10, marginBottom: 6 }}>{t.ornamentPosition}</Text>
    <Controller
      control={control}
      name={`${personPrefix}OrnamentPosition` as any}
      defaultValue={[]}
      render={({ field: { onChange, value } }) => (
        <View style={{ flexDirection: "row", flexWrap: "wrap" }}>
          {positions.map((opt: string) => {
            const isSelected = (value ?? []).includes(opt);
            return (
              <Pressable
                key={opt}
                onPress={() => {
                  if (isSelected) onChange((value ?? []).filter((v: string) => v !== opt));
                  else onChange([...(value ?? []), opt]);
                }}
                style={{
                  marginRight: 8, marginBottom: 8,
                  paddingHorizontal: 14, paddingVertical: 8,
                  borderRadius: 12, borderWidth: 1,
                  borderColor: isSelected ? KU_GOLD : "#F3F4F6",
                  backgroundColor: isSelected ? `${KU_GOLD}1A` : "white",
                }}
              >
                <Text style={{ color: isSelected ? KU_GOLD : "#9CA3AF", fontWeight: isSelected ? "700" : "400" }}>
                  {opt}
                </Text>
              </Pressable>
            );
          })}
        </View>
      )}
    />
  </View>
);

export const StepTwo = ({
  t, control, lang,
  ornamentList, getOrnamentImage,
  photoUploading, referencePhoto, pickPhoto, setReferencePhoto,
}: StepTwoProps) => {
  const currentGarmentModels   = lang === "kaz" ? GARMENT_MODELS_T.kaz   : GARMENT_MODELS_T.rus;
  const currentOrnamentPositions = lang === "kaz" ? ORNAMENT_POSITIONS_T.kaz : ORNAMENT_POSITIONS_T.rus;

  const orderType = useWatch({ control, name: "orderType", defaultValue: "Стандартный" });
  const isPaired  = orderType === "Парный";

  return (
    <View>
      <Text className="text-3xl font-bold mb-1">{t.newOrder}</Text>
      <Text className="text-gray-400 mb-6">{t.step2title}</Text>

      <SectionLabel>{t.fabricColor}</SectionLabel>
      <InputField control={control} name="fabricColor" placeholder={t.fabricColor} />

      <SectionLabel>{t.fabricType}</SectionLabel>
      <InputField control={control} name="fabricType" placeholder={t.fabricType} />

      {isPaired ? (
        /* ── PAIRED: two person blocks ── */
        <View>
          {(["p1", "p2"] as const).map((prefix, idx) => (
            <View
              key={prefix}
              style={{
                borderWidth: 1, borderColor: "#E5E7EB",
                borderRadius: 16, padding: 14, marginBottom: 16,
              }}
            >
              {/* Person header */}
              <View style={{ flexDirection: "row", alignItems: "center", marginBottom: 12 }}>
                <View style={{
                  backgroundColor: KU_GOLD, borderRadius: 8,
                  paddingHorizontal: 10, paddingVertical: 4, marginRight: 8,
                }}>
                  <Text style={{ color: "white", fontWeight: "700", fontSize: 12 }}>
                    {idx + 1}
                  </Text>
                </View>
                <Text style={{ fontWeight: "600", color: "#374151", fontSize: 15 }}>
                  {lang === "kaz"
                    ? (idx === 0 ? "1-ші адам" : "2-ші адам")
                    : (idx === 0 ? "Человек 1" : "Человек 2")}
                </Text>
              </View>

              {/* Garment model */}
              <Text style={{ fontSize: 12, color: "#6B7280", marginBottom: 6 }}>{t.garmentModel}</Text>
              <ChipSelector
                control={control}
                name={`${prefix}GarmentModel`}
                options={currentGarmentModels}
              />

              {/* Ornaments */}
              <PersonOrnamentBlock
                control={control}
                personPrefix={prefix}
                ornamentList={ornamentList}
                getOrnamentImage={getOrnamentImage}
                positions={currentOrnamentPositions}
                t={t}
              />
            </View>
          ))}
        </View>
      ) : (
        /* ── STANDARD: single garment + ornaments ── */
        <View>
          <SectionLabel>{t.garmentModel}</SectionLabel>
          <ChipSelector control={control} name="garmentModel" options={currentGarmentModels} />

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
