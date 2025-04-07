import {
  BrushIcon,
  ImageIcon,
  SyncIcon,
  TypographyIcon,
  UserRectangleIcon,
} from "../Icons";
import {
  GradientBottom,
  GradientTop,
  TextAnimation,
  WrapBuildLoader,
  WrapBuildLoaderAnimation,
} from "./styled";

export const BuildLoader = () => {
  const items = [
    { text: "Processing profile information", icon: <UserRectangleIcon /> },
    { text: "Importing content", icon: <TypographyIcon /> },
    { text: "Detecting types of content", icon: <ImageIcon /> },
    { text: "Fetching the theme", icon: <BrushIcon /> },
    { text: "Rendering site pages", icon: <SyncIcon /> },
  ];

  return (
    <WrapBuildLoader>
      <GradientTop />
      <GradientBottom />
      <WrapBuildLoaderAnimation>
        {items.map((item, index) => (
          <TextAnimation key={index} variant="body2">
            {item.icon}
            {item.text}
          </TextAnimation>
        ))}

        {items.map((item, index) => (
          <TextAnimation key={`${index}-clone`} variant="body2">
            {item.icon}
            {item.text}
          </TextAnimation>
        ))}
      </WrapBuildLoaderAnimation>
    </WrapBuildLoader>
  );
};
