import React, { memo, useEffect, useState } from "react";
import {
  StyledHeadSettingBlock,
  StyledSettingBlock,
  StyledTitleBlock,
} from "../../styled";
import { Typography } from "@mui/material";
import { SETTINGS_CONFIG } from "@/consts";
import {
  StyledAutorProfile,
  StyledAutorProfileGroup,
} from "../Contributors/styled";
import { NDKEvent } from "@nostr-dev-kit/ndk";
import { fetchProfiles } from "@/services/nostr/api";
import { nip19 } from "nostr-tools";
import { ModalAuthorContributors } from "@/components/ModalAuthorContributors";
import { SaveButton } from "../SaveButton";
import { IBaseSetting } from "@/types/setting.types";
import { useEditSettingMode } from "@/hooks/useEditSettingMode";
import { IconPersonOutlined } from "@/components/Icons";
import { ContributorAvatar } from "./components/Contributor";

interface IContributors extends IBaseSetting {
  contributors: string[];
  handleChangeContributors: (pubkeys: string[]) => void;
}

export const Contributors = memo(
  ({
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
        <StyledSettingBlock id={SETTINGS_CONFIG.contributors.anchor}>
          <StyledHeadSettingBlock>
            <StyledTitleBlock>
              {SETTINGS_CONFIG.contributors.title}
              <SaveButton
                isEdit={isEdit}
                isLoading={isLoading}
                handleAction={handleClick}
                text="Change"
                startIcon={<IconPersonOutlined />}
              />
            </StyledTitleBlock>
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
                  <ContributorAvatar alt={name} src={img} />

                  <Typography variant="body1">{name}</Typography>
                </StyledAutorProfile>
              );
            })}
          </StyledAutorProfileGroup>
        </StyledSettingBlock>

        <ModalAuthorContributors
          pubkeysContributors={pubkeysContributors}
          isOpen={isOpenModalAuthor}
          handleClose={handleClose}
          handleAuthor={handleAuthor}
        />
      </>
    );
  },
);

Contributors.displayName = "Contributors";
