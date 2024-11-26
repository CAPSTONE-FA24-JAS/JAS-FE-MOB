import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, Modal } from "react-native";
import { Feather, MaterialCommunityIcons } from "@expo/vector-icons";

interface PasswordModalProps {
  isVisible: boolean;
  onClose: () => void;
  onConfirm: (password: string) => void;
  amount?: number; // New prop for the payment amount
}

const PasswordModal: React.FC<PasswordModalProps> = ({
  isVisible,
  onClose,
  onConfirm,
  amount,
}) => {
  const [password, setPassword] = useState<string>("");
  const [passwordVisibility, setPasswordVisibility] = useState<boolean>(true);
  const [rightIcon, setRightIcon] = useState<"eye" | "eye-off">("eye");

  const handlePasswordVisibility = () => {
    setRightIcon(rightIcon === "eye" ? "eye-off" : "eye");
    setPasswordVisibility(!passwordVisibility);
  };

  const handleConfirm = () => {
    onConfirm(password); // Trigger the confirmation callback with the entered password
    setPassword(""); // Reset the password field after confirmation
  };

  return (
    <Modal
      animationType="fade"
      transparent={true}
      visible={isVisible}
      onRequestClose={onClose}>
      <View className="items-center justify-center flex-1 bg-black/50">
        <View className="items-center w-10/12 p-6 bg-white rounded-lg">
          {/* Close icon at the top-right corner */}
          <TouchableOpacity
            className="absolute top-2 right-2"
            onPress={onClose}>
            <MaterialCommunityIcons name="close" size={24} color="black" />
          </TouchableOpacity>

          <Text className="mb-2 text-lg font-semibold text-center uppercase">
            Enter Wallet Password
          </Text>
          {amount && (
            <Text className="mb-4 text-base text-[#4765F9] font-semibold text-center  ">
              Payment {amount.toLocaleString("vi-VN")} đ by Wallet
            </Text>
          )}

          <View className="relative mx-4 mb-6 mt-4 border-[1px] w-full border-slate-300 p-2 rounded-lg">
            <TextInput
              placeholder="Password"
              secureTextEntry={passwordVisibility}
              value={password}
              onChangeText={setPassword}
              className="py-2 ml-2 text-lg text-slate-400"
              style={{ paddingRight: 40 }}
              returnKeyType="done"
            />
            <TouchableOpacity
              onPress={handlePasswordVisibility}
              className="absolute right-4 top-[40%] transform -translate-y-1/2">
              <Feather name={rightIcon} size={24} color="black" />
            </TouchableOpacity>
          </View>

          <TouchableOpacity
            className="w-full bg-[#4765F9] rounded-md"
            onPress={handleConfirm}>
            <Text className="py-3 text-xl font-semibold text-center text-white uppercase">
              Confirm
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

export default PasswordModal;
