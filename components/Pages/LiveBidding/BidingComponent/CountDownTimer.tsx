import React, { useState, useEffect } from "react";
import { Text, View } from "react-native";

interface CountDownTimerProps {
  initialTime: number; // in seconds
}

const CountDownTimer: React.FC<CountDownTimerProps> = ({ initialTime }) => {
  const [timeLeft, setTimeLeft] = useState(initialTime);

  useEffect(() => {
    const interval = setInterval(() => {
      setTimeLeft((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const formatTime = (seconds: number) => {
    const min = Math.floor(seconds / 60);
    const sec = seconds % 60;
    return `${min}:${sec < 10 ? "0" : ""}${sec}`;
  };

  return (
    <View className="bg-red-600 p-2 w-full  ">
      <Text className="text-white text-center font-semibold text-base">
        Estimate Time: {formatTime(timeLeft)} left
      </Text>
    </View>
  );
};

export default CountDownTimer;
