import React from "react";
import { View, Text, Image } from "react-native";
import { RouteProp, useRoute } from "@react-navigation/native";
import { TouchableOpacity } from "react-native-gesture-handler";
import ItemBidCard from "./ItemBidCard";
import AddressInfo from "./AddressInfo";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import TimeLineBid from "./TimeLineBid";

type RootStackParamList = {
  DetailMyBid: {
    isWin: boolean;
    title: string;
    lotNumber: string;
    description: string;
    estimate: string;
    soldPrice: string;
    maxBid: string;
    id: number;
  };
};

const DetailMyBid: React.FC = () => {
  const route = useRoute<RouteProp<RootStackParamList, "DetailMyBid">>();
  const {
    id,
    isWin,
    title,
    lotNumber,
    description,
    estimate,
    soldPrice,
    maxBid,
  } = route.params;

  const user = useSelector((state: RootState) => state.auth.userResponse);
  console.log("userNe", user);

  const imageLink = "https://via.placeholder.com/150";
  const statusColor = isWin ? "text-green-600" : "text-red-600";

  return (
    <View className="flex-1 bg-">
      <ItemBidCard
        key={id}
        id={id}
        statusColor={statusColor}
        isWin={isWin}
        title={title}
        lotNumber={lotNumber}
        description={description}
        estimate={estimate}
        soldPrice={soldPrice}
        maxBid={maxBid}
      />
      {user && isWin && (
        <AddressInfo
          user={{
            ...user,
            phoneNumber: user.phoneNumber || "",
          }}
        />
      )}
      <TimeLineBid />
    </View>
  );
};

export default DetailMyBid;
