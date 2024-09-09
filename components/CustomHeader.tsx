// /components/CustomHeader.tsx
import React from "react";
import { View, Text, TouchableOpacity, TextInput } from "react-native";
import { MaterialCommunityIcons, FontAwesome } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { DrawerNavigationProp } from "@react-navigation/drawer";
import { ParamListBase } from "@react-navigation/routers";

interface CustomHeaderProps {
  title: string;
}

const CustomHeader: React.FC<CustomHeaderProps> = ({ title }) => {
  const navigation = useNavigation<DrawerNavigationProp<ParamListBase>>();

  return (
    <View
      style={{
        flexDirection: "row",
        alignItems: "center",
        paddingHorizontal: 20,
        backgroundColor: "#fff",
        paddingTop: 40,
        paddingBottom: 20,
        justifyContent: "space-between",
        shadowColor: "#000", // Màu của shadow
        shadowOffset: { width: 0, height: 2 }, // Offset của shadow
        shadowOpacity: 0.25, // Độ mờ của shadow
        shadowRadius: 3.84, // Bán kính của shadow
        elevation: 5, // Độ cao của shadow (Android)
      }}
    >
      <TouchableOpacity
        onPress={() => navigation.openDrawer()}
        className="mx-4"
      >
        <MaterialCommunityIcons name="menu" size={24} color="black" />
      </TouchableOpacity>

      <View className="flex-row justify-between items-center flex-1 w-full">
        <Text className="font-bold text-2xl text-gray-800 mr-6 w-[80%] text-center">
          {title}
        </Text>

        <TouchableOpacity className="justify-end flex-row">
          <MaterialCommunityIcons
            name="bell"
            size={30}
            color="black"
            style={{ marginRight: 10 }}
          />
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default CustomHeader;
