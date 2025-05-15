import { useSearchParams } from "next/navigation";
import { Login } from "./components/Login";
import { SignUp } from "./components/SignUp";

const ConnectionOnboarding = () => {
  const params = useSearchParams();

  const methodAuth = params.get("method");

  const isLoginMethod = methodAuth === "login";

  return isLoginMethod ? <Login /> : <SignUp />;
};

export default ConnectionOnboarding;
