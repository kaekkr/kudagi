import { Tabs } from "expo-router";
import { ListChecks, Layers, Image, DollarSign } from "lucide-react-native";
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
      <Tabs.Screen
        name="order_types"
        options={{
          title: "Виды заказов",
          tabBarIcon: ({ color }) => <Image color={color} size={24} />,
        }}
      />
      <Tabs.Screen
        name="prices"
        options={{
          title: "Цены",
          tabBarIcon: ({ color }) => <DollarSign color={color} size={24} />,
        }}
      />
    </Tabs>
  );
}
