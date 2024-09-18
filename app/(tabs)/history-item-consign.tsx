import React, { useCallback, useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  ScrollView,
} from "react-native";
import ConsignItem, { ConsignItemProps } from "@/components/ConsignItem";
import { router, useFocusEffect, useNavigation } from "expo-router";
import {
  ConsignResponse,
  HistoryConsignmentResponse,
} from "../types/consign_type";
import { getHistoryConsign } from "@/api/consignAnItemApi";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import { StackNavigationProp } from "@react-navigation/stack";

// Define the types for navigation routes
type RootStackParamList = {
  ConsignDetailTimeLine: { item: ConsignResponse }; // Định nghĩa rằng ConsignDetailTimeLine nhận một đối tượng item kiểu ConsignResponse
};

const HistoryItemConsign: React.FC = () => {
  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();
  const [items, setItems] = useState<ConsignResponse[]>([]); // Dữ liệu từ API
  const [loading, setLoading] = useState(true); // Trạng thái loading
  const [selectedStatus, setSelectedStatus] = useState<
    | "ALL"
    | "Preliminary Valued"
    | "Requested"
    | "Product received"
    | "Pending manager approved"
    | "Manager approved"
    | "Member accepted"
    | "Approved"
    | "Rejected"
  >("ALL"); // Bộ lọc trạng thái
  const [searchQuery, setSearchQuery] = useState(""); // Dữ liệu tìm kiếm
  const sellerId = useSelector(
    (state: RootState) => state.auth.userResponse?.id
  ); // Lấy userId từ Redux

  // Hàm gọi API
  const fetchConsignmentHistory = useCallback(async () => {
    try {
      setLoading(true);
      if (sellerId !== undefined) {
        const response: HistoryConsignmentResponse = await getHistoryConsign(
          sellerId
        );
        setItems(response.data.dataResponse); // Lưu dữ liệu vào state
      } else {
        console.error("Seller ID is undefined");
      }
    } catch (error) {
      console.error("Lỗi khi lấy lịch sử ký gửi:", error);
    } finally {
      setLoading(false);
    }
  }, [sellerId]);

  // Re-fetch order details when page is focused
  useFocusEffect(
    useCallback(() => {
      fetchConsignmentHistory();
    }, [fetchConsignmentHistory])
  );

  // Hàm lọc dữ liệu theo trạng thái
  const filteredItems = items.filter((item) => {
    if (selectedStatus === "ALL") return true;
    return item.status === selectedStatus;
  });

  // Hàm xử lý tìm kiếm
  const searchedItems = filteredItems.filter((item) =>
    item.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Nếu đang loading, hiển thị vòng xoay
  if (loading) {
    return (
      <View className="flex-1 justify-center items-center">
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  return (
    <View className="flex-1 bg-gray-100">
      <View className="relative px-4 py-2">
        <ScrollView
          horizontal={true}
          showsHorizontalScrollIndicator={false}
          className="mb-4"
        >
          <View className="flex-row items-center">
            <TouchableOpacity
              className={`px-4 py-2 mr-2  ${
                selectedStatus === "ALL" ? "bg-gray-800" : "bg-gray-400"
              } rounded`}
              onPress={() => setSelectedStatus("ALL")}
            >
              <Text className="text-white font-bold uppercase">ALL</Text>
            </TouchableOpacity>

            <TouchableOpacity
              className={`px-4 py-2 mr-2 ${
                selectedStatus === "Requested" ? "bg-yellow-500" : "bg-gray-400"
              } rounded`}
              onPress={() => setSelectedStatus("Requested")}
            >
              <Text className="text-white font-bold uppercase">Requested</Text>
            </TouchableOpacity>

            <TouchableOpacity
              className={`px-4 py-2 mr-2 ${
                selectedStatus === "Preliminary Valued"
                  ? "bg-yellow-500"
                  : "bg-gray-400"
              } rounded`}
              onPress={() => setSelectedStatus("Preliminary Valued")}
            >
              <Text className="text-white font-bold uppercase">
                Preliminary Valued
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              className={`px-4 py-2 mr-2 ${
                selectedStatus === "Product received"
                  ? "bg-yellow-500"
                  : "bg-gray-400"
              } rounded`}
              onPress={() => setSelectedStatus("Product received")}
            >
              <Text className="text-white font-bold uppercase">
                Product received
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              className={`px-4 py-2 mr-2 ${
                selectedStatus === "Pending manager approved"
                  ? "bg-yellow-500"
                  : "bg-gray-400"
              } rounded`}
              onPress={() => setSelectedStatus("Pending manager approved")}
            >
              <Text className="text-white font-bold uppercase">
                Pending manager approved
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              className={`px-4 py-2 mr-2 ${
                selectedStatus === "Manager approved"
                  ? "bg-yellow-500"
                  : "bg-gray-400"
              } rounded`}
              onPress={() => setSelectedStatus("Manager approved")}
            >
              <Text className="text-white font-bold uppercase">
                Manager approved
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              className={`px-4 py-2 mr-2 ${
                selectedStatus === "Member accepted"
                  ? "bg-yellow-500"
                  : "bg-gray-400"
              } rounded`}
              onPress={() => setSelectedStatus("Member accepted")}
            >
              <Text className="text-white font-bold uppercase">
                Member accepted
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              className={`px-4 py-2 mr-2 ${
                selectedStatus === "Approved" ? "bg-yellow-500" : "bg-gray-400"
              } rounded`}
              onPress={() => setSelectedStatus("Approved")}
            >
              <Text className="text-white font-bold uppercase">Approved</Text>
            </TouchableOpacity>
            <TouchableOpacity
              className={`px-4 py-2 mr-2 ${
                selectedStatus === "Rejected" ? "bg-yellow-500" : "bg-gray-400"
              } rounded`}
              onPress={() => setSelectedStatus("Rejected")}
            >
              <Text className="text-white font-bold uppercase">Rejected</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>

        <TextInput
          className="p-2 mb-4 bg-white rounded"
          placeholder="Search..."
        />
        {/* Danh sách các ký gửi */}
        <FlatList
          className="h-[70vh]"
          data={searchedItems} // Hiển thị danh sách đã lọc và tìm kiếm
          renderItem={({ item }) => (
            <ConsignItem
              id={item.id}
              name={item.name}
              price={item.desiredPrice}
              status={item.status as ConsignItemProps["status"]}
              onViewDetails={() =>
                navigation.navigate("ConsignDetailTimeLine", {
                  item, // Truyền toàn bộ đối tượng item kiểu ConsignResponse
                })
              }
              image={item?.imageValuations[0]?.imageLink || ""}
            />
          )}
          keyExtractor={(item, index) => `${item.id}-${index}`}
        />

        {/* Nút "Xem thêm" */}
        <TouchableOpacity className="w-full p-3 mt-4 bg-gray-800 rounded">
          <Text className="text-center text-white">XEM THÊM</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default HistoryItemConsign;
