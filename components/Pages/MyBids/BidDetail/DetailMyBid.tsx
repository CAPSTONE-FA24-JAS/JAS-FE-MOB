import React from "react";
import { View, Text, SafeAreaView } from "react-native";
import { RouteProp, useRoute } from "@react-navigation/native";
import { TouchableOpacity } from "react-native-gesture-handler";
import ItemBidCard from "./ItemBidCard";
import AddressInfo from "./AddressInfo";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import TimeLineBid from "./TimeLineBid";
import { useNavigation } from "expo-router";
import { StackNavigationProp } from "@react-navigation/stack";

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
    status: string;
  };
  InvoiceDetail: undefined;
  InvoiceDetailConfirm: undefined;
};

const DetailMyBid: React.FC = () => {
  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();
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
    status,
  } = route.params;

  const user = useSelector((state: RootState) => state.auth.userResponse);
  console.log("User:", user);

  const statusColor = isWin ? "text-green-600" : "text-red-600";

  const handleViewInvoice = () => {
    navigation.navigate("InvoiceDetail");
  };

  const handleConfirmInvoice = () => {
    navigation.navigate("InvoiceDetailConfirm");
  };

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
        status={status}
      />
      {user && isWin && (
        <AddressInfo
          user={{
            ...user,
            phoneNumber: user.phoneNumber || "",
            firstName: user.firstName || "",
            lastName: user.lastName || "",
            address: user.address || {},
          }}
        />
      )}
      <TimeLineBid />
      {status === "pending" ? (
        <TouchableOpacity
          className="bg-blue-500 p-3 rounded mt-4"
          onPress={handleConfirmInvoice}
        >
          <Text className="text-white text-center font-semibold uppercase text-base">
            Confirm Invoice
          </Text>
        </TouchableOpacity>
      ) : (
        <TouchableOpacity
          className="bg-blue-500 p-3 rounded mt-4"
          onPress={handleViewInvoice}
        >
          <Text className="text-white text-center font-semibold uppercase text-base">
            View Invoice
          </Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

export default DetailMyBid;
