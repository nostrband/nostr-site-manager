import type { Meta, StoryObj } from "@storybook/react";
import { InputField } from "./index";
import { CircularProgress, Container, InputAdornment } from "@mui/material";
import { IconPerson, SearchIcon } from "../Icons";

const meta: Meta<typeof InputField> = {
  title: "Components/InputField",
  component: InputField,
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
  },
};

export default meta;

type Story = StoryObj<typeof InputField>;

const iconsEndAdornment = {
  IconPerson: (
    <InputAdornment position="end">
      <IconPerson />
    </InputAdornment>
  ),
  Loading: (
    <InputAdornment position="end">
      <CircularProgress size={20} />
    </InputAdornment>
  ),
  Empty: null,
};

const iconsStartAdornment = {
  SearchIcon: (
    <InputAdornment position="start">
      <SearchIcon />
    </InputAdornment>
  ),
  Loading: (
    <InputAdornment position="start">
      <CircularProgress size={20} />
    </InputAdornment>
  ),
  Empty: null,
};

const iconsStart = {
  SearchIcon: <SearchIcon />,
  Empty: null,
};

export const Primary: Story = {
  args: {
    label: "Search sites",
    size: "medium",
    value: "",
  },

  argTypes: {
    size: {
      control: "select",
      options: ["medium", "small"],
    },
    endAdornment: {
      options: Object.keys(iconsEndAdornment),
      mapping: iconsEndAdornment,
      control: {
        type: "select",
        labels: {
          IconPerson: "Icon Person",
          Loading: "Loading",
          Empty: "Empty",
        },
      },
    },
    startAdornment: {
      options: Object.keys(iconsStartAdornment),
      mapping: iconsStartAdornment,
      control: {
        type: "select",
        labels: {
          IconPerson: "Search Icon",
          Loading: "Loading",
          Empty: "Empty",
        },
      },
    },
    startIcon: {
      options: Object.keys(iconsStart),
      mapping: iconsStart,
      control: {
        type: "select",
        labels: {
          IconPerson: "Search Icon",
          Empty: "Empty",
        },
      },
    },
  },
  render: (args) => <InputField fullWidth {...args} />,
};
