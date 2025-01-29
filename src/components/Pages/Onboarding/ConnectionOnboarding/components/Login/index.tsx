import { useState } from "react";
import { LoginDM } from "../LoginDM";
import { LoginEnterCode } from "../LoginEnterCode";

export const Login = () => {
  const [isShowEnterCode, setShowEnterCode] = useState(false);

  const showEnterCode = () => {
    setShowEnterCode(true);
  };

  const showLoginDM = () => {
    setShowEnterCode(false);
  };

  return isShowEnterCode ? (
    <LoginEnterCode showLoginDM={showLoginDM} />
  ) : (
    <LoginDM showEnterCode={showEnterCode} />
  );
};
