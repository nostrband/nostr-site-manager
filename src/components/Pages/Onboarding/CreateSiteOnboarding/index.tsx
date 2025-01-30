import { useRouter, useSearchParams } from "next/navigation";
import { Start } from "./components/Start";
import { Building } from "./components/Building";
import { ChooseAuthor } from "./components/ChooseAuthor";
import { useContext, useEffect } from "react";
import { AuthContext } from "@/services/nostr/nostr";

export const CreateSiteOnboarding = () => {
  const params = useSearchParams();
  const router = useRouter();

  const stepCreateSite = params.get("step");

  const isBuildingSite = stepCreateSite === "building";

  const { isAuth, isLoading } = useContext(AuthContext);

  // redirect to login if not authed
  useEffect(() => {
    if (!isAuth) router.push("/onboarding/start");
  }, [isAuth, isLoading]);

  if (isLoading) return;

  if (!params.size) {
    return <Start />;
  }

  return isBuildingSite ? <Building /> : <ChooseAuthor />;
};
