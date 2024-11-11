import { Tab, TabView } from "@rneui/base";
import React, { useEffect } from "react";
import PastBids from "@/components/Pages/MyBids/PastBids";
import CurrentBids from "@/components/Pages/MyBids/CurrentBids";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import { useRoute } from "@react-navigation/native";

export default function MyBids() {
  const [index, setIndex] = React.useState(0);

  const route = useRoute<{
    key: string;
    name: string;
    params: { tab?: string };
  }>(); // Lấy tham số từ route
  const tab = route.params?.tab; // Lấy giá trị của tab từ tham số điều hướng

  // Thiết lập tab dựa vào tham số 'tab' trong route
  useEffect(() => {
    if (tab === "past") {
      setIndex(1); // Nếu tab là "past", chọn tab Past
    } else {
      setIndex(0); // Mặc định mở tab Current
    }
  }, [tab]);
  const userId = useSelector(
    (state: RootState) => state.auth.userResponse?.customerDTO?.id
  );
  return (
    <>
      <Tab
        dense
        value={index}
        onChange={(e) => setIndex(e)}
        indicatorStyle={{
          backgroundColor: "transparent",
          height: 0,
        }}
        containerStyle={{
          backgroundColor: "transparent",
          alignSelf: "center",
          width: "50%",
        }}
      >
        <Tab.Item
          title="Current"
          titleStyle={(active) => ({
            fontSize: 12,
            color: active ? "white" : "black",
          })}
          containerStyle={(active) => ({
            backgroundColor: active ? "black" : "transparent",
            borderTopLeftRadius: 5,
            borderBottomLeftRadius: 5,
            borderWidth: 1,
            borderColor: active ? "black" : "gray",
            width: "20%",
          })}
          buttonStyle={{
            paddingVertical: 5,
            paddingHorizontal: 10,
          }}
        />
        <Tab.Item
          title="Past"
          titleStyle={(active) => ({
            fontSize: 12,
            color: active ? "white" : "black",
          })}
          containerStyle={(active) => ({
            backgroundColor: active ? "black" : "transparent",
            borderTopRightRadius: 5,
            borderBottomRightRadius: 5,
            borderWidth: 1,
            borderColor: active ? "black" : "gray",
            width: "20%",
          })}
          buttonStyle={{
            paddingVertical: 5,
            paddingHorizontal: 10,
          }}
        />
      </Tab>

      <TabView value={index} onChange={setIndex} animationType="spring">
        <TabView.Item className="m-2">
          {userId !== undefined && <CurrentBids customerId={userId} />}
        </TabView.Item>
        <TabView.Item className="m-2">
          {userId !== undefined && <PastBids customerId={userId} />}
        </TabView.Item>
      </TabView>
    </>
  );
}
