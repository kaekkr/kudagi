import React, { useState } from "react";
import {
  View,
  Text,
  FlatList,
  Pressable,
  Modal,
  TextInput,
  Alert,
  Image,
  ScrollView,
} from "react-native";
import { Plus, Pencil, Trash2 } from "lucide-react-native";

// ── Types ────────────────────────────────────────────────────────────────────
interface Ornament {
  id: string;
  name: string;
  imageUri: string;   // local asset path or remote URL
  usedInOrders: boolean;
}

// ── Seed data (matches the 10 ornaments already in client assets) ────────────
const SEED: Ornament[] = Array.from({ length: 10 }, (_, i) => ({
  id: `ornament-${i + 1}`,
  name: `Тип ${i + 1}`,
  imageUri: `ornament${i + 1}`,   // key for require() map
  usedInOrders: i < 3,             // first 3 marked as "in use" for demo
}));

// Static require map — same images as client app
const ORNAMENT_IMAGES: Record<string, any> = {
  ornament1:  require("../../assets/images/ornament1.png"),
  ornament2:  require("../../assets/images/ornament2.png"),
  ornament3:  require("../../assets/images/ornament3.png"),
  ornament4:  require("../../assets/images/ornament4.png"),
  ornament5:  require("../../assets/images/ornament5.png"),
  ornament6:  require("../../assets/images/ornament6.png"),
  ornament7:  require("../../assets/images/ornament7.png"),
  ornament8:  require("../../assets/images/ornament8.png"),
  ornament9:  require("../../assets/images/ornament9.png"),
  ornament10: require("../../assets/images/ornament10.png"),
};

const resolveImage = (uri: string) =>
  ORNAMENT_IMAGES[uri] ?? { uri };   // fallback to remote URL if not a key

// ── Edit / Add Modal ─────────────────────────────────────────────────────────
const OrnamentModal = ({
  ornament,
  onSave,
  onClose,
}: {
  ornament: Partial<Ornament> | null;
  onSave: (data: { name: string; imageUri: string }) => void;
  onClose: () => void;
}) => {
  const [name, setName] = useState(ornament?.name ?? "");
  const [imageUri, setImageUri] = useState(ornament?.imageUri ?? "");

  return (
    <Modal visible animationType="slide" presentationStyle="formSheet">
      <View className="flex-1 bg-white p-6">
        <View className="flex-row justify-between items-center mb-6">
          <Text className="text-xl font-bold">
            {ornament?.id ? "Редактировать" : "Добавить орнамент"}
          </Text>
          <Pressable onPress={onClose}>
            <Text className="text-gray-400 text-lg">✕</Text>
          </Pressable>
        </View>

        <Text className="text-sm text-gray-500 mb-1">Название</Text>
        <TextInput
          value={name}
          onChangeText={setName}
          placeholder="Напр: Тип 11"
          className="border border-gray-100 rounded-xl p-4 mb-4 text-gray-800"
          placeholderTextColor="#C1C1C1"
        />

        <Text className="text-sm text-gray-500 mb-1">Ключ изображения или URL</Text>
        <TextInput
          value={imageUri}
          onChangeText={setImageUri}
          placeholder="ornament11 или https://..."
          className="border border-gray-100 rounded-xl p-4 mb-2 text-gray-800"
          placeholderTextColor="#C1C1C1"
          autoCapitalize="none"
        />
        <Text className="text-[11px] text-gray-400 mb-6">
          Для локальных изображений добавьте файл в assets/images/ и укажите ключ без расширения.
        </Text>

        {imageUri ? (
          <View className="items-center mb-6">
            <Image
              source={resolveImage(imageUri)}
              style={{ width: 120, height: 120 }}
              resizeMode="contain"
              className="rounded-2xl bg-gray-50"
            />
          </View>
        ) : null}

        <Pressable
          onPress={() => {
            if (!name.trim()) {
              Alert.alert("Ошибка", "Введите название орнамента");
              return;
            }
            onSave({ name: name.trim(), imageUri: imageUri.trim() });
          }}
          className="bg-[#C5A059] p-4 rounded-2xl items-center mt-auto"
        >
          <Text className="text-white font-bold text-base">Сохранить</Text>
        </Pressable>
      </View>
    </Modal>
  );
};

// ── Main Screen ──────────────────────────────────────────────────────────────
export default function OrnamentsScreen() {
  const [ornaments, setOrnaments] = useState<Ornament[]>(SEED);
  const [editing, setEditing] = useState<Partial<Ornament> | null>(null);
  const [showModal, setShowModal] = useState(false);

  const handleAdd = () => {
    setEditing({});
    setShowModal(true);
  };

  const handleEdit = (o: Ornament) => {
    setEditing(o);
    setShowModal(true);
  };

  const handleDelete = (o: Ornament) => {
    if (o.usedInOrders) {
      Alert.alert(
        "Нельзя удалить",
        `Орнамент «${o.name}» используется в заказах и не может быть удалён.`,
        [{ text: "Понятно" }]
      );
      return;
    }
    Alert.alert(
      "Удалить орнамент",
      `Удалить «${o.name}»? Это действие необратимо.`,
      [
        { text: "Отмена", style: "cancel" },
        {
          text: "Удалить",
          style: "destructive",
          onPress: () =>
            setOrnaments((prev) => prev.filter((x) => x.id !== o.id)),
        },
      ]
    );
  };

  const handleSave = (data: { name: string; imageUri: string }) => {
    if (editing?.id) {
      // Update existing
      setOrnaments((prev) =>
        prev.map((o) =>
          o.id === editing.id ? { ...o, ...data } : o
        )
      );
    } else {
      // Add new
      const newOrnament: Ornament = {
        id: `ornament-${Date.now()}`,
        name: data.name,
        imageUri: data.imageUri,
        usedInOrders: false,
      };
      setOrnaments((prev) => [...prev, newOrnament]);
    }
    setShowModal(false);
    setEditing(null);
  };

  return (
    <View className="flex-1 bg-gray-50">
      <FlatList
        data={ornaments}
        keyExtractor={(item) => item.id}
        numColumns={2}
        contentContainerStyle={{ padding: 16, paddingBottom: 100 }}
        columnWrapperStyle={{ justifyContent: "space-between" }}
        ListHeaderComponent={
          <Text className="text-xs text-gray-400 mb-3">
            {ornaments.length} орнаментов
          </Text>
        }
        renderItem={({ item }) => (
          <View className="bg-white rounded-2xl mb-4 overflow-hidden shadow-sm w-[48%]">
            <View className="bg-gray-50 items-center justify-center p-4" style={{ height: 120 }}>
              <Image
                source={resolveImage(item.imageUri)}
                style={{ width: 80, height: 80 }}
                resizeMode="contain"
              />
              {item.usedInOrders && (
                <View className="absolute top-2 right-2 bg-[#C5A059]/20 rounded-full px-2 py-0.5">
                  <Text className="text-[9px] text-[#C5A059] font-bold">В заказах</Text>
                </View>
              )}
            </View>

            <View className="p-3">
              <Text className="font-semibold text-gray-800 mb-2" numberOfLines={1}>
                {item.name}
              </Text>
              <View className="flex-row">
                <Pressable
                  onPress={() => handleEdit(item)}
                  className="flex-1 flex-row items-center justify-center bg-gray-50 rounded-xl py-2 mr-1.5"
                >
                  <Pencil size={13} color="#C5A059" />
                  <Text className="text-[#C5A059] text-xs font-semibold ml-1">Изменить</Text>
                </Pressable>
                <Pressable
                  onPress={() => handleDelete(item)}
                  className={`flex-row items-center justify-center px-3 rounded-xl py-2 ${
                    item.usedInOrders ? "bg-gray-50" : "bg-red-50"
                  }`}
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
        onPress={handleAdd}
        className="absolute bottom-8 right-6 bg-[#C5A059] w-14 h-14 rounded-full items-center justify-center shadow-lg"
      >
        <Plus size={26} color="white" />
      </Pressable>

      {showModal && (
        <OrnamentModal
          ornament={editing}
          onSave={handleSave}
          onClose={() => {
            setShowModal(false);
            setEditing(null);
          }}
        />
      )}
    </View>
  );
}
