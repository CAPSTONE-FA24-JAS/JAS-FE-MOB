import { getHistoryConsign } from "@/api/consignAnItemApi";
import ConsignItem, { ConsignItemProps } from "@/components/ConsignItem";
import { RootState } from "@/redux/store";
import { RouteProp, useFocusEffect, useRoute } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { useNavigation } from "expo-router";
import React, { useCallback, useEffect, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { useSelector } from "react-redux";
import { dataResponseConsignList } from "../types/consign_type";

// Define the types for navigation routes
type RootStackParamList = {
  ConsignDetailTimeLine: { item: dataResponseConsignList }; // Định nghĩa rằng ConsignDetailTimeLine nhận một đối tượng item kiểu ConsignResponse
};

// Mapping of the status to display
const statusTextMap = [
  "Requested",
  "Assigned",
  "Preliminary",
  "Approved Preliminary",
  "Received Jewelry",
  "Manager Approved",
  "Authorized",
  "Rejected Preliminary",
];

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
  type RouteParams = {
    params: {
      tab?: number;
    };
  };

  console.log("selectedStatus", selectedStatus);

  const route = useRoute<RouteProp<RouteParams, "params">>();

  const tab = route.params?.tab; // Lấy giá trị của tab từ tham số điều hướng

  // Thiết lập tab dựa vào tham số 'tab' trong route
  useEffect(() => {
    if (tab === 3) {
      setSelectedStatus(3); // Nếu tab là "past", chọn tab Past
    } else {
      setSelectedStatus(0); // Mặc định mở tab Current
    }
  }, [tab]);
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
  useEffect(
    useCallback(() => {
      fetchConsignmentHistory();
    }, [fetchConsignmentHistory]),
    [fetchConsignmentHistory]
  );

  // Hàm xử lý tìm kiếm
  const searchedItems = items?.filter((item) =>
    item.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // const statusTextMap = [
  //   "Requested",
  //   "Assigned",
  //   // "Requested Preliminary", // ẩn
  //   "Preliminary",
  //   "Approved Preliminary",
  //   "Recived Jewelry", // hiện biên bản xác nhận
  //   // "Final Valuated", // ẩn
  //   "Manager Approved",
  //   "Authorized", // cho coi giấy uỷ quyền
  //   "Rejected Preliminary",
  // ];
  // Corresponding status indices to match statusTextMap
  const statusIndices = [0, 1, 3, 4, 5, 7, 8, 9];

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
                selectedStatus === null ? "bg-yellow-500" : "bg-gray-400"
              } rounded`}
              onPress={() => setSelectedStatus(null)}>
              <Text className="font-bold text-white uppercase">ALL</Text>
            </TouchableOpacity>

            {statusIndices.map((status, index) => (
              <TouchableOpacity
                key={status}
                className={`px-4 py-2 mr-2 ${
                  selectedStatus === status ? "bg-yellow-500" : "bg-gray-400"
                } rounded`}
                onPress={() => setSelectedStatus(status)}>
                <Text className="font-bold text-white uppercase">
                  {index + 1}. {statusTextMap[index]}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </ScrollView>
        {loading ? (
          <View className="items-center justify-center flex-1 py-20">
            <ActivityIndicator size="large" color="#0000ff" />
          </View>
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
                className="h-[85%]"
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

            {/* {items.length > 10 && (
              <TouchableOpacity className="w-full p-3 mt-4 bg-gray-800 rounded">
                <Text className="text-center text-white">XEM THÊM</Text>
              </TouchableOpacity>
            )} */}
          </View>
        )}
      </View>
    </View>
  );
};

export default HistoryItemConsign;
