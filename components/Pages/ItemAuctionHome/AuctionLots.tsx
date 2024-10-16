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
} from "react-native";

interface Item {
  id: string;
  name: string;
  price: number | null;
  minPrice: number | null;
  maxPrice: number | null;
  image: string;
  typeBid: number;
}

interface AuctionLotsProps {
  dataAuction: AuctionData;
}

const AuctionLots: React.FC<AuctionLotsProps> = ({ dataAuction }) => {
  const [items, setItems] = useState<Lot[]>([]);
  console.log("responsegetLots", items);

  useEffect(() => {
    const fetchLots = async () => {
      try {
        const response = await getLotsByAuctionId(dataAuction.id);

        if (response && response.isSuccess) {
          setItems(response.data);
        }
      } catch (error) {
        console.error("Failed to fetch lots:", error);
      }
    };

    fetchLots();
  }, [dataAuction.id]);

  return (
    <ScrollView className="bg-white">
      <View className="bg-red-600">
        <Text className="text-center text-white">Bid 13th 2min 56s Left</Text>
      </View>
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
      {/* Render the list of items */}
      <View className="flex flex-row flex-wrap justify-around listLots">
        {items.map((item) => (
          <ItemLots
            key={item.id}
            id={item.id}
            name={item.name || "Unnamed Lot"}
            minPrice={item.startPrice || 0}
            maxPrice={item.endPrice || 0}
            price={item.buyNowPrice || 0}
            image={item.imageLinkJewelry}
            typeBid={item.lotType}
            status={item.status}
          />
        ))}
      </View>
    </ScrollView>
  );
};

export default AuctionLots;
