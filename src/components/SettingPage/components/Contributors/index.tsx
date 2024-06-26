import React, { useEffect, useState } from "react";
import {
  StyledHeadSettingBlock,
  StyledSettingBlock,
  StyledSettingCol,
} from "@/components/SettingPage/styled";
import { Box, Button, Typography } from "@mui/material";
import { HASH_CONFIG } from "@/consts";
import Avatar from "@mui/material/Avatar";
import { StyledAutorProfile } from "@/components/SettingPage/components/Contributors/styled";
import { NDKEvent } from "@nostr-dev-kit/ndk";
import { fetchProfiles } from "@/services/nostr/api";
import { nip19 } from "nostr-tools";
import { ModalAuthor } from "@/components/ModalAuthor";

export const Contributors = ({ contributors, handleChangeContributors }: {
  contributors: string[];
  handleChangeContributors: (pubkeys: string[]) => void;
}) => {
  const [isOpenModalAuthor, setOpenModalAuthor] = useState(false);
  const [author, setAuthor] = useState<NDKEvent | undefined>(undefined);

  const pubkey = contributors?.[0] || '';

  let meta = undefined;
  if (author) {
    try {
      meta = JSON.parse(author.content);
    } catch {}
  }

  const npub = pubkey ? nip19.npubEncode(pubkey).substring(0, 8) + "..." : "";
  const name = meta?.display_name || meta?.name || npub;
  const nip05 = meta?.nip05 || meta?.name || npub;
  const img = meta?.picture || "";

  const handleAuthor = (pubkey: string | any) => {
    setOpenModalAuthor(false);
    handleChangeContributors([pubkey]);
  };
  const handleOpenModalAuthor = () => {
    setOpenModalAuthor(true);
  };

  useEffect(() => {
    if (pubkey)
      fetchProfiles([pubkey])
        .then((p) => (p.length ? setAuthor(p[0]) : []))
        .catch(() => setAuthor(undefined));
  }, [pubkey]);

  return (
    <>
      <StyledSettingCol id={HASH_CONFIG.CONTRIBUTORS}>
        <StyledSettingBlock>
          <StyledHeadSettingBlock>
            <Typography variant="h6">Contributors</Typography>

            <Button
              color="info"
              variant="outlined"
              size="small"
              onClick={handleOpenModalAuthor}
            >
              Change author
            </Button>
          </StyledHeadSettingBlock>

          <StyledAutorProfile>
            <Avatar alt={name} src={img} />

            <Box>
              <Typography variant="body1">
                {name} - <b>Owner</b>
              </Typography>
              <Typography variant="body2">{nip05}</Typography>
            </Box>
          </StyledAutorProfile>
        </StyledSettingBlock>
      </StyledSettingCol>
      <ModalAuthor
        pubkey={pubkey}
        isOpen={isOpenModalAuthor}
        handleClose={handleAuthor}
      />
    </>
  );
};
