import React, { useEffect, useState } from "react";
import { View, Text, Image, ScrollView, Linking } from "react-native";
import { TouchableOpacity } from "react-native-gesture-handler";
import { useRoute } from "@react-navigation/native";
import {
  dataResponseConsignList,
  TimeLineConsignment,
} from "@/app/types/consign_type";
import PreValuationDetailsModal from "../Modal/PreValuationDetailsModal";
import AntDesign from "@expo/vector-icons/AntDesign";
import { showErrorMessage, showSuccessMessage } from "../FlashMessageHelpers";
import ImageGallery from "../ImageGallery";
import {
  getDetailHistoryValuation,
  rejectForValuations,
  updateStatusForValuation,
} from "@/api/consignAnItemApi";
import { useNavigation } from "expo-router";
import FinalValuationDetailsModal from "../Modal/FinalValuationDetailsModal";
import moment from "moment-timezone";
import { StackNavigationProp } from "@react-navigation/stack";
import LoadingOverlay from "../LoadingOverlay";

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
  | "Rejected";

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
  Rejected: "Rejected",
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
  console.log("valuationDataNe", valuationData);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchTimelineData(item?.id);
  }, [item]);

  const toggleExpanded = () => setExpanded(!expanded);

  const fetchTimelineData = async (itemId: any) => {
    getDetailHistoryValuation(itemId).then((response) => {
      // console.log("timeline", response);
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
      id: item?.id,
      status: item?.status,
      images: item?.imageValuations,
      name: item?.name,
      pricingTime: item?.pricingTime,
      estimatedCost: `${(item?.estimatePriceMin || 0).toLocaleString("vi-VN", {
        style: "currency",
        currency: "VND",
      })} - ${(item?.estimatePriceMax || 0).toLocaleString("vi-VN", {
        style: "currency",
        currency: "VND",
      })}`,
      width: item?.width,
      height: item?.height,
      depth: item?.depth,
      description: item?.description,
      note: "Preliminary pricing is considered based on the images and dimensions you provide.",
      owner: item?.seller?.lastName + " " + item?.seller.firstName,
      artist: item?.appraiser?.lastName + " " + item?.appraiser?.firstName,
      category: item?.jewelry?.category?.name || "N/A",

      creationDate: item?.creationDate,
    };
    console.log("valuationDetails", valuationDetails);

    // Đặt dữ liệu vào state và mở modal
    setValuationData(valuationDetails);
    setModalVisible(true);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Requested":
        return "bg-blue-500";
      case "Assigned":
        return "bg-indigo-500";
      case "RequestedPreliminary":
        return "bg-yellow-500";
      case "Preliminary":
        return "bg-brown-500";
      case "ApprovedPreliminary":
        return "bg-green-500";
      case "RecivedJewelry":
        return "bg-purple-500";
      case "FinalValuated":
        return "bg-orange-500";
      case "ManagerApproved":
        return "bg-green-700";
      case "Authorized":
        return "bg-blue-500";
      case "Rejected":
        return "bg-red-500";
      default:
        return "bg-gray-500";
    }
  };

  const handleApprove = async () => {
    setLoading(true); // Bắt đầu loading
    try {
      await updateStatusForValuation(item?.id, 4);
      // Update the item status locally
      setItem((prevItem) => ({
        ...prevItem,
        status: "Preliminary",
      }));
      setModalVisible(false);
      showSuccessMessage("Valuation approved successfully.");
    } catch (error) {
      console.error("Error approving valuation:", error);
      showErrorMessage("Failed to approve valuation.");
    } finally {
      setLoading(false); // Kết thúc loading
    }
  };

  const handleReject = async (reason: string) => {
    setLoading(true); // Bắt đầu loading
    try {
      await rejectForValuations(item?.id, 9, reason); // Gọi API rejectForValuations
      // Cập nhật trạng thái của item trong UI
      setItem((prevItem) => ({
        ...prevItem,
        status: "Rejected",
      }));
      setModalVisible(false); // Đóng modal
      setFinalModalVisible(false); // Đóng modal cuối
      showSuccessMessage("Valuation rejected successfully.");
    } catch (error) {
      console.error("Error rejecting valuation:", error);
      showErrorMessage("Failed to reject valuation.");
    } finally {
      setLoading(false); // Kết thúc loading
    }
  };

  const handleViewDetail = () => {};

  const handleViewFinalValuation = () => {
    // Sử dụng dữ liệu trực tiếp từ item để hiển thị trong modal
    const finalValuationDetails = {
      id: item?.id,
      sellerId: item?.seller?.id,
      status: item?.status,
      images:
        item?.jewelry?.imageJewelries.map((item) => item?.imageLink) ??
        item?.imageValuations?.map((item) => item?.imageLink),
      name: item?.name,
      pricingTime: item?.pricingTime,
      estimatedCost: `${(item?.estimatePriceMin || 0).toLocaleString("vi-VN", {
        style: "currency",
        currency: "VND",
      })} - ${(item?.estimatePriceMax || 0).toLocaleString("vi-VN", {
        style: "currency",
        currency: "VND",
      })}`,
      width: item?.width,
      height: item?.height,
      depth: item?.depth,
      description: item?.description,
      note: "If the customer accepts the above valuation, please sign the document attached below.",
      owner: item?.seller.lastName + " " + item?.seller.firstName,
      artist: item?.jewelry?.artist?.name ?? "N/A",
      category: item?.jewelry?.category?.name,
      address: item?.seller?.address,
      CCCD: item?.seller?.citizenIdentificationCard,
      idIssuanceDate: item?.seller?.idIssuanceDate,
      idExpirationDate: item?.seller?.idExpirationDate,
      country: "Viet Nam",
      email: item?.seller?.accountDTO?.email,

      descriptionCharacteristicDetails: item?.jewelry?.keyCharacteristicDetails,
      documentLink: item?.valuationDocuments?.filter(
        (i) => i.valuationDocumentType === "Authorized"
      )[0]?.documentLink,
      mainDiamonds: item?.jewelry?.mainDiamonds,
      creationDate: item?.creationDate,
    };

    // Đặt dữ liệu vào state và mở modal
    setValuationData(finalValuationDetails);
    setFinalModalVisible(true);
  };

  console.log("valuationData", valuationData);

  return (
    <ScrollView className="flex-1 bg-white">
      <LoadingOverlay visible={loading} />
      <View className="p-4">
        {/* Hiển thị thông tin item */}
        <View className="flex-row items-center mb-4">
          {item?.imageValuations[0].imageLink &&
          item?.imageValuations[0].imageLink ? (
            <Image
              source={{ uri: item?.imageValuations[0].imageLink }}
              className="w-32 h-32 mr-4 rounded"
            />
          ) : (
            <Image
              source={require("../../assets/item-jas/item1.jpg")}
              className="w-32 h-32 mr-4 rounded"
            />
          )}
          <View className="w-[60%]">
            <Text
              className={`uppercase ${getStatusColor(
                item?.status
              )} px-2 py-1 rounded-md text-white text-center mb-2 text-base font-semibold uppercase`}
            >
              {statusTextMap[item?.status as ConsignStatus]}
            </Text>
            <View className="flex-row items-center justify-between ">
              <Text className="text-xl font-bold w-[230px]">{item?.name}</Text>
              <Text className="text-gray-600">#{item?.id}</Text>
            </View>
            {item?.estimatePriceMin && item?.estimatePriceMin ? (
              <Text className="mt-2 text-lg font-semibold">
                {(item?.estimatePriceMin || 0).toLocaleString("vi-VN", {
                  style: "currency",
                  currency: "VND",
                })}{" "}
                -{" "}
                {(item?.estimatePriceMax || 0).toLocaleString("vi-VN", {
                  style: "currency",
                  currency: "VND",
                })}
              </Text>
            ) : (
              <Text className="mt-1 text-base font-semibold text-gray-500">
                Price not available
              </Text>
            )}
            {item?.jewelry?.category?.name && (
              <Text className="text-base text-gray-500">
                {item?.jewelry?.category?.name}
              </Text>
            )}

            <View className="flex-row justify-between w-full">
              {/* Nút "View Pre Valuation" nếu item?.status là "Preliminary Valued" */}
              {item?.status === "Preliminary" ? (
                <TouchableOpacity
                  className="w-full p-2 mt-2 bg-green-500 rounded"
                  onPress={handleViewPreValuation} // Hàm này vẫn cần để gọi modal và set dữ liệu
                >
                  <Text className="font-bold text-center text-white">
                    View Pre Valuation
                  </Text>
                </TouchableOpacity>
              ) : item?.status === "ManagerApproved" ? (
                <TouchableOpacity
                  className="w-full p-2 mt-2 bg-blue-500 rounded"
                  onPress={handleViewFinalValuation}
                >
                  <Text className="font-bold text-center text-white">
                    Show Final Valuation Modal
                  </Text>
                </TouchableOpacity>
              ) : null}
            </View>
          </View>
        </View>

        {/* Tạo list ảnh hàng ngang nhỏ, ấn vào thì show modal ảnh phỏng lớn */}
        <View>
          <ImageGallery
            images={item?.imageValuations?.map((img) => img.imageLink)}
          />
        </View>

        <View className="mt-4">
          {timeline &&
            timeline?.length > 0 &&
            timeline
              .sort(
                (a, b) =>
                  new Date(a.creationDate).getTime() -
                  new Date(b.creationDate).getTime()
              )
              .slice(0, expanded ? timeline.length : 4)
              .map((event, index) => (
                <View key={index} className="flex-row mb-4">
                  <View className="items-center mr-4">
                    <View className="w-3 h-3 bg-blue-500 rounded-full" />
                    {index !== (expanded ? timeline.length - 1 : 3) && (
                      <View className="w-0.5 h-[80px] bg-gray-300 mt-1" />
                    )}
                  </View>
                  <View className="flex-1">
                    <Text className="text-sm text-gray-500">
                      {moment(event?.creationDate).format(
                        "HH:mm A, DD/MM/YYYY"
                      )}
                    </Text>
                    <Text className="font-bold">{event?.statusName}</Text>
                    {event?.statusName == "RecivedJewelry" &&
                      item?.valuationDocuments && ( // chưa biết cái nào hiển thị tài liệu nên để đây
                        <TouchableOpacity
                          className="p-2 mt-1 bg-gray-200 rounded w-[180px]"
                          // onPress={handlePowerOfAttorney}
                          onPress={
                            item?.valuationDocuments
                              ? () =>
                                  Linking.openURL(
                                    item?.valuationDocuments.filter(
                                      (i) =>
                                        i.valuationDocumentType === "Reciept"
                                    )[0]?.documentLink
                                  )
                              : () => {}
                          }
                        >
                          <Text className="font-semibold text-gray-700">
                            Download delivery receipt
                          </Text>
                          {/* đoạn này đang kh biết tải hẳn luôn ha là mở modal */}
                        </TouchableOpacity>
                      )}
                    {event?.statusName == "Preliminary" && ( // chưa biết cái nào hiển thị tài liệu nên để đây
                      <TouchableOpacity
                        className="p-2 mt-1 bg-gray-200 rounded w-[140px] "
                        onPress={handleViewPreValuation}
                      >
                        <Text className="font-semibold text-center text-gray-700">
                          View Preliminary
                        </Text>
                        {/* đoạn này đang kh biết tải hẳn luôn ha là mở modal */}
                      </TouchableOpacity>
                    )}
                    {event?.statusName == "FinalValuated" && ( // chưa biết cái nào hiển thị tài liệu nên để đây
                      <TouchableOpacity
                        className="p-2 mt-1 bg-gray-200 rounded w-[140px] "
                        onPress={handleViewFinalValuation}
                      >
                        <Text className="font-semibold text-center text-gray-700">
                          View Final Valuated
                        </Text>
                        {/* đoạn này đang kh biết tải hẳn luôn ha là mở modal */}
                      </TouchableOpacity>
                    )}
                  </View>
                </View>
              ))}
        </View>

        {timeline.length > 4 && (
          <TouchableOpacity
            onPress={toggleExpanded}
            className="flex-row items-center justify-center p-2 mt-2 bg-gray-100 rounded"
          >
            <Text className="mr-2">
              {expanded ? "Thu gọn" : "Xem toàn bộ lịch sử"}
            </Text>
            {expanded ? (
              <AntDesign name="caretup" size={20} color="#4B5563" />
            ) : (
              <AntDesign name="caretdown" size={20} color="#4B5563" />
            )}
          </TouchableOpacity>
        )}
      </View>

      {valuationData && (
        <PreValuationDetailsModal
          isVisible={modalVisible}
          onClose={() => setModalVisible(false)}
          details={valuationData} // Dữ liệu thực từ ConsignResponse đã chuyển đổi
          onApprove={handleApprove}
          onReject={(reason: string) => handleReject(reason)}
        />
      )}
      {
        <FinalValuationDetailsModal
          isVisible={isFinalModalVisible}
          onClose={() => setFinalModalVisible(false)}
          details={valuationData}
          onApprove={() => {
            showSuccessMessage("Approved");
            setFinalModalVisible(false);
          }}
        />
      }
    </ScrollView>
  );
};

export default ConsignDetailTimeLine;
