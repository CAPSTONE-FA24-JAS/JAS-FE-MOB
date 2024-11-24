import { useState, useCallback, useRef, useEffect } from "react";
import {
  HubConnectionBuilder,
  HubConnection,
  LogLevel,
} from "@microsoft/signalr";
import axios from "axios";

const API_BASE_URL = process.env.EXPO_PUBLIC_API_URL;

export interface Message {
  currentPrice: number;
  bidTime: string;
  status: string;
  customerId: string;
  firstName?: string;
  lastName?: string;
  lotId?: number;
}

interface UseBiddingResult {
  isConnected: boolean;
  endTime: string;
  highestPrice: number;
  messages: Message[];
  setMessages: React.Dispatch<React.SetStateAction<Message[]>>;
  error: string | null;
  joinLiveBiddingMethod3: (
    accountId: string | number,
    lotId: string | number
  ) => Promise<void>;
  sendBid: (price: number) => Promise<void>;
  disconnect: () => Promise<void>;
  isEndAuctionMedthod3: boolean;
  winnerCustomer: string;
  winnerPrice: string;
  resultBidding: string;
  setResultBidding: React.Dispatch<React.SetStateAction<string>>;
  isEndLot: boolean;
  status: string;
}

export function useBiddingMethod3(): UseBiddingResult {
  const [isConnected, setIsConnected] = useState(false);
  const [highestPrice, setHighestPrice] = useState<number>(0);
  const [messages, setMessages] = useState<Message[]>([]);
  const [endTime, setEndTime] = useState<string>("");
  const [error, setError] = useState<string | null>(null);
  const [isEndAuctionMedthod3, setIsEndAuctionMedthod3] =
    useState<boolean>(false);
  const [winnerCustomer, setWinnerCustomer] = useState<string>("");
  const [winnerPrice, setWinnerPrice] = useState<string>("");
  const [resultBidding, setResultBidding] = useState<string>("");
  const [isEndLot, setIsEndLot] = useState<boolean>(false);
  const [status, setStatus] = useState<string>("");

  const connectionRef = useRef<HubConnection | null>(null);

  const setupSignalRHandlers = useCallback((connection: HubConnection) => {
    // Xử lý sự kiện khi có người tham gia phòng đấu giá

    connection.on("JoinLot", (user: string, message: string) => {
      console.log(`${user}: ${message}`);
    });

    // Xử lý sự kiện cập nhật giá cao nhất
    connection.on("SendTopPrice", (price: number, bidTime: string) => {
      console.log(
        `Top price updated: ${price.toLocaleString("vi-VN", {
          style: "currency",
          currency: "VND",
        })} at ${bidTime}`
      );
      setHighestPrice(price);
    });

    // Xử lý sự kiện cập nhật thời gian kết thúc
    connection.on("SendEndTimeLot", (lotId: number, newEndTime: string) => {
      console.log(`End time updated for lot ${lotId}: ${newEndTime}`);
      setEndTime(newEndTime);
    });

    //get all history bid
    connection.on("SendHistoryBiddingOfLot", (bids: Message[]) => {
      if (Array.isArray(bids) && bids.length > 0) {
        setMessages(bids);
      } else {
        setMessages([]);
      }
    });

    // sau khi bid xong sẽ gửi về kết quả
    connection.on(
      "SendBiddingPrice",
      (customerId: string, price: string, bidTime: string) => {
        console.log("New bid from chưa handle", customerId, price, bidTime);

        setMessages((prevMessages) => {
          const newBid = {
            currentPrice: Number(price),
            bidTime: bidTime,
            customerId: customerId,
            status: "Processing",
          };
          // Nếu messages rỗng, trả về mảng chỉ có bid mới
          if (!prevMessages || prevMessages.length === 0) {
            return [newBid];
          }
          // Ngược lại thêm bid mới vào mảng hiện tại
          return [...prevMessages, newBid];
        });
      }
    );

    // Xử lý sự kiện khi đã xử lý lệnh bidding đó
    connection.on(
      "SendBiddingPriceAfterProcessingStream",
      (cusid: string, price: number, bidtime: string, status: string) => {
        console.log(
          `Processed bid from ${cusid}: ${price.toLocaleString("vi-VN", {
            style: "currency",
            currency: "VND",
          })} at ${bidtime} with status ${status}`
        );

        const newBid = {
          currentPrice: Number(price),
          bidTime: bidtime,
          customerId: cusid,
          status: status,
        };

        setMessages((prev) => {
          // Nếu không có bid nào trước đó, thêm bid này vào
          if (!prev || prev.length === 0) {
            return [newBid];
          }

          // Nếu đã có bid, cập nhật trạng thái của bid hiện tại
          return prev.map((message) =>
            message.customerId === cusid &&
            message.status === "Processing" &&
            message.currentPrice === price &&
            message.bidTime === bidtime
              ? { ...message, status: status }
              : message
          );
        });
      }
    );

    // end lot asap use for disable bidding btn
    connection.on("AuctionPublicEnded", (message: string) => {
      console.log(`${message}`);
      setIsEndLot(true);
    });

    //sendresultcheckcurrentprice
    // khi end auction tổng kết kết quả
    connection.on(
      "AuctionEndedWithWinnerPublic",
      (message: string, customerId: string, price: number) => {
        setIsEndAuctionMedthod3(true);
        setWinnerCustomer(customerId);
        setWinnerPrice(price.toString());
        console.log(
          `${message} customerID ${customerId} at price ${price.toLocaleString(
            "vi-VN",
            {
              style: "currency",
              currency: "VND",
            }
          )}`
        );
      }
    );

    connection.on("StatusBid", (status: string) => {
      console.log("StatusBid ////////////////////////////", status);
      setStatus(status);
    });

    connection.on("UpdateStatusBid", (status: string) => {
      console.log("UpdateStatusBid", status);
      setStatus(status);
    });

    // validate price
    // connection.on(
    //   "SendResultCheckCurrentPrice",
    //   (message: string, price: number) => {
    //     console.log(`${message} price ${price}`);
    //     setResultBidding(`${message} : ${price}`);
    //   }
    // );
  }, []);

  const joinLiveBiddingMethod3 = useCallback(
    async (accountId: string | number, lotId: string | number) => {
      try {
        if (connectionRef.current) {
          await connectionRef.current.stop();
        }

        const connection = new HubConnectionBuilder()
          .withUrl(`${API_BASE_URL}/auctionning`)
          .withAutomaticReconnect()
          .configureLogging(LogLevel.Information)
          .build();

        setupSignalRHandlers(connection); //method 3

        // Xử lý các sự kiện kết nối
        connection.onclose(() => {
          setIsConnected(false);
          setError("Connection closed");
        });

        connection.onreconnecting(() => {
          setIsConnected(false);
          setError("Attempting to reconnect...");
        });

        connection.onreconnected(() => {
          setIsConnected(true);
          setError(null);
        });

        await connection.start();
        console.log("SignalR Connection established");

        const connectionId = connection.connectionId;
        if (!connectionId) {
          throw new Error("Failed to get connection ID");
        }

        // Gọi API để tham gia phòng đấu giá
        const response = await axios.post(
          `${API_BASE_URL}/api/BidPrices/JoinBid/join`,
          {
            accountId: Number(accountId),
            lotId: Number(lotId),
            connectionId,
          }
        );

        if (!response.data.isSuccess) {
          throw new Error(response.data.message);
        }

        connectionRef.current = connection;
        setIsConnected(true);
        setError(null);
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "Failed to establish connection";
        setError(errorMessage);
        console.error("SignalR connection error:", err);
      }
    },
    [setupSignalRHandlers]
  );

  const sendBid = useCallback(async (price: number) => {
    if (!connectionRef.current?.connectionId) {
      setError("No active connection");
      return;
    }

    const body = {
      currentPrice: price,
      bidTime: new Date().toISOString(),
      connectionId: connectionRef.current.connectionId,
    };

    console.log("body method 3", body);

    try {
      const response = await axios.post(
        `${API_BASE_URL}/api/BidPrices/PlaceBiding/place-bid`,
        body
      );

      if (!response.data.isSuccess) {
        throw new Error(response.data.message);
      }
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to place bid";
      setError(errorMessage);
      console.error("Error placing bid method 3:", err);
    }
  }, []);

  const disconnect = useCallback(async () => {
    if (connectionRef.current) {
      try {
        await connectionRef.current.stop();
        connectionRef.current = null;
        setIsConnected(false);
        setMessages([]);
        setHighestPrice(0);
        setEndTime("");
        setError(null);
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "Failed to disconnect";
        setError(errorMessage);
        console.error("Error disconnecting:", err);
      }
    }
  }, []);

  // Cleanup khi component unmount
  useEffect(() => {
    return () => {
      disconnect();
    };
  }, [disconnect]);

  return {
    isConnected,
    endTime,
    highestPrice,
    messages,
    setMessages,
    error,
    joinLiveBiddingMethod3,
    sendBid,
    disconnect,
    isEndAuctionMedthod3,
    winnerCustomer,
    winnerPrice,
    resultBidding,
    setResultBidding,
    isEndLot,
    status,
  };
}
