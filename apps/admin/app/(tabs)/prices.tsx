import { useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  ScrollView,
  Pressable,
  ActivityIndicator,
  Alert,
  Image,
} from "react-native";
import { usePriceStore, ProductPrice, OrnamentPrice } from "@kudagi/core";

type Category = "garments" | "ornaments";

// ── Reusable price row ────────────────────────────────────────────────────────

function PriceRow({
  id,
  label,
  imageUrl,
  currentPrice,
  onSave,
}: {
  id: string;
  label: string;
  imageUrl?: string;
  currentPrice: number;
  onSave: (id: string, val: number) => Promise<void>;
}) {
  const [draft,   setDraft]   = useState(String(currentPrice));
  const [saving,  setSaving]  = useState(false);

  // Keep in sync if parent refreshes
  useEffect(() => { setDraft(String(currentPrice)); }, [currentPrice]);

  const isDirty = draft !== String(currentPrice);

  const handleSave = async () => {
    const val = Number(draft);
    if (isNaN(val) || val < 0) { Alert.alert("Ошибка", "Введите корректную цену"); return; }
    setSaving(true);
    try { await onSave(id, val); } finally { setSaving(false); }
  };

  return (
    <View style={{
      backgroundColor: "white", borderRadius: 16, padding: 16,
      marginBottom: 12, shadowColor: "#000", shadowOpacity: 0.04, shadowRadius: 4,
    }}>
      <View style={{ flexDirection: "row", alignItems: "center", marginBottom: 12 }}>
        {imageUrl ? (
          <Image
            source={{ uri: imageUrl }}
            style={{ width: 44, height: 44, borderRadius: 10, marginRight: 12, backgroundColor: "#F3F4F6" }}
            resizeMode="cover"
          />
        ) : null}
        <Text style={{ fontSize: 15, fontWeight: "700", color: "#111827", flex: 1 }}>{label}</Text>
      </View>

      <View style={{ flexDirection: "row", alignItems: "center" }}>
        <View style={{ backgroundColor: "#F3F4F6", borderRadius: 10, paddingHorizontal: 12, paddingVertical: 10, marginRight: 8 }}>
          <Text style={{ color: "#6B7280", fontSize: 13 }}>От</Text>
        </View>
        <TextInput
          value={draft}
          onChangeText={(t) => setDraft(t.replace(/[^0-9]/g, ""))}
          keyboardType="numeric"
          style={{
            flex: 1, borderWidth: 1,
            borderColor: isDirty ? "#C5A059" : "#F3F4F6",
            borderRadius: 10, padding: 10,
            fontSize: 16, fontWeight: "600", color: "#111827",
          }}
          placeholder="0"
          placeholderTextColor="#C1C1C1"
        />
        <View style={{ backgroundColor: "#F3F4F6", borderRadius: 10, paddingHorizontal: 12, paddingVertical: 10, marginLeft: 8 }}>
          <Text style={{ color: "#6B7280", fontSize: 13 }}>₸</Text>
        </View>
      </View>

      {isDirty && (
        <Pressable
          onPress={handleSave}
          disabled={saving}
          style={{
            marginTop: 12,
            backgroundColor: saving ? "#D1D5DB" : "#C5A059",
            borderRadius: 12, padding: 12, alignItems: "center",
          }}
        >
          {saving
            ? <ActivityIndicator color="white" size="small" />
            : <Text style={{ color: "white", fontWeight: "700" }}>Сохранить</Text>
          }
        </Pressable>
      )}
    </View>
  );
}

// ── Main screen ───────────────────────────────────────────────────────────────

export default function PricesPage() {
  const {
    prices, ornamentPrices, loading,
    fetchPrices, fetchOrnamentPrices,
    updatePrice, updateOrnamentPrice,
  } = usePriceStore();

  const [category, setCategory] = useState<Category>("garments");

  useEffect(() => {
    fetchPrices();
    fetchOrnamentPrices();
  }, []);

  const isLoading = loading && prices.length === 0 && ornamentPrices.length === 0;

  if (isLoading) {
    return (
      <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
        <ActivityIndicator color="#C5A059" size="large" />
      </View>
    );
  }

  return (
    <View style={{ flex: 1, backgroundColor: "#F9FAFB" }}>
      {/* Category toggle */}
      <View style={{
        flexDirection: "row", margin: 16, marginBottom: 8,
        backgroundColor: "#F3F4F6", borderRadius: 14, padding: 4,
      }}>
        {([
          { key: "garments",  label: "Изделия" },
          { key: "ornaments", label: "Орнаменты" },
        ] as { key: Category; label: string }[]).map(({ key, label }) => (
          <Pressable
            key={key}
            onPress={() => setCategory(key)}
            style={{
              flex: 1, paddingVertical: 10, borderRadius: 10, alignItems: "center",
              backgroundColor: category === key ? "white" : "transparent",
              shadowColor: category === key ? "#000" : "transparent",
              shadowOpacity: 0.06, shadowRadius: 4,
            }}
          >
            <Text style={{
              fontWeight: "700", fontSize: 14,
              color: category === key ? "#111827" : "#9CA3AF",
            }}>
              {label}
            </Text>
          </Pressable>
        ))}
      </View>

      <ScrollView contentContainerStyle={{ padding: 16, paddingTop: 8, paddingBottom: 60 }}>
        <Text style={{ fontSize: 12, color: "#9CA3AF", marginBottom: 16 }}>
          {category === "garments"
            ? "Минимальная стоимость пошива. Клиент видит эту цену как «От»."
            : "Минимальная стоимость вышивки орнамента. Клиент видит эту цену как «От»."}
        </Text>

        {category === "garments"
          ? prices.map((item: ProductPrice) => (
              <PriceRow
                key={item.id}
                id={item.id}
                label={item.productModel}
                currentPrice={item.price_from}
                onSave={updatePrice}
              />
            ))
          : ornamentPrices.map((item: OrnamentPrice) => (
              <PriceRow
                key={item.id}
                id={item.id}
                label={item.name}
                imageUrl={item.imageUrl}
                currentPrice={item.price_from}
                onSave={updateOrnamentPrice}
              />
            ))
        }
      </ScrollView>
    </View>
  );
}
