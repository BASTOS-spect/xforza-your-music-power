import { createFileRoute, Link } from "@tanstack/react-router";
import { Check, Crown, Zap, Music } from "lucide-react";

export const Route = createFileRoute("/_layout/planos")({
  head: () => ({
    meta: [
      { title: "Planos XFORZA — Premium, Ultra e Free" },
      { name: "description", content: "Escolha seu plano XFORZA: Free com anúncios, Premium sem anúncios e Ultra com downloads e playlists exclusivas." },
    ],
  }),
  component: Plans,
});

type Plan = {
  id: string;
  name: string;
  price: string;
  period?: string;
  icon: any;
  highlight?: boolean;
  badge?: string;
  features: string[];
  cta: string;
};

const plans: Plan[] = [
  {
    id: "free",
    name: "Free",
    price: "R$ 0",
    icon: Music,
    features: ["Reprodução limitada", "Com anúncios", "Qualidade padrão", "Playlists públicas"],
    cta: "Começar grátis",
  },
  {
    id: "premium",
    name: "Premium",
    price: "R$ 14,90",
    period: "/mês",
    icon: Zap,
    highlight: true,
    badge: "Mais popular",
    features: [
      "Sem anúncios",
      "Favoritos ilimitados",
      "Melhor qualidade de áudio",
      "Pular faixas à vontade",
    ],
    cta: "Assinar Premium",
  },
  {
    id: "ultra",
    name: "Ultra",
    price: "R$ 24,90",
    period: "/mês",
    icon: Crown,
    features: [
      "Tudo do Premium",
      "Download offline",
      "Playlists exclusivas",
      "Áudio em alta resolução",
      "Acesso antecipado",
    ],
    cta: "Assinar Ultra",
  },
];

function Plans() {
  return (
    <div className="relative overflow-hidden px-4 py-16 sm:px-8 sm:py-20 lg:px-12">
      <div className="pointer-events-none absolute inset-0 bg-gradient-radial opacity-60" />

      <div className="relative mx-auto max-w-6xl">
        <div className="mx-auto max-w-2xl text-center animate-fade-up">
          <span className="inline-flex items-center gap-2 rounded-full border border-primary/40 bg-primary/10 px-3 py-1 font-accent text-xs font-bold uppercase tracking-widest text-primary">
            <Crown className="h-3.5 w-3.5" />
            Planos XFORZA
          </span>
          <h1 className="mt-5 font-display text-4xl font-black tracking-tight text-foreground sm:text-5xl lg:text-6xl">
            Escolha o som que <span className="text-gradient-primary">move você.</span>
          </h1>
          <p className="mt-4 text-muted-foreground">
            Comece grátis ou desbloqueie a experiência premium. Cancele quando quiser.
          </p>
        </div>

        <div className="mt-14 grid gap-6 lg:grid-cols-3">
          {plans.map((plan, i) => (
            <div
              key={plan.id}
              className={`group relative flex flex-col rounded-3xl border p-7 transition-all duration-500 animate-fade-up ${
                plan.highlight
                  ? "border-primary/50 bg-gradient-card shadow-glow lg:-translate-y-4 lg:scale-[1.03]"
                  : "border-border bg-surface hover:border-primary/30 hover:-translate-y-1"
              }`}
              style={{ animationDelay: `${i * 100}ms` }}
            >
              {plan.badge && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-gradient-primary px-4 py-1 font-accent text-[10px] font-extrabold uppercase tracking-widest text-primary-foreground shadow-glow">
                  {plan.badge}
                </div>
              )}

              <div className="mb-5 flex items-center justify-between">
                <div
                  className={`flex h-12 w-12 items-center justify-center rounded-xl ${
                    plan.highlight ? "bg-gradient-primary shadow-glow" : "bg-surface-elevated"
                  }`}
                >
                  <plan.icon className={`h-6 w-6 ${plan.highlight ? "text-primary-foreground" : "text-primary"}`} />
                </div>
                <span className="font-display text-2xl font-extrabold text-foreground">{plan.name}</span>
              </div>

              <div className="mb-6">
                <div className="flex items-baseline gap-1">
                  <span className="font-display text-5xl font-black text-foreground">{plan.price}</span>
                  {plan.period && <span className="text-sm text-muted-foreground">{plan.period}</span>}
                </div>
              </div>

              <ul className="mb-8 flex flex-1 flex-col gap-3">
                {plan.features.map((f) => (
                  <li key={f} className="flex items-start gap-3 text-sm">
                    <span
                      className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full ${
                        plan.highlight ? "bg-gradient-primary" : "bg-primary/15"
                      }`}
                    >
                      <Check className={`h-3 w-3 ${plan.highlight ? "text-primary-foreground" : "text-primary"}`} strokeWidth={3} />
                    </span>
                    <span className="text-foreground/90">{f}</span>
                  </li>
                ))}
              </ul>

              <button
                className={`w-full rounded-full px-6 py-3.5 font-accent text-sm font-extrabold uppercase tracking-wider transition-all hover:scale-[1.02] active:scale-95 ${
                  plan.highlight
                    ? "bg-gradient-primary text-primary-foreground shadow-glow"
                    : "border border-border bg-surface-elevated text-foreground hover:border-primary/40"
                }`}
              >
                {plan.cta}
              </button>
            </div>
          ))}
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
