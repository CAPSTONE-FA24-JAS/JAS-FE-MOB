import { requestOTPMail } from "@/api/OTPApi";
import { showSuccessMessage } from "@/components/FlashMessageHelpers";
import LoadingOverlay from "@/components/LoadingOverlay";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { RouteProp, useRoute } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { useNavigation } from "expo-router";
import React, { useState } from "react";
import { ScrollView, Text, TouchableOpacity, View } from "react-native";
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
};

interface RouteParams {
  details: any; // Replace 'any' with the appropriate type
  isOTP: boolean;
}

const PowerOfAttorney: React.FC = () => {
  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();
  const route = useRoute<RouteProp<{ params: RouteParams }, "params">>();
  const { details, isOTP } = route.params;
  const [loading, setLoading] = useState(false); // Trạng thái loading

  console.log("detailsaknha", details);

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

  const handleConfirm = () => {
    console.log("Form Data:", formData);
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
          <View className="flex-row mb-2">
            <Text className="mr-2 ">Địa chỉ:</Text>
            <Text className="font-semibold text-gray-800 ">
              {details?.address || "Không xác định"}
            </Text>
          </View>
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
            Họ tên: <Text className="font-bold">Nguyễn Văn B</Text>
          </Text>
          <Text className="mb-2">
            Địa chỉ: S1.01 Vinhomes Grand Park, Tp. Thủ Đức, TP. Hồ Chí Minh
          </Text>
          <Text className="mb-2">Số CMND: 9876545678 cấp ngày: 21/01/2018</Text>
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

              <Text className="mt-6">Nguyễn Văn A</Text>
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
              <Text className="mt-6 ">Nguyễn Văn B</Text>
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
              onPress={() => navigation.navigate("HistoryItemConsign")}>
              <Text className="text-lg font-bold text-center text-white uppercase">
                History Consign
              </Text>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity
              className={`p-3 rounded ${
                formData.agreeTerms ? "bg-blue-500" : "bg-gray-500"
              }  mb-4`}
              onPress={handleOTP}
              disabled={!formData.agreeTerms}>
              <Text className="text-lg font-bold text-center text-white">
                OTP CONFIRM
              </Text>
            </TouchableOpacity>
          )}
        </ScrollView>
        {/* <View className="absolute bottom-0 w-full p-4 bg-white"> */}
        {/* </View> */}
      </View>
    </>
  );
};

export default PowerOfAttorney;
