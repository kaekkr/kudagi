import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  FlatList,
  Pressable,
  Modal,
  TextInput,
  Alert,
  Image,
  ActivityIndicator,
} from "react-native";
import { Plus, Pencil, Trash2, Upload } from "lucide-react-native";
import { db } from "@kudagi/core";
import { uploadOrnamentImage, pickFileWeb } from "@/utils/storage";

// ── Types ────────────────────────────────────────────────────────────────────

interface Ornament {
  id: string;
  name: string;
  imageUrl: string;
  usedInOrders: boolean;
}

// ── API helpers ──────────────────────────────────────────────────────────────

async function fetchOrnaments(): Promise<Ornament[]> {
  const data = await db("/ornaments?order=created_at.asc&select=*").catch(() => []);
  return (data ?? []).map((r: any) => ({
    id:           r.id,
    name:         r.name,
    imageUrl:     r.image_url     ?? "",
    usedInOrders: r.used_in_orders ?? false,
  }));
}

async function saveOrnament(
  o: Partial<Ornament> & { name: string; imageUrl: string },
  isNew: boolean
): Promise<any> {
  if (isNew) {
    const data = await db("/ornaments", {
      method: "POST",
      headers: { Prefer: "return=representation" },
      body: JSON.stringify({ name: o.name, image_url: o.imageUrl, used_in_orders: false }),
    });
    return data?.[0];
  }
  await db(`/ornaments?id=eq.${o.id}`, {
    method: "PATCH",
    headers: { Prefer: "return=minimal" },
    body: JSON.stringify({ name: o.name, image_url: o.imageUrl }),
  });
}

async function deleteOrnament(id: string): Promise<void> {
  await db(`/ornaments?id=eq.${id}`, { method: "DELETE" });
}

// ── OrnamentModal ────────────────────────────────────────────────────────────

const OrnamentModal = ({
  ornament,
  onSave,
  onClose,
}: {
  ornament: Partial<Ornament> | null;
  onSave: (o: Ornament) => void;
  onClose: () => void;
}) => {
  const [name,      setName]      = useState(ornament?.name     ?? "");
  const [imageUrl,  setImageUrl]  = useState(ornament?.imageUrl ?? "");
  const [uploading, setUploading] = useState(false);
  const [saving,    setSaving]    = useState(false);

  const handlePick = async () => {
    const file = await pickFileWeb();
    if (!file) return;
    setUploading(true);
    try {
      setImageUrl(await uploadOrnamentImage(file));
    } catch (e: any) {
      Alert.alert("Ошибка", e.message);
    } finally {
      setUploading(false);
    }
  };

  const handleSave = async () => {
    if (!name.trim()) { Alert.alert("Ошибка", "Введите название"); return; }
    if (!imageUrl)    { Alert.alert("Ошибка", "Загрузите изображение"); return; }
    setSaving(true);
    try {
      const isNew  = !ornament?.id;
      const result = await saveOrnament({ id: ornament?.id, name: name.trim(), imageUrl }, isNew);
      onSave({
        id:           isNew ? (result?.id ?? Date.now().toString()) : ornament!.id!,
        name:         name.trim(),
        imageUrl,
        usedInOrders: ornament?.usedInOrders ?? false,
      });
    } catch (e: any) {
      Alert.alert("Ошибка сохранения", e.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <Modal visible animationType="slide" presentationStyle="formSheet">
      <View style={{ flex: 1, backgroundColor: "white", padding: 24 }}>
        {/* Header */}
        <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
          <Text style={{ fontSize: 20, fontWeight: "700" }}>
            {ornament?.id ? "Редактировать" : "Добавить орнамент"}
          </Text>
          <Pressable onPress={onClose}>
            <Text style={{ color: "#9CA3AF", fontSize: 18 }}>✕</Text>
          </Pressable>
        </View>

        {/* Name */}
        <Text style={{ fontSize: 13, color: "#6B7280", marginBottom: 4 }}>Название</Text>
        <TextInput
          value={name}
          onChangeText={setName}
          placeholder="Напр: Тип 11"
          placeholderTextColor="#C1C1C1"
          style={{ borderWidth: 1, borderColor: "#F3F4F6", borderRadius: 12, padding: 14, marginBottom: 20, fontSize: 15 }}
        />

        {/* Image picker */}
        <Text style={{ fontSize: 13, color: "#6B7280", marginBottom: 8 }}>Изображение</Text>
        <Pressable
          onPress={handlePick}
          disabled={uploading}
          style={{
            borderWidth: 2, borderStyle: "dashed",
            borderColor: imageUrl ? "#C5A059" : "#E5E7EB",
            borderRadius: 16, height: 180,
            alignItems: "center", justifyContent: "center",
            overflow: "hidden", marginBottom: 8,
            backgroundColor: "#F9FAFB",
          }}
        >
          {uploading ? (
            <View style={{ alignItems: "center" }}>
              <ActivityIndicator color="#C5A059" />
              <Text style={{ color: "#9CA3AF", marginTop: 8 }}>Загрузка...</Text>
            </View>
          ) : imageUrl ? (
            <Image source={{ uri: imageUrl }} style={{ width: "100%", height: "100%" }} resizeMode="cover" />
          ) : (
            <View style={{ alignItems: "center" }}>
              <Upload size={32} color="#C1C1C1" />
              <Text style={{ color: "#9CA3AF", marginTop: 8 }}>Выбрать фото</Text>
            </View>
          )}
        </Pressable>

        {imageUrl ? (
          <Pressable onPress={handlePick} style={{ alignSelf: "center", marginBottom: 16 }}>
            <Text style={{ color: "#C5A059", fontSize: 13, fontWeight: "600" }}>Заменить фото</Text>
          </Pressable>
        ) : null}

        {/* Save button */}
        <Pressable
          onPress={handleSave}
          disabled={saving || uploading}
          style={{
            backgroundColor: saving || uploading ? "#D1D5DB" : "#C5A059",
            padding: 16, borderRadius: 16, alignItems: "center", marginTop: "auto",
          }}
        >
          {saving
            ? <ActivityIndicator color="white" />
            : <Text style={{ color: "white", fontWeight: "700", fontSize: 16 }}>Сохранить</Text>
          }
        </Pressable>
      </View>
    </Modal>
  );
};

// ── OrnamentsScreen ──────────────────────────────────────────────────────────

export default function OrnamentsScreen() {
  const [ornaments, setOrnaments] = useState<Ornament[]>([]);
  const [loading,   setLoading]   = useState(true);
  const [editing,   setEditing]   = useState<Partial<Ornament> | null>(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    fetchOrnaments().then((data) => { setOrnaments(data); setLoading(false); });
  }, []);

  const handleDelete = (o: Ornament) => {
    if (o.usedInOrders) {
      Alert.alert("Нельзя удалить", `«${o.name}» используется в заказах.`, [{ text: "Понятно" }]);
      return;
    }
    Alert.alert("Удалить орнамент", `Удалить «${o.name}»?`, [
      { text: "Отмена", style: "cancel" },
      {
        text: "Удалить", style: "destructive",
        onPress: async () => {
          try {
            await deleteOrnament(o.id);
            setOrnaments((prev) => prev.filter((x) => x.id !== o.id));
          } catch (e: any) {
            Alert.alert("Ошибка", e.message);
          }
        },
      },
    ]);
  };

  const handleSave = (saved: Ornament) => {
    setOrnaments((prev) => {
      const exists = prev.find((o) => o.id === saved.id);
      return exists ? prev.map((o) => (o.id === saved.id ? saved : o)) : [...prev, saved];
    });
    setShowModal(false);
    setEditing(null);
  };

  if (loading) {
    return (
      <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
        <ActivityIndicator color="#C5A059" size="large" />
      </View>
    );
  }

  return (
    <View style={{ flex: 1, backgroundColor: "#F9FAFB" }}>
      <FlatList
        data={ornaments}
        keyExtractor={(item) => item.id}
        numColumns={2}
        contentContainerStyle={{ padding: 16, paddingBottom: 100 }}
        columnWrapperStyle={{ justifyContent: "space-between" }}
        ListHeaderComponent={
          <Text style={{ fontSize: 12, color: "#9CA3AF", marginBottom: 12 }}>
            {ornaments.length} орнаментов
          </Text>
        }
        ListEmptyComponent={
          <View style={{ alignItems: "center", paddingTop: 60 }}>
            <Text style={{ fontSize: 40, marginBottom: 12 }}>🧵</Text>
            <Text style={{ color: "#9CA3AF" }}>Орнаменты ещё не добавлены</Text>
          </View>
        }
        renderItem={({ item }) => (
          <View style={{
            backgroundColor: "white", borderRadius: 16, marginBottom: 16,
            overflow: "hidden", width: "48%",
            shadowColor: "#000", shadowOpacity: 0.05, shadowRadius: 4,
          }}>
            <View style={{ height: 120, backgroundColor: "#F9FAFB" }}>
              {item.imageUrl ? (
                <Image source={{ uri: item.imageUrl }} style={{ width: "100%", height: "100%" }} resizeMode="cover" />
              ) : (
                <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
                  <Text style={{ color: "#D1D5DB", fontSize: 12 }}>Нет фото</Text>
                </View>
              )}
              {item.usedInOrders && (
                <View style={{
                  position: "absolute", top: 6, right: 6,
                  backgroundColor: "rgba(197,160,89,0.2)", borderRadius: 20,
                  paddingHorizontal: 8, paddingVertical: 2,
                }}>
                  <Text style={{ fontSize: 9, color: "#C5A059", fontWeight: "700" }}>В заказах</Text>
                </View>
              )}
            </View>

            <View style={{ padding: 10 }}>
              <Text style={{ fontWeight: "600", color: "#111827", marginBottom: 8 }} numberOfLines={1}>
                {item.name}
              </Text>
              <View style={{ flexDirection: "row" }}>
                <Pressable
                  onPress={() => { setEditing(item); setShowModal(true); }}
                  style={{
                    flex: 1, flexDirection: "row", alignItems: "center", justifyContent: "center",
                    backgroundColor: "#F9FAFB", borderRadius: 10, paddingVertical: 7, marginRight: 6,
                  }}
                >
                  <Pencil size={13} color="#C5A059" />
                  <Text style={{ color: "#C5A059", fontSize: 12, fontWeight: "600", marginLeft: 4 }}>Изменить</Text>
                </Pressable>
                <Pressable
                  onPress={() => handleDelete(item)}
                  style={{
                    backgroundColor: item.usedInOrders ? "#F9FAFB" : "#FEF2F2",
                    borderRadius: 10, paddingHorizontal: 10, paddingVertical: 7,
                    alignItems: "center", justifyContent: "center",
                  }}
                >
                  <Trash2 size={13} color={item.usedInOrders ? "#D1D5DB" : "#EF4444"} />
                </Pressable>
              </View>
            </View>
          </View>
        )}
      />

      {/* FAB */}
      <Pressable
        onPress={() => { setEditing({}); setShowModal(true); }}
        style={{
          position: "absolute", bottom: 32, right: 24,
          backgroundColor: "#C5A059", width: 56, height: 56,
          borderRadius: 28, alignItems: "center", justifyContent: "center",
        }}
      >
        <Plus size={26} color="white" />
      </Pressable>

      {showModal && (
        <OrnamentModal
          ornament={editing}
          onSave={handleSave}
          onClose={() => { setShowModal(false); setEditing(null); }}
        />
      )}
    </View>
  );
}
