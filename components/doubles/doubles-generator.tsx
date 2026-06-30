"use client";

import { useState } from "react";
import { Shuffle, Plus, Trash2, RefreshCw, Users, LayoutGrid } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface Game {
  team1: [string, string];
  team2: [string, string];
  court: number;
}

interface Round {
  round: number;
  games: Game[];
  waiting: string[];
}

interface PlayerStat {
  name: string;
  played: number;
  waited: number;
}

interface GenerateResult {
  rounds: Round[];
  stats: PlayerStat[];
}

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

const pairKey = (a: string, b: string) => [a, b].sort().join("|");

/**
 * 公平なローテーションを生成する。
 * - 待機回数を均等化し、連続待機を避ける（試合数の均等化）
 * - 同じペア・同じ対戦の繰り返しをスコアリングで最小化（多様性）
 */
function generateRounds(
  players: string[],
  numCourts: number,
  numRounds: number
): GenerateResult {
  const n = players.length;
  const maxCourts = Math.floor(n / 4);
  const courtsPerRound = Math.min(numCourts, maxCourts);

  const stats: PlayerStat[] = players.map((name) => ({ name, played: 0, waited: 0 }));
  if (courtsPerRound < 1) return { rounds: [], stats };

  const playingCount = courtsPerRound * 4;
  const sitOutCount = n - playingCount;

  // 集計（被り回避・公平性のため）
  const partnerCount = new Map<string, number>(); // ペアを組んだ回数
  const oppCount = new Map<string, number>(); // 対戦した回数
  const playCount = new Map(players.map((p) => [p, 0]));
  const waitCount = new Map(players.map((p) => [p, 0]));
  let waitedLast = new Set<string>();

  const inc = (m: Map<string, number>, k: string) => m.set(k, (m.get(k) || 0) + 1);
  const get = (m: Map<string, number>, k: string) => m.get(k) || 0;

  const rounds: Round[] = [];

  for (let r = 0; r < numRounds; r++) {
    // --- 1. 待機者を選ぶ：待機回数が少ない人を優先、連続待機は避ける ---
    const scored = players.map((p) => ({
      p,
      score:
        (waitCount.get(p) || 0) * 100 +
        (waitedLast.has(p) ? 40 : 0) +
        Math.random() * 10,
    }));
    scored.sort((a, b) => a.score - b.score);
    const sitOut = new Set(scored.slice(0, sitOutCount).map((s) => s.p));
    const playing = players.filter((p) => !sitOut.has(p));

    // --- 2. プレイヤーをペア・対戦に割り当て：被りが少ない組合せを探索 ---
    let best: Game[] = [];
    let bestScore = Infinity;
    const tries = 400;
    for (let t = 0; t < tries; t++) {
      const sh = shuffle(playing);
      let sc = 0;
      const games: Game[] = [];
      for (let c = 0; c < courtsPerRound; c++) {
        const a1 = sh[c * 4];
        const b1 = sh[c * 4 + 1];
        const a2 = sh[c * 4 + 2];
        const b2 = sh[c * 4 + 3];
        // ペア被りは重く、対戦被りは軽くペナルティ
        sc += get(partnerCount, pairKey(a1, b1)) * 5;
        sc += get(partnerCount, pairKey(a2, b2)) * 5;
        sc += get(oppCount, pairKey(a1, a2));
        sc += get(oppCount, pairKey(a1, b2));
        sc += get(oppCount, pairKey(b1, a2));
        sc += get(oppCount, pairKey(b1, b2));
        games.push({ team1: [a1, b1], team2: [a2, b2], court: c + 1 });
      }
      if (sc < bestScore) {
        bestScore = sc;
        best = games;
        if (sc === 0) break;
      }
    }

    // --- 3. 集計を更新 ---
    best.forEach((g) => {
      inc(partnerCount, pairKey(g.team1[0], g.team1[1]));
      inc(partnerCount, pairKey(g.team2[0], g.team2[1]));
      [
        [g.team1[0], g.team2[0]],
        [g.team1[0], g.team2[1]],
        [g.team1[1], g.team2[0]],
        [g.team1[1], g.team2[1]],
      ].forEach(([x, y]) => inc(oppCount, pairKey(x, y)));
    });
    playing.forEach((p) => playCount.set(p, (playCount.get(p) || 0) + 1));
    waitedLast = new Set(sitOut);
    sitOut.forEach((p) => waitCount.set(p, (waitCount.get(p) || 0) + 1));

    rounds.push({ round: r + 1, games: best, waiting: [...sitOut] });
  }

  stats.forEach((s) => {
    s.played = playCount.get(s.name) || 0;
    s.waited = waitCount.get(s.name) || 0;
  });

  return { rounds, stats };
}

export function DoublesGenerator() {
  const [playerCount, setPlayerCount] = useState(8);
  const [customNames, setCustomNames] = useState<string[]>([]);
  const [useCustom, setUseCustom] = useState(false);
  const [numCourts, setNumCourts] = useState(1);
  const [numRounds, setNumRounds] = useState(6);
  const [result, setResult] = useState<GenerateResult>({ rounds: [], stats: [] });
  const [generated, setGenerated] = useState(false);
  const [newName, setNewName] = useState("");

  const players = useCustom
    ? customNames.filter((n) => n.trim())
    : Array.from({ length: playerCount }, (_, i) => `${i + 1}番`);

  const maxCourts = Math.max(1, Math.floor(players.length / 4));
  const effectiveCourts = Math.min(numCourts, maxCourts);

  const reset = () => setGenerated(false);

  const handleGenerate = () => {
    if (players.length < 4) return;
    setResult(generateRounds(players, effectiveCourts, numRounds));
    setGenerated(true);
  };

  const addName = () => {
    if (!newName.trim()) return;
    setCustomNames([...customNames, newName.trim()]);
    setNewName("");
    reset();
  };

  const removeName = (i: number) => {
    setCustomNames(customNames.filter((_, idx) => idx !== i));
    reset();
  };

  // 公平性サマリーの幅（最大値）
  const maxPlayed = Math.max(1, ...result.stats.map((s) => s.played));

  return (
    <div className="flex flex-col gap-5">
      {/* 設定 */}
      <Card className="p-4 flex flex-col gap-4">
        <div className="flex items-center gap-3">
          <button
            onClick={() => { setUseCustom(false); reset(); }}
            className={`flex-1 py-2 rounded-xl text-sm font-semibold transition-all ${
              !useCustom ? "bg-[#1B4FD8] text-white" : "bg-gray-100 text-gray-500"
            }`}
          >
            番号で設定
          </button>
          <button
            onClick={() => { setUseCustom(true); reset(); }}
            className={`flex-1 py-2 rounded-xl text-sm font-semibold transition-all ${
              useCustom ? "bg-[#1B4FD8] text-white" : "bg-gray-100 text-gray-500"
            }`}
          >
            名前で設定
          </button>
        </div>

        {!useCustom ? (
          <div className="flex flex-col gap-2">
            <label className="text-sm font-semibold text-gray-700">
              参加人数: <span className="text-[#1B4FD8]">{playerCount}人</span>
            </label>
            <input
              type="range"
              min={4}
              max={16}
              value={playerCount}
              onChange={(e) => { setPlayerCount(Number(e.target.value)); reset(); }}
              className="w-full accent-[#1B4FD8]"
            />
            <div className="flex justify-between text-xs text-gray-400">
              <span>4人</span><span>16人</span>
            </div>
            <div className="flex flex-wrap gap-1.5 mt-1">
              {Array.from({ length: playerCount }, (_, i) => (
                <span key={i} className="text-xs bg-blue-50 text-[#1B4FD8] font-bold px-2.5 py-1 rounded-full">
                  {i + 1}
                </span>
              ))}
            </div>
          </div>
        ) : (
          <div className="flex flex-col gap-2">
            <div className="flex gap-2">
              <input
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && addName()}
                placeholder="名前を入力してEnter"
                className="flex-1 h-9 rounded-xl bg-gray-100 border border-gray-200 px-3 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:border-[#1B4FD8]"
              />
              <button
                onClick={addName}
                className="w-9 h-9 rounded-xl bg-[#1B4FD8] text-white flex items-center justify-center"
              >
                <Plus size={16} />
              </button>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {customNames.map((name, i) => (
                <div key={i} className="flex items-center gap-1 bg-blue-50 text-[#1B4FD8] text-xs font-semibold px-2.5 py-1 rounded-full">
                  {name}
                  <button onClick={() => removeName(i)}>
                    <Trash2 size={10} />
                  </button>
                </div>
              ))}
            </div>
            {customNames.length > 0 && (
              <p className="text-xs text-gray-400">{customNames.length}人登録済み</p>
            )}
          </div>
        )}

        {/* コート数・ラウンド数 */}
        <div className="grid grid-cols-2 gap-3">
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-gray-700 flex items-center gap-1">
              <LayoutGrid size={13} className="text-[#1B4FD8]" />
              コート数
            </label>
            <div className="flex items-center gap-1">
              {Array.from({ length: maxCourts }, (_, i) => i + 1).map((c) => (
                <button
                  key={c}
                  onClick={() => { setNumCourts(c); reset(); }}
                  className={`flex-1 py-1.5 rounded-lg text-sm font-bold transition-all ${
                    effectiveCourts === c
                      ? "bg-[#1B4FD8] text-white"
                      : "bg-gray-100 text-gray-500"
                  }`}
                >
                  {c}
                </button>
              ))}
            </div>
            <span className="text-[10px] text-gray-400">
              同時に {effectiveCourts * 4} 人がプレイ
            </span>
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-gray-700 flex items-center gap-1">
              <RefreshCw size={13} className="text-[#1B4FD8]" />
              ラウンド数: <span className="text-[#1B4FD8]">{numRounds}</span>
            </label>
            <input
              type="range"
              min={1}
              max={20}
              value={numRounds}
              onChange={(e) => { setNumRounds(Number(e.target.value)); reset(); }}
              className="w-full accent-[#1B4FD8]"
            />
            <span className="text-[10px] text-gray-400">1〜20ラウンド</span>
          </div>
        </div>

        <Button
          onClick={handleGenerate}
          disabled={players.length < 4}
          className="w-full flex items-center justify-center gap-2"
        >
          <Shuffle size={16} />
          {generated ? "再生成" : "順番を生成"}
        </Button>
      </Card>

      {/* 公平性サマリー */}
      {generated && result.stats.length > 0 && (
        <Card className="p-4">
          <p className="text-sm font-bold text-gray-700 flex items-center gap-1.5 mb-3">
            <Users size={15} className="text-[#1B4FD8]" />
            公平性チェック（試合数 / 待機）
          </p>
          <div className="flex flex-col gap-1.5">
            {result.stats.map((s) => (
              <div key={s.name} className="flex items-center gap-2">
                <span className="text-xs font-semibold text-gray-700 w-14 flex-shrink-0 truncate">
                  {s.name}
                </span>
                <div className="flex-1 h-4 bg-gray-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-[#C8F400] rounded-full"
                    style={{ width: `${(s.played / maxPlayed) * 100}%` }}
                  />
                </div>
                <span className="text-xs text-gray-500 w-20 flex-shrink-0 text-right tabular-nums">
                  {s.played}試合 / 待{s.waited}
                </span>
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* 結果 */}
      {generated && result.rounds.length > 0 && (
        <div className="flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <p className="text-sm font-bold text-gray-700">
              {result.rounds.length}ラウンド生成
            </p>
            <button
              onClick={handleGenerate}
              className="flex items-center gap-1 text-xs text-[#1B4FD8] font-semibold"
            >
              <RefreshCw size={12} />シャッフル
            </button>
          </div>

          {result.rounds.map((r) => (
            <Card key={r.round} className="p-4">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-bold bg-[#1B4FD8] text-white px-3 py-1 rounded-full">
                  第 {r.round} ラウンド
                </span>
                {r.waiting.length > 0 && (
                  <span className="text-xs text-gray-400">
                    待機: {r.waiting.join("・")}
                  </span>
                )}
              </div>
              <div className="flex flex-col gap-2">
                {r.games.map((game, gi) => (
                  <div
                    key={gi}
                    className="flex items-center gap-2 bg-gray-50 rounded-xl px-3 py-2.5"
                  >
                    <span className="text-xs text-gray-400 w-12 flex-shrink-0">
                      コート{game.court}
                    </span>
                    <div className="flex items-center gap-2 flex-1 justify-center">
                      <div className="flex items-center gap-1">
                        <span className="text-xs font-bold bg-[#C8F400] text-[#0E1100] px-2 py-0.5 rounded-lg">
                          {game.team1[0]}
                        </span>
                        <span className="text-xs text-gray-400">&</span>
                        <span className="text-xs font-bold bg-[#C8F400] text-[#0E1100] px-2 py-0.5 rounded-lg">
                          {game.team1[1]}
                        </span>
                      </div>
                      <span className="text-xs font-black text-gray-400">VS</span>
                      <div className="flex items-center gap-1">
                        <span className="text-xs font-bold bg-blue-100 text-[#1B4FD8] px-2 py-0.5 rounded-lg">
                          {game.team2[0]}
                        </span>
                        <span className="text-xs text-gray-400">&</span>
                        <span className="text-xs font-bold bg-blue-100 text-[#1B4FD8] px-2 py-0.5 rounded-lg">
                          {game.team2[1]}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          ))}
        </div>
      )}

      {generated && result.rounds.length === 0 && (
        <Card className="text-center py-10 text-gray-400 text-sm">
          4人以上必要です
        </Card>
      )}
    </div>
  );
}
