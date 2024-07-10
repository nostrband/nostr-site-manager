const hexToRgb = (hex: string) => {
  hex = hex.replace(/^#/, "");

  if (hex.length === 3) {
    hex = hex
      .split("")
      .map((char) => char + char)
      .join("");
  }

  const bigint = parseInt(hex, 16);
  const r = (bigint >> 16) & 255;
  const g = (bigint >> 8) & 255;
  const b = bigint & 255;

  return { r, g, b };
};
const getBrightness = ({ r, g, b }: { r: number; g: number; b: number }) => {
  return (r * 299 + g * 587 + b * 114) / 1000;
};

export const getContrastingTextColor = (hex: string | null | undefined) => {
  const color = hex ? hex : "#fff";
  const rgb = hexToRgb(color);
  const brightness = getBrightness(rgb);
  return brightness < 128 ? "#fff" : "#000";
};
