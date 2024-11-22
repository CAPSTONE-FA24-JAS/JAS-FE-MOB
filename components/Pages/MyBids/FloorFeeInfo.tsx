import { getFloorFees } from "@/api/lotAPI";
import React, { useEffect, useState } from "react";
import { View, Text, ScrollView, TouchableOpacity } from "react-native";

const BuyerPremiumInfo = () => {
  const [floorFees, setFloorFees] = useState<
    { from: number | null; to: number | null; percent: number; id: number }[]
  >([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // State để kiểm soát hiển thị nội dung
  const [isViewMore, setIsViewMore] = useState(false);

  useEffect(() => {
    const fetchFloorFees = async () => {
      try {
        const fees = await getFloorFees();
        if (fees) {
          setFloorFees(fees);
        }
      } catch (err) {
        setError("Failed to load floor fees.");
      } finally {
        setLoading(false);
      }
    };
    fetchFloorFees();
  }, []);

  return (
    <ScrollView className="flex-1 bg-gray-200 rounded-md mt-4 p-4">
      {/* Thông báo đầu */}
      <Text className="text-sm text-gray-700 mb-4">
        <Text className="font-bold">Note:</Text> Your credit card will be
        authorized for $1 for verification purposes. This authorization may
        appear as a charge and immediate refund in your account by your bank.
      </Text>

      {/* Tiêu đề quan trọng */}
      <Text className="text-red-600 font-bold text-lg mb-4">
        IMPORTANT: Winning bidders will be charged a Buyer’s Premium IN ADDITION
        to their winning bid (the Buyer’s Premium is not included in the online
        bid value).
      </Text>

      {/* Nội dung hiển thị khi ấn "View More" */}
      {isViewMore && (
        <>
          {/* Thông tin phí sàn */}
          <Text className="text-base text-black font-bold mb-2">
            Buyer’s Premiums are as follows:
          </Text>
          {loading ? (
            <Text className="text-gray-500">Loading floor fees...</Text>
          ) : error ? (
            <Text className="text-red-500">{error}</Text>
          ) : (
            <View className="mb-4">
              {floorFees.map((fee) => (
                <Text
                  key={fee.id}
                  className="text-sm text-gray-700 font-semibold mb-2"
                >
                  •{" "}
                  {fee.from?.toLocaleString("vi-VN", {
                    style: "currency",
                    currency: "VND",
                  }) || "Above"}{" "}
                  to{" "}
                  {fee.to
                    ? fee.to.toLocaleString("vi-VN", {
                        style: "currency",
                        currency: "VND",
                      })
                    : "Above"}{" "}
                  - {fee.percent * 100}%
                </Text>
              ))}
            </View>
          )}

          {/* Ví dụ */}
          <Text className="text-sm text-gray-700 mb-4">
            For example, if you bid $1,000 on a lot and win, the amount due with
            the Buyer’s Premium would be $1,250.
          </Text>

          {/* Ghi chú quan trọng */}
          <Text className="text-red-600 font-bold mt-4">
            IMPORTANT: Please note that bids, once placed, cannot be retracted
            or reduced. Kindly refer to our Terms and Conditions for full
            details.
          </Text>
        </>
      )}

      {/* Nút View More / View Less */}
      <TouchableOpacity
        onPress={() => setIsViewMore(!isViewMore)}
        className="mt-4 bg-blue-500 py-2 rounded-md"
      >
        <Text className="text-center text-white font-semibold">
          {isViewMore ? "View Less" : "View More"}
        </Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

export default BuyerPremiumInfo;
