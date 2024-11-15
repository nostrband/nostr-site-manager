"use client";
import { Suspense, useContext, useEffect, useState } from "react";
import { useListSites } from "@/hooks/useListSites";
import { SpinerCircularProgress, SpinerWrap } from "@/components/Spiner";
import { ListSites } from "@/components/ListSites";
import { Container } from "@mui/material";
import { GetStarted } from "@/components/GetStarted";
import { AuthContext, userPubkey } from "@/services/nostr/nostr";

export default function Home() {
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
        <Container sx={{ height: "100%" }} maxWidth="lg" disableGutters>
          {data?.length ? <ListSites data={data || []} /> : <GetStarted />}
        </Container>
      )}
    </Suspense>
  );
}
