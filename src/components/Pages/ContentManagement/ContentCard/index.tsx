"use client";

import {
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  CardMedia,
  Chip,
  Typography,
} from "@mui/material";
import { format, parseISO } from "date-fns";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import VerifiedOutlinedIcon from "@mui/icons-material/VerifiedOutlined";
import { SearchPost } from "@/services/nostr/content";
import { memo, useEffect, useState } from "react";
import InsertPhotoTwoToneIcon from "@mui/icons-material/InsertPhotoTwoTone";
import { BrokenImage, DescriptionPost } from "./styled";

export const ContentCard = memo(
  ({
    card,
    submit,
  }: {
    card: SearchPost;
    submit: (card: SearchPost) => void;
  }) => {
    const [isErrorLoadImage, setErrorLoadImage] = useState(false);
    const date = parseISO(card.created_at);

    const readableDate = format(date, "dd MMMM yyyy");

    useEffect(() => {
      if (card.feature_image) {
        const img = new Image();
        img.src = card.feature_image;

        img.onload = () => {
          setErrorLoadImage(true);
        };

        img.onerror = () => {
          setErrorLoadImage(false);
        };
      }
    }, [card.feature_image]);

    return (
      <Card
        elevation={3}
        sx={{
          borderRadius: 2,
          height: "100%",
          display: "flex",
          flexDirection: "column",
        }}
      >
        {!isErrorLoadImage ? (
          <BrokenImage>
            <InsertPhotoTwoToneIcon />
          </BrokenImage>
        ) : (
          <CardMedia
            component="img"
            height="240"
            image={card.feature_image as string}
            alt={card.title as string}
            sx={{ borderTopLeftRadius: 2, borderTopRightRadius: 2 }}
          />
        )}

        <CardContent>
          <Typography
            gutterBottom
            variant="h5"
            component="div"
            sx={{ fontWeight: "bold" }}
          >
            {card.title}
          </Typography>
          <DescriptionPost variant="body2" color="text.secondary">
            {card.event.content}
          </DescriptionPost>
          <Typography variant="body2" color="text.secondary">
            {readableDate}
          </Typography>
          <Typography
            variant="body2"
            color="text.secondary"
            sx={{ fontWeight: "bold" }}
          ></Typography>
          {card.status && (
            <Chip
              icon={<VerifiedOutlinedIcon color="inherit" />}
              label={
                card.status === "auto" ? "Auto-submitted" : "Manual-submitted"
              }
              size="small"
              sx={{
                marginTop: 1,
                color: "green",
                backgroundColor: "#e2fef0",
              }}
            />
          )}
          <Box mt={1}>
            {card.tags.map((tag, idx) => (
              <Chip
                label={tag.name}
                key={idx}
                size="small"
                sx={{
                  marginRight: 0.5,
                  backgroundColor: "#e0e0e0",
                }}
              />
            ))}
          </Box>
        </CardContent>
        <CardActions sx={{ marginTop: "auto" }}>
          {!card.status ? (
            <Button
              size="small"
              variant="contained"
              color="primary"
              target="_blank"
              href=""
              onClick={() => submit(card)}
            >
              Submit
            </Button>
          ) : (
            <Button size="small" variant="outlined" color="error">
              Delete
            </Button>
          )}
          <Button size="small">
            <MoreVertIcon />
          </Button>
        </CardActions>
      </Card>
    );
  }
);

ContentCard.displayName = "ContentCard";
