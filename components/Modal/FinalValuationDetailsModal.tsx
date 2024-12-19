import { KeyCharacteristicDetail, MainDiamond } from "@/app/types/consign_type";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { StackNavigationProp } from "@react-navigation/stack";
import { useNavigation } from "expo-router";
import moment from "moment-timezone";
import React, { useState } from "react";
import {
  Modal,
  View,
  Text,
  Image,
  TouchableOpacity,
  ScrollView,
  FlatList,
} from "react-native";
import { Linking } from "react-native";

interface FinalValuationDetailsModalProps {
  isVisible: boolean;
  onClose: () => void;
  onApprove: () => void;
  details: {
    id: number;
    images: string[];
    name: string;
    owner: string;
    artist: string;
    category: string;
    width: string;
    height: string;
    depth: string;
    description: string;
    estimatedCost: string;
    specificPrice: string;
    note: string;
    address: string;
    CCCD: string;
    idIssuanceDate: string;
    idExpirationDate: string;
    country: string;
    sellerId: number;
    email: string;
    descriptionCharacteristicDetails: KeyCharacteristicDetail[];
    documentLink: string;
    mainDiamonds: MainDiamond[];
    secondaryDiamonds: any[];
    mainShaphies: any[];
    secondaryShaphies: any[];
    creationDate: string;
    status: string;
  };
}

// Define the types for navigation routes
type RootStackParamList = {
  PowerOfAttorney: {
    details: FinalValuationDetailsModalProps["details"];
    isOTP: boolean;
  };
};

const FinalValuationDetailsModal: React.FC<FinalValuationDetailsModalProps> = ({
  isVisible,
  onClose,
  onApprove,
  details,
}) => {
  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();
  const [currentImage, setCurrentImage] = useState(0);

  // Handle switching to the next image
  const handleNextImage = () => {
    setCurrentImage((prev) => (prev + 1) % details?.images.length);
  };

  // Handle switching to the previous image
  const handlePreviousImage = () => {
    setCurrentImage(
      (prev) => (prev - 1 + details?.images.length) % details?.images.length
    );
  };

  const handlePowerOfAttorney = () => {
    onClose();
    navigation.navigate("PowerOfAttorney", {
      details: details,
      isOTP: false,
    });
  };

  // Render Thumbnail List
  const renderThumbnails = () => (
    <FlatList
      horizontal
      data={details?.images}
      keyExtractor={(item, index) => index.toString()}
      renderItem={({ item, index }) => (
        <TouchableOpacity onPress={() => setCurrentImage(index)}>
          <Image
            source={{ uri: item }}
            style={{
              width: 60,
              height: 60,
              marginHorizontal: 4,
              borderColor: "#ccc",
              borderWidth: 1,
            }}
            resizeMode="cover"
          />
        </TouchableOpacity>
      )}
    />
  );

  const renderDiamondInfo = () => {
    if (!details?.mainDiamonds?.length && !details?.secondaryDiamonds?.length) {
      return null;
    }

    return (
      <View className="mt-4">
        {/* Main Diamonds */}
        {details?.mainDiamonds?.length > 0 && (
          <View>
            <Text className="mb-2 text-xl font-bold">Main Diamonds</Text>
            {details.mainDiamonds.map((diamond, index) => (
              <View key={index} className="mb-3 ml-4">
                {diamond?.name && (
                  <View className="flex-row items-start gap-2">
                    <Text className="text-lg text-gray-800">•</Text>
                    <Text className="text-lg font-bold text-gray-700">
                      Name:
                    </Text>
                    <Text className="text-lg text-gray-800">
                      {diamond.name}
                    </Text>
                  </View>
                )}
                {diamond?.shape && (
                  <View className="flex-row items-start gap-2">
                    <Text className="text-lg text-gray-800">•</Text>
                    <Text className="text-lg font-bold text-gray-700">
                      Shape:
                    </Text>
                    <Text className="text-lg text-gray-800">
                      {diamond.shape}
                    </Text>
                  </View>
                )}
                {diamond?.color && (
                  <View className="flex-row items-start gap-2">
                    <Text className="text-lg text-gray-800">•</Text>
                    <Text className="text-lg font-bold text-gray-700">
                      Color:
                    </Text>
                    <Text className="text-lg text-gray-800">
                      {diamond.color}
                    </Text>
                  </View>
                )}
                {diamond?.cut && (
                  <View className="flex-row items-start gap-2">
                    <Text className="text-lg text-gray-800">•</Text>
                    <Text className="text-lg font-bold text-gray-700">
                      Cut:
                    </Text>
                    <Text className="text-lg text-gray-800">{diamond.cut}</Text>
                  </View>
                )}
                {diamond?.clarity && (
                  <View className="flex-row items-start gap-2">
                    <Text className="text-lg text-gray-800">•</Text>
                    <Text className="text-lg font-bold text-gray-700">
                      Clarity:
                    </Text>
                    <Text className="text-lg text-gray-800">
                      {diamond.clarity}
                    </Text>
                  </View>
                )}
                {diamond?.quantity && (
                  <View className="flex-row items-start gap-2">
                    <Text className="text-lg text-gray-800">•</Text>
                    <Text className="text-lg font-bold text-gray-700">
                      Quantity:
                    </Text>
                    <Text className="text-lg text-gray-800">
                      {diamond.quantity}
                    </Text>
                  </View>
                )}
                {diamond?.settingType && (
                  <View className="flex-row items-start gap-2">
                    <Text className="text-lg text-gray-800">•</Text>
                    <Text className="text-lg font-bold text-gray-700">
                      Setting Type:
                    </Text>
                    <Text className="text-lg text-gray-800">
                      {diamond.settingType}
                    </Text>
                  </View>
                )}
                {diamond?.dimension && (
                  <View className="flex-row items-start gap-2">
                    <Text className="text-lg text-gray-800">•</Text>
                    <Text className="text-lg font-bold text-gray-700">
                      Dimension:
                    </Text>
                    <Text className="text-lg text-gray-800">
                      {diamond.dimension}
                    </Text>
                  </View>
                )}
                {diamond?.lengthWidthRatio && (
                  <View className="flex-row items-start gap-2">
                    <Text className="text-lg text-gray-800">•</Text>
                    <Text className="text-lg font-bold text-gray-700">
                      Length/Width Ratio:
                    </Text>
                    <Text className="text-lg text-gray-800">
                      {diamond.lengthWidthRatio}
                    </Text>
                  </View>
                )}
                {diamond?.documentDiamonds?.length > 0 && (
                  <View className="mt-2">
                    <Text className="text-lg font-bold text-gray-700">
                      Documents:
                    </Text>
                    {diamond.documentDiamonds.map((doc, docIndex) => (
                      <TouchableOpacity
                        key={docIndex}
                        onPress={() => Linking.openURL(doc.documentLink)}
                        className="flex-row items-center gap-2 mt-1 ml-4">
                        <MaterialCommunityIcons
                          name="file-document"
                          size={20}
                          color="#3B82F6"
                        />
                        <Text className="text-base text-blue-500 underline">
                          {doc.documentTitle}
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                )}
                {diamond?.imageDiamonds?.length > 0 && (
                  <View className="mt-2">
                    <Text className="text-lg font-bold text-gray-700">
                      Images:
                    </Text>
                    <ScrollView horizontal className="mt-1">
                      {diamond.imageDiamonds.map((img, imgIndex) => (
                        <Image
                          key={imgIndex}
                          source={{ uri: img.imageLink }}
                          className="w-20 h-20 mr-2 rounded"
                          resizeMode="cover"
                        />
                      ))}
                    </ScrollView>
                  </View>
                )}
              </View>
            ))}
          </View>
        )}

        {/* Secondary Diamonds */}
        {details?.secondaryDiamonds?.length > 0 && (
          <View className="mt-4">
            <Text className="mb-2 text-xl font-bold">Secondary Diamonds</Text>
            {details.secondaryDiamonds.map((diamond, index) => (
              <View key={index} className="mb-3 ml-4">
                {diamond?.color && (
                  <View className="flex-row items-start gap-2">
                    <Text className="text-lg text-gray-800">•</Text>
                    <Text className="text-lg font-bold text-gray-700">
                      Color:
                    </Text>
                    <Text className="text-lg text-gray-800">
                      {diamond.color}
                    </Text>
                  </View>
                )}
                {diamond?.clarity && (
                  <View className="flex-row items-start gap-2">
                    <Text className="text-lg text-gray-800">•</Text>
                    <Text className="text-lg font-bold text-gray-700">
                      Clarity:
                    </Text>
                    <Text className="text-lg text-gray-800">
                      {diamond.clarity}
                    </Text>
                  </View>
                )}
                {diamond?.quantity && (
                  <View className="flex-row items-start gap-2">
                    <Text className="text-lg text-gray-800">•</Text>
                    <Text className="text-lg font-bold text-gray-700">
                      Quantity:
                    </Text>
                    <Text className="text-lg text-gray-800">
                      {diamond.quantity}
                    </Text>
                  </View>
                )}
                {diamond?.settingType && (
                  <View className="flex-row items-start gap-2">
                    <Text className="text-lg text-gray-800">•</Text>
                    <Text className="text-lg font-bold text-gray-700">
                      Setting Type:
                    </Text>
                    <Text className="text-lg text-gray-800">
                      {diamond.settingType}
                    </Text>
                  </View>
                )}
                {diamond?.documentDiamonds?.length > 0 && (
                  <View className="mt-2">
                    <Text className="text-lg font-bold text-gray-700">
                      Documents:
                    </Text>
                    {diamond.documentDiamonds.map(
                      (
                        doc: {
                          documentLink: string;
                          documentTitle:
                            | string
                            | number
                            | boolean
                            | React.ReactElement<
                                any,
                                string | React.JSXElementConstructor<any>
                              >
                            | Iterable<React.ReactNode>
                            | React.ReactPortal
                            | null
                            | undefined;
                        },
                        docIndex: React.Key | null | undefined
                      ) => (
                        <TouchableOpacity
                          key={docIndex}
                          onPress={() => Linking.openURL(doc.documentLink)}
                          className="flex-row items-center gap-2 mt-1 ml-4">
                          <MaterialCommunityIcons
                            name="file-document"
                            size={20}
                            color="#3B82F6"
                          />
                          <Text className="text-base text-blue-500 underline">
                            {doc.documentTitle}
                          </Text>
                        </TouchableOpacity>
                      )
                    )}
                  </View>
                )}
                {diamond?.imageDiamonds?.length > 0 && (
                  <View className="mt-2">
                    <Text className="text-lg font-bold text-gray-700">
                      Images:
                    </Text>
                    <ScrollView horizontal className="mt-1">
                      {diamond.imageDiamonds.map(
                        (
                          img: { imageLink: any },
                          imgIndex: React.Key | null | undefined
                        ) => (
                          <Image
                            key={imgIndex}
                            source={{ uri: img.imageLink }}
                            className="w-20 h-20 mr-2 rounded"
                            resizeMode="cover"
                          />
                        )
                      )}
                    </ScrollView>
                  </View>
                )}
              </View>
            ))}
          </View>
        )}
      </View>
    );
  };

  // Render Sapphire Information
  const renderSapphireInfo = () => {
    if (!details?.mainShaphies?.length && !details?.secondaryShaphies?.length) {
      return null;
    }

    return (
      <View className="mt-4">
        {/* Main Sapphires */}
        {details?.mainShaphies?.length > 0 && (
          <View>
            <Text className="mb-2 text-xl font-bold">Main Sapphires</Text>
            {details.mainShaphies.map((sapphire, index) => (
              <View key={index} className="mb-3 ml-4">
                {sapphire?.color && (
                  <View className="flex-row items-start gap-2">
                    <Text className="text-lg text-gray-800">•</Text>
                    <Text className="text-lg font-bold text-gray-700">
                      Color:
                    </Text>
                    <Text className="text-lg text-gray-800">
                      {sapphire.color}
                    </Text>
                  </View>
                )}
                {sapphire?.quantity && (
                  <View className="flex-row items-start gap-2">
                    <Text className="text-lg text-gray-800">•</Text>
                    <Text className="text-lg font-bold text-gray-700">
                      Quantity:
                    </Text>
                    <Text className="text-lg text-gray-800">
                      {sapphire.quantity}
                    </Text>
                  </View>
                )}
                {sapphire?.dimension && (
                  <View className="flex-row items-start gap-2">
                    <Text className="text-lg text-gray-800">•</Text>
                    <Text className="text-lg font-bold text-gray-700">
                      Dimension:
                    </Text>
                    <Text className="text-lg text-gray-800">
                      {sapphire.dimension}
                    </Text>
                  </View>
                )}
                {sapphire?.documentShaphies?.length > 0 && (
                  <View className="mt-2">
                    <Text className="text-lg font-bold text-gray-700">
                      Documents:
                    </Text>
                    {sapphire.documentShaphies.map(
                      (doc: any, docIndex: any) => (
                        <TouchableOpacity
                          key={docIndex}
                          onPress={() => Linking.openURL(doc.documentLink)}
                          className="flex-row items-center gap-2 mt-1 ml-4">
                          <MaterialCommunityIcons
                            name="file-document"
                            size={20}
                            color="#3B82F6"
                          />
                          <Text className="text-base text-blue-500 underline">
                            {doc.documentTitle}
                          </Text>
                        </TouchableOpacity>
                      )
                    )}
                  </View>
                )}
                {sapphire?.imageShaphies?.length > 0 && (
                  <View className="mt-2">
                    <Text className="text-lg font-bold text-gray-700">
                      Images:
                    </Text>
                    <ScrollView horizontal className="mt-1">
                      {sapphire.imageShaphies.map((img: any, imgIndex: any) => (
                        <Image
                          key={imgIndex}
                          source={{ uri: img.imageLink }}
                          className="w-20 h-20 mr-2 rounded"
                          resizeMode="cover"
                        />
                      ))}
                    </ScrollView>
                  </View>
                )}
              </View>
            ))}
          </View>
        )}

        {/* Secondary Sapphires */}
        {details?.secondaryShaphies?.length > 0 && (
          <View className="mt-4">
            <Text className="mb-2 text-xl font-bold">Secondary Sapphires</Text>
            {details.secondaryShaphies.map((sapphire, index) => (
              <View key={index} className="mb-3 ml-4">
                {sapphire?.color && (
                  <View className="flex-row items-start gap-2">
                    <Text className="text-lg text-gray-800">•</Text>
                    <Text className="text-lg font-bold text-gray-700">
                      Color:
                    </Text>
                    <Text className="text-lg text-gray-800">
                      {sapphire.color}
                    </Text>
                  </View>
                )}
                {sapphire?.quantity && (
                  <View className="flex-row items-start gap-2">
                    <Text className="text-lg text-gray-800">•</Text>
                    <Text className="text-lg font-bold text-gray-700">
                      Quantity:
                    </Text>
                    <Text className="text-lg text-gray-800">
                      {sapphire.quantity}
                    </Text>
                  </View>
                )}
                {sapphire?.documentShaphies?.length > 0 && (
                  <View className="mt-2">
                    <Text className="text-lg font-bold text-gray-700">
                      Documents:
                    </Text>
                    {sapphire.documentShaphies.map(
                      (
                        doc: {
                          documentLink: string;
                          documentTitle:
                            | string
                            | number
                            | boolean
                            | React.ReactElement<
                                any,
                                string | React.JSXElementConstructor<any>
                              >
                            | Iterable<React.ReactNode>
                            | React.ReactPortal
                            | null
                            | undefined;
                        },
                        docIndex: React.Key | null | undefined
                      ) => (
                        <TouchableOpacity
                          key={docIndex}
                          onPress={() => Linking.openURL(doc.documentLink)}
                          className="flex-row items-center gap-2 mt-1 ml-4">
                          <MaterialCommunityIcons
                            name="file-document"
                            size={20}
                            color="#3B82F6"
                          />
                          <Text className="text-base text-blue-500 underline">
                            {doc.documentTitle}
                          </Text>
                        </TouchableOpacity>
                      )
                    )}
                  </View>
                )}
                {sapphire?.imageShaphies?.length > 0 && (
                  <View className="mt-2">
                    <Text className="text-lg font-bold text-gray-700">
                      Images:
                    </Text>
                    <ScrollView horizontal className="mt-1">
                      {sapphire.imageShaphies.map(
                        (
                          img: { imageLink: any },
                          imgIndex: React.Key | null | undefined
                        ) => (
                          <Image
                            key={imgIndex}
                            source={{ uri: img.imageLink }}
                            className="w-20 h-20 mr-2 rounded"
                            resizeMode="cover"
                          />
                        )
                      )}
                    </ScrollView>
                  </View>
                )}
              </View>
            ))}
          </View>
        )}
      </View>
    );
  };
  return (
    <Modal
      visible={isVisible}
      animationType="fade"
      transparent={true}
      onRequestClose={onClose}>
      <View className="items-center justify-center flex-1 bg-black/50">
        <View className="w-11/12 max-h-[95%] bg-white rounded-lg p-4">
          <TouchableOpacity
            onPress={onClose}
            className="absolute top-4 right-4">
            <MaterialCommunityIcons name="close" size={24} color="#000" />
          </TouchableOpacity>

          {/* Modal Title */}
          <Text className="mt-10 mb-4 text-2xl font-bold text-center">
            Final Valuation Details
          </Text>

          {/* Large Image with next/previous controls */}
          <ScrollView className="max-h-[80%] ml-2">
            <View className="relative items-center mb-4">
              <Image
                source={{ uri: details?.images[currentImage] }}
                className="w-full rounded-lg h-96"
                resizeMode="cover"
              />
              <TouchableOpacity
                className="absolute left-0 p-4"
                onPress={handlePreviousImage}>
                <Text className="text-2xl text-white">{"<"}</Text>
              </TouchableOpacity>
              <TouchableOpacity
                className="absolute right-0 p-4"
                onPress={handleNextImage}>
                <Text className="text-2xl text-white">{">"}</Text>
              </TouchableOpacity>
            </View>

            {/* Thumbnail List */}
            <View className="mb-4">{renderThumbnails()}</View>

            {/* Scrollable Content for item details */}
            {/* Item details */}
            <Text className="mb-2 text-sm font-semibold text-gray-600">
              {moment(details?.creationDate).format("HH:mm A, DD/MM/YYYY")}
            </Text>
            <Text className="mb-2 text-2xl font-bold">{details?.name}</Text>
            <View className="flex-row gap-2 my-2">
              <Text className="text-lg font-bold text-gray-700 ">Owner:</Text>
              <Text className="text-lg font-semibold text-blue-500">
                {" "}
                {details?.owner}
              </Text>
            </View>
            {details?.artist && (
              <View className="flex-row gap-2 mb-2">
                <Text className="text-lg font-bold text-gray-700 ">
                  Artist:
                </Text>
                <Text className="text-lg text-gray-800">
                  {" "}
                  {details?.artist}
                </Text>
              </View>
            )}

            {details?.category && (
              <View className="flex-row gap-2 mb-2">
                <Text className="text-lg font-bold text-gray-700 ">
                  Category:
                </Text>
                <Text className="text-lg text-gray-800">
                  {" "}
                  {details?.category}
                </Text>
              </View>
            )}

            <View className="ml-4">
              <View className="flex-row items-start gap-2">
                <Text className="text-lg text-gray-800">•</Text>

                <Text className="text-lg font-bold text-gray-700 ">Width:</Text>
                <Text className="text-lg text-gray-800">
                  {" "}
                  {details?.width} cm{" "}
                </Text>
              </View>
              <View className="flex-row items-start gap-2">
                <Text className="text-lg text-gray-800">•</Text>
                <Text className="text-lg font-bold text-gray-700 ">
                  Height:
                </Text>
                <Text className="text-lg text-gray-800">
                  {" "}
                  {details?.height} cm
                </Text>
              </View>
              <View className="flex-row items-start gap-2">
                <Text className="text-lg text-gray-800">•</Text>
                <Text className="text-lg font-bold text-gray-700 ">Depth:</Text>
                <Text className="text-lg text-gray-800">
                  {" "}
                  {details?.depth} cm
                </Text>
              </View>
            </View>

            {/* Additional Description Fields */}

            <View className="flex-row items-start gap-2 mt-2">
              <Text className="text-lg font-bold text-gray-700 ">
                {" "}
                Description:
              </Text>
              <Text className="text-lg text-gray-800">
                {" "}
                {details?.description}
              </Text>
            </View>
            <View className="ml-4">
              {details?.descriptionCharacteristicDetails?.map((item, index) => (
                <View key={index} className="flex-row items-start gap-2">
                  <Text className="text-lg text-gray-800">•</Text>

                  <Text className="text-lg font-bold text-gray-700 ">
                    {item.keyCharacteristic.name}:
                  </Text>
                  <Text className="text-lg text-gray-800">
                    {item.description}
                  </Text>
                </View>
              ))}
            </View>

            <View className="flex-row justify-between w-full m-2">
              <Text className="w-8 text-base font-bold text-gray-900">
                Est:
              </Text>
              {details?.estimatedCost ? (
                <Text className="text-base w-[80%] text-[#D80000] font-bold">
                  {" "}
                  {details?.estimatedCost}
                </Text>
              ) : (
                <Text className="text-base  w-[50%] text-[#D80000] font-bold">
                  0vnd
                </Text>
              )}
            </View>
            <View className="flex-row justify-between w-[90%] my-5">
              <Text className="text-base font-bold text-gray-900 w-[50%]">
                Specific price:
              </Text>
              {details?.estimatedCost ? (
                <Text className="text-base  w-[50%] text-[#D80000] font-bold">
                  {details?.specificPrice}
                </Text>
              ) : (
                <Text className="text-base  w-[50%] text-[#D80000] font-bold">
                  0vnd
                </Text>
              )}
            </View>

            <Text className="text-lg mb-4 text-[#D80000] font-bold">
              Note: {details?.note}
            </Text>

            {renderDiamondInfo()}

            {/* Sapphire Information */}
            {renderSapphireInfo()}
            <Text className="mb-2 text-xl font-bold">
              Authorization Letter:
            </Text>
            {details?.documentLink && (
              <TouchableOpacity
                onPress={
                  details?.documentLink
                    ? () => Linking.openURL(details?.documentLink)
                    : () => {}
                }
                className="flex-row items-center gap-2">
                <MaterialCommunityIcons
                  name="paperclip"
                  size={24}
                  color="#3B82F6"
                />

                <Text className="text-lg font-bold text-blue-500 underline">
                  View Authorization Letter
                </Text>
              </TouchableOpacity>
            )}
          </ScrollView>

          {/* Action Buttons */}
          {details?.status === "ManagerApproved" && (
            <View className="flex-row justify-center mt-4">
              <TouchableOpacity
                className="px-8 py-3 bg-green-500 rounded-lg"
                onPress={handlePowerOfAttorney}>
                <Text className="text-base font-bold text-white">APPROVE</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
      </View>
    </Modal>
  );
};

export default FinalValuationDetailsModal;
