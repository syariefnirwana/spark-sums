import { useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { motion } from "motion/react";
import { History, Play, Sparkles } from "lucide-react";
import { GlassButton } from "@/components/GlassButton";
import { SetupSheet } from "@/components/SetupSheet";
import { GameSession } from "@/components/GameSession";
import { unlockAudio } from "@/lib/sound";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Jago Kali — Latihan Perkalian Seru untuk Anak" },
      {
        name: "description",
        content:
          "Latihan perkalian 1-10 dengan timer, skor, dan suara seru. Dirancang untuk siswa kelas 4 SD.",
      },
      { property: "og:title", content: "Jago Kali — Latihan Perkalian Seru untuk Anak" },
      {
        property: "og:description",
        content: "Latihan perkalian 1-10 dengan timer, skor, dan efek suara seru.",
      },
    ],
  }),
  component: Index,
});

function Index() {
  const [setupOpen, setSetupOpen] = useState(false);
  const [game, setGame] = useState<{ multiplier: number; minutes: 10 | 15 } | null>(null);

  if (game) {
    return (
      <GameSession
        multiplier={game.multiplier}
        minutes={game.minutes}
        onExit={() => setGame(null)}
      />
    );
  }

  return (
    <main className="flex min-h-dvh flex-col items-center justify-center px-5 py-12">
      <motion.div
        initial={{ opacity: 0, y: 24, scale: 0.97 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ type: "spring", stiffness: 220, damping: 22 }}
        className="glass w-full max-w-md rounded-[2.5rem] p-8 text-center sm:p-10"
      >
        <motion.div
          animate={{ y: [0, -8, 0] }}
          transition={{ repeat: Infinity, duration: 3, ease: "easeInOut" }}
          className="mx-auto mb-5 w-fit rounded-3xl bg-primary/15 p-4"
        >
          <Sparkles className="h-8 w-8 text-primary" />
        </motion.div>

        <h1 className="text-4xl font-black tracking-tight">Jago Kali</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Latihan perkalian 1–10 yang seru dan menantang.
        </p>

        <div className="mt-8 grid gap-3">
          <GlassButton
            size="lg"
            onClick={() => {
              unlockAudio();
              setSetupOpen(true);
            }}
          >
            <Play className="h-5 w-5" />
            Mulai Latihan
          </GlassButton>

          <Link to="/riwayat" className="contents">
            <GlassButton size="lg" variant="soft">
              <History className="h-5 w-5" />
              Riwayat
            </GlassButton>
          </Link>
        </div>
      </motion.div>

      <SetupSheet
        open={setupOpen}
        onClose={() => setSetupOpen(false)}
        onStart={(multiplier, minutes) => {
          unlockAudio();
          setSetupOpen(false);
          setGame({ multiplier, minutes });
        }}
      />
    </main>
  );
}
