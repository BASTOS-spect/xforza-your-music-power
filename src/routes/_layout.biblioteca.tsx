import { createFileRoute, Link } from "@tanstack/react-router";
import { Play, Heart, Library as LibIcon } from "lucide-react";
import { usePlayer, formatTime } from "@/contexts/player-context";

export const Route = createFileRoute("/_layout/biblioteca")({
  head: () => ({
    meta: [
      { title: "Biblioteca — XFORZA" },
      { name: "description", content: "Suas músicas favoritas salvas no XFORZA." },
    ],
  }),
  component: Library,
});

function Library() {
  const p = usePlayer();
  const tracks = p.favoriteTracks;

  return (
    <div className="px-4 py-10 sm:px-8 lg:px-12">
      <div className="flex items-end gap-5 animate-fade-up">
        <div className="flex h-32 w-32 items-center justify-center rounded-2xl bg-gradient-primary shadow-glow sm:h-44 sm:w-44">
          <Heart className="h-16 w-16 text-primary-foreground" fill="currentColor" />
        </div>
        <div>
          <p className="font-accent text-xs font-bold uppercase tracking-widest text-muted-foreground">Playlist</p>
          <h1 className="mt-1 font-display text-4xl font-black tracking-tight text-foreground sm:text-6xl">Favoritos</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            {tracks.length} {tracks.length === 1 ? "música" : "músicas"} salvas
          </p>
        </div>
      </div>

      {tracks.length === 0 ? (
        <div className="mt-16 flex flex-col items-center justify-center rounded-3xl border border-dashed border-border bg-surface/40 px-6 py-20 text-center animate-fade-up">
          <LibIcon className="h-12 w-12 text-muted-foreground" />
          <h2 className="mt-5 font-display text-2xl font-bold text-foreground">Sua biblioteca está vazia</h2>
          <p className="mt-2 max-w-md text-sm text-muted-foreground">
            Toque o coração em qualquer música para salvá-la aqui e ouvir sempre que quiser.
          </p>
          <Link
            to="/buscar"
            className="mt-6 inline-flex items-center gap-2 rounded-full bg-gradient-primary px-6 py-3 font-accent text-sm font-extrabold uppercase tracking-wider text-primary-foreground shadow-glow transition-transform hover:scale-105"
          >
            Descobrir músicas
          </Link>
        </div>
      ) : (
        <div className="mt-10">
          <button
            onClick={() => p.play(tracks[0], tracks)}
            className="mb-6 inline-flex items-center gap-2 rounded-full bg-gradient-primary px-7 py-3 font-accent text-sm font-extrabold uppercase tracking-wider text-primary-foreground shadow-glow transition-transform hover:scale-105"
          >
            <Play className="h-4 w-4" fill="currentColor" /> Tocar tudo
          </button>
          <div className="space-y-1">
            {tracks.map((t, i) => {
              const isCurrent = p.current?.id === t.id;
              return (
                <div
                  key={t.id}
                  className="group grid grid-cols-[40px_56px_1fr_auto_auto] items-center gap-4 rounded-xl px-3 py-2 transition-colors hover:bg-surface animate-fade-up"
                  style={{ animationDelay: `${Math.min(i, 12) * 30}ms` }}
                >
                  <button
                    onClick={() => p.play(t, tracks)}
                    className="flex h-8 w-8 items-center justify-center text-muted-foreground transition-colors group-hover:text-primary"
                  >
                    <span className={`text-sm tabular-nums ${isCurrent ? "hidden" : "group-hover:hidden"}`}>{i + 1}</span>
                    <Play className={`h-4 w-4 ${isCurrent ? "block text-primary" : "hidden group-hover:block"}`} fill="currentColor" />
                  </button>
                  <img src={t.cover} alt="" loading="lazy" className="h-12 w-12 rounded-md object-cover shadow-card" />
                  <div className="min-w-0">
                    <p className={`truncate font-semibold ${isCurrent ? "text-primary" : "text-foreground"}`}>{t.title}</p>
                    <p className="truncate text-xs text-muted-foreground">{t.artist} · {t.album}</p>
                  </div>
                  <button
                    onClick={() => p.toggleFavorite(t)}
                    className="text-primary transition-colors"
                    aria-label="Remover"
                  >
                    <Heart className="h-4 w-4 fill-primary" />
                  </button>
                  <span className="hidden text-xs tabular-nums text-muted-foreground sm:block">{formatTime(t.duration)}</span>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
