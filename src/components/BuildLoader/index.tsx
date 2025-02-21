import { SettingsIcon } from "../Icons";
import {
  GradientBottom,
  GradientTop,
  TextAnimation,
  WrapBuildLoader,
  WrapBuildLoaderAnimation,
} from "./styled";

export const BuildLoader = () => {
  const items = [
    { text: "Processing account information", icon: <SettingsIcon /> },
    { text: "Preparing content", icon: <SettingsIcon /> },
    { text: "Selecting a font and uploading images", icon: <SettingsIcon /> },
    { text: "Selecting or uploading a theme", icon: <SettingsIcon /> },
    { text: "Synchronizing data", icon: <SettingsIcon /> },
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
