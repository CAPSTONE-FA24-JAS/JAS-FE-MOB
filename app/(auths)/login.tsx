// app/(auths)/login.tsx

import { Link, useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  View,
  TextInput,
  Button,
  Alert,
  ScrollView,
  Text,
  TouchableOpacity,
  Image,
} from "react-native";
import { useDispatch } from "react-redux";
import { AppDispatch } from "@/redux/store";
import { LoginApi } from "@/api/authApi";
import { Feather } from "@expo/vector-icons";
import beachImage from "../../assets/bg-jas/header_login.png";
import ggIcon from "../../assets/icons/gg-icon.png";
import fbIcon from "../../assets/icons/fb-icon.png";
import {
  showErrorMessage,
  showSuccessMessage,
} from "@/components/FlashMessageHelpers";

const Login: React.FC = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const dispatch = useDispatch<AppDispatch>();
  const [rightIcon, setRightIcon] = useState<"eye" | "eye-off">("eye"); // Explicitly type the state
  const [passwordVisibility, setPasswordVisibility] = useState(true);
  const [isLoginSuccessful, setIsLoginSuccessful] = useState(false);
  const router = useRouter();

  const handleLogin = async () => {
    if (!username || !password) {
      showErrorMessage("Please fill in all fields");
      return;
    }
    try {
      await LoginApi(username, password, dispatch);
      setIsLoginSuccessful(true);
      showSuccessMessage("Login successful! Redirecting...");
      router.push("/home-screen");
      console.log("Login successful, navigating to home..."); // Debug log
    } catch (error) {
      showErrorMessage("Invalid username or password.");
      console.error("Login error:", error);
    }
  };

  useEffect(() => {
    if (isLoginSuccessful) {
      router.push("/home-screen");
    }
  }, [isLoginSuccessful, router]);

  const handlePasswordVisibility = () => {
    setRightIcon(rightIcon === "eye" ? "eye-off" : "eye");
    setPasswordVisibility(!passwordVisibility);
  };

  return (
    <ScrollView contentContainerStyle={{ flex: 1 }} className="bg-[#FFFFFF]">
      <View className="flex mx-auto my-auto bg-white w-full h-full">
        <View className="mx-auto h-full my-auto w-full">
          <Image
            source={beachImage}
            className="w-full h-[40%] items-center mx-auto mb-2"
          />
          <View className="flex-row w-full mx-10 mb-10">
            <View className=" w-[50%]">
              <Text className="text-[#666666] text-3xl">Sign in</Text>
              <Text className="w-full text-gray-400 text-lg ">
                Welcome back
              </Text>
            </View>
            <View className="flex-row w-[30%]">
              <Image
                source={fbIcon}
                className="w-[60px] h-[60px] items-center rounded-full mx-auto mr-2"
              />
              <Image
                source={ggIcon}
                className="w-[60px] h-[60px] items-center rounded-full mx-auto "
              />
            </View>
          </View>
          <View className="w-full h-full mx-auto">
            <View className="px-3  mb-4">
              <TextInput
                placeholder="Email"
                value={username}
                onChangeText={setUsername}
                className="border-[1px] border-slate-300 px-4 py-4 rounded-lg text-lg mx-7"
              />
            </View>
            <View className="my-3 px-3">
              <View className="relative mx-7 border-[1px] border-slate-300 p-2 rounded-lg">
                <TextInput
                  placeholder="Password"
                  autoCapitalize="none"
                  autoCorrect={false}
                  secureTextEntry={passwordVisibility}
                  value={password}
                  onChangeText={setPassword}
                  className="text-lg ml-3 py-2 text-slate-400 " // Added pr-10 to avoid text overlap with icon
                  style={{ paddingRight: 40 }} // Extra padding to prevent text overlapping with icon
                />
                <TouchableOpacity
                  onPress={handlePasswordVisibility}
                  className="absolute right-4 top-[40%] transform -translate-y-1/2" // Positioning icon in the center vertically
                >
                  <Feather name={rightIcon} size={24} color="black" />
                </TouchableOpacity>
              </View>
            </View>
            <View className="flex-row items-center justify-between mt-6 mx-10 ">
              <TouchableOpacity
                className="w-[150px]  bg-[#4765F9] rounded-md"
                onPress={handleLogin}
              >
                <Text className="text-xl text-white text-center uppercase px-9 py-3 font-semibold">
                  Sign in
                </Text>
              </TouchableOpacity>
              <Text className="text-gray-500 text-lg">Forgot Password ?</Text>
            </View>
            <View className="flex-row items-center justify-center mt-20 mx-10">
              <Text className="text-lg text-gray-500">
                Don’t have an account?
              </Text>
              <Link href="/(auths)/register" asChild>
                <TouchableOpacity>
                  <Text className="text-[#4765F9] text-lg font-semibold mx-4">
                    Sign up
                  </Text>
                </TouchableOpacity>
              </Link>
            </View>
          </View>
        </View>
      </View>
    </ScrollView>
  );
};

export default Login;
