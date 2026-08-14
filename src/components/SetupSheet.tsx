import { useState } from "react";
import { motion } from "motion/react";
import { X, Play, Timer } from "lucide-react";
import { GlassButton } from "./GlassButton";
import { cn } from "@/lib/utils";

const spring = { type: "spring" as const, stiffness: 320, damping: 26 };

export function SetupSheet({
  open,
  onClose,
  onStart,
}: {
  open: boolean;
  onClose: () => void;
  onStart: (multiplier: number, minutes: 10 | 15) => void;
}) {
  const [multiplier, setMultiplier] = useState(2);
  const [minutes, setMinutes] = useState<10 | 15>(10);

  if (!open) return null;

  return (
    <>
      {(
        <motion.div
          className="fixed inset-0 z-50 flex items-end justify-center p-3 sm:items-center sm:p-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <motion.button
            aria-label="Tutup"
            onClick={onClose}
            className="absolute inset-0 bg-foreground/20 backdrop-blur-sm"
          />
          <motion.div
            initial={{ y: 80, opacity: 0, scale: 0.96 }}
            animate={{ y: 0, opacity: 1, scale: 1 }}
            transition={{ type: "spring", stiffness: 300, damping: 24 }}
            className="glass relative w-full max-w-lg rounded-[2rem] p-6 sm:p-8"
          >
            <div className="mb-6 flex items-start justify-between gap-4">
              <div>
                <h2 className="text-2xl font-extrabold tracking-tight">Atur Latihan</h2>
                <p className="text-sm text-muted-foreground">
                  Pilih angka perkalian dan lama waktunya.
                </p>
              </div>
              <motion.button
                whileTap={{ scale: 0.9, rotate: 90 }}
                onClick={onClose}
                className="glass-soft rounded-full p-2"
                aria-label="Tutup"
              >
                <X className="h-5 w-5" />
              </motion.button>
            </div>

            <p className="mb-3 text-sm font-bold">Perkalian</p>
            <div className="mb-7 grid grid-cols-5 gap-2">
              {Array.from({ length: 10 }, (_, i) => i + 1).map((n) => (
                <motion.button
                  key={n}
                  onClick={() => setMultiplier(n)}
                  whileHover={{ scale: 1.08 }}
                  whileTap={{ scale: 0.9 }}
                  transition={spring}
                  className={cn(
                    "aspect-square rounded-2xl text-lg font-extrabold",
                    multiplier === n
                      ? "bg-primary text-primary-foreground shadow-[var(--shadow-soft)]"
                      : "glass-soft text-foreground",
                  )}
                >
                  {n}
                </motion.button>
              ))}
            </div>

            <p className="mb-3 text-sm font-bold">Durasi</p>
            <div className="mb-8 grid grid-cols-2 gap-3">
              {([10, 15] as const).map((m) => (
                <motion.button
                  key={m}
                  onClick={() => setMinutes(m)}
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.95 }}
                  transition={spring}
                  className={cn(
                    "flex items-center justify-center gap-2 rounded-2xl py-4 font-extrabold",
                    minutes === m
                      ? "bg-accent text-accent-foreground shadow-[var(--shadow-soft)]"
                      : "glass-soft text-foreground",
                  )}
                >
                  <Timer className="h-5 w-5" />
                  {m} menit
                </motion.button>
              ))}
            </div>

            <GlassButton
              size="lg"
              className="w-full"
              onClick={() => onStart(multiplier, minutes)}
            >
              <Play className="h-5 w-5" />
              Mulai Game
            </GlassButton>
          </motion.div>
        </motion.div>
      )}
    </>
  );
}
