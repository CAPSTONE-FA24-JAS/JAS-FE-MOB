import { MaterialCommunityIcons } from "@expo/vector-icons";
import React, { useState } from "react";
import { View, Text, TouchableOpacity, ScrollView } from "react-native";
import Icon from "react-native-vector-icons/MaterialIcons";

interface FAQItemProps {
  question: string;
  answer: string;
}

const faqData: FAQItemProps[] = [
  {
    question: "How does jewelry bidding work?",
    answer:
      "Jewelry bidding works by placing bids on listed jewelry pieces. The highest bidder at the end of the auction wins the item.",
  },
  {
    question: "What are the payment methods accepted?",
    answer:
      "We accept major credit cards, PayPal, and bank transfers. Payments must be completed within 48 hours of winning the auction.",
  },
  {
    question: "Can I cancel my bid?",
    answer:
      "Bids cannot be Cancelled once placed. Please ensure you're confident about your bid before placing it.",
  },
];

const FAQItem: React.FC<FAQItemProps> = ({ question, answer }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <View className="my-1 border-2 border-b border-gray-200 rounded-md">
      <TouchableOpacity
        className="flex-row items-center justify-between p-4"
        onPress={() => setIsExpanded(!isExpanded)}>
        <View className="flex-row ">
          <MaterialCommunityIcons name="chat" size={24} color="black" />
          <Text
            className="text-lg ml-2 w-[85%] font-semibold"
            numberOfLines={1} // Limits text to 1 line and adds ellipsis if needed
            ellipsizeMode="tail" // Specifies where to truncate the text
          >
            {question}
          </Text>
        </View>
        <MaterialCommunityIcons
          name={isExpanded ? "chevron-up" : "chevron-down"}
          size={24}
          color="black"
        />
      </TouchableOpacity>
      {isExpanded && (
        <View className="p-4 bg-gray-100">
          <Text className="text-gray-600">{answer}</Text>
        </View>
      )}
    </View>
  );
};

const InfoCard: React.FC = () => {
  return (
    <ScrollView className="flex-1 p-2 bg-white">
      {faqData.map((item, index) => (
        <FAQItem key={index} question={item.question} answer={item.answer} />
      ))}
    </ScrollView>
  );
};

export default InfoCard;
