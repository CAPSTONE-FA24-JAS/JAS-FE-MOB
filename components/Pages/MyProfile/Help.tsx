import React, { useState } from "react";
import { View, Text, TouchableOpacity, ScrollView } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";

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
  {
    question: "How do I know if I've won an auction?",
    answer:
      "You will receive a notification via email and in-app if you win an auction. The item will appear in your account under 'Won Auctions'.",
  },
  {
    question: "Is there a bidding limit?",
    answer:
      "Yes, each user has a bidding limit based on their account status. You can view your bidding limit in your account settings.",
  },
];

const FAQItem: React.FC<FAQItemProps> = ({ question, answer }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <View className="border-b border-gray-200">
      <TouchableOpacity
        className="flex-row items-center justify-between p-4"
        onPress={() => setIsExpanded(!isExpanded)}>
        <Text className="text-lg">{question}</Text>
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

const Help: React.FC = () => {
  return (
    <ScrollView className="flex-1 p-4 bg-white">
      <Text className="mb-4 text-2xl font-bold">
        Frequently Asked Questions
      </Text>
      {faqData.map((item, index) => (
        <FAQItem key={index} question={item.question} answer={item.answer} />
      ))}
    </ScrollView>
  );
};

export default Help;
