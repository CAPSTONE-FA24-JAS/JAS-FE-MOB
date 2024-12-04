import React, { useEffect, useState } from "react";
import { View, Text, FlatList } from "react-native";
import BidsList from "./BidingComponent/BidsList";
import ProductCard from "./BidingComponent/ProductCard";
import CountDownTimer from "./BidingComponent/CountDownTimer";
import {
  Auction,
  Jewelry,
  LotDetail,
  Seller,
  Staff,
} from "@/app/types/lot_type";
import { useBiddingMethod4 } from "@/hooks/useBiddingMethod4";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import { RouteProp, useRoute } from "@react-navigation/native";
import { useNavigation } from "expo-router";
import { checkPlaceBidReduceAuction, getLotDetailById } from "@/api/lotAPI";
import BidInputMethod4 from "./BidingComponent/BidInputMethod4";
import AuctionResultModal from "@/components/Modal/AuctionResultModal";
import AuctionEndedModal from "@/components/Modal/AuctionEndModal";

type ReduceBidPageParams = {
  ReduceBidPage: {
    itemId: number;
  };
};

const ReduceBidPage = () => {
  const route = useRoute<RouteProp<ReduceBidPageParams, "ReduceBidPage">>();
  const { itemId } = route.params ?? {};
  const navigation = useNavigation();
  const [isPlaceBidCus, setIsPlaceBidCus] = useState(false);
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
    currentPriceWinner: 0,
  });

  const {
    endTime,
    reducePrice,
    disconnect,
    error,
    isConnected,
    isEndAuctionMethod4,
    messages,
    resultBidding,
    setResultBidding,
    winnerCustomer,
    winnerPrice,
    joinLiveBiddingMethod4,
    sendBidMethod4,
    status,
    endlotwithoutwinner,
    milenstoneReduceTime,
    amoutCustomerBid,
  } = useBiddingMethod4();

  const accountId = useSelector(
    (state: RootState) => state.auth.userResponse?.id
  );

  const customerId = useSelector(
    (state: RootState) => state.auth.userResponse?.customerDTO.id
  );

  const onClose = () => {
    console.log("Close modal");
    navigation.goBack();
  };

  const isPlaceBid = async () => {
    if (customerId !== undefined) {
      try {
        const response = await checkPlaceBidReduceAuction(itemId, customerId);
        return response;
      } catch (error) {
        console.error("Error checking place bid:", error);
        return false;
      }
    }
    return false;
  };

  useEffect(() => {
    const fetchData = async () => {
      if (!itemId) return;

      try {
        const response = await getLotDetailById(itemId);
        if (response?.isSuccess && response.data) {
          setItem(response.data);
        }

        const isPlace = await isPlaceBid();
        setIsPlaceBidCus(isPlace);
      } catch (error) {
        console.error("Error in fetching data:", error);
      }
    };

    fetchData();
  }, [itemId]);

  useEffect(() => {
    if (accountId && itemId) {
      console.log("Joining bid 4 room...", accountId, itemId);
      joinLiveBiddingMethod4(accountId, itemId);
    }
    return () => {
      disconnect();
    };
  }, [accountId, itemId, item.lotType]);

  const mainContent = [
    {
      key: "timer",
      component: (
        <CountDownTimer endTime={endTime || item.endTime} status={status} />
      ),
    },
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
          item={item}
        />
      ),
    },
    {
      key: "bids",
      component: (
        <BidsList
          item={item}
          currentCusId={customerId ?? 0}
          reducePrice={reducePrice}
          milenstoneReduceTime={milenstoneReduceTime}
          amountCustomerBid={amoutCustomerBid ? amoutCustomerBid : "0"}
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
      {!isConnected && (
        <View className="absolute top-0 left-0 right-0 z-50 p-2 bg-red-500">
          <Text className="text-center text-white">Reconnecting...</Text>
        </View>
      )}

      <FlatList
        data={mainContent}
        renderItem={({ item }) => (
          <View className="mb-2">{item.component}</View>
        )}
        keyExtractor={(item) => item.key}
        ListFooterComponent={<View className="h-24" />}
      />

      {isConnected && (
        <View className="absolute bottom-0 left-0 right-0 bg-white shadow-lg">
          <BidInputMethod4
            isEndAuctionMethod4={isEndAuctionMethod4}
            item={item}
            reducePrice={reducePrice}
            setResultBidding={setResultBidding}
            onPlaceBidMethod4={sendBidMethod4}
            resultBidding={resultBidding}
            status={status}
            isPlaceBidCus={isPlaceBidCus}
            isLoading={isConnected}
          />
        </View>
      )}

      <AuctionResultModal
        visible={isEndAuctionMethod4}
        currentUser={customerId?.toString() || ""}
        userWinner={winnerCustomer}
        winningPrice={winnerPrice}
        onClose={onClose}
      />
      <AuctionEndedModal
        visible={endlotwithoutwinner || status === "Canceled"}
        onClose={onClose}
      />
    </View>
  );
};

export default ReduceBidPage;
