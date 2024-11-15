import React, { useCallback, useEffect, useState } from "react";
import {
  View,
  Text,
  Image,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  ActivityIndicator,
} from "react-native";
import { Divider } from "react-native-paper";
import Swiper from "react-native-swiper";
import { useNavigation, useRoute } from "@react-navigation/native";
import PlaceBidModal from "@/components/Modal/PlaceBidModal";
import { LotDetail } from "@/app/types/lot_type";
import {
  checkCustomerHaveBidPrice,
  checkCustomerInLot,
  getLotDetailById,
} from "@/api/lotAPI";
import moment from "moment-timezone";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import {
  showErrorMessage,
  showSuccessMessage,
} from "@/components/FlashMessageHelpers";
import { checkPasswordWallet } from "@/api/walletApi";
import { buyNowMethod3, placeBidFixedPriceAndSecret } from "@/api/bidApi";
import PasswordModal from "../Payment/CheckPasswordModal";
import ConfirmBuyNowModal from "./ModalLot/ConfirmBuyNowModal";
import SecretAuctionBidModal from "./ModalLot/SecretAuctionBidModal";
import CountdownTimerBid from "@/components/CountDown/CountdownTimer";
import { addNewWatchingForCustomer } from "@/api/watchingApi";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";

// Define the navigation param list type
type RootStackParamList = {
  PlaceBid: BidFormRouteParams;
  AutoBidSaveConfig: BidFormRouteParams;
  RisingBidPage: { item: any } | { itemId: number }; // Update this to expect `item` as a param
  ReduceBidPage: { itemId: number };
  RegisterToBid: LotDetail; // Add this line
};

// Define the BidFormRouteParams type
export type BidFormRouteParams = {
  customerLotId: number;
  lotName: string;
  startBid: number;
  estimatedPrice: { min: number };
  lotDetail: LotDetail;
};

type RouteParams = {
  id: number;
  name: string;
  minPrice?: number;
  maxPrice?: number;
  price?: number;
  image: string;
  typeBid: string;
  status: string;
};

type LotDetailScreenNavigationProp =
  NativeStackNavigationProp<RootStackParamList>;

const LotDetailScreen = () => {
  const navigation = useNavigation<LotDetailScreenNavigationProp>();
  // Sử dụng useAppSelector để lấy userId từ Redux store
  const userId = useSelector(
    (state: RootState) => state.auth.userResponse?.customerDTO?.id
  );

  const customerId = useSelector(
    (state: RootState) => state.auth.userResponse?.id
  );
  const haveWallet = useSelector(
    (state: RootState) => state?.profile?.profile?.customerDTO?.walletId
  );
  const route = useRoute();
  const { id, name, minPrice, maxPrice, price, image, typeBid } = route.params
    ? (route.params as RouteParams)
    : {};

  const [lotDetail, setLotDetail] = useState<LotDetail | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [modalVisible, setModalVisible] = useState<boolean>(false);
  const [checkingRegistration, setCheckingRegistration] =
    useState<boolean>(true); // Trạng thái kiểm tra đăng ký
  const [passwordModalVisible, setPasswordModalVisible] =
    useState<boolean>(false);
  const [isRegistered, setIsRegistered] = useState<boolean>(false);
  const [password, setPassword] = useState<string>("");
  const [confirmBuyNowVisible, setConfirmBuyNowVisible] = useState(false);
  const [secretAuctionBidVisible, setSecretAuctionBidVisible] = useState(false);
  const [customerLotId, setCustomerLotId] = useState<number | null>(null);

  // Existing declarations...
  const [currentPriceCheck, setCurrentPriceCheck] = useState<number | null>(
    null
  );
  const [bidTimeCheck, setBidTimeCheck] = useState<string | null>(null);

  const [isWatching, setWatching] = useState(false);

  // Fetch lot details when the component mounts
  // useEffect(() => {
  //   fetchLotDetail();
  // }, [id]);

  console.log("====================================");
  console.log("haveWallet", haveWallet);
  console.log("====================================");

  // Hàm fetchLotDetail
  const fetchLotDetail = useCallback(async () => {
    if (id) {
      try {
        setLoading(true);
        const data = await getLotDetailById(id);
        if (data?.isSuccess) {
          setLotDetail(data.data);
        } else {
          setError(data?.message || "Failed to load data.");
        }
      } catch {
        setError("An error occurred while loading data.");
      } finally {
        setLoading(false);
      }
    }
  }, [id]);

  // Fetch lot details on screen focus
  // useFocusEffect(
  //   useCallback(() => {
  //     fetchLotDetail();
  //   }, [fetchLotDetail])
  // );

  // Updated fetchRegistrationStatus function
  const fetchRegistrationStatus = useCallback(async () => {
    try {
      setCheckingRegistration(true);
      if (userId !== undefined && id !== undefined) {
        // First, check if the user is registered for the lot
        const registrationResponse = await checkCustomerInLot(userId, id);

        if (registrationResponse) {
          // If the user is registered, set customerLotId and isRegistered
          setCustomerLotId(registrationResponse.customerLotId);
          setIsRegistered(true);

          // Next, check if they have bid on this lot
          const bidResponse = await checkCustomerHaveBidPrice(userId, id);
          if (bidResponse?.isSuccess && bidResponse.data) {
            setCurrentPriceCheck(bidResponse.data.currentPrice);
            setBidTimeCheck(bidResponse.data.bidTime);
          } else {
            setCurrentPriceCheck(null);
            setBidTimeCheck(null);
          }
        } else {
          // If the user is not registered, reset states
          setIsRegistered(false);
          setCustomerLotId(null);
          setCurrentPriceCheck(null);
          setBidTimeCheck(null);
        }
      } else {
        setIsRegistered(false);
        setCustomerLotId(null);
        setCurrentPriceCheck(null);
        setBidTimeCheck(null);
      }
    } catch (error) {
      setIsRegistered(false);
      setCustomerLotId(null);
      setCurrentPriceCheck(null);
      setBidTimeCheck(null);
    } finally {
      setCheckingRegistration(false);
    }
  }, [userId, id]);

  // Use useFocusEffect to reload only when navigating back
  useEffect(
    useCallback(() => {
      fetchLotDetail();
      fetchRegistrationStatus();
    }, [fetchLotDetail, fetchRegistrationStatus]),
    []
  );

  const handleAddWatching = async () => {
    if (!userId || !lotDetail?.jewelryId) {
      showErrorMessage("Unable to watch. Missing user or jewelry information.");
      return;
    }
    setLoading(true);

    try {
      const response = await addNewWatchingForCustomer(
        userId,
        lotDetail.jewelryId
      );
      if (response?.isSuccess) {
        showSuccessMessage("Watching added successfully.");
        setWatching(true);
      } else {
        showErrorMessage("Unable to add watching.");
      }
    } catch (error) {
      showErrorMessage("Unable to add watching.");
    } finally {
      setLoading(false);
    }
  };

  const item = {
    id,
    image,
    name,
    minPrice: minPrice || 0,
    maxPrice: maxPrice || 0,
    price: price || 0,
    typeBid,
  };

  // const handleBuyNow = () => {
  //   // Check if user is logged in and lot details are available
  //   if (
  //     userId &&
  //     lotDetail &&
  //     typeBid === "Fixed_Price"&&
  //     lotDetail.buyNowPrice &&
  //     lotDetail.deposit !== undefined
  //   ) {
  //     setPasswordModalVisible(true); // Show the password modal
  //   } else if(typeBid === "Secret_Auction" && lotDetail && lotDetail.startPrice && lotDetail.deposit !== undefined){
  //     setPasswordModalVisible(true); // Show the password modal
  //   } else {
  //     showErrorMessage("Unable to process 'Buy It Now'.");
  //     setPasswordModalVisible(true); // Show the password modal
  //   }
  // };

  const handleBuyNow = () => {
    setConfirmBuyNowVisible(true); // Show confirmation modal
  };

  const handleConfirmBuyNow = async () => {
    setConfirmBuyNowVisible(false); // Close the modal first
    try {
      if (customerId && lotDetail?.id) {
        await buyNowMethod3(customerId, lotDetail.id);
        showSuccessMessage("Bid placed successfully!");
        fetchLotDetail(); // Reload the lot details
      } else {
        showErrorMessage("Failed to place bid.");
      }
    } catch (error) {
      showErrorMessage("An error occurred while placing the bid.");
    }
  };

  const handleSecretAuctionBid = () => {
    setSecretAuctionBidVisible(true); // Show bid input modal
  };

  const handleSubmitBidType12 = async (bidAmount: number) => {
    console.log("bidAmount", bidAmount);

    try {
      if (userId && lotDetail && lotDetail?.id) {
        await placeBidFixedPriceAndSecret(bidAmount, userId, lotDetail.id);
        showSuccessMessage("Bid placed successfully!");
      } else {
        if (!userId) return showErrorMessage("Khong co userId");
        if (!lotDetail) return showErrorMessage("Khong co lotDetail");
        // showErrorMessage("Failed to place bid.");
      }
    } catch (error) {
      showErrorMessage("An error occurred while placing the bid.");
    } finally {
      setSecretAuctionBidVisible(false);
      setConfirmBuyNowVisible(false);
    }
  };

  const handlePlaceBid = async () => {
    if (!lotDetail || !userId) return;

    const currentPrice = lotDetail.buyNowPrice
      ? lotDetail.buyNowPrice - lotDetail.deposit
      : 0; // Calculate bid price
    const lotId = lotDetail.id;
    console.log("nhap vao place bid", {
      currentPrice,
      userId,
      lotId,
    });

    try {
      const response = await placeBidFixedPriceAndSecret(
        currentPrice,
        userId,
        lotId
      );
      console.log("responseFixed", response);

      if (response?.isSuccess) {
        showSuccessMessage("Bid placed successfully!");
        setPasswordModalVisible(false); // Close the password modal
        fetchLotDetail(); // Reload the lot details
      } else {
        console.log("Bid placement failed.");
      }
    } catch (error) {
      showErrorMessage("Failed to place bid.");
    }
  };

  const handleSubmitBid = (bid: any) => {
    // Handle the bid submission
    console.log("Bid submitted:", bid);
    setModalVisible(false); // Close the modal after submission
    navigation.navigate("RisingBidPage", { item });
  };

  const handlePressAutoBid = () => {
    if (!lotDetail && customerLotId && lotDetail)
      return showErrorMessage("Invalid lot ID or customerLotId or lotDetail.");
    if (lotDetail) {
      navigation.navigate("AutoBidSaveConfig", {
        customerLotId: customerLotId ?? 0, // Tạm thời để id LOT
        lotName: lotDetail.jewelry?.name ?? "",
        startBid: lotDetail.startPrice ?? 0,
        estimatedPrice: { min: lotDetail.startPrice ?? 0 },
        lotDetail,
      });
    } else {
      showErrorMessage("Lot details are not available.");
    }
  };

  if (loading) {
    return (
      <SafeAreaView className="items-center justify-center flex-1 bg-white">
        <ActivityIndicator size="large" color="#0000ff" />
      </SafeAreaView>
    );
  }

  if (error) {
    return (
      <SafeAreaView className="items-center justify-center flex-1 bg-white">
        <Text className="text-red-500">{error}</Text>
      </SafeAreaView>
    );
  }

  const renderEst = () => {
    switch (lotDetail?.lotType) {
      case "Fixed_Price":
        // Không cần hiển thị Est cho Fixed_Price
        return null;
      case "Secret_Auction":
        // Không cần hiển thị Est cho Secret_Auction
        return null;
      case "Public_Auction":
        return (
          <View>
            <View className="flex-row gap-2 ">
              <Text className="text-base font-bold text-[#6c6c6c] ">Est:</Text>
              <Text className="text-[#6c6c6c] text-base ">
                {(lotDetail?.startPrice || 0).toLocaleString("vi-VN", {
                  style: "currency",
                  currency: "VND",
                })}{" "}
                - Increasing
              </Text>
            </View>
          </View>
        );
      case "Auction_Price_GraduallyReduced":
        return (
          <View>
            <View className="flex-row gap-2 ">
              <Text className="text-base font-bold text-[#6c6c6c] ">
                Max Price:
              </Text>
              <Text className="text-[#6c6c6c] text-base ">
                {(lotDetail?.startPrice || 0).toLocaleString("vi-VN", {
                  style: "currency",
                  currency: "VND",
                })}
              </Text>
            </View>

            {lotDetail?.bidIncrement && (
              <View className="flex-row gap-2 ">
                <Text className="text-base font-bold text-[#6c6c6c] ">
                  Bid Increment:
                </Text>
                <Text className="text-[#6c6c6c] text-base ">
                  {lotDetail?.bidIncrement.toLocaleString("vi-VN", {
                    style: "currency",
                    currency: "VND",
                  })}
                </Text>
              </View>
            )}
          </View>
        );
      default:
        return null;
    }
  };

  const renderPrice = () => {
    switch (lotDetail?.lotType) {
      case "Fixed_Price":
        return (
          <View className="flex-row ">
            <Text className="font-bold text-lg text-[#6c6c6c] ">Price:</Text>
            <Text className="text-[#6c6c6c] ml-2 text-lg ">
              {(lotDetail?.buyNowPrice || 0).toLocaleString("vi-VN", {
                style: "currency",
                currency: "VND",
              })}
            </Text>
          </View>
        );
      case "Secret_Auction":
        return (
          <View className="flex-row ">
            <Text className="font-bold text-lg text-[#6c6c6c] ">
              Min price:
            </Text>
            <Text className="text-[#6c6c6c] ml-2 text-lg ">
              {(lotDetail?.startPrice || 0).toLocaleString("vi-VN", {
                style: "currency",
                currency: "VND",
              })}
            </Text>
          </View>
        );
      case "Public_Auction":
        return (
          <>
            {lotDetail?.buyNowPrice && (
              <View className="flex-row ">
                <Text className="font-bold text-lg text-[#6c6c6c] ">
                  Buy Now Price:
                </Text>
                <Text className="text-[#6c6c6c] ml-2 text-lg ">
                  $
                  {lotDetail?.buyNowPrice.toLocaleString("vi-VN", {
                    style: "currency",
                    currency: "VND",
                  })}
                </Text>
              </View>
            )}
          </>
        );
      case "Auction_Price_GraduallyReduced":
        return null;
      default:
        return null;
    }
  };

  const renderStartBid = () => {
    switch (lotDetail?.lotType) {
      case "Fixed_Price":
        // Không cần hiển thị Start Bid cho Fixed_Price
        return null;
      case "Secret_Auction":
        // Không cần hiển thị Start Bid cho Secret_Auction
        return null;
      case "Public_Auction":
        return (
          <View className="flex-row gap-2 ">
            <Text className="text-base font-bold text-[#6c6c6c] ">
              Start Bid:
            </Text>
            <Text className="text-[#6c6c6c] text-base ">
              {(lotDetail?.startPrice || 0).toLocaleString("vi-VN", {
                style: "currency",
                currency: "VND",
              })}
            </Text>
          </View>
        );
      case "Auction_Price_GraduallyReduced":
        return (
          <View className="flex-row gap-2 ">
            <Text className="text-base font-bold text-[#6c6c6c] ">
              Start Bid:
            </Text>
            <Text className="text-[#6c6c6c] text-base ">
              {(lotDetail?.startPrice || 0).toLocaleString("vi-VN", {
                style: "currency",
                currency: "VND",
              })}
            </Text>
          </View>
        );
      default:
        return null;
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

  const handleRegisterToBid = () => {
    if (lotDetail) {
      navigation.navigate("RegisterToBid", lotDetail);
    }
  };

  const handleJoinToBid = () => {
    if (lotDetail) {
      if (lotDetail.lotType === "Public_Auction") {
        navigation.replace("RisingBidPage", { itemId: lotDetail.id }); // lot id
      }
      if (lotDetail.lotType === "Auction_Price_GraduallyReduced") {
        navigation.replace("ReduceBidPage", { itemId: lotDetail.id });
      }
    }
  };

  // Assuming lotDetail.endTime is in a format that can be parsed by new Date()
  const isAuctionActive = lotDetail?.endTime
    ? new Date() < new Date(lotDetail.endTime)
    : false;

  console.log("isAuctionActive", isAuctionActive);

  return (
    <SafeAreaView className="flex-1 bg-white">
      <View className="flex-1">
        <ScrollView className="mb-32">
          {/* Countdown Timer */}
          <CountdownTimerBid
            startTime={lotDetail?.startTime || null}
            endTime={lotDetail?.endTime || null}
          />
          <View className="h-64">
            <Swiper
              showsPagination={true}
              autoplay={true}
              style={{ height: "100%" }}>
              {lotDetail?.jewelry?.imageJewelries?.length ?? 0 > 0 ? (
                lotDetail?.jewelry?.imageJewelries.map((img, index) =>
                  img?.imageLink ? (
                    <Image
                      key={index}
                      source={{ uri: img.imageLink }}
                      className="w-full py-10 h-[200px]"
                      resizeMode="contain"
                    />
                  ) : null
                )
              ) : (
                <View className="items-center justify-center">
                  <Text>No images available</Text>
                </View>
              )}
            </Swiper>
          </View>
          <View className="flex-row p-4 justify-evenly">
            <Text className="font-bold text-gray-400">Share</Text>
            <Text className="font-bold text-gray-400">Follow</Text>
            <TouchableOpacity
              onPress={handleAddWatching}
              className="flex-row items-center gap-1">
              {isWatching && (
                <MaterialCommunityIcons name="star" size={24} color="yellow" />
              )}
              <Text className="font-bold text-gray-400">
                {isWatching ? "Watching" : "Watch"}
              </Text>
            </TouchableOpacity>
          </View>
          {/* {lotDetail && lotDetail.finalPriceSold && (
            <View className="py-2 bg-green-200 ">
              <Text className="font-bold text-center text-green-700 uppercase">
                Final Price Sold:{" "}
                {lotDetail?.finalPriceSold.toLocaleString("vi-VN", {
                  style: "currency",
                  currency: "VND",
                })}
              </Text>
            </View>
          )} */}
          <View className="p-4 space-y-2">
            <View>
              {/* Thời gian đấu giá */}
              <View className="flex-row gap-2 mb-2">
                <Text className="text-base text-gray-500">
                  {lotDetail?.startTime
                    ? moment(lotDetail?.startTime).format("HH:mm A, DD/MM/YYYY")
                    : "N/A"}{" "}
                  -{" "}
                  {lotDetail?.endTime
                    ? moment(lotDetail?.endTime).format("HH:mm A, DD/MM/YYYY")
                    : "N/A"}
                </Text>
              </View>
              <Text className="text-base font-bold text-gray-500 ">
                Lot #{id} - Type {typeBid ? formatTypeBid(typeBid) : "N/A"}
              </Text>

              <Text className="mb-2 text-xl font-bold text-black ">
                {lotDetail?.jewelry?.name}
              </Text>

              {renderEst()}
              {renderStartBid()}
              {renderPrice()}

              <Divider bold={true} className="mt-2" />
            </View>

            <Text className="mt-6 mb-2 font-bold">
              Summary of Key Characteristics
            </Text>
            <Text className="text-gray-700">
              {lotDetail?.jewelry?.description || "No description available."}
            </Text>
            <Text className="mt-6 mb-2 font-bold">LOCATION DESCRIPTION</Text>
            <Text className="text-gray-700">
              {lotDetail?.auction?.description ||
                "No location description available."}
            </Text>
            <Text className="mt-6 mb-2 font-bold">VIEWING INFORMATION</Text>
            <Text className="text-gray-700">
              {lotDetail?.auction?.description ||
                "No viewing information available."}
            </Text>
            {/* <Text className="mt-6 mb-2 font-bold">Notes</Text>
            <Text className="text-gray-700">
              {lotDetail?.description || "No notes available."}
            </Text> */}
          </View>
          <View className="h-32" />
        </ScrollView>
      </View>
      <View className="absolute bottom-0 left-0 right-0 px-4 py-2 bg-white ">
        {isRegistered && (
          <View>
            {currentPriceCheck !== null && bidTimeCheck !== null ? (
              <Text className="mb-2 text-sm font-semibold text-center text-green-500">
                You have placed a bid for this Lot with{" "}
                {currentPriceCheck.toLocaleString("vi-VN", {
                  style: "currency",
                  currency: "VND",
                })}{" "}
                at {moment(bidTimeCheck).format("HH:mm A, MM/DD/YYYY")}.
              </Text>
            ) : null}
          </View>
        )}

        {isRegistered &&
          !currentPriceCheck &&
          !bidTimeCheck &&
          isAuctionActive &&
          !(lotDetail?.status === "Passed") &&
          !(lotDetail?.status === "Sold") && (
            <View>
              {(typeBid === "Fixed_Price" || typeBid === "Secret_Auction") && (
                <TouchableOpacity
                  className="py-3 mb-3 bg-blue-500 rounded-sm"
                  onPress={
                    typeBid === "Fixed_Price"
                      ? handleBuyNow
                      : handleSecretAuctionBid
                  }>
                  <Text className="font-semibold text-center text-white uppercase">
                    {typeBid === "Fixed_Price"
                      ? "BUY FIXED BID"
                      : "BUY SECRET BID"}
                  </Text>
                </TouchableOpacity>
              )}
              {!(lotDetail?.status === "Passed") &&
                !(lotDetail?.status === "Sold") &&
                isAuctionActive &&
                typeBid === "Public_Auction" && (
                  <TouchableOpacity
                    onPress={handlePressAutoBid}
                    className="mb-3 bg-blue-500 rounded-sm">
                    <Text className="py-3 font-semibold text-center text-white">
                      BID AUTOMATION
                    </Text>
                  </TouchableOpacity>
                )}
              {typeBid !== "Fixed_Price" && isAuctionActive && (
                <TouchableOpacity
                  className="py-3 mb-3 bg-blue-500 rounded-sm"
                  onPress={() => setModalVisible(true)}>
                  <Text className="font-semibold text-center text-white">
                    PLACE BID
                  </Text>
                </TouchableOpacity>
              )}
              {!(lotDetail?.status === "Passed") &&
                isAuctionActive &&
                !(lotDetail?.status === "Sold") &&
                typeBid !== "Fixed_Price" && (
                  <TouchableOpacity
                    className="py-3 bg-blue-500 rounded-sm"
                    onPress={handleJoinToBid}>
                    <Text className="font-semibold text-center text-white uppercase">
                      Join To Bid
                    </Text>
                  </TouchableOpacity>
                )}
            </View>
          )}

        {!isRegistered &&
          !(lotDetail?.status === "Passed") &&
          isAuctionActive &&
          !(lotDetail?.status === "Sold") && (
            <TouchableOpacity
              className="py-3 mt-4 bg-blue-500 rounded-sm"
              onPress={handleRegisterToBid}>
              <Text className="font-semibold text-center text-white uppercase">
                Register To Bid
              </Text>
            </TouchableOpacity>
          )}

        {item.id !== undefined &&
          item.image !== undefined &&
          item.name !== undefined &&
          item.typeBid !== undefined && (
            <PlaceBidModal
              visible={modalVisible}
              onClose={() => setModalVisible(false)}
              item={{
                id: item.id,
                image: item.image,
                name: item.name,
                typeBid: item.typeBid,
              }}
              minPrice={item.minPrice}
              maxPrice={item.maxPrice}
              onSubmitBid={handleSubmitBid}
            />
          )}
      </View>

      {/* Modals */}
      <ConfirmBuyNowModal
        isVisible={confirmBuyNowVisible}
        onClose={() => setConfirmBuyNowVisible(false)}
        onConfirm={handleSubmitBidType12}
        price={lotDetail?.buyNowPrice ?? 0}
        lotId={lotDetail?.id ?? 0}
      />
      {lotDetail &&
        lotDetail.startPrice &&
        lotDetail.deposit !== undefined &&
        typeBid === "Secret_Auction" && (
          <SecretAuctionBidModal
            isVisible={secretAuctionBidVisible}
            onClose={() => setSecretAuctionBidVisible(false)}
            minPrice={lotDetail.startPrice}
            onSubmit={handleSubmitBidType12}
          />
        )}
    </SafeAreaView>
  );
};

export default LotDetailScreen;
