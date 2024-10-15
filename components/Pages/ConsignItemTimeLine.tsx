import React, { useEffect, useState } from "react";
import { View, Text, Image, ScrollView } from "react-native";
import { TouchableOpacity } from "react-native-gesture-handler";
import { ChevronDown, ChevronUp } from "lucide-react-native";
import { useRoute } from "@react-navigation/native";
import {
  dataResponseConsignList,
  TimeLineConsignment,
} from "@/app/types/consign_type";
import PreValuationDetailsModal from "../Modal/PreValuationDetailsModal";
import { showErrorMessage, showSuccessMessage } from "../FlashMessageHelpers";
import ImageGallery from "../ImageGallery";
import {
  getDetailHistoryValuation,
  updateStatusForValuation,
} from "@/api/consignAnItemApi";
import { StackNavigationProp } from "@react-navigation/stack";
import { useNavigation } from "expo-router";
import { get } from "react-native/Libraries/TurboModule/TurboModuleRegistry";
import FinalValuationDetailsModal from "../Modal/FinalValuationDetailsModal";

// Define the types for navigation routes
type RootStackParamList = {
  PowerOfAttorney: undefined;
};

type ConsignStatus =
  | "Requested"
  | "Assigned"
  | "RequestedPreliminary"
  | "Preliminary"
  | "ApprovedPreliminary"
  | "RecivedJewelry"
  | "FinalValuated"
  | "ManagerApproved"
  | "Authorized"
  | "RejectedPreliminary";

const statusTextMap: Record<ConsignStatus, string> = {
  Requested: "Requested",
  Assigned: "Assigned",
  RequestedPreliminary: "Requested Preliminary",
  Preliminary: "Preliminary",
  ApprovedPreliminary: "Approved Preliminary",
  RecivedJewelry: "Recived Jewelry",
  FinalValuated: "Final Valuated",
  ManagerApproved: "Manager Approved",
  Authorized: "Authorized",
  RejectedPreliminary: "Rejected Preliminary",
};
const ConsignDetailTimeLine: React.FC = () => {
  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();

  const route = useRoute();
  const { item: routeItem } = route.params as { item: dataResponseConsignList }; // Lấy params
  const [item, setItem] = useState(routeItem); // Create a local state for the item
  const [timeline, setTimeline] = useState<TimeLineConsignment[]>([]);
  const [expanded, setExpanded] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [valuationData, setValuationData] = useState<any | null>(null);
  const [isFinalModalVisible, setFinalModalVisible] = useState(false);
  // console.log("valuationDataNe", valuationData);

  useEffect(() => {
    fetchTimelineData("30"); //hard tamj id ddeer test UI
  }, [item]);

  const toggleExpanded = () => setExpanded(!expanded);

  const fetchTimelineData = async (itemId: string) => {
    getDetailHistoryValuation(Number(itemId)).then((response) => {
      console.log("timeline", response);
      if (!response) {
        setTimeline([]);
      }
      setTimeline(response);
    });
  };

  const handlePowerOfAttorney = () => {
    navigation.navigate("PowerOfAttorney");
  };

  const handleViewPreValuation = () => {
    // Sử dụng dữ liệu trực tiếp từ item để hiển thị trong modal
    const valuationDetails = {
      id: item.id,
      status: item.status,
      images: item.imageValuations[0]?.imageLink,
      name: item.name,
      pricingTime: item.pricingTime,
      estimatedCost: "chưa có",
      width: item.width,
      height: item.height,
      depth: item.depth,
      description: item.description,
      note: "Preliminary pricing is considered based on the images and dimensions you provide.",
      owner: item.seller.lastName + " " + item.seller.firstName,
      artist: "fv",
      category: "àg",
    };

    // Đặt dữ liệu vào state và mở modal
    setValuationData(valuationDetails);
    setModalVisible(true);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Requested":
        return "text-blue-500";
      case "Assigned":
        return "text-indigo-500";
      case "RequestedPreliminary":
        return "text-yellow-500";
      case "Preliminary":
        return "text-brown-500";
      case "ApprovedPreliminary":
        return "text-green-500";
      case "RecivedJewelry":
        return "text-purple-500";
      case "FinalValuated":
        return "text-orange-500";
      case "ManagerApproved":
        return "text-green-700";
      case "Authorized":
        return "text-blue-500";
      case "RejectedPreliminary":
        return "text-red-500";
      default:
        return "text-gray-500";
    }
  };

  const handleApprove = async () => {
    try {
      await updateStatusForValuation(item.id, 3);
      // Update the item status locally
      setItem((prevItem) => ({
        ...prevItem,
        status: "Preliminary",
      }));
      setModalVisible(false);
    } catch (error) {
      console.error("Error approving valuation:", error);
    }
  };

  const handleReject = async () => {
    try {
      await updateStatusForValuation(item.id, 9);
      // Update the item status locally
      setItem((prevItem) => ({
        ...prevItem,
        status: "RejectedPreliminary",
      }));
      setModalVisible(false);
      setFinalModalVisible(false);
    } catch (error) {
      console.error("Error rejecting valuation:", error);
    }
  };

  const handleViewDetail = () => {};

  const handleViewFinalValuation = () => {
    // Sử dụng dữ liệu trực tiếp từ item để hiển thị trong modal
    const finalValuationDetails = {
      id: item.id,
      sellerId: item.seller.id,
      status: item.status,
      images: item.imageValuations.map((item) => item.imageLink),
      name: item.name,
      pricingTime: item.pricingTime,
      estimatedCost: "Api chưa có",
      width: item.width,
      height: item.height,
      depth: item.depth,
      description: item.description,
      note: "If the customer accepts the above valuation, please sign the document attached below.",
      owner: item.seller.lastName + " " + item.seller.firstName,
      artist: "API chưa có",
      category: "API chưa có",
      address: item.seller.address,
      CCCD: item.seller.citizenIdentificationCard,
      idIssuanceDate: item.seller.idIssuanceDate,
      idExpirationDate: item.seller.idExpirationDate,
      country: "Viet Nam",
      email: item.seller.accountDTO.email,
    };

    // Đặt dữ liệu vào state và mở modal
    setValuationData(finalValuationDetails);
    setFinalModalVisible(true);
  };

  return (
    <ScrollView className="flex-1 bg-white">
      <View className="p-4">
        {/* Hiển thị thông tin item */}
        <View className="flex-row items-center mb-4">
          {item.imageValuations[0].imageLink &&
          item.imageValuations[0].imageLink ? (
            <Image
              source={{ uri: item.imageValuations[0].imageLink }}
              className="w-32 h-32 mr-4 rounded"
            />
          ) : (
            <Image
              source={require("../../assets/item-jas/item1.jpg")}
              className="w-32 h-32 mr-4 rounded"
            />
          )}
          <View className="w-[60%]">
            <View className="flex-row items-center justify-between ">
              <Text className="text-xl font-bold w-[230px]">{item.name}</Text>
              <Text className="text-gray-600">#{item.id}</Text>
            </View>
            {item.pricingTime ? (
              <Text className="mt-1 text-lg font-semibold">chưa có price</Text>
            ) : (
              <Text className="mt-1 text-base font-semibold text-gray-500">
                Price not available
              </Text>
            )}

            <Text
              className={`uppercase ${getStatusColor(
                item.status
              )} font-semibold uppercase`}
            >
              {statusTextMap[item.status as ConsignStatus]}
            </Text>
            <View className="flex-row w-full justify-between">
              {/* Nút "View Pre Valuation" nếu item.status là "Preliminary Valued" */}
              {item.status === "RequestedPreliminary" ? (
                <TouchableOpacity
                  className="mt-2  w-full bg-green-500 p-2 rounded"
                  onPress={handleViewPreValuation} // Hàm này vẫn cần để gọi modal và set dữ liệu
                >
                  <Text className="font-bold text-center text-white">
                    View Pre Valuation
                  </Text>
                </TouchableOpacity>
              ) : item.status === "ManagerApproved" ? (
                <TouchableOpacity
                  className="mt-2  w-full bg-blue-500 p-2 rounded"
                  onPress={handleViewFinalValuation}
                >
                  <Text className="font-bold text-center text-white">
                    Show Final Valuation Modal
                  </Text>
                </TouchableOpacity>
              ) : null}
              <TouchableOpacity
                className="mt-2  w-full bg-gray-500 p-2 rounded"
                onPress={handleViewDetail} // Hàm này vẫn cần để gọi modal và set dữ liệu
              >
                <Text className="font-bold text-center text-white">View</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>

        {/* Tạo list ảnh hàng ngang nhỏ, ấn vào thì show modal ảnh phỏng lớn */}
        <View>
          <ImageGallery
            images={item.imageValuations.map((img) => img.imageLink)}
          />
        </View>

        <View className="mt-4">
          {timeline &&
            timeline.length > 0 &&
            timeline
              .slice(0, expanded ? timeline.length : 1)
              .map((event, index) => (
                <View key={index} className="flex-row mb-4">
                  <View className="items-center mr-4">
                    <View className="w-3 h-3 bg-blue-500 rounded-full" />
                    {index !== (expanded ? timeline.length - 1 : 0) && (
                      <View className="w-0.5 h-[80px] bg-gray-300 mt-1" />
                    )}
                  </View>
                  <View className="flex-1">
                    <Text className="text-sm text-gray-500">
                      {event.creationDate}
                    </Text>
                    <Text className="font-bold">{event.statusName}</Text>
                    {event.statusName == "ManagerApproved" && ( // chưa biết cái nào hiển thị tài liệu nên để đây
                      <TouchableOpacity
                        className="p-2 mt-1 bg-gray-200 rounded w-[50px]"
                        onPress={handlePowerOfAttorney}
                      >
                        <Text className="text-gray-700">Print</Text>
                        {/* đoạn này đang kh biết tải hẳn luôn ha là mở modal */}
                      </TouchableOpacity>
                    )}
                  </View>
                </View>
              ))}
        </View>

        {timeline.length > 1 && (
          <TouchableOpacity
            onPress={toggleExpanded}
            className="flex-row items-center justify-center p-2 mt-2 bg-gray-100 rounded"
          >
            <Text className="mr-2">
              {expanded ? "Thu gọn" : "Xem toàn bộ lịch sử"}
            </Text>
            {expanded ? (
              <ChevronUp size={20} color="#4B5563" />
            ) : (
              <ChevronDown size={20} color="#4B5563" />
            )}
          </TouchableOpacity>
        )}
      </View>

      {item.status === "RequestedPreliminary" && valuationData && (
        <PreValuationDetailsModal
          isVisible={modalVisible}
          onClose={() => setModalVisible(false)}
          details={valuationData} // Dữ liệu thực từ ConsignResponse đã chuyển đổi
          onApprove={handleApprove}
          onReject={handleReject}
        />
      )}
      {item.status === "ManagerApproved" && (
        <FinalValuationDetailsModal
          isVisible={isFinalModalVisible}
          onClose={() => setFinalModalVisible(false)}
          details={valuationData}
          onApprove={() => {
            showSuccessMessage("Approved");
            setFinalModalVisible(false);
          }}
          onReject={handleReject}
        />
      )}
    </ScrollView>
  );
};

export default ConsignDetailTimeLine;
