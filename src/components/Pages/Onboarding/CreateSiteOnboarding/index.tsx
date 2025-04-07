import { useRouter } from "next/navigation";
import { Start } from "./components/Start";
import { ChooseAuthor } from "./components/ChooseAuthor";
import { useContext, useEffect, useState } from "react";
import { AuthContext, userPubkey } from "@/services/nostr/nostr";
import { SCREEN, TypesScreens } from "@/consts";
import { SpinerCircularProgress, SpinerWrap } from "@/components/Spiner";
import {
  SiteType,
  createSite,
  detectContentType,
} from "@/services/nostr/onboard";
import { enqueueSnackbar } from "notistack";
import { BuildingScreen } from "@/components/BuildingScreen";
import { useListSites } from "@/hooks/useListSites";

const CreateSiteOnboarding = () => {
  const router = useRouter();
  const getSites = useListSites();

  const [screen, setScreen] = useState<TypesScreens>(SCREEN.START);

  const { isAuth, isLoading } = useContext(AuthContext);

  // redirect to login if not authed
  useEffect(() => {
    if (!isAuth && !isLoading) router.replace("/onboarding/start");
  }, [isAuth, isLoading]);

  if (isLoading) {
    return (
      <SpinerWrap>
        <SpinerCircularProgress />
      </SpinerWrap>
    );
  }

  const createSiteHandler = async (
    author: string,
    type: SiteType,
    kinds: number[],
  ) => {
    if (!author) author = userPubkey;

    setScreen(SCREEN.BUILDING);

    const create = async (type: SiteType, kinds: number[]) => {
      console.log("pubkey", author, type, kinds);
      if (!type) {
        setScreen(SCREEN.CHOOSE_AUTHOR);
      } else {
        try {
          const addr = await createSite(author!, type, kinds);

          router.replace(`/admin/${addr}/dashboard/?created=true`);

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
        }
      }
    };

    if (type) create(type, kinds);
    else {
      const [type, kinds] = await detectContentType(author);
      create(type, kinds);
    }
  };

  if (screen === SCREEN.BUILDING) {
    return <BuildingScreen />;
  }

  if (screen === SCREEN.CHOOSE_AUTHOR) {
    return <ChooseAuthor createSite={createSiteHandler} />;
  }

  return <Start createSite={createSiteHandler} />;
};

export default CreateSiteOnboarding;
