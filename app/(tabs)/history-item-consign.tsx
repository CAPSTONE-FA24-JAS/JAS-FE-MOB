import { getHistoryConsign } from "@/api/consignAnItemApi";
import ConsignItem, { ConsignItemProps } from "@/components/ConsignItem";
import { RootState } from "@/redux/store";
import { RouteProp, useRoute } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { useFocusEffect, useNavigation } from "expo-router";
import React, { useCallback, useEffect, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  RefreshControl,
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
  "Rejected",
];

const HistoryItemConsign: React.FC = () => {
  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();
  const [items, setItems] = useState<dataResponseConsignList[]>([]); // Dữ liệu từ API
  const [loading, setLoading] = useState(true); // Trạng thái loading
  const [selectedStatus, setSelectedStatus] = useState<number | null>(null); // Bộ lọc trạng thái
  const [searchQuery, setSearchQuery] = useState(""); // Dữ liệu tìm kiếm
  const [noConsignmentMessage, setNoConsignmentMessage] = useState(""); // Dữ liệu tìm kiếm
  const [page, setPage] = useState(1); // Trang hiện tại
  const [pageSize] = useState(10); // Số mục mỗi trang
  const [hasMore, setHasMore] = useState(true); // Trạng thái còn dữ liệu
  const [isFetching, setIsFetching] = useState(false);

  const [refreshing, setRefreshing] = useState(false); // Thêm state cho làm mới

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
    } else if (tab === undefined) {
      setSelectedStatus(null); // Nếu không có tab, mặc định là ALL
    } else {
      setSelectedStatus(tab); // Nếu có tab, sử dụng giá trị tab
    }
  }, [tab]);

  // Hàm làm mới dữ liệu
  const handleRefresh = async () => {
    setRefreshing(true); // Bắt đầu trạng thái làm mới
    setPage(1); // Reset trang về đầu
    setItems([]); // Xóa danh sách cũ
    await fetchConsignmentHistory(); // Gọi API để lấy dữ liệu mới
    setRefreshing(false); // Kết thúc trạng thái làm mới
  };

  // const scrollViewRef = useRef<ScrollView>(null);

  // Hàm gọi API
  const fetchConsignmentHistory = useCallback(async () => {
    if (isFetching) return; // Nếu đang tải, không thực hiện thêm
    setIsFetching(true); // Đặt trạng thái đang tải

    try {
      setLoading(true);

      if (sellerId !== undefined) {
        const response = await getHistoryConsign(
          sellerId,
          pageSize,
          page,
          tab ? tab : selectedStatus !== null ? selectedStatus : undefined
        );

        if (response?.dataResponse) {
          setItems(
            (prevItems) =>
              page === 1
                ? response.dataResponse // Nếu là trang đầu, thay thế danh sách
                : [...prevItems, ...response.dataResponse] // Nếu không, nối dữ liệu mới
          );
          setHasMore(response.dataResponse.length === pageSize); // Kiểm tra còn dữ liệu không
        } else {
          setHasMore(false);
        }
      } else {
        console.error("Seller ID is undefined");
      }
    } catch (error) {
      console.error("Lỗi khi lấy lịch sử ký gửi:", error);
    } finally {
      setIsFetching(false);
      setLoading(false);
    }
  }, [sellerId, selectedStatus, page, pageSize, isFetching]);

  // Gọi API khi selectedStatus thay đổi
  // useEffect(
  //   useCallback(() => {
  //     fetchConsignmentHistory();
  //   }, [fetchConsignmentHistory]),
  //   [fetchConsignmentHistory]
  // );

  useEffect(() => {
    setPage(1); // Reset về trang đầu tiên
    setItems([]); // Xóa danh sách cũ
    fetchConsignmentHistory(); // Gọi API để cập nhật danh sách theo trạng thái mới
  }, [selectedStatus]);

  useFocusEffect(
    useCallback(() => {
      fetchConsignmentHistory();
    }, [page, selectedStatus])
  );

  // Hàm xử lý tìm kiếm
  const searchedItems = items?.filter((item) =>
    item.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleLoadMore = () => {
    if (!isFetching && hasMore) {
      setPage((prevPage) => prevPage + 1);
    }
  };

  // const statusTextMap = [
  //   "Requested",
  //   "Assigned",
  //   // "Requested Preliminary", // ẩn
  //   "Preliminary",
  //   "Approved Preliminary",
  //   "Recived Jewelry", // hiện biên bản xác nhận
  //   // "Evaluated", // ẩn
  //   "Manager Approved",
  //   "Authorized", // cho coi giấy uỷ quyền
  //   "Rejected",
  // ];
  // Corresponding status indices to match statusTextMap
  const statusIndices = [0, 1, 3, 4, 5, 7, 8, 9];

  return (
    <View className="flex-1 bg-gray-100">
      <View className="relative px-4 py-2">
        <ScrollView
          horizontal={true}
          showsHorizontalScrollIndicator={false}
          className={`mb-4 ${
            (searchedItems && searchedItems.length === 0 && !loading) ||
            noConsignmentMessage
              ? null
              : "h-[150px]"
          } `}>
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

        <View>
          <TextInput
            className="p-2 mb-4 bg-white rounded"
            placeholder="Search..."
            onChangeText={(text) => setSearchQuery(text)}
            value={searchQuery}
            returnKeyType="done"
          />
          {searchedItems && searchedItems.length > 0 && (
            <Text className="mb-2 text-base font-semibold">
              Total: {searchedItems.length} items
            </Text>
          )}
          {loading && (
            <View style={{ padding: 10 }}>
              <ActivityIndicator size={26} color="#0000ff" />
            </View>
          )}
          {(searchedItems && searchedItems.length === 0 && !loading) ||
          noConsignmentMessage ? (
            <Text className="text-lg text-center">Dont have any consign</Text>
          ) : (
            <View className="h-[85%]">
              <FlatList
                data={searchedItems} // Hiển thị searchedItems
                renderItem={({ item, index }) => (
                  <ConsignItem
                    id={item.id}
                    index={index}
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
                refreshControl={
                  <RefreshControl
                    refreshing={refreshing}
                    onRefresh={handleRefresh} // Kéo để làm mới
                  />
                }
              />
              {hasMore && !loading && (
                <View
                  style={{
                    flexDirection: "row",
                    justifyContent: "space-between",
                  }}
                  className="bottom-0 w-full ">
                  <TouchableOpacity
                    onPress={handleLoadMore}
                    style={{
                      padding: 10,
                      backgroundColor: "#007bff",
                      borderRadius: 5,
                      margin: 10,
                      width: "100%",
                    }}
                    className="mx-auto">
                    <Text style={{ color: "#fff", textAlign: "center" }}>
                      Load More
                    </Text>
                  </TouchableOpacity>
                </View>
              )}
            </View>
          )}

          {/* {items.length > 10 && (
              <TouchableOpacity className="w-full p-3 mt-4 bg-gray-800 rounded">
                <Text className="text-center text-white">XEM THÊM</Text>
              </TouchableOpacity>
            )} */}
        </View>
      </View>
    </View>
  );
};

export default HistoryItemConsign;
