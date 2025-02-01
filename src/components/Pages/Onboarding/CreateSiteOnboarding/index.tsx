import { useRouter } from "next/navigation";
import { Start } from "./components/Start";
import { Building } from "./components/Building";
import { ChooseAuthor } from "./components/ChooseAuthor";
import { useContext, useEffect, useState } from "react";
import { AuthContext, userPubkey } from "@/services/nostr/nostr";
import { SCREEN, TypesScreens } from "@/consts";
import { SpinerCircularProgress, SpinerWrap } from "@/components/Spiner";

export const CreateSiteOnboarding = () => {
  const router = useRouter();

  // FIXME pass pubkey of chosen author
  const pubkey = userPubkey;

  const [screen, setScreen] = useState<TypesScreens>("start");
  const [author, setAuthor] = useState<TypesScreens>(pubkey);

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

  if (screen === SCREEN.START) {
    return <Start setScreen={setScreen} />;
  }

  if (screen === SCREEN.BUILDING) {
    return <Building setScreen={setScreen} pubkey={author} />;
  }

  if (screen === SCREEN.CHOOSE_AUTHOR) {
    return <ChooseAuthor setAuthor={setAuthor} setScreen={setScreen} />;
  }

  return <Start setScreen={setScreen} />;
};
