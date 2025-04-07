import { Button } from "@mui/material";
import {
  StyledActions,
  StyledDescriptionPage,
  StyledTitlePage,
} from "../../../styled";
import Link from "next/link";
import {
  AuthContext,
  parseProfileEvent,
  userProfile,
  userPubkey,
} from "@/services/nostr/nostr";
import { useContext, useEffect, useState } from "react";
import { SiteType } from "@/services/nostr/onboard";

interface StartProps {
  createSite: (author: string, type: SiteType, kinds: number[]) => void;
}

export const Start = ({ createSite }: StartProps) => {
  const { isAuth } = useContext(AuthContext);
  const [username, setUsername] = useState("");

  const handleBuilding = () => {
    createSite(userPubkey, "", []);
  };

  useEffect(() => {
    if (isAuth) {
      const { name } = parseProfileEvent(userPubkey, userProfile);
      setUsername(name.slice(0, 1).toUpperCase() + name.slice(1));
    }
  }, [isAuth]);

  return (
    <>
      <StyledTitlePage variant="h3">
        Hello{username ? ` ${username}` : ""}, Let&apos;s Make a Sample Site!
      </StyledTitlePage>
      <StyledDescriptionPage variant="body3">
        Create a draft site quickly, and then gradually improve it later.
      </StyledDescriptionPage>
      <StyledActions>
        <Button
          LinkComponent={Link}
          href="/admin"
          fullWidth
          size="large"
          variant="outlined"
        >
          Skip
        </Button>
        <Button
          onClick={handleBuilding}
          fullWidth
          size="large"
          variant="contained"
        >
          Create a site
        </Button>
      </StyledActions>
    </>
  );
};
