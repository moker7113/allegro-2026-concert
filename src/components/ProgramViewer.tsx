"use client";

import { useState } from "react";
import type { ProgramItem, Session } from "@/lib/program";

const PLANET_COLORS: Record<string, string> = {
  水星: "bg-stone-400/20 text-stone-200 ring-stone-300/40",
  金星: "bg-amber-400/20 text-amber-200 ring-amber-300/40",
  地球: "bg-sky-400/20 text-sky-200 ring-sky-300/40",
  火星: "bg-red-500/20 text-red-200 ring-red-400/40",
  木星: "bg-orange-400/20 text-orange-200 ring-orange-300/40",
  土星: "bg-yellow-300/20 text-yellow-100 ring-yellow-200/40",
  天王星: "bg-cyan-400/20 text-cyan-200 ring-cyan-300/40",
  海王星: "bg-indigo-400/25 text-indigo-200 ring-indigo-300/40",
  冥王星: "bg-violet-400/20 text-violet-200 ring-violet-300/40",
};

function PlanetBadge({ planet }: { planet: string | null }) {
  if (!planet) return null;
  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ring-1 ring-inset ${
        PLANET_COLORS[planet] ?? "bg-white/10 text-white ring-white/20"
      }`}
    >
      {planet}
    </span>
  );
}

function StatusBadge({ status }: { status: ProgramItem["status"] }) {
  if (status === "confirmed") {
    return (
      <span className="inline-flex items-center rounded-full bg-emerald-400/15 px-2 py-0.5 text-xs font-medium text-emerald-200 ring-1 ring-inset ring-emerald-300/40">
        確定
      </span>
    );
  }
  if (status === "pending") {
    return (
      <span className="inline-flex items-center rounded-full bg-amber-400/15 px-2 py-0.5 text-xs font-medium text-amber-200 ring-1 ring-inset ring-amber-300/40">
        待確認
      </span>
    );
  }
  return null;
}

function Lines({ values, fallback = "—" }: { values: string[]; fallback?: string }) {
  if (values.length === 0) return <span className="text-slate-500">{fallback}</span>;
  return (
    <>
      {values.map((v, i) => (
        <span key={i} className="block">
          {v}
        </span>
      ))}
    </>
  );
}

function Text({ value }: { value: string }) {
  return value ? <>{value}</> : <span className="text-slate-500">—</span>;
}

function ItemCard({ item }: { item: ProgramItem }) {
  return (
    <li className="rounded-2xl border border-white/10 bg-white/[0.04] p-4">
      <div className="flex flex-wrap items-center gap-2">
        {item.code && <span className="font-mono text-sm text-slate-400">{item.code}</span>}
        <PlanetBadge planet={item.planet} />
        <StatusBadge status={item.status} />
      </div>
      <p className="mt-2 text-lg font-semibold leading-snug text-white">
        {item.piece || <span className="text-slate-500">曲目待定</span>}
      </p>
      <p className="mt-1 text-base text-slate-200">
        {item.performers.length ? item.performers.join("、") : "—"}
        {item.grades.length > 0 && (
          <span className="ml-2 text-sm text-slate-400">{item.grades.join("、")}</span>
        )}
      </p>
      <p className="mt-2 flex flex-wrap gap-x-3 gap-y-1 text-sm text-slate-400">
        {item.instruments.length > 0 && <span>{item.instruments.join("、")}</span>}
        {item.form && <span>{item.form}</span>}
        {item.teachers.length > 0 && <span>指導老師：{item.teachers.join("、")}</span>}
      </p>
    </li>
  );
}

function ItemTable({ items }: { items: ProgramItem[] }) {
  return (
    <div className="overflow-hidden rounded-2xl border border-white/10">
      <table className="w-full text-left text-sm">
        <thead className="bg-white/[0.06] text-xs tracking-wider text-slate-300">
          <tr>
            <th className="px-4 py-3 font-medium">編號</th>
            <th className="px-4 py-3 font-medium">行星</th>
            <th className="px-4 py-3 font-medium">演出者</th>
            <th className="px-4 py-3 font-medium">年級</th>
            <th className="px-4 py-3 font-medium">樂器</th>
            <th className="px-4 py-3 font-medium">形式</th>
            <th className="px-4 py-3 font-medium">曲目</th>
            <th className="px-4 py-3 font-medium">指導老師</th>
            <th className="px-4 py-3 font-medium">狀態</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-white/10">
          {items.map((item, i) => (
            <tr key={i} className="align-top transition-colors hover:bg-white/[0.04]">
              <td className="whitespace-nowrap px-4 py-3 font-mono text-slate-400">
                {item.code ?? "—"}
              </td>
              <td className="whitespace-nowrap px-4 py-3">
                <PlanetBadge planet={item.planet} />
              </td>
              <td className="whitespace-nowrap px-4 py-3 font-medium text-white">
                <Lines values={item.performers} />
              </td>
              <td className="whitespace-nowrap px-4 py-3 text-slate-300">
                <Lines values={item.grades} />
              </td>
              <td className="whitespace-nowrap px-4 py-3 text-slate-300">
                <Lines values={item.instruments} />
              </td>
              <td className="whitespace-nowrap px-4 py-3 text-slate-300">
                <Text value={item.form} />
              </td>
              <td className="px-4 py-3 text-slate-100">
                <Text value={item.piece} />
              </td>
              <td className="whitespace-nowrap px-4 py-3 text-slate-300">
                <Lines values={item.teachers} />
              </td>
              <td className="whitespace-nowrap px-4 py-3">
                <StatusBadge status={item.status} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default function ProgramViewer({ sessions }: { sessions: Session[] }) {
  const [key, setKey] = useState(sessions[0]?.key);
  const session = sessions.find((s) => s.key === key) ?? sessions[0];

  return (
    <section>
      <div className="flex flex-wrap items-end justify-between gap-3">
        <label className="flex flex-col gap-1.5">
          <span className="text-sm text-slate-400">選擇場次</span>
          <div className="relative">
            <select
              value={key}
              onChange={(e) => setKey(e.target.value as Session["key"])}
              className="appearance-none rounded-xl border border-white/15 bg-slate-900 py-2.5 pl-4 pr-10 text-base font-medium text-white outline-none focus-visible:ring-2 focus-visible:ring-amber-300"
            >
              {sessions.map((s) => (
                <option key={s.key} value={s.key}>
                  {s.label}
                </option>
              ))}
            </select>
            <span
              aria-hidden
              className="pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400"
            >
              ▾
            </span>
          </div>
        </label>
        {session && !session.failed && (
          <p className="text-sm text-slate-400">共 {session.items.length} 個節目</p>
        )}
      </div>

      <div className="mt-5">
        {!session || session.failed || session.items.length === 0 ? (
          <p className="rounded-2xl border border-white/10 bg-white/[0.04] px-6 py-12 text-center text-slate-300">
            節目表準備中，請稍後再來看看 ✨
          </p>
        ) : (
          <>
            <ol className="space-y-3 md:hidden">
              {session.items.map((item, i) => (
                <ItemCard key={i} item={item} />
              ))}
            </ol>
            <div className="hidden md:block">
              <ItemTable items={session.items} />
            </div>
          </>
        )}
      </div>
    </section>
  );
}
