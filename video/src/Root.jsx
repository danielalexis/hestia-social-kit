import { Composition } from "remotion";
import { BrandReel } from "./BrandReel";

export const RemotionRoot = () => {
  return (
    <Composition
      id="BrandReel"
      component={BrandReel}
      durationInFrames={270}
      fps={30}
      width={1080}
      height={1920}
    />
  );
};
