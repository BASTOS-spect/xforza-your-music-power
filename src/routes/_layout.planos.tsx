import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { Check, Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export const Route = createFileRoute("/_layout/planos")({
  head: () => ({
    meta: [
      { title: "Planos XFORZA — Livre, Premium e Ultra" },
      { name: "description", content: "Escolha sua experiência XFORZA: Livre, Premium R$ 14,90 ou Ultra R$ 24,90 por mês." },
    ],
  }),
  component: Plans,
});

type PlanId = "livre" | "premium" | "ultra";

type Plan = {
  id: PlanId;
  name: string;
  price: string;
  period: string;
  highlight?: boolean;
  badge?: string;
  features: string[];
};

const plans: Plan[] = [
  { id: "livre", name: "Livre", price: "R$ 0", period: "Grátis",
    features: ["Reprodução com anúncios", "Catálogo completo", "Qualidade padrão"] },
  { id: "premium", name: "Premium", price: "R$ 14,90", period: "/mês", highlight: true, badge: "Mais populares",
    features: ["Sem anúncios", "Favoritos ilimitados", "Qualidade de áudio superior", "Pular músicas à vontade"] },
  { id: "ultra", name: "Ultra", price: "R$ 24,90", period: "/mês",
    features: ["Tudo do Premium", "Downloads offline", "Playlists exclusivas FORZA", "Qualidade Hi-Fi"] },
];

function Plans() {
  const navigate = useNavigate();
  const [currentPlan, setCurrentPlan] = useState<PlanId | null>(null);
  const [loadingId, setLoadingId] = useState<PlanId | null>(null);
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;
      setUserId(user.id);
      const { data } = await supabase.from("subscriptions").select("plan").eq("user_id", user.id).maybeSingle();
      if (data) setCurrentPlan(data.plan as PlanId);
    })();
  }, []);

  const subscribe = async (planId: PlanId) => {
    if (!userId) { navigate({ to: "/auth" }); return; }
    setLoadingId(planId);
    const periodEnd = planId === "livre" ? null : new Date(Date.now() + 30 * 24 * 3600 * 1000).toISOString();
    const { error } = await supabase.from("subscriptions").upsert({
      user_id: userId,
      plan: planId,
      current_period_end: periodEnd,
    });
    setLoadingId(null);
    if (error) { toast.error(error.message); return; }
    setCurrentPlan(planId);
    toast.success(planId === "livre" ? "Você está no plano Livre" : `Plano ${planId === "premium" ? "Premium" : "Ultra"} ativado!`);
    setTimeout(() => navigate({ to: "/perfil" }), 600);
  };

  return (
    <div className="relative overflow-hidden px-4 py-16 sm:px-8 sm:py-20 lg:px-12">
      <div className="pointer-events-none absolute inset-0 bg-gradient-radial opacity-60" />

      <div className="relative mx-auto max-w-6xl">
        <div className="mx-auto max-w-3xl text-center animate-fade-up">
          <h1 className="font-display text-4xl font-black tracking-tight text-foreground sm:text-5xl lg:text-6xl">
            Escolha a sua <span className="text-gradient-primary">experiência</span>
          </h1>
          <p className="mt-4 text-muted-foreground">Sem compromisso, troque ou cancele quando quiser.</p>
        </div>

        <div className="mt-14 grid gap-6 lg:grid-cols-3">
          {plans.map((plan, i) => {
            const isCurrent = currentPlan === plan.id;
            const loading = loadingId === plan.id;
            return (
              <div
                key={plan.id}
                className={`group relative flex flex-col rounded-3xl border p-8 transition-all duration-500 animate-fade-up ${
                  plan.highlight ? "border-primary bg-surface shadow-glow lg:-translate-y-2" : "border-border bg-surface hover:border-primary/30 hover:-translate-y-1"
                } ${isCurrent ? "ring-2 ring-primary" : ""}`}
                style={{ animationDelay: `${i * 100}ms` }}
              >
                {plan.badge && !isCurrent && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-primary px-4 py-1 font-accent text-[10px] font-extrabold uppercase tracking-widest text-primary-foreground shadow-glow">
                    {plan.badge}
                  </div>
                )}
                {isCurrent && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-foreground px-4 py-1 font-accent text-[10px] font-extrabold uppercase tracking-widest text-background">
                    Plano atual
                  </div>
                )}

                <h2 className="text-center font-display text-3xl font-extrabold text-foreground">{plan.name}</h2>
                <div className="mt-6 flex items-baseline justify-center gap-1.5">
                  <span className="font-display text-5xl font-black text-foreground">{plan.price}</span>
                  <span className="text-sm text-muted-foreground">{plan.period}</span>
                </div>

                <ul className="mt-8 flex flex-1 flex-col gap-3">
                  {plan.features.map((f) => (
                    <li key={f} className="flex items-start gap-3 text-sm">
                      <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-primary">
                        <Check className="h-3 w-3 text-primary-foreground" strokeWidth={3} />
                      </span>
                      <span className="text-foreground/90">{f}</span>
                    </li>
                  ))}
                </ul>

                <button
                  onClick={() => subscribe(plan.id)}
                  disabled={loading || isCurrent}
                  className={`mt-8 flex w-full items-center justify-center gap-2 rounded-full px-6 py-3.5 font-accent text-sm font-extrabold tracking-wider transition-all hover:scale-[1.02] active:scale-95 disabled:cursor-not-allowed disabled:opacity-70 disabled:hover:scale-100 ${
                    plan.highlight || plan.id === "ultra"
                      ? "bg-primary text-primary-foreground shadow-glow"
                      : "bg-surface-elevated text-foreground"
                  }`}
                >
                  {loading && <Loader2 className="h-4 w-4 animate-spin" />}
                  {isCurrent ? "Seu plano" : plan.id === "livre" ? "Continuar grátis" : "Assinar"}
                </button>
              </div>
            );
          })}
        </div>

        <div className="mt-12 text-center animate-fade-up" style={{ animationDelay: "400ms" }}>
          <Link to="/" className="text-sm text-muted-foreground transition-colors hover:text-primary">
            ← Voltar para a home
          </Link>
        </div>
      </div>
    </div>
  );
}
