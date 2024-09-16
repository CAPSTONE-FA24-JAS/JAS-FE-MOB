import React, { useEffect, useState } from "react";
import { View, Text, Image, ScrollView } from "react-native";
import ConsignItem, { ConsignItemProps } from "./ConsignItem";
import { useGlobalSearchParams } from "expo-router";
import { TouchableOpacity } from "react-native-gesture-handler";
import { ChevronDown, ChevronUp } from "lucide-react-native";
import { useRoute } from "@react-navigation/native";

interface TimelineEvent {
  date: string;
  title: string;
  description: string;
  document?: string;
  status:
    | "Preliminary Valued"
    | "Requested"
    | "Product received"
    | "Pending manager approved"
    | "Manager approved"
    | "Member accepted"
    | "Rejected";
}

const ConsignDetailTimeLine: React.FC = () => {
  const route = useRoute();
  const { item } = route.params as { item: ConsignItemProps }; // Lấy params

  const [timeline, setTimeline] = useState<TimelineEvent[]>([]);
  const [expanded, setExpanded] = useState(false);

  useEffect(() => {
    // Simulating API call to get timeline data
    fetchTimelineData(item.id.toString());
  }, [item]);

  const toggleExpanded = () => setExpanded(!expanded);

  const fetchTimelineData = async (itemId: string) => {
    // Replace this with actual API call
    const mockData: TimelineEvent[] = [
      {
        date: "09/09/2024",
        title: "CONSIGN ITEM SUCCESSFULLY",
        description: "Successfully",
        status: "Requested",
      },
      {
        date: "09/09/2024",
        title: "FINAL VALUATION",
        description: "Proof of Attorney - Pending",
        document: "yes",
        status: "Preliminary Valued",
      },
      {
        date: "09/09/2024",
        title: "PICKING UP SUCCESSFULLY",
        description: "Goods Receipt",
        status: "Manager approved",
      },
      {
        date: "09/09/2024",
        title: "PICKING UP",
        description: "Request Detail",
        status: "Member accepted",
      },
      {
        date: "09/09/2024",
        title: "PRELIMINARY VALUATION",
        description: "Preliminary Valuation - Pending",
        status: "Pending manager approved",
      },
      {
        date: "09/09/2024",
        title: "Request Consign Successfully",
        description: "Request Detail",
        status: "Product received",
      },
    ];
    setTimeline(mockData);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Preliminary Valued":
        return "text-yellow-500";
      case "Requested":
        return "text-blue-500";
      case "Product received":
        return "text-purple-500";
      case "Pending manager approved":
        return "text-orange-500";
      case "Manager approved":
        return "text-green-500";
      case "Member accepted":
        return "text-blue-500";
      case "Rejected":
        return "text-red-500";
      default:
        return "text-gray-500";
    }
  };

  return (
    <ScrollView className="flex-1 bg-white">
      <View className="p-4">
        {/* Hiển thị thông tin item */}
        <View className="flex-row items-center mb-4">
          {item.image ? (
            <Image
              source={{ uri: item.image }}
              className="w-20 h-20 mr-4 rounded"
            />
          ) : (
            <Image
              source={require("../assets/item-jas/item1.jpg")}
              className="w-20 h-20 mr-4 rounded"
            />
          )}
          <View className="w-[70%]">
            <View className="flex-row items-center justify-between ">
              <Text className="text-xl font-bold">{item.name}</Text>
              <Text className="text-gray-600">#{item.id}</Text>
            </View>
            {item.price ? (
              <Text className="mt-1 text-lg font-semibold">${item.price}</Text>
            ) : (
              <Text className="mt-1 text-base text-gray-500 font-semibold">
                Price not available
              </Text>
            )}
            <Text
              className={`uppercase ${getStatusColor(
                item.status
              )} font-semibold uppsercase `}
            >
              {item.status}
            </Text>
          </View>
        </View>
        <View className="mt-4">
          {timeline
            .slice(0, expanded ? timeline.length : 1)
            .map((event, index) => (
              <View key={index} className="flex-row mb-4">
                <View className="items-center mr-4">
                  <View className="w-3 h-3 bg-blue-500 rounded-full" />
                  {index !== (expanded ? timeline.length - 1 : 0) && (
                    <View className="w-0.5 h-[80px] bg-gray-300 mt-1" />
                  )}
                </View>
                <View className="flex-1">
                  <Text className="text-sm text-gray-500">{event.date}</Text>
                  <Text className="font-bold">{event.title}</Text>
                  <Text className="text-gray-600">{event.description}</Text>
                  {event.document && (
                    <TouchableOpacity
                      className="p-2 mt-1 bg-gray-200 rounded w-[50px]"
                      onPress={() => alert("View document")}
                    >
                      <Text className="text-gray-700">Print</Text>
                      {/* đoạn này đang kh biết tải hẳn luôn ha là mở modal */}
                    </TouchableOpacity>
                  )}
                </View>
              </View>
            ))}
        </View>

        {timeline.length > 1 && (
          <TouchableOpacity
            onPress={toggleExpanded}
            className="flex-row items-center justify-center p-2 mt-2 bg-gray-100 rounded"
          >
            <Text className="mr-2">
              {expanded ? "Thu gọn" : "Xem toàn bộ lịch sử"}
            </Text>
            {expanded ? (
              <ChevronUp size={20} color="#4B5563" />
            ) : (
              <ChevronDown size={20} color="#4B5563" />
            )}
          </TouchableOpacity>
        )}
      </View>
    </ScrollView>
  );
};

export default ConsignDetailTimeLine;
