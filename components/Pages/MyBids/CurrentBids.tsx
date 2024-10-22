import React, { useEffect, useState } from "react";
import { ActivityIndicator, ScrollView, Text, View } from "react-native";
import ItemCurrentBids from "./ItemCurrentBids";
import { BidItem, getBidsOfCustomer } from "@/api/bidApi";

interface CurrentBidsProps {
  customerId: number; // ID của khách hàng, có thể truyền qua props hoặc lấy từ context
}

const CurrentBids: React.FC<CurrentBidsProps> = ({ customerId }) => {
  const [bidsData, setBidsData] = useState<BidItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCurrentBids = async () => {
      try {
        const status = 1; // Giả sử status=1 tương ứng với "Current Bids"
        const response = await getBidsOfCustomer(customerId, status, 1, 10);
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

  // Dữ liệu giả cho các item với trạng thái live/coming soon
  // const bidsData = [
  //   {
  //     id: 1,
  //     isLive: true,
  //     title: "Fine Jewels",
  //     lotNumber: "Lot #102",
  //     description: "Breitling Colt Chronograph in Steel",
  //     estimate: "US3500 - US4000",
  //     currentBid: "$3200",
  //     timeLeft: "2h 30m",
  //     endTime: "12 September 2024 22:00 GMT +7",
  //   },
  //   {
  //     id: 2,
  //     isLive: false,
  //     title: "Luxury Watches",
  //     lotNumber: "Lot #205",
  //     description: "Rolex Submariner in Gold",
  //     estimate: "US10000 - US12000",
  //     currentBid: "Not started",
  //     timeLeft: "Starts in 2d 5h",
  //     endTime: "15 September 2024 14:00 GMT +7",
  //   },
  //   {
  //     id: 3,
  //     isLive: true,
  //     title: "Rare Antiques",
  //     lotNumber: "Lot #330",
  //     description: "18th Century Vase",
  //     estimate: "US2000 - US2500",
  //     currentBid: "$2100",
  //     timeLeft: "45m",
  //     endTime: "12 September 2024 20:30 GMT +7",
  //   },
  //   {
  //     id: 4,
  //     isLive: false,
  //     title: "Modern Art",
  //     lotNumber: "Lot #410",
  //     description: "Abstract Painting by XYZ",
  //     estimate: "US15000 - US18000",
  //     currentBid: "Not started",
  //     timeLeft: "Starts in 5d 12h",
  //     endTime: "18 September 2024 10:00 GMT +7",
  //   },
  // ];

  return (
    <ScrollView>
      {bidsData.map((item) => (
        <ItemCurrentBids
          key={item.id}
          id={item.id}
          isLive={
            item.status === "Auctionning"
              ? true
              : item.status === "Ready"
              ? false
              : false
          } // Điều chỉnh theo logic của bạn
          title={item.title}
          minPrice={item.startPrice || 0}
          maxPrice={item.endPrice || 0} // chưa có trong api
          image={item.imageLinkJewelry}
          status={item.status}
          lotNumber={`Lot #${item.id}`} // Hoặc lấy từ dữ liệu API nếu có
          typeBid={item.lotType} // Điều chỉnh theo dữ liệu thực
          price={item.buyNowPrice || 0}
          timeLeft={calculateTimeLeft(item.endTime)} // Hàm tính thời gian còn lại
          endTime={item.endTime} // Chuyển đổi thời gian kết thúc
          startTime={item.startTime} // Chuyển đổi thời gian kết thúc
        />
      ))}
    </ScrollView>
  );
};

// Hàm tính thời gian còn lại từ endTime
const calculateTimeLeft = (endTime: string): string => {
  const end = new Date(endTime).getTime();
  const now = new Date().getTime();
  const difference = end - now;

  if (difference <= 0) return "Ended";

  const hours = Math.floor((difference / (1000 * 60 * 60)) % 24);
  const minutes = Math.floor((difference / (1000 * 60)) % 60);
  const seconds = Math.floor((difference / 1000) % 60);

  return `${hours}h ${minutes}m ${seconds}s`;
};

export default CurrentBids;
