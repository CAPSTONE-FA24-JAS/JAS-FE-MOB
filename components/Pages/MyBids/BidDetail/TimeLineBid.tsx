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
  status: string;
}

interface TimeLineBidProps {
  historyCustomerLots: Array<{
    currentTime: string;
    status: string;
    customerLotId: number;
  }>;
}

const TimeLineBid: React.FC<TimeLineBidProps> = ({ historyCustomerLots }) => {
  const [expanded, setExpanded] = useState(false);

  const toggleExpanded = () => setExpanded(!expanded);

  // Map and sort the historyCustomerLots to the format of TimelineEvent
  const timelineData: TimelineEvent[] = historyCustomerLots
    .map((event) => ({
      date: new Date(event.currentTime).toLocaleString(),
      title: ` ${event.status}`,
      description: `Customer Lot ID: ${event.customerLotId}`,
      status: event.status,
    }))
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()); // Sort by date descending

  return (
    <ScrollView className="bg-white mt-2 mx-4 rounded-md">
      <Text className="text-xl font-bold mt-4 ml-4">Timeline</Text>
      <View className="mx-10 mt-4">
        {timelineData
          .slice(0, expanded ? timelineData.length : 3)
          .map((event, index) => (
            <View key={index} className="flex-row mb-4">
              <View className="items-center mr-4">
                <View className="w-3 h-3 bg-blue-500 rounded-full" />
                {index !== (expanded ? timelineData.length - 1 : 2) && (
                  <View className="w-0.5 h-[80px] bg-gray-300 mt-1" />
                )}
              </View>
              <View className="flex-1">
                <Text className="text-sm text-gray-500">{event.date}</Text>
                <Text className="font-bold">{event.title}</Text>
                {/* <Text className="text-gray-600">{event.description}</Text> */}
              </View>
            </View>
          ))}
      </View>

      {timelineData.length > 1 && (
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

export default TimeLineBid;
