import {
  Text,
  Pressable,
  ScrollView,
  View
} from "react-native";
import { OrderStatus } from "@kudagi/core";
import { STATUS_ORDER } from "@/constants/constants";

export const FilterBar = ({
  active,
  onChange,
}: {
  active: OrderStatus | "Все" | "Оплачено" | "Не оплачено";
  onChange: (f: OrderStatus | "Все" | "Оплачено" | "Не оплачено") => void;
}) => {
  const filters: (OrderStatus | "Все" | "Оплачено" | "Не оплачено")[] = ["Все", ...STATUS_ORDER, "Оплачено", "Не оплачено"];
  return (
    <View style={{ height: 60, backgroundColor: '#fff' }}>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={{
          flexGrow: 0,
          height: 56,
          backgroundColor: "#fff"
        }}
        contentContainerStyle={{
          paddingHorizontal: 16,
          alignItems: "center",
        }}
      >
        {filters.map((f) => (
          <Pressable
            key={f}
            onPress={() => onChange(f)}
            style={{
              height: 34,
              paddingHorizontal: 16,
              borderRadius: 17,
              marginRight: 8,
              alignItems: "center",
              justifyContent: "center",
              backgroundColor: active === f ? "#C5A059" : "#FFFFFF",
              borderWidth: 1,
              borderColor: active === f ? "#C5A059" : "#E5E7EB",
            }}
          >
            <Text
              style={{
                fontSize: 12,
                fontWeight: "600",
                color: active === f ? "#FFFFFF" : "#9CA3AF",
              }}
            >
              {f}
            </Text>
          </Pressable>
        ))}
      </ScrollView>
    </View>
  );
};
