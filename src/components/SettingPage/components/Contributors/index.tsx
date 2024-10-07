import React, { useEffect, useState } from "react";
import {
  StyledHeadSettingBlock,
  StyledSettingBlock,
  StyledSettingCol,
} from "@/components/SettingPage/styled";
import { Typography } from "@mui/material";
import { HASH_CONFIG } from "@/consts";
import Avatar from "@mui/material/Avatar";
import {
  StyledAutorProfile,
  StyledAutorProfileGroup,
} from "@/components/SettingPage/components/Contributors/styled";
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
  contributors: pubkeysContributors,
  handleChangeContributors,
  isLoading,
  submitForm,
}: IContributors) => {
  const [isEdit, handleAction] = useEditSettingMode(submitForm, isLoading);

  const [isOpenModalAuthor, setOpenModalAuthor] = useState(false);
  const [contributors, setContributors] = useState<NDKEvent[]>([]);

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
    if (pubkeysContributors.length) {
      fetchProfiles(pubkeysContributors)
        .then((p) => {
          if (p.length) {
            setContributors(p);
          } else {
            setContributors([]);
          }
        })
        .catch(() => {
          setContributors([]);
        });
    } else {
      setContributors([]);
    }
  }, [pubkeysContributors]);

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
              text="Change contributors"
            />
          </StyledHeadSettingBlock>

          <StyledAutorProfileGroup>
            {contributors.map((el, i) => {
              let meta = JSON.parse(el.content);

              const npub = el.pubkey
                ? nip19.npubEncode(el.pubkey).substring(0, 8) + "..."
                : "";
              const name = meta.display_name || meta.name || npub;
              const img = meta.picture || "";

              return (
                <StyledAutorProfile key={i}>
                  <Avatar alt={name} src={img} />

                  <Typography variant="body1">{name}</Typography>
                </StyledAutorProfile>
              );
            })}
          </StyledAutorProfileGroup>
        </StyledSettingBlock>
      </StyledSettingCol>
      <ModalAuthorContributors
        pubkeysContributors={pubkeysContributors}
        isOpen={isOpenModalAuthor}
        handleClose={handleClose}
        handleAuthor={handleAuthor}
      />
    </>
  );
};
