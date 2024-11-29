import React from "react";

import { FontAwesome, MaterialCommunityIcons } from "@expo/vector-icons";
import Colors from "@/constants/Colors";
import CustomHeader from "@/components/CustomHeader";
import HomeScreen from "./home-screen";
import PastAuctions from "./past-auctions";
import MyAccount from "./my-account";
import Consign from "./consign";
import HistoryItemConsign from "./history-item-consign";
import WatchedLots from "./watched-lots";
import MyBids from "./my-bids";
import FinanceProof from "./finance-proof";
import TermsConditions from "./terms-conditions";
import AboutScreen from "./about";
import RateUs from "./rate-us";
import CustomDrawerContent from "@/components/Navigator/CustomDrawerContent";
import ConsignStep from "@/components/Pages/ConsignStep";
import CustomHeaderDetail from "@/components/CustomHeaderDetail";
import BiddingAuction from "@/components/Pages/ItemAuctionHome/BiddingAuction";
import LotDetailScreen from "@/components/Pages/ItemAuctionHome/LotDetailScreen";
import CreateFinanceProof from "@/components/Pages/CreateFinanceProof";
import Terms from "@/components/Pages/MyProfile/Terms";
import ChangePassword from "@/components/Pages/MyProfile/ChangePassword";
import AccountInfo from "@/components/Pages/MyProfile/AccountInfo";
import Help from "@/components/Pages/MyProfile/Help";
import Login from "../(auths)/login";
import PlaceBid from "@/components/Pages/PlaceBid";
import AutoBidSaveConfig from "@/components/Pages/AutoBidSaveConfig";
import ConsignDetailTimeLine from "@/components/Pages/ConsignItemTimeLine";
import RisingBidPage from "@/components/Pages/LiveBidding/RisingBidPage";
import InvoiceList from "./invoice-list";
import DetailMyBid from "@/components/Pages/MyBids/BidDetail/DetailMyBid";
import InvoiceDetailConfirm from "@/components/Pages/Invoice/InvoiceDetailConfirm";
import ViewInvoiceDetail from "@/components/Pages/Invoice/ViewInvoiceDetail";
import Payment from "@/components/Pages/Payment/Payment";
import PaymentUpload from "@/components/Pages/Payment/PaymentUpload";
import PaymentSuccess from "@/components/Pages/Payment/PaymentSuccess";
import { Text, View } from "react-native";
import BidSuccess from "@/components/Pages/MyBids/BidSuccess";
import PowerOfAttorney from "@/components/Pages/Documents/PowerOfAttorney";
import OTP from "@/components/Pages/OTP/OTP";
import MyWalletMain from "@/components/Pages/Wallet/MyWalletMain";
import Deposit from "@/components/Pages/Wallet/Deposit";
import Withdraw from "@/components/Pages/Wallet/Widthraw";
import RegisterToBid from "@/components/Pages/MyBids/RegisterToBid";
import EditAddress from "@/components/Pages/Address/EditAddress.";
import ReduceBidPage from "@/components/Pages/LiveBidding/ReduceBidPage";
import Notification from "../../components/Pages/Notifications";
import { createStackNavigator } from "@react-navigation/stack";
import { createDrawerNavigator } from "@react-navigation/drawer";
import AddBankAccountScreen from "@/components/Pages/AddCreditCard/AddBankAccountScreen";
import { DrawerActions } from "@react-navigation/native";
import { useNavigation } from "expo-router";
// Declare Drawer and Stack Navigators
const Drawer = createDrawerNavigator();
const Stack = createStackNavigator();

// Stack Navigator for Auctions
function AuctionsStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="HomePage"
        component={HomeScreen}
        options={{ header: () => <CustomHeader title="Home Page" /> }}
      />
      <Stack.Screen
        name="PastAuctions"
        component={PastAuctions}
        options={{ header: () => <CustomHeader title="Past Auctions" /> }}
      />
    </Stack.Navigator>
  );
}

// Stack Navigator for My Account
function MyAccountStack() {
  const navigation = useNavigation();

  return (
    <Stack.Navigator>
      <Stack.Screen
        name="MyAccount"
        component={MyAccount}
        options={{
          header: () => (
            <CustomHeader
              title="My Account"
              // openDrawer={() => navigation.dispatch(DrawerActions.openDrawer())}
            />
          ),
        }}
      />
      <Stack.Screen
        name="ConsignItem"
        component={Consign}
        options={{ header: () => <CustomHeader title="Consign An Item" /> }}
      />
      <Stack.Screen
        name="HistoryItemConsign"
        component={HistoryItemConsign}
        options={{
          header: () => <CustomHeader title="History Item Consign" />,
        }}
      />

      <Stack.Screen
        name="HomePage"
        component={HomeScreen}
        options={{
          header: () => <CustomHeader title="History Item Consign" />,
        }}
      />

      <Stack.Screen
        name="WatchedLots"
        component={WatchedLots}
        options={{ header: () => <CustomHeader title="Watched Jewelry" /> }}
      />
      <Stack.Screen
        name="MyBids"
        component={MyBids}
        options={{ header: () => <CustomHeader title="My Bids" /> }}
      />
      <Stack.Screen
        name="InvoiceList"
        component={InvoiceList}
        options={{ header: () => <CustomHeader title="Invoice List" /> }}
      />
      <Stack.Screen
        name="FinanceProof"
        component={FinanceProof}
        options={{ header: () => <CustomHeader title="Finance Proof" /> }}
      />
      <Stack.Screen
        name="ConsignStep"
        component={ConsignStep}
        options={{
          header: () => <CustomHeaderDetail title="Consignment Step" />,
        }}
      />
      <Stack.Screen
        name="CreateFinanceProof"
        component={CreateFinanceProof}
        options={{
          header: () => <CustomHeaderDetail title="Create Finance Proof" />,
        }}
      />
    </Stack.Navigator>
  );
}

// Stack Navigator for About
function AboutStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="TermsConditionsScreen"
        component={TermsConditions}
        options={{ header: () => <CustomHeader title="Terms & Conditions" /> }}
      />
      <Stack.Screen
        name="AboutScreenMain"
        component={AboutScreen}
        options={{ header: () => <CustomHeader title="About" /> }}
      />
      <Stack.Screen
        name="RateUsScreen"
        component={RateUs}
        options={{ header: () => <CustomHeader title="Rate Us" /> }}
      />
    </Stack.Navigator>
  );
}

// Main Drawer Layout
function DrawerLayout() {
  return (
    <Drawer.Navigator
      drawerContent={(props) => <CustomDrawerContent {...props} />}
      screenOptions={{
        headerShown: false, // Hide default header
        drawerStyle: {
          backgroundColor: "white", // Set background color for the drawer menu
        },
        drawerActiveBackgroundColor: "lightgray", // Set background color for active item
        drawerActiveTintColor: Colors.primary, // Set text color for active item
        drawerInactiveTintColor: "black", // Set text color for inactive items
      }}>
      {/* Parent Categories */}
      <Drawer.Screen
        name="Auctions"
        component={AuctionsStack}
        options={{
          drawerLabel: "Auctions",
          drawerIcon: ({ color }) => (
            <MaterialCommunityIcons name="gavel" size={24} color={color} />
          ),
        }}
      />
      <Drawer.Screen
        name="Account"
        component={MyAccountStack}
        options={{
          drawerLabel: "My Account",
          drawerIcon: ({ color }) => (
            <FontAwesome name="user" size={24} color={color} />
          ),
        }}
      />
      <Drawer.Screen
        name="About"
        component={AboutStack}
        options={{
          drawerLabel: "About",
          drawerIcon: ({ color }) => (
            <FontAwesome name="info-circle" size={24} color={color} />
          ),
        }}
      />
    </Drawer.Navigator>
  );
}

export default function AppNavigator() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="DrawerLayout"
        component={DrawerLayout}
        options={{ headerShown: false }}
      />
      {/* Additional Stack Screens */}

      <Stack.Screen
        name="BiddingAuction"
        component={BiddingAuction}
        options={{
          header: () => <CustomHeaderDetail title="Auction Detail" />,
        }}
      />
      <Stack.Screen
        name="LotDetailScreen"
        component={LotDetailScreen}
        options={{
          header: () => <CustomHeaderDetail title="Lot Detail" />,
        }}
      />
      <Stack.Screen
        name="ChangePassword"
        component={ChangePassword}
        options={{
          header: () => <CustomHeaderDetail title="Change Password" />,
        }}
      />
      <Stack.Screen
        name="AccountInfo"
        component={AccountInfo}
        options={{
          header: () => <CustomHeaderDetail title="Account Infomation" />,
        }}
      />
      <Stack.Screen
        name="Help"
        component={Help}
        options={{
          header: () => <CustomHeaderDetail title="Help" />,
        }}
      />
      <Stack.Screen
        name="Terms"
        component={Terms}
        options={{
          header: () => <CustomHeaderDetail title="Terms and Conditions" />,
        }}
      />
      <Stack.Screen
        name="ConsignDetailTimeLine"
        component={ConsignDetailTimeLine}
        options={{
          header: () => <CustomHeaderDetail title="HISTORY ITEM CONSIGN" />,
        }}
      />

      <Stack.Screen
        name="PlaceBid"
        component={PlaceBid}
        options={{
          header: () => <CustomHeaderDetail title="PLACE BID" />,
        }}
      />

      <Stack.Screen
        name="AutoBidSaveConfig"
        component={AutoBidSaveConfig}
        options={{
          header: () => <CustomHeaderDetail title="PLACE BID" />,
        }}
      />
      <Stack.Screen
        name="RisingBidPage"
        component={RisingBidPage}
        options={{
          header: () => <CustomHeaderDetail title="Live Bidding" />,
        }}
      />
      <Stack.Screen
        name="ReduceBidPage"
        component={ReduceBidPage}
        options={{
          header: () => <CustomHeaderDetail title="Live Bidding" />,
        }}
      />
      <Stack.Screen
        name="EditAddress"
        component={EditAddress}
        options={{
          header: () => <CustomHeaderDetail title="Edit Address" />,
        }}
      />
      <Stack.Screen
        name="DetailMyBid"
        component={DetailMyBid}
        options={{
          header: () => <CustomHeaderDetail title="My Bid Detail" />,
        }}
      />
      <Stack.Screen
        name="InvoiceDetail"
        component={ViewInvoiceDetail}
        options={{
          header: () => <CustomHeaderDetail title="Invoice Detail" />,
        }}
      />
      <Stack.Screen
        name="InvoiceDetailConfirm"
        component={InvoiceDetailConfirm}
        options={{
          header: () => <CustomHeaderDetail title="Invoice Detail Confirm" />,
        }}
      />
      <Stack.Screen
        name="Payment"
        component={Payment}
        options={{
          header: () => <CustomHeaderDetail title="Payment" />,
        }}
      />
      <Stack.Screen
        name="PaymentUpload"
        component={PaymentUpload}
        options={{
          header: () => <CustomHeaderDetail title="Payment Upload" />,
        }}
      />
      <Stack.Screen
        name="PaymentSuccess"
        component={PaymentSuccess}
        options={{
          header: () => (
            <Text className="pt-20 text-2xl font-bold text-center uppercase bg-white">
              Payment Success
            </Text>
          ),
        }}
      />
      <Stack.Screen
        name="BidSuccess"
        component={BidSuccess}
        options={{
          header: () => (
            <Text className="pt-20 text-2xl font-bold text-center uppercase bg-white">
              Bid Success
            </Text>
          ),
        }}
      />
      <Stack.Screen
        name="PowerOfAttorney"
        component={PowerOfAttorney}
        options={{
          header: () => <CustomHeaderDetail title="Power Of Attorney" />,
        }}
      />
      <Stack.Screen
        name="OTP"
        component={OTP}
        options={{
          header: () => (
            <Text className="pt-20 text-2xl font-bold text-center uppercase bg-white">
              OTP Verification
            </Text>
          ),
        }}
      />
      <Stack.Screen
        name="MyWallet"
        component={MyWalletMain}
        options={{
          header: () => <CustomHeaderDetail title="My Wallet" />,
        }}
      />
      <Stack.Screen
        name="AddBankAccount"
        component={AddBankAccountScreen}
        options={{
          header: () => <CustomHeaderDetail title="My Wallet" />,
        }}
      />
      <Stack.Screen
        name="Withdraw"
        component={Withdraw}
        options={{
          header: () => <CustomHeaderDetail title="Withdraw" />,
        }}
      />
      <Stack.Screen
        name="Deposit"
        component={Deposit}
        options={{
          header: () => <CustomHeaderDetail title="Deposit" />,
        }}
      />
      <Stack.Screen
        name="RegisterToBid"
        component={RegisterToBid}
        options={{
          header: () => <CustomHeaderDetail title="Register To Bid" />,
        }}
      />
      <Stack.Screen
        name="Notification"
        component={Notification}
        options={{ header: () => <CustomHeaderDetail title="Notification" /> }}
      />

      <Stack.Screen
        name="InvoiceList"
        component={InvoiceList}
        options={{ header: () => <CustomHeaderDetail title="Invoice List" /> }}
      />

      <Stack.Screen
        name="MyBids"
        component={MyBids}
        options={{ header: () => <CustomHeaderDetail title="My Bids" /> }}
      />

      <Stack.Screen
        name="HistoryItemConsign"
        component={HistoryItemConsign}
        options={{
          header: () => <CustomHeaderDetail title="History Item Consign" />,
        }}
      />
    </Stack.Navigator>
  );
}
