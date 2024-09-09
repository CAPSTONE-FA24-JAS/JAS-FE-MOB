import { Tab, TabView } from "@rneui/base";
import React from "react";
import PastBids from "@/components/Pages/MyBids/PastBids";
import CurrentBids from "@/components/Pages/MyBids/CurrentBids";

export default function MyBids() {
  const [index, setIndex] = React.useState(0);
  return (
    <>
      <Tab
        dense
        value={index}
        onChange={(e) => setIndex(e)}
        indicatorStyle={{
          backgroundColor: "transparent", // Loại bỏ indicator
          height: 0, // Đặt chiều cao indicator là 0
        }}
        containerStyle={{
          backgroundColor: "transparent", // Loại bỏ nền của tab container
          alignSelf: "center", // Đặt toàn bộ tab ở giữa màn hình
          width: "50%", // Giảm chiều rộng của tab xuống còn 50%
        }}>
        <Tab.Item
          title="Current"
          titleStyle={(active) => ({
            fontSize: 12,
            color: active ? "white" : "black", // Màu chữ khi active và không active
          })}
          containerStyle={(active) => ({
            backgroundColor: active ? "black" : "transparent", // Thay đổi màu nền khi active
            borderTopLeftRadius: 5, // Bo góc trái
            borderBottomLeftRadius: 5, // Bo góc trái
            borderWidth: 1, // Đặt viền cho tab
            borderColor: active ? "black" : "gray", // Viền có màu khi active
            width: "20%", // Đảm bảo mỗi tab item chiếm đầy 50% của container
          })}
          buttonStyle={{
            paddingVertical: 5, // Điều chỉnh padding dọc cho nhỏ hơn
            paddingHorizontal: 10, // Điều chỉnh padding ngang
          }}
        />
        <Tab.Item
          title="Past"
          titleStyle={(active) => ({
            fontSize: 12,
            color: active ? "white" : "black", // Màu chữ khi active và không active
          })}
          containerStyle={(active) => ({
            backgroundColor: active ? "black" : "transparent", // Thay đổi màu nền khi active
            borderTopRightRadius: 5, // Bo góc phải
            borderBottomRightRadius: 5, // Bo góc phải
            borderWidth: 1, // Đặt viền cho tab
            borderColor: active ? "black" : "gray", // Viền có màu khi active
            width: "20%", // Đảm bảo mỗi tab item chiếm đầy 50% của container
          })}
          buttonStyle={{
            paddingVertical: 5, // Điều chỉnh padding dọc cho nhỏ hơn
            paddingHorizontal: 10, // Điều chỉnh padding ngang
          }}
        />
      </Tab>

      <TabView value={index} onChange={setIndex} animationType="spring">
        <TabView.Item className="px-2">
          <CurrentBids />
        </TabView.Item>
        <TabView.Item style={{ width: "100%" }}>
          <PastBids />
        </TabView.Item>
      </TabView>
    </>
  );
}
