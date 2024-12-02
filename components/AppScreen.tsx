import React from "react";
import { StyleSheet, View } from "react-native";

const AppScreen = ({ children }: any) => {
  return <View style={[styles.container]}>{children}</View>;
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default AppScreen;
