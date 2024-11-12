"use client";
import { ReactNode, useCallback, useContext, useEffect, useState } from "react";
import { MainWrapper } from "@/components/Layout/MainWrapper";
import { SideBarNav } from "@/components/Layout/SideBarNav";
import { MainContent } from "@/components/Layout/MainContent";
import { PageWrapper } from "@/components/Layout/PageWrapper";
import { Header } from "@/components/Layout/Header";
import { useParams, useRouter, usePathname, redirect } from "next/navigation";
import useResponsive from "@/hooks/useResponsive";
import { useListSites } from "@/hooks/useListSites";
import { useFirstPathElement } from "@/hooks/useFirstPathElement";
import { ReturnSitesDataType } from "@/services/sites.service";
import { Box, Button, Typography } from "@mui/material";
import { AuthContext } from "@/services/nostr/nostr";

export const DashboardWrapper = ({ children }: { children: ReactNode }) => {
  const isDesktop = useResponsive("up", "lg");
  const [isOpen, setOpen] = useState(false);
  const [isLogin, setLogin] = useState(false);
  const params = useParams();
  const pathname = usePathname();
  const router = useRouter();
  const pathAdmin = useFirstPathElement();
  const { data } = useListSites();
  const { isAuth, isLoading } = useContext(AuthContext);

  const isPathAdmin = pathname === "/admin";
  const isPathAdminAdd = pathname === "/admin/add";
  const isHideSideBar = isPathAdmin || isPathAdminAdd;

  const getValidParamsId = useCallback(
    (list: ReturnSitesDataType[], id: string | string[], url: string) => {
      const isId = list.find((el) => el.id === id);

      if (isPathAdminAdd) {
        return;
      }

      if (!isId) {
        router.push(pathAdmin);
      }
    },
    [pathAdmin, router, isPathAdminAdd],
  );

  useEffect(() => {
    if (isAuth && !isLoading) {
      setLogin(true);
    }

    if (!isAuth && !isPathAdmin && !isLoading) {
      return redirect(`/admin`);
    }
  }, [isAuth, isPathAdmin, isLoading]);

  useEffect(() => {
    if (data) {
      getValidParamsId(data, params.id, pathname);
    }
  }, [data, getValidParamsId, params.id, pathname]);

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const login = async () => {
    await window.nostr!.getPublicKey();
    window.location.reload();
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
              <Box sx={{ margin: "auto", textAlign: "center" }}>
                <Button variant="contained" color="decorate" onClick={login}>
                  Login
                </Button>
                <Typography sx={{ marginTop: "15px" }}>
                  Please log in to manager your websites.
                </Typography>
              </Box>
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
