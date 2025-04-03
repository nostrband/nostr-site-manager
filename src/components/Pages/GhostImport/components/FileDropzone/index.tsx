import React, { FC } from "react";
import { Typography } from "@mui/material";
import { Accept, useDropzone } from "react-dropzone";
import { StyledDropzoneContainer, StyledText } from "./styled";

const acceptedFiles: Accept = {
  "application/json": [".json"],
};

type FileDropzoneProps = {
  onDrop: (acceptedFiles: File[]) => void;
};

export const FileDropzone: FC<FileDropzoneProps> = ({ onDrop }) => {
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: acceptedFiles,
  });
  return (
    <StyledDropzoneContainer {...getRootProps()}>
      <input {...getInputProps()} />
      {isDragActive && <Typography>Drop the files here ...</Typography>}
      {!isDragActive && (
        <Typography>
          Drag & drop exported JSON file here or click to
          <StyledText>select it</StyledText>.
        </Typography>
      )}
    </StyledDropzoneContainer>
  );
};
