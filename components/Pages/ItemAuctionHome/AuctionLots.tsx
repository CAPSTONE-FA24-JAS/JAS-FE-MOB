import { getLotsByAuctionId } from "@/api/lotAPI";
import { AuctionData } from "@/app/types/auction_type";
import { Lot } from "@/app/types/lot_type";
import ItemLots from "@/components/ItemLots";
import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  ScrollView,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";

interface AuctionLotsProps {
  dataAuction: AuctionData;
}

const AuctionLots: React.FC<AuctionLotsProps> = ({ dataAuction }) => {
  const [items, setItems] = useState<Lot[]>([]);
  const [loading, setLoading] = useState<boolean>(true); // Thêm state loading

  useEffect(() => {
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

    fetchLots();
  }, [dataAuction.id]);

  return (
    <ScrollView className="bg-white">
      <View className="bg-red-600">
        <Text className="text-center text-white">Bid 13th 2min 56s Left</Text>
      </View>

      {/* Search and filter section */}
      <View className="flex flex-row justify-around py-3 searchbar">
        <TextInput
          placeholder="Search"
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
        <View className="flex-1 justify-center items-center mt-10">
          <ActivityIndicator size="large" color="#0000ff" />
          <Text className="mt-2 text-gray-500">Loading lots...</Text>
        </View>
      ) : (
        // Render the list of items when loading is complete
        <View className="flex flex-row flex-wrap justify-around listLots">
          {items.length > 0 ? (
            items.map((item) => (
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
            <Text className="text-center text-gray-500 mt-10">
              No lots available.
            </Text>
          )}
        </View>
      )}
    </ScrollView>
  );
};

export default AuctionLots;
