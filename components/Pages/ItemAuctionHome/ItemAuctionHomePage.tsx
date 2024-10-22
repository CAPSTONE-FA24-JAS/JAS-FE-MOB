// ItemAuctionHomePage.tsx

import React from "react";
import { Text, Image, TouchableOpacity, View } from "react-native";
import { LinearGradient } from "expo-linear-gradient"; // Import từ expo-linear-gradient
import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { AuctionsData } from "@/app/types/auction_type";
import { styled } from "nativewind"; // Import styled từ nativewind

// Định nghĩa các loại cho navigation
type RootStackParamList = {
  BiddingAuction: { auctionId: number };
};

type ItemAuctionHomePageProps = {
  auction: AuctionsData;
};

// Sử dụng styled để hỗ trợ các thành phần không hỗ trợ className trực tiếp
const StyledLinearGradient = styled(LinearGradient);
const StyledTouchableOpacity = styled(TouchableOpacity);
const StyledImage = styled(Image);
const StyledView = styled(View);
const StyledText = styled(Text);

const ItemAuctionHomePage: React.FC<ItemAuctionHomePageProps> = ({
  auction,
}) => {
  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();

  const goToAuctionDetail = () => {
    if (auction.id) {
      navigation.navigate("BiddingAuction", { auctionId: auction.id });
    }
  };

  return (
    <StyledTouchableOpacity
      className="w-[98%] py-1 mb-4 relative"
      onPress={goToAuctionDetail}
    >
      <StyledImage
        className="w-full h-48 rounded-lg"
        source={
          auction?.imageLink?.startsWith("http")
            ? { uri: auction.imageLink }
            : require("../../../assets/bgItemAuction.png")
        }
        resizeMode="cover"
      />
      {/* Lớp phủ gradient */}
      <StyledLinearGradient
        colors={["transparent", "rgba(0,0,0,0.6)"]}
        className="absolute left-0 right-0 bottom-0 h-36 rounded-lg"
      />
      {/* Nội dung văn bản */}
      <StyledView className="absolute bottom-5 left-4 right-4">
        <StyledText className="text-white text-lg font-bold mb-1">
          #{auction.id} | {auction?.name || "Unnamed Auction"} -{" "}
          {auction?.status ? auction?.status : "Upcoming"}
        </StyledText>
        <StyledText className="text-white text-sm font-bold mb-0.5">
          Live bidding begins:
        </StyledText>
        <StyledText className="text-white text-sm font-bold mb-0.5">
          {new Date(auction?.startTime).toLocaleString("en-US", {
            timeZone: "GMT",
          })}{" "}
          -{" "}
          {new Date(auction?.endTime).toLocaleString("en-US", {
            timeZone: "GMT",
          })}
        </StyledText>
        <StyledText className="text-white text-sm font-semibold">
          Total lot {auction?.totalLot || 0}
        </StyledText>
      </StyledView>
    </StyledTouchableOpacity>
  );
};

export default ItemAuctionHomePage;
