import useScrollTrigger from "@mui/material/useScrollTrigger";
import Box from "@mui/material/Box";
import Fade from "@mui/material/Fade";
import { Fab } from "@mui/material";
import { ArrowUpIcon } from "../Icons";

interface Props {
  window?: () => Window;
  position?: [bottom: number, right: number];
}

export const ScrollTop = (props: Props) => {
  const { window, position } = props;
  const trigger = useScrollTrigger({
    target: window ? window() : undefined,
    disableHysteresis: true,
    threshold: 100,
  });

  const handleClick = (event: React.MouseEvent<HTMLDivElement>) => {
    const anchor = (
      (event.target as HTMLDivElement).ownerDocument || document
    ).querySelector("#toolbar-anchor");

    if (anchor) {
      anchor.scrollIntoView({
        block: "start",
      });
    }
  };

  const positionButton = position ? position : [16, 18];

  return (
    <Fade in={trigger}>
      <Box
        onClick={handleClick}
        role="presentation"
        sx={{
          position: "fixed",
          zIndex: 2,
          bottom: positionButton[0],
          right: positionButton[1],
        }}
      >
        <Fab size="medium" color="decorate" aria-label="scroll back to top">
          <ArrowUpIcon />
        </Fab>
      </Box>
    </Fade>
  );
};
