import { useEffect, useState } from "react";
import * as signalR from "@microsoft/signalr";

export const useSignalR = (url: string, accountId: number | undefined) => {
  const [connection, setConnection] = useState<signalR.HubConnection | null>(
    null
  );
  const [realTimeNotifications, setRealTimeNotifications] = useState<any[]>([]);

  console.log("connectionHUB", connection);

  useEffect(() => {
    if (!accountId) return;

    const initConnection = async () => {
      const hubConnection = new signalR.HubConnectionBuilder()
        .withUrl(url)
        .withAutomaticReconnect()
        .build();

      hubConnection.on("SpecificChatRoom", (notification) => {
        console.log("Real-time notification received:", notification);
        setRealTimeNotifications((prev) => [notification, ...prev]); // Thêm thông báo mới
      });

      try {
        await hubConnection.start();
        console.log("SignalR connected");
        await hubConnection.invoke("SpecificChatRoom", accountId);
        console.log("Account registered with SignalR:", accountId);
      } catch (error) {
        console.error("SignalR connection failed:", error);
      }

      setConnection(hubConnection);
    };

    initConnection();

    return () => {
      if (connection) {
        connection
          .stop()
          .catch((err) => console.error("Error stopping SignalR:", err));
      }
    };
  }, [url, accountId]);

  return { connection, realTimeNotifications };
};
