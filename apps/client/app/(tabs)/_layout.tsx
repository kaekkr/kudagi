import { Tabs } from "expo-router";
import { PlusCircle } from "lucide-react-native";
import Header from "../../components/Header";

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: "#C5A059",
        headerShown: true,
        header: () => <Header />,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Новый заказ",
          tabBarIcon: ({ color }) => <PlusCircle color={color} size={24} />,
          tabBarStyle: { display: "none" }, // hide tab bar — single tab app
        }}
      />
    </Tabs>
  );
}
