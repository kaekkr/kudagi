import React from "react";
import { View, Text } from "react-native";

export default function KuDAGIHeader() {
  return (
    <View
      style={{
        backgroundColor: "#111111",
        paddingTop: 52,
        paddingBottom: 14,
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <Text
        style={{
          color: "#FFFFFF",
          fontSize: 26,
          fontWeight: "700",
          letterSpacing: 4,
          textTransform: "uppercase",
        }}
      >
        KuDAGI
      </Text>
      <Text
        style={{
          color: "#C5A059",
          fontSize: 9,
          letterSpacing: 5,
          textTransform: "uppercase",
          marginTop: 2,
        }}
      >
        HOUSE OF FASHION
      </Text>
    </View>
  );
}
