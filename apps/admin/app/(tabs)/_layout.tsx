import { Tabs } from "expo-router";
import { ListChecks, Layers } from "lucide-react-native";

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: "#C5A059",
        headerShown: false,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Заказы",
          tabBarIcon: ({ color }) => <ListChecks color={color} size={24} />,
        }}
      />
      <Tabs.Screen
        name="ornaments"
        options={{
          title: "Орнаменты",
          tabBarIcon: ({ color }) => <Layers color={color} size={24} />,
        }}
      />
    </Tabs>
  );
}
