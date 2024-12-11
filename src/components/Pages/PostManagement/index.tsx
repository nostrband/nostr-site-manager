"use client";
import {
  Container,
} from "@mui/material";
import { useGetSiteId } from "@/hooks/useGetSiteId";
import { Head } from "./components/Head";
import { Filter } from "./components/Filter";

export const PostManagement = () => {
  const { siteId } = useGetSiteId();

  return (
    <Container maxWidth="lg">
      <Head siteId={siteId} />

      <Filter siteId={siteId} />

    </Container>
  );
};



// filter - 
// card - 
// save filter settings - 
// open filter when settings - 
// details card - 
// button added - 
