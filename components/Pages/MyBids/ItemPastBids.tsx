import { DataCurentBidResponse } from "@/app/types/bid_type";
import { InvoiceData } from "@/app/types/invoice_type";
import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import moment from "moment-timezone";
import React from "react";
import { Image, Text, TouchableOpacity, View } from "react-native";

interface ItemPastBidsProps {
  invoiceId?: number;
  isWin: boolean;
  title: string;
  lotNumber: string;
  soldPrice: number;
  id: number;
  statusLot: string;
  typeBid: string;
  minPrice: number;
  maxPrice: number;
  image: string;
  endTime: string;
  startTime: string;
  yourMaxBid: number;
  statusInvoice?: string;
  itemBid: DataCurentBidResponse;
  itemInvoice?: InvoiceData;
  statusTabs?: number;
}

type RootStackParamList = {
  DetailMyBid: {
    isWin: boolean;
    title: string;
    lotNumber: string;
    soldPrice: number;
    id: number;
    status: string;
    typeBid: string;
    minPrice: number;
    maxPrice: number;
    image: string;
    endTime: string;
    startTime: string;
    yourMaxBid: number;
    itemBid: DataCurentBidResponse;
    invoiceId: number;
  };
};

const ItemPastBids: React.FC<ItemPastBidsProps> = ({
  isWin,
  title,
  lotNumber,
  soldPrice,
  id,
  statusLot,
  typeBid,
  minPrice,
  maxPrice,
  image,
  endTime,
  startTime,
  yourMaxBid,
  itemBid,

  invoiceId,
  statusInvoice,
  itemInvoice,
  statusTabs,
}) => {
  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();

  const getStatusColor = (status: string) => {
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
  const formatStatus = (status: string) => {
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

  const getStatusColorInvoice = (status: string) => {
    switch (status) {
      case "CreateInvoice":
        return "#FFA500";
      case "Paid":
        return "#008000";
      case "PendingPayment":
        return "#FFD700";
      case "Delivering":
        return "#4CAF50";
      case "Delivered":
        return "#FF0000";
      case "Rejected":
        return "#ff0000";
      case "Finished":
        return "#008000";
      case "Refunded":
        return "#9b32a8";
      case "Cancelled":
        return "#ff0000";
      default:
        return "#666666";
    }
  };
  const formatStatusInvoice = (status: string) => {
    switch (status) {
      case "CreateInvoice": // sai chính tả
        return "Create Invoice";
      case "Paid": // sai chính tả
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
      case "Rejected":
        return "Rejected";
      case "Refunded":
        return "Refunded";
      case "Cancelled":
        return "Cancelled";
      default:
        return status;
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
        return "Reverse Auction";
      default:
        return typeBid;
    }
  };
  // console.log("itemBid", itemBid);

  return (
    <TouchableOpacity
      onPress={() => {
        if (!itemBid) {
          return;
        }
        navigation.navigate("DetailMyBid", {
          isWin,
          title,
          lotNumber,
          soldPrice,
          id,
          status: statusLot,
          typeBid: typeBid,
          minPrice: typeBid === "Auction_Price_GraduallyReduced" ? 0 : minPrice,
          maxPrice:
            typeBid === "Fixed_Price"
              ? 0
              : typeBid === "Secret_Auction"
              ? itemBid?.lotDTO?.finalPriceSold ?? 0
              : typeBid === "Public_Auction"
              ? 0
              : minPrice,
          image,
          endTime: endTime,
          startTime: startTime,
          yourMaxBid: yourMaxBid,
          itemBid: itemBid,
          invoiceId: invoiceId ?? 0,
        });
      }}
      className="flex-row flex-1 gap-2 p-4 my-1 bg-white border-2 border-gray-200 rounded-lg shadow-lg">
      <View className="flex items-center w-[40%]">
        <Image
          className="w-[160px] h-[200px] rounded-lg"
          source={{
            uri:
              image ||
              "https://st4.depositphotos.com/14953852/24787/v/380/depositphotos_247872612-stock-illustration-no-image-available-icon-vector.jpg",
          }}
        />
        <View
          className={
            isWin
              ? "bg-[#98C583] p-2 mt-2 rounded-md w-[100%]"
              : "bg-[#C5838F] p-2 mt-2 rounded-md w-[100%]"
          }>
          <Text className="text-lg font-bold text-center text-white">
            {isWin ? "You Win !!!" : "You Lose !!!"}
          </Text>
        </View>
      </View>

      <View className="w-[58%] pl-4">
        {invoiceId ? (
          <TouchableOpacity
            className={` rounded px-4 py-1 justify-center mr-4 flex-row items-center`}
            style={{
              backgroundColor: getStatusColorInvoice(statusInvoice ?? "N/A"),
            }}>
            <Text className="text-base font-semibold text-center text-white uppercase">
              {formatStatusInvoice(statusInvoice ?? "N/A")}
            </Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity
            className={` rounded px-4 py-1 justify-center mr-4 flex-row items-center`}
            style={{ backgroundColor: getStatusColor(statusLot) }}>
            <Text className="text-base font-semibold text-center text-white uppercase">
              {formatStatus(statusLot)}
            </Text>
          </TouchableOpacity>
        )}
        <Text className=" text-sm  text-[#8f8f8f] ">
          {moment(startTime).format(" DD/MM/YYYY")} -
          {moment(endTime).format(" DD/MM/YYYY")}
        </Text>
        {invoiceId ? (
          <Text className="text-base font-semibold text-gray-600">
            Invoice #{invoiceId} - {lotNumber}
          </Text>
        ) : (
          <Text className="text-base font-semibold text-gray-600">
            {lotNumber}
          </Text>
        )}
        <Text className="text-xl font-bold">{title}</Text>
        <View className="flex-row  w-[60%]">
          <Text className="text-base font-bold text-[#6c6c6c] ">Type: </Text>
          <Text className="text-[#6c6c6c] text-base ">
            {formatTypeBid(typeBid || "")}
          </Text>
        </View>
        {minPrice !== 0 && maxPrice !== 0 && (
          <View className="">
            <Text className=" text-base text-[#6c6c6c] ">
              Est:{" "}
              {minPrice?.toLocaleString("vi-VN", {
                style: "currency",
                currency: "VND",
              })}{" "}
              -{" "}
              {maxPrice?.toLocaleString("vi-VN", {
                style: "currency",
                currency: "VND",
              })}
            </Text>
            <View className="flex-row gap-2 ">
              <Text className="text-base font-bold text-[#6c6c6c] ">
                Start Bid:
              </Text>
              <Text className="text-[#6c6c6c] text-base ">
                {minPrice?.toLocaleString("vi-VN", {
                  style: "currency",
                  currency: "VND",
                })}
              </Text>
            </View>
          </View>
        )}
        {isWin && (
          <Text className="text-base text-gray-600">
            SOLD:{" "}
            <Text className="font-semibold">
              {yourMaxBid.toLocaleString("vi-VN", {
                style: "currency",
                currency: "VND",
              })}
            </Text>
          </Text>
        )}
        <Text className="text-base text-gray-600">
          Your max bid:{" "}
          <Text className="font-semibold">
            {yourMaxBid.toLocaleString("vi-VN", {
              style: "currency",
              currency: "VND",
            })}
          </Text>
        </Text>
        {invoiceId && (
          <Text className="text-base text-gray-600">
            Have Invoice:{" "}
            <Text className="font-semibold">{invoiceId ? "Yes" : "No"}</Text>
          </Text>
        )}
      </View>
    </TouchableOpacity>
  );
};

export default ItemPastBids;
