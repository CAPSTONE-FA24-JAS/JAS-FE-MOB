import { useState, useCallback, useRef, useEffect } from "react";
import {
  HubConnectionBuilder,
  HubConnection,
  LogLevel,
} from "@microsoft/signalr";
import axios from "axios";

const API_BASE_URL = process.env.EXPO_PUBLIC_API_URL || "http://localhost:7251";

interface Message {
  customerId: string;
  currentPrice: number;
  bidTime: string;
}

interface UseBiddingResult {
  isConnected: boolean;
  endTime: string;
  highestPrice: number;
  messages: Message[];
  error: string | null;
  joinChatRoom: (
    accountId: string | number,
    lotId: string | number,
    methodBid: string
  ) => Promise<void>;
  sendBid: (price: number) => Promise<void>;
  sendBidMethod4: (price: number) => Promise<void>;
  disconnect: () => Promise<void>;
  isEndAuctionMedthod3: boolean;
  winnerCustomer: string;
  winnerPrice: string;
  reducePrice: number;
  resultBidding: string;
  setResultBidding: React.Dispatch<React.SetStateAction<string>>;
  isEndLot: boolean;
  isEndAuctionMethod4: boolean;
}

export function useBidding(): UseBiddingResult {
  const [isConnected, setIsConnected] = useState(false);
  const [highestPrice, setHighestPrice] = useState<number>(0);
  const [messages, setMessages] = useState<Message[]>([]);
  const [endTime, setEndTime] = useState<string>("");
  const [error, setError] = useState<string | null>(null);
  const [isEndAuctionMedthod3, setIsEndAuctionMedthod3] =
    useState<boolean>(false);
  const [winnerCustomer, setWinnerCustomer] = useState<string>("");
  const [winnerPrice, setWinnerPrice] = useState<string>("");
  const [reducePrice, setReducePrice] = useState<number>(0);
  const [resultBidding, setResultBidding] = useState<string>("");
  const [isEndLot, setIsEndLot] = useState<boolean>(false);
  const [isEndAuctionMethod4, setIsEndAuctionMethod4] =
    useState<boolean>(false);

  const connectionRef = useRef<HubConnection | null>(null);

  const setupSignalRMethod4 = useCallback((connection: HubConnection) => {
    connection.on("JoinLot", (user: string, message: string) => {
      console.log(`${user}: ${message}`);
    });
    //await _hubContext.Clients.Group(lotGroupName).SendAsync("SendBiddingPriceforReducedBidding", "Phiên đã kết thúc!", customerId, request.CurrentPrice, request.BidTime);

    ///ket thuc lot dau gia
    connection.on(
      "SendBiddingPriceforReducedBidding",
      (msg: string, cusid: string, currentPrice: string, time: string) => {
        console.log(
          `Current price updated: ${msg} at ${time} by ${cusid} with price ${currentPrice}`
        );
        setWinnerCustomer(cusid);
        setWinnerPrice(currentPrice);
        setIsEndAuctionMethod4(true);
        setReducePrice(Number(currentPrice));
      }
    );

    connection.on("SendEndTimeLot", (lotId: number, newEndTime: string) => {
      console.log(`End time updated for lot ${lotId}: ${newEndTime}`);
      setEndTime(newEndTime);
    });

    connection.on(
      "CurrentPriceForReduceBiddingWhenStartLot",
      (msg: string, currPrice: string, dateNow: string) => {
        console.log(`${msg} currentPricessssdasdss ${currPrice} at ${dateNow}`);
        setReducePrice(Number(currPrice));
      }
    );
    //await _hubContext.Clients.Group(lotGroupName).SendAsync("SendCurrentPriceForReduceBidding", lot.CurrentPrice);

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
      console.log(`All bids`, bids);
      if (bids) {
        setMessages(bids);
      }
    });

    // Xử lý sự kiện khi có người đặt giá
    connection.on(
      "SendBiddingPrice",
      (customerId: string, price: number, bidTime: string) => {
        console.log(
          `New bid from ${customerId}: ${price.toLocaleString("vi-VN", {
            style: "currency",
            currency: "VND",
          })} at ${bidTime}`
        );
        setMessages((prev) => [
          ...prev,
          {
            customerId,
            currentPrice: price,
            bidTime,
          },
        ]);
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
      "AuctionEndedWithWinner",
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

    connection.on(
      "SendResultCheckCurrentPrice",
      (message: string, price: number) => {
        console.log(`${message} price ${price}`);
        setResultBidding(`${message} : ${price}`);
      }
    );
  }, []);

  const joinChatRoom = useCallback(
    async (
      accountId: string | number,
      lotId: string | number,
      methodBid: string
    ) => {
      try {
        if (connectionRef.current) {
          await connectionRef.current.stop();
        }

        const connection = new HubConnectionBuilder()
          .withUrl(`${API_BASE_URL}/auctionning`)
          .withAutomaticReconnect()
          .configureLogging(LogLevel.Information)
          .build();

        if (methodBid === "Public_Auction") {
          console.log("methodBid", methodBid);

          setupSignalRHandlers(connection); //method 3
        } else {
          console.log("methodBid", methodBid);

          setupSignalRMethod4(connection);
        }

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
    error,
    joinChatRoom,
    sendBid,
    sendBidMethod4,
    disconnect,
    isEndAuctionMedthod3,
    winnerCustomer,
    winnerPrice,
    reducePrice,
    resultBidding,
    setResultBidding,
    isEndLot,
    isEndAuctionMethod4,
  };
}
