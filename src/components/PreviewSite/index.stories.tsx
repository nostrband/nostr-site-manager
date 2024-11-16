import type { Meta, StoryObj } from "@storybook/react";
import PreviewLogo from "../../../public/images/storybook/site-card-preview/preview-logo.png";
import PreviewIcon from "../../../public/images/storybook/site-card-preview/icon.png";
import PreviewSiteImg from "../../../public/images/storybook/site-card-preview/preview-site.png";

import { PreviewSite } from "./index";

const meta: Meta<typeof PreviewSite> = {
  title: "Main/PreviewSite",
  component: PreviewSite,
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
  },
};

export default meta;

type Story = StoryObj<typeof PreviewSite>;

export const Primary: Story = {
  args: {
    id: "e32e23e2",
    path: "test",
    icon: PreviewIcon.src,
    logo: PreviewLogo.src,
    name: "Author Name",
    title: "Galaxe top projects",
    url: "https://www.crypto-example.npub.pro",
    image: PreviewSiteImg.src,
    contributors: [
      "f0ff87e7796ba86fc84b4807b25a5dee206d724c6f61aa8853975a39deeeff58",
      "a7b508e840ecfdc4b7809e31903546c39525e14be9265764a25438b856f08520",
      "8e75f5da42c0cb7bdb2d51241e6ac94357fb50eb422be7f7f7f8cde4d6ea102f",
      "266ee74062e8dae0aeddfcd0f72725107598efaa80c1a7176d6ee6dd302bce4c",
      "ae668387f74ff3dabf1c8ffa99bb53758d00d179533d7113d5f8b5d2ee570f6d",
      "fe7f6bc6f7338b76bbf80db402ade65953e20b2f23e66e898204b63cc42539a3",
    ],
    accentColor: "#FF7BFD",
    description:
      "Galaxe top projects on Galaxe platform ✅. Chek out latest new from SocialFi 🔥",
    adminAvatar: "",
    adminName: "Admin Name",
    isLink: true,
    isPublic: false,
    isLinkToOpenSite: true,
  },
  render: (args) => (
    <div style={{ maxWidth: "348px" }}>
      <PreviewSite {...args} />
    </div>
  ),
};
