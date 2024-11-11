import { Notification } from "@/app/types/notification_type";
import { Response, ResponseList } from "@/app/types/respone_type";
import axios from "axios";

const API_URL = process.env.EXPO_PUBLIC_API_URL || "http://localhost:7251";

export const getNotificationByAccountId = async (
  accountId: string,
  pageIndex: string,
  pageSize: string
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
