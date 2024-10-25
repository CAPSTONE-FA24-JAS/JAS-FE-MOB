import React, { useState, useEffect, useCallback } from "react";
import { View, Text, TextInput, TouchableOpacity, Modal } from "react-native";
import DropDownPicker from "react-native-dropdown-picker";
import { styled } from "nativewind";
import {
  getDistrictsByProvince,
  getProvinces,
  getWardsByDistrict,
} from "@/api/addressApi";

const StyledView = styled(View);
const StyledText = styled(Text);
const StyledTouchableOpacity = styled(TouchableOpacity);
const StyledTextInput = styled(TextInput);

interface AddAddressProps {
  visible: boolean;
  onClose: () => void;
  onAdd: (
    province: string,
    district: string,
    ward: string,
    deepAddress: string
  ) => void;
}

const AddAddress: React.FC<AddAddressProps> = ({ visible, onClose, onAdd }) => {
  // State variables for value IDs
  const [province, setProvince] = useState<number | null>(null);
  const [district, setDistrict] = useState<number | null>(null);
  const [ward, setWard] = useState<string | null>(null);

  // State variables for names
  const [provinceName, setProvinceName] = useState<string>("");
  const [districtName, setDistrictName] = useState<string>("");
  const [wardName, setWardName] = useState<string>("");

  const [deepAddress, setDeepAddress] = useState<string>("");

  const [provinceItems, setProvinceItems] = useState<
    { label: string; value: number }[]
  >([]);
  const [districtItems, setDistrictItems] = useState<
    { label: string; value: number }[]
  >([]);
  const [wardItems, setWardItems] = useState<
    { label: string; value: string }[]
  >([]);

  const [openProvince, setOpenProvince] = useState<boolean>(false);
  const [openDistrict, setOpenDistrict] = useState<boolean>(false);
  const [openWard, setOpenWard] = useState<boolean>(false);

  const [loadingProvinces, setLoadingProvinces] = useState<boolean>(false);
  const [loadingDistricts, setLoadingDistricts] = useState<boolean>(false);
  const [loadingWards, setLoadingWards] = useState<boolean>(false);

  const [isAddEnabled, setIsAddEnabled] = useState<boolean>(false);

  // Fetch provinces when the modal opens
  useEffect(() => {
    if (visible) {
      fetchProvinces();
      resetFields();
    }
  }, [visible]);

  // Reset fields when modal opens
  const resetFields = () => {
    setProvince(null);
    setDistrict(null);
    setWard(null);
    setProvinceName("");
    setDistrictName("");
    setWardName("");
    setDeepAddress("");
    setDistrictItems([]);
    setWardItems([]);
  };

  // Enable the 'Save' button if all fields are filled
  useEffect(() => {
    // Trim spaces and ensure all fields have values
    if (
      provinceName.trim() !== "" &&
      districtName.trim() !== "" &&
      wardName.trim() !== "" &&
      deepAddress.trim() !== ""
    ) {
      setIsAddEnabled(true);
    } else {
      setIsAddEnabled(false);
    }
  }, [provinceName, districtName, wardName, deepAddress]);

  // Fetch the list of provinces
  const fetchProvinces = async () => {
    setLoadingProvinces(true);
    try {
      const response = await getProvinces();
      if (response && response.data) {
        const formattedProvinces = response.data.map((item) => ({
          label: item.ProvinceName,
          value: item.ProvinceID,
        }));
        setProvinceItems(formattedProvinces);
      }
    } catch (error) {
      console.error("Failed to fetch provinces:", error);
    } finally {
      setLoadingProvinces(false);
    }
  };

  // Fetch the list of districts based on selected province
  const fetchDistricts = async (selectedProvinceId: number) => {
    setLoadingDistricts(true);
    try {
      const response = await getDistrictsByProvince(selectedProvinceId);
      if (response && response.data) {
        const formattedDistricts = response.data.map((item) => ({
          label: item.DistrictName,
          value: item.DistrictID,
        }));
        setDistrictItems(formattedDistricts);
      }
    } catch (error) {
      console.error("Failed to fetch districts:", error);
    } finally {
      setLoadingDistricts(false);
    }
  };

  // Fetch the list of wards based on selected district
  const fetchWards = async (selectedDistrictId: number) => {
    setLoadingWards(true);
    try {
      const response = await getWardsByDistrict(selectedDistrictId);
      if (response && response.data) {
        const formattedWards = response.data.map((item) => ({
          label: item.WardName,
          value: item.WardCode,
        }));
        setWardItems(formattedWards);
      }
    } catch (error) {
      console.error("Failed to fetch wards:", error);
    } finally {
      setLoadingWards(false);
    }
  };

  const handleProvinceChange = useCallback(
    (value: number | null, item?: any) => {
      setProvince(value);
      setProvinceName(item?.label || "");
      setDistrict(null);
      setDistrictName("");
      setWard(null);
      setWardName("");
      setWardItems([]);
      if (value !== null) {
        fetchDistricts(value);
      }
    },
    []
  );

  const handleDistrictChange = useCallback(
    (value: number | null, item?: any) => {
      setDistrict(value);
      setDistrictName(item?.label || "");
      setWard(null);
      setWardName("");
      if (value !== null) {
        fetchWards(value);
      }
    },
    []
  );

  const handleWardChange = useCallback((value: string | null, item?: any) => {
    setWard(value);
    setWardName(item?.label || "");
  }, []);

  const handleAddAddress = () => {
    if (provinceName && districtName && wardName && deepAddress.trim()) {
      onAdd(provinceName, districtName, wardName, deepAddress.trim());
    }
  };

  return (
    <Modal visible={visible} transparent animationType="slide">
      <View className="flex-1 justify-center items-center bg-black/50">
        <StyledView className="bg-white p-6 rounded-md w-11/12">
          <StyledText className="text-lg font-bold mb-4 uppercase">
            Add Address to Ship
          </StyledText>

          {/* Province Dropdown */}
          <View style={{ zIndex: openProvince ? 3000 : 1 }}>
            <Text className="mb-2">Province/City</Text>
            <DropDownPicker
              open={openProvince}
              value={province}
              items={provinceItems}
              setOpen={setOpenProvince}
              setValue={setProvince}
              placeholder="Select Province/City"
              onSelectItem={(item: any) =>
                handleProvinceChange(item.value, item)
              }
              loading={loadingProvinces}
              searchable
              style={{ marginBottom: 20, borderColor: "#808080" }}
              dropDownContainerStyle={{
                zIndex: 3000,
                backgroundColor: "#f5f5f5",
              }}
            />
          </View>

          {/* District Dropdown */}
          <View style={{ zIndex: openDistrict ? 2000 : 1 }}>
            <Text className="mb-2">District</Text>
            <DropDownPicker
              open={openDistrict}
              value={district}
              items={districtItems}
              setOpen={setOpenDistrict}
              setValue={setDistrict}
              placeholder="Select District"
              onSelectItem={(item: any) =>
                handleDistrictChange(item.value, item)
              }
              disabled={!province}
              loading={loadingDistricts}
              searchable
              style={{ marginBottom: 20, borderColor: "#808080" }}
              dropDownContainerStyle={{
                zIndex: 2000,
                backgroundColor: "#f5f5f5",
              }}
            />
          </View>

          {/* Ward Dropdown */}
          <View style={{ zIndex: openWard ? 1000 : 1 }}>
            <Text className="mb-2">Ward</Text>
            <DropDownPicker
              open={openWard}
              value={ward}
              items={wardItems}
              setOpen={setOpenWard}
              setValue={setWard}
              placeholder="Select Ward"
              onSelectItem={(item: any) => handleWardChange(item.value, item)}
              disabled={!district}
              loading={loadingWards}
              searchable
              style={{ marginBottom: 20, borderColor: "#808080" }}
              dropDownContainerStyle={{
                zIndex: 1000,
                backgroundColor: "#f5f5f5",
                maxHeight: 200, // Set max height for the dropdown to make it scrollable
              }}
              scrollViewProps={{
                nestedScrollEnabled: true, // Allows scrolling within nested ScrollViews
              }}
            />
          </View>

          {/* Deep Address Input */}
          <Text className="mb-2">Detailed Address</Text>
          <StyledTextInput
            placeholder="Enter detailed address"
            value={deepAddress}
            onChangeText={(text) => setDeepAddress(text)}
            className="border border-gray-300 p-2 mb-4 rounded-md"
          />

          {/* Buttons */}
          <View className="flex-row justify-end">
            <StyledTouchableOpacity
              className="bg-gray-400 p-3 rounded mr-2"
              onPress={onClose}
            >
              <StyledText className="text-white">Cancel</StyledText>
            </StyledTouchableOpacity>
            <StyledTouchableOpacity
              className={`p-3 rounded ${
                isAddEnabled ? "bg-blue-500" : "bg-blue-300"
              }`}
              onPress={handleAddAddress}
              disabled={!isAddEnabled}
            >
              <StyledText className="text-white">Save</StyledText>
            </StyledTouchableOpacity>
          </View>
        </StyledView>
      </View>
    </Modal>
  );
};

export default AddAddress;
