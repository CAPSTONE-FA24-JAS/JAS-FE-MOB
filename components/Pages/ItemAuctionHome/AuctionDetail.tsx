import { AuctionData } from "@/app/types/auction_type";
import AuctionCountdownTimer from "@/components/CountDown/CountdownTimerAuction";
import moment from "moment-timezone";
import React, { useEffect, useState } from "react";
import { Image, ScrollView, Text, TouchableOpacity, View } from "react-native";
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
    // Calculate the initial time difference based on auction status
    const now = new Date().getTime();
    let timeDiff = 0;

    if (dataAuction?.status === "Live") {
      timeDiff = new Date(dataAuction.endTime).getTime() - now;
    } else if (dataAuction?.status === "UpComing") {
      timeDiff = new Date(dataAuction.startTime).getTime() - now;
    }

    const updateCountdown = () => {
      if (timeDiff > 0) {
        // Decrease timeDiff by 1 second (1000 ms) in each interval
        timeDiff -= 1000;

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

    // Start the interval to update the countdown every second
    const intervalId = setInterval(updateCountdown, 1000);

    return () => clearInterval(intervalId);
  }, [dataAuction.status, dataAuction.endTime, dataAuction.startTime]);

  function getStatusClass(status: string) {
    switch (status) {
      case "Waiting": // Waiting
        return "bg-purple-500";
      case "UpComing": // Upcoming
        return "bg-blue-400";
      case "Live": // Live
        return "bg-yellow-500";
      case "Past": // Past
        return "bg-green-500";
      case "Cancelled": // Cancelled
        return "bg-red-500";
      default:
        return "bg-black"; // Default màu nền nếu không khớp
    }
  }

  return (
    <ScrollView className="bg-white">
      <AuctionCountdownTimer startTime={dataAuction?.startTime || null} />

      <View className="h-64 mt-2">
        <Swiper
          showsPagination={true}
          autoplay={true}
          onIndexChanged={() => setIsSwiperActive(false)}
          onTouchStart={() => setIsSwiperActive(true)}
          onTouchEnd={() => setIsSwiperActive(false)}
          style={{ height: "100%" }}>
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
        <View className="flex-row w-[98%] justify-between items-center">
          <Text className="text-base font-semibold text-gray-500 uppercase ">
            Auction #{dataAuction.id}
          </Text>
          <Text
            className={`font-extrabold py-1 px-10 ${getStatusClass(
              dataAuction.status
            )} rounded-md text-base uppercase text-white`}>
            {dataAuction.status}
          </Text>
        </View>
        <Text className="mb-2 text-xl font-bold">
          {dataAuction?.name || "Unnamed Auction"}
        </Text>
        <Text className="text-gray-600 ">Live Bidding Begins: </Text>
        <Text className="mb-4 font-semibold text-gray-600">
          {moment(dataAuction?.startTime).format("HH:mm A, DD/MM/YYYY")}-{" "}
          {moment(dataAuction?.endTime).format("HH:mm A, DD/MM/YYYY")}
        </Text>
        <Text className="mb-4 text-gray-600">Viet Nam</Text>
        <TouchableOpacity className="py-3 mb-3 bg-blue-500 rounded-sm">
          <Text className="font-semibold text-center text-white">
            VIEW LOTS
          </Text>
        </TouchableOpacity>

        <Text className="mt-6 mb-2 font-bold">AUCTION DESCRIPTION</Text>
        <Text className="text-gray-700">
          {dataAuction?.description ||
            "No Description:  Step Into An Evening Of Elegance And Sophistication As We Present Designer Christopher's Exclusive Evening Collection..."}
        </Text>

        {/* Phía dưới chưa có data */}
        {/* <Text className="mt-6 mb-2 font-bold">LOCATION DESCRIPTION</Text>
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
        </Text> */}
      </View>
    </ScrollView>
  );
};

export default AuctionDetailScreen;
