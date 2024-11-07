import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  FlatList,
  SafeAreaView,
} from "react-native";
import ItemPastBids from "@/components/Pages/MyBids/ItemPastBids";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import {
  InvoiceData,
  InvoiceDetailResponse,
  MyBidDTO,
} from "../types/invoice_type";
import { getInvoicesByStatusForCustomer } from "@/api/invoiceApi";
import { DataCurentBidResponse } from "../types/bid_type";
import { showErrorMessage } from "@/components/FlashMessageHelpers";

const InvoiceList: React.FC = () => {
  // Lấy userId từ state
  const userId = useSelector(
    (state: RootState) => state.auth.userResponse?.customerDTO?.id
  );

  // State quản lý danh sách hóa đơn, trạng thái đã chọn và trạng thái loading
  const [invoiceList, setInvoiceList] = useState<InvoiceData[]>([]);
  const [selectedStatus, setSelectedStatus] = useState<number>(2);
  const [loading, setLoading] = useState<boolean>(false);

  // console.log("invoiceList", invoiceList);

  // Gọi API khi thay đổi trạng thái
  useEffect(() => {
    if (userId) {
      fetchInvoices();
    }
  }, [selectedStatus, userId]);

  // // Hàm gọi API
  // const fetchInvoices = async () => {
  //   if (!userId) return;
  //   try {
  //     setLoading(true);
  //     const response = await getInvoicesByStatusForCustomer(
  //       userId,
  //       selectedStatus
  //     );

  //     if (response && response.isSuccess) {
  //       // Nếu API trả về thành công, cập nhật danh sách hóa đơn
  //       setInvoiceList(response.data.dataResponse);
  //     } else if (response && !response.isSuccess && response.errorMessages) {
  //       // Nếu isSuccess là false, hiển thị thông báo lỗi từ errorMessages
  //       const errorMessage = response.errorMessages.join(", ");
  //       showErrorMessage(errorMessage);
  //       setInvoiceList([]);
  //     }
  //   } catch (error) {
  //     setInvoiceList([]); // Set danh sách hóa đơn rỗng nếu có lỗi
  //     console.error("Error fetching invoices:", error);
  //     showErrorMessage("Unable to retrieve invoices."); // Thông báo chung khi có lỗi khác
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  // Hàm gọi API
  const fetchInvoices = async () => {
    if (!userId) return;
    try {
      setLoading(true);
      const response = await getInvoicesByStatusForCustomer(
        userId,
        selectedStatus
      );

      if (response) {
        if (response.isSuccess) {
          // Nếu API trả về thành công, cập nhật danh sách hóa đơn
          setInvoiceList(response.data.dataResponse);
        } else if (response.errorMessages) {
          // Nếu isSuccess là false, kiểm tra thông báo lỗi cụ thể
          const errorMessage = response.errorMessages.join(", ");
          if (errorMessage === "Don't have any Product") {
            // Xử lý trường hợp không có sản phẩm
            // Bạn có thể hiển thị thông báo cụ thể hoặc xử lý theo cách khác
            // showErrorMessage("Không có hóa đơn nào.");
            setInvoiceList([]);
          } else {
            // Các thông báo lỗi khác
            showErrorMessage(errorMessage);
            setInvoiceList([]);
          }
        }
      }
    } catch (error) {
      setInvoiceList([]); // Set danh sách hóa đơn rỗng nếu có lỗi
      console.error("Error fetching invoices:", error);
      showErrorMessage("Unable to retrieve invoices."); // Thông báo chung khi có lỗi khác
    } finally {
      setLoading(false);
    }
  };

  // console.log("selectedStatus", selectedStatus, "invoiceList", invoiceList);

  // Danh sách các trạng thái hóa đơn
  const statusTabs = [
    // { label: "All", value: null },
    { label: "1.CreateInvoice", value: 2 },
    { label: "2.Paid", value: 3 },
    { label: "3.PendingPayment", value: 4 },
    { label: "4.Delivering", value: 5 },
    { label: "5.Delivered", value: 6 },
    { label: "6.Rejected", value: 7 },
    { label: "7.Finished", value: 8 },
    { label: "8.Refunded", value: 9 },
    { label: "9.Cancelled", value: 10 },
    { label: "10.Closed", value: 11 },
  ];

  // Render từng mục hóa đơn
  const renderInvoiceItem = ({ item }: { item: InvoiceData }) => (
    <ItemPastBids
      key={item.id}
      invoiceId={item.id}
      id={item.myBidDTO?.lotId ?? 0}
      isWin={true}
      title={item.myBidDTO?.lotDTO.title ?? "Unknown Title"}
      lotNumber={`Lot #${item.myBidDTO?.lotId}`}
      soldPrice={item.price}
      yourMaxBid={item?.myBidDTO?.yourMaxBidPrice}
      statusInvoice={item?.status}
      itemInvoice={item}
      image={
        item.myBidDTO?.lotDTO.imageLinkJewelry ||
        "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ8bUqIUkfyesCXuAFw-MFLebEI-5to1ouplw&s"
      }
      statusLot={item.myBidDTO?.lotDTO.status || ""}
      typeBid={item.myBidDTO?.lotDTO.lotType || ""}
      minPrice={item.myBidDTO?.lotDTO.startPrice || 0}
      maxPrice={item.myBidDTO?.lotDTO.endPrice || 0}
      itemBid={item.myBidDTO ?? ({} as DataCurentBidResponse)}
      startTime={item.myBidDTO?.lotDTO.startTime || ""}
      endTime={item.myBidDTO?.lotDTO.endTime || ""}
      statusTabs={selectedStatus}
    />
  );

  // CreateInvoice = 2,
  // Paid = 3,
  // PendingPayment = 4,
  // Delivering = 5,
  // Delivered =6,
  // Rejected = 7,
  // Finished = 8,
  // Refunded = 9,
  // Cancelled = 10,
  // Closed = 11
  return (
    <SafeAreaView className="flex-1 bg-white">
      <View className="bg-white py-2">
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ paddingHorizontal: 16 }}
        >
          <View className="flex-row gap-2">
            {statusTabs.map((tab) => (
              <TouchableOpacity
                key={tab.value !== null ? tab.value : "all"}
                onPress={() => setSelectedStatus(tab.value ?? 2)}
                className={`px-4 py-2 rounded ${
                  selectedStatus === tab.value ? "bg-yellow-500" : "bg-gray-300"
                }`}
              >
                <Text
                  className={`text-sm font-bold ${
                    selectedStatus === tab.value ? "text-white" : "text-black"
                  }`}
                >
                  {tab.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </ScrollView>
      </View>

      {/* Hiển thị loading hoặc danh sách hóa đơn */}
      {loading ? (
        <View className="flex-1 justify-center items-center">
          <ActivityIndicator size="large" color="#0000ff" />
        </View>
      ) : (
        <>
          {invoiceList.length === 0 ? (
            <View className="flex-1 justify-center items-center ">
              <Text className="text-center text-lg text-gray-700">
                No invoice found
              </Text>
            </View>
          ) : (
            <FlatList
              data={invoiceList}
              renderItem={renderInvoiceItem}
              keyExtractor={(item) => item.id.toString()}
              contentContainerStyle={{ padding: 16 }}
              className="bg-white"
            />
          )}
        </>
      )}
    </SafeAreaView>
  );
};

export default InvoiceList;
