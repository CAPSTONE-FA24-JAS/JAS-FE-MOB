// app/(auths)/login.tsx

import { LoginApi } from "@/api/authApi";
import {
  showErrorMessage,
  showSuccessMessage,
} from "@/components/FlashMessageHelpers";
import LoadingOverlay from "@/components/LoadingOverlay";
import { fetchProfile } from "@/redux/slices/profileSlice";
import { AppDispatch, RootState } from "@/redux/store";
import { Feather } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Link, useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  Image,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { Checkbox } from "react-native-paper";
import { useDispatch, useSelector } from "react-redux";

const Login: React.FC = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const dispatch = useDispatch<AppDispatch>();
  const [rightIcon, setRightIcon] = useState<"eye" | "eye-off">("eye"); // Explicitly type the state
  const [passwordVisibility, setPasswordVisibility] = useState(true);
  const [isLoginSuccessful, setIsLoginSuccessful] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [Loading, setLoading] = useState(false);

  const router = useRouter();

  // Selectors to get user data from the Redux store
  const userResponse = useSelector(
    (state: RootState) => state.auth.userResponse
  );
  const isAuthenticated = useSelector(
    (state: RootState) => state.auth.isAuthenticated
  );

  const handleLogin = async () => {
    if (!username || !password) {
      showErrorMessage("Please fill in all fields");
      return;
    }
    try {
      setLoading(true);

      const userData = await LoginApi(username, password, dispatch);
      setIsLoginSuccessful(true);
      showSuccessMessage("Login successful! Redirecting...");
      setLoading(false);

      if (rememberMe) {
        // Save credentials
        await AsyncStorage.setItem("rememberedEmail", username);
        await AsyncStorage.setItem("rememberedPassword", password);
      } else {
        // Clear saved credentials
        await AsyncStorage.removeItem("rememberedEmail");
        await AsyncStorage.removeItem("rememberedPassword");
      }
      // Dispatch fetchProfile with the userId
      if (userData && userData.id) {
        // Ensure userData and id exist
        await dispatch(fetchProfile(userData.id));
        console.log("Profile fetched successfully.");
      } else {
        console.warn("User data or ID is missing.");
      }

      router.replace("/home-screen");
      console.log("Login successful, navigating to home..."); // Debug log
    } catch (error) {
      showErrorMessage("Invalid username or password.");
      console.error("Login error:", error);
    }
    setLoading(false);
  };

  useEffect(() => {
    const loadRememberedCredentials = async () => {
      try {
        const savedEmail = await AsyncStorage.getItem("rememberedEmail");
        const savedPassword = await AsyncStorage.getItem("rememberedPassword");

        if (savedEmail && savedPassword) {
          setUsername(savedEmail);
          setPassword(savedPassword);
          setRememberMe(true);
        }
      } catch (error) {
        console.error("Failed to load remembered credentials:", error);
      }
    };

    loadRememberedCredentials();
  }, []);

  useEffect(() => {
    if (isLoginSuccessful) {
      router.replace("/home-screen");
    }
  }, [isLoginSuccessful, router]);

  const handlePasswordVisibility = () => {
    setRightIcon(rightIcon === "eye" ? "eye-off" : "eye");
    setPasswordVisibility(!passwordVisibility);
  };

  return (
    <ScrollView contentContainerStyle={{ flex: 1 }} className="bg-[#FFFFFF]">
      {Loading && <LoadingOverlay visible={Loading} />}

      <View className="flex w-full h-full mx-auto my-auto bg-white">
        <View className="w-full h-full mx-auto my-auto">
          <Image
            source={require("../../assets/bg-jas/header_login.png")}
            className="w-full h-[40%] items-center mx-auto mb-2"
          />
          <View className="flex-row w-full mx-10 mb-10">
            <View className=" w-[50%]">
              <Text className="text-[#666666] text-3xl">Sign in</Text>
              <Text className="w-full text-lg text-gray-400 ">
                Welcome back
              </Text>
            </View>
            <View className="flex-row w-[30%]">
              <Image
                source={require("../../assets/icons/fb-icon.png")}
                className="w-[60px] h-[60px] items-center rounded-full mx-auto mr-2"
              />
              <Image
                source={require("../../assets/icons/gg-icon.png")}
                className="w-[60px] h-[60px] items-center rounded-full mx-auto "
              />
            </View>
          </View>
          <View className="w-full h-full mx-auto">
            <View className="px-3 mb-4">
              <TextInput
                placeholder="Email"
                value={username}
                onChangeText={setUsername}
                className="border-[1px] border-slate-300 px-4 py-4 rounded-lg text-lg mx-7"
                returnKeyType="done"
              />
            </View>
            <View className="px-3 my-3">
              <View className="relative mx-7 border-[1px] border-slate-300 p-2 rounded-lg">
                <TextInput
                  placeholder="Password"
                  autoCapitalize="none"
                  autoCorrect={false}
                  secureTextEntry={passwordVisibility}
                  value={password}
                  onChangeText={setPassword}
                  className="py-2 ml-3 text-lg text-slate-400 " // Added pr-10 to avoid text overlap with icon
                  style={{ paddingRight: 40 }} // Extra padding to prevent text overlapping with icon
                  returnKeyType="done"
                />
                <TouchableOpacity
                  onPress={handlePasswordVisibility}
                  className="absolute right-4 top-[40%] transform -translate-y-1/2" // Positioning icon in the center vertically
                >
                  <Feather name={rightIcon} size={24} color="black" />
                </TouchableOpacity>
              </View>
            </View>
            <View className="flex-row items-center px-3 mx-7">
              <Checkbox
                status={rememberMe ? "checked" : "unchecked"}
                onPress={() => setRememberMe(!rememberMe)}
                color="gray"
              />
              <Text style={{ fontSize: 16, marginLeft: 8, color: "gray" }}>
                Remember Password
              </Text>
            </View>

            <View className="flex-row items-center justify-between mx-10 mt-6 ">
              <TouchableOpacity
                className="w-[150px]  bg-[#4765F9] rounded-md"
                onPress={handleLogin}>
                <Text className="py-3 text-xl font-semibold text-center text-white uppercase px-9">
                  Sign in
                </Text>
              </TouchableOpacity>
              <Text className="text-lg text-gray-500">Forgot Password ?</Text>
            </View>
            <View className="flex-row items-center justify-center mx-10 mt-20">
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
