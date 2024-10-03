"use client";
import { Suspense } from "react";
import { Container } from "@mui/material";
import { AddWebSite } from "@/components/AddWebSite";

export default function AddSite() {
  return (
    <Suspense>
      <Container sx={{ height: "100%" }} maxWidth="lg" disableGutters>
        <AddWebSite />
      </Container>
    </Suspense>
  );
}
