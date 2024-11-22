import type { Meta, StoryObj } from "@storybook/react";
import PreviewLogo from "../../../public/images/storybook/site-card-preview/preview-logo.png";
import PreviewIcon from "../../../public/images/storybook/site-card-preview/icon.png";
import PreviewSiteImg from "../../../public/images/storybook/site-card-preview/preview-site.png";

import { ListSites } from "./index";
import { ReturnSettingsSiteDataType } from "@/services/sites.service";
import { Box, Container } from "@mui/material";

const ACCENT_COLOR = [
  "#FF7BFD",
  "#eb4c4c",
  "#a0ff7b",
  "#ffca7b",
  "#194fa1",
  "#6b4f3c",
];

const MOCK_DATA_OBJ: ReturnSettingsSiteDataType = {
  id: "",
  themeId: "",
  themeName: "",
  name: "Author Name",
  title: "Galaxe top projects",
  description:
    "Galaxe top projects on Galaxe platform ✅. Chek out latest new from SocialFi 🔥",
  url: "https://www.crypto-example.npub.pro",
  icon: PreviewIcon.src,
  logo: PreviewLogo.src,
  image: PreviewSiteImg.src,
  timezone: {
    name: "",
    label: "",
  },
  language: "",
  metaDescription: "",
  metaTitle: "",
  ogDescription: "",
  ogTitle: "",
  ogImage: "",
  xTitle: "",
  xImage: "",
  xDescription: "",
  fTitle: "",
  fDescription: "",
  socialAccountFaceBook: "",
  socialAccountX: "",

  contributors: [
    "f0ff87e7796ba86fc84b4807b25a5dee206d724c6f61aa8853975a39deeeff58",
    "a7b508e840ecfdc4b7809e31903546c39525e14be9265764a25438b856f08520",
    "8e75f5da42c0cb7bdb2d51241e6ac94357fb50eb422be7f7f7f8cde4d6ea102f",
    "266ee74062e8dae0aeddfcd0f72725107598efaa80c1a7176d6ee6dd302bce4c",
    "ae668387f74ff3dabf1c8ffa99bb53758d00d179533d7113d5f8b5d2ee570f6d",
    "fe7f6bc6f7338b76bbf80db402ade65953e20b2f23e66e898204b63cc42539a3",
  ],

  navigation: {
    primary: [{ title: "string", link: "string", id: "string" }],
    secondary: [{ title: "string", link: "string", id: "string" }],
  },
  hashtags: [""],
  kinds: [2],
  hashtags_homepage: [""],
  kinds_homepage: [2],
  accentColor: "#FF7BFD",
  codeinjection_head: "",
  codeinjection_foot: "",

  adminPubkey: "",

  postsPerPage: "",
  contentActionMain: "",
  contentActions: [""],
};

const generateMockData = (count: number) => {
  return Array.from({ length: count }, (_, i) => ({
    ...MOCK_DATA_OBJ,
    id: `site-${i}`,
    name: `Author Name ${i + 1}`,
    adminName: `Admin Name ${i + 1}`,
    accentColor: ACCENT_COLOR[i],
  }));
};

const meta: Meta<typeof ListSites> = {
  title: "Components/PreviewSite List",
  component: ListSites,
  tags: ["autodocs"],
  parameters: {
    layout: "fullscreen",
  },
};

export default meta;

type Story = StoryObj<typeof ListSites>;

export const Primary: Story = {
  args: {
    data: generateMockData(6),
    isLinkToOpenSite: false,
    isLink: true,
    isPublic: true,
  },
  render: (args) => (
    <Box sx={{ padding: "10px" }}>
      <Container maxWidth="lg">
        <ListSites {...args} />
      </Container>
    </Box>
  ),
};
