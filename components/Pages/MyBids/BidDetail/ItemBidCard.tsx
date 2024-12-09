import { MyBidData } from "@/app/types/bid_type";
import { InvoiceDetailResponse } from "@/app/types/invoice_type";
import { StackNavigationProp } from "@react-navigation/stack";
import { useNavigation } from "expo-router";
import moment from "moment-timezone";
import React from "react";
import { Image, Text, TouchableOpacity, View } from "react-native";

interface ItemBidCardProps {
  isWin: boolean;
  title: string;
  lotNumber: string;
  soldPrice: string;
  id: number;
  status: string;
  typeBid: string;
  minPrice: number;
  maxPrice: number;
  image: string;
  endTime: string;
  startTime: string;
  yourMaxBid: number;
  statusColor: string;
  itemDetailBid: MyBidData;
  invoiceDetails?: InvoiceDetailResponse;
}

type RootStackParamList = {
  LotDetailScreen: {
    id: number; //
    name: string; // title
    minPrice?: number; //
    maxPrice?: number; //
    price?: number; //
    image: string; //
    typeBid: string; //
    status: string; //
    startTime?: string; //
    endTime?: string; //
  };
};

const ItemBidCard: React.FC<ItemBidCardProps> = ({
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
  statusColor,
  itemDetailBid,
  invoiceDetails,
}) => {
  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();
  const goToAuctionDetail = () => {
    navigation.navigate("LotDetailScreen", {
      id,
      name: title,
      minPrice,
      maxPrice,
      price: itemDetailBid.lotDTO.buyNowPrice,
      image,
      typeBid,
      status,
      startTime,
      endTime,
    });
  };
  const getStatusColor = (status: string) => {
    switch (status) {
      case "CreateInvoice":
        return "#7EBF9C"; // Greenish color for "Create Invoice"
      case "Paid":
        return "#4CAF50"; // Green color for "Paid"
      case "PendingPayment":
        return "#FFA500"; // Orange color for "Pending Payment"
      case "Delivering":
        return "#00BFFF"; // Blue color for "Delivering"
      case "Delivered":
        return "#8BC34A"; // Light green color for "Delivered"
      case "Rejected":
        return "#FF0000"; // Red color for "Rejected"
      case "Finished":
        return "#8E44AD"; // Purple color for "Finished"
      case "Refunded":
        return "#FF69B4"; // Pink color for "Refunded"
      case "Cancelled":
        return "#B22222"; // Dark red color for "Cancelled"
      case "Closed":
        return "#A9A9A9"; // Gray color for "Closed"
      default:
        return "#666666"; // Default gray color for unknown status
    }
  };

  const formatStatus = (status: string) => {
    switch (status) {
      case "CreateInvoice":
        return "Invoice Created";
      case "Paid":
        return "Paid";
      case "PendingPayment":
        return "Pending Payment";
      case "Delivering":
        return "Delivering";
      case "Delivered":
        return "Delivered";
      case "Rejected":
        return "Rejected";
      case "Finished":
        return "Finished";
      case "Refunded":
        return "Refunded";
      case "Cancelled":
        return "Cancelled";
      case "Closed":
        return "Closed";
      default:
        return status; // Return the original status if not found
    }
  };

  const formatTypeBid = (typeBid: string) => {
    switch (typeBid) {
      case "Fixed_Price":
        return "Fixed Price";
      case "Secret_Auction":
        return "Secret Auction";
      case "Public_Auction":
        return "Public Auction";
      case "Auction_Price_GraduallyReduced":
        return "Gradually Reduced Price";
      default:
        return typeBid;
    }
  };

  const getStatusLotColor = (status: string) => {
    switch (status) {
      case "Ready":
        return "#FFA500";
      case "Auctionning":
        return "#7EBF9C";
      case "Sold":
        return "#4CAF50";
      case "Cancelled":
        return "#FF0000";
      case "Pausing":
        return "#FFD700";
      default:
        return "#666666";
    }
  };
  const formatStatusLot = (status: string) => {
    switch (status) {
      case "Ready": // sai chính tả
        return "New Lot ready";
      case "Auctionning":
        return "Auctionning";
      case "Sold":
        return "Sold";
      case "Cancelled":
        return "Cancelled";
      case "Pausing":
        return "Paused";
      default:
        return status;
    }
  };
  return (
    <View className="p-4 mx-4 my-2 bg-white border-2 border-gray-200 rounded-lg shadow">
      <View className="flex-row justify-between mb-2">
        <Text
          className="px-2 text-base font-semibold text-center text-white uppercase rounded-md"
          style={{ backgroundColor: getStatusColor(itemDetailBid?.status) }}>
          {formatStatus(itemDetailBid?.status)}
        </Text>
        <Text className={`  font-semibold py-1 px-2 uppercase text-center`}>
          Bid Num #{itemDetailBid.id}
        </Text>
      </View>
      <View className="flex-row ">
        {image ? (
          <Image source={{ uri: image }} className="w-24 h-full mr-4 rounded" />
        ) : (
          <Image
            source={require("../../../../assets/item-jas/item1.jpg")}
            className="w-24 h-24 mr-4 rounded"
          />
        )}

        <View className="flex-1">
          <View className="flex flex-row items-center justify-between ">
            <Text className=" text-sm  text-[#8f8f8f] ">
              {moment(startTime).format(" DD/MM/YYYY")} -{" "}
              {moment(endTime).format(" DD/MM/YYYY")}
            </Text>
            {/* <Text className="text-xs text-gray-600 ">12:00, 20/12/2024</Text> */}
            <Text className="text-gray-600">{lotNumber ?? "0"}</Text>
          </View>
          <Text className="text-lg font-semibold ">{title ?? "N/A"}</Text>
          <View>
            <View className="flex flex-row items-center gap-2 ">
              <Text
                className={`${statusColor} uppercase font-semibold text-sm `}>
                {isWin ? "You Win" : "You Loose"}
              </Text>
              <Text className={`text-gray-600 font-semibold text-sm `}>
                with
              </Text>
              {!isWin && (
                <Text
                  className={`${statusColor} uppercase font-semibold text-sm `}>
                  {yourMaxBid.toLocaleString("vi-VN", {
                    style: "currency",
                    currency: "VND",
                  }) ?? "0 VND"}
                </Text>
              )}

              {invoiceDetails ? (
                <Text
                  className={`${statusColor} uppercase font-semibold text-sm `}>
                  {isWin
                    ? invoiceDetails.price.toLocaleString("vi-VN", {
                        style: "currency",
                        currency: "VND",
                      }) ?? "0 VND"
                    : invoiceDetails.price.toLocaleString("vi-VN", {
                        style: "currency",
                        currency: "VND",
                      }) ?? "0 VND"}
                </Text>
              ) : (
                <Text
                  className={`${statusColor} uppercase font-semibold text-sm `}>
                  {isWin &&
                    (yourMaxBid.toLocaleString("vi-VN", {
                      style: "currency",
                      currency: "VND",
                    }) ??
                      "0 VND")}
                </Text>
              )}
              {/* {soldPrice && (
                <Text className={`${statusColor} text-sm font-bold`}>
                  - {soldPrice}
                </Text>
              )} */}
            </View>

            <Text>
              <Text className="font-semibold">Type:</Text>{" "}
              {formatTypeBid(typeBid ?? "N/A")}
            </Text>

            {minPrice !== 0 && maxPrice !== 0 && (
              <View className="">
                <Text className=" text-base text-[#6c6c6c] ">
                  Est:{" "}
                  {minPrice.toLocaleString("vi-VN", {
                    style: "currency",
                    currency: "VND",
                  })}{" "}
                  -{" "}
                  {maxPrice.toLocaleString("vi-VN", {
                    style: "currency",
                    currency: "VND",
                  })}
                </Text>
                <View className="flex-row gap-2 ">
                  <Text className="text-base font-bold text-[#6c6c6c] ">
                    Start Bid:
                  </Text>
                  <Text className="text-[#6c6c6c] text-base ">
                    {minPrice.toLocaleString("vi-VN", {
                      style: "currency",
                      currency: "VND",
                    })}
                  </Text>
                </View>
              </View>
            )}
          </View>
          <View className="flex-row justify-between mt-4">
            <Text
              className="text-base font-semibold text-center uppercase"
              style={{
                color: getStatusLotColor(itemDetailBid.lotDTO.status),
              }}>
              {formatStatusLot(itemDetailBid.lotDTO.status ?? "N/A")}
            </Text>
            <TouchableOpacity
              onPress={goToAuctionDetail}
              className="px-3 py-1 bg-gray-600 rounded">
              <Text className="font-semibold text-center text-white">
                XEM CHI TIẾT
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </View>
  );
};

export default ItemBidCard;
