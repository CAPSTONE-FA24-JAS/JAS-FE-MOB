import { rejectJewelryByOwner } from "@/api/consignAnItemApi";
import { requestOTPMail } from "@/api/OTPApi";
import { showSuccessMessage } from "@/components/FlashMessageHelpers";
import LoadingOverlay from "@/components/LoadingOverlay";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { RouteProp, useRoute } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { useNavigation, useRouter } from "expo-router";
import React, { useState } from "react";
import {
  Modal,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { Checkbox } from "react-native-paper";

interface BenUyQuyen {
  hoTen: string;
  diaChi: string;
  soCMND: string;
  ngayCap: string;
  noiCap: string;
  quocTich: string;
}

interface FormData {
  benUyQuyen: BenUyQuyen;
  agreeTerms: boolean;
}

// Define the types for navigation routes
type RootStackParamList = {
  OTP: { valuationId: number; sellerId: number; email: string; details: any };
  HistoryItemConsign: undefined;
  DrawerLayout: { screen: string };
};

interface RouteParams {
  details: any; // Replace 'any' with the appropriate type
  isOTP: boolean;
}

const PowerOfAttorney: React.FC = () => {
  const router = useRouter();

  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();
  const route = useRoute<RouteProp<{ params: RouteParams }, "params">>();
  const { details, isOTP } = route.params;
  const [rejectReasonModalVisible, setRejectReasonModalVisible] =
    useState(false);
  const [selectedReason, setSelectedReason] = useState<string | null>(null);
  const [otherReason, setOtherReason] = useState<string>("");
  const [loading, setLoading] = useState(false); // Trạng thái loading

  console.log("detailsaknha", JSON.stringify(details));
  const suggestedReasons = [
    "Not interested anymore",
    "Found a better option",
    "Incorrect details",
    "Other",
  ];

  const [formData, setFormData] = useState<FormData>({
    benUyQuyen: {
      hoTen: "",
      diaChi: "",
      soCMND: "",
      ngayCap: "",
      noiCap: "",
      quocTich: "",
    },
    agreeTerms: false,
  });

  const handleInputChange = (
    section: keyof FormData,
    field: keyof BenUyQuyen,
    value: string
  ) => {
    if (section === "benUyQuyen") {
      setFormData((prevData) => ({
        ...prevData,
        benUyQuyen: {
          ...prevData.benUyQuyen,
          [field]: value,
        },
      }));
    }
  };

  const handleReject = async (reason: string) => {
    const jewelryId = details?.descriptionCharacteristicDetails[0]?.jewelryId; // Replace with actual `jewelryId`
    const status = 9; // Status for rejection

    try {
      setLoading(true);
      const response = await rejectJewelryByOwner(jewelryId, status, reason);
      console.log("Rejection successful:", response);
      router.back();
    } catch (error) {
      console.error("Error rejecting jewelry:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleConfirmReject = () => {
    const reason =
      selectedReason === "Other" ? otherReason : selectedReason || "";
    if (reason.trim() === "") {
      alert("Please provide a reason for rejection.");
      return;
    }

    setRejectReasonModalVisible(false);
    handleReject(reason);
  };

  const handleOTP = async () => {
    try {
      setLoading(true);
      // Call the requestOTPMail function with valuationId and sellerId
      const message = await requestOTPMail(details.id, details.sellerId);

      // If successful, proceed to OTP page
      if (message) {
        console.log("messageRequest", message); // Optionally log the success message
        showSuccessMessage(message);
        setLoading(false);
        navigation.navigate("OTP", {
          valuationId: details.id,
          sellerId: details.sellerId,
          email: details.email,
          details: details,
        });
      }
    } catch (error) {
      setLoading(false);
      console.error("Failed to request OTP:", error);
    }
    setLoading(false);
  };
  return (
    <>
      {loading && <LoadingOverlay visible={loading} />}
      <View className="flex-1 bg-gray-100 ">
        <ScrollView className="px-4 bg-white ">
          <Text className="mb-4 text-lg font-bold text-center">
            CỘNG HOÀ XÃ HỘI CHỦ NGHĨA VIỆT NAM{"\n"}Độc lập - Tự do - Hạnh phúc
          </Text>

          <Text className="mb-2 text-xl font-bold text-center">
            GIẤY UỶ QUYỀN
          </Text>
          <Text className="mb-4 italic text-center">(Dành cho cá nhân)</Text>

          <Text className="mb-2">
            - Căn cứ Bộ Luật Dân sự nước Cộng hoà xã hội chủ nghĩa Việt Nam.
            {"\n"}- Căn cứ vào các văn bản hiến pháp hiện hành.
          </Text>

          <Text className="mb-2">
            TP. Hồ Chí Minh, ngày 12 tháng 12 năm 2024; chúng tôi gồm có:
          </Text>

          {/* Section I: BÊN UỶ QUYỀN */}
          <Text className="mb-2 text-lg font-bold">I. BÊN UỶ QUYỀN</Text>
          <View className="flex-row mb-2">
            <Text className="mr-2 ">Họ tên:</Text>
            <Text className="font-semibold text-gray-800 ">
              {details?.owner || "Không xác định"}
            </Text>
          </View>
          {details?.address && (
            <View className="flex-row mb-2">
              <Text className="mr-2 ">Địa chỉ:</Text>
              <Text className="font-semibold text-gray-800 ">
                {details?.address || "Không xác định"}
              </Text>
            </View>
          )}
          <View className="flex-row mb-2">
            <Text className="mr-2 ">Số CCCD:</Text>
            <Text className="font-semibold text-gray-800 ">
              {details?.CCCD || "Không xác định"}
            </Text>
          </View>

          <View className="flex-row ">
            <View className="flex-row mb-2 mr-10">
              <Text className="mr-2 ">Ngày cấp:</Text>
              <Text className="font-semibold text-gray-800 ">
                {details?.idIssuanceDate
                  ? new Date(details.idIssuanceDate).toLocaleDateString("vi-VN")
                  : "Không xác định"}
              </Text>
            </View>
            <View className="flex-row mb-2">
              <Text className="mr-2 ">Quốc tịch:</Text>
              <Text className="font-semibold text-gray-800 ">
                {details?.country || "Không xác định"}
              </Text>
            </View>
          </View>

          {/* Section II: BÊN ĐƯỢC UỶ QUYỀN */}
          <Text className="mb-2 text-lg font-bold">II. BÊN ĐƯỢC UỶ QUYỀN</Text>
          <Text className="mb-2">
            Công ty: <Text className="font-bold">Công ty JAS</Text>
          </Text>
          <Text className="mb-2">
            Địa chỉ: S1.01 Vinhomes Grand Park, Tp. Thủ Đức, TP. Hồ Chí Minh
          </Text>
          <Text className="mb-2">Số CMND: 9876545678 </Text>
          <Text className="mb-2">Ngày cấp: 21/01/2018</Text>
          <Text className="mb-2">
            Nơi cấp: tại Công an tỉnh Tp. Hồ Chí Minh
          </Text>
          <Text className="mb-4">Quốc tịch: Việt Nam</Text>

          {/* Section III: NỘI DUNG UỶ QUYỀN */}
          <Text className="mb-2 text-lg font-bold">III. NỘI DUNG UỶ QUYỀN</Text>
          <Text className="mb-4">
            Bên Uỷ quyền đồng ý ủy quyền cho Bên Nhận Ủy quyền thực hiện các
            hành vi sau đây:
            {"\n"}- Tiếp nhận, định đoạt và định giá tài phẩm từ trang sức do
            Bên Uỷ quyền gửi.{"\n"}- Được phép kiểm tra và nhận vật phẩm nêu
            trên khi hoàn thành thủ tục đấu giá.{"\n"}- Nhận tiền hoàn lại từ
            việc đấu giá.
            {"\n"}- Thay mặt bên uỷ quyền thực hiện, giám sát toàn bộ thủ tục
            bàn giao vật phẩm.{"\n"}
          </Text>

          {/* Section IV: CAM KẾT */}
          <Text className="mb-2 text-lg font-bold">IV. CAM KẾT</Text>
          <Text className="mb-4">
            - Hai bên cam kết sẽ hoàn toàn chịu trách nhiệm trước Pháp luật về
            mọi thông tin uỷ quyền ở trên{"\n"}- Mọi tranh chấp phát sinh giữa
            giữa quyền uỷ quyền và bên được uỷ quyền sẽ do hai bên tự giải quyết
          </Text>

          {/* Signatures */}
          <View className="flex-row items-center justify-around mb-6">
            <View className="items-center">
              <Text className="text-lg font-semibold">BÊN ỦY QUYỀN</Text>
              <Text className="mb-8 text-sm italic">(Ký, họ tên)</Text>
              {isOTP ? (
                <Text className="text-lg font-bold text-center text-green-800">
                  {details?.owner}
                </Text>
              ) : (
                <Text className="text-lg font-bold text-center text-gray-800">
                  Ký xác nhận OTP
                </Text>
              )}

              <Text className="mt-6">{details?.owner || "Nguyễn Văn A"}</Text>
            </View>
            <View className="items-center">
              <Text className="mt-1 text-lg font-semibold">
                BÊN ĐƯỢC ỦY QUYỀN
              </Text>
              <Text className="mb-8 text-sm italic">(Ký, họ tên)</Text>
              <MaterialCommunityIcons
                name="signature-freehand"
                size={48}
                color="black"
              />
              <Text className="mt-6 ">JAS COMPANY</Text>
            </View>
          </View>
          {/* Checkbox for terms and conditions */}
          <View className="pb-4 ">
            {isOTP ? (
              <Text className="ml-2 ">
                Tôi đã đọc các điều khoản chính sách của JAS và đồng ý với các
                điều khoản
              </Text>
            ) : (
              <View className="flex-row items-center">
                <Checkbox
                  status={formData.agreeTerms ? "checked" : "unchecked"}
                  onPress={() =>
                    setFormData((prev) => ({
                      ...prev,
                      agreeTerms: !prev.agreeTerms,
                    }))
                  }
                />
                <Text className="ml-2 ">
                  Tôi đã đọc các điều khoản chính sách của JAS và đồng ý với các
                  điều khoản
                </Text>
              </View>
            )}
          </View>
          {isOTP ? (
            <TouchableOpacity
              className="p-3 mb-4 bg-blue-500 rounded"
              onPress={() => navigation.navigate("HistoryItemConsign")}
            >
              <Text className="text-lg font-bold text-center text-white uppercase">
                History Consign
              </Text>
            </TouchableOpacity>
          ) : (
            <View className="flex-row justify-between">
              <TouchableOpacity
                className={`p-3 rounded w-[45%] bg-red-500 mb-4`}
                onPress={() => setRejectReasonModalVisible(true)}
              >
                <Text className="text-lg font-bold text-center uppercase text-white">
                  Reject{" "}
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                className={`p-3  w-[45%] rounded ${
                  formData.agreeTerms ? "bg-blue-500" : "bg-gray-500"
                }  mb-4`}
                onPress={handleOTP}
                disabled={!formData.agreeTerms}
              >
                <Text className="text-lg font-bold text-center text-white">
                  OTP CONFIRM
                </Text>
              </TouchableOpacity>
            </View>
          )}

          {isOTP && (
            <TouchableOpacity
              className="p-3 mb-4 bg-white border-2 border-blue-500 rounded"
              onPress={() =>
                navigation.navigate("DrawerLayout", {
                  screen: "HomePage",
                })
              }
            >
              <Text className="text-lg font-bold text-center text-blue-500 uppercase">
                Home
              </Text>
            </TouchableOpacity>
          )}
        </ScrollView>
        {/* <View className="absolute bottom-0 w-full p-4 bg-white"> */}
        {/* </View> */}

        {/* Reject Reason Modal */}
        <Modal
          visible={rejectReasonModalVisible}
          animationType="slide"
          transparent
          onRequestClose={() => setRejectReasonModalVisible(false)}
        >
          <View className="items-center justify-center flex-1 bg-black/50">
            <View className="w-11/12 p-4 bg-white rounded-lg">
              <Text className="mb-4 text-lg font-bold">Select a Reason</Text>
              <ScrollView className="max-h-[60%]">
                {suggestedReasons.map((reason, index) => (
                  <TouchableOpacity
                    key={index}
                    className={`flex-row items-center mb-2 p-3 rounded-lg ${
                      selectedReason === reason ? "bg-blue-100" : "bg-gray-100"
                    }`}
                    onPress={() => setSelectedReason(reason)}
                  >
                    <View className="flex items-center justify-center w-5 h-5 mr-4 border-2 border-blue-600 rounded-full">
                      {selectedReason === reason && (
                        <View className="h-2.5 w-2.5 bg-blue-600 rounded-full" />
                      )}
                    </View>
                    <Text className="text-base text-gray-700">{reason}</Text>
                  </TouchableOpacity>
                ))}
                {selectedReason === "Other" && (
                  <TextInput
                    className="p-3 mt-4 border border-gray-300 rounded-lg"
                    placeholder="Enter your reason"
                    value={otherReason}
                    onChangeText={setOtherReason}
                  />
                )}
              </ScrollView>
              <View className="flex-row justify-between mt-6">
                <TouchableOpacity
                  className="flex-1 py-3 mr-2 bg-gray-300 rounded-lg"
                  onPress={() => setRejectReasonModalVisible(false)}
                >
                  <Text className="font-bold text-center text-gray-700">
                    Cancel
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  className="flex-1 py-3 ml-2 bg-red-500 rounded-lg"
                  onPress={handleConfirmReject}
                >
                  <Text className="font-bold text-center text-white">
                    Confirm
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>
      </View>
    </>
  );
};

export default PowerOfAttorney;
