import { getLotDetailById } from "@/api/lotAPI";
import {
  Auction,
  Jewelry,
  LotDetail,
  Seller,
  Staff,
} from "@/app/types/lot_type";
import { useBiddingMethod4 } from "@/hooks/useBiddingMethod4";
import { RootState } from "@/redux/store";
import { RouteProp, useRoute } from "@react-navigation/native";
import { useNavigation } from "expo-router";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import CountDownTimer from "./BidingComponent/CountDownTimer";
import ProductCard from "./BidingComponent/ProductCard";
import BidsList from "./BidingComponent/BidsList";
import { View } from "lucide-react-native";
import { FlatList, Text } from "react-native";
import BidInputMethod4 from "./BidingComponent/BidInputMethod4";

type ReduceBidPageParams = {
  ReduceBidPage: {
    itemId: number;
  };
};

const ReduceBidPage: React.FC<{}> = () => {
  const route = useRoute<RouteProp<ReduceBidPageParams, "ReduceBidPage">>();
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

  const {
    isConnected,
    endTime,
    messages,
    error,
    joinLiveBiddingMethod4,
    sendBidMethod4,
    disconnect,
    winnerCustomer,
    winnerPrice,
    reducePrice,
    resultBidding,
    setResultBidding,
    isEndAuctionMethod4,
  } = useBiddingMethod4();

  useEffect(() => {
    if (accountId && itemId) {
      console.log("Joining chat room...", accountId, itemId);
      joinLiveBiddingMethod4(accountId, itemId);
    }

    return () => {
      disconnect();
    };
  }, [accountId, itemId, item.lotType]);

  const onClose = () => {
    console.log("Close modal");
    navigation.goBack();
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
        />
      ),
    },
    {
      key: "bids",
      component: (
        <BidsList
          bids={messages ? messages : []}
          item={item}
          currentCusId={customerId ?? 0}
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

  if (!item) {
    return (
      <View className="items-center justify-center flex-1 bg-white">
        <Text>Loading...</Text>
      </View>
    );
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
          <BidInputMethod4
            isEndAuctionMethod4={isEndAuctionMethod4}
            item={item}
            reducePrice={reducePrice}
            setResultBidding={setResultBidding}
            onPlaceBidMethod4={sendBidMethod4}
            resultBidding={resultBidding}
          />
        </View>
      )}

      {!isConnected && (
        <View className="absolute top-0 left-0 right-0 p-2 bg-red-500">
          <Text className="text-center text-white">Reconnecting...</Text>
        </View>
      )}

      {/*  
      <AuctionResultModal
        visible={isEndAuctionMethod4}
        currentUser={customerId?.toString() || ""}
        userWinner={winnerCustomer}
        winningPrice={winnerPrice}
        onClose={onClose}
      /> */}
    </View>
  );
};

export default ReduceBidPage;
