import { useRouter } from "next/navigation";
import { Start } from "./components/Start";
import { Building } from "./components/Building";
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

export const CreateSiteOnboarding = () => {
  const router = useRouter();

  const [screen, setScreen] = useState<TypesScreens>("start");
  const [progress, setProgress] = useState(0);

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
    kinds: number[]
  ) => {
    if (!author) author = userPubkey;

    setScreen(SCREEN.BUILDING);

    const timer = setInterval(() => {
      setProgress((prevProgress) => (prevProgress + 1) % 100);
    }, 300);

    const create = async (type: SiteType, kinds: number[]) => {
      console.log("pubkey", author, type, kinds);
      if (!type) {
        clearInterval(timer);
        setScreen(SCREEN.CHOOSE_AUTHOR);
      } else {
        try {
          const addr = await createSite(author!, type, kinds);
          setProgress(100);
          router.replace(`/admin/${addr}/dashboard/?created=true`);
        } catch (e) {
          enqueueSnackbar("Error: " + e, {
            autoHideDuration: 3000,
            variant: "warning",
            anchorOrigin: {
              horizontal: "left",
              vertical: "bottom",
            },
          });
        } finally {
          clearInterval(timer);
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
    return <Building progress={progress} />;
  }

  if (screen === SCREEN.CHOOSE_AUTHOR) {
    return <ChooseAuthor createSite={createSiteHandler} />;
  }

  return <Start createSite={createSiteHandler} />;
};
