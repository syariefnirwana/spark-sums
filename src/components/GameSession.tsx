import { useCallback, useEffect, useRef, useState } from "react";
import { motion } from "motion/react";
import { Check, Home, Loader2, Sparkles, Timer, Trophy, Volume2, VolumeX, X } from "lucide-react";
import { GlassButton } from "./GlassButton";
import { playError, playFinish, playSuccess } from "@/lib/sound";
import { saveSession } from "@/lib/history";
import { cn } from "@/lib/utils";

type Status = "idle" | "correct" | "wrong";

function randomFactor(prev: number | null) {
  let n = Math.floor(Math.random() * 10) + 1;
  if (prev !== null && n === prev) n = (n % 10) + 1;
  return n;
}

function formatTime(total: number) {
  const m = Math.floor(total / 60);
  const s = total % 60;
  return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
}

export function GameSession({
  multiplier,
  minutes,
  onExit,
}: {
  multiplier: number;
  minutes: 10 | 15;
  onExit: () => void;
}) {
  const [factor, setFactor] = useState(() => randomFactor(null));
  const [qid, setQid] = useState(0);
  const [value, setValue] = useState("");
  const [score, setScore] = useState(0);
  const [status, setStatus] = useState<Status>("idle");
  const [muted, setMuted] = useState(false);
  const [secondsLeft, setSecondsLeft] = useState(minutes * 60);
  const [finished, setFinished] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const savedRef = useRef(false);
  const scoreRef = useRef(0);
  const mutedRef = useRef(false);

  mutedRef.current = muted;
  scoreRef.current = score;

  // Fullscreen for a distraction-free session.
  useEffect(() => {
    const el = document.documentElement;
    if (el.requestFullscreen) void el.requestFullscreen().catch(() => {});
    inputRef.current?.focus();
    return () => {
      if (document.fullscreenElement) void document.exitFullscreen().catch(() => {});
    };
  }, []);

  const persist = useCallback(async () => {
    if (savedRef.current) return;
    savedRef.current = true;
    setSaving(true);
    try {
      await saveSession({
        multiplier,
        duration_minutes: minutes,
        total_solved: scoreRef.current,
      });
      setSaveError(false);
    } catch {
      setSaveError(true);
    } finally {
      setSaving(false);
    }
  }, [multiplier, minutes]);

  useEffect(() => {
    const id = window.setInterval(() => {
      setSecondsLeft((s) => {
        if (s <= 1) {
          window.clearInterval(id);
          setFinished(true);
          if (!mutedRef.current) playFinish();
          void persist();
          return 0;
        }
        return s - 1;
      });
    }, 1000);
    return () => window.clearInterval(id);
  }, [persist]);

  const submit = () => {
    if (finished || value.trim() === "") return;
    if (Number(value) === multiplier * factor) {
      if (!muted) playSuccess();
      setStatus("correct");
      setScore((s) => s + 1);
      setValue("");
      window.setTimeout(() => {
        setFactor((prev) => randomFactor(prev));
        setQid((q) => q + 1);
        setStatus("idle");
      }, 320);
    } else {
      if (!muted) playError();
      setStatus("wrong");
      setValue("");
      window.setTimeout(() => setStatus("idle"), 500);
    }
    inputRef.current?.focus();
  };

  const progress = 1 - secondsLeft / (minutes * 60);

  return (
    <div className="fixed inset-0 z-40 flex flex-col overflow-hidden p-4 sm:p-6">
      {/* HUD */}
      <div className="flex items-center justify-between gap-3">
        <div className="glass flex items-center gap-2 rounded-full px-4 py-2 font-extrabold tabular-nums">
          <Timer className="h-4 w-4 text-primary" />
          {formatTime(secondsLeft)}
        </div>
        <div className="glass flex items-center gap-2 rounded-full px-4 py-2 font-extrabold tabular-nums">
          <Sparkles className="h-4 w-4 text-sunny" />
          {score}
        </div>
        <div className="flex items-center gap-2">
          <motion.button
            whileTap={{ scale: 0.9 }}
            onClick={() => setMuted((m) => !m)}
            className="glass rounded-full p-3"
            aria-label={muted ? "Nyalakan suara" : "Matikan suara"}
          >
            {muted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
          </motion.button>
          <motion.button
            whileTap={{ scale: 0.9 }}
            onClick={onExit}
            className="glass rounded-full p-3"
            aria-label="Keluar"
          >
            <X className="h-4 w-4" />
          </motion.button>
        </div>
      </div>

      <div className="glass-soft mt-3 h-2 w-full overflow-hidden rounded-full">
        <motion.div
          className="h-full rounded-full bg-primary"
          animate={{ width: `${progress * 100}%` }}
          transition={{ ease: "linear", duration: 1 }}
        />
      </div>

      {/* Question */}
      <div className="flex flex-1 items-center justify-center">
        <motion.div
          initial={{ scale: 0.9, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          transition={{ type: "spring", stiffness: 260, damping: 20 }}
          className="glass w-full max-w-xl rounded-[2.5rem] p-7 text-center sm:p-12"
        >
          <p className="text-sm font-bold text-muted-foreground">Berapa hasilnya?</p>
          <motion.p
            key={qid}
            initial={{ y: 24, opacity: 0, scale: 0.9 }}
            animate={{ y: 0, opacity: 1, scale: 1 }}
            transition={{ type: "spring", stiffness: 380, damping: 20 }}
            className="my-5 text-5xl font-black tracking-tight sm:text-7xl"
          >
            {multiplier} × {factor}
          </motion.p>


          <motion.div
            animate={
              status === "wrong"
                ? { x: [0, -14, 12, -8, 6, 0] }
                : status === "correct"
                  ? { scale: [1, 1.08, 1] }
                  : { x: 0, scale: 1 }
            }
            transition={{ type: "spring", stiffness: 500, damping: 12 }}
          >
            <input
              ref={inputRef}
              value={value}
              inputMode="numeric"
              pattern="[0-9]*"
              autoFocus
              disabled={finished}
              placeholder="?"
              onChange={(e) => setValue(e.target.value.replace(/[^0-9]/g, "").slice(0, 4))}
              onKeyDown={(e) => {
                if (e.key === "Enter") submit();
              }}
              className={cn(
                "w-full rounded-[1.75rem] border-2 bg-white/60 py-5 text-center text-4xl font-black tabular-nums outline-none transition-colors sm:text-5xl",
                status === "correct" && "border-success bg-success/20",
                status === "wrong" && "border-danger bg-danger/15",
                status === "idle" && "border-white/70 focus:border-primary",
              )}
            />
          </motion.div>

          <GlassButton size="lg" className="mt-5 w-full" onClick={submit} disabled={finished}>
            <Check className="h-5 w-5" />
            Jawab
          </GlassButton>
          <p className="mt-4 text-xs text-muted-foreground">
            Salah? Coba lagi sampai benar ya!
          </p>
        </motion.div>
      </div>

      {/* Summary */}
      {finished && (
          <motion.div
          initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="absolute inset-0 z-50 flex items-center justify-center bg-foreground/25 p-4 backdrop-blur-md"
          >
            <motion.div
              initial={{ scale: 0.85, y: 40, opacity: 0 }}
              animate={{ scale: 1, y: 0, opacity: 1 }}
              transition={{ type: "spring", stiffness: 260, damping: 18 }}
              className="glass w-full max-w-md rounded-[2.5rem] p-8 text-center"
            >
              <motion.div
                animate={{ rotate: [0, -8, 8, 0], scale: [1, 1.12, 1] }}
                transition={{ repeat: Infinity, repeatDelay: 1.4, duration: 0.8 }}
                className="mx-auto mb-4 w-fit rounded-full bg-sunny/40 p-4"
              >
                <Trophy className="h-9 w-9 text-foreground" />
              </motion.div>
              <h2 className="text-2xl font-extrabold">Waktu Habis!</h2>
              <p className="mt-1 text-sm text-muted-foreground">Kerja bagus, hebat sekali 🎉</p>

              <div className="mt-6 grid gap-3">
                <div className="glass-soft rounded-2xl px-5 py-4 text-left">
                  <p className="text-xs text-muted-foreground">Tabel Perkalian</p>
                  <p className="text-xl font-extrabold">Perkalian {multiplier}</p>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="glass-soft rounded-2xl px-5 py-4 text-left">
                    <p className="text-xs text-muted-foreground">Benar</p>
                    <p className="text-xl font-extrabold">{score} soal</p>
                  </div>
                  <div className="glass-soft rounded-2xl px-5 py-4 text-left">
                    <p className="text-xs text-muted-foreground">Durasi</p>
                    <p className="text-xl font-extrabold">{minutes} menit</p>
                  </div>
                </div>
              </div>

              <p className="mt-4 flex items-center justify-center gap-2 text-xs text-muted-foreground">
                {saving ? (
                  <>
                    <Loader2 className="h-3 w-3 animate-spin" /> Menyimpan…
                  </>
                ) : saveError ? (
                  "Gagal menyimpan riwayat."
                ) : (
                  "Tersimpan di riwayat ✓"
                )}
              </p>

              <GlassButton size="lg" className="mt-6 w-full" onClick={onExit}>
                <Home className="h-5 w-5" />
                Kembali ke Home
              </GlassButton>
            </motion.div>
          </motion.div>
      )}
    </div>
  );
}
