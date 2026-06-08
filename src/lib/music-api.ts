// iTunes Search API wrapper — free, no key, CORS-enabled.
// Returns real songs with real album artwork and 30s preview URLs.

export type Track = {
  id: string;
  title: string;
  artist: string;
  album: string;
  cover: string;
  preview: string;
  duration: number; // seconds
  genre: string;
};

const BASE = "https://itunes.apple.com/search";

function mapResult(r: any): Track {
  return {
    id: String(r.trackId),
    title: r.trackName,
    artist: r.artistName,
    album: r.collectionName ?? "",
    cover: (r.artworkUrl100 || "").replace("100x100bb", "600x600bb"),
    preview: r.previewUrl ?? "",
    duration: Math.round((r.trackTimeMillis ?? 0) / 1000),
    genre: r.primaryGenreName ?? "",
  };
}

export async function searchTracks(term: string, limit = 24): Promise<Track[]> {
  if (!term.trim()) return [];
  const url = `${BASE}?term=${encodeURIComponent(term)}&entity=song&limit=${limit}&country=BR&lang=pt_br`;
  const res = await fetch(url);
  if (!res.ok) throw new Error("Falha na busca");
  const json = await res.json();
  return (json.results ?? [])
    .filter((r: any) => r.previewUrl && r.artworkUrl100)
    .map(mapResult);
}

// Curated category queries — every category resolves to real iTunes tracks.
export const CATEGORY_QUERIES = {
  trending: "top hits 2025",
  novidades: "lançamentos pop 2025",
  treino: "workout motivation",
  foco: "lofi study beats",
  relaxar: "chill acoustic",
  viagem: "road trip summer",
  motivacao: "hits brasil",
  pop: "pop hits",
  rock: "rock classics",
  hiphop: "hip hop brasil",
  eletronica: "electronic dance",
  lofi: "lofi hip hop",
} as const;

export type CategoryKey = keyof typeof CATEGORY_QUERIES;

export async function getCategory(key: CategoryKey, limit = 12): Promise<Track[]> {
  return searchTracks(CATEGORY_QUERIES[key], limit);
}
