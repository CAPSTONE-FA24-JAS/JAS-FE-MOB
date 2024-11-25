import React, { useEffect, useState } from "react";
import { View, Text } from "react-native";

interface CountdownProps {
  startPrice: number;
  currentPrice: number;
  startTime: string;
  bidIncrement: number;
  bidIncrementTime: number; // seconds
  milenstoneReduceTime?: string;
  status: string;
  finalPriceSold: number;
}

const PriceTimeLine: React.FC<CountdownProps> = ({
  startPrice,
  currentPrice,
  startTime,
  bidIncrement,
  bidIncrementTime,
  milenstoneReduceTime,
  status,
  finalPriceSold,
}) => {
  const [timeLeft, setTimeLeft] = useState<number>(0);
  const [currentMilestone, setCurrentMilestone] = useState<{
    currentMilestone: Date;
    nextMilestone: Date;
    reductionCount: number;
  } | null>(null);

  const shouldStopCountdown =
    status === "Sold" ||
    status === "Passed" ||
    status === "Pause" ||
    currentPrice <= finalPriceSold;

  // Tính số lần đã giảm giá để xác định mốc thời gian hiện tại
  const calculateCurrentMilestone = () => {
    // Tính số tiền đã giảm
    const priceReduction = startPrice - currentPrice;
    // Tính số lần đã giảm
    const reductionCount = Math.floor(priceReduction / bidIncrement);

    // Tính thời điểm của mốc giảm giá hiện tại
    const startDateTime = new Date(startTime).getTime();
    const currentMilestoneTime =
      startDateTime + reductionCount * bidIncrementTime * 1000;

    // Tính thời điểm giảm giá tiếp theo
    const nextMilestoneTime = currentMilestoneTime + bidIncrementTime * 1000;

    return {
      currentMilestone: new Date(currentMilestoneTime),
      nextMilestone: new Date(nextMilestoneTime),
      reductionCount,
    };
  };

  // Cập nhật milestone chỉ khi không có milenstoneReduceTime từ server
  useEffect(() => {
    if (!milenstoneReduceTime) {
      const milestone = calculateCurrentMilestone();
      setCurrentMilestone(milestone);
    }
  }, [
    currentPrice,
    startTime,
    bidIncrement,
    bidIncrementTime,
    milenstoneReduceTime,
  ]);

  // Đếm ngược dựa trên milestone hoặc milenstoneReduceTime
  useEffect(() => {
    if (shouldStopCountdown) {
      setTimeLeft(0);
      return;
    }

    const updateTimeLeft = () => {
      const now = new Date().getTime();

      if (milenstoneReduceTime) {
        // Sử dụng thời gian từ server
        const nextReduction =
          new Date(milenstoneReduceTime).getTime() + 1000 * bidIncrementTime;
        const remaining = Math.max(0, nextReduction - now);
        setTimeLeft(remaining);
      } else if (currentMilestone) {
        // Sử dụng milestone đã tính toán
        const remaining = Math.max(
          0,
          currentMilestone.nextMilestone.getTime() - now
        );
        setTimeLeft(remaining);

        // Kiểm tra nếu đã đến mốc tiếp theo, tính toán lại milestone
        if (remaining === 0) {
          const newMilestone = calculateCurrentMilestone();
          setCurrentMilestone(newMilestone);
        }
      }
    };

    // Cập nhật lần đầu ngay lập tức
    updateTimeLeft();

    // Thiết lập interval
    const timer = setInterval(updateTimeLeft, 1000);

    return () => clearInterval(timer);
  }, [shouldStopCountdown, milenstoneReduceTime, currentMilestone]);

  const formatTime = (ms: number) => {
    const seconds = Math.floor(ms / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);

    return {
      hours: hours % 24,
      minutes: minutes % 60,
      seconds: seconds % 60,
    };
  };

  const time = formatTime(timeLeft);

  return (
    <View className="p-4 bg-white rounded-lg shadow">
      <View className="items-center">
        {!shouldStopCountdown ? (
          <>
            <Text className="mb-1 text-sm text-gray-600">
              Next price reduction in:
            </Text>
            <Text className="text-2xl font-bold">
              {time.hours.toString().padStart(2, "0")}:
              {time.minutes.toString().padStart(2, "0")}:
              {time.seconds.toString().padStart(2, "0")}
            </Text>
          </>
        ) : (
          <Text className="text-lg text-gray-600">
            {status === "Pause"
              ? "Auction Paused"
              : status === "Sold"
              ? "Item Sold"
              : status === "Passed"
              ? "Auction Passed"
              : currentPrice <= finalPriceSold
              ? "Reached Minimum Price"
              : "Waiting..."}
          </Text>
        )}
      </View>
    </View>
  );
};

export default PriceTimeLine;
