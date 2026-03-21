import { Tabs } from "expo-router";
import { PlusCircle, ListChecks } from "lucide-react-native";

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: "#C5A059", // KuDAGI Gold
        headerTitleStyle: { fontWeight: "bold" },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Новый заказ",
          tabBarIcon: ({ color }) => <PlusCircle color={color} size={24} />,
        }}
      />
    </Tabs>
  );
}
