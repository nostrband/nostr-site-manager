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
import { useState } from "react";

export const ChooseAuthor = () => {
  const imgSrc =
    "https://image.nostr.build/26867ce34e4b11f0a1d083114919a9f4eca699f3b007454c396ef48c43628315.jpg";

  const users = [1, 2, 3, 4, 5];

  const [isChoose, setChoose] = useState(false);

  const handleChoose = () => {
    setChoose((prev) => !prev);
  };

  return (
    <>
      <StyledTitlePage>Oops. You don’t have any posts</StyledTitlePage>
      <StyledDescriptionPage variant="body2">
        Please choose another author
      </StyledDescriptionPage>

      <StyledWrapAuthors>
        {isChoose ? (
          <>
            <StyledAuthorChoose>
              <StyledChevronLeftIcon onClick={handleChoose} />
              <StyledAuthorAvatar src={imgSrc} />
              <Box>
                <StyledAuthorName>Sergio Torres</StyledAuthorName>
                <StyledAuthorRole variant="body2">Microblog</StyledAuthorRole>
              </Box>
            </StyledAuthorChoose>
            <StyledAuthorDescription variant="body2">
              Hey there! I&apos;m Sergio, a passionate blogger and storyteller
              on a mission to inspire and connect with like-minded souls. 🌍
            </StyledAuthorDescription>
            <StyledDivider />
            <StyledAuthorText>
              You can create a site from that user&apos;s content
            </StyledAuthorText>

            <Button color="decorate" size="large" variant="contained" fullWidth>
              Create a website
            </Button>
          </>
        ) : (
          users.map((el, i) => (
            <StyledAuthor onClick={handleChoose} key={i}>
              <StyledAuthorAvatar src={imgSrc} />
              <Box>
                <StyledAuthorName>Sergio Torres {el}</StyledAuthorName>
                <StyledAuthorRole variant="body2">Microblog</StyledAuthorRole>
              </Box>
              <StyledChevronRightIcon />
            </StyledAuthor>
          ))
        )}
      </StyledWrapAuthors>
    </>
  );
};
