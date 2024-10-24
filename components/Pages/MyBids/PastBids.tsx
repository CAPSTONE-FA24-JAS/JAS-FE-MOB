import React, { useEffect, useState } from "react";
import { View, Text, ScrollView, ActivityIndicator } from "react-native";
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

  console.log("customerId", customerId);

  useEffect(() => {
    const fetchPastBids = async () => {
      try {
        const status = [2, 3, 4, 5, 6, 7, 8, 9, 10]; // Các trạng thái tương ứng với "Past Bids"
        const response = await getPastBidOfCustomer(customerId, status, 1, 10);
        if (response && response.data) {
          setBidsData(response.data.dataResponse);
        }
      } catch (err) {
        setError("Không thể tải danh sách đấu giá đã kết thúc.");
      } finally {
        setLoading(false);
      }
    };

    fetchPastBids();
  }, [customerId]);

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
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
  );
};

export default PastBids;
