import { createFileRoute } from "@tanstack/react-router";
import { Play, Heart, TrendingUp, Sparkles, Dumbbell, Brain, Waves, Plane, Flame } from "lucide-react";
import { useState } from "react";
import heroImg from "@/assets/hero.jpg";
import cover1 from "@/assets/cover-1.jpg";
import cover2 from "@/assets/cover-2.jpg";
import cover3 from "@/assets/cover-3.jpg";
import cover4 from "@/assets/cover-4.jpg";
import cover5 from "@/assets/cover-5.jpg";
import cover6 from "@/assets/cover-6.jpg";

export const Route = createFileRoute("/_layout/")({
  head: () => ({
    meta: [
      { title: "XFORZA — A energia da música em um só lugar" },
      { name: "description", content: "Streaming premium do ecossistema FORZA. Playlists por objetivo: treino, foco, relaxar, viagem e motivação." },
    ],
  }),
  component: Home,
});

type Track = { id: string; title: string; artist: string; cover: string; genre?: string };

const trending: Track[] = [
  { id: "1", title: "Neon Dreams", artist: "Aurora X", cover: cover1, genre: "Pop" },
  { id: "2", title: "Iron Pulse", artist: "DeadLift Crew", cover: cover2, genre: "Hip-Hop" },
  { id: "3", title: "Late Night Code", artist: "Lo-Fi Lab", cover: cover3, genre: "Lo-Fi" },
  { id: "4", title: "City Lights", artist: "MC Vermelho", cover: cover4, genre: "Hip-Hop" },
  { id: "5", title: "Laser Tide", artist: "VOLTAGE", cover: cover5, genre: "Eletrônica" },
  { id: "6", title: "Rage Stage", artist: "Stratos", cover: cover6, genre: "Rock" },
];

const objectives = [
  { id: "treino", label: "Treino", desc: "Alta energia · Academia · Corrida", icon: Dumbbell, cover: cover2 },
  { id: "foco", label: "Foco", desc: "Lo-Fi · Instrumental · Study", icon: Brain, cover: cover3 },
  { id: "relaxar", label: "Relaxar", desc: "Chill · Ambient · Acoustic", icon: Waves, cover: cover1 },
  { id: "viagem", label: "Viagem", desc: "Road Trip · Summer Vibes", icon: Plane, cover: cover5 },
  { id: "motivacao", label: "Motivação", desc: "Hits · Hip-Hop · Rock", icon: Flame, cover: cover4 },
];

const genres = [
  { id: "pop", name: "Pop", cover: cover1, color: "from-pink-500/40 to-primary/40" },
  { id: "rock", name: "Rock", cover: cover6, color: "from-orange-600/40 to-primary/40" },
  { id: "hiphop", name: "Hip-Hop", cover: cover4, color: "from-amber-500/40 to-primary/40" },
  { id: "eletronica", name: "Eletrônica", cover: cover5, color: "from-fuchsia-500/40 to-primary/40" },
  { id: "lofi", name: "Lo-Fi", cover: cover3, color: "from-violet-500/40 to-primary/40" },
];

function TrackCard({ track, index }: { track: Track; index: number }) {
  const [fav, setFav] = useState(false);
  return (
    <div
      className="group relative flex flex-col gap-3 rounded-2xl bg-gradient-card p-3 card-hover animate-fade-up"
      style={{ animationDelay: `${index * 60}ms` }}
    >
      <div className="relative aspect-square overflow-hidden rounded-xl shadow-card">
        <img
          src={track.cover}
          alt={track.title}
          loading="lazy"
          width={512}
          height={512}
          className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-transparent to-transparent opacity-0 transition-opacity group-hover:opacity-100" />
        <button
          aria-label="Play"
          className="absolute bottom-3 right-3 flex h-11 w-11 translate-y-3 items-center justify-center rounded-full bg-gradient-primary text-primary-foreground opacity-0 shadow-glow transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100 hover:scale-110"
        >
          <Play className="ml-0.5 h-5 w-5" fill="currentColor" />
        </button>
      </div>
      <div className="flex items-start justify-between gap-2 px-1">
        <div className="min-w-0">
          <p className="truncate font-display text-sm font-bold text-foreground">{track.title}</p>
          <p className="truncate text-xs text-muted-foreground">{track.genre ?? track.artist}</p>
        </div>
        <button
          onClick={() => setFav(!fav)}
          aria-label="Favoritar"
          className="shrink-0 text-muted-foreground transition-colors hover:text-primary"
        >
          <Heart className={`h-4 w-4 transition-all ${fav ? "fill-primary text-primary scale-110" : ""}`} />
        </button>
      </div>
    </div>
  );
}

function Section({ title, icon: Icon, children }: { title: string; icon?: any; children: React.ReactNode }) {
  return (
    <section className="mt-10">
      <div className="mb-5 flex items-center gap-2">
        {Icon && <Icon className="h-5 w-5 text-primary" />}
        <h2 className="font-display text-2xl font-extrabold tracking-tight text-foreground sm:text-3xl">
          {title}
        </h2>
      </div>
      {children}
    </section>
  );
}

function Home() {
  return (
    <div>
      {/* Hero Banner */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0">
          <img
            src={heroImg}
            alt="XFORZA"
            width={1920}
            height={1080}
            className="h-full w-full object-cover opacity-50"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-background/30 via-background/60 to-background" />
          <div className="absolute inset-0 bg-gradient-radial" />
        </div>

        <div className="relative px-4 py-20 sm:px-8 sm:py-28 lg:px-12 lg:py-36">
          <div className="max-w-3xl animate-fade-up">
            <span className="inline-flex items-center gap-2 rounded-full border border-primary/40 bg-primary/10 px-3 py-1 font-accent text-xs font-bold uppercase tracking-widest text-primary backdrop-blur">
              <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-primary" />
              Ecossistema FORZA
            </span>
            <h1 className="mt-5 font-display text-5xl font-black leading-[0.95] tracking-tight text-foreground sm:text-6xl lg:text-7xl">
              Sua trilha sonora
              <br />
              <span className="text-gradient-primary">começa aqui.</span>
            </h1>
            <p className="mt-5 max-w-xl text-base text-muted-foreground sm:text-lg">
              A energia da música em um só lugar. Sua força. Sua música. O som que move você.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <button className="group inline-flex items-center gap-2 rounded-full bg-gradient-primary px-7 py-3.5 font-accent text-sm font-extrabold uppercase tracking-wider text-primary-foreground shadow-glow transition-transform hover:scale-105 active:scale-95">
                <Play className="h-4 w-4 transition-transform group-hover:translate-x-0.5" fill="currentColor" />
                Ouvir agora
              </button>
              <button className="inline-flex items-center gap-2 rounded-full border border-border bg-surface/60 px-7 py-3.5 font-accent text-sm font-extrabold uppercase tracking-wider text-foreground backdrop-blur transition-colors hover:bg-surface">
                Explorar
              </button>
            </div>
          </div>
        </div>
      </section>

      <div className="px-4 pb-12 sm:px-8 lg:px-12">
        {/* Em alta */}
        <Section title="Em Alta" icon={TrendingUp}>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
            {trending.map((t, i) => (
              <TrackCard key={t.id} track={t} index={i} />
            ))}
          </div>
        </Section>

        {/* Playlists por Objetivo */}
        <Section title="Playlists por Objetivo" icon={Flame}>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
            {objectives.map((obj, i) => (
              <div
                key={obj.id}
                className="group relative h-44 cursor-pointer overflow-hidden rounded-2xl card-hover animate-fade-up"
                style={{ animationDelay: `${i * 80}ms` }}
              >
                <img
                  src={obj.cover}
                  alt={obj.label}
                  loading="lazy"
                  width={512}
                  height={512}
                  className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-tr from-background via-background/70 to-primary/30" />
                <div className="relative flex h-full flex-col justify-between p-5">
                  <obj.icon className="h-7 w-7 text-primary drop-shadow-[0_0_12px_oklch(0.58_0.24_25/0.6)]" />
                  <div>
                    <p className="font-display text-2xl font-extrabold text-foreground">{obj.label}</p>
                    <p className="mt-1 text-xs text-muted-foreground">{obj.desc}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Section>

        {/* Novidades */}
        <Section title="Novidades" icon={Sparkles}>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
            {[...trending].reverse().map((t, i) => (
              <TrackCard key={`new-${t.id}`} track={t} index={i} />
            ))}
          </div>
        </Section>

        {/* Gêneros */}
        <Section title="Gêneros">
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
            {genres.map((g, i) => (
              <div
                key={g.id}
                className="group relative h-32 cursor-pointer overflow-hidden rounded-2xl card-hover animate-fade-up"
                style={{ animationDelay: `${i * 60}ms` }}
              >
                <img src={g.cover} alt={g.name} loading="lazy" width={512} height={512} className="absolute inset-0 h-full w-full object-cover opacity-50 transition-all duration-700 group-hover:scale-110 group-hover:opacity-70" />
                <div className={`absolute inset-0 bg-gradient-to-br ${g.color}`} />
                <div className="relative flex h-full items-end p-4">
                  <p className="font-display text-2xl font-black text-foreground drop-shadow-lg">{g.name}</p>
                </div>
              </div>
            ))}
          </div>
        </Section>

        {/* Favoritos */}
        <Section title="Favoritos" icon={Heart}>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
            {trending.slice(0, 5).map((t, i) => (
              <TrackCard key={`fav-${t.id}`} track={t} index={i} />
            ))}
          </div>
        </Section>
      </div>
    </div>
  );
}
