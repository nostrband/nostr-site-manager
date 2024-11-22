import type { Meta, StoryObj } from "@storybook/react";
import { Header } from "./index";
import { Box, Container } from "@mui/material";

const meta: Meta<typeof Header> = {
  title: "Components/Header",
  component: Header,
  tags: ["autodocs"],
  parameters: {
    layout: "fullscreen",
  },
};

export default meta;

type Story = StoryObj<typeof Header>;

export const Primary: Story = {
  render: () => (
    <>
      <Header>LOGO</Header>
      <Box sx={{ padding: "10px" }}>
        <Container maxWidth="lg">
          {Array.from({ length: 100 }).map((_, i) => (
            <p key={i}>
              Lorem ipsum dolor sit amet, consectetur adipisicing elit. Eveniet
              libero quas alias, ab eum maiores, delectus omnis aut perferendis
              id corporis ullam ad nisi quia magnam, unde accusamus mollitia
              voluptatum.
            </p>
          ))}
        </Container>
      </Box>
    </>
  ),
};
