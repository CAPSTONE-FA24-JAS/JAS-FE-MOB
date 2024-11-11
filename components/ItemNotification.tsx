import { markNotificationAsReadByAccount } from "@/api/notificationApi";
import { Notification } from "@/app/types/notification_type";
import { markNotificationAsRead } from "@/redux/slices/notificationSlice";
import { FontAwesome } from "@expo/vector-icons";
import { StackNavigationProp } from "@react-navigation/stack";
import { router, useNavigation } from "expo-router";
// components/NotificationItem.tsx
import React from "react";
import { View, Text, Image } from "react-native";
import { TouchableOpacity } from "react-native-gesture-handler";
import { useDispatch } from "react-redux";

type RootStackParamList = {
  Account:
    | { screen: "InvoiceList" }
    | { screen: "MyBids"; params: { tab: string } }
    | { screen: "HistoryItemConsign"; params: { tab: number } };
};

const NotificationItem = ({ item }: { item: Notification }) => {
  const dispatch = useDispatch();
  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();

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
      item.title.includes("Đấu giá thắng")
    ) {
      console.log("Navigate to invoice list");
      // navigation.navigate("InvoiceDetail", { item: item.id });
      navigation.navigate("Account", { screen: "InvoiceList" as const });
      // router.push("/invoice-list");
    } else if (
      item.notifi_Type === "Customerlot" ||
      item.title.includes("Đấu giá thua")
    ) {
      console.log("Navigate to my bid past");
      // navigation.navigate("ValuationDetail", { item: item.id });
      navigation.navigate("Account", {
        screen: "MyBids",
        params: { tab: "past" },
      });

      // router.push("/invoice-list");
    } else if (item.notifi_Type === "Valuation") {
      console.log("Navigate to valuation");
      // navigation.navigate("ValuationDetail", { item: item.id });
      navigation.navigate("Account", {
        screen: "HistoryItemConsign",
        params: { tab: 3 },
      });
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
    const formattedTitle = title.split(" ").map((word) => {
      if (
        word.toLowerCase() === "thắng" ||
        word.toLowerCase() === "Thắng" ||
        word.toLowerCase() === "THẮNG"
      ) {
        return (
          <Text key={word} className="text-green-700 uppercase">
            {" "}
            {word}{" "}
          </Text>
        );
      }
      if (
        word.toLowerCase() === "thua" ||
        word.toLowerCase() === "Thua" ||
        word.toLowerCase() === "THUA"
      ) {
        return (
          <Text key={word} className="text-red-500 uppercase">
            {" "}
            {word}{" "}
          </Text>
        );
      }
      return <Text key={word}> {word} </Text>;
    });

    return formattedTitle;
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
      <View className="flex-row items-center">
        <View className="mr-3 w-[24%]">
          <Image
            source={{
              uri:
                item.imageNoti ??
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
