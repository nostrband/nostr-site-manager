"use client";
import { ReactNode, useCallback, useEffect, useState } from "react";
import { MainWrapper } from "@/components/Layout/MainWrapper";
import { SideBarNav } from "@/components/Layout/SideBarNav";
import { MainContent } from "@/components/Layout/MainContent";
import { PageWrapper } from "@/components/Layout/PageWrapper";
import { Header } from "@/components/Layout/Header";
import { useParams, useRouter, usePathname } from "next/navigation";
import useResponsive from "@/hooks/useResponsive";
import { useListSites } from "@/hooks/useListSites";
import { useFirstPathElement } from "@/hooks/useFirstPathElement";
import { ReturnSitesDataType } from "@/services/sites.service";
import { Box, Button, Typography } from "@mui/material";
import { Alert, AlertTitle } from "@mui/lab";

export const DashboardWrapper = ({ children }: { children: ReactNode }) => {
  const isDesktop = useResponsive("up", "lg");
  const [isOpen, setOpen] = useState(false);
  const [isLogin, setLogin] = useState(false);
  const params = useParams();
  const pathname = usePathname();
  const router = useRouter();
  const pathAdmin = useFirstPathElement();
  const { data } = useListSites();

  const isHideSideBar = pathname === "/admin";

  const getValidParamsId = useCallback(
    (list: ReturnSitesDataType[], id: string | string[]) => {
      const isId = list.find((el) => el.id === id);

      if (!isId) {
        router.push(pathAdmin);
      }
    },
    [pathAdmin, router],
  );

  useEffect(() => {
    if (localStorage.getItem("__nostrlogin_nip46")) {
      setLogin(true);
    }
  }, []);

  useEffect(() => {
    if (data) {
      getValidParamsId(data, params.id);
    }
  }, [data, getValidParamsId, params.id, pathname]);

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const login = async () => {
    // @ts-ignore
    await window.nostr!.getPublicKey();
    // window.location.reload();
  };

  return (
    <MainWrapper>
      <MainContent isDesktop={isDesktop}>
        <Header handleOpen={handleOpen} hideSideBar={isHideSideBar} />
        <PageWrapper>
          {isLogin ? (
            children
          ) : (
            <Box sx={{ display: "flex", height: "100%" }}>
              <Alert sx={{ margin: "auto" }} severity="info">
                <AlertTitle>Your are not login</AlertTitle>
                <Typography gutterBottom>
                  Please log in to manager your websites.
                </Typography>
                <Button variant="contained" onClick={login}>
                  Login
                </Button>
              </Alert>
            </Box>
          )}
        </PageWrapper>
      </MainContent>
      {!isHideSideBar && (
        <SideBarNav handleClose={handleClose} isOpen={isOpen} />
      )}
    </MainWrapper>
  );
};
