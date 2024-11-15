import React, { useCallback, useEffect, useState } from "react";
import {
  View,
  Text,
  SafeAreaView,
  ActivityIndicator,
  Modal,
  Image,
} from "react-native";
import { RouteProp, useRoute } from "@react-navigation/native";
import { TouchableOpacity } from "react-native-gesture-handler";
import ItemBidCard from "./ItemBidCard";
import AddressInfo from "./AddressInfo";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import TimeLineBid from "./TimeLineBid";
import { useNavigation } from "expo-router";
import { DataCurentBidResponse, MyBidData } from "@/app/types/bid_type";
import { getMyBidByCustomerLotId } from "@/api/bidApi";
import { showErrorMessage } from "@/components/FlashMessageHelpers";
import { AddressListData } from "@/app/types/address_type";
import { getAddressesByCustomerId } from "@/api/addressApi";
import ChooseAddress from "../../Address/ChooseAddress";
import {
  HistoryCustomerLot,
  InvoiceDetailResponse,
  StatusInvoiceDto,
} from "@/app/types/invoice_type";
import {
  getDetailInvoice,
  updateAddressToShipForInvoice,
} from "@/api/invoiceApi";
import ImageGallery from "@/components/ImageGallery";
import LoadingOverlay from "@/components/LoadingOverlay";
import { StackNavigationProp } from "@react-navigation/stack";

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
    invoiceId?: number;
  };
  InvoiceDetail: {
    addressData: AddressListData;
    itemDetailBid: MyBidData;
    invoiceId: number;
    yourMaxBid: number;
    imagePayment: string;
    invoiceDetails: InvoiceDetailResponse;
  };
  InvoiceDetailConfirm: {
    addressData: AddressListData;
    itemDetailBid: MyBidData;
    invoiceId: number;
    yourMaxBid: number;
    invoiceDetails: InvoiceDetailResponse;
  };
  InvoiceList: undefined;
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
    invoiceId,
  } = route.params;

  const user = useSelector((state: RootState) => state.auth.userResponse);
  console.log("User:", user);
  const userId = useSelector(
    (state: RootState) => state.auth.userResponse?.customerDTO?.id
  );
  const statusColor = isWin ? "text-green-600" : "text-red-600";
  const [isLoading, setIsLoading] = useState(false); // Add loading state

  const [itemDetailBid, setItemDetailBid] = useState<MyBidData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  const [defaultAddress, setDefaultAddress] = useState<AddressListData | null>(
    null
  );

  // State to control the visibility of the EditAddress modal
  const [addresses, setAddresses] = useState<AddressListData[]>([]); // Add addresses state
  const [isChooseModalVisible, setChooseModalVisible] =
    useState<boolean>(false);
  const [invoiceDetails, setInvoiceDetails] = useState<
    InvoiceDetailResponse | undefined
  >(undefined);
  const [historyCustomerLots, setHistoryCustomerLots] = useState<
    HistoryCustomerLot[]
  >([]);

  // Helper function to get the latest "Delivered" status
  const getDeliveredStatus = (statusInvoiceDTOs: StatusInvoiceDto[]) => {
    return statusInvoiceDTOs
      .filter((status) => status.status === "Delivered")
      .sort(
        (a, b) =>
          new Date(b.currentDate).getTime() - new Date(a.currentDate).getTime()
      )[0];
  };
  // console.log("itemDetailBid", itemDetailBid);
  console.log("yourMaxBid in Detail", yourMaxBid);
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
        // console.log("addressResponse", addressResponse);

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
      // Fetch invoice details if invoiceId and isWin are present
      if (invoiceId && isWin) {
        const invoiceResponse = await getDetailInvoice(invoiceId);
        if (invoiceResponse?.isSuccess) {
          setInvoiceDetails(invoiceResponse.data);
          // Set historyCustomerLots from the fetched invoice details
          if (invoiceResponse.data.myBidDTO) {
            setHistoryCustomerLots(
              invoiceResponse.data.myBidDTO.historyCustomerLots
            );
          }
        } else {
          showErrorMessage(
            invoiceResponse?.message || "Failed to load invoice details."
          );
        }
      }
    } catch (error) {
      showErrorMessage("Unable to retrieve bid details.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(
    useCallback(() => {
      setLoading(true); // Show loading spinner
      fetchBidDetails();
    }, [itemBid.id, userId, invoiceId, isWin])
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
      <View className="items-center justify-center flex-1">
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }
  const handleViewInvoice = () => {
    if (defaultAddress && itemDetailBid && invoiceId && invoiceDetails) {
      navigation.navigate("InvoiceDetail", {
        addressData: defaultAddress,
        itemDetailBid: itemDetailBid,
        invoiceId: invoiceId,
        yourMaxBid: yourMaxBid ?? 0,
        invoiceDetails: invoiceDetails,
        imagePayment:
          invoiceDetails?.linkBillTransaction ||
          "https://thongkehaiphong.gov.vn/uploads/no-image.jpg",
      });
    }
  };

  const handleConfirmInvoice = async () => {
    if (defaultAddress && itemDetailBid && invoiceId && invoiceDetails) {
      setIsLoading(true);
      try {
        const response = await updateAddressToShipForInvoice(
          invoiceId,
          defaultAddress.id
        );

        if (response && response.isSuccess) {
          // Refetch invoice details after successful address update
          const updatedInvoiceResponse = await getDetailInvoice(invoiceId);

          if (updatedInvoiceResponse && updatedInvoiceResponse.isSuccess) {
            // Proceed with navigation with updated invoice details
            navigation.navigate("InvoiceDetailConfirm", {
              addressData: defaultAddress,
              itemDetailBid: itemDetailBid,
              invoiceId: invoiceId,
              yourMaxBid: yourMaxBid ?? 0,
              invoiceDetails: updatedInvoiceResponse.data,
            });
          } else {
            // If refetching invoice fails, navigate with original invoice details
            showErrorMessage("Failed to retrieve updated invoice details.");
            navigation.navigate("InvoiceDetailConfirm", {
              addressData: defaultAddress,
              itemDetailBid: itemDetailBid,
              invoiceId: invoiceId,
              yourMaxBid: yourMaxBid ?? 0,
              invoiceDetails: invoiceDetails,
            });
          }
        } else {
          // If updateAddressToShipForInvoice fails, navigate with original details
          navigation.navigate("InvoiceDetailConfirm", {
            addressData: defaultAddress,
            itemDetailBid: itemDetailBid,
            invoiceId: invoiceId,
            yourMaxBid: yourMaxBid ?? 0,
            invoiceDetails: invoiceDetails,
          });
        }
      } catch (error) {
        showErrorMessage("Unable to update the shipping address.");
      } finally {
        setIsLoading(false);
      }
    } else {
      showErrorMessage("No default address selected.");
    }
  };

  return (
    <View className="flex-1 pb-4 bg-white">
      <LoadingOverlay visible={isLoading} />
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
        yourMaxBid={yourMaxBid || 0}
        itemDetailBid={itemDetailBid || ({} as MyBidData)}
        invoiceDetails={invoiceDetails}
      />
      {invoiceDetails &&
        invoiceDetails.linkBillTransaction &&
        invoiceDetails.status !== "PendingPayment" &&
        invoiceDetails.status !== "CreateInvoice" && (
          <View className="p-2 my-2 bg-green-600 ">
            <Text className="text-lg font-semibold text-center text-white">
              You have successfully paid for this invoice.
            </Text>
          </View>
        )}
      {invoiceDetails && invoiceDetails.statusInvoiceDTOs && (
        <View className="mx-4 mt-4">
          <Text className="mb-2 text-lg font-semibold text-gray-600">
            Delivered Image:{" "}
            <Text className="font-bold text-gray-800">
              (Shipper ID: {invoiceDetails.shipperId})
            </Text>
          </Text>
          {getDeliveredStatus(invoiceDetails.statusInvoiceDTOs) ? (
            <ImageGallery
              images={invoiceDetails.statusInvoiceDTOs.map(
                (status) => status.imageLink
              )}
            />
          ) : (
            <Text className="text-gray-500">No delivered image available.</Text>
          )}
        </View>
      )}

      {user &&
      isWin &&
      invoiceId &&
      itemDetailBid &&
      itemDetailBid.status === "CreateInvoice" ? (
        <AddressInfo
          user={{
            ...user,
            phoneNumber: user?.phoneNumber || "",
            firstName: user?.customerDTO.firstName || "",
            lastName: user?.customerDTO.lastName || "",
            address:
              defaultAddress?.addressLine ||
              "Don't have default address to ship",
          }}
          onChooseAddress={handleChooseAddress} // Pass the function to trigger the modal
        />
      ) : null}

      {/* New Section for Delivered Image and Shipper Info */}
      {historyCustomerLots?.length > 0 && (
        <TimeLineBid historyCustomerLots={historyCustomerLots} />
      )}

      {invoiceId ? (
        <View>
          {itemDetailBid?.status === "CreateInvoice" ||
          itemDetailBid?.status === "PendingPayment" ? (
            <TouchableOpacity
              className="p-3 mx-4 mt-4 bg-blue-500 rounded"
              onPress={handleConfirmInvoice}>
              <Text className="text-base font-semibold text-center text-white uppercase">
                Confirm Invoice
              </Text>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity
              className="p-3 mx-4 my-4 bg-blue-500 rounded"
              onPress={handleViewInvoice}>
              <Text className="text-base font-semibold text-center text-white uppercase">
                View Invoice
              </Text>
            </TouchableOpacity>
          )}
        </View>
      ) : !invoiceId && isWin ? (
        <View className="flex-row mx-auto mb-6 ">
          <Text className="text-center text-gray-500 ">You need to go to</Text>
          <TouchableOpacity>
            <Text
              className="ml-2 font-semibold text-center text-blue-500 "
              onPress={() => navigation.navigate("InvoiceList")}>
              Invoice List
            </Text>
          </TouchableOpacity>
          <Text className="ml-2 text-center text-gray-500">to continue.</Text>
        </View>
      ) : null}

      <Modal
        animationType="slide"
        transparent={true}
        visible={isChooseModalVisible}
        onRequestClose={() => setChooseModalVisible(false)}>
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
