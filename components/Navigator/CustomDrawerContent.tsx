import React from "react";
import { View, Text, TouchableOpacity, Image } from "react-native";
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
      <View style={{ alignItems: "center" }}>
        <Image
          className=" w-40 h-40 "
          source={require("../../assets/logo.png")}
        />
      </View>

      {/* Auctions Group */}
      <View style={{ paddingHorizontal: 20, marginTop: 10 }}>
        <Text style={{ fontSize: 18, color: "gray", marginBottom: 10 }}>
          Auctions
        </Text>
        <TouchableOpacity
          onPress={() =>
            props.navigation.navigate("Auctions", { screen: "HomePage" })
          }
        >
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              paddingVertical: 10,
            }}
          >
            <View className="w-[30px]  justify-center flex-row">
              <MaterialCommunityIcons name="gavel" size={24} color="#3eaef4" />
            </View>
            <Text style={{ marginLeft: 20 }}>Home Page</Text>
          </View>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() =>
            props.navigation.navigate("Auctions", { screen: "PastAuctions" })
          }
        >
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              paddingVertical: 10,
            }}
          >
            <View className="w-[30px]  justify-center flex-row">
              <MaterialCommunityIcons
                name="history"
                size={24}
                color="#3eaef4"
              />
            </View>
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
          }
        >
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              paddingVertical: 10,
            }}
          >
            <View className="w-[30px]  justify-end flex-row">
              <FontAwesome name="user" size={24} color="#3eaef4" />
            </View>
            <Text style={{ marginLeft: 20 }}>My Account</Text>
          </View>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() =>
            props.navigation.navigate("Account", { screen: "ConsignItem" })
          }
        >
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              paddingVertical: 10,
            }}
          >
            <View className="w-[30px] flex-row">
              <MaterialCommunityIcons name="camera" size={24} color="#3eaef4" />
            </View>
            <Text style={{ marginLeft: 20 }}>Consign An Item</Text>
          </View>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() =>
            props.navigation.navigate("Account", {
              screen: "HistoryItemConsign",
            })
          }
        >
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              paddingVertical: 10,
            }}
          >
            <View className="w-[30px]  justify-center flex-row">
              <MaterialCommunityIcons
                name="diamond"
                size={24}
                color="#3eaef4"
              />
            </View>
            <Text style={{ marginLeft: 20 }}>History Item Consign</Text>
          </View>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() =>
            props.navigation.navigate("Account", { screen: "WatchedLots" })
          }
        >
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              paddingVertical: 10,
            }}
          >
            <View className="w-[30px]  justify-center flex-row">
              <FontAwesome name="star" size={24} color="#3eaef4" />
            </View>
            <Text style={{ marginLeft: 20 }}>Watched Jewelry</Text>
          </View>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() =>
            props.navigation.navigate("Account", { screen: "MyBids" })
          }
        >
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              paddingVertical: 10,
            }}
          >
            <View className="w-[30px]   flex-row">
              <FontAwesome name="gavel" size={24} color="#3eaef4" />
            </View>
            <Text style={{ marginLeft: 20 }}>My Bids</Text>
          </View>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() =>
            props.navigation.navigate("Account", { screen: "InvoiceList" })
          }
        >
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              paddingVertical: 10,
            }}
          >
            <View className="w-[30px]   flex-row">
              <MaterialCommunityIcons
                name="text-box-check"
                size={24}
                color="#3eaef4"
              />
            </View>
            <Text style={{ marginLeft: 20 }}>Invoice List</Text>
          </View>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() =>
            props.navigation.navigate("Account", { screen: "FinanceProof" })
          }
        >
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              paddingVertical: 10,
            }}
          >
            <View className="w-[30px]  justify-center flex-row">
              <MaterialCommunityIcons
                name="credit-card"
                size={24}
                color="#3eaef4"
              />
            </View>
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
          }
        >
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              paddingVertical: 10,
            }}
          >
            <View className="w-[30px]  justify-center flex-row">
              <FontAwesome name="file-text" size={24} color="#3eaef4" />
            </View>
            <Text style={{ marginLeft: 20 }}>Terms & Conditions</Text>
          </View>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() =>
            props.navigation.navigate("About", { screen: "AboutScreenMain" })
          }
        >
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              paddingVertical: 10,
            }}
          >
            <View className="w-[30px]  justify-center flex-row">
              <FontAwesome name="info-circle" size={24} color="#3eaef4" />
            </View>
            <Text style={{ marginLeft: 20 }}>About</Text>
          </View>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() =>
            props.navigation.navigate("About", { screen: "RateUsScreen" })
          }
        >
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              paddingVertical: 10,
            }}
          >
            <View className="w-[30px]  flex-row justify-center">
              <FontAwesome name="heart" size={24} color="#3eaef4" />
            </View>
            <Text style={{ marginLeft: 20 }}>Rate Us</Text>
          </View>
        </TouchableOpacity>
      </View>
    </DrawerContentScrollView>
  );
};

export default CustomDrawerContent;
