import { FullScreen } from "FullScreen";
import { usePanorama } from "hooks";
import { Progress } from "Progress";
import { createRef, ReactNode, useEffect, useState } from "react";
import { BiMap } from "react-icons/bi";
import { BsFullscreen } from "react-icons/bs";
import { RiParkingLine } from "react-icons/ri";
import "tailwindcss/tailwind.css";
import "./index.css";
type RowItemProps = {
  icon: ReactNode;
  title: string;
  description: string;
};
const RowItem = ({ icon, title, description }: RowItemProps) => {
  return (
    <div className="flex items-center text-gray-500 gap-4">
      {icon}
      <div>
        <p className="font-bold">{title}</p>
        <p>{description}</p>
      </div>
    </div>
  );
};
export const App = () => {
  const [fullScreen, setFullScreen] = useState(false);

  const ref = createRef<HTMLDivElement>();
  const refContainer = createRef<HTMLDivElement>();
  const { init, animate, loadingManager } = usePanorama(
    ref,
    "panorama.jpeg",
    refContainer
  );
  useEffect(() => {
    init();
    animate();
  }, []);
  const handleFullScreen = () => setFullScreen(!fullScreen);

  return (
    <main className="w-full h-full  flex flex-col justify-center px-20 bg-slate-200">
      <p className="text-black text-xs">view of 360°</p>
      <div className="bg-white rounded-2xl shadow-md">
        {fullScreen && <FullScreen onClose={handleFullScreen} />}
        <div className="flex  rounded-2xl">
          <div
            className="min-w-[50%] h-auto  main-secondary"
            ref={refContainer}
          >
            <div className="relative flex items-center justify-center">
              <div ref={ref} />
              <div className="absolute">
                {!loadingManager.loaded && <Progress />}
              </div>

              <div className="absolute w-full bg-black/50 h-8 bottom-0  rounded-bl-2xl flex items-center">
                <BsFullscreen
                  className=" text-white ml-auto  mr-2 cursor-pointer"
                  strokeWidth={2}
                  size={18}
                  onClick={handleFullScreen}
                />
              </div>
            </div>
          </div>

          <div className="px-8 flex flex-col w-full select-none">
            <h1 className="text-bold text-4xl pb-8 mt-3">Entire rental unit</h1>
            <p className="text-2xl text-gray-500 ">
              We are a modern Victorian Bed and Brunch nestled in the foothills
              of the Sierra Nevada Mountains. We are walking distance from the
              charming storefronts and eclectic dining in Downtown Sonora.
              Located approximately 40 miles from the entrance of Yosemite, the
              Royal Olive Manor is the perfect place to call "home base" if
              adventuring through the mountains.
            </p>
            <div className="mt-4 flex flex-col gap-4">
              <RowItem
                title="Great location"
                description="100% of recent guests gave the location a 5-star rating."
                icon={<BiMap size={18} />}
              />
              <RowItem
                title="Park for free"
                description="This is one of the few places in the area with free parking."
                icon={<RiParkingLine size={18} />}
              />
            </div>
            <p className="text-2xl mt-8">$ 302 night</p>
            <button className="bg-pink-700 text-white h-min p-3 min-w-[300px] rounded-lg self-center mt-auto mb-8">
              Reserve
            </button>
          </div>
        </div>
      </div>
    </main>
  );
};
