// components/EyeLottie.js
import { useRef, useEffect } from "react";
import Lottie from "lottie-react";
import animationData from "@/public/eye-hover-blink.json";

export default function EyeLottie({ playing }) {
  const lottieRef = useRef();

  useEffect(() => {
    if (lottieRef.current) {
      lottieRef.current.playSegments(playing ? [30, 60] : [0, 30], true);
    }
  }, [playing]);

  return (
    <Lottie
      lottieRef={lottieRef}
      animationData={animationData}
      autoplay={false}
      loop={false}
      style={{ width: "100%", height: "100%" }}
    />
  );
}
