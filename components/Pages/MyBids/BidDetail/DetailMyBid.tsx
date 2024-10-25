import React, { useCallback, useEffect, useState } from "react";
import {
  View,
  Text,
  SafeAreaView,
  ActivityIndicator,
  Modal,
} from "react-native";
import { RouteProp, useRoute } from "@react-navigation/native";
import { TouchableOpacity } from "react-native-gesture-handler";
import ItemBidCard from "./ItemBidCard";
import AddressInfo from "./AddressInfo";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import TimeLineBid from "./TimeLineBid";
import { useFocusEffect, useNavigation } from "expo-router";
import { StackNavigationProp } from "@react-navigation/stack";
import { DataCurentBidResponse, MyBidData } from "@/app/types/bid_type";
import { getMyBidByCustomerLotId } from "@/api/bidApi";
import { showErrorMessage } from "@/components/FlashMessageHelpers";
import { AddressListData } from "@/app/types/address_type";
import { getAddressesByCustomerId } from "@/api/addressApi";
import ChooseAddress from "../../Address/ChooseAddress";

type RootStackParamList = {
  DetailMyBid: {
    isWin?: boolean;
    title: string;
    lotNumber: string;
    soldPrice?: string;
    id: number;
    status: string;
    typeBid: string;
    minPrice: number;
    maxPrice: number;
    image: string;
    endTime: string;
    startTime: string;
    yourMaxBid?: number;
    itemBid: DataCurentBidResponse;
  };
  InvoiceDetail: undefined;
  InvoiceDetailConfirm: undefined;
};

const DetailMyBid: React.FC = () => {
  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();
  const route = useRoute<RouteProp<RootStackParamList, "DetailMyBid">>();
  const {
    isWin,
    title,
    lotNumber,
    soldPrice,
    id,
    status,
    typeBid,
    minPrice,
    maxPrice,
    image,
    endTime,
    startTime,
    yourMaxBid,
    itemBid,
  } = route.params;

  const user = useSelector((state: RootState) => state.auth.userResponse);
  console.log("User:", user);
  const userId = useSelector(
    (state: RootState) => state.auth.userResponse?.customerDTO?.id
  );
  const statusColor = isWin ? "text-green-600" : "text-red-600";

  const [itemDetailBid, setItemDetailBid] = useState<MyBidData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  const [defaultAddress, setDefaultAddress] = useState<AddressListData | null>(
    null
  );

  // State to control the visibility of the EditAddress modal
  const [addresses, setAddresses] = useState<AddressListData[]>([]); // Add addresses state
  const [isChooseModalVisible, setChooseModalVisible] =
    useState<boolean>(false);

  // console.log("itemDetailBid", itemDetailBid);
  // console.log("itemBid in Detail", itemBid);
  console.log("defaultAddress", defaultAddress);

  // Fetch bid details and addresses when the component is mounted
  const fetchBidDetails = async () => {
    try {
      if (itemBid.id) {
        const response = await getMyBidByCustomerLotId(itemBid.id);
        if (response?.isSuccess) {
          setItemDetailBid(response.data);
        } else {
          showErrorMessage(response?.message || "Failed to load bid details.");
        }
      }
      if (userId) {
        const addressResponse = await getAddressesByCustomerId(userId);
        console.log("addressResponse", addressResponse);

        if (addressResponse?.isSuccess) {
          setAddresses(addressResponse.data); // Set addresses state
          const defaultAddr = addressResponse.data.find(
            (address) => address.isDefault
          );
          if (defaultAddr) {
            setDefaultAddress(defaultAddr);
          }
        } else {
          showErrorMessage(
            addressResponse?.message || "Failed to load addresses."
          );
        }
      }
    } catch (error) {
      showErrorMessage("Unable to retrieve bid details.");
    } finally {
      setLoading(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      setLoading(true); // Show loading spinner
      fetchBidDetails();
    }, [itemBid.id, userId])
  );

  // Function to open the EditAddress modal
  const handleChooseAddress = () => {
    setChooseModalVisible(true);
  };

  // Function to handle saving the selected address from the modal
  const handleSaveSelectedAddress = (address: AddressListData) => {
    setDefaultAddress(address);
    setChooseModalVisible(false);
  };

  if (loading) {
    return (
      <View className="flex-1 justify-center items-center">
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }
  const handleViewInvoice = () => {
    navigation.navigate("InvoiceDetail");
  };

  const handleConfirmInvoice = () => {
    navigation.navigate("InvoiceDetailConfirm");
  };

  return (
    <View className="flex-1 bg-white">
      <ItemBidCard
        key={id}
        id={id}
        statusColor={statusColor}
        isWin={isWin ? true : false}
        title={title}
        lotNumber={lotNumber}
        soldPrice={soldPrice ? soldPrice : ""}
        status={status}
        typeBid={typeBid}
        minPrice={minPrice}
        maxPrice={maxPrice}
        image={image}
        endTime={endTime}
        startTime={startTime}
        yourMaxBid={yourMaxBid ? yourMaxBid : 0}
        itemDetailBid={itemDetailBid || ({} as MyBidData)}
      />
      {user && isWin && userId && defaultAddress && (
        <AddressInfo
          user={{
            ...user,
            phoneNumber: user.phoneNumber || "",
            firstName: user.customerDTO.firstName || "",
            lastName: user.customerDTO.lastName || "",
            address: defaultAddress.addressLine,
          }}
          onChooseAddress={handleChooseAddress} // Pass the function to trigger the modal
        />
      )}
      <TimeLineBid />
      {/* {status === "pending" ? ( */}
      <TouchableOpacity
        className="bg-blue-500 p-3 mx-4 rounded mt-4"
        onPress={handleConfirmInvoice}
      >
        <Text className="text-white text-center font-semibold uppercase text-base">
          Confirm Invoice
        </Text>
      </TouchableOpacity>
      {/* ) : ( */}
      <TouchableOpacity
        className="bg-blue-500 p-3  mx-4 rounded my-4"
        onPress={handleViewInvoice}
      >
        <Text className="text-white text-center font-semibold uppercase text-base">
          View Invoice
        </Text>
      </TouchableOpacity>
      {/* )} */}

      {/* Render EditAddress as a modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={isChooseModalVisible}
        onRequestClose={() => setChooseModalVisible(false)}
      >
        <ChooseAddress
          addresses={addresses}
          selectedAddress={defaultAddress}
          onSave={handleSaveSelectedAddress}
          onCancel={() => setChooseModalVisible(false)}
        />
      </Modal>
    </View>
  );
};

export default DetailMyBid;
