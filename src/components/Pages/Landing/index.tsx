"use client";
import { HeaderOnboarding } from "@/components/HeaderOnboarding";
import { StyledIframe } from "./styled";
import { useEffect } from "react";
import { useRouter } from "next/navigation";



type IframeMessage = {
  type: string;
  payload?: string;
};

const Landing = () => {
    const router = useRouter();
  useEffect(() => {
    const handleMessage = (event: MessageEvent<IframeMessage>) => {
      if (event.data.type === "BUTTON_CLICKED") {
        router.push('/onboarding');
      }
    };

    window.addEventListener("message", handleMessage);

    return () => {
      window.removeEventListener("message", handleMessage);
    };
  }, []);

  return (
    <>
      <HeaderOnboarding />
      <StyledIframe src="/landing.html" sandbox="allow-scripts" />
    </>
  );
};

export default Landing;
