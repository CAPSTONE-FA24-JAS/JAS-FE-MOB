import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, Alert } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import {
  showErrorMessage,
  showSuccessMessage,
} from "@/components/FlashMessageHelpers";

const ChangePassword: React.FC = () => {
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");

  const validatePassword = (password: string) => {
    const minLength = 8;
    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasNumber = /\d/.test(password);
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);

    return (
      password.length >= minLength &&
      hasUpperCase &&
      hasLowerCase &&
      hasNumber &&
      hasSpecialChar
    );
  };

  const handleChangePassword = () => {
    // Validate form
    if (!oldPassword || !newPassword || !confirmPassword) {
      setError("All fields are required.");
      return;
    }

    if (!validatePassword(newPassword)) {
      setError(
        "Password must be at least 8 characters long and include uppercase, lowercase, number, and special character."
      );
      return;
    }

    if (newPassword !== confirmPassword) {
      setError("New password and confirmation do not match.");
      return;
    }

    // Proceed with the password change process
    showSuccessMessage("Success!, Password changed successfully!");
    // Reset form after success
    setOldPassword("");
    setNewPassword("");
    setConfirmPassword("");
    setError("");
  };

  return (
    <View className="flex-1 p-4 bg-white">
      <View className="mt-2 mb-4">
        <Text className="text-lg font-semibold">Old Password</Text>
        <TextInput
          className="p-2 mt-1 text-base border-2 border-gray-400 rounded"
          secureTextEntry={true}
          placeholder="Enter old password"
          value={oldPassword}
          onChangeText={(text) => setOldPassword(text)}
          returnKeyType="done"
        />
      </View>

      <View className="mb-4">
        <Text className="text-lg font-semibold">New Password</Text>
        <TextInput
          className="p-2 mt-1 text-base border-2 border-gray-400 rounded"
          secureTextEntry={true}
          placeholder="Enter new password"
          value={newPassword}
          onChangeText={(text) => setNewPassword(text)}
          returnKeyType="done"
        />
      </View>

      <View className="mb-4">
        <Text className="text-lg font-semibold">Confirm New Password</Text>
        <TextInput
          className="p-2 mt-1 text-base border-2 border-gray-400 rounded"
          secureTextEntry={true}
          placeholder="Confirm new password"
          value={confirmPassword}
          onChangeText={(text) => setConfirmPassword(text)}
          returnKeyType="done"
        />
      </View>

      {error ? <Text className="mb-4 text-red-500">{error}</Text> : null}

      <TouchableOpacity
        className="p-3 bg-blue-500 rounded"
        onPress={handleChangePassword}>
        <Text className="text-lg font-bold text-center text-white uppercase">
          Change Password
        </Text>
      </TouchableOpacity>
    </View>
  );
};

export default ChangePassword;
