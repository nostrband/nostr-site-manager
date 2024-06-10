"use client";
import { ReactNode, useState } from "react";
import { MainWrapper } from "@/components/Layout/MainWrapper";
import { SideBarNav } from "@/components/Layout/SideBarNav";
import { MainContent } from "@/components/Layout/MainContent";
import { PageWrapper } from "@/components/Layout/PageWrapper";
import { Header } from "@/components/Layout/Header";
import useResponsive from "@/hooks/useResponsive";

export const DashboardWrapper = ({ children }: { children: ReactNode }) => {
  const isDesktop = useResponsive("up", "lg");
  const [isOpen, setOpen] = useState(false);

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <MainWrapper>
      <SideBarNav handleClose={handleClose} isOpen={isOpen} />
      <MainContent isDesktop={isDesktop}>
        <Header handleOpen={handleOpen} />
        <PageWrapper>{children}</PageWrapper>
      </MainContent>
    </MainWrapper>
  );
};
