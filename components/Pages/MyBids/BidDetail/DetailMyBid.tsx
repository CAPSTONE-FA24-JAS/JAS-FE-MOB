import React, { useEffect, useState } from "react";
import { View, Text, SafeAreaView, ActivityIndicator } from "react-native";
import { RouteProp, useRoute } from "@react-navigation/native";
import { TouchableOpacity } from "react-native-gesture-handler";
import ItemBidCard from "./ItemBidCard";
import AddressInfo from "./AddressInfo";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import TimeLineBid from "./TimeLineBid";
import { useNavigation } from "expo-router";
import { StackNavigationProp } from "@react-navigation/stack";
import { DataCurentBidResponse, MyBidData } from "@/app/types/bid_type";
import { getMyBidByCustomerLotId } from "@/api/bidApi";
import { showErrorMessage } from "@/components/FlashMessageHelpers";

type RootStackParamList = {
  DetailMyBid: {
    isWin?: boolean;
    title: string;
    lotNumber: string;
    soldPrice?: string;
    id: number;
    status: string;
    typeBid: string;
    minPrice: number;
    maxPrice: number;
    image: string;
    endTime: string;
    startTime: string;
    yourMaxBid?: number;
    itemBid: DataCurentBidResponse;
  };
  InvoiceDetail: undefined;
  InvoiceDetailConfirm: undefined;
};

const DetailMyBid: React.FC = () => {
  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();
  const route = useRoute<RouteProp<RootStackParamList, "DetailMyBid">>();
  const {
    isWin,
    title,
    lotNumber,
    soldPrice,
    id,
    status,
    typeBid,
    minPrice,
    maxPrice,
    image,
    endTime,
    startTime,
    yourMaxBid,
    itemBid,
  } = route.params;

  const user = useSelector((state: RootState) => state.auth.userResponse);
  console.log("User:", user);

  const statusColor = isWin ? "text-green-600" : "text-red-600";

  const [itemDetailBid, setItemDetailBid] = useState<MyBidData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  console.log("itemDetailBid", itemDetailBid);
  console.log("itemBid in Detail", itemBid);

  useEffect(() => {
    // Fetch bid details when the component is mounted
    const fetchBidDetails = async () => {
      try {
        if (itemBid.id) {
          const response = await getMyBidByCustomerLotId(itemBid.id);
          if (response?.isSuccess) {
            setItemDetailBid(response.data);
          } else {
            showErrorMessage(
              response?.message || "Failed to load bid details."
            );
          }
        }
      } catch (error) {
        showErrorMessage("Unable to retrieve bid details.");
      } finally {
        setLoading(false);
      }
    };

    fetchBidDetails();
  }, [itemBid.id]);

  if (loading) {
    return (
      <View className="flex-1 justify-center items-center">
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }
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
        isWin={isWin ? true : false}
        title={title}
        lotNumber={lotNumber}
        soldPrice={soldPrice ? soldPrice : ""}
        status={status}
        typeBid={typeBid}
        minPrice={minPrice}
        maxPrice={maxPrice}
        image={image}
        endTime={endTime}
        startTime={startTime}
        yourMaxBid={yourMaxBid ? yourMaxBid : 0}
        itemDetailBid={itemDetailBid || ({} as MyBidData)}
      />
      {user && isWin && (
        <AddressInfo
          user={{
            ...user,
            phoneNumber: user.phoneNumber || "",
            firstName: user.firstName || "",
            lastName: user.lastName || "",
            address: user.address,
          }}
        />
      )}
      <TimeLineBid />
      {/* {status === "pending" ? ( */}
      <TouchableOpacity
        className="bg-blue-500 p-3 mx-4 rounded mt-4"
        onPress={handleConfirmInvoice}
      >
        <Text className="text-white text-center font-semibold uppercase text-base">
          Confirm Invoice
        </Text>
      </TouchableOpacity>
      {/* ) : ( */}
      <TouchableOpacity
        className="bg-blue-500 p-3  mx-4 rounded my-4"
        onPress={handleViewInvoice}
      >
        <Text className="text-white text-center font-semibold uppercase text-base">
          View Invoice
        </Text>
      </TouchableOpacity>
      {/* )} */}
    </View>
  );
};

export default DetailMyBid;
