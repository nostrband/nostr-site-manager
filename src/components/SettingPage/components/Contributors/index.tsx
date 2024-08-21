import React, { useEffect, useState } from "react";
import {
  StyledHeadSettingBlock,
  StyledSettingBlock,
  StyledSettingCol,
} from "@/components/SettingPage/styled";
import { Chip, Typography } from "@mui/material";
import { HASH_CONFIG, kindsMap } from "@/consts";
import Avatar from "@mui/material/Avatar";
import {
  StyledAutorProfile,
  StyledAutorProfileGroup,
  StyledAutorProfileWrap,
} from "@/components/SettingPage/components/Contributors/styled";
import { NDKEvent } from "@nostr-dev-kit/ndk";
import { fetchProfiles } from "@/services/nostr/api";
import { nip19 } from "nostr-tools";
import { ModalAuthorContributors } from "@/components/ModalAuthorContributors";
import { SaveButton } from "@/components/SettingPage/components/SaveButton";
import { IBaseSetting } from "@/types/setting.types";
import { useEditSettingMode } from "@/hooks/useEditSettingMode";
import { ContributorType } from "@/services/sites.service";

interface IContributors extends IBaseSetting {
  contributors: string[];
  defaultKinds: number[];
  defaultHashtags: string[];
  settingsContributors: ContributorType[];
  handleChangeContributors: (pubkeys: string[]) => void;
  handleChangeSettingsContributors: (contributors: ContributorType[]) => void;
}

export const Contributors = ({
  contributors: dataContributors,
  settingsContributors,
  handleChangeContributors,
  handleChangeSettingsContributors,
  isLoading,
  submitForm,
  defaultKinds,
  defaultHashtags,
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
    if (dataContributors.length) {
      fetchProfiles(dataContributors)
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
  }, [dataContributors]);

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
            {contributors.map((el) => {
              let meta = JSON.parse(el.content);

              const npub = el.pubkey
                ? nip19.npubEncode(el.pubkey).substring(0, 8) + "..."
                : "";
              const name = meta.display_name || meta.name || npub;
              const img = meta.picture || "";

              const authorContent = settingsContributors.find(
                (sc) => sc.pubkey === el.pubkey,
              );

              const authorKinds = authorContent?.kinds.length
                ? authorContent?.kinds
                : defaultKinds;
              const authorHashtags = authorContent?.hashtags.length
                ? authorContent?.hashtags
                : defaultHashtags;

              return (
                <StyledAutorProfileWrap key={el.pubkey}>
                  <StyledAutorProfile>
                    <Avatar alt={name} src={img} />

                    <Typography variant="body1">{name}</Typography>
                  </StyledAutorProfile>
                  {Boolean(authorHashtags?.length) && (
                    <Typography
                      sx={{
                        display: "flex",
                        gap: "8px",
                        flexWrap: "wrap",
                        mb: 2,
                        mt: 1,
                      }}
                      variant="body2"
                    >
                      <b>Hashtags:</b>
                      {authorHashtags?.map((el) => (
                        <Chip key={el} label={el} size="small" />
                      ))}
                    </Typography>
                  )}
                  {Boolean(authorKinds?.length) && (
                    <Typography
                      sx={{
                        display: "flex",
                        gap: "8px",
                        flexWrap: "wrap",
                        mt: 1,
                      }}
                      variant="body2"
                    >
                      <b>Kinds:</b>
                      {authorKinds?.map((el) => (
                        <Chip key={el} label={kindsMap[el]} size="small" />
                      ))}
                    </Typography>
                  )}
                </StyledAutorProfileWrap>
              );
            })}
          </StyledAutorProfileGroup>
        </StyledSettingBlock>
      </StyledSettingCol>
      <ModalAuthorContributors
        handleChangeSettingsContributors={handleChangeSettingsContributors}
        dataContributors={settingsContributors}
        pubkeysContributors={dataContributors}
        contributorsEvent={contributors}
        isOpen={isOpenModalAuthor}
        handleClose={handleClose}
        handleAuthor={handleAuthor}
        defaultKinds={defaultKinds}
        defaultHashtags={defaultHashtags}
      />
    </>
  );
};
