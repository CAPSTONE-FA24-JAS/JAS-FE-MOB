import { Notification } from "@/app/types/notification_type";
import { StackNavigationProp } from "@react-navigation/stack";
import { useNavigation } from "expo-router";
// components/NotificationItem.tsx
import React from "react";
import { View, Text } from "react-native";
import { TouchableOpacity } from "react-native-gesture-handler";

type RootStackParamList = {
  InvoiceDetail: { idNoti: number };
};

const NotificationItem = ({ item }: { item: Notification }) => {
  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();
  const getTypeColor = (item: Notification) => {
    switch (item.notifi_Type) {
      case "Customerlot":
        return "bg-green-100";
      case "Valuation":
        return "bg-blue-100";
      default:
        return "bg-gray-100";
    }
  };

  const handleNavigate = () => {
    console.log("Navigate to notification detail");
    if (
      item.notifi_Type === "Customerlot" ||
      item.title.includes("Đấu giá thắng")
    ) {
      // navigation.navigate("InvoiceDetail", { item: item.id });
      navigation.navigate("InvoiceDetail", { idNoti: item.id });
    }
  };

  return (
    <TouchableOpacity
      onPress={handleNavigate}
      className="px-4 py-3 border-b border-gray-200">
      <View className="flex-row items-center justify-between mb-1">
        <View className={`px-2 py-0.5 rounded ${getTypeColor(item)}`}>
          <Text className="text-xs font-medium">{item.notifi_Type}</Text>
        </View>
      </View>
      <Text className="mb-1 text-base font-semibold">{item.title}</Text>
      <Text className="text-sm text-gray-600">{item.description}</Text>
    </TouchableOpacity>
  );
};
export default NotificationItem;
