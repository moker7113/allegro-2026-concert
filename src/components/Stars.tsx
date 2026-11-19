import type { CSSProperties } from "react";

/**
 * 照海報畫的裝飾星星：黃色四角閃光星、黃色五角星、淡藍色小閃光星、黃色音符。
 * 全部固定在畫面上（不跟著捲動）：
 * - SkyStars：標題附近，放在節目表後面
 * - TitleStars：夾在「節目表」兩側，放在最上層
 * - PlanetStars：圍著行星，跟行星一起放在最上層
 */

type Kind = "sparkle" | "star" | "note";

type Deco = {
  kind: Kind;
  color: "yellow" | "blue";
  /** 位置（CSS 長度，% 是相對於所在的區塊）；有 position 時改用 position 的 Tailwind class */
  left?: string;
  top?: string;
  position?: string;
  size: number;
  /** 旋轉角度，讓星星不要排得太工整 */
  rotate?: number;
  /** 閃爍一輪的秒數與延遲，讓每顆星錯開 */
  duration: number;
  delay: number;
  /** 手機上隱藏（畫面窄，避免太擠） */
  desktopOnly?: boolean;
};

const COLORS = {
  yellow: { fill: "#FFE58A", glow: "rgb(255 214 102 / 0.75)" },
  blue: { fill: "#B5E8FF", glow: "rgb(150 220 255 / 0.7)" },
};

// 標題附近：左右不對稱、大小與高度不規則
const SKY: Deco[] = [
  { kind: "sparkle", color: "yellow", left: "7%", top: "22px", size: 27, rotate: 12, duration: 4.3, delay: 0 },
  { kind: "sparkle", color: "blue", left: "13%", top: "78px", size: 9, duration: 3.1, delay: 1.9 },
  { kind: "note", color: "yellow", left: "19%", top: "47px", size: 25, rotate: -14, duration: 5.7, delay: 1.1, desktopOnly: true },
  { kind: "sparkle", color: "yellow", left: "27%", top: "143px", size: 11, rotate: 30, duration: 5.3, delay: 2.7, desktopOnly: true },
  { kind: "sparkle", color: "blue", left: "33%", top: "19px", size: 13, duration: 3.9, delay: 0.7, desktopOnly: true },
  { kind: "sparkle", color: "yellow", left: "16%", top: "214px", size: 15, rotate: -8, duration: 4.1, delay: 3.3, desktopOnly: true },
  { kind: "sparkle", color: "yellow", left: "61%", top: "8px", size: 10, duration: 3.5, delay: 2.2, desktopOnly: true },
  { kind: "note", color: "yellow", left: "71%", top: "57px", size: 19, rotate: 16, duration: 6.1, delay: 0.4, desktopOnly: true },
  { kind: "sparkle", color: "blue", left: "79%", top: "26px", size: 15, rotate: 20, duration: 4.6, delay: 1.4, desktopOnly: true },
  { kind: "star", color: "yellow", left: "89%", top: "14px", size: 23, rotate: 9, duration: 5.1, delay: 2.5 },
  { kind: "sparkle", color: "yellow", left: "86%", top: "104px", size: 31, rotate: -6, duration: 4.7, delay: 0.2, desktopOnly: true },
  { kind: "sparkle", color: "blue", left: "95%", top: "72px", size: 8, duration: 3.3, delay: 1.6 },
  { kind: "sparkle", color: "yellow", left: "76%", top: "187px", size: 12, rotate: 40, duration: 4.4, delay: 2.9, desktopOnly: true },
  { kind: "star", color: "yellow", left: "67%", top: "232px", size: 13, rotate: 24, duration: 5.5, delay: 1.2, desktopOnly: true },
];

// 夾在「節目表」三個字左右兩側（位置對齊 page.tsx 標題區：手機文字中心約 128px、電腦約 148px）
const FLANK: Deco[] = [
  { kind: "star", color: "yellow", position: "left-[calc(50%-44px)] top-[128px] sm:top-[148px]", size: 17, rotate: -18, duration: 4.9, delay: 0.5 },
  { kind: "note", color: "yellow", position: "left-[calc(50%+44px)] top-[128px] sm:top-[148px]", size: 22, rotate: -10, duration: 5.9, delay: 3.6 },
];

// 行星周圍（% 相對於行星圖片的範圍，可超出去）
const AROUND_PLANET: Deco[] = [
  { kind: "sparkle", color: "yellow", left: "6%", top: "-6%", size: 24, rotate: 8, duration: 4.5, delay: 0.6 },
  { kind: "sparkle", color: "blue", left: "-12%", top: "28%", size: 11, duration: 3.4, delay: 2.0 },
  { kind: "star", color: "yellow", left: "-6%", top: "86%", size: 15, rotate: -16, duration: 5.2, delay: 1.3 },
  { kind: "sparkle", color: "blue", left: "38%", top: "-18%", size: 10, duration: 3.8, delay: 2.8, desktopOnly: true },
  { kind: "note", color: "yellow", left: "-22%", top: "4%", size: 22, rotate: -12, duration: 6, delay: 0.1, desktopOnly: true },
  { kind: "sparkle", color: "yellow", left: "-28%", top: "60%", size: 14, rotate: 25, duration: 4.2, delay: 3.4, desktopOnly: true },
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

function Decos({ items }: { items: Deco[] }) {
  return (
    <>
      {items.map((d, i) => {
        const { fill, glow } = COLORS[d.color];
        const style: CSSProperties = {
          left: d.position ? undefined : d.left,
          top: d.position ? undefined : d.top,
          width: d.size,
          height: d.size,
          rotate: d.rotate ? `${d.rotate}deg` : undefined,
          filter: `drop-shadow(0 0 ${Math.round(d.size / 4)}px ${glow})`,
          animationDuration: `${d.duration}s`,
          animationDelay: `${d.delay}s`,
        };
        return (
          <svg
            key={i}
            viewBox="0 0 24 24"
            style={style}
            className={`twinkle absolute -translate-x-1/2 -translate-y-1/2 ${d.position ?? ""} ${d.desktopOnly ? "hidden sm:block" : ""}`}
          >
            <Shape kind={d.kind} fill={fill} />
          </svg>
        );
      })}
    </>
  );
}

/** 標題附近的星星：固定在畫面上方，放在節目表後面 */
export function SkyStars() {
  return (
    <div aria-hidden className="pointer-events-none fixed inset-x-0 top-0 z-0 h-64 select-none">
      <Decos items={SKY} />
    </div>
  );
}

/** 「節目表」兩側的星星：固定在畫面上（不跟著捲動），放在最上層 */
export function TitleStars() {
  return (
    <div aria-hidden className="pointer-events-none fixed inset-x-0 top-0 z-20 h-64 select-none">
      <Decos items={FLANK} />
    </div>
  );
}

/** 行星周圍的星星：範圍與 page.tsx 的行星一致（手機 4/5 高度靠右、電腦右下角），放在最上層 */
export function PlanetStars() {
  return (
    <div
      aria-hidden
      className="pointer-events-none fixed right-0 top-4/5 z-20 aspect-[541/415] w-40 -translate-y-1/2 select-none opacity-80 sm:top-auto sm:bottom-0 sm:w-[280px] sm:translate-y-0"
    >
      <Decos items={AROUND_PLANET} />
    </div>
  );
}
