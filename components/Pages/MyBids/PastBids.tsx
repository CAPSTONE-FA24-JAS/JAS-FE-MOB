import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  ScrollView,
  ActivityIndicator,
  Button,
  Touchable,
  TouchableOpacity,
} from "react-native";
import ItemPastBids from "./ItemPastBids";
import { getPastBidOfCustomer } from "@/api/bidApi";
import { DataCurentBidResponse } from "@/app/types/bid_type";
interface PastBidsProps {
  customerId: number; // ID của khách hàng, có thể truyền qua props hoặc lấy từ context
}

const PastBids: React.FC<PastBidsProps> = ({ customerId }) => {
  const [bidsData, setBidsData] = useState<DataCurentBidResponse[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(10); // Quản lý số item mỗi lần tải
  const [hasMore, setHasMore] = useState<boolean>(true); // Trạng thái còn dữ liệu để tải

  console.log("customerId", customerId);

  const fetchPastBids = async (
    currentPage: number,
    currentPageSize: number
  ) => {
    try {
      setLoading(true);
      const status = [2, 3, 4, 5, 6, 7, 8, 9, 10];
      const response = await getPastBidOfCustomer(
        customerId,
        status,
        currentPage,
        currentPageSize
      );
      if (response && response.data) {
        const newBids = response.data.dataResponse;

        // Thêm dữ liệu mới vào danh sách hiện tại
        setBidsData((prevData) =>
          [...prevData, ...newBids].sort((a, b) => {
            const timeA = new Date(a.lotDTO.endTime).getTime();
            const timeB = new Date(b.lotDTO.endTime).getTime();
            return timeB - timeA; // Sắp xếp tăng dần, dùng `timeB - timeA` nếu muốn giảm dần
          })
        );

        // Cập nhật trạng thái hasMore
        setHasMore(newBids.length === currentPageSize); // Nếu dữ liệu ít hơn `pageSize`, coi như hết
      }
    } catch (err) {
      setError("Không thể tải danh sách đấu giá đã kết thúc.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPastBids(page, pageSize);
  }, [page, pageSize]);

  if (loading && bidsData.length === 0) {
    return (
      <View className="items-center justify-center flex-1">
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  if (error) {
    return (
      <View style={{ padding: 16 }}>
        <Text style={{ color: "red", textAlign: "center" }}>{error}</Text>
      </View>
    );
  }

  if (bidsData.length === 0) {
    return (
      <View style={{ padding: 16 }}>
        <Text style={{ textAlign: "center" }}>
          Không có đấu giá đã kết thúc.
        </Text>
      </View>
    );
  }

  return (
    <View className="flex-1">
      <ScrollView contentContainerStyle={{ flexGrow: 1, paddingBottom: 20 }}>
        {bidsData.map((item, index) => (
          <ItemPastBids
            key={`${item.id}-${index}`}
            id={item.lotId}
            isWin={item.isWinner || false}
            title={item.lotDTO.title}
            lotNumber={`Lot #${item.lotId}`}
            soldPrice={item.lotDTO.finalPriceSold || 0}
            statusLot={item.lotDTO.status}
            typeBid={item.lotDTO.lotType}
            minPrice={item.lotDTO.startPrice || 0}
            maxPrice={item.lotDTO.endPrice || 0}
            image={item.lotDTO.imageLinkJewelry}
            endTime={item.lotDTO.endTime}
            startTime={item.lotDTO.startTime}
            yourMaxBid={item.yourMaxBidPrice ?? 0}
            itemBid={item}
          />
        ))}
      </ScrollView>
      {hasMore && !loading && (
        <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
          <TouchableOpacity
            onPress={() => setPage((prevPage) => prevPage + 1)}
            style={{
              padding: 10,
              backgroundColor: "#007bff",
              borderRadius: 5,
              margin: 10,
              width: "90%",
            }}
            className="mx-auto">
            <Text style={{ color: "#fff", textAlign: "center" }}>
              Load More
            </Text>
          </TouchableOpacity>
        </View>
      )}
      {loading && (
        <View style={{ padding: 16 }}>
          <ActivityIndicator size="small" color="#0000ff" />
        </View>
      )}
    </View>
  );
};

export default PastBids;
