import { markNotificationAsReadByAccount } from "@/api/notificationApi";
import { Notification } from "@/app/types/notification_type";
import { markNotificationAsRead } from "@/redux/slices/notificationSlice";
import { FontAwesome } from "@expo/vector-icons";
import { StackNavigationProp } from "@react-navigation/stack";
import { router, useNavigation } from "expo-router";
import moment from "moment-timezone";
// components/NotificationItem.tsx
import React from "react";
import { View, Text, Image } from "react-native";
import { TouchableOpacity } from "react-native-gesture-handler";
import { useDispatch } from "react-redux";

type RootStackParamList = {
  InvoiceList: undefined;
  MyBids: { tab: string };
  HistoryItemConsign: { tab: number };
};

const NotificationItem = ({ item }: { item: Notification }) => {
  const dispatch = useDispatch();
  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();
  console.log("itemNoti.id", item.id);

  const getTypeColor = (item: Notification) => {
    switch (item.notifi_Type) {
      case "CustomerLot":
        return "bg-yellow-100";
      case "Valuation":
        return "bg-blue-100";
      default:
        return "bg-gray-100";
    }
  };

  const getTypeColorText = (item: Notification) => {
    switch (item.notifi_Type) {
      case "CustomerLot":
        return "text-yellow-600";
      case "Valuation":
        return "text-blue-600";
      default:
        return "text-gray-600";
    }
  };

  const handleNavigate = () => {
    if (
      item.notifi_Type === "Customerlot" ||
      item.title.includes("Đấu giá thắng") ||
      item.title.includes("Bidding win")
    ) {
      console.log("Navigate to invoice list");
      // navigation.navigate("InvoiceDetail", { item: item.id });
      navigation.navigate("InvoiceList");

      // router.push("/invoice-list");
    } else if (
      item.notifi_Type === "Customerlot" ||
      item.title.includes("Đấu giá thua") ||
      item.title.includes("Bidding lose")
    ) {
      console.log("Navigating to Account", { screen: "MyBids" });

      // navigation.navigate("ValuationDetail", { item: item.id });
      navigation.navigate("MyBids", { tab: "past" });

      // router.push("/invoice-list");
    } else if (item.notifi_Type === "Valuation") {
      console.log("Navigate to valuation");
      // navigation.navigate("ValuationDetail", { item: item.id });
      navigation.navigate("HistoryItemConsign", { tab: 3 });
    } else if (item.notifi_Type === "Preliminary") {
      console.log("Navigate to valuation");
      // navigation.navigate("ValuationDetail", { item: item.id });
      navigation.navigate("HistoryItemConsign", { tab: 3 });
    }
  };

  const handleMarkAsRead = async () => {
    if (item.is_Read === true) return handleNavigate(); // Nếu đã đọc rồi thì không cần gọi API

    console.log("Marking as read, item id: ", item.id); // Kiểm tra ID của thông báo

    try {
      // Gọi API để đánh dấu thông báo là đã đọc
      const markedNotification = await markNotificationAsReadByAccount(item.id);
      console.log("Notification marked as read:", markedNotification); // Kiểm tra phản hồi từ API

      // Cập nhật lại danh sách thông báo
      dispatch(markNotificationAsRead(item.id));
      handleNavigate();
    } catch (error) {
      console.error("Error marking notification as read", error);
    }
  };

  // Hàm này để thay đổi màu và chữ hoa cho từ "thắng" và "thua"
  const formatTitleText = (title: string) => {
    return title.split(" ").map((word, index) => {
      if (["thắng", "win"].includes(word.toLowerCase())) {
        return (
          <Text key={`win-${index}`} className="text-green-700 uppercase">
            {word}
          </Text>
        );
      }
      if (["thua", "lose"].includes(word.toLowerCase())) {
        return (
          <Text key={`lose-${index}`} className="text-red-500 uppercase">
            {word}
          </Text>
        );
      }
      return <Text key={`word-${index}`}> {word} </Text>;
    });
  };

  return (
    <TouchableOpacity
      onPress={handleMarkAsRead}
      className={`px-4 py-4   border-2 my-1 mx-2 rounded-md relative ${
        item.is_Read === true
          ? "bg-white border-gray-200"
          : "bg-[#90e0ef]/30 border-[#90e0ef]/30"
      } `}
      key={item.id} // Ensuring key is unique
    >
      <Text className="font-semibold text-gray-600 mb-2">
        {moment(item.creationDate).format("HH:mm A, DD/MM/YYYY")}
      </Text>
      <View className="flex-row items-center">
        <View className="mr-3 w-[24%]">
          <Image
            source={{
              uri:
                item.imageLink ??
                "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQWz9tftw9qculFH1gxieWkxL6rbRk_hrXTSg&s",
            }}
            className="w-[90px] h-[100px] rounded-xl"
          />
        </View>
        <View className=" w-[76%]">
          <View className="flex-row items-center justify-between mb-3">
            {item.notifi_Type !== null && (
              <View className={`px-2 py-0.5 rounded ${getTypeColor(item)}`}>
                <Text
                  className={`text-base font-medium  ${getTypeColorText(item)}`}
                >
                  {item.notifi_Type}
                </Text>
              </View>
            )}
          </View>
          <Text className="mb-1 text-lg font-bold ml-1">
            {formatTitleText(item.title)}
          </Text>
          <Text className="text-sm ml-1 text-gray-600">{item.description}</Text>
        </View>
      </View>
      {item.is_Read === false ? (
        <View className="absolute top-4 right-4">
          <FontAwesome name="circle" size={14} color="black" />
        </View>
      ) : (
        <View className="absolute top-4 right-4">
          <FontAwesome name="check" size={18} color="green" />
        </View>
      )}
    </TouchableOpacity>
  );
};
export default NotificationItem;
