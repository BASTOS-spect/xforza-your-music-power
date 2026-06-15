import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Loader2, Camera, Save, Crown, Mail, Calendar } from "lucide-react";

export const Route = createFileRoute("/_layout/perfil")({
  head: () => ({ meta: [{ title: "Meu perfil — XFORZA" }] }),
  component: ProfilePage,
});

const PLAN_LABEL: Record<string, string> = { livre: "Livre", premium: "Premium", ultra: "Ultra" };

function ProfilePage() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [email, setEmail] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [bio, setBio] = useState("");
  const [avatarUrl, setAvatarUrl] = useState("");
  const [plan, setPlan] = useState<string>("livre");
  const [periodEnd, setPeriodEnd] = useState<string | null>(null);
  const [createdAt, setCreatedAt] = useState<string>("");

  useEffect(() => {
    (async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { navigate({ to: "/auth" }); return; }
      setEmail(user.email ?? "");
      setCreatedAt(user.created_at);

      const [{ data: profile }, { data: sub }] = await Promise.all([
        supabase.from("profiles").select("*").eq("id", user.id).maybeSingle(),
        supabase.from("subscriptions").select("*").eq("user_id", user.id).maybeSingle(),
      ]);
      if (profile) {
        setDisplayName(profile.display_name ?? "");
        setBio(profile.bio ?? "");
        setAvatarUrl(profile.avatar_url ?? "");
      }
      if (sub) {
        setPlan(sub.plan);
        setPeriodEnd(sub.current_period_end);
      }
      setLoading(false);
    })();
  }, [navigate]);

  const save = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;
    const { error } = await supabase.from("profiles").upsert({
      id: user.id,
      display_name: displayName,
      bio,
      avatar_url: avatarUrl,
    });
    setSaving(false);
    if (error) toast.error(error.message);
    else toast.success("Perfil atualizado!");
  };

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  const initial = (displayName || email || "U").charAt(0).toUpperCase();

  return (
    <div className="mx-auto max-w-3xl px-4 py-10 sm:px-8 sm:py-14">
      <div className="mb-8 animate-fade-up">
        <h1 className="font-display text-4xl font-black tracking-tight text-foreground sm:text-5xl">
          Meu <span className="text-gradient-primary">perfil</span>
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">Personalize a sua experiência XFORZA.</p>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1fr_280px]">
        {/* Form */}
        <form onSubmit={save} className="rounded-2xl border border-border bg-surface/60 p-6 backdrop-blur-xl sm:p-8">
          <div className="flex items-center gap-5">
            <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-full bg-gradient-primary shadow-glow">
              {avatarUrl ? (
                <img src={avatarUrl} alt="" className="h-full w-full object-cover" />
              ) : (
                <div className="flex h-full w-full items-center justify-center font-display text-3xl font-black text-primary-foreground">
                  {initial}
                </div>
              )}
            </div>
            <div className="flex-1">
              <label className="mb-1 block text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                <Camera className="mr-1 inline h-3 w-3" /> URL do avatar
              </label>
              <input
                type="url"
                placeholder="https://..."
                value={avatarUrl}
                onChange={(e) => setAvatarUrl(e.target.value)}
                className="w-full rounded-xl border border-border bg-background px-3 py-2 text-sm text-foreground outline-none transition-all placeholder:text-muted-foreground focus:border-primary"
              />
            </div>
          </div>

          <div className="mt-6 space-y-4">
            <div>
              <label className="mb-1 block text-xs font-semibold uppercase tracking-wider text-muted-foreground">Nome</label>
              <input
                type="text"
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                className="w-full rounded-xl border border-border bg-background px-4 py-3 text-sm text-foreground outline-none transition-all focus:border-primary"
              />
            </div>
            <div>
              <label className="mb-1 block text-xs font-semibold uppercase tracking-wider text-muted-foreground">Bio</label>
              <textarea
                rows={4}
                placeholder="Conte um pouco sobre o seu som..."
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                className="w-full resize-none rounded-xl border border-border bg-background px-4 py-3 text-sm text-foreground outline-none transition-all placeholder:text-muted-foreground focus:border-primary"
              />
            </div>
            <div>
              <label className="mb-1 block text-xs font-semibold uppercase tracking-wider text-muted-foreground">Email</label>
              <input
                type="email"
                value={email}
                disabled
                className="w-full cursor-not-allowed rounded-xl border border-border bg-background/50 px-4 py-3 text-sm text-muted-foreground outline-none"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={saving}
            className="mt-6 flex items-center justify-center gap-2 rounded-full bg-gradient-primary px-6 py-3 text-sm font-bold text-primary-foreground shadow-glow transition-transform hover:scale-[1.02] disabled:opacity-60"
          >
            {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
            Salvar alterações
          </button>
        </form>

        {/* Side info */}
        <aside className="space-y-4">
          <div className="rounded-2xl border border-primary/40 bg-gradient-to-br from-primary/10 to-transparent p-5">
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              <Crown className="h-3.5 w-3.5 text-primary" /> Plano atual
            </div>
            <p className="mt-2 font-display text-3xl font-black text-foreground">{PLAN_LABEL[plan] ?? plan}</p>
            {periodEnd && (
              <p className="mt-1 text-xs text-muted-foreground">
                Renova em {new Date(periodEnd).toLocaleDateString("pt-BR")}
              </p>
            )}
            <a
              href="/planos"
              className="mt-4 inline-flex w-full items-center justify-center rounded-full bg-primary px-4 py-2 text-xs font-bold text-primary-foreground transition-transform hover:scale-[1.02]"
            >
              {plan === "livre" ? "Fazer upgrade" : "Trocar plano"}
            </a>
          </div>

          <div className="rounded-2xl border border-border bg-surface/60 p-5 backdrop-blur-xl">
            <div className="flex items-center gap-2 text-xs"><Mail className="h-3 w-3 text-muted-foreground" /><span className="truncate text-foreground">{email}</span></div>
            <div className="mt-2 flex items-center gap-2 text-xs">
              <Calendar className="h-3 w-3 text-muted-foreground" />
              <span className="text-muted-foreground">Membro desde {new Date(createdAt).toLocaleDateString("pt-BR")}</span>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
