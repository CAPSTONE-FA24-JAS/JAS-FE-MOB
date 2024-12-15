// components/CountdownTimer.tsx
import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet } from "react-native";
import moment from "moment-timezone";

type CountdownTimerProps = {
  startTime: string | null;
  endTime: string | null;
};

const CountdownTimerBid: React.FC<CountdownTimerProps> = ({
  startTime,
  endTime,
}) => {
  const [currentStatus, setCurrentStatus] = useState<
    "upcoming" | "living" | "ended"
  >("upcoming");
  const [timeLeft, setTimeLeft] = useState<string>("");

  useEffect(() => {
    const updateTimer = () => {
      const now = moment();
      const start = startTime ? moment(startTime) : null;
      const end = endTime ? moment(endTime) : null;

      if (start && now.isBefore(start)) {
        setCurrentStatus("upcoming");
        const duration = moment.duration(start.diff(now));
        setTimeLeft(
          `${Math.floor(
            duration.asHours()
          )}h ${duration.minutes()}m ${duration.seconds()}s`
        );
      } else if (start && end && now.isBetween(start, end)) {
        setCurrentStatus("living");
        const duration = moment.duration(end.diff(now));
        setTimeLeft(
          `${Math.floor(
            duration.asHours()
          )}h ${duration.minutes()}m ${duration.seconds()}s`
        );
      } else if (end && now.isAfter(end)) {
        setCurrentStatus("ended");
        setTimeLeft("");
      } else {
        setCurrentStatus("ended");
        setTimeLeft("");
      }
    };

    // Initial call
    updateTimer();

    // Update every second
    const interval = setInterval(updateTimer, 1000);

    // Cleanup on unmount
    return () => clearInterval(interval);
  }, [startTime, endTime]);

  const renderContent = () => {
    switch (currentStatus) {
      case "upcoming":
        return (
          <Text style={styles.upcomingText}>
            Upcoming bid ends in: {timeLeft}
          </Text>
        );
      case "living":
        return (
          <Text style={styles.livingText}>Living bid ends in: {timeLeft}</Text>
        );
      case "ended":
        return <Text style={styles.endedText}>END BID</Text>;
      default:
        return null;
    }
  };

  return (
    <View
      style={[
        styles.container,
        currentStatus === "ended" && styles.endedBackground,
      ]}>
      {renderContent()}
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
  },
  livingText: {
    color: "#ffffff",
    textAlign: "center",
    backgroundColor: "#BA0000", // Green for living
    padding: 10,
    borderRadius: 5,
  },
  endedText: {
    color: "#ffffff",
    textAlign: "center",
    backgroundColor: "#A9A9A9", // Gray for ended
    padding: 4,
    borderRadius: 5,
    fontSize: 16,
    fontWeight: "bold",
  },
  endedBackground: {
    backgroundColor: "#A9A9A9",
  },
});

export default CountdownTimerBid;
