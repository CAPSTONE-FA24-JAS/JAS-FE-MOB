import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  ScrollView,
  ActivityIndicator,
  Button,
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
  const [hasMore, setHasMore] = useState<boolean>(true); // Trạng thái còn dữ liệu để tải

  console.log("customerId", customerId);

  const fetchPastBids = async (currentPage: number) => {
    try {
      setLoading(true);
      const status = [2, 3, 4, 5, 6, 7, 8, 9, 10]; // Các trạng thái tương ứng với "Past Bids"
      const response = await getPastBidOfCustomer(
        customerId,
        status,
        currentPage,
        10
      );
      if (response && response.data) {
        const newBids = response.data.dataResponse;

        // Thêm dữ liệu mới vào danh sách hiện tại
        setBidsData((prevData) => [...prevData, ...newBids]);

        // Cập nhật trạng thái hasMore
        setHasMore(newBids.length === 10); // Nếu dữ liệu ít hơn 10, coi như đã hết
      }
    } catch (err) {
      setError("Không thể tải danh sách đấu giá đã kết thúc.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPastBids(page);
  }, [page]);

  if (loading && bidsData.length === 0) {
    return (
      <View>
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
    <View>
      <ScrollView>
        {bidsData.map((item) => (
          <ItemPastBids
            key={item.id}
            id={item.lotId}
            isWin={item.isWinner ? item.isWinner : false} // Điều chỉnh theo logic của bạn
            title={item.lotDTO.title}
            lotNumber={`Lot #${item.lotId}`} // Hoặc lấy từ dữ liệu API nếu có
            // description={item.lotType} // Điều chỉnh theo dữ liệu thực
            soldPrice={
              item.lotDTO.finalPriceSold ? item.lotDTO.finalPriceSold : 0
            }
            statusLot={item.lotDTO.status}
            typeBid={item.lotDTO.lotType} // Điều chỉnh theo dữ liệu thực
            minPrice={item.lotDTO.startPrice || 0}
            maxPrice={item.lotDTO.endPrice || 0} // chưa có trong api
            image={item.lotDTO.imageLinkJewelry}
            endTime={item.lotDTO.endTime} // Chuyển đổi thời gian kết thúc
            startTime={item.lotDTO.startTime} // Chuyển đổi thời gian kết thúc
            yourMaxBid={item.yourMaxBidPrice ?? 0}
            itemBid={item}
          />
        ))}
      </ScrollView>
      {hasMore && !loading && (
        <Button
          title="Load More"
          onPress={() => setPage((prevPage) => prevPage + 1)}
        />
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
