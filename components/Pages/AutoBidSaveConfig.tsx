import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  SafeAreaView,
  Image,
  TextInput,
  Switch,
  Modal,
  FlatList,
  ListRenderItem,
} from "react-native";
import { useRoute, RouteProp } from "@react-navigation/native";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { ScrollView } from "react-native-gesture-handler";

type RootStackParamList = {
  BidAutomation: BidAutomationRouteParams;
};

type BidAutomationRouteParams = {
  lotId: number;
  lotName: string;
  estimatedPrice: { min: number; max: number };
};

type BidAutomationScreenRouteProp = RouteProp<
  RootStackParamList,
  "BidAutomation"
>;
type BidAutomationScreenNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  "BidAutomation"
>;

interface SavedConfig {
  id: number;
  status: boolean;
  maxPrice: string;
  startingPrice: string;
  nextBidTime: string;
}

const AutoBidSaveConfig: React.FC = () => {
  const navigation = useNavigation<BidAutomationScreenNavigationProp>();
  const route = useRoute<BidAutomationScreenRouteProp>();
  const { lotId, lotName, estimatedPrice } = route.params;

  const [maxPrice, setMaxPrice] = useState<string>("1300");
  const [startingPrice, setStartingPrice] = useState<string>("500");
  const [nextBidTime, setNextBidTime] = useState<string>("10");
  const [notifyExceeded, setNotifyExceeded] = useState<boolean>(false);
  const [modalVisible, setModalVisible] = useState<boolean>(false);

  const [savedConfigs, setSavedConfigs] = useState<SavedConfig[]>([
    {
      id: 1,
      status: true,
      maxPrice: "1500",
      startingPrice: "600",
      nextBidTime: "15",
    },
    {
      id: 2,
      status: false,
      maxPrice: "2000",
      startingPrice: "800",
      nextBidTime: "20",
    },
    {
      id: 3,
      status: true,
      maxPrice: "2500",
      startingPrice: "1000",
      nextBidTime: "25",
    },
  ]);

  const handleIncrement = (
    setter: React.Dispatch<React.SetStateAction<string>>
  ): void => {
    setter((prev) => (parseInt(prev) + 100).toString());
  };

  const handleDecrement = (
    setter: React.Dispatch<React.SetStateAction<string>>
  ): void => {
    setter((prev) => Math.max(0, parseInt(prev) - 100).toString());
  };

  const handleSubmit = (): void => {
    console.log("Submitted automation bid");
    navigation.goBack();
  };

  const applyConfig = (config: SavedConfig): void => {
    setModalVisible(false);
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      <View className="flex-row items-center p-4 mb-6 bg-slate-100">
        <Image
          className="w-12 h-12 mr-4 rounded"
          source={require("../../assets/item-jas/item1.jpg")}
        />
        <View>
          <Text className="text-lg font-semibold">{lotName}</Text>
          <Text className="text-sm text-gray-600">
            Est: ${estimatedPrice.min} - ${estimatedPrice.max}
          </Text>
        </View>
      </View>
      <TouchableOpacity
        onPress={() => setModalVisible(true)}
        className="items-end p-2 mb-4 rounded-lg">
        <Text className="text-sm font-semibold text-center text-blue-500 underline">
          Config
        </Text>
      </TouchableOpacity>

      <View className="flex-1 px-4">
        <Text className="mb-4 text-xl font-semibold">
          Enter Your Config for Automation Bid
        </Text>

        <Text className="mt-4 mb-2">Max Price (USD) &lt;=</Text>
        <View className="flex-row items-center mb-4">
          <TouchableOpacity
            onPress={() => handleDecrement(setMaxPrice)}
            className="p-2 bg-gray-200 rounded-l-lg">
            <Text className="text-2xl">-</Text>
          </TouchableOpacity>
          <TextInput
            className="flex-1 px-4 py-2 text-lg text-center bg-gray-100"
            value={maxPrice}
            onChangeText={setMaxPrice}
            keyboardType="numeric"
          />
          <TouchableOpacity
            onPress={() => handleIncrement(setMaxPrice)}
            className="p-2 bg-gray-200 rounded-r-lg">
            <Text className="text-2xl">+</Text>
          </TouchableOpacity>
        </View>
        <Text className="mt-4 mb-2">Starting Price (USD) &gt;=</Text>
        <View className="flex-row items-center mb-4">
          <TouchableOpacity
            onPress={() => handleDecrement(setStartingPrice)}
            className="p-2 bg-gray-200 rounded-l-lg">
            <Text className="text-2xl">-</Text>
          </TouchableOpacity>
          <TextInput
            className="flex-1 px-4 py-2 text-lg text-center bg-gray-100"
            value={startingPrice}
            onChangeText={setStartingPrice}
            keyboardType="numeric"
          />
          <TouchableOpacity
            onPress={() => handleIncrement(setStartingPrice)}
            className="p-2 bg-gray-200 rounded-r-lg">
            <Text className="text-2xl">+</Text>
          </TouchableOpacity>
        </View>
        <Text className="mt-4 mb-2">Next Bid Time (Minutes)</Text>
        <View className="flex-row items-center mb-4">
          <TouchableOpacity
            onPress={() =>
              setNextBidTime((prev) =>
                Math.max(1, parseInt(prev) - 1).toString()
              )
            }
            className="p-2 bg-gray-200 rounded-l-lg">
            <Text className="text-2xl">-</Text>
          </TouchableOpacity>
          <TextInput
            className="flex-1 px-4 py-2 text-lg text-center bg-gray-100"
            value={nextBidTime}
            onChangeText={setNextBidTime}
            keyboardType="numeric"
          />
          <TouchableOpacity
            onPress={() =>
              setNextBidTime((prev) => (parseInt(prev) + 1).toString())
            }
            className="p-2 bg-gray-200 rounded-r-lg">
            <Text className="text-2xl">+</Text>
          </TouchableOpacity>
        </View>
      </View>

      <View className="flex-row items-center px-4 mb-16">
        <Switch value={notifyExceeded} onValueChange={setNotifyExceeded} />
        <Text className="ml-2">Notify me when my maximum bid is exceeded</Text>
      </View>

      <TouchableOpacity
        onPress={handleSubmit}
        className="absolute bottom-0 left-0 right-0 py-3 bg-blue-500">
        <Text className="text-lg font-bold text-center text-white">
          SUBMIT AUTOMATION BID
        </Text>
      </TouchableOpacity>

      <Modal
        animationType="fade"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}>
        <View className="items-center justify-center flex-1 bg-black/50">
          <View className="bg-white p-6 rounded-2xl w-11/12 max-h-[80%]">
            <Text className="mb-4 text-xl font-bold">Saved Configurations</Text>
            <ScrollView className="w-full mb-4">
              <View className="flex-row p-2 bg-gray-200">
                <Text className="flex-1 font-semibold text-center">
                  Max Price
                </Text>
                <Text className="flex-1 font-semibold text-center">
                  Start Price
                </Text>
                <Text className="flex-1 font-semibold text-center">
                  Next Bid (min)
                </Text>
                <Text className="w-16 font-semibold text-center">Status</Text>
              </View>
              {savedConfigs.map((config) => (
                <View
                  key={config.id}
                  className="flex-row py-2 border-b border-gray-200">
                  <Text className="flex-1 text-center">${config.maxPrice}</Text>
                  <Text className="flex-1 text-center">
                    ${config.startingPrice}
                  </Text>
                  <Text className="flex-1 text-center">
                    {config.nextBidTime}
                  </Text>
                  <TouchableOpacity
                    className={`items-center justify-center px-5 rounded-lg w-fit ${
                      config.status ? "bg-green-500" : "bg-red-500"
                    }`}
                    onPress={() => applyConfig(config)}>
                    <Text className="font-semibold text-white">
                      {config.status ? "On" : "Off"}
                    </Text>
                  </TouchableOpacity>
                </View>
              ))}
            </ScrollView>
            <TouchableOpacity
              onPress={() => setModalVisible(false)}
              className="p-2 mt-4 bg-gray-500 rounded-lg">
              <Text className="font-semibold text-center text-white">
                Close
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

export default AutoBidSaveConfig;
