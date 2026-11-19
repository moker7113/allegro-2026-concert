import Papa from "papaparse";
import { cacheLife } from "next/cache";

/** 試算表 A 欄的狀態標記：* 確定演出、? 待確認 */
export type ProgramStatus = "confirmed" | "pending" | null;

export type ProgramItem = {
  /** A 欄的編號，例如 "01"、"開場1"；沒有編號時為 null */
  code: string | null;
  /** 行星主題，例如 "土星" */
  planet: string | null;
  status: ProgramStatus;
  /** 一格裡用換行分隔的多個值（多位演出者、年級、老師…）拆成陣列 */
  performers: string[];
  grades: string[];
  instruments: string[];
  form: string;
  piece: string;
  teachers: string[];
};

export type Session = {
  key: "afternoon" | "evening";
  label: string;
  items: ProgramItem[];
  /** 抓取失敗時為 true（顯示「節目表準備中」） */
  failed: boolean;
};

const PLANETS = ["水星", "金星", "地球", "火星", "木星", "土星", "天王星", "海王星", "冥王星"];

const SESSIONS = [
  { key: "afternoon", label: "午場", gidEnv: "SHEET_GID_AFTERNOON" },
  { key: "evening", label: "晚場", gidEnv: "SHEET_GID_EVENING" },
] as const;

function splitLines(value: string | undefined): string[] {
  return (value ?? "")
    .split(/\r?\n/)
    .map((s) => s.trim())
    .filter(Boolean);
}

/** 解析 A 欄，例如 "01土星*"、"*開場1"、"天王星"、"?" */
function parseCode(raw: string): Pick<ProgramItem, "code" | "planet" | "status"> {
  const text = raw.trim();
  const status: ProgramStatus = text.includes("?") || text.includes("？")
    ? "pending"
    : text.includes("*")
      ? "confirmed"
      : null;
  let rest = text.replace(/[*?？]/g, "").trim();

  const planet = PLANETS.find((p) => rest.includes(p)) ?? null;
  if (planet) rest = rest.replace(planet, "").trim();

  return { code: rest || null, planet, status };
}

function toItem(row: string[]): ProgramItem | null {
  const [a = "", b, c, d, e = "", f = "", g] = row;
  const performers = splitLines(b);
  // 整列空白就略過
  if (!a.trim() && performers.length === 0 && !f.trim()) return null;
  return {
    ...parseCode(a),
    performers,
    grades: splitLines(c),
    instruments: splitLines(d),
    form: e.trim(),
    piece: f.trim(),
    teachers: splitLines(g),
  };
}

/** 若第一列是欄位名稱（之後在試算表加了標題列）就略過 */
function isHeaderRow(row: string[]): boolean {
  return ["演出者", "姓名", "曲目"].some((h) => row.some((cell) => cell.trim() === h));
}

async function fetchSheet(sheetId: string, gid: string): Promise<ProgramItem[]> {
  const url = `https://docs.google.com/spreadsheets/d/${sheetId}/export?format=csv&gid=${gid}`;
  const res = await fetch(url);
  const type = res.headers.get("content-type") ?? "";
  // 試算表沒開放時 Google 會回登入頁（HTML），不是 CSV
  if (!res.ok || !type.includes("text/csv")) {
    throw new Error(`Google Sheet 讀取失敗：${res.status} ${type}`);
  }
  const { data } = Papa.parse<string[]>(await res.text(), { skipEmptyLines: true });
  return data
    .filter((row, i) => !(i === 0 && isHeaderRow(row)))
    .map(toItem)
    .filter((item): item is ProgramItem => item !== null);
}

/** 讀取午場、晚場節目表，每 60 秒在背景重新抓一次 */
export async function getProgram(): Promise<Session[]> {
  "use cache";
  cacheLife({ stale: 60, revalidate: 60, expire: 60 * 60 * 24 });

  const sheetId = process.env.SHEET_ID;
  return Promise.all(
    SESSIONS.map(async ({ key, label, gidEnv }) => {
      const gid = process.env[gidEnv];
      if (!sheetId || !gid) {
        console.error(`缺少環境變數 SHEET_ID 或 ${gidEnv}`);
        return { key, label, items: [], failed: true };
      }
      try {
        return { key, label, items: await fetchSheet(sheetId, gid), failed: false };
      } catch (err) {
        console.error(`${label}節目表讀取失敗`, err);
        return { key, label, items: [], failed: true };
      }
    }),
  );
}
