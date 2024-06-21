"use client";
import {
  Autocomplete,
  Avatar,
  Dialog,
  DialogContent,
  DialogTitle,
  Fab,
  TextField,
  Typography,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import React from "react";
import { StyledAuthor, StyledTitle } from "@/components/ModalAuthor/styled";

const authors = [
  {
    name: "Mark Twen",
    img: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQt3ul-6qH-3cEAzaOPyBLyb6_kxOyIH-KBvA&s",
  },
  {
    name: "Pushkin",
    img: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQt3ul-6qH-3cEAzaOPyBLyb6_kxOyIH-KBvA&s",
  },
  {
    name: "Marco polo",
    img: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQt3ul-6qH-3cEAzaOPyBLyb6_kxOyIH-KBvA&s",
  },
  {
    name: "Kolumb",
    img: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQt3ul-6qH-3cEAzaOPyBLyb6_kxOyIH-KBvA&s",
  },
];

export const ModalAuthor = ({ isOpen }: { isOpen: boolean }) => {
  return (
    <Dialog
      open={isOpen}
      // onClose={handleClose}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
    >
      <DialogTitle id="alert-dialog-title">
        <StyledTitle variant="h5">
          Author
          <Fab
            // onClick={handleCloseSettings}
            size="small"
            color="primary"
            aria-label="close"
          >
            <CloseIcon />
          </Fab>
        </StyledTitle>
      </DialogTitle>
      <DialogContent sx={{ width: "300px" }}>
        <StyledAuthor>
          <Avatar
            alt="Mark Twen"
            src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQt3ul-6qH-3cEAzaOPyBLyb6_kxOyIH-KBvA&s"
            sx={{ width: 43, height: 43 }}
          />
          <Typography variant="body2" component="div">
            <b>Mark Twen</b>
          </Typography>
        </StyledAuthor>

        <Autocomplete
          disablePortal
          id="combo-box-demo"
          value={authors[0]}
          options={authors}
          getOptionLabel={(option) => option.name}
          renderInput={(params) => <TextField {...params} />}
        />
      </DialogContent>
    </Dialog>
  );
};
