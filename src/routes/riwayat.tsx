import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { motion } from "motion/react";
import { ArrowLeft, CalendarDays, Clock, Loader2, Sparkles } from "lucide-react";
import { fetchHistory } from "@/lib/history";

export const Route = createFileRoute("/riwayat")({
  head: () => ({
    meta: [
      { title: "Riwayat Latihan — Jago Kali" },
      {
        name: "description",
        content: "Lihat riwayat sesi latihan perkalian: tanggal, tabel perkalian, jumlah soal benar, dan durasi.",
      },
      { property: "og:title", content: "Riwayat Latihan — Jago Kali" },
      {
        property: "og:description",
        content: "Riwayat sesi latihan perkalian lengkap dengan skor dan durasi.",
      },
    ],
  }),
  component: RiwayatPage,
  errorComponent: () => (
    <main className="flex min-h-dvh items-center justify-center p-6">
      <div className="glass rounded-[2rem] p-8 text-center">
        <p className="font-bold">Riwayat gagal dimuat.</p>
        <Link to="/" className="mt-3 inline-block text-sm text-primary underline">
          Kembali ke Home
        </Link>
      </div>
    </main>
  ),
});

const dateFmt = new Intl.DateTimeFormat("id-ID", {
  dateStyle: "medium",
  timeStyle: "short",
});

function RiwayatPage() {
  const { data, isLoading, isError } = useQuery({
    queryKey: ["study-history"],
    queryFn: fetchHistory,
  });

  return (
    <main className="mx-auto min-h-dvh w-full max-w-3xl px-5 py-10">
      <div className="mb-8 flex items-center gap-3">
        <Link
          to="/"
          className="glass rounded-full p-3 transition-transform hover:scale-105 active:scale-95"
          aria-label="Kembali"
        >
          <ArrowLeft className="h-5 w-5" />
        </Link>
        <div>
          <h1 className="text-2xl font-black tracking-tight">Riwayat Latihan</h1>
          <p className="text-sm text-muted-foreground">Semua sesi yang sudah diselesaikan.</p>
        </div>
      </div>

      {isLoading && (
        <div className="glass flex items-center justify-center gap-2 rounded-[2rem] p-10 text-sm text-muted-foreground">
          <Loader2 className="h-4 w-4 animate-spin" /> Memuat riwayat…
        </div>
      )}

      {isError && (
        <div className="glass rounded-[2rem] p-10 text-center text-sm text-muted-foreground">
          Gagal memuat riwayat. Coba muat ulang halaman.
        </div>
      )}

      {data && data.length === 0 && (
        <div className="glass rounded-[2rem] p-10 text-center">
          <p className="font-bold">Belum ada riwayat</p>
          <p className="mt-1 text-sm text-muted-foreground">
            Selesaikan satu sesi latihan untuk melihatnya di sini.
          </p>
        </div>
      )}

      <div className="grid gap-3 sm:grid-cols-2">
        {data?.map((session, i) => (
          <motion.article
            key={session.id}
            initial={{ opacity: 0, y: 18, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ type: "spring", stiffness: 260, damping: 22, delay: i * 0.04 }}
            className="glass rounded-[1.75rem] p-5"
          >
            <div className="flex items-center justify-between">
              <span className="rounded-full bg-primary/15 px-3 py-1 text-sm font-extrabold text-primary">
                Perkalian {session.multiplier}
              </span>
              <span className="flex items-center gap-1 text-xs text-muted-foreground">
                <CalendarDays className="h-3.5 w-3.5" />
                {dateFmt.format(new Date(session.created_at))}
              </span>
            </div>
            <div className="mt-4 flex items-center gap-3">
              <div className="glass-soft flex-1 rounded-2xl px-4 py-3">
                <p className="text-xs text-muted-foreground">Benar</p>
                <p className="flex items-center gap-1 text-lg font-extrabold">
                  <Sparkles className="h-4 w-4 text-sunny" />
                  {session.total_solved}
                </p>
              </div>
              <div className="glass-soft flex-1 rounded-2xl px-4 py-3">
                <p className="text-xs text-muted-foreground">Durasi</p>
                <p className="flex items-center gap-1 text-lg font-extrabold">
                  <Clock className="h-4 w-4 text-primary" />
                  {session.duration_minutes} mnt
                </p>
              </div>
            </div>
          </motion.article>
        ))}
      </div>
    </main>
  );
}
