import type { Meta, StoryObj } from '@storybook/react';
import PreviewSiteImg from "../../../public/images/storybook/PreviewSite.png";

import { PreviewSite } from './index';

const meta = {
  title: 'Main/PreviewSite',
  component: PreviewSite,
  parameters: {
    layout: 'centered',
  },

  tags: ['autodocs'],
} satisfies Meta<typeof PreviewSite>;

export default meta;
type Story = StoryObj<typeof meta>;


export const Primary: Story = {
  args: {
    id: 'e32e23e2',
    path: 'test',
    icon: '',
    logo: '',
    name: 'Test name',
    title: 'Galaxe top projects',
    url: 'https://www.crypto-example.npub.pro',
    image: PreviewSiteImg.src,
    contributors: [],
    accentColor: '#FF7BFD',
    description: 'Galaxe top projects on Galaxe platform ✅. Chek out latest new from SocialFi 🔥',
    adminAvatar: "",
    adminName: "Test Name",
    isLink: true,
    isPublic: false,
    isLinkToOpenSite: true,
  },
};
