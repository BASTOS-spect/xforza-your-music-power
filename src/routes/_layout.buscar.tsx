import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { Search as SearchIcon, Play, Heart, Loader2 } from "lucide-react";
import { useState } from "react";
import { searchTracks, type Track } from "@/lib/music-api";
import { usePlayer, formatTime } from "@/contexts/player-context";

export const Route = createFileRoute("/_layout/buscar")({
  head: () => ({
    meta: [
      { title: "Buscar — XFORZA" },
      { name: "description", content: "Busque músicas, artistas e álbuns no XFORZA." },
    ],
  }),
  component: SearchPage,
});

const SUGGESTIONS = ["Anitta", "The Weeknd", "Henrique e Juliano", "Lo-Fi", "Workout", "Marília Mendonça", "Bad Bunny", "Coldplay"];

function SearchPage() {
  const [term, setTerm] = useState("");
  const [active, setActive] = useState("");
  const { data, isFetching } = useQuery({
    queryKey: ["search", active],
    queryFn: () => searchTracks(active, 30),
    enabled: !!active,
    staleTime: 1000 * 60 * 30,
  });
  const p = usePlayer();

  const submit = (q: string) => {
    setTerm(q);
    setActive(q);
  };

  return (
    <div className="px-4 py-10 sm:px-8 lg:px-12">
      <h1 className="font-display text-4xl font-black tracking-tight text-foreground sm:text-5xl">
        Buscar
      </h1>

      <form
        onSubmit={(e) => { e.preventDefault(); submit(term); }}
        className="mt-6 flex max-w-2xl items-center gap-2 rounded-full border border-border bg-surface px-5 py-3 shadow-card transition-all focus-within:border-primary/50 focus-within:shadow-glow"
      >
        <SearchIcon className="h-5 w-5 text-muted-foreground" />
        <input
          value={term}
          onChange={(e) => setTerm(e.target.value)}
          placeholder="O que você quer ouvir?"
          className="flex-1 bg-transparent text-foreground outline-none placeholder:text-muted-foreground"
        />
        {isFetching && <Loader2 className="h-4 w-4 animate-spin text-primary" />}
      </form>

      {!active && (
        <div className="mt-10 animate-fade-up">
          <p className="mb-3 font-accent text-xs font-bold uppercase tracking-widest text-muted-foreground">Sugestões</p>
          <div className="flex flex-wrap gap-2">
            {SUGGESTIONS.map((s) => (
              <button
                key={s}
                onClick={() => submit(s)}
                className="rounded-full border border-border bg-surface px-4 py-2 text-sm text-foreground transition-all hover:border-primary/50 hover:bg-primary/10 hover:text-primary"
              >
                {s}
              </button>
            ))}
          </div>
        </div>
      )}

      {active && data && data.length > 0 && (
        <div className="mt-8 space-y-1">
          {data.map((t, i) => (
            <TrackRow key={t.id} track={t} queue={data} index={i} />
          ))}
        </div>
      )}

      {active && !isFetching && data?.length === 0 && (
        <p className="mt-12 text-center text-muted-foreground">Nenhum resultado para “{active}”.</p>
      )}
    </div>
  );
}

function TrackRow({ track, queue, index }: { track: Track; queue: Track[]; index: number }) {
  const p = usePlayer();
  const isCurrent = p.current?.id === track.id;
  return (
    <div
      className="group grid grid-cols-[40px_56px_1fr_auto_auto] items-center gap-4 rounded-xl px-3 py-2 transition-colors hover:bg-surface animate-fade-up"
      style={{ animationDelay: `${Math.min(index, 12) * 30}ms` }}
    >
      <button
        onClick={() => p.play(track, queue)}
        className="flex h-8 w-8 items-center justify-center text-muted-foreground transition-colors group-hover:text-primary"
      >
        <span className={`text-sm tabular-nums ${isCurrent ? "hidden" : "group-hover:hidden"}`}>{index + 1}</span>
        <Play className={`h-4 w-4 ${isCurrent ? "block text-primary" : "hidden group-hover:block"}`} fill="currentColor" />
      </button>
      <img src={track.cover} alt="" loading="lazy" className="h-12 w-12 rounded-md object-cover shadow-card" />
      <div className="min-w-0">
        <p className={`truncate font-semibold ${isCurrent ? "text-primary" : "text-foreground"}`}>{track.title}</p>
        <p className="truncate text-xs text-muted-foreground">{track.artist} · {track.album}</p>
      </div>
      <button
        onClick={() => p.toggleFavorite(track)}
        className="text-muted-foreground transition-colors hover:text-primary"
        aria-label="Favoritar"
      >
        <Heart className={`h-4 w-4 ${p.isFavorite(track.id) ? "fill-primary text-primary" : ""}`} />
      </button>
      <span className="hidden text-xs tabular-nums text-muted-foreground sm:block">{formatTime(track.duration)}</span>
    </div>
  );
}
