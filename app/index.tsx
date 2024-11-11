// app/index.tsx

import React from "react";
import { View, ImageBackground, Dimensions } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import CustomButton from "@/components/CustomButton";
import AppGradient from "@/components/AppGradient";
import { useRouter } from "expo-router";
import Animated, { FadeInDown } from "react-native-reanimated";

import { NativeWindStyleSheet } from "nativewind";

NativeWindStyleSheet.setOutput({
  default: "native",
});

const App = () => {
  const router = useRouter();
  const { width, height } = Dimensions.get("window");

  const isLandscape = width > height;

  const handleExplorePress = () => {
    console.log("Button Pressed");
    try {
      router.push("/(auths)/login");
      // router.push("/home-screen");
      console.log("Navigating to /login");
    } catch (error) {
      console.error("Navigation error:", error);
    }
  };

  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <ImageBackground
        source={require("../assets/bg-jas/bg1.png")}
        resizeMode="cover"
        style={{ flex: 1, width: "100%", height: "100%" }}>
        <AppGradient colors={["rgba(0,0,0,0)", "rgba(0,0,0,0)"]}>
          <SafeAreaView
            style={{
              flex: 1,
              paddingHorizontal: 8,
              justifyContent: "space-between",
            }}>
            <Animated.View
              entering={FadeInDown.delay(300)
                .mass(0.5)
                .stiffness(80)
                .springify(20)}></Animated.View>

            <Animated.View
              entering={FadeInDown.delay(300)
                .mass(0.5)
                .stiffness(80)
                .springify(20)}
              style={{ marginBottom: 40, shadowOpacity: 0.8 }}>
              <CustomButton
                onPress={handleExplorePress}
                title="BẮT ĐẦU KHÁM PHÁ"
              />
            </Animated.View>

            <StatusBar style="light" />
          </SafeAreaView>
        </AppGradient>
      </ImageBackground>
    </View>
  );
};

export default App;
