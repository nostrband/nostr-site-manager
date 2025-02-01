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
import { SCREEN, TypesScreens } from "@/consts";
import { userPubkey } from "@/services/nostr/nostr";

interface ChooseAuthorProps {
  setScreen: (screen: TypesScreens) => void;
  setAuthor: (pubkey: string) => void;
}

type TypeAuthor = { pubkey: string; img: string; type: string; name: string };

export const ChooseAuthor = ({ setScreen, setAuthor }: ChooseAuthorProps) => {
  const imgSrc =
    "https://image.nostr.build/26867ce34e4b11f0a1d083114919a9f4eca699f3b007454c396ef48c43628315.jpg";

  const users = [
    {
      pubkey: userPubkey,
      img: imgSrc,
      name: "Sergio Torres",
      type: "Microblog",
    },
    { pubkey: userPubkey, img: imgSrc, name: "James Smith	", type: "Blog" },
    {
      pubkey: userPubkey,
      img: imgSrc,
      name: "Matthew Turner",
      type: "Podcast",
    },
    {
      pubkey: userPubkey,
      img: imgSrc,
      name: "Laura Lance",
      type: "Photography",
    },
    {
      pubkey: userPubkey,
      img: imgSrc,
      name: "Olivia Taylor",
      type: "Magazine",
    },
  ];

  const [authorData, setAuthorData] = useState<TypeAuthor | null>(null);

  const handleCloseAuthor = () => {
    setAuthorData(null);
  };

  const handleChooseAuthor = (author: TypeAuthor) => {
    setAuthorData(author);
  };

  const handleCreateSite = (pubkey: string) => {
    setScreen(SCREEN.BUILDING);
    setAuthor(pubkey);
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
              <StyledAuthorAvatar src={imgSrc} />
              <Box>
                <StyledAuthorName>{authorData.name}</StyledAuthorName>
                <StyledAuthorRole variant="body2">{authorData.type}</StyledAuthorRole>
              </Box>
            </StyledAuthorChoose>
            <StyledAuthorDescription variant="body2">
              Hey there! I&apos;m Sergio, a passionate blogger and storyteller
              on a mission to inspire and connect with like-minded souls. 🌍
            </StyledAuthorDescription>
            <StyledDivider />
            <StyledAuthorText>
              You can create a sample {authorData.type} using content by{" "}
              {authorData.name}
            </StyledAuthorText>

            <Button
              onClick={() => handleCreateSite(authorData.pubkey)}
              color="decorate"
              size="large"
              variant="contained"
              fullWidth
            >
              Create a {authorData.type}
            </Button>
          </>
        ) : (
          users.map((el, i) => (
            <StyledAuthor onClick={() => handleChooseAuthor(el)} key={i}>
              <StyledAuthorAvatar src={el.img} />
              <Box>
                <StyledAuthorName>{el.name}</StyledAuthorName>
                <StyledAuthorRole variant="body2">{el.type}</StyledAuthorRole>
              </Box>
              <StyledChevronRightIcon />
            </StyledAuthor>
          ))
        )}
      </StyledWrapAuthors>
    </>
  );
};
