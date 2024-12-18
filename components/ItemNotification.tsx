import { markNotificationAsReadByAccount } from "@/api/notificationApi";
import { Notification } from "@/app/types/notification_type";
import { markNotificationAsRead } from "@/redux/slices/notificationSlice";
import { FontAwesome } from "@expo/vector-icons";
import { StackNavigationProp } from "@react-navigation/stack";
import { useNavigation } from "expo-router";
import moment from "moment-timezone";
// components/NotificationItem.tsx
import React from "react";
import { Image, Text, View } from "react-native";
import { TouchableOpacity } from "react-native-gesture-handler";
import { useDispatch } from "react-redux";

type RootStackParamList = {
  InvoiceList: { status?: number }; // InvoiceList có thể nhận tham số 'status'
  MyBids: { tab?: string };
  HistoryItemConsign: { tab?: number };
};

const NotificationItem = ({ item }: { item: Notification }) => {
  const dispatch = useDispatch();
  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();
  // console.log("itemNoti.id", item.id);

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

  const statusMapping = [
    { label: "Requested", value: 1, screen: "HistoryItemConsign", tab: 0 },
    { label: "Assigned", value: 2, screen: "HistoryItemConsign", tab: 1 },
    {
      label: "RequestedPreliminary",
      value: 3,
      screen: "HistoryItemConsign",
      tab: undefined,
    },
    { label: "Preliminary", value: 4, screen: "HistoryItemConsign", tab: 3 },
    {
      label: "ApprovedPreliminary",
      value: 5,
      screen: "HistoryItemConsign",
      tab: 4,
    },
    { label: "RecivedJewelry", value: 6, screen: "HistoryItemConsign", tab: 5 },
    {
      label: "Evaluated",
      value: 7,
      screen: "HistoryItemConsign",
      tab: undefined,
    },
    {
      label: "ManagerApproved",
      value: 8,
      screen: "HistoryItemConsign",
      tab: 7,
    },
    { label: "Authorized", value: 9, screen: "HistoryItemConsign", tab: 8 },
    { label: "Rejected", value: 10, screen: "HistoryItemConsign", tab: 9 },
    { label: "CreateInvoice", value: 11, screen: "InvoiceList", status: 2 },
    { label: "PendingPayment", value: 12, screen: "InvoiceList", status: 3 },
    { label: "Paid", value: 13, screen: "InvoiceList", status: 4 },
    { label: "Delivering", value: 14, screen: "InvoiceList", status: 5 },
    { label: "Delivered", value: 15, screen: "InvoiceList", status: 6 },
    { label: "Finished", value: 17, screen: "InvoiceList", status: 8 },
    { label: "Refunded", value: 18, screen: "InvoiceList", status: 9 },
    { label: "Cancelled", value: 19, screen: "InvoiceList", status: 10 },
    { label: "Closed", value: 20, screen: "InvoiceList", status: 11 },
  ];

  const handleNavigate = () => {
    const notificationStatus = statusMapping.find(
      (status) => status.label === item.notifi_Type
    );

    if (!notificationStatus) {
      console.warn("Unknown notification type:", item.notifi_Type);
      return;
    }

    // Điều hướng đến màn hình và tab tương ứng
    const { screen, tab, status } = notificationStatus;
    if (screen === "HistoryItemConsign" && tab !== undefined) {
      navigation.navigate(screen, { tab });
    } else if (screen === "InvoiceList" && status !== undefined) {
      navigation.navigate(screen, { status });
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
      <Text className="mb-2 font-semibold text-gray-600">
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
          <Text className="mb-1 ml-1 text-lg font-bold">
            {formatTitleText(item.title)}
          </Text>
          <Text className="ml-1 text-sm text-gray-600">{item.description}</Text>
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
