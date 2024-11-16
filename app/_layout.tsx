// app/_layout.tsx
import { useFonts } from "expo-font";
import { SplashScreen, Stack } from "expo-router";
import { useEffect, useState } from "react";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { Provider } from "react-redux";
import store from "@/redux/store";
import { Text, View } from "react-native";
import FlashMessage from "react-native-flash-message";

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [fontsLoaded, setFontsLoaded] = useState(false);

  const [loaded] = useFonts({
    "Roboto-Mono": require("../assets/fonts/RobotoMono-Regular.ttf"),
  });

  useEffect(() => {
    if (loaded) {
      console.log("Fonts loaded, hiding splash screen");
      setFontsLoaded(true);
      SplashScreen.hide();
    } else {
      console.log("Fonts still loading...");
    }
  }, [loaded]);

  if (!fontsLoaded) {
    return (
      <View>
        <Text>Loading...</Text>
      </View>
    );
  }

  return (
    <Provider store={store}>
      <SafeAreaProvider>
        <FlashMessage style={{ zIndex: 999 }} />

        <Stack screenOptions={{ headerShown: false }}>
          <Stack.Screen name="index" />
        </Stack>
      </SafeAreaProvider>
    </Provider>
  );
}
