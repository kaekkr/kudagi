import "../global.css";
import { Stack } from "expo-router";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { FormProvider, useForm } from "react-hook-form";

export default function RootLayout() {
  const methods = useForm(); // 👈 global form instance (IMPORTANT)

  return (
    <FormProvider {...methods}>
      <GestureHandlerRootView style={{ flex: 1 }}>
        <Stack>
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        </Stack>
      </GestureHandlerRootView>
    </FormProvider>
  );
}