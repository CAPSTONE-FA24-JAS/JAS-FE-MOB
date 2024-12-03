// components/Modals/SecretAuctionBidModal.tsx

import { LotDetail } from "@/app/types/lot_type";
import { RootState } from "@/redux/store";
import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  TextInput,
  StyleSheet,
} from "react-native";
import DropDownPicker from "react-native-dropdown-picker";
import { useSelector } from "react-redux";

interface SecretAuctionBidModalProps {
  isVisible: boolean;
  onClose: () => void;
  minPrice: number;
  onSubmit: (bidAmount: number) => Promise<void>;
  item: LotDetail;
}

const SecretAuctionBidModal: React.FC<SecretAuctionBidModalProps> = ({
  isVisible,
  onClose,
  minPrice,
  onSubmit,
  item,
}) => {
  const [step, setStep] = useState<number>(10000); // Default step
  const [open, setOpen] = useState<boolean>(false);
  const [items, setItems] = useState<{ label: string; value: number }[]>([
    { label: "20,000", value: 20000 },
    { label: "50,000", value: 50000 },
    { label: "100,000", value: 100000 },
    { label: "500,000", value: 500000 },
    { label: "1,000,000", value: 1000000 },
  ]);

  const [bidAmount, setBidAmount] = useState<number>(minPrice);
  const [errorMessage, setErrorMessage] = useState<string>("");
  const priceLimit = useSelector(
    (state: RootState) => state.auth.userResponse?.customerDTO?.priceLimit
  );

  const handleBidChange = (value: string) => {
    const numericValue = Number(value);
    if (!isNaN(numericValue)) {
      setBidAmount(numericValue); // Keep string input for edge cases
    } else {
      setBidAmount(minPrice);
      setErrorMessage("Invalid input");
    }
  };

  const increaseBid = () => {
    const nextBid = bidAmount + step;
    if (nextBid) {
      setBidAmount(nextBid);
      setErrorMessage(""); // Clear error
    }
  };

  const decreaseBid = () => {
    const nextBid = bidAmount - step;
    if (nextBid >= 0) {
      setBidAmount(nextBid);
      setErrorMessage(""); // Clear error
    }
    if (nextBid < minPrice) {
      setBidAmount(minPrice);
      setErrorMessage("Bid must be greater than start price");
    }
  };

  const handleSubmit = () => {
    if (item.haveFinancialProof && bidAmount > priceLimit) {
      setErrorMessage("Bid must be lower than your price limit");
      return;
    } else if (
      !errorMessage &&
      typeof bidAmount === "number" &&
      bidAmount >= minPrice
    ) {
      onSubmit(Number(bidAmount)).then(() => onClose());
      setBidAmount(minPrice); // Reset to minPrice after submission
    }
  };

  return (
    <Modal visible={isVisible} transparent animationType="slide">
      <View className="items-center justify-center flex-1 bg-opacity-50 bg-black/50">
        <View className="bg-white p-6 rounded-lg w-[90%]">
          <Text className="mb-4 text-lg font-bold text-center text-blue-500 uppercase">
            Enter Your Bid
          </Text>
          <Text className="text-base font-semibold text-center text-gray-600">
            Minimum bid:{" "}
            {minPrice.toLocaleString("vi-VN", {
              style: "currency",
              currency: "VND",
            })}
          </Text>
          {/* <Text className="mb-4 text-base font-semibold text-center text-gray-600">
            Maximum bid:{" "}
            {maxPrice.toLocaleString("vi-VN", {
              style: "currency",
              currency: "VND",
            })}
          </Text> */}
          <View className="flex-row items-center justify-center w-full mb-6">
            <DropDownPicker
              open={open}
              value={step}
              items={items}
              setOpen={setOpen}
              setValue={setStep}
              setItems={setItems}
              style={styles.picker}
              containerStyle={{ width: 100, marginRight: 10 }}
            />
            <TouchableOpacity
              onPress={decreaseBid}
              className="px-4 py-2 bg-gray-300 rounded">
              <Text className="text-black">-</Text>
            </TouchableOpacity>
            <TextInput
              style={styles.input}
              keyboardType="numeric"
              value={String(bidAmount)}
              returnKeyType="done"
              onChangeText={handleBidChange}
            />
            <TouchableOpacity
              onPress={increaseBid}
              className="px-4 py-2 bg-gray-300 rounded">
              <Text className="text-black">+</Text>
            </TouchableOpacity>
          </View>
          {errorMessage ? (
            <Text style={styles.error}>{errorMessage}</Text>
          ) : null}
          <View className="flex-row justify-around mt-4">
            <TouchableOpacity
              onPress={onClose}
              className="px-4 py-2 bg-gray-300 w-[45%] rounded">
              <Text className="font-semibold text-center text-black">
                Cancel
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={handleSubmit}
              className={`px-4 py-2 w-[45%] rounded ${
                errorMessage ? "bg-gray-300" : "bg-blue-500"
              }`}
              disabled={!!errorMessage}>
              <Text
                className={`text-center font-semibold ${
                  errorMessage ? "text-gray-500" : "text-white"
                }`}>
                Submit
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 8,
    marginHorizontal: 10,
    textAlign: "center",
    width: 120,
    borderRadius: 4,
    fontWeight: "bold",
    fontSize: 16,
  },
  error: {
    color: "red",
    fontSize: 14,
    textAlign: "center",
  },
  picker: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 4,
    padding: 10,
    textAlign: "center",
  },
});

export default SecretAuctionBidModal;
