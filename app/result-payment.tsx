import React from "react";
import { View, Text, StyleSheet, TouchableOpacity, Image } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";

const ResultPayment: React.FC = () => {
  const router = useRouter();
  const params = useLocalSearchParams(); // Sử dụng useLocalSearchParams
  const isSuccess = params?.isSuccess === "true"; // Kiểm tra giá trị của isSuccess

  return (
    <View style={styles.container}>
      {/* Background Header */}
      <Image
        source={require("../assets/Vector-11.png")}
        style={styles.headerImage}
      />

      {/* Ring Image */}
      <Image
        source={require("../assets/Mask Group.png")}
        style={styles.ringImage}
      />

      {/* Result Card */}
      <View
        style={[
          styles.card,
          { borderColor: isSuccess ? "#4CAF50" : "#F44336" }, // Màu viền xanh hoặc đỏ
        ]}
      >
        {/* Icon */}
        <View
          style={[
            styles.iconContainer,
            { backgroundColor: isSuccess ? "#DFF2BF" : "#FFBABA" }, // Nền xanh hoặc đỏ
          ]}
        >
          <Text style={styles.iconText}>{isSuccess ? "✔" : "✖"}</Text>
        </View>

        {/* Title */}
        <Text
          style={[
            styles.title,
            { color: isSuccess ? "#4CAF50" : "#F44336" }, // Màu chữ
          ]}
        >
          {isSuccess ? "Yeah!" : "Oh no!"}
        </Text>

        {/* Message */}
        <Text style={styles.message}>
          {isSuccess
            ? "Payment Successful!"
            : "Something went wrong. Please try again."}
        </Text>

        {/* Button */}
        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={[
              styles.button,
              { backgroundColor: isSuccess ? "#4CAF50" : "#F44336" },
            ]}
            onPress={() => router.replace("/home-screen")}
          >
            <Text style={styles.buttonText}>
              {isSuccess ? "Done" : "Try Again"}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#ffffff",
    alignItems: "center",
  },
  headerImage: {
    width: "100%",
    height: 300,
    resizeMode: "cover",
  },
  ringImage: {
    position: "absolute",
    top: "22%", // Đặt hình nằm dưới tiêu đề
    alignSelf: "center",
    width: 200,
    height: 200,
    resizeMode: "contain",
  },
  card: {
    width: "80%",
    borderWidth: 2,
    borderRadius: 12,
    backgroundColor: "#FFFFFF",
    alignItems: "center",
    paddingVertical: 30,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
    marginTop: 160, // Đẩy thẻ xuống dưới hình ảnh
  },
  iconContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
  },
  iconText: {
    fontSize: 36,
    fontWeight: "bold",
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 10,
  },
  message: {
    fontSize: 16,
    color: "#555",
    textAlign: "center",
    marginBottom: 20,
    paddingHorizontal: 10,
  },
  buttonContainer: {
    width: "100%",
    alignItems: "center",
  },
  button: {
    width: "80%",
    paddingVertical: 15,
    borderRadius: 8,
    alignItems: "center",
  },
  buttonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default ResultPayment;
