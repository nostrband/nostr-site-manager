import { StyledHighlightWrap } from "./styled";

export const highlightMatch = (text: string, query: string) => {
  if (!query) return text;

  const regex = new RegExp(`(${query})`, "gi");

  return text
    .split(regex)
    .map((part, index) =>
      part.toLowerCase() === query.toLowerCase() ? (
        <StyledHighlightWrap key={index}>{part}</StyledHighlightWrap>
      ) : (
        part
      ),
    );
};
