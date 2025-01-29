import { useSearchParams } from "next/navigation";
import { Start } from "./components/Start";
import { Building } from "./components/Building";
import { ChooseAuthor } from "./components/ChooseAuthor";

export const CreateSiteOnboarding = () => {
  const params = useSearchParams();

  const stepCreateSite = params.get("step");

  const isBuildingSite = stepCreateSite === "building";

  if (!params.size) {
    return <Start />;
  }

  return isBuildingSite ? <Building /> : <ChooseAuthor />;
};
