import React, { useCallback, useState } from "react";
import {
  View,
  FlatList,
  ActivityIndicator,
  TouchableOpacity,
  Text,
  RefreshControl,
} from "react-native";
import { useFocusEffect } from "expo-router";
import { getNotificationByAccountId } from "@/api/notificationApi";
import { Notification } from "@/app/types/notification_type";
import NotificationItem from "../ItemNotification";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import { showErrorMessage } from "../FlashMessageHelpers";

const Notifications: React.FC = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [pageIndex, setPageIndex] = useState(1);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [totalItems, setTotalItems] = useState(0);
  const pageSize = 10;

  const accountId = useSelector(
    (state: RootState) => state.auth.userResponse?.id
  );

  const hasMore = notifications.length < totalItems;

  const fetchNotifications = async (page: number, shouldRefresh = false) => {
    if (!accountId) {
      showErrorMessage("Something went wrong. Please try again later.");
      return;
    }

    try {
      setLoading(true);
      const response = await getNotificationByAccountId(
        accountId.toString(),
        page.toString(),
        pageSize.toString()
      );

      const newNotifications = Array.isArray(response.dataResponse)
        ? response.dataResponse
        : [];

      setTotalItems(response.totalItemRepsone);

      if (shouldRefresh) {
        setNotifications(newNotifications);
      } else {
        setNotifications((prevNotifications) => [
          ...prevNotifications,
          ...newNotifications,
        ]);
      }
    } catch (error) {
      console.error("Error fetching notifications:", error);
      showErrorMessage("Failed to load notifications");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      setPageIndex(1);
      fetchNotifications(1, true);
    }, [accountId])
  );

  const handleLoadMore = () => {
    if (!loading && hasMore) {
      const nextPage = pageIndex + 1;
      setPageIndex(nextPage);
      fetchNotifications(nextPage);
    }
  };

  const handleRefresh = () => {
    setRefreshing(true);
    setPageIndex(1);
    fetchNotifications(1, true);
  };

  const renderFooter = () => {
    if (loading) {
      return (
        <View className="py-4">
          <ActivityIndicator size="small" color="#0000ff" />
        </View>
      );
    }

    if (!hasMore) {
      return (
        <Text className="py-4 text-center text-gray-500">
          No more notifications
        </Text>
      );
    }

    return (
      <TouchableOpacity
        onPress={handleLoadMore}
        className="px-4 py-2 mx-4 my-2 bg-blue-500 rounded-lg">
        <Text className="font-medium text-center text-white">Show More</Text>
      </TouchableOpacity>
    );
  };

  const renderEmpty = () => (
    <View className="items-center justify-center flex-1 py-8">
      <Text className="text-lg text-gray-500">No notifications found</Text>
    </View>
  );

  return (
    <View className="flex-1 py-2 bg-white">
      <FlatList
        data={notifications}
        renderItem={({ item }) => <NotificationItem item={item} />}
        keyExtractor={(item, index) => `${item.id || index}`}
        ListFooterComponent={renderFooter}
        ListEmptyComponent={renderEmpty}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={handleRefresh}
            colors={["#0000ff"]}
          />
        }
        className="flex-1"
      />
    </View>
  );
};

export default Notifications;
