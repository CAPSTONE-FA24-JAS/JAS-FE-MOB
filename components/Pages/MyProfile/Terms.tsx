import React from "react";
import { View, Text, ScrollView, TouchableOpacity } from "react-native";

const Terms: React.FC = () => {
  return (
    <ScrollView className="p-4 bg-white flex-1">
      {/* Section 1: Introduction */}
      <View className="mb-6">
        <Text className="text-lg font-bold mb-2">1. Introduction</Text>
        <Text className="text-gray-700">
          Welcome to our Jewelry Auction App. These terms and conditions outline
          the rules and regulations for the use of our app. By accessing and
          using this app, you accept these terms and conditions. Please read
          them carefully.
        </Text>
      </View>

      {/* Section 2: User Responsibilities */}
      <View className="mb-6">
        <Text className="text-lg font-bold mb-2">
          2. User Accounts and Responsibilities
        </Text>
        <Text className="text-gray-700">
          As a user, you are responsible for maintaining the confidentiality of
          your account and password and for restricting access to your account.
          You agree to accept responsibility for all activities that occur under
          your account.
        </Text>
      </View>

      {/* Section 3: Bidding Rules */}
      <View className="mb-6">
        <Text className="text-lg font-bold mb-2">3. Bidding and Auctions</Text>
        <Text className="text-gray-700">
          By placing a bid, you agree that your bid is binding. All bids are
          final and cannot be withdrawn once placed. The highest bidder at the
          end of the auction wins the item, subject to any reserve price that
          may be set.
        </Text>
      </View>

      {/* Section 4: Payments */}
      <View className="mb-6">
        <Text className="text-lg font-bold mb-2">4. Payments</Text>
        <Text className="text-gray-700">
          Payments for auction items must be made within 48 hours after the
          auction ends. Failure to complete payment may result in the auction
          item being awarded to another bidder.
        </Text>
      </View>

      {/* Section 5: Shipping and Delivery */}
      <View className="mb-6">
        <Text className="text-lg font-bold mb-2">5. Shipping and Delivery</Text>
        <Text className="text-gray-700">
          Items will be shipped within 7 business days after payment is
          received. Shipping fees are the responsibility of the buyer, and any
          delays due to customs or other regulations are not the responsibility
          of the seller.
        </Text>
      </View>

      {/* Section 6: Returns and Refunds */}
      <View className="mb-6">
        <Text className="text-lg font-bold mb-2">6. Returns and Refunds</Text>
        <Text className="text-gray-700">
          All sales are final. No returns or refunds will be accepted unless the
          item is not as described in the auction listing. In the event of a
          dispute, please contact our support team.
        </Text>
      </View>

      {/* Section 7: Limitation of Liability */}
      <View className="mb-6">
        <Text className="text-lg font-bold mb-2">
          7. Limitation of Liability
        </Text>
        <Text className="text-gray-700">
          Our app and its services are provided on an "as is" and "as available"
          basis. We make no warranties, expressed or implied, regarding the
          accuracy or completeness of the auction listings. In no event shall we
          be liable for any damages arising from your use of the app.
        </Text>
      </View>

      {/* Section 8: Amendments */}
      <View className="mb-6">
        <Text className="text-lg font-bold mb-2">8. Amendments</Text>
        <Text className="text-gray-700">
          We reserve the right to amend these terms and conditions at any time
          without notice. It is your responsibility to review these terms
          periodically for any changes.
        </Text>
      </View>

      {/* Section 9: Governing Law */}
      <View className="mb-6">
        <Text className="text-lg font-bold mb-2">9. Governing Law</Text>
        <Text className="text-gray-700">
          These terms and conditions are governed by and construed in accordance
          with the laws of [Your Country/Region]. Any disputes will be handled
          in the courts of [Your Country/Region].
        </Text>
      </View>
    </ScrollView>
  );
};

export default Terms;
