import { Box, Button } from "@mui/material";
import {
  StyledDescriptionPage,
  StyledTitlePage,
  StyledWrapAuthors,
  StyledAuthor,
  StyledChevronRightIcon,
  StyledAuthorName,
  StyledAuthorRole,
  StyledAuthorAvatar,
  StyledAuthorText,
  StyledDivider,
  StyledAuthorDescription,
  StyledAuthorChoose,
  StyledChevronLeftIcon,
} from "../../../styled";
import { useEffect, useState } from "react";
import { SCREEN } from "@/consts";
import { parseProfileEvent } from "@/services/nostr/nostr";
import { SiteType } from "@/services/nostr/onboard";
import {
  KIND_LONG_NOTE,
  KIND_NOTE,
  KIND_OLAS,
  KIND_VIDEO_VERTICAL,
} from "libnostrsite";
import { fetchProfiles } from "@/services/nostr/api";

interface ChooseAuthorProps {
  createSite: (author: string, type: SiteType, kinds: number[]) => void;
}

type TypeAuthor = {
  pubkey: string;
  type: SiteType;
  kinds: number[];
  typename: string;
  img?: string;
  name?: string;
  about?: string;
};

const goodAuthors: TypeAuthor[] = [
  {
    pubkey: "1bd32a386a7be6f688b3dc7c480efc21cd946b43eac14ba4ba7834ac77a23e69",
    type: "note",
    typename: "Microblog",
    kinds: [KIND_NOTE],
  },
  {
    pubkey: "97c70a44366a6535c145b333f973ea86dfdc2d7a99da618c40c64705ad98e322",
    type: "blog",
    typename: "Blog",
    kinds: [KIND_LONG_NOTE],
  },
  {
    pubkey: "7d33ba57d8a6e8869a1f1d5215254597594ac0dbfeb01b690def8c461b82db35",
    type: "photo",
    typename: "Photoblog",
    kinds: [KIND_OLAS],
  },
  {
    pubkey: "47f97d4e0a640c8a963d3fa71d9f0a6aad958afa505fefdedd6d529ef4122ef3",
    type: "video",
    typename: "Videoblog",
    kinds: [KIND_VIDEO_VERTICAL],
  },
  {
    pubkey: "7f573f55d875ce8edc528edf822949fd2ab9f9c65d914a40225663b0a697be07",
    type: "podcast",
    typename: "Podcast",
    kinds: [KIND_NOTE],
  },
];

export const ChooseAuthor = ({
  createSite,
}: ChooseAuthorProps) => {
  const [authors, setAuthors] = useState<TypeAuthor[]>(goodAuthors);
  const [authorData, setAuthorData] = useState<TypeAuthor | null>(null);

  useEffect(() => {
    const load = async () => {
      const pubkeys = authors.map((u) => u.pubkey);
      const profiles = await fetchProfiles(pubkeys);
      for (const u of authors) {
        const profile = profiles.find((p) => p.pubkey === u.pubkey);
        const { name, img, about } = parseProfileEvent(u.pubkey, profile);
        u.name = name;
        u.img = img;
        u.about = about;
      }

      setAuthors([...authors]);
    };
    load();
  }, []);

  const handleCloseAuthor = () => {
    setAuthorData(null);
  };

  const handleChooseAuthor = async (author: TypeAuthor) => {
    setAuthorData(author);
  };

  const handleCreateSite = (pubkey: string) => {
    const author = authors.find((u) => u.pubkey === pubkey);
    createSite(pubkey, author!.type, author!.kinds);
  };

  return (
    <>
      <StyledTitlePage>Oops! You don’t have any posts yet.</StyledTitlePage>
      <StyledDescriptionPage variant="body2">
        Let&apos;s make a sample site with someone else&apos;s content. Choose
        an author below:
      </StyledDescriptionPage>

      <StyledWrapAuthors>
        {authorData ? (
          <>
            <StyledAuthorChoose>
              <StyledChevronLeftIcon onClick={handleCloseAuthor} />
              <StyledAuthorAvatar src={authorData.img} />
              <Box>
                <StyledAuthorName>{authorData.name}</StyledAuthorName>
                <StyledAuthorRole variant="body2">
                  {authorData.typename}
                </StyledAuthorRole>
              </Box>
            </StyledAuthorChoose>
            <StyledAuthorDescription variant="body2">
              {authorData.about}
            </StyledAuthorDescription>
            <StyledDivider />
            <StyledAuthorText>
              You can create a sample {authorData.typename} using content
              by {authorData.name}
            </StyledAuthorText>

            <Button
              onClick={() => handleCreateSite(authorData.pubkey)}
              color="decorate"
              size="large"
              variant="contained"
              fullWidth
            >
              Create a {authorData.typename}
            </Button>
          </>
        ) : (
          authors.map((el, i) => (
            <StyledAuthor onClick={() => handleChooseAuthor(el)} key={i}>
              <StyledAuthorAvatar src={el.img} />
              <Box>
                <StyledAuthorName>{el.name}</StyledAuthorName>
                <StyledAuthorRole variant="body2">
                  {el.typename}
                </StyledAuthorRole>
              </Box>
              <StyledChevronRightIcon />
            </StyledAuthor>
          ))
        )}
      </StyledWrapAuthors>
    </>
  );
};
