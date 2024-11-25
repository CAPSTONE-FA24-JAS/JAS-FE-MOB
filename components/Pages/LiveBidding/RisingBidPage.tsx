import { RouteProp, useRoute } from "@react-navigation/native";
import React, { useEffect, useState } from "react";
import { View, Text, FlatList } from "react-native";
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
import AuctionResultModal from "@/components/Modal/AuctionResultModal";
import { useNavigation } from "expo-router";
import { useBiddingMethod3 } from "@/hooks/useBiddingMethod3";

type RisingBidPageParams = {
  RisingBidPage: {
    itemId: number;
  };
};

const RisingBidPage: React.FC = () => {
  const route = useRoute<RouteProp<RisingBidPageParams, "RisingBidPage">>();
  const { itemId } = route.params ?? {};
  const navigation = useNavigation();

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
      imageJewelries: [{ imageLink: "" }],
    } as Jewelry,
    startPrice: 0,
    finalPriceSold: 0,
    bidIncrement: 0,
    currentPrice: 0,
    currentPriceWinner: 0,
  });

  useEffect(() => {
    const fetchLotDetail = async () => {
      if (!itemId) return;

      try {
        const response = await getLotDetailById(itemId);
        console.log("-----------------------------------------------");
        console.log("Lot detail responsessssss:", response);

        if (response?.isSuccess && response.data) {
          setItem(response.data);
        }
      } catch (error) {
        console.error("Error fetching lot detail:", error);
      }
    };

    fetchLotDetail();
  }, [itemId]);

  const typeBid = item.lotType;

  const {
    isConnected,
    endTime,
    highestPrice,
    messages,
    setMessages,
    error,
    joinLiveBiddingMethod3,
    sendBid,
    disconnect,
    isEndAuctionMedthod3,
    isEndLot,
    resultBidding,
    setResultBidding,
    winnerCustomer,
    winnerPrice,
    status,
  } = useBiddingMethod3();

  useEffect(() => {
    if (accountId && itemId && typeBid === "Public_Auction") {
      console.log("Joining chat room...", accountId, itemId);
      joinLiveBiddingMethod3(accountId, itemId);
    }
    return () => {
      disconnect();
    };
  }, [accountId, itemId, item.lotType]);

  const onClose = () => {
    console.log("Close modal");
    navigation.goBack();
  };

  const mainContent = [
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
          stepBidIncrement={item.bidIncrement ?? 0}
          status={status}
        />
      ),
    },
    {
      key: "bids",
      component: (
        <BidsList
          isEndAuctionMethod3={isEndAuctionMedthod3}
          isEndLot={isEndLot}
          bids={messages || []}
          item={item}
          currentCusId={customerId ?? 0}
          status={status}
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

  if (!item) {
    return (
      <View className="items-center justify-center flex-1 bg-white">
        <Text>Loading...</Text>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-white">
      {isConnected ? (
        <FlatList
          data={mainContent}
          renderItem={({ item }) => (
            <View className="mb-2">{item.component}</View>
          )}
          keyExtractor={(item) => item.key}
          ListFooterComponent={() => <View style={{ height: 100 }} />}
        />
      ) : (
        <View className="absolute top-0 left-0 right-0 p-2 bg-red-500">
          <Text className="text-center text-white">Reconnecting...</Text>
        </View>
      )}

      {isConnected && (
        <View className="absolute bottom-0 left-0 right-0 bg-white shadow-lg">
          <BidInput
            isEndAuctionMethod3={isEndAuctionMedthod3}
            highestBid={highestPrice}
            item={item}
            onPlaceBid={sendBid}
            resultBidding={resultBidding}
            setResultBidding={setResultBidding}
            isEndLot={isEndLot}
            bids={Array.isArray(messages) ? messages : []}
            status={status}
          />
        </View>
      )}

      <AuctionResultModal
        visible={isEndAuctionMedthod3}
        currentUser={customerId?.toString() || ""}
        userWinner={winnerCustomer}
        winningPrice={winnerPrice}
        onClose={onClose}
      />
    </View>
  );
};

export default RisingBidPage;
