import React from "react";

export default function SplashScreen({ onFinish }) {
  return (
    <div style={styles.container}>
      <video
        src="/logo.mp4"
        autoPlay
        muted
        playsInline
        onEnded={onFinish}
        style={styles.video}
      />
    </div>
  );
}

const styles = {
  container: {
    width: "100vw",
    height: "100vh",
    backgroundColor: "black",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  video: {
    width: "100%",
    height: "100%",
    objectFit: "cover",
  },
};
