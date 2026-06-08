import { Link, Outlet } from "@tanstack/react-router";
import { createFileRoute } from "@tanstack/react-router";
import { Home, Search, Library, Crown, Play, Pause, SkipBack, SkipForward, Heart, Volume2 } from "lucide-react";
import { PlayerProvider, usePlayer, formatTime } from "@/contexts/player-context";

export const Route = createFileRoute("/_layout")({
  component: AppLayout,
});

function NavItem({ to, icon: Icon, label }: { to: string; icon: any; label: string }) {
  return (
    <Link
      to={to}
      className="group flex items-center gap-3 rounded-xl px-3 py-2.5 text-muted-foreground transition-all hover:bg-surface hover:text-foreground"
      activeProps={{ className: "bg-surface text-foreground" }}
    >
      <Icon className="h-5 w-5 transition-transform group-hover:scale-110" />
      <span className="font-accent text-sm font-semibold tracking-wide">{label}</span>
    </Link>
  );
}

function Equalizer({ active }: { active: boolean }) {
  return (
    <div className="flex h-4 items-end gap-0.5">
      {[0, 0.1, 0.2, 0.15, 0.05].map((d, i) => (
        <span
          key={i}
          className="w-0.5 bg-primary-foreground"
          style={{
            height: "100%",
            animation: active ? `equalizer 0.9s ease-in-out infinite` : "none",
            animationDelay: `${d}s`,
            transformOrigin: "bottom",
            transform: active ? undefined : "scaleY(0.3)",
          }}
        />
      ))}
    </div>
  );
}

function Player() {
  const p = usePlayer();
  const has = !!p.current;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 border-t border-border bg-surface/95 backdrop-blur-xl">
      <div className="absolute -top-px left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary to-transparent" />
      <div className="mx-auto flex h-20 max-w-[1600px] items-center justify-between gap-6 px-4 sm:px-6">
        {/* Track info */}
        <div className="flex min-w-0 flex-1 items-center gap-3 sm:max-w-xs">
          <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-md bg-gradient-primary shadow-glow">
            {has && p.current?.cover ? (
              <img src={p.current.cover} alt="" className="h-full w-full object-cover" />
            ) : (
              <div className="absolute inset-0 flex items-center justify-center">
                <Equalizer active={false} />
              </div>
            )}
            {p.playing && (
              <div className="absolute inset-0 flex items-center justify-center bg-background/60">
                <Equalizer active />
              </div>
            )}
          </div>
          <div className="min-w-0">
            <p className="truncate font-display text-sm font-bold text-foreground">
              {has ? p.current!.title : "Pronto para tocar"}
            </p>
            <p className="truncate text-xs text-muted-foreground">
              {has ? p.current!.artist : "Escolha uma música"}
            </p>
          </div>
          {has && (
            <button
              onClick={() => p.toggleFavorite(p.current!)}
              className="ml-2 hidden text-muted-foreground transition-colors hover:text-primary sm:block"
              aria-label="Favoritar"
            >
              <Heart className={`h-4 w-4 ${p.isFavorite(p.current!.id) ? "fill-primary text-primary" : ""}`} />
            </button>
          )}
        </div>

        {/* Controls */}
        <div className="flex flex-1 flex-col items-center gap-1.5">
          <div className="flex items-center gap-4">
            <button onClick={p.prev} disabled={!has} className="text-muted-foreground transition-colors hover:text-foreground disabled:opacity-40">
              <SkipBack className="h-5 w-5" />
            </button>
            <button
              onClick={p.toggle}
              disabled={!has}
              className="flex h-10 w-10 items-center justify-center rounded-full bg-foreground text-background transition-transform hover:scale-110 active:scale-95 disabled:opacity-40"
            >
              {p.playing ? <Pause className="h-4 w-4" /> : <Play className="ml-0.5 h-4 w-4" fill="currentColor" />}
            </button>
            <button onClick={p.next} disabled={!has} className="text-muted-foreground transition-colors hover:text-foreground disabled:opacity-40">
              <SkipForward className="h-5 w-5" />
            </button>
          </div>
          <div className="flex w-full max-w-md items-center gap-2 text-[10px] text-muted-foreground">
            <span>{formatTime(p.currentTime)}</span>
            <button
              onClick={(e) => {
                const r = e.currentTarget.getBoundingClientRect();
                p.seek((e.clientX - r.left) / r.width);
              }}
              disabled={!has}
              className="group relative h-1 flex-1 overflow-hidden rounded-full bg-border disabled:cursor-not-allowed"
            >
              <div
                className="absolute inset-y-0 left-0 bg-gradient-primary transition-all"
                style={{ width: `${p.progress * 100}%` }}
              />
            </button>
            <span>{formatTime(p.duration)}</span>
          </div>
        </div>

        {/* Volume */}
        <div className="hidden flex-1 items-center justify-end gap-2 sm:max-w-xs md:flex">
          <Volume2 className="h-4 w-4 text-muted-foreground" />
          <input
            type="range"
            min={0}
            max={1}
            step={0.01}
            value={p.volume}
            onChange={(e) => p.setVolume(parseFloat(e.target.value))}
            className="h-1 w-24 cursor-pointer accent-primary"
          />
        </div>
      </div>
    </div>
  );
}

function Sidebar() {
  return (
    <aside className="fixed inset-y-0 left-0 z-30 hidden w-60 flex-col border-r border-border bg-surface/60 backdrop-blur-xl lg:flex">
      <div className="flex h-20 items-center px-6">
        <Link to="/" className="group flex items-baseline gap-0.5">
          <span className="font-display text-3xl font-black text-primary transition-transform group-hover:scale-110">X</span>
          <span className="font-display text-2xl font-black tracking-tight text-foreground">FORZA</span>
        </Link>
      </div>
      <nav className="flex flex-col gap-1 px-3 py-2">
        <NavItem to="/" icon={Home} label="Início" />
        <NavItem to="/buscar" icon={Search} label="Buscar" />
        <NavItem to="/biblioteca" icon={Library} label="Biblioteca" />
      </nav>
      <div className="mt-auto p-4">
        <Link
          to="/planos"
          className="group flex items-center gap-2 rounded-xl bg-gradient-primary px-4 py-3 text-sm font-bold text-primary-foreground shadow-glow transition-transform hover:scale-[1.02]"
        >
          <Crown className="h-4 w-4" />
          Ver planos
        </Link>
      </div>
    </aside>
  );
}

function MobileNav() {
  return (
    <nav className="fixed bottom-20 left-1/2 z-30 flex -translate-x-1/2 gap-1 rounded-full border border-border bg-surface/95 px-2 py-1.5 shadow-elevated backdrop-blur-xl lg:hidden">
      {[
        { to: "/", icon: Home, label: "Início" },
        { to: "/buscar", icon: Search, label: "Buscar" },
        { to: "/biblioteca", icon: Library, label: "Biblioteca" },
        { to: "/planos", icon: Crown, label: "Planos" },
      ].map((it) => (
        <Link
          key={it.to}
          to={it.to}
          className="flex flex-col items-center gap-0.5 rounded-full px-4 py-2 text-[10px] text-muted-foreground transition-colors"
          activeProps={{ className: "text-primary" }}
        >
          <it.icon className="h-4 w-4" />
          {it.label}
        </Link>
      ))}
    </nav>
  );
}

function AppLayout() {
  return (
    <PlayerProvider>
      <div className="min-h-screen bg-background pb-32">
        <Sidebar />

        <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-border bg-surface/80 px-4 backdrop-blur-xl lg:hidden">
          <Link to="/" className="flex items-baseline gap-0.5">
            <span className="font-display text-2xl font-black text-primary">X</span>
            <span className="font-display text-xl font-black tracking-tight text-foreground">FORZA</span>
          </Link>
          <Link
            to="/planos"
            className="rounded-full bg-gradient-primary px-4 py-1.5 text-xs font-bold text-primary-foreground shadow-glow"
          >
            Planos
          </Link>
        </header>

        <main className="lg:ml-60">
          <Outlet />
        </main>

        <MobileNav />
        <Player />
      </div>
    </PlayerProvider>
  );
}
