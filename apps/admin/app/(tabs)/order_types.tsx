import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  FlatList,
  Pressable,
  Image,
  ActivityIndicator,
  Alert,
} from "react-native";
import { Upload } from "lucide-react-native";
import { db } from "@kudagi/core";
import { uploadOrderTypeImage, pickFileWeb } from "@/utils/storage";

// ── Types ────────────────────────────────────────────────────────────────────

interface OrderTypePhoto {
  id: string;
  orderType: string;
  imageUrl: string | null;
}

// ── API helpers ──────────────────────────────────────────────────────────────

async function fetchOrderTypePhotos(): Promise<OrderTypePhoto[]> {
  const data = await db("/order_type_photos?select=*").catch(() => []);
  return (data ?? []).map((r: any) => ({
    id:        r.id,
    orderType: r.order_type,
    imageUrl:  r.image_url ?? null,
  }));
}

async function updateOrderTypePhoto(id: string, imageUrl: string): Promise<void> {
  await db(`/order_type_photos?id=eq.${id}`, {
    method: "PATCH",
    headers: { Prefer: "return=minimal" },
    body: JSON.stringify({ image_url: imageUrl, updated_at: new Date().toISOString() }),
  });
}

// ── Constants ────────────────────────────────────────────────────────────────

const ORDER_TYPE_LABELS: Record<string, string> = {
  Стандартный: "👗 Стандартный",
  Парный:      "👫 Парный",
  Семейный:    "👨‍👩‍👧 Семейный",
  Срочный:     "⚡ Срочный",
  VIP:         "👑 VIP",
};

// ── Screen ───────────────────────────────────────────────────────────────────

export default function OrderTypesScreen() {
  const [items,     setItems]     = useState<OrderTypePhoto[]>([]);
  const [loading,   setLoading]   = useState(true);
  const [uploading, setUploading] = useState<string | null>(null);

  useEffect(() => {
    fetchOrderTypePhotos().then((data) => { setItems(data); setLoading(false); });
  }, []);

  const handleUpload = async (item: OrderTypePhoto) => {
    const file = await pickFileWeb();
    if (!file) return;
    setUploading(item.id);
    try {
      const url = await uploadOrderTypeImage(file);
      await updateOrderTypePhoto(item.id, url);
      setItems((prev) => prev.map((x) => (x.id === item.id ? { ...x, imageUrl: url } : x)));
    } catch (e: any) {
      Alert.alert("Ошибка", e.message);
    } finally {
      setUploading(null);
    }
  };

  if (loading) {
    return (
      <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
        <ActivityIndicator color="#C5A059" size="large" />
      </View>
    );
  }

  return (
    <FlatList
      data={items}
      keyExtractor={(item) => item.id}
      contentContainerStyle={{ padding: 16, paddingBottom: 40 }}
      ListHeaderComponent={
        <Text style={{ fontSize: 12, color: "#9CA3AF", marginBottom: 12 }}>
          Фото для каждого вида заказа отображаются в форме клиента
        </Text>
      }
      renderItem={({ item }) => {
        const isUploading = uploading === item.id;
        return (
          <View style={{
            backgroundColor: "white", borderRadius: 20, marginBottom: 16,
            overflow: "hidden", shadowColor: "#000", shadowOpacity: 0.05, shadowRadius: 4,
          }}>
            {/* Photo */}
            <View style={{ height: 180, backgroundColor: "#F9FAFB", position: "relative" }}>
              {item.imageUrl ? (
                <Image source={{ uri: item.imageUrl }} style={{ width: "100%", height: "100%" }} resizeMode="cover" />
              ) : (
                <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
                  <Text style={{ fontSize: 32, marginBottom: 8 }}>📷</Text>
                  <Text style={{ color: "#9CA3AF", fontSize: 13 }}>Фото не загружено</Text>
                </View>
              )}
              {isUploading && (
                <View style={{
                  position: "absolute", inset: 0,
                  backgroundColor: "rgba(0,0,0,0.4)",
                  alignItems: "center", justifyContent: "center",
                }}>
                  <ActivityIndicator color="white" size="large" />
                  <Text style={{ color: "white", marginTop: 8 }}>Загрузка...</Text>
                </View>
              )}
            </View>

            {/* Info + button */}
            <View style={{ padding: 14, flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}>
              <Text style={{ fontSize: 16, fontWeight: "700", color: "#111827" }}>
                {ORDER_TYPE_LABELS[item.orderType] ?? item.orderType}
              </Text>
              <Pressable
                onPress={() => handleUpload(item)}
                disabled={isUploading}
                style={{
                  flexDirection: "row", alignItems: "center",
                  backgroundColor: "#C5A059", paddingHorizontal: 14, paddingVertical: 8,
                  borderRadius: 12,
                }}
              >
                <Upload size={14} color="white" />
                <Text style={{ color: "white", fontWeight: "600", fontSize: 13, marginLeft: 6 }}>
                  {item.imageUrl ? "Заменить" : "Загрузить"}
                </Text>
              </Pressable>
            </View>
          </View>
        );
      }}
    />
  );
}
