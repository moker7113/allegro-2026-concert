import ProgramViewer from "@/components/ProgramViewer";
import { getProgram } from "@/lib/program";

export default async function Home() {
  const sessions = await getProgram();

  return (
    <main className="mx-auto w-full max-w-6xl px-4 py-10 sm:px-6 sm:py-14">
      <header className="mb-8 text-center">
        <h1 className="text-3xl font-bold text-white sm:text-4xl">一起找尋自己的行星</h1>
        <p className="mt-3 text-sm tracking-[0.3em] text-amber-200/80">2026樂果音樂會</p>
        <p className="mt-2 text-slate-400">節目表</p>
      </header>
      <ProgramViewer sessions={sessions} />
    </main>
  );
}
