import React, { useState } from "react";
import { View, Text, ScrollView, TouchableOpacity } from "react-native";
import { TextInput, Checkbox, Button } from "react-native-paper";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useNavigation } from "expo-router";
import { StackNavigationProp } from "@react-navigation/stack";

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
  OTP: undefined;
};

const PowerOfAttorney: React.FC = () => {
  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();

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
  const handleOTP = () => {
    navigation.navigate("OTP");
  };

  return (
    <View className="flex-1 bg-gray-100 ">
      <ScrollView className=" bg-white px-4">
        <Text className="text-center text-lg font-bold mb-4">
          CỘNG HOÀ XÃ HỘI CHỦ NGHĨA VIỆT NAM{"\n"}Độc lập - Tự do - Hạnh phúc
        </Text>

        <Text className="text-center text-xl font-bold mb-2">
          GIẤY UỶ QUYỀN
        </Text>
        <Text className="text-center italic mb-4">(Dành cho cá nhân)</Text>

        <Text className="mb-2">
          - Căn cứ Bộ Luật Dân sự nước Cộng hoà xã hội chủ nghĩa Việt Nam.
          {"\n"}- Căn cứ vào các văn bản hiến pháp hiện hành.
        </Text>

        <Text className="mb-2">
          TP. Hồ Chí Minh, ngày 12 tháng 12 năm 2024; chúng tôi gồm có:
        </Text>

        {/* Section I: BÊN UỶ QUYỀN */}
        <Text className="font-bold text-lg mb-2">I. BÊN UỶ QUYỀN</Text>
        <TextInput
          label="Họ tên"
          value={formData.benUyQuyen.hoTen}
          onChangeText={(value) =>
            handleInputChange("benUyQuyen", "hoTen", value)
          }
          mode="outlined"
          className="mb-2"
        />
        <TextInput
          label="Địa chỉ"
          value={formData.benUyQuyen.diaChi}
          onChangeText={(value) =>
            handleInputChange("benUyQuyen", "diaChi", value)
          }
          mode="outlined"
          className="mb-2"
        />
        <TextInput
          label="Số CMND"
          value={formData.benUyQuyen.soCMND}
          onChangeText={(value) =>
            handleInputChange("benUyQuyen", "soCMND", value)
          }
          mode="outlined"
          className="mb-2"
        />
        <View className="flex-row justify-between">
          <TextInput
            label="Ngày cấp"
            value={formData.benUyQuyen.ngayCap}
            onChangeText={(value) =>
              handleInputChange("benUyQuyen", "ngayCap", value)
            }
            mode="outlined"
            className="flex-1 mr-2"
          />
          <TextInput
            label="Nơi cấp"
            value={formData.benUyQuyen.noiCap}
            onChangeText={(value) =>
              handleInputChange("benUyQuyen", "noiCap", value)
            }
            mode="outlined"
            className="flex-1 ml-2"
          />
        </View>
        <TextInput
          label="Quốc tịch"
          value={formData.benUyQuyen.quocTich}
          onChangeText={(value) =>
            handleInputChange("benUyQuyen", "quocTich", value)
          }
          mode="outlined"
          className="mb-4"
        />

        {/* Section II: BÊN ĐƯỢC UỶ QUYỀN */}
        <Text className="font-bold text-lg mb-2">II. BÊN ĐƯỢC UỶ QUYỀN</Text>
        <Text className="mb-2">
          Họ tên: <Text className="font-bold">Nguyễn Văn B</Text>
        </Text>
        <Text className="mb-2">
          Địa chỉ: S1.01 Vinhomes Grand Park, Tp. Thủ Đức, TP. Hồ Chí Minh
        </Text>
        <Text className="mb-2">Số CMND: 9876545678 cấp ngày: 21/01/2018</Text>
        <Text className="mb-2">Nơi cấp: tại Công an tỉnh Tp. Hồ Chí Minh</Text>
        <Text className="mb-4">Quốc tịch: Việt Nam</Text>

        {/* Section III: NỘI DUNG UỶ QUYỀN */}
        <Text className="font-bold text-lg mb-2">III. NỘI DUNG UỶ QUYỀN</Text>
        <Text className="mb-4">
          Bên Uỷ quyền đồng ý ủy quyền cho Bên Nhận Ủy quyền thực hiện các hành
          vi sau đây:
          {"\n"}- Tiếp nhận, định đoạt và định giá tài phẩm từ trang sức do Bên
          Uỷ quyền gửi.{"\n"}- Được phép kiểm tra và nhận vật phẩm nêu trên khi
          hoàn thành thủ tục đấu giá.{"\n"}- Nhận tiền hoàn lại từ việc đấu giá.
          {"\n"}- Thay mặt bên uỷ quyền thực hiện, giám sát toàn bộ thủ tục bàn
          giao vật phẩm.{"\n"}
        </Text>

        {/* Section IV: CAM KẾT */}
        <Text className="font-bold text-lg mb-2">IV. CAM KẾT</Text>
        <Text className="mb-4">
          - Hai bên cam kết sẽ hoàn toàn chịu trách nhiệm trước Pháp luật về mọi
          thông tin uỷ quyền ở trên{"\n"}- Mọi tranh chấp phát sinh giữa giữa
          quyền uỷ quyền và bên được uỷ quyền sẽ do hai bên tự giải quyết
        </Text>

        {/* Signatures */}
        <View className="flex-row justify-around items-center mb-6">
          <View className="items-center">
            <Text className="text-lg font-semibold">BÊN ỦY QUYỀN</Text>
            <Text className="text-sm mb-8 italic">(Ký, họ tên)</Text>
            <TouchableOpacity
              className="py-3 px-4 rounded-full bg-blue-600 "
              onPress={handleOTP}
            >
              <Text className="text-white text-center text-lg font-bold">
                Xác nhận OTP
              </Text>
            </TouchableOpacity>
            <Text className="mt-6">Nguyễn Văn A</Text>
          </View>
          <View className="items-center">
            <Text className="text-lg font-semibold mt-1">
              BÊN ĐƯỢC ỦY QUYỀN
            </Text>
            <Text className="text-sm mb-8 italic">(Ký, họ tên)</Text>
            <MaterialCommunityIcons
              name="signature-freehand"
              size={48}
              color="black"
            />
            <Text className=" mt-6">Nguyễn Văn B</Text>
          </View>
        </View>
        {/* Checkbox for terms and conditions */}
        <View className="flex-row items-center pb-4">
          <Checkbox
            status={formData.agreeTerms ? "checked" : "unchecked"}
            onPress={() =>
              setFormData((prev) => ({
                ...prev,
                agreeTerms: !prev.agreeTerms,
              }))
            }
          />
          <Text className=" ml-2">
            Tôi đã đọc các điều khoản chính sách của JAS và đồng ý với các điều
            khoản
          </Text>
        </View>
        <TouchableOpacity
          className="p-3 rounded bg-blue-500 mb-4"
          onPress={handleConfirm}
          disabled={!formData.agreeTerms}
        >
          <Text className="text-white text-center text-lg font-bold">
            CONFIRM
          </Text>
        </TouchableOpacity>
      </ScrollView>
      {/* <View className="absolute bottom-0 w-full p-4 bg-white"> */}
      {/* </View> */}
    </View>
  );
};

export default PowerOfAttorney;
