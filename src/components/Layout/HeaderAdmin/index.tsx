import { FC } from "react";
import { StyledLogo } from "./styled";
import { Logo } from "@/components/Logo";
import { Header } from "@/components/Header";
import { ActionsUser } from "./components/ActionsUser";
import Link from "next/link";

interface IHeaderAdmin {
  isHideActionsUser?: boolean;
  linkToHome?: string;
}

export const HeaderAdmin: FC<IHeaderAdmin> = ({
  isHideActionsUser,
  linkToHome = "/",
}) => {
  return (
    <Header>
      <StyledLogo>
        <Link href={linkToHome}>
          <Logo />
        </Link>
      </StyledLogo>

      {!isHideActionsUser && <ActionsUser />}
    </Header>
  );
};
