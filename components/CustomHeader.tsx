// /components/CustomHeader.tsx
import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { DrawerNavigationProp } from "@react-navigation/drawer";
import { ParamListBase } from "@react-navigation/routers";
import { createSelector } from "@reduxjs/toolkit";
import { RootState } from "@/redux/store";
import { useSelector } from "react-redux";

interface CustomHeaderProps {
  title: string;
}

const CustomHeader: React.FC<CustomHeaderProps> = ({ title }) => {
  const navigation = useNavigation<DrawerNavigationProp<ParamListBase>>();
  // Selector để lấy số lượng thông báo chưa đọc
  const selectUnreadNotificationsCount = createSelector(
    (state: RootState) => state.notifications.notifications,
    (notifications) => notifications.filter((notif) => !notif.is_Read).length
  );

  const unreadCount = useSelector(selectUnreadNotificationsCount);

  return (
    <View
      style={{
        flexDirection: "row",
        alignItems: "center",
        paddingHorizontal: 20,
        backgroundColor: "#fff",
        paddingTop: 50,
        paddingBottom: 20,
        justifyContent: "space-between",
        shadowColor: "#000", // Màu của shadow
        shadowOffset: { width: 0, height: 2 }, // Offset của shadow
        shadowOpacity: 0.25, // Độ mờ của shadow
        shadowRadius: 3.84, // Bán kính của shadow
        elevation: 5, // Độ cao của shadow (Android)
      }}
    >
      <TouchableOpacity
        onPress={() => navigation.openDrawer()}
        className="mx-4"
      >
        <MaterialCommunityIcons name="menu" size={24} color="black" />
      </TouchableOpacity>

      <View className="flex-row items-center justify-between flex-1 w-full">
        <Text className="font-bold text-2xl text-gray-800 mr-6 w-[80%] text-center">
          {title}
        </Text>

        <TouchableOpacity
          className="flex-row justify-end"
          onPress={() => navigation.navigate("Notification")}
        >
          <MaterialCommunityIcons
            name="bell"
            size={30}
            color="black"
            style={{ marginRight: 10 }}
          />
          {unreadCount > 0 && (
            <Text className="absolute -top-3 text-white font-bold -left-3 py-1 px-2 bg-[#3eaef4] rounded-full">
              {unreadCount}
            </Text>
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default CustomHeader;
