import React, { useState, useEffect, useMemo } from "react";
import { Text, View } from "react-native";

interface CountDownTimerProps {
  endTime: string; // ISO 8601 format recommended
  status: string;
}

const CountDownTimer: React.FC<CountDownTimerProps> = ({ endTime, status }) => {
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  const calculateTimeLeft = () => {
    const difference = new Date(endTime).getTime() - new Date().getTime();

    if (difference <= 0) {
      return {
        days: 0,
        hours: 0,
        minutes: 0,
        seconds: 0,
      };
    }

    return {
      days: Math.floor(difference / (1000 * 60 * 60 * 24)),
      hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
      minutes: Math.floor((difference / 1000 / 60) % 60),
      seconds: Math.floor((difference / 1000) % 60),
    };
  };

  useEffect(() => {
    const updateTimer = () => {
      const newTimeLeft = calculateTimeLeft();
      setTimeLeft(newTimeLeft);

      // Clear timer if all values are zero
      if (Object.values(newTimeLeft).every((v) => v === 0)) {
        clearInterval(timer);
      }
    };

    updateTimer(); // Initial call
    const timer = setInterval(updateTimer, 1000);

    return () => clearInterval(timer);
  }, [endTime]);

  // Memoize the display string to avoid recalculating unnecessarily
  const displayText = useMemo(() => {
    const { days, hours, minutes, seconds } = timeLeft;

    return days + hours + minutes + seconds === 0
      ? "Time's up!"
      : status === "Cancelled"
      ? "Cancelled"
      : `Ends in ${days}d ${hours}h ${minutes}m ${seconds}s`;
  }, [timeLeft]);

  return (
    <View className="w-full p-1 bg-red-600">
      <Text className="text-sm font-semibold text-center text-white">
        {displayText}
      </Text>
    </View>
  );
};

export default CountDownTimer;
