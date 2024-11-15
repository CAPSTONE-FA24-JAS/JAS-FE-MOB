import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import {
  DrawerContentScrollView,
  DrawerItemList,
} from "@react-navigation/drawer";
import { FontAwesome, MaterialCommunityIcons } from "@expo/vector-icons";

interface CustomDrawerContentProps {
  navigation: any; // Replace 'any' with the appropriate type for your navigation prop
}

const CustomDrawerContent: React.FC<CustomDrawerContentProps> = (props) => {
  return (
    <DrawerContentScrollView {...props}>
      {/* Company Logo or Header */}
      <View style={{ padding: 20, alignItems: "center" }}>
        <Text style={{ fontSize: 24 }}>JAS COMPANY</Text>
      </View>

      {/* Search Box */}
      <View style={{ paddingHorizontal: 20, paddingVertical: 10 }}>
        {/* Your search box component or input field here */}
      </View>

      {/* Auctions Group */}
      <View style={{ paddingHorizontal: 20, marginTop: 20 }}>
        <Text style={{ fontSize: 18, color: "gray", marginBottom: 10 }}>
          Auctions
        </Text>
        <TouchableOpacity
          onPress={() =>
            props.navigation.navigate("Auctions", { screen: "HomePage" })
          }>
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              paddingVertical: 10,
            }}>
            <MaterialCommunityIcons name="gavel" size={24} color="blue" />
            <Text style={{ marginLeft: 20 }}>Home Page</Text>
          </View>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() =>
            props.navigation.navigate("Auctions", { screen: "PastAuctions" })
          }>
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              paddingVertical: 10,
            }}>
            <MaterialCommunityIcons name="history" size={24} color="blue" />
            <Text style={{ marginLeft: 20 }}>Past Auctions</Text>
          </View>
        </TouchableOpacity>
      </View>

      {/* My Account Group */}
      <View style={{ paddingHorizontal: 20, marginTop: 20 }}>
        <Text style={{ fontSize: 18, color: "gray", marginBottom: 10 }}>
          My Account
        </Text>

        {/* My Account Navigation Items */}
        <TouchableOpacity
          onPress={() =>
            props.navigation.navigate("Account", { screen: "MyAccount" })
          }>
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              paddingVertical: 10,
            }}>
            <FontAwesome name="user" size={24} color="blue" />
            <Text style={{ marginLeft: 20 }}>My Account</Text>
          </View>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() =>
            props.navigation.navigate("Account", { screen: "ConsignItem" })
          }>
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              paddingVertical: 10,
            }}>
            <MaterialCommunityIcons name="diamond" size={24} color="blue" />
            <Text style={{ marginLeft: 20 }}>Consign An Item</Text>
          </View>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() =>
            props.navigation.navigate("Account", {
              screen: "HistoryItemConsign",
            })
          }>
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              paddingVertical: 10,
            }}>
            <MaterialCommunityIcons name="diamond" size={24} color="blue" />
            <Text style={{ marginLeft: 20 }}>History Item Consign</Text>
          </View>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() =>
            props.navigation.navigate("Account", { screen: "WatchedLots" })
          }>
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              paddingVertical: 10,
            }}>
            <FontAwesome name="star" size={24} color="blue" />
            <Text style={{ marginLeft: 20 }}>Watched Jewelry</Text>
          </View>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() =>
            props.navigation.navigate("Account", { screen: "MyBids" })
          }>
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              paddingVertical: 10,
            }}>
            <FontAwesome name="dollar" size={24} color="blue" />
            <Text style={{ marginLeft: 20 }}>My Bids</Text>
          </View>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() =>
            props.navigation.navigate("Account", { screen: "InvoiceList" })
          }>
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              paddingVertical: 10,
            }}>
            <MaterialCommunityIcons name="credit-card" size={24} color="blue" />
            <Text style={{ marginLeft: 20 }}>Invoice List</Text>
          </View>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() =>
            props.navigation.navigate("Account", { screen: "FinanceProof" })
          }>
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              paddingVertical: 10,
            }}>
            <MaterialCommunityIcons name="credit-card" size={24} color="blue" />
            <Text style={{ marginLeft: 20 }}>Finance Proof</Text>
          </View>
        </TouchableOpacity>
      </View>

      {/* About Group */}
      <View style={{ paddingHorizontal: 20, marginTop: 20 }}>
        <Text style={{ fontSize: 18, color: "gray", marginBottom: 10 }}>
          About
        </Text>
        <TouchableOpacity
          onPress={() =>
            props.navigation.navigate("About", {
              screen: "TermsConditionsScreen",
            })
          }>
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              paddingVertical: 10,
            }}>
            <FontAwesome name="file-text" size={24} color="blue" />
            <Text style={{ marginLeft: 20 }}>Terms & Conditions</Text>
          </View>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() =>
            props.navigation.navigate("About", { screen: "AboutScreenMain" })
          }>
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              paddingVertical: 10,
            }}>
            <FontAwesome name="info-circle" size={24} color="blue" />
            <Text style={{ marginLeft: 20 }}>About</Text>
          </View>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() =>
            props.navigation.navigate("About", { screen: "RateUsScreen" })
          }>
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              paddingVertical: 10,
            }}>
            <FontAwesome name="heart" size={24} color="blue" />
            <Text style={{ marginLeft: 20 }}>Rate Us</Text>
          </View>
        </TouchableOpacity>
      </View>
    </DrawerContentScrollView>
  );
};

export default CustomDrawerContent;
