"use client";
import { styled } from "@mui/material/styles";
import {
    Avatar
} from "@mui/material";

export const StyledAvatarSite = styled(Avatar)(({ theme }) => ({
    borderRadius: theme.shape.borderRadius
}));
