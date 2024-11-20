import React from "react";
import { StyleSheet, View } from "react-native";
import { WebView } from "react-native-webview";

const YouTubePlayer = ({ videoLink }: { videoLink: string }) => {
  const youTubeEmbedUrl = videoLink.includes("youtube")
    ? videoLink.replace("watch?v=", "embed/")
    : videoLink;

  return (
    <View style={styles.container}>
      <WebView
        source={{ uri: youTubeEmbedUrl }}
        style={styles.webview}
        javaScriptEnabled={true}
        allowsFullscreenVideo={true}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    height: 180,
    width: "100%",
  },
  webview: {
    flex: 1,
  },
});

export default YouTubePlayer;
