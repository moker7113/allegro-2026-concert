import type { CSSProperties } from "react";

/** 照海報畫的裝飾星星：黃色四角閃光星、黃色五角星、淡藍色小閃光星、黃色音符 */

type Kind = "sparkle" | "star" | "note";

type Deco = {
  kind: Kind;
  color: "yellow" | "blue";
  /** 水平位置（%）與距離頂端的高度（px） */
  left: string;
  top: number;
  size: number;
  /** 閃爍一輪的秒數與延遲，讓每顆星錯開 */
  duration: number;
  delay: number;
  /** 手機上隱藏（避免壓到標題文字） */
  desktopOnly?: boolean;
};

const COLORS = {
  yellow: { fill: "#FFE58A", glow: "rgb(255 214 102 / 0.75)" },
  blue: { fill: "#B5E8FF", glow: "rgb(150 220 255 / 0.7)" },
};

const DECOS: Deco[] = [
  // 左側
  { kind: "sparkle", color: "yellow", left: "6%", top: 14, size: 26, duration: 4.2, delay: 0 },
  { kind: "note", color: "yellow", left: "16%", top: 36, size: 28, duration: 5.6, delay: 1.2, desktopOnly: true },
  { kind: "star", color: "yellow", left: "8%", top: 112, size: 20, duration: 4.8, delay: 0.6 },
  { kind: "sparkle", color: "blue", left: "2%", top: 176, size: 14, duration: 3.6, delay: 2.1, desktopOnly: true },
  { kind: "sparkle", color: "blue", left: "24%", top: 128, size: 12, duration: 4.4, delay: 1.7, desktopOnly: true },
  { kind: "sparkle", color: "yellow", left: "20%", top: 196, size: 14, duration: 5.2, delay: 2.8, desktopOnly: true },
  // 右側
  { kind: "star", color: "yellow", left: "93%", top: 22, size: 24, duration: 5, delay: 0.9 },
  { kind: "sparkle", color: "blue", left: "78%", top: 12, size: 14, duration: 3.8, delay: 2.4, desktopOnly: true },
  { kind: "sparkle", color: "yellow", left: "84%", top: 92, size: 30, duration: 4.6, delay: 0.3, desktopOnly: true },
  { kind: "note", color: "yellow", left: "91%", top: 150, size: 24, duration: 6, delay: 1.5 },
  { kind: "sparkle", color: "yellow", left: "74%", top: 168, size: 14, duration: 4, delay: 3.1, desktopOnly: true },
  { kind: "note", color: "yellow", left: "68%", top: 40, size: 20, duration: 5.4, delay: 2.2, desktopOnly: true },
  { kind: "sparkle", color: "blue", left: "96%", top: 210, size: 12, duration: 3.4, delay: 0.8 },
];

function Shape({ kind, fill }: { kind: Kind; fill: string }) {
  if (kind === "sparkle") {
    return (
      <path
        fill={fill}
        d="M12 0C12.9 7.1 16.9 11.1 24 12C16.9 12.9 12.9 16.9 12 24C11.1 16.9 7.1 12.9 0 12C7.1 11.1 11.1 7.1 12 0Z"
      />
    );
  }
  if (kind === "star") {
    return (
      <polygon
        fill={fill}
        stroke={fill}
        strokeWidth={2}
        strokeLinejoin="round"
        points="12,2.5 14.8,8.7 21.5,9.4 16.5,13.9 17.9,20.6 12,17.2 6.1,20.6 7.5,13.9 2.5,9.4 9.2,8.7"
      />
    );
  }
  // 八分音符
  return (
    <g fill={fill}>
      <ellipse cx="8.6" cy="18" rx="3.9" ry="2.9" transform="rotate(-22 8.6 18)" />
      <path d="M11.4 17.6V2.5h1.8c.3 2.4 1.6 3.8 3.4 5.1 2 1.5 3.3 3.6 2.2 6.6.4-2.4-1.3-4-3.8-4.9v8.3z" />
    </g>
  );
}

export default function Stars() {
  return (
    <div aria-hidden className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-60 select-none">
      {DECOS.map((d, i) => {
        const { fill, glow } = COLORS[d.color];
        const style: CSSProperties = {
          left: d.left,
          top: d.top,
          width: d.size,
          height: d.size,
          filter: `drop-shadow(0 0 ${Math.round(d.size / 4)}px ${glow})`,
          animationDuration: `${d.duration}s`,
          animationDelay: `${d.delay}s`,
        };
        return (
          <svg
            key={i}
            viewBox="0 0 24 24"
            style={style}
            className={`twinkle absolute -translate-x-1/2 ${d.desktopOnly ? "hidden sm:block" : ""}`}
          >
            <Shape kind={d.kind} fill={fill} />
          </svg>
        );
      })}
    </div>
  );
}
