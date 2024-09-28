import { ChevronDown, ChevronUp } from "lucide-react-native";
import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from "react-native";

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
    | "Approved"
    | "Rejected";
}

const TimeLineBid: React.FC = () => {
  const [expanded, setExpanded] = useState(false);

  const toggleExpanded = () => setExpanded(!expanded);

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

  return (
    <ScrollView className="bg-white mt-2 mx-4 rounded-md">
      <Text className="text-xl font-bold mt-4 ml-4">Timeline</Text>
      <View className="mx-10 mt-4">
        {mockData
          .slice(0, expanded ? mockData.length : 1)
          .map((event, index) => (
            <View key={index} className="flex-row mb-4">
              <View className="items-center mr-4">
                <View className="w-3 h-3 bg-blue-500 rounded-full" />
                {index !== (expanded ? mockData.length - 1 : 0) && (
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

      {mockData.length > 1 && (
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
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "#fff",
  },
  timelineItem: {
    marginBottom: 20,
    padding: 10,
    borderRadius: 5,
    backgroundColor: "#f0f0f0",
  },
  timelineText: {
    fontSize: 16,
    fontWeight: "bold",
  },
  timelineDate: {
    fontSize: 14,
    color: "#888",
  },
});

export default TimeLineBid;
