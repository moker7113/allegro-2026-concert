import Image from "next/image";
import ProgramViewer from "@/components/ProgramViewer";
import { PlanetStars, SkyStars, TitleStars } from "@/components/Stars";
import { getProgram } from "@/lib/program";

export default async function Home() {
  const sessions = await getProgram();

  return (
    <>
      {/* 裝飾行星（取自海報）：手機在畫面 4/5 高度靠右、電腦在右下角，固定在畫面上、放在最上層、點擊會穿透 */}
      <Image
        src="/planet.webp"
        alt=""
        aria-hidden
        width={541}
        height={415}
        priority
        className="pointer-events-none fixed right-0 top-4/5 z-20 w-40 -translate-y-1/2 sm:top-auto sm:bottom-0 sm:translate-y-0 select-none opacity-35 sm:w-[280px] sm:opacity-55"
      />
      <SkyStars />
      <PlanetStars />
      <TitleStars />
      <main className="relative z-10 mx-auto w-full max-w-6xl px-4 pt-10 pb-[calc(20svh+80px)] sm:px-6 sm:pt-14 sm:pb-60">
        <header className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-white sm:text-4xl">一起找尋自己的行星</h1>
          <p className="mt-3 text-sm tracking-[0.3em] text-amber-200/80">2026樂果音樂會</p>
          <p className="mt-2 text-slate-400">節目表</p>
          {/* mt-5：讓開「節目表」右下方的音符（Stars.tsx TitleStars） */}
          <p className="mt-5 text-sm tracking-wider text-amber-200/90">
            {sessions.map((s, i) => (
              <span key={s.key}>
                {i > 0 && <span aria-hidden className="mx-2 text-amber-200/40">｜</span>}
                {s.label} {s.startTime} 開始
              </span>
            ))}
          </p>
        </header>
        <ProgramViewer sessions={sessions} />
      </main>
    </>
  );
}
