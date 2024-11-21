import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet } from "react-native";
import moment from "moment-timezone";

type CountdownTimerProps = {
  startTime: string | null;
};

const AuctionCountdownTimer: React.FC<CountdownTimerProps> = ({
  startTime,
}) => {
  const [timeLeft, setTimeLeft] = useState<string | null>(null);

  useEffect(() => {
    const updateTimer = () => {
      const now = moment();
      const start = startTime ? moment(startTime) : null;

      if (start && now.isBefore(start)) {
        const duration = moment.duration(start.diff(now));
        setTimeLeft(
          `${Math.floor(
            duration.asHours()
          )}h ${duration.minutes()}m ${duration.seconds()}s`
        );
      } else {
        setTimeLeft(null); // Không hiển thị gì khi thời gian "Upcoming" đã hết
      }
    };

    // Gọi hàm ngay khi component được render
    updateTimer();

    // Cập nhật mỗi giây
    const interval = setInterval(updateTimer, 1000);

    // Dọn dẹp interval khi component bị unmount
    return () => clearInterval(interval);
  }, [startTime]);

  if (!timeLeft) {
    return null; // Không hiển thị gì khi hết thời gian "Upcoming"
  }

  return (
    <View style={styles.container}>
      <Text style={styles.upcomingText}>Upcoming in: {timeLeft}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 10,
    marginBottom: 10,
  },
  upcomingText: {
    color: "#ffffff",
    textAlign: "center",
    backgroundColor: "#FFA500", // Orange for upcoming
    padding: 10,
    borderRadius: 5,
    fontSize: 16,
  },
});

export default AuctionCountdownTimer;
