import { ChevronLeftIcon } from "@/components/Icons";
import { useBack } from "@/hooks/useBackPage";
import { Button } from "@mui/material";
import { useEffect, useState } from "react";
import { SelectSiteType } from "../SelectSiteType";
import { LIST_SITE_TYPES } from "@/consts";
import { SelectTypeSite, TypeAuthor } from "@/types";
import { ChooseProfile } from "../ChooseProfile";
import { SpinerCircularProgress, SpinerWrap } from "@/components/Spiner";
import { parseProfileEvent, userPubkey } from "@/services/nostr/nostr";
import { fetchProfiles } from "@/services/nostr/api";
import { detectContentType, SiteType } from "@/services/nostr/onboard";
import { StyledTitleStartPage } from "../../styled";

interface StartScreenProps {
  createSite: (
    author: string,
    type: SiteType,
    kinds: number[],
  ) => Promise<void>;
}

export const StartScreen = ({ createSite }: StartScreenProps) => {
  const { back } = useBack();
  const initialSiteType = LIST_SITE_TYPES[0];

  const [typeSite, setTypeSite] = useState<SelectTypeSite>(initialSiteType);
  const [author, setAuthor] = useState<TypeAuthor | null>(null);

  const recomendType = author
    ? (LIST_SITE_TYPES.find((el) => el.type === author.type) ?? initialSiteType)
    : initialSiteType;

  const handleBack = () => {
    back();
  };

  const handleCreateSite = async () => {
    if (author) {
      console.log(
        "handleCreateSite",
        author.pubkey,
        typeSite.type,
        typeSite.kinds,
      );
      await createSite(author.pubkey, typeSite.type, typeSite.kinds);
    }
  };

  const isLoading = !author;

  useEffect(() => {
    const init = async () => {
      try {
        const [profile] = await fetchProfiles([userPubkey]);

        if (!profile) return;

        const parseProfile = parseProfileEvent(userPubkey, profile);

        const [type, kinds] = await detectContentType(userPubkey);

        const typeSiteProfile =
          LIST_SITE_TYPES.find((el) => el.type === type) ?? initialSiteType;

        const updateAuthor = {
          pubkey: profile.pubkey,
          typename: typeSiteProfile.typename,
          type,
          kinds,
          ...parseProfile,
        };

        setAuthor(updateAuthor);
        setTypeSite(typeSiteProfile);
      } catch (error) {
        console.error("Failed to load profiles:", error);
      }
    };

    init();
  }, []);

  return (
    <>
      <StyledTitleStartPage>
        <Button
          onClick={handleBack}
          color="secondary"
          variant="text"
          sx={{ minWidth: "auto" }}
        >
          <ChevronLeftIcon />
        </Button>
        New site
      </StyledTitleStartPage>

      {isLoading ? (
        <SpinerWrap>
          <SpinerCircularProgress />
        </SpinerWrap>
      ) : (
        <>
          <ChooseProfile selectAuthor={setAuthor} author={author} />

          <SelectSiteType
            setTypeSite={setTypeSite}
            typeSite={typeSite}
            recomendType={recomendType}
          />
          <Button
            onClick={handleCreateSite}
            size="large"
            variant="contained"
            fullWidth
          >
            Create the site
          </Button>
        </>
      )}
    </>
  );
};
