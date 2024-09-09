import React from "react";
import { View, Text, Image, ScrollView, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const AuctionDetailScreen = () => {
  return (
    <ScrollView className="bg-white">
      <View className="bg-red-600">
        <Text className="text-center text-white">Bid 13th 2min 56s Left</Text>
      </View>
      <Image
        source={require("../../assets/bgItemAuction.png")}
        className="w-full py-10 h-fit"
        resizeMode="cover"
      />

      <View className="p-4">
        <Text className="mb-2 text-xl font-bold">
          Designer Christopher's Evening Collection
        </Text>
        <Text className="mb-4 text-gray-600">
          Live Bidding Begins: 27 August 2024 @ 22:00
        </Text>
        <Text className="mb-4 text-gray-600">New York, NY</Text>
        <TouchableOpacity className="py-3 mb-3 bg-blue-500 rounded-lg">
          <Text className="font-semibold text-center text-white">
            VIEW LOTS
          </Text>
        </TouchableOpacity>
        <TouchableOpacity className="py-3 bg-blue-500 rounded-lg">
          <Text className="font-semibold text-center text-white">
            REGISTER TO BID
          </Text>
        </TouchableOpacity>
        <Text className="mt-6 mb-2 font-bold">AUCTION DESCRIPTION</Text>
        <Text className="text-gray-700">
          Step Into An Evening Of Elegance And Sophistication As We Present
          Designer Christopher's Exclusive Evening Collection. This Carefully
          Curated Selection Showcases The Pinnacle Of Luxury Fashion And
          Exquisite Craftsmanship, From Stunning Evening Gowns To Exquisite
          Jewelry. Each Piece In This Collection Is A Testament To Christopher's
          Unique Design Philosophy, Combining Classic Elements With Modern
          Twists To Create Truly Unforgettable Looks That Have Graced The Most
          Celebrated Red Carpets In The High Fashion World.
        </Text>
        <Text className="mt-6 mb-2 font-bold">LOCATION DESCRIPTION</Text>
        <Text className="text-gray-700">
          The auction will be held at the prestigious Grand Pavilion Hall,
          located in the heart of the city. The Grand Pavilion is renowned for
          its opulent decor and state-of-the-art facilities, providing the
          perfect backdrop for this luxurious event. Attendees will enjoy a
          refined ambiance with ample seating, perfect lighting, and a
          comfortable environment to bid on these extraordinary items.
          Complimentary valet parking and refreshments will be provided.
        </Text>
        <Text className="mt-6 mb-2 font-bold">VIEWING INFORMATION</Text>
        <Text className="text-gray-700">
          Interested buyers are invited to an exclusive viewing of the Designer
          Christopher's Evening Collection on [insert date], from [insert time].
          The viewing will take place at the Grand Pavilion Hall, where guests
          will have the opportunity to inspect the pieces up close. Our team of
          experts will be available to provide detailed information about each
          item and answer any questions. Please RSVP by [insert date] to secure
          your viewing appointment.
        </Text>
        <Text className="mt-6 mb-2 font-bold">Notes</Text>
        <Text className="text-gray-700">
          Bidders must register prior to the auction; registration will be
          available online and at the venue on the day of the event. All items
          are sold as-is; please inspect them thoroughly during the viewing
          period. A buyer's premium of [insert percentage] will be added to the
          final hammer price. Payment options include credit/debit cards, bank
          transfers, and certified checks. Please note that full payment is
          required within 24 hours of the auction's conclusion. Shipping
          arrangements can be made on-site, with insured delivery available to
          both domestic and international destinations.
        </Text>
      </View>
    </ScrollView>
  );
};

export default AuctionDetailScreen;
