import { Link, useRouter } from "expo-router";
import React from "react";
import { View, StyleSheet, Text } from "react-native";
import { TouchableOpacity } from "react-native-gesture-handler";

const Page = () => {
  const router = useRouter();
  return (
    <View style={styles.container}>
      <Link href="/(tabs)/nature-meditate">Ready to meditate</Link>
      <TouchableOpacity onPress={() => router.back()}>
        <Text>Go to Invoice List</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {},
});

export default Page;
