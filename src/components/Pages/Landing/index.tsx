"use client";
import { HeaderOnboarding } from "@/components/HeaderOnboarding";
import { StyledIframe } from "./styled";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ModalSites } from "./components/ModalSites";

type IframeMessage = {
  type: string;
  payload?: string;
};

const Landing = () => {
  const router = useRouter();
  const [isOpen, setOpen] = useState(false);

  const handleClose = () => {
    setOpen(false);
  };

  useEffect(() => {
    const handleMessage = (event: MessageEvent<IframeMessage>) => {
      if (
        event.data.type === "BUTTON_CLICKED" &&
        event.data.payload === "GET_STARTED"
      ) {
        router.push("/onboarding");
      }

      if (
        event.data.type === "BUTTON_CLICKED" &&
        event.data.payload === "BUY_SUBSCRIPTION"
      ) {
        setOpen(true);
      }
    };

    window.addEventListener("message", handleMessage);

    return () => {
      window.removeEventListener("message", handleMessage);
    };
  }, [router]);

  return (
    <>
      <HeaderOnboarding />
      <StyledIframe src="/landing.html" sandbox="allow-scripts allow-popups" />
      <ModalSites isOpen={isOpen} handleClose={handleClose} />
    </>
  );
};

export default Landing;
