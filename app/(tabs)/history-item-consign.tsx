import React, { useCallback, useEffect, useRef, useState } from "react";
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
import LoadingOverlay from "@/components/LoadingOverlay";

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
  const [noConsignmentMessage, setNoConsignmentMessage] = useState(""); // Dữ liệu tìm kiếm
  const sellerId = useSelector(
    (state: RootState) => state.auth.userResponse?.customerDTO.id
  ); // Lấy userId từ Redux

  // const scrollViewRef = useRef<ScrollView>(null);

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

        if (response === null) {
          // Khi response là null, nghĩa là không có dữ liệu
          setNoConsignmentMessage(
            "Không có Consign item nào ở trạng thái này."
          );
          setItems([]); // Set items là một mảng rỗng
        } else {
          // Nếu có dữ liệu
          setNoConsignmentMessage(""); // Xóa thông báo không có dữ liệu
          setItems(
            Array.isArray(response.dataResponse) ? response.dataResponse : []
          );
        }
      } else {
        console.error("Seller ID is undefined");
      }
    } catch (error) {
      console.error("Lỗi khi lấy lịch sử ký gửi:", error);
      setNoConsignmentMessage("Đã xảy ra lỗi khi lấy lịch sử ký gửi.");
    } finally {
      setLoading(false);
    }
  }, [sellerId, selectedStatus]);

  // Gọi API khi selectedStatus thay đổi
  useFocusEffect(
    useCallback(() => {
      fetchConsignmentHistory();
    }, [fetchConsignmentHistory])
  );

  // Hàm xử lý tìm kiếm
  const searchedItems = items?.filter((item) =>
    item.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const statusTextMap = [
    "Requested",
    "Assigned",
    "Requested Preliminary",
    "Preliminary",
    "Approved Preliminary",
    "Recived Jewelry",
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
          className="mb-4"
        >
          <View className="flex-row items-center">
            <TouchableOpacity
              className={`px-4 py-2 mr-2 ${
                selectedStatus === null ? "bg-gray-800" : "bg-gray-400"
              } rounded`}
              onPress={() => setSelectedStatus(null)}
            >
              <Text className="font-bold text-white uppercase">ALL</Text>
            </TouchableOpacity>

            {[...Array(10).keys()].map((status, index) => (
              <TouchableOpacity
                key={status}
                className={`px-4 py-2 mr-2 ${
                  selectedStatus === status ? "bg-yellow-500" : "bg-gray-400"
                } rounded`}
                onPress={() => setSelectedStatus(status)}
              >
                <Text className="font-bold text-white uppercase">
                  {index + 1}. {statusTextMap[status]}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </ScrollView>
        {loading ? (
          <LoadingOverlay visible={loading} />
        ) : (
          <View>
            <TextInput
              className="p-2 mb-4 bg-white rounded"
              placeholder="Search..."
              onChangeText={(text) => setSearchQuery(text)}
              value={searchQuery}
            />
            {(searchedItems && searchedItems.length === 0) ||
            noConsignmentMessage ? (
              <Text className="text-lg text-center">Không có ký gửi nào</Text>
            ) : (
              <FlatList
                className="h-[70vh]"
                data={searchedItems} // Hiển thị searchedItems
                renderItem={({ item }) => (
                  <ConsignItem
                    id={item.id}
                    name={item.name}
                    minPrice={item.estimatePriceMin ? item.estimatePriceMin : 0}
                    maxPrice={item.estimatePriceMax ? item.estimatePriceMax : 0}
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
        )}
      </View>
    </View>
  );
};

export default HistoryItemConsign;
