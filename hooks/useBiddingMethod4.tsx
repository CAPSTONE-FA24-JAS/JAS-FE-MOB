import { useState, useCallback, useRef, useEffect } from "react";
import {
  HubConnectionBuilder,
  HubConnection,
  LogLevel,
} from "@microsoft/signalr";
import axios from "axios";
import { Message } from "./useBiddingMethod3";

const API_BASE_URL = process.env.EXPO_PUBLIC_API_URL;

interface UseBiddingResult {
  isConnected: boolean;
  endTime: string;
  messages: Message[];
  error: string | null;
  joinLiveBiddingMethod4: (
    accountId: string | number,
    lotId: string | number
  ) => Promise<void>;
  sendBidMethod4: (price: number) => Promise<void>;
  disconnect: () => Promise<void>;
  winnerCustomer: string;
  winnerPrice: string;
  reducePrice: number;
  resultBidding: string;
  setResultBidding: React.Dispatch<React.SetStateAction<string>>;
  isEndAuctionMethod4: boolean;
}

export function useBiddingMethod4(): UseBiddingResult {
  const [isConnected, setIsConnected] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [endTime, setEndTime] = useState<string>("");
  const [error, setError] = useState<string | null>(null);
  useState<boolean>(false);
  const [winnerCustomer, setWinnerCustomer] = useState<string>("");
  const [winnerPrice, setWinnerPrice] = useState<string>("");
  const [reducePrice, setReducePrice] = useState<number>(0);
  const [resultBidding, setResultBidding] = useState<string>("");
  const [isEndAuctionMethod4, setIsEndAuctionMethod4] =
    useState<boolean>(false);

  const connectionRef = useRef<HubConnection | null>(null);

  const setupSignalRMethod4 = useCallback((connection: HubConnection) => {
    connection.on("JoinLot", (user: string, message: string) => {
      console.log(`${user}: ${message}`);
    });
    //await _hubContext.Clients.Group(lotGroupName).SendAsync("SendBiddingPriceforReducedBidding", "Phiên đã kết thúc!", customerId, request.CurrentPrice, request.BidTime);

    ///ket thuc lot dau gia co ng dau gia
    connection.on(
      "AuctionEndedReduceBidding",
      (msg: string, cusid: string, currentPrice: string) => {
        console.log(
          `Current price updated: ${msg} by ${cusid} with price ${currentPrice}`
        );
        setWinnerCustomer(cusid);
        setWinnerPrice(currentPrice);
        setReducePrice(Number(currentPrice));
        setIsEndAuctionMethod4(true);
      }
    );

    connection.on("SendAmountCustomerBid", (msg: string, amount: string) => {
      console.log(`Amount customer bid: ${msg} with amount ${amount}`);
      // setResultBidding(amount);
    });
    /// end auction nhuwng k co ai dau gia
    connection.on("AuctionEndedWithWinnerReduce", (msg: string) => {
      console.log(`Auction ended : ${msg}`);
      setIsEndAuctionMethod4(true);
    });

    //// sau khi mua xong thi het 1 chu ky giam gia la end lai nen can cap nhat lai
    connection.on(
      "SendEndTimeForReduceBidding",
      (msg: string, newEndTime: string) => {
        console.log(`End time updated for lot : ${newEndTime}`);
        setEndTime(newEndTime);
      }
    );

    connection.on(
      "CurrentPriceForReduceBiddingWhenStartLot",
      (msg: string, currPrice: string, dateNow: string) => {
        console.log(`${msg} currentPricessssdasdss ${currPrice} at ${dateNow}`);
        setReducePrice(Number(currPrice));
      }
    );

    connection.on(
      "SendCurrentPriceForReduceBidding", // khi moi vao lot
      (currentPrice: number, dateNow: string) => {
        console.log(`currentPrice first ${currentPrice} at ${dateNow}`);
        setReducePrice(() => currentPrice);
      }
    );

    connection.on(
      "ReducePriceBidding",
      (mess: string, currentPrice: number, time: string) => {
        console.log(`${mess} currentPrice ${currentPrice} at ${time}`);
        setReducePrice(() => currentPrice);
      }
    );
  }, []);

  const joinLiveBiddingMethod4 = useCallback(
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

        setupSignalRMethod4(connection);

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
    []
  );

  const sendBidMethod4 = useCallback(async (price: number) => {
    if (!connectionRef.current?.connectionId) {
      setError("No active connection");
      return;
    }

    const body = {
      currentPrice: price,
      bidTime: new Date().toISOString(),
      connectionId: connectionRef.current.connectionId,
    };
    console.log("body method 4", body);

    try {
      const response = await axios.post(
        `${API_BASE_URL}/api/BidPrices/PlaceBidForReduceBidding/place-bid-reduceBidding`,
        body
      );

      if (!response.data.isSuccess) {
        throw new Error(response.data.message);
      }
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to place bid method4";
      setError(errorMessage);
      console.error("Error placing bid:", err);
    }
  }, []);

  const disconnect = useCallback(async () => {
    if (connectionRef.current) {
      try {
        await connectionRef.current.stop();
        connectionRef.current = null;
        setIsConnected(false);
        setMessages([]);
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
    messages,
    error,
    joinLiveBiddingMethod4,
    sendBidMethod4,
    disconnect,
    winnerCustomer,
    winnerPrice,
    reducePrice,
    resultBidding,
    setResultBidding,
    isEndAuctionMethod4,
  };
}
