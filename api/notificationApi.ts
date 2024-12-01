import { Notification } from "@/app/types/notification_type";
import { Response, ResponseList } from "@/app/types/respone_type";
import axios from "axios";

const API_URL = process.env.EXPO_PUBLIC_API_URL || "http://localhost:7251";

export const getNotificationByAccountId = async (
  accountId: number,
  pageIndex: number,
  pageSize: number
) => {
  try {
    console.log(
      "notification",
      `${API_URL}/api/Notifications/getNotificationsByAccount?accountId=${accountId}&pageIndex=${pageIndex}&pageSize=${pageSize}`
    );

    const response = await axios.get<Response<ResponseList<Notification>>>(
      `${API_URL}/api/Notifications/getNotificationsByAccount?accountId=${accountId}&pageIndex=${pageIndex}&pageSize=${pageSize}`
    );
    console.log("notification");

    if (response.data.isSuccess) {
      console.log("data noti", response.data.data.dataResponse);

      return response.data.data;
    } else {
      throw new Error("Failed to fetch notification");
    }
  } catch (error) {
    console.error("Error fetching notification by account ID:", error);
    throw error;
  }
};

// API để đánh dấu thông báo là đã đọc
export const markNotificationAsReadByAccount = async (
  notificationId: number
) => {
  try {
    // Gửi yêu cầu PUT để đánh dấu thông báo đã đọc
    const response = await axios.put<Response<Notification>>(
      `${API_URL}/api/Notifications/markNotificationAsReadByAccount?notificationId=${notificationId}`,
      { notificationId }
    );

    // Kiểm tra phản hồi từ API
    if (response.data.isSuccess && response.data.data) {
      console.log("Notification marked as read:", response.data.data);
      return response.data.data; // Trả về dữ liệu thông báo đã được cập nhật
    } else {
      console.error(
        "Failed to mark notification as read. Error:",
        response.data.message
      );
      throw new Error(
        response.data.message || "Failed to mark notification as read"
      );
    }
  } catch (error) {
    console.error("Error marking notification as read:", error); // Ghi lại chi tiết lỗi
    throw error;
  }
};
