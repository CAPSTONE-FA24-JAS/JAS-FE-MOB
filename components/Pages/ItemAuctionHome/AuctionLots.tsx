import ItemLots from "@/components/ItemLots";
import React from "react";
import {
  View,
  Text,
  ScrollView,
  TextInput,
  TouchableOpacity,
} from "react-native";

const AuctionLots = () => {
  // Mock data for the 4 items
  const items = [
    {
      id: "101",
      name: "Lalaounis Chimera Chocker",
      price: 2600,
      minPrice: null,
      maxPrice: null,
      image:
        "https://laimut.com/wp-content/uploads/Vong-Co-Swarovski-Chinh-Hang-Angelic-necklace-10.jpg",
      typeBid: 1,
    },
    {
      id: "102",
      name: "Cartier Love Bracelet",
      price: null,
      minPrice: null,
      maxPrice: null,
      image:
        "https://laimut.com/wp-content/uploads/Vong-Co-Swarovski-Chinh-Hang-Angelic-necklace-10.jpg",
      typeBid: 2,
    },
    {
      id: "103",
      name: "Hermès Birkin Bag",
      price: null,
      minPrice: 3500,
      maxPrice: 4000,
      image:
        "https://laimut.com/wp-content/uploads/Vong-Co-Swarovski-Chinh-Hang-Angelic-necklace-10.jpg",
      typeBid: 3,
    },
    {
      id: "104",
      name: "Patek Philippe Nautilus",
      price: null,
      minPrice: 3500,
      maxPrice: 4000,
      image:
        "https://laimut.com/wp-content/uploads/Vong-Co-Swarovski-Chinh-Hang-Angelic-necklace-10.jpg",
      typeBid: 4,
    },
  ];

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
            name={item.name}
            minPrice={item.minPrice || 0}
            maxPrice={item.maxPrice || 0}
            price={item.price || 0}
            image={item.image}
            typeBid={item.typeBid}
          />
        ))}
      </View>
    </ScrollView>
  );
};

export default AuctionLots;
