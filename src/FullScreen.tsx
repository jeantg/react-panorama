import { usePanorama } from "hooks";
import { Progress } from "Progress";
import { createRef, useEffect } from "react";
import { AiOutlineClose } from "react-icons/ai";
type FullScreenProps = {
  onClose: () => void;
};
export const FullScreen = ({ onClose }: FullScreenProps) => {
  const refContainer = createRef<HTMLDivElement>();
  const { init, animate, loadingManager } = usePanorama(
    refContainer,
    "panorama.jpeg"
  );
  useEffect(() => {
    init();
    animate();
  }, []);
  return (
    <div className="absolute w-screen h-screen top-0 left-0  p-[50px] z-40">
      <div
        className="absolute w-screen h-screen top-0 left-0 bg-black/50 z-[-1]"
        onClick={onClose}
      />
      <div
        className="w-full h-full main flex items-center justify-center"
        ref={refContainer}
      >
        <AiOutlineClose
          className="text-white ml-auto absolute right-5 top-3 z-50 cursor-pointer"
          size={30}
          onClick={onClose}
        />
        {!loadingManager.loaded && (
          <div className="absolute z-30">
            <Progress />{" "}
          </div>
        )}
      </div>
    </div>
  );
};
