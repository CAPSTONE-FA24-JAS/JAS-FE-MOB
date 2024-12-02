import { getLotsByAuctionId } from "@/api/lotAPI";
import { AuctionData } from "@/app/types/auction_type";
import { Lot } from "@/app/types/lot_type";
import AuctionCountdownTimer from "@/components/CountDown/CountdownTimerAuction";
import ItemLots from "@/components/ItemLots";
import { useFocusEffect } from "expo-router";
import React, { useCallback, useState } from "react";
import {
  ActivityIndicator,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

interface AuctionLotsProps {
  dataAuction: AuctionData;
}

const AuctionLots: React.FC<AuctionLotsProps> = ({ dataAuction }) => {
  const [items, setItems] = useState<Lot[]>([]);
  const [loading, setLoading] = useState<boolean>(true); // Thêm state loading

  const fetchLots = async () => {
    setLoading(true); // Bắt đầu loading
    try {
      const response = await getLotsByAuctionId(dataAuction.id);

      if (response && response.isSuccess) {
        setItems(response.data);
      }
    } catch (error) {
      console.error("Failed to fetch lots:", error);
    } finally {
      setLoading(false); // Kết thúc loading
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchLots();
    }, [dataAuction.id])
  );

  return (
    <ScrollView className="bg-white">
      <AuctionCountdownTimer startTime={dataAuction?.startTime || null} />

      {/* Search and filter section */}
      <View className="flex flex-row justify-around py-3 searchbar">
        <TextInput
          placeholder="Search"
          returnKeyType="done"
          className="border-[1px] border-slate-300 px-4 rounded-lg text-sm w-7/12 ml-3"
        />
        <TouchableOpacity className="flex items-center justify-center w-2/12 rounded-md bg-slate-200">
          <Text className="text-center">Filter</Text>
        </TouchableOpacity>
        <TouchableOpacity className="flex items-center justify-center w-2/12 rounded-md bg-slate-200">
          <Text className="text-center">Sort</Text>
        </TouchableOpacity>
      </View>

      {/* Hiển thị loading khi dữ liệu đang được tải */}
      {loading ? (
        <View className="items-center justify-center flex-1 mt-10">
          <ActivityIndicator size="large" color="#0000ff" />
          <Text className="mt-2 text-gray-500">Loading lots...</Text>
        </View>
      ) : (
        // Render the list of items when loading is complete
        <View className="flex flex-row flex-wrap justify-around listLots">
          {items?.length > 0 ? (
            items?.map((item) => (
              <ItemLots
                key={item.id}
                id={item.id}
                name={item.title || "Unnamed Lot"}
                minPrice={item.startPrice || 0}
                maxPrice={item.endPrice || 0}
                price={item.buyNowPrice || 0}
                image={item.imageLinkJewelry}
                typeBid={item.lotType}
                status={item.status}
                startTime={item.startTime}
                endTime={item.endTime}
              />
            ))
          ) : (
            <Text className="mt-10 text-center text-gray-500">
              No lots available.
            </Text>
          )}
        </View>
      )}
    </ScrollView>
  );
};

export default AuctionLots;
