import Lightbox from "yet-another-react-lightbox";
import Download from "yet-another-react-lightbox/plugins/download";
import Zoom from "yet-another-react-lightbox/plugins/zoom";
import "yet-another-react-lightbox/styles.css";

interface PhotoViewerProps {
  src: string;
  isOpen: boolean;
  onClose: () => void;
}

export const PhotoViewer = ({ src, isOpen, onClose }: PhotoViewerProps) => {
  return (
    <Lightbox
      plugins={[Download, Zoom]}
      render={{
        buttonPrev: () => null,
        buttonNext: () => null,
      }}
      index={0}
      slides={[{ src }]}
      open={isOpen}
      close={onClose}
      carousel={{ finite: true }} 
    />
  );
};
