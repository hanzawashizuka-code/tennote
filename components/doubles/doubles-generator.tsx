"use client";

import { useState } from "react";
import { Shuffle, Plus, Trash2, RefreshCw } from "lucide-react";
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

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function generateRounds(players: string[]): Round[] {
  const n = players.length;
  if (n < 4) return [];

  // 全ペアを生成
  const allPairs: [string, string][] = [];
  for (let i = 0; i < n; i++) {
    for (let j = i + 1; j < n; j++) {
      allPairs.push([players[i], players[j]]);
    }
  }

  const usedPairKeys = new Set<string>();
  const pairKey = (a: string, b: string) =>
    [a, b].sort().join("|");

  const rounds: Round[] = [];
  const gamesPerRound = Math.floor(n / 4);
  const maxRounds = 20;

  for (let r = 0; r < maxRounds; r++) {
    const availablePairs = shuffle(allPairs).filter(
      ([a, b]) => !usedPairKeys.has(pairKey(a, b))
    );

    const usedInRound = new Set<string>();
    const games: Game[] = [];

    for (let i = 0; i < availablePairs.length && games.length < gamesPerRound; i++) {
      const [a1, b1] = availablePairs[i];
      if (usedInRound.has(a1) || usedInRound.has(b1)) continue;

      for (let j = i + 1; j < availablePairs.length; j++) {
        const [a2, b2] = availablePairs[j];
        if (
          usedInRound.has(a2) || usedInRound.has(b2) ||
          a2 === a1 || a2 === b1 || b2 === a1 || b2 === b1
        ) continue;

        games.push({
          team1: [a1, b1],
          team2: [a2, b2],
          court: games.length + 1,
        });
        usedInRound.add(a1);
        usedInRound.add(b1);
        usedInRound.add(a2);
        usedInRound.add(b2);
        break;
      }
    }

    if (games.length === 0) break;

    games.forEach(({ team1, team2 }) => {
      usedPairKeys.add(pairKey(team1[0], team1[1]));
      usedPairKeys.add(pairKey(team2[0], team2[1]));
    });

    const waiting = players.filter((p) => !usedInRound.has(p));
    rounds.push({ round: r + 1, games, waiting });
  }

  return rounds;
}

export function DoublesGenerator() {
  const [playerCount, setPlayerCount] = useState(8);
  const [customNames, setCustomNames] = useState<string[]>([]);
  const [useCustom, setUseCustom] = useState(false);
  const [rounds, setRounds] = useState<Round[]>([]);
  const [generated, setGenerated] = useState(false);
  const [newName, setNewName] = useState("");

  const players = useCustom
    ? customNames.filter((n) => n.trim())
    : Array.from({ length: playerCount }, (_, i) => `${i + 1}番`);

  const handleGenerate = () => {
    if (players.length < 4) return;
    setRounds(generateRounds(players));
    setGenerated(true);
  };

  const addName = () => {
    if (!newName.trim()) return;
    setCustomNames([...customNames, newName.trim()]);
    setNewName("");
  };

  const removeName = (i: number) => {
    setCustomNames(customNames.filter((_, idx) => idx !== i));
  };

  return (
    <div className="flex flex-col gap-5">
      {/* 設定 */}
      <Card className="p-4 flex flex-col gap-4">
        <div className="flex items-center gap-3">
          <button
            onClick={() => { setUseCustom(false); setGenerated(false); }}
            className={`flex-1 py-2 rounded-xl text-sm font-semibold transition-all ${
              !useCustom ? "bg-[#1B4FD8] text-white" : "bg-gray-100 text-gray-500"
            }`}
          >
            番号で設定
          </button>
          <button
            onClick={() => { setUseCustom(true); setGenerated(false); }}
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
              onChange={(e) => { setPlayerCount(Number(e.target.value)); setGenerated(false); }}
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

        <Button
          onClick={handleGenerate}
          disabled={players.length < 4}
          className="w-full flex items-center justify-center gap-2"
        >
          <Shuffle size={16} />
          {generated ? "再生成" : "ペアを生成"}
        </Button>
      </Card>

      {/* 結果 */}
      {generated && rounds.length > 0 && (
        <div className="flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <p className="text-sm font-bold text-gray-700">
              {rounds.length}ラウンド生成（全ペア被りなし）
            </p>
            <button
              onClick={handleGenerate}
              className="flex items-center gap-1 text-xs text-[#1B4FD8] font-semibold"
            >
              <RefreshCw size={12} />シャッフル
            </button>
          </div>

          {rounds.map((r) => (
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

      {generated && rounds.length === 0 && (
        <Card className="text-center py-10 text-gray-400 text-sm">
          4人以上必要です
        </Card>
      )}
    </div>
  );
}
