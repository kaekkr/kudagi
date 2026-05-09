import { View, Text, Pressable, Image, ActivityIndicator, ScrollView } from "react-native";
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

/** { type: string, positions: string[] }[] — one entry per selected ornament type */
type OrnamentEntry = { type: string; positions: string[] };

/**
 * Paired ornament block.
 * Carousel to pick ornament types → summary table below each selected type
 * showing position buttons. Tap a position → adds/removes it for that type only.
 */
const PairedOrnamentBlock = ({
  value,
  onChange,
  ornamentList,
  getOrnamentImage,
  positions,
  t,
}: {
  value: OrnamentEntry[];
  onChange: (val: OrnamentEntry[]) => void;
  ornamentList: string[];
  getOrnamentImage: (type: string) => any;
  positions: string[];
  t: any;
}) => {
  const selectedTypes = value.map((e) => e.type);

  const handleTypeToggle = (type: string) => {
    const exists = value.find((e) => e.type === type);
    if (exists) {
      // Deselect — remove the whole entry
      onChange(value.filter((e) => e.type !== type));
    } else {
      // Select — add entry with empty positions
      onChange([...value, { type, positions: [] }]);
    }
  };

  const handlePositionToggle = (type: string, position: string) => {
    onChange(
      value.map((e) => {
        if (e.type !== type) return e;
        const hasPos = e.positions.includes(position);
        return {
          ...e,
          positions: hasPos
            ? e.positions.filter((p) => p !== position)
            : [...e.positions, position],
        };
      })
    );
  };

  return (
    <View>
      {/* ── Ornament type carousel ── */}
      <Text style={{ fontSize: 12, color: "#6B7280", marginBottom: 6 }}>{t.ornamentType}</Text>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: 4 }}
        style={{ paddingVertical: 8 }}
        nestedScrollEnabled
        directionalLockEnabled
        keyboardShouldPersistTaps="handled"
      >
        {ornamentList.map((type) => {
          const isSelected = selectedTypes.includes(type);
          return (
            <Pressable
              key={type}
              onPress={() => handleTypeToggle(type)}
              delayPressIn={50}
              style={{ marginRight: 14, alignItems: "center", width: 88 }}
            >
              <View style={{
                width: 88, height: 88, borderRadius: 16,
                overflow: "hidden", borderWidth: 2, marginBottom: 6,
                borderColor: isSelected ? KU_GOLD : "#F3F4F6",
              }}>
                <Image
                  source={getOrnamentImage(type)}
                  style={{ width: "100%", height: "100%" }}
                  resizeMode="cover"
                />
                {isSelected && (
                  <View style={{
                    position: "absolute", top: 6, right: 6,
                    backgroundColor: KU_GOLD, borderRadius: 10,
                    width: 20, height: 20, alignItems: "center", justifyContent: "center",
                  }}>
                    <Text style={{ color: "white", fontSize: 10 }}>✓</Text>
                  </View>
                )}
              </View>
              <Text numberOfLines={1} style={{
                fontSize: 11, textAlign: "center", width: "100%",
                color: isSelected ? KU_GOLD : "#9CA3AF",
                fontWeight: isSelected ? "700" : "400",
              }}>
                {type}
              </Text>
            </Pressable>
          );
        })}
      </ScrollView>

      {/* ── Summary table: one row per selected type ── */}
      {value.length > 0 && (
        <View style={{ marginTop: 12, gap: 8 }}>
          {value.map((entry) => (
            <View
              key={entry.type}
              style={{
                backgroundColor: "#F9FAFB",
                borderRadius: 12,
                padding: 10,
                borderWidth: 1,
                borderColor: "#E5E7EB",
              }}
            >
              {/* Type label */}
              <View style={{ flexDirection: "row", alignItems: "center", marginBottom: 8 }}>
                <View style={{
                  backgroundColor: KU_GOLD, borderRadius: 6,
                  paddingHorizontal: 8, paddingVertical: 3, marginRight: 8,
                }}>
                  <Text style={{ color: "white", fontSize: 11, fontWeight: "700" }}>
                    {entry.type}
                  </Text>
                </View>
                {entry.positions.length === 0 && (
                  <Text style={{ fontSize: 11, color: "#D1D5DB" }}>
                    {t.ornamentPosition}...
                  </Text>
                )}
              </View>

              {/* Position buttons — tap to add, tap again to remove */}
              <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 6 }}>
                {positions.map((pos) => {
                  const active = entry.positions.includes(pos);
                  return (
                    <Pressable
                      key={pos}
                      onPress={() => handlePositionToggle(entry.type, pos)}
                      style={{
                        paddingHorizontal: 12, paddingVertical: 6,
                        borderRadius: 20, borderWidth: 1,
                        borderColor: active ? KU_GOLD : "#E5E7EB",
                        backgroundColor: active ? `${KU_GOLD}18` : "white",
                      }}
                    >
                      <Text style={{
                        fontSize: 12,
                        color: active ? KU_GOLD : "#6B7280",
                        fontWeight: active ? "600" : "400",
                      }}>
                        {active ? `${pos} ×` : pos}
                      </Text>
                    </Pressable>
                  );
                })}
              </View>
            </View>
          ))}
        </View>
      )}
    </View>
  );
};

/** Ornament block for a single person in paired order */
const PersonOrnamentSection = ({
  control,
  personPrefix,
  ornamentList,
  getOrnamentImage,
  positions,
  t,
}: {
  control: Control<any>;
  personPrefix: "p1" | "p2";
  ornamentList: string[];
  getOrnamentImage: (type: string) => any;
  positions: string[];
  t: any;
}) => (
  <Controller
    control={control}
    name={`${personPrefix}Ornaments` as any}
    defaultValue={[]}
    render={({ field: { onChange, value } }) => (
      <PairedOrnamentBlock
        value={value ?? []}
        onChange={onChange}
        ornamentList={ornamentList}
        getOrnamentImage={getOrnamentImage}
        positions={positions}
        t={t}
      />
    )}
  />
);

export const StepTwo = ({
  t, control, lang,
  ornamentList, getOrnamentImage,
  photoUploading, referencePhoto, pickPhoto, setReferencePhoto,
}: StepTwoProps) => {
  const currentGarmentModels     = lang === "kaz" ? GARMENT_MODELS_T.kaz     : GARMENT_MODELS_T.rus;
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
        /* ── PAIRED: two person cards ── */
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
                  <Text style={{ color: "white", fontWeight: "700", fontSize: 12 }}>{idx + 1}</Text>
                </View>
                <Text style={{ fontWeight: "600", color: "#374151", fontSize: 15 }}>
                  {lang === "kaz"
                    ? (idx === 0 ? "1-ші адам" : "2-ші адам")
                    : (idx === 0 ? "Человек 1" : "Человек 2")}
                </Text>
              </View>

              {/* Garment model */}
              <Text style={{ fontSize: 12, color: "#6B7280", marginBottom: 6 }}>{t.garmentModel}</Text>
              <ChipSelector control={control} name={`${prefix}GarmentModel`} options={currentGarmentModels} />

              {/* Ornaments with inline position picker */}
              <PersonOrnamentSection
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
        /* ── STANDARD ── */
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
