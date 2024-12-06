import { deleteAccount, updateProfile } from "@/api/profileApi";
import { UserInfo } from "@/app/types/profilte_type";
import {
  showErrorMessage,
  showSuccessMessage,
} from "@/components/FlashMessageHelpers";
import LoadingOverlay from "@/components/LoadingOverlay";
import ConfirmModal from "@/components/Modal/ConfirmModalProps ";
import { logout } from "@/redux/slices/authSlice";
import { resetNotifications } from "@/redux/slices/notificationSlice";
import { RootState } from "@/redux/store";
import { useRoute } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { router, useNavigation } from "expo-router";
import moment from "moment-timezone";
import React, { useEffect, useState } from "react";
import {
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import Icon from "react-native-vector-icons/FontAwesome"; // Using FontAwesome for camera icon
import { useDispatch, useSelector } from "react-redux";
import ImageUploader from "./ImageUploader";

type RouteParams = {
  userData: UserInfo;
};
type RootStackParamList = {
  login: undefined;
};

const AccountInfo: React.FC = () => {
  const userId = useSelector((state: RootState) => state.auth.userResponse?.id); // Lấy userId từ Redux
  const dispatch = useDispatch(); // Get the Redux dispatch function
  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();
  const route = useRoute();
  const { userData } = route.params as RouteParams;

  const [isLoading, setIsLoading] = useState(false); // Trạng thái loading

  const [profile, setProfile] = useState({
    firstName: "",
    lastName: "",
    email: "",
    dateOfBirth: "",
    idIssuanceDate: "",
    idExpirationDate: "",
    address: "",
    gender: "Male", // Default gender
    citizenIdentificationCard: "",
    profileImage: "",
  });

  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
  const [datePickerType, setDatePickerType] = useState<
    "dob" | "idIssue" | "idExpire"
  >("dob");
  const [isConfirmModalVisible, setConfirmModalVisible] = useState(false);

  // Load initial data from userData
  useEffect(() => {
    if (userData) {
      setProfile({
        firstName: userData.customerDTO.firstName,
        lastName: userData.customerDTO.lastName,
        email: userData.email,
        dateOfBirth: userData.customerDTO.dateOfBirth
          ? moment(userData.customerDTO.dateOfBirth).format("DD/MM/YYYY")
          : "",
        idIssuanceDate: userData.customerDTO.idIssuanceDate
          ? moment(userData.customerDTO.idIssuanceDate).format("MM/YYYY")
          : "",
        idExpirationDate: userData.customerDTO.idExpirationDate
          ? moment(userData.customerDTO.idExpirationDate).format("MM/YYYY")
          : "",
        address: userData.customerDTO.address,
        gender: userData.customerDTO.gender || "Male",
        citizenIdentificationCard:
          userData.customerDTO.citizenIdentificationCard,
        profileImage:
          userData.customerDTO.profilePicture ||
          "https://t3.ftcdn.net/jpg/05/70/71/06/360_F_570710660_Jana1ujcJyQTiT2rIzvfmyXzXamVcby8.jpg",
      });
    }
  }, [userData]);

  // Function to toggle modal visibility
  const toggleConfirmModal = () => {
    setConfirmModalVisible(!isConfirmModalVisible);
  };
  // Handle input change
  const handleChange = (field: string, value: string) => {
    setProfile({ ...profile, [field]: value });
  };

  const handleSaveChanges = async () => {
    if (!userId) {
      showErrorMessage("User ID not found.");
      navigation.navigate("login");
      router.push("/login"); // Chuyển hướng đến trang đăng nhập

      return;
    }

    setIsLoading(true); // Bắt đầu loading
    console.log("Loading started"); // Log kiểm tra

    const profilePayload = {
      firstName: profile.firstName,
      lastName: profile.lastName,
      email: profile.email,
      gender: profile.gender,
      address: profile.address,
      citizenIdentificationCard: profile.citizenIdentificationCard,
      dateOfBirth: profile.dateOfBirth
        ? moment(profile.dateOfBirth, "DD/MM/YYYY").toISOString()
        : "",
      idIssuanceDate: profile.idIssuanceDate
        ? moment(profile.idIssuanceDate, "MM/YYYY")
            .startOf("month")
            .toISOString()
        : "",
      idExpirationDate: profile.idExpirationDate
        ? moment(profile.idExpirationDate, "MM/YYYY")
            .startOf("month")
            .toISOString()
        : "",
      profileImage: profile.profileImage || null,
    };

    try {
      const updateData = await updateProfile(userId, profilePayload);
      console.log("Update response:", updateData); // Log kết quả API
      if (updateData.isSuccess) {
        showSuccessMessage("Profile updated successfully!");
        setIsLoading(false); // Kết thúc loading
      } else {
        showErrorMessage(updateData.message || "Failed to update profile.");
        throw new Error(updateData.message || "Failed to update profile.");
      }
    } catch (error: any) {
      console.error("Error updating profile:", error?.message || error);
      showErrorMessage(error?.message || "An unknown error occurred.");
    } finally {
      setIsLoading(false); // Kết thúc loading
    }
  };

  // Handle profile image change (You would trigger image picker here)
  const handleChangeProfileImage = () => {
    // Placeholder function for changing profile image
    console.log("Change profile image");
  };

  const showDatePicker = (type: "dob" | "idIssue" | "idExpire") => {
    setDatePickerType(type);
    setDatePickerVisibility(true);
  };

  const hideDatePicker = () => {
    setDatePickerVisibility(false);
  };

  const handleDateConfirm = (selectedDate: Date) => {
    if (datePickerType === "dob") {
      setProfile({
        ...profile,
        dateOfBirth: moment(selectedDate).format("DD/MM/YYYY"),
      });
    } else {
      const formattedDate = moment(selectedDate).format("MM/YYYY");
      if (datePickerType === "idIssue") {
        setProfile({ ...profile, idIssuanceDate: formattedDate });
      } else if (datePickerType === "idExpire") {
        setProfile({ ...profile, idExpirationDate: formattedDate });
      }
    }
    hideDatePicker();
  };

  // Handle delete account
  const handleDeleteAccount = async () => {
    if (!userId) {
      showErrorMessage("User ID not found.");
      navigation.navigate("login");
      return;
    }

    try {
      await deleteAccount(userId);
      // Trigger logout
      setConfirmModalVisible(false); // Close the modal
      dispatch(logout()); // Dispatch the logout action to log out the user
      dispatch(resetNotifications()); // Reset notifications on logout
      navigation.navigate("login"); // Navigate to login screen
    } catch (error) {
      console.error("Error deleting account:", error);
    }
  };

  const defaultAvatar = "https://via.placeholder.com/150";

  return (
    <>
      {isLoading && <LoadingOverlay visible={isLoading} />}
      <View className="flex-1 p-4 bg-white">
        <ScrollView>
          {/* Profile Image with Camera Icon */}
          <View className="relative mx-auto mb-4">
            {/* ImageUploader */}
            <ImageUploader
              imageUri={profile.profileImage}
              setImageUri={(uri) =>
                setProfile({ ...profile, profileImage: uri || "" })
              }
            />

            {/* Camera Icon positioned at bottom-left
          <TouchableOpacity
            className="absolute bottom-0 left-0 p-2 bg-gray-300 rounded-full"
            onPress={() => console.log("Change profile image")}
          >
            <Icon name="camera" size={20} color="#000" />
          </TouchableOpacity> */}
          </View>

          {/* Editable Inputs for Profile Data */}
          <View className="mb-4">
            <Text className="mb-1 font-semibold text-gray-700">First Name</Text>
            <TextInput
              value={profile.firstName}
              onChangeText={(value) => handleChange("firstName", value)}
              placeholder="Enter your first name"
              className="p-2 border-b border-gray-400"
            />
          </View>

          <View className="mb-4">
            <Text className="mb-1 font-semibold text-gray-700">Last Name</Text>
            <TextInput
              value={profile.lastName}
              onChangeText={(value) => handleChange("lastName", value)}
              placeholder="Enter your last name"
              className="p-2 border-b border-gray-400"
            />
          </View>

          {/* <View className="mb-4">
          <Text className="mb-1 font-semibold text-gray-700">Phone Number</Text>
          <TextInput
            value={profile.phoneNumber}
            onChangeText={(value) => handleChange("phoneNumber", value)}
            placeholder="Enter your phone number"
            className="p-2 border-b border-gray-400"
          />
        </View> */}

          <View className="mb-4">
            <Text className="mb-1 font-semibold text-gray-700">Email</Text>
            <TextInput
              value={profile.email}
              onChangeText={(value) => handleChange("email", value)}
              placeholder="Enter your email"
              className="p-2 border-b border-gray-400"
            />
          </View>

          <View className="mb-4">
            <Text className="mb-1 font-semibold text-gray-700">Gender</Text>
            <View className="flex-row justify-between">
              <TouchableOpacity
                onPress={() => setProfile({ ...profile, gender: "Male" })}
                className={`flex-1 p-2 mr-2 rounded ${
                  profile.gender === "Male" ? "bg-blue-500" : "bg-gray-200"
                }`}>
                <Text className="font-semibold text-center text-white">
                  Male
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => setProfile({ ...profile, gender: "Female" })}
                className={`flex-1 p-2 ml-2 rounded ${
                  profile.gender === "Female" ? "bg-pink-500" : "bg-gray-200"
                }`}>
                <Text className="font-semibold text-center text-white">
                  Female
                </Text>
              </TouchableOpacity>
            </View>
          </View>

          <View className="mb-4">
            <Text className="mb-1 font-semibold text-gray-700">
              Date of Birth
            </Text>
            <View className="flex-row items-center border-b border-gray-400">
              <TextInput
                value={profile.dateOfBirth}
                placeholder="DD/MM/YYYY"
                editable={false}
                className="flex-1 p-2 text-gray-700"
              />
              <TouchableOpacity onPress={() => showDatePicker("dob")}>
                <Icon name="calendar" size={24} color="#000" />
              </TouchableOpacity>
            </View>
          </View>
          <View className="mb-4">
            <Text className="mb-1 font-semibold text-gray-700">
              Citizen ID Card
            </Text>
            <TextInput
              value={profile.citizenIdentificationCard}
              onChangeText={(value) =>
                handleChange("citizenIdentificationCard", value)
              }
              placeholder="Enter your Citizen ID Card"
              className="p-2 border-b border-gray-400"
            />
          </View>

          <View className="mb-4">
            <Text className="mb-1 font-semibold text-gray-700">
              ID Issuance Date
            </Text>
            <View className="flex-row items-center border-b border-gray-400">
              <TextInput
                value={profile.idIssuanceDate}
                placeholder="MM/YYYY"
                editable={false}
                className="flex-1 p-2 text-gray-700"
              />
              <TouchableOpacity onPress={() => showDatePicker("idIssue")}>
                <Icon name="calendar" size={24} color="#000" />
              </TouchableOpacity>
            </View>
          </View>

          <View className="mb-4">
            <Text className="mb-1 font-semibold text-gray-700">
              ID Expiration Date
            </Text>
            <View className="flex-row items-center border-b border-gray-400">
              <TextInput
                value={profile.idExpirationDate}
                placeholder="MM/YYYY"
                editable={false}
                className="flex-1 p-2 text-gray-700"
              />
              <TouchableOpacity onPress={() => showDatePicker("idExpire")}>
                <Icon name="calendar" size={24} color="#000" />
              </TouchableOpacity>
            </View>
          </View>

          {/* Save Button */}
          <TouchableOpacity
            className="p-3 mt-4 bg-blue-500 rounded-lg"
            onPress={handleSaveChanges}>
            <Text className="text-lg font-semibold text-center text-white uppercase">
              {isLoading ? "Save ..." : "Save Changes"}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            className="p-3 mt-4 bg-red-500 rounded-lg"
            onPress={toggleConfirmModal}>
            <Text className="text-lg font-semibold text-center text-white uppercase">
              Delete My Account
            </Text>
          </TouchableOpacity>
        </ScrollView>

        {/* Confirmation Modal */}
        <ConfirmModal
          isVisible={isConfirmModalVisible}
          onClose={toggleConfirmModal}
          onConfirm={handleDeleteAccount}
          confirmTextColor="red"
          message="Are you sure you want to delete your account?"
          confirmTitle="Confirm Account Deletion"
        />
        {/* DateTimePicker */}
        <DateTimePickerModal
          isVisible={isDatePickerVisible}
          mode={datePickerType === "dob" ? "date" : "date"}
          onConfirm={handleDateConfirm}
          onCancel={hideDatePicker}
          themeVariant="light"
        />
      </View>
    </>
  );
};

export default AccountInfo;
