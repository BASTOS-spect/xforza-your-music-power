import { Link, Outlet } from "@tanstack/react-router";
import { createFileRoute } from "@tanstack/react-router";
import { Home, Search, Library, Crown, Play, Pause, SkipBack, SkipForward, Heart, Volume2 } from "lucide-react";
import { useState } from "react";

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

function Equalizer() {
  return (
    <div className="flex h-4 items-end gap-0.5">
      {[0, 0.1, 0.2, 0.15, 0.05].map((d, i) => (
        <span
          key={i}
          className="w-0.5 bg-primary animate-equalizer"
          style={{ animationDelay: `${d}s`, height: "100%" }}
        />
      ))}
    </div>
  );
}

function Player() {
  const [playing, setPlaying] = useState(false);
  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 border-t border-border bg-surface/95 backdrop-blur-xl">
      <div className="absolute -top-px left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary to-transparent" />
      <div className="mx-auto flex h-20 max-w-[1600px] items-center justify-between gap-6 px-4 sm:px-6">
        {/* Track info */}
        <div className="flex min-w-0 items-center gap-3">
          <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-md bg-gradient-primary shadow-glow">
            <div className="absolute inset-0 flex items-center justify-center">
              <Equalizer />
            </div>
          </div>
          <div className="min-w-0">
            <p className="truncate font-display text-sm font-bold text-foreground">Neon Dreams</p>
            <p className="truncate text-xs text-muted-foreground">XFORZA · Pop</p>
          </div>
          <button className="ml-2 hidden text-muted-foreground transition-colors hover:text-primary sm:block">
            <Heart className="h-4 w-4" />
          </button>
        </div>

        {/* Controls */}
        <div className="flex flex-1 flex-col items-center gap-1.5">
          <div className="flex items-center gap-4">
            <button className="text-muted-foreground transition-colors hover:text-foreground">
              <SkipBack className="h-5 w-5" />
            </button>
            <button
              onClick={() => setPlaying(!playing)}
              className="flex h-10 w-10 items-center justify-center rounded-full bg-foreground text-background transition-transform hover:scale-110 active:scale-95"
            >
              {playing ? <Pause className="h-4 w-4" /> : <Play className="ml-0.5 h-4 w-4" />}
            </button>
            <button className="text-muted-foreground transition-colors hover:text-foreground">
              <SkipForward className="h-5 w-5" />
            </button>
          </div>
          <div className="flex w-full max-w-md items-center gap-2 text-[10px] text-muted-foreground">
            <span>1:24</span>
            <div className="group relative h-1 flex-1 overflow-hidden rounded-full bg-border">
              <div className="absolute inset-y-0 left-0 w-1/3 bg-gradient-primary transition-all group-hover:bg-primary" />
            </div>
            <span>3:48</span>
          </div>
        </div>

        {/* Volume */}
        <div className="hidden items-center gap-2 md:flex">
          <Volume2 className="h-4 w-4 text-muted-foreground" />
          <div className="h-1 w-24 overflow-hidden rounded-full bg-border">
            <div className="h-full w-2/3 bg-foreground" />
          </div>
        </div>
      </div>
    </div>
  );
}

function AppLayout() {
  return (
    <div className="min-h-screen bg-background pb-20">
      {/* Sidebar (desktop) */}
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

      {/* Mobile top bar */}
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

      <Player />
    </div>
  );
}
