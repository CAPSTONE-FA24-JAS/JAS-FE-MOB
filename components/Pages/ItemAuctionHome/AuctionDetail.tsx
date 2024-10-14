import { AuctionData } from "@/app/types/auction_type";
import React, { useEffect, useState } from "react";
import { View, Text, Image, ScrollView, TouchableOpacity } from "react-native";
import Swiper from "react-native-swiper";

interface AuctionDetailScreenProps {
  setIsSwiperActive: React.Dispatch<React.SetStateAction<boolean>>;
  dataAuction: AuctionData;
}

const AuctionDetailScreen: React.FC<AuctionDetailScreenProps> = ({
  setIsSwiperActive,
  dataAuction,
}) => {
  const [countdown, setCountdown] = useState<string>("");

  useEffect(() => {
    const updateCountdown = () => {
      const now = new Date().getTime();
      let timeDiff;

      if (dataAuction?.status === "Living") {
        timeDiff = new Date(dataAuction.endTime).getTime() - now;
      } else if (dataAuction?.status === "NotStarted") {
        timeDiff = new Date(dataAuction.startTime).getTime() - now;
      }

      if (timeDiff && timeDiff > 0) {
        const hours = Math.floor(
          (timeDiff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
        );
        const minutes = Math.floor((timeDiff % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((timeDiff % (1000 * 60)) / 1000);
        setCountdown(`${hours}h ${minutes}min ${seconds}s`);
      } else {
        setCountdown("Expired");
      }
    };

    const intervalId = setInterval(updateCountdown, 1000);

    return () => clearInterval(intervalId);
  }, [dataAuction]);

  return (
    <ScrollView className="bg-white">
      {dataAuction?.status === "Living" ? (
        <View className="bg-red-600 py-2">
          <Text className="text-center text-white font-semibold">
            Bid {countdown} Left
          </Text>
        </View>
      ) : dataAuction?.status === "NotStarted" ? (
        <View className="bg-yellow-600 py-2">
          <Text className="text-center text-white  font-semibold">
            Upcoming After {countdown}
          </Text>
        </View>
      ) : (
        <View className="bg-gray-600 py-2">
          <Text className="text-center text-white font-semibold">
            END BIDING
          </Text>
        </View>
      )}

      <View className="h-64">
        <Swiper
          showsPagination={true}
          autoplay={true}
          onIndexChanged={() => setIsSwiperActive(false)}
          onTouchStart={() => setIsSwiperActive(true)}
          onTouchEnd={() => setIsSwiperActive(false)}
          style={{ height: "100%" }}
        >
          {/* Thay thế các hình ảnh tĩnh bằng ảnh từ API */}
          {dataAuction?.imageLink ? (
            <View>
              <Image
                source={
                  dataAuction?.imageLink?.startsWith("http")
                    ? { uri: dataAuction.imageLink }
                    : require("../../../assets/bgItemAuction.png")
                }
                className="w-full h-full"
                resizeMode="cover"
              />
            </View>
          ) : (
            <View>
              <Image
                source={require("../../../assets/bgItemAuction.png")}
                className="w-full h-full"
                resizeMode="cover"
              />
            </View>
          )}
        </Swiper>
      </View>
      <View className="p-4">
        <Text className="mb-2 text-xl font-bold">
          {dataAuction?.name || "Unnamed Auction"}
        </Text>
        <Text className=" text-gray-600">Live Bidding Begins: </Text>
        <Text className="mb-4 text-gray-600 font-semibold">
          {new Date(dataAuction?.startTime).toLocaleString("en-US", {
            timeZone: "GMT",
          })}{" "}
          -{" "}
          {new Date(dataAuction?.endTime).toLocaleString("en-US", {
            timeZone: "GMT",
          })}
        </Text>
        <Text className="mb-4 text-gray-600">New York, NY</Text>
        <TouchableOpacity className="py-3 mb-3 bg-blue-500 rounded-sm">
          <Text className="font-semibold text-center text-white">
            VIEW LOTS
          </Text>
        </TouchableOpacity>
        <TouchableOpacity className="py-3 bg-blue-500 rounded-sm">
          <Text className="font-semibold text-center text-white">
            REGISTER TO BID
          </Text>
        </TouchableOpacity>
        <Text className="mt-6 mb-2 font-bold">AUCTION DESCRIPTION</Text>
        <Text className="text-gray-700">
          {dataAuction?.description ||
            "No Description:  Step Into An Evening Of Elegance And Sophistication As We Present Designer Christopher's Exclusive Evening Collection..."}
        </Text>

        {/* Phía dưới chưa có data */}
        <Text className="mt-6 mb-2 font-bold">LOCATION DESCRIPTION</Text>
        <Text className="text-gray-700">
          The auction will be held at the prestigious Grand Pavilion Hall,
          located in the heart of the city...
        </Text>
        <Text className="mt-6 mb-2 font-bold">VIEWING INFORMATION</Text>
        <Text className="text-gray-700">
          Interested buyers are invited to an exclusive viewing of the Designer
          Christopher's Evening Collection...
        </Text>
        <Text className="mt-6 mb-2 font-bold">Notes</Text>
        <Text className="text-gray-700">
          Bidders must register prior to the auction; registration will be
          available online and at the venue on the day...
        </Text>
      </View>
    </ScrollView>
  );
};

export default AuctionDetailScreen;
