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
    { text: "Processing account information", icon: <UserRectangleIcon /> },
    { text: "Preparing content", icon: <TypographyIcon /> },
    { text: "Selecting a font and uploading images", icon: <ImageIcon /> },
    { text: "Selecting or uploading a theme", icon: <BrushIcon /> },
    { text: "Synchronizing data", icon: <SyncIcon /> },
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
