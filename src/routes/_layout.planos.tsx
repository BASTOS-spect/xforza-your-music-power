import { createFileRoute, Link } from "@tanstack/react-router";
import { Check } from "lucide-react";

export const Route = createFileRoute("/_layout/planos")({
  head: () => ({
    meta: [
      { title: "Planos XFORZA — Livre, Premium e Ultra" },
      { name: "description", content: "Escolha sua experiência XFORZA: Livre, Premium R$ 14,90 ou Ultra R$ 24,90 por mês." },
    ],
  }),
  component: Plans,
});

type Plan = {
  id: string;
  name: string;
  price: string;
  period: string;
  highlight?: boolean;
  badge?: string;
  features: string[];
};

const plans: Plan[] = [
  {
    id: "free",
    name: "Livre",
    price: "R$ 0",
    period: "Grátis",
    features: ["Reprodução limitada", "Com anúncios", "Qualidade padrão"],
  },
  {
    id: "premium",
    name: "Premium",
    price: "R$ 14,90",
    period: "/mês",
    highlight: true,
    badge: "Mais populares",
    features: [
      "Sem anúncios",
      "Favoritos ilimitados",
      "Qualidade de áudio superior",
      "Modo offline (em breve)",
    ],
  },
  {
    id: "ultra",
    name: "Ultra",
    price: "R$ 24,90",
    period: "/mês",
    features: [
      "Todos os produtos Premium",
      "Downloads offline",
      "Listas de reprodução exclusivas da FORZA",
      "Qualidade Hi-Fi",
    ],
  },
];

function Plans() {
  return (
    <div className="relative overflow-hidden px-4 py-16 sm:px-8 sm:py-20 lg:px-12">
      <div className="pointer-events-none absolute inset-0 bg-gradient-radial opacity-60" />

      <div className="relative mx-auto max-w-6xl">
        <div className="mx-auto max-w-3xl text-center animate-fade-up">
          <h1 className="font-display text-4xl font-black tracking-tight text-foreground sm:text-5xl lg:text-6xl">
            Escolha a sua <span className="text-gradient-primary">experiência</span>
          </h1>
          <p className="mt-4 text-muted-foreground">
            Sem compromisso, cancele quando quiser.
          </p>
        </div>

        <div className="mt-14 grid gap-6 lg:grid-cols-3">
          {plans.map((plan, i) => (
            <div
              key={plan.id}
              className={`group relative flex flex-col rounded-3xl border p-8 transition-all duration-500 animate-fade-up ${
                plan.highlight
                  ? "border-primary bg-surface shadow-glow lg:-translate-y-2"
                  : "border-border bg-surface hover:border-primary/30 hover:-translate-y-1"
              }`}
              style={{ animationDelay: `${i * 100}ms` }}
            >
              {plan.badge && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-primary px-4 py-1 font-accent text-[10px] font-extrabold uppercase tracking-widest text-primary-foreground shadow-glow">
                  {plan.badge}
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
                className={`mt-8 w-full rounded-full px-6 py-3.5 font-accent text-sm font-extrabold tracking-wider transition-all hover:scale-[1.02] active:scale-95 ${
                  plan.highlight || plan.id === "ultra"
                    ? "bg-primary text-primary-foreground shadow-glow hover:bg-primary-dark"
                    : "bg-surface-elevated text-foreground hover:bg-surface-elevated/70"
                }`}
              >
                Assinar
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
