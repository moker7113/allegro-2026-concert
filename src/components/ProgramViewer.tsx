"use client";

import { useState, type ReactNode } from "react";
import type { ProgramItem, Session } from "@/lib/program";

/** 畫面上的一列節目；搜尋時會帶上場次名稱（午場／晚場） */
type Row = { item: ProgramItem; sessionLabel?: string };

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

function SessionBadge({ label }: { label?: string }) {
  if (!label) return null;
  return (
    <span className="inline-flex items-center rounded-full bg-white/10 px-2.5 py-0.5 text-xs font-medium text-white ring-1 ring-inset ring-white/25">
      {label}
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

/** 把姓名中符合搜尋字的部分加上黃底 */
function Highlight({ text, query }: { text: string; query: string }) {
  const index = query ? text.indexOf(query) : -1;
  if (index < 0) return <>{text}</>;
  return (
    <>
      {text.slice(0, index)}
      <mark className="rounded bg-amber-300 px-0.5 text-slate-900">
        {text.slice(index, index + query.length)}
      </mark>
      {text.slice(index + query.length)}
    </>
  );
}

function Performers({
  names,
  query,
  inline = false,
}: {
  names: string[];
  query: string;
  inline?: boolean;
}) {
  if (names.length === 0) return <span className="text-slate-500">—</span>;
  return (
    <>
      {names.map((name, i) =>
        inline ? (
          <span key={i}>
            {i > 0 && "、"}
            <Highlight text={name} query={query} />
          </span>
        ) : (
          <span key={i} className="block">
            <Highlight text={name} query={query} />
          </span>
        ),
      )}
    </>
  );
}

function Lines({ values }: { values: string[] }) {
  if (values.length === 0) return <span className="text-slate-500">—</span>;
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

function ItemCard({ row, query }: { row: Row; query: string }) {
  const { item } = row;
  return (
    <li className="rounded-2xl border border-white/10 bg-white/[0.04] p-4">
      <div className="flex flex-wrap items-center gap-2">
        <SessionBadge label={row.sessionLabel} />
        {item.code && <span className="font-mono text-sm text-slate-400">{item.code}</span>}
        <PlanetBadge planet={item.planet} />
        <StatusBadge status={item.status} />
      </div>
      <p className="mt-2 text-lg font-semibold leading-snug text-white">
        {item.piece || <span className="text-slate-500">曲目待定</span>}
      </p>
      <p className="mt-1 text-base text-slate-200">
        <Performers names={item.performers} query={query} inline />
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

function ItemTable({ rows, query }: { rows: Row[]; query: string }) {
  const showSession = rows.some((r) => r.sessionLabel);
  return (
    <div className="overflow-hidden rounded-2xl border border-white/10">
      <table className="w-full text-left text-sm">
        <thead className="bg-white/[0.06] text-xs tracking-wider text-slate-300">
          <tr>
            {showSession && <th className="px-4 py-3 font-medium">場次</th>}
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
          {rows.map(({ item, sessionLabel }, i) => (
            <tr key={i} className="align-top transition-colors hover:bg-white/[0.04]">
              {showSession && (
                <td className="whitespace-nowrap px-4 py-3">
                  <SessionBadge label={sessionLabel} />
                </td>
              )}
              <td className="whitespace-nowrap px-4 py-3 font-mono text-slate-400">
                {item.code ?? "—"}
              </td>
              <td className="whitespace-nowrap px-4 py-3">
                <PlanetBadge planet={item.planet} />
              </td>
              <td className="whitespace-nowrap px-4 py-3 font-medium text-white">
                <Performers names={item.performers} query={query} />
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

function EmptyMessage({ children }: { children: ReactNode }) {
  return (
    <p className="rounded-2xl border border-white/10 bg-white/[0.04] px-6 py-12 text-center text-slate-300">
      {children}
    </p>
  );
}

export default function ProgramViewer({ sessions }: { sessions: Session[] }) {
  const [key, setKey] = useState(sessions[0]?.key);
  const [search, setSearch] = useState("");
  const session = sessions.find((s) => s.key === key) ?? sessions[0];
  const query = search.trim();

  // 有搜尋字時同時搜尋午場和晚場，每筆標上場次；沒有時只顯示選的場次
  const rows: Row[] = query
    ? sessions.flatMap((s) =>
        s.items
          .filter((item) => item.performers.some((name) => name.includes(query)))
          .map((item) => ({ item, sessionLabel: s.label })),
      )
    : (session?.items ?? []).map((item) => ({ item }));

  const allFailed = sessions.every((s) => s.failed);
  const notReady = query ? allFailed : !session || session.failed || session.items.length === 0;

  return (
    <section>
      <div className="flex flex-wrap items-end gap-3">
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

        <label className="flex min-w-0 flex-1 flex-col gap-1.5 sm:max-w-xs">
          <span className="text-sm text-slate-400">搜尋演出者</span>
          <div className="relative">
            <input
              type="search"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="輸入小朋友姓名"
              className="w-full appearance-none rounded-xl border border-white/15 bg-slate-900 py-2.5 pl-4 pr-10 text-base text-white outline-none placeholder:text-slate-500 focus-visible:ring-2 focus-visible:ring-amber-300 [&::-webkit-search-cancel-button]:hidden"
            />
            {search && (
              <button
                type="button"
                onClick={() => setSearch("")}
                aria-label="清除搜尋"
                className="absolute right-2 top-1/2 flex size-7 -translate-y-1/2 items-center justify-center rounded-full text-slate-400 hover:bg-white/10 hover:text-white"
              >
                ✕
              </button>
            )}
          </div>
        </label>

        {!notReady && (
          <p className="ml-auto text-sm text-slate-400">
            {query ? `找到 ${rows.length} 個節目` : `共 ${rows.length} 個節目`}
          </p>
        )}
      </div>

      <div className="mt-5">
        {notReady ? (
          <EmptyMessage>節目表準備中，請稍後再來看看 ✨</EmptyMessage>
        ) : rows.length === 0 ? (
          <EmptyMessage>找不到「{query}」，請確認姓名是否正確</EmptyMessage>
        ) : (
          <>
            <ol className="space-y-3 md:hidden">
              {rows.map((row, i) => (
                <ItemCard key={i} row={row} query={query} />
              ))}
            </ol>
            <div className="hidden md:block">
              <ItemTable rows={rows} query={query} />
            </div>
          </>
        )}
      </div>
    </section>
  );
}
