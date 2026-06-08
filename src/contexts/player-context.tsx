import { createContext, useContext, useEffect, useRef, useState, type ReactNode } from "react";
import type { Track } from "@/lib/music-api";

type PlayerCtx = {
  current: Track | null;
  queue: Track[];
  playing: boolean;
  progress: number; // 0..1
  currentTime: number;
  duration: number;
  volume: number;
  favorites: Set<string>;
  play: (track: Track, queue?: Track[]) => void;
  toggle: () => void;
  next: () => void;
  prev: () => void;
  seek: (ratio: number) => void;
  setVolume: (v: number) => void;
  toggleFavorite: (track: Track) => void;
  isFavorite: (id: string) => boolean;
  favoriteTracks: Track[];
};

const PlayerContext = createContext<PlayerCtx | null>(null);

const FAV_KEY = "xforza:favs:v1";

export function PlayerProvider({ children }: { children: ReactNode }) {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [current, setCurrent] = useState<Track | null>(null);
  const [queue, setQueue] = useState<Track[]>([]);
  const [playing, setPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolumeState] = useState(0.7);
  const [favorites, setFavorites] = useState<Set<string>>(new Set());
  const [favoriteTracks, setFavoriteTracks] = useState<Track[]>([]);

  // Init audio + load favorites (client only)
  useEffect(() => {
    const a = new Audio();
    a.preload = "metadata";
    a.volume = volume;
    audioRef.current = a;

    const onTime = () => setCurrentTime(a.currentTime);
    const onMeta = () => setDuration(a.duration || 30);
    const onEnd = () => skipNext();
    a.addEventListener("timeupdate", onTime);
    a.addEventListener("loadedmetadata", onMeta);
    a.addEventListener("ended", onEnd);

    try {
      const raw = localStorage.getItem(FAV_KEY);
      if (raw) {
        const arr: Track[] = JSON.parse(raw);
        setFavoriteTracks(arr);
        setFavorites(new Set(arr.map((t) => t.id)));
      }
    } catch {}

    return () => {
      a.pause();
      a.removeEventListener("timeupdate", onTime);
      a.removeEventListener("loadedmetadata", onMeta);
      a.removeEventListener("ended", onEnd);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const persistFavs = (arr: Track[]) => {
    try { localStorage.setItem(FAV_KEY, JSON.stringify(arr)); } catch {}
  };

  const play = (track: Track, q?: Track[]) => {
    const a = audioRef.current;
    if (!a) return;
    setCurrent(track);
    if (q) setQueue(q);
    a.src = track.preview;
    a.play().then(() => setPlaying(true)).catch(() => setPlaying(false));
  };

  const toggle = () => {
    const a = audioRef.current;
    if (!a || !current) return;
    if (playing) { a.pause(); setPlaying(false); }
    else { a.play().then(() => setPlaying(true)).catch(() => {}); }
  };

  const skipNext = () => {
    if (!current || queue.length === 0) { setPlaying(false); return; }
    const i = queue.findIndex((t) => t.id === current.id);
    const nxt = queue[(i + 1) % queue.length];
    if (nxt) play(nxt, queue);
  };
  const skipPrev = () => {
    if (!current || queue.length === 0) return;
    const i = queue.findIndex((t) => t.id === current.id);
    const prev = queue[(i - 1 + queue.length) % queue.length];
    if (prev) play(prev, queue);
  };

  const seek = (ratio: number) => {
    const a = audioRef.current;
    if (!a || !duration) return;
    a.currentTime = Math.max(0, Math.min(duration, ratio * duration));
  };
  const setVolume = (v: number) => {
    setVolumeState(v);
    if (audioRef.current) audioRef.current.volume = v;
  };

  const toggleFavorite = (track: Track) => {
    setFavorites((prev) => {
      const next = new Set(prev);
      let nextList: Track[];
      if (next.has(track.id)) {
        next.delete(track.id);
        nextList = favoriteTracks.filter((t) => t.id !== track.id);
      } else {
        next.add(track.id);
        nextList = [track, ...favoriteTracks];
      }
      setFavoriteTracks(nextList);
      persistFavs(nextList);
      return next;
    });
  };
  const isFavorite = (id: string) => favorites.has(id);

  const progress = duration ? currentTime / duration : 0;

  return (
    <PlayerContext.Provider
      value={{
        current, queue, playing, progress, currentTime, duration, volume, favorites, favoriteTracks,
        play, toggle, next: skipNext, prev: skipPrev, seek, setVolume, toggleFavorite, isFavorite,
      }}
    >
      {children}
    </PlayerContext.Provider>
  );
}

export function usePlayer() {
  const ctx = useContext(PlayerContext);
  if (!ctx) throw new Error("usePlayer must be used within PlayerProvider");
  return ctx;
}

export function formatTime(s: number) {
  if (!Number.isFinite(s)) return "0:00";
  const m = Math.floor(s / 60);
  const sec = Math.floor(s % 60).toString().padStart(2, "0");
  return `${m}:${sec}`;
}
