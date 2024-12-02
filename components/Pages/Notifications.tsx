import {
  getNotificationByAccountId,
  markNotificationAsReadByAccount,
} from "@/api/notificationApi";
import { useSignalR } from "@/hooks/useSignalR";
import {
  markNotificationAsRead,
  setLoading,
  setNotifications,
  setTotalItems,
} from "@/redux/slices/notificationSlice";
import store, { RootState } from "@/redux/store";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Modal,
  RefreshControl,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { showErrorMessage } from "../FlashMessageHelpers";
import NotificationItem from "../ItemNotification";

const API_URL = process.env.EXPO_PUBLIC_API_URL || "http://localhost:7251";
const SIGNALR_URL = `${API_URL}/Notification`; // The SignalR hub URL

const Notifications: React.FC = () => {
  const dispatch = useDispatch<typeof store.dispatch>();
  const { notifications, loading, totalItems, loadingMark } = useSelector(
    (state: RootState) => state.notifications
  );
  const accountId = useSelector(
    (state: RootState) => state.auth.userResponse?.id
  );
  const { realTimeNotifications } = useSignalR(SIGNALR_URL, accountId); // Dùng hook để quản lý SignalR
  const [mergedNotifications, setMergedNotifications] = useState(notifications);
  const [refreshing, setRefreshing] = useState(false);
  const [modalVisible, setModalVisible] = useState(false); // State để hiển thị modal xác nhận

  const pageSize = 10;

  const hasMore = notifications.length < totalItems;

  console.log("notifications", notifications);

  // Đồng bộ notifications từ API và SignalR
  useEffect(() => {
    setMergedNotifications([...realTimeNotifications, ...notifications]);
  }, [realTimeNotifications, notifications]);

  // Fetch notifications from the API
  const fetchNotifications = async (page: number, shouldRefresh = false) => {
    if (!accountId) {
      showErrorMessage("Something went wrong. Please try again later.");
      return;
    }

    if (loading) return;

    try {
      dispatch(setLoading(true));
      const response = await getNotificationByAccountId(
        accountId,
        page,
        pageSize
      );
      console.log("responseNOti", response);

      const newNotifications = Array.isArray(response.dataResponse)
        ? response.dataResponse
        : [];

      dispatch(setNotifications(newNotifications));
      dispatch(setTotalItems(response.totalItemRepsone));
    } catch (error) {
      showErrorMessage("Failed to load notifications");
    } finally {
      dispatch(setLoading(false));
    }
  };

  // Fetch data on initial load or when accountId changes
  useEffect(() => {
    if (accountId) {
      fetchNotifications(1, true);
    }
  }, [accountId]);

  const handleLoadMore = () => {
    if (!loading && notifications.length < totalItems) {
      fetchNotifications(notifications.length / 10 + 1); // Load more based on pagination
    }
  };

  const handleRefresh = () => {
    fetchNotifications(1, true); // Refresh the list
  };

  const handleConfirmReadAll = async () => {
    dispatch(setLoading(true)); // Set loading state to true when marking as read

    try {
      // Lặp qua tất cả các thông báo chưa đọc và gọi API để đánh dấu là đã đọc
      for (const notification of unreadNotifications) {
        // Gọi API để đánh dấu thông báo là đã đọc
        const markedNotification = await markNotificationAsReadByAccount(
          notification.id
        );

        // Nếu API trả về thành công, dispatch action để cập nhật trạng thái
        if (markedNotification) {
          dispatch(markNotificationAsRead(notification.id)); // Cập nhật trạng thái trong Redux
        }
      }

      // Reload notifications after marking as read
      fetchNotifications(1, true);
      setModalVisible(false); // Close the modal after completion
    } catch (error) {
      showErrorMessage("Failed to mark notifications as read");
      console.error("Error marking notifications as read:", error);
    } finally {
      dispatch(setLoading(false)); // Reset loading state
    }
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
      return null;
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

  const unreadNotifications = notifications.filter((item) => !item.is_Read);

  const handleReadAll = () => {
    setModalVisible(true);
  };

  // Handle marking all unread notifications as read

  return (
    <View className="flex-1 py-2 bg-white">
      {unreadNotifications.length > 0 && (
        <TouchableOpacity
          className="flex-row justify-end"
          onPress={handleReadAll}>
          <Text className=" w-[100px] py-2 text-lg font-semibold italic text-gray-600">
            Read all
          </Text>
        </TouchableOpacity>
      )}
      <FlatList
        data={notifications}
        renderItem={({ item }) => <NotificationItem item={item} />}
        keyExtractor={(item, index) => `${item.id}-${index}`}
        ListFooterComponent={
          loading ? (
            <ActivityIndicator size="small" color="#0000ff" />
          ) : (
            <TouchableOpacity onPress={handleLoadMore}>
              <Text className="font-medium text-center text-white">
                Show More
              </Text>
            </TouchableOpacity>
          )
        }
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

      {/* Modal xác nhận */}
      <Modal
        visible={modalVisible}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setModalVisible(false)}>
        <View className="items-center justify-center flex-1 bg-opacity-50 bg-black/50">
          <View className="w-3/4 p-4 bg-white rounded-lg">
            <Text className="mb-4 text-lg font-semibold text-center">
              Are you sure you want to mark all unread notifications as read?
            </Text>
            <View className="flex-row justify-between">
              <TouchableOpacity
                onPress={() => setModalVisible(false)}
                className="px-4 py-2 w-[45%] bg-gray-300 rounded ">
                <Text className="font-semibold text-center uppercase">
                  Cancel
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={handleConfirmReadAll}
                disabled={loadingMark}
                className={`px-4 py-2 w-[45%] bg-blue-500 rounded ${
                  loadingMark ? "bg-gray-500" : "bg-blue-500"
                }`}>
                <Text className="font-semibold text-center text-white uppercase">
                  {loadingMark ? "Confirming..." : "Yes"}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default Notifications;
