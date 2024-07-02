import {
  StyledGroupIcon,
  StyledTitle,
  StyledWrap,
  StyledWrapIcon,
  StyledWrapIconDefault,
} from "@/components/Pages/Onboarding/components/NativelySocialBenefit/styled";
import { IconMessage } from "@/components/Pages/Onboarding/components/NativelySocialBenefit/IconMesssage";
import { IconChats } from "@/components/Pages/Onboarding/components/NativelySocialBenefit/IconChats";
import { IconPay } from "@/components/Pages/Onboarding/components/NativelySocialBenefit/IconPay";

export const NativelySocialBenefit = () => {
  return (
    <StyledWrap>
      <StyledGroupIcon>
        <StyledWrapIcon>
          <IconChats />
        </StyledWrapIcon>
        <StyledWrapIconDefault>
          <IconMessage />
        </StyledWrapIconDefault>
        <StyledWrapIcon>
          <IconPay />
        </StyledWrapIcon>
      </StyledGroupIcon>

      <StyledTitle>
        <span>Natively Social.</span> Your website is part of a global open
        social network with powerful tools like chats, direct messages, digital
        payments and more...
      </StyledTitle>
    </StyledWrap>
  );
};
