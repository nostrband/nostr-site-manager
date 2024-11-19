"use client";
import { Suspense, useContext, useEffect, useState } from "react";
import { useListSites } from "@/hooks/useListSites";
import { SpinerCircularProgress, SpinerWrap } from "@/components/Spiner";
import { GetStarted } from "@/components/GetStarted";
import { AuthContext, userPubkey } from "@/services/nostr/nostr";
import { StyledWrapCenter } from "@/components/Layout/MainContent";
import { Container } from "@mui/material";
import { StyledTitle } from "./styled";
import { useFirstPathElement } from "@/hooks/useFirstPathElement";
import { StyledButtonAdd } from "@/components/ListSites/styled";
import Link from "next/link";
import AddCircleOutlineOutlinedIcon from "@mui/icons-material/AddCircleOutlineOutlined";
import { ListSites } from "@/components/ListSites";

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
            <>
              <Container maxWidth="lg">
                <StyledTitle>Your websites</StyledTitle>
                <ListSites
                  data={data}
                  path={pathAdmin}
                  isLinkToOpenSite
                  isPublic={false}
                />
              </Container>

              <StyledButtonAdd
                LinkComponent={Link}
                href="/admin/add"
                color="decorate"
                variant="contained"
              >
                <span>Add website</span>
                <AddCircleOutlineOutlinedIcon fontSize="small" />
              </StyledButtonAdd>
            </>
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
