import { Avatar, Button } from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import { useState } from "react";
import MenuItem from "@mui/material/MenuItem";
import ListItemText from "@mui/material/ListItemText";
import Select, { SelectChangeEvent } from "@mui/material/Select";
import Checkbox from "@mui/material/Checkbox";
import {
  StyledIconButton,
  StyledWrapActions,
  StyledWrapper,
} from "@/components/PreviewNavigation/styled";

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250,
    },
  },
};

const themes = ["#cooking", "#photography", "#nostr", "#travel", "#grownostr"];

export const PreviewNavigation = () => {
  // For test login
  const [isLogin, setLogin] = useState(false);

  const handleLogin = () => {
    setLogin((prev) => !prev);
  };

  const [selectTheme, setSelectTheme] = useState<string[]>([]);

  const handleChange = (event: SelectChangeEvent<typeof selectTheme>) => {
    const {
      target: { value },
    } = event;
    setSelectTheme(typeof value === "string" ? value.split(",") : value);
  };

  return (
    <StyledWrapper>
      <StyledIconButton color="primary" size="large">
        <ArrowBackIcon />
      </StyledIconButton>

      <StyledWrapActions>
        <Select
          labelId="demo-multiple-checkbox-label"
          id="demo-multiple-checkbox"
          multiple
          size="small"
          value={selectTheme}
          onChange={handleChange}
          MenuProps={MenuProps}
          sx={{ height: "42px", width: 300 }}
          renderValue={(selected) => {
            if (!selected.length) {
              return "All hashtags";
            }

            return selected.join(", ");
          }}
          displayEmpty
        >
          {themes.map((theme) => (
            <MenuItem key={theme} value={theme}>
              <Checkbox
                color="decorate"
                checked={selectTheme.indexOf(theme) > -1}
              />
              <ListItemText primary={theme} />
            </MenuItem>
          ))}
        </Select>
        <Button size="large" variant="contained" color="decorate">
          Use theme
        </Button>
        {isLogin ? (
          <Avatar
            alt="Remy Sharp"
            onClick={handleLogin}
            src="https://mui.com/static/images/avatar/1.jpg"
            sx={{ width: 43, height: 43 }}
          />
        ) : (
          <Button
            size="large"
            onClick={handleLogin}
            color="darkInfo"
            variant="contained"
          >
            Preview with nostr
          </Button>
        )}
      </StyledWrapActions>
      <StyledIconButton color="primary" size="large">
        <ArrowForwardIcon />
      </StyledIconButton>
    </StyledWrapper>
  );
};
