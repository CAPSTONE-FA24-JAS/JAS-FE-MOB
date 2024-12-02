import React from "react";
import { Text, TouchableOpacity, StyleSheet } from "react-native";

interface CustomButtonProps {
  onPress: () => void;
  title: string;
  textStyles?: object;
  containerStyles?: object;
}

const CustomButton = ({
  onPress,
  title,
  textStyles = {},
  containerStyles = {},
}: CustomButtonProps) => {
  return (
    <TouchableOpacity
      activeOpacity={0.7}
      style={[styles.buttonContainer, containerStyles]} // Use style prop for styles
      onPress={onPress}>
      <Text style={[styles.buttonText, textStyles]}>{title}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  buttonContainer: {
    backgroundColor: "white",
    borderRadius: 10,
    minHeight: 62,
    justifyContent: "center",
    alignItems: "center",
  },
  buttonText: {
    color: "#007bff", // Update this to match 'text-primary' in your Tailwind setup
    fontWeight: "600", // Semibold equivalent
    fontSize: 18, // 'text-lg' equivalent
  },
});

export default CustomButton;
