import React from "react";
import { View, Text, TextInput, TouchableOpacity, Image } from "react-native";
import * as ImagePicker from "expo-image-picker";
import { Camera, Ruler } from "lucide-react-native";

export const MeasurementsForm = ({ control, setValue, imageUri }) => {
  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.8,
    });

    if (!result.canceled) {
      setValue("imageUri", result.assets[0].uri);
    }
  };

  const MeasurementInput = ({ label, name }) => (
    <View className="w-[48%] mb-4">
      <Text className="text-xs text-gray-500 mb-1">{label} (см)</Text>
      <TextInput
        className="border border-gray-200 p-3 rounded-lg bg-gray-50"
        keyboardType="numeric"
        placeholder="0"
        onChangeText={(val) => setValue(`measurements.${name}`, val)}
      />
    </View>
  );

  return (
    <View>
      <Text className="text-xl font-bold mb-4">Параметры изделия</Text>

      {/* Photo Upload Section */}
      <TouchableOpacity
        onPress={pickImage}
        className="w-full h-48 border-2 border-dashed border-gray-200 rounded-2xl items-center justify-center mb-6 overflow-hidden"
      >
        {imageUri ? (
          <Image source={{ uri: imageUri }} className="w-full h-full" />
        ) : (
          <>
            <Camera color="#C5A059" size={32} />
            <Text className="text-gold mt-2">Добавить фото модели</Text>
          </>
        )}
      </TouchableOpacity>

      {/* Measurements Grid */}
      <View className="flex-row items-center mb-4">
        <Ruler size={18} color="#666" />
        <Text className="ml-2 font-semibold">Мерки клиента</Text>
      </View>

      <View className="flex-row flex-wrap justify-between">
        <MeasurementInput label="Рост" name="height" />
        <MeasurementInput label="Обхват груди" name="chest" />
        <MeasurementInput label="Талия" name="waist" />
        <MeasurementInput label="Бёдра" name="hips" />
        <MeasurementInput label="Длина рукава" name="sleeve" />
        <MeasurementInput label="Длина изделия" name="length" />
      </View>

      <View className="bg-gold/10 p-4 rounded-xl mt-4">
        <Text className="text-gold text-xs italic">
          💡 Подсказка: Убедитесь, что мерки сняты плотно по телу клиента.
        </Text>
      </View>
    </View>
  );
};
