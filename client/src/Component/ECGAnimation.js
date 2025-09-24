// src/components/ECGAnimation.jsx
import React from "react";
import Lottie from "lottie-react";
import ecgAnimation from "../assets/ECG.json"; // Adjust path if needed

const ECGAnimation = () => {
  return (
    <div className="absolute top-1/2 left-0 w-full -translate-y-1/2 z-0 pointer-events-none">
      <Lottie
        style={{ transform: "scale(2)", transformOrigin: "center" }}
        animationData={ecgAnimation}
        loop
        autoplay
        className="w-full h-[200px] object-cover scale-125"
      />
    </div>
  );
};

export default ECGAnimation;
