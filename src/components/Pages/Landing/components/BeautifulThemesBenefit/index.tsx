import {
  StyledGroupImg,
  StyledTitle,
  StyledWrap,
} from "@/components/Pages/Landing/components/BeautifulThemesBenefit/styled";
import Image from "next/image";
import theme1 from "../../../../../../public/images/preview-theme/2.png";
import theme2 from "../../../../../../public/images/preview-theme/5.png";
import theme3 from "../../../../../../public/images/preview-theme/8.png";
import theme4 from "../../../../../../public/images/preview-theme/11.png";

export const BeautifulThemesBenefit = () => {
  return (
    <StyledWrap>
      <StyledTitle>
        <span className="light-text">Beautiful Themes.</span> Choose from
        hundreds of
        <span className="decorate-text">open source Ghost themes</span> that are
        easy to customize to your needs.
      </StyledTitle>

      <StyledGroupImg>
        <Image src={theme1} alt="Theme 1" priority />
        <Image src={theme2} alt="Theme 2" priority />
        <Image src={theme3} alt="Theme 3" priority />
        <Image src={theme4} alt="Theme 4" priority />
      </StyledGroupImg>
    </StyledWrap>
  );
};
