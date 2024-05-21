import HomeTwoToneIcon from "@mui/icons-material/HomeTwoTone";
import WebTwoToneIcon from "@mui/icons-material/WebTwoTone";
import LanguageTwoToneIcon from "@mui/icons-material/LanguageTwoTone";
import TitleTwoToneIcon from "@mui/icons-material/TitleTwoTone";

export const navConfig = [
  {
    title: "Dashboard",
    path: "/",
    icon: <HomeTwoToneIcon />,
  },
  {
    title: "View site",
    path: "/view-site",
    icon: <WebTwoToneIcon />,
  },
  {
    title: "Explore",
    path: "/explore",
    icon: <LanguageTwoToneIcon />,
  },
];

export const settingsConfig = [
  {
    title: "Title & Description",
    path: "#title-description",
    icon: <TitleTwoToneIcon />,
  },
];
