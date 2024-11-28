"use client";
import { Box, Button, Container } from "@mui/material";
import { StyledTitle } from "@/components/GetStarted/styled";
import Link from "next/link";

export const GetStarted = () => {
  return (
    <Container maxWidth="lg">
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          height: "100%",
          width: "auto",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <StyledTitle>Start by creating your first website</StyledTitle>
        <Button
          LinkComponent={Link}
          href="/admin/add"
          size="large"
          color="decorate"
          variant="contained"
        >
          Create website &rarr;
        </Button>
      </Box>
    </Container>
  );
};
