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
  dataResponseConsignList,
  HistoryConsignmentResponse,
} from "../types/consign_type";
import { getHistoryConsign } from "@/api/consignAnItemApi";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import { StackNavigationProp } from "@react-navigation/stack";

// Define the types for navigation routes
type RootStackParamList = {
  ConsignDetailTimeLine: { item: dataResponseConsignList }; // Định nghĩa rằng ConsignDetailTimeLine nhận một đối tượng item kiểu ConsignResponse
};

const HistoryItemConsign: React.FC = () => {
  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();
  const [items, setItems] = useState<dataResponseConsignList[]>([]); // Dữ liệu từ API
  const [loading, setLoading] = useState(true); // Trạng thái loading
  const [selectedStatus, setSelectedStatus] = useState<number | null>(null); // Bộ lọc trạng thái
  const [searchQuery, setSearchQuery] = useState(""); // Dữ liệu tìm kiếm
  const sellerId = useSelector(
    (state: RootState) => state.auth.userResponse?.customerDTO.id
  ); // Lấy userId từ Redux

  // console.log("itemsAPI", items);

  // Hàm gọi API
  const fetchConsignmentHistory = useCallback(async () => {
    try {
      setLoading(true);
      if (sellerId !== undefined) {
        const response = await getHistoryConsign(
          sellerId,
          selectedStatus !== null ? selectedStatus : undefined
          // pageSize
          // pageIndex
        );
        // console.log("responsegetHistoryConsign", response);

        setItems(
          Array.isArray(response.dataResponse) ? response.dataResponse : []
        );
      } else {
        console.error("Seller ID is undefined");
      }
    } catch (error) {
      console.error("Lỗi khi lấy lịch sử ký gửi:", error);
    } finally {
      setLoading(false);
    }
  }, [sellerId, selectedStatus]);

  // Gọi API khi selectedStatus thay đổi
  useEffect(() => {
    fetchConsignmentHistory();
  }, [fetchConsignmentHistory]);

  // Hàm xử lý tìm kiếm
  const searchedItems = items?.filter((item) =>
    item.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Nếu đang loading, hiển thị vòng xoay
  if (loading) {
    return (
      <View className="items-center justify-center flex-1">
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  const statusTextMap = [
    "Requested",
    "Assigned",
    "RequestedPreliminary",
    "Preliminary",
    "ApprovedPreliminary",
    "Received Jewelry",
    "Final Valuated",
    "Manager Approved",
    "Authorized",
    "Rejected Preliminary",
  ];

  return (
    <View className="flex-1 bg-gray-100">
      <View className="relative px-4 py-2">
        <ScrollView
          horizontal={true}
          showsHorizontalScrollIndicator={false}
          className="mb-4">
          <View className="flex-row items-center">
            <TouchableOpacity
              className={`px-4 py-2 mr-2 ${
                selectedStatus === null ? "bg-gray-800" : "bg-gray-400"
              } rounded`}
              onPress={() => setSelectedStatus(null)}>
              <Text className="font-bold text-white uppercase">ALL</Text>
            </TouchableOpacity>

            {[...Array(10).keys()].map((status) => (
              <TouchableOpacity
                key={status}
                className={`px-4 py-2 mr-2 ${
                  selectedStatus === status ? "bg-yellow-500" : "bg-gray-400"
                } rounded`}
                onPress={() => setSelectedStatus(status)}>
                <Text className="font-bold text-white uppercase">
                  {statusTextMap[status]}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </ScrollView>

        <TextInput
          className="p-2 mb-4 bg-white rounded"
          placeholder="Search..."
          onChangeText={(text) => setSearchQuery(text)}
          value={searchQuery}
        />
        {searchedItems && searchedItems.length === 0 ? (
          <Text className="text-lg text-center">Không có ký gửi nào</Text>
        ) : (
          <FlatList
            className="h-[70vh]"
            data={searchedItems} // Hiển thị searchedItems
            renderItem={({ item }) => (
              <ConsignItem
                id={item.id}
                name={item.name}
                price={item.pricingTime ? item.pricingTime : 0}
                status={item.status as ConsignItemProps["status"]}
                date={item.creationDate}
                onViewDetails={() =>
                  navigation.navigate("ConsignDetailTimeLine", {
                    item,
                  })
                }
                image={item.imageValuations[0]?.imageLink || ""}
              />
            )}
            keyExtractor={(item) => item.id.toString()}
          />
        )}

        {items.length > 10 && (
          <TouchableOpacity className="w-full p-3 mt-4 bg-gray-800 rounded">
            <Text className="text-center text-white">XEM THÊM</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

export default HistoryItemConsign;
