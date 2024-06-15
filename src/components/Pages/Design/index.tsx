"use client";
import { StyledPreviewTestSite } from "@/components/Pages/Preview/styled";
import Image, { StaticImageData } from "next/image";
import CloseIcon from "@mui/icons-material/Close";
import { useSearchParams, redirect } from "next/navigation";
import { THEMES_PREVIEW } from "@/consts";
import TuneIcon from "@mui/icons-material/Tune";
import { Fab, Drawer, Typography, Box, Button } from "@mui/material";
import { useState } from "react";

export const Design = () => {
  const params = useSearchParams();
  const themeId = params.get("themeId");
  const previewImg = THEMES_PREVIEW.find((el) => el.id === themeId);
  const [isOpenSettings, setOpenSettings] = useState(false);

  const handleOpenSettings = () => {
    setOpenSettings(true);
  };

  const handleCloseSettings = () => {
    setOpenSettings(false);
  };

  if (!themeId) {
    return redirect("/");
  }

  return (
    <>
      <StyledPreviewTestSite>
        <Image src={previewImg?.preview as StaticImageData} alt="test site" />
      </StyledPreviewTestSite>

      <Fab
        onClick={handleOpenSettings}
        sx={{ position: "fixed", zIndex: 5, bottom: "25px", right: "25px" }}
        color="primary"
        aria-label="open"
      >
        <TuneIcon />
      </Fab>

      <Drawer
        anchor="right"
        open={isOpenSettings}
        onClose={handleCloseSettings}
      >
        <Box sx={{ width: 320, padding: "15px" }}>
          <Typography
            variant="h5"
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <b>Settings</b>

            <Fab
              onClick={handleCloseSettings}
              size="small"
              color="primary"
              aria-label="close"
            >
              <CloseIcon />
            </Fab>
          </Typography>

          <Box
            sx={{
              position: "absolute",
              bottom: 0,
              left: 0,
              width: "100%",
              display: "flex",
              padding: "8px",
              gap: "8px",
              borderTop: "1px solid #EAEAEA",
              background: "#fff",
            }}
          >
            <Button
              onClick={handleCloseSettings}
              variant="contained"
              fullWidth
              size="medium"
              color="darkInfo"
            >
              Switch theme
            </Button>
            <Button
              onClick={handleCloseSettings}
              variant="contained"
              fullWidth
              size="medium"
              color="decorate"
            >
              Save
            </Button>
          </Box>
        </Box>
      </Drawer>
    </>
  );
};
