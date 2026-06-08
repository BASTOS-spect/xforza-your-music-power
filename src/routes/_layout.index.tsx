import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { Play, Heart, TrendingUp, Sparkles, Dumbbell, Brain, Waves, Plane, Flame, Loader2 } from "lucide-react";
import heroImg from "@/assets/hero.jpg";
import { getCategory, type CategoryKey, type Track } from "@/lib/music-api";
import { usePlayer } from "@/contexts/player-context";

export const Route = createFileRoute("/_layout/")({
  head: () => ({
    meta: [
      { title: "XFORZA — A energia da música em um só lugar" },
      { name: "description", content: "Streaming premium do ecossistema FORZA. Playlists por objetivo: treino, foco, relaxar, viagem e motivação." },
    ],
  }),
  component: Home,
});

function useCategory(key: CategoryKey, limit = 12) {
  return useQuery({
    queryKey: ["cat", key, limit],
    queryFn: () => getCategory(key, limit),
    staleTime: 1000 * 60 * 60,
  });
}

function TrackCard({ track, queue, index }: { track: Track; queue: Track[]; index: number }) {
  const p = usePlayer();
  const fav = p.isFavorite(track.id);
  const isCurrent = p.current?.id === track.id;
  return (
    <div
      className="group relative flex flex-col gap-3 rounded-2xl bg-gradient-card p-3 card-hover animate-fade-up"
      style={{ animationDelay: `${index * 40}ms` }}
    >
      <div className="relative aspect-square overflow-hidden rounded-xl shadow-card">
        <img
          src={track.cover}
          alt={track.title}
          loading="lazy"
          className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-transparent to-transparent opacity-0 transition-opacity group-hover:opacity-100" />
        <button
          onClick={() => p.play(track, queue)}
          aria-label="Tocar"
          className={`absolute bottom-3 right-3 flex h-11 w-11 items-center justify-center rounded-full bg-gradient-primary text-primary-foreground shadow-glow transition-all duration-300 hover:scale-110 ${
            isCurrent && p.playing
              ? "opacity-100 translate-y-0"
              : "translate-y-3 opacity-0 group-hover:translate-y-0 group-hover:opacity-100"
          }`}
        >
          <Play className="ml-0.5 h-5 w-5" fill="currentColor" />
        </button>
      </div>
      <div className="flex items-start justify-between gap-2 px-1">
        <div className="min-w-0">
          <p className={`truncate font-display text-sm font-bold ${isCurrent ? "text-primary" : "text-foreground"}`}>{track.title}</p>
          <p className="truncate text-xs text-muted-foreground">{track.artist}</p>
        </div>
        <button
          onClick={() => p.toggleFavorite(track)}
          aria-label="Favoritar"
          className="shrink-0 text-muted-foreground transition-colors hover:text-primary"
        >
          <Heart className={`h-4 w-4 transition-all ${fav ? "fill-primary text-primary scale-110" : ""}`} />
        </button>
      </div>
    </div>
  );
}

function CardSkeleton() {
  return (
    <div className="flex flex-col gap-3 rounded-2xl bg-gradient-card p-3">
      <div className="aspect-square overflow-hidden rounded-xl animate-shimmer bg-surface-elevated" />
      <div className="space-y-1.5 px-1">
        <div className="h-3 w-3/4 rounded animate-shimmer bg-surface-elevated" />
        <div className="h-2.5 w-1/2 rounded animate-shimmer bg-surface-elevated" />
      </div>
    </div>
  );
}

function Section({
  title,
  icon: Icon,
  category,
  limit = 6,
}: {
  title: string;
  icon?: any;
  category: CategoryKey;
  limit?: number;
}) {
  const { data, isLoading } = useCategory(category, limit);
  return (
    <section className="mt-12">
      <div className="mb-5 flex items-center gap-2">
        {Icon && <Icon className="h-5 w-5 text-primary" />}
        <h2 className="font-display text-2xl font-extrabold tracking-tight text-foreground sm:text-3xl">{title}</h2>
      </div>
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
        {isLoading
          ? Array.from({ length: limit }).map((_, i) => <CardSkeleton key={i} />)
          : (data ?? []).map((t, i) => <TrackCard key={t.id} track={t} queue={data ?? []} index={i} />)}
      </div>
    </section>
  );
}

const objectives: { key: CategoryKey; label: string; desc: string; icon: any }[] = [
  { key: "treino", label: "Treino", desc: "Alta energia · Academia · Corrida", icon: Dumbbell },
  { key: "foco", label: "Foco", desc: "Lo-Fi · Instrumental · Study", icon: Brain },
  { key: "relaxar", label: "Relaxar", desc: "Chill · Ambient · Acoustic", icon: Waves },
  { key: "viagem", label: "Viagem", desc: "Road Trip · Summer Vibes", icon: Plane },
  { key: "motivacao", label: "Motivação", desc: "Hits · Hip-Hop · Rock", icon: Flame },
];

function ObjectiveCard({ obj, i }: { obj: typeof objectives[number]; i: number }) {
  const { data } = useCategory(obj.key, 4);
  const p = usePlayer();
  const cover = data?.[0]?.cover;
  return (
    <button
      onClick={() => data && data[0] && p.play(data[0], data)}
      className="group relative h-44 overflow-hidden rounded-2xl text-left card-hover animate-fade-up"
      style={{ animationDelay: `${i * 70}ms` }}
    >
      {cover && (
        <img src={cover} alt={obj.label} loading="lazy" className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-110" />
      )}
      <div className="absolute inset-0 bg-gradient-to-tr from-background via-background/70 to-primary/30" />
      <div className="relative flex h-full flex-col justify-between p-5">
        <obj.icon className="h-7 w-7 text-primary drop-shadow-[0_0_12px_oklch(0.58_0.24_25/0.6)]" />
        <div>
          <p className="font-display text-2xl font-extrabold text-foreground">{obj.label}</p>
          <p className="mt-1 text-xs text-muted-foreground">{obj.desc}</p>
        </div>
      </div>
    </button>
  );
}

const genres: { key: CategoryKey; name: string; color: string }[] = [
  { key: "pop", name: "Pop", color: "from-pink-500/40 to-primary/40" },
  { key: "rock", name: "Rock", color: "from-orange-600/40 to-primary/40" },
  { key: "hiphop", name: "Hip-Hop", color: "from-amber-500/40 to-primary/40" },
  { key: "eletronica", name: "Eletrônica", color: "from-fuchsia-500/40 to-primary/40" },
  { key: "lofi", name: "Lo-Fi", color: "from-violet-500/40 to-primary/40" },
];

function GenreCard({ g, i }: { g: typeof genres[number]; i: number }) {
  const { data } = useCategory(g.key, 4);
  const cover = data?.[0]?.cover;
  return (
    <div className="group relative h-32 cursor-pointer overflow-hidden rounded-2xl card-hover animate-fade-up" style={{ animationDelay: `${i * 60}ms` }}>
      {cover && <img src={cover} alt={g.name} loading="lazy" className="absolute inset-0 h-full w-full object-cover opacity-50 transition-all duration-700 group-hover:scale-110 group-hover:opacity-70" />}
      <div className={`absolute inset-0 bg-gradient-to-br ${g.color}`} />
      <div className="relative flex h-full items-end p-4">
        <p className="font-display text-2xl font-black text-foreground drop-shadow-lg">{g.name}</p>
      </div>
    </div>
  );
}

function FavoritesSection() {
  const p = usePlayer();
  if (p.favoriteTracks.length === 0) return null;
  return (
    <section className="mt-12">
      <div className="mb-5 flex items-center gap-2">
        <Heart className="h-5 w-5 text-primary" />
        <h2 className="font-display text-2xl font-extrabold tracking-tight text-foreground sm:text-3xl">Favoritos</h2>
      </div>
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
        {p.favoriteTracks.slice(0, 12).map((t, i) => (
          <TrackCard key={t.id} track={t} queue={p.favoriteTracks} index={i} />
        ))}
      </div>
    </section>
  );
}

function Home() {
  const trending = useCategory("trending", 6);
  const p = usePlayer();

  return (
    <div>
      <section className="relative overflow-hidden">
        <div className="absolute inset-0">
          <img src={heroImg} alt="" className="h-full w-full object-cover opacity-50" />
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
              <button
                onClick={() => trending.data && trending.data[0] && p.play(trending.data[0], trending.data)}
                disabled={!trending.data?.length}
                className="group inline-flex items-center gap-2 rounded-full bg-gradient-primary px-7 py-3.5 font-accent text-sm font-extrabold uppercase tracking-wider text-primary-foreground shadow-glow transition-transform hover:scale-105 active:scale-95 disabled:opacity-60"
              >
                {trending.isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Play className="h-4 w-4" fill="currentColor" />}
                Ouvir agora
              </button>
            </div>
          </div>
        </div>
      </section>

      <div className="px-4 pb-12 sm:px-8 lg:px-12">
        <Section title="Em Alta" icon={TrendingUp} category="trending" />

        <section className="mt-12">
          <div className="mb-5 flex items-center gap-2">
            <Flame className="h-5 w-5 text-primary" />
            <h2 className="font-display text-2xl font-extrabold tracking-tight text-foreground sm:text-3xl">Playlists por Objetivo</h2>
          </div>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
            {objectives.map((o, i) => <ObjectiveCard key={o.key} obj={o} i={i} />)}
          </div>
        </section>

        <Section title="Novidades" icon={Sparkles} category="novidades" />

        <section className="mt-12">
          <h2 className="mb-5 font-display text-2xl font-extrabold tracking-tight text-foreground sm:text-3xl">Gêneros</h2>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
            {genres.map((g, i) => <GenreCard key={g.key} g={g} i={i} />)}
          </div>
        </section>

        <FavoritesSection />
      </div>
    </div>
  );
}
