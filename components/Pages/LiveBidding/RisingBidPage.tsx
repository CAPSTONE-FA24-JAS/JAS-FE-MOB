import { RouteProp, useRoute } from "@react-navigation/native";
import React, { useEffect, useState } from "react";
import { View, Text, FlatList } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { getLotDetailById } from "@/api/lotAPI";
import {
  Auction,
  Jewelry,
  LotDetail,
  Seller,
  Staff,
} from "@/app/types/lot_type";
import { RootState } from "@/redux/store";
import { useSelector } from "react-redux";
import CountDownTimer from "./BidingComponent/CountDownTimer";
import ProductCard from "./BidingComponent/ProductCard";
import BidsList from "./BidingComponent/BidsList";
import BidInput from "./BidingComponent/BidInput";
import { useBidding } from "@/hooks/useBidding";
import AuctionResultModal from "@/components/Modal/AuctionResultModal";

type RisingBidPageParams = {
  RisingBidPage: {
    itemId: number;
  };
};

const RisingBidPage: React.FC = () => {
  const route = useRoute<RouteProp<RisingBidPageParams, "RisingBidPage">>();
  const { itemId } = route.params ?? {};
  const accountId = useSelector(
    (state: RootState) => state.auth.userResponse?.id
  );

  const customerId = useSelector(
    (state: RootState) => state.auth.userResponse?.customerDTO.id
  );

  const [item, setItem] = useState<LotDetail>({
    buyNowPrice: undefined,
    id: 0,
    status: "",
    deposit: 0,
    floorFeePercent: 0,
    startTime: "",
    endTime: "",
    actualEndTime: "",
    isExtend: false,
    haveFinancialProof: false,
    lotType: "",
    sellerId: 0,
    staffId: 0,
    jewelryId: 0,
    auctionId: 0,
    seller: {} as Seller,
    staff: {} as Staff,
    auction: {} as Auction,
    jewelry: {
      id: 0,
      name: "",
      imageJewelries: [
        {
          imageLink: "",
        },
      ],
    } as Jewelry,
    startPrice: 0,
    finalPriceSold: 0,
    bidIncrement: 0,
    currentPrice: 0,
  });

  const {
    isConnected,
    highestPrice,
    messages,
    error,
    endTime,
    joinChatRoom,
    sendBid,
    disconnect,
    isEndAuction,
    winnerCustomer,
    winnerPrice,
    sendBidMethod4,
    reducePrice,
  } = useBidding();

  useEffect(() => {
    const fetchLotDetail = async () => {
      if (!itemId) return;

      try {
        const response = await getLotDetailById(itemId);
        if (response?.isSuccess && response.data) {
          setItem(response.data);
        }
      } catch (error) {
        console.error("Error fetching lot detail:", error);
      }
    };

    fetchLotDetail();
  }, [itemId]);

  useEffect(() => {
    if (accountId && itemId && item.lotType) {
      console.log("Joining chat room...", accountId, itemId);

      joinChatRoom(accountId, itemId, item.lotType);
    }
    return () => {
      disconnect();
    };
  }, [accountId, itemId, joinChatRoom, item.lotType, disconnect]);

  const onClose = () => {
    console.log("Close modal");
  };

  // useEffect(() => {
  //   if (!isConnected) {
  //     const interval = setInterval(() => {
  //       if (!isConnected) {
  //         console.log("Attempting to reconnect...");
  //         if (accountId && itemId) {
  //           joinChatRoom(accountId, itemId);
  //         }
  //       }
  //     }, 5000);

  //     return () => clearInterval(interval);
  //   }
  // }, [isConnected, accountId, itemId, joinChatRoom]);

  // Convert messages to bid format
  const bids = messages
    ? messages.map((message) => ({
        amount: parseInt(String(message.currentPrice)),
        customerId: parseInt(String(message.customerId)),
        time: message.bidTime,
      }))
    : [];

  const mainContent = [
    {
      key: "note",
      component: (
        <View className="flex-row p-2 mx-2 mt-2 rounded-md bg-black/50">
          <MaterialCommunityIcons
            name="alert-circle-outline"
            size={20}
            color="white"
          />
          <Text className="mr-2 text-sm font-medium text-center text-white">
            {item.lotType === "Public_Auction"
              ? "Bidding was successful! Latest and highest prices in the first row. Stay tuned..."
              : "This is Descending Bid Instructions! Whoever bids gets it. Stay tuned..."}
          </Text>
        </View>
      ),
    },
    { key: "timer", component: <CountDownTimer endTime={endTime ?? ""} /> },
    {
      key: "product",
      component: (
        <ProductCard
          id={String(item.id)}
          name={item.jewelry?.name ?? ""}
          image={
            item.jewelry?.imageJewelries?.[0]?.imageLink ||
            "https://fastly.picsum.photos/id/237/400/200"
          }
          typeBid={item.lotType}
          minPrice={item.startPrice ?? 0}
          maxPrice={item.finalPriceSold ?? 0}
        />
      ),
    },
    {
      key: "bids",
      component: (
        <BidsList
          bids={bids}
          item={item}
          currentCusId={customerId}
          reducePrice={reducePrice}
        />
      ),
    },
  ];

  if (!itemId || !accountId) {
    return (
      <View className="items-center justify-center flex-1 bg-white">
        <Text>Missing required parameters</Text>
      </View>
    );
  }

  if (error) {
    console.error("Bidding error:", error);
  }

  return (
    <View className="flex-1 bg-white">
      {isConnected && (
        <FlatList
          data={mainContent}
          renderItem={({ item }) => (
            <View className="mb-2">{item.component}</View>
          )}
          keyExtractor={(item) => item.key}
          ListFooterComponent={() => <View style={{ height: 100 }} />}
        />
      )}

      {isConnected && (
        <View className="absolute bottom-0 left-0 right-0 bg-white shadow-lg">
          <BidInput
            isEndAuction={isEndAuction}
            highestBid={highestPrice}
            item={item}
            onPlaceBid={sendBid}
            onPlaceBidMethod4={sendBidMethod4}
          />
        </View>
      )}

      {!isConnected && (
        <View className="absolute top-0 left-0 right-0 p-2 bg-red-500">
          <Text className="text-center text-white">Reconnecting...</Text>
        </View>
      )}

      <AuctionResultModal
        visible={isEndAuction}
        currentUser={customerId?.toString() || ""}
        userWinner={winnerCustomer}
        winningPrice={winnerPrice}
        onClose={onClose}
      />
    </View>
  );
};

export default RisingBidPage;
