import React, { useEffect, useState } from "react";
import {
  StyledHeadSettingBlock,
  StyledSettingBlock,
  StyledSettingCol,
} from "@/components/SettingPage/styled";
import { Box, Typography } from "@mui/material";
import { HASH_CONFIG } from "@/consts";
import Avatar from "@mui/material/Avatar";
import { StyledAutorProfile } from "@/components/SettingPage/components/Contributors/styled";
import { NDKEvent } from "@nostr-dev-kit/ndk";
import { fetchProfiles } from "@/services/nostr/api";
import { nip19 } from "nostr-tools";
import { ModalAuthorContributors } from "@/components/ModalAuthorContributors";
import { SaveButton } from "@/components/SettingPage/components/SaveButton";
import { IBaseSetting } from "@/types/setting.types";
import { useEditSettingMode } from "@/hooks/useEditSettingMode";

interface IContributors extends IBaseSetting {
  contributors: string[];
  handleChangeContributors: (pubkeys: string[]) => void;
}

export const Contributors = ({
  contributors,
  handleChangeContributors,
  isLoading,
  submitForm,
}: IContributors) => {
  const [isEdit, handleAction] = useEditSettingMode(submitForm, isLoading);

  const [isOpenModalAuthor, setOpenModalAuthor] = useState(false);
  const [author, setAuthor] = useState<NDKEvent | undefined>(undefined);

  const pubkey = contributors?.[0] || "";
  const pubkeysContributors = contributors.slice(1);

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

  const handleAuthor = (pubkeyAuthors: string[] | any) => {
    handleChangeContributors(pubkeyAuthors);
  };

  const handleClose = () => {
    setOpenModalAuthor(false);
  };

  const handleClick = async () => {
    await handleAction();

    if (!isEdit) {
      setOpenModalAuthor(true);
    }
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

            <SaveButton
              isEdit={isEdit}
              isLoading={isLoading}
              handleAction={handleClick}
              text="Change author"
            />
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
      <ModalAuthorContributors
        pubkey={pubkey}
        pubkeysContributors={pubkeysContributors}
        isOpen={isOpenModalAuthor}
        handleClose={handleClose}
        handleAuthor={handleAuthor}
      />
    </>
  );
};
