import { useEffect, useState } from "react";
import {
  AbsoluteFill,
  continueRender,
  delayRender,
  interpolate,
  spring,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";

const BLUE_DEEP = "#060E24";

const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" };

export const BrandReel = () => {
  const frame = useCurrentFrame();
  const { fps, width, height } = useVideoConfig();
  const [handle] = useState(() => delayRender("Loading Geist font"));

  useEffect(() => {
    const font = new FontFace(
      "Geist",
      `url(${staticFile("Geist-VariableFont_wght.ttf")})`,
      { weight: "100 900" }
    );
    font
      .load()
      .then((loaded) => {
        document.fonts.add(loaded);
        continueRender(handle);
      })
      .catch(() => continueRender(handle));
  }, [handle]);

  // --- Logo: center intro, then settles into the top-left corner and stays ---
  const logoIn = spring({ frame, fps, config: { damping: 200 } });
  const logoX = interpolate(frame, [0, 45], [width / 2 - 90, 80], clamp);
  const logoY = interpolate(frame, [0, 45], [height / 2 - 30, 100], clamp);
  const logoScale = interpolate(frame, [0, 45], [1.7, 1], clamp);

  // --- Headline: fades/slides in, holds, fades out ---
  const headlineOpacity = interpolate(
    frame,
    [50, 72, 108, 130],
    [0, 1, 1, 0],
    clamp
  );
  const headlineY = interpolate(frame, [50, 75], [30, 0], clamp);

  // --- Stat bars: fades in, bars grow, holds, fades out ---
  const barsOpacity = interpolate(
    frame,
    [140, 162, 213, 235],
    [0, 1, 1, 0],
    clamp
  );
  const bar1Width = interpolate(frame, [150, 182], [0, 18], clamp);
  const bar2Width = interpolate(frame, [160, 195], [0, 92], clamp);

  // --- CTA: fades/springs in, holds to the end ---
  const ctaOpacity = interpolate(frame, [225, 248], [0, 1], clamp);
  const ctaScale = spring({
    frame: Math.max(0, frame - 225),
    fps,
    config: { damping: 200 },
  });

  return (
    <AbsoluteFill style={{ background: BLUE_DEEP, fontFamily: "Geist, sans-serif" }}>
      <AbsoluteFill
        style={{
          backgroundImage:
            "repeating-linear-gradient(0deg, rgba(255,255,255,0.045) 0 1px, transparent 1px 8px), repeating-linear-gradient(90deg, rgba(255,255,255,0.045) 0 1px, transparent 1px 8px)",
        }}
      />
      <div
        style={{
          position: "absolute",
          top: 380,
          left: -160,
          width: 680,
          height: 680,
          borderRadius: 9999,
          background: "rgba(0,61,165,0.5)",
          filter: "blur(120px)",
        }}
      />

      {/* Logo mark */}
      <div
        style={{
          position: "absolute",
          left: logoX,
          top: logoY,
          opacity: logoIn,
          transform: `scale(${logoScale})`,
          transformOrigin: "top left",
        }}
      >
        <img src={staticFile("logo-white.svg")} style={{ height: 60 }} alt="Hestia" />
      </div>

      {/* Headline */}
      <div
        style={{
          position: "absolute",
          left: 80,
          right: 80,
          top: 860,
          opacity: headlineOpacity,
          transform: `translateY(${headlineY}px)`,
        }}
      >
        <div
          style={{
            font: "700 22px Geist, sans-serif",
            letterSpacing: "0.18em",
            textTransform: "uppercase",
            color: "#8AA4E8",
          }}
        >
          TAKE THE NEXT STEP
        </div>
        <div
          style={{
            font: "700 88px Geist, sans-serif",
            letterSpacing: "-0.035em",
            lineHeight: 1.06,
            color: "#FFFFFF",
            marginTop: 24,
          }}
        >
          Real-time shop-floor monitoring.
        </div>
      </div>

      {/* Stat bars */}
      <div
        style={{
          position: "absolute",
          left: 80,
          right: 80,
          top: 840,
          opacity: barsOpacity,
          display: "flex",
          flexDirection: "column",
          gap: 28,
        }}
      >
        <div style={{ font: "700 22px Geist, sans-serif", letterSpacing: "0.18em", textTransform: "uppercase", color: "#8AA4E8" }}>
          TIME TO GO LIVE
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
          <div style={{ width: 700, height: 26, borderRadius: 8, background: "rgba(255,255,255,0.12)", overflow: "hidden" }}>
            <div style={{ width: `${bar1Width}%`, height: "100%", background: "#FFFFFF", borderRadius: 8 }} />
          </div>
          <div style={{ font: "500 26px Geist, sans-serif", color: "#FFFFFF" }}>2–4 weeks</div>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
          <div style={{ width: 700, height: 26, borderRadius: 8, background: "rgba(255,255,255,0.12)", overflow: "hidden" }}>
            <div style={{ width: `${bar2Width}%`, height: "100%", background: "rgba(255,255,255,0.35)", borderRadius: 8 }} />
          </div>
          <div style={{ font: "500 26px Geist, sans-serif", color: "rgba(255,255,255,0.7)" }}>8–16 weeks (legacy ERP)</div>
        </div>
      </div>

      {/* CTA */}
      <div
        style={{
          position: "absolute",
          left: 80,
          bottom: 160,
          opacity: ctaOpacity,
          transform: `scale(${ctaScale})`,
          transformOrigin: "left bottom",
        }}
      >
        <div
          style={{
            display: "inline-block",
            padding: "28px 48px",
            borderRadius: 16,
            background: "#FFFFFF",
            color: BLUE_DEEP,
            font: "600 34px Geist, sans-serif",
          }}
        >
          Book a demo
        </div>
        <div style={{ marginTop: 24, font: "400 26px Geist, monospace", color: "rgba(255,255,255,0.6)" }}>
          hestiatechnology.pt
        </div>
      </div>
    </AbsoluteFill>
  );
};
