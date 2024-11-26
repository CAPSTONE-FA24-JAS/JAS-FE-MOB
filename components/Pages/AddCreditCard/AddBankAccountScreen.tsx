import {
  addBankAccount,
  Bank,
  BankAccountInfo,
  fetchBanks,
  getAllCardByCustomerId,
} from "@/api/cardApi";
import {
  showErrorMessage,
  showSuccessMessage,
} from "@/components/FlashMessageHelpers";
import { RootState } from "@/redux/store";
import { AntDesign } from "@expo/vector-icons";
import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Modal,
  FlatList,
  Image,
  Dimensions,
} from "react-native";
import { useSelector } from "react-redux";

// Định nghĩa kiểu cho thông tin ngân hàng

// Định nghĩa kiểu cho thông tin tài khoản ngân hàng

export const AddBankAccountScreen = () => {
  // State quản lý thông tin tài khoản
  const [bankAccount, setBankAccount] = useState<BankAccountInfo>({
    bankName: "",
    bankAccountHolder: "",
    bankCode: "",
    customerId: 0,
  });

  // State quản lý danh sách ngân hàng
  const [banks, setBanks] = useState<Bank[]>([]);
  const [filteredBanks, setFilteredBanks] = useState<Bank[]>([]);
  const [bankModalVisible, setBankModalVisible] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const cusid = useSelector(
    (state: RootState) => state.auth.userResponse?.customerDTO.id
  );

  // State quản lý danh sách tài khoản ngân hàng
  const [existingBankAccounts, setExistingBankAccounts] = useState<
    BankAccountInfo[]
  >([]);
  const [isLoading, setIsLoading] = useState(true);

  // Lấy chiều cao màn hình
  const screenHeight = Dimensions.get("window").height;

  // Fetch danh sách ngân hàng và tài khoản ngân hàng
  useEffect(() => {
    fetchBanks().then((data) => {
      setBanks(data);
      setFilteredBanks(data);
    });
    getAllCardByCustomerId(cusid || 0).then((data) => {
      setExistingBankAccounts(data);
      setIsLoading(false);
    });
  }, []);

  // Hàm xử lý tìm kiếm ngân hàng
  const handleSearchBank = (text: string) => {
    setSearchQuery(text);
    const filtered = banks.filter(
      (bank) =>
        bank.name.toLowerCase().includes(text.toLowerCase()) ||
        bank.shortName.toLowerCase().includes(text.toLowerCase()) ||
        bank.code.toLowerCase().includes(text.toLowerCase())
    );
    setFilteredBanks(filtered);
  };

  // Hàm chọn ngân hàng
  const selectBank = (bank: Bank) => {
    setBankAccount((prev) => ({
      ...prev,
      bankName: bank.name,
    }));
    setBankModalVisible(false);
  };

  // Render item ngân hàng
  const renderBankItem = ({ item }: { item: Bank }) => (
    <TouchableOpacity
      onPress={() => selectBank(item)}
      className="flex-row items-center p-3 border-b border-gray-200">
      <Image
        source={{ uri: item.logo }}
        className="object-fill w-20 h-10 mr-3 rounded"
      />
      <View>
        <Text className="font-bold text-black">{item.name}</Text>
        <Text className="text-gray-500">
          {item.shortName} - {item.code}
        </Text>
      </View>
    </TouchableOpacity>
  );

  // Xử lý thêm tài khoản
  const handleAddBankAccount = async () => {
    // Validate dữ liệu
    if (
      bankAccount.bankName.trim() !== "" &&
      bankAccount.bankAccountHolder.trim() !== "" &&
      bankAccount.bankCode.trim() !== ""
    ) {
      try {
        console.log("Thêm tài khoản ngân hàng:", bankAccount);
        const addBank = addBankAccount({
          ...bankAccount,
          customerId: cusid || 0,
        }).then((data) => {
          if (data?.isSuccess) {
            showSuccessMessage("Thêm tài khoản ngân hàng thành công.");
            setExistingBankAccounts((prev) => [...prev, bankAccount]);
          } else {
            showErrorMessage("Thêm tài khoản ngân hàng thất bại.");
          }
        });

        // Reset form
        setBankAccount({
          bankName: "",
          bankAccountHolder: "",
          bankCode: "",
          customerId: 0,
        });
      } catch (error) {
        console.error("Lỗi thêm tài khoản ngân hàng:", error);
      }
    } else {
      console.log("Vui lòng điền đầy đủ thông tin tài khoản");
    }
  };

  // Render danh sách tài khoản ngân hàng
  const renderBankAccountList = () => (
    <ScrollView className="flex-1 bg-white">
      <View className="p-4">
        <Text className="mb-4 text-xl font-bold text-black">
          Tài khoản ngân hàng của bạn
        </Text>
        {existingBankAccounts.map((account, index) => (
          <View key={index} className="p-4 mb-4 bg-gray-100 rounded-lg">
            <Text className="font-bold text-black">{account.bankName}</Text>
            <Text className="text-gray-700">
              Chủ tài khoản: {account.bankAccountHolder}
            </Text>
            <Text className="text-gray-700">
              Số tài khoản: {account.bankCode}
            </Text>
          </View>
        ))}
      </View>
    </ScrollView>
  );

  // Render form thêm tài khoản
  const renderAddBankAccountForm = () => (
    <ScrollView className="flex-1 bg-white">
      <View className="p-4">
        <View className="flex-row items-center mb-6">
          <Text className="text-xl font-bold text-black">
            Thêm tài khoản ngân hàng
          </Text>
        </View>

        {/* Biểu mẫu thêm tài khoản */}
        <View className="p-4 bg-gray-100 rounded-lg">
          {/* Chọn ngân hàng */}
          <View className="mb-4">
            <Text className="mb-2 text-gray-700">Ngân hàng</Text>
            <TouchableOpacity
              onPress={() => setBankModalVisible(true)}
              className="flex-row items-center px-3 py-2 bg-white border border-gray-300 rounded-lg">
              <Text className="flex-1 text-black">
                {bankAccount.bankName || "Chọn ngân hàng"}
              </Text>
            </TouchableOpacity>
          </View>

          {/* Tên chủ tài khoản */}
          <View className="mb-4">
            <Text className="mb-2 text-gray-700">Tên chủ tài khoản</Text>
            <TextInput
              returnKeyType="done"
              placeholder="Nhập tên chủ tài khoản"
              value={bankAccount.bankAccountHolder}
              onChangeText={(text) =>
                setBankAccount((prev) => ({
                  ...prev,
                  bankAccountHolder: text,
                }))
              }
              className="px-3 py-2 text-black bg-white border border-gray-300 rounded-lg"
            />
          </View>

          {/* ID Khách hàng */}
          <View className="mb-4">
            <Text className="mb-2 text-gray-700">Số tài khoản</Text>
            <TextInput
              returnKeyType="done"
              placeholder="Số tài khoản"
              value={
                bankAccount.bankCode ? bankAccount.bankCode.toString() : ""
              }
              onChangeText={(text) =>
                setBankAccount((prev) => ({
                  ...prev,
                  bankCode: text.replace(/[^0-9]/g, ""),
                }))
              }
              keyboardType="numeric"
              className="px-3 py-2 text-black bg-white border border-gray-300 rounded-lg"
            />
          </View>
        </View>

        {/* Nút thêm tài khoản */}
        <TouchableOpacity
          onPress={handleAddBankAccount}
          className="items-center py-3 mt-6 bg-blue-500 rounded-lg">
          <Text className="text-base font-bold text-white">Thêm tài khoản</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );

  // Render loading
  if (isLoading) {
    return (
      <View className="items-center justify-center flex-1">
        <Text>Đang tải...</Text>
      </View>
    );
  }

  return (
    <>
      {/* Hiển thị danh sách tài khoản nếu có, nếu không hiển thị form thêm */}
      {existingBankAccounts.length > 0
        ? renderBankAccountList()
        : renderAddBankAccountForm()}

      {/* Modal chọn ngân hàng */}
      <Modal
        visible={bankModalVisible}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setBankModalVisible(false)}>
        <View
          className="justify-end flex-1"
          style={{ backgroundColor: "rgba(0,0,0,0.5)" }}>
          <View
            className="bg-white rounded-t-2xl"
            style={{
              height: screenHeight * 0.8,
              paddingBottom: 20,
            }}>
            <View className="flex-row items-center justify-between p-4 border-b border-gray-200">
              <Text className="text-lg font-bold text-black">
                Chọn ngân hàng
              </Text>
              <TouchableOpacity onPress={() => setBankModalVisible(false)}>
                <AntDesign name="closecircle" size={24} color="black" />
              </TouchableOpacity>
            </View>

            {/* Thanh tìm kiếm */}
            <View className="p-4">
              <View className="flex-row items-center px-3 bg-gray-100 rounded-lg">
                <AntDesign name="search1" size={24} color="black" />
                <TextInput
                  placeholder="Tìm kiếm ngân hàng"
                  value={searchQuery}
                  onChangeText={handleSearchBank}
                  className="flex-1 py-2 text-black"
                  returnKeyType="done"
                />
              </View>
            </View>

            {/* Danh sách ngân hàng */}
            <FlatList
              data={filteredBanks}
              renderItem={renderBankItem}
              keyExtractor={(item) => item.id.toString()}
              ListEmptyComponent={
                <View className="items-center justify-center p-4">
                  <Text className="text-gray-500">
                    Không tìm thấy ngân hàng
                  </Text>
                </View>
              }
            />
          </View>
        </View>
      </Modal>
    </>
  );
};

export default AddBankAccountScreen;
