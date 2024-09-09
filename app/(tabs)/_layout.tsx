import React from "react";
import { createDrawerNavigator } from "@react-navigation/drawer";
import { createStackNavigator } from "@react-navigation/stack";
import {
  Entypo,
  FontAwesome,
  MaterialCommunityIcons,
} from "@expo/vector-icons";
import Colors from "@/constants/Colors";
// import CustomDrawerContent from "@/components/CustomDrawerContent";
import CustomHeader from "@/components/CustomHeader";
import HomeScreen from "./home-screen";
import PastAuctions from "./past-auctions";
import MyAccount from "./my-account";
import Consign from "./consign";
import HistoryItemConsign from "./history-item-consign";
import WatchedLots from "./watched-lots";
import MyBids from "./my-bids";
import PastBids from "./past-bids";
import FinanceProof from "./finance-proof";
import TermsConditions from "./terms-conditions";
import AboutScreen from "./about";
import RateUs from "./rate-us";
// import LotDetailScreen from "./lot-detail";
import CustomDrawerContent from "@/components/Navigator/CustomDrawerContent";
// import BiddingAuction from "./bidding-auction";
import ConsignStep from "@/components/Pages/ConsignStep";
import CustomHeaderDetail from "@/components/CustomHeaderDetail";
import BiddingAuction from "@/components/Pages/ItemAuctionHome/BiddingAuction";
import LotDetailScreen from "@/components/Pages/ItemAuctionHome/LotDetailScreen";
import CreateFinanceProof from "@/components/Pages/CreateFinanceProof";

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
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="MyAccount"
        component={MyAccount}
        options={{ header: () => <CustomHeader title="My Account" /> }}
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
        name="WatchedLots"
        component={WatchedLots}
        options={{ header: () => <CustomHeader title="Watched Lots" /> }}
      />
      <Stack.Screen
        name="MyBids"
        component={MyBids}
        options={{ header: () => <CustomHeader title="My Bids" /> }}
      />
      <Stack.Screen
        name="PastBids"
        component={PastBids}
        options={{ header: () => <CustomHeader title="Past Bids" /> }}
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
        drawerActiveTintColor: Colors.primary,
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
          title: "Auction Detail",
        }}
      />
      <Stack.Screen
        name="LotDetailScreen"
        component={LotDetailScreen}
        options={{
          title: "Lot Detail",
        }}
      />
    </Stack.Navigator>
  );
}
