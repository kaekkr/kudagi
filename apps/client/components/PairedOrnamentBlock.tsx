import { View, Text, Pressable, Image, ScrollView, TextInput } from "react-native";
import { useState } from "react";

type OrnamentEntry = {
  type: string;
  positions: string[];
  customPosition?: string;
};

const OTHER_VALUES = ["Другое", "Басқа"];

export const PairedOrnamentBlock = ({
  value,
  onChange,
  ornamentList,
  getOrnamentImage,
  positions,
  t,
}: any) => {
  const [openType, setOpenType] = useState<string | null>(null);
  const safeValue: OrnamentEntry[] = value ?? [];
  const selectedTypes = safeValue.map((e) => e.type);

  const handleTypeToggle = (type: string) => {
    const exists = safeValue.find((e) => e.type === type);
    if (exists) {
      onChange(safeValue.filter((e) => e.type !== type));
    } else {
      onChange([...safeValue, { type, positions: [], customPosition: "" }]);
      setOpenType(type);
    }
  };

  const handlePositionToggle = (type: string, pos: string) => {
    onChange(
      safeValue.map((e) => {
        if (e.type !== type) return e;
        const has = e.positions.includes(pos);
        return {
          ...e,
          positions: has
            ? e.positions.filter((p) => p !== pos)
            : [...e.positions, pos],
        };
      })
    );
  };

  const handleCustomPosition = (type: string, text: string) => {
    onChange(
      safeValue.map((e) =>
        e.type === type ? { ...e, customPosition: text } : e
      )
    );
  };

  return (
    <View>
      <Text style={{ fontSize: 12, color: "#6B7280", marginBottom: 8 }}>
        {t.ornamentType}
      </Text>

      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginBottom: 10 }}>
        <View style={{ flexDirection: "row", gap: 10 }}>
          {ornamentList.map((type: string) => {
            const active = selectedTypes.includes(type);
            const imgSource = getOrnamentImage(type);
            return (
              <Pressable
                key={type}
                onPress={() => handleTypeToggle(type)}
                style={{
                  padding: 8, borderRadius: 12, borderWidth: 1,
                  borderColor: active ? "#C5A059" : "#E5E7EB",
                  backgroundColor: active ? "#C5A05910" : "white",
                  alignItems: "center", width: 80,
                }}
              >
                <Image source={imgSource} style={{ width: 40, height: 40, marginBottom: 4 }} resizeMode="contain" />
                <Text numberOfLines={1} style={{
                  fontSize: 10, color: active ? "#C5A059" : "#6B7280",
                  fontWeight: active ? "600" : "400", textAlign: "center",
                }}>
                  {type}
                </Text>
              </Pressable>
            );
          })}
        </View>
      </ScrollView>

      <View style={{ marginTop: 4, gap: 10 }}>
        {safeValue.map((entry) => {
          const isOpen = openType === entry.type;
          const imgSource = getOrnamentImage(entry.type);
          const hasOther = entry.positions.some((p: string) => OTHER_VALUES.includes(p));

          return (
            <View key={entry.type} style={{ borderWidth: 1, borderColor: "#E5E7EB", borderRadius: 12, overflow: "hidden" }}>
              {/* Header */}
              <Pressable
                onPress={() => setOpenType(isOpen ? null : entry.type)}
                style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", padding: 12, backgroundColor: "#F9FAFB" }}
              >
                <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
                  <Image source={imgSource} style={{ width: 24, height: 24 }} resizeMode="contain" />
                  <Text style={{ fontWeight: "600", color: "#374151" }}>{entry.type}</Text>
                </View>
                <Text style={{ color: "#9CA3AF" }}>{isOpen ? "▲" : "▼"}</Text>
              </Pressable>

              {isOpen && (
                <View style={{ padding: 12 }}>
                  {/* Preview */}
                  <View style={{ backgroundColor: "#fff", borderRadius: 8, padding: 10, marginBottom: 12, alignItems: "center", borderWidth: 1, borderColor: "#F3F4F6" }}>
                    <Image source={imgSource} style={{ width: "100%", height: 120 }} resizeMode="contain" />
                  </View>

                  <Text style={{ fontSize: 11, color: "#9CA3AF", marginBottom: 8 }}>
                    {t.ornamentPosition}
                  </Text>

                  <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 8 }}>
                    {positions.map((pos: string) => {
                      const active = entry.positions.includes(pos);
                      return (
                        <Pressable
                          key={pos}
                          onPress={() => handlePositionToggle(entry.type, pos)}
                          style={{
                            paddingHorizontal: 12, paddingVertical: 6, borderRadius: 20, borderWidth: 1,
                            borderColor: active ? "#C5A059" : "#E5E7EB",
                            backgroundColor: active ? "#C5A05915" : "white",
                          }}
                        >
                          <Text style={{ fontSize: 12, color: active ? "#C5A059" : "#6B7280" }}>
                            {pos} {active ? "✓" : ""}
                          </Text>
                        </Pressable>
                      );
                    })}
                  </View>

                  {/* Custom position input when "Другое" selected */}
                  {hasOther && (
                    <TextInput
                      value={entry.customPosition ?? ""}
                      onChangeText={(text) => handleCustomPosition(entry.type, text)}
                      placeholder="Введите своё расположение..."
                      placeholderTextColor="#C1C1C1"
                      style={{
                        marginTop: 10, borderWidth: 1, borderColor: "#C5A059",
                        borderRadius: 12, padding: 12, fontSize: 14,
                        color: "#1F2937", backgroundColor: "white",
                      }}
                    />
                  )}
                </View>
              )}
            </View>
          );
        })}
      </View>
    </View>
  );
};
