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
