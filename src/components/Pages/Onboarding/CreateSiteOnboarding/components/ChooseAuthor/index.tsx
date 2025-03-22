import { Box, Button, Typography } from "@mui/material";
import {
  StyledDescriptionPage,
  StyledTitlePage,
  StyledWrapAuthors,
  StyledAuthor,
  StyledChevronRightIcon,
  StyledAuthorAvatar,
  StyledAuthorText,
  StyledDivider,
  StyledAuthorChoose,
  StyledChevronLeftIcon,
} from "../../../styled";
import { useEffect, useState } from "react";
import { SiteType } from "@/services/nostr/onboard";
import { TypeAuthor } from "@/types";
import { RECOMMENDED_AUTHORS } from "@/consts";
import { getRecomendAuthors } from "@/utils";

interface ChooseAuthorProps {
  createSite: (author: string, type: SiteType, kinds: number[]) => void;
}

export const ChooseAuthor = ({ createSite }: ChooseAuthorProps) => {
  const [authors, setAuthors] = useState<TypeAuthor[]>(RECOMMENDED_AUTHORS);
  const [authorData, setAuthorData] = useState<TypeAuthor | null>(null);

  useEffect(() => {
    getRecomendAuthors(RECOMMENDED_AUTHORS, setAuthors);
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
      <StyledTitlePage variant="h3">
        Oops! You don’t have any posts yet.
      </StyledTitlePage>
      <StyledDescriptionPage variant="body3">
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
                <Typography variant="h6">{authorData.name}</Typography>
                <Typography variant="body4">{authorData.typename}</Typography>
              </Box>
            </StyledAuthorChoose>
            <Typography variant="body4">{authorData.about}</Typography>
            <StyledDivider />
            <StyledAuthorText variant="h6">
              You can create a sample {authorData.typename} using content by{" "}
              {authorData.name}
            </StyledAuthorText>

            <Button
              onClick={() => handleCreateSite(authorData.pubkey)}
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
                <Typography variant="h6">{el.name}</Typography>
                <Typography variant="body4">{el.typename}</Typography>
              </Box>
              <StyledChevronRightIcon />
            </StyledAuthor>
          ))
        )}
      </StyledWrapAuthors>
    </>
  );
};
