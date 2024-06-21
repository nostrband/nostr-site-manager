"use client";
import {
  Autocomplete,
  Avatar,
  DialogTitle,
  Fab,
  ListItem,
  TextField,
  Typography,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import React, { SyntheticEvent, useEffect, useMemo, useState } from "react";
import {
  StyledAuthor,
  StyledTitle,
  StyledDialog,
  StyledDialogContent,
} from "@/components/ModalAuthor/styled";
import { debounce } from "lodash";
import ListItemAvatar from "@mui/material/ListItemAvatar";
import ListItemText from "@mui/material/ListItemText";

const fakeData = [
  {
    name: "Mark Twen",
    img: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQt3ul-6qH-3cEAzaOPyBLyb6_kxOyIH-KBvA&s",
  },
  {
    name: "Pushkin",
    img: "https://i.guim.co.uk/img/media/cbeae20cc62776fbbdf46b367b1a9d5799eb7e27/0_342_3757_2254/master/3757.jpg?width=1200&height=900&quality=85&auto=format&fit=crop&s=a63e9891be403d8894542cb477e5b611",
  },
  {
    name: "Marko polo",
    img: "https://hips.hearstapps.com/hmg-prod/images/gettyimages-168967170.jpg?crop=0.608xw:0.506xh;0.192xw,0.170xh&resize=1200:*",
  },
  {
    name: "Kolumb",
    img: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR5aqGZJHnAwFP1dRQ1i-hDmGgQEuI4WgDy_g&s",
  },
];

export const ModalAuthor = ({
  isOpen,
  handleClose,
}: {
  isOpen: boolean;
  handleClose: () => void;
}) => {
  const [inputValue, setInputValue] = useState("");
  const [options, setOptions] = useState<{ name: string; img: string }[]>([]);
  const [isLoading, setLoading] = useState(false);
  const [author, setAuthor] = useState(fakeData[0]);

  const fetchData = async (query: string) => {
    try {
      setLoading(true);
      setTimeout(() => {
        const response = [...fakeData].filter((option) =>
          option.name.toLowerCase().includes(query.toLowerCase()),
        );

        setOptions(response);
        setLoading(false);
      }, 1000);
    } catch (error) {
      setLoading(false);
      console.error("Error fetching data:", error);
    }
  };

  const handleChangeAuthor = (
    _: SyntheticEvent<Element, Event>,
    author: { name: string; img: string } | string | null,
  ) => {
    if (author !== null && typeof author !== "string") {
      setAuthor(author);
      handleClose();
    }
  };

  const debouncedFetchData = useMemo(() => debounce(fetchData, 500), []);

  useEffect(() => {
    if (inputValue) {
      debouncedFetchData(inputValue);
    } else {
      setOptions([]);
    }
  }, [inputValue, debouncedFetchData]);

  return (
    <StyledDialog
      open={isOpen}
      onClose={handleClose}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
    >
      <DialogTitle id="alert-dialog-title">
        <StyledTitle variant="h5">
          Author
          <Fab
            onClick={handleClose}
            size="small"
            color="primary"
            aria-label="close"
          >
            <CloseIcon />
          </Fab>
        </StyledTitle>
      </DialogTitle>
      <StyledDialogContent>
        <StyledAuthor>
          <Avatar
            alt={author.name}
            src={author.img}
            sx={{ width: 43, height: 43 }}
          />
          <Typography variant="body2" component="div">
            <b>{author.name}</b>
          </Typography>
        </StyledAuthor>

        <Autocomplete
          freeSolo
          disablePortal
          loading={isLoading}
          options={options}
          onChange={handleChangeAuthor}
          getOptionLabel={(option) =>
            typeof option === "string" ? option : option.name
          }
          renderOption={(props, option) =>
            typeof option === "string" ? (
              option
            ) : (
              <ListItem {...props}>
                <ListItemAvatar>
                  <Avatar src={option.img} alt={option.name} />
                </ListItemAvatar>
                <ListItemText primary={option.name} />
              </ListItem>
            )
          }
          renderInput={(params) => (
            <TextField
              {...params}
              variant="outlined"
              placeholder="Choose another author"
              onChange={(event) => setInputValue(event.target.value)}
            />
          )}
        />
      </StyledDialogContent>
    </StyledDialog>
  );
};
