"use client";
import { Suspense, useContext, useEffect, useState } from "react";
import { useListSites } from "@/hooks/useListSites";
import { SpinerCircularProgress, SpinerWrap } from "@/components/Spiner";
import { GetStarted } from "@/components/GetStarted";
import { AuthContext, userPubkey } from "@/services/nostr/nostr";
import { StyledWrapCenter } from "@/components/Layout/MainContent";
import { Container } from "@mui/material";
import {
  StyledTitle,
  StyledButtonAdd,
  StyledButtonAddWrap,
  StyledWrapPage,
} from "./styled";
import { useFirstPathElement } from "@/hooks/useFirstPathElement";
import Link from "next/link";
import { ListSites } from "@/components/ListSites";
import { PlusIcon } from "@/components/Icons";

export const AdminPage = () => {
  const pathAdmin = useFirstPathElement();
  const { data, isLoading, isFetching } = useListSites();
  const { isAuth } = useContext(AuthContext);
  const [pubkey, setPubkey] = useState("");

  useEffect(() => {
    if (pubkey && userPubkey !== pubkey) {
      window.location.reload();
    }
    setPubkey(userPubkey);
  }, [isAuth]);

  return (
    <Suspense>
      {isLoading || isFetching ? (
        <SpinerWrap>
          <SpinerCircularProgress />
        </SpinerWrap>
      ) : (
        <>
          {data?.length ? (
            <StyledWrapPage>
              <Container maxWidth="lg">
                <StyledTitle>Your websites</StyledTitle>

                <ListSites
                  data={data}
                  path={pathAdmin}
                  isLinkToOpenSite
                  isPublic={false}
                  isAuth={isAuth}
                />
              </Container>

              <StyledButtonAddWrap>
                <StyledButtonAdd
                  LinkComponent={Link}
                  href="/admin/create-site"
                  color="decorate"
                  variant="contained"
                  size="large"
                  fullWidth
                >
                  Create new website
                  <PlusIcon />
                </StyledButtonAdd>
              </StyledButtonAddWrap>
            </StyledWrapPage>
          ) : (
            <StyledWrapCenter>
              <GetStarted />
            </StyledWrapCenter>
          )}
        </>
      )}
    </Suspense>
  );
};
