"use client";
import React from "react";
import { Grid } from "@mui/material";
import { StyledImageAuth, StyledWrapper, StyledAuth } from "./styled";
import Image from "next/image";
import img from "../../../../public/images/auth/login.jpg";

export const AuthLayout = ({ children }: { children: React.ReactNode }) => (
  <StyledWrapper>
    <Grid container columns={12}>
      <Grid item xs={7}>
        <StyledAuth>{children}</StyledAuth>
      </Grid>
      <Grid item xs={5}>
        <StyledImageAuth>
          <Image src={img} alt="Ресторан" priority />
        </StyledImageAuth>
      </Grid>
    </Grid>
  </StyledWrapper>
);
