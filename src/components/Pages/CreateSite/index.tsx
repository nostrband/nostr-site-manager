"use client";

import { BuildingScreen } from "@/components/BuildingScreen";
import { Container } from "@mui/material";
import { StartScreen } from "./components/StartScreen";
import { useState } from "react";
import { SCREEN, TypesScreens } from "@/consts";
import { StyledWrapBuildingScreen, StyledWrapStartScreen } from "./styled";
import { createSite, SiteType } from "@/services/nostr/onboard";
import { enqueueSnackbar } from "notistack";
import { useRouter } from "next/navigation";
import { useListSites } from "@/hooks/useListSites";

const CreateSite = () => {
  const [screen, setScreen] = useState<TypesScreens>(SCREEN.START);
  const router = useRouter();
  const getSites = useListSites();

  const createSiteHandler = async (
    author: string,
    type: SiteType,
    kinds: number[],
  ) => {
    setScreen(SCREEN.BUILDING);

    try {
      const addr = await createSite(author, type, kinds);

      getSites.refetch().then(({ data }) => {
        router.replace(`/admin/${addr}/dashboard`);

        const site = data?.find((el) => el.id === addr);

        enqueueSnackbar(`Site ${site?.name} was created!`, {
          autoHideDuration: 10000,
          variant: "success",
          anchorOrigin: {
            horizontal: "right",
            vertical: "top",
          },
        });
      });
    } catch (e) {
      enqueueSnackbar("Error: " + e, {
        autoHideDuration: 3000,
        variant: "warning",
        anchorOrigin: {
          horizontal: "left",
          vertical: "bottom",
        },
      });

      setScreen(SCREEN.START);
    }
  };

  return (
    <Container maxWidth="lg">
      {screen === SCREEN.START ? (
        <StyledWrapStartScreen>
          <StartScreen createSite={createSiteHandler} />
        </StyledWrapStartScreen>
      ) : (
        <StyledWrapBuildingScreen>
          <BuildingScreen />
        </StyledWrapBuildingScreen>
      )}
    </Container>
  );
};

export default CreateSite;
