import React from "react";
import { StyleSheet, View } from "react-native";
import { Video, ResizeMode } from "expo-av";

const VideoPlayer = ({ videoLink }: { videoLink: string }) => {
  return (
    <View style={styles.container}>
      <Video
        source={{ uri: videoLink }}
        rate={1.0}
        volume={1.0}
        isMuted={false}
        resizeMode={ResizeMode.CONTAIN}
        shouldPlay
        style={styles.video}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  video: {
    width: 320,
    height: 180,
  },
});

export default VideoPlayer;
