import React, { useRef, useState } from "react";
import { View, Text, Image, ScrollView } from "react-native";
import { TouchableOpacity } from "react-native";
import { Feather } from "@expo/vector-icons"; // For icons, like social media

const AboutScreen: React.FC = () => {
  const scrollViewRef = useRef<ScrollView>(null);
  const [scrollPosition, setScrollPosition] = useState(0);
  const [maxScroll, setMaxScroll] = useState(0);

  const teamMembers = [
    {
      name: "John Doe",
      role: "CEO & Founder",
      imageUrl:
        "https://wac-cdn.atlassian.com/dam/jcr:ba03a215-2f45-40f5-8540-b2015223c918/Max-R_Headshot%20(1).jpg?cdnVersion=2218",
    },
    {
      name: "Jane Smith",
      role: "Chief Designer",
      imageUrl:
        "https://wac-cdn.atlassian.com/dam/jcr:ba03a215-2f45-40f5-8540-b2015223c918/Max-R_Headshot%20(1).jpg?cdnVersion=2218",
    },
    {
      name: "Michael Brown",
      role: "Lead Developer",
      imageUrl:
        "https://wac-cdn.atlassian.com/dam/jcr:ba03a215-2f45-40f5-8540-b2015223c918/Max-R_Headshot%20(1).jpg?cdnVersion=2218",
    },
    {
      name: "Lisa White",
      role: "Marketing Manager",
      imageUrl:
        "https://wac-cdn.atlassian.com/dam/jcr:ba03a215-2f45-40f5-8540-b2015223c918/Max-R_Headshot%20(1).jpg?cdnVersion=2218",
    },
    {
      name: "David Black",
      role: "Product Manager",
      imageUrl:
        "https://wac-cdn.atlassian.com/dam/jcr:ba03a215-2f45-40f5-8540-b2015223c918/Max-R_Headshot%20(1).jpg?cdnVersion=2218",
    },
  ];

  const handleScroll = (event: any) => {
    setScrollPosition(event.nativeEvent.contentOffset.x);
  };

  const scrollNext = () => {
    if (scrollViewRef.current) {
      scrollViewRef.current.scrollTo({
        x: scrollPosition + 250, // Adjust this value to control the scroll distance
        animated: true,
      });
    }
  };

  return (
    <ScrollView className="flex-1 bg-white">
      {/* Header Image */}
      <View className="h-48">
        <Image
          source={{
            uri: "https://donjjewellery.com/wp-content/uploads/2022/02/1-CUSTOM-FINE-JEWELRY-.jpg",
          }} // Replace with your image URL
          className="w-full h-full"
          resizeMode="cover"
        />
      </View>

      {/* App Description */}
      <View className="p-6 bg-gray-100">
        <Text className="text-2xl font-bold text-gray-900 mb-4">
          About the App
        </Text>
        <Text className="text-lg text-gray-700">
          Welcome to Jewelry Auction, the premier platform for Auctionning and
          purchasing exquisite jewelry. Our app connects sellers and buyers
          worldwide, offering a seamless and secure way to explore unique
          jewelry pieces.
        </Text>
      </View>

      <View className="p-6 bg-white">
        <Text className="text-2xl font-bold text-gray-900 mb-4">
          Meet the Team
        </Text>

        <View className="relative">
          <ScrollView
            horizontal
            ref={scrollViewRef}
            showsHorizontalScrollIndicator={false}
            onScroll={handleScroll}
            onContentSizeChange={(contentWidth) =>
              setMaxScroll(contentWidth - 250)
            } // Adjust based on the width of one item
            scrollEventThrottle={16}
          >
            {teamMembers.map((member, index) => (
              <View key={index} className="mr-4 items-center">
                <Image
                  source={{ uri: member.imageUrl }}
                  className="w-24 h-24 rounded-full"
                />
                <Text className="text-lg font-semibold mt-2">
                  {member.name}
                </Text>
                <Text className="text-sm text-gray-500">{member.role}</Text>
              </View>
            ))}
          </ScrollView>

          {/* Next button */}
          {scrollPosition < maxScroll && (
            <TouchableOpacity
              onPress={scrollNext}
              className="absolute top-12 right-0 p-2 bg-gray-100 rounded-full"
            >
              <Feather name="chevron-right" size={24} color="gray" />
            </TouchableOpacity>
          )}
        </View>
      </View>

      {/* Company Info Section */}
      <View className="p-6 bg-gray-100">
        <Text className="text-2xl font-bold text-gray-900 mb-4">
          About the Company
        </Text>
        <Text className="text-lg text-gray-700">
          Jewelry Auction was founded with the vision to bring transparency and
          elegance to jewelry trading. Our mission is to create a platform where
          buyers and sellers can come together in an environment of trust and
          authenticity. With our team of experts and cutting-edge technology, we
          ensure that every transaction is smooth and every product meets the
          highest standards of quality.
        </Text>
      </View>

      {/* Contact Us Section */}
      <View className="p-6 bg-white">
        <Text className="text-2xl font-bold text-gray-900 mb-4">
          Connect With Us
        </Text>
        <Text className="text-lg text-gray-700 mb-4">
          Feel free to reach out to us on our social media platforms or visit
          our website for more information.
        </Text>
        <View className="flex-row justify-around mt-4">
          <TouchableOpacity>
            <Feather name="facebook" size={24} color="gray" />
          </TouchableOpacity>
          <TouchableOpacity>
            <Feather name="instagram" size={24} color="gray" />
          </TouchableOpacity>
          <TouchableOpacity>
            <Feather name="twitter" size={24} color="gray" />
          </TouchableOpacity>
        </View>
      </View>

      {/* Footer */}
      <View className="p-4 bg-gray-900">
        <Text className="text-center text-white text-sm">
          © 2024 Jewelry Auction. All rights reserved.
        </Text>
      </View>
    </ScrollView>
  );
};

export default AboutScreen;
