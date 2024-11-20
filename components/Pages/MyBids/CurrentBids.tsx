import React, { useEffect, useState } from "react";
import { ActivityIndicator, ScrollView, Text, View } from "react-native";
import ItemCurrentBids from "./ItemCurrentBids";
import { getBidsOfCustomer, getPastBidOfCustomer } from "@/api/bidApi";
import { DataCurentBidResponse } from "@/app/types/bid_type";
import { TouchableOpacity } from "react-native";

interface CurrentBidsProps {
  customerId: number; // ID của khách hàng, có thể truyền qua props hoặc lấy từ context
}

const CurrentBids: React.FC<CurrentBidsProps> = ({ customerId }) => {
  const [bidsData, setBidsData] = useState<DataCurentBidResponse[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(10); // Quản lý số item mỗi lần tải
  const [hasMore, setHasMore] = useState<boolean>(true); // Trạng thái còn dữ liệu để tải

  const fetchCurrentBids = async (
    currentPage: number,
    currentPageSize: number
  ) => {
    try {
      setLoading(true);
      const status = 1; // Giả sử status=1 tương ứng với "Current Bids"
      const response = await getBidsOfCustomer(
        customerId,
        status,
        currentPage,
        currentPageSize
      );

      if (response && response.data) {
        const newBids = response.data.dataResponse;

        // Thêm dữ liệu mới vào danh sách hiện tại và sắp xếp theo thời gian kết thúc
        setBidsData((prevData) =>
          [...prevData, ...newBids].sort((a, b) => {
            const timeA = new Date(a.lotDTO.endTime).getTime();
            const timeB = new Date(b.lotDTO.endTime).getTime();
            return timeB - timeA; // Giảm dần (thay đổi theo yêu cầu)
          })
        );

        // Cập nhật trạng thái hasMore
        setHasMore(newBids.length === currentPageSize); // Nếu dữ liệu ít hơn `pageSize`, coi như hết
      }
    } catch (err) {
      setError("Không thể tải danh sách đấu giá hiện tại.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCurrentBids(page, pageSize);
  }, [page, pageSize]);

  if (loading && bidsData.length === 0) {
    return (
      <View className="items-center justify-center flex-1 h-full">
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
        <Text style={{ textAlign: "center" }}>Không có đấu giá hiện tại.</Text>
      </View>
    );
  }

  return (
    <View style={{ flex: 1 }}>
      <ScrollView contentContainerStyle={{ flexGrow: 1, paddingBottom: 20 }}>
        {bidsData.map((item, index) => {
          const now = new Date().getTime();
          const startTime = new Date(item.lotDTO.startTime).getTime();
          const endTime = new Date(item.lotDTO.endTime).getTime();

          return (
            <ItemCurrentBids
              key={`${item.id}-${index}`}
              id={item.lotId}
              isLive={now >= startTime && now <= endTime} // Check if the current time is between startTime and endTime
              title={item.lotDTO.title}
              minPrice={item.lotDTO.startPrice || 0}
              maxPrice={item.lotDTO.endPrice || 0} // chưa có trong api
              image={item.lotDTO.imageLinkJewelry}
              status={item.lotDTO.status}
              lotNumber={`Lot #${item.lotId}`} // Hoặc lấy từ dữ liệu API nếu có
              typeBid={item.lotDTO.lotType} // Điều chỉnh theo dữ liệu thực
              price={item.lotDTO.buyNowPrice || 0}
              timeLeft={calculateTimeLeft(
                item.lotDTO.startTime,
                item.lotDTO.endTime
              )} // Hàm tính thời gian còn lại
              endTime={item.lotDTO.endTime} // Chuyển đổi thời gian kết thúc
              startTime={item.lotDTO.startTime} // Chuyển đổi thời gian kết thúc
              itemBid={item}
            />
          );
        })}
      </ScrollView>
      {hasMore && !loading && (
        <TouchableOpacity
          onPress={() => setPage((prevPage) => prevPage + 1)}
          style={{
            padding: 10,
            backgroundColor: "#007bff",
            borderRadius: 5,
            margin: 10,
            alignSelf: "center",
            width: "90%",
          }}>
          <Text style={{ color: "#fff", textAlign: "center" }}>Load More</Text>
        </TouchableOpacity>
      )}
      {loading && (
        <View style={{ padding: 16 }}>
          <ActivityIndicator size="small" color="#0000ff" />
        </View>
      )}
    </View>
  );
};

const calculateTimeLeft = (
  startTime: string | null,
  endTime: string
): string => {
  const now = new Date().getTime();
  const start = startTime ? new Date(startTime).getTime() : null;
  const end = new Date(endTime).getTime();

  if (start && now < start) {
    // Status: upcoming
    const difference = start - now;
    const hours = Math.floor(difference / (1000 * 60 * 60));
    const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((difference % (1000 * 60)) / 1000);
    return ` ${hours}h ${minutes}m ${seconds}s`;
  } else if (start && end && now >= start && now <= end) {
    // Status: living
    const difference = end - now;
    const hours = Math.floor(difference / (1000 * 60 * 60));
    const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((difference % (1000 * 60)) / 1000);
    return `${hours}h ${minutes}m ${seconds}s`;
  } else {
    // Status: ended
    return "Ended";
  }
};

export default CurrentBids;
