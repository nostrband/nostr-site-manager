"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import { SpinnerPublishing } from "@/components/Pages/Publishing/components/SpinnerPublishing";
import {
  StyledDescription,
  StyledTitle,
  StyledWrap,
} from "@/components/Pages/Publishing/styled";
import { Button } from "@mui/material";

export const Publishing = () => {
  const [isPublishing, setPublishing] = useState(true);
  const handleClick = () => {
    alert("Go to site...");
  };

  const title = !isPublishing
    ? "Your website is ready!"
    : "Please wait as we prepare your website ...";
  const description = !isPublishing ? (
    <>
      You can manage your website settings in your{" "}
      <Link href="/admin">dashboard</Link>.
    </>
  ) : (
    `This may take 5-7 minutes to complete. You can close this page if needed and come back later when it’s finished.`
  );

  useEffect(() => {
    setTimeout(() => {
      setPublishing(false);
    }, 2000);
  }, []);
  return (
    <StyledWrap>
      <SpinnerPublishing isDone={isPublishing} />
      <StyledTitle variant="h4">{title}</StyledTitle>
      <StyledDescription variant="body1">{description}</StyledDescription>
      {!isPublishing && (
        <Button
          onClick={handleClick}
          color="decorate"
          sie="large"
          variant="contained"
        >
          Open website
        </Button>
      )}
    </StyledWrap>
  );
};
