import { placeBidFixedPriceAndSecret } from "@/api/bidApi";
import {
  checkCustomerHaveBidPrice,
  checkCustomerInLot,
  getAutoBidByCustomerLot,
  getLotDetailById,
  getTotalCustomerInLotFixedPrice,
  getWinnerForLot,
} from "@/api/lotAPI";
import { addNewWatchingForCustomer } from "@/api/watchingApi";
import { LotDetail, WinnerForLot } from "@/app/types/lot_type";
import CountdownTimerBid from "@/components/CountDown/CountdownTimer";

// Extend LotDetail type to include totalCustomers
interface ExtendedLotDetail extends LotDetail {
  totalCustomers?: number;
}

import {
  showErrorMessage,
  showSuccessMessage,
} from "@/components/FlashMessageHelpers";
import PlaceBidModal from "@/components/Modal/PlaceBidModal";
import YouTubePlayer from "@/components/YouTubePlayer";
import { RootState } from "@/redux/store";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import {
  useFocusEffect,
  useNavigation,
  useRoute,
} from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import moment from "moment-timezone";
import React, { useCallback, useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Image,
  SafeAreaView,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { Divider } from "react-native-paper";
import Swiper from "react-native-swiper";
import { useSelector } from "react-redux";
import ConfirmBuyNowModal from "./ModalLot/ConfirmBuyNowModal";
import SecretAuctionBidModal from "./ModalLot/SecretAuctionBidModal";
import {
  MainDiamond,
  MainShaphy,
  SecondaryDiamond,
  SecondaryShaphy,
} from "@/app/types/consign_type";
import AutoBidHistoryModal from "./ModalLot/AutoBidHistoryModal";
import LoadingOverlay from "@/components/LoadingOverlay";

interface DiamondInfo {
  mainDiamonds: {
    name?: string;
    color?: string;
    cut?: string;
    clarity?: string;
    quantity: number;
    settingType?: string;
    dimension?: string;
    shape?: string;
    certificate?: string;
    fluorescence?: string;
    lengthWidthRatio?: string;
    type?: string;
    documents?: Array<{
      documentLink: string;
      documentTitle: string;
    }>;
    images?: Array<{
      imageLink: string;
    }>;
  }[];
  secondaryDiamonds: {
    name?: string;
    color?: string;
    cut?: string;
    clarity?: string;
    quantity: number;
    settingType?: string;
    dimension?: string;
    shape?: string;
    certificate?: string;
    fluorescence?: string;
    lengthWidthRatio?: string;
    type?: string;
    documents?: Array<{
      documentLink: string;
      documentTitle: string;
    }>;
    images?: Array<{
      imageLink: string;
    }>;
  }[];
}

// Gemstone Info Interface
interface GemstoneInfo {
  mainGemstones: {
    name?: string;
    color: string;
    carat?: string;
    enhancementType?: string;
    quantity: number;
    settingType?: string;
    dimension: string;
    documents?: Array<{
      documentLink: string;
      documentTitle: string;
    }>;
    images?: Array<{
      imageLink: string;
    }>;
  }[];
  secondaryGemstones: {
    name?: string;
    color: string;
    carat?: string;
    enhancementType?: string;
    quantity: number;
    settingType?: string;
    dimension?: string;
    documents?: Array<{
      documentLink: string;
      documentTitle: string;
    }>;
    images?: Array<{
      imageLink: string;
    }>;
  }[];
}

// Extend LotDetail type to include jewelry information
interface ExtendedLotDetail extends LotDetail {
  totalCustomers?: number;
  diamondInfo?: DiamondInfo;
  gemstoneInfo?: GemstoneInfo;
}

// Define the navigation param list type
type RootStackParamList = {
  PlaceBid: BidFormRouteParams;
  AutoBidSaveConfig: BidFormRouteParams;
  RisingBidPage: { item: any } | { itemId: number }; // Update this to expect `item` as a param
  ReduceBidPage: { itemId: number };
  RegisterToBid: LotDetail; // Add this line
  MyWallet: undefined;
};

// Define the BidFormRouteParams type
export type BidFormRouteParams = {
  customerLotId: number;
  lotName: string;
  startBid: number;
  estimatedPrice: { min: number };
  lotDetail: LotDetail;
  autoBids?: AutoBid[]; // Add autoBids property
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

export interface AutoBid {
  id: number;
  minPrice: number;
  maxPrice: number;
  numberOfPriceStep: number;
  timeIncrement: number;
  isActive: boolean;
  customerLotId: number;
}

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
  const [jewelryDetails, setJewelryDetails] = useState<{
    diamondInfo: DiamondInfo | null;
    gemstoneInfo: GemstoneInfo | null;
  }>({
    diamondInfo: null,
    gemstoneInfo: null,
  });
  const route = useRoute();
  const { id, name, minPrice, maxPrice, price, image, typeBid, status } =
    route.params ? (route.params as RouteParams) : {};

  const [lotDetail, setLotDetail] = useState<ExtendedLotDetail | null>(null);
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
  const [winnerCustomer, setWinnerCustomer] = useState<WinnerForLot[] | []>([]);
  const [autoBidHistoryVisible, setAutoBidHistoryVisible] = useState(false);
  const [hasAutoBidHistory, setHasAutoBidHistory] = useState(false);
  const [autoBids, setAutoBids] = useState<AutoBid[]>([]);

  useEffect(() => {
    if (autoBidHistoryVisible && customerLotId) {
      fetchAutoBids();
    }
  }, [autoBidHistoryVisible, customerLotId]);

  const fetchAutoBids = async () => {
    if (customerLotId) {
      setLoading(true);
      try {
        const data = await getAutoBidByCustomerLot(customerLotId);
        if (data) {
          // Sắp xếp autoBids theo ID mới nhất lên đầu
          const sortedData = data.sort((a, b) => b.id - a.id);
          setAutoBids(sortedData);
        }
      } catch (error) {
        showErrorMessage("Unable to fetch AutoBid history.");
      } finally {
        setLoading(false);
      }
    }
  };

  console.log("customerLotIdsrf", customerLotId);

  // Existing declarations...
  const [currentPriceCheck, setCurrentPriceCheck] = useState<number | null>(
    null
  );
  const [bidTimeCheck, setBidTimeCheck] = useState<string | null>(null);

  const [isWatching, setWatching] = useState(false);

  //////////////////////////////////////////////
  const extractDiamondInfo = (
    mainDiamonds?: MainDiamond[],
    secondaryDiamonds?: SecondaryDiamond[]
  ): DiamondInfo => {
    const processedMainDiamonds =
      mainDiamonds?.map((diamond) => ({
        name: diamond.name || undefined,
        color: diamond.color || undefined,
        cut: diamond.cut || undefined,
        clarity: diamond.clarity || undefined,
        quantity: diamond.quantity,
        settingType: diamond.settingType || undefined,
        dimension: diamond.dimension || undefined,
        shape: diamond.shape || undefined,
        certificate: diamond.certificate || undefined,
        fluorescence: diamond.fluorescence || undefined,
        lengthWidthRatio: diamond.lengthWidthRatio || undefined,
        type: diamond.type || undefined,
        documents:
          diamond.documentDiamonds?.length > 0
            ? diamond.documentDiamonds
            : undefined,
        images:
          diamond.imageDiamonds?.length > 0 ? diamond.imageDiamonds : undefined,
      })) || [];

    const processedSecondaryDiamonds =
      secondaryDiamonds?.map((diamond) => ({
        name: diamond.name || undefined,
        color: diamond.color || undefined,
        cut: diamond.cut || undefined,
        clarity: diamond.clarity || undefined,
        quantity: diamond.quantity,
        settingType: diamond.settingType || undefined,
        dimension: diamond.dimension || undefined,
        shape: diamond.shape || undefined,
        certificate: diamond.certificate || undefined,
        fluorescence: diamond.fluorescence || undefined,
        lengthWidthRatio: diamond.lengthWidthRatio || undefined,
        type: diamond.type || undefined,
        documents:
          diamond.documentDiamonds?.length > 0
            ? diamond.documentDiamonds
            : undefined,
        images:
          diamond.imageDiamonds?.length > 0 ? diamond.imageDiamonds : undefined,
      })) || [];

    return {
      mainDiamonds: processedMainDiamonds,
      secondaryDiamonds: processedSecondaryDiamonds,
    };
  };

  // Gemstone Info Extractor
  const extractGemstoneInfo = (
    mainGemstones?: MainShaphy[],
    secondaryGemstones?: SecondaryShaphy[]
  ): GemstoneInfo => {
    const processedMainGemstones =
      mainGemstones?.map((gemstone) => ({
        name: gemstone.name || undefined,
        color: gemstone.color,
        carat: gemstone.carat || undefined,
        enhancementType: gemstone.enhancementType || undefined,
        quantity: gemstone.quantity,
        settingType: gemstone.settingType || undefined,
        dimension: gemstone.dimension,
        documents:
          gemstone.documentShaphies?.length > 0
            ? gemstone.documentShaphies
            : undefined,
        images:
          gemstone.imageShaphies?.length > 0
            ? gemstone.imageShaphies
            : undefined,
      })) || [];

    const processedSecondaryGemstones =
      secondaryGemstones?.map((gemstone) => ({
        name: gemstone.name || undefined,
        color: gemstone.color,
        carat: gemstone.carat || undefined,
        enhancementType: gemstone.enhancementType || undefined,
        quantity: gemstone.quantity,
        settingType: gemstone.settingType || undefined,
        dimension: gemstone.dimension || undefined,
        documents:
          gemstone.documentShaphies?.length > 0
            ? gemstone.documentShaphies
            : undefined,
        images:
          gemstone.imageShaphies?.length > 0
            ? gemstone.imageShaphies
            : undefined,
      })) || [];

    return {
      mainGemstones: processedMainGemstones,
      secondaryGemstones: processedSecondaryGemstones,
    };
  };

  // Fetch lot details when the component mounts
  // useEffect(() => {
  //   fetchLotDetail();
  // }, [id]);

  console.log("====================================");
  console.log("haveWallet", haveWallet);
  console.log("====================================");

  const getWinner = async () => {
    try {
      await getWinnerForLot(id || 0).then((res) => {
        if (Array.isArray(res) && res.length > 0) {
          setWinnerCustomer(res);
        } else {
          setWinnerCustomer([]);
        }
      });
    } catch (error) {
      console.error("Error fetching winner customer:", error);
    }
  };

  // Hàm fetchLotDetail
  const fetchLotDetail = useCallback(async () => {
    if (id) {
      try {
        setLoading(true);
        const data = await getLotDetailById(id);

        if (data?.isSuccess) {
          // Extract jewelry details if available
          if (data.data.jewelry) {
            const diamondInfo = extractDiamondInfo(
              data.data.jewelry.mainDiamonds,
              data.data.jewelry.secondaryDiamonds
            );

            const gemstoneInfo = extractGemstoneInfo(
              data.data.jewelry.mainShaphies,
              data.data.jewelry.secondaryShaphies
            );

            setJewelryDetails({
              diamondInfo,
              gemstoneInfo,
            });
          }

          // Kiểm tra nếu loại lô là Fixed_Price
          if (data.data.lotType === "Fixed_Price") {
            try {
              // Gọi API lấy số lượng khách hàng
              const totalCustomers = await getTotalCustomerInLotFixedPrice(id);

              if (totalCustomers !== null) {
                console.log(
                  "Total customers in fixed price lot:",
                  totalCustomers
                );
                setLotDetail({
                  ...data.data,
                  totalCustomers,
                } as ExtendedLotDetail); // Gắn thêm totalCustomers vào dữ liệu lotDetail
              }
            } catch (error) {
              console.error(
                "Error fetching total customers for Fixed_Price lot:",
                error
              );
              showErrorMessage(
                "Unable to fetch total customers for Fixed_Price lot."
              );
              setLotDetail(data.data); // Dù lỗi, vẫn gắn dữ liệu lotDetail
            }
          } else {
            setLotDetail(data.data); // Không phải Fixed_Price, chỉ gắn dữ liệu lotDetail
          }
        } else {
          Alert.alert("Error", data?.message || "Failed to load data.");
          setError(data?.message || "Failed to load data.");
        }
      } catch {
        setError("An error occurred while loading data.");
      } finally {
        setLoading(false);
      }
    }
  }, [id]);

  useEffect(() => {
    const checkAutoBidHistory = async () => {
      if (customerLotId) {
        try {
          const response = await getAutoBidByCustomerLot(customerLotId);
          if (response && response.length > 0) {
            setHasAutoBidHistory(true);
          } else {
            setHasAutoBidHistory(false);
          }
        } catch (error) {
          console.error("Error fetching AutoBid history:", error);
          setHasAutoBidHistory(false);
        }
      } else {
        setHasAutoBidHistory(false);
      }
    };

    checkAutoBidHistory();
  }, [customerLotId]);

  // Updated fetchRegistrationStatus function
  const fetchRegistrationStatus = useCallback(async () => {
    try {
      setCheckingRegistration(true);
      if (userId !== undefined && id !== undefined) {
        // First, check if the user is registered for the lot
        const registrationResponse = await checkCustomerInLot(userId, id);
        console.log("registrationResponse", registrationResponse);

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
  useFocusEffect(
    useCallback(() => {
      fetchLotDetail();
      fetchRegistrationStatus();
      getWinner();
    }, [fetchLotDetail, fetchRegistrationStatus])
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

  const handleBuyNow = () => {
    setConfirmBuyNowVisible(true); // Show confirmation modal
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
        fetchLotDetail(); // Reload the lot details
        fetchRegistrationStatus();
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

  const handleSubmitBid = (bid: any) => {
    // Handle the bid submission
    console.log("Bid submitted:", bid);
    setModalVisible(false); // Close the modal after submission
    navigation.navigate("RisingBidPage", { item });
  };

  const handlePressAutoBid = () => {
    if (!lotDetail && !customerLotId && !lotDetail) {
      return showErrorMessage("Invalid lot ID or customerLotId or lotDetail.");
    }
    if (lotDetail) {
      console.log("lotDetail", lotDetail, customerLotId);

      navigation.navigate("AutoBidSaveConfig", {
        customerLotId: customerLotId ?? 0, // Tạm thời để id LOT
        lotName: lotDetail.jewelry?.name ?? "",
        startBid: lotDetail.startPrice ?? 0,
        estimatedPrice: { min: lotDetail.startPrice ?? 0 },
        lotDetail,
        autoBids, // Pass autoBids here
      });
    } else {
      showErrorMessage("Lot details are not available.");
    }
  };

  const renderJewelryDetails = () => {
    // Only render property if it exists and has a value
    const renderPropertyRow = (
      label: string,
      value: string | number | undefined | null
    ) => {
      if (value === undefined || value === null || value === "") return null;
      return (
        <View className="flex-row py-1 border-b border-gray-100">
          <Text className="w-1/3 text-sm font-medium text-gray-500">
            {label}
          </Text>
          <Text className="flex-1 text-sm text-gray-700">{value}</Text>
        </View>
      );
    };

    // Only render diamond card if it has at least one non-empty property
    const renderDiamondCard = (
      diamond: any,
      index: number,
      isMain: boolean = true
    ) => {
      const hasContent = Object.entries(diamond).some(
        ([key, value]) =>
          value !== undefined &&
          value !== null &&
          value !== "" &&
          key !== "documents" &&
          key !== "images"
      );

      if (!hasContent) return null;

      return (
        <View
          key={index}
          className="p-3 mb-3 bg-white border border-gray-200 rounded-lg shadow-sm">
          <Text className="mb-2 text-base font-semibold text-gray-800">
            {isMain ? "Main" : "Secondary"} Diamond #{index + 1}
          </Text>
          {renderPropertyRow("Name", diamond.name)}
          {renderPropertyRow("Color", diamond.color)}
          {renderPropertyRow("Cut", diamond.cut)}
          {renderPropertyRow("Clarity", diamond.clarity)}
          {renderPropertyRow("Quantity", diamond.quantity)}
          {renderPropertyRow("Setting Type", diamond.settingType)}
          {renderPropertyRow("Dimension", diamond.dimension)}
          {renderPropertyRow("Shape", diamond.shape)}
          {renderPropertyRow("Certificate", diamond.certificate)}
          {renderPropertyRow("Fluorescence", diamond.fluorescence)}
        </View>
      );
    };

    // Only render gemstone card if it has at least one non-empty property
    const renderGemstoneCard = (
      gemstone: any,
      index: number,
      isMain: boolean = true
    ) => {
      const hasContent = Object.entries(gemstone).some(
        ([key, value]) =>
          value !== undefined &&
          value !== null &&
          value !== "" &&
          key !== "documents" &&
          key !== "images"
      );

      if (!hasContent) return null;

      return (
        <View
          key={index}
          className="p-3 mb-3 bg-white border border-gray-200 rounded-lg shadow-sm">
          <Text className="mb-2 text-base font-semibold text-gray-800">
            {isMain ? "Main" : "Secondary"} Gemstone #{index + 1}
          </Text>
          {renderPropertyRow("Name", gemstone.name)}
          {renderPropertyRow("Color", gemstone.color)}
          {renderPropertyRow("Carat", gemstone.carat)}
          {renderPropertyRow("Enhancement", gemstone.enhancementType)}
          {renderPropertyRow("Quantity", gemstone.quantity)}
          {renderPropertyRow("Setting Type", gemstone.settingType)}
          {renderPropertyRow("Dimension", gemstone.dimension)}
        </View>
      );
    };

    // Only render section if it has valid items with content
    const renderSection = (
      title: string,
      items: any[] | undefined,
      renderCard: (
        item: any,
        index: number,
        isMain: boolean
      ) => React.ReactNode | null,
      isMain: boolean = true
    ) => {
      if (!items || items.length === 0) return null;

      const validItems = items
        .map((item, index) => renderCard(item, index, isMain))
        .filter(Boolean);

      if (validItems.length === 0) return null;

      return (
        <View className="mb-6">
          <View className="pb-2 mb-3 border-b border-gray-200">
            <Text className="text-lg font-bold text-gray-900">{title}</Text>
          </View>
          {validItems}
        </View>
      );
    };

    // Check if we have any jewelry details at all
    const hasDiamonds =
      jewelryDetails.diamondInfo?.mainDiamonds?.some((d) =>
        Object.values(d).some((v) => v)
      ) ||
      false ||
      jewelryDetails.diamondInfo?.secondaryDiamonds?.some((d) =>
        Object.values(d).some((v) => v)
      ) ||
      false;

    const hasGemstones =
      jewelryDetails.gemstoneInfo?.mainGemstones?.some((g) =>
        Object.values(g).some((v) => v)
      ) ||
      false ||
      jewelryDetails.gemstoneInfo?.secondaryGemstones?.some((g) =>
        Object.values(g).some((v) => v)
      ) ||
      false;

    if (!hasDiamonds && !hasGemstones) return null;

    return (
      <View className="px-1 mt-6">
        {/* Diamonds Section */}
        {hasDiamonds && (
          <View className="mb-8">
            <Text className="mb-4 text-xl font-bold text-gray-900">
              Diamond Details
            </Text>
            {renderSection(
              "Main Diamonds",
              jewelryDetails.diamondInfo?.mainDiamonds,
              renderDiamondCard,
              true
            )}
            {renderSection(
              "Secondary Diamonds",
              jewelryDetails.diamondInfo?.secondaryDiamonds,
              renderDiamondCard,
              false
            )}
          </View>
        )}

        {/* Gemstones Section */}
        {hasGemstones && (
          <View className="mb-8">
            <Text className="mb-4 text-xl font-bold text-gray-900">
              Gemstone Details
            </Text>
            {renderSection(
              "Main Gemstones",
              jewelryDetails.gemstoneInfo?.mainGemstones,
              renderGemstoneCard,
              true
            )}
            {renderSection(
              "Secondary Gemstones",
              jewelryDetails.gemstoneInfo?.secondaryGemstones,
              renderGemstoneCard,
              false
            )}
          </View>
        )}
      </View>
    );
  };

  // if (loading) {
  //   return (
  //     <SafeAreaView className="items-center justify-center flex-1 bg-white">
  //       <ActivityIndicator size="large" color="#0000ff" />
  //     </SafeAreaView>
  //   );
  // }

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
    if (haveWallet) {
      if (lotDetail) {
        navigation.navigate("RegisterToBid", lotDetail);
      }
    } else {
      Alert.alert(
        "Notification",
        "You don't have a wallet on the JAS app. Please register for a wallet to continue.",
        [
          {
            text: "Cancel",
            style: "cancel",
          },
          {
            text: "Register Wallet",
            onPress: () => navigation.navigate("MyWallet"),
          },
        ]
      );
    }
  };

  const handleJoinToBid = (type: string) => {
    if (lotDetail) {
      console.log("lotDetail.lotType", lotDetail.lotType);

      if (type === "Public_Auction") {
        navigation.replace("RisingBidPage", { itemId: lotDetail.id }); // lot id
      }
      if (type === "Auction_Price_GraduallyReduced") {
        navigation.replace("ReduceBidPage", { itemId: lotDetail.id });
      }
    }
  };

  // Assuming lotDetail.endTime is in a format that can be parsed by new Date()
  const isAuctionActive = lotDetail?.endTime
    ? new Date() < new Date(lotDetail.endTime)
    : false;

  const isAuctionLive =
    lotDetail?.endTime && lotDetail?.startTime
      ? new Date(lotDetail.startTime) < new Date() &&
        new Date() < new Date(lotDetail.endTime)
      : false;

  console.log("isAuctionActive", isAuctionActive);

  function getStatusClass(status: string) {
    switch (status) {
      case "Waiting":
        return "bg-[#A0522D]";
      case "Ready":
        return "bg-[#800080]";
      case "Auctionning":
        return "bg-[#FFD700]";
      case "Sold":
        return "bg-[#4CAF50]";
      case "Cancelled":
        return "bg-[#FF0000]";
      case "Passed": // Passed
        return "bg-[#0000FF]";
      case "Pause":
        return "bg-[#708090]";
      default:
        return "bg-black"; // Default màu nền nếu không khớp
    }
  }

  const handleViewAutoBidHistory = () => {
    if (customerLotId) {
      setAutoBidHistoryVisible(true);
    } else {
      showErrorMessage("No CustomerLot ID available.");
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      <LoadingOverlay visible={loading} />
      <View className="flex-1">
        <ScrollView className="mb-20">
          {lotDetail?.status !== "Sold" &&
            lotDetail?.status !== "Cancelled" && (
              <CountdownTimerBid
                startTime={lotDetail?.startTime || null}
                endTime={lotDetail?.endTime || null}
              />
            )}

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
          {lotDetail?.totalCustomers && lotDetail?.lotType === "Fixed_Price" ? (
            <View className="py-2 bg-blue-200 ">
              <Text className="font-bold text-center text-blue-700 uppercase">
                Total bidders: {lotDetail.totalCustomers}
              </Text>
            </View>
          ) : null}
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
              <View className="flex-row items-start justify-between w-full">
                <Text className="text-base font-bold text-gray-500 max-w-[50%] ">
                  Lot #{id} - Type {typeBid ? formatTypeBid(typeBid) : "N/A"}
                </Text>
                <View className=" max-w-[45%] flex-row justify-end">
                  <Text
                    className={`font-extrabold text-sm py-1 px-5 ${getStatusClass(
                      lotDetail?.status ?? ""
                    )} rounded-md text-sm text-center uppercase text-white`}>
                    {lotDetail?.status}
                  </Text>
                </View>
              </View>

              <Text className="mb-2 text-xl font-bold text-black ">
                {lotDetail?.jewelry?.name}
              </Text>

              {renderEst()}
              {renderStartBid()}
              {renderPrice()}

              <Divider bold={true} className="mt-2" />
              {/* Info Section */}
              {winnerCustomer &&
                winnerCustomer.length > 0 &&
                status === "Sold" && (
                  <View className="w-full p-4 mb-6 bg-green-50 rounded-xl">
                    <Text className="text-base font-medium text-center text-gray-600">
                      The winner with the price:
                    </Text>
                    <View className="flex-row items-center justify-center">
                      <Text className="text-base font-bold text-center text-green-600">
                        {winnerCustomer?.[0]?.currentPrice.toLocaleString(
                          "vi-vn",
                          {
                            style: "currency",
                            currency: "VND",
                          }
                        ) || "N/A"}
                      </Text>
                    </View>
                  </View>
                )}
            </View>

            <Text className="mt-6 font-bold">
              Summary of Key Characteristics
            </Text>
            {lotDetail?.jewelry?.keyCharacteristicDetails && (
              <View>
                {lotDetail?.jewelry?.keyCharacteristicDetails.map((item) => (
                  <View key={item.id} className="flex-row ">
                    <Text className="mr-2 text-lg text-gray-800">•</Text>
                    <Text className="text-gray-700">
                      {item.keyCharacteristic.name}:{" "}
                      {item.description || "Unknow"}
                    </Text>
                  </View>
                ))}
              </View>
              // <Text className="text-gray-700">
              //   {lotDetail?.jewelry?.description || "No description available."}
              // </Text>
            )}
            <View className="flex-row ">
              <Text className="mr-2 text-lg text-gray-800">•</Text>
              <Text className="text-gray-700">
                For Gender: {lotDetail?.jewelry?.forGender || "Unknow"}
              </Text>
            </View>
            {renderJewelryDetails()}

            <Text className="mt-6 mb-2 font-bold">LOCATION DESCRIPTION</Text>
            <Text className="mb-5 text-gray-700">
              {lotDetail?.auction?.description ||
                "No location description available."}
            </Text>
            {/* <Text className="mt-6 mb-2 font-bold">VIEWING INFORMATION</Text>
            <Text className="mb-4 text-gray-700">
              {lotDetail?.auction?.description ||
                "No viewing information available."}
            </Text> */}
            <YouTubePlayer
              videoLink={
                lotDetail?.jewelry.videoLink ||
                "https://www.youtube.com/watch?v=kYOP52BUZTI"
              }
            />
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

        {isRegistered && (
          <View>
            {(typeBid === "Fixed_Price" || typeBid === "Secret_Auction") &&
              !(lotDetail?.status === "Passed") &&
              !(lotDetail?.status === "Sold") &&
              !currentPriceCheck &&
              !bidTimeCheck &&
              isAuctionActive && (
                <TouchableOpacity
                  className={`py-3 mb-3  ${
                    isAuctionLive ? "bg-blue-500" : "bg-gray-500"
                  } rounded-sm`}
                  onPress={
                    typeBid === "Fixed_Price"
                      ? handleBuyNow
                      : handleSecretAuctionBid
                  }
                  disabled={!isAuctionLive}>
                  <Text className="font-semibold text-center text-white uppercase">
                    {typeBid === "Fixed_Price"
                      ? "BUY FIXED BID"
                      : "BUY SECRET BID"}
                  </Text>
                </TouchableOpacity>
              )}
            {typeBid === "Public_Auction" &&
              !currentPriceCheck &&
              !bidTimeCheck && (
                <View className="w-full">
                  {hasAutoBidHistory && (
                    <TouchableOpacity
                      onPress={handleViewAutoBidHistory}
                      className={`mb-3  bg-white border border-blue-500 
                   rounded-sm`}>
                      <Text className="py-3 font-semibold text-center text-blue-500 uppercase">
                        View History AutoBid
                      </Text>
                    </TouchableOpacity>
                  )}
                  <TouchableOpacity
                    onPress={handlePressAutoBid}
                    className={`mb-3  bg-blue-500
                   rounded-sm`}>
                    <Text className="py-3 font-semibold text-center text-white">
                      BID AUTOMATION
                    </Text>
                  </TouchableOpacity>
                </View>
              )}
            {/* {typeBid !== "Fixed_Price" && isAuctionActive && (
                <TouchableOpacity
                  className="py-3 mb-3 bg-blue-500 rounded-sm"
                  onPress={() => setModalVisible(true)}
                >
                  <Text className="font-semibold text-center text-white">
                    PLACE BID
                  </Text>
                </TouchableOpacity>
              )} */}

            {lotDetail?.status === "Passed" ||
            lotDetail?.status === "Sold" ||
            lotDetail?.status === "Cancelled" ? (
              <View>
                {(typeBid === "Public_Auction" ||
                  typeBid === "Auction_Price_GraduallyReduced") && (
                  <TouchableOpacity
                    className={`py-3
                               bg-blue-500  rounded-sm`}
                    onPress={() => handleJoinToBid(typeBid)}>
                    <Text className="font-semibold text-center text-white uppercase">
                      View To Bid
                    </Text>
                  </TouchableOpacity>
                )}
              </View>
            ) : (
              <View>
                {(typeBid === "Public_Auction" ||
                  typeBid === "Auction_Price_GraduallyReduced") &&
                  isAuctionLive && (
                    <TouchableOpacity
                      className={`py-3 ${
                        isAuctionLive ? "bg-blue-500" : "bg-gray-500"
                      }  rounded-sm`}
                      onPress={() => handleJoinToBid(typeBid)}
                      disabled={!isAuctionLive}>
                      <Text className="font-semibold text-center text-white uppercase">
                        Join To Bid
                      </Text>
                    </TouchableOpacity>
                  )}
              </View>
            )}
          </View>
        )}

        {!isRegistered &&
          !(lotDetail?.status === "Passed") &&
          !(lotDetail?.status === "Sold") &&
          !(lotDetail?.status === "Cancelled") && (
            <TouchableOpacity
              className={`py-3 mt-4 bg-blue-500  rounded-sm`}
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
            item={lotDetail}
          />
        )}

      <AutoBidHistoryModal
        visible={autoBidHistoryVisible}
        onClose={() => setAutoBidHistoryVisible(false)}
        customerLotId={customerLotId ?? 0}
        loading={loading}
        autoBids={autoBids}
      />
    </SafeAreaView>
  );
};

export default LotDetailScreen;
