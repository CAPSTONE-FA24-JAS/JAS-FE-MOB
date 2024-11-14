import React, { useEffect, useState } from "react";
import { ActivityIndicator, ScrollView, Text, View } from "react-native";
import ItemCurrentBids from "./ItemCurrentBids";
import { getBidsOfCustomer, getPastBidOfCustomer } from "@/api/bidApi";
import { DataCurentBidResponse } from "@/app/types/bid_type";

interface CurrentBidsProps {
  customerId: number; // ID của khách hàng, có thể truyền qua props hoặc lấy từ context
}

const CurrentBids: React.FC<CurrentBidsProps> = ({ customerId }) => {
  const [bidsData, setBidsData] = useState<DataCurentBidResponse[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCurrentBids = async () => {
      try {
        const status = [1]; // Giả sử status=1 tương ứng với "Current Bids"
        const response = await getPastBidOfCustomer(customerId, status, 1, 10);

        // const response = await getBidsOfCustomer(customerId, status, 1, 10);
        if (response && response.data) {
          setBidsData(response.data.dataResponse);
        }
      } catch (err) {
        setError("Không thể tải danh sách đấu giá hiện tại.");
      } finally {
        setLoading(false);
      }
    };

    fetchCurrentBids();
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
        <Text style={{ textAlign: "center" }}>Không có đấu giá hiện tại.</Text>
      </View>
    );
  }

  return (
    <ScrollView>
      {bidsData.map((item) => {
        const now = new Date().getTime();
        const startTime = new Date(item.lotDTO.startTime).getTime();
        const endTime = new Date(item.lotDTO.endTime).getTime();

        return (
          <ItemCurrentBids
            key={item.id}
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
