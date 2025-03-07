import { useSearchParams } from "next/navigation";
import { Login } from "./components/Login";
import { SignUp } from "./components/SignUp";

export const ConnectionOnboarding = () => {
  const params = useSearchParams();

  const methodAuth = params.get("method");

  const isLoginMethod = methodAuth === "login";

  return isLoginMethod ? <Login /> : <SignUp />;
};
