import { useState } from "react";
import { LoginDM } from "../LoginDM";
import { LoginEnterCode } from "../LoginEnterCode";

export const Login = () => {
  const [isShowEnterCode, setShowEnterCode] = useState(false);
  const [pubkey, setPubkey] = useState('');

  const showEnterCode = (pubkey: string) => {
    setShowEnterCode(true);
    setPubkey(pubkey)
  };

  const showLoginDM = () => {
    setShowEnterCode(false);
    setPubkey('')
  };

  return isShowEnterCode ? (
    <LoginEnterCode pubkey={pubkey} showLoginDM={showLoginDM} />
  ) : (
    <LoginDM showEnterCode={showEnterCode} />
  );
};
