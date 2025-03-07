import React, { useState } from "react";
import { TextField } from "@mui/material";
import { WrapOtp } from "./styled";
import useResponsive from "@/hooks/useResponsive";

interface OTPInputProps {
  length: number;
  onChange: (otp: string) => void;
  name: string;
}

const OTPInput: React.FC<OTPInputProps> = ({ length, onChange, name }) => {
  const [otp, setOtp] = useState<string[]>(Array(length).fill(""));
  const [focusedIndex, setFocusedIndex] = useState<number | null>(null);
  const isDesktop = useResponsive("up", "sm");
  const sizeField = isDesktop ? "medium" : "small";

  const handleChange = (value: string, index: number) => {
    if (!/^[0-9]*$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value.slice(-1);
    setOtp(newOtp);
    onChange(newOtp.join(""));

    if (value && index < length - 1) {
      const nextInput = document.getElementById(`otp-input-${index + 1}`);
      nextInput?.focus();
    }
  };

  const handleKeyDown = (
    event: React.KeyboardEvent<HTMLDivElement>,
    index: number,
  ) => {
    if (event.key === "Backspace" && !otp[index] && index > 0) {
      const prevInput = document.getElementById(`otp-input-${index - 1}`);
      prevInput?.focus();
    }
  };

  const handlePaste = (event: React.ClipboardEvent<HTMLInputElement>) => {
    event.preventDefault();
    const pasteData = event.clipboardData.getData("text");

    if (/^[0-9]+$/.test(pasteData)) {
      const newOtp = pasteData.slice(0, length).split("");
      const updatedOtp = [...otp];

      for (let i = 0; i < newOtp.length; i++) {
        updatedOtp[i] = newOtp[i];
      }

      setOtp(updatedOtp);
      onChange(updatedOtp.join(""));
    }
  };

  return (
    <WrapOtp>
      {otp.map((value, index) => (
        <TextField
          key={index}
          id={`otp-input-${index}`}
          value={value}
          name={name}
          placeholder="_"
          size={sizeField}
          onChange={(e) => {
            console.log(e.target.value);
            handleChange(e.target.value, index);
          }}
          onKeyDown={(e) => handleKeyDown(e, index)}
          onPaste={handlePaste}
          onFocus={() => setFocusedIndex(index)}
          onBlur={() => setFocusedIndex(null)}
          inputProps={{
            maxLength: 1,
            placeholder: focusedIndex === index ? "" : "_",
            style: { textAlign: "center" },
          }}
          variant="outlined"
        />
      ))}
    </WrapOtp>
  );
};

export default OTPInput;
